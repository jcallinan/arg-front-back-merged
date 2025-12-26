import React, { useState, useEffect } from "react";
import { Button, Collapse } from "antd";

import itemDeleteIcon from "../../../../../../../../../assets/icons/item-delete-icon.svg";
import {
   INPUT_GROUPS,
   REQUIRED_FIELDS,
   STATUS_OPTIONS,
} from "../../../../../../../constants/commonConstants";
import "../create-entry.scss";
import { createApiWithAuth } from "../../../../../../../api/apiWithAuth";
import type { StepTwoFormProps } from "../../../../../../../types/accounts-payable.types";
import {
   formatAmountValue,
   formatCurrency,
} from "../../../../../../../utils/formatters";
import {
   validateIntegerInput,
   validateNumericInput,
} from "../../../../../../../utils/validation";
import { CustomSelectDropdown } from "../../../../../../../widget-library/Dropdown";
import { CustomPrefixInput } from "../../../../../../../widget-library/Input";
import Toaster from "../../../../../../../widget-library/Toaster";

const { Panel } = Collapse;

const LineDetailForm: React.FC<
   StepTwoFormProps & {
      errors?: { [key: string]: string };
      lineItemErrors?: Record<number, Record<string, string>>;
      onLineItemsChange?: (items: any[]) => void;
      invoiceDescription?: string;
      companyNo: number;
      mode?: string;
      detailItems?: any[];
      onTotalsChange?: (totals: any) => void;
   }
