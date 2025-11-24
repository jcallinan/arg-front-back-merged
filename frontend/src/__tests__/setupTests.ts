import '@testing-library/jest-dom';
import { vi } from 'vitest';


// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock scrollTo
global.scrollTo = vi.fn();

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  // Uncomment to ignore a specific log level
  // log: vi.fn(),
  // debug: vi.fn(),
  // info: vi.fn(),
  // warn: vi.fn(),
  // error: vi.fn(),
};

// Global mocks for commonly missing modules
vi.mock('@/utils/formatters', () => ({
  formatCurrency: vi.fn((value) => value ? `$${Number(value).toLocaleString()}` : '$0'),
  formatAmountValue: vi.fn((_, value) => value),
  toNumericOrNull: vi.fn((value) => value ? Number(value) : null),
  cleanFileName: vi.fn((name) => name || ''),
}));

vi.mock('@/constants/commonConstants', () => ({
  PURCHASE_JOURNAL: {
    title: 'Purchase Journal',
    purchaseJournalPrompt: 'Purchase Journal Reports',
    genReports: 'Generated Reports',
    postRefresh: 'Refresh',
  },
  REPORTS_LABEL: {
    title: 'Reports',
  },
  OPEN_PAYABLES: {
    title: 'Open Payables',
  },
  FLEXI_PROCESS_CONSTANTS: {
    flexiProcessLabel: 'Flexi Process',
    tableColumns: {
      entryNo: 'Entry No',
      vendorNo: 'Vendor No',
      invoiceAmount: 'Invoice Amount',
      actions: 'Actions',
    },
    cards: {
      totalInvoiceAmount: 'Total Invoice Amount',
      uploadedRecords: 'Uploaded Records',
      totalSuccesses: 'Total Successes',
      totalWarnings: 'Total Warnings',
      totalErrors: 'Total Errors',
    },
  },
  voucherMaintenanceLabel: 'Voucher Maintenance',
  fieldMaxLengthMap: {},
  stepTwoFieldMaxLengthMap: {},
  holdVoucherCode: 'HOLD',
  VOUCHER_ENTRY_TEXTS: {
    downloadTemplate: 'Download Template',
  },
  VOUCHER_ENTRY_COLUMN_LABELS: {
    selectAllAria: 'Select all vouchers',
  },
}));

// Mock API with default test data
vi.mock('@/api/api-schema/api', () => ({
  Api: vi.fn().mockImplementation(() => ({
    apPeriodEnd: {
      getVendorsByYear: vi.fn().mockResolvedValue({
        data: {
          items: [
            { vendorNo: 12345, vendorName: 'Test Vendor 1', vendorAp1099Code: 'Y' },
            { vendorNo: 67890, vendorName: 'Test Vendor 2', vendorAp1099Code: 'N' },
          ],
        },
      }),
      getVendorDetailsByYear: vi.fn().mockResolvedValue({
        data: { items: { vendor: { vendorNo: 12345, vendorName: 'Test Vendor 1' } } },
      }),
      updateVendorByYear: vi.fn().mockResolvedValue({ status: 200 }),
      getAllApPeriodEndReports: vi.fn().mockResolvedValue({
        data: { items: [] },
      }),
      getApPeriodEndReports: vi.fn().mockResolvedValue({
        data: {},
      }),
      softDeleteRecord: vi.fn().mockResolvedValue({ status: 200 }),
    },
    vendorManagement: {
      getVendorDetails: vi.fn().mockResolvedValue({
        data: { items: { vendor: { vendorNo: 12345, vendorName: 'Test Vendor 1' } } },
      }),
      getNextVendorNoConfig: vi.fn().mockResolvedValue({
        data: { items: { nextVendorNo: '0001' } },
      }),
    },
    purchaseJournal: {
      purchaseJournalReports: vi.fn().mockResolvedValue({
        data: { items: [] },
      }),
    },
  })),
}));

// Mock common hooks
vi.mock('@/hooks/useSocket', () => ({
  useSocket: vi.fn(() => ({
    isConnected: false,
    lastMessage: null,
    sendMessage: vi.fn(),
  })),
}));

vi.mock('@/hooks/useClearChecks', () => ({
  useClearChecks: vi.fn(() => ({
    clearChecks: vi.fn(),
    isLoading: false,
    data: [],
  })),
}));

