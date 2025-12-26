import React, { useEffect, useMemo } from "react";
import { CustomPrefixInput } from "@/widget-library/Input";
import { CustomSelectDropdown } from "@/widget-library/Dropdown";
import { useDropdownData } from "@/hooks/useDropdownData";
import { vendorFieldMaxLengthMap } from "@/constants/commonConstants";
import "./vendor-forms.scss";
import { Divider } from "antd";

interface ExpenseDetailsFormData {
   vendorHoldPaymentsVend?: string;
   vendorGalRcptsRequired?: string;
   vendorSingleCheck?: string | number;
   vendorApTermsCode?: number;
   vendorApTermsCodeDescription?: string;
   vendorAdpPayrollId?: string | number;
   vendorCategoryCode?: string;
   vendorCategoryCodeDescription?: string;
   vendorCarrierId?: string;
   vendorExpenseGLSub?: string | number;
}

interface ExpenseDetailsFormProps {
   formData: ExpenseDetailsFormData;
   onChange: (field: string, value: string | number) => void;
   isEditMode?: boolean;
   errors?: Record<string, string>; // Add errors prop for API validation errors
   onValidateExpenseGl?: (value?: string | number) => Promise<void>;
}

const ExpenseDetailsForm: React.FC<ExpenseDetailsFormProps> = ({
   formData,
   onChange,
   isEditMode = false,
   errors,
   onValidateExpenseGl,
}) => {
   const [validationErrors, setValidationErrors] = React.useState<Record<string, string>>({});
   // Dropdown data hooks following the country pattern
   const {
      data: holdVendorOptions,
      isLoading: isLoadingHoldVendor,
   } = useDropdownData("HOLD_VOUCHER_CODE");
   const {
      data: termsCodeOptions,
      isLoading: isLoadingTerms,
   } = useDropdownData("VENDOR_TERMS_CODE");
   const {
      data: galReceiptOptions,
      isLoading: isLoadingGalReceipt,
   } = useDropdownData("VENDOR_GAL_RECEIPT");
   const {
      data: categoryOptions,
      isLoading: isLoadingCategory,
   } = useDropdownData("VENDOR_CATEGORY");
   const {
      data: carrierOptions,
      isLoading: isLoadingCarrier,
   } = useDropdownData("VENDOR_CARRIER");

   const computedTermsCodeDescription = useMemo(() => {
      if (
         isEditMode &&
         formData.vendorApTermsCode &&
         termsCodeOptions &&
         termsCodeOptions.length > 0 &&
         !isLoadingTerms
      ) {
         // Convert the form value to string and pad with leading zero if needed
         const formValueStr = formData.vendorApTermsCode
            .toString()
            .padStart(2, "0");

         const selectedOption = termsCodeOptions.find(
            (option) => option.value === formValueStr
         );
         return selectedOption?.label || "";
      }
      return "";
   }, [
      isEditMode,
      formData.vendorApTermsCode,
      termsCodeOptions,
      isLoadingTerms,
   ]);

   const computedCategoryDescription = useMemo(() => {
      if (
         isEditMode &&
         formData.vendorCategoryCode &&
         categoryOptions &&
         categoryOptions.length > 0 &&
         !isLoadingCategory
      ) {
         const selectedOption = categoryOptions.find(
            (option) => option.value === formData.vendorCategoryCode
         );
         return selectedOption?.label || "";
      }
      return "";
   }, [
      isEditMode,
      formData.vendorCategoryCode,
      categoryOptions,
      isLoadingCategory,
   ]);

   useEffect(() => {
      if (
         isEditMode &&
         computedTermsCodeDescription &&
         !formData.vendorApTermsCodeDescription
      ) {
         onChange("vendorApTermsCodeDescription", computedTermsCodeDescription);
      }
   }, [
      isEditMode,
      computedTermsCodeDescription,
      formData.vendorApTermsCodeDescription,
      onChange,
   ]);

   useEffect(() => {
      if (
         isEditMode &&
         computedCategoryDescription &&
         !formData.vendorCategoryCodeDescription
      ) {
         onChange("vendorCategoryCodeDescription", computedCategoryDescription);
      }
   }, [
      isEditMode,
      computedCategoryDescription,
      formData.vendorCategoryCodeDescription,
      onChange,
   ]);

   const handleInputChange =
      (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
         const value = e.target.value;
         
         // Map field names to display names for consistent error messaging
         const fieldDisplayNames: Record<string, string> = {
            vendorSingleCheck: "Single Check",
            vendorExpenseGLSub: "Expense G/L",
            vendorAdpPayrollId: "ADP Payroll ID",
         };

         // Define maxLength for fields
         const maxLengths: Record<string, number> = {
            vendorSingleCheck: vendorFieldMaxLengthMap["Single Check"],
            vendorExpenseGLSub: vendorFieldMaxLengthMap["Expense G/L"],
            vendorAdpPayrollId: 7, 
         };

         let formattedValue = value;

         if (field === "vendorExpenseGLSub") {
            formattedValue = value.replace(/\D/g, "");
         }

         if (field === "vendorSingleCheck" || field === "vendorExpenseGLSub" || field === "vendorAdpPayrollId") {
            const displayName = fieldDisplayNames[field];
            const maxLength = maxLengths[field];

            if (
               field === "vendorAdpPayrollId" &&
               value &&
               !/^\d*$/.test(value)
            ) {
               setValidationErrors((prev) => ({
                  ...prev,
                  [field]: `${displayName} MUST CONTAIN NUMBERS ONLY`,
               }));
               return; 
            }

            // Hard stop: if length exceeds max characters, show error and don't update field
            if (maxLength && formattedValue.length > maxLength) {
               setValidationErrors((prev) => ({
                  ...prev,
                  [field]: `${displayName} CANNOT EXCEED ${maxLength} CHARACTER${maxLength > 1 ? 'S' : ''}`,
               }));
               return; // Hard stop - don't update the field value
            }
            
            // Clear validation error if input is valid and within length limit
            setValidationErrors((prev) => {
               const { [field]: _, ...rest } = prev;
               return rest;
            });
         }
         
         onChange(field, formattedValue);
      };
const handleBlur = (field: string) => async () => {
   setValidationErrors((prev) => {
      const { [field]: _, ...rest } = prev;
      return rest;
   });

   if (field === "vendorExpenseGLSub" && onValidateExpenseGl) {
      await onValidateExpenseGl(formData.vendorExpenseGLSub);
   }
};

   // Handle Terms Code selection and auto-populate description
   const handleTermsCodeChange = (selectedValue: string) => {
      const selectedOption = termsCodeOptions?.find(
         (option) => option.value === selectedValue
      );

      const numericId = parseInt(selectedValue) || 0;
      onChange("vendorApTermsCode", numericId);

      if (selectedOption && selectedOption.label) {
         onChange("vendorApTermsCodeDescription", selectedOption.label);
      } else {
         onChange("vendorApTermsCodeDescription", "");
      }
   };

   // Handle Category selection and auto-populate description
   const handleCategoryChange = (selectedValue: string) => {
      const selectedOption = categoryOptions?.find(
         (option) => option.value === selectedValue
      );

      onChange("vendorCategoryCode", selectedValue);

      if (selectedOption && selectedOption.label) {
         onChange("vendorCategoryCodeDescription", selectedOption.label);
      } else {
         onChange("vendorCategoryCodeDescription", "");
      }
   };

   return (
      <div className="add-vendor-section expense-details-section vendor-details-form">
         <h4 className="section-title">Expense Details</h4>
         <Divider />

         {/* Row 1 */}
         <div className="row third-row">
            <div className="form-field">
               <label className="sub-title">Hold Vendor</label>
               <CustomSelectDropdown
                  name="vendorHoldPaymentsVend"
                  placeholder="Select"
                  options={
                     holdVendorOptions?.map((option) => ({
                        label: option.label || "",
                        value: option.value || "",
                     })) || []
                  }
                  value={formData.vendorHoldPaymentsVend || ""}
                  onChange={(value) =>
                     onChange("vendorHoldPaymentsVend", value)
                  }
                  loading={isLoadingHoldVendor}
               />
               {errors?.vendorHoldPaymentsVend && (
                  <div className="error-message">{errors.vendorHoldPaymentsVend}</div>
               )}
            </div>
            <div className="form-field">
               <label className="sub-title">Gal/Rcpts Required</label>
               <CustomSelectDropdown
                  name="vendorGalRcptsRequired"
                  placeholder="Select"
                  options={
                     galReceiptOptions?.map((option) => ({
                        label: option.label || "",
                        value: option.value || "",
                     })) || []
                  }
                  value={formData.vendorGalRcptsRequired || ""}
                  onChange={(value) =>
                     onChange("vendorGalRcptsRequired", value)
                  }
                  loading={isLoadingGalReceipt}
               />
               {errors?.vendorGalRcptsRequired && (
                  <div className="error-message">{errors.vendorGalRcptsRequired}</div>
               )}
            </div>
            <div className="form-field">
               <label className="sub-title">Single Check - S</label>
               <CustomPrefixInput
                  name="vendorSingleCheck"
                  placeholder=""
                  value={
                     formData.vendorSingleCheck
                        ? formData.vendorSingleCheck.toString()
                        : ""
                  }
                  onChange={handleInputChange("vendorSingleCheck")}
                   onBlur={handleBlur("vendorSingleCheck")}
                  status={validationErrors.vendorSingleCheck || errors?.vendorSingleCheck ? "error" : ""}
                  maxLength={2}
               />
               {(validationErrors.vendorSingleCheck || errors?.vendorSingleCheck) && (
                  <div className="error-message">
                     {validationErrors.vendorSingleCheck || errors?.vendorSingleCheck}
                  </div>
               )}
            </div>
            <div className="form-field empty-placeholder"></div>
         </div>

         {/* Row 2 */}
         <div className="row third-row">
            <div className="form-field">
               <label className="sub-title">Terms Code</label>
               <CustomSelectDropdown
                  name="vendorApTermsCode"
                  placeholder="Select"
                  options={
                     termsCodeOptions?.map((option) => ({
                        label: option.label || "",
                        value: option.value || "",
                     })) || []
                  }
                  value={
                     formData.vendorApTermsCode
                        ? formData.vendorApTermsCode.toString()
                        : ""
                  }
                  onChange={handleTermsCodeChange}
                  loading={isLoadingTerms}
               />
               {errors?.vendorApTermsCode && (
                  <div className="error-message">{errors.vendorApTermsCode}</div>
               )}
            </div>
            <div className="form-field">
               <label className="sub-title">Terms Code Description</label>
               <CustomPrefixInput
                  name="termsCodeDesc"
                  placeholder=""
                  value={
                     formData.vendorApTermsCodeDescription ||
                     computedTermsCodeDescription ||
                     ""
                  }
                  onChange={handleInputChange("vendorApTermsCodeDescription")}
                  disabled={true}
                  status={errors?.vendorApTermsCodeDescription ? "error" : ""}
               />
               {errors?.vendorApTermsCodeDescription && (
                  <div className="error-message">{errors.vendorApTermsCodeDescription}</div>
               )}
            </div>
            <div className="form-field">
               <label className="sub-title">ADP Payroll ID</label>
               <CustomPrefixInput
                  name="vendorAdpPayrollId"
                  placeholder="Enter Payroll ID"
                  value={
                     formData.vendorAdpPayrollId
                        ? formData.vendorAdpPayrollId.toString()
                        : ""
                  }
                  onChange={handleInputChange("vendorAdpPayrollId")}
                   onBlur={handleBlur("vendorAdpPayrollId")}
                  status={validationErrors.vendorAdpPayrollId || errors?.vendorAdpPayrollId ? "error" : ""}
                  maxLength={7}
               />
               {(validationErrors.vendorAdpPayrollId || errors?.vendorAdpPayrollId) && (
                  <div className="error-message">
                     {validationErrors.vendorAdpPayrollId || errors?.vendorAdpPayrollId}
                  </div>
               )}
            </div>
            <div className="form-field empty-placeholder"></div>
         </div>

         {/* Row 3 */}
         <div className="row third-row">
            <div className="form-field">
               <label className="sub-title">Category</label>
               <CustomSelectDropdown
                  name="vendorCategoryCode"
                  placeholder="Select"
                  options={
                     categoryOptions?.map((option) => ({
                        label: option.label || "",
                        value: option.value || "",
                     })) || []
                  }
                  value={formData.vendorCategoryCode || ""}
                  onChange={handleCategoryChange}
                  loading={isLoadingCategory}
               />
               {errors?.vendorCategoryCode && (
                  <div className="error-message">{errors.vendorCategoryCode}</div>
               )}
            </div>
            <div className="form-field">
               <label className="sub-title">Category Description</label>
               <CustomPrefixInput
                  name="categoryDesc"
                  placeholder=""
                  value={
                     formData.vendorCategoryCodeDescription ||
                     computedCategoryDescription ||
                     ""
                  }
                  onChange={handleInputChange("vendorCategoryCodeDescription")}
                  disabled={true}
                  status={errors?.vendorCategoryCodeDescription ? "error" : ""}
               />
               {errors?.vendorCategoryCodeDescription && (
                  <div className="error-message">{errors.vendorCategoryCodeDescription}</div>
               )}
            </div>
            <div className="form-field">
               <label className="sub-title">Carrier</label>
               <CustomSelectDropdown
                  name="vendorCarrierId"
                  placeholder="Select"
                  options={
                     carrierOptions?.map((option) => ({
                        label: option.label || "",
                        value: option.value || "",
                     })) || []
                  }
                  value={formData.vendorCarrierId || ""}
                  onChange={(value) => onChange("vendorCarrierId", value)}
                  loading={isLoadingCarrier}
               />
               {errors?.vendorCarrierId && (
                  <div className="error-message">{errors.vendorCarrierId}</div>
               )}
            </div>
            <div className="form-field">
               <label className="sub-title">Expense G/L #</label>
               <CustomPrefixInput
                  name="vendorExpenseGLSub"
                  placeholder="Enter G/L Number"
                  value={
                     formData.vendorExpenseGLSub
                        ? formData.vendorExpenseGLSub.toString()
                        : ""
                  }
                   onBlur={handleBlur("vendorExpenseGLSub")}
                  onChange={handleInputChange("vendorExpenseGLSub")}
                  status={validationErrors.vendorExpenseGLSub || errors?.vendorExpenseGLSub ? "error" : ""}
                  maxLength={8}
               />
               {(validationErrors.vendorExpenseGLSub || errors?.vendorExpenseGLSub) && (
                  <div className="error-message">
                     {validationErrors.vendorExpenseGLSub || errors?.vendorExpenseGLSub}
                  </div>
               )}
            </div>
         </div>
      </div>
   );
};

export default ExpenseDetailsForm;