> = ({
   onLineItemsChange,
   lineItemErrors = {},
   invoiceDescription = "",
   companyNo,
   mode,
   detailItems = [],

   onTotalsChange,
}) => {
   const [lineItems, setLineItems] = useState<
      {
         id: number;
         data: { [key: string]: string };
      }[]
   >([]);

   const [_notifVisible, setNotifVisible] = useState(false);
   const [notifMessage, setNotifMessage] = useState("");
   const [notifDesc, setNotifDesc] = useState("");
   const [notifType, setNotifType] = useState<"success" | "error">("error");
   const [validationErrors, setValidationErrors] = useState<
      Record<number, Record<string, string | undefined>>
   >({});

   /* ---------- NEW: total discount logger ---------- */
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

      /* --> Bubble up to parent */
      onTotalsChange?.(totals);
   }, [lineItems, onTotalsChange]);

   /* ------------------------------------------------ */

   const isFieldDisabled = (label: string, data: any) => {
      if (label === "Line Disc Amount") return !!data["Line Disc %"];
      if (label === "Line Disc %") return !!data["Line Disc Amount"];
      return false;
   };

   const isRequired = (field: string, item?: any) => {
      if (REQUIRED_FIELDS.includes(field)) {
         return true;
      }

      // If field is Receipt No and gallons is non-zero, make it required
      if (field === "Receipt No" && item) {
         const gallons = parseFloat(item.data["Gallons"]) || 0;
         return gallons !== 0;
      }

      return false;
   };

   useEffect(() => {
      if (mode === "edit" && detailItems?.length > 0) {
         const mapped = detailItems.map((item: any, idx: number) => ({
            id: idx + 1,
            data: {
               Status: item.openClosed || "Open",
               "Product Amount": formatAmountValue(
                  "Product Amount",
                  item.productAmount?.toString() || ""
               ),
               "Line Disc %":
                  item.discountPercentage && item.discountPercentage !== 0
                     ? formatAmountValue(
                          "Line Disc %",
                          item.discountPercentage.toString()
                       )
                     : "",
               "Line Disc Amount":
                  (!item.discountPercentage || item.discountPercentage === 0) &&
                  item.discountAmount &&
                  item.discountAmount !== 0
                     ? formatAmountValue(
                          "Line Disc Amount",
                          item.discountAmount.toString()
                       )
                     : "",
               "Line Description": item.lineDesc || invoiceDescription || "",
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
         onLineItemsChange?.(mapped);
      } else if (mode !== "edit" && lineItems.length === 0) {
         handleAddItem();
      }
   }, [mode, detailItems]);

   const handleAddItem = () => {
      const newItem = {
         id: lineItems.length + 1,
         data: {
            Status: "Open",
            "Product Amount": "",
            "Line Disc Amount": "",
            "Line Disc %": "",
            "Line Description": invoiceDescription || "",
            "Line G/L Account": "",
            "Line G/L Description": "",
            Gallons: "",
            "Receipt No": "",
            "PO No": "",
            "PO Line #": "",
            Project: "",
            Quantity: "",
         },
      };
      const updatedItems = [...lineItems, newItem];
      setLineItems(updatedItems);
      onLineItemsChange?.(updatedItems);
   };

   const handleDeleteItem = (id: number) => {
      const updatedItems = lineItems.filter((item) => item.id !== id);
      setLineItems(updatedItems);
      onLineItemsChange?.(updatedItems);
   };

   const handleInputChange = async (
      id: number,
      field: string,
      value: string
   ) => {
      // Validate max length of 6 characters for both discount fields
      if (
         (field === "Line Disc Amount" || field === "Line Disc %") &&
         value.length > 6
      ) {
         setValidationErrors((prev) => ({
            ...prev,
            [id]: {
               ...prev[id],
               [field]: `${field} cannot exceed 6 characters`,
            },
         }));
         return;
      }

      // Validate Line Disc Amount to only allow numbers and decimal point
      if (field === "Line Disc Amount" && value !== "") {
         const validationResult = validateNumericInput({
            target: { value },
         } as React.ChangeEvent<HTMLInputElement>);

         if (validationResult.hasError) {
            setValidationErrors((prev) => ({
               ...prev,
               [id]: {
                  ...prev[id],
                  [field]: "Please enter valid amount",
               },
            }));
            return;
         } else {
            // Clear the error if input is valid and update the value
            setValidationErrors((prev) => {
               const updated = { ...prev };
               if (updated[id]) {
                  delete updated[id][field];
                  if (Object.keys(updated[id]).length === 0) {
                     delete updated[id];
                  }
               }
               return updated;
            });
            value = validationResult.value;
         }
      }

      // Validate Line Disc % to only allow numbers and dot (.)
      if (field === "Line Disc %" && value !== "") {
         const validationResult = validateNumericInput({
            target: { value },
         } as React.ChangeEvent<HTMLInputElement>);

         if (validationResult.hasError) {
            setValidationErrors((prev) => ({
               ...prev,
               [id]: {
                  ...prev[id],
                  [field]: "Please enter numbers and decimal point only",
               },
            }));
            return;
         } else {
            // Clear the error if input is valid and update the value
            setValidationErrors((prev) => {
               const updated = { ...prev };
               if (updated[id]) {
                  delete updated[id][field];
                  if (Object.keys(updated[id]).length === 0) {
                     delete updated[id];
                  }
               }
               return updated;
            });
            value = validationResult.value;
         }
      }

      // Clear validation errors when field is empty
      if (
         (field === "Line Disc Amount" || field === "Line Disc %") &&
         value === ""
      ) {
         setValidationErrors((prev) => {
            const updated = { ...prev };
            if (updated[id]) {
               delete updated[id][field];
               if (Object.keys(updated[id]).length === 0) {
                  delete updated[id];
               }
            }
            return updated;
         });
      }

      const updatedItems = lineItems.map((item) =>
         item.id === id
            ? { ...item, data: { ...item.data, [field]: value } }
            : item
      );

      setLineItems(updatedItems);
      onLineItemsChange?.(updatedItems);

      // Existing logic for Line G/L Account description fetching
      if (field === "Line G/L Account" && value.length === 8) {
         try {
            const api = createApiWithAuth();
            const response = await api.accountPayable.getGlMaster({
               companyNo,
               glNo: Number(value),
            });
            const glDescription = response.data.items?.description || "";

            const updatedItemsWithDescription = updatedItems.map((item) =>
               item.id === id
                  ? {
                       ...item,
                       data: {
                          ...item.data,
                          "Line G/L Description": glDescription,
                       },
                    }
                  : item
            );
            setLineItems(updatedItemsWithDescription);
            onLineItemsChange?.(updatedItemsWithDescription);
         } catch (error) {
            console.error("GL Fetch Error:", error);
            setNotifType("error");
            setNotifMessage("GL Fetch Error");
            setNotifDesc("Could not fetch GL account details.");
            setNotifVisible(true);
         }
      }
   };

   const genExtra = (id: number) => (
      <img
         src={itemDeleteIcon}
         alt="Delete"
         onClick={(e) => {
            e.stopPropagation();
            handleDeleteItem(id);
         }}
         className="delete-icon"
      />
   );

   const renderInput = (label: string, item: any) => {
      const customClass = label === "Status" ? "status-width" : "";
      const fieldError =
         lineItemErrors?.[item.id]?.[label] ||
         validationErrors?.[item.id]?.[label];

      return (
         <React.Fragment key={label}>
            <div className={`field-wrapper ${customClass}`}>
               <p className="sub-title">
                  {isRequired(label, item) && (
                     <>
                        <span className="astricks">*</span>&nbsp;
                     </>
                  )}
                  {label}
               </p>
               {label === "Status" ? (
                  <CustomSelectDropdown
                     name={label}
                     value={item.data[label] || "Open"}
                     onChange={(value) =>
                        handleInputChange(item.id, label, value)
                     }
                     options={STATUS_OPTIONS}
                     placeholder="Select Status"
                     allowClear={false}
                     className="status-width"
                  />
               ) : (
                  <CustomPrefixInput
                     name={label}
                     value={item.data[label] || ""}
                     onChange={(e) => {
                        if (
                           label === "PO No" ||
                           label === "PO Line #" ||
                           label === "Receipt No" ||
                           label === "Quantity"
                        ) {
                           // Validate integer fields to only allow numeric characters (no decimals)
                           const validationResult = validateIntegerInput(e);
                           handleInputChange(
                              item.id,
                              label,
                              validationResult.value
                           );

                           // Set validation error message if user tried to enter non-numeric characters
                           if (validationResult.hasError) {
                              const fieldName =
                                 label === "PO No"
                                    ? "PO Number"
                                    : label === "PO Line #"
                                    ? "PO Line Number"
                                    : label === "Receipt No"
                                    ? "Receipt Number"
                                    : "Quantity";
                              setValidationErrors((prev) => ({
                                 ...prev,
                                 [item.id]: {
                                    ...prev[item.id],
                                    [label]: `${fieldName} can only contain numeric characters`,
                                 },
                              }));
                           } else {
                              // Clear validation error when input is valid
                              setValidationErrors((prev) => ({
                                 ...prev,
                                 [item.id]: {
                                    ...prev[item.id],
                                    [label]: undefined,
                                 },
                              }));
                           }
                        } else {
                           handleInputChange(item.id, label, e.target.value);
                        }
                     }}
                     onBlur={(e) => {
                        // Standard formatting for amount and percentage fields
                        const formatted = formatAmountValue(
                           label,
                           e.target.value
                        );
                        if (formatted !== item.data[label]) {
                           handleInputChange(item.id, label, formatted);
                        }
                     }}
                     placeholder={`Enter ${label.toLowerCase()}`}
                     status={fieldError ? "error" : ""}
                     disabled={
                        label === "Line G/L Description" ||
                        label === "Line Description" ||
                        isFieldDisabled(label, item.data)
                     }
                     maxLength={
                        label === "Line Disc Amount" || label === "Line Disc %"
                           ? 6
                           : undefined
                     }
                  />
               )}
               {fieldError && <p className="error-message">{fieldError}</p>}
            </div>
            {label === "Line Disc Amount" && (
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
                           {label === "Discount Amount" ? (
                              <span className="sub-title">
                                 {(() => {
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

                                    if (discountAmt) {
                                       return formatCurrency(discountAmt);
                                    }

                                    return "--";
                                 })()}
                              </span>
                           ) : (
                              <span className="sub-title">
                                 {key === "Product Amount"
                                    ? formatCurrency(data[key] || "0")
                                    : data[key] || "--"}
                              </span>
                           )}
                        </div>
                        {idx < 4 && <span className="p-s separator"> | </span>}
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
                        key={item.id}
                        className="collapse-panel"
                     >
                        <Panel
                           header={getPanelHeader(item, index)}
                           key={item.id}
                           extra={genExtra(item.id)}
                           className={`custom-collapse-panel ${
                              item.data["Status"] === "Closed"
                                 ? "closed-panel"
                                 : "open-panel"
                           } ${lineItemErrors[item.id] ? "panel-error" : ""}`}
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
                                          i === 2 || i === 3
                                             ? "reduced-width"
                                             : i === 4
                                             ? "single-narrow"
                                             : i === 5
                                             ? "last-row"
                                             : ""
                                       }`}
                                    >
                                       {group.map((label) =>
                                          renderInput(label, item)
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
         <Toaster
            type={notifType}
            title={notifMessage}
            subtitle={notifDesc}
            onClose={() => setNotifVisible(false)}
         />
      </div>
   );
};

export default LineDetailForm;
