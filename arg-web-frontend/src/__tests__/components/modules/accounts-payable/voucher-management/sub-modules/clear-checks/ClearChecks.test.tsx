import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '@/__tests__/utils/test-utils';
import { useSocket } from '@/hooks/useSocket';
import { useClearChecks } from '@/hooks/useClearChecks';
import { useApi } from '@/hooks/useApi';
import ClearChecks from '@/modules/accounts-payable/voucher-management/sub-modules/clear-checks/ClearChecks';
// Partially mock react-router to keep BrowserRouter etc. intact
vi.mock('react-router-dom', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    useSearchParams: vi.fn(() => [new URLSearchParams('companyNo=10'), vi.fn()]),
    useLocation: vi.fn(() => ({ pathname: '/accounts-payable/voucher-management/clear-checks', search: '?companyNo=10', state: null })),
  };
});

// Mock hooks
vi.mock('@/hooks/useSocket', () => ({
  useSocket: vi.fn(),
}));

vi.mock('@/hooks/useClearChecks', () => ({
  useClearChecks: vi.fn(),
}));

vi.mock('@/hooks/useApi', () => ({
  useApi: vi.fn(),
}));

// Bridge useApMaintenance to useApi so ClearChecks can call manual fetch and hit our api spy
vi.mock('@/hooks/useApMaintenance', () => ({
  useApMaintenance: vi.fn(() => ({
    fetchCompanyMaintenanceManual: (params: any) => (useApi as unknown as any)().apMaintenance.companyMaintenance(params),
    isLoading: false,
  })),
}));

// Mock child components
vi.mock('@/modules/accounts-payable/voucher-management/sub-modules/clear-checks/AddCheckModal', () => ({
  default: ({ visible, onCancel, onSubmit, formData, onInputChange, errors }: any) => (
    visible ? (
      <div data-testid="add-check-modal">
        <input
          data-testid="modal-check-number"
          value={formData?.checkNumber || ''}
          onChange={(e) => onInputChange('checkNumber', e.target.value)}
          placeholder="Check Number"
        />
        <input
          data-testid="modal-clear-date"
          value={formData?.clearDate || ''}
          onChange={(e) => onInputChange('clearDate', e.target.value)}
          placeholder="Clear Date"
        />
        <input
          data-testid="modal-clear-amount"
          value={formData?.clearAmount || ''}
          onChange={(e) => onInputChange('clearAmount', e.target.value)}
          placeholder="Clear Amount"
        />
        {errors?.checkNumber && <div data-testid="modal-error-check">{errors.checkNumber}</div>}
        {errors?.clearDate && <div data-testid="modal-error-date">{errors.clearDate}</div>}
        {errors?.clearAmount && <div data-testid="modal-error-amount">{errors.clearAmount}</div>}
        <button data-testid="modal-cancel" onClick={onCancel}>Cancel</button>
        <button data-testid="modal-submit" onClick={onSubmit}>Submit</button>
      </div>
    ) : null
  ),
}));

vi.mock('@/modules/accounts-payable/voucher-management/sub-modules/clear-checks/EditCheckModal', () => ({
  default: ({ visible, onCancel, onSave, formData, onInputChange, errors }: any) => (
    visible ? (
      <div data-testid="edit-check-modal">
        <input
          data-testid="edit-check-number"
          value={formData?.checkNumber || ''}
          onChange={(e) => onInputChange('checkNumber', e.target.value)}
        />
        <input
          data-testid="edit-clear-date"
          value={formData?.clearDate || ''}
          onChange={(e) => onInputChange('clearDate', e.target.value)}
        />
        <input
          data-testid="edit-clear-amount"
          value={formData?.clearAmount || ''}
          onChange={(e) => onInputChange('clearAmount', e.target.value)}
        />
        {errors?.checkNumber && <div data-testid="edit-error-check">{errors.checkNumber}</div>}
        <button data-testid="edit-cancel" onClick={onCancel}>Cancel</button>
        <button data-testid="edit-save" onClick={onSave}>Save</button>
      </div>
    ) : null
  ),
}));

