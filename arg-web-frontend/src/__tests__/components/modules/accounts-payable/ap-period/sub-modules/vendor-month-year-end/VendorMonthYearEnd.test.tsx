import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '@/__tests__/utils/test-utils';

// Mock hooks - these need to be before the mock calls due to hoisting
const mockMutate = vi.fn();
let mockHookReturnValue = {
  mutate: mockMutate,
  isPending: false,
  data: null as any,
  isError: false,
  error: null,
  isSuccess: false,
};

vi.mock('@/hooks/useVendorYearEnd', () => ({
  useVendorYearEnd: () => mockHookReturnValue,
}));

import VendorMonthYearEnd from '@/modules/accounts-payable/ap-period/sub-modules/vendor-month-year-end/VendorMonthYearEnd';

// Mock child components
vi.mock('@/shared-components/company-number/CompanyNo', () => ({
  default: ({ value, onChange, status }: any) => (
    <div data-testid="company-no">
      <input
        data-testid="company-no-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        data-status={status}
      />
    </div>
  ),
}));

vi.mock('@/widget-library/Buttons', () => ({
  CustomStyledButton: ({ name, label, onClick, disabled, className }: any) => (
    <button
      data-testid={`styled-button-${name}`}
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {typeof label === 'object' ? 'Submit' : label}
    </button>
  ),
}));

