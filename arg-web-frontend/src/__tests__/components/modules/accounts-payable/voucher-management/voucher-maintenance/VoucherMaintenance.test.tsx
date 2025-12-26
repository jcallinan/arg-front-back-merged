import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

// Lightweight UI mocks
vi.mock('antd', () => {
  const React = require('react');
  return {
    Tooltip: ({ children }: any) => React.createElement(React.Fragment, null, children),
  };
});
vi.mock('@ant-design/icons', () => {
  const React = require('react');
  return {
    EyeOutlined: ({ onClick }: any) => React.createElement('button', { 'data-testid': 'view-action', onClick }, 'View'),
    SyncOutlined: ({ onClick }: any) => React.createElement('button', { 'data-testid': 'reset-action', onClick }, 'Reset'),
  };
});
vi.mock('@widget-library/Buttons', () => {
  const React = require('react');
  const Btn = ({ onClick, label, name, disabled }: any) => React.createElement('button', { onClick, name, disabled }, typeof label === 'string' ? label : 'Button');
  return { CustomStyledButton: Btn };
});
vi.mock('@widget-library/Toaster', () => ({
  default: ({ type = 'success', title, subtitle, onClose }: any) => {
    const React = require('react');
    React.useEffect(() => { setTimeout(() => onClose?.(), 10); }, [onClose]);
    return React.createElement('div', { 'data-testid': 'toaster', className: `toaster ${type}` }, `${title || ''} ${subtitle || ''}`.trim());
  },
}));
vi.mock('@widget-library/Card', () => ({
  default: ({ label, value }: any) => {
    const React = require('react');
    return React.createElement('div', { 'data-testid': `card-${label}` }, `${label}: ${value || ''}`);
  },
}));
vi.mock('@widget-library/Table', () => ({
  default: ({ dataSource = [], pagination }: any) => {
    const React = require('react');
    return React.createElement(
      'div',
      { 'data-testid': 'table-widget' },
      React.createElement('div', null, `Total ${dataSource.length} vouchers`),
      React.createElement('button', { 'data-testid': 'paginate', onClick: () => pagination?.onChange?.(2, pagination?.pageSize || 10) }, 'Page 2')
    );
  },
}));
vi.mock('@widget-library/ViewModal', () => ({
  default: ({ visible, onClose }: any) => {
    const React = require('react');
    if (!visible) return null;
    return React.createElement('div', { 'data-testid': 'view-modal' },
      React.createElement('button', { onClick: onClose }, 'Close')
    );
  },
}));
vi.mock('@widget-library/CancelVoucherModal', () => ({
  default: ({ visible, onConfirm, onCancel }: any) => {
    const React = require('react');
    if (!visible) return null;
    return React.createElement('div', { 'data-testid': 'cancel-modal' },
      React.createElement('button', { 'data-testid': 'cancel-confirm', onClick: onConfirm }, 'Confirm'),
      React.createElement('button', { onClick: onCancel }, 'Close')
    );
  },
}));
vi.mock('@widget-library/VoucherStatusModal', () => ({
  default: ({ visible, onCancel, onSuccess }: any) => {
    const React = require('react');
    if (!visible) return null;
    return React.createElement('div', { 'data-testid': 'status-modal' },
      React.createElement('button', { 'data-testid': 'status-success', onClick: onSuccess }, 'Save'),
      React.createElement('button', { onClick: onCancel }, 'Close')
    );
  },
}));
vi.mock('@widget-library/VoucherDiscountModifyModal', () => ({
  default: ({ visible, onCancel, onSuccess }: any) => {
    const React = require('react');
    if (!visible) return null;
    return React.createElement('div', { 'data-testid': 'discount-modal' },
      React.createElement('button', { 'data-testid': 'discount-success', onClick: onSuccess }, 'Save'),
      React.createElement('button', { onClick: onCancel }, 'Close')
    );
  },
}));
vi.mock('@shared-components/company-number/CompanyNo', () => ({
  default: ({ value, onChange }: any) => {
    const React = require('react');
    return React.createElement('input', { 'data-testid': 'company-number', value, onChange: (e: any) => onChange?.(e.target.value) });
  },
}));
vi.mock('@shared-components/vendor-number-name/VendorNumberName', () => ({
  __esModule: true,
  default: React.forwardRef((props: any, ref: any) => {
    const React = require('react');
    React.useImperativeHandle(ref, () => ({ resetVendor: () => {} }));
    return React.createElement('input', { 'data-testid': 'vendor-number', value: props?.value || '', onChange: (e: any) => props?.onChange?.(e.target.value) });
  }),
}));
vi.mock('@shared-components/voucher-type/VoucherType', () => ({
  default: ({ value, onChange }: any) => {
    const React = require('react');
    return React.createElement('select', { 'data-testid': 'voucher-type', value, onChange: (e: any) => onChange?.(e.target.value) },
      React.createElement('option', { value: 'PAID' }, 'PAID'),
      React.createElement('option', { value: 'UNPAID' }, 'UNPAID'),
      React.createElement('option', { value: 'ALL' }, 'ALL'),
    );
  },
}));
vi.mock('@widget-library/DatePicker', () => ({
  default: ({ name, value, onChange }: any) => {
    const React = require('react');
    return React.createElement('input', { 'data-name': name, value: value || '', onChange: (e: any) => onChange?.(name, e.target.value) });
  },
}));
vi.mock('@widget-library/Input', () => ({
  CustomPrefixInput: ({ value, onChange, placeholder }: any) => {
    const React = require('react');
    return React.createElement('input', { 'data-testid': 'invoice-no', value: value || '', onChange, placeholder });
  },
}));