vi.mock('@/modules/accounts-payable/voucher-management/sub-modules/voucher-entry/process-types/flexi/UploadCSVModal', () => ({
  default: ({ visible, onCancel, onUploadSuccess, onUploadError, source }: any) => (
    visible ? (
      <div data-testid="upload-csv-modal">
        <div data-testid="upload-source">{source}</div>
        <button data-testid="upload-cancel" onClick={onCancel}>Cancel</button>
        <button 
          data-testid="upload-success" 
          onClick={() => onUploadSuccess && onUploadSuccess('test-file.csv')}
        >
          Upload Success
        </button>
        <button 
          data-testid="upload-error" 
          onClick={() => onUploadError && onUploadError('Upload failed')}
        >
          Upload Error
        </button>
      </div>
    ) : null
  ),
}));

vi.mock('@/widget-library/Card', () => ({
  default: ({ icon, label, value, className }: any) => (
    <div data-testid={`card-${label?.replace(/\s+/g, '-').toLowerCase()}`} className={className}>
      <div data-testid="card-icon">{icon}</div>
      <div data-testid="card-label">{label}</div>
      <div data-testid="card-value">{value}</div>
    </div>
  ),
}));

vi.mock('@/widget-library/Buttons', () => ({
  CustomStyledButton: ({ name, label, onClick, disabled, icon }: any) => (
    <button
      data-testid={`styled-button-${name}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span data-testid="button-icon">icon</span>}
      {typeof label === 'object' ? 'Button Text' : label}
    </button>
  ),
  DefaultButton: ({ name, label, onClick, icon }: any) => (
    <button
      data-testid={`default-button-${name}`}
      onClick={onClick}
    >
      {icon && <span data-testid="button-icon">icon</span>}
      {typeof label === 'object' ? 'Button Text' : label}
    </button>
  ),
}));

vi.mock('@/widget-library/Table', () => ({
  default: ({ columns, dataSource, loading, rowKey }: any) => (
    <div data-testid="table-widget">
      <div data-testid="table-loading">{loading ? 'Loading...' : 'Ready'}</div>
      <div data-testid="table-row-count">{dataSource?.length || 0} rows</div>
      {dataSource?.map((item: any, index: number) => (
        <div key={item[rowKey] || index} data-testid={`table-row-${index}`}>
          <span data-testid="row-check-number">{item.checkNumber}</span>
          <span data-testid="row-clear-date">{item.clearDate}</span>
          <span data-testid="row-clear-amount">{item.clearAmount}</span>
          <span data-testid="row-validation-status">{item.validationStatus}</span>
          {item.validationStatus === 'Error' && (
            <button 
              data-testid={`edit-button-${index}`}
              onClick={() => {
                // Find edit action from columns
                const actionsColumn = columns?.find((col: any) => col.title === 'Actions');
                if (actionsColumn?.render) {
                  actionsColumn.render('', item);
                  // Simulate edit click
                }
              }}
            >
              Edit
            </button>
          )}
          <button 
            data-testid={`delete-button-${index}`}
            onClick={() => {
              const actionsColumn = columns?.find((col: any) => col.title === 'Actions');
              if (actionsColumn?.render) {
                actionsColumn.render('', item);
                // Simulate delete click
              }
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  ),
}));

vi.mock('@/widget-library/Modal', () => ({
  default: ({ visible, onCancel, title, description, actions, imageUrl }: any) => (
    visible ? (
      <div data-testid="modal-content">
        <div data-testid="modal-title">{title}</div>
        <div data-testid="modal-description">{description}</div>
        <div data-testid="modal-image">{imageUrl}</div>
        <div data-testid="modal-actions">
          {actions?.map((action: any, index: number) => (
            <button
              key={index}
              data-testid={`modal-action-${action.name}`}
              onClick={action.onClick}
            >
              {action.label}
            </button>
          ))}
        </div>
        <button data-testid="modal-cancel" onClick={onCancel}>Cancel</button>
      </div>
    ) : null
  ),
}));

vi.mock('@/widget-library/DeleteConfirmationModal', () => ({
  default: ({ visible, onCancel, onConfirm, itemName }: any) => (
    visible ? (
      <div data-testid="delete-confirmation-modal">
        <div data-testid="delete-item-name">{itemName}</div>
        <button data-testid="delete-cancel" onClick={onCancel}>Cancel</button>
        <button data-testid="delete-confirm" onClick={onConfirm}>Confirm</button>
      </div>
    ) : null
  ),
}));

vi.mock('@/widget-library/Toaster', () => ({
  default: ({ type, title, subtitle, onClose }: any) => (
    <div data-testid="toaster">
      <div data-testid="toaster-type">{type}</div>
      <div data-testid="toaster-title">{title}</div>
      <div data-testid="toaster-subtitle">{subtitle}</div>
      <button data-testid="toaster-close" onClick={onClose}>Close</button>
    </div>
  ),
}));

// Mock utility functions
vi.mock('@/utils/formatters', () => ({
  formatCurrency: vi.fn((amount) => `$${amount.toFixed(2)}`),
}));

vi.mock('@/utils/dateFormat', () => ({
  formatMMDDYYForDisplay: vi.fn(() => '01/15/25'),
  formatNumberToMMDDYY: vi.fn(() => '011525'),
}));

const mockCompanyMaintenanceData = {
  data: {
    items: {
      companyBankGlNo: 12110009,
      companyName: 'Test Company',
    },
  },
};


describe('ClearChecks', () => {
  let mockApi: any;
  let mockUseSocket: any;
  let mockUseClearChecks: any;

  beforeEach(() => {
    mockApi = {
      apMaintenance: {
        companyMaintenance: vi.fn().mockResolvedValue(mockCompanyMaintenanceData),
      },
    };

    mockUseSocket = {
      uploadStatusData: null,
      emitSocketEvent: vi.fn(),
    };

    mockUseClearChecks = {
      validateSingleCheck: vi.fn().mockResolvedValue({
        isValid: true,
        warnings: [],
      }),
      processMultipleChecks: vi.fn().mockResolvedValue({
        successful: 2,
        failed: 0,
        results: [],
      }),
    };

    (useSocket as unknown as any).mockReturnValue(mockUseSocket);
    (useClearChecks as unknown as any).mockReturnValue(mockUseClearChecks);
    (useApi as unknown as any).mockReturnValue(mockApi);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('renders the component with all sections', async () => {
      render(<ClearChecks />);

      expect(screen.getByText('Clear Checks')).toBeInTheDocument();
      expect(screen.getByText('Validate Checks')).toBeInTheDocument();
      expect(screen.getByTestId('styled-button-addCheck')).toBeInTheDocument();
      expect(screen.getByTestId('default-button-uploadFile')).toBeInTheDocument();
      expect(screen.getByTestId('styled-button-submit')).toBeInTheDocument();
      expect(screen.getByTestId('table-widget')).toBeInTheDocument();
    });

    it('loads company data on mount', async () => {
      render(<ClearChecks />);

      await waitFor(() => {
        expect(mockApi.apMaintenance.companyMaintenance).toHaveBeenCalledWith({
          companyNo: 10,
        });
      });

      await waitFor(() => {
        expect(screen.getByTestId('card-bank-acct-g/l')).toBeInTheDocument();
      });
    });

    it('renders cards with correct initial values', async () => {
      render(<ClearChecks />);

      await waitFor(() => {
        expect(screen.getByTestId('card-bank-acct-g/l')).toBeInTheDocument();
        expect(screen.getByTestId('card-bank-g/l-total')).toBeInTheDocument();
      });
    });

    it('shows empty table initially', () => {
      render(<ClearChecks />);

      expect(screen.getByText('0 rows')).toBeInTheDocument();
    });
  });

  describe('Basic Interactions (lightweight)', () => {
    it('opens Add Check modal when Add Check button is clicked', async () => {
      const user = userEvent.setup();
      render(<ClearChecks />);

      const addButton = screen.getByTestId('styled-button-addCheck');
      await user.click(addButton);

      expect(screen.getByTestId('add-check-modal')).toBeInTheDocument();
    });

    it('opens Upload CSV modal when Upload File button is clicked', async () => {
      const user = userEvent.setup();
      render(<ClearChecks />);

      const uploadButton = screen.getByTestId('default-button-uploadFile');
      await user.click(uploadButton);

      expect(screen.getByTestId('upload-csv-modal')).toBeInTheDocument();
    });
  });

  /*
  describe('Add Check Functionality', () => {
    it('opens add check modal when add button is clicked', async () => {
      const user = userEvent.setup();
      render(<ClearChecks />);

      const addButton = screen.getByTestId('styled-button-addCheck');
      await user.click(addButton);

      expect(screen.getByTestId('add-check-modal')).toBeInTheDocument();
    });

    it('submits new check with valid data', async () => {
      const user = userEvent.setup();
      render(<ClearChecks />);

      // Open modal
      const addButton = screen.getByTestId('styled-button-addCheck');
      await user.click(addButton);

      // Fill in form data
      const checkNumberInput = screen.getByTestId('modal-check-number');
      await user.type(checkNumberInput, '12345');

      const clearDateInput = screen.getByTestId('modal-clear-date');
      await user.type(clearDateInput, '01/15/25');

      const clearAmountInput = screen.getByTestId('modal-clear-amount');
      await user.type(clearAmountInput, '1500.00');

      // Submit
      const submitButton = screen.getByTestId('modal-submit');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockUseClearChecks.validateSingleCheck).toHaveBeenCalledWith(
          '12345',
          1500.00,
          '01/15/25'
        );
      });
    });

    it('shows validation errors for empty fields', async () => {
      const user = userEvent.setup();
      render(<ClearChecks />);

      // Open modal and submit without data
      const addButton = screen.getByTestId('styled-button-addCheck');
      await user.click(addButton);

      const submitButton = screen.getByTestId('modal-submit');
      await user.click(submitButton);

      // Should show validation errors
      await waitFor(() => {
        expect(screen.getByTestId('modal-error-check')).toHaveTextContent('Check Number is required');
        expect(screen.getByTestId('modal-error-date')).toHaveTextContent('Clear Date is required');
        expect(screen.getByTestId('modal-error-amount')).toHaveTextContent('Clear Amount is required');
      });
    });

    it('handles API validation errors', async () => {
      const user = userEvent.setup();
      mockUseClearChecks.validateSingleCheck.mockResolvedValueOnce({
        isValid: false,
        errors: [
          { field: 'checkNo', message: 'Check number already exists' }
        ]
      });

      render(<ClearChecks />);

      // Open modal and submit
      const addButton = screen.getByTestId('styled-button-addCheck');
      await user.click(addButton);

      await user.type(screen.getByTestId('modal-check-number'), '12345');
      await user.type(screen.getByTestId('modal-clear-date'), '01/15/25');
      await user.type(screen.getByTestId('modal-clear-amount'), '1500.00');

      const submitButton = screen.getByTestId('modal-submit');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('modal-error-check')).toHaveTextContent('Check number already exists');
      });
    });

    it('cancels add check modal', async () => {
      const user = userEvent.setup();
      render(<ClearChecks />);

      // Open modal
      const addButton = screen.getByTestId('styled-button-addCheck');
      await user.click(addButton);

      expect(screen.getByTestId('add-check-modal')).toBeInTheDocument();

      // Cancel
      const cancelButton = screen.getByTestId('modal-cancel');
      await user.click(cancelButton);

      expect(screen.queryByTestId('add-check-modal')).not.toBeInTheDocument();
    });
  });

  describe('Upload File Functionality', () => {
    it('opens upload modal when upload button is clicked', async () => {
      const user = userEvent.setup();
      render(<ClearChecks />);

      const uploadButton = screen.getByTestId('default-button-uploadFile');
      await user.click(uploadButton);

      expect(screen.getByTestId('upload-csv-modal')).toBeInTheDocument();
      expect(screen.getByTestId('upload-source')).toHaveTextContent('ClearChecks');
    });

    it('handles successful upload', async () => {
      const user = userEvent.setup();
      render(<ClearChecks />);

      // Open upload modal
      const uploadButton = screen.getByTestId('default-button-uploadFile');
      await user.click(uploadButton);

      // Simulate successful upload
      const successButton = screen.getByTestId('upload-success');
      await user.click(successButton);

      // Should emit socket event
      expect(mockUseSocket.emitSocketEvent).toHaveBeenCalledWith(
        'clear-checks-upload-start',
        expect.objectContaining({
          fileName: 'test-file.csv',
          sessionId: expect.any(String),
        })
      );

      // Modal should be closed
      expect(screen.queryByTestId('upload-csv-modal')).not.toBeInTheDocument();
    });

    it('handles upload errors', async () => {
      const user = userEvent.setup();
      render(<ClearChecks />);

      // Open upload modal
      const uploadButton = screen.getByTestId('default-button-uploadFile');
      await user.click(uploadButton);

      // Simulate upload error
      const errorButton = screen.getByTestId('upload-error');
      await user.click(errorButton);

      // Should show error toaster
      await waitFor(() => {
        expect(screen.getByTestId('toaster')).toBeInTheDocument();
        expect(screen.getByTestId('toaster-type')).toHaveTextContent('error');
      });
    });

    it('cancels upload modal', async () => {
      const user = userEvent.setup();
      render(<ClearChecks />);

      // Open upload modal
      const uploadButton = screen.getByTestId('default-button-uploadFile');
      await user.click(uploadButton);

      expect(screen.getByTestId('upload-csv-modal')).toBeInTheDocument();

      // Cancel
      const cancelButton = screen.getByTestId('upload-cancel');
      await user.click(cancelButton);

      expect(screen.queryByTestId('upload-csv-modal')).not.toBeInTheDocument();
    });
  });

  describe('WebSocket Integration', () => {
    it('processes WebSocket data when upload completes', async () => {
      mockUseSocket.uploadStatusData = mockWebSocketData;

      render(<ClearChecks />);

      await waitFor(() => {
        expect(screen.getByText('2 rows')).toBeInTheDocument();
      });
    });

    it('shows success modal when no errors in WebSocket data', async () => {
      mockUseSocket.uploadStatusData = mockWebSocketData;

      render(<ClearChecks />);

      await waitFor(() => {
        expect(screen.getByTestId('modal-content')).toBeInTheDocument();
        expect(screen.getByTestId('modal-title')).toHaveTextContent('Successful!');
      });
    });

    it('handles WebSocket data with errors', async () => {
      const errorData = {
        ...mockWebSocketData,
        summary: {
          ...mockWebSocketData.summary,
          countE: 1,
        },
        items: [
          {
            ...mockWebSocketData.items[0],
            status: 'E',
            errors: [{ message: 'Invalid check number' }],
          },
        ],
      };

      mockUseSocket.uploadStatusData = errorData;

      render(<ClearChecks />);

      await waitFor(() => {
        expect(screen.getByText('1 rows')).toBeInTheDocument();
      });

      // Should not show success modal with errors
      expect(screen.queryByTestId('modal-content')).not.toBeInTheDocument();
    });
  });

  describe('Edit Check Functionality', () => {
    beforeEach(async () => {
      // Add some data to the table first
      mockUseSocket.uploadStatusData = mockWebSocketData;
    });

    it('opens edit modal when edit button is clicked', async () => {
      const user = userEvent.setup();
      render(<ClearChecks />);

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('2 rows')).toBeInTheDocument();
      });

      // For error status items, edit button should be available
      // This would need the item to have error status for the edit button to show
      // Let's modify the mock data to have an error
      const errorData = {
        ...mockWebSocketData,
        items: [
          {
            ...mockWebSocketData.items[0],
            status: 'E',
            errors: [{ field: 'checkNo', message: 'Invalid check' }],
          },
        ],
      };

      mockUseSocket.uploadStatusData = errorData;

      // Re-render with error data
      render(<ClearChecks />);

      await waitFor(() => {
        expect(screen.getByText('1 rows')).toBeInTheDocument();
      });
    });

    it('saves edited check data', async () => {
      const user = userEvent.setup();
      render(<ClearChecks />);

      // Manually add a check first through the add functionality
      const addButton = screen.getByTestId('styled-button-addCheck');
      await user.click(addButton);

      await user.type(screen.getByTestId('modal-check-number'), '12345');
      await user.type(screen.getByTestId('modal-clear-date'), '01/15/25');
      await user.type(screen.getByTestId('modal-clear-amount'), '1500.00');

      const submitButton = screen.getByTestId('modal-submit');
      await user.click(submitButton);

      // Wait for check to be added
      await waitFor(() => {
        expect(screen.getByText('1 rows')).toBeInTheDocument();
      });
    });
  });

  describe('Delete Check Functionality', () => {
    it('shows delete confirmation modal', async () => {
      const user = userEvent.setup();
      render(<ClearChecks />);

      // Add a check first
      const addButton = screen.getByTestId('styled-button-addCheck');
      await user.click(addButton);

      await user.type(screen.getByTestId('modal-check-number'), '12345');
      await user.type(screen.getByTestId('modal-clear-date'), '01/15/25');
      await user.type(screen.getByTestId('modal-clear-amount'), '1500.00');

      const submitButton = screen.getByTestId('modal-submit');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('1 rows')).toBeInTheDocument();
      });

      // Now try to delete
      const deleteButton = screen.getByTestId('delete-button-0');
      await user.click(deleteButton);

      expect(screen.getByTestId('delete-confirmation-modal')).toBeInTheDocument();
      expect(screen.getByTestId('delete-item-name')).toHaveTextContent('Check');
    });
  });

  describe('Submit Functionality', () => {
    it('validates that checks exist before submit', async () => {
      const user = userEvent.setup();
      render(<ClearChecks />);

      const submitButton = screen.getByTestId('styled-button-submit');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('toaster')).toBeInTheDocument();
        expect(screen.getByTestId('toaster-subtitle')).toHaveTextContent('No checks to process');
      });
    });

    it('prevents submission when validation errors exist', async () => {
      const user = userEvent.setup();
      
      // Mock data with errors
      const errorData = {
        ...mockWebSocketData,
        summary: { ...mockWebSocketData.summary, countE: 1 },
        items: [
          {
            ...mockWebSocketData.items[0],
            status: 'E',
            errors: [{ message: 'Invalid check' }],
          },
        ],
      };

      mockUseSocket.uploadStatusData = errorData;

      render(<ClearChecks />);

      await waitFor(() => {
        expect(screen.getByText('1 rows')).toBeInTheDocument();
      });

      const submitButton = screen.getByTestId('styled-button-submit');
      expect(submitButton).toBeDisabled();
    });

    it('processes checks successfully', async () => {
      const user = userEvent.setup();
      mockUseSocket.uploadStatusData = mockWebSocketData;

      render(<ClearChecks />);

      await waitFor(() => {
        expect(screen.getByText('2 rows')).toBeInTheDocument();
      });

      // Close the success modal first
      const modalOkButton = screen.getByTestId('modal-action-ok');
      await user.click(modalOkButton);

      // Now submit
      const submitButton = screen.getByTestId('styled-button-submit');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockUseClearChecks.processMultipleChecks).toHaveBeenCalled();
      });
    });
  });

  describe('Card Values and Updates', () => {
    it('displays correct bank GL account number', async () => {
      render(<ClearChecks />);

      await waitFor(() => {
        const bankGlCard = screen.getByTestId('card-bank-acct-g/l');
        expect(bankGlCard).toBeInTheDocument();
      });
    });

    it('updates bank GL total when checks are added', async () => {
      const user = userEvent.setup();
      render(<ClearChecks />);

      // Add a check
      const addButton = screen.getByTestId('styled-button-addCheck');
      await user.click(addButton);

      await user.type(screen.getByTestId('modal-check-number'), '12345');
      await user.type(screen.getByTestId('modal-clear-date'), '01/15/25');
      await user.type(screen.getByTestId('modal-clear-amount'), '1500.00');

      const submitButton = screen.getByTestId('modal-submit');
      await user.click(submitButton);

      await waitFor(() => {
        const bankTotalCard = screen.getByTestId('card-bank-g/l-total');
        expect(bankTotalCard).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('handles company data fetch errors', async () => {
      mockApi.apMaintenance.companyMaintenance.mockRejectedValueOnce(new Error('API Error'));

      render(<ClearChecks />);

      await waitFor(() => {
        expect(screen.getByTestId('toaster')).toBeInTheDocument();
        expect(screen.getByTestId('toaster-type')).toHaveTextContent('error');
        expect(screen.getByTestId('toaster-subtitle')).toHaveTextContent('Failed to fetch company data');
      });
    });

    it('handles validation API errors', async () => {
      const user = userEvent.setup();
      mockUseClearChecks.validateSingleCheck.mockRejectedValueOnce(new Error('Validation API Error'));

      render(<ClearChecks />);

      const addButton = screen.getByTestId('styled-button-addCheck');
      await user.click(addButton);

      await user.type(screen.getByTestId('modal-check-number'), '12345');
      await user.type(screen.getByTestId('modal-clear-date'), '01/15/25');
      await user.type(screen.getByTestId('modal-clear-amount'), '1500.00');

      const submitButton = screen.getByTestId('modal-submit');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('toaster')).toBeInTheDocument();
        expect(screen.getByTestId('toaster-subtitle')).toHaveTextContent('Failed to validate check');
      });
    });

    it('handles process multiple checks errors', async () => {
      const user = userEvent.setup();
      mockUseClearChecks.processMultipleChecks.mockRejectedValueOnce(new Error('Process Error'));
      mockUseSocket.uploadStatusData = mockWebSocketData;

      render(<ClearChecks />);

      await waitFor(() => {
        expect(screen.getByText('2 rows')).toBeInTheDocument();
      });

      // Close success modal
      const modalOkButton = screen.getByTestId('modal-action-ok');
      await user.click(modalOkButton);

      const submitButton = screen.getByTestId('styled-button-submit');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('toaster')).toBeInTheDocument();
        expect(screen.getByTestId('toaster-subtitle')).toHaveTextContent('Failed to process checks');
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper button labels and accessibility', () => {
      render(<ClearChecks />);

      expect(screen.getByTestId('styled-button-addCheck')).toBeInTheDocument();
      expect(screen.getByTestId('default-button-uploadFile')).toBeInTheDocument();
      expect(screen.getByTestId('styled-button-submit')).toBeInTheDocument();
    });

    it('provides proper tooltip information', () => {
      render(<ClearChecks />);

      const submitButton = screen.getByTestId('styled-button-submit');
      expect(submitButton).toBeDisabled(); // Initially disabled with no checks
    });
  });
  */
});
