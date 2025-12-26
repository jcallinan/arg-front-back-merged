import React, { useState, useCallback, useEffect } from "react";
import { Divider } from "antd";
import CompanyNo from "@shared-components/company-number/CompanyNo";
import CustomDatePicker from "@widget-library/DatePicker";
import {
   CustomStyledButton,
   DefaultButton,
} from "@widget-library/Buttons";
import { CustomPrefixInput } from "@widget-library/Input";
import "./employee-expense-export.scss";
import PurchaseJournalTable from "@shared-components/reports-table/ReportsTable";
import { EMPLOYEE_EXPENSES } from "@constants/commonConstants";
import { ReloadOutlined } from "@ant-design/icons";
import ActionPermissionGuard from "@shared-components/permissions/ActionPermissionGuard";
import { 
  useCompanyMaintenance, 
  useGlMasterValidation, 
  useGenerateEmployeeExpenseReport,
  useEmployeeExpenseReports 
} from "@hooks/useEmployeeExpense";
import { formatNumberToMMDDYY } from "../../../utils/dateFormat";
import Toaster from "../../../widget-library/Toaster";
import type {
   ValidationErrors,
   ReportTableData,
} from "@/types/accounts-payable.types";

const EmployeeExpenseExport: React.FC = () => {
   // State management
   const [companyNo, setCompanyNo] = useState<string>("10");
   const [startDate, setStartDate] = useState<string | null>(null);
   //const [voucherToPay, setVoucherToPay] = useState<string>("");
   // const [batchNo, setBatchNo] = useState<string>("");
   const [bankAccountGL, setBankAccountGL] = useState<string>("");
   const [isGenerating, setIsGenerating] = useState<boolean>(false);
   const [isValidating, setIsValidating] = useState<boolean>(false);
   const [glValidationCache, setGlValidationCache] = useState<
      Map<string, boolean>
   >(new Map());
   const [errors, setErrors] = useState<ValidationErrors>({});
   const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

   const closeToaster = useCallback(() => {
      setShowToaster(false);
   }, []);

   const showToasterMessage = useCallback(
      (
         type: "error" | "success" | "warning" | "batch",
         title: string,
         description: string
      ) => {
         setToasterType(type);
         setToasterMessage(title);
         setToasterDescription(description);
         setShowToaster(true);
      },
      []
   );

   // Toaster state
   const [showToaster, setShowToaster] = useState<boolean>(false);
   const [toasterType, setToasterType] = useState<
      "error" | "success" | "warning" | "batch"
   >("error");
   const [toasterMessage, setToasterMessage] = useState<string>("");
   const [toasterDescription, setToasterDescription] = useState<string>("");

   // Ref for PurchaseJournalTable
   const tableRef = React.useRef<{ refresh: () => void } | null>(null);

   // React Query hooks
   const {
      data: companyMaintenanceData,
   } = useCompanyMaintenance(parseInt(companyNo));

   const glMasterValidationMutation = useGlMasterValidation();
   const generateReportMutation = useGenerateEmployeeExpenseReport();
   
   const {
      refetch: refetchReports,
   } = useEmployeeExpenseReports();

   // Optimized GL Validation with caching and debouncing - defined early
   const validateBankGL = useCallback(
      async (glValue: string): Promise<boolean> => {
         if (!glValue.trim()) {
            setErrors((prev) => ({ ...prev, bankAccountGL: undefined }));
            return false;
         }

         if (glValue.length !== 8) {
            setErrors((prev) => ({
               ...prev,
               bankAccountGL: "Bank Account GL must be 8 digits",
            }));
            // Show error via toaster
            showToasterMessage(
               "error",
               "Validation Error",
               "Bank Account GL must be 8 digits"
            );
            return false;
         }

         if (!companyNo) {
            setErrors((prev) => ({
               ...prev,
               bankAccountGL: "Company number is required for validation",
            }));
            // Show error via toaster
            showToasterMessage(
               "error",
               "Validation Error",
               "Company number is required for validation"
            );
            return false;
         }

         // Check cache first
         const cacheKey = `${companyNo}-${glValue}`;
         if (glValidationCache.has(cacheKey)) {
            const isValid = glValidationCache.get(cacheKey)!;
            if (isValid) {
               setErrors((prev) => ({ ...prev, bankAccountGL: undefined }));
            } else {
               setErrors((prev) => ({
                  ...prev,
                  bankAccountGL: "Invalid Bank Account GL number",
               }));
               // Show error via toaster
               showToasterMessage(
                  "error",
                  "Validation Error",
                  "Invalid Bank Account GL number"
               );
            }
            return isValid;
         }

         // Make API call only if not in cache
         try {
            const response = await glMasterValidationMutation.mutateAsync({
               companyNo: parseInt(companyNo),
               glNo: parseInt(glValue),
            });

            // Check if GL is deleted or invalid
            const isValid = response?.isDeleted !== "Y";

            // Cache the result
            setGlValidationCache((prev) =>
               new Map(prev).set(cacheKey, isValid)
            );

            if (isValid) {
               setErrors((prev) => ({ ...prev, bankAccountGL: undefined }));
            } else {
               setErrors((prev) => ({
                  ...prev,
                  bankAccountGL: "GL Account is deleted or inactive",
               }));
               // Show error via toaster
               showToasterMessage(
                  "error",
                  "Validation Error",
                  "GL Account is deleted or inactive"
               );
            }

            return isValid;
         } catch (error) {
            console.error("GL Validation Error:", error);

            // Cache invalid result to prevent repeated calls
            setGlValidationCache((prev) => new Map(prev).set(cacheKey, false));

            setErrors((prev) => ({
               ...prev,
               bankAccountGL: "Invalid Bank Account GL number",
            }));
            // Show error via toaster
            showToasterMessage(
               "error",
               "Validation Error",
               "Invalid Bank Account GL number"
            );
            return false;
         }
      },
      [glMasterValidationMutation, companyNo, glValidationCache, showToasterMessage]
   );

   // Input change handlers - defined early to avoid dependency issues
   const handleBankGLChange = useCallback(
      async (e: React.ChangeEvent<HTMLInputElement>) => {
         const value = e.target.value;
         setBankAccountGL(value);
         // Clear existing errors on change
         setErrors((prev) => ({ ...prev, bankAccountGL: undefined }));

         // Trigger validation when 8th character is added
         if (value.trim().length === 8) {
            await validateBankGL(value);
         }
      },
      [validateBankGL]
   );

   // Handle company maintenance data from React Query
   useEffect(() => {
      if (companyMaintenanceData) {
         // Auto-populate bankAccountGL from company maintenance data
         if (companyMaintenanceData.companyEmployeeExpenseGlNo && !bankAccountGL) {
            const bankGL = companyMaintenanceData.companyEmployeeExpenseGlNo.toString();
            setBankAccountGL(bankGL);

            // Call handleBankGLChange with the prepopulated value
            handleBankGLChange({
               target: { value: bankGL },
            } as React.ChangeEvent<HTMLInputElement>);
         }
      }
   }, [companyMaintenanceData, bankAccountGL, handleBankGLChange]);

   // Helper function to get company-specific GL accounts from maintenance data
   const getCompanyGLAccounts = useCallback(() => {
      if (!companyMaintenanceData) return null;

      return {
         bankGL: companyMaintenanceData.companyBankGlNo,
         employeeExpenseGL: companyMaintenanceData.companyEmployeeExpenseGlNo,
         apGL: companyMaintenanceData.companyApGlNo,
         discountsGL: companyMaintenanceData.companyDiscountsGlNo,
         nextEEJournalNo: companyMaintenanceData.companyNextEeJrnlNo,
      };
   }, [companyMaintenanceData]);


   // Form validation helper function - no duplicate API calls
   const validateFormFields = useCallback((): ValidationErrors => {
      const newErrors: ValidationErrors = {};

      if (!companyNo) {
         newErrors.company = "Company number is required";
      }

      if (!bankAccountGL.trim()) {
         newErrors.bankAccountGL = "Bank Account GL is required";
      } else if (bankAccountGL.length !== 8) {
         newErrors.bankAccountGL = "Bank Account GL must be 8 digits";
      } else {
         // Check if GL was previously validated (from cache or previous validation)
         const cacheKey = `${companyNo}-${bankAccountGL}`;
         if (glValidationCache.has(cacheKey)) {
            const isValid = glValidationCache.get(cacheKey)!;
            if (!isValid) {
               newErrors.bankAccountGL = "Invalid Bank Account GL number";
            }
         } else {
            // If not validated yet, require validation first
            newErrors.bankAccountGL =
               "Please wait for GL validation to complete or re-enter the GL number";
         }
      }

      if (!startDate) {
         newErrors.dateToPayBy = "Date to pay by is required";
      }

      return newErrors;
   }, [companyNo, bankAccountGL, startDate, glValidationCache]);

   // Main form submission handler - optimized with useCallback
   const onApply = useCallback(async (): Promise<void> => {
      try {
         setIsValidating(true);
         setErrors({});

         // Validate all form fields (now synchronous - no duplicate API calls)
         const validationErrors = validateFormFields();

         if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);

            // Show error via toaster
            // Build specific error message based on missing fields
            const missingFields = [];
            if (validationErrors.company) missingFields.push("Company");
            if (validationErrors.bankAccountGL)
               missingFields.push("Bank Account GL");
            if (validationErrors.dateToPayBy)
               missingFields.push("Date to Pay by");

            showToasterMessage(
               "error",
               "Validation Error",
               `${missingFields.join(", ")} ${
                  missingFields.length > 1 ? "are" : "is"
               } required or invalid`
            );
            return;
         }

         // All validations passed, proceed with report generation
         setIsGenerating(true);
      } catch (error) {
         console.error("Validation error:", error);
         showToasterMessage(
            "error",
            "Validation Error",
            "Validation failed. Please check your inputs."
         );
      } finally {
         setIsValidating(false);
      }

      // Generate report logic
      try {
         // Format date to MMDDYY format (e.g., 112525)
         const formattedDateToPay = startDate
            ? formatNumberToMMDDYY(startDate)
            : null;

         if (!formattedDateToPay) {
            showToasterMessage("error", "Date Error", "Invalid date format");
            return;
         }

         // eslint-disable-next-line @typescript-eslint/no-explicit-any
         const payload: any = {
            companyNo: parseInt(companyNo),
            bankGlNo: parseInt(bankAccountGL),
            dateToPay: formattedDateToPay, // Keep as string to preserve leading zero (MMDDYY format)
         };

         const response = await generateReportMutation.mutateAsync(payload);

         // Show success message with API response
         const successMessage =
            response.data?.items?.message ||
            (response.data as any)?.message ||
            (response as any)?.message ||
            "Report generated successfully";
         showToasterMessage("success", "Report Generated", successMessage);

         // Trigger table refresh after successful generation
         // Add a small delay to ensure React Query cache invalidation completes
         setTimeout(() => {
            if (
               tableRef.current &&
               typeof tableRef.current.refresh === "function"
            ) {
               tableRef.current.refresh();
               // Update last sync time
               setLastSyncTime(new Date().toLocaleString());
            }
         }, 100);
      } catch (error) {
         console.error("Failed to generate employee expense report:", error);

         // Extract error message from API response if available
         const errorMessage =
            (error as any)?.error?.error?.details?.[0]?.message ||
            (error as any)?.error?.error?.message ||
            (error as any)?.details?.[0]?.message ||
            (error as any)?.error?.details?.[0]?.message ||
            (error as any)?.data?.details?.[0]?.message ||
            (error as any)?.response?.data?.details?.[0]?.message ||
            (error as any)?.response?.data?.items?.message ||
            (error as any)?.response?.data?.message ||
            (error as any)?.error?.message ||
            (error as any)?.data?.message ||
            (error as any)?.message ||
            "Failed to generate report. Please try again.";

         showToasterMessage("error", "Generation Failed", errorMessage);
      } finally {
         setIsGenerating(false);
      }
   }, [
      validateFormFields,
      startDate,
      companyNo,
      bankAccountGL,
      generateReportMutation,
      getCompanyGLAccounts,
      showToasterMessage,
   ]);

   // Data fetching function - always fetch fresh data
   const fetchPurchaseJournalReports = useCallback(async (): Promise<
      ReportTableData[]
   > => {
      // Always trigger refetch to ensure we get the latest data
      const result = await refetchReports();
      return result.data || [];
   }, [refetchReports]);

   // Post refresh handler - now uses React Query refetch
   const postRefreshList = useCallback((): void => {
      // Trigger React Query refetch
      refetchReports();
      // Add a small delay to ensure React Query refetch completes
      setTimeout(() => {
         // Trigger table refresh if needed
         if (tableRef.current && typeof tableRef.current.refresh === "function") {
            tableRef.current.refresh();
            // Update last sync time
            setLastSyncTime(new Date().toLocaleString());
         }
      }, 100);
   }, [refetchReports]);


   // Date change handler for custom DatePicker
   const handleDateChange = useCallback((_name: string, dateString: string) => {
      setStartDate(dateString || null);
      // Clear date validation error on change
      setErrors((prev) => ({ ...prev, dateToPayBy: undefined }));
   }, []);

   // Company change handler - clear GL cache when company changes
   const handleCompanyChange = useCallback((newCompanyNo: string) => {
      setCompanyNo(newCompanyNo);
      // Clear GL validation cache since it's company-specific
      setGlValidationCache(new Map());
      // Clear GL error if exists since company changed
      setErrors((prev) => ({ ...prev, bankAccountGL: undefined }));
   }, []);

   return (
      <>
         <h4>{EMPLOYEE_EXPENSES.title}</h4>
         <div className="content-div-container">
            <h5>{EMPLOYEE_EXPENSES.subtitle}</h5>
            <Divider className="divider" />
            <div className="content-card-header flex-between">
               <div className="filter-fields flex">
                  <div className="filter-item flex-col">
                     <div className="input-wrapper">
                        <CompanyNo
                           value={companyNo}
                           onChange={handleCompanyChange}
                        />
                     </div>
                  </div>

                  <div className="filter-item flex-col">
                     <label className="form-label required">
                        Bank Account GL
                     </label>
                     <div className="input-wrapper">
                        <CustomPrefixInput
                           name="bankAccountGL"
                           placeholder="121100-09"
                           value={bankAccountGL}
                           onChange={handleBankGLChange}
                           className="ui-dropdown-vnn"
                           status={errors.bankAccountGL ? "error" : undefined}
                        />
                     </div>
                  </div>

                  <div className="filter-item flex-col">
                     <label className="form-label required">
                        Date to Pay by
                     </label>
                     <div className="input-wrapper">
                        <CustomDatePicker
                           name="dateToPayBy"
                           value={startDate || ""}
                           onChange={handleDateChange}
                           className="ui-dropdown-vnn"
                           status={errors.dateToPayBy ? "error" : undefined}
                        />
                     </div>
                  </div>

                  <div className="filter-actions ">
                     <ActionPermissionGuard actionId="employee-expense.generate-report">
                        <CustomStyledButton
                           name="applyFilters"
                           label={
                              isValidating
                                 ? "Validating..."
                                 : isGenerating
                                 ? "Generating..."
                                 : "Generate Report"
                           }
                           onClick={onApply}
                           disabled={isValidating || isGenerating}
                           loading={isValidating || isGenerating}
                        />
                     </ActionPermissionGuard>
                  </div>
               </div>
            </div>
         </div>
         <div className="content-div-container">
            <div className="content-card-body">
               <div className="flex-between">
                  <div>
                     <h5>{EMPLOYEE_EXPENSES.genReports}</h5>
                  </div>
                  <div className="action-buttons flex-align">
                     <p className="sync-status">
                        {lastSyncTime
                           ? `Last sync on ${lastSyncTime}`
                           : "No recent sync"}
                     </p>
                     <DefaultButton
                        name="postRefresh"
                        label={EMPLOYEE_EXPENSES.postRefresh}
                        onClick={postRefreshList}
                        icon={<ReloadOutlined />}
                     />
                  </div>
               </div>

               <div className="table-responsive-container">
                  <PurchaseJournalTable
                     ref={tableRef}
                     fetchDataFn={fetchPurchaseJournalReports}
                     viewActionId="employee-expense.view"
                  />
               </div>
            </div>
         </div>

         {showToaster && (
            <Toaster
               type={toasterType}
               title={toasterMessage}
               subtitle={toasterDescription}
               onClose={closeToaster}
            />
         )}
      </>
   );
};

export default EmployeeExpenseExport;
