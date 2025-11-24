import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

// Keep tests lightweight: stub heavy modules locally
vi.mock('antd', () => {
  const React = require('react');
  return {
    Divider: (props: any) => React.createElement('hr', { ...props }),
    Tooltip: ({ children }: any) => React.createElement(React.Fragment, null, children),
  };
});

vi.mock('@ant-design/icons', () => {
  const React = require('react');
  const ReloadIcon = ({ className, onClick }: any) => React.createElement('button', { className, onClick, 'data-testid': 'reload-icon' }, 'R');
  const SyncIcon = ({ className, onClick }: any) => React.createElement('button', { className, onClick, 'data-testid': 'sync-icon' }, 'R');
  return { ReloadOutlined: ReloadIcon, SyncOutlined: SyncIcon };
});

vi.mock('@constants/commonConstants', () => ({
  REPORTS_LABEL: {
    BUTTON_LABELS: 'Generate',
    postRefresh: 'Refresh',
  },
}));

vi.mock('@widget-library/DatePicker', () => ({
  default: ({ value, onChange, ...props }: any) => {
    const React = require('react');
    const handleChange = (e: any) => onChange && onChange(undefined, e.target.value);
    return React.createElement('input', { type: 'date', value: value || '', onChange: handleChange, placeholder: 'Report Date', ...props });
  },
}));

vi.mock('@shared-components/company-number/CompanyNo', () => ({
  default: ({ value, onChange }: any) => {
    const React = require('react');
    return React.createElement('input', { 'data-testid': 'company-number', value, onChange: (e: any) => onChange && onChange(e.target.value) });
  },
}));

vi.mock('@/shared-components/report-type/ReportType', () => ({
  default: ({ value, onChange, isRequired }: any) => {
    const React = require('react');
    return React.createElement('select', { 'data-testid': 'report-type', value, onChange: (e: any) => onChange && onChange(e.target.value), 'aria-required': !!isRequired },
      React.createElement('option', { value: '' }, 'Select'),
      React.createElement('option', { value: 'AP-Month-End-Vendor-Details' }, 'AP-Month-End-Vendor-Details'),
      React.createElement('option', { value: 'Outstanding-Check-Register' }, 'Outstanding-Check-Register'),
    );
  },
}));

vi.mock('@shared-components/report-filter-bar/ReportsFilterBar', () => ({
  default: ({ onApply, onReset }: any) => {
    const React = require('react');
    return React.createElement('div', { 'data-testid': 'reports-filter-bar' },
      React.createElement('button', { onClick: onApply, 'data-testid': 'apply-filters' }, 'Apply'),
      React.createElement('button', { onClick: onReset, 'data-testid': 'reset-filters' }, 'Reset'),
    );
  },
}));

const tableRefreshSpy = vi.fn();
vi.mock('@shared-components/reports-table/ReportsTable', () => {
  const React = require('react');
  const { forwardRef, useImperativeHandle } = React;
  const Table = forwardRef((props: any, ref: any) => {
    useImperativeHandle(ref, () => ({
      refresh: () => {
        tableRefreshSpy();
        if (props?.fetchDataFn) {
          try { props.fetchDataFn(); } catch (_) {}
        }
      },
    }));
    return React.createElement('div', { 'data-testid': 'reports-table' }, 'Table');
  });
  return { default: Table };
});

vi.mock('@widget-library/Buttons', () => {
  const React = require('react');
  const btn = (className: string) => ({ onClick, children, label, name, icon, ...props }: any) =>
    React.createElement('button', { onClick, className, 'data-name': name, name, ...props }, icon || null, children || label || 'Button');
  return {
    DefaultButton: btn('default-button'),
    CustomStyledButton: btn('custom-styled-button'),
  };
});

vi.mock('@/widget-library/Toaster', () => ({
  default: (props: any) => {
    const React = require('react');
    const { type = 'success', title, subtitle } = props || {};
    return React.createElement('div', { 'data-testid': 'toaster', className: `toaster ${type}`.trim() },
      React.createElement('div', null, title),
      React.createElement('div', null, subtitle),
    );
  },
}));

// Hook under test
vi.mock('@/hooks/useApReportsMenu');
import { useApReportsMenu } from '@/hooks/useApReportsMenu';

// SUT
import AP_ReportsMenu from '@/modules/accounts-payable/ap-reports/ApReportsMenu';

const renderWithRouter = (ui: React.ReactElement) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe('AP_ReportsMenu (lightweight)', () => {
  const submitSpy = vi.fn().mockResolvedValue({ status: 200 });
  const fetchSpy = vi.fn().mockResolvedValue({ data: { items: [] } });

  beforeEach(() => {
    vi.clearAllMocks();
    (useApReportsMenu as unknown as any).mockImplementation(() => ({
      submitReportsMenu: submitSpy,
      fetchReportsMenu: fetchSpy,
    }));
    tableRefreshSpy.mockClear();
  });

  it('renders headings', () => {
    renderWithRouter(<AP_ReportsMenu />);
    expect(screen.getByText('A/P Reports Menu')).toBeInTheDocument();
    expect(screen.getByText('Generated Reports')).toBeInTheDocument();
  });

  it('shows validation error when generating without Report Date', async () => {
    renderWithRouter(<AP_ReportsMenu />);
    const generateBtn = screen.getByRole('button', { name: /Generate/i });
    await userEvent.click(generateBtn);
    const toaster = await screen.findByTestId('toaster');
    expect(toaster).toHaveClass('toaster error');
    expect(toaster).toHaveTextContent('Validation Error');
    expect(toaster).toHaveTextContent('Report Date is required');
  });

  it('submits with formatted date and refreshes table', async () => {
    renderWithRouter(<AP_ReportsMenu />);

    // set date
    const dateInput = screen.getByPlaceholderText('Report Date');
    await userEvent.type(dateInput, '2025-01-02');

    const generateBtn = screen.getByRole('button', { name: /Generate/i });
    await userEvent.click(generateBtn);

    await waitFor(() => {
      // date formatted as MMDDYY => 010225
      expect(submitSpy).toHaveBeenCalledWith({
        companyNo: 10,
        reportDate: '010225',
        reportType: 'AP-Month-End-Vendor-Details',
      });
      expect(tableRefreshSpy).toHaveBeenCalled();
      expect(fetchSpy).toHaveBeenCalled();
    });
  });

  it('reset clears fields leading to multiple-field validation', async () => {
    renderWithRouter(<AP_ReportsMenu />);

    // provide date first
    const dateInput = screen.getByPlaceholderText('Report Date');
    await userEvent.type(dateInput, '2025-01-02');

    // click reset icon
    const resetIcon = screen.getByTestId('sync-icon');
    await userEvent.click(resetIcon);

    // now generate -> expects Report Type and Report Date missing
    const generateBtn = screen.getByRole('button', { name: /Generate/i });
    await userEvent.click(generateBtn);

    const toaster = await screen.findByTestId('toaster');
    expect(toaster).toHaveClass('toaster error');
    expect(toaster).toHaveTextContent('Validation Error');
    expect(toaster.textContent || '').toMatch(/Report Type.*Report Date.*are required/i);
  });

  it('Apply in filter bar triggers table refresh', async () => {
    renderWithRouter(<AP_ReportsMenu />);
    const applyBtn = screen.getByTestId('apply-filters');
    await userEvent.click(applyBtn);
    expect(tableRefreshSpy).toHaveBeenCalled();
  });
});


