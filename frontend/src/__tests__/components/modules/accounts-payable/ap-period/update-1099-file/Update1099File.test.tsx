import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

// Light stubs to keep memory low
vi.mock('antd', () => {
  const React = require('react');
  return {
    Tooltip: ({ children }: any) => React.createElement(React.Fragment, null, children),
    message: { error: vi.fn(), success: vi.fn() },
  };
});

vi.mock('@ant-design/icons', () => {
  const React = require('react');
  const mk = (tid: string) => ({ className, onClick }: any) => React.createElement('button', { className, onClick, 'data-testid': tid }, tid);
  return {
    EyeOutlined: mk('icon-view'),
    EditOutlined: mk('icon-edit'),
    DeleteOutlined: mk('icon-delete'),
  };
});

vi.mock('@/widget-library/Dropdown', () => ({
  CustomSelectDropdown: ({ value, onChange, options, ...props }: any) => {
    const React = require('react');
    return React.createElement('select', { 'data-testid': 'record-type', value, onChange: (e: any) => onChange && onChange(e.target.value), ...props },
      (options || []).map((o: any, i: number) => React.createElement('option', { key: i, value: o.value }, o.label))
    );
  },
}));

vi.mock('@/widget-library/Input', () => ({
  CustomPrefixInput: ({ name, value, onChange, placeholder }: any) => {
    const React = require('react');
    return React.createElement('input', { 'data-name': name, value: value || '', onChange, placeholder });
  },
}));

vi.mock('@/widget-library/Buttons', () => {
  const React = require('react');
  const Btn = ({ onClick, label, name }: any) => React.createElement('button', { onClick, 'data-name': name }, label || 'Button');
  return { CustomStyledButton: Btn };
});

// Minimal table that renders column.render and exposes pagination trigger
const onChangeSpy = vi.fn();
vi.mock('@/widget-library/Table', () => ({
  default: ({ columns, dataSource, loading, pagination }: any) => {
    const React = require('react');
    void loading;
    const rows = (dataSource || []).map((row: any, rIdx: number) => React.createElement('tr', { key: row.key || rIdx },
      columns.map((col: any, cIdx: number) => React.createElement('td', { key: col.key || col.dataIndex || cIdx },
        col.render ? col.render(row[col.dataIndex], row) : String(row[col.dataIndex] ?? '')
      ))
    ));
    return React.createElement('div', { 'data-testid': 'table-widget' },
      React.createElement('table', null, React.createElement('tbody', null, ...rows)),
      React.createElement('button', { 'data-testid': 'paginate-next', onClick: () => { onChangeSpy(); pagination?.onChange && pagination.onChange((pagination?.current || 1) + 1, pagination?.pageSize || 10); } }, 'Next')
    );
  },
}));

vi.mock('@/widget-library/DeleteConfirmationModal', () => ({
  default: ({ visible, onCancel, onConfirm, itemName }: any) => {
    const React = require('react');
    if (!visible) return null;
    return React.createElement('div', { 'data-testid': 'delete-modal' },
      React.createElement('div', null, itemName || 'Item'),
      React.createElement('button', { 'data-testid': 'confirm-delete', onClick: onConfirm }, 'Confirm'),
      React.createElement('button', { 'data-testid': 'cancel-delete', onClick: onCancel }, 'Cancel'),
    );
  },
}));

vi.mock('@/widget-library/Toaster', () => ({
  default: (props: any) => {
    const React = require('react');
    const { type = 'success', title, subtitle } = props || {};
    return React.createElement('div', { 'data-testid': 'toaster', className: `toaster ${type}` }, `${title} ${subtitle}`);
  },
}));

// View modal
vi.mock('@/modules/accounts-payable/ap-period/sub-modules/update-1099-file/Update1099FileViewModal', () => ({
  default: ({ visible, onClose, onEdit, data }: any) => {
    const React = require('react');
    if (!visible) return null;
    return React.createElement('div', { 'data-testid': 'view-modal' },
      React.createElement('div', null, String(data?.firstPayeeName || '')),
      React.createElement('button', { 'data-testid': 'view-edit', onClick: onEdit }, 'Edit'),
      React.createElement('button', { 'data-testid': 'view-close', onClick: onClose }, 'Close'),
    );
  },
}));

// Dropdown data
vi.mock('@/hooks/useDropdownData', () => ({
  useDropdownData: vi.fn(() => ({ data: [ { label: 'Type A', value: 'A' }, { label: 'Type B', value: 'B' } ], isLoading: false })),
}));

// Router navigate
const navigateSpy = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<any>('react-router-dom');
  return { ...actual, useNavigate: () => navigateSpy };
});

// AP Period End hook
const fetchAllSpy = vi.fn();
const fetchOneSpy = vi.fn();
const deleteSpy = vi.fn();
vi.mock('@/hooks/useApPeriodEnd', () => ({
  useApPeriodEnd: () => ({
    fetchAllApPeriodEndReports: fetchAllSpy,
    fetchApPeriodEndReports: fetchOneSpy,
    softDeleteRecord: deleteSpy,
    transform1099FileData: (items: any[]) => items.map((it: any, idx: number) => ({
      key: String(idx + 1),
      recordType: it.recordType,
      ctl: it.ctl,
      tin: it.tin,
      firstPayeeName: it.firstPayeeName,
    })),
  }),
}));