vi.mock('@/hooks/useApi', () => ({
  useApi: vi.fn(() => ({
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    globalStates: {
      getDropdownData: vi.fn().mockResolvedValue({ data: { items: [] } }),
    },
  })),
}));

vi.mock('@/hooks/useGenerateReport', () => ({
  useGenerateReport: vi.fn(() => ({
    generateReport: vi.fn(),
    isLoading: false,
  })),
}));

vi.mock('@/hooks/useReportDetails', () => ({
  useReportDetails: vi.fn(() => ({
    reportParameters: [],
    loading: false,
    fetchReportDetails: vi.fn(),
  })),
}));

// Mock widget library components
vi.mock('@/widget-library/Input', () => ({
  CustomPrefixInput: vi.fn(({ name, value, onChange, onBlur, disabled = false, prefix, placeholder = 'Enter text', className = '' }) => {
    const React = require('react');
    return React.createElement(
      'div',
      { className: `custom-input ${className}`.trim(), 'data-name': name },
      prefix ? React.createElement(React.Fragment, null, prefix) : null,
      React.createElement('input', { name, value, onChange, onBlur, placeholder, disabled, 'data-name': name, className: `custom-input ${className}`.trim() })
    );
  }),
}));

vi.mock('@/widget-library/Modal', () => ({
  default: vi.fn(({ visible, title, description, imageUrl, actions = [], className, children, onCancel, onClose }) => {
    const React = require('react');
    if (!visible) return null;
    const actionButtons = Array.isArray(actions)
      ? actions.map((action: any, idx: number) => React.createElement(
          'button',
          {
            key: idx,
            onClick: action?.onClick,
            disabled: !!action?.disabled,
            role: 'button',
            'data-testid': `action-${action?.name || idx}`,
            className: action?.type === 'custom' ? 'custom-styled-button' : 'ant-Button',
          },
          typeof action?.label === 'string' ? action.label : 'Button'
        ))
      : null;
    return React.createElement(
      'div',
      { role: 'dialog', 'data-testid': 'modal', className },
      // Title
      title ? React.createElement('div', { className: 'modal-utiliy-title' }, title) : null,
      // Description (string or node)
      description != null ? (typeof description === 'string'
        ? React.createElement('div', null, description)
        : description) : null,
      // Optional image
      imageUrl ? React.createElement('img', { alt: title || 'Modal Visual', src: imageUrl }) : null,
      // Content
      React.createElement('div', null, children),
      // Actions
      React.createElement('div', { 'data-testid': 'modal-actions' }, ...(actionButtons || [])),
      // Close control
      React.createElement('button', { onClick: onCancel || onClose }, 'Close')
    );
  }),
}));

vi.mock('@/widget-library/Toaster', () => ({
  default: vi.fn((props) => {
    const React = require('react');
    const { useEffect } = React;
    const { type = 'success', title, subtitle, onClose } = props || {};
    useEffect(() => {
      if (typeof onClose === 'function') {
        const t = setTimeout(() => {
          try { onClose(); } catch (_) {}
        }, 2000);
        return () => clearTimeout(t);
      }
    }, [onClose]);
    return React.createElement(
      'div',
      { 'data-testid': 'toaster', className: `toaster ${type}`.trim() },
      React.createElement('div', { className: `icon ${type}`.trim() }),
      React.createElement(
        'div',
        { className: 'content' },
        React.createElement('h5', { className: 'title' }, title),
        React.createElement('p', { className: 'subtitle' }, subtitle),
      ),
      React.createElement('span', { role: 'img', 'aria-label': 'close', className: 'close-icon', onClick: onClose })
    );
  }),
}));

