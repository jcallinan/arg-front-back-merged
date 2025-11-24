import { useEffect, useState, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Divider } from "antd";
import StepOneForm from "./forms/StepOneForm";
import StepTwoForm from "./forms/StepTwoForm";
import popupOk from "@assets/icons/popup-ok.svg";
import vendorIcon from "@assets/icons/vendor-icon.svg";
import entryNoIcon from "@assets/icons/entry-no-icon.svg";
import processTypeIcon from "@assets/icons/process-type-icon.svg";
import companyIcon from "@assets/icons/company-icon.svg";
import vendorNoIcon from "@assets/icons/vendor-no-icon.svg";
import warningIcon from "@assets/icons/warning-icon.svg";
import {
   formFieldsLabelsStepOne,
   formFieldLabelsStepTwo,
   voucherEntrySteps,
   vendorCardValues,
   vendorDetailsTitle,
   iconAltTexts,
   vendorCardLabels,
   buttonLabels,
   modalActions,
   holdVoucherDescriptions,
   stepOneRequiredFields,
   fieldMaxLengthMap,
   stepTwoFieldMaxLengthMap,
   stepTwoRequiredFields,
   labelMap,
   VoucherEntryTitle,
   disabledFields,
} from "@constants/commonConstants";
import VendorNumberName from "@shared-components/vendor-number-name/VendorNumberName";
import { CustomStyledButton } from "@widget-library/Buttons";
import ModalContent from "@widget-library/Modal";
import StepForm from "@widget-library/StepForm";
import Card from "@widget-library/Card";
import "./create-entry.scss";
import { useVoucherConfig, useSubmitVoucherHeader, useSubmitVoucher } from "@hooks/useNormalProcess";

import { formatNumber, formatNumberToMMDDYY, formatMMDDYYForDisplay } from "@utils/dateFormat";
import SpinLoader from "@widget-library/Loader";
import Toaster from "@widget-library/Toaster";
import { useQueryClient } from "@tanstack/react-query";
import {
   toNumberOrUndefined,
   toStringOrUndefined,
} from "@utils/dataTypeFormat";
import { formatAmountValue, formatCurrency } from "@utils/formatters";

