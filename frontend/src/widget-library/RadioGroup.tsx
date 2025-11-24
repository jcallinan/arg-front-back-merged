import React from "react";
import { Radio } from "antd";
import type { CustomRadioButtonProps } from "@type-definitions/accounts-payable.types";



const CustomRadioButton: React.FC<CustomRadioButtonProps> = ({
   label,
   value,
   name,
   checked,
   onChange,
}) => {
   return (
      <Radio
         name={name}
         value={value}
         checked={checked}
         onChange={() => onChange(value)}
      >
         {label}
      </Radio>
   );
};

export default CustomRadioButton;
