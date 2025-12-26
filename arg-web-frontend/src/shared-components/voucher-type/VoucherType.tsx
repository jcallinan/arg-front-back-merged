import React from "react";
import { CustomSelectDropdown } from "@widget-library/Dropdown";
import type { VoucherTypeProps } from "@type-definitions/accounts-payable.types";

const voucherTypeOptions = [
  { label: "All", value: "ALL" },
  { label: "Paid", value: "PAID" },
  { label: "Unpaid", value: "UNPAID" },
];

const VoucherType: React.FC<VoucherTypeProps> = ({ value, onChange }) => {
  return (
    <div>
      <div className="flex-align">
        <span className="astricks">*</span>&nbsp;
        <p className="sub-title">Voucher Type</p>
      </div>
      <CustomSelectDropdown
        name="voucherType"
        options={voucherTypeOptions}
        value={value}
        onChange={(val) => onChange(val)}
        placeholder="Select Voucher Type"
        className="ui-dropdown-vt"
      />
    </div>
  );
};

export default VoucherType;