const CreateNewEntry = () => {
   const location = useLocation();
   const navigate = useNavigate();
   const [current, setCurrent] = useState(0);
   const [isVisible, setIsVisible] = useState(false);
   const [selectedVendor, setSelectedVendor] = useState("");
   const [errors, setErrors] = useState<{ [key: string]: string }>({});
   const [headerWarnings, setHeaderWarnings] = useState<{ [key: string]: string }>({});
   const stepTwoValidationRef = useRef<{ clearErrors: () => void } | null>(null);
   const [lineItems, setLineItems] = useState<any[]>([]);
   const [isLoading, setIsLoading] = useState(false);
   const [originProcessType, setOriginProcessType] = useState<string>("NORMAL");
   const queryClient = useQueryClient();
   const [configResponse, setConfigResponse] = useState<any>(null);
   const [submittedEntryNo, setSubmittedEntryNo] = useState<number | null>(
      null
   );
   const [validatedHeader, setValidatedHeader] = useState<any>(null);
   const [lineItemErrors, setLineItemErrors] = useState<
      Record<number, Record<string, string>>
   >({});
   const [lineItemWarnings, setLineItemWarnings] = useState<
      Record<number, Record<string, string>>
   >({});
   const [toasterVisible, setToasterVisible] = useState(false);
   const [toasterTitle, setToasterTitle] = useState("");
   const [toasterSubtitle, setToasterSubtitle] = useState("");
   const [toasterType, setToasterType] = useState<
      "error" | "success" | "warning" | "batch"
   >("error");
   const [totals, setTotals] = useState({ product: 0, discount: 0, lineAmount: 0 });
   const [hasWarnings, setHasWarnings] = useState(false);
   const [hasSubmissionErrors, setHasSubmissionErrors] = useState(false);
   const [enabledFieldsByError, setEnabledFieldsByError] = useState<
      Set<string>
   >(new Set());
   const [apGlForcedEnabled, setApGlForcedEnabled] = useState(false);
   const [stepOneValidationErrors, setStepOneValidationErrors] = useState<{ [key: string]: string }>({});
   
   // Header validation warning modal state (reusing same modal structure as submit)
   const [showHeaderWarningModal, setShowHeaderWarningModal] = useState(false);
   const [pendingHeaderPayload, setPendingHeaderPayload] = useState<any>(null);
   
   // React Query hooks
   const voucherConfigMutation = useVoucherConfig();
   const submitVoucherHeaderMutation = useSubmitVoucherHeader();
   const submitVoucherMutation = useSubmitVoucher();

   const { mode, entryData, sourceTab } = location.state || {};

   // Calculate totals from API data in edit mode (initial load)
   const calculateTotalsFromApiData = useMemo(() => {
      if (mode === "edit" && entryData?.detailItems?.length > 0) {
         const apiTotals = entryData.detailItems.reduce(
            (acc: { product: number; discount: number; lineAmount: number }, item: any) => {
               const productAmt = parseFloat(
                  item.productAmount?.toString() || "0"
               );
               if (!isNaN(productAmt)) {
                  acc.product += productAmt;
               }
               
               const lineAmt = parseFloat(item.lineAmount?.toString() || "0");
               if (!isNaN(lineAmt)) {
                  acc.lineAmount += lineAmt;
               }

               // Handle discount calculation - prioritize percentage over amount (same logic as StepTwoForm)
               const discPerc = parseFloat(item.discountPercentage?.toString() || "");
               const discAmt = parseFloat(item.discountAmount?.toString() || "");

               if (!isNaN(discPerc) && discPerc !== 0) {
                  // Calculate discount from percentage
                  acc.discount += (productAmt * discPerc) / 100;

               } else if (!isNaN(discAmt)) {
                  // Use direct discount amount
                  acc.discount += discAmt;
               }

               return acc;
            },
            { product: 0, discount: 0, lineAmount: 0 }
         );

         return apiTotals;
      }
      return { product: 0, discount: 0, lineAmount: 0 };
   }, [mode, entryData?.detailItems]);

   // Calculate live totals from current lineItems state (used when user edits in Step Two)
   const totalsFromLineItems = useMemo(() => {
      if (!Array.isArray(lineItems) || lineItems.length === 0) {
         return { product: 0, discount: 0, lineAmount: 0 };
      }
      return lineItems.reduce(
         (acc: { product: number; discount: number; lineAmount: number }, item: any) => {
            const productAmt = parseFloat(
               (item?.data?.["Product Amount"] || "0").replace(/,/g, "")
            );
            if (!isNaN(productAmt)) {
               acc.product += productAmt;
            }

            const freightAmt = parseFloat(
               (item?.data?.["Freight Amount"] || "0").replace(/,/g, "")
            );
            
            // Calculate line amount (product + freight)
            const lineAmt = productAmt + (isNaN(freightAmt) ? 0 : freightAmt);
            if (!isNaN(lineAmt)) {
               acc.lineAmount += lineAmt;
            }

            // Handle discount calculation - prioritize percentage over amount (same logic as StepTwoForm)
            const discPerc = parseFloat(item?.data?.["Line Disc %"] || "");
            const discAmtRaw = (item?.data?.["Line Disc Amount"] || "").replace(/,/g, "");
            const discAmt = discAmtRaw ? parseFloat(discAmtRaw) : NaN;

            if (!isNaN(discPerc) && discPerc !== 0) {
               // Calculate discount from percentage
               acc.discount += (productAmt * discPerc) / 100;
            } else if (!isNaN(discAmt)) {
               // Use direct discount amount
               acc.discount += discAmt;
            }

            return acc;
         },
         { product: 0, discount: 0, lineAmount: 0 }
      );
   }, [lineItems]);

   // Display logic: prefer live totals from lineItems when present; otherwise use API totals in edit mode; else component totals
   const displayTotals =
      Array.isArray(lineItems) && lineItems.length > 0
         ? totalsFromLineItems
         : mode === "edit"
         ? calculateTotalsFromApiData
         : totals;

   const blankHeader: any = [
      ...formFieldsLabelsStepOne,
      ...formFieldLabelsStepTwo,
   ].reduce((acc, key) => ({ ...acc, [key]: "" }), {});
   const mapEntryToFormData = (row: any): Record<string, string> => ({
      "Vendor No": row?.vendorNo?.toString() || "",
      "Company No": row?.companyNo?.toString() || "",
      "Invoice No": row?.invoiceNo?.toString() || "",
      "Invoice Amount": row?.invoiceAmount?.toString() || "",
      Freight: row?.freightAmount?.toString() || "",
      "Invoice Date": formatMMDDYYForDisplay(row?.invoiceDate) || "",
      "Due Date": formatMMDDYYForDisplay(row?.dueDate) || "",
      "Discount Due Date": formatMMDDYYForDisplay(row?.discountDueDate) || "",
      "Hold Voucher": row?.holdCode || "",
      "Hold Description": row?.holdDesc || "",
      "Process Type": row?.processType || "NORMAL",
      "Account Pay G/L Description":
         toStringOrUndefined(row?.companyApGlDesc)?.trim() || "",
      "Bank Acct G/L Description":
         toStringOrUndefined(row?.companyBankGlDesc)?.trim() || "",
   });
   useEffect(() => {
      if (mode === "edit" && entryData) {
         const {
            headerItem,
            detailItems,
            validationMessages,
            warnings,
            errors,
         } = entryData;

         setSelectedVendor(headerItem?.vendorNo?.toString() || "");

         setFormData((prev) => ({
            ...prev,
            ...mapEntryToFormData(headerItem),
            "Entry No": headerItem?.entryNo?.toString() || "",
            "Vendor No": headerItem?.vendorNo?.toString() || "",
            "Company No": headerItem?.companyNo?.toString() || "",
            "Account Pay G/L": headerItem?.apGlNo?.toString() || "",
            "Bank Acct G/L": headerItem?.bankGl?.toString() || "",
            "Invoice Description": headerItem?.invoiceDesc || "",
            Retention: headerItem?.retentionGl?.toString() || "",
            "Single Check": headerItem?.singleCheck || "",
            "Sales Order": headerItem?.salesOrderNo?.toString() || "",
            SRN: headerItem?.srn?.toString() || "",
            "Prepaid Voucher": headerItem?.prepaidCode || "",
            "Prepaid Check No": headerItem?.prepaidCheckNo?.toString() || "",
            "Check Date": headerItem?.prepaidCheckdate?.toString() || "",
            "Invoice Amount": formatAmountValue(
               "Invoice Amount",
               headerItem?.invoiceAmount?.toString() || ""
            ),
            Freight: formatAmountValue(
               "Freight",
               headerItem?.totalFreight?.toString() || ""
            ),
         }));

         // Map API response to line items and store locally
         const mappedLineItems = detailItems.map(
            (item: any, index: number) => ({
               id: item.entrySequence || index + 1,
               entrySequence: item.entrySequence || index + 1,
               data: {
                  "Line G/L Account": item.lineGlNo?.toString() || "",
                  "Line Description": item.lineDesc || "",
                  "Line Amount": item.lineAmount?.toString() || "",
                  "Line Disc Amount": item.discountAmount?.toString() || "",
                  "Line Disc %": item.discountPercentage?.toString() || "",
                  Quantity: item.quantity?.toString() || "",
                  "Job Cost Quantity": item.jobCostQuantity?.toString() || "",
                  Gallons: item.gallons?.toString() || "",
                  "Receipt No": item.receiptNo?.toString() || "",
                  Status: item.openClosed || "",
                  "PO Line #": item.poLineNo?.toString() || "",
                  "Product Amount": item.productAmount?.toString() || "",
                  "Freight Amount": item.freightAmount?.toString() || "",
                  "PO No": item.poNo?.toString() || "",
                  "Line G/L Description":
                     toStringOrUndefined(item.description)?.trim() || "",
               },
            })
         );

         setLineItems(mappedLineItems);
         setValidatedHeader(headerItem);

         // Handle warnings for flexi and sogas processes in edit mode

         // Handle warnings for flexi and sogas processes in edit mode
         if (
            headerItem?.processType === "FLEXI" ||
            headerItem?.processType === "SOGAS"
         ) {
            // Initialize warnings object
            const newLineItemWarnings: Record<
               number,
               Record<string, string>
            > = {};

            if (
               warnings &&
               warnings.details &&
               Array.isArray(warnings.details)
            ) {
               const warningLabelMap: Record<string, string> = {
                  receiptNo: "Receipt No",
                  gallons: "Gallons",
                  lineGlNo: "Line G/L Account",
                  lineDesc: "Line Description",
                  lineAmount: "Line Amount",
                  discountAmount: "Line Disc Amount",
                  discountPercentage: "Line Disc %",
                  quantity: "Quantity",
                  jobCostQuantity: "Job Cost Quantity",
                  poLineNo: "PO Line #",
                  productAmount: "Product Amount",
                  poNo: "PO No",
                  discountDueDate: "Discount Due Date",
               };

               warnings.details.forEach((warning: any, index: number) => {
                  const field = warning.field;
                  const message = warning.message;
                  const id = warning.id;

                  if (field && message && id) {
                     const label = warningLabelMap[field] || field;
                     
                     // Handle header-level warnings (like discount due date)
                     if (id === "header") {
                        setHeaderWarnings(prev => ({
                           ...prev,
                           [label]: message
                        }));
                     } else {
                        // Handle line item warnings
                        const numericId = Number(id);

                        // Find the matching line item in the mapped items
                        const matchedItem = mappedLineItems.find(
                           (item: any) => item.entrySequence === numericId
                        );

                        if (matchedItem) {
                           // Use the item's id as the key (which should be the entrySequence)
                           const key = matchedItem.id;
                           if (!newLineItemWarnings[key]) {
                              newLineItemWarnings[key] = {};
                           }
                           newLineItemWarnings[key][label] = message;
                        } else {
                           console.warn(
                              `No matching line item found for warning ID ${id}`
                           );
                        }
                     }
                  } else {
                     console.warn(
                        `⚠️ Skipping warning ${
                           index + 1
                        } - missing required data:`,
                        {
                           hasField: !!field,
                           hasMessage: !!message,
                           hasId: !!id,
                        }
                     );
                  }
               });
            } else {
            }

            // Handle errors and validation messages for flexi and sogas processes
            const newLineItemErrors: Record<
               number,
               Record<string, string>
            > = {};
            const newFormErrors: { [key: string]: string } = {};

            const fieldLabelMap: Record<string, string> = {
               // Header field mappings
               invoiceNo: "Invoice No",
               invoiceDate: "Invoice Date",
               dueDate: "Due Date",
               discountDueDate: "Discount Due Date",
               invoiceAmount: "Invoice Amount",
               apGlNo: "Account Pay G/L",
               bankGl: "Bank Acct G/L",
               invoiceDesc: "Invoice Description",
               retentionGl: "Retention",
               singleCheck: "Single Check",
               holdCode: "Hold Voucher",
               holdDesc: "Hold Description",
               salesOrderNo: "Sales Order",
               srn: "SRN",
               companyNo: "Company No",
               vendorNo: "Vendor No",
               processType: "Process Type",
               prepaidCode: "Prepaid Code",
               prepaidCheckNo: "Prepaid Check No",
               prepaidCheckdate: "Check Date",
               // Line item field mappings
               receiptNo: "Receipt No",
               gallons: "Gallons",
               lineGlNo: "Line G/L Account",
               lineDesc: "Line Description",
               lineAmount: "Line Amount",
               discountAmount: "Line Disc Amount",
               discountPercentage: "Line Disc %",
               quantity: "Quantity",
               jobCostQuantity: "Job Cost Quantity",
               poLineNo: "PO Line #",
               productAmount: "Product Amount",
               poNo: "PO No",
            };

            // Process errors from errors.details (errors have priority over warnings)
            if (errors && errors.details && Array.isArray(errors.details)) {
               errors.details.forEach((error: any, _index: number) => {
                  const field = error.field;
                  const message = error.message;
                  const id = error.id;

                  if (field && message) {
                     const label = fieldLabelMap[field] || field;

                     if (id) {
                        // Line item error
                        const numericId = Number(id);
                        const matchedItem = mappedLineItems.find(
                           (item: any) => item.entrySequence === numericId
                        );

                        if (matchedItem) {
                           const key = matchedItem.id;
                           const seqKey = matchedItem.entrySequence ?? key;
                           if (!newLineItemErrors[key]) {
                              newLineItemErrors[key] = {};
                           }
                           if (!newLineItemErrors[seqKey]) {
                              newLineItemErrors[seqKey] = {};
                           }
                           newLineItemErrors[key][label] = message;
                           newLineItemErrors[seqKey][label] = message;
                        } else {
                           // Fallback: if no match, apply error across all items
                           if (mappedLineItems.length === 0) {
                              newLineItemErrors[1] = newLineItemErrors[1] || {};
                              newLineItemErrors[1][label] = message;
                           } else {
                              mappedLineItems.forEach((it: any) => {
                                 const key = it.id ?? it.entrySequence;
                                 const seqKey = it.entrySequence ?? key;
                                 if (!newLineItemErrors[key]) {
                                    newLineItemErrors[key] = {};
                                 }
                                 if (!newLineItemErrors[seqKey]) {
                                    newLineItemErrors[seqKey] = {};
                                 }
                                 newLineItemErrors[key][label] = message;
                                 newLineItemErrors[seqKey][label] = message;
                              });
                           }
                        }
                     } else {
                        // Header error
                        newFormErrors[label] = message;
                     }
                  }
               });
            }

            // Process validation messages (legacy)
            if (validationMessages && Array.isArray(validationMessages)) {
               validationMessages.forEach((validationMessage) => {
                  const field =
                     validationMessage.code || validationMessage.field;
                  const message = validationMessage.message;

                  if (field && message) {
                     const formFieldLabel = fieldLabelMap[field] || field;
                     newFormErrors[formFieldLabel] = message;
                  }
               });
            }

            // Set both errors and warnings simultaneously without priority filtering
            setLineItemErrors(newLineItemErrors);
            setLineItemWarnings(newLineItemWarnings); // Keep all warnings
            setErrors(newFormErrors);

            // Ensure disabled fields with errors are enabled for editing
            const initEnabled = new Set(enabledFieldsByError);
            Object.keys(newFormErrors).forEach((field) => {
               if (disabledFields.includes(field)) {
                  initEnabled.add(field);
               }
               // Special handling for Vendor No field - enable it on validation error
               if (field === "Vendor No") {
                  initEnabled.add(field);
               }
            });
            setEnabledFieldsByError(initEnabled);

            // Update hasWarnings state based on all warnings
            const totalWarnings = Object.keys(newLineItemWarnings).reduce(
               (count, lineKey) => {
                  return (
                     count +
                     Object.keys(newLineItemWarnings[Number(lineKey)]).length
                  );
               },
               0
            );
            setHasWarnings(totalWarnings > 0);

            // Note: Both errors and warnings display simultaneously for all fields
         }

         // Additional safety: map line-item errors from API regardless of process type
         // This is additive and keeps existing logic untouched
         // Skip this section for FLEXI/SOGAS as they are already handled above
         if (
            headerItem?.processType !== "FLEXI" &&
            headerItem?.processType !== "SOGAS"
         ) {
            try {
               const apiErrors = entryData?.errors;
               const apiDetails = apiErrors?.details;
               if (
                  Array.isArray(apiDetails) &&
                  detailItems &&
                  detailItems.length
               ) {
                  const fieldLabelMapExtra: Record<string, string> = {
                     receiptNo: "Receipt No",
                     gallons: "Gallons",
                     lineGlNo: "Line G/L Account",
                     lineDesc: "Line Description",
                     lineAmount: "Line Amount",
                     discountAmount: "Line Disc Amount",
                     discountPercentage: "Line Disc %",
                     quantity: "Quantity",
                     jobCostQuantity: "Job Cost Quantity",
                     poLineNo: "PO Line #",
                     productAmount: "Product Amount",
                     poNo: "PO No",
                  };

                  const mappedLineItemsLocal = detailItems.map(
                     (item: any, index: number) => ({
                        id: item.entrySequence || index + 1,
                        entrySequence: item.entrySequence || index + 1,
                     })
                  );

                  const extraLineItemErrors: Record<
                     number,
                     Record<string, string>
                  > = {};

                  apiDetails.forEach((errObj: any) => {
                     const label =
                        fieldLabelMapExtra[errObj.field] || errObj.field;
                     const idVal = Number(errObj.id);
                     if (label && !Number.isNaN(idVal)) {
                        const matched = mappedLineItemsLocal.find(
                           (it: any) => it.entrySequence === idVal
                        );
                        if (matched) {
                           const key = matched.id;
                           const seqKey = matched.entrySequence ?? key;
                           if (!extraLineItemErrors[key])
                              extraLineItemErrors[key] = {};
                           if (!extraLineItemErrors[seqKey])
                              extraLineItemErrors[seqKey] = {};
                           extraLineItemErrors[key][label] = errObj.message;
                           extraLineItemErrors[seqKey][label] = errObj.message;
                        } else {
                           // Fallback: apply to all
                           mappedLineItemsLocal.forEach((it: any) => {
                              const key = it.id ?? it.entrySequence;
                              const seqKey = it.entrySequence ?? key;
                              if (!extraLineItemErrors[key])
                                 extraLineItemErrors[key] = {};
                              if (!extraLineItemErrors[seqKey])
                                 extraLineItemErrors[seqKey] = {};
                              extraLineItemErrors[key][label] = errObj.message;
                              extraLineItemErrors[seqKey][label] =
                                 errObj.message;
                           });
                        }
                     }
                  });

                  // Merge into existing line item errors without overwriting existing fields
                  setLineItemErrors((prev) => {
                     const merged: Record<number, Record<string, string>> = {
                        ...prev,
                     };
                     Object.entries(extraLineItemErrors).forEach(([k, v]) => {
                        const nk = Number(k);
                        merged[nk] = merged[nk] || {};
                        Object.entries(v).forEach(([fld, msg]) => {
                           if (!merged[nk][fld])
                              merged[nk][fld] = msg as string;
                        });
                     });
                     return merged;
                  });
               }
            } catch {}
         }
      }
   }, [mode, entryData]);
   const [formData, setFormData] = useState<{ [key: string]: string }>(() =>
      mode === "edit" && entryData
         ? { ...blankHeader, ...mapEntryToFormData(entryData) }
         : blankHeader
   );

   useEffect(() => {
      if (errors && errors["Account Pay G/L"]) {
         setApGlForcedEnabled(true);
      }
   }, [errors]);
   useEffect(() => {
      if (location.state?.processType) {
         setOriginProcessType(location.state.processType);
         return;
      }
      if (mode === "edit" && entryData?.headerItem?.processType) {
         setOriginProcessType(entryData.headerItem.processType);
         return;
      }

      if (formData["Process Type"]) {
         setOriginProcessType(formData["Process Type"]);
         return;
      }

      setOriginProcessType("NORMAL");
   }, [location, mode, entryData, formData]);

   const validateFormLocally = (step: number) => {
      const newErrors: { [key: string]: string } = {};
      const newLineItemErrors: Record<number, Record<string, string>> = {};

      if (step === 0) {
         // Check for validation errors from StepOneForm (excluding invoice number since it auto-converts)
         if (Object.keys(stepOneValidationErrors).length > 0) {
            Object.entries(stepOneValidationErrors).forEach(([field, error]) => {
               // Skip invoice number validation errors since we auto-convert to uppercase
               if (field !== "Invoice No") {
                  newErrors[field] = error;
               }
            });
         }
         // Base required fields
         stepOneRequiredFields.forEach((field) => {
            const fieldValue = formData[field];
            let isEmpty = false;
            
            if (field === "Invoice Date") {
               isEmpty = !fieldValue || fieldValue.trim() === "" || fieldValue === "0";
            } else {
               isEmpty = !fieldValue;
            }
            
            if (isEmpty) {
               const displayLabel = labelMap[field] || field;
               newErrors[
                  field
               ] = `${displayLabel.toUpperCase()} MAY NOT BE BLANK`;
            }
         });

         // Prepaid Voucher-related checks - only validate if Prepaid Voucher is selected
         if (
            formData["Prepaid Voucher"] &&
            formData["Prepaid Voucher"] !== ""
         ) {
            ["Prepaid Check No", "Check Date"].forEach((field) => {
               // For Check Date, also treat "0" as empty/invalid
               const isEmpty =
                  field === "Check Date"
                     ? !formData[field] || formData[field] === "0"
                     : !formData[field];

               if (isEmpty) {
                  const displayLabel = labelMap[field] || field;
                  newErrors[
                     field
                  ] = `${displayLabel.toUpperCase()} MAY NOT BE BLANK`;
               }
            });

            const prepaidCheckNo = parseFloat(formData["Prepaid Check No"]);
            if (
               formData["Prepaid Check No"] &&
               (isNaN(prepaidCheckNo) || prepaidCheckNo === 0)
            ) {
               newErrors["Prepaid Check No"] =
                  "INVALID INVENTORY ITEM NUMBER ENTERED";
            }
         }

         // Invoice amount validation
         if (formData["Invoice Amount"]) {
            const invoiceAmount = parseFloat(formData["Invoice Amount"]);
            if (invoiceAmount === 0) {
               newErrors["Invoice Amount"] =
                  "TOTAL INVOICE AMOUNT MAY NOT BE ZERO";
            }
         }

      } else if (step === 1) {
         lineItems.forEach((item) => {
            const id = item.id;
            stepTwoRequiredFields.forEach((field) => {
               // If header Freight is entered, Product Amount is not required
               if (field === "Product Amount") {
                  const headerFreight = parseFloat((formData["Freight"] || "0").replace(/,/g, ""));
                  if (headerFreight && headerFreight !== 0) {
                     return; // skip Product Amount requirement
                  }
               }
               if (!item.data[field]) {
                  if (!newLineItemErrors[id]) {
                     newLineItemErrors[id] = {};
                  }
                  const displayLabel = labelMap[field] || field;
                  newLineItemErrors[id][
                     field
                  ] = `${displayLabel.toUpperCase()} MAY NOT BE BLANK`;
               }
            });

            // If gallons is non-zero, make receipt number required
            const gallons = parseFloat(item.data["Gallons"]) || 0;
            const receiptNo = item.data["Receipt No"];

            if (gallons !== 0 && (!receiptNo || receiptNo.trim() === "")) {
               if (!newLineItemErrors[id]) {
                  newLineItemErrors[id] = {};
               }
               newLineItemErrors[id]["Receipt No"] = "RECEIPT NO IS REQUIRED";
            }
         });
      }

      setErrors(newErrors);

      // Keep disabled fields enabled when they have errors (until successful submit)
      const updatedEnabled = new Set(enabledFieldsByError);
      Object.keys(newErrors).forEach((field) => {
         if (disabledFields.includes(field)) {
            updatedEnabled.add(field);
         }
         // Special handling for Vendor No field - enable it on validation error
         if (field === "Vendor No") {
            updatedEnabled.add(field);
         }
      });
      setEnabledFieldsByError(updatedEnabled);

      // Only update line item errors if we're validating step 1 (step === 1)
      // This prevents clearing API errors when validating step 0
      if (step === 1) {
         setLineItemErrors(newLineItemErrors);
      }

      if (
         Object.keys(newErrors).length > 0 ||
         (step === 1 && Object.keys(newLineItemErrors).length > 0)
      ) {
         setToasterType("error");
         setToasterTitle("Validation Error");

         // Create more specific message for prepaid voucher validation
         const missingPrepaidFields = [];
         if (
            formData["Prepaid Voucher"] &&
            formData["Prepaid Voucher"] !== ""
         ) {
            if (!formData["Prepaid Check No"])
               missingPrepaidFields.push("Prepaid Check No");
            if (!formData["Check Date"] || formData["Check Date"] === "0")
               missingPrepaidFields.push("Check Date");
         }

         let description = "Please fill in all required fields.";
         if (missingPrepaidFields.length > 0) {
            description = `Prepaid voucher requires: ${missingPrepaidFields.join(
               " and "
            )}.`;
         }

         setToasterSubtitle(description);
         setToasterVisible(true);
         return false;
      }

      return true;
   };

   const handleInputBlur = (key: string, _value: string) => {
      const newErrors = { ...errors };
      if (newErrors[key]) {
         delete newErrors[key];
         setErrors(newErrors);
      }
   };

   const handleInputChange = (key: string, value: string) => {
      const maxLength = fieldMaxLengthMap[key];
      const newErrors = { ...errors };

      if (maxLength && value.length > maxLength) {
         newErrors[key] = `${key} cannot exceed ${maxLength} characters`;
         setErrors(newErrors);
         return;
      } else if (key === "Invoice Amount") {
         const numValue = parseFloat(value);
         if (numValue === 0) {
            newErrors[key] = "TOTAL INVOICE AMOUNT MAY NOT BE ZERO";
         } else {
            delete newErrors[key];
         }
      } else if (key === "Freight") {
         delete newErrors[key];
      } else if (key === "Prepaid Check No") {
         // Only validate Prepaid Check No if Prepaid Voucher is selected
         if (
            formData["Prepaid Voucher"] &&
            formData["Prepaid Voucher"] !== ""
         ) {
            const numValue = parseFloat(value);
            if (value && (isNaN(numValue) || numValue === 0)) {
               newErrors[key] = "INVALID INVENTORY ITEM NUMBER ENTERED";
            } else {
               delete newErrors[key];
            }
         } else {
            // If Prepaid Voucher is not selected, don't validate and clear any error
            delete newErrors[key];
         }
      } else if (key === "Check Date") {
         // Only validate Check Date if Prepaid Voucher is selected
         if (
            formData["Prepaid Voucher"] &&
            formData["Prepaid Voucher"] !== ""
         ) {
            // Don't show error immediately when field becomes enabled
            // Only validate on blur or form submission
            delete newErrors[key];
         } else {
            // If Prepaid Voucher is not selected, don't validate and clear any error
            delete newErrors[key];
         }
      } else if (key === "Invoice Date") {
         
         delete newErrors[key];
      } else {
         delete newErrors[key];
      }

      // Update form data first
      setFormData((prev) => {
         const newFormData = { ...prev, [key]: value };
         return newFormData;
      });

      // Special handling for Prepaid Voucher selection
      if (key === "Prepaid Voucher") {
         if (value && value !== "") {
            // When prepaid voucher is selected, clear any existing errors for prepaid fields
            // This prevents immediate validation errors when fields become enabled
            delete newErrors["Prepaid Check No"];
            delete newErrors["Check Date"];
         } else {
            // When prepaid voucher is deselected, clear prepaid field values and errors
            delete newErrors["Prepaid Check No"];
            delete newErrors["Check Date"];
            // Also clear the field values when prepaid voucher is deselected
            setFormData((prev) => ({
               ...prev,
               "Prepaid Check No": "",
               "Check Date": "",
            }));
         }
      }
      setErrors(newErrors);
      if (newErrors.general) {
         setToasterType("error");
         setToasterTitle("Validation Error");
         setToasterSubtitle(newErrors.general);
         setToasterVisible(true);
      }
   };

   const next = async () => {
      if (!validateFormLocally(current)) return;

      if (current === 0) {
         setIsLoading(true);

         // Base payload with required fields
         const payload: any = {
            invoiceNo: toStringOrUndefined(formData["Invoice No"]),
            invoiceDate: formatNumberToMMDDYY(formData["Invoice Date"])!,
            invoiceAmount: toNumberOrUndefined(formData["Invoice Amount"])!,
            totalFreight: toNumberOrUndefined(formData["Freight"]) || 0,
            apGlNo: toNumberOrUndefined(formData["Account Pay G/L"])!,
            bankGl: toNumberOrUndefined(formData["Bank Acct G/L"])!,
            invoiceDesc: toStringOrUndefined(formData["Invoice Description"]),
            retentionGl: toNumberOrUndefined(formData["Retention"]),
            singleCheck: toStringOrUndefined(formData["Single Check"]),
            holdCode: toStringOrUndefined(formData["Hold Voucher"]),
            holdDesc: toStringOrUndefined(formData["Hold Description"]),
            salesOrderNo: toNumberOrUndefined(formData["Sales Order"]),
            srn: toNumberOrUndefined(formData["SRN"]),
            companyNo: Number(formData["Company No"] || 10),
            entryNo: Number(formData["Entry No"] || 0),
            vendorNo: toNumberOrUndefined(formData["Vendor No"])!,
            processType:
               toStringOrUndefined(formData["Process Type"]) || "NORMAL",
            prepaidCode: toStringOrUndefined(formData["Prepaid Voucher"]),
            prepaidCheckNo: toNumberOrUndefined(formData["Prepaid Check No"]),
         };

         // Helper to check if a date is empty/default/zero
         const isEmptyOrDefaultDate = (value: string | undefined): boolean => {
            if (!value || !value.trim()) return true;

            const date = value.trim();
            return (
               date === "0" ||
               date === "00/00/00" ||
               date === "01/01/00" ||
               date === "01/01/99" ||
               date === "1/1/00" ||
               date === "1/1/99" ||
               date === "010100" ||
               date === "010199" ||
               date === "000000"
            );
         };

         // In edit mode, don't send date fields if they are empty/zero
         if (mode === "edit") {
            // For Due Date - don't send if empty/zero
            const dueDate = formData["Due Date"];
            if (!isEmptyOrDefaultDate(dueDate)) {
               payload.dueDate = formatNumberToMMDDYY(dueDate);
            }

            // For Discount Due Date - don't send if empty/zero
            const discountDueDate = formData["Discount Due Date"];
            if (!isEmptyOrDefaultDate(discountDueDate)) {
               payload.discountDueDate = formatNumberToMMDDYY(discountDueDate);
            }

            // For Check Date - don't send if empty/zero
            const checkDate = formData["Check Date"];
            if (!isEmptyOrDefaultDate(checkDate)) {
               payload.prepaidCheckdate = formatNumberToMMDDYY(checkDate);
            }
         } else {
            // In create mode, include all dates (existing behavior preserved)
            const dueDate = formData["Due Date"];
            const discountDueDate = formData["Discount Due Date"];
            const checkDate = formData["Check Date"];

            // Always include dueDate in create mode (even if empty)
            payload.dueDate = formatNumberToMMDDYY(dueDate);

            // Only include non-empty, non-default dates for optional fields
            if (!isEmptyOrDefaultDate(discountDueDate)) {
               payload.discountDueDate =
                  formatNumberToMMDDYY(discountDueDate) || "0";
            }
            if (!isEmptyOrDefaultDate(checkDate)) {
               payload.prepaidCheckdate =
                  formatNumberToMMDDYY(checkDate) || "0";
            }
         }

         try {
            // Use React Query hook with exact same payload
            const response = await submitVoucherHeaderMutation.mutateAsync(payload);

           
            
            // Extract JSON data from Response object if needed
            let responseData;
            if (response instanceof Response) {
               // If it's a Response object, we need to parse the JSON
               const responseText = await response.text();
           
               
               try {
                  responseData = JSON.parse(responseText);
                
               } catch (parseError) {
                  console.error('❌ Failed to parse response JSON:', parseError);
                  responseData = null;
               }
            } else {
               // If it's already parsed data
               responseData = (response as any)?.data || response;
             
            }
            
            // Check for warnings in the response
            let warnings = null;
            if (responseData) {
               warnings = responseData?.items?.warnings || responseData?.warnings;
              
            }
            
            if (warnings && Array.isArray(warnings) && warnings.length > 0) {
             
               // Handle header validation warnings using same modal structure as submit
               const newHeaderWarnings: { [key: string]: string } = {};
               
               const labelMap: Record<string, string> = {
                  invoiceNo: "Invoice No",
                  invoiceDate: "Invoice Date",
                  dueDate: "Due Date",
                  discountDueDate: "Discount Due Date",
                  invoiceAmount: "Invoice Amount",
                  apGlNo: "Account Pay G/L",
                  bankGl: "Bank Acct G/L",
                  invoiceDesc: "Invoice Description",
                  retentionGl: "Retention",
                  singleCheck: "Single Check",
                  holdCode: "Hold Voucher",
                  holdDesc: "Hold Description",
                  salesOrderNo: "Sales Order",
                  srn: "SRN",
                  companyNo: "Company No",
                  vendorNo: "Vendor No",
                  processType: "Process Type",
                  prepaidCode: "Prepaid Code",
                  prepaidCheckNo: "Prepaid Check No",
                  prepaidCheckdate: "Check Date",
               };

               warnings.forEach((warning: any) => {
                  const field = warning.field;
                  const message = warning.message;
                  const formFieldLabel = labelMap[field] || field;
                  newHeaderWarnings[formFieldLabel] = message;
               });
               
               // Store the warnings and payload for potential continuation
               setHeaderWarnings(newHeaderWarnings);
               setPendingHeaderPayload(payload);
               setShowHeaderWarningModal(true);
               setIsLoading(false);
               return; // Don't proceed to next step yet
            }

            // No warnings - proceed normally
            setValidatedHeader(payload);
            setIsLoading(false);

            if (current < voucherEntrySteps.length - 1) {
               setCurrent((prev) => prev + 1);
               setErrors({});
               // Clear enabled fields on successful validation
               setEnabledFieldsByError(new Set());
               // Don't clear lineItems when moving to step 2 - preserve existing data
            }
         } catch (err) {
            setIsLoading(false);

            let newErrors: Record<string, string> = {};

            if (err instanceof Response) {
               try {
                  const errorJson = await err.json();
                  const errorDetails = errorJson?.error?.details as
                     | { field: string; message: string }[]
                     | undefined;

                  if (Array.isArray(errorDetails)) {
                     const labelMap: Record<string, string> = {
                        invoiceNo: "Invoice No",
                        invoiceDate: "Invoice Date",
                        dueDate: "Due Date",
                        discountDueDate: "Discount Due Date",
                        invoiceAmount: "Invoice Amount",
                        apGlNo: "Account Pay G/L",
                        bankGl: "Bank Acct G/L",
                        invoiceDesc: "Invoice Description",
                        retentionGl: "Retention",
                        singleCheck: "Single Check",
                        holdCode: "Hold Voucher",
                        holdDesc: "Hold Description",
                        salesOrderNo: "Sales Order",
                        srn: "SRN",
                        companyNo: "Company No",
                        vendorNo: "Vendor No",
                        processType: "Process Type",
                        prepaidCode: "Prepaid Code",
                        prepaidCheckNo: "Prepaid Check No",
                        prepaidCheckdate: "Check Date",
                     };

                     errorDetails.forEach(({ field, message }) => {
                        const formFieldLabel = labelMap[field] || field;
                        newErrors[formFieldLabel] = message;
                     });
                  } else {
                     newErrors = {
                        general:
                           errorJson?.error?.message ||
                           errorJson?.message ||
                           "Validation error occurred. Cannot continue.",
                     };
                  }
               } catch {
                  newErrors = {
                     general: "Unexpected error occurred. Please try again.",
                  };
               }
            } else if ((err as any)?.response instanceof Response) {
               const rawResponse = (err as any).response;

               try {
                  const errorJson = await rawResponse.json();
                  const errorDetails = errorJson?.error?.details;

                  if (Array.isArray(errorDetails)) {
                     errorDetails.forEach(({ field, message }) => {
                        const formFieldLabel = labelMap[field] || field;
                        newErrors[formFieldLabel] = message;
                     });
                  } else {
                     newErrors = {
                        general:
                           errorJson?.error?.message ||
                           errorJson?.message ||
                           "Validation error occurred. Cannot continue.",
                     };
                  }
               } catch {
                  newErrors = {
                     general: "Unexpected error occurred (nested).",
                  };
               }
            } else if (err instanceof Error) {
               newErrors = { general: err.message };
            } else {
               newErrors = { general: "Something went wrong." };
            }

            // Track fields that should be enabled due to errors
            const newEnabledFields = new Set(enabledFieldsByError);
            Object.keys(newErrors).forEach((field) => {
               if (disabledFields.includes(field)) {
                  newEnabledFields.add(field);
               }
               // Special handling for Vendor No field - enable it on validation error
               if (field === "Vendor No") {
                  newEnabledFields.add(field);
               }
            });
            setEnabledFieldsByError(newEnabledFields);

            setErrors(newErrors);
            if (newErrors.general) {
               setToasterType("error");
               setToasterTitle("Validation Error");
               setToasterSubtitle(newErrors.general);
               setToasterVisible(true);
            }
            return;
         }
      }
   };

   const prev = () => current > 0 && setCurrent((prev) => prev - 1);

   const handleSubmit = async () => {
      // Clear step two validation errors before submission (no re-renders)
      if (stepTwoValidationRef.current) {
         stepTwoValidationRef.current.clearErrors();
      }
      
      if (!validateFormLocally(current)) return;

      if (!validatedHeader) {
         setErrors({ general: "Header payload is missing." });
         setToasterType("error");
         setToasterTitle("Submission Error");
         setToasterSubtitle("Header payload is missing.");
         setToasterVisible(true);
         return;
      }

      const details = lineItems.map((item, index) => {
         const d = item.data;
         const productAmt = formatNumber(d["Product Amount"]) || 0;
         const freightAmt = formatNumber(d["Freight Amount"]) || 0;
         
         return {
            companyNo: validatedHeader.companyNo,
            lineCaompanyNo: validatedHeader.companyNo,
            lineGlNo: formatNumber(d["Line G/L Account"]) || 0,
            lineDesc: d["Line Description"]?.trim() || "",
            lineAmount: productAmt + freightAmt, 
            discountAmount: formatNumber(d["Line Disc Amount"]) || 0,
            discountPercentage: formatNumber(d["Line Disc %"]) || 0,
            quantity: formatNumber(d["Quantity"]) || 0,
            jobCostQuantity: formatNumber(d["Job Cost Quantity"]) || 0,
            gallons: formatNumber(d["Gallons"]) || 0,
            receiptNo: formatNumber(d["Receipt No"]) || 0,
            openClosed: d["Status"] || "C",
            poLineNo: formatNumber(d["PO Line #"]) || 0,
            productAmount: productAmt,
            freightAmount: freightAmt,
            poNo: d["PO No"] || d["PO Number"] || "",
            entryNo: validatedHeader.entryNo,
            entrySequence:
               mode === "edit" ? item.entrySequence ?? index + 1 : index + 1,
         };
      });

      const invoiceAmount = formatNumber(formData["Invoice Amount"]) || 0;
      const headerFreight = formatNumber(formData["Freight"]) || 0;
      
      const totalProductAmount = details.reduce(
         (acc, curr) => acc + (curr.productAmount || 0),
         0
      );
      
      const totalFreightAmount = details.reduce(
         (acc, curr) => acc + (curr.freightAmount || 0),
         0
      );

      // Validate: Total Product Amount + Total Freight Amount = Invoice Amount
      const totalLineAmount = totalProductAmount + totalFreightAmount;
      if (Math.abs(totalLineAmount - invoiceAmount) > 0.001) {
         const message = `Total Product Amount (${formatCurrency(
            totalProductAmount
         )}) + Total Freight Amount (${formatCurrency(
            totalFreightAmount
         )}) = ${formatCurrency(totalLineAmount)} does not match Invoice Amount (${formatCurrency(invoiceAmount)}).`;

         setToasterType("error");
         setToasterTitle("Amount Mismatch");
         setToasterSubtitle(message);
         setToasterVisible(true);
         return;
      }
      
      // Validate: Total Freight Amount in line items = Header Freight
      if (Math.abs(totalFreightAmount - headerFreight) > 0.001) {
         const message = `Total Freight Amount in line items (${formatCurrency(
            totalFreightAmount
         )}) does not match Header Freight (${formatCurrency(headerFreight)}).`;

         setToasterType("error");
         setToasterTitle("Freight Amount Mismatch");
         setToasterSubtitle(message);
         setToasterVisible(true);
         return;
      }

      // Rest of the submit logic remains unchanged
      const payload: any = {
         header: validatedHeader,
         details,
      };

      setIsLoading(true);
      try {
         // Use React Query hook with exact same payload
         const response = await submitVoucherMutation.mutateAsync(payload);

         // Check if response is a Response object and extract the data
         let responseData: any;
         if (response instanceof Response) {
            responseData = await response.json();
         } else {
            responseData = response;
         }

         // Extract and map both errors and warnings from successful response
         // Note: Header warnings (id: "header") are filtered out as they were already handled during "Next" button validation
         const responseWithWarnings = responseData as any;
         const newLineItemWarnings: Record<number, Record<string, string>> = {};
         const newLineItemErrors: Record<number, Record<string, string>> = {};
         let hasWarningsFlag = false;
         let hasErrorsFlag = false;

         // Debug logging to understand response structure

         // Updated to match the actual API response structure
         const maybeWarnings =
            responseWithWarnings?.warnings ||
            responseWithWarnings?.data?.warnings ||
            responseWithWarnings?.items?.warnings ||
            responseWithWarnings?.data?.items?.warnings;

         const warningDetails = maybeWarnings?.details;

         const headerStatus =
            responseWithWarnings?.items?.header?.status ||
            responseWithWarnings?.data?.items?.header?.status ||
            responseWithWarnings?.header?.status ||
            responseWithWarnings?.data?.header?.status;

         if (Array.isArray(warningDetails)) {
            warningDetails.forEach(
               ({
                  field,
                  message,
                  id,
               }: {
                  field: string;
                  message: string;
                  id?: string;
               }) => {
                  const label = labelMap[field] || field;

                  // Skip header warnings - they were already handled during "Next" button validation
                  if (id === "header") {
                     return;
                  }

                  if (id) {
                     // Map to the specific line item by entrySequence (primary key used in StepTwoForm)
                     const numericId = Number(id);
                     const matchedItem = lineItems.find(
                        (item) =>
                           item.entrySequence === numericId ||
                           item.id === numericId
                     );
                     if (matchedItem) {
                        const key = matchedItem.id ?? matchedItem.entrySequence;
                        if (!newLineItemWarnings[key]) {
                           newLineItemWarnings[key] = {};
                        }
                        newLineItemWarnings[key][label] = message;
                     } else {
                        // Fallback when id provided but no matching item found: apply to all items
                        if (lineItems.length === 0) {
                           newLineItemWarnings[1] =
                              newLineItemWarnings[1] || {};
                           newLineItemWarnings[1][label] = message;
                        } else {
                           lineItems.forEach((it) => {
                              const key = it.id ?? it.entrySequence;
                              if (!newLineItemWarnings[key]) {
                                 newLineItemWarnings[key] = {};
                              }
                              newLineItemWarnings[key][label] = message;
                           });
                        }
                     }
                  } else {
                     // No id provided: apply to all line items (or first default)
                     if (lineItems.length === 0) {
                        newLineItemWarnings[1] = newLineItemWarnings[1] || {};
                        newLineItemWarnings[1][label] = message;
                     } else {
                        lineItems.forEach((item) => {
                           const key = item.id ?? item.entrySequence;
                           if (!newLineItemWarnings[key]) {
                              newLineItemWarnings[key] = {};
                           }
                           newLineItemWarnings[key][label] = message;
                        });
                     }
                  }
               }
            );
            // Determine warnings presence based on populated mappings (excluding header warnings)
            // Only show warning modal if there are actual line item warnings after filtering out header warnings
            hasWarningsFlag = Object.values(newLineItemWarnings).some(
               (m) => m && Object.keys(m).length > 0
            );
         } else if (maybeWarnings || headerStatus === "W") {
            // Check if warnings exist but are only header warnings
            if (Array.isArray(warningDetails)) {
               // Filter out header warnings to see if any non-header warnings exist
               const nonHeaderWarnings = warningDetails.filter(
                  (warning: any) => warning.id !== "header"
               );
               hasWarningsFlag = nonHeaderWarnings.length > 0;
            } else {
               // If no details available, assume there are warnings (fallback behavior)
               hasWarningsFlag = true;
            }
         }

         // Additional check for direct warnings structure from API response
         if (!hasWarningsFlag && responseWithWarnings?.warnings) {
            // Check if the warnings are only header warnings
            const directWarningDetails = responseWithWarnings?.warnings?.details;
            if (Array.isArray(directWarningDetails)) {
               const nonHeaderWarnings = directWarningDetails.filter(
                  (warning: any) => warning.id !== "header"
               );
               hasWarningsFlag = nonHeaderWarnings.length > 0;
            } else {
               hasWarningsFlag = true;
            }
         }

         // Process errors from successful response (similar to warnings)
         const maybeErrors =
            responseWithWarnings?.errors ||
            responseWithWarnings?.data?.errors ||
            responseWithWarnings?.items?.errors ||
            responseWithWarnings?.data?.items?.errors;

         const errorDetails = maybeErrors?.details;

         if (Array.isArray(errorDetails)) {
            errorDetails.forEach(
               ({
                  field,
                  message,
                  id,
               }: {
                  field: string;
                  message: string;
                  id?: string;
               }) => {
                  const label = labelMap[field] || field;

                  if (id) {
                     // Map to the specific line item by entrySequence
                     const numericId = Number(id);
                     const matchedItem = lineItems.find(
                        (item) =>
                           item.entrySequence === numericId ||
                           item.id === numericId
                     );
                     if (matchedItem) {
                        const key = matchedItem.id ?? matchedItem.entrySequence;
                        if (!newLineItemErrors[key]) {
                           newLineItemErrors[key] = {};
                        }
                        newLineItemErrors[key][label] = message;
                     }
                  } else {
                     // No id provided: apply to all line items
                     if (lineItems.length === 0) {
                        newLineItemErrors[1] = newLineItemErrors[1] || {};
                        newLineItemErrors[1][label] = message;
                     } else {
                        lineItems.forEach((item) => {
                           const key = item.id ?? item.entrySequence;
                           if (!newLineItemErrors[key]) {
                              newLineItemErrors[key] = {};
                           }
                           newLineItemErrors[key][label] = message;
                        });
                     }
                  }
               }
            );

            hasErrorsFlag =
               errorDetails.length > 0 ||
               Object.keys(newLineItemErrors).length > 0;
         }

         // Additional check for direct errors structure from API response
         if (!hasErrorsFlag && responseWithWarnings?.errors) {
            hasErrorsFlag = true;
         }

         // Apply error priority: remove warnings where errors exist for the same field (submission mode)
         const finalSubmissionWarnings: Record<
            number,
            Record<string, string>
         > = {};

         // Copy warnings but exclude fields where errors exist
         Object.keys(newLineItemWarnings).forEach((lineKeyStr) => {
            const lineKey = Number(lineKeyStr);
            const lineWarnings = newLineItemWarnings[lineKey];
            const lineErrors = newLineItemErrors[lineKey];

            if (lineWarnings) {
               Object.keys(lineWarnings).forEach((fieldName) => {
                  // Only keep warning if no error exists for the same field on the same line
                  if (!lineErrors || !lineErrors[fieldName]) {
                     if (!finalSubmissionWarnings[lineKey]) {
                        finalSubmissionWarnings[lineKey] = {};
                     }
                     finalSubmissionWarnings[lineKey][fieldName] =
                        lineWarnings[fieldName];
                  } else {
                  }
               });
            }
         });

         setLineItemWarnings(finalSubmissionWarnings); // Use priority-filtered warnings
         setLineItemErrors(newLineItemErrors);
         setHasWarnings(Object.keys(finalSubmissionWarnings).length > 0); // Update based on filtered warnings
         setHasSubmissionErrors(hasErrorsFlag);

         // Extract entryNo from response if available, fallback to validatedHeader
         const entryNo =
            responseWithWarnings?.items?.header?.entryNo ||
            validatedHeader.entryNo;
         setSubmittedEntryNo(entryNo);

         setIsVisible(true);

         // Clear enabled fields after successful submission
         setEnabledFieldsByError(new Set());

         // Handle the combination of errors and warnings (after priority filtering)
         const finalHasWarnings =
            Object.keys(finalSubmissionWarnings).length > 0;

         if (hasErrorsFlag && finalHasWarnings) {
            // Don't clear anything - both should be visible
         } else if (finalHasWarnings) {
            // Clear only form-level errors but keep line item errors if they exist
            setErrors({});
         } else if (hasErrorsFlag) {
            // Warnings are already filtered out by priority logic above
         }
      } catch (err) {
         // Error handling remains unchanged
         const newLineItemErrors: Record<number, Record<string, string>> = {};
         let newErrors: Record<string, string> = {};
         let backendMessage = "";

         const extractDetails = async (res: Response) => {
            try {
               const errorJson = await res.json();
               backendMessage =
                  errorJson?.error?.message || errorJson?.message || "";
               // Handle both errorJson?.error?.details and errorJson?.details structures
               const details = errorJson?.error?.details || errorJson?.details;

               if (Array.isArray(details)) {
                  details.forEach(
                     ({
                        field,
                        message,
                        id,
                     }: {
                        field: string;
                        message: string;
                        id?: string;
                     }) => {
                        const label = labelMap[field] || field;

                        if (id) {
                           // If id is provided, find the specific line item
                           const matchedItem = lineItems.find(
                              (item) => item.id === Number(id)
                           );
                           if (matchedItem) {
                              if (!newLineItemErrors[matchedItem.id])
                                 newLineItemErrors[matchedItem.id] = {};
                              newLineItemErrors[matchedItem.id][label] =
                                 message;
                           }
                        } else {
                           // If no id provided, apply error to all line items
                           // Special handling: if lineItems is empty, create a temporary error for first item
                           if (lineItems.length === 0) {
                              // Apply error to item ID 1 (default first line item)
                              newLineItemErrors[1] = newLineItemErrors[1] || {};
                              newLineItemErrors[1][label] = message;
                           } else {
                              // Apply to all existing line items
                              lineItems.forEach((item) => {
                                 if (!newLineItemErrors[item.id])
                                    newLineItemErrors[item.id] = {};
                                 newLineItemErrors[item.id][label] = message;
                              });
                           }
                        }
                     }
                  );
               } else if (backendMessage) {
                  newErrors = { general: backendMessage };
               } else {
                  newErrors = { general: "Validation error occurred." };
               }
            } catch (error) {
               newErrors = {
                  general: "Unexpected error occurred. Please try again.",
               };
            }
         };

         if (err instanceof Response) {
            await extractDetails(err);
         } else if ((err as any)?.response instanceof Response) {
            await extractDetails((err as any).response);
         } else if (err instanceof Error) {
            newErrors = { general: err.message };
         } else {
            newErrors = { general: "Something went wrong." };
         }

         setLineItemErrors(newLineItemErrors);
         setErrors(newErrors);
         setLineItemWarnings({});
         setHasWarnings(false);
         setHasSubmissionErrors(false);

         // Show different message based on error type
         const hasFieldErrors =
            Object.keys(newLineItemErrors).length > 0 ||
            Object.keys(newErrors).some((key) => key !== "general");

         if (hasFieldErrors) {
            // For field-level errors, show a generic message directing user to check fields
            setToasterType("error");
            setToasterTitle("Validation Error");
            setToasterSubtitle(
               "Please check the highlighted fields below and correct the errors."
            );
            setToasterVisible(true);
         } else {
            // For general errors, show the specific API message
            const finalErrorMessage =
               backendMessage ||
               newErrors.general ||
               "An unexpected error occurred. Please try again.";
            setToasterType("error");
            setToasterTitle("Submission Error");
            setToasterSubtitle(finalErrorMessage);
            setToasterVisible(true);
         }
      } finally {
         setIsLoading(false);
      }
   };
   // const resetFormForVendor = (vendorNo: string, companyNo = "10") => {
   //    const clearedForm = {
   //       ...blankHeader,
   //       "Vendor No": vendorNo,
   //       "Company No": companyNo,
   //    };
   //    setFormData(clearedForm);
   //    setErrors({});
   //    setLineItems([]);
   //    setLineItemErrors({});
   //    setValidatedHeader(null);
   //    setCurrent(0);
   // };
   // const handleVendorChange = async (value: string | number) => {
   //    if (mode === "edit") return;

   //    const companyNo = formData["Company No"] || "10";
   //    setSelectedVendor(value);

   //    try {
   //       const api = new Api({
   //          baseUrl: import.meta.env.VITE_API_BASE_URL,
   //       });

   //       const response = await api.accountPayable.getVoucherConfig({
   //          companyNo: Number(companyNo),
   //          vendorNo: Number(value),
   //       });

   //       const company = response?.data?.items?.company;
   //       const vendor = response?.data?.items?.vendor;

   //       const clearedForm = {
   //          ...blankHeader,
   //          "Vendor No": value,
   //          "Company No": companyNo,
   //          "Bank Acct G/L": String(company?.companyBankGlNo || ""),
   //          "Account Pay G/L": String(company?.companyApGlNo || ""),
   //          "Bank Acct G/L Description":
   //             company?.companyBankGlDesc?.trim() || "",
   //          "Account Pay G/L Description":
   //             company?.companyApGlDesc?.trim() || "",
   //          "Hold Voucher": vendor?.vendorHoldPaymentsVend || "",
   //          "Hold Description":
   //             holdVoucherDescriptions[vendor?.vendorHoldPaymentsVend || ""] ||
   //             "",
   //          "Entry No": String(company?.companyNextEntryNo || ""),
   //       };

   //       setConfigResponse(response);
   //       setFormData(clearedForm);
   //       setErrors({});
   //       setLineItems([]);
   //       setLineItemErrors({});
   //       setValidatedHeader(null);
   //       setCurrent(0);
   //    } catch (error) {
   //       console.error("Error fetching voucher config:", error);
   //    }
   // };
   const formatProcessType = (value: string | undefined) =>
      value
         ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
         : "Normal";

   const processTypeText = `Process Type - ${formatProcessType(
      formData["Process Type"]
   )}`;
   const navigateBackWithProcessType = (showSuccess = false) => {
      // Map process type to URL value
      const processTypeToUrl: Record<string, string> = {
         NORMAL: "normal",
         PAPER: "paper",
         FLEXI: "flexi",
         SOGAS: "sogas",
         ARGLMS: "arglms",
      };

      const urlProcessType = Object.prototype.hasOwnProperty.call(
         processTypeToUrl,
         originProcessType
      )
         ? processTypeToUrl[originProcessType]
         : "normal";

      navigate(
         `/accounts-payable/voucher-management/voucher-entry/${urlProcessType}`,
         {
            state: {
               selectedProcessType: originProcessType,
               ...(sourceTab && { defaultActiveTab: sourceTab }),
               ...(showSuccess && {
                  successMessage:
                     mode === "edit"
                        ? "Voucher updated successfully"
                        : "Voucher created successfully",
               }),
            },
         }
      );
   };

   return (
      <>
         {isLoading && (
            <div className="loader-overlay">
               <SpinLoader size="large" customFontSize={40} />
            </div>
         )}
         <h3>{mode === "edit" ? "Edit Voucher Entry" : "Create New Entry"}</h3>

         <div className="vendor-details-container">
            <div className="vendor-select-container">
               <VendorNumberName
                  disabled={
                     (mode === "edit" || current !== 0) &&
                     !enabledFieldsByError.has("Vendor No")
                  }
                  value={selectedVendor}
                  onChange={async (value) => {
                     // Allow changes if field is enabled due to validation error
                     if (
                        mode === "edit" &&
                        !enabledFieldsByError.has("Vendor No")
                     ) {
                        return;
                     }

                     // Also check if we're not on step 0 but field is enabled due to error
                     if (
                        current !== 0 &&
                        !enabledFieldsByError.has("Vendor No")
                     ) {
                        return;
                     }

                     const companyNo = formData["Company No"] || "10";
                     setSelectedVendor(value?.toString() || "");

                     // Clear the validation error message when user selects a new value
                     // but keep the field enabled until validation is actually successful
                     const updatedErrors = { ...errors };
                     delete updatedErrors["Vendor No"];
                     setErrors(updatedErrors);

                     // If we're correcting a validation error, handle differently
                     const isErrorCorrection =
                        enabledFieldsByError.has("Vendor No");

                     try {
                        // Use React Query hook with exact same payload
                        const response = await voucherConfigMutation.mutateAsync({
                           companyNo: Number(formData["Company No"] || 10),
                           vendorNo: Number(value),
                        });

                        const company: any = response?.data?.items?.company;
                        const vendor: any = response?.data?.items?.vendor;

                        if (isErrorCorrection) {
                           // For error correction, only update essential vendor-related fields
                           const updatedFormData = {
                              ...formData,
                              "Vendor No": value?.toString() || "",
                              "Bank Acct G/L": String(
                                 company?.companyBankGlNo || ""
                              ),
                              "Account Pay G/L": String(
                                 company?.companyApGlNo || ""
                              ),
                              "Bank Acct G/L Description":
                                 company?.companyBankGlDesc?.trim() || "",
                              "Account Pay G/L Description":
                                 company?.companyApGlDesc?.trim() || "",
                              "Hold Voucher":
                                 vendor?.vendorHoldPaymentsVend || "",
                              "Hold Description":
                                 holdVoucherDescriptions[
                                    vendor?.vendorHoldPaymentsVend || ""
                                 ] || "",
                           };
                           setFormData(updatedFormData);
                           setConfigResponse(response);
                        } else {
                           // Normal flow - clear everything and start fresh
                           const clearedForm = {
                              ...blankHeader,
                              "Vendor No": value?.toString() || "",
                              "Company No": companyNo,
                              "Bank Acct G/L": String(
                                 company?.companyBankGlNo || ""
                              ),
                              "Account Pay G/L": String(
                                 company?.companyApGlNo || ""
                              ),
                              "Bank Acct G/L Description":
                                 company?.companyBankGlDesc?.trim() || "",
                              "Account Pay G/L Description":
                                 company?.companyApGlDesc?.trim() || "",
                              "Hold Voucher":
                                 vendor?.vendorHoldPaymentsVend || "",
                              "Hold Description":
                                 holdVoucherDescriptions[
                                    vendor?.vendorHoldPaymentsVend || ""
                                 ] || "",
                              "Entry No": String(
                                 company?.companyNextEntryNo || ""
                              ),
                           };

                           setConfigResponse(response);
                           setFormData(clearedForm);
                           setErrors({});
                           setLineItems([]);
                           setLineItemErrors({});
                           setValidatedHeader(null);
                           setEnabledFieldsByError(new Set()); // Clear enabled fields on normal form reset
                           setCurrent(0);
                        }
                     } catch (error) {
                        console.error("Error fetching voucher config:", error);
                     }
                  }}
                  companyNo={String(vendorCardValues.companyNo)}
               />
               {errors["Vendor No"] && (
                  <p className="error-message">{errors["Vendor No"]}</p>
               )}
            </div>
            <Divider type="horizontal" className="vendor-divider" />
            <h5>{vendorDetailsTitle}</h5>
            <div className="vendor-details-container show-no-padding">
               <div className="cards-container">
                  <div className="first-row">
                     <div className="card-left height-100">
                        <Card
                           icon={
                              <img
                                 src={vendorIcon}
                                 alt={iconAltTexts.vendorIcon}
                              />
                           }
                           label={vendorCardLabels[0]}
                           value={
                              mode === "edit"
                                 ? `${entryData.headerItem.vendorName}${
                                      entryData.headerItem.vendorAdd1
                                         ? `, ${entryData.headerItem.vendorAdd1}`
                                         : ""
                                   } ${entryData.headerItem.vendorAdd2 || ""} ${
                                      entryData.headerItem.vendorAdd3 || ""
                                   } ${
                                      entryData.headerItem.vendorAdd4 || ""
                                   }`.trim() || ""
                                 : configResponse?.data?.items?.vendor
                                      ?.vendorName
                                 ? `${
                                      configResponse.data.items.vendor
                                         .vendorName
                                   }${
                                      configResponse.data.items.vendor
                                         .vendorAdd1
                                         ? `, ${configResponse.data.items.vendor.vendorAdd1}`
                                         : ""
                                   } ${
                                      configResponse.data.items.vendor
                                         .vendorAdd2 || ""
                                   } ${
                                      configResponse.data.items.vendor
                                         .vendorAdd3 || ""
                                   } ${
                                      configResponse.data.items.vendor
                                         .vendorAdd4 || ""
                                   }`
                                 : ""
                           }
                        />
                     </div>
                     <div className="card-right height-100">
                        <Card
                           icon={
                              <img
                                 src={vendorNoIcon}
                                 alt={iconAltTexts.vendorNoIcon}
                              />
                           }
                           label={vendorCardLabels[2]}
                           value={
                              mode === "edit"
                                 ? entryData.headerItem.vendorNo.toString()
                                 : configResponse?.data?.items?.vendor?.vendorNo?.toString() ||
                                   ""
                           }
                        />
                     </div>
                  </div>

                  <div className="second-row">
                     <div className="card-small height-100">
                        <Card
                           icon={
                              <img
                                 src={companyIcon}
                                 alt={iconAltTexts.companyIcon}
                              />
                           }
                           label={vendorCardLabels[1]}
                           value={
                              mode === "edit"
                                 ? entryData.headerItem.companyNo.toString()
                                 : configResponse?.data?.items?.company?.companyNo?.toString() ||
                                   ""
                           }
                        />
                     </div>

                     <div className="card-small height-100">
                        <Card
                           icon={
                              <img
                                 src={entryNoIcon}
                                 alt={iconAltTexts.entryNoIcon}
                              />
                           }
                           label={vendorCardLabels[3]}
                           value={
                              mode === "edit"
                                 ? entryData.headerItem.entryNo.toString()
                                 : configResponse?.data?.items?.company?.companyNextEntryNo?.toString() ||
                                   ""
                           }
                        />
                     </div>

                     <div className="card-right hight-100">
                        <Card
                           icon={
                              <img
                                 src={processTypeIcon}
                                 alt={iconAltTexts.processTypeIcon}
                              />
                           }
                           label={vendorCardLabels[4]}
                           value={
                              mode === "edit"
                                 ? entryData.headerItem.processType
                                 : vendorCardValues.processType
                           }
                        />
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <div className="ap-entry-container">
            <div className="entry-header-section">
               <h4>
                  {VoucherEntryTitle}{" "}
                  {current === 1 &&
                     formData["Invoice No"] &&
                     `(Invoice: ${formData["Invoice No"]})`}
               </h4>
               <p className="p-xs process-type">{processTypeText}</p>
            </div>
            <Divider />
            <StepForm
               current={current}
               items={voucherEntrySteps}
               className="voucher-entry-stepform create"
               dynamicDescriptions={{
                  entryHeaderTotal: formatCurrency(
                     formData["Invoice Amount"] || 0
                  ),
                  lineItemDetails: ` ${formatCurrency(
                     displayTotals.lineAmount
                  )} (Line Amt) / ${formatCurrency(
                     displayTotals.discount
                  )} (Discount Amt)`,
               }}
            >
               <div className="create-entry-grid">
                  {current === 0 && (
                     <StepOneForm
                        formData={formData}
                        onInputChange={handleInputChange}
                        onInputBlur={handleInputBlur}
                        errors={errors}
                        enabledFieldsByError={enabledFieldsByError}
                        apGlForcedEnabled={apGlForcedEnabled}
                        mode={mode}
                        onValidationErrorsChange={setStepOneValidationErrors}
                        warnings={headerWarnings}
                     />
                  )}
                  {current === 1 && (
                     <StepTwoForm
                        onTotalsChange={setTotals}
                        mode={mode}
                        detailItems={
                           mode === "edit" ? entryData?.detailItems : []
                        }
                        existingLineItems={lineItems}
                        formData={formData}
                        onInputChange={handleInputChange}
                        configResponse={configResponse}
                        showToaster={(type, title, subtitle) => {
                           setToasterType(type);
                           setToasterTitle(title);
                           setToasterSubtitle(subtitle);
                           setToasterVisible(true);
                        }}
                        onLineItemsChange={(items: any[]) => {
                           const updatedErrors: Record<
                              number,
                              Record<string, string>
                           > = {};

                           items.forEach((item) => {
                              const fieldErrors: Record<string, string> = {};

                              Object.entries(item?.data || {}).forEach(
                                 ([key, value]) => {
                                    const str =
                                       value == null
                                          ? ""
                                          : String(value).trim();

                                    if (key === "Line G/L Account") {
                                       // Show error until exactly 8 characters are entered (avoid flagging when empty; required validation handles blank)
                                       if (str.length > 8) {
                                          fieldErrors[
                                             key
                                          ] = `${key} MUST BE EXACTLY 8 CHARACTERS`;
                                       }
                                    } else {
                                       const maxLength =
                                          stepTwoFieldMaxLengthMap[key];
                                       // Trigger the same error message when the user hits the limit
                                       if (
                                          maxLength &&
                                          str.length > maxLength
                                       ) {
                                          fieldErrors[
                                             key
                                          ] = `${key} CANNOT EXCEED ${maxLength} CHARACTERS`;
                                       }
                                    }
                                 }
                              );

                              if (Object.keys(fieldErrors).length > 0) {
                                 updatedErrors[item.id] = fieldErrors;
                              }
                           });

                           // Only update lineItemErrors if there are actual validation errors to add
                           // This prevents clearing API errors during initialization
                           if (Object.keys(updatedErrors).length > 0) {
                              // Merge client-side validation errors with existing API-loaded errors
                              // Preserve API errors on initial load; do not overwrite existing field errors
                              setLineItemErrors((prev) => {
                                 const merged: Record<
                                    number,
                                    Record<string, string>
                                 > = { ...prev };

                                 Object.entries(updatedErrors).forEach(
                                    ([lineKeyStr, fieldErrs]) => {
                                       const lineKey = Number(lineKeyStr);
                                       merged[lineKey] = {
                                          ...(merged[lineKey] || {}),
                                          // Only add client-side validation errors for fields
                                          // that don't already have an error from API
                                          ...Object.fromEntries(
                                             Object.entries(fieldErrs).filter(
                                                ([field]) =>
                                                   !(merged[lineKey] || {})[
                                                      field
                                                   ]
                                             )
                                          ),
                                       };
                                    }
                                 );

                                 return merged;
                              });
                           }
                           // Don't clear API-loaded warnings when user makes changes - only clear validation warnings
                           // For FLEXI/SOGAS, preserve warnings from API response

                           // setLineItemWarnings({});
                           // setHasWarnings(false);
                           // Always update lineItems to allow changes in both create and edit modes
                           setLineItems(items);
                        }}
                        errors={errors}
                        lineItemErrors={lineItemErrors}
                        lineItemWarnings={lineItemWarnings}
                        invoiceDescription={formData["Invoice Description"]}
                        companyNo={Number(formData["Company No"] || 10)}
                        validationErrorsRef={stepTwoValidationRef}
                     />
                  )}

                  <div className="step-btns">
                     {current > 0 && (
                        <Button
                           onClick={prev}
                           disabled={isLoading}
                           className="ant-Button"
                        >
                           <h6>{buttonLabels.previous}</h6>
                        </Button>
                     )}
                     {current === 0 && (
                        <Button
                           className="ant-Button"
                           onClick={() => {
                              setFormData({});
                              setLineItems([]);
                              setLineItemErrors({});
                              setTotals({ product: 0, discount: 0, lineAmount: 0 });
                              navigateBackWithProcessType(false);
                           }}
                           disabled={isLoading}
                        >
                           <h6>{buttonLabels.cancel}</h6>
                        </Button>
                     )}
                     {current < voucherEntrySteps.length - 1 ? (
                        <CustomStyledButton
                           name="submitForm"
                           label={buttonLabels.next}
                           onClick={next}
                           disabled={
                              isLoading || (current === 0 && !selectedVendor)
                           }
                        />
                     ) : (
                        <CustomStyledButton
                           name="submit"
                           label={buttonLabels.submit}
                           onClick={handleSubmit}
                           disabled={isLoading}
                        />
                     )}
                  </div>
               </div>
            </StepForm>
         </div>

         {/* Header Validation Warning Modal - Reusing same structure as submit modal */}
         <ModalContent
            title={
               Object.keys(headerWarnings).length > 0
                  ? `Header Validation Warning`
                  : `Header Validation Warning`
            }
            description={
               Object.keys(headerWarnings).length > 0
                  ? `Warning: ${Object.values(headerWarnings)[0]}`
                  : "Warnings Received"
            }
            visible={showHeaderWarningModal}
            onCancel={() => {
               // Stay on step 1 to fix warnings
               setShowHeaderWarningModal(false);
               setPendingHeaderPayload(null);
            }}
            showCloseIcon={false}
            imageUrl={warningIcon}
            actions={[
               {
                  name: "update",
                  label: "Edit",
                  onClick: () => {
                     // Stay on step 1 to fix warnings (don't show as errors since warnings are already visible)
                     setShowHeaderWarningModal(false);
                     
                     setPendingHeaderPayload(null);
                  },
               },
               {
                  name: "ok",
                  label: "Continue",
                  onClick: () => {
                     // Proceed to step 2 with warnings (same as submit modal OK behavior)
                     setShowHeaderWarningModal(false);
                     
                     // Set the validated header and proceed to next step
                     if (pendingHeaderPayload) {
                        setValidatedHeader(pendingHeaderPayload);
                     }
                     
                     if (current < voucherEntrySteps.length - 1) {
                        setCurrent((prev) => prev + 1);
                        setErrors({});
                        setEnabledFieldsByError(new Set());
                     }
                     
                     // Clear warning state
                     setHeaderWarnings({});
                     setPendingHeaderPayload(null);
                  },
               },
            ]}
            className="cne-modal descripition"
         />

         <ModalContent
            title={
               hasSubmissionErrors && hasWarnings
                  ? submittedEntryNo
                     ? `Voucher Entry #${submittedEntryNo} Created with Errors and Warnings`
                     : `Voucher Entry Created with Errors and Warnings`
                  : hasSubmissionErrors
                  ? submittedEntryNo
                     ? `Voucher Entry #${submittedEntryNo} Created with Errors`
                     : `Voucher Entry Created with Errors`
                  : hasWarnings
                  ? submittedEntryNo
                     ? `Voucher Entry #${submittedEntryNo} Created with Warning`
                     : `Voucher Entry Created with Warning`
                  : submittedEntryNo
                  ? `Voucher Entry #${submittedEntryNo} ${
                       mode === "edit" ? "Updated" : "Submitted"
                    }`
                  : `Voucher Entry ${mode === "edit" ? "Updated" : "Submitted"}`
            }
            description={
               hasSubmissionErrors && hasWarnings
                  ? "Both Errors and Warnings Received"
                  : hasSubmissionErrors
                  ? "Errors Received"
                  : hasWarnings
                  ? "Warnings Received"
                  : submittedEntryNo
                  ? `Voucher entry has been ${
                       mode === "edit" ? "updated" : "submitted"
                    } successfully.`
                  : `Voucher entry has been ${
                       mode === "edit" ? "updated" : "submitted"
                    } successfully.`
            }
            visible={isVisible}
            onCancel={() => {
               if (hasWarnings || hasSubmissionErrors) {
                  // Stay on the same page if there are warnings or errors
                  setIsVisible(false);
               } else {
                  // Navigate back if no warnings or errors
                  navigateBackWithProcessType(true);
                  setIsVisible(false);
                  const selectedCompany = location.state?.selectedCompany;
                  queryClient.invalidateQueries({
                     queryKey: selectedCompany
                        ? ["voucher-entry", selectedCompany]
                        : ["voucher-entry"],
                  });
               }
            }}
            showCloseIcon={false}
            imageUrl={hasWarnings || hasSubmissionErrors ? warningIcon : popupOk}
            actions={
               hasWarnings || hasSubmissionErrors
                  ? [
                       {
                          name: "update",
                          label: "Edit",
                          onClick: () => {
                             // Stay on the same page to fix warnings/errors
                             setIsVisible(false);
                          },
                       },
                       {
                          name: modalActions[0].name,
                           label: "Continue",
                          onClick: () => {
                             // Navigate back even with warnings/errors
                             navigateBackWithProcessType(true);
                             setIsVisible(false);
                             const selectedCompany =
                                location.state?.selectedCompany;
                             queryClient.invalidateQueries({
                                queryKey: selectedCompany
                                   ? ["voucher-entry", selectedCompany]
                                   : ["voucher-entry"],
                             });
                          },
                       },
                    ]
                  : [
                       {
                          name: modalActions[0].name,
                          label: modalActions[0].label,
                          onClick: () => {
                             navigateBackWithProcessType(true);
                             setIsVisible(false);
                             const selectedCompany =
                                location.state?.selectedCompany;
                             queryClient.invalidateQueries({
                                queryKey: selectedCompany
                                   ? ["voucher-entry", selectedCompany]
                                   : ["voucher-entry"],
                             });
                          },
                       },
                    ]
            }
            className="cne-modal descripition"
         />

         {toasterVisible && (
            <Toaster
               type={toasterType}
               title={toasterTitle}
               subtitle={toasterSubtitle}
               onClose={() => setToasterVisible(false)}
            />
         )}
      </>
   );
};

export default CreateNewEntry;
