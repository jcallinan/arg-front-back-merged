import React from "react";
import { Select } from "antd";
import type { BaseSelectProps } from "./widgetLibrary.types";
 
export const CustomSelectDropdown: React.FC<BaseSelectProps> = ({
   name,
   options,
   value,
   onChange,
   placeholder = "Select an option",
   className,
   disabled = false,
   allowClear = true,
   status,
   ...otherProps
}) => {
   return (
      <Select
         data-name={name}
         size="middle"
         value={value}
         onChange={onChange}
         allowClear={allowClear}
         options={options}
         placeholder={placeholder}
         className={`custom-input ${className ?? ""}`}
         disabled={disabled}
         status={status}
         {...otherProps}
      />
   );
};
 
// Multi-Select
export const CustomMultiSelect: React.FC<BaseSelectProps> = ({
   name,
   options,
   value,
   onChange,
   placeholder = "Please select",
   className,
   disabled = false,
}) => {
   return (
      <Select
         mode="multiple"
         data-name={name}
         size="middle"
         value={value}
         onChange={onChange}
         placeholder={placeholder}
         options={options}
         className={`custom-input ${className ?? ""}`}
         disabled={disabled}
      />
   );
};
 
export const CustomSearchableSelect: React.FC<BaseSelectProps> = ({
   name,
   options,
   value,
   onChange,
   placeholder = "Search to Select",
   className,
   disabled = false,
   onPopupScroll,
   onSearch,
   filterOption = true,
}) => {
   return (
      <Select
         showSearch
         allowClear
         data-name={name}
         size="middle"
         value={value}
         onChange={onChange}
         placeholder={placeholder}
         onPopupScroll={onPopupScroll}
         onSearch={onSearch}
         options={options}
         className={`custom-input ${className ?? ""}`}
         disabled={disabled}
         filterOption={filterOption}
         optionFilterProp={filterOption ? "label" : undefined}
         filterSort={filterOption ? (optionA, optionB) => {
            const labelA =
               typeof optionA?.label === "string"
                  ? optionA.label.toLowerCase()
                  : "";
            const labelB =
               typeof optionB?.label === "string"
                  ? optionB.label.toLowerCase()
                  : "";
            return labelA.localeCompare(labelB);
         } : undefined}
      />
   );
};
 
 