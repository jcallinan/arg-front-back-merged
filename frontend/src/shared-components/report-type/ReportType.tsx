import React, { useEffect, useState } from "react";
import { CustomSelectDropdown } from "@widget-library/Dropdown";
import type { ReportTypeProps } from "@type-definitions/accounts-payable.types";
import { useReportType } from "@hooks/useReportType";

const ReportType: React.FC<ReportTypeProps & { isRequired?: boolean }> = ({
  value,
  onChange,
  type,
  isRequired = false,
}) => {
  const [dropdownOptions, setDropdownOptions] = useState<
    { label: string; value: string }[]
  >([]);
  
  const { fetchProcessType } = useReportType();

  const fetchReportsType = async () => {
    try {
      const mappedOptions = await fetchProcessType(type);
      setDropdownOptions(mappedOptions);
    } catch (err) {
      console.error("Error fetching report types:", err);
    }
  };

  useEffect(() => {
    fetchReportsType();
  }, [type, fetchProcessType]);

  return (
    <div>
      <div className="flex-align">
        <p className="sub-title">
          {isRequired && <span className="astricks">*</span>}&nbsp;Report Type
        </p>
      </div>
      <CustomSelectDropdown
        placeholder="Select"
        name="reportType"
        options={dropdownOptions}
        value={value || undefined}
        onChange={(val) => onChange(val)}
        className="ui-dropdown-pt"
      />
    </div>
  );
};

export default ReportType;