vi.mock('@/widget-library/Dropdown', () => ({
  CustomSelectDropdown: vi.fn(({ value, onChange, options, ...props }) => {
    const React = require('react');
    const wrapperProps = {
      className: `custom-input ${props.name || ''}`,
      'data-name': props.name || props['data-testid'],
    };
    return React.createElement('div', wrapperProps,
      React.createElement('select', 
        { 
          value, 
          onChange: (e: any) => onChange(e.target.value, { value: e.target.value }),
          role: 'combobox',
          'aria-haspopup': 'listbox',
          ...props 
        },
        options?.map((opt: any, idx: number) => 
          React.createElement('option', { key: idx, value: opt.value }, opt.label)
        )
      )
    );
  }),
  CustomMultiSelect: vi.fn(({ value, onChange, options, ...props }) => {
    const React = require('react');
    return React.createElement('select', 
      { 
        multiple: true,
        value: Array.isArray(value) ? value : [value],
        onChange: (e: any) => {
          const selectedValues = Array.from(e.target.selectedOptions, (option: any) => option.value);
          onChange(selectedValues);
        },
        role: 'combobox',
        ...props 
      },
      options?.map((opt: any, idx: number) => 
        React.createElement('option', { key: idx, value: opt.value }, opt.label)
      )
    );
  }),
  CustomSearchableSelect: vi.fn(({ value, onChange, options, ...props }) => {
    const React = require('react');
    return React.createElement('select', 
      { 
        value, 
        onChange: (e: any) => onChange(e.target.value),
        role: 'combobox',
        ...props 
      },
      options?.map((opt: any, idx: number) => 
        React.createElement('option', { key: idx, value: opt.value }, opt.label)
      )
    );
  }),
}));

vi.mock('@/widget-library/DatePicker', () => ({
  default: vi.fn(({ value, onChange, ...props }) => {
    const React = require('react');
    return React.createElement('input', { type: 'date', value, onChange, ...props });
  }),
}));

vi.mock('@/widget-library/Table', () => ({
  default: vi.fn(({ data = [], dataSource = [], loading = false, onPaginationChange, pagination, columns = [] }) => {
    const React = require('react');
    const actualData = (Array.isArray(dataSource) && dataSource.length > 0) ? dataSource : data;
    const rowCount = Array.isArray(actualData) ? actualData.length : 0;

    // Build simple accessible table
    const table = React.createElement(
      'table',
      { role: 'table' },
      React.createElement(
        'thead',
        null,
        React.createElement(
          'tr',
          { role: 'row' },
          ...columns.map((col: any, i: number) =>
            React.createElement('th', { role: 'columnheader', key: col.key || col.dataIndex || col.title || i }, col.title)
          )
        )
      ),
      React.createElement(
        'tbody',
        null,
        ...actualData.map((item: any, rowIdx: number) =>
          React.createElement(
            'tr',
            { role: 'row', key: item.key || item.id || rowIdx },
            ...columns.map((col: any, colIdx: number) =>
              React.createElement('td', { role: 'cell', key: col.key || col.dataIndex || colIdx }, String(item[col.dataIndex] ?? ''))
            )
          )
        )
      )
    );

    return React.createElement(
      'div',
      { 'data-testid': 'table-widget' },
      React.createElement('div', { 'data-testid': 'table-loading' }, loading ? 'Loading...' : 'Ready'),
      table,
      // antd-like empty state when no data
      rowCount === 0 ? React.createElement('div', { className: 'ant-empty-description' }, 'No data') : null,
      React.createElement(
        'div',
        { 'data-testid': 'table-pagination' },
        React.createElement('div', { 'data-testid': 'pagination-total' }, `${pagination?.total || rowCount} total`),
        React.createElement('div', { 'data-testid': 'pagination-current' }, pagination?.current || '1'),
        React.createElement('div', { 'data-testid': 'pagination-page-size' }, pagination?.pageSize || '10'),
        // Text expected by tests
        React.createElement('div', null, `Total ${rowCount} items`),
        React.createElement('button', {
          'data-testid': 'pagination-change',
          onClick: () => {
            if (pagination?.onChange) pagination.onChange(2, pagination.pageSize || 10);
            if (onPaginationChange) onPaginationChange(2, 10);
          }
        }, 'Next Page')
      )
    );
  }),
}));

