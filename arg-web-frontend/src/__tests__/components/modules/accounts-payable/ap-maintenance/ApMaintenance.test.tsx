import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@/__tests__/utils/test-utils';
import type { CompanyMaintenanceData, GlMasterValidationResult } from '@/types/accounts-payable.types';

// --- Mocks ------------------------------------------------------------------

// Mock react-router-dom navigation
const navigateMock = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<any>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

// Mock lightweight UI widgets
vi.mock('@widget-library/Dropdown', () => {
  const React = require('react');
  return {
    CustomSelectDropdown: ({ name, value, onChange, options = [], ...rest }: any) =>
      React.createElement(
        'select',
        {
          'data-name': name,
          value: value ?? '',
          onChange: (e: any) => onChange && onChange(e.target.value),
          ...rest,
        },
        options.map((opt: any, idx: number) =>
          React.createElement('option', { key: idx, value: opt.value }, opt.label),
        ),
      ),
  };
});

vi.mock('@widget-library/Input', () => {
  const React = require('react');
  return {
    CustomPrefixInput: ({ name, value, onChange, placeholder, ...rest }: any) =>
      React.createElement('input', {
        'data-name': name,
        value: value ?? '',
        onChange,
        placeholder,
        ...rest,
      }),
  };
});

vi.mock('@widget-library/Buttons', () => {
  const React = require('react');
  const Btn = ({ onClick, label, name, children, ...rest }: any) =>
    React.createElement(
      'button',
      { type: 'button', onClick, 'data-name': name, ...rest },
      children || label || name || 'Button',
    );
  return {
    DefaultButton: Btn,
    CustomStyledButton: Btn,
  };
});

// Partially mock antd to keep ConfigProvider and other exports working
vi.mock('antd', async () => {
  const actual = await vi.importActual<typeof import('antd')>('antd');
  const React = require('react');
  return {
    ...actual,
    Divider: (props: any) => React.createElement('hr', { ...props }),
  };
});

vi.mock('@widget-library/Toaster', () => {
  const React = require('react');
  return {
    default: ({ type, title, subtitle }: any) =>
      React.createElement(
        'div',
        { 'data-testid': 'toaster', className: `toaster ${type}`.trim() },
        React.createElement('div', null, title),
        React.createElement('div', null, subtitle),
      ),
  };
});

// Mock useApMaintenance hook
const fetchCompanyMaintenanceMock = vi.fn<() => Promise<CompanyMaintenanceData | null>>();
const updateCompanyMaintenanceMock = vi.fn<(data: CompanyMaintenanceData) => Promise<CompanyMaintenanceData>>();
const validateBankGlNoMock = vi.fn<
  (glNo: string, companyNumber: string) => Promise<GlMasterValidationResult>
>();

vi.mock('@/hooks/useApMaintenance', () => ({
  useApMaintenance: () => ({
    fetchCompanyMaintenance: fetchCompanyMaintenanceMock,
    updateCompanyMaintenance: updateCompanyMaintenanceMock,
    validateBankGlNo: validateBankGlNoMock,
    isLoading: false,
    isSaving: false,
  }),
}));

// SUT
import AP_Maintenance from '@/modules/accounts-payable/ap-maintenance/ApMaintenance';

// --- Helpers ----------------------------------------------------------------

const makeCompanyData = (overrides: Partial<CompanyMaintenanceData> = {}): CompanyMaintenanceData => ({
  companyNo: 10,
  companyName: 'Test Company',
  companyApGlNo: 11111111,
  companyBankGlNo: 22222222,
  companyDiscountsGlNo: 33333333,
  companyIntercoGlNo: 44444444,
  companyNextPjJrnlNo: 12,
  companyNextCdJrnlNo: 34,
  companyNextCheckNo: 123456,
  companyNextEntryNo: 12345,
  companyNextVoucherNo: 54321,
  companyPreEdChks: 'Y',
  companyJobCostAct: 'N',
  companyRetentionGlNo: 55555555,
  companyPoActive: 'Y',
  companyEmployeeExpenseGlNo: 66666666,
  companyNextEeJrnlNo: 77,
  companyFiller: 'FILLER',
  ...overrides,
});

