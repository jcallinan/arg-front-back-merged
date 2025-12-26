import React from "react";
import { Input } from "antd";
import type { CustomPrefixInputProps } from "./widgetLibrary.types";
import "../index.scss";
export const CustomPrefixInput: React.FC<CustomPrefixInputProps> = ({
  name,
  value,
  onChange,
  placeholder = "Enter text",
  prefix,
  onBlur,
  className = "",
  disabled = false,
  status,
  maxLength,
  showCount = false,
}) => {
  const inputClassName = `custom-input ${className}`;
  const antdStatus =
    status === "error" ? "error" : status === "warning" ? "warning" : undefined;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    // If maxLength is set, prevent input from exceeding the limit
    if (maxLength && newValue.length > maxLength) {
      return; // Don't call onChange if the new value exceeds maxLength
    }

    // Call the original onChange handler
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className="custom-input-wrapper">
      <Input
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        placeholder={placeholder}
        prefix={prefix}
        data-name={name}
        className={inputClassName}
        disabled={disabled}
        status={antdStatus}
        maxLength={maxLength}
      />
      {showCount && maxLength && (
        <div className="character-count">
          {value?.length || 0} / {maxLength}
        </div>
      )}
    </div>
  );
};
