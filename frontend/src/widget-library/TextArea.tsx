import React from "react";
import { Input } from "antd";
import type { CustomTextAreaProps } from "./widgetLibrary.types";
import "../index.scss"

const { TextArea } = Input;

export const CustomTextArea: React.FC<CustomTextAreaProps> = ({
   name,
   className,
   value,
   onChange,
   placeholder = "Type here...",
   disabled = false,
}) => {
   return (
      <TextArea
         placeholder={placeholder}
         value={value}
         onChange={onChange}
         data-name={name}
         className={`description-textarea ${className || ''}`}
         disabled={disabled}
      />
   );
};

