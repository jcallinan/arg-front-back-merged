import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

// Lightweight stubs
vi.mock('antd', () => {
  const React = require('react');
  return {
    Tooltip: ({ children }: any) => children,
    message: { error: vi.fn() },
    Divider: (props: any) => React.createElement('hr', { ...props }),
    Switch: ({ checked, onChange }: any) => React.createElement('input', { type: 'checkbox', checked, onChange: (e: any) => onChange && onChange(e.target.checked) }),
  };
});
vi.mock('@ant-design/icons', () => {
  const React = require('react');
  const Edit = (p: any) => React.createElement('button', { 'data-testid': 'icon-edit', onClick: p.onClick }, 'E');
  const Search = () => React.createElement('span', { 'data-testid': 'icon-search' }, 'S');
  return { EditOutlined: Edit, SearchOutlined: Search };
});
vi.mock('@widget-library/Table', () => ({ default: ({ dataSource }: any) => {
  const React = require('react');
  return React.createElement('div', { 'data-testid': 'table-widget' }, String((dataSource || []).length));
}}));
vi.mock('@shared-components/company-number/CompanyNo', () => ({ default: ({ value, onChange }: any) => {
  const React = require('react');
  return React.createElement('input', { 'data-testid': 'company-number', value, onChange: (e: any) => onChange && onChange(e.target.value) });
}}));
vi.mock('@widget-library/Modal', () => ({ default: ({ visible, children }: any) => {
  const React = require('react');
  if (!visible) return null;
  return React.createElement('div', { 'data-testid': 'modal' }, children || 'Modal');
}}));

// Avoid react-query via this shared component by stubbing it
vi.mock('@/shared-components/owner-vendor-number-name/OwnerVendorNumberName', () => ({
  default: ({ value, onChange }: any) => {
    const React = require('react');
    return React.createElement('input', { 'data-testid': 'owner-vendor', value: value || '', onChange: (e: any) => onChange && onChange(e.target.value) });
  },
}));

// Constants used by component
vi.mock('@constants/commonConstants', () => ({
  statusOptions: [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ],
}));
vi.mock('@/constants/commonConstants', () => ({
  statusOptions: [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ],
}));

// Hook
const fetchOwners = vi.fn();
const fetchMapping = vi.fn();
vi.mock('@/hooks/useVendorOwnerMapping', () => ({
  useVendorOwnerMapping: () => ({
    loading: false,
    ownerOptionsLoading: false,
    fetchOwnerNumbers: fetchOwners,
    fetchMappingData: fetchMapping,
  }),
}));

// SUT
import VendorOwner from '@/modules/accounts-payable/vendor-managment/vendor-owner-mapping/VendorOwner';

const renderWithRouter = (ui: React.ReactElement) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe('VendorOwner (lightweight)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchOwners.mockResolvedValue([]);
    fetchMapping.mockResolvedValue([]);
  });

  it('renders and loads data', async () => {
    renderWithRouter(<VendorOwner />);
    await waitFor(() => expect(fetchOwners).toHaveBeenCalled());
    await waitFor(() => expect(fetchMapping).toHaveBeenCalled());
    expect(screen.getByTestId('table-widget')).toBeInTheDocument();
  });

  it('Search triggers fetch for mapping and owners', async () => {
    renderWithRouter(<VendorOwner />);
    const search = screen.getByRole('button', { name: /Search/i });
    await userEvent.click(search);
    await waitFor(() => {
      expect(fetchOwners).toHaveBeenCalledTimes(2);
      expect(fetchMapping).toHaveBeenCalledTimes(2);
    });
  });
});


