import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Ensure the ReviewBatch local relative Table import is mocked to our lightweight table
vi.mock('../../../../../../../../../widget-library/Table', () => ({
  default: ({ data = [], dataSource = [], columns = [], loading = false }: any) => {
    const React = require('react');
    void columns;
    const actualData =
      Array.isArray(dataSource) && dataSource.length > 0 ? dataSource : data;
    const rowCount = Array.isArray(actualData) ? actualData.length : 0;
    return React.createElement(
      'div',
      { 'data-testid': 'table-widget' },
      React.createElement(
        'div',
        { 'data-testid': 'table-loading' },
        loading ? 'Loading...' : 'Ready',
      ),
      React.createElement('div', null, `Total ${rowCount} items`),
    );
  },
}));

// Stub react-query client to avoid needing a real QueryClientProvider
vi.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({
    invalidateQueries: vi.fn(),
  }),
}));

// Mocks for Paper hooks used by ReviewBatch
vi.mock('@/hooks/usePaperProcess', () => ({
  usePaperEntries: vi.fn(() => ({
    data: {
      items: [
        { id: 'p1', entryNo: '11', companyNo: '10', vendorNo: '200', invoiceAmount: 10 },
      ],
    },
    isLoading: false,
    error: null,
  })),
  usePaperVoucherSummary: vi.fn(() => ({
    data: { totalInvoiceAmount: 10, totalRecords: 1 },
    isLoading: false,
  })),
}));

// Avoid react-query path used inside Paper ReviewBatch
vi.mock('@/hooks/useVoucherByEntryNo', () => ({
  useVoucherByEntryNo: vi.fn(() => ({ data: null, error: null })),
}));

// SUT
import ReviewBatch from '@/modules/accounts-payable/voucher-management/sub-modules/voucher-entry/process-types/paper/tabs/review-batch/ReviewBatch';

const renderWithRouter = (ui: React.ReactElement) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe('Paper ReviewBatch (lightweight)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders table with data', () => {
    renderWithRouter(<ReviewBatch /> as any);
    expect(screen.getByTestId('table-widget')).toBeInTheDocument();
    expect(screen.getByTestId('table-loading')).toHaveTextContent(/Ready/i);
  });
});


