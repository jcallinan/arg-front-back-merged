# Test Suite Documentation

## Overview

This directory contains comprehensive unit and integration tests for the ARG Frontend application, with a focus on the Voucher Maintenance module. The test suite is built using **Vitest** and **React Testing Library**.

## Test Structure

```
src/__tests__/
├── __mocks__/                  # Mock implementations
│   └── api.ts                 # API mocks and test data
├── components/                # Component tests
│   ├── modules/
│   │   └── accounts-payable/
│   │       └── voucher-management/
│   │           └── sub-modules/
│   │               └── voucher-maintenance/
│   │                   └── VoucherMaintenance.test.tsx
│   ├── widget-library/
│   │   └── VoucherDiscountModifyModal.test.tsx
│   └── shared-components/     # Shared component tests
├── utils/                     # Utility function tests
│   ├── test-utils.tsx        # Testing utilities and providers
│   └── dateFormatters.test.ts # Date formatting function tests
├── setupTests.ts             # Global test setup
├── run-tests.ts             # Test runner script
└── README.md                # This file
```

## Technology Stack

- **Test Runner**: Vitest
- **Testing Library**: React Testing Library
- **DOM Assertions**: @testing-library/jest-dom
- **User Interactions**: @testing-library/user-event
- **Mocking**: Vitest's built-in mocking capabilities
- **Coverage**: V8 coverage provider

## Running Tests

### All Tests
```bash
npm run test              # Run all tests in watch mode
npm run test:run          # Run all tests once
npm run test:coverage     # Run all tests with coverage report
npm run test:ui           # Run tests with Vitest UI
```

### Voucher Maintenance Specific Tests
```bash
# Run voucher maintenance tests
npx vitest run src/__tests__/components/modules/accounts-payable/voucher-management/sub-modules/voucher-maintenance/VoucherMaintenance.test.tsx

# Run discount modal tests
npx vitest run src/__tests__/components/widget-library/VoucherDiscountModifyModal.test.tsx

# Run date formatter tests
npx vitest run src/__tests__/utils/dateFormatters.test.ts
```

### Watch Mode
```bash
npm run test:watch       # Watch mode for all tests
```

## Test Coverage

The test suite provides comprehensive coverage for:

### VoucherMaintenance Component
- ✅ Component rendering and initialization
- ✅ Filter functionality (voucher type, company, vendor)
- ✅ Search and reset operations
- ✅ API integration (voucher list, summary data)
- ✅ Modal interactions (view, discount, status, cancel)
- ✅ Date formatting (8-digit, 6-digit, 5-digit formats)
- ✅ Error handling and loading states
- ✅ User interactions and form validation

### VoucherDiscountModify Modal
- ✅ Modal rendering and form initialization
- ✅ Form validation (date, amount requirements)
- ✅ User input handling and state management
- ✅ API integration (updateVoucherDiscount)
- ✅ Success/error message handling
- ✅ Loading states and disabled controls
- ✅ Date formatting for API (MM/DD/YY to MMDDYY)
- ✅ Amount conversion (dollars to cents)

### Date Formatting Utilities
- ✅ 8-digit format (YYYYMMDD) → MM/DD/YYYY
- ✅ 6-digit format (MMDDYY) → MM/DD/YYYY
- ✅ 5-digit format (MDDYY) → MM/DD/YYYY
- ✅ Zero value handling → "-"
- ✅ Year cutoff logic (00-49 = 20xx, 50-99 = 19xx)
- ✅ Error handling for invalid formats

## Test Data and Mocks

### Mock API Responses
The test suite includes realistic mock data for:
- Voucher list responses
- Summary data responses
- Detailed voucher information
- Update discount responses

### Test Scenarios
- Valid data scenarios
- Error conditions
- Edge cases (large amounts, boundary dates)
- Loading states
- Network failures

## Writing New Tests

### Component Test Template
```typescript
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@/__tests__/utils/test-utils';
import YourComponent from '@/path/to/YourComponent';

describe('YourComponent', () => {
  beforeEach(() => {
    // Setup mocks
  });

  it('renders correctly', () => {
    render(<YourComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### Utility Function Test Template
```typescript
import { describe, it, expect } from 'vitest';
import { yourUtilityFunction } from '@/path/to/utility';

describe('yourUtilityFunction', () => {
  it('handles valid input correctly', () => {
    expect(yourUtilityFunction('input')).toBe('expected');
  });
});
```

## Best Practices

### 1. Test Organization
- Group related tests using `describe` blocks
- Use descriptive test names that explain the expected behavior
- Follow the AAA pattern (Arrange, Act, Assert)

### 2. Mocking Strategy
- Mock external dependencies (APIs, third-party libraries)
- Use realistic mock data that matches actual API responses
- Mock at the appropriate level (component vs. service)

### 3. User-Centric Testing
- Test user interactions rather than implementation details
- Use `screen.getByRole` and `screen.getByText` for better accessibility
- Test the complete user workflow

### 4. Async Testing
- Use `waitFor` for async operations
- Test loading states and error conditions
- Ensure proper cleanup after async tests

### 5. Coverage Goals
- Aim for high test coverage but focus on critical paths
- Test edge cases and error conditions
- Ensure all user-facing features are tested

## Common Testing Patterns

### API Mocking
```typescript
const mockApi = {
  voucherMaintenance: {
    voucherMaintenance: vi.fn().mockResolvedValue(mockResponse),
  },
};
(Api as any).mockImplementation(() => mockApi);
```

### User Interaction Testing
```typescript
const user = userEvent.setup();
await user.click(screen.getByRole('button', { name: 'Save' }));
await user.type(screen.getByLabelText('Amount'), '100.00');
```

### Async Operation Testing
```typescript
await waitFor(() => {
  expect(mockApi.someMethod).toHaveBeenCalledWith(expectedParams);
});
```

### Form Validation Testing
```typescript
const submitButton = screen.getByRole('button', { name: 'Submit' });
await user.click(submitButton);
expect(screen.getByText('Required field')).toBeInTheDocument();
```

## Debugging Tests

### Debug Mode
```bash
npm run test:ui  # Opens Vitest UI for interactive debugging
```

### Console Output
```typescript
screen.debug(); // Prints current DOM structure
```

### Test Isolation
Run individual test files to isolate issues:
```bash
npx vitest run path/to/specific.test.tsx
```

## Continuous Integration

The test suite is designed to run in CI/CD pipelines with:
- Consistent test environment setup
- Proper mock isolation
- Coverage reporting
- Fast execution times

## Contributing

When adding new features:
1. Write tests first (TDD approach)
2. Ensure good test coverage
3. Update mock data as needed
4. Document any new testing patterns
5. Run full test suite before submitting

## Troubleshooting

### Common Issues

1. **Mock not working**: Ensure mocks are defined before imports
2. **Async test failures**: Use `waitFor` for async operations
3. **DOM not updating**: Check if component state is properly managed
4. **API calls not mocked**: Verify mock setup in `beforeEach`

### Performance Issues
- Use `vi.clearAllMocks()` in `afterEach`
- Avoid creating new mock instances in every test
- Use `vi.restoreAllMocks()` when needed

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)
- [User Event Documentation](https://testing-library.com/docs/user-event/intro)