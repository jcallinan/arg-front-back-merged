import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

// Lightweight stubs
vi.mock('antd', () => ({ Tooltip: ({ children }: any) => children }));
vi.mock('@ant-design/icons', () => {
  const React = require('react');
  const Eye = (p: any) => React.createElement('button', { 'data-testid': 'icon-view', onClick: p.onClick }, 'V');
  const Sync = (p: any) => React.createElement('button', { 'data-testid': 'icon-reset', onClick: p.onClick }, 'R');
  return { EyeOutlined: Eye, SyncOutlined: Sync };
});
vi.mock('@widget-library/Buttons', () => {
  const React = require('react');
  return { CustomStyledButton: ({ onClick, label }: any) => React.createElement('button', { onClick }, label || 'Button') };
});
vi.mock('@widget-library/DatePicker', () => ({
  default: ({ value, onChange, ...props }: any) => {
    const React = require('react');
    const handle = (e: any) => onChange && onChange('startDate', e.target.value);
    return React.createElement('input', { type: 'date', value: value || '', onChange: handle, ...props });
  },
}));
vi.mock('@widget-library/Input', () => ({
  CustomPrefixInput: ({ name, value, onChange, placeholder }: any) => {
    const React = require('react');
    return React.createElement('input', { 'data-name': name, value: value || '', onChange, placeholder });
  },
}));
vi.mock('@widget-library/Card', () => ({ default: ({ label, value }: any) => {
  const React = require('react');
  return React.createElement('div', { 'data-testid': `card-${label}` }, String(value));
}}));
vi.mock('@widget-library/Table', () => ({ default: ({ dataSource }: any) => {
  const React = require('react');
  const rows = (dataSource || []).map((r: any, i: number) => React.createElement('div', { key: i }, r.checkNo));
  return React.createElement('div', { 'data-testid': 'table-widget' }, rows);
}}));
vi.mock('@widget-library/Toaster', () => ({
  default: (props: any) => {
    const React = require('react');
    const { type = 'error', title, subtitle } = props || {};
    return React.createElement('div', { 'data-testid': 'toaster', className: `toaster ${type}` }, `${title} ${subtitle}`);
  },
}));
vi.mock('@shared-components/company-number/CompanyNo', () => ({
  default: ({ value, onChange }: any) => {
    const React = require('react');
    return React.createElement('input', { 'data-testid': 'company-number', value, onChange: (e: any) => onChange && onChange(e.target.value) });
  },
}));
vi.mock('@shared-components/vendor-number-name/VendorNumberName', () => ({
  default: ({ value, onChange }: any) => {
    const React = require('react');
    return React.createElement('input', { 'data-testid': 'vendor-no', value: value || '', onChange: (e: any) => onChange && onChange(e.target.value) });
  },
}));
vi.mock('@constants/commonConstants', () => ({
  CHECK_INQUIRY: { title: 'Check Inquiry' },
  FLEXI_PROCESS_CONSTANTS: { tableColumns: { actions: 'Actions' } },
}));

// Hooks
const refetchPH = vi.fn();
const refetchLP = vi.fn();
vi.mock('@/hooks/useCheckInquiry', () => ({
  usePaymentHistory: () => ({ data: [], isLoading: false, refetch: refetchPH }),
  useLastPaymentInfo: () => ({ data: {}, isLoading: false, refetch: refetchLP }),
  usePaymentHistoryManual: () => ({ fetchPaymentHistory: vi.fn() }),
}));

import CheckInquiry from '@/modules/accounts-payable/voucher-management/sub-modules/check-inquiry/CheckInquiry';

const renderWithRouter = (ui: React.ReactElement) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe('CheckInquiry (lightweight)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows validation toaster if vendor not provided on Search', async () => {
    renderWithRouter(<CheckInquiry />);
    const searchBtn = screen.getByRole('button', { name: 'Search' });
    await userEvent.click(searchBtn);
    const t = await screen.findByTestId('toaster');
    expect(t).toHaveClass('toaster error');
    expect(t.textContent || '').toMatch(/Vendor No is required/i);
  });

  it('calls refetch when vendor is set and Search clicked', async () => {
    renderWithRouter(<CheckInquiry />);
    const vendor = screen.getByTestId('vendor-no');
    await userEvent.type(vendor, '12345');
    const searchBtn = screen.getByRole('button', { name: 'Search' });
    await userEvent.click(searchBtn);
    await waitFor(() => {
      expect(refetchPH).toHaveBeenCalled();
      expect(refetchLP).toHaveBeenCalled();
    });
  });
});