// Some modules import Table via a long relative path; provide the same mock
vi.mock('../../widget-library/Table', () => ({
  default: vi.fn(({ data = [], dataSource = [], loading = false, onPaginationChange, pagination, columns = [] }) => {
    const React = require('react');
    const actualData = (Array.isArray(dataSource) && dataSource.length > 0) ? dataSource : data;
    const rowCount = Array.isArray(actualData) ? actualData.length : 0;

    const table = React.createElement(
      'table',
      { role: 'table' },
      React.createElement(
        'thead',
        null,
        React.createElement(
          'tr',
          { role: 'row' },
          ...columns.map((col: any, i: number) =>
            React.createElement('th', { role: 'columnheader', key: col.key || col.dataIndex || col.title || i }, col.title)
          )
        )
      ),
      React.createElement(
        'tbody',
        null,
        ...actualData.map((item: any, rowIdx: number) =>
          React.createElement(
            'tr',
            { role: 'row', key: item.key || item.id || rowIdx },
            ...columns.map((col: any, colIdx: number) =>
              React.createElement('td', { role: 'cell', key: col.key || col.dataIndex || colIdx }, String(item[col.dataIndex] ?? ''))
            )
          )
        )
      )
    );

    return React.createElement(
      'div',
      { 'data-testid': 'table-widget' },
      React.createElement('div', { 'data-testid': 'table-loading' }, loading ? 'Loading...' : 'Ready'),
      table,
      rowCount === 0 ? React.createElement('div', { className: 'ant-empty-description' }, 'No data') : null,
      React.createElement(
        'div',
        { 'data-testid': 'table-pagination' },
        React.createElement('div', { 'data-testid': 'pagination-total' }, `${pagination?.total || rowCount} total`),
        React.createElement('div', { 'data-testid': 'pagination-current' }, pagination?.current || '1'),
        React.createElement('div', { 'data-testid': 'pagination-page-size' }, pagination?.pageSize || '10'),
        React.createElement('div', null, `Total ${rowCount} items`),
        React.createElement('button', {
          'data-testid': 'pagination-change',
          onClick: () => {
            if (pagination?.onChange) pagination.onChange(2, pagination.pageSize || 10);
            if (onPaginationChange) onPaginationChange(2, 10);
          }
        }, 'Next Page')
      )
    );
  }),
}));

vi.mock('@/widget-library/Buttons', () => ({
  DefaultButton: vi.fn(({ onClick, children, label, name, icon, ...props }) => {
    const React = require('react');
    return React.createElement('button', 
      { onClick, className: 'default-button ant-Button', 'data-name': name, name, ...props },
      icon || null,
      children || label || 'Button'
    );
  }),
  CustomStyledButton: vi.fn(({ onClick, children, label, name, icon, ...props }) => {
    const React = require('react');
    return React.createElement('button', 
      { onClick, className: 'custom-styled-button', 'data-name': name, name, ...props },
      icon || null,
      children || label || 'Button'
    );
  }),
  PrimaryButton: vi.fn(({ onClick, children, label, name, icon, ...props }) => {
    const React = require('react');
    return React.createElement('button', 
      { onClick, className: 'ant-btn-primary', 'data-name': name, name, ...props },
      icon || null,
      children || label || 'Button'
    );
  }),
  DashedButton: vi.fn(({ onClick, children, label, name, icon, ...props }) => {
    const React = require('react');
    return React.createElement('button', 
      { onClick, className: 'ant-btn-dashed', 'data-name': name, name, ...props },
      icon || null,
      children || label || 'Button'
    );
  }),
  TextButton: vi.fn(({ onClick, children, label, name, icon, ...props }) => {
    const React = require('react');
    return React.createElement('button', 
      { onClick, className: 'ant-btn-text', 'data-name': name, name, ...props },
      icon || null,
      children || label || 'Button'
    );
  }),
}));

// Mock additional widget library components
vi.mock('@/widget-library/TextArea', () => ({
  CustomTextArea: vi.fn(({ name, className, value, onChange, placeholder = 'Type here...', disabled = false }) => {
    const React = require('react');
    const handleChange = (e: any) => {
      if (onChange) onChange({ target: { value: e?.target?.value ?? '' } });
    };
    return React.createElement('textarea', {
      'data-name': name,
      className: `description-textarea ${className || ''}`,
      value: value ?? '',
      onChange: handleChange,
      placeholder,
      disabled,
      role: 'textbox',
    });
  }),
}));

vi.mock('@/widget-library/Loader', () => ({
  default: vi.fn(({ size, customFontSize, className }) => {
    const React = require('react');
    void size;
    return React.createElement(
      'div',
      { className: `ant-spin ${className || ''}`.trim(), ...(customFontSize != null ? { customfontsize: customFontSize } : {}) },
      React.createElement('span', { role: 'img', 'aria-label': 'loading' })
    );
  }),
}));

