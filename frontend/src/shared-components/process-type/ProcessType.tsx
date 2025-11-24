import React from "react";
import { CustomSelectDropdown } from "@widget-library/Dropdown";
import type { ProcessTypeProps } from "@type-definitions/accounts-payable.types";
import { useProcessTypes } from "@hooks/useProcessTypes";


const ProcessType: React.FC<ProcessTypeProps> = ({ value, onChange }) => {
  // const [processTypes, setProcessTypes] = useState<Process[]>([]);

const { data: processTypes = [] } = useProcessTypes();
   const dropdownOptions = processTypes.map((item) => ({
      label: item.label,
      value: item.value,
   }));

   return (
      <div>
         <div className="flex-align">
            <span className="astricks">*</span>&nbsp;
            <p className="sub-title">Process Type</p>
         </div>
         <CustomSelectDropdown
            name="processType"
            options={dropdownOptions}
            allowClear={false}
            value={value}
            onChange={(val) => onChange(val)}
            placeholder="Select Process Type"
            className="ui-dropdown-pt"
         />
      </div>
   );
};

export default ProcessType;
