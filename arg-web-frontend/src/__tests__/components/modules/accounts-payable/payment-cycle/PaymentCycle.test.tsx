import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

// Lightweight UI stubs
vi.mock('antd', () => {
  const React = require('react');
  return { Divider: (props: any) => React.createElement('hr', { ...props }) };
});
vi.mock('@ant-design/icons', () => {
  const React = require('react');
  const R = () => React.createElement('span', null, 'R');
  return { ReloadOutlined: R };
});
vi.mock('@widget-library/Buttons', () => {
  const React = require('react');
  const Btn = ({ onClick, label, name, disabled }: any) =>
    React.createElement('button', { onClick, name, disabled, 'data-name': name }, typeof label === 'string' ? label : 'Button');
  return { CustomStyledButton: Btn, DefaultButton: Btn };
});
vi.mock('@widget-library/Input', () => ({
  CustomPrefixInput: ({ name, value, onChange, placeholder }: any) => {
    const React = require('react');
    return React.createElement('input', { 'data-name': name, value: value || '', onChange, placeholder });
  },
}));
vi.mock('@widget-library/Modal', () => ({
  default: ({ visible, title, description, actions = [], onCancel }: any) => {
    const React = require('react');
    if (!visible) return null;
    return React.createElement(
      'div',
      { role: 'dialog', 'data-testid': 'modal' },
      typeof title === 'string' ? title : 'Modal',
      description ? React.createElement('div', null, description) : null,
      ...actions.map((a: any, i: number) =>
        React.createElement('button', { key: i, onClick: a?.onClick, 'data-testid': `modal-action-${a?.name}` }, a?.label || 'OK')
      ),
      React.createElement('button', { onClick: onCancel, 'data-testid': 'modal-close' }, 'Close')
    );
  }
}));
vi.mock('@/widget-library/Toaster', () => ({
  default: ({ type = 'success', title, subtitle }: any) => {
    const React = require('react');
    return React.createElement('div', { 'data-testid': 'toaster', className: `toaster ${type}` }, `${title || ''} ${subtitle || ''}`.trim());
  },
}));

// Mock child components to avoid heavy renders
vi.mock('@/modules/accounts-payable/payment-cycle/payment-stepper/PaymentStepper', () => ({
  default: ({ currentStep, stepTitles }: any) => {
    const React = require('react');
    return React.createElement('div', { 'data-testid': 'payment-stepper' }, `Step: ${stepTitles?.[currentStep] || ''}`);
  },
}));
vi.mock('@/modules/accounts-payable/payment-cycle/payment-stepper/payment-forms/CashRequirment', () => ({
  default: ({ voucherType }: any) => {
    const React = require('react');
    return React.createElement('div', { 'data-testid': 'cash-requirement' }, `Cash Requirement ${voucherType || ''}`);
  },
}));
vi.mock('@/modules/accounts-payable/payment-cycle/payment-stepper/payment-forms/APCheck', () => ({
  default: ({ voucherType }: any) => {
    const React = require('react');
    return React.createElement('div', { 'data-testid': 'ap-check' }, `AP Check ${voucherType || ''}`);
  },
}));
vi.mock('@/modules/accounts-payable/payment-cycle/payment-stepper/payment-forms/PrintChecks', () => {
  const React = require('react');
  const { forwardRef, useImperativeHandle, useState } = React;
  const PrintChecks = forwardRef((_: any, ref: any) => {
    const [isPrintLoading, setIsPrintLoading] = useState(false);
    useImperativeHandle(ref, () => ({
      isPrintLoading,
      handlePrint: async () => {
        setIsPrintLoading(true);
        await Promise.resolve();
        setIsPrintLoading(false);
      },
    }));
    return React.createElement('div', { 'data-testid': 'print-checks' }, 'Print Checks');
  });
  return { default: PrintChecks };
});
vi.mock('@/modules/accounts-payable/payment-cycle/payment-stepper/payment-forms/CheckRegister', () => ({
  default: () => {
    const React = require('react');
    return React.createElement('div', { 'data-testid': 'check-register' }, 'Check Register');
  },
}));

