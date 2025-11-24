import React, { useState } from "react";
import { Input, Select } from "antd";
import type { ColumnType } from "antd/es/table";
import type { FilterDropdownProps as AntdFilterDropdownProps } from "antd/es/table/interface";
import { CustomStyledButton, DefaultButton } from "@widget-library/Buttons";
import { validateNumericInput } from "./validation";
import { toNumericOrNull } from "./formatters";

export type FilterOperator =
   | "greater"
   | "less"
   | "equal"
   | "greaterEqual"
   | "lessEqual";

export interface AmountFilterOptions {
   placeholder?: string;
   operators?: Array<{
      value: FilterOperator;
      label: string;
   }>;
   defaultOperator?: FilterOperator;
}

const defaultOperators = [
   { value: "greater" as FilterOperator, label: "Greater than" },
   { value: "less" as FilterOperator, label: "Less than" },
   { value: "equal" as FilterOperator, label: "Equal to" },
   { value: "greaterEqual" as FilterOperator, label: "Greater than or equal" },
   { value: "lessEqual" as FilterOperator, label: "Less than or equal" },
];

/**
 * Creates a reusable amount filter for table columns
 * @param dataIndex - The field to filter on
 * @param options - Configuration options for the filter
 * @returns Column filter properties
 */
export const createAmountFilter = <T = any>(
   dataIndex: keyof T,
   options: AmountFilterOptions = {}
): Pick<ColumnType<T>, "filterDropdown" | "onFilter"> => {
   const {
      placeholder = "Enter amount",
      operators = defaultOperators,
      defaultOperator = "greater",
   } = options;

   const AmountFilterDropdown = ({
      setSelectedKeys,
      confirm,
      clearFilters,
   }: AntdFilterDropdownProps) => {
      const [filterAmount, setFilterAmount] = useState<string>("");
      const [filterOperator, setFilterOperator] =
         useState<FilterOperator>(defaultOperator);

      const handleApplyFilter = () => {
         if (filterAmount && filterOperator) {
            setSelectedKeys([`${filterOperator}:${filterAmount}`]);
            confirm({ closeDropdown: true });
         }
      };

      const handleClearFilter = () => {
         if (clearFilters) clearFilters();
         setSelectedKeys([]);
         setFilterAmount("");
         setFilterOperator(defaultOperator);
         confirm({ closeDropdown: true });
      };

      return React.createElement(
         "div",
         { className: "filter-dropdown", style: { padding: 8 } },
         React.createElement(
            "div",
            {
               className: "amount-filter",
               style: { display: "flex", flexDirection: "column", gap: 8 },
            },
            React.createElement(Select, {
               placeholder: "Select operator",
               value: filterOperator,
               onChange: (value: unknown) =>
                  setFilterOperator(value as FilterOperator),
               style: { width: "100%" },
               options: operators,
            }),
            React.createElement(Input, {
               placeholder: placeholder,
               value: filterAmount,
               onChange: (e: any) => {
                  // Validate numeric input to prevent alphabets
                  const validation = validateNumericInput(e);
                  setFilterAmount(validation.value);
               },
               onPressEnter: handleApplyFilter,
               style: { width: "100%" },
               type: "number",
            }),
            React.createElement(
               "div",
               {
                  style: {
                     display: "flex",
                     gap: 8,
                     justifyContent: "space-between",
                  },
               },
               React.createElement(DefaultButton, {
                  name: "clearFilter",
                  label: "Clear",
                  onClick: handleClearFilter,
               }),
               React.createElement(CustomStyledButton, {
                  name: "applyFilter",
                  label: "Filter",
                  onClick: handleApplyFilter,
                  disabled: !filterAmount,
               })
            )
         )
      );
   };

   return {
      filterDropdown: AmountFilterDropdown,
      onFilter: (value, record) => {
         const parsedAmount = toNumericOrNull((record as any)[dataIndex]);
         const filterValue = value as string;

         if (!filterValue || filterValue === "") return true;

         const [operator, amountStr] = filterValue.split(":");
         const filterAmountNum = Number(amountStr);

         if (isNaN(filterAmountNum)) return true;
         if (parsedAmount === null) return false;

         switch (operator as FilterOperator) {
            case "greater":
               return parsedAmount > filterAmountNum;
            case "less":
               return parsedAmount < filterAmountNum;
            case "equal":
               return parsedAmount === filterAmountNum;
            case "greaterEqual":
               return parsedAmount >= filterAmountNum;
            case "lessEqual":
               return parsedAmount <= filterAmountNum;
            default:
               return true;
         }
      },
   };
};

/**
 * Creates a numeric-only filter for table columns (prevents alphabets)
 * @param dataIndex - The field to filter on
 * @param placeholder - Placeholder text for the input
 * @returns Column filter properties
 */
