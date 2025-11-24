import React, { useEffect } from "react";
import { CustomSelectDropdown } from "@widget-library/Dropdown";
//import type { Company } from "@modules/accounts-payable/voucher-management/types-api/voucher-management-types";
import type { CompanyNoProps } from "@type-definitions/accounts-payable.types";
//import { Api } from "@api/api-schema/api";
import { useCompanie } from "@hooks/useCompanie";

const CompanyNo: React.FC<CompanyNoProps> = ({ value, onChange }) => {
   const { data: companyList = [] } = useCompanie();

   const dropdownOptions = companyList.map((company) => ({
      label: company.id,
      value: company.id,
   }));

   useEffect(() => {
      if (!value && dropdownOptions.length > 0) {
         onChange(dropdownOptions[0].value as string);
      }
   }, [value, dropdownOptions, onChange]);

   return (
      <div>
         <div className="flex-align">
            <span className="astricks">*</span>&nbsp;
            <p className="sub-title">Company</p>
         </div>
         <CustomSelectDropdown
            name="companyNo"
            options={dropdownOptions}
            allowClear={false}
            value={value}
            onChange={onChange}
            placeholder="Select Company No"
            className="company-dropdown-cn"
         />
      </div>
   );
};

export default CompanyNo;