// Mock PaymentSelection to immediately set state via callbacks; controlled voucher type
let desiredVoucherType = 'Check';
vi.mock('@/modules/accounts-payable/payment-cycle/payment-stepper/payment-forms/PaymentSelection', () => ({
  default: (props: any) => {
    const React = require('react');
    const { useEffect } = React;
    useEffect(() => {
      props?.onVoucherTypeChange?.(desiredVoucherType);
      props?.onPaymentTypeSubmit?.(true);
      props?.onDateToPayByChange?.('2025-01-02');
    }, []);
    return React.createElement('div', { 'data-testid': 'payment-selection' }, 'Payment Selection');
  },
}));

// Mock hooks used inside Payment_Cycle
const fetchReportDetailsSpy = vi.fn();
vi.mock('@/hooks/useReportDetails', () => ({
  useReportDetails: () => ({
    reportParameters: [
      { fieldKey: 'companyNo', xmlMetadata: '10' },
      { fieldKey: 'voucherToPay', xmlMetadata: 'Check' },
    ],
    loading: false,
    fetchReportDetails: fetchReportDetailsSpy,
  }),
}));

const generateReportSpy = vi.fn();
const generateReportFilesSpy = vi.fn();
vi.mock('@/hooks/usePaymentCycle', () => ({
  usePaymentCycle: () => ({
    generateReport: generateReportSpy,
    generateReportFiles: generateReportFilesSpy,
  }),
}));

const validateAuthCodeSpy = vi.fn();
vi.mock('@/hooks/useAuthCodeValidation', () => ({
  useAuthCodeValidation: () => ({
    validateAuthCode: validateAuthCodeSpy,
    isLoading: false,
    error: null,
  }),
}));

// SUT
import PaymentCycle from '@/modules/accounts-payable/payment-cycle/Payment_Cycle';

const renderWithRouter = (ui: React.ReactElement) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe('Payment Cycle (lightweight)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    generateReportSpy.mockResolvedValue({ data: { items: { message: ['OK'] } } });
    generateReportFilesSpy.mockResolvedValue({ success: true });
    validateAuthCodeSpy.mockResolvedValue(true);
    desiredVoucherType = 'Check';
  });

  it('advances from Payment Selection to Cash Requirement for Check and calls APIs', async () => {
    renderWithRouter(<PaymentCycle />);

    // Initially on Payment Selection
    expect(screen.getByText('Payment Cycle')).toBeInTheDocument();
    await screen.findByTestId('payment-selection');

    // Next should be enabled because PaymentSelection mock set the state
    const nextBtn = screen.getByRole('button', { name: /Next/i });
    await userEvent.click(nextBtn);

    await waitFor(() => {
      expect(generateReportSpy).toHaveBeenCalledWith(
        'Payment_Cycle_Check_Submit',
        expect.arrayContaining([
          expect.objectContaining({ name: 'companyNo', value: '10' }),
          expect.objectContaining({ name: 'voucherToPay', value: 'Check' }),
        ])
      );
      expect(generateReportFilesSpy).toHaveBeenCalledWith({
        companyNo: 10,
        usecase: 'payment-selection',
      });
      // Step title should now be Cash Requirement
      expect(screen.getByText('Cash Requirement')).toBeInTheDocument();
    });
  });

  it('ACH flow finalizes at Cash Requirement and shows success modal', async () => {
    // Set voucher type to ACH for this run
    desiredVoucherType = 'ACH';

    renderWithRouter(<PaymentCycle />);
    await screen.findByTestId('payment-selection');

    // Step 0 -> Next: moves to Cash Requirement
    await userEvent.click(screen.getByRole('button', { name: /Next/i }));
    expect(screen.getByText('Cash Requirement')).toBeInTheDocument();

    // Step 1 -> Finalize
    await userEvent.click(screen.getByRole('button', { name: /Finalize/i }));

    // Should open success modal since only 2 steps for ACH
    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeInTheDocument();
    });
  });
});