vi.mock('@/widget-library/Tabs', () => ({
  default: vi.fn((props) => {
    const React = require('react');
    const { useState } = React;
    const items = props?.items || [];
    const initialKey = props?.activeKey ?? props?.defaultActiveKey ?? (items[0]?.key ?? '1');
    const [selected, setSelected] = useState(initialKey);

    const effectiveSelected = props?.activeKey ?? selected;

    const handleChange = (key: any) => {
      if (props?.activeKey === undefined) setSelected(key);
      if (props?.onChange) props.onChange(String(key));
    };

    const tabsClass = `ant-tabs ${props?.className || 'custom-tabs'}`;

    return React.createElement(
      'div',
      { className: tabsClass },
      React.createElement(
        'div',
        { role: 'tablist', 'data-testid': 'tabs' },
        items.map((item: any, idx: number) =>
          React.createElement(
            'button',
            {
              key: item.key || idx,
              id: `tab-${item.key || idx}`,
              'data-testid': `tab-${item.key || idx}`,
              role: 'tab',
              'aria-selected': String(String(effectiveSelected) === String(item.key || idx)),
              'aria-controls': `panel-${item.key || idx}`,
              disabled: !!item.disabled,
              onClick: () => !item.disabled && handleChange(item.key || idx),
            },
            item.label || `Tab ${idx + 1}`
          )
        )
      ),
      // Active tab panel content
      items
        .filter((it: any) => String(it.key) === String(effectiveSelected))
        .map((active: any, i: number) =>
          React.createElement(
            'div',
            {
              key: `panel-${active.key}-${i}`,
              id: `panel-${active.key}`,
              role: 'tabpanel',
              'aria-labelledby': `tab-${active.key}`,
            },
            active.children || null
          )
        )
    );
  }),
}));

vi.mock('@/widget-library/UploadFile', () => ({
  CustomImageUploader: vi.fn(({ name, fileList = [], onChange }) => {
    const React = require('react');
    void onChange;
    const showButton = (fileList?.length || 0) < 8;
    return React.createElement(
      'div',
      { className: 'ant-upload-wrapper ant-upload-picture-circle-wrapper' },
      // Render file items by name for tests to query
      ...fileList.map((f: any, idx: number) => React.createElement('div', { key: idx }, f?.name)),
      // Conditionally render the upload button with expected DOM/text
      showButton
        ? React.createElement(
            'button',
            { type: 'button', 'data-name': name, style: { border: '0', background: 'none' } },
            React.createElement('span', { className: 'anticon-plus' }),
            'Upload'
          )
        : null
    );
  }),
}));

vi.mock('@/widget-library/AutoComplete', () => ({
  default: vi.fn((props) => {
    const React = require('react');
    return React.createElement(
      'div',
      { className: 'custom-search-input' },
      React.createElement('span', { role: 'img', 'aria-label': 'search' }),
      React.createElement('input', {
        role: 'combobox',
        placeholder: 'Search for menu, companies, vendor, invoices etc',
        'aria-autocomplete': 'list',
        'aria-haspopup': 'listbox',
        onChange: (e: any) => props?.onChange && props.onChange(e.target.value),
      })
    );
  }),
}));

// Mock shared components
vi.mock('@/shared-components/company-number/CompanyNo', () => ({
  default: vi.fn(({ companyNo, onChange }) => {
    const React = require('react');
    return React.createElement('input', { 'data-testid': 'company-number', value: companyNo, onChange });
  }),
}));

vi.mock('@/shared-components/report-filter-bar/ReportsFilterBar', () => ({
  default: vi.fn(({ onApply, onReset }) => {
    const React = require('react');
    return React.createElement('div', { 'data-testid': 'reports-filter-bar' },
      React.createElement('button', { 'data-testid': 'apply-filters', onClick: onApply }, 'Apply'),
      React.createElement('button', { 'data-testid': 'reset-filters', onClick: onReset }, 'Reset')
    );
  }),
}));

vi.mock('@/shared-components/reports-table/ReportsTable', () => ({
  default: vi.fn(() => {
    const React = require('react');
    return React.createElement('div', { 'data-testid': 'reports-table' }, 'Reports Table');
  }),
}));

