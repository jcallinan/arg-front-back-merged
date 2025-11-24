import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';

const printChecksSpy = vi.fn();
const fetchReportDetailsSpy = vi.fn();
vi.mock('@hooks/useReportNames', () => ({
  useReportNames: () => ({ reportNames: ['Payment_Cycle_Check_Cash_Print_Checks_Print'], loading: false }),
}));
vi.mock('@hooks/useReportDetails', () => ({
  useReportDetails: () => ({ loading: false, fetchReportDetails: fetchReportDetailsSpy }),
}));
vi.mock('@hooks/usePaymentCycle', () => ({
  usePaymentCycle: () => ({ printChecks: printChecksSpy }),
}));

import PrintChecks from '@/modules/accounts-payable/payment-cycle/payment-stepper/payment-forms/PrintChecks';

describe('PrintChecks (lightweight)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    printChecksSpy.mockResolvedValue({});
  });

  it('exposes handlePrint via ref and calls printChecks', async () => {
    const ref = { current: null as any };
    render(<PrintChecks ref={ref} />);
    expect(typeof ref.current?.handlePrint).toBe('function');
    await ref.current.handlePrint();
    expect(printChecksSpy).toHaveBeenCalled();
    expect(fetchReportDetailsSpy).toHaveBeenCalledWith('Payment_Cycle_Check_Cash_Print_Checks_Print', 'in');
  });
});


