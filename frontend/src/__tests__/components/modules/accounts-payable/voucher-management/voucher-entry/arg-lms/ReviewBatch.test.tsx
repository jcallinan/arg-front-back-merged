import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Ensure the ReviewBatch local relative Table import is mocked to our lightweight table
vi.mock('../../../../../../../../../widget-library/Table', () => ({
  default: ({ data = [], dataSource = [], columns = [], loading = false }: any) => {
    const React = require('react');
    void columns;
    const actualData = (Array.isArray(dataSource) && dataSource.length > 0) ? dataSource : data;
    const rowCount = Array.isArray(actualData) ? actualData.length : 0;
    return React.createElement(
      'div',
      { 'data-testid': 'table-widget' },
      React.createElement('div', { 'data-testid': 'table-loading' }, loading ? 'Loading...' : 'Ready'),
      React.createElement('div', null, `Total ${rowCount} items`)
    );
  },
}));

// Mocks for LMS hooks used by ReviewBatch
const refetchSpy = vi.fn();
vi.mock('@/hooks/useLmsProcess', () => ({
  useLmsEntries: vi.fn(() => ({
    data: {
      items: [
        { id: '1', entryNo: '1', companyNo: '10', vendorNo: '100', invoiceAmount: 12.34 },
        { id: '2', entryNo: '2', companyNo: '10', vendorNo: '101', invoiceAmount: 56.78 },
      ],
    },
    isLoading: false,
    error: null,
    refetch: refetchSpy,
  })),
  useLmsVoucherSummary: vi.fn(() => ({
    data: { totalInvoiceAmount: 69.12, totalRecords: 2 },
    isLoading: false,
  })),
}));

// Avoid edit path triggering extra queries
vi.mock('@/hooks/useVoucherByEntryNo', () => ({
  useVoucherByEntryNo: vi.fn(() => ({ data: null, error: null })),
}));

// SUT
import ReviewBatch from '@/modules/accounts-payable/voucher-management/sub-modules/voucher-entry/process-types/arg-lms/tabs/review-batch/ReviewBatch';

const renderWithRouter = (ui: React.ReactElement) => render(<MemoryRouter>{ui}</MemoryRouter>);
const ReviewBatchAny = ReviewBatch as any;

describe('LMS ReviewBatch (lightweight)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders table with data', () => {
    renderWithRouter(<ReviewBatchAny />);
    expect(screen.getByTestId('table-widget')).toBeInTheDocument();
    expect(screen.getByTestId('table-loading')).toHaveTextContent(/Ready/i);
  });

  it('refreshData ref method triggers refetch', () => {
    const ref = { current: null as any };
    renderWithRouter(<ReviewBatchAny ref={ref} />);
    expect(typeof ref.current?.refreshData).toBe('function');
    ref.current.refreshData();
    expect(refetchSpy).toHaveBeenCalled();
  });
});