describe('AP_Maintenance', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state then populated form after data load', async () => {
    const data = makeCompanyData();
    fetchCompanyMaintenanceMock.mockResolvedValueOnce(data);
    validateBankGlNoMock.mockResolvedValueOnce({
      success: true,
      message: 'Valid',
      description: 'ok',
    });

    render(<AP_Maintenance />);

    // Initial loading view
    expect(
      screen.getByText('Loading company maintenance data...'),
    ).toBeInTheDocument();

    // After load, heading and a few fields should be visible and populated
    expect(await screen.findByText('Control File Maintenance')).toBeInTheDocument();
    expect(
      await screen.findByPlaceholderText('Enter Company Name'),
    ).toHaveValue('Test Company');
    expect(
      await screen.findByPlaceholderText('Enter AP GL No'),
    ).toHaveValue(String(data.companyApGlNo));

    expect(fetchCompanyMaintenanceMock).toHaveBeenCalledWith(10);
  });

  it('navigates back to accounts-payable when Cancel is clicked', async () => {
    fetchCompanyMaintenanceMock.mockResolvedValueOnce(makeCompanyData());
    validateBankGlNoMock.mockResolvedValue({
      success: true,
      message: 'Valid',
      description: 'ok',
    });

    render(<AP_Maintenance />);

    await screen.findByText('Control File Maintenance');

    const cancelBtn = screen.getByRole('button', { name: /Cancel/i });
    await userEvent.click(cancelBtn);

    expect(navigateMock).toHaveBeenCalledWith('/accounts-payable');
  });

  it('shows numeric validation error when non-numeric AP GL No is entered', async () => {
    fetchCompanyMaintenanceMock.mockResolvedValueOnce(makeCompanyData());
    validateBankGlNoMock.mockResolvedValue({
      success: true,
      message: 'Valid',
      description: 'ok',
    });

    render(<AP_Maintenance />);
    await screen.findByText('Control File Maintenance');

    const apGlInput = screen.getByPlaceholderText('Enter AP GL No');
    await userEvent.clear(apGlInput);
    await userEvent.type(apGlInput, 'ABC');

    expect(
      await screen.findByText(
        /Alphabets are not allowed\. Only numbers are permitted\./i,
      ),
    ).toBeInTheDocument();
  });

  it('prevents save and shows validation toaster when required fields are empty', async () => {
    // No data returned -> keep defaults (mostly empty)
    fetchCompanyMaintenanceMock.mockResolvedValueOnce(null as any);

    render(<AP_Maintenance />);
    await screen.findByText('Control File Maintenance');

    const saveBtn = screen.getByRole('button', { name: /Save/i });
    await userEvent.click(saveBtn);

    // Toaster with validation error should appear
    const toaster = await screen.findByTestId('toaster');
    expect(toaster).toHaveClass('toaster error');
    expect(toaster).toHaveTextContent('Validation Error');
    expect(toaster).toHaveTextContent('Please fix the highlighted fields');

    // Update API must not be called
    expect(updateCompanyMaintenanceMock).not.toHaveBeenCalled();
  });

  it('calls updateCompanyMaintenance with correct payload on successful save', async () => {
    const data = makeCompanyData();
    fetchCompanyMaintenanceMock.mockResolvedValueOnce(data);
    updateCompanyMaintenanceMock.mockResolvedValueOnce(data);
    validateBankGlNoMock.mockResolvedValue({
      success: true,
      message: 'Valid',
      description: 'ok',
    });

    render(<AP_Maintenance />);
    await screen.findByText('Control File Maintenance');

    const saveBtn = screen.getByRole('button', { name: /Save/i });
    await userEvent.click(saveBtn);

    await waitFor(() => {
      expect(updateCompanyMaintenanceMock).toHaveBeenCalledTimes(1);
    });

    const payload = updateCompanyMaintenanceMock.mock.calls[0][0];

    expect(payload).toEqual({
      ...data,
      companyPreEdChks: data.companyPreEdChks,
      companyJobCostAct: data.companyJobCostAct,
      companyPoActive: data.companyPoActive,
    });
  });

  it('validates Bank GL No via hook and shows toaster on invalid result', async () => {
    const data = makeCompanyData({ companyBankGlNo: 0 });
    fetchCompanyMaintenanceMock.mockResolvedValueOnce(data);
    validateBankGlNoMock.mockResolvedValue({
      success: false,
      message: 'Bank GL No not found',
      description: 'The specified Bank GL No does not exist.',
    });

    render(<AP_Maintenance />);
    await screen.findByText('Control File Maintenance');

    const bankGlInput = screen.getByPlaceholderText('Enter Bank GL No');
    await userEvent.clear(bankGlInput);
    await userEvent.type(bankGlInput, '12345678');

    await waitFor(() => {
      expect(validateBankGlNoMock).toHaveBeenCalledWith('12345678', '10');
    });

    const toaster = await screen.findByTestId('toaster');
    expect(toaster).toHaveClass('toaster error');
    expect(toaster.textContent || '').toMatch(/Invalid Bank GL No/i);
  });
});


