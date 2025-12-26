import React, { useState, useEffect, useCallback } from "react";
import "./payment-forms.scss";
import { Collapse, Divider, Switch, Row, Col } from "antd";
import CustomDatePicker from "@widget-library/DatePicker";
import { CustomSelectDropdown } from "@widget-library/Dropdown";
import { CustomPrefixInput } from "@widget-library/Input";
import itemDeleteIcon from "@assets/icons/item-delete-icon.svg";

import { formatCurrency, formatAmountValue } from "@utils/formatters";
import { CustomStyledButton, DefaultButton } from "@widget-library/Buttons";
import CompanyNo from "@shared-components/company-number/CompanyNo";
import type {
   PaymentNotificationState,
   PaymentItem,
   PaymentFormPropsExtended,
} from "@/types/accounts-payable.types";
import { usePaymentCycle } from "@hooks/usePaymentCycle";
import { formatNumberToMMDDYY } from "@utils/dateFormat";
import Toaster from "@widget-library/Toaster";
import { useDropdownData } from "@hooks/useDropdownData";
import ActionPermissionGuard from "@shared-components/permissions/ActionPermissionGuard";

const { Panel } = Collapse;

const PaymentForm: React.FC<PaymentFormPropsExtended> = ({
   onPaymentSaved,
   onVoucherTypeChange,
   onPaymentTypeSubmit,
   isPaymentTypeSubmitted: externalIsSubmitted,
   onDateToPayByChange,
   // Lifted state props
   paymentFormState,
   setPaymentFormState,
   paymentTypeState,
   setPaymentTypeState,
   isPaymentFormSubmitted,
   setIsPaymentFormSubmitted,
   isEditMode,
   setIsEditMode,
   generateEntrySequence,
}) => {
   // Payment Cycle custom hook
   const {
      fetchVoucherPaymentTypes,
      fetchCompanyMaintenance,
      fetchGlMaster,
      submitPaymentSelectionType,
      submitVendorPayment,
   } = usePaymentCycle();

   // Using lifted state instead of local state
   // Removed companyNo local state - now using paymentTypeState.companyNo
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [isLoadingGlDescription, setIsLoadingGlDescription] = useState(false);

   // Track which payments have unsaved changes to prevent navigation
   const [paymentChanges, setPaymentChanges] = useState<
      Record<number, boolean>
   >({});

   // Fetch Pay/Hold options from API
   const {
      data: payHoldOptionsApiData = [],
      isLoading: isLoadingPayHoldOptions,
   } = useDropdownData("PAY_HOLD_OPTIONS");

   // Fetch Single Check options from API
   const {
      data: singleCheckOptionsApiData = [],
      isLoading: isLoadingSingleCheckOptions,
   } = useDropdownData("SINGLE_CHECK_FLAG");

   // Fetch Make Prepaid options from API
   const {
      data: makePrepaidOptionsApiData = [],
      isLoading: isLoadingMakePrepaidOptions,
   } = useDropdownData("MAKE_PREPAID_FLAG");

   // Transform API data to match expected dropdown format
   const payHoldOptionsData = payHoldOptionsApiData.map((item) => ({
      value: item.value || "",
      label: item.label || "",
   }));

   const singleCheckOptionsData = singleCheckOptionsApiData.map((item) => ({
      value: item.value || "",
      label: item.label || "",
   }));

   const makePrepaidOptionsData = makePrepaidOptionsApiData.map((item) => ({
      value: item.value || "",
      label: item.label || "",
   }));
   const [notification, setNotification] = useState<PaymentNotificationState>({
      visible: false,
      type: "success",
      title: "",
      subtitle: "",
   });
   const [activePanelKey, setActivePanelKey] = useState<string | number | null>(
      null
   );
   const [paymentTypeOptions, setPaymentTypeOptions] = useState<
      Array<{
         id: string;
         label: string;
         value: string;
      }>
   >([]);
   const [isLoadingPaymentTypes, setIsLoadingPaymentTypes] = useState(false);

   // Field validation errors state
   const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

   // Clear specific field error
   const clearFieldError = (fieldName: string) => {
      setFieldErrors((prev) => {
         const newErrors = { ...prev };
         delete newErrors[fieldName];
         return newErrors;
      });
   };

   const hasPaymentTypeErrors = () => {
      const paymentTypeFields = [
         'companyNo',
         'voucherToPay',
         'startingCheck',
         'checkDate',
         'dateToPayBy',
         'bankAccountGL',
         'forcedDiscount1'
      ];
      return paymentTypeFields.some(field => fieldErrors[field]);
   };

   // Client-side validation for Payment Type section only (for Submit button)
   const validatePaymentTypeFields = (): boolean => {
      const errors: Record<string, string> = {};
      let isValid = true;

      // Main form validation only
      if (!paymentTypeState.voucherToPay) {
         errors.voucherToPay = "Voucher to Pay is required";
         isValid = false;
      }

      if (!paymentTypeState.startingCheck) {
         errors.startingCheck = "Starting Check is required";
         isValid = false;
      }

      if (!paymentTypeState.checkDate) {
         errors.checkDate = "Check Date is required";
         isValid = false;
      }

      if (!paymentTypeState.bankAccountGL) {
         errors.bankAccountGL = "Bank Account GL is required";
         isValid = false;
      }

      setFieldErrors(errors);
      return isValid;
   };

   // Client-side validation for Pay by Vendor section only (for Save button)
   const validatePayByVendorFields = (paymentId: number): boolean => {
      const payment = paymentFormState.payments.find((p) => p.id === paymentId);
      if (!payment) return false;

      const errors: Record<string, string> = {};
      let isValid = true;

      if (!payment.vendorNumber) {
         errors.vendorNumber = "Vendor Number is required";
         isValid = false;
      }

      setFieldErrors((prev) => ({ ...prev, ...errors }));
      return isValid;
   };

   // Parse server-side validation errors
   const parseServerErrors = (errorResponse: any): void => {
      // Based on the actual error structure: errorResponse.error.error.details
      let errorData = null;

      if (errorResponse?.error?.error?.details) {
         errorData = errorResponse.error.error;
      } else if (errorResponse?.error?.details) {
         errorData = errorResponse.error;
      } else if (errorResponse?.response?.data?.error?.details) {
         errorData = errorResponse.response.data.error;
      } else {
         return;
      }

      if (errorData?.details && Array.isArray(errorData.details)) {
         const newErrors: Record<string, string> = {};

         errorData.details.forEach((detail: any) => {
            if (detail.field && detail.message) {
               // Map server field names to client field names
               let clientFieldName = detail.field;

               switch (detail.field) {
                  case "startingCheckNo":
                     clientFieldName = "startingCheck";
                     break;
                  case "companyNo":
                     clientFieldName = "companyNo";
                     break;
                  case "voucherToPay":
                     clientFieldName = "voucherToPay";
                     break;
                  case "checkDate":
                     clientFieldName = "checkDate";
                     break;
                  case "dateToPayBy":
                     clientFieldName = "dateToPayBy";
                     break;
                  case "bankAccountGl":
                     clientFieldName = "bankAccountGL";
                     break;
                  case "forcedDiscount":
                     clientFieldName = "forcedDiscount1";
                     break;
                  case "vendorNo":
                     clientFieldName = "vendorNumber";
                     break;
                  case "voucherNo":
                     clientFieldName = "voucherNumber";
                     break;
                  case "partialPayAmount":
                     clientFieldName = "partialPayAmount";
                     break;
                  case "discountAmount":
                     clientFieldName = "overrideDiscountAmount";
                     break;
                  case "prepaidCheckDate":
                     clientFieldName = "checkDateVendor";
                     break;
                  default:
                     clientFieldName = detail.field;
                     break;
               }

               newErrors[clientFieldName] = detail.message;
            }
         });

         setFieldErrors((prev) => ({ ...prev, ...newErrors }));
      }
   };

   // Show multiple error notifications stacked vertically
   const showMultipleErrorNotifications = (errorDetails: any[]): void => {
      if (!errorDetails || errorDetails.length === 0) return;

      // Show each error as a separate toaster notification
      errorDetails.forEach((error, index) => {
         setTimeout(() => {
            setNotification({
               visible: true,
               type: "error",
               title: error.field || "Validation Error",
               subtitle: error.message,
            });
         }, index * 1000); // 1 second delay between each notification
      });
   };

   // Fetch payment types on component mount
   useEffect(() => {
      const loadPaymentTypes = async () => {
         try {
            setIsLoadingPaymentTypes(true);
            const types = await fetchVoucherPaymentTypes();
            setPaymentTypeOptions(types);
            // Only set default if we have types and paymentTypeState still has the parent's default "Check" value
            // This prevents overriding user selections or API-set values
            if (types.length > 0 && paymentTypeState.voucherToPay === "Check") {
               const defaultType =
                  types.find((type) => type.value === "Check") || types[0];
               if (defaultType.value !== "Check") {
                  // Only update if the API default is different from parent default
                  setPaymentTypeState((prev) => ({
                     ...prev,
                     voucherToPay: defaultType.value,
                  }));
               }
            }
         } catch (error) {
            console.error("Failed to fetch payment types:", error);
         } finally {
            setIsLoadingPaymentTypes(false);
         }
      };

      loadPaymentTypes();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []); // Keep empty dependency array to avoid re-fetching on every render and potential infinite loops

   useEffect(() => {
      if (paymentTypeState.voucherToPay && onVoucherTypeChange) {
         onVoucherTypeChange(paymentTypeState.voucherToPay);
      }
   }, [paymentTypeState.voucherToPay, onVoucherTypeChange]);

   // Initial load - trigger onVoucherTypeChange if voucherToPay is already set
   useEffect(() => {
      if (paymentTypeState.voucherToPay && onVoucherTypeChange) {
         onVoucherTypeChange(paymentTypeState.voucherToPay);
      }
   }, []); // Empty dependency array to run only on mount

   const handleInputChange = async (
      id: number,
      name: keyof PaymentItem,
      value: string | boolean
   ) => {
      // Update the state only - no automatic API calls
      setPaymentFormState((prev) => ({
         ...prev,
         payments: prev.payments.map((payment) =>
            payment.id === id ? { ...payment, [name]: value } : payment
         ),
      }));

      // Mark this payment as having unsaved changes
      setPaymentChanges((prev) => ({
         ...prev,
         [id]: true,
      }));
   };

   // Auto-populate Bank Account GL and Starting Check from company maintenance
   const populateCompanyData = useCallback(async () => {
      try {
         setIsLoadingGlDescription(true);
         const companyData = await fetchCompanyMaintenance(
            parseInt(paymentTypeState.companyNo, 10)
         );
         
         // Pre-populate Bank Account GL and Starting Check with API data
         setPaymentTypeState((prev) => ({
            ...prev,
            bankAccountGL: companyData.companyBankGlNo?.toString() || "",
            startingCheck: companyData.companyNextCheckNo?.toString() || "",
         }));

         // Auto-fetch GL description for the populated bank account GL
         if (companyData.companyBankGlNo) {
            try {
               const glResult = await fetchGlMaster({
                  companyNo: parseInt(paymentTypeState.companyNo, 10),
                  glNo: companyData.companyBankGlNo,
               });

               if (glResult.success) {
                  setPaymentTypeState((prev) => ({
                     ...prev,
                     bankAccountGLDescription: glResult.description || "",
                  }));
               }
            } catch (error) {
               console.error("Error fetching GL description:", error);
            }
         }

      } catch (error) {
         console.error("Error loading company data:", error);
      } finally {
         setIsLoadingGlDescription(false);
      }
   }, [paymentTypeState.companyNo, setPaymentTypeState]);

   // Auto-populate company data when component loads or company number changes
   useEffect(() => {
      if (paymentTypeState.companyNo && 
          (!paymentTypeState.bankAccountGL || !paymentTypeState.startingCheck)) {
         populateCompanyData();
      }
   }, [paymentTypeState.companyNo, paymentTypeState.bankAccountGL, paymentTypeState.startingCheck, populateCompanyData]);

   const handlePaymentTypeChange = async (
      name: string,
      value: string | boolean
   ) => {
      try {
         // Handle date fields specifically
         if (name === "checkDate" || name === "dateToPayBy") {
            setPaymentTypeState((prev) => ({
               ...prev,
               [name]: value as string,
            }));
         } else {
            setPaymentTypeState((prev) => ({ ...prev, [name]: value }));
         }

         // Handle bank GL field - fetch description when GL is entered
         if (
            name === "bankAccountGL" &&
            typeof value === "string" &&
            value.length === 8
         ) {
            setIsLoadingGlDescription(true);
            try {
               const result = await fetchGlMaster({
                  companyNo: parseInt(paymentTypeState.companyNo, 10),
                  glNo: parseInt(value, 10),
               });

               if (result.success) {
                  setPaymentTypeState((prev) => ({
                     ...prev,
                     bankAccountGLDescription: result.description || "",
                  }));
               } else {
                  setNotification({
                     visible: true,
                     type: "error",
                     title: "GL Fetch Error",
                     subtitle:
                        result.message || "Could not fetch GL account details",
                  });
                  setPaymentTypeState((prev) => ({
                     ...prev,
                     bankAccountGLDescription: "",
                  }));
               }
            } catch (error) {
               console.error("GL Fetch Error:", error);
               setPaymentTypeState((prev) => ({
                  ...prev,
                  bankAccountGLDescription: "",
               }));
            } finally {
               setIsLoadingGlDescription(false);
            }
         }

         // Notify parent of voucher type changes
         if (name === "voucherToPay" && onVoucherTypeChange) {
            onVoucherTypeChange(value as string);
         }

         // Notify parent of dateToPayBy changes
         if (name === "dateToPayBy" && onDateToPayByChange) {
            onDateToPayByChange(value as string);
         }
      } catch (error) {
         console.error(`Error updating ${name}:`, error);
      }
   };

   const handleAddPayment = () => {
      const newPayment: PaymentItem = {
         id: Date.now(),
         entrySequence: generateEntrySequence(paymentFormState.payments.length),
         voucherToPay: paymentTypeState.voucherToPay,
         startingCheck: paymentTypeState.startingCheck,
         checkDate: paymentTypeState.checkDate,
         dateToPayBy: paymentTypeState.dateToPayBy,
         forcedDiscount1: paymentTypeState.forcedDiscount1,
         bankAccountGL: paymentTypeState.bankAccountGL,
         bankAccountGLDescription: paymentTypeState.bankAccountGLDescription,
         forcedDiscount2: false,
         vendorNumber: "",
         voucherNumber: "",
         partialPayAmount: "",
         overrideDiscountAmount: "",
         payHold: "",
         singleCheck: "",
         makePrepaid: "",
         prepaidCheckNo: "",
         checkDateVendor: "",
         isSaved: false,
         isDefault: false,
      };
      setPaymentFormState((prev) => ({
         ...prev,
         payments: [...prev.payments, newPayment],
      }));

      // New payments don't have unsaved changes initially
      // (they'll be marked as changed when user starts typing)

      setActivePanelKey(newPayment.id);
   };

   const handleDeletePayment = async (id: number) => {
      const payment = paymentFormState.payments.find((p) => p.id === id);
      if (!payment) return;

      // Only call API for saved payments, just remove unsaved ones from UI
      if (payment.isSaved) {
         try {
            setIsSubmitting(true);

            const apiData = convertToApiFormat(payment);

            const result = await submitVendorPayment({
               companyNo: parseInt(paymentTypeState.companyNo, 10),
               voucherToPay: paymentTypeState.voucherToPay as
                  | "Check"
                  | "ACH"
                  | "Wire",
               bankAccountGl: parseInt(paymentTypeState.bankAccountGL, 10),
               startingCheckNo: parseInt(paymentTypeState.startingCheck, 10),
               checkDate:
                  formatNumberToMMDDYY(paymentTypeState.checkDate) || "",
               dateToPayBy:
                  formatNumberToMMDDYY(paymentTypeState.dateToPayBy) || "",
               ...apiData,
               mode: "D", // Delete mode
            } as any);

            if (result.success) {
               setNotification({
                  visible: true,
                  type: "success",
                  title: "Success",
                  subtitle: result.message,
               });
            } else {
               setNotification({
                  visible: true,
                  type: "error",
                  title: "Error",
                  subtitle: result.message,
               });
               return; // Don't remove from UI if API call failed
            }
         } catch (error) {
            console.error("Delete payment error:", error);
            setNotification({
               visible: true,
               type: "error",
               title: "Error",
               subtitle:
                  "An unexpected error occurred while deleting the payment",
            });
            return; // Don't remove from UI if API call failed
         } finally {
            setIsSubmitting(false);
         }
      } else {
      }

      // Remove from local state (for both saved and unsaved payments)
      const updatedPayments = paymentFormState.payments.filter(
         (payment) => payment.id !== id
      );

      setPaymentFormState((prev) => ({
         ...prev,
         payments: updatedPayments,
      }));

      // Clear unsaved changes for the deleted payment
      setPaymentChanges((prev) => {
         const newChanges = { ...prev };
         delete newChanges[id];
         return newChanges;
      });

      if (onPaymentSaved) {
         const stillHasSavedPayments = updatedPayments.some(
            (payment) => payment.isSaved
         );
         const hasUnsavedChanges =
            Object.keys(paymentChanges).length > 1 ||
            (Object.keys(paymentChanges).length === 1 && paymentChanges[id]);

         // Only allow navigation if there are saved payments and no unsaved changes
         onPaymentSaved(stillHasSavedPayments && !hasUnsavedChanges);
      }
   };

   const genExtra = (id: number) => {
      // Show delete icon for all payments
      return (
         <img
            src={itemDeleteIcon}
            alt="Delete"
            onClick={(e) => {
               e.stopPropagation();
               handleDeletePayment(id);
            }}
            className="delete-icon"
         />
      );
   };

   const getPanelHeader = (payment: PaymentItem, index: number) => {
      const getPaymentValue = (key: string): string => {
         switch (key) {
            case "vendorNumber":
               return payment.vendorNumber || "--";
            case "voucherNumber":
               return payment.voucherNumber || "--";
            case "checkDate":
               return payment.checkDate || "--";
            case "partialPayAmount":
               return payment.partialPayAmount
                  ? formatCurrency(payment.partialPayAmount)
                  : "--";
            case "entrySequence":
               return payment.entrySequence || "--";
            default:
               return "--";
         }
      };

      return (
         <div className="panel-header line-item">
            <h5 >Payment {index + 1}</h5>
            {Object.keys(payment).length > 0 && (
               <div className="panel-details flex-align">
                  {[
                     ["Vendor Number", "vendorNumber"],
                     ["Voucher Number", "voucherNumber"],
                     ["Check Date", "checkDate"],
                  ].map(([label, key], idx) => (
                     <React.Fragment key={key}>
                        <div className="flex-align label-value-pair">
                           <span className="p-s separator">{label}</span>
                           <span className="sub-title">
                              {getPaymentValue(key)}
                           </span>
                        </div>
                        {idx < 3 && <span className="p-s separator"> | </span>}
                     </React.Fragment>
                  ))}
               </div>
            )}
         </div>
      );
   };

   // useEffect(() => {
   //    if (paymentFormState.payments.length > 0 && activePanelKey === null) {
   //       // Set the first payment (default) as active
   //       setActivePanelKey(paymentFormState.payments[0].id);
   //    }
   // }, [paymentFormState.payments, activePanelKey]);

   const handleSubmitPaymentSelection = async () => {
      try {
         setIsSubmitting(true);

         // Clear any existing errors before submission
         setFieldErrors({});

         // Determine mode: "I" for initial submit, "U" for update/edit
         const mode = isEditMode ? "U" : "I";

         // Format dates to MMDDYY
         const formattedCheckDate =
            formatNumberToMMDDYY(paymentTypeState.checkDate) || "";
         const formattedDateToPayBy =
            formatNumberToMMDDYY(paymentTypeState.dateToPayBy) || "";

         const result = await submitPaymentSelectionType({
            companyNo: parseInt(paymentTypeState.companyNo, 10),
            voucherToPay: paymentTypeState.voucherToPay as
               | "Check"
               | "ACH"
               | "Wire",
            startingCheckNo: parseInt(paymentTypeState.startingCheck, 10),
            checkDate: formattedCheckDate,
            dateToPayBy: formattedDateToPayBy,
            bankAccountGl: parseInt(paymentTypeState.bankAccountGL, 10),
            forcedDiscount: paymentTypeState.forcedDiscount1 ? "D" : "",
            mode,
         });

         if (result.success) {
            // Clear validation errors on successful submission
            setFieldErrors({});

            setNotification({
               visible: true,
               type: "success",
               title: "Success",
               subtitle: result.message,
            });

            setIsPaymentFormSubmitted(true);
            setIsEditMode(false); // Reset edit mode after successful submit

            // Update all payments with current payment type values
            setPaymentFormState((prev) => ({
               ...prev,
               payments: prev.payments.map((payment) => ({
                  ...payment,
                  voucherToPay: paymentTypeState.voucherToPay,
                  startingCheck: paymentTypeState.startingCheck,
                  checkDate: paymentTypeState.checkDate,
                  dateToPayBy: paymentTypeState.dateToPayBy,
                  forcedDiscount1: paymentTypeState.forcedDiscount1,
                  bankAccountGL: paymentTypeState.bankAccountGL,
                  bankAccountGLDescription:
                     paymentTypeState.bankAccountGLDescription,
               })),
            }));

            if (onPaymentTypeSubmit) {
               onPaymentTypeSubmit(true);
            }
         } else {
            // Check if there are validation errors in the unsuccessful result
            if ((result as any).error) {
               parseServerErrors({ error: { error: (result as any).error } });
            }

            setNotification({
               visible: true,
               type: "error",
               title: "Error",
               subtitle: result.message,
            });
         }
      } catch (error: unknown) {
         // Parse server-side validation errors
         parseServerErrors(error);

         setNotification({
            visible: true,
            type: "error",
            title: "Error",
            subtitle:
               "An unexpected error occurred while submitting payment type selection",
         });
      } finally {
         setIsSubmitting(false);
      }
   };

   const handleSubmit = () => {
      try {
         if (validatePaymentTypeFields()) {
            handleSubmitPaymentSelection();
         } else {
            setNotification({
               visible: true,
               type: "error",
               title: "Validation Error",
               subtitle:
                  "Please fill in all required Payment Type fields before submitting.",
            });
         }
      } catch (error) {
         console.error("Submit error:", error);
      }
   };

   const handleEdit = () => {
      setIsPaymentFormSubmitted(false);
      setIsEditMode(true); // Set edit mode for update operation
      if (onPaymentTypeSubmit) {
         onPaymentTypeSubmit(false);
      }
   };

   // Helper function to convert form values to API format
   const convertToApiFormat = (payment: PaymentItem) => {
      // Convert payHold to payOrHold format - check both label and value patterns
      const payOrHold: "P" | "H" | "" =
         payment.payHold === "Pay" || payment.payHold === "P"
            ? "P"
            : payment.payHold === "Hold" || payment.payHold === "H"
            ? "H"
            : "";

      // Convert singleCheck to API format - handle both label and value patterns
      const singleCheck: "S" | "" =
         payment.singleCheck === "S" ||
         payment.singleCheck === "Single" ||
         payment.singleCheck === "Yes"
            ? "S"
            : "";

      // Convert makePrepaid to API format - handle both label and value patterns
      let makePrepaid: "" | "P" | "A" | "W" = "";
      if (
         payment.makePrepaid === "P" ||
         payment.makePrepaid === "Advance" ||
         payment.makePrepaid === "Yes"
      )
         makePrepaid = "P";
      else if (payment.makePrepaid === "A" || payment.makePrepaid === "ACH")
         makePrepaid = "A";
      else if (payment.makePrepaid === "W" || payment.makePrepaid === "Wire")
         makePrepaid = "W";

      // Convert forcedDiscount2 to API format
      const forcedDiscount: "D" | "" = payment.forcedDiscount2 ? "D" : "";

      return {
         entrySequence: payment.entrySequence,
         vendorNo: parseInt(payment.vendorNumber, 10) || 0,
         voucherNo: parseInt(payment.voucherNumber, 10) || "",
         partialPayAmount: parseFloat(payment.partialPayAmount) || "",
         discountAmount: parseFloat(payment.overrideDiscountAmount) || "",
         payOrHold,
         singleCheck,
         makePrepaid,
         prepaidCheckNo: payment.prepaidCheckNo || "",
         prepaidDate: formatNumberToMMDDYY(payment.checkDateVendor) || "",
         forcedDiscount,
      };
   };

   const handleSavePayment = async (id: number) => {
      const payment = paymentFormState.payments.find((p) => p.id === id);
      if (!payment) return;

      // Client-side validation for Pay by Vendor section
      if (!validatePayByVendorFields(id)) {
         setNotification({
            visible: true,
            type: "error",
            title: "Validation Error",
            subtitle:
               "Please fill in all required Pay by Vendor fields before saving.",
         });
         return;
      }

      try {
         setIsSubmitting(true);

         const apiData = convertToApiFormat(payment);

         // Use "I" mode for first save, "U" mode for subsequent saves
         const mode = payment.isSaved ? "U" : "I";

         const result = await submitVendorPayment({
            companyNo: parseInt(paymentTypeState.companyNo, 10),
            voucherToPay: paymentTypeState.voucherToPay as
               | "Check"
               | "ACH"
               | "Wire",
            bankAccountGl: parseInt(paymentTypeState.bankAccountGL, 10),
            startingCheckNo: parseInt(paymentTypeState.startingCheck, 10),
            checkDate: formatNumberToMMDDYY(paymentTypeState.checkDate) || "",
            dateToPayBy:
               formatNumberToMMDDYY(paymentTypeState.dateToPayBy) || "",
            ...apiData,
            mode,
         } as any);

         if (result.success) {
            // Clear validation errors on successful submission
            setFieldErrors({});

            setNotification({
               visible: true,
               type: "success",
               title: "Success",
               subtitle: result.message,
            });

            const updatedPayments = paymentFormState.payments.map((p) =>
               p.id === id ? { ...p, isSaved: true } : p
            );

            setPaymentFormState({ payments: updatedPayments });

            // Clear the unsaved changes flag for this payment
            setPaymentChanges((prev) => {
               const newChanges = { ...prev };
               delete newChanges[id];
               return newChanges;
            });

            const hasAnySaved = updatedPayments.some((p) => p.isSaved);
            const hasUnsavedChanges =
               Object.keys(paymentChanges).length > 1 ||
               (Object.keys(paymentChanges).length === 1 &&
                  !paymentChanges[id]);

            if (onPaymentSaved) {
               // Only allow navigation if there are saved payments and no unsaved changes
               onPaymentSaved(hasAnySaved && !hasUnsavedChanges);
            }
         } else {
            // Check for validation errors from collapsible section save
            if ((result as any).error) {
               parseServerErrors({ error: (result as any).error });

               // Show multiple error notifications if there are validation details
               if (
                  (result as any).error?.details &&
                  Array.isArray((result as any).error.details)
               ) {
                  showMultipleErrorNotifications((result as any).error.details);
               } else {
                  // Fallback to single error message
                  setNotification({
                     visible: true,
                     type: "error",
                     title: "Error",
                     subtitle: result.message,
                  });
               }
            } else {
               setNotification({
                  visible: true,
                  type: "error",
                  title: "Error",
                  subtitle: result.message,
               });
            }
         }
      } catch (error) {
         console.error("Save payment error:", error);
         setNotification({
            visible: true,
            type: "error",
            title: "Error",
            subtitle: "An unexpected error occurred while saving the payment",
         });
      } finally {
         setIsSubmitting(false);
      }
   };

   const renderField = (
      label: string,
      value: string | boolean,
      isLong?: boolean
   ) => {
      const displayValue = value || "-";

      return (
         <div className={`field-container ${isLong ? "long-field" : ""}`}>
            <span className="sub-title">{label}</span>
            <span>{displayValue}</span>
         </div>
      );
   };

   // Use external state if provided, otherwise use internal state
   const currentIsSubmitted =
      externalIsSubmitted !== undefined
         ? externalIsSubmitted
         : isPaymentFormSubmitted;

   return (
      <div className="payment-form">
         <div className={`bordered-box ${hasPaymentTypeErrors() ? 'payment-type-error' : ''}`}>
            {currentIsSubmitted ? (
               <div className="payment-type-display">
                  <h5>Payment Type</h5>
                  <Divider className="divider-color" />
                  <div className="voucher-section">
                     <Row gutter={[16, 16]}>
                        <Col span={6}>
                           {renderField(
                              "Company No",
                              paymentTypeState.companyNo
                           )}
                        </Col>
                        <Col span={6}>
                           {renderField(
                              "Voucher to Pay",
                              paymentTypeState.voucherToPay
                           )}
                        </Col>
                        <Col span={6}>
                           {renderField(
                              "Starting Check",
                              paymentTypeState.startingCheck
                           )}
                        </Col>
                        <Col span={6}>
                           {renderField(
                              "Check Date",
                              paymentTypeState.checkDate
                           )}
                        </Col>
                     </Row>
                     <Row gutter={[16, 16]}>
                        <Col span={6}>
                           {renderField(
                              "Date to Pay By",
                              paymentTypeState.dateToPayBy
                           )}
                        </Col>
                        <Col span={6}>
                           {renderField(
                              "Forced Discount",
                              paymentTypeState.forcedDiscount1 ? "Yes" : "No"
                           )}
                        </Col>
                        <Col span={6}>
                           {renderField(
                              "Bank Account GL",
                              paymentTypeState.bankAccountGL
                           )}
                        </Col>
                        <Col span={6}>
                           {renderField(
                              "Bank Account GL Description",
                              paymentTypeState.bankAccountGLDescription,
                              true
                           )}
                        </Col>
                     </Row>
                  </div>
                  <div className="flex-end">
                     <DefaultButton
                        name="edit"
                        label="Edit"
                        onClick={handleEdit}
                     />
                  </div>
               </div>
            ) : (
               <>
                  <h5>Payment Type</h5>
                  <hr className="horizonatl-line" />
                  <div className="form-grid">
                     <div className="form-group">
                        <div className="dropdown-wrapper">
                           <CompanyNo
                              value={paymentTypeState.companyNo}
                              onChange={(value) =>
                                 handlePaymentTypeChange("companyNo", value)
                              }
                           />
                        </div>
                        {fieldErrors.companyNo && (
                           <div className="error-message">
                              {fieldErrors.companyNo}
                           </div>
                        )}
                     </div>
                     <div className="form-group">
                        <label className="sub-title">
                           <span className="astricks">*</span> Voucher to Pay
                        </label>
                        <CustomSelectDropdown
                           name="voucherToPay"
                           options={paymentTypeOptions}
                           value={paymentTypeState.voucherToPay}
                           onChange={(value) => {
                              clearFieldError("voucherToPay");
                              if (value === paymentTypeState.voucherToPay) {
                                 // Force update by temporarily clearing and then setting
                                 setPaymentTypeState((prev) => ({
                                    ...prev,
                                    voucherToPay: "",
                                 }));
                                 setTimeout(() => {
                                    setPaymentTypeState((prev) => ({
                                       ...prev,
                                       voucherToPay: value,
                                    }));
                                 }, 0);
                              } else {
                                 handlePaymentTypeChange("voucherToPay", value);
                              }
                           }}
                           placeholder={
                              isLoadingPaymentTypes
                                 ? "Loading..."
                                 : "Select payment type"
                           }
                           className=""
                           disabled={isLoadingPaymentTypes}
                           status={
                              fieldErrors.voucherToPay ? "error" : undefined
                           }
                        />
                        {fieldErrors.voucherToPay && (
                           <div className="error-message">
                              {fieldErrors.voucherToPay}
                           </div>
                        )}
                     </div>
                     <div className="form-group">
                        <label className="sub-title">
                           <span className="astricks">*</span> Starting Check
                        </label>
                        <CustomPrefixInput
                           name="startingCheck"
                           value={paymentTypeState.startingCheck}
                           onChange={(e) => {
                              clearFieldError("startingCheck");
                              const value = e.target.value.replace(
                                 /[^0-9]/g,
                                 ""
                              ); // Only allow numbers
                              if (value.length <= 6) {
                                 handlePaymentTypeChange(
                                    "startingCheck",
                                    value
                                 );
                              }
                           }}
                           placeholder="Enter starting check number"
                           maxLength={6}
                           status={
                              fieldErrors.startingCheck ? "error" : undefined
                           }
                        />
                        {fieldErrors.startingCheck && (
                           <div className="error-message">
                              {fieldErrors.startingCheck}
                           </div>
                        )}
                     </div>
                     <div className="form-group">
                        <label className="sub-title">
                           <span className="astricks">*</span> Check Date
                        </label>
                        <CustomDatePicker
                           name="checkDate"
                           value={paymentTypeState.checkDate}
                           onChange={(name, value) => {
                              clearFieldError("checkDate");
                              handlePaymentTypeChange(name, value);
                           }}
                           status={fieldErrors.checkDate ? "error" : undefined}
                        />
                        {fieldErrors.checkDate && (
                           <div className="error-message">
                              {fieldErrors.checkDate}
                           </div>
                        )}
                     </div>
                     <div className="form-group">
                        <label className="sub-title">Date to Pay By</label>
                        <CustomDatePicker
                           name="dateToPayBy"
                           value={paymentTypeState.dateToPayBy}
                           onChange={(name, value) => {
                              handlePaymentTypeChange(name, value);
                           }}
                           status={
                              fieldErrors.dateToPayBy ? "error" : undefined
                           }
                        />
                     </div>

                     <div className="form-group">
                        <label className="sub-title">
                           <span className="astricks">*</span> Bank Account GL
                        </label>
                        <CustomPrefixInput
                           name="bankAccountGL"
                           value={paymentTypeState.bankAccountGL}
                           onChange={(e) => {
                              clearFieldError("bankAccountGL");
                              const value = e.target.value.replace(
                                 /[^0-9]/g,
                                 ""
                              ); // Only allow numbers
                              if (value.length <= 8) {
                                 // Limit to 8 digits
                                 handlePaymentTypeChange(
                                    "bankAccountGL",
                                    value
                                 );
                              }
                           }}
                           placeholder="Enter 8-digit GL account"
                           disabled={isLoadingGlDescription}
                           status={
                              fieldErrors.bankAccountGL ? "error" : undefined
                           }
                        />
                        {fieldErrors.bankAccountGL && (
                           <div className="error-message">
                              {fieldErrors.bankAccountGL}
                           </div>
                        )}
                     </div>
                     <div className="form-group textarea-span">
                        <label className="sub-title">
                           <span className="astricks">*</span> Bank Account GL
                           Description
                        </label>
                        <CustomPrefixInput
                           name="bankAccountGLDescription"
                           value={
                              isLoadingGlDescription
                                 ? "Loading..."
                                 : paymentTypeState.bankAccountGLDescription
                           }
                           onChange={(e) =>
                              handlePaymentTypeChange(
                                 "bankAccountGLDescription",
                                 e.target.value
                              )
                           }
                           placeholder={
                              isLoadingGlDescription
                                 ? "Fetching GL description..."
                                 : "Enter description or GL account will auto-populate"
                           }
                           disabled={isLoadingGlDescription}
                           maxLength={100}
                           showCount={true}
                        />
                     </div>
                     <div className="form-group switch-group">
                        <label className="sub-title">Forced Discount</label>
                        <Switch
                           checked={paymentTypeState.forcedDiscount1}
                           onChange={(checked) =>
                              handlePaymentTypeChange(
                                 "forcedDiscount1",
                                 checked
                              )
                           }
                        />
                        {fieldErrors.forcedDiscount1 && (
                           <div className="error-message">
                              {fieldErrors.forcedDiscount1}
                           </div>
                        )}
                     </div>
                  </div>
                  <Divider className="divider-color" />
                  <div className="flex-end">
                     <ActionPermissionGuard actionId="payment-selection.save">
                        <CustomStyledButton
                           name="submit"
                           label={isSubmitting ? "Saving..." : "Save"}
                           onClick={handleSubmit}
                           disabled={isSubmitting}
                        />
                     </ActionPermissionGuard>
                  </div>
               </>
            )}
         </div>

         <div className="form-section bordered-box table-margin">
            <div className="content-card-header flex-between">
               <div className="flex-column">
                  <h5 className="section-title">Pay by Vendor and Voucher</h5>
               </div>
               <DefaultButton
                  onClick={handleAddPayment}
                  className="ant-Button"
                  label={<h6>Add Payment</h6>}
                  name=""
                  disabled={!currentIsSubmitted}
               />
            </div>
            <Divider />

            <div className="collapse-container">
               {paymentFormState.payments.map((payment, index) => (
                  <Collapse
                     accordion
                     activeKey={
                        activePanelKey === null ? undefined : activePanelKey
                     }
                     onChange={(key) =>
                        setActivePanelKey(key as unknown as string)
                     }
                     key={payment.id}
                     className="collapse-panel"
                  >
                     <Panel
                        header={getPanelHeader(payment, index)}
                        key={payment.id}
                        extra={genExtra(payment.id)}
                        className={`custom-collapse-panel ${
                           payment.voucherToPay === "Closed"
                              ? "closed-panel"
                              : "open-panel"
                        } ${payment.isSaved ? "saved-panel" : ""}`}
                     >
                        <div className="form-section">
                           <div className="form-grid">
                              {/* <div className="form-group">
                                 <label className="sub-title">
                                    Entry Sequence
                                 </label>
                                 <CustomPrefixInput
                                    name="entrySequence"
                                    value={payment.entrySequence}
                                    onChange={() => {}} // Read-only field
                                    placeholder="Auto-generated"
                                    disabled={true}
                                 />
                              </div> */}
                              <div className="form-group">
                                 <label className="sub-title required">
                                    Vendor Number
                                 </label>
                                 <CustomPrefixInput
                                    name="vendorNumber"
                                    value={payment.vendorNumber}
                                    onChange={(e) => {
                                       clearFieldError("vendorNumber");
                                       const value = e.target.value.replace(
                                          /[^0-9]/g,
                                          ""
                                       ); // Only allow numbers
                                       handleInputChange(
                                          payment.id,
                                          "vendorNumber",
                                          value
                                       );
                                    }}
                                    placeholder="Enter vendor number"
                                    disabled={!currentIsSubmitted}
                                    status={
                                       fieldErrors.vendorNumber
                                          ? "error"
                                          : undefined
                                    }
                                 />
                                 {fieldErrors.vendorNumber && (
                                    <div className="error-message">
                                       {fieldErrors.vendorNumber}
                                    </div>
                                 )}
                              </div>
                              <div className="form-group">
                                 <label className="sub-title">
                                    Voucher Number
                                 </label>
                                 <CustomPrefixInput
                                    name="voucherNumber"
                                    value={payment.voucherNumber}
                                    onChange={(e) => {
                                       clearFieldError("voucherNumber");
                                       const value = e.target.value.replace(
                                          /[^0-9]/g,
                                          ""
                                       ); // Only allow numbers
                                       handleInputChange(
                                          payment.id,
                                          "voucherNumber",
                                          value
                                       );
                                    }}
                                    placeholder="Enter voucher number"
                                    disabled={!currentIsSubmitted}
                                    status={
                                       fieldErrors.voucherNumber
                                          ? "error"
                                          : undefined
                                    }
                                 />
                                 {fieldErrors.voucherNumber && (
                                    <div className="error-message">
                                       {fieldErrors.voucherNumber}
                                    </div>
                                 )}
                              </div>
                              <div className="form-group">
                                 <label className="sub-title">
                                    Partial Pay Amount
                                 </label>
                                 <CustomPrefixInput
                                    name="partialPayAmount"
                                    value={payment.partialPayAmount}
                                    onChange={(e) => {
                                       clearFieldError("partialPayAmount");
                                       const value = e.target.value.replace(
                                          /[^0-9.]/g,
                                          ""
                                       ); // Only allow numbers and decimal point
                                       handleInputChange(
                                          payment.id,
                                          "partialPayAmount",
                                          value
                                       );
                                    }}
                                    onBlur={(e) => {
                                       const formatted = formatAmountValue(
                                          "Partial Pay Amount",
                                          e.target.value
                                       );
                                       if (formatted !== payment.partialPayAmount) {
                                          handleInputChange(
                                             payment.id,
                                             "partialPayAmount",
                                             formatted
                                          );
                                       }
                                    }}
                                    placeholder="Enter amount"
                                    disabled={true}
                                    status={
                                       fieldErrors.partialPayAmount
                                          ? "error"
                                          : undefined
                                    }
                                 />
                                 {fieldErrors.partialPayAmount && (
                                    <div className="error-message">
                                       {fieldErrors.partialPayAmount}
                                    </div>
                                 )}
                              </div>
                              <div className="form-group">
                                 <label className="sub-title">
                                    Override Discount Amount
                                 </label>
                                 <CustomPrefixInput
                                    name="overrideDiscountAmount"
                                    value={payment.overrideDiscountAmount}
                                    onChange={(e) => {
                                       clearFieldError(
                                          "overrideDiscountAmount"
                                       );
                                       const value = e.target.value.replace(
                                          /[^0-9.]/g,
                                          ""
                                       ); // Only allow numbers and decimal point
                                       handleInputChange(
                                          payment.id,
                                          "overrideDiscountAmount",
                                          value
                                       );
                                    }}
                                    onBlur={(e) => {
                                       const formatted = formatAmountValue(
                                          "Override Discount Amount",
                                          e.target.value
                                       );
                                       if (formatted !== payment.overrideDiscountAmount) {
                                          handleInputChange(
                                             payment.id,
                                             "overrideDiscountAmount",
                                             formatted
                                          );
                                       }
                                    }}
                                    placeholder="Enter override amount"
                                    disabled={!currentIsSubmitted}
                                    status={
                                       fieldErrors.overrideDiscountAmount
                                          ? "error"
                                          : undefined
                                    }
                                 />
                                 {fieldErrors.overrideDiscountAmount && (
                                    <div className="error-message">
                                       {fieldErrors.overrideDiscountAmount}
                                    </div>
                                 )}
                              </div>
                              <div className="form-group switch-group">
                                 <label className="sub-title">
                                    Forced Discount
                                 </label>
                                 <Switch
                                    checked={payment.forcedDiscount2}
                                    onChange={(checked) =>
                                       handleInputChange(
                                          payment.id,
                                          "forcedDiscount2",
                                          checked
                                       )
                                    }
                                    disabled={!currentIsSubmitted}
                                 />
                                 {fieldErrors.forcedDiscount2 && (
                                    <div className="error-message">
                                       {fieldErrors.forcedDiscount2}
                                    </div>
                                 )}
                              </div>
                              <div className="form-group">
                                 <label className="sub-title">Pay/ Hold</label>
                                 <CustomSelectDropdown
                                    name="payHold"
                                    options={payHoldOptionsData}
                                    value={
                                       payment.payHold === ""
                                          ? null
                                          : payment.payHold
                                    }
                                    onChange={(value) =>
                                       handleInputChange(
                                          payment.id,
                                          "payHold",
                                          value === null || value === undefined
                                             ? ""
                                             : value
                                       )
                                    }
                                    placeholder={
                                       isLoadingPayHoldOptions
                                          ? "Loading..."
                                          : "Select Pay/Hold"
                                    }
                                    disabled={
                                       !currentIsSubmitted ||
                                       isLoadingPayHoldOptions
                                    }
                                    allowClear={true}
                                 />
                                 {fieldErrors.payHold && (
                                    <div className="error-message">
                                       {fieldErrors.payHold}
                                    </div>
                                 )}
                              </div>
                              <div className="form-group">
                                 <label className="sub-title">
                                    Single Check
                                 </label>
                                 <CustomSelectDropdown
                                    name="singleCheck"
                                    options={singleCheckOptionsData}
                                    value={
                                       payment.singleCheck === ""
                                          ? null
                                          : payment.singleCheck
                                    }
                                    onChange={(value) =>
                                       handleInputChange(
                                          payment.id,
                                          "singleCheck",
                                          value === null || value === undefined
                                             ? ""
                                             : value
                                       )
                                    }
                                    placeholder={
                                       isLoadingSingleCheckOptions
                                          ? "Loading..."
                                          : "Select option"
                                    }
                                    disabled={
                                       !currentIsSubmitted ||
                                       isLoadingSingleCheckOptions
                                    }
                                    allowClear={true}
                                 />
                                 {fieldErrors.singleCheck && (
                                    <div className="error-message">
                                       {fieldErrors.singleCheck}
                                    </div>
                                 )}
                              </div>
                              <div className="form-group">
                                 <label className="sub-title">
                                    Make Prepaid
                                 </label>
                                 <CustomSelectDropdown
                                    name="makePrepaid"
                                    options={makePrepaidOptionsData}
                                    value={
                                       payment.makePrepaid === ""
                                          ? null
                                          : payment.makePrepaid
                                    }
                                    onChange={(value) =>
                                       handleInputChange(
                                          payment.id,
                                          "makePrepaid",
                                          value === null || value === undefined
                                             ? ""
                                             : value
                                       )
                                    }
                                    placeholder="Select option"
                                    disabled={!currentIsSubmitted}
                                    loading={isLoadingMakePrepaidOptions}
                                    allowClear={true}
                                 />
                                 {fieldErrors.makePrepaid && (
                                    <div className="error-message">
                                       {fieldErrors.makePrepaid}
                                    </div>
                                 )}
                              </div>
                              <div className="form-group">
                                 <label className="sub-title">
                                    Prepaid Check No
                                 </label>
                                 <CustomPrefixInput
                                    name="prepaidCheckNo"
                                    value={payment.prepaidCheckNo}
                                    onChange={(e) =>
                                       handleInputChange(
                                          payment.id,
                                          "prepaidCheckNo",
                                          e.target.value
                                       )
                                    }
                                    placeholder="Enter prepaid check no"
                                    disabled={!currentIsSubmitted}
                                 />
                                 {fieldErrors.prepaidCheckNo && (
                                    <div className="error-message">
                                       {fieldErrors.prepaidCheckNo}
                                    </div>
                                 )}
                              </div>
                              <div className="form-group">
                                 <label className="sub-title">Check Date</label>
                                 <CustomDatePicker
                                    name="checkDateVendor"
                                    value={payment.checkDateVendor}
                                    onChange={(_, value) => {
                                       clearFieldError("checkDateVendor");
                                       handleInputChange(
                                          payment.id,
                                          "checkDateVendor",
                                          value
                                       );
                                    }}
                                    disabled={!currentIsSubmitted}
                                    status={
                                       fieldErrors.checkDateVendor
                                          ? "error"
                                          : undefined
                                    }
                                 />
                                 {fieldErrors.checkDateVendor && (
                                    <div className="error-message">
                                       {fieldErrors.checkDateVendor}
                                    </div>
                                 )}
                              </div>
                           </div>
                           <div className="flex-end">
                              <ActionPermissionGuard actionId="payment-selection.save">
                                 <CustomStyledButton
                                    name={`save-${payment.id}`}
                                    label={
                                       paymentChanges[payment.id]
                                          ? payment.isSaved
                                             ? "Update*"
                                             : "Save"
                                          : payment.isSaved
                                          ? "Update"
                                          : "Save"
                                    }
                                    onClick={() => handleSavePayment(payment.id)}
                                    disabled={!currentIsSubmitted}
                                 />
                              </ActionPermissionGuard>
                           </div>
                        </div>
                     </Panel>
                  </Collapse>
               ))}
            </div>
         </div>

         {notification.visible && (
            <Toaster
               type={notification.type}
               title={notification.title}
               subtitle={notification.subtitle}
               onClose={() =>
                  setNotification((prev) => ({ ...prev, visible: false }))
               }
            />
         )}
      </div>
   );
};

export default PaymentForm;