// Mock additional shared components
vi.mock('@/shared-components/date-range/RangePicker', () => ({
  default: vi.fn(({ value, onChange, ...props }) => {
    const React = require('react');
    return React.createElement('input', { 
      type: 'date',
      value: value?.[0] || '',
      onChange: (e: any) => onChange && onChange([e.target.value, e.target.value]),
      'data-testid': 'range-picker',
      ...props 
    });
  }),
}));

vi.mock('@/shared-components/breadcrumbs/Breadcrumbs', () => ({
  default: vi.fn(({ items, className }) => {
    const React = require('react');
    if (items == null) return null;
    return React.createElement(
      'nav',
      { 'data-testid': 'breadcrumbs', className: `custom-breadcrumb ${className || ''}`.trim(), role: 'navigation' },
      React.createElement(
        'ol',
        null,
        ...items.map((item: any, i: number) =>
          React.createElement(
            'li',
            { key: item?.key || item?.label || item?.title || String(i), role: 'listitem' },
            i < items.length - 1 && item?.path
              ? React.createElement('a', { href: item.path }, item.label || item.title || `Item ${i + 1}`)
              : React.createElement('strong', null, item?.label || item?.title || `Item ${i + 1}`),
            i < items.length - 1 ? ' > ' : null
          )
        )
      )
    );
  }),
}));

// Mock core components
vi.mock('@/core/Header', () => ({
  default: vi.fn(() => {
    const React = require('react');
    return React.createElement(
      'header',
      { role: 'banner', className: 'custom-header flex-between' },
      React.createElement('img', { alt: 'ARG Logo', className: 'logo' }),
      React.createElement('input', { role: 'combobox' }),
      React.createElement('div', { className: 'header-left' },
        React.createElement('div', { className: 'user-dropdown-menu flex-align' },
          React.createElement('div', { className: 'user-info' }, 'Roger Philips'),
          React.createElement('div', null, 'User'),
          React.createElement('img', { alt: 'user image' }),
          React.createElement('div', { role: 'menu' },
            React.createElement('div', null, 'View Profile'),
            React.createElement('div', null, 'Change Password'),
            React.createElement('div', null, 'Settings'),
            React.createElement('div', null, 'Logout')
          )
        )
      ),
      React.createElement('div', { className: 'header-right flex-align' },
        React.createElement('span', { role: 'img', 'aria-label': 'bell' })
      )
    );
  }),
}));

vi.mock('@/core/Sidemenu', () => ({
  default: vi.fn(() => {
    const React = require('react');
    const menu = [
      { key: '/order-invoice', label: 'Order/Invoice/Product Moves' },
      { key: '/accounts-receivable', label: 'Accounts Receivable' },
      { key: '/sales-analysis', label: 'Sales Analysis' },
      { key: '/inventory', label: 'Inventory' },
      { key: '/billing-freight', label: 'Billing Freight' },
      { key: '/transportation', label: 'Transportation' },
      { key: '/accounts-payable', label: 'Accounts Payable' },
      { key: '/fixed-assets', label: 'Fixed Assets' },
      { key: '/general-ledger', label: 'General Ledger' },
      { key: '/inventory-costing', label: 'Inventory Costing' },
      { key: '/work-query', label: 'Work with Query' },
    ];
    const toggle = (e: any) => {
      const sidebar = e.currentTarget.closest('aside');
      if (!sidebar) return;
      const isCollapsed = sidebar.classList.contains('collapsed');
      if (isCollapsed) {
        sidebar.classList.remove('collapsed');
        const items = sidebar.querySelectorAll('li.menu-item');
        items.forEach((item: any) => {
          if (!item.querySelector('h5')) {
            const key = item.getAttribute('data-testid') || '';
            const label = key.replace('menu-item-', '').replace(/-/g, ' ');
            const h = document.createElement('h5');
            h.textContent = label;
            item.appendChild(h);
          }
        });
      } else {
        sidebar.classList.add('collapsed');
        const labels = sidebar.querySelectorAll('li.menu-item h5');
        labels.forEach((n: any) => n.remove());
      }
    };
    return React.createElement(
      'aside',
      { 'data-testid': 'sidebar', className: 'custom-sidebar collapsed', role: 'complementary' },
      React.createElement('button', { 'data-testid': 'toggle-button', className: 'toggle-button', onClick: toggle }, 'Toggle'),
      React.createElement(
        'ul',
        { 'data-testid': 'menu-list', className: 'menu' },
        ...menu.map((item) =>
          React.createElement(
            'li',
            { key: item.key, 'data-testid': `menu-item-${item.key.replace('/', '')}`, className: `menu-item${item.key === '/accounts-payable' ? ' active' : ''}` },
            React.createElement('div', { className: 'icon' }, React.createElement('img', { alt: item.label })),
            null
          )
        )
      )
    );
  }),
}));

