# Table Filters Utility

This utility provides reusable filter components for Ant Design tables, including dynamic amount filtering and text search filtering.

## Features

-  **Amount Filter**: Dynamic filtering with customizable operators (>, <, =, >=, <=) - prevents alphabets
-  **Numeric Filter**: Simple numeric search filter - prevents alphabets  
-  **Text Filter**: Standard text search functionality
-  **TypeScript Support**: Fully typed for better development experience
-  **Reusable**: Can be used across any table in the application
-  **Consistent UI**: Uses CustomStyledButton from widget-library for consistent styling
-  **Enhanced UX**: All filters now include "OK" and "Clear" buttons for better user control
-  **Keyboard Support**: Press Enter to apply filters, maintaining existing functionality
-  **Ant Design Compliance**: Matches standard Ant Design filter behavior

## Usage

### Basic Text Filter

```typescript
import { getColumnSearchProps } from "../utils/tableFilters";

const columns = [
   {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name", "Search name"),
   },
];
```

### Numeric Filter (for numeric columns without operators)

```typescript
import { createNumericFilter } from "../utils/tableFilters";

const columns = [
   {
      title: "Vendor No",
      dataIndex: "vendorNo", 
      key: "vendorNo",
      ...createNumericFilter("vendorNo", "Enter Vendor No"),
   },
];
```

### Amount Filter (with comparison operators)

```typescript
import { getColumnSearchProps } from "../utils/tableFilters";

const columns = [
   {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      ...getColumnSearchProps("amount", "Enter amount", true), // true enables amount filter
   },
];
```

### Advanced Amount Filter with Custom Options

```typescript
import { createAmountFilter } from "../utils/tableFilters";

const columns = [
   {
      title: "Price",
      dataIndex: "price",
      key: "price",
      ...createAmountFilter("price", {
         placeholder: "Enter price",
         defaultOperator: "greaterEqual",
         operators: [
            { value: "greater", label: "More than" },
            { value: "less", label: "Less than" },
            { value: "equal", label: "Exactly" },
         ],
      }),
   },
];
```

## API Reference

### `getColumnSearchProps<T>(dataIndex, placeholder, isAmountFilter?, amountFilterOptions?)`

Generic function to create column search properties.

**Parameters:**

-  `dataIndex: keyof T` - The field to filter on
-  `placeholder: string` - Placeholder text for the input
-  `isAmountFilter?: boolean` - Whether to use amount filter (default: false)
-  `amountFilterOptions?: AmountFilterOptions` - Options for amount filter

### `createAmountFilter<T>(dataIndex, options?)`

Creates a specialized amount filter with customizable operators.

**Parameters:**

-  `dataIndex: keyof T` - The field to filter on
-  `options?: AmountFilterOptions` - Configuration options

### `createNumericFilter<T>(dataIndex, placeholder)`

Creates a numeric-only filter that prevents alphabets from being entered.

**Parameters:**

-  `dataIndex: keyof T` - The field to filter on
-  `placeholder: string` - Placeholder text for the input

### `createTextFilter<T>(dataIndex, placeholder)`

Creates a standard text search filter.

**Parameters:**

-  `dataIndex: keyof T` - The field to filter on
-  `placeholder: string` - Placeholder text for the input

## Types

### `FilterOperator`

```typescript
type FilterOperator =
   | "greater"
   | "less"
   | "equal"
   | "greaterEqual"
   | "lessEqual";
```

### `AmountFilterOptions`

```typescript
interface AmountFilterOptions {
   placeholder?: string;
   operators?: Array<{
      value: FilterOperator;
      label: string;
   }>;
   defaultOperator?: FilterOperator;
}
```

## Examples

### Complete Table Implementation

```typescript
import React from "react";
import { Table } from "antd";
import { getColumnSearchProps } from "../utils/tableFilters";

interface DataType {
   id: number;
   name: string;
   amount: number;
   date: string;
}

const MyTable: React.FC = () => {
   const columns = [
      {
         title: "ID",
         dataIndex: "id",
         key: "id",
         ...getColumnSearchProps("id", "Search ID"),
      },
      {
         title: "Name",
         dataIndex: "name",
         key: "name",
         ...getColumnSearchProps("name", "Search name"),
      },
      {
         title: "Amount",
         dataIndex: "amount",
         key: "amount",
         ...getColumnSearchProps("amount", "Enter amount", true),
      },
      {
         title: "Date",
         dataIndex: "date",
         key: "date",
         ...getColumnSearchProps("date", "Search date"),
      },
   ];

   return <Table columns={columns} dataSource={data} />;
};
```

## Benefits

1. **Consistency**: Standardized filter UI across the application
2. **Maintainability**: Single source of truth for filter logic
3. **Flexibility**: Customizable options for different use cases
4. **Type Safety**: Full TypeScript support prevents runtime errors
5. **Performance**: Optimized filtering logic
6. **User Control**: Users can decide when to apply filters with explicit OK button
7. **Accessibility**: Both keyboard (Enter) and mouse (OK button) interactions supported
8. **Ant Design Compliance**: Matches standard Ant Design table filter behavior

## Filter Behavior

All filters now provide consistent behavior:

- **Input Field**: Type your filter criteria
- **OK Button**: Apply the filter and close the dropdown (disabled when input is empty)
- **Clear Button**: Clear the filter and close the dropdown
- **Enter Key**: Apply the filter and close the dropdown (same as OK button)
- **Dropdown Close**: Only closes on explicit user action (OK/Clear buttons or Enter key)