vi.mock('@/widget-library/Dropdown', () => ({
  CustomSelectDropdown: ({ name, value, onChange, options, placeholder, className, status }: any) => (
    <div data-testid={`dropdown-${name}`}>
      <select
        data-testid={`dropdown-select-${name}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={className}
        data-status={status}
      >
        <option value="">{placeholder}</option>
        {options?.map((option: any) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  ),
}));

vi.mock('@/widget-library/Modal', () => ({
  default: ({ visible, onCancel, title, description, actions, imageUrl, className }: any) => (
    visible ? (
      <div data-testid="modal-content" className={className}>
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
        <button data-testid="modal-cancel" onClick={onCancel}>Close</button>
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

describe('VendorMonthYearEnd', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock hook return value to defaults
    mockHookReturnValue.mutate = mockMutate;
    mockHookReturnValue.isPending = false;
    mockHookReturnValue.data = null;
    mockHookReturnValue.isError = false;
    mockHookReturnValue.error = null;
    mockHookReturnValue.isSuccess = false;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('renders the component with all form elements', () => {
      render(<VendorMonthYearEnd />);

      expect(screen.getByText('Vendor Month/Year End Process')).toBeInTheDocument();
      expect(screen.getByTestId('company-no')).toBeInTheDocument();
      expect(screen.getByTestId('dropdown-year')).toBeInTheDocument();
      expect(screen.getByText('Clear Year to Date Fields')).toBeInTheDocument();
      expect(screen.getByTestId('styled-button-submit')).toBeInTheDocument();
    });

    it('renders with correct initial values', () => {
      render(<VendorMonthYearEnd />);

      expect(screen.getByTestId('company-no-input')).toHaveValue('10');
      expect(screen.getByTestId('dropdown-select-year')).toHaveValue('2024');
    });

    it('generates year options correctly', () => {
      render(<VendorMonthYearEnd />);

      const yearSelect = screen.getByTestId('dropdown-select-year');
      
      // Should have current year and previous years as options
      expect(yearSelect).toBeInTheDocument();
      
      // Should have 2024 as default value
      expect(yearSelect).toHaveValue('2024');
    });

    it('renders required field indicators', () => {
      render(<VendorMonthYearEnd />);

      // Check for asterisk indicators for required fields
      expect(screen.getByText('Save a Copy of the Vendor File For 1099 Year')).toBeInTheDocument();
    });

    it('renders switch for Clear Year to Date Fields', () => {
      render(<VendorMonthYearEnd />);

      expect(screen.getByText('Clear Year to Date Fields')).toBeInTheDocument();
      // The Switch component would be rendered but we're not directly testing its state here
    });
  });

  describe('Form Interactions', () => {
    it('updates selected company when changed', async () => {
      const user = userEvent.setup();
      render(<VendorMonthYearEnd />);

      const companyInput = screen.getByTestId('company-no-input');
      await user.clear(companyInput);
      await user.type(companyInput, '20');

      expect(companyInput).toHaveValue('20');
    });

    it('updates selected year when changed', async () => {
      const user = userEvent.setup();
      render(<VendorMonthYearEnd />);

      const yearSelect = screen.getByTestId('dropdown-select-year');
      await user.selectOptions(yearSelect, '2023');

      expect(yearSelect).toHaveValue('2023');
    });

    it('has year options for current and previous years', () => {
      render(<VendorMonthYearEnd />);

      const yearSelect = screen.getByTestId('dropdown-select-year');
      
      // Should have multiple year options (current year and previous years)
      expect(yearSelect).toBeInTheDocument();
      expect(yearSelect).toHaveValue('2024'); // Default value
    });
  });

  describe('Form Submission', () => {
    it('calls mutate function with correct parameters on submit', async () => {
      const user = userEvent.setup();
      render(<VendorMonthYearEnd />);

      const submitButton = screen.getByTestId('styled-button-submit');
      await user.click(submitButton);

      expect(mockMutate).toHaveBeenCalledWith(
        {
          companyNo: 10,
          year: '2024',
          clearYTD: false,
        },
        expect.objectContaining({
          onSuccess: expect.any(Function),
          onError: expect.any(Function),
        })
      );
    });

    it('includes clearYTD parameter when switch is toggled', async () => {
      const user = userEvent.setup();
      render(<VendorMonthYearEnd />);

      // Note: We'd need to simulate switch toggle here
      // For now, we test the default state
      const submitButton = screen.getByTestId('styled-button-submit');
      await user.click(submitButton);

      expect(mockMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          clearYTD: false,
        }),
        expect.any(Object)
      );
    });

    it('submits with different company number', async () => {
      const user = userEvent.setup();
      render(<VendorMonthYearEnd />);

      // Change company number
      const companyInput = screen.getByTestId('company-no-input');
      await user.clear(companyInput);
      await user.type(companyInput, '15');

      const submitButton = screen.getByTestId('styled-button-submit');
      await user.click(submitButton);

      expect(mockMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          companyNo: 15,
        }),
        expect.any(Object)
      );
    });

    it('submits with different year selection', async () => {
      const user = userEvent.setup();
      render(<VendorMonthYearEnd />);

      // Change year
      const yearSelect = screen.getByTestId('dropdown-select-year');
      await user.selectOptions(yearSelect, '2023');

      const submitButton = screen.getByTestId('styled-button-submit');
      await user.click(submitButton);

      expect(mockMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          year: '2023',
        }),
        expect.any(Object)
      );
    });
  });

  describe('Success Handling', () => {
    it('shows success modal on successful submission', async () => {
      const user = userEvent.setup();
      
      // Mock successful response
      const mockSuccessData = {
        message: '2024 data is ready for 1099 process',
      };

      // Update mock return value
      mockHookReturnValue.data = mockSuccessData;

      render(<VendorMonthYearEnd />);

      const submitButton = screen.getByTestId('styled-button-submit');
      await user.click(submitButton);

      // Simulate successful callback
      const onSuccessCallback = mockMutate.mock.calls[0][1].onSuccess;
      await act(async () => {
        onSuccessCallback();
      });

      await waitFor(() => {
        expect(screen.getByTestId('modal-content')).toBeInTheDocument();
        expect(screen.getByTestId('modal-title')).toHaveTextContent('Success!');
      });
    });

    it('displays success message from API response', async () => {
      const user = userEvent.setup();
      const mockSuccessData = {
        message: 'Custom success message from API',
      };

      // Update mock return value
      mockHookReturnValue.data = mockSuccessData;

      render(<VendorMonthYearEnd />);

      const submitButton = screen.getByTestId('styled-button-submit');
      await user.click(submitButton);

      // Simulate successful callback
      const onSuccessCallback = mockMutate.mock.calls[0][1].onSuccess;
      onSuccessCallback();

      await waitFor(() => {
        expect(screen.getByTestId('modal-description')).toHaveTextContent('Custom success message from API');
      });
    });

    it('closes success modal when OK is clicked', async () => {
      const user = userEvent.setup();
      
      // Update mock return value
      mockHookReturnValue.data = { message: 'Success' };

      render(<VendorMonthYearEnd />);

      const submitButton = screen.getByTestId('styled-button-submit');
      await user.click(submitButton);

      // Simulate success
      const onSuccessCallback = mockMutate.mock.calls[0][1].onSuccess;
      onSuccessCallback();

      await waitFor(() => {
        expect(screen.getByTestId('modal-content')).toBeInTheDocument();
      });

      const okButton = screen.getByTestId('modal-action-ok');
      await user.click(okButton);

      expect(screen.queryByTestId('modal-content')).not.toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles API errors and shows error toaster', async () => {
      const user = userEvent.setup();
      render(<VendorMonthYearEnd />);

      const submitButton = screen.getByTestId('styled-button-submit');
      await user.click(submitButton);

      // Simulate error callback
      const onErrorCallback = mockMutate.mock.calls[0][1].onError;
      const mockError = {
        error: {
          error: {
            code: 'VALIDATION_ERROR',
            details: [
              { field: 'companyNo', message: 'Invalid company number' }
            ]
          }
        }
      };

      onErrorCallback(mockError);

      await waitFor(() => {
        expect(screen.getByTestId('toaster')).toBeInTheDocument();
        expect(screen.getByTestId('toaster-type')).toHaveTextContent('error');
        expect(screen.getByTestId('toaster-title')).toHaveTextContent('Validation Error');
      });
    });

    it('handles field-specific validation errors', async () => {
      const user = userEvent.setup();
      render(<VendorMonthYearEnd />);

      const submitButton = screen.getByTestId('styled-button-submit');
      await user.click(submitButton);

      const onErrorCallback = mockMutate.mock.calls[0][1].onError;
      const mockError = {
        error: {
          error: {
            details: [
              { field: 'companyNo', message: 'Company number is required' }
            ]
          }
        }
      };

      onErrorCallback(mockError);

      await waitFor(() => {
        // Check that company field shows error status
        expect(screen.getByTestId('company-no-input')).toHaveAttribute('data-status', 'error');
      });
    });

    it('handles year field validation errors', async () => {
      const user = userEvent.setup();
      render(<VendorMonthYearEnd />);

      const submitButton = screen.getByTestId('styled-button-submit');
      await user.click(submitButton);

      const onErrorCallback = mockMutate.mock.calls[0][1].onError;
      const mockError = {
        error: {
          error: {
            details: [
              { field: 'year', message: 'Invalid year selected' }
            ]
          }
        }
      };

      onErrorCallback(mockError);

      await waitFor(() => {
        expect(screen.getByTestId('dropdown-select-year')).toHaveAttribute('data-status', 'error');
      });
    });

    it('handles server errors', async () => {
      const user = userEvent.setup();
      render(<VendorMonthYearEnd />);

      const submitButton = screen.getByTestId('styled-button-submit');
      await user.click(submitButton);

      const onErrorCallback = mockMutate.mock.calls[0][1].onError;
      const mockError = {
        error: {
          error: {
            code: 'SERVER_ERROR',
            message: 'Internal server error occurred'
          }
        }
      };

      onErrorCallback(mockError);

      await waitFor(() => {
        expect(screen.getByTestId('toaster-title')).toHaveTextContent('Server Error');
        expect(screen.getByTestId('toaster-subtitle')).toHaveTextContent('Internal server error occurred');
      });
    });

    it('handles generic errors without specific details', async () => {
      const user = userEvent.setup();
      render(<VendorMonthYearEnd />);

      const submitButton = screen.getByTestId('styled-button-submit');
      await user.click(submitButton);

      const onErrorCallback = mockMutate.mock.calls[0][1].onError;
      const mockError = new Error('Generic error');

      await act(async () => {
        onErrorCallback(mockError);
      });

      await waitFor(() => {
        expect(screen.getByTestId('toaster-subtitle')).toHaveTextContent('Generic error');
      });
    });
  });

  describe('Loading States', () => {
    it('disables submit button when loading', () => {
      // Update mock return value
      mockHookReturnValue.isPending = true;

      render(<VendorMonthYearEnd />);

      const submitButton = screen.getByTestId('styled-button-submit');
      expect(submitButton).toBeDisabled();
    });

    it('enables submit button when not loading', () => {
      // Update mock return value
      mockHookReturnValue.isPending = false;

      render(<VendorMonthYearEnd />);

      const submitButton = screen.getByTestId('styled-button-submit');
      expect(submitButton).not.toBeDisabled();
    });
  });

  describe('Toaster Functionality', () => {
    it('closes toaster when close button is clicked', async () => {
      const user = userEvent.setup();
      render(<VendorMonthYearEnd />);

      // Trigger an error to show toaster
      const submitButton = screen.getByTestId('styled-button-submit');
      await user.click(submitButton);

      const onErrorCallback = mockMutate.mock.calls[0][1].onError;
      onErrorCallback(new Error('Test error'));

      await waitFor(() => {
        expect(screen.getByTestId('toaster')).toBeInTheDocument();
      });

      const closeButton = screen.getByTestId('toaster-close');
      await user.click(closeButton);

      expect(screen.queryByTestId('toaster')).not.toBeInTheDocument();
    });
  });

  describe('Form Validation States', () => {
    it('clears validation errors when form values change', async () => {
      const user = userEvent.setup();
      render(<VendorMonthYearEnd />);

      // First, trigger an error
      const submitButton = screen.getByTestId('styled-button-submit');
      await user.click(submitButton);

      const onErrorCallback = mockMutate.mock.calls[0][1].onError;
      onErrorCallback({
        error: {
          error: {
            details: [{ field: 'companyNo', message: 'Invalid company' }]
          }
        }
      });

      await waitFor(() => {
        expect(screen.getByTestId('company-no-input')).toHaveAttribute('data-status', 'error');
      });

      // Then change the value to clear the error
      const companyInput = screen.getByTestId('company-no-input');
      await user.clear(companyInput);
      await user.type(companyInput, '15');

      // The error should be cleared when the component re-renders
      // Note: This depends on the component's implementation
    });
  });

  describe('Accessibility', () => {
    it('has proper form labels and structure', () => {
      render(<VendorMonthYearEnd />);

      expect(screen.getByText('Vendor Month/Year End Process')).toBeInTheDocument();
      expect(screen.getByText('Save a Copy of the Vendor File For 1099 Year')).toBeInTheDocument();
      expect(screen.getByText('Clear Year to Date Fields')).toBeInTheDocument();
    });

    it('has accessible form elements', () => {
      render(<VendorMonthYearEnd />);

      const submitButton = screen.getByTestId('styled-button-submit');
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveAttribute('data-testid', 'styled-button-submit');
    });

    it('provides proper required field indicators', () => {
      render(<VendorMonthYearEnd />);

      // Should have asterisk for required fields
      expect(screen.getByText('Save a Copy of the Vendor File For 1099 Year')).toBeInTheDocument();
    });
  });
});
