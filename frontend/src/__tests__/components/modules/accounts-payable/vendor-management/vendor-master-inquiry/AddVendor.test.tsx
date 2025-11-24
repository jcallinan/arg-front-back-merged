import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

// Lightweight stubs
vi.mock('antd', () => {
  const React = require('react');
  const Panel = ({ header, children }: any) => React.createElement('div', { 'data-testid': 'collapse-panel' }, header, children);
  const Collapse = ({ children }: any) => React.createElement('div', { 'data-testid': 'collapse' }, children);
  (Collapse as any).Panel = Panel;
  return {
    Switch: ({ checked, onChange }: any) => React.createElement('input', { type: 'checkbox', checked, onChange: (e: any) => onChange && onChange(e.target.checked) }),
    Divider: (props: any) => React.createElement('hr', { ...props }),
    Collapse,
  };
});
vi.mock('@widget-library/Toaster', () => ({ default: () => null }));
vi.mock('@widget-library/Card', () => ({ default: ({ children }: any) => { const React = require('react'); return React.createElement('div', null, children); } }));
vi.mock('@widget-library/Modal', () => ({ default: ({ visible, onCancel, title }: any) => { const React = require('react'); if (!visible) return null; return React.createElement('div', { 'data-testid': 'modal' }, title || 'Modal', React.createElement('button', { onClick: onCancel }, 'Close')) } }));
vi.mock('@widget-library/Buttons', () => { const React = require('react'); const Btn = ({ onClick, label, name }: any) => React.createElement('button', { onClick, 'data-name': name }, label || 'Button'); return { DefaultButton: Btn, CustomStyledButton: Btn }; });
vi.mock('@assets/icons/company-icon.svg', () => ({ default: 'company.svg' }));
vi.mock('@assets/icons/popup-ok.svg', () => ({ default: 'ok.svg' }));

// Constants used by component
vi.mock('@constants/commonConstants', () => ({
  iconAltTexts: {
    companyIcon: 'Company Icon',
    vendorIcon: 'Vendor Icon',
    okIcon: 'OK Icon',
  },
  modalActions: [
    { name: 'ok', label: 'OK' },
    { name: 'cancel', label: 'Cancel' },
  ],
}));
vi.mock('@/constants/commonConstants', () => ({
  iconAltTexts: {
    companyIcon: 'Company Icon',
    vendorIcon: 'Vendor Icon',
    okIcon: 'OK Icon',
  },
  modalActions: [
    { name: 'ok', label: 'OK' },
    { name: 'cancel', label: 'Cancel' },
  ],
}));

// Avoid react-query in nested forms
vi.mock('@/hooks/useDropdownData', () => ({
  useDropdownData: vi.fn(() => ({ data: [], isLoading: false, error: null })),
}));
vi.mock('@hooks/useDropdownData', () => ({
  useDropdownData: vi.fn(() => ({ data: [], isLoading: false, error: null })),
}));

// Hook used to save vendor
const saveVendorSpy = vi.fn();
vi.mock('@/hooks/useVendorManagement', () => ({ useVendorManagement: () => ({ createOrUpdateVendor: saveVendorSpy }) }));

// SUT
import AddVendor from '@/modules/accounts-payable/vendor-managment/vendor-master-inquiry/add-vendor/AddVendor';

const renderWithRouter = (ui: React.ReactElement) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe('AddVendor (lightweight)', () => {
  beforeEach(() => { vi.clearAllMocks(); saveVendorSpy.mockResolvedValue({ status: 200 }); });

  it('renders basic structure', () => {
    renderWithRouter(<AddVendor /> as any);
    // Check for a couple of form labels present in the component
    expect(screen.getByText(/Bank Details/i)).toBeInTheDocument();
    expect(screen.getByText(/1099 Section both IRS & PA/i)).toBeInTheDocument();
  });

  it('calls onCancel when Cancel clicked', async () => {
    const onCancel = vi.fn();
    renderWithRouter(<AddVendor onCancel={onCancel} /> as any);
    const cancel = screen.getByRole('button', { name: /Cancel/i });
    await userEvent.click(cancel);
    expect(onCancel).toHaveBeenCalled();
  });
});


