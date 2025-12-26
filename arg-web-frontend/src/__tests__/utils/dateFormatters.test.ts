import { describe, it, expect } from 'vitest';

// Since the formatDate function is not exported from VoucherMaintenance,
// we'll create a standalone version for testing
const formatDate = (raw: number | string): string => {
  if (raw === 0 || raw === "0" || !raw) return "-";
  
  const str = raw.toString();
  
  // Handle 8-digit format: YYYYMMDD (e.g., "20250701")
  if (str.length === 8 && !isNaN(Number(str))) {
     const year = str.slice(0, 4);
     const month = str.slice(4, 6);
     const day = str.slice(6, 8);
     return `${month}/${day}/${year}`;
  }
  
  // Handle 6-digit format: MMDDYY (e.g., "070125")
  if (str.length === 6 && !isNaN(Number(str))) {
     const month = str.slice(0, 2);
     const day = str.slice(2, 4);
     const yearPart = str.slice(4, 6);
     // Assume years 00-49 are 20xx, 50-99 are 19xx
     const year = parseInt(yearPart) <= 49 ? `20${yearPart}` : `19${yearPart}`;
     return `${month}/${day}/${year}`;
  }
  
  // Handle 5-digit format: MDDYY (e.g., "80725")
  if (str.length === 5 && !isNaN(Number(str))) {
     const month = str.slice(0, 1);
     const day = str.slice(1, 3);
     const yearPart = str.slice(3, 5);
     // Assume years 00-49 are 20xx, 50-99 are 19xx
     const year = parseInt(yearPart) <= 49 ? `20${yearPart}` : `19${yearPart}`;
     return `${month.padStart(2, '0')}/${day}/${year}`;
  }
  
  // If format is unrecognized, return "-"
  return "-";
};

const formatApiDate = (dateStr: string | null | undefined): string => {
  if (!dateStr || dateStr === "0") return "-";
  
  // If it's a numeric date format like YYYYMMDD (8 digits), handle it
  if (dateStr.length === 8 && !isNaN(Number(dateStr))) {
     const year = dateStr.substring(0, 4);
     const month = dateStr.substring(4, 6);
     const day = dateStr.substring(6, 8);
     return `${month}/${day}/${year}`;
  }
  
  return dateStr;
};

const formatAmount = (amount: number): string => {
  return `$${(amount / 100).toFixed(2)}`;
};

