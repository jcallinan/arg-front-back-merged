// Mock data for testing components

import { vi } from "vitest";

export const mockButtonProps = {
   name: "test-button",
   label: "Test Button",
   onClick: vi.fn(),
};

export const mockInputProps = {
   name: "test-input",
   value: "test value",
   onChange: vi.fn(),
   placeholder: "Enter text",
};

export const mockDropdownProps = {
   name: "test-dropdown",
   options: [
      { label: "Option 1", value: "1" },
      { label: "Option 2", value: "2" },
      { label: "Option 3", value: "3" },
   ],
   value: "1",
   onChange: vi.fn(),
   placeholder: "Select option",
   className: "test-dropdown",
};

export const mockTableData = [
   {
      key: "1",
      name: "John Doe",
      age: 32,
      address: "New York No. 1 Lake Park",
   },
   {
      key: "2",
      name: "Jane Smith",
      age: 28,
      address: "London No. 1 Lake Park",
   },
];

export const mockTableColumns = [
   {
      title: "Name",
      dataIndex: "name",
      key: "name",
   },
   {
      title: "Age",
      dataIndex: "age",
      key: "age",
   },
   {
      title: "Address",
      dataIndex: "address",
      key: "address",
   },
];

export const mockModalProps = {
   title: "Test Modal",
   open: true,
   onCancel: vi.fn(),
   children: "Modal content",
};

// Mock user for testing
export const mockUser = {
   id: "1",
   name: "Test User",
   email: "test@example.com",
   role: "user",
};

// Mock API responses
export const mockApiResponse = {
   success: true,
   data: mockTableData,
   message: "Success",
};

// Mock error response
export const mockErrorResponse = {
   success: false,
   error: "Something went wrong",
   message: "Error occurred",
};
