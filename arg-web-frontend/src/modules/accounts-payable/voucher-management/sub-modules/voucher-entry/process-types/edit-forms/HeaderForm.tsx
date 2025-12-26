import React, { useEffect } from "react";
import { Divider } from "antd";
import {
   yesNoOptions,
   selectPlaceholder,
   productAllocationOptions,
   formFieldsLabelsStepOne,
   entryTittle,
   holdVoucherCode,
   prepaidOptions,
   holdVoucherDescriptions,
   customPlaceholders,
   disabledFields,
   numericFields,
} from "../../../../../../../constants/commonConstants";
import type { StepOneFormProps } from "../../../../../../../types/accounts-payable.types";
import { formatAmountValue } from "../../../../../../../utils/formatters";
import CustomDatePicker from "../../../../../../../widget-library/DatePicker";
import  { CustomSelectDropdown } from "../../../../../../../widget-library/Dropdown";
import { CustomPrefixInput } from "../../../../../../../widget-library/Input";
import CustomRadioButton from "../../../../../../../widget-library/RadioGroup";


const getPlaceholder = (label: string): string => {
   return (
      customPlaceholders[label] ||
      (numericFields.has(label) ? "Enter number" : "Enter text")
   );
};

const HeaderForm: React.FC<
   StepOneFormProps & { errors?: { [key: string]: string } }
