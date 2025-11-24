import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock ReportsTable to call fetchDataFn on mount
const fetchDataCallSpy = vi.fn();
vi.mock('@shared-components/reports-table/ReportsTable', () => ({
  default: ({ fetchDataFn }: any) => {
    const React = require('react');
    React.useEffect(() => { fetchDataCallSpy(); fetchDataFn?.(); }, [fetchDataFn]);
    return React.createElement('div', { 'data-testid': 'reports-table' }, 'Reports Table');
  },
}));

const fetchApCheckReportsSpy = vi.fn();
vi.mock('@hooks/usePaymentCycle', () => ({
  usePaymentCycle: () => ({ fetchApCheckReports: fetchApCheckReportsSpy }),
}));

import APCheck from '@/modules/accounts-payable/payment-cycle/payment-stepper/payment-forms/APCheck';

describe('APCheck (lightweight)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchApCheckReportsSpy.mockResolvedValue([]);
  });

  it('requests AP check data with voucher type', () => {
    render(<APCheck voucherType="Check" />);
    expect(fetchDataCallSpy).toHaveBeenCalled();
    expect(fetchApCheckReportsSpy).toHaveBeenCalledWith({
      voucherToPay: 'Check',
      reportType: 'Payment_Cycle_Check_Cash_Print_Checks_Print',
    });
    expect(screen.getByTestId('reports-table')).toBeInTheDocument();
  });
});