// Lighten utils and constants
vi.mock('@utils/tableFilters', () => ({
  getColumnSearchProps: () => ({}),
  createNumericFilter: () => ({}),
}));
vi.mock('@utils/sortingUtils', () => ({
  createInvoiceNumberSafeSorter: () => () => 0,
  createCustomDateSorter: () => () => 0,
  createInvoiceAmountSorter: () => () => 0,
  createTextSorter: () => () => 0,
  createCheckNumberSorter: () => () => 0,
  createStatusSorter: () => () => 0,
}));
vi.mock('@constants/commonConstants', () => ({
  FLEXI_PROCESS_CONSTANTS: { modalTitles: { view: 'View' } },
  voucherMaintenanceLabel: 'Voucher Maintenance',
}));

// Lighten asset imports
vi.mock('@assets/icons/file-cancel.svg', () => ({ default: 'file-cancel.svg' }));
vi.mock('@assets/icons/company-icon.svg', () => ({ default: 'company.svg' }));
vi.mock('@assets/icons/vendor-no-icon.svg', () => ({ default: 'vendor-no.svg' }));
vi.mock('@assets/icons/vendor-icon.svg', () => ({ default: 'vendor.svg' }));
vi.mock('@assets/icons/payables-card-icon.svg', () => ({ default: 'payables.svg' }));
vi.mock('@assets/icons/last-paid-card-icon.svg', () => ({ default: 'last-paid.svg' }));
vi.mock('@assets/icons/modify-status.svg', () => ({ default: 'modify-status.svg' }));
vi.mock('@assets/icons/disc-edit.svg', () => ({ default: 'disc-edit.svg' }));
vi.mock('@assets/icons/calender-icon.svg', () => ({ default: 'calendar.svg' }));

// Hooks and data layer
const refetchVouchersSpy = vi.fn();
const refetchSummarySpy = vi.fn();
const fetchByIdSpy = vi.fn();
const transferVoucherSpy = vi.fn();
vi.mock('@hooks/useVoucherMaintenance', () => ({
  useVoucherMaintenance: () => ({
    data: [
      { key: '1', entryNo: 101, vendorNo: '2001', vendorName: 'Acme', invoiceNo: 'INV-1', invoiceDate: '01/01/25', discAmount: 0, grossAmount: 100, dueDate: '01/10/25', discountDate: '-', status: 'Unpaid', companyNo: 10 },
    ],
    isLoading: false,
    refetch: refetchVouchersSpy,
  }),
  useVoucherMaintenanceSummary: () => ({
    data: { vendorName: 'Acme', companyNo: '10', vendorNo: '2001', openPayables: '$100.00', openPayablesDate: '01/15/25', lastPaidAmount: '$0.00', lastPaidDate: ' ' },
    refetch: refetchSummarySpy,
  }),
  useTransferVoucher: () => ({
    mutateAsync: transferVoucherSpy,
  }),
  useVoucherMaintenanceByIdManual: () => ({ fetchVoucherMaintenanceById: fetchByIdSpy }),
}));

// SUT
import VoucherMaintenance from '@/modules/accounts-payable/voucher-management/sub-modules/voucher-maintenance/VoucherMaintenance';

const renderWithRouter = (ui: React.ReactElement) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe('VoucherMaintenance (lightweight)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchByIdSpy.mockResolvedValue({ data: { items: { headerItems: { vendorName: 'Acme', vendorNo: '2001', invoiceNumber: 'INV-1', invoiceDate: '010125', dueDate: '011025', discountDueDate: '010525', grossAmount: 100, discountAmount: 0, bankGlNo: 12345678, apGlAccountNo: 56789012, voucherNo: 101, voucherStatus: 'UNPAID' }, detailItems: [] } } });
    transferVoucherSpy.mockResolvedValue({ data: { items: { message: 'Transferred' } } });
  });

  it('shows validation toaster when searching with missing fields, then searches when filled', async () => {
    renderWithRouter(<VoucherMaintenance />);

    // Search initially (vendor missing) -> toaster
    await userEvent.click(screen.getByRole('button', { name: /Search/i }));
    expect(await screen.findByTestId('toaster')).toBeInTheDocument();

    // Fill vendor and search again
    await userEvent.type(screen.getByTestId('vendor-number'), '2001');
    await userEvent.click(screen.getByRole('button', { name: /Search/i }));

    await waitFor(() => {
      expect(refetchVouchersSpy).toHaveBeenCalled();
      expect(refetchSummarySpy).toHaveBeenCalled();
    });
    expect(screen.getByTestId('table-widget')).toBeInTheDocument();
  });

  it('opens view modal on view action', async () => {
    renderWithRouter(<VoucherMaintenance />);
    await userEvent.type(screen.getByTestId('vendor-number'), '2001');
    await userEvent.click(screen.getByRole('button', { name: /Search/i }));

    // Click view on first row
    await userEvent.click(screen.getByTestId('view-action'));
    expect(await screen.findByTestId('view-modal')).toBeInTheDocument();
  });
});