> = ({ formData, onInputChange, errors = {} }) => {
   const requiredFields = [
      "Invoice No",
      "Invoice Amount",
      "Invoice Date",
      ...(formData["Prepaid Voucher"] !== ""
         ? ["Prepaid Check No", "Check Date"]
         : []),
   ];
   const isRequired = (field: string) => requiredFields.includes(field);

   useEffect(() => {
      if (!formData["Product Invoice for Allocation"]) {
         onInputChange("Product Invoice for Allocation", "By Sales Order");
      }
   }, [formData, onInputChange]);

   useEffect(() => {
      const holdCode = formData["Hold Voucher"];
      const description = holdVoucherDescriptions[holdCode] || "";
      if (formData["Hold Description"] !== description) {
         onInputChange("Hold Description", description);
      }
   }, [formData["Hold Voucher"]]);

   return (
      <div className="form-section">
         <div className="form-section">
            <div className="ap-entry-container">
               <div className="grid-entry-header">
                  <h5 className="section-title">{entryTittle}</h5>
                  <Divider type="horizontal" className="vendor-divider" />

               {formFieldsLabelsStepOne.map((label) => {
                  if (
                     label === "Product Invoice for Allocation" ||
                     label === "Sales Order" ||
                     label === "SRN" ||
                     label === "Vendor"
                  ) {
                     return null;
                  }

              const isFieldDisabled =
                disabledFields.includes(label) ||
                ((label === "Prepaid Check No" || label === "Check Date") &&
                  !formData["Prepaid Voucher"]);

              return (
                <div key={label} className="form-field-wrapper">
                  <p className="sub-title">
                    {isRequired(label) && (
                      <>
                        <span className="astricks">*</span>
                        &nbsp;
                      </>
                    )}
                    {label}
                  </p>

                  {label.includes("Date") ? (
                    <CustomDatePicker
                      name={label}
                      value={formData[label]}
                      onChange={onInputChange}
                      disabled={isFieldDisabled}
                    />
                  ) : label === "Single Check" ||
                    label === "Canceled Voucher" ||
                    label === "Prepaid Code" ? (
                    <CustomSelectDropdown
                      name={label}
                      value={formData[label] || ""}
                      onChange={(value) => onInputChange(label, value)}
                      options={yesNoOptions}
                      placeholder={selectPlaceholder}
                      className="ui-dropdown-cn"
                    />
                  ) : label === "Hold Voucher" ? (
                    <CustomSelectDropdown
                      name={label}
                      value={formData[label] || ""}
                      onChange={(value) => {
                        onInputChange(label, value);
                        const description =
                          holdVoucherDescriptions[value] || "";
                        onInputChange("Hold Description", description);
                      }}
                      options={holdVoucherCode}
                      placeholder={selectPlaceholder}
                      className="ui-dropdown-cn"
                    />
                  ) : label === "Prepaid Voucher" ? (
                    <CustomSelectDropdown
                      name={label}
                      value={formData[label] || ""}
                      onChange={(value) => onInputChange(label, value)}
                      options={prepaidOptions}
                      placeholder={selectPlaceholder}
                      className="ui-dropdown-cn"
                    />
                  ) : label.includes("Description") ||
                    label.includes("Address") ? (
                    <CustomPrefixInput
                      name={label}
                      value={formData[label] || ""}
                      onChange={(e) => onInputChange(label, e.target.value)}
                      className="cne-line-textarea description-textarea"
                      placeholder="Enter description"
                      disabled={isFieldDisabled}
                    />
                  ) : label === "Invoice Amount" ? (
                    <CustomPrefixInput
                      name={label}
                      value={formData[label] || ""}
                      onChange={(e) => onInputChange(label, e.target.value)}
                      onBlur={(e) => {
                        const formatted = formatAmountValue(
                          label,
                          e.target.value
                        );
                        if (formatted !== formData[label]) {
                          onInputChange(label, formatted);
                        }
                        const numValue = parseFloat(e.target.value);
                        if (numValue === 0) {
                          onInputChange(label, e.target.value);
                          errors["Invoice Amount"] =
                            "TOTAL INVOICE AMOUNT MAY NOT BE ZERO";
                        }
                      }}
                      placeholder={getPlaceholder(label)}
                      disabled={isFieldDisabled}
                    />
                  ) : label === "Prepaid Check No" ? (
                    <CustomPrefixInput
                      name={label}
                      value={formData[label] || ""}
                      onChange={(e) => onInputChange(label, e.target.value)}
                      onBlur={(e) => {
                        const numValue = parseFloat(e.target.value);
                        if (
                          numValue === 0 &&
                          formData["Prepaid Voucher"] !== ""
                        ) {
                          onInputChange(label, e.target.value);
                          errors["Prepaid Check No"] =
                            "INVALID INVENTORY ITEM NUMBER ENTERED";
                        }
                      }}
                      placeholder={getPlaceholder(label)}
                      disabled={isFieldDisabled}
                    />
                  ) : (
                    <CustomPrefixInput
                      name={label}
                      value={formData[label] || ""}
                      onChange={(e) => onInputChange(label, e.target.value)}
                      placeholder={getPlaceholder(label)}
                      disabled={isFieldDisabled}
                    />
                  )}

                  {errors[label] && (
                    <p className="error-message">{errors[label]}</p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="outside-grid-bottom">
            <div className="form-field-wrapper full-width">
              <p className="sub-title">Product Invoice for Allocation</p>
              <div className="radio-group radio-inline-group">
                {productAllocationOptions.map((option) => (
                  <CustomRadioButton
                    key={option.value}
                    label={option.label}
                    value={option.value}
                    name="Product Invoice for Allocation"
                    checked={
                      formData["Product Invoice for Allocation"] ===
                      option.value
                    }
                    onChange={(val) =>
                      onInputChange("Product Invoice for Allocation", val)
                    }
                  />
                ))}
              </div>
            </div>
            {formData["Product Invoice for Allocation"] ===
              "By Sales Order" && (
              <div className="form-field-row">
                <div className="form-field-wrapper small-width">
                  <p className="sub-title">Sales Order</p>
                  <CustomPrefixInput
                    name="Sales Order"
                    value={formData["Sales Order"] || ""}
                    onChange={(e) =>
                      onInputChange("Sales Order", e.target.value)
                    }
                    placeholder={getPlaceholder("Sales Order")}
                  />
                  {errors["Sales Order"] && (
                    <p className="error-message">{errors["Sales Order"]}</p>
                  )}
                </div>

                <div className="form-field-wrapper small-width">
                  <p className="sub-title">SRN</p>
                  <CustomPrefixInput
                    name="SRN"
                    value={formData["SRN"] || ""}
                    onChange={(e) => onInputChange("SRN", e.target.value)}
                    placeholder={getPlaceholder("SRN")}
                  />
                  {errors["SRN"] && (
                    <p className="error-message">{errors["SRN"]}</p>
                  )}
                </div>
              </div>
            )}

            {formData["Product Invoice for Allocation"] === "By Vendor" && (
              <div className="form-field-row">
                <div className="form-field-wrapper small-width">
                  <p className="sub-title">Vendor</p>
                  <CustomPrefixInput
                    name="Vendor"
                    value={formData["Vendor"] || ""}
                    onChange={(e) => onInputChange("Vendor", e.target.value)}
                    placeholder={getPlaceholder("Vendor")}
                  />
                  {errors["Vendor"] && (
                    <p className="error-message">{errors["Vendor"]}</p>
                  )}
                </div>

                <div className="form-field-wrapper small-width">
                  <p className="sub-title">Invoice No</p>
                  <CustomPrefixInput
                    name="Vendor Invoice No"
                    value={formData["Vendor Invoice No"] || ""}
                    onChange={(e) =>
                      onInputChange("Vendor Invoice No", e.target.value)
                    }
                    placeholder={getPlaceholder("Vendor Invoice No")}
                  />
                  {errors["Vendor Invoice No"] && (
                    <p className="error-message">
                      {errors["Vendor Invoice No"]}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderForm;
