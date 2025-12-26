import React, { useEffect, useState, useRef } from "react";
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
   fieldMaxLengthMap,
} from "../../../../../../../../../constants/commonConstants";
import { formatAmountValue } from "../../../../../../../../../utils/formatters";
import { validateIntegerInput, validateInvoiceAmount, formatInvoiceAmountOnBlur, validateInvoiceNo } from "../../../../../../../../../utils/validation";
import type { StepOneFormProps } from "../../../../../../../../../types/accounts-payable.types";
import CustomDatePicker from "../../../../../../../../../widget-library/DatePicker";
import { CustomSelectDropdown } from "../../../../../../../../../widget-library/Dropdown";
import { CustomPrefixInput } from "../../../../../../../../../widget-library/Input";
import CustomRadioButton from "../../../../../../../../../widget-library/RadioGroup";
import { useGlMaster, useCalculateDueDates } from "../../../../../../../../../hooks/useNormalProcess";
import { formatNumberToMMDDYY, formatMMDDYYForDisplay } from "../../../../../../../../../utils/dateFormat";
// Removed validateDiscountDates import - now using backend warnings instead

const getPlaceholder = (label: string): string => {
   return (
      customPlaceholders[label] ||
      (numericFields.has(label) ? "Enter number" : "Enter text")
   );
};

const StepOneForm: React.FC<
   StepOneFormProps & {
      errors?: { [key: string]: string };
      enabledFieldsByError?: Set<string>;
      apGlForcedEnabled?: boolean;
      mode?: string;
      onValidationErrorsChange?: (errors: { [key: string]: string }) => void;
      warnings?: { [key: string]: string };
   }
