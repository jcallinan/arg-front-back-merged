import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

// Lightweight stubs
vi.mock('antd', () => {
  const React = require('react');
  return {
    Tooltip: ({ children }: any) => React.createElement(React.Fragment, null, children),
    Switch: ({ checked, onChange }: any) => React.createElement('input', { type: 'checkbox', checked, onChange: (e: any) => onChange && onChange(e.target.checked) }),
    Divider: (props: any) => React.createElement('hr', { ...props }),
  };
});

vi.mock('@ant-design/icons', () => {
  const React = require('react');
  const I = ({ 'data-testid': tid }: any) => React.createElement('span', { 'data-testid': tid || 'icon' }, 'I');
  return { ReloadOutlined: I, SyncOutlined: I, DownloadOutlined: I, EyeOutlined: I, FileExcelOutlined: I, FilePdfOutlined: I };
});

// Constants used by the component
vi.mock('@constants/commonConstants', () => ({
  OPEN_PAYABLES: { title: 'Open Payables' },
  PURCHASE_JOURNAL: { genReports: 'Generated Reports', postRefresh: 'Refresh' },
}));
vi.mock('@/constants/commonConstants', () => ({
  OPEN_PAYABLES: { title: 'Open Payables' },
  PURCHASE_JOURNAL: { genReports: 'Generated Reports', postRefresh: 'Refresh' },
}));

vi.mock('@shared-components/report-filter-bar/ReportsFilterBar', () => ({
  default: ({ onApply, onReset }: any) => {
    const React = require('react');
    return React.createElement('div', { 'data-testid': 'reports-filter-bar' },
      React.createElement('button', { 'data-testid': 'apply-filters', onClick: onApply }, 'Apply'),
      React.createElement('button', { 'data-testid': 'reset-filters', onClick: onReset }, 'Reset')
    );
  },
}));

vi.mock('@widget-library/Dropdown', () => ({
  CustomSelectDropdown: ({ name, value, onChange, options, ...props }: any) => {
    const React = require('react');
    return React.createElement('select', { 'data-name': name, value: value ?? '', onChange: (e: any) => onChange && onChange(e.target.value), ...props },
      (options || []).map((o: any, i: number) => React.createElement('option', { key: i, value: o.value }, o.label))
    );
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
    const handleChange = (e: any) => onChange && onChange('name', e.target.value);
    return React.createElement('input', { type: 'date', value: value || '', onChange: handleChange, ...props });
  },
}));

vi.mock('@widget-library/Buttons', () => {
  const React = require('react');
  const Btn = ({ onClick, label, name, icon }: any) => React.createElement('button', { onClick, 'data-name': name }, icon || null, label || 'Button');
  return { DefaultButton: Btn, CustomStyledButton: Btn };
});

vi.mock('@widget-library/Toaster', () => ({
  default: (props: any) => {
    const React = require('react');
    const { type = 'success', title, subtitle } = props || {};
    return React.createElement('div', { 'data-testid': 'toaster', className: `toaster ${type}` }, `${title} ${subtitle}`);
  },
}));

vi.mock('@widget-library/ExcelViewer', () => ({
  default: ({ visible, onClose, onDownload }: any) => {
    const React = require('react');
    if (!visible) return null;
    return React.createElement('div', { 'data-testid': 'excel-viewer' },
      React.createElement('button', { 'data-testid': 'excel-download', onClick: onDownload }, 'Download'),
      React.createElement('button', { 'data-testid': 'excel-close', onClick: onClose }, 'Close'),
    );
  },
}));

// Minimal table that just renders data
vi.mock('@widget-library/Table', () => ({
  default: ({ dataSource }: any) => {
    const React = require('react');
    return React.createElement('div', { 'data-testid': 'table-widget' }, String((dataSource || []).length));
  },
}));

// File download
const downloadSpy = vi.fn();
vi.mock('@/hooks/useFileDownload', () => ({
  useFileDownload: () => ({ downloadFile: downloadSpy }),
}));

