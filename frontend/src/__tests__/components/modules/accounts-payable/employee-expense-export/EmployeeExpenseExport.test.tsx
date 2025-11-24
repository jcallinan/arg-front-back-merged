import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

// Keep tests lightweight
vi.mock('antd', () => {
  const React = require('react');
  return { Divider: (props: any) => React.createElement('hr', { ...props }) };
});

vi.mock('@ant-design/icons', () => {
  const React = require('react');
  const R = () => React.createElement('span', null, 'R');
  return { ReloadOutlined: R };
});

// Constants used by the component
vi.mock('@constants/commonConstants', () => ({
  EMPLOYEE_EXPENSES: {
    title: 'Employee Expense',
    subtitle: 'Employee Expense Export',
    genReports: 'Generated Reports',
    postRefresh: 'Refresh',
  },
}));
vi.mock('@/constants/commonConstants', () => ({
  EMPLOYEE_EXPENSES: {
    title: 'Employee Expense',
    subtitle: 'Employee Expense Export',
    genReports: 'Generated Reports',
    postRefresh: 'Refresh',
  },
}));

vi.mock('@shared-components/company-number/CompanyNo', () => ({
  default: ({ value, onChange }: any) => {
    const React = require('react');
    return React.createElement('input', { 'data-testid': 'company-number', value, onChange: (e: any) => onChange && onChange(e.target.value) });
  },
}));

vi.mock('@widget-library/DatePicker', () => ({
  default: ({ value, onChange, ...props }: any) => {
    const React = require('react');
    const handleChange = (e: any) => onChange && onChange('dateToPayBy', e.target.value);
    return React.createElement('input', { type: 'date', value: value || '', onChange: handleChange, placeholder: 'Date to Pay by', ...props });
  },
}));

vi.mock('@widget-library/Buttons', () => {
  const React = require('react');
  const Btn = ({ onClick, label, name, loading }: any) => React.createElement('button', { onClick, disabled: !!loading, 'data-name': name }, typeof label === 'string' ? label : 'Generate Report');
  return { CustomStyledButton: Btn, DefaultButton: Btn };
});

vi.mock('@widget-library/Input', () => ({
  CustomPrefixInput: ({ name, value, onChange, placeholder }: any) => {
    const React = require('react');
    return React.createElement('input', { 'data-name': name, value: value || '', onChange, placeholder });
  },
}));

const refreshSpy = vi.fn();
vi.mock('@shared-components/reports-table/ReportsTable', () => {
  const React = require('react');
  const { forwardRef, useImperativeHandle } = React;
  const Table = forwardRef((props: any, ref: any) => {
    void props;
    useImperativeHandle(ref, () => ({ refresh: () => refreshSpy() }));
    return React.createElement('div', { 'data-testid': 'reports-table' }, 'Table');
  });
  return { default: Table };
});

vi.mock('@/widget-library/Toaster', () => ({
  default: (props: any) => {
    const React = require('react');
    const { type = 'success', title, subtitle } = props || {};
    return React.createElement('div', { 'data-testid': 'toaster', className: `toaster ${type}` }, `${title} ${subtitle}`);
  },
}));

// Hooks for employee expense
const refetchSpy = vi.fn();
const glValidateSpy = vi.fn();
const generateSpy = vi.fn();
vi.mock('@/hooks/useEmployeeExpense', () => ({
  useCompanyMaintenance: () => ({ data: null }),
  useGlMasterValidation: () => ({ mutateAsync: glValidateSpy }),
  useGenerateEmployeeExpenseReport: () => ({ mutateAsync: generateSpy }),
  useEmployeeExpenseReports: () => ({ refetch: refetchSpy }),
}));

import EmployeeExpenseExport from '@/modules/accounts-payable/employee-expense-export/EmployeeExpenseExport';

const renderWithRouter = (ui: React.ReactElement) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe('EmployeeExpenseExport (lightweight)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    refetchSpy.mockResolvedValue({ data: [] });
    glValidateSpy.mockResolvedValue({ isDeleted: 'N' });
    generateSpy.mockResolvedValue({ data: { items: { message: 'OK' } } });
    refreshSpy.mockClear();
  });

  it('renders headings', () => {
    renderWithRouter(<EmployeeExpenseExport />);
    expect(screen.getByRole('heading', { level: 4, name: 'Employee Expense' })).toBeInTheDocument();
    expect(screen.getByText('Generated Reports')).toBeInTheDocument();
    expect(screen.getByTestId('reports-table')).toBeInTheDocument();
  });

  it('shows validation error when required fields missing', async () => {
    renderWithRouter(<EmployeeExpenseExport />);
    const generateBtn = screen.getByRole('button', { name: /Generate Report/i });
    await userEvent.click(generateBtn);
    const t = await screen.findByTestId('toaster');
    expect(t).toHaveClass('toaster error');
    expect(t.textContent || '').toMatch(/Bank Account GL.*Date to Pay by.*required or invalid/i);
  });

  it('validates GL and generates report successfully', async () => {
    renderWithRouter(<EmployeeExpenseExport />);

    // Enter valid 8-digit GL to trigger GL validation
    const glInput = screen.getByPlaceholderText('121100-09');
    await userEvent.type(glInput, '12345678');
    await waitFor(() => expect(glValidateSpy).toHaveBeenCalled());

    // Set date to pay by
    const dateInput = screen.getByPlaceholderText('Date to Pay by');
    await userEvent.type(dateInput, '2025-01-02');

    // Generate
    const generateBtn = screen.getByRole('button', { name: /Generate Report/i });
    await userEvent.click(generateBtn);

    await waitFor(() => {
      expect(generateSpy).toHaveBeenCalledWith({ companyNo: 10, bankGlNo: 12345678, dateToPay: '010225' });
      expect(refreshSpy).toHaveBeenCalled();
    });

    // Last sync label should appear
    await waitFor(() => {
      expect(screen.getByText(/Last sync on/i)).toBeInTheDocument();
    });
  });
});


