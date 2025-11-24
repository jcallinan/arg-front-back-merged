import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { CustomSelectDropdown } from "@widget-library/Dropdown";
import {
   DefaultButton,
   CustomStyledButton,
} from "@widget-library/Buttons";
import "./ap-maintenance.scss";
import { CustomPrefixInput } from "@widget-library/Input";
import { Divider } from "antd";
import Toaster from "@widget-library/Toaster";
import type { ErrorWithDetails } from "@/types/accounts-payable.types";
import { useApMaintenance } from "@/hooks/useApMaintenance";
import type { CompanyMaintenanceData } from "@/types/accounts-payable.types";

function AP_Maintenance() {
   const navigate = useNavigate();

   // AP Maintenance custom hook
   const {
      fetchCompanyMaintenance,
      updateCompanyMaintenance,
      validateBankGlNo,
    isLoading: _hookIsLoading,
    isSaving: _hookIsSaving,
   } = useApMaintenance();

   const [loading, setLoading] = useState<boolean>(true);
   const [saving, setSaving] = useState<boolean>(false);
   const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
   const [companyNo, setCompanyNo] = useState<string>("10");
   const [companyName, setCompanyName] = useState<string>("");
   const [apGlNo, setApGlNo] = useState<string>("");
   const [bankGlNo, setBankGlNo] = useState<string>("");
   const [discountsGlNo, setDiscountsGlNo] = useState<string>("");
   const [intercoGlNo, setIntercoGlNo] = useState<string>("");
   const [nextPjJrnNo, setNextPjJrnNo] = useState<string>("");
   const [nextCdJrnNo, setNextCdJrnNo] = useState<string>("");
   const [nextCheckNo, setNextCheckNo] = useState<string>("");
   const [nextEntryNo, setNextEntryNo] = useState<string>("");
   const [nextVoucherNo, setNextVoucherNo] = useState<string>("");
   const [preEdChks, setPreEdChks] = useState<string>("");
   const [jobCostAct, setJobCostAct] = useState<string>("");
   const [retentionGlNo, setRetentionGlNo] = useState<string>("");
   const [poActive, setPoActive] = useState<string>("");
   const [employeeExpenseGlNo, setEmployeeExpenseGlNo] = useState<string>("");
   const [nextEeJrnNo, setNextEeJrnNo] = useState<string>("");
   const [filler, setFiller] = useState<string>("");


   // Toaster state variables
   const [toasterMessage, setToasterMessage] = useState("");
   const [toasterDescription, setToasterDescription] = useState("");
   const [toasterType, setToasterType] = useState<"success" | "error">("error");

   // Bank GL validation state
   const [bankGlValidation, setBankGlValidation] = useState<{
      isValid: boolean | null;
      isValidating: boolean;
      message: string;
   }>({
      isValid: null,
      isValidating: false,
      message: "",
   });

   // Numeric validation errors for all number fields
   const [numericErrors, setNumericErrors] = useState<Record<string, string>>(
      {}
   );

   // Debug: Log whenever fieldErrors or numericErrors change
   useEffect(() => {
     
   }, [fieldErrors]);

   useEffect(() => {
   }, [numericErrors]);

   const options = [
      { value: "Y", label: "Y" },
      { value: "N", label: "N" },
   ];

   // Function to validate numeric input with digit limits
   const validateNumericInput = (
      value: string,
      fieldName: string,
      maxDigits?: number
   ): boolean => {
      // Allow empty values
      if (value === "") {
         setNumericErrors((prev) => ({ ...prev, [fieldName]: "" }));
         return true;
      }

      // Check if value contains only numbers
      const isNumeric = /^\d+$/.test(value);

      if (!isNumeric) {
         setNumericErrors((prev) => ({
            ...prev,
            [fieldName]:
               "Alphabets are not allowed. Only numbers are permitted.",
         }));
         return false;
      }

      // Check digit limit if specified
      if (maxDigits && value.length > maxDigits) {
         setNumericErrors((prev) => ({
            ...prev,
            [fieldName]: `Cannot exceed ${maxDigits} digits`,
         }));
         return false;
      }

      // Clear errors if validation passes
      setNumericErrors((prev) => ({ ...prev, [fieldName]: "" }));
      return true;
   };

   // Function to validate character field lengths
   const validateCharacterField = (
      value: string,
      fieldName: string,
      maxLength: number
   ): boolean => {
      if (value.length > maxLength) {
         setFieldErrors((prev) => ({
            ...prev,
            [fieldName]: `Cannot exceed ${maxLength} characters`,
         }));
         return false;
      } else {
         setFieldErrors((prev) => {
            const { [fieldName]: _, ...rest } = prev;
            return rest;
         });
         return true;
      }
   };

   // Function to validate company name max length
   const validateCompanyName = (value: string): boolean => {
      return validateCharacterField(value, "companyName", 30);
   };

   // Validate Bank GL No using the custom hook
   const validateBankGlNoWrapper = useCallback(
      async (glNo: string, companyNumber: string) => {
         setBankGlValidation({
            isValid: null,
            isValidating: true,
            message: "Validating Bank GL No...",
         });

         try {
            const result = await validateBankGlNo(glNo, companyNumber);

            if (result.success) {
               setBankGlValidation({
                  isValid: true,
                  isValidating: false,
                  message: result.message,
               });
               setToasterType("success");
               setToasterMessage("Valid Bank GL No");
               setToasterDescription(result.description || "Bank GL No is valid and active.");
            } else {
               setBankGlValidation({
                  isValid: false,
                  isValidating: false,
                  message: result.message,
               });
               setToasterType("error");
               setToasterMessage(result.isDeleted ? "Invalid Bank GL No" : "Invalid Bank GL No");
               setToasterDescription(result.description || result.message);
            }
         } catch (error: any) {
            setBankGlValidation({
               isValid: false,
               isValidating: false,
               message: "Error validating Bank GL No",
            });
            setToasterType("error");
            setToasterMessage("Validation Error");
            setToasterDescription("Failed to validate Bank GL No. Please try again.");
         }
      },
      [validateBankGlNo]
   );

   const loadCompanyMaintenance = useCallback(async () => {
      try {
         setLoading(true);
         setFieldErrors({});
         setNumericErrors({});
         const data = await fetchCompanyMaintenance(parseInt(companyNo, 10));

         if (data) {
            setCompanyName(data.companyName || "");
            setApGlNo(data.companyApGlNo?.toString() || "");
            setBankGlNo(data.companyBankGlNo?.toString() || "");
            setDiscountsGlNo(data.companyDiscountsGlNo?.toString() || "");
            setIntercoGlNo(data.companyIntercoGlNo?.toString() || "");
            setNextPjJrnNo(data.companyNextPjJrnlNo?.toString() || "");
            setNextCdJrnNo(data.companyNextCdJrnlNo?.toString() || "");
            setNextCheckNo(data.companyNextCheckNo?.toString() || "");
            setNextEntryNo(data.companyNextEntryNo?.toString() || "");
            setNextVoucherNo(data.companyNextVoucherNo?.toString() || "");
            setPreEdChks(data.companyPreEdChks || "");
            setJobCostAct(data.companyJobCostAct || "");
            setRetentionGlNo(data.companyRetentionGlNo?.toString() || "");
            setPoActive(data.companyPoActive || "");
            setEmployeeExpenseGlNo(
               data.companyEmployeeExpenseGlNo?.toString() || ""
            );
            setNextEeJrnNo(data.companyNextEeJrnlNo?.toString() || "");
            setFiller(data.companyFiller || "");


            // Validate Bank GL No after loading company data
            if (data.companyBankGlNo) {
               await validateBankGlNoWrapper(
                  data.companyBankGlNo.toString(),
                  companyNo
               );
            }
         }
      } catch (err: any) {
         // Handle server-side validation errors - check multiple possible error structures
         const errorData = err?.response?.data || err?.data || err;

         // The error is nested in errorData.error.error (double nested!)
         const validationError = errorData?.error?.error;

         if (validationError?.code === "VALIDATION_ERROR") {
            const details = validationError?.details;
            if (details && Array.isArray(details)) {
               const next: Record<string, string> = {};
               details.forEach((detail) => {
                  if (detail.field) {
                     next[detail.field] = detail.message;
                  }
               });

               setFieldErrors(next);
            }
         } else {
            // Handle other types of errors
            const errorObj = err as ErrorWithDetails;
            const anyErr =
               errorObj?.error ||
               errorObj?.data ||
               errorObj?.response?.data ||
               errorObj;
            const details = anyErr?.details || [];

            if (details.length > 0) {
               const next: Record<string, string> = {};
               for (const detail of details) {
                  if (detail.field && detail.message) {
                     next[detail.field] = detail.message;
                  }
               }
               setFieldErrors(next);
            }
         }
      } finally {
         setLoading(false);
      }
   }, [companyNo, validateBankGlNoWrapper, fetchCompanyMaintenance]);

   // Initial load
   useEffect(() => {
      loadCompanyMaintenance();
   }, [loadCompanyMaintenance]);

   const handleCompanyNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newCompanyNo = e.target.value;

      // Validate numeric input with 2 digit limit
      const isValid = validateNumericInput(newCompanyNo, "companyNo", 2);
      if (isValid) {
         setCompanyNo(newCompanyNo);

         // Reset validation when company changes
         setBankGlValidation({
            isValid: null,
            isValidating: false,
            message: "",
         });
      }
   };

   const handleBankGlNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newBankGlNo = e.target.value;

      // Validate numeric input with 8 digit limit
      const isValid = validateNumericInput(newBankGlNo, "bankGlNo", 8);
      if (isValid) {
         setBankGlNo(newBankGlNo);

         // Validate on input change if both company and bank GL are present
         if (newBankGlNo && companyNo) {
            validateBankGlNoWrapper(newBankGlNo, companyNo);
         } else {
            setBankGlValidation({
               isValid: null,
               isValidating: false,
               message: "",
            });
         }
      }
   };

   const handleApGlNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const isValid = validateNumericInput(value, "apGlNo", 8);
      if (isValid) {
         setApGlNo(value);
      }
   };

   const handleDiscountsGlNoChange = (
      e: React.ChangeEvent<HTMLInputElement>
   ) => {
      const value = e.target.value;
      const isValid = validateNumericInput(value, "discountsGlNo", 8);
      if (isValid) {
         setDiscountsGlNo(value);
      }
   };

   const handleIntercoGlNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const isValid = validateNumericInput(value, "intercoGlNo", 8);
      if (isValid) {
         setIntercoGlNo(value);
      }
   };

   const handleNextPjJrnNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const isValid = validateNumericInput(value, "nextPjJrnNo", 2);
      if (isValid) {
         setNextPjJrnNo(value);
      }
   };

   const handleNextCdJrnNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const isValid = validateNumericInput(value, "nextCdJrnNo", 2);
      if (isValid) {
         setNextCdJrnNo(value);
      }
   };

   const handleNextCheckNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const isValid = validateNumericInput(value, "nextCheckNo", 6);
      if (isValid) {
         setNextCheckNo(value);
      }
   };

   const handleNextEntryNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const isValid = validateNumericInput(value, "nextEntryNo", 5);
      if (isValid) {
         setNextEntryNo(value);
      }
   };

   const handleNextVoucherNoChange = (
      e: React.ChangeEvent<HTMLInputElement>
   ) => {
      const value = e.target.value;
      const isValid = validateNumericInput(value, "nextVoucherNo", 5);
      if (isValid) {
         setNextVoucherNo(value);
      }
   };

   const handleRetentionGlNoChange = (
      e: React.ChangeEvent<HTMLInputElement>
   ) => {
      const value = e.target.value;
      const isValid = validateNumericInput(value, "retentionGlNo", 8);
      if (isValid) {
         setRetentionGlNo(value);
      }
   };

   const handleEmployeeExpenseGlNoChange = (
      e: React.ChangeEvent<HTMLInputElement>
   ) => {
      const value = e.target.value;
      const isValid = validateNumericInput(value, "employeeExpenseGlNo", 8);
      if (isValid) {
         setEmployeeExpenseGlNo(value);
      }
   };

   const handleNextEeJrnNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const isValid = validateNumericInput(value, "nextEeJrnNo", 2);
      if (isValid) {
         setNextEeJrnNo(value);
      }
   };

   const handleSave = async () => {
      // Client-side validation to mirror server-side errors
      const next: Record<string, string> = {};
     // const intercoVal = parseInt(intercoGlNo || "", 10);

      // Validate required fields
      if (!companyName || companyName.trim() === "") {
         next.companyName = "company Name should not be null";
      }

      if (!apGlNo || apGlNo.trim() === "" || isNaN(parseInt(apGlNo, 10))) {
         next.companyApGlNo = "Ap Gl No should not be null";
      }

      if (
         !bankGlNo ||
         bankGlNo.trim() === "" ||
         isNaN(parseInt(bankGlNo, 10))
      ) {
         next.companyBankGlNo = "Bank Gl No should not be null";
      }

      if (
         !discountsGlNo ||
         discountsGlNo.trim() === "" ||
         isNaN(parseInt(discountsGlNo, 10))
      ) {
         next.companyDiscountsGlNo = "Discounts Gl No should not be null";
      }

      if (
         !nextPjJrnNo ||
         nextPjJrnNo.trim() === "" ||
         isNaN(parseInt(nextPjJrnNo, 10))
      ) {
         next.companyNextPjJrnlNo = "Next Pj Jrn lNo should not be null";
      }

      if (
         !nextCdJrnNo ||
         nextCdJrnNo.trim() === "" ||
         isNaN(parseInt(nextCdJrnNo, 10))
      ) {
         next.companyNextCdJrnlNo = "Next Cd Jrnl No should not be null";
      }

      if (
         !nextCheckNo ||
         nextCheckNo.trim() === "" ||
         isNaN(parseInt(nextCheckNo, 10))
      ) {
         next.companyNextCheckNo = "Next CheckNo should not be null";
      }

      if (
         !nextEntryNo ||
         nextEntryNo.trim() === "" ||
         isNaN(parseInt(nextEntryNo, 10))
      ) {
         next.companyNextEntryNo = "Next EntryNo should not be null ";
      }

      if (
         !nextVoucherNo ||
         nextVoucherNo.trim() === "" ||
         isNaN(parseInt(nextVoucherNo, 10))
      ) {
         next.companyNextVoucherNo = "Next Voucher No should not be null";
      }

      if (!preEdChks || preEdChks.trim() === "") {
         next.companyPreEdChks = "Pre Ed Chks should not be null";
      }

      if (!jobCostAct || jobCostAct.trim() === "") {
         next.companyJobCostAct = "Job Cost Act should not be null";
      }

      if (!poActive || poActive.trim() === "") {
         next.companyPoActive = "Po Active should not be null";
      }

      if (
         !employeeExpenseGlNo ||
         employeeExpenseGlNo.trim() === "" ||
         isNaN(parseInt(employeeExpenseGlNo, 10))
      ) {
         next.companyEmployeeExpenseGlNo =
            "Employee Expense Gl No should not be null";
      }

      if (
         !nextEeJrnNo ||
         nextEeJrnNo.trim() === "" ||
         isNaN(parseInt(nextEeJrnNo, 10))
      ) {
         next.companyNextEeJrnlNo = "Next EE Jrnl No should not be null";
      }

      if (Object.keys(next).length > 0) {
         setFieldErrors(next);
         setToasterType("error");
         setToasterMessage("Validation Error");
         setToasterDescription("Please fix the highlighted fields");
         return;
      }

      try {
         setSaving(true);
         setFieldErrors({});

         // Validate and convert values
         const intercoGlValue = intercoGlNo ? parseInt(intercoGlNo, 10) : 0;
         const retentionGlValue = retentionGlNo
            ? parseInt(retentionGlNo, 10)
            : 0;

         const updateData: CompanyMaintenanceData = {
            companyNo: parseInt(companyNo, 10),
            companyName: companyName,
            companyApGlNo: parseInt(apGlNo, 10),
            companyBankGlNo: parseInt(bankGlNo, 10),
            companyDiscountsGlNo: parseInt(discountsGlNo, 10),
            companyIntercoGlNo: intercoGlValue,
            companyNextPjJrnlNo: parseInt(nextPjJrnNo, 10),
            companyNextCdJrnlNo: parseInt(nextCdJrnNo, 10),
            companyNextCheckNo: parseInt(nextCheckNo, 10),
            companyNextEntryNo: parseInt(nextEntryNo, 10),
            companyNextVoucherNo: parseInt(nextVoucherNo, 10),
            companyPreEdChks: preEdChks as "Y" | "N",
            companyJobCostAct: jobCostAct as "Y" | "N",
            companyRetentionGlNo: retentionGlValue,
            companyPoActive: poActive as "Y" | "N",
            companyEmployeeExpenseGlNo: parseInt(employeeExpenseGlNo, 10),
            companyNextEeJrnlNo: parseInt(nextEeJrnNo, 10),
            companyFiller: filler || "",
         };

         const response = await updateCompanyMaintenance(updateData);

         if (response) {
            // Show success toaster
            setToasterType("success");
            setToasterMessage("Success");
            setToasterDescription(
               "Company maintenance data saved successfully!"
            );

         }
      } catch (err: any) {
         // Handle server-side validation errors - check multiple possible error structures
         const errorData = err?.response?.data || err?.data || err;

         // The error is nested in errorData.error.error (double nested!)
         const validationError = errorData?.error?.error;
         if (validationError?.code === "VALIDATION_ERROR") {
            const details = validationError?.details;

            if (details && Array.isArray(details)) {
               const next: Record<string, string> = {};
               details.forEach((detail) => {
                  if (detail.field) {
                     next[detail.field] = detail.message;
                  }
               });

               setFieldErrors(next);

               // Show validation error toaster
               setToasterType("error");
               setToasterMessage("Validation Error");
               setToasterDescription("Please fix the highlighted fields");
            } else {
               setToasterType("error");
               setToasterMessage("Validation Error");
               setToasterDescription(
                  validationError?.message || "Validation error occurred"
               );
            }
         } else {
            // Check for other possible error response structures
            const errorData = err?.response?.data || err?.data || err;

            // Try different possible error structures
            let details = null;

            // Check if errorData.error.error has details (double nested)
            if (
               errorData?.error?.error?.details &&
               Array.isArray(errorData.error.error.details)
            ) {
               details = errorData.error.error.details;
            }
            // Check if errorData.error has details
            else if (
               errorData?.error?.details &&
               Array.isArray(errorData.error.details)
            ) {
               details = errorData.error.details;
            }
            // Check direct details
            else if (errorData?.details && Array.isArray(errorData.details)) {
               details = errorData.details;
            }
            // Check errors array
            else if (errorData?.errors && Array.isArray(errorData.errors)) {
               details = errorData.errors;
            }
            // Check nested error structures
            else {
               const anyErr = err as ErrorWithDetails;
               const server =
                  anyErr?.error ||
                  anyErr?.data ||
                  anyErr?.response?.data ||
                  anyErr;
               details = server?.details || server?.errors;
            }

            if (Array.isArray(details)) {
               const next: Record<string, string> = {};
               for (const d of details) {
                  if (d?.field) {
                     next[d.field] = d?.message || "Invalid value";
                  }
               }

               setFieldErrors(next);
            }

            // Show general error toaster
            setToasterType("error");
            setToasterMessage("Error");
            setToasterDescription("Failed to save company maintenance data");
         }
      } finally {
         setSaving(false);
      }
   };

   const handleCancel = () => {
      // Navigate to the accounts payable main screen
      navigate("/accounts-payable");
   };

   if (loading) {
      return (
         <div className="voucherentry-container">
            <h3>A/P Maintenance</h3>
            <div className="content-div-container">
               <div>Loading company maintenance data...</div>
            </div>
         </div>
      );
   }

   // Removed error return to prevent UI distortion

   return (
      <div className="voucherentry-container">
         <h3>A/P Maintenance</h3>

         <div className="content-div-container">
            <div>
               <div className="flex-between">
                  <div>
                     <h4>Control File Maintenance</h4>
                  </div>
               </div>
               <Divider className="divider" />

               <div className="grid-layout">
                  <div>
                     <p className="sub-title required">Company No</p>
                     <CustomPrefixInput
                        name="Company No"
                        value={companyNo}
                        onChange={handleCompanyNoChange}
                        placeholder="Enter Company No"
                     />
                     {fieldErrors.companyNo && (
                        <p className="error-message">{fieldErrors.companyNo}</p>
                     )}
                     {numericErrors.companyNo && (
                        <p className="error-message">
                           {numericErrors.companyNo}
                        </p>
                     )}
                  </div>
                  <div>
                     <p className="sub-title required">Company Name</p>
                     <CustomPrefixInput
                        name="Company Name"
                        value={companyName}
                        onChange={(e) => {
                           const newValue = e.target.value;
                           setCompanyName(newValue);
                           validateCompanyName(newValue);
                        }}
                        placeholder="Enter Company Name"
                     />
                     {fieldErrors.companyName && (
                        <p className="error-message">
                           {fieldErrors.companyName}
                        </p>
                     )}
                  </div>
                  <div>
                     <p className="sub-title required">AP GL No</p>
                     <CustomPrefixInput
                        name="AP GL No"
                        value={apGlNo}
                        onChange={handleApGlNoChange}
                        placeholder="Enter AP GL No"
                     />
                     {fieldErrors.companyApGlNo && (
                        <p className="error-message">
                           {fieldErrors.companyApGlNo}
                        </p>
                     )}
                     {numericErrors.apGlNo && (
                        <p className="error-message">{numericErrors.apGlNo}</p>
                     )}
                  </div>
                  <div>
                     <p className="sub-title required">Bank GL No</p>
                     <CustomPrefixInput
                        name="Bank GL No"
                        value={bankGlNo}
                        onChange={handleBankGlNoChange}
                        placeholder="Enter Bank GL No"
                     />
                     {fieldErrors.companyBankGlNo && (
                        <p className="error-message">
                           {fieldErrors.companyBankGlNo}
                        </p>
                     )}
                     {numericErrors.bankGlNo && (
                        <p className="error-message">
                           {numericErrors.bankGlNo}
                        </p>
                     )}
                     {bankGlValidation.isValid === false && (
                        <p className="error-message">
                           {bankGlValidation.message}
                        </p>
                     )}
                  </div>

                  <div>
                     <p className="sub-title required">Discounts GL No</p>
                     <CustomPrefixInput
                        name="Discounts GL No"
                        value={discountsGlNo}
                        onChange={handleDiscountsGlNoChange}
                        placeholder="Enter Discounts GL No"
                     />
                     {fieldErrors.companyDiscountsGlNo && (
                        <p className="error-message">
                           {fieldErrors.companyDiscountsGlNo}
                        </p>
                     )}
                     {numericErrors.discountsGlNo && (
                        <p className="error-message">
                           {numericErrors.discountsGlNo}
                        </p>
                     )}
                  </div>
                  <div>
                     <p className="sub-title">Interco GL No</p>
                     <CustomPrefixInput
                        name="Interco GL No"
                        value={intercoGlNo}
                        onChange={handleIntercoGlNoChange}
                        placeholder="Enter Interco GL No"
                     />
                     {fieldErrors.companyIntercoGlNo && (
                        <p className="error-message">
                           {fieldErrors.companyIntercoGlNo}
                        </p>
                     )}
                     {numericErrors.intercoGlNo && (
                        <p className="error-message">
                           {numericErrors.intercoGlNo}
                        </p>
                     )}
                  </div>
                  <div>
                     <p className="sub-title required">Next PJ JRNL No</p>
                     <CustomPrefixInput
                        name="Next PJ JRNL No"
                        value={nextPjJrnNo}
                        onChange={handleNextPjJrnNoChange}
                        placeholder="Enter Next PJ JRNL No"
                     />
                     {fieldErrors.companyNextPjJrnlNo && (
                        <p className="error-message">
                           {fieldErrors.companyNextPjJrnlNo}
                        </p>
                     )}
                     {numericErrors.nextPjJrnNo && (
                        <p className="error-message">
                           {numericErrors.nextPjJrnNo}
                        </p>
                     )}
                  </div>
                  <div>
                     <p className="sub-title required">Next CD JRNL No</p>
                     <CustomPrefixInput
                        name="Next CD JRNL No"
                        value={nextCdJrnNo}
                        onChange={handleNextCdJrnNoChange}
                        placeholder="Enter Next CD JRNL No"
                     />
                     {fieldErrors.companyNextCdJrnlNo && (
                        <p className="error-message">
                           {fieldErrors.companyNextCdJrnlNo}
                        </p>
                     )}
                     {numericErrors.nextCdJrnNo && (
                        <p className="error-message">
                           {numericErrors.nextCdJrnNo}
                        </p>
                     )}
                  </div>

                  <div>
                     <p className="sub-title required">Next Check No</p>
                     <CustomPrefixInput
                        name="Next Check No"
                        value={nextCheckNo}
                        onChange={handleNextCheckNoChange}
                        placeholder="Enter Next Check No"
                     />
                     {fieldErrors.companyNextCheckNo && (
                        <p className="error-message">
                           {fieldErrors.companyNextCheckNo}
                        </p>
                     )}
                     {numericErrors.nextCheckNo && (
                        <p className="error-message">
                           {numericErrors.nextCheckNo}
                        </p>
                     )}
                  </div>
                  <div>
                     <p className="sub-title required">Next Entry No</p>
                     <CustomPrefixInput
                        name="Next Entry No"
                        value={nextEntryNo}
                        onChange={handleNextEntryNoChange}
                        placeholder="Enter Next Entry No"
                     />
                     {fieldErrors.companyNextEntryNo && (
                        <p className="error-message">
                           {fieldErrors.companyNextEntryNo}
                        </p>
                     )}
                     {numericErrors.nextEntryNo && (
                        <p className="error-message">
                           {numericErrors.nextEntryNo}
                        </p>
                     )}
                  </div>
                  <div>
                     <p className="sub-title required">Next Voucher No</p>
                     <CustomPrefixInput
                        name="Next Voucher No"
                        value={nextVoucherNo}
                        onChange={handleNextVoucherNoChange}
                        placeholder="Enter Next Voucher No"
                     />
                     {fieldErrors.companyNextVoucherNo && (
                        <p className="error-message">
                           {fieldErrors.companyNextVoucherNo}
                        </p>
                     )}
                     {numericErrors.nextVoucherNo && (
                        <p className="error-message">
                           {numericErrors.nextVoucherNo}
                        </p>
                     )}
                  </div>
                  <div className="form-field">
                     <p className="sub-title required">Pre Ed CHKS</p>
                     <CustomSelectDropdown
                        name="Pre Ed CHKS"
                        value={preEdChks}
                        options={options}
                        onChange={setPreEdChks}
                        placeholder="Select Pre Ed CHKS"
                        className={""}
                     />
                     {fieldErrors.companyPreEdChks && (
                        <p className="error-message">
                           {fieldErrors.companyPreEdChks}
                        </p>
                     )}
                  </div>

                  <div className="form-field">
                     <p className="sub-title required">Job Cost Act</p>
                     <CustomSelectDropdown
                        name="Job Cost Act"
                        value={jobCostAct}
                        options={options}
                        onChange={setJobCostAct}
                        placeholder="Select Job Cost Act"
                        className={""}
                     />
                     {fieldErrors.companyJobCostAct && (
                        <p className="error-message">
                           {fieldErrors.companyJobCostAct}
                        </p>
                     )}
                  </div>
                  <div>
                     <p className="sub-title ">Retention GL No</p>
                     <CustomPrefixInput
                        name="Retention GL No"
                        value={retentionGlNo}
                        onChange={handleRetentionGlNoChange}
                        placeholder="Enter Retention GL No"
                     />
                     {numericErrors.retentionGlNo && (
                        <p className="error-message">
                           {numericErrors.retentionGlNo}
                        </p>
                     )}
                  </div>

                  <div className="form-field">
                     <p className="sub-title required">PO Active</p>
                     <CustomSelectDropdown
                        name="PO Active"
                        value={poActive}
                        options={options}
                        onChange={setPoActive}
                        placeholder="Select PO Active"
                        className={""}
                     />
                     {fieldErrors.companyPoActive && (
                        <p className="error-message">
                           {fieldErrors.companyPoActive}
                        </p>
                     )}
                  </div>
                  <div>
                     <p className="sub-title required">
                        Employee Expense GL No
                     </p>
                     <CustomPrefixInput
                        name="Employee Expense GL No"
                        value={employeeExpenseGlNo}
                        onChange={handleEmployeeExpenseGlNoChange}
                        placeholder="Enter Employee Expense GL No"
                     />
                     {fieldErrors.companyEmployeeExpenseGlNo && (
                        <p className="error-message">
                           {fieldErrors.companyEmployeeExpenseGlNo}
                        </p>
                     )}
                     {numericErrors.employeeExpenseGlNo && (
                        <p className="error-message">
                           {numericErrors.employeeExpenseGlNo}
                        </p>
                     )}
                  </div>

                  <div style={{ gridColumn: "span 1" }}>
                     <p className="sub-title required">Next EE JRNL No</p>
                     <CustomPrefixInput
                        name="Next EE JRNL No"
                        value={nextEeJrnNo}
                        onChange={handleNextEeJrnNoChange}
                        placeholder="Enter Next EE JRNL No"
                     />
                     {fieldErrors.companyNextEeJrnlNo && (
                        <p className="error-message">
                           {fieldErrors.companyNextEeJrnlNo}
                        </p>
                     )}
                     {numericErrors.nextEeJrnNo && (
                        <p className="error-message">
                           {numericErrors.nextEeJrnNo}
                        </p>
                     )}
                  </div>
                  <div style={{ gridColumn: "span 3" }}>
                     <p className="sub-title">Filler</p>
                     <CustomPrefixInput
                        name="Filler"
                        value={filler}
                        onChange={(e) => {
                           const newValue = e.target.value;
                           const isValid = validateCharacterField(
                              newValue,
                              "filler",
                              14
                           );
                           if (isValid) {
                              setFiller(newValue);
                           }
                        }}
                        placeholder="Enter Filler"
                     />
                     {fieldErrors.filler && (
                        <p className="error-message">{fieldErrors.filler}</p>
                     )}
                  </div>
               </div>

               <div className="button-container">
                  <DefaultButton
                     name="Cancel"
                     label="Cancel"
                     onClick={handleCancel}
                     disabled={saving}
                  />
                  <CustomStyledButton
                     name="Save"
                     label={saving ? "Saving..." : "Save"}
                     onClick={handleSave}
                     disabled={saving}
                  />
               </div>
            </div>
         </div>

         {toasterMessage && (
            <Toaster
               type={toasterType}
               title={toasterMessage}
               subtitle={toasterDescription}
               onClose={() => {
                  setToasterMessage("");
                  setToasterDescription("");
               }}
            />
         )}
      </div>
   );
}

export default AP_Maintenance;