// Dropdown data (react-query hook) -> stub to avoid QueryClient
vi.mock('@hooks/useDropdownData', () => ({
  useDropdownData: vi.fn((_type?: string) => ({ data: [], isLoading: false, error: null })),
}));

// Open Payables hook
const fetchTypesSpy = vi.fn();
const getDataSpy = vi.fn();
const genReportSpy = vi.fn();
const buildParamsSpy = vi.fn();
const buildReportParamsSpy = vi.fn();
vi.mock('@/hooks/useOpenPayables', () => ({
  useOpenPayables: () => ({
    loading: false,
    fetchReportsType: fetchTypesSpy,
    getOpenPayablesReportData: getDataSpy,
    openPayableGenerateReport: genReportSpy,
    buildApiParams: (_: any, payload: any) => { buildParamsSpy(payload); return payload; },
    buildReportApiParams: (payload: any) => { buildReportParamsSpy(payload); return payload; },
  }),
}));

import OpenPayables from '@/modules/accounts-payable/open-payables/openPayables';

const renderWithRouter = (ui: React.ReactElement) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe('OpenPayables (lightweight)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchTypesSpy.mockResolvedValue([
      { label: 'Hold Status', value: 'Open-Payables-in-Hold-Status' },
      { label: 'Aged', value: 'Open-Payables-by-Vendor(Aged)' },
    ]);
    getDataSpy.mockResolvedValue([]);
    genReportSpy.mockResolvedValue({ message: 'Generated' });
    downloadSpy.mockResolvedValue(true);
  });

  it('renders and loads initial data', async () => {
    renderWithRouter(<OpenPayables />);
    await waitFor(() => expect(fetchTypesSpy).toHaveBeenCalled());
    await waitFor(() => expect(getDataSpy).toHaveBeenCalled());
    expect(screen.getByTestId('table-widget')).toBeInTheDocument();
  });

  it('shows validation error when Generate clicked without selecting Open Payables', async () => {
    renderWithRouter(<OpenPayables />);
    await waitFor(() => expect(fetchTypesSpy).toHaveBeenCalled());
    const genBtn = screen.getByRole('button', { name: /Generate/i });
    await userEvent.click(genBtn);
    const t = await screen.findByTestId('toaster');
    expect(t).toHaveClass('toaster error');
    expect(t.textContent || '').toMatch(/Open Payables is required/i);
  });

  it('Hold Status requires hold voucher selection', async () => {
    renderWithRouter(<OpenPayables />);
    await waitFor(() => expect(fetchTypesSpy).toHaveBeenCalled());
    const dueSelect = screen.getByRole('combobox');
    await userEvent.selectOptions(dueSelect, 'Open-Payables-in-Hold-Status');
    const genBtn = screen.getByRole('button', { name: /Generate/i });
    await userEvent.click(genBtn);
    const t = await screen.findByTestId('toaster');
    expect(t).toHaveClass('toaster error');
    expect(t.textContent || '').toMatch(/Please select a hold voucher status/i);
  });

  it('Filter bar Apply triggers filtered data fetch', async () => {
    renderWithRouter(<OpenPayables />);
    await waitFor(() => expect(fetchTypesSpy).toHaveBeenCalled());
    const apply = screen.getByTestId('apply-filters');
    await userEvent.click(apply);
    await waitFor(() => expect(getDataSpy).toHaveBeenCalledTimes(2));
    expect(buildReportParamsSpy).toHaveBeenCalled();
  });

  it('Post Refresh reloads data without filters', async () => {
    renderWithRouter(<OpenPayables />);
    await waitFor(() => expect(fetchTypesSpy).toHaveBeenCalled());
    const refresh = screen.getByRole('button', { name: /Refresh/i });
    await userEvent.click(refresh);
    await waitFor(() => expect(getDataSpy).toHaveBeenCalledTimes(2));
  });
});