vi.mock('@/core/Footer', () => ({
  default: vi.fn(() => {
    const React = require('react');
    return React.createElement('footer', { 'data-testid': 'app-footer' }, 'Footer Content');
  }),
}));

// Mock asset imports
vi.mock('@/assets/images/logo.svg', () => ({
  default: 'mock-logo.svg',
}));

vi.mock('@/assets/icons/account-payable-outlined.svg', () => ({
  default: 'mock-icon.svg',
}));

vi.mock('@/assets/icons/user-img.svg', () => ({
  default: 'mock-user.svg',
}));

vi.mock('@/assets/icons/vendor-icon.svg', () => ({
  default: 'mock-vendor.svg',
}));

// Mock additional commonly used icons
vi.mock('@/assets/icons/asset-outlined.svg', () => ({
  default: 'mock-icon.svg',
}));

vi.mock('@/assets/icons/billing-outlined.svg', () => ({
  default: 'mock-icon.svg',
}));

vi.mock('@/assets/icons/card-bank-agl-icon.svg', () => ({
  default: 'mock-icon.svg',
}));

vi.mock('@/assets/icons/popup-ok.svg', () => ({
  default: 'mock-icon.svg',
}));

// Mock any other specific icons as needed
// Note: Add individual asset mocks above for any missing icons that cause import errors 
// ---------------------------------------------------------------------------
// Note: Rely on Vitest resolve.alias for module resolution. Keep only
// purpose-built mocks below; avoid alias-bridging virtual mocks to prevent
// hoist-time module resolution issues.
// ---------------------------------------------------------------------------

// Provide light-weight mocks for additional hooks referenced by modules
vi.mock('@/hooks/useGenerateReportFiles', () => ({
  useGenerateReportFiles: vi.fn(() => ({
    generateReportFiles: vi.fn(),
    isLoading: false,
  })),
}));

vi.mock('@/hooks/useApMaintenance', () => ({
  useApMaintenance: vi.fn(() => ({
    getCompanies: vi.fn(),
    isLoading: false,
    data: [],
  })),
}));

vi.mock('@/hooks/useLmsProcess', () => ({
  useLmsEntries: vi.fn(() => ({ data: [], isLoading: false })),
  useLmsVoucherSummary: vi.fn(() => ({ data: [], isLoading: false })),
}));

vi.mock('@/hooks/usePaperProcess', () => ({
  usePaperEntries: vi.fn(() => ({ data: [], isLoading: false })),
  usePaperVoucherSummary: vi.fn(() => ({ data: [], isLoading: false })),
}));

vi.mock('@/hooks/usePostToPurchaseJournal', () => ({
  usePostToPurchaseJournal: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
}));

vi.mock('@/hooks/useDeleteVoucher', () => ({
  useDeleteVoucher: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
}));

// shared-components
// Leave shared-components to resolve via alias; tests stub where needed.

// assets
(vi as any).mock('@assets/icons/vendor-icon.svg', () => ({ default: 'mock-vendor.svg' }), { virtual: true });
(vi as any).mock('@assets/icons/file-cancel.svg', () => ({ default: 'mock-file-cancel.svg' }), { virtual: true });

// Intentionally no coarse component stubs here; tests provide their own mocks.

// Bridge usePaymentCycle calls to api-hook spies used by tests
vi.mock('@/hooks/usePaymentCycle', async () => {
  const apiHooks = await import('@/api/api-hooks');
  return {
    usePaymentCycle: () => ({
      fetchVoucherPaymentTypes: (apiHooks as any).fetchVoucherPaymentTypes,
      fetchGlMaster: (apiHooks as any).fetchGlMaster,
      submitPaymentSelectionType: (apiHooks as any).submitPaymentSelectionType,
      submitVendorPayment: vi.fn(),
      fetchCompanyMaintenance: vi.fn(),
    }),
  };
});