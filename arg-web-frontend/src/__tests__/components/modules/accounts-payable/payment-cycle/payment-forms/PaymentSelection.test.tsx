import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Lightweight UI mocks
vi.mock('antd', () => {
  const React = require('react');
  const Panel = ({ children }: any) => React.createElement('div', { 'data-testid': 'panel' }, children);
  const Collapse = ({ children }: any) => React.createElement('div', { 'data-testid': 'collapse' }, children);
  (Collapse as any).Panel = Panel;
  return {
    Divider: (props: any) => React.createElement('hr', { ...props }),
    Collapse,
    Switch: ({ checked, onChange }: any) => React.createElement('input', { type: 'checkbox', checked, onChange: (e: any) => onChange?.(e.target.checked) }),
    Row: ({ children }: any) => React.createElement('div', null, children),
    Col: ({ children }: any) => React.createElement('div', null, children),
  };
});
vi.mock('@widget-library/DatePicker', () => ({
  default: ({ name, value, onChange }: any) => {
    const React = require('react');
    return React.createElement('input', { 'data-name': name, value: value || '', onChange: (e: any) => onChange?.(name || 'date', e.target.value) });
  },
}));
vi.mock('@widget-library/Dropdown', () => ({
  CustomSelectDropdown: ({ name, value, onChange, options = [] }: any) => {
    const React = require('react');
    return React.createElement('select', {
      'data-name': name, value: value ?? '', onChange: (e: any) => onChange?.(e.target.value)
    }, options.map((o: any, i: number) => React.createElement('option', { key: i, value: o.value }, o.label)));
  },
}));
vi.mock('@widget-library/Input', () => ({
  CustomPrefixInput: ({ name, value, onChange, placeholder }: any) => {
    const React = require('react');
    return React.createElement('input', { 'data-name': name, value: value ?? '', onChange, placeholder });
  },
}));
vi.mock('@widget-library/Buttons', () => {
  const React = require('react');
  const Btn = ({ onClick, label, name, disabled }: any) => React.createElement('button', { onClick, name, disabled }, typeof label === 'string' ? label : 'Button');
  return { CustomStyledButton: Btn, DefaultButton: Btn };
});
vi.mock('@shared-components/company-number/CompanyNo', () => ({
  default: ({ value, onChange }: any) => {
    const React = require('react');
    return React.createElement('input', { 'data-testid': 'company-number', value, onChange: (e: any) => onChange?.(e.target.value) });
  },
}));
vi.mock('@widget-library/Toaster', () => ({
  default: ({ type = 'success', title, subtitle }: any) => {
    const React = require('react');
    return React.createElement('div', { 'data-testid': 'toaster', className: `toaster ${type}` }, `${title || ''} ${subtitle || ''}`.trim());
  },
}));

// Data hooks
vi.mock('@hooks/useDropdownData', () => ({
  useDropdownData: vi.fn((key: string) => ({
    data: key === 'PAY_HOLD_OPTIONS'
      ? [{ label: 'Pay', value: 'P' }, { label: 'Hold', value: 'H' }]
      : key === 'SINGLE_CHECK_FLAG'
      ? [{ label: 'Yes', value: 'S' }, { label: 'No', value: '' }]
      : key === 'MAKE_PREPAID_FLAG'
      ? [{ label: 'Advance', value: 'P' }, { label: 'ACH', value: 'A' }]
      : [],
    isLoading: false,
  })),
}));

// Business hooks
const fetchVoucherPaymentTypesSpy = vi.fn();
const fetchCompanyMaintenanceSpy = vi.fn();
const fetchGlMasterSpy = vi.fn();
const submitPaymentSelectionTypeSpy = vi.fn();
const submitVendorPaymentSpy = vi.fn();
vi.mock('@hooks/usePaymentCycle', () => ({
  usePaymentCycle: () => ({
    fetchVoucherPaymentTypes: fetchVoucherPaymentTypesSpy,
    fetchCompanyMaintenance: fetchCompanyMaintenanceSpy,
    fetchGlMaster: fetchGlMasterSpy,
    submitPaymentSelectionType: submitPaymentSelectionTypeSpy,
    submitVendorPayment: submitVendorPaymentSpy,
  }),
}));

import PaymentSelection from '@/modules/accounts-payable/payment-cycle/payment-stepper/payment-forms/PaymentSelection';

describe('PaymentSelection (lightweight)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchVoucherPaymentTypesSpy.mockResolvedValue([
      { id: '1', label: 'Check', value: 'Check' },
      { id: '2', label: 'ACH', value: 'ACH' },
    ]);
    fetchCompanyMaintenanceSpy.mockResolvedValue({
      companyBankGlNo: 12345678,
      companyNextCheckNo: 1001,
    });
    fetchGlMasterSpy.mockResolvedValue({ success: true, description: 'Bank GL' });
    submitPaymentSelectionTypeSpy.mockResolvedValue({ success: true, message: 'Saved' });
    submitVendorPaymentSpy.mockResolvedValue({ success: true, message: 'Saved' });
  });

  it('submits payment type when required fields are present', async () => {
    // Lifted state emulation
    const makePaymentItem = (overrides: Partial<any> = {}) => ({
      id: 1,
      entrySequence: '00001',
      voucherToPay: 'Check',
      startingCheck: '1001',
      checkDate: '010125',
      dateToPayBy: '010225',
      forcedDiscount1: false,
      bankAccountGL: '12345678',
      bankAccountGLDescription: 'Bank GL',
      forcedDiscount2: false,
      vendorNumber: 'V001',
      voucherNumber: 'VN001',
      partialPayAmount: '0.00',
      overrideDiscountAmount: '0.00',
      payHold: 'P',
      singleCheck: '',
      makePrepaid: '',
      prepaidCheckNo: '',
      checkDateVendor: '',
      isSaved: false,
      isDefault: true,
      ...overrides,
    });
    const paymentFormState = { payments: [makePaymentItem()] };
    const setPaymentFormState = vi.fn();
    const paymentTypeState = {
      companyNo: '10',
      voucherToPay: 'Check',
      startingCheck: '1001',
      checkDate: '010125',
      dateToPayBy: '010225',
      forcedDiscount1: false,
      bankAccountGL: '12345678',
      bankAccountGLDescription: 'Bank GL',
    };
    const setPaymentTypeState = vi.fn();
    const onPaymentTypeSubmit = vi.fn();
    const onVoucherTypeChange = vi.fn();
    const onPaymentSaved = vi.fn();

    render(
      React.createElement(PaymentSelection, {
        onPaymentSaved,
        onVoucherTypeChange,
        onPaymentTypeSubmit,
        isPaymentTypeSubmitted: false,
        onDateToPayByChange: vi.fn(),
        paymentFormState,
        setPaymentFormState,
        paymentTypeState,
        setPaymentTypeState,
        isPaymentFormSubmitted: false,
        setIsPaymentFormSubmitted: vi.fn(),
        isEditMode: false,
        setIsEditMode: vi.fn(),
        generateEntrySequence: (i: number) => (i + 1).toString().padStart(5, '0'),
      })
    );

    // Click Save
    const saveButtons = await screen.findAllByRole('button', { name: /Save/i });
    const mainSave = saveButtons.find((btn: any) => btn.getAttribute('name') === 'submit' && !btn.disabled) || saveButtons[0];
    await userEvent.click(mainSave);

    expect(submitPaymentSelectionTypeSpy).toHaveBeenCalled();
  });
});


