import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock ReportsTable to call fetchDataFn immediately
const fetchDataCallSpy = vi.fn();
vi.mock('@shared-components/reports-table/ReportsTable', () => ({
  default: ({ fetchDataFn }: any) => {
    const React = require('react');
    React.useEffect(() => { fetchDataCallSpy(); fetchDataFn?.(); }, [fetchDataFn]);
    return React.createElement('div', { 'data-testid': 'reports-table' }, 'Reports Table');
  },
}));

const fetchReportDetailsSpy = vi.fn();
vi.mock('@hooks/useReportDetails', () => ({
  useReportDetails: () => ({ fetchReportDetails: fetchReportDetailsSpy }),
}));

const fetchCashRequirementReportsSpy = vi.fn();
vi.mock('@hooks/usePaymentCycle', () => ({
  usePaymentCycle: () => ({ fetchCashRequirementReports: fetchCashRequirementReportsSpy }),
}));

import CashRequirment from '@/modules/accounts-payable/payment-cycle/payment-stepper/payment-forms/CashRequirment';

describe('CashRequirment (lightweight)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchCashRequirementReportsSpy.mockResolvedValue([]);
  });

  it('fetches report details for ACH and triggers table fetch', () => {
    render(<CashRequirment voucherType="ACH" />);
    expect(fetchReportDetailsSpy).toHaveBeenCalledWith('Payment_Cycle_Arch_And_Wire_Finalize', 'in');
    expect(fetchDataCallSpy).toHaveBeenCalled();
    expect(fetchCashRequirementReportsSpy).toHaveBeenCalledWith({
      voucherToPay: 'ACH',
      reportType: 'AP-Cash-Requirements',
    });
    expect(screen.getByTestId('reports-table')).toBeInTheDocument();
  });
});


