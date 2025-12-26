import React, { useEffect } from "react";
import { CustomSelectDropdown } from "../../../../../../widget-library/Dropdown";
import { useDropdownData } from "../../../../../../hooks/useDropdownData";

interface OptionsFormProps {
  reportYear: string;
  formType: string;
  paymentsForReportYear: string;
  onReportYearChange: (value: string) => void;
  onFormTypeChange: (value: string) => void;
  onPaymentsChange: (value: string) => void;
}

const OptionsForm: React.FC<OptionsFormProps> = ({
  reportYear,
  formType,
  paymentsForReportYear,
  onReportYearChange,
  onFormTypeChange,
  onPaymentsChange,
}) => {
  // Fetch form types from API using common dropdown hook
  const { data: formTypeData, isLoading: isFormTypeLoading, error: formTypeError } = useDropdownData("FORM_TYPE");
  
  // Fetch payment for report types from API using common dropdown hook
  const { data: paymentsData, isLoading: isPaymentsLoading, error: paymentsError } = useDropdownData("PAYMENT_FOR_REPORT_TYPES");
  const { data: reportYearData } = useDropdownData("AP_PERIOD_END_YEARS");

  const reportYearOptions =
    reportYearData?.map(item => ({
      label: item.label || item.value || "",
      value: item.value || item.id || ""
    })) || [];

  // Transform API data to dropdown format
  const formTypeOptions = formTypeData?.map(item => ({
    label: item.label || item.value || "",
    value: item.value || item.id || ""
  })) || [];

  // Transform payments API data to dropdown format
  const paymentsOptions = paymentsData?.map(item => ({
    label: item.label || item.value || "",
    value: item.value || item.id || ""
  })) || [];

  // Auto-select first form type option when data loads and no form type is selected
  useEffect(() => {
    if (formTypeOptions.length > 0 && !formType && !isFormTypeLoading) {
      onFormTypeChange(formTypeOptions[0].value);
    }
  }, [formTypeOptions, formType, isFormTypeLoading, onFormTypeChange]);

  // Auto-select first payments option when data loads and no payment type is selected
  useEffect(() => {
    if (paymentsOptions.length > 0 && !paymentsForReportYear && !isPaymentsLoading) {
      onPaymentsChange(paymentsOptions[0].value);
    }
  }, [paymentsOptions, paymentsForReportYear, isPaymentsLoading, onPaymentsChange]);

  return (
    <div className="bordered-box">
      <div className="content-card-body flex-content">
        <div className="flex-col">
          <label className="sub-title">
            <span className="astricks">*</span> Report Year
          </label>
          <CustomSelectDropdown
            name="reportYear"
            value={reportYear}
            onChange={onReportYearChange}
            options={reportYearOptions}
            placeholder="Select Report Year"
            className="ui-dropdown-ap"
          />
        </div>

        <div className="flex-col">
          <label className="sub-title">Form Type</label>
          <CustomSelectDropdown
            name="formType"
            value={formType}
            onChange={onFormTypeChange}
            options={formTypeOptions}
            placeholder={
              isFormTypeLoading 
                ? "Loading form types..." 
                : formTypeError 
                ? "Error loading form types"
                : "Select Form Type"
            }
            loading={isFormTypeLoading}
            disabled={isFormTypeLoading || !!formTypeError}
            className="ui-dropdown-ap"
          />
          {formTypeError && (
            <div style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '4px' }}>
              Failed to load form types. Please refresh and try again.
            </div>
          )}
        </div>

        <div className="flex-col">
          <label className="sub-title">Payments for Report Year</label>
          <CustomSelectDropdown
            name="paymentsForReportYear"
            value={paymentsForReportYear}
            onChange={onPaymentsChange}
            options={paymentsOptions}
            placeholder={
              isPaymentsLoading 
                ? "Loading payment types..." 
                : paymentsError 
                ? "Error loading payment types"
                : "Select Payment Type"
            }
            loading={isPaymentsLoading}
            disabled={isPaymentsLoading || !!paymentsError}
            className="ui-dropdown-ap"
          />
          {paymentsError && (
            <div style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '4px' }}>
              Failed to load payment types. Please refresh and try again.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OptionsForm;