export const createNumericFilter = <T = any>(
   dataIndex: keyof T,
   placeholder: string
): Pick<ColumnType<T>, "filterDropdown" | "onFilter"> => {
   const NumericFilterDropdown = ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
   }: AntdFilterDropdownProps) => {
      const [filterValue, setFilterValue] = useState<string>(selectedKeys[0] as string || "");

      const handleApplyFilter = () => {
         setSelectedKeys(filterValue ? [filterValue] : []);
         confirm({ closeDropdown: true });
      };

      const handleClearFilter = () => {
         if (clearFilters) clearFilters();
         setSelectedKeys([]);
         setFilterValue("");
         confirm({ closeDropdown: true });
      };

      return React.createElement(
         "div",
         { className: "filter-dropdown", style: { padding: 8 } },
         React.createElement(Input, {
            placeholder: placeholder,
            value: filterValue,
            onChange: (e: any) => {
               // Validate numeric input to prevent alphabets
               const validation = validateNumericInput(e);
               setFilterValue(validation.value);
            },
            onPressEnter: handleApplyFilter,
            style: { width: 188, marginBottom: 8, display: "block" },
            type: "number",
         }),
         React.createElement(
            "div",
            {
               style: {
                  display: "flex",
                  gap: 8,
                  justifyContent: "space-between",
               },
            },
            React.createElement(DefaultButton, {
               name: "clearNumericFilter",
               label: "Clear",
               onClick: handleClearFilter,
            }),
            React.createElement(CustomStyledButton, {
               name: "applyNumericFilter",
               label: "Filter",
               onClick: handleApplyFilter,
               disabled: !filterValue,
            })
         )
      );
   };

   return {
      filterDropdown: NumericFilterDropdown,
      onFilter: (value, record) => {
         const searchValue = record[dataIndex]?.toString();
         return searchValue
            ? searchValue.includes(value as string)
            : false;
      },
   };
};

/**
 * Creates a standard text search filter for table columns
 * @param dataIndex - The field to filter on
 * @param placeholder - Placeholder text for the input
 * @returns Column filter properties
 */
export const createTextFilter = <T = any>(
   dataIndex: keyof T,
   placeholder: string
): Pick<ColumnType<T>, "filterDropdown" | "onFilter"> => {
   const TextFilterDropdown = ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
   }: AntdFilterDropdownProps) => {
      const [filterValue, setFilterValue] = useState<string>(selectedKeys[0] as string || "");

      const handleApplyFilter = () => {
         setSelectedKeys(filterValue ? [filterValue] : []);
         confirm({ closeDropdown: true });
      };

      const handleClearFilter = () => {
         if (clearFilters) clearFilters();
         setSelectedKeys([]);
         setFilterValue("");
         confirm({ closeDropdown: true });
      };

      return React.createElement(
         "div",
         { className: "filter-dropdown", style: { padding: 8 } },
         React.createElement(Input, {
            placeholder: placeholder,
            value: filterValue,
            onChange: (e: any) => {
               const value = e.target.value;
               setFilterValue(value);
            },
            onPressEnter: handleApplyFilter,
            style: { width: 188, marginBottom: 8, display: "block" },
         }),
         React.createElement(
            "div",
            {
               style: {
                  display: "flex",
                  gap: 8,
                  justifyContent: "space-between",
               },
            },
            React.createElement(DefaultButton, {
               name: "clearTextFilter",
               label: "Clear",
               onClick: handleClearFilter,
            }),
            React.createElement(CustomStyledButton, {
               name: "applyTextFilter",
               label: "Filter",
               onClick: handleApplyFilter,
               disabled: !filterValue,
            })
         )
      );
   };

   return {
      filterDropdown: TextFilterDropdown,
      onFilter: (value, record) => {
         const searchValue = record[dataIndex]?.toString().toLowerCase();
         return searchValue
            ? searchValue.includes((value as string).toLowerCase())
            : false;
      },
   };
};

/**
 * Generic function to create column search properties
 * @param dataIndex - The field to filter on
 * @param placeholder - Placeholder text
 * @param isAmountFilter - Whether to use amount filter or text filter
 * @param amountFilterOptions - Options for amount filter
 * @returns Complete column filter properties
 */
export const getColumnSearchProps = <T = any>(
   dataIndex: keyof T,
   placeholder: string,
   isAmountFilter: boolean = false,
   amountFilterOptions?: AmountFilterOptions
): Pick<ColumnType<T>, "filterDropdown" | "onFilter"> => {
   if (isAmountFilter) {
      return createAmountFilter(dataIndex, {
         placeholder,
         ...amountFilterOptions,
      });
   }

   return createTextFilter(dataIndex, placeholder);
};
