import React, { useState, useEffect, useRef } from "react";
import { Button, Collapse } from "antd";
import type { StepTwoFormProps } from "@type-definitions/accounts-payable.types";
import { CustomPrefixInput } from "@widget-library/Input";
import { CustomSelectDropdown } from "@widget-library/Dropdown";
import itemDeleteIcon from "@assets/icons/item-delete-icon.svg";
import {
   INPUT_GROUPS,
   REQUIRED_FIELDS,
   STEP_TWO_STATUS_OPTIONS,
   stepTwoFieldMaxLengthMap,
   fieldMaxLengthMap,
} from "@constants/commonConstants";
import {
   formatAmountValue,
   formatCurrency,
} from "@utils/formatters";
import {
   validateIntegerInput,
   validateNumericInput,
   validateInvoiceAmount,
   formatInvoiceAmountOnBlur,
} from "@utils/validation";
import { useSoftDeleteVoucherDetail, useGlMaster } from "../../../../../../../../../hooks/useNormalProcess";
import "../create-entry.scss";

const { Panel } = Collapse;

const StepTwoForm: React.FC<
   StepTwoFormProps & {
      errors?: { [key: string]: string };
      lineItemErrors?: Record<number, Record<string, string>>;
      lineItemWarnings?: Record<number, Record<string, string>>;
      onLineItemsChange?: (items: any[]) => void;
      invoiceDescription?: string;
      companyNo: number;
      mode?: string;
      detailItems?: any[];
      onTotalsChange?: (totals: any) => void;
      showToaster?: (
         type: "success" | "error" | "warning" | "batch",
         title: string,
         subtitle: string
      ) => void;
      validationErrorsRef?: React.MutableRefObject<{ clearErrors: () => void } | null>;
      configResponse?: any;
   }