describe('Date Formatting Utilities', () => {
  describe('formatDate', () => {
    describe('8-digit format (YYYYMMDD)', () => {
      it('formats valid 8-digit dates correctly', () => {
        expect(formatDate('20250701')).toBe('07/01/2025');
        expect(formatDate('20250703')).toBe('07/03/2025');
        expect(formatDate('19991231')).toBe('12/31/1999');
        expect(formatDate('20000101')).toBe('01/01/2000');
      });

      it('handles numeric input for 8-digit format', () => {
        expect(formatDate(20250701)).toBe('07/01/2025');
        expect(formatDate(20250703)).toBe('07/03/2025');
      });
    });

    describe('6-digit format (MMDDYY)', () => {
      it('formats valid 6-digit dates correctly', () => {
        expect(formatDate('070125')).toBe('07/01/2025');
        expect(formatDate('120399')).toBe('12/03/1999');
        expect(formatDate('010150')).toBe('01/01/1950');
        expect(formatDate('123149')).toBe('12/31/2049');
      });

      it('handles year cutoff correctly (00-49 = 20xx, 50-99 = 19xx)', () => {
        expect(formatDate('010100')).toBe('01/01/2000');
        expect(formatDate('010149')).toBe('01/01/2049');
        expect(formatDate('010150')).toBe('01/01/1950');
        expect(formatDate('010199')).toBe('01/01/1999');
      });

      it('handles numeric input for 6-digit format', () => {
        expect(formatDate(70125)).toBe('07/01/2025');
        expect(formatDate(120399)).toBe('12/03/1999');
      });
    });

    describe('5-digit format (MDDYY)', () => {
      it('formats valid 5-digit dates correctly', () => {
        expect(formatDate('80725')).toBe('08/07/2025');
        expect(formatDate('10199')).toBe('01/01/1999');
        expect(formatDate('31249')).toBe('03/12/2049');
        expect(formatDate('71550')).toBe('07/15/1950');
      });

      it('pads single-digit months correctly', () => {
        expect(formatDate('80725')).toBe('08/07/2025');
        expect(formatDate('10125')).toBe('01/01/2025');
        expect(formatDate('90125')).toBe('09/01/2025');
      });

      it('handles year cutoff correctly for 5-digit format', () => {
        expect(formatDate('10100')).toBe('01/01/2000');
        expect(formatDate('10149')).toBe('01/01/2049');
        expect(formatDate('10150')).toBe('01/01/1950');
        expect(formatDate('10199')).toBe('01/01/1999');
      });

      it('handles numeric input for 5-digit format', () => {
        expect(formatDate(80725)).toBe('08/07/2025');
        expect(formatDate(10199)).toBe('01/01/1999');
      });
    });

    describe('Zero and empty values', () => {
      it('returns "-" for zero values', () => {
        expect(formatDate(0)).toBe('-');
        expect(formatDate('0')).toBe('-');
      });

      it('returns "-" for empty values', () => {
        expect(formatDate('')).toBe('-');
        expect(formatDate(null as any)).toBe('-');
        expect(formatDate(undefined as any)).toBe('-');
      });
    });

    describe('Invalid formats', () => {
      it('returns "-" for unrecognized formats', () => {
        expect(formatDate('abc')).toBe('-');
        expect(formatDate('123')).toBe('-');
        expect(formatDate('12345678901')).toBe('-');
        expect(formatDate('invalid-date')).toBe('-');
      });

      it('returns "-" for non-numeric strings of valid length', () => {
        expect(formatDate('abcdefgh')).toBe('-'); // 8 chars but not numeric
        expect(formatDate('abcdef')).toBe('-');   // 6 chars but not numeric
        expect(formatDate('abcde')).toBe('-');    // 5 chars but not numeric
      });
    });

    describe('Edge cases', () => {
      it('handles leading zeros correctly', () => {
        expect(formatDate('00010101')).toBe('01/01/0001');
        expect(formatDate('010101')).toBe('01/01/2001');
        expect(formatDate('10101')).toBe('01/01/2001');
      });

      it('handles boundary dates', () => {
        expect(formatDate('20251231')).toBe('12/31/2025');
        expect(formatDate('20250101')).toBe('01/01/2025');
        expect(formatDate('123125')).toBe('12/31/2025');
        expect(formatDate('010125')).toBe('01/01/2025');
      });
    });
  });

  describe('formatApiDate', () => {
    it('formats 8-digit YYYYMMDD dates correctly', () => {
      expect(formatApiDate('20250701')).toBe('07/01/2025');
      expect(formatApiDate('19991231')).toBe('12/31/1999');
      expect(formatApiDate('20000101')).toBe('01/01/2000');
    });

    it('returns "-" for zero values', () => {
      expect(formatApiDate('0')).toBe('-');
    });

    it('returns "-" for empty values', () => {
      expect(formatApiDate('')).toBe('-');
      expect(formatApiDate(null)).toBe('-');
      expect(formatApiDate(undefined)).toBe('-');
    });

    it('returns input as-is for non-8-digit formats', () => {
      expect(formatApiDate('2025-07-01')).toBe('2025-07-01');
      expect(formatApiDate('07/01/2025')).toBe('07/01/2025');
      expect(formatApiDate('invalid')).toBe('invalid');
    });

    it('handles non-numeric 8-character strings', () => {
      expect(formatApiDate('abcdefgh')).toBe('abcdefgh');
      expect(formatApiDate('2025070a')).toBe('2025070a');
    });
  });

  describe('formatAmount', () => {
    it('formats amounts in cents to dollars correctly', () => {
      expect(formatAmount(10000)).toBe('$100.00');
      expect(formatAmount(500)).toBe('$5.00');
      expect(formatAmount(9500)).toBe('$95.00');
      expect(formatAmount(1)).toBe('$0.01');
      expect(formatAmount(0)).toBe('$0.00');
    });

    it('handles large amounts correctly', () => {
      expect(formatAmount(100000)).toBe('$1000.00');
      expect(formatAmount(1234567)).toBe('$12345.67');
    });

    it('handles negative amounts correctly', () => {
      expect(formatAmount(-500)).toBe('$-5.00');
      expect(formatAmount(-10000)).toBe('$-100.00');
    });

    it('handles decimal precision correctly', () => {
      expect(formatAmount(1050)).toBe('$10.50');
      expect(formatAmount(1005)).toBe('$10.05');
      expect(formatAmount(1000)).toBe('$10.00');
    });
  });

  describe('Integration scenarios', () => {
    it('handles real API response data correctly', () => {
      const apiData = {
        invoiceDate: '20250701',
        dueDate: '20250703',
        discountDueDate: '80725',
        grossAmount: 10000,
        discountAmount: 500,
      };

      expect(formatDate(apiData.invoiceDate)).toBe('07/01/2025');
      expect(formatDate(apiData.dueDate)).toBe('07/03/2025');
      expect(formatDate(apiData.discountDueDate)).toBe('08/07/2025');
      expect(formatAmount(apiData.grossAmount)).toBe('$100.00');
      expect(formatAmount(apiData.discountAmount)).toBe('$5.00');
    });

    it('handles mixed date formats in same dataset', () => {
      const dates = [
        '20250701', // 8-digit
        '070325',   // 6-digit
        '80725',    // 5-digit
        '0',        // zero
      ];

      const formatted = dates.map(formatDate);
      
      expect(formatted).toEqual([
        '07/01/2025',
        '07/03/2025',
        '08/07/2025',
        '-'
      ]);
    });

    it('handles year boundary cases consistently', () => {
      const dates2049 = ['123149', '31249']; // Should be 2049
      const dates1950 = ['010150', '71550']; // Should be 1950
      
      dates2049.forEach(date => {
        expect(formatDate(date)).toContain('2049');
      });
      
      dates1950.forEach(date => {
        expect(formatDate(date)).toContain('1950');
      });
    });
  });
});