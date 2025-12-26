import React from "react";
import { CustomSelectDropdown } from "@widget-library/Dropdown";
import type { ProcessTypeProps } from "@type-definitions/accounts-payable.types";
import { useProcessTypes } from "@hooks/useProcessTypes";
import { useAuth } from "@/modules/auth/customhooks/useAuth";
import { extractRights } from "@/utils/permissionUtils";
import { getRightKeyForAction } from "@/config/accessControl";

// Map API process type values to semantic action IDs used in access control
const PROCESS_TYPE_ACTION_IDS: Record<string, string> = {
   NORMAL: "voucher-entry.normal.access",
   FLEXI: "voucher-entry.flexi.access",
   PAPER: "voucher-entry.paper.access",
   ARGLMS: "voucher-entry.lms.access",
   SOGAS: "voucher-entry.sogas.access",
};

const ProcessType: React.FC<ProcessTypeProps> = ({ value, onChange }) => {
   const { data: processTypes = [] } = useProcessTypes();
   const { lastLoginResponse } = useAuth();
   const rights = extractRights(lastLoginResponse);

   // Filter process types based on access-control config + current user's rights
   const filteredProcessTypes = processTypes.filter((item) => {
      const actionId = PROCESS_TYPE_ACTION_IDS[item.value];

      // If we don't have a mapping for a value, keep it by default
      if (!actionId) {
         return true;
      }

      const rightKey = getRightKeyForAction(actionId, rights);
      return !!rightKey;
   });

   const dropdownOptions = filteredProcessTypes.map((item) => ({
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