> = ({
   formData,
   onInputChange,
   onInputBlur,
   errors = {},
   enabledFieldsByError = new Set(),
   mode,
   onValidationErrorsChange,
   warnings = {},
}) => {
   const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
   const [discountWarnings, setDiscountWarnings] = useState<{ [key: string]: string }>({});
   const validationTimeoutRef = useRef<{ [key: string]: NodeJS.Timeout }>({});
   
   // Notify parent component when validation errors change
   useEffect(() => {
      if (onValidationErrorsChange) {
         onValidationErrorsChange(validationErrors);
      }
   }, [validationErrors, onValidationErrorsChange]);

   // Use backend warnings instead of frontend validation for discount due date
   useEffect(() => {
      const newDiscountWarnings: { [key: string]: string } = {};
      
      // Check if backend has a warning for discount due date
      if (warnings["Discount Due Date"]) {
         newDiscountWarnings["Discount Due Date"] = warnings["Discount Due Date"];
      }
      
      setDiscountWarnings(newDiscountWarnings);
   }, [warnings]);
   
   // React Query hooks for API calls
   const glMasterMutation = useGlMaster();
   const calculateDueDatesMutation = useCalculateDueDates();
   
   const requiredFields = [
      "Invoice No",
      "Invoice Amount",
      "Invoice Date",
      ...(formData["Prepaid Voucher"] && formData["Prepaid Voucher"] !== ""
         ? ["Prepaid Check No", "Check Date"]
         : []),
   ];
   const isRequired = (field: string) => requiredFields.includes(field);

   // Simple GL Master API call on 8th character for Account Pay G/L
   const callGlMasterApi = async (glNo: string) => {
      try {
         const response = await glMasterMutation.mutateAsync({
            companyNo: parseInt(formData["Company No"] || "10"),
            glNo: parseInt(glNo),
         });
         
         // Auto-populate description field if API returns data
         if (response?.data?.items?.description) {
            onInputChange("Account Pay G/L Description", response.data.items.description);
         }
      } catch (error) {
         console.error("Error calling GL Master API:", error);
      }
   };

   // GL Master API call for Bank Acct G/L
   const callBankGlMasterApi = async (glNo: string) => {
      try {
         const response = await glMasterMutation.mutateAsync({
            companyNo: parseInt(formData["Company No"] || "10"),
            glNo: parseInt(glNo),
         });
         
         // Auto-populate Bank Acct G/L Description field if API returns data
         if (response?.data?.items?.description) {
            onInputChange("Bank Acct G/L Description", response.data.items.description);
         }
      } catch (error) {
         console.error("Error calling Bank GL Master API:", error);
      }
   };

   // Calculate due dates API call when invoice date is entered
   const callCalculateDueDatesApi = async (invoiceDate: string) => {
      try {
         // Convert invoice date to MMDDYY format
         const formattedDate = formatNumberToMMDDYY(invoiceDate);
         
         if (!formattedDate || !formData["Company No"] || !formData["Vendor No"]) {
            return;
         }

         const response = await calculateDueDatesMutation.mutateAsync({
            companyNo: parseInt(formData["Company No"] || "10"),
            vendorNo: parseInt(formData["Vendor No"]),
            invoiceDate: formattedDate,
         });
         
         // Auto-populate Due Date and Discount Due Date fields if API returns data
         if (response?.data?.items) {
            const { dueDate, discountDueDate } = response.data.items;
            
            // Update Due Date - display in MM/DD/YY format
            if (dueDate !== undefined && dueDate !== null) {
               onInputChange("Due Date", formatMMDDYYForDisplay(dueDate));
            }
            
            // Update Discount Due Date - display in MM/DD/YY format
            if (discountDueDate !== undefined && discountDueDate !== null) {
               onInputChange("Discount Due Date", formatMMDDYYForDisplay(discountDueDate));
            }
         }
      } catch (error) {
         console.error("Error calling Calculate Due Dates API:", error);
      }
   };

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

   // Cleanup timeouts on unmount to prevent memory leaks
   useEffect(() => {
      return () => {
         Object.values(validationTimeoutRef.current).forEach(timeout => {
            clearTimeout(timeout);
         });
      };
   }, []);

   // Auto-populate Bank Acct G/L Description in edit mode if Bank Acct G/L has value
   useEffect(() => {
      if (mode === "edit" && formData["Bank Acct G/L"] && formData["Bank Acct G/L"].length === 8) {
         // Only call API if description is empty to avoid overriding existing data
         if (!formData["Bank Acct G/L Description"]) {
            callBankGlMasterApi(formData["Bank Acct G/L"]);
         }
      }
   }, [mode, formData["Bank Acct G/L"], formData["Bank Acct G/L Description"]]);

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
                        (disabledFields.includes(label) &&
                           !enabledFieldsByError.has(label)) ||
                        ((label === "Prepaid Check No" ||
                           label === "Check Date") &&
                           (!formData["Prepaid Voucher"] ||
                              formData["Prepaid Voucher"] === ""));

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
                                 onChange={(fieldName, value) => {
                                    // Handle Invoice Date change - call API to calculate due dates
                                    if (fieldName === "Invoice Date") {
                                       onInputChange(fieldName, value);
                                       // Call API to calculate due dates
                                       if (value) {
                                          callCalculateDueDatesApi(value);
                                       } else {
                                          // Clear due dates if invoice date is cleared
                                          onInputChange("Due Date", "");
                                          onInputChange("Discount Due Date", "");
                                       }
                                    } else {
                                       onInputChange(fieldName, value);
                                    }
                                 }}
                                 onBlur={(fieldName, value) => {
                                    // Clear backend validation errors on blur
                                    if (onInputBlur) {
                                       onInputBlur(fieldName, value);
                                    }
                                 }}
                                 disabled={isFieldDisabled}
                              />
                           ) : label === "Single Check" ||
                             label === "Canceled Voucher" ||
                             label === "Prepaid Code" ? (
                              <CustomSelectDropdown
                                 name={label}
                                 value={formData[label] || ""}
                                 onChange={(value) =>
                                    onInputChange(label, value)
                                 }
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
                                    onInputChange(
                                       "Hold Description",
                                       description
                                    );
                                 }}
                                 options={holdVoucherCode}
                                 placeholder={selectPlaceholder}
                                 className="ui-dropdown-cn"
                              />
                           ) : label === "Prepaid Voucher" ? (
                              <CustomSelectDropdown
                                 name={label}
                                 value={formData[label] || ""}
                                 onChange={(value) => {
                                    onInputChange(label, value);
                                 }}
                                 options={prepaidOptions}
                                 placeholder={selectPlaceholder}
                                 className="ui-dropdown-cn"
                              />
                           ) : label.includes("Description") ||
                             label.includes("Address") ? (
                              <CustomPrefixInput
                                 name={label}
                                 value={formData[label] || ""}
                                 onChange={(e) => {
                                    const value = e.target.value;
                                    const maxLength = fieldMaxLengthMap[label];
                                    const currentValue = formData[label] || "";
                                    
                                    // Clear any existing max length error when typing within limit
                                    if (!maxLength || value.length <= maxLength) {
                                       setValidationErrors((prev) => {
                                          const updated = { ...prev };
                                          delete updated[label];
                                          return updated;
                                       });
                                       onInputChange(label, value);
                                    }
                                    
                                    // Show error when user tries to type beyond limit
                                    // This happens when current value is at max length and user tries to add more
                                    if (maxLength && currentValue.length >= maxLength && value.length > currentValue.length) {
                                       setValidationErrors((prev) => ({
                                          ...prev,
                                          [label]: `${label} CANNOT EXCEED ${maxLength} CHARACTERS`,
                                       }));
                                       
                                       // Clear error after 3 seconds
                                       setTimeout(() => {
                                          setValidationErrors((prev) => {
                                             const updated = { ...prev };
                                             delete updated[label];
                                             return updated;
                                          });
                                       }, 3000);
                                    }
                                 }}
                                 className=""
                                 placeholder="Enter description"
                                 disabled={isFieldDisabled}
                                 status={errors[label] || validationErrors[label] ? "error" : ""}
                                 maxLength={
                                    fieldMaxLengthMap[label]
                                       ? fieldMaxLengthMap[label]
                                       : undefined
                                 }
                                 showCount={true}
                              />
                           ) : label === "Invoice Amount" || label === "Freight" ? (
                              <CustomPrefixInput
                                 name={label}
                                 value={formData[label] || ""}
                                 onChange={(e) => {
                                    if (label === "Invoice Amount" || label === "Freight") {
                                       const validationResult = validateInvoiceAmount(e);
                                       const newVal = validationResult.value;
                                       
                                       if (validationResult.hasError) {
                                          setValidationErrors(prev => ({ ...prev, [label]: "Please enter numbers only" }));
                                          
                                          // Clear any existing timeout for this field
                                          if (validationTimeoutRef.current[label]) {
                                             clearTimeout(validationTimeoutRef.current[label]);
                                          }
                                          
                                          // Set timeout to clear error after 3 seconds
                                          validationTimeoutRef.current[label] = setTimeout(() => {
                                             setValidationErrors(prev => {
                                                const newErrors = { ...prev };
                                                delete newErrors[label];
                                                return newErrors;
                                             });
                                             delete validationTimeoutRef.current[label];
                                          }, 3000);
                                       } else {
                                          // Clear timeout and error immediately if input is valid
                                          if (validationTimeoutRef.current[label]) {
                                             clearTimeout(validationTimeoutRef.current[label]);
                                             delete validationTimeoutRef.current[label];
                                          }
                                          setValidationErrors(prev => {
                                             const newErrors = { ...prev };
                                             delete newErrors[label];
                                             return newErrors;
                                          });
                                       }

                                       // Helper to parse numeric (allow '-' while typing but treat as NaN -> 0)
                                       const parseNum = (v: string) => {
                                          const raw = String(v || "").replace(/,/g, "").trim();
                                          // If it's just '-' allow interim state, parse as NaN
                                          if (raw === "-" || raw === "") return NaN;
                                          const n = parseFloat(raw);
                                          return isNaN(n) ? NaN : n;
                                       };

                                       const invoiceNum = parseNum(label === "Invoice Amount" ? newVal : (formData["Invoice Amount"] || ""));
                                       const freightNumCurrent = parseNum(formData["Freight"] || "");
                                       const freightNumNew = parseNum(label === "Freight" ? newVal : (formData["Freight"] || ""));

                                       // ====== NEW: ENFORCE validation rule (no auto-coercion) ======
                                       // If user is editing Freight:
                                       if (label === "Freight") {
                                          // If freight new value is negative while invoice is non-negative -> reject and show error
                                          if (!isNaN(freightNumNew) && freightNumNew < 0) {
                                             const invoiceValForCheck = isNaN(invoiceNum) ? 0 : invoiceNum;
                                             if (!(invoiceValForCheck < 0)) {
                                                // Invoice is non-negative: disallow negative freight
                                                setValidationErrors(prev => ({
                                                   ...prev,
                                                   Freight: "Freight can be negative only when Invoice Amount is negative"
                                                }));
                                                // Don't update the freight value (reject negative input)
                                                return;
                                             } else {
                                                // Invoice negative -> allow freight negative; clear freight error if any
                                                setValidationErrors(prev => {
                                                   const updated = { ...prev };
                                                   delete updated["Freight"];
                                                   return updated;
                                                });
                                             }
                                          } else {
                                             // Freight is non-negative or intermediate (e.g. '-') -> clear freight-specific rule error
                                             setValidationErrors(prev => {
                                                const updated = { ...prev };
                                                // Only clear the specific rule message, preserve other field errors
                                                if (updated["Freight"] === "Freight can be negative only when Invoice Amount is negative") {
                                                   delete updated["Freight"];
                                                }
                                                return updated;
                                             });
                                          }

                                          // If allowed, propagate new value
                                          onInputChange("Freight", newVal);
                                          return;
                                       }

                                       // If user is editing Invoice Amount:
                                       if (label === "Invoice Amount") {
                                          // If invoice becomes non-negative, but freight currently negative -> show freight error
                                          const invoiceVal = parseNum(newVal);
                                          const freightVal = freightNumCurrent;

                                          if (!isNaN(freightVal) && freightVal < 0 && !(invoiceVal < 0)) {
                                             setValidationErrors(prev => ({
                                                ...prev,
                                                Freight: "Freight can be negative only when Invoice Amount is negative"
                                             }));
                                          } else {
                                             // Clear freight rule error when invoice negative or freight not negative
                                             setValidationErrors(prev => {
                                                const updated = { ...prev };
                                                if (updated["Freight"] === "Freight can be negative only when Invoice Amount is negative") {
                                                   delete updated["Freight"];
                                                }
                                                return updated;
                                             });
                                          }

                                          // propagate invoice value
                                          onInputChange("Invoice Amount", newVal);
                                          return;
                                       }

                                       // ===================================================================================
                                    } else {
                                       onInputChange(label, e.target.value);
                                    }
                                 }}
                                 onBlur={(e) => {
                                    if (label === "Invoice Amount" || label === "Freight") {
                                       const formatted = formatInvoiceAmountOnBlur(e.target.value);
                                       
                                       if (formatted !== formData[label]) {
                                          if (label === "Freight") {
                                             const raw = String(formatted || "").replace(/,/g, "").trim();
                                             const parsed = raw === "" || raw === "-" ? NaN : parseFloat(raw);
                                             const invoiceRaw = String(formData["Invoice Amount"] || "").replace(/,/g, "").trim();
                                             const invoiceParsed = invoiceRaw === "" || invoiceRaw === "-" ? NaN : parseFloat(invoiceRaw);

                                             if (!isNaN(parsed) && parsed < 0 && !(invoiceParsed < 0)) {
                                                // formatted freight is negative while invoice isn't negative -> set error and do not apply formatted negative freight
                                                setValidationErrors(prev => ({
                                                   ...prev,
                                                   Freight: "Freight can be negative only when Invoice Amount is negative"
                                                }));
                                             } else {
                                                setValidationErrors(prev => {
                                                   const updated = { ...prev };
                                                   if (updated["Freight"] === "Freight can be negative only when Invoice Amount is negative") {
                                                      delete updated["Freight"];
                                                   }
                                                   return updated;
                                                });
                                                onInputChange("Freight", formatted);
                                             }
                                          } else {
                                             // Invoice Amount blurred -> apply formatted and re-check freight rule
                                             onInputChange("Invoice Amount", formatted);

                                             const invoiceRaw = String(formatted || "").replace(/,/g, "").trim();
                                             const invoiceParsed = invoiceRaw === "" || invoiceRaw === "-" ? NaN : parseFloat(invoiceRaw);
                                             const freightRaw = String(formData["Freight"] || "").replace(/,/g, "").trim();
                                             const freightParsed = freightRaw === "" || freightRaw === "-" ? NaN : parseFloat(freightRaw);

                                             if (!isNaN(freightParsed) && freightParsed < 0 && !(invoiceParsed < 0)) {
                                                setValidationErrors(prev => ({
                                                   ...prev,
                                                   Freight: "Freight can be negative only when Invoice Amount is negative"
                                                }));
                                             } else {
                                                setValidationErrors(prev => {
                                                   const updated = { ...prev };
                                                   if (updated["Freight"] === "Freight can be negative only when Invoice Amount is negative") {
                                                      delete updated["Freight"];
                                                   }
                                                   return updated;
                                                });
                                             }
                                          }
                                       }
                                    } else {
                                       const formatted = formatAmountValue(
                                          label,
                                          e.target.value
                                       );
                                       onInputChange(label, formatted);
                                    }
                                 }}
                                 placeholder={getPlaceholder(label)}
                                 disabled={isFieldDisabled}
                                 status={errors[label] || validationErrors[label] ? "error" : ""}
                                 maxLength={
                                    fieldMaxLengthMap[label]
                                       ? fieldMaxLengthMap[label] + 1
                                       : undefined
                                 }
                              />
                           ) : label === "Prepaid Check No" ? (
                              <CustomPrefixInput
                                 name={label}
                                 value={formData[label] || ""}
                                 onChange={(e) => {
                                    const validationResult =
                                       validateIntegerInput(e);

                                    onInputChange(
                                       label,
                                       validationResult.value
                                    );
                                 }}
                                 placeholder={getPlaceholder(label)}
                                 disabled={isFieldDisabled}
                                 status={errors[label] ? "error" : ""}
                                 maxLength={
                                    fieldMaxLengthMap[label]
                                       ? fieldMaxLengthMap[label] + 1
                                       : undefined
                                 }
                              />
                           ) : label === "Account Pay G/L" ? (
                              <CustomPrefixInput
                                 name={label}
                                 value={formData[label] || ""}
                                 onChange={(e) => {
                                    const value = e.target.value;
                                    onInputChange(label, value);
                                    // Call GL Master API on 8th character
                                    if (value && value.length === 8) {
                                       callGlMasterApi(value);
                                    }
                                 }}
                                 placeholder={getPlaceholder(label)}
                                 //disabled={isFieldDisabled}
                                 status={errors[label] ? "error" : ""}
                                 maxLength={
                                    fieldMaxLengthMap[label]
                                       ? fieldMaxLengthMap[label] + 1
                                       : undefined
                                 }
                              />
                           ) : label === "Bank Acct G/L" ? (
                              <CustomPrefixInput
                                 name={label}
                                 value={formData[label] || ""}
                                 onChange={(e) => {
                                    const value = e.target.value;
                                    onInputChange(label, value);
                                    // Call Bank GL Master API on 8th character
                                    if (value && value.length === 8) {
                                       callBankGlMasterApi(value);
                                    }
                                 }}
                                 placeholder={getPlaceholder(label)}
                                 //disabled={isFieldDisabled}
                                 status={errors[label] ? "error" : ""}
                                 maxLength={
                                    fieldMaxLengthMap[label]
                                       ? fieldMaxLengthMap[label] + 1
                                       : undefined
                                 }
                              />
                           ) : label === "Invoice No" ? (
                              <CustomPrefixInput
                                 name={label}
                                 value={formData[label] || ""}
                                 onChange={(e) => {
                                    const validationResult = validateInvoiceNo(e);
                                    onInputChange(label, validationResult.value);
                                    // No error handling needed since validateInvoiceNo auto-converts to uppercase
                                 }}
                                 placeholder={getPlaceholder(label)}
                                 disabled={isFieldDisabled}
                                 status={errors[label] || validationErrors[label] ? "error" : ""}
                                 maxLength={
                                    fieldMaxLengthMap[label]
                                       ? fieldMaxLengthMap[label] + 1
                                       : undefined
                                 }
                              />
                           ) : (
                              <CustomPrefixInput
                                 name={label}
                                 value={formData[label] || ""}
                                 onChange={(e) =>
                                    onInputChange(label, e.target.value)
                                 }
                                 placeholder={getPlaceholder(label)}
                                 disabled={isFieldDisabled}
                                 status={errors[label] ? "error" : ""}
                                 maxLength={
                                    fieldMaxLengthMap[label]
                                       ? fieldMaxLengthMap[label] + 1
                                       : undefined
                                 }
                              />
                           )}

                           {(errors[label] || validationErrors[label]) && (
                              <p className="error-message">{errors[label] || validationErrors[label]}</p>
                           )}
                           {discountWarnings[label] && (
                              <p className="warning-message">{discountWarnings[label]}</p>
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
                                 onInputChange(
                                    "Product Invoice for Allocation",
                                    val
                                 )
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
                              status={errors["Sales Order"] ? "error" : ""}
                              maxLength={
                                 fieldMaxLengthMap["Sales Order"]
                                    ? fieldMaxLengthMap["Sales Order"] + 1
                                    : undefined
                              }
                           />
                           {errors["Sales Order"] && (
                              <p className="error-message">
                                 {errors["Sales Order"]}
                              </p>
                           )}
                        </div>

                        <div className="form-field-wrapper small-width">
                           <p className="sub-title">SRN</p>
                           <CustomPrefixInput
                              name="SRN"
                              value={formData["SRN"] || ""}
                              onChange={(e) =>
                                 onInputChange("SRN", e.target.value)
                              }
                              placeholder={getPlaceholder("SRN")}
                              status={errors["SRN"] ? "error" : ""}
                              maxLength={
                                 fieldMaxLengthMap["SRN"]
                                    ? fieldMaxLengthMap["SRN"] + 1
                                    : undefined
                              }
                           />
                           {errors["SRN"] && (
                              <p className="error-message">{errors["SRN"]}</p>
                           )}
                        </div>
                     </div>
                  )}

                  {formData["Product Invoice for Allocation"] ===
                     "By Vendor" && (
                     <div className="form-field-row">
                        <div className="form-field-wrapper small-width">
                           <p className="sub-title">Vendor</p>
                           <CustomPrefixInput
                              name="Vendor"
                              value={formData["Vendor"] || ""}
                              onChange={(e) =>
                                 onInputChange("Vendor", e.target.value)
                              }
                              placeholder={getPlaceholder("Vendor")}
                              status={errors["Vendor"] ? "error" : ""}
                              maxLength={
                                 fieldMaxLengthMap["Vendor Name"]
                                    ? fieldMaxLengthMap["Vendor Name"] + 1
                                    : undefined
                              }
                           />
                           {errors["Vendor"] && (
                              <p className="error-message">
                                 {errors["Vendor"]}
                              </p>
                           )}
                        </div>

                        <div className="form-field-wrapper small-width">
                           <p className="sub-title">Invoice No</p>
                           <CustomPrefixInput
                              name="Vendor Invoice No"
                              value={formData["Vendor Invoice No"] || ""}
                              onChange={(e) =>
                                 onInputChange(
                                    "Vendor Invoice No",
                                    e.target.value
                                 )
                              }
                              placeholder={getPlaceholder("Vendor Invoice No")}
                              status={
                                 errors["Vendor Invoice No"] ? "error" : ""
                              }
                              maxLength={
                                 fieldMaxLengthMap["Invoice No"]
                                    ? fieldMaxLengthMap["Invoice No"] + 1
                                    : undefined
                              }
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

export default StepOneForm;