// SUT
import Update1099File from '@/modules/accounts-payable/ap-period/sub-modules/update-1099-file/Update1099File';

const renderWithRouter = (ui: React.ReactElement) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe('Update1099File (lightweight)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchAllSpy.mockResolvedValue({ items: [
      { recordType: 'A', ctl: '1234', tin: '111111111', firstPayeeName: 'Alice' },
      { recordType: 'B', ctl: '5678', tin: '222222222', firstPayeeName: 'Bob' },
    ]});
    fetchOneSpy.mockResolvedValue({ details: 'ok' });
    deleteSpy.mockResolvedValue({ status: 200, data: { items: { message: 'Deleted' } } });
    navigateSpy.mockReset();
  });

  it('renders and loads initial data', async () => {
    renderWithRouter(<Update1099File />);
    expect(screen.getByText('Update 1099 File')).toBeInTheDocument();
    await waitFor(() => expect(fetchAllSpy).toHaveBeenCalled());
    expect(screen.getByTestId('table-widget')).toBeInTheDocument();
  });

  it('applies filters and calls API with filter params', async () => {
    renderWithRouter(<Update1099File />);
    await waitFor(() => expect(fetchAllSpy).toHaveBeenCalledTimes(1));

    await userEvent.selectOptions(screen.getByTestId('record-type'), 'B');
    const ctl = screen.getByPlaceholderText('Enter Ctl#');
    const tin = screen.getByPlaceholderText('Enter Tin#');
    await userEvent.clear(ctl);
    await userEvent.type(ctl, '5678');
    await userEvent.clear(tin);
    await userEvent.type(tin, '222222222');

    const apply = screen.getByRole('button', { name: /Apply Filters/i });
    await userEvent.click(apply);

    await waitFor(() => {
      expect(fetchAllSpy).toHaveBeenCalledTimes(2);
      const args = fetchAllSpy.mock.calls[1][0];
      expect(args).toEqual(expect.objectContaining({ recordType: 'B', ctl: '5678', tin: '222222222' }));
    });
  });

  it('validates ctl and tin lengths with toaster warnings', async () => {
    renderWithRouter(<Update1099File />);
    const ctl = await screen.findByPlaceholderText('Enter Ctl#');
    await userEvent.type(ctl, '12345');
    expect(await screen.findByTestId('toaster')).toHaveClass('toaster warning');
    expect(screen.getByTestId('toaster').textContent || '').toMatch(/CTL# cannot exceed 4 characters/i);

    const tin = screen.getByPlaceholderText('Enter Tin#');
    await userEvent.type(tin, '1234567890');
    expect(await screen.findByTestId('toaster')).toHaveClass('toaster warning');
    expect(screen.getByTestId('toaster').textContent || '').toMatch(/TIN# cannot exceed 9 characters/i);
  });

  it('view opens modal, edit from modal navigates with fresh data', async () => {
    renderWithRouter(<Update1099File />);
    await screen.findByTestId('table-widget');

    // click view from first row
    const viewBtn = screen.getAllByTestId('icon-view')[0];
    await userEvent.click(viewBtn);
    const viewModal = await screen.findByTestId('view-modal');
    expect(viewModal).toBeInTheDocument();

    // click edit inside modal -> should call fetchOne and navigate
    const editInside = screen.getByTestId('view-edit');
    await userEvent.click(editInside);
    await waitFor(() => {
      expect(fetchOneSpy).toHaveBeenCalled();
      expect(navigateSpy).toHaveBeenCalled();
    });
  });

  it('edit icon navigates to edit', async () => {
    renderWithRouter(<Update1099File />);
    await screen.findByTestId('table-widget');
    const editBtn = screen.getAllByTestId('icon-edit')[0];
    await userEvent.click(editBtn);
    await waitFor(() => {
      expect(fetchOneSpy).toHaveBeenCalled();
      expect(navigateSpy).toHaveBeenCalled();
    });
  });

  it('delete not allowed for non-B shows error toaster', async () => {
    renderWithRouter(<Update1099File />);
    await screen.findByTestId('table-widget');
    const delBtnA = screen.getAllByTestId('icon-delete')[0]; // first row is A
    await userEvent.click(delBtnA);
    const t = await screen.findByTestId('toaster');
    expect(t).toHaveClass('toaster error');
    expect(t.textContent || '').toMatch(/Delete Not Allowed/i);
  });

  it('delete for B opens modal and confirms delete', async () => {
    renderWithRouter(<Update1099File />);
    await screen.findByTestId('table-widget');
    const delBtnB = screen.getAllByTestId('icon-delete')[1]; // second row is B
    await userEvent.click(delBtnB);
    const modal = await screen.findByTestId('delete-modal');
    expect(modal).toBeInTheDocument();
    await userEvent.click(screen.getByTestId('confirm-delete'));
    await waitFor(() => {
      expect(deleteSpy).toHaveBeenCalled();
      // refresh call
      expect(fetchAllSpy).toHaveBeenCalledTimes(2);
    });
    // success toaster
    expect(screen.getByTestId('toaster')).toHaveClass('toaster success');
    expect(screen.getByTestId('toaster').textContent || '').toMatch(/Delete Successful/i);
  });
});