> = ({
   onLineItemsChange,
   lineItemErrors = {},
   lineItemWarnings = {},
   invoiceDescription = "",
   companyNo,
   mode,
   detailItems = [],
   existingLineItems = [],
   onTotalsChange,
   formData,
   showToaster,
   validationErrorsRef,
   configResponse,
}) => {
   const [lineItems, setLineItems] = useState<
      {
         id: number;
         entrySequence: number;
         data: { [key: string]: string };
      }[]
   >([]);

   const [activePanelKey, setActivePanelKey] = useState<string | number | null>(
      null
   );

   const [validationErrors, setValidationErrors] = useState<
      Record<number, Record<string, string | undefined>>
   >({});
   const [isInitialized, setIsInitialized] = useState(false);
   const [_nextSequenceNumber, setNextSequenceNumber] = useState(1);

   // React Query hooks
   const softDeleteVoucherDetailMutation = useSoftDeleteVoucherDetail();
   const glMasterMutation = useGlMaster();

   // Assign clear errors function to ref only on mount (not on re-renders)
   React.useEffect(() => {
      if (validationErrorsRef) {
         validationErrorsRef.current = {
            clearErrors: () => {
               // Simply clear validation errors immediately
               setValidationErrors({});
            }
         };
      }
   }, []); // Empty dependency array = runs only on mount/unmount

   // Helper function to get the next available sequence number
   const getNextSequenceNumber = (currentItems: any[]) => {
      const existingSequences = currentItems.map(
         (item) => item.entrySequence || item.id
      );
      return Math.max(0, ...existingSequences) + 1;
   };

   // --- Helper: resolve line amount and its sign (used for discount logic etc.) ---
   const resolveLineAmountForEntry = (entrySequence: number) => {
      const item =
         lineItems.find((it) => it.entrySequence === entrySequence) ||
         lineItems.find((it) => it.id === entrySequence);
      if (!item)
         return { amount: 0, source: "none" as "product" | "freight" | "none" };

      const prodRaw = (item.data["Product Amount"] ?? "")
         .toString()
         .replace(/,/g, "")
         .trim();
      const freightRaw = (item.data["Freight Amount"] ?? "")
         .toString()
         .replace(/,/g, "")
         .trim();

      const prodExists =
         prodRaw !== "" && prodRaw !== "0" && prodRaw !== "0.00";
      if (prodExists) {
         const prod = parseFloat(prodRaw);
         return {
            amount: isNaN(prod) ? 0 : prod,
            source: "product" as const,
         };
      }

      const freightExists =
         freightRaw !== "" && freightRaw !== "0" && freightRaw !== "0.00";
      if (freightExists) {
         const freight = parseFloat(freightRaw);
         return {
            amount: isNaN(freight) ? 0 : freight,
            source: "freight" as const,
         };
      }

      return { amount: 0, source: "none" as const };
   };

   const isLineAmountNegativeByEntry = (entrySequence: number) => {
      const resolved = resolveLineAmountForEntry(entrySequence);
      return resolved.amount < 0;
   };
   // ----------------------------------------------------------------

   useEffect(() => {
      const activeItems = lineItems;

      const totals = activeItems.reduce(
         (acc, item) => {
            const productAmt = parseFloat(
               (item.data["Product Amount"] || "0").replace(/,/g, "")
            );
            const discPerc = parseFloat(item.data["Line Disc %"] || "");
            const discAmtRaw = (item.data["Line Disc Amount"] || "").replace(
               /,/g,
               ""
            );
            const discAmt = discAmtRaw ? parseFloat(discAmtRaw) : NaN;

            if (!isNaN(productAmt)) acc.product += productAmt;
            if (!isNaN(discPerc) && discPerc !== 0) {
               acc.discount += (productAmt * discPerc) / 100;
            } else if (!isNaN(discAmt)) {
               acc.discount += discAmt;
            }
            return acc;
         },
         { product: 0, discount: 0 }
      );

      onTotalsChange?.(totals);
   }, [lineItems, onTotalsChange]);

   useEffect(() => {
      const headerFreight = parseFloat(
         (formData?.["Freight"] || "0").replace(/,/g, "")
      );

      if ((!headerFreight || headerFreight === 0) && lineItems.length > 0) {
         const hasFreight = lineItems.some((item) => {
            const freightAmt = parseFloat(
               (item.data["Freight Amount"] || "0").replace(/,/g, "")
            );
            return freightAmt && freightAmt !== 0;
         });

         if (hasFreight) {
            const updatedItems = lineItems.map((item) => ({
               ...item,
               data: {
                  ...item.data,
                  "Freight Amount": "",
               },
            }));
            setLineItems(updatedItems);
            onLineItemsChange?.(updatedItems);
         }
      }
   }, [formData?.["Freight"]]);

   const isFieldDisabled = (label: string, data: any) => {
      if (label === "Line Disc Amount") {
         const discPercent = data["Line Disc %"];
         return (
            discPercent &&
            discPercent.toString().trim() !== "" &&
            discPercent !== "0" &&
            discPercent !== "0.00"
         );
      }
      if (label === "Line Disc %") {
         const discAmount = data["Line Disc Amount"];
         return (
            discAmount &&
            discAmount.toString().trim() !== "" &&
            discAmount !== "0" &&
            discAmount !== "0.00"
         );
      }

      if (label === "Freight Amount") {
         const headerFreight = parseFloat(
            (formData?.["Freight"] || "0").replace(/,/g, "")
         );
         // Disable when header freight not provided
         if (!headerFreight || headerFreight === 0) return true;
         // OR behavior: if Product Amount has value, disable Freight Amount
         const productAmt = parseFloat(
            (data["Product Amount"] || "0").replace(/,/g, "")
         );
         if (headerFreight && headerFreight !== 0 && productAmt && productAmt !== 0)
            return true;
         return false;
      }

      if (label === "Product Amount") {
         const headerFreight = parseFloat(
            (formData?.["Freight"] || "0").replace(/,/g, "")
         );
         const lineFreight = parseFloat(
            (data["Freight Amount"] || "0").replace(/,/g, "")
         );
         // When header Freight is provided and this line has Freight Amount, disable Product Amount
         if (headerFreight && headerFreight !== 0 && lineFreight && lineFreight !== 0) {
            return true;
         }
      }

      return false;
   };

   const isRequired = (field: string) => {
      if (field === "Product Amount") {
         const headerFreight = parseFloat(
            (formData?.["Freight"] || "0").replace(/,/g, "")
         );
         if (headerFreight && headerFreight !== 0) return false;
      }
      return REQUIRED_FIELDS.includes(field);
   };

   useEffect(() => {
      if (!isInitialized) {
         if (mode === "edit" && detailItems?.length > 0) {
            // In edit mode, use the existingLineItems passed from parent (which contains API data + any additions)
            if (existingLineItems && existingLineItems.length > 0) {
               const processedItems = existingLineItems.map((item) => {
                  const statusFromApi =
                     (item as any)?.data?.Status ??
                     (item as any)?.openClosed ??
                     "C";
                  const data = { ...item.data, Status: statusFromApi };

                  // If Line Disc % has a value, clear Line Disc Amount
                  if (
                     data["Line Disc %"] &&
                     data["Line Disc %"].trim() !== "" &&
                     data["Line Disc %"] !== "0" &&
                     data["Line Disc %"] !== "0.00"
                  ) {
                     data["Line Disc Amount"] = "";
                  }
                  // If Line Disc Amount has a value, clear Line Disc %
                  else if (
                     data["Line Disc Amount"] &&
                     data["Line Disc Amount"].trim() !== "" &&
                     data["Line Disc Amount"] !== "0" &&
                     data["Line Disc Amount"] !== "0.00"
                  ) {
                     data["Line Disc %"] = "";
                  }

                  return {
                     ...item,
                     data,
                     id: item.entrySequence || item.id,
                  };
               });

               setLineItems(processedItems);
               setNextSequenceNumber(getNextSequenceNumber(processedItems));
               onLineItemsChange?.(processedItems);
               if (processedItems.length > 0) {
                  setActivePanelKey(processedItems[0].entrySequence);
               }
            } else {
               // Fallback to mapping from detailItems if existingLineItems is not available
               const mapped = detailItems.map((item: any, idx: number) => ({
                  id: item.entrySequence || idx + 1,
                  entrySequence: item.entrySequence || idx + 1,
                  data: {
                     Status: item.openClosed,
                     "Product Amount": formatAmountValue(
                        "Product Amount",
                        item.productAmount?.toString() || ""
                     ),
                     "Freight Amount": formatAmountValue(
                        "Freight Amount",
                        item.freightAmount?.toString() || ""
                     ),
                     "Line Disc %":
                        item.discountPercentage &&
                        item.discountPercentage !== 0
                           ? formatAmountValue(
                                "Line Disc %",
                                item.discountPercentage.toString()
                             )
                           : "",
                     "Line Disc Amount":
                        item.discountPercentage &&
                        item.discountPercentage !== 0
                           ? ""
                           : item.discountAmount && item.discountAmount !== 0
                           ? formatAmountValue(
                                "Line Disc Amount",
                                item.discountAmount.toString()
                             )
                           : "",
                     "Line Description":
                        item.lineDesc || invoiceDescription || "",
                     "Line G/L Account": item.lineGlNo?.toString() || "",
                     "Line G/L Description": item.description || "",
                     Gallons: item.gallons?.toString() || "",
                     "Receipt No": item.receiptNo?.toString() || "",
                     "PO No": item.poNo?.toString() || "",
                     "PO Line #": item.poLineNo?.toString() || "",
                     Project: item.jobNo?.toString() || "",
                     Quantity: item.quantity?.toString() || "",
                  },
               }));
               setLineItems(mapped);
               setNextSequenceNumber(getNextSequenceNumber(mapped));
               onLineItemsChange?.(mapped);
               if (mapped.length > 0) {
                  setActivePanelKey(mapped[0].entrySequence);
               }
            }
            setIsInitialized(true);
         } else if (mode !== "edit") {
            // Create mode: Check if we have existing line items from parent component
            if (existingLineItems && existingLineItems.length > 0) {
               const processedItems = existingLineItems.map((item) => ({
                  ...item,
                  id: item.entrySequence || item.id,
               }));
               setLineItems(processedItems);
               setNextSequenceNumber(getNextSequenceNumber(processedItems));
               onLineItemsChange?.(processedItems);
               if (processedItems.length > 0) {
                  setActivePanelKey(processedItems[0].entrySequence);
               }
               setIsInitialized(true);
            } else if (lineItems.length === 0) {
               handleAddItem();
               setIsInitialized(true);
            }
         }
      }
   }, [
      mode,
      detailItems,
      existingLineItems,
      invoiceDescription,
      isInitialized,
      lineItemErrors,
      lineItemWarnings,
   ]);

   // Track if we've already applied the config to prevent re-application
   const configAppliedRef = useRef(false);

   // Update existing line items with discount percentage when config response changes
   useEffect(() => {
      if (
         configResponse?.data?.items?.lineDiscountPercentage &&
         lineItems.length > 0 &&
         mode !== "edit" &&
         !configAppliedRef.current
      ) {
         configAppliedRef.current = true;

         const lineDiscountPercentage =
            configResponse.data.items.lineDiscountPercentage;

         const updatedItems = lineItems.map((item) => {
            const currentDiscPerc = item.data["Line Disc %"];
            const currentDiscAmt = item.data["Line Disc Amount"];

            if (
               (!currentDiscPerc || currentDiscPerc === "") &&
               (!currentDiscAmt || currentDiscAmt === "")
            ) {
               return {
                  ...item,
                  data: {
                     ...item.data,
                     "Line Disc %": lineDiscountPercentage,
                  },
               };
            }
            return item;
         });

         const hasChanges = updatedItems.some(
            (item, index) =>
               item.data["Line Disc %"] !==
               lineItems[index].data["Line Disc %"]
         );

         if (hasChanges) {
            setLineItems(updatedItems);
            onLineItemsChange?.(updatedItems);
         }
      }
   }, [configResponse, lineItems, mode, onLineItemsChange]);

   const handleAddItem = () => {
      const newSequenceNumber = getNextSequenceNumber(lineItems);

      const lineDiscountPercentage =
         configResponse?.data?.items?.lineDiscountPercentage || "";

      const newItem = {
         id: newSequenceNumber,
         entrySequence: newSequenceNumber,
         data: {
            Status: "C",
            "Product Amount": "",
            "Freight Amount": "",
            "Line Disc Amount": "",
            "Line Disc %": lineDiscountPercentage,
            "Line Description": invoiceDescription || "",
            "Line G/L Account": "",
            "Line G/L Description": "",
            Gallons: "",
            "Receipt No": "",
            "PO No": "",
            "PO Line #": "",
            Project: "",
            Quantity: "",
            "Line Delete": "",
         },
      };
      const updatedItems = [...lineItems, newItem];
      setLineItems(updatedItems);
      setNextSequenceNumber(newSequenceNumber + 1);
      onLineItemsChange?.(updatedItems);
      setActivePanelKey(newSequenceNumber);
   };

   const handleDeleteItem = async (entrySequence: number) => {
      if (mode === "edit") {
         try {
            await softDeleteVoucherDetailMutation.mutateAsync({
               companyNo,
               vendorNo: Number(formData?.["Vendor No"]) || 0,
               entryNo: Number(formData?.["Entry No"]) || 0,
               entrySequenceNo: entrySequence,
            });

            const updatedItems = lineItems.filter(
               (item) => item.entrySequence !== entrySequence
            );
            setLineItems(updatedItems);
            onLineItemsChange?.(updatedItems);

            showToaster?.(
               "success",
               "Success",
               "Line item deleted successfully."
            );
         } catch (error) {
            console.error("Delete line item error:", error);

            showToaster?.(
               "error",
               "Delete Error",
               "Could not delete line item. Please try again."
            );
         }
      } else {
         const updatedItems = lineItems.filter(
            (item) => item.entrySequence !== entrySequence
         );
         setLineItems(updatedItems);
         onLineItemsChange?.(updatedItems);
      }
   };

   const validateGLAccount = async (entrySequence: number, glValue: string) => {
      setValidationErrors((prev) => ({
         ...prev,
         [entrySequence]: {
            ...prev[entrySequence],
            "Line G/L Account": undefined,
         },
      }));

      if (!glValue || glValue.trim() === "") {
         return;
      }

      if (!/^\d{8}$/.test(glValue)) {
         setValidationErrors((prev) => ({
            ...prev,
            [entrySequence]: {
               ...prev[entrySequence],
               "Line G/L Account": "GL Account must be exactly 8 digits",
            },
         }));
         showToaster?.(
            "error",
            "Invalid GL Account",
            "GL Account must be exactly 8 digits"
         );
         return;
      }

      try {
         const response = await glMasterMutation.mutateAsync({
            companyNo,
            glNo: Number(glValue),
         });

         const glDescription = response?.data?.items?.description || "";

         setLineItems((prevItems) => {
            const updatedItems = prevItems.map((item) =>
               item.entrySequence === entrySequence
                  ? {
                       ...item,
                       data: {
                          ...item.data,
                          "Line G/L Description": glDescription,
                       },
                    }
                  : item
            );
            onLineItemsChange?.(updatedItems);
            return updatedItems;
         });

         if (glDescription) {
            showToaster?.(
               "success",
               "GL Account Found",
               `Description: ${glDescription}`
            );
         }
      } catch (error) {
         console.error("GL Fetch Error:", error);
         setValidationErrors((prev) => ({
            ...prev,
            [entrySequence]: {
               ...prev[entrySequence],
               "Line G/L Account": "Invalid GL Account - not found in system",
            },
         }));
         showToaster?.(
            "error",
            "GL Account Error",
            "GL Account not found in system. Please verify the account number."
         );
      }
   };

   const handleInputChange = async (
      entrySequence: number,
      field: string,
      value: string
   ) => {
      // Hard cap discount fields to 6 digits in the INTEGER part (ignore decimals/commas)
      if (field === "Line Disc Amount" || field === "Line Disc %") {
         const numericValue = (value || "").toString().replace(/,/g, "");
         const integerPart = numericValue.split(".")[0] || "";
         if (integerPart.length > 6) {
            setValidationErrors((prev) => ({
               ...prev,
               [entrySequence]: {
                  ...prev[entrySequence],
                  [field]: `${field} CANNOT EXCEED 6 DIGITS BEFORE DECIMAL`,
               },
            }));
            return;
         } else {
            setValidationErrors((prev) => ({
               ...prev,
               [entrySequence]: {
                  ...prev[entrySequence],
                  [field]: undefined,
               },
            }));
         }
      }

      const maxLength =
         stepTwoFieldMaxLengthMap[
            field as keyof typeof stepTwoFieldMaxLengthMap
         ] ||
         fieldMaxLengthMap[field as keyof typeof fieldMaxLengthMap];
      if (maxLength && value.length > maxLength) {
         setValidationErrors((prev) => ({
            ...prev,
            [entrySequence]: {
               ...prev[entrySequence],
               [field]: `${field} CANNOT EXCEED ${maxLength} CHARACTERS`,
            },
         }));
         return;
      } else {
         setValidationErrors((prev) => ({
            ...prev,
            [entrySequence]: {
               ...prev[entrySequence],
               [field]: undefined,
            },
         }));
      }

      // Validate Line Disc Amount to only allow numbers/decimal, negative allowed only when line amount negative
      if (field === "Line Disc Amount" && value !== "") {
         const negativeAllowed = isLineAmountNegativeByEntry(entrySequence);
         const validationPattern = negativeAllowed
            ? /^-?\d*\.?\d*$/
            : /^\d*\.?\d*$/;
         if (!validationPattern.test(value)) {
            setValidationErrors((prev) => ({
               ...prev,
               [entrySequence]: {
                  ...prev[entrySequence],
                  [field]: "Please enter valid amount",
               },
            }));
            return;
         } else {
            setValidationErrors((prev) => {
               const updated = { ...prev };
               if (updated[entrySequence]) {
                  delete updated[entrySequence][field];
                  if (Object.keys(updated[entrySequence]).length === 0) {
                     delete updated[entrySequence];
                  }
               }
               return updated;
            });
         }
      }

      // Validate Line Disc % similarly
      if (field === "Line Disc %" && value !== "") {
         const negativeAllowed = isLineAmountNegativeByEntry(entrySequence);
         const validationPattern = negativeAllowed
            ? /^-?\d*\.?\d*$/
            : /^\d*\.?\d*$/;
         if (!validationPattern.test(value)) {
            setValidationErrors((prev) => ({
               ...prev,
               [entrySequence]: {
                  ...prev[entrySequence],
                  [field]: "Please enter numbers and decimal point only",
               },
            }));
            return;
         } else {
            setValidationErrors((prev) => {
               const updated = { ...prev };
               if (updated[entrySequence]) {
                  delete updated[entrySequence][field];
                  if (Object.keys(updated[entrySequence]).length === 0) {
                     delete updated[entrySequence];
                  }
               }
               return updated;
            });
         }
      }

      if (
         (field === "Line Disc Amount" || field === "Line Disc %") &&
         value === ""
      ) {
         setValidationErrors((prev) => {
            const updated = { ...prev };
            if (updated[entrySequence]) {
               delete updated[entrySequence][field];
               if (Object.keys(updated[entrySequence]).length === 0) {
                  delete updated[entrySequence];
               }
            }
            return updated;
         });
      }

      let updatedItems = lineItems.map((item) =>
         item.entrySequence === entrySequence
            ? { ...item, data: { ...item.data, [field]: value } }
            : item
      );

      // Clear the other discount field when one is populated
      if (field === "Line Disc %") {
         if (
            value &&
            value.trim() !== "" &&
            value !== "0" &&
            value !== "0.00"
         ) {
            updatedItems = updatedItems.map((item) =>
               item.entrySequence === entrySequence
                  ? {
                       ...item,
                       data: { ...item.data, "Line Disc Amount": "" },
                    }
                  : item
            );
         }
      } else if (field === "Line Disc Amount") {
         if (
            value &&
            value.trim() !== "" &&
            value !== "0" &&
            value !== "0.00"
         ) {
            updatedItems = updatedItems.map((item) =>
               item.entrySequence === entrySequence
                  ? { ...item, data: { ...item.data, "Line Disc %" : "" } }
                  : item
            );
         }
      }

      // Enforce OR between Product and Freight Amount when header Freight present
      if (field === "Freight Amount") {
         const headerFreight = parseFloat(
            (formData?.["Freight"] || "0").replace(/,/g, "")
         );
         const lineFreight = parseFloat(
            (value || "0").replace(/,/g, "")
         );
         if (
            headerFreight &&
            headerFreight !== 0 &&
            lineFreight &&
            lineFreight !== 0
         ) {
            updatedItems = updatedItems.map((item) =>
               item.entrySequence === entrySequence
                  ? {
                       ...item,
                       data: { ...item.data, "Product Amount": "" },
                    }
                  : item
            );
         }
      }

      if (field === "Product Amount") {
         const headerFreight = parseFloat(
            (formData?.["Freight"] || "0").replace(/,/g, "")
         );
         const productAmt = parseFloat(
            (value || "0").replace(/,/g, "")
         );
         if (
            headerFreight &&
            headerFreight !== 0 &&
            productAmt &&
            productAmt !== 0
         ) {
            updatedItems = updatedItems.map((item) =>
               item.entrySequence === entrySequence
                  ? {
                       ...item,
                       data: { ...item.data, "Freight Amount": "" },
                    }
                  : item
            );
         }
      }

      setLineItems(updatedItems);
      onLineItemsChange?.(updatedItems);

      if (field === "Product Amount" || field === "Freight Amount") {
         setValidationErrors((prev) => {
            const updated = { ...prev };
            if (updated[entrySequence]) {
               delete updated[entrySequence][field];
               if (Object.keys(updated[entrySequence]).length === 0) {
                  delete updated[entrySequence];
               }
            }
            return updated;
         });
      }

      if (field === "Line G/L Account") {
         const clearedDescriptionItems = updatedItems.map((item) =>
            item.entrySequence === entrySequence
               ? {
                    ...item,
                    data: {
                       ...item.data,
                       "Line G/L Description": "",
                    },
                 }
               : item
         );
         setLineItems(clearedDescriptionItems);
         onLineItemsChange?.(clearedDescriptionItems);

         if (value.length === 8 && /^\d{8}$/.test(value)) {
            validateGLAccount(entrySequence, value);
         }
      }
   };

   const genExtra = (entrySequence: number) => (
      <img
         src={itemDeleteIcon}
         alt="Delete"
         onClick={async (e) => {
            e.stopPropagation();
            await handleDeleteItem(entrySequence);
         }}
         className="delete-icon"
      />
   );

   const renderInput = (label: string, item: any, _index: number) => {
      if (label === "") {
         return <div key={`empty-${_index}`} className="field-wrapper"></div>;
      }

      const customClass =
         label === "Line Delete"
            ? "line-delete-width"
            : label === "Status"
            ? "status-width"
            : "";

      const fieldError =
         lineItemErrors?.[item.entrySequence]?.[label] ??
         lineItemErrors?.[item.id]?.[label];
      const fieldWarning =
         lineItemWarnings?.[item.entrySequence]?.[label] ??
         lineItemWarnings?.[item.id]?.[label];
      const validationError =
         validationErrors[item.entrySequence]?.[label] ||
         (label === "Product Amount"
            ? validationErrors[item.entrySequence]?.["Product Amount"]
            : "");

      return (
         <React.Fragment key={label}>
            <div className={`field-wrapper ${customClass}`}>
               <p className="sub-title">
                  {isRequired(label) && (
                     <>
                        <span className="astricks">*</span>&nbsp;
                     </>
                  )}
                  {label}
               </p>
               {label === "Status" ? (
                  <CustomSelectDropdown
                     name={label}
                     value={item.data[label] || ""}
                     onChange={(value) =>
                        handleInputChange(item.entrySequence, label, value)
                     }
                     options={STEP_TWO_STATUS_OPTIONS}
                     placeholder="Select Status"
                     allowClear={false}
                     className="status-width"
                  />
               ) : label === "Line Description" ? (
                  <CustomPrefixInput
                     name={label}
                     value={item.data[label] || ""}
                     onChange={(e) =>
                        handleInputChange(
                           item.entrySequence,
                           label,
                           e.target.value
                        )
                     }
                     placeholder={`Enter ${label.toLowerCase()}`}
                     status={
                        fieldError || validationError
                           ? "error"
                           : fieldWarning
                           ? "warning"
                           : ""
                     }
                     disabled={isFieldDisabled(label, item.data)}
                     maxLength={25}
                     showCount={true}
                  />
               ) : (
                  <CustomPrefixInput
                     name={label}
                     value={(() => {
                        const fieldValue = item.data[label] || "";
                        return fieldValue;
                     })()}
                     onChange={(e) => {
                        if (
                           label === "Product Amount" ||
                           label === "Freight Amount"
                        ) {
                           const validationResult = validateInvoiceAmount(e);
                           handleInputChange(
                              item.entrySequence,
                              label,
                              validationResult.value
                           );

                           if (validationResult.hasError) {
                              setValidationErrors((prev) => ({
                                 ...prev,
                                 [item.entrySequence]: {
                                    ...prev[item.entrySequence],
                                    [label]: "Please enter numbers only",
                                 },
                              }));

                              setTimeout(() => {
                                 setValidationErrors((prev) => {
                                    const updated = { ...prev };
                                    if (updated[item.entrySequence]) {
                                       delete updated[item.entrySequence][label];
                                       if (
                                          Object.keys(updated[item.entrySequence])
                                             .length === 0
                                       ) {
                                          delete updated[item.entrySequence];
                                       }
                                    }
                                    return updated;
                                 });
                              }, 3000);
                           } else {
                              setValidationErrors((prev) => {
                                 const updated = { ...prev };
                                 if (updated[item.entrySequence]) {
                                    delete updated[item.entrySequence][label];
                                    if (
                                       Object.keys(updated[item.entrySequence])
                                          .length === 0
                                    ) {
                                       delete updated[item.entrySequence];
                                    }
                                 }
                                 return updated;
                              });
                           }
                        } else if (
                           label === "PO No" ||
                           label === "PO Line #" ||
                           label === "Receipt No" ||
                           label === "Quantity"
                        ) {
                           if (label === "Quantity") {
                              const valueStr = e.target.value;
                              const integerPattern = /^-?\d*$/;

                              if (
                                 valueStr === "" ||
                                 integerPattern.test(valueStr)
                              ) {
                                 handleInputChange(
                                    item.entrySequence,
                                    label,
                                    valueStr
                                 );
                                 setValidationErrors((prev) => ({
                                    ...prev,
                                    [item.entrySequence]: {
                                       ...prev[item.entrySequence],
                                       [label]: undefined,
                                    },
                                 }));
                              } else {
                                 const fieldName = "Quantity";
                                 setValidationErrors((prev) => ({
                                    ...prev,
                                    [item.entrySequence]: {
                                       ...prev[item.entrySequence],
                                       [label]: `${fieldName} can only contain numeric characters`,
                                    },
                                 }));
                              }
                           } else {
                              const validationResult =
                                 validateIntegerInput(e);
                              handleInputChange(
                                 item.entrySequence,
                                 label,
                                 validationResult.value
                              );

                              if (validationResult.hasError) {
                                 const fieldName =
                                    label === "PO No"
                                       ? "PO Number"
                                       : label === "PO Line #"
                                       ? "PO Line Number"
                                       : "Receipt Number";
                                 setValidationErrors((prev) => ({
                                    ...prev,
                                    [item.entrySequence]: {
                                       ...prev[item.entrySequence],
                                       [label]: `${fieldName} can only contain numeric characters`,
                                    },
                                 }));
                              } else {
                                 setValidationErrors((prev) => ({
                                    ...prev,
                                    [item.entrySequence]: {
                                       ...prev[item.entrySequence],
                                       [label]: undefined,
                                    },
                                 }));
                              }
                           }
                        } else if (label === "Gallons") {
                           const value = e.target.value;
                           if (
                              value === "" ||
                              value === "-" ||
                              /^-?\d*\.?\d*$/.test(value)
                           ) {
                              handleInputChange(
                                 item.entrySequence,
                                 label,
                                 value
                              );
                              setValidationErrors((prev) => ({
                                 ...prev,
                                 [item.entrySequence]: {
                                    ...prev[item.entrySequence],
                                    [label]: undefined,
                                 },
                              }));
                           } else {
                              setValidationErrors((prev) => ({
                                 ...prev,
                                 [item.entrySequence]: {
                                    ...prev[item.entrySequence],
                                    [label]:
                                       "Gallons can only contain numeric characters and negative sign",
                                 },
                              }));
                           }
                        } else {
                           handleInputChange(
                              item.entrySequence,
                              label,
                              e.target.value
                           );
                        }
                     }}
                     onBlur={(e) => {
                        if (label === "Line G/L Account") {
                           validateGLAccount(
                              item.entrySequence,
                              e.target.value
                           );
                        } else if (
                           label === "Product Amount" ||
                           label === "Freight Amount"
                        ) {
                           const formatted = formatInvoiceAmountOnBlur(
                              e.target.value
                           );
                           if (formatted !== item.data[label]) {
                              handleInputChange(
                                 item.entrySequence,
                                 label,
                                 formatted
                              );
                           }
                        } else {
                           const formatted = formatAmountValue(
                              label,
                              e.target.value
                           );
                           if (formatted !== item.data[label]) {
                              handleInputChange(
                                 item.entrySequence,
                                 label,
                                 formatted
                              );
                           }
                        }
                     }}
                     placeholder={`Enter ${label.toLowerCase()}`}
                     status={
                        fieldError || validationError
                           ? "error"
                           : fieldWarning
                           ? "warning"
                           : ""
                     }
                     disabled={
                        label === "Line G/L Description" ||
                        isFieldDisabled(label, item.data)
                     }
                     maxLength={
                        label === "Line Disc %" || label === "Line Disc Amount"
                           ? undefined
                           : stepTwoFieldMaxLengthMap[
                                label as keyof typeof stepTwoFieldMaxLengthMap
                             ]
                           ? stepTwoFieldMaxLengthMap[
                                label as keyof typeof stepTwoFieldMaxLengthMap
                             ] + 1
                           : undefined
                     }
                  />
               )}
               {(fieldError || validationError) && (
                  <p className="error-message">
                     {fieldError || validationError}
                  </p>
               )}
               {fieldWarning && (
                  <p className="warning-message">{fieldWarning}</p>
               )}
            </div>
            {label === "Line Disc Amount" && (
               <span className="sub-title or-divider">OR</span>
            )}
            {label === "Product Amount" &&
               (() => {
                  const headerFreight = parseFloat(
                     (formData?.["Freight"] || "0").replace(/,/g, "")
                  );
                  return headerFreight > 0;
               })() && (
                  <span className="sub-title or-divider">OR</span>
               )}
         </React.Fragment>
      );
   };

   const getPanelHeader = (item: any, index: number) => {
      const data = item.data;
      return (
         <div className="panel-header line-item">
            <h5 className="line-item-title">Line Item {index + 1}</h5>
            {Object.keys(data).length > 0 && (
               <div className="panel-details flex-align">
                  {[
                     ["Product Amount", "Product Amount"],
                     ["G/L Account", "Line G/L Account"],
                     ["Line Description", "Line Description"],
                     ["Discount Amount", "Line Disc Amount"],
                     ["PO Number", "PO No"],
                  ].map(([label, key], idx) => (
                     <React.Fragment key={key}>
                        <div className="flex-align label-value-pair">
                           <span className="p-s separator">{label}</span>
                           <span className="sub-title">
                              {label === "Discount Amount"
                                 ? (() => {
                                      const productAmt = parseFloat(
                                         data["Product Amount"]?.replace(
                                            /,/g,
                                            ""
                                         ) || "0"
                                      );
                                      const discountPerc = parseFloat(
                                         data["Line Disc %"] || ""
                                      );
                                      const discountAmt =
                                         data["Line Disc Amount"];
                                      if (
                                         !isNaN(productAmt) &&
                                         !isNaN(discountPerc) &&
                                         discountPerc !== 0
                                      ) {
                                         const calculated =
                                            (productAmt * discountPerc) / 100;
                                         return formatCurrency(calculated);
                                      }
                                      return discountAmt
                                         ? formatCurrency(discountAmt)
                                         : "--";
                                   })()
                                 : key === "Product Amount" ||
                                   key === "Freight Amount"
                                 ? formatCurrency(data[key] || "0")
                                 : data[key] || "--"}
                           </span>
                        </div>
                        {idx < 5 && <span className="p-s separator"> | </span>}
                     </React.Fragment>
                  ))}
               </div>
            )}
         </div>
      );
   };

   return (
      <div className="form-section">
         <div className="ap-entry-container">
            <div className="content-div-container">
               <div className="content-card-header flex-between">
                  <div className="flex-column">
                     <h5 className="section-title">Detail Line Items</h5>
                     <div className="p-s separator">
                        {lineItems.length} Entries
                     </div>
                  </div>

                  <Button onClick={handleAddItem} className="ant-Button ">
                     <h6>Add Item</h6>
                  </Button>
               </div>
               <div className="vendor-divider"></div>
               <div className="collapse-container">
                  {lineItems.map((item, index) => (
                     <Collapse
                        accordion
                        activeKey={
                           activePanelKey === null ? undefined : activePanelKey
                        }
                        onChange={(key) =>
                           setActivePanelKey(key as unknown as string)
                        }
                        key={item.entrySequence}
                        className="collapse-panel"
                     >
                        <Panel
                           header={getPanelHeader(item, index)}
                           key={item.entrySequence}
                           extra={genExtra(item.entrySequence)}
                           className={`custom-collapse-panel ${
                              item.data["Status"] === "C"
                                 ? "closed-panel"
                                 : "open-panel"
                           } ${
                              lineItemErrors[item.entrySequence] ||
                              lineItemErrors[item.id]
                                 ? "panel-error"
                                 : ""
                           } ${
                              lineItemWarnings[item.entrySequence] ||
                              lineItemWarnings[item.id]
                                 ? "panel-warning"
                                 : ""
                           }`}
                        >
                           <div className="form-section-layout">
                              {INPUT_GROUPS.map((group, i) => (
                                 <div key={i} className="form-row-group">
                                    {i === 2 && (
                                       <h6 className="row-title">
                                          Receipt Information
                                       </h6>
                                    )}
                                    {i === 3 && (
                                       <h6 className="row-title">
                                          PO Information
                                       </h6>
                                    )}
                                    <div
                                       className={`form-row ${
                                          i === 1 || i === 2 || i === 3
                                             ? "reduced-width"
                                             : i === 4
                                             ? "single-narrow"
                                             : i === 5
                                             ? "last-row"
                                             : ""
                                       }`}
                                    >
                                       {group.map((label) =>
                                          renderInput(label, item, index)
                                       )}
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </Panel>
                     </Collapse>
                  ))}
               </div>
            </div>
         </div>
      </div>
   );
};

export default StepTwoForm;
