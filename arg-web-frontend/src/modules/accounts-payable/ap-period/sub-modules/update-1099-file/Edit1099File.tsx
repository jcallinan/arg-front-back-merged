import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Divider } from "antd";
import { CustomPrefixInput } from "@/widget-library/Input";
import { CustomStyledButton, DefaultButton } from "@/widget-library/Buttons";
import Card from "@/widget-library/Card";
import { useApPeriodEnd } from "@/hooks/useApPeriodEnd";

import fileIcon from "@/assets/icons/card-report-type-icon.svg";
import calendarIcon from "@/assets/icons/card-payment-term-icon.svg";
import transmitterIcon from "@/assets/icons/card-transmitter-icon.svg";
import type { Update1099FileData } from "@/types/accounts-payable.types";
import "./update-1099-file-modal.scss";

interface Edit1099FileProps {
   data?: Update1099FileData | null;
}

const Edit1099File: React.FC<Edit1099FileProps> = ({ data }) => {
   const navigate = useNavigate();
   const location = useLocation();
   const editData = data || location.state?.editData;

   // AP Period End custom hook
   const { postApPeriodEndReports } = useApPeriodEnd();

   // Loading state
   const [isLoading, setIsLoading] = useState(false);

   // Extract record type safely
   const getRecordType = (recordType: string | undefined) => {
      if (!recordType) return "T";
      // If it's already a single character (T, A, B), return it
      if (recordType.length === 1) return recordType;
      // If it's in format "Record Type X", extract the X
      if (recordType.includes(" ")) {
         return recordType.split(" ")[2] || "T";
      }
      // Default fallback
      return recordType || "T";
   };

   // Form state - initialize with API data
   const [formData, setFormData] = useState({
      // Common fields
      recordType: editData?.recordType || "T",
      paymentYear: editData?.paymentYear || '',

      // Record Type T fields
      priorYearDataInd: editData?.priorYearDataInd || "",
      transControlCode: editData?.transControlCode || editData?.ctl || "",
      replacementAlphaChar: editData?.replacementAlphaChar || "",
      testFileInd: editData?.testFileInd || "",
      foreignEntityInd: editData?.foreignEntityInd || "",
      transmitterName: editData?.transmitterName || "",
      transmitterName2: editData?.transmitterName2 || "",
      companyName: editData?.companyName || "",
      companyName2: editData?.companyName2 || "",
      companyAddress: editData?.companyAddress || "",
      companyCity: editData?.companyCity || "",
      companyState: editData?.companyState || "",
      companyZipCode: editData?.companyZipCode || "",
      totalNumberOfPayees: editData?.totalNumberOfPayees || "",
      contactName: editData?.contactName || "",
      contactPhoneNumber: editData?.contactPhoneNumber || "",
      magneticTapeFileInd: editData?.magneticTapeFileInd || "",
      electronicFileName: editData?.electronicFileName || "",

      // Record Type A fields
      payerNameControl: editData?.payerNameControl || "",
      lastFilingIndicator: editData?.lastFilingIndicator || "",
      combineFedStateFiler: editData?.combineFedStateFiler || "",
      typeOfReturn: editData?.typeOfReturn || "",
      amountCodes: editData?.amountCodes || "",
      foreignEntityIndicator: editData?.foreignEntityIndicator || "",
      firstPayeeName: editData?.firstPayeeName || "",
      secondPayerName: editData?.secondPayerName || "",
      transferAgentIndicator: editData?.transferAgentIndicator || "",
      payerShippingAddress: editData?.payerShippingAddress || "",
      payerCity: editData?.payerCity || "",
      payerState: editData?.payerState || "",
      payerZipCode: editData?.payerZipCode || "",
      payerPhoneNumber: editData?.payerPhoneNumber || "",

      // Record Type B fields
      typeOfTIN: editData?.typeOfTIN || "",
      correctedReturnIndicator: editData?.correctedReturnIndicator || "",
      nameControl: editData?.nameControl || "",
      taxPayerId: editData?.taxPayerId || "",
      payerAccountNum: editData?.payerAccountNum || "",
      payerOfficeCode: editData?.payerOfficeCode || "",
      deletionIndicator: editData?.deletionIndicator || "",
      payAmt1: editData?.payAmt1 !== undefined ? editData.payAmt1 : 0,
      payAmt2: editData?.payAmt2 !== undefined ? editData.payAmt2 : 0,
      payAmt3: editData?.payAmt3 !== undefined ? editData.payAmt3 : 0,
      payAmt4: editData?.payAmt4 !== undefined ? editData.payAmt4 : 0,
      payAmt5: editData?.payAmt5 !== undefined ? editData.payAmt5 : 0,
      payAmt6: editData?.payAmt6 !== undefined ? editData.payAmt6 : 0,
      payAmt7: editData?.payAmt7 !== undefined ? editData.payAmt7 : 0,
      payAmt8: editData?.payAmt8 !== undefined ? editData.payAmt8 : 0,
      payAmt9: editData?.payAmt9 !== undefined ? editData.payAmt9 : 0,
      payAmtA: editData?.payAmtA !== undefined ? editData.payAmtA : 0,
      payAmtB: editData?.payAmtB !== undefined ? editData.payAmtB : 0,
      payAmtC: editData?.payAmtC !== undefined ? editData.payAmtC : 0,
      payAmtD: editData?.payAmtD !== undefined ? editData.payAmtD : 0,
      payAmtE: editData?.payAmtE !== undefined ? editData.payAmtE : 0,
      payAmtF: editData?.payAmtF !== undefined ? editData.payAmtF : 0,
      payAmtG: editData?.payAmtG !== undefined ? editData.payAmtG : 0,
      foreignCountryCode: editData?.foreignCountryCode || "",
      payeeAddress: editData?.payeeAddress || "",
      payeeCity: editData?.payeeCity || "",
      payeeState: editData?.payeeState || "",
      payeeZip: editData?.payeeZip || "",
      secondPayeeName: editData?.secondPayeeName || "",
      sequenceNumber:
         editData?.sequenceNumber !== undefined ? editData.sequenceNumber : "",
      // Additional B view-only/edit fields
      secondTinNotice2: (editData as any)?.secondTinNotice || "",
      foreignCountryUSPOS: (editData as any)?.foreignCountryOrUsPos || "",
      stateIncmTaxWithheld: (editData as any)?.stateIncomeTaxWithheld || "",
      localIncmTaxWithheld: (editData as any)?.localIncomeTaxWithheld || "",
      directorSalesInd: (editData as any)?.directorSalesInd || "",
      specialDataEntr: (editData as any)?.specialDataEntry || "",
      combinedFedStateCode: (editData as any)?.combinedFedStateCode || "",
      payeeLastBusiness: (editData as any)?.payeeLastOrBusinessName || "",
      payeeFirstName: (editData as any)?.payeeFirstName || "",
      payeeMiddleName: (editData as any)?.payeeMiddleName || "",
      suffix: (editData as any)?.payeeSuffix || "",
   });

   // Update form data when editData changes (when fresh API data comes in)
   useEffect(() => {
      if (editData) {
         setFormData({
            // Common fields
            recordType: editData.recordType || "T",
            paymentYear: editData.paymentYear || '',

            // Record Type T fields
            priorYearDataInd: editData.priorYearDataInd || "",
            transControlCode: editData.transControlCode || editData.ctl || "",
            replacementAlphaChar: editData.replacementAlphaChar || "",
            testFileInd: editData.testFileInd || "",
            foreignEntityInd: editData.foreignEntityInd || "",
            transmitterName: editData.transmitterName || "",
            transmitterName2: editData.transmitterName2 || "",
            companyName: editData.companyName || "",
            companyName2: editData.companyName2 || "",
            companyAddress: editData.companyAddress || "",
            companyCity: editData.companyCity || "",
            companyState: editData.companyState || "",
            companyZipCode: editData.companyZipCode || "",
            totalNumberOfPayees: editData.totalNumberOfPayees || "",
            contactName: editData.contactName || "",
            contactPhoneNumber: editData.contactPhoneNumber || "",
            magneticTapeFileInd: editData.magneticTapeFileInd || "",
            electronicFileName: editData.electronicFileName || "",

            // Record Type A fields
            payerNameControl: editData.payerNameControl || "",
            lastFilingIndicator: editData.lastFilingIndicator || "",
            combineFedStateFiler: editData.combineFedStateFiler || "",
            typeOfReturn: editData.typeOfReturn || "",
            amountCodes: editData.amountCodes || "",
            foreignEntityIndicator: editData.foreignEntityIndicator || "",
            firstPayeeName: editData.firstPayeeName || "",
            secondPayerName: editData.secondPayerName || "",
            transferAgentIndicator: editData.transferAgentIndicator || "",
            payerShippingAddress: editData.payerShippingAddress || "",
            payerCity: editData.payerCity || "",
            payerState: editData.payerState || "",
            payerZipCode: editData.payerZipCode || "",
            payerPhoneNumber: editData.payerPhoneNumber || "",

            // Record Type B fields
            typeOfTIN: editData.typeOfTIN || "",
            correctedReturnIndicator: editData.correctedReturnIndicator || "",
            nameControl: editData.nameControl || "",
            taxPayerId: editData.taxPayerId || "",
            payerAccountNum: editData.payerAccountNum || "",
            payerOfficeCode: editData.payerOfficeCode || "",
            deletionIndicator: editData.deletionIndicator || "",
            payAmt1: editData.payAmt1 !== undefined ? editData.payAmt1 : 0,
            payAmt2: editData.payAmt2 !== undefined ? editData.payAmt2 : 0,
            payAmt3: editData.payAmt3 !== undefined ? editData.payAmt3 : 0,
            payAmt4: editData.payAmt4 !== undefined ? editData.payAmt4 : 0,
            payAmt5: editData.payAmt5 !== undefined ? editData.payAmt5 : 0,
            payAmt6: editData.payAmt6 !== undefined ? editData.payAmt6 : 0,
            payAmt7: editData.payAmt7 !== undefined ? editData.payAmt7 : 0,
            payAmt8: editData.payAmt8 !== undefined ? editData.payAmt8 : 0,
            payAmt9: editData.payAmt9 !== undefined ? editData.payAmt9 : 0,
            payAmtA: editData.payAmtA !== undefined ? editData.payAmtA : 0,
            payAmtB: editData.payAmtB !== undefined ? editData.payAmtB : 0,
            payAmtC: editData.payAmtC !== undefined ? editData.payAmtC : 0,
            payAmtD: editData.payAmtD !== undefined ? editData.payAmtD : 0,
            payAmtE: editData.payAmtE !== undefined ? editData.payAmtE : 0,
            payAmtF: editData.payAmtF !== undefined ? editData.payAmtF : 0,
            payAmtG: editData.payAmtG !== undefined ? editData.payAmtG : 0,
            foreignCountryCode: editData.foreignCountryCode || "",
            payeeAddress: editData.payeeAddress || "",
            payeeCity: editData.payeeCity || "",
            payeeState: editData.payeeState || "",
            payeeZip: editData.payeeZip || "",
            secondPayeeName: editData.secondPayeeName || "",
            sequenceNumber:
               editData.sequenceNumber !== undefined
                  ? editData.sequenceNumber
                  : "",
            // Additional blank fields
            // blank01: editData.blank01 || "",
            // blank05: editData.blank05 || "",
            // blank06: editData.blank06 || "",
            // Additional B view-only/edit fields
            secondTinNotice2: (editData as any)?.secondTinNotice2 || "",
            foreignCountryUSPOS: (editData as any)?.foreignCountryUSPOS || "",
            stateIncmTaxWithheld: (editData as any)?.stateIncmTaxWithheld || "",
            localIncmTaxWithheld: (editData as any)?.localIncmTaxWithheld || "",
            directorSalesInd: (editData as any)?.directorSalesInd || "",
            specialDataEntr: (editData as any)?.specialDataEntr || "",
            combinedFedStateCode: (editData as any)?.combinedFedStateCode || "",
            payeeLastBusiness: (editData as any)?.payeeLastBusiness || "",
            payeeFirstName: (editData as any)?.payeeFirstName || "",
            payeeMiddleName: (editData as any)?.payeeMiddleName || "",
            suffix: (editData as any)?.suffix || "",
         });
      }
   }, [editData]);

   // Get record type for display
   const recordType = getRecordType(editData?.recordType);

   const cardData = [
      {
         icon: <img src={fileIcon} alt="Record Type" />,
         label: "Record Type",
         value: recordType,
      },
      ...(recordType === "B" ? [{
         icon: <img src={calendarIcon} alt="Name Control" />,
         label: "Name Control",
         value: formData.nameControl || editData?.nameControl || "-",
      }] : []),
      {
         icon: <img src={calendarIcon} alt="Payment Year" />,
         label: "Payment Year",
         value: (editData?.paymentYear ?? formData.paymentYear ?? "")?.toString?.() ?? "",
      },
      {
         icon: <img src={transmitterIcon} alt="Transmitter ID" />,
         label:
            recordType === "T"
               ? "Transmitter ID"
               : "Tax Payer ID",
         value:
            (editData?.taxPayerId ?? editData?.transmitterId ?? editData?.tin ?? "")?.toString?.() ?? "",
      },
   ];

   // Inline validation errors per field
   const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
   const validationTimeoutRef = useRef<{ [key: string]: NodeJS.Timeout }>({});

   const setFieldError = (field: string, error: string) => {
      setFieldErrors((prev) => ({ ...prev, [field]: error }));
   };

   const clearFieldError = (field: string) => {
      setFieldErrors((prev) => {
         const next = { ...prev };
         delete next[field];
         return next;
      });
   };

   // Constraints map for inline validation
   const FIELD_CONSTRAINTS: Record<string, { max: number; numericOnly?: boolean; noLeadingZero?: boolean; decimalAllowed?: boolean; decimalScale?: number }> = {
      // Record Type T
      priorYearDataInd: { max: 1 },
      transControlCode: { max: 5 },
      replacementAlphaChar: { max: 2 },
      testFileInd: { max: 1 },
      foreignEntityInd: { max: 1 },
      transmitterName: { max: 40 },
      transmitterName2: { max: 40 },
      companyName: { max: 40 },
      companyName2: { max: 40 },
      companyAddress: { max: 40 },
      companyCity: { max: 40 },
      companyState: { max: 2 },
      companyZipCode: { max: 9, numericOnly: true },
      totalNumberOfPayees: { max: 8, numericOnly: true },
      contactName: { max: 40 },
      contactPhoneNumber: { max: 15 },

      // Record Type A
      payerNameControl: { max: 4 },
      lastFilingIndicator: { max: 1 },
      combineFedStateFiler: { max: 1 },
      typeOfReturn: { max: 2 },
      amountCodes: { max: 16 },
      foreignEntityIndicator: { max: 1 },
      firstPayeeName: { max: 40 },
      secondPayerName: { max: 40 },
      transferAgentIndicator: { max: 1 },
      payerShippingAddress: { max: 40 },
      payerCity: { max: 40 },
      payerState: { max: 2 },
      payerZipCode: { max: 9, numericOnly: true },
      payerPhoneNumber: { max: 15 },

      // Record Type B
      typeOfTIN: { max: 1 },
      correctedReturnIndicator: { max: 1 },
      payerAccountNum: { max: 20 },
      payerOfficeCode: { max: 4 },
      foreignCountryCode: { max: 1, numericOnly: true },
      sequenceNumber: { max: 8, numericOnly: true },
      secondPayeeName: { max: 40 },
      payeeAddress: { max: 40 },
      payeeCity: { max: 40 },
      payeeState: { max: 2 },
      payeeZip: { max: 9, numericOnly: true },

      // Record Type B - additional fields (UI labels given in view modal)
      secondTinNotice2: { max: 1 },
      foreignCountryUSPOS: { max: 40 },
      directorSalesInd: { max: 1 },
      specialDataEntr: { max: 60 },
      stateIncmTaxWithheld: { max: 12, decimalAllowed: true, decimalScale: 2, noLeadingZero: true },
      localIncmTaxWithheld: { max: 12, decimalAllowed: true, decimalScale: 2, noLeadingZero: true },
      combinedFedStateCode: { max: 2 },
      payeeLastBusiness: { max: 30 },
      payeeFirstName: { max: 20 },
      payeeMiddleName: { max: 20 },
      suffix: { max: 4 },

      // Amount fields (allow decimals, max 12 digits excluding '.', up to 2 decimals, no leading zero if multi-digit)
      payAmt1: { max: 12, decimalAllowed: true, decimalScale: 2, noLeadingZero: true },
      payAmt2: { max: 12, decimalAllowed: true, decimalScale: 2, noLeadingZero: true },
      payAmt3: { max: 12, decimalAllowed: true, decimalScale: 2, noLeadingZero: true },
      payAmt4: { max: 12, decimalAllowed: true, decimalScale: 2, noLeadingZero: true },
      payAmt5: { max: 12, decimalAllowed: true, decimalScale: 2, noLeadingZero: true },
      payAmt6: { max: 12, decimalAllowed: true, decimalScale: 2, noLeadingZero: true },
      payAmt7: { max: 12, decimalAllowed: true, decimalScale: 2, noLeadingZero: true },
      payAmt8: { max: 12, decimalAllowed: true, decimalScale: 2, noLeadingZero: true },
      payAmt9: { max: 12, decimalAllowed: true, decimalScale: 2, noLeadingZero: true },
      payAmtA: { max: 12, decimalAllowed: true, decimalScale: 2, noLeadingZero: true },
      payAmtB: { max: 12, decimalAllowed: true, decimalScale: 2, noLeadingZero: true },
      payAmtC: { max: 12, decimalAllowed: true, decimalScale: 2, noLeadingZero: true },
      payAmtD: { max: 12, decimalAllowed: true, decimalScale: 2, noLeadingZero: true },
      payAmtE: { max: 12, decimalAllowed: true, decimalScale: 2, noLeadingZero: true },
      payAmtF: { max: 12, decimalAllowed: true, decimalScale: 2, noLeadingZero: true },
      payAmtG: { max: 12, decimalAllowed: true, decimalScale: 2, noLeadingZero: true },
   };

   // Handle input changes
   const handleInputChange =
      (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
         const constraint = FIELD_CONSTRAINTS[field];
         let next = e.target.value ?? "";
         const currentValue = (formData as any)?.[field]?.toString?.() ?? "";

         if (constraint) {
            const currentDigitsLen = (currentValue || "").replace(/\./g, "").length;
            const nextDigitsLen = (next || "").replace(/\./g, "").length;

            // If already at max digits and user tries to add more digits, block
            if (
               currentDigitsLen >= constraint.max &&
               nextDigitsLen > currentDigitsLen
            ) {
               setFieldError(field, `Only ${constraint.max} characters are allowed`);
               if (validationTimeoutRef.current[field]) {
                  clearTimeout(validationTimeoutRef.current[field]);
               }
               validationTimeoutRef.current[field] = setTimeout(() => {
                  clearFieldError(field);
                  delete validationTimeoutRef.current[field];
               }, 3000);
               return;
            }

            if (constraint.numericOnly && /[^0-9]/.test(next)) {
               setFieldError(field, "Please enter numbers only");
               if (validationTimeoutRef.current[field]) {
                  clearTimeout(validationTimeoutRef.current[field]);
               }
               validationTimeoutRef.current[field] = setTimeout(() => {
                  clearFieldError(field);
                  delete validationTimeoutRef.current[field];
               }, 3000);
               return;
            }

            if (constraint.decimalAllowed) {
               // Allow only digits and a single decimal point
               if (!/^\d*(?:\.\d*)?$/.test(next)) {
                  setFieldError(field, "Only numbers and a single decimal point are allowed");
                  if (validationTimeoutRef.current[field]) {
                     clearTimeout(validationTimeoutRef.current[field]);
                  }
                  validationTimeoutRef.current[field] = setTimeout(() => {
                     clearFieldError(field);
                     delete validationTimeoutRef.current[field];
                  }, 3000);
                  return;
               }
               // Enforce decimal scale (e.g., 2 places)
               const parts = next.split(".");
               if (parts.length === 2 && constraint.decimalScale !== undefined) {
                  const frac = parts[1] || "";
                  if (frac.length > constraint.decimalScale) {
                     setFieldError(field, `Up to ${constraint.decimalScale} decimal places allowed`);
                     if (validationTimeoutRef.current[field]) {
                        clearTimeout(validationTimeoutRef.current[field]);
                     }
                     validationTimeoutRef.current[field] = setTimeout(() => {
                        clearFieldError(field);
                        delete validationTimeoutRef.current[field];
                     }, 3000);
                     return;
                  }
               }
            }

            // Disallow leading zero for multi-digit numeric values (e.g., 011111...)
            if (constraint.noLeadingZero && /^0\d+/.test(next)) {
               setFieldError(field, "Value cannot start with 0");
               if (validationTimeoutRef.current[field]) {
                  clearTimeout(validationTimeoutRef.current[field]);
               }
               validationTimeoutRef.current[field] = setTimeout(() => {
                  clearFieldError(field);
                  delete validationTimeoutRef.current[field];
               }, 3000);
               return;
            }

            // Hard limit on total digits (excluding '.')
            if (nextDigitsLen > constraint.max) {
               setFieldError(field, `Only ${constraint.max} characters are allowed`);
               if (validationTimeoutRef.current[field]) {
                  clearTimeout(validationTimeoutRef.current[field]);
               }
               validationTimeoutRef.current[field] = setTimeout(() => {
                  clearFieldError(field);
                  delete validationTimeoutRef.current[field];
               }, 3000);
               return;
            }
         }

         clearFieldError(field);
         if (validationTimeoutRef.current[field]) {
            clearTimeout(validationTimeoutRef.current[field]);
            delete validationTimeoutRef.current[field];
         }
         setFormData((prev) => ({
            ...prev,
            [field]: next,
         }));
      };

   const renderError = (field: string) =>
      fieldErrors[field] ? (
         <p className="error-message">{fieldErrors[field]}</p>
      ) : null;

   // Handle cancel
   const handleCancel = () => {
      navigate(-1);
   };

   // Helper function to create payload for Record Type T
   const createRecordTypeT = () => ({
      recordType: "T",
      paymentYear: formData.paymentYear || 0,
      priorYearDataInd: (formData.priorYearDataInd || "")
         .toString()
         .substring(0, 1),
      transmitterId:
         formData.taxPayerId ||
         editData?.taxPayerId ||
         editData?.transmitterId ||
         parseInt(editData?.tin || ""),
      transControlCode: (formData.transControlCode || "")
         .toString()
         .substring(0, 5),
      replacementAlphaChar: (formData.replacementAlphaChar || "")
         .toString()
         .substring(0, 2),
      blank01: "",
      testFileInd: (formData.testFileInd || "").toString().substring(0, 1),
      foreignEntityInd: (formData.foreignEntityInd || "")
         .toString()
         .substring(0, 1),
      transmitterName: (formData.transmitterName || "")
         .toString()
         .substring(0, 40),
      transmitterName2: (formData.transmitterName2 || "")
         .toString()
         .substring(0, 40),
      companyName: (formData.companyName || "").toString().substring(0, 40),
      companyName2: (formData.companyName2 || "").toString().substring(0, 40),
      companyAddress: (formData.companyAddress || "")
         .toString()
         .substring(0, 40),
      companyCity: (formData.companyCity || "").toString().substring(0, 40),
      companyState: (formData.companyState || "").toString().substring(0, 2),
      companyZipCode: (formData.companyZipCode || "")
         .toString()
         .substring(0, 9),
      blank02: "",
      totalNumberOfPayees: Number(formData.totalNumberOfPayees || 0),
      contactName: (formData.contactName || "").toString().substring(0, 40),
      contactPhoneNumber: (formData.contactPhoneNumber || "")
         .toString()
         .substring(0, 15),
      contactEmail: "",
      blank03: "",
      sequenceNumber: formData.sequenceNumber || 0,
      blank04: "",
      vendorInd: "",
      // blank05: "",
      // blank06: "",
   });

   // Helper function to create payload for Record Type A
   const createRecordTypeA = () => ({
      recordType: "A",
      paymentYear: formData.paymentYear || 0,
      combineFedStateFiler: (formData.combineFedStateFiler || "")
         .toString()
         .substring(0, 1),
      blank01: "",
      taxPayerId:
         formData.taxPayerId ||
         editData?.taxPayerId ||
         parseInt(editData?.tin || ""),
      payerNameControl: (formData.payerNameControl || "")
         .toString()
         .substring(0, 4),
      lastFilingIndicator: (formData.lastFilingIndicator || "")
         .toString()
         .substring(0, 1),
      typeOfReturn: (formData.typeOfReturn || "").toString().substring(0, 2),
      amountCodes: (formData.amountCodes || "").toString().substring(0, 16),
      blank02: "",
      foreignEntityIndicator: (formData.foreignEntityIndicator || "")
         .toString()
         .substring(0, 1),
      firstPayeeName: (formData.firstPayeeName || "")
         .toString()
         .substring(0, 40),
      secondPayerName: (formData.secondPayerName || "")
         .toString()
         .substring(0, 40),
      transferAgentIndicator: (formData.transferAgentIndicator || "")
         .toString()
         .substring(0, 1),
      payerShippingAddress: (formData.payerShippingAddress || "")
         .toString()
         .substring(0, 40),
      payerCity: (formData.payerCity || "").toString().substring(0, 40),
      payerState: (formData.payerState || "").toString().substring(0, 2),
      payerZipCode: (formData.payerZipCode || "").toString().substring(0, 9),
      payerPhoneNumber: (formData.payerPhoneNumber || "")
         .toString()
         .substring(0, 15),
      blank03: "",
      blank04: "",
      sequenceNumber: formData.sequenceNumber || '',
      // blank05: "",
      // blank06: "",
   });

   // Helper function to create payload for Record Type B
   const createRecordTypeB = () => ({
      recordType: "B",
      paymentYear: formData.paymentYear || "",
      correctedReturnIndicator: (formData.correctedReturnIndicator || "")
         .toString()
         .substring(0, 1),
      nameControl: (formData.nameControl || "").toString().substring(0, 4),
      typeOfTIN: (formData.typeOfTIN || "").toString().substring(0, 1),
      taxPayerId: formData.taxPayerId || editData?.taxPayerId || "",
      payerAccountNum: (formData.payerAccountNum || "")
         .toString()
         .substring(0, 20),
      payerOfficeCode: (formData.payerOfficeCode || "")
         .toString()
         .substring(0, 4),
      deletionIndicator: (formData.deletionIndicator || "")
         .toString()
         .substring(0, 1),
    //  blank01: (formData.blank01 || "").toString().substring(0, 9),
      payAmt1: formData.payAmt1 || 0,
      payAmt2: formData.payAmt2 || 0,
      payAmt3: formData.payAmt3 || 0,
      payAmt4: formData.payAmt4 || 0,
      payAmt5: formData.payAmt5 || 0,
      payAmt6: formData.payAmt6 || 0,
      payAmt7: formData.payAmt7 || 0,
      payAmt8: formData.payAmt8 || 0,
      payAmt9: formData.payAmt9 || 0,
      payAmtA: formData.payAmtA || 0,
      payAmtB: formData.payAmtB || 0,
      payAmtC: formData.payAmtC || 0,
      payAmtD: formData.payAmtD || 0,
      payAmtE: formData.payAmtE || 0,
      payAmtF: formData.payAmtF || 0,
      payAmtG: formData.payAmtG || 0,
      foreignCountryCode: (formData.foreignCountryCode || "0")
         .toString()
         .substring(0, 1),
      firstPayeeName: (formData.firstPayeeName || "")
         .toString()
         .substring(0, 40),
      secondPayeeName: (formData.secondPayeeName || "")
         .toString()
         .substring(0, 40),
      // Additional B fields aligned with server DTO
      secondTinNotice: (formData.secondTinNotice2 || "").toString().substring(0, 1),
      foreignCountryOrUsPos: (formData.foreignCountryUSPOS || "").toString().substring(0, 40),
      directorSalesInd: (formData.directorSalesInd || "").toString().substring(0, 1),
      specialDataEntry: (formData.specialDataEntr || "").toString().substring(0, 60),
      stateIncomeTaxWithheld: formData.stateIncmTaxWithheld,
      localIncomeTaxWithheld: formData.localIncmTaxWithheld,
      combinedFedStateCode: (formData.combinedFedStateCode || "").toString().substring(0, 2),
      payeeLastOrBusinessName: (formData.payeeLastBusiness || "").toString().substring(0, 30),
      payeeFirstName: (formData.payeeFirstName || "").toString().substring(0, 20),
      payeeMiddleName: (formData.payeeMiddleName || "").toString().substring(0, 20),
      payeeSuffix: (formData.suffix || "").toString().substring(0, 4),
      payeeAddress: (formData.payeeAddress || "").toString().substring(0, 40),
      payeeCity: (formData.payeeCity || "").toString().substring(0, 40),
      payeeState: (formData.payeeState || "").toString().substring(0, 2),
      payeeZip: (formData.payeeZip || "").toString().substring(0, 9),
      // blank05: (formData.blank05 || "").toString().substring(0, 1),
      sequenceNumber: formData.sequenceNumber,
     // blank06: (formData.blank06 || "").toString().substring(0, 36),
   });

   // Handle update
   const handleUpdate = async () => {
      try {
         setIsLoading(true);

         // Determine record type from editData
         const recordType = getRecordType(editData?.recordType);

         // Create appropriate payload based on record type
         let recordData;
         switch (recordType) {
            case "T":
               recordData = createRecordTypeT();
               break;
            case "A":
               recordData = createRecordTypeA();
               break;
            case "B":
               recordData = createRecordTypeB();
               break;
            default:
               recordData = createRecordTypeT(); // Default to T
         }

         const payload = {
            tin:
               editData?.tin !== "-"
                  ? editData?.tin || ""
                  : "",
            ctl: ((editData?.ctl || "") as string).toString().substring(0, 5),
            data: recordData,
         };

         const response = await postApPeriodEndReports(payload);

         if (response) {
            navigate("/accounts-payable/ap-period/update-1099-file");
         }
      } catch (error) {
         console.error("Error updating 1099 File:", error);
         // Server-side validation handling: map error.details to inline field errors
         try {
            // Support multiple error shapes
            const errAny: any = error as any;
            const errorData =
               errAny?.response?.data?.error ||
               errAny?.error?.error ||
               errAny?.error ||
               errAny;

            const details: Array<{ field?: string; message?: string }> =
               errorData?.details || [];

            if (Array.isArray(details) && details.length > 0) {
               const nextErrors: Record<string, string> = {};
               const serverToLocalFieldMap: Record<string, string> = {
                  secondTinNotice: "secondTinNotice2",
                  foreignCountryOrUsPos: "foreignCountryUSPOS",
                  specialDataEntry: "specialDataEntr",
                  stateIncomeTaxWithheld: "stateIncmTaxWithheld",
                  localIncomeTaxWithheld: "localIncmTaxWithheld",
                  payeeLastOrBusinessName: "payeeLastBusiness",
                  payeeSuffix: "suffix",
               };

               details.forEach((d) => {
                  if (!d) return;
                  const rawField = (d.field || "").toString();
                  // Normalize server field like "data.payAmt1" -> "payAmt1"
                  const fieldKey = rawField.replace(/^data\./, "");
                  const localKey = serverToLocalFieldMap[fieldKey] || fieldKey;
                  if (localKey) {
                     nextErrors[localKey] = d.message || "Invalid value";
                  }
               });

               // Apply collected inline errors
               if (Object.keys(nextErrors).length > 0) {
                  setFieldErrors((prev) => ({ ...prev, ...nextErrors }));
               }
            }
         } catch {}
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="voucherentry-container">
         <h3 className="title">Edit 1099 File </h3>

         <div className="content-div-container update-1099-modal">
            {/* Cards Section */}
            <div className="card-grid-container">
               {cardData.map((card, idx) => (
                  <Card
                     key={idx}
                     icon={card.icon}
                     label={card.label}
                     value={card.value}
                  />
               ))}
            </div>

            <Divider />

            {/* Form Fields */}
            <div className="voucher-section">
               {/* Row 1 (only for Record Type T) */}
               {recordType === "T" && (
               <div className="form-section-layout">
                  <div className="flex gap-16">
                     <div className="field-container flex-1">
                        <p className="sub-title">Prior Year Data Ind</p>
                        <CustomPrefixInput
                           name="priorYearDataInd"
                           placeholder=""
                           value={formData.priorYearDataInd}
                           onChange={handleInputChange("priorYearDataInd")}
                           className="custom-input"
                        />
                        {renderError("priorYearDataInd")}
                     </div>
                     <div className="field-container flex-1">
                        <p className="sub-title">Trans Control Code 2</p>
                        <CustomPrefixInput
                           name="transControlCode"
                           placeholder="Enter Trans Control Code"
                           value={formData.transControlCode}
                           onChange={handleInputChange("transControlCode")}
                           className="custom-input"
                        />
                        {renderError("transControlCode")}
                     </div>
                     <div className="field-container flex-1">
                        <p className="sub-title">Replacement Alpha Char</p>
                        <CustomPrefixInput
                           name="replacementAlphaChar"
                           placeholder=""
                           value={formData.replacementAlphaChar}
                           onChange={handleInputChange("replacementAlphaChar")}
                           className="custom-input"
                        />
                        {renderError("replacementAlphaChar")}
                     </div>
                     <div className="field-container flex-1">
                        <p className="sub-title">Test File Ind</p>
                        <CustomPrefixInput
                           name="testFileInd"
                           placeholder=""
                           value={formData.testFileInd}
                           onChange={handleInputChange("testFileInd")}
                           className="custom-input"
                        />
                        {renderError("testFileInd")}
                     </div>
                  </div>
               </div>
               )}

               {/* Row 2 (only for Record Type T) */}
               {recordType === "T" && (
               <div className="form-section-layout">
                  <div className="flex gap-16">
                     <div className="field-container flex-1">
                        <p className="sub-title">Foreign Entity Ind</p>
                        <CustomPrefixInput
                           name="foreignEntityInd"
                           placeholder=""
                           value={formData.foreignEntityInd}
                           onChange={handleInputChange("foreignEntityInd")}
                           className="custom-input"
                        />
                        {renderError("foreignEntityInd")}
                     </div>
                     <div className="field-container flex-1">
                        <p className="sub-title">
                           {recordType === "T"
                              ? "Transmitter Name"
                              : recordType === "A"
                              ? "First Payee Name"
                              : "First Payee Name"}
                        </p>
                        <CustomPrefixInput
                           name={
                              recordType === "T"
                                 ? "transmitterName"
                                 : recordType === "A"
                                 ? "firstPayeeName"
                                 : "firstPayeeName"
                           }
                           placeholder={`Enter ${
                              recordType === "T"
                                 ? "Transmitter Name"
                                 : "Payee Name"
                           }`}
                           value={
                              recordType === "T"
                                 ? formData.transmitterName
                                 : recordType === "A"
                                 ? formData.firstPayeeName
                                 : formData.firstPayeeName
                           }
                           onChange={
                              recordType === "T"
                                 ? handleInputChange("transmitterName")
                                 : recordType === "A"
                                 ? handleInputChange("firstPayeeName")
                                 : handleInputChange("firstPayeeName")
                           }
                           className="custom-input"
                        />
                        {recordType === "T" ? renderError("transmitterName") : renderError("firstPayeeName")}
                     </div>
                     <div className="field-container flex-1">
                        <p className="sub-title">
                           {recordType === "T"
                              ? "Transmitter Name 2"
                              : recordType === "A"
                              ? "Second Payer Name"
                              : "Second Payee Name"}
                        </p>
                        <CustomPrefixInput
                           name={
                              recordType === "T"
                                 ? "transmitterName2"
                                 : recordType === "A"
                                 ? "secondPayerName"
                                 : "secondPayeeName"
                           }
                           placeholder=""
                           value={
                              recordType === "T"
                                 ? formData.transmitterName2
                                 : recordType === "A"
                                 ? formData.secondPayerName
                                 : formData.secondPayeeName
                           }
                           onChange={
                              recordType === "T"
                                 ? handleInputChange("transmitterName2")
                                 : recordType === "A"
                                 ? handleInputChange("secondPayerName")
                                 : handleInputChange("secondPayeeName")
                           }
                           className="custom-input"
                        />
                        {recordType === "T" ? renderError("transmitterName2") : recordType === "A" ? renderError("secondPayerName") : renderError("secondPayeeName")}
                     </div>
                     <div className="field-container flex-1">
                        <p className="sub-title">Company Name</p>
                        <CustomPrefixInput
                           name="companyName"
                           placeholder="Enter Company Name"
                           value={formData.companyName}
                           onChange={handleInputChange("companyName")}
                           className="custom-input"
                        />
                        {renderError("companyName")}
                     </div>
                  </div>
               </div>
               )}

               {/* Row 3 (only for Record Type T) */}
               {recordType === "T" && (
               <div className="form-section-layout">
                  <div className="flex gap-16">
                     <div className="field-container flex-1">
                        <p className="sub-title">Company Name2</p>
                        <CustomPrefixInput
                           name="companyName2"
                           placeholder=""
                           value={formData.companyName2}
                           onChange={handleInputChange("companyName2")}
                           className="custom-input"
                        />
                        {renderError("companyName2")}
                     </div>
                     <div className="field-container flex-1">
                        <p className="sub-title">
                           {recordType === "T"
                              ? "Company Address"
                              : recordType === "A"
                              ? "Payer Shipping Address"
                              : "Payee Address"}
                        </p>
                        <CustomPrefixInput
                           name={
                              recordType === "T"
                                 ? "companyAddress"
                                 : recordType === "A"
                                 ? "payerShippingAddress"
                                 : "payeeAddress"
                           }
                           placeholder={`Enter ${
                              recordType === "T"
                                 ? "Company"
                                 : recordType === "A"
                                 ? "Payer"
                                 : "Payee"
                           } Address`}
                           value={
                              recordType === "T"
                                 ? formData.companyAddress
                                 : recordType === "A"
                                 ? formData.payerShippingAddress
                                 : formData.payeeAddress
                           }
                           onChange={
                              recordType === "T"
                                 ? handleInputChange("companyAddress")
                                 : recordType === "A"
                                 ? handleInputChange("payerShippingAddress")
                                 : handleInputChange("payeeAddress")
                           }
                           className="custom-input"
                        />
                        {recordType === "T" ? renderError("companyAddress") : recordType === "A" ? renderError("payerShippingAddress") : renderError("payeeAddress")}
                     </div>
                     <div className="field-container flex-1">
                        <p className="sub-title">
                           {recordType === "T"
                              ? "Company City"
                              : recordType === "A"
                              ? "Payer City"
                              : "Payee City"}
                        </p>
                        <CustomPrefixInput
                           name={
                              recordType === "T"
                                 ? "companyCity"
                                 : recordType === "A"
                                 ? "payerCity"
                                 : "payeeCity"
                           }
                           placeholder={`Enter ${
                              recordType === "T"
                                 ? "Company"
                                 : recordType === "A"
                                 ? "Payer"
                                 : "Payee"
                           } City`}
                           value={
                              recordType === "T"
                                 ? formData.companyCity
                                 : recordType === "A"
                                 ? formData.payerCity
                                 : formData.payeeCity
                           }
                           onChange={
                              recordType === "T"
                                 ? handleInputChange("companyCity")
                                 : recordType === "A"
                                 ? handleInputChange("payerCity")
                                 : handleInputChange("payeeCity")
                           }
                           className="custom-input"
                        />
                        {recordType === "T" ? renderError("companyCity") : recordType === "A" ? renderError("payerCity") : renderError("payeeCity")}
                     </div>
                     <div className="field-container flex-1">
                        <p className="sub-title">
                           {recordType === "T"
                              ? "Company State"
                              : recordType === "A"
                              ? "Payer State"
                              : "Payee State"}
                        </p>
                        <CustomPrefixInput
                           name={
                              recordType === "T"
                                 ? "companyState"
                                 : recordType === "A"
                                 ? "payerState"
                                 : "payeeState"
                           }
                           placeholder={`Enter ${
                              recordType === "T"
                                 ? "Company"
                                 : recordType === "A"
                                 ? "Payer"
                                 : "Payee"
                           } State`}
                           value={
                              recordType === "T"
                                 ? formData.companyState
                                 : recordType === "A"
                                 ? formData.payerState
                                 : formData.payeeState
                           }
                           onChange={
                              recordType === "T"
                                 ? handleInputChange("companyState")
                                 : recordType === "A"
                                 ? handleInputChange("payerState")
                                 : handleInputChange("payeeState")
                           }
                           className="custom-input"
                        />
                        {recordType === "T" ? renderError("companyState") : recordType === "A" ? renderError("payerState") : renderError("payeeState")}
                     </div>
                  </div>
               </div>
               )}

               {/* Row 4 (only for Record Type T) */}
               {recordType === "T" && (
               <div className="form-section-layout">
                  <div className="flex gap-16">
                     <div className="field-container flex-1">
                        <p className="sub-title">
                           {recordType === "T"
                              ? "Company Zip Code"
                              : recordType === "A"
                              ? "Payer Zip Code"
                              : "Payee Zip Code"}
                        </p>
                        <CustomPrefixInput
                           name={
                              recordType === "T"
                                 ? "companyZipCode"
                                 : recordType === "A"
                                 ? "payerZipCode"
                                 : "payeeZip"
                           }
                           placeholder="Enter Zip Code"
                           value={
                              recordType === "T"
                                 ? formData.companyZipCode
                                 : recordType === "A"
                                 ? formData.payerZipCode
                                 : formData.payeeZip
                           }
                           onChange={
                              recordType === "T"
                                 ? handleInputChange("companyZipCode")
                                 : recordType === "A"
                                 ? handleInputChange("payerZipCode")
                                 : handleInputChange("payeeZip")
                           }
                           className="custom-input"
                        />
                        {recordType === "T" ? renderError("companyZipCode") : recordType === "A" ? renderError("payerZipCode") : renderError("payeeZip")}
                     </div>
                     <div className="field-container flex-1">
                        <p className="sub-title">Total Number of Payees</p>
                        <CustomPrefixInput
                           name="totalNumberOfPayees"
                           placeholder="Enter Total Number"
                           value={formData.totalNumberOfPayees}
                           onChange={handleInputChange("totalNumberOfPayees")}
                           className="custom-input"
                        />
                        {renderError("totalNumberOfPayees")}
                     </div>
                     <div className="field-container flex-1">
                        <p className="sub-title">Contact Name</p>
                        <CustomPrefixInput
                           name="contactName"
                           placeholder="Enter Contact Name"
                           value={formData.contactName}
                           onChange={handleInputChange("contactName")}
                           className="custom-input"
                        />
                        {renderError("contactName")}
                     </div>
                     <div className="field-container flex-1">
                        <p className="sub-title">
                           {recordType === "T"
                              ? "Contact Phone Number"
                              : recordType === "A"
                              ? "Payer Phone Number"
                              : "Phone Number"}
                        </p>
                        <CustomPrefixInput
                           name={
                              recordType === "T"
                                 ? "contactPhoneNumber"
                                 : recordType === "A"
                                 ? "payerPhoneNumber"
                                 : "contactPhoneNumber"
                           }
                           placeholder="Enter Phone Number"
                           value={
                              recordType === "T"
                                 ? formData.contactPhoneNumber
                                 : recordType === "A"
                                 ? formData.payerPhoneNumber
                                 : formData.contactPhoneNumber
                           }
                           onChange={
                              recordType === "T"
                                 ? handleInputChange("contactPhoneNumber")
                                 : recordType === "A"
                                 ? handleInputChange("payerPhoneNumber")
                                 : handleInputChange("contactPhoneNumber")
                           }
                           className="custom-input"
                        />
                        {recordType === "T" ? renderError("contactPhoneNumber") : recordType === "A" ? renderError("payerPhoneNumber") : renderError("contactPhoneNumber")}
                     </div>
                  </div>
               </div>
               )}

               {/* Record Type Specific Fields */}
               {recordType === "A" && (
                  <>
                     {/* A Row 1 */}
                     <div className="form-section-layout">
                        <div className="flex gap-16">
                           <div className="field-container flex-1">
                              <p className="sub-title">Payer Name Control</p>
                              <CustomPrefixInput
                                 name="payerNameControl"
                                 placeholder="Enter Payer Name Control"
                                 value={formData.payerNameControl}
                                 onChange={handleInputChange("payerNameControl")}
                                 className="custom-input"
                              />
                              {renderError("payerNameControl")}
                           </div>
                           <div className="field-container flex-1">
                              <p className="sub-title">Last Filing Indicator</p>
                              <CustomPrefixInput
                                 name="lastFilingIndicator"
                                 placeholder=""
                                 value={formData.lastFilingIndicator}
                                 onChange={handleInputChange("lastFilingIndicator")}
                                 className="custom-input"
                              />
                              {renderError("lastFilingIndicator")}
                           </div>
                           <div className="field-container flex-1">
                              <p className="sub-title">Combine Fed/State File</p>
                              <CustomPrefixInput
                                 name="combineFedStateFiler"
                                 placeholder=""
                                 value={formData.combineFedStateFiler}
                                 onChange={handleInputChange("combineFedStateFiler")}
                                 className="custom-input"
                              />
                              {renderError("combineFedStateFiler")}
                           </div>
                           <div className="field-container flex-1">
                              <p className="sub-title">Type of Return</p>
                              <CustomPrefixInput
                                 name="typeOfReturn"
                                 placeholder="Enter Type of Return"
                                 value={formData.typeOfReturn}
                                 onChange={handleInputChange("typeOfReturn")}
                                 className="custom-input"
                              />
                              {renderError("typeOfReturn")}
                           </div>
                        </div>
                     </div>

                     {/* A Row 2 */}
                     <div className="form-section-layout">
                        <div className="flex gap-16">
                           <div className="field-container flex-1">
                              <p className="sub-title">Amount Codes</p>
                              <CustomPrefixInput
                                 name="amountCodes"
                                 placeholder="Enter Amount Codes"
                                 value={formData.amountCodes}
                                 onChange={handleInputChange("amountCodes")}
                                 className="custom-input"
                              />
                              {renderError("amountCodes")}
                           </div>
                           <div className="field-container flex-1">
                              <p className="sub-title">Foreign Entity Indicator</p>
                              <CustomPrefixInput
                                 name="foreignEntityIndicator"
                                 placeholder=""
                                 value={formData.foreignEntityIndicator}
                                 onChange={handleInputChange("foreignEntityIndicator")}
                                 className="custom-input"
                              />
                              {renderError("foreignEntityIndicator")}
                           </div>
                           <div className="field-container flex-1">
                              <p className="sub-title">First Payer Name</p>
                              <CustomPrefixInput
                                 name="firstPayeeName"
                                 placeholder=""
                                 value={formData.firstPayeeName}
                                 onChange={handleInputChange("firstPayeeName")}
                                 className="custom-input"
                              />
                              {renderError("firstPayeeName")}
                           </div>
                           <div className="field-container flex-1">
                              <p className="sub-title">Second Payer Name</p>
                              <CustomPrefixInput
                                 name="secondPayerName"
                                 placeholder=""
                                 value={formData.secondPayerName}
                                 onChange={handleInputChange("secondPayerName")}
                                 className="custom-input"
                              />
                              {renderError("secondPayerName")}
                           </div>
                        </div>
                     </div>

                     {/* A Row 3 */}
                     <div className="form-section-layout">
                        <div className="flex gap-16">
                           <div className="field-container flex-1">
                              <p className="sub-title">Transfer Agent Indicators</p>
                              <CustomPrefixInput
                                 name="transferAgentIndicator"
                                 placeholder="Enter Transfer Agent"
                                 value={formData.transferAgentIndicator}
                                 onChange={handleInputChange("transferAgentIndicator")}
                                 className="custom-input"
                              />
                              {renderError("transferAgentIndicator")}
                           </div>
                           <div className="field-container flex-1">
                              <p className="sub-title">Payer Shipping Address</p>
                              <CustomPrefixInput
                                 name="payerShippingAddress"
                                 placeholder=""
                                 value={formData.payerShippingAddress}
                                 onChange={handleInputChange("payerShippingAddress")}
                                 className="custom-input"
                              />
                              {renderError("payerShippingAddress")}
                           </div>
                           <div className="field-container flex-1">
                              <p className="sub-title">Payer City</p>
                              <CustomPrefixInput
                                 name="payerCity"
                                 placeholder=""
                                 value={formData.payerCity}
                                 onChange={handleInputChange("payerCity")}
                                 className="custom-input"
                              />
                              {renderError("payerCity")}
                           </div>
                           <div className="field-container flex-1">
                              <p className="sub-title">Payer State</p>
                              <CustomPrefixInput
                                 name="payerState"
                                 placeholder=""
                                 value={formData.payerState}
                                 onChange={handleInputChange("payerState")}
                                 className="custom-input"
                              />
                              {renderError("payerState")}
                           </div>
                        </div>
                     </div>

                     {/* A Row 4 */}
                     <div className="form-section-layout">
                        <div className="flex gap-16">
                           <div className="field-container flex-1">
                              <p className="sub-title">Payer Zip 9 Code</p>
                              <CustomPrefixInput
                                 name="payerZipCode"
                                 placeholder="Enter Zip Code"
                                 value={formData.payerZipCode}
                                 onChange={handleInputChange("payerZipCode")}
                                 className="custom-input"
                              />
                              {renderError("payerZipCode")}
                           </div>
                           <div className="field-container flex-1">
                              <p className="sub-title">Payers Phone Number</p>
                              <CustomPrefixInput
                                 name="payerPhoneNumber"
                                 placeholder="Enter Phone Number"
                                 value={formData.payerPhoneNumber}
                                 onChange={handleInputChange("payerPhoneNumber")}
                                 className="custom-input"
                              />
                              {renderError("payerPhoneNumber")}
                           </div>
                           <div className="field-container flex-1"></div>
                           <div className="field-container flex-1"></div>
                        </div>
                     </div>
                  </>
               )}

              {recordType === "B" && (
                  <>
                     {/* Row B1 - TIN and payer identifiers */}
                     <div className="form-section-layout">
                        <div className="flex gap-16">
                           <div className="field-container flex-1">
                              <p className="sub-title">Type of TIN Number</p>
                              <CustomPrefixInput
                                 name="typeOfTIN"
                                 placeholder=""
                                 value={formData.typeOfTIN}
                                 onChange={handleInputChange("typeOfTIN")}
                                 className="custom-input"
                              />
                              {renderError("typeOfTIN")}
                           </div>
                           <div className="field-container flex-1">
                              <p className="sub-title">Corrected Return Ind</p>
                              <CustomPrefixInput
                                 name="correctedReturnIndicator"
                                 placeholder=""
                                 value={formData.correctedReturnIndicator}
                                 onChange={handleInputChange("correctedReturnIndicator")}
                                 className="custom-input"
                              />
                              {renderError("correctedReturnIndicator")}
                           </div>
                           <div className="field-container flex-1">
                              <p className="sub-title">Payer Acct # for Payee</p>
                              <CustomPrefixInput
                                 name="payerAccountNum"
                                 placeholder="Enter Payer Account #"
                                 value={formData.payerAccountNum}
                                 onChange={handleInputChange("payerAccountNum")}
                                 className="custom-input"
                              />
                              {renderError("payerAccountNum")}
                           </div>
                           <div className="field-container flex-1">
                              <p className="sub-title">Payer Office Code</p>
                              <CustomPrefixInput
                                 name="payerOfficeCode"
                                 placeholder=""
                                 value={formData.payerOfficeCode}
                                 onChange={handleInputChange("payerOfficeCode")}
                                 className="custom-input"
                              />
                              {renderError("payerOfficeCode")}
                           </div>
                        </div>
                     </div>

                     {/* Row B2 - Pay Amounts 1 - 4 */}
                     <div className="form-section-layout">
                        <div className="flex gap-16">
                           <div className="field-container flex-1">
                              <p className="sub-title">Pay Amount 1</p>
                              <CustomPrefixInput
                                 name="payAmt1"
                                 placeholder=""
                                 value={String(formData.payAmt1 ?? 0)}
                                 onChange={handleInputChange("payAmt1")}
                                 className="custom-input"
                                status={fieldErrors["payAmt1"] ? "error" : ""}
                              />
                             {renderError("payAmt1")}
                           </div>
                           <div className="field-container flex-1">
                              <p className="sub-title">Pay Amount 2</p>
                              <CustomPrefixInput
                                 name="payAmt2"
                                 placeholder=""
                                 value={String(formData.payAmt2 ?? 0)}
                                 onChange={handleInputChange("payAmt2")}
                                 className="custom-input"
                                status={fieldErrors["payAmt2"] ? "error" : ""}
                              />
                             {renderError("payAmt2")}
                           </div>
                           <div className="field-container flex-1">
                              <p className="sub-title">Pay Amount 3</p>
                              <CustomPrefixInput
                                 name="payAmt3"
                                 placeholder=""
                                 value={String(formData.payAmt3 ?? 0)}
                                 onChange={handleInputChange("payAmt3")}
                                 className="custom-input"
                                status={fieldErrors["payAmt3"] ? "error" : ""}
                              />
                             {renderError("payAmt3")}
                           </div>
                           <div className="field-container flex-1">
                              <p className="sub-title">Pay Amount 4</p>
                              <CustomPrefixInput
                                 name="payAmt4"
                                 placeholder=""
                                 value={String(formData.payAmt4 ?? 0)}
                                 onChange={handleInputChange("payAmt4")}
                                 className="custom-input"
                                status={fieldErrors["payAmt4"] ? "error" : ""}
                              />
                             {renderError("payAmt4")}
                           </div>
                        </div>
                     </div>

                     {/* Row B3 - Pay Amounts 5 - 8 */}
                     <div className="form-section-layout">
                        <div className="flex gap-16">
                           <div className="field-container flex-1">
                              <p className="sub-title">Pay Amount 5</p>
                              <CustomPrefixInput
                                 name="payAmt5"
                                 placeholder=""
                                 value={String(formData.payAmt5 ?? 0)}
                                 onChange={handleInputChange("payAmt5")}
                                 className="custom-input"
                                status={fieldErrors["payAmt5"] ? "error" : ""}
                              />
                             {renderError("payAmt5")}
                           </div>
                           <div className="field-container flex-1">
                              <p className="sub-title">Pay Amount 6</p>
                              <CustomPrefixInput
                                 name="payAmt6"
                                 placeholder=""
                                 value={String(formData.payAmt6 ?? 0)}
                                 onChange={handleInputChange("payAmt6")}
                                 className="custom-input"
                                status={fieldErrors["payAmt6"] ? "error" : ""}
                              />
                             {renderError("payAmt6")}
                           </div>
                           <div className="field-container flex-1">
                              <p className="sub-title">Pay Amount 7</p>
                              <CustomPrefixInput
                                 name="payAmt7"
                                 placeholder=""
                                 value={String(formData.payAmt7 ?? 0)}
                                 onChange={handleInputChange("payAmt7")}
                                 className="custom-input"
                                status={fieldErrors["payAmt7"] ? "error" : ""}
                              />
                             {renderError("payAmt7")}
                           </div>
                           <div className="field-container flex-1">
                              <p className="sub-title">Pay Amount 8</p>
                              <CustomPrefixInput
                                 name="payAmt8"
                                 placeholder=""
                                 value={String(formData.payAmt8 ?? 0)}
                                 onChange={handleInputChange("payAmt8")}
                                 className="custom-input"
                                status={fieldErrors["payAmt8"] ? "error" : ""}
                              />
                             {renderError("payAmt8")}
                           </div>
                        </div>
                     </div>

                     {/* Row B4 - Pay Amounts 9, A, B, C */}
                     <div className="form-section-layout">
                        <div className="flex gap-16">
                           <div className="field-container flex-1">
                              <p className="sub-title">Pay Amount 9</p>
                              <CustomPrefixInput
                                 name="payAmt9"
                                 placeholder=""
                                 value={String(formData.payAmt9 ?? 0)}
                                 onChange={handleInputChange("payAmt9")}
                                 className="custom-input"
                                status={fieldErrors["payAmt9"] ? "error" : ""}
                              />
                             {renderError("payAmt9")}
                           </div>
                           <div className="field-container flex-1">
                              <p className="sub-title">Pay Amount A</p>
                              <CustomPrefixInput
                                 name="payAmtA"
                                 placeholder=""
                                 value={String(formData.payAmtA ?? 0)}
                                 onChange={handleInputChange("payAmtA")}
                                 className="custom-input"
                                status={fieldErrors["payAmtA"] ? "error" : ""}
                              />
                             {renderError("payAmtA")}
                           </div>
                           <div className="field-container flex-1">
                              <p className="sub-title">Pay Amount B</p>
                              <CustomPrefixInput
                                 name="payAmtB"
                                 placeholder=""
                                 value={String(formData.payAmtB ?? 0)}
                                 onChange={handleInputChange("payAmtB")}
                                 className="custom-input"
                                status={fieldErrors["payAmtB"] ? "error" : ""}
                              />
                             {renderError("payAmtB")}
                           </div>
                           <div className="field-container flex-1">
                              <p className="sub-title">Pay Amount C</p>
                              <CustomPrefixInput
                                 name="payAmtC"
                                 placeholder=""
                                 value={String(formData.payAmtC ?? 0)}
                                 onChange={handleInputChange("payAmtC")}
                                 className="custom-input"
                                status={fieldErrors["payAmtC"] ? "error" : ""}
                              />
                             {renderError("payAmtC")}
                           </div>
                        </div>
                     </div>

                     {/* Row B5 - Country/Names/Address */}
                     <div className="form-section-layout">
                        <div className="flex gap-16">
                           <div className="field-container flex-1">
                              <p className="sub-title">Foreign Country Code</p>
                              <CustomPrefixInput
                                 name="foreignCountryCode"
                                 placeholder=""
                                 value={formData.foreignCountryCode}
                                 onChange={handleInputChange("foreignCountryCode")}
                                 className="custom-input"
                              />
                              {renderError("foreignCountryCode")}
                           </div>
                           <div className="field-container flex-1">
                              <p className="sub-title">1st Payee Name</p>
                              <CustomPrefixInput
                                 name="firstPayeeName"
                                 placeholder=""
                                 value={formData.firstPayeeName}
                                 onChange={handleInputChange("firstPayeeName")}
                                 className="custom-input"
                              />
                              {renderError("firstPayeeName")}
                           </div>
                           <div className="field-container flex-1">
                              <p className="sub-title">2nd Payee Name</p>
                              <CustomPrefixInput
                                 name="secondPayeeName"
                                 placeholder=""
                                 value={formData.secondPayeeName}
                                 onChange={handleInputChange("secondPayeeName")}
                                 className="custom-input"
                              />
                              {renderError("secondPayeeName")}
                           </div>
                           <div className="field-container flex-1">
                              <p className="sub-title">Payee Address</p>
                              <CustomPrefixInput
                                 name="payeeAddress"
                                 placeholder=""
                                 value={formData.payeeAddress}
                                 onChange={handleInputChange("payeeAddress")}
                                 className="custom-input"
                              />
                              {renderError("payeeAddress")}
                           </div>
                        </div>
                     </div>

                     {/* Row B6 - City/State/Zip */}
                     <div className="form-section-layout">
                        <div className="flex gap-16">
                           <div className="field-container flex-1">
                              <p className="sub-title">Payee City</p>
                              <CustomPrefixInput
                                 name="payeeCity"
                                 placeholder=""
                                 value={formData.payeeCity}
                                 onChange={handleInputChange("payeeCity")}
                                 className="custom-input"
                              />
                              {renderError("payeeCity")}
                           </div>
                           <div className="field-container flex-1">
                              <p className="sub-title">Payee State</p>
                              <CustomPrefixInput
                                 name="payeeState"
                                 placeholder=""
                                 value={formData.payeeState}
                                 onChange={handleInputChange("payeeState")}
                                 className="custom-input"
                              />
                              {renderError("payeeState")}
                           </div>
                           <div className="field-container flex-1">
                              
                              <p className="sub-title">2nd Tin Notice (2)</p>
                              <CustomPrefixInput
                                 name="secondTinNotice2"
                                 placeholder=""
                                 value={formData.secondTinNotice2}
                                 onChange={handleInputChange("secondTinNotice2")}
                                 className="custom-input"
                                 status={fieldErrors["secondTinNotice2"] ? "error" : ""}
                              />
                              {renderError("secondTinNotice2")}
                        
                           </div>
                              <div className="field-container flex-1">
                              <p className="sub-title">Foreign Country/US POS</p>
                              <CustomPrefixInput
                                 name="foreignCountryUSPOS"
                                 placeholder=""
                                 value={formData.foreignCountryUSPOS}
                                 onChange={handleInputChange("foreignCountryUSPOS")}
                                 className="custom-input"
                                 status={fieldErrors["foreignCountryUSPOS"] ? "error" : ""}
                              />
                              {renderError("foreignCountryUSPOS")}
                           </div>
                        </div>
                     </div>

                     {/* Row B7 - 2nd Tin Notice / Foreign POS / State/Local Tax */}
                     <div className="form-section-layout">
                        <div className="flex gap-16">
                           <div className="field-container flex-1">
                              <p className="sub-title">Director Sales Ind</p>
                              <CustomPrefixInput
                                 name="directorSalesInd"
                                 placeholder=""
                                 value={formData.directorSalesInd}
                                 onChange={handleInputChange("directorSalesInd")}
                                 className="custom-input"
                                 status={fieldErrors["directorSalesInd"] ? "error" : ""}
                              />
                              {renderError("directorSalesInd")}
                           </div>
                           <div className="field-container flex-1">
                              <p className="sub-title">Special Data Entr</p>
                              <CustomPrefixInput
                                 name="specialDataEntr"
                                 placeholder=""
                                 value={formData.specialDataEntr}
                                 onChange={handleInputChange("specialDataEntr")}
                                 className="custom-input"
                                 status={fieldErrors["specialDataEntr"] ? "error" : ""}
                              />
                              {renderError("specialDataEntr")}
                           </div>
                        
                           <div className="field-container flex-1">
                              <p className="sub-title">State INCM Tax Withheld</p>
                              <CustomPrefixInput
                                 name="stateIncmTaxWithheld"
                                 placeholder=""
                                 value={formData.stateIncmTaxWithheld}
                                 onChange={handleInputChange("stateIncmTaxWithheld")}
                                 className="custom-input"
                                 status={fieldErrors["stateIncmTaxWithheld"] ? "error" : ""}
                              />
                              {renderError("stateIncmTaxWithheld")}
                           </div>
                           <div className="field-container flex-1">
                              <p className="sub-title">Local INCM Tax Withheld</p>
                              <CustomPrefixInput
                                 name="localIncmTaxWithheld"
                                 placeholder=""
                                 value={formData.localIncmTaxWithheld}
                                 onChange={handleInputChange("localIncmTaxWithheld")}
                                 className="custom-input"
                                 status={fieldErrors["localIncmTaxWithheld"] ? "error" : ""}
                              />
                              {renderError("localIncmTaxWithheld")}
                           </div>
                        </div>
                     </div>

                     {/* Row B8 - Director/Special/Combined/Last Business */}
                     <div className="form-section-layout">
                        <div className="flex gap-4">
                           <div className="field-container">
                              <p className="sub-title">Combined FED/STATE Code</p>
                              <CustomPrefixInput
                                 name="combinedFedStateCode"
                                 placeholder=""
                                 value={formData.combinedFedStateCode}
                                 onChange={handleInputChange("combinedFedStateCode")}
                                 className="custom-input"
                                 status={fieldErrors["combinedFedStateCode"] ? "error" : ""}
                              />
                              {renderError("combinedFedStateCode")}
                           </div>
                           <div className="field-container">
                              <p className="sub-title">Payee Last/Business</p>
                              <CustomPrefixInput
                                 name="payeeLastBusiness"
                                 placeholder=""
                                 value={formData.payeeLastBusiness}
                                 onChange={handleInputChange("payeeLastBusiness")}
                                 className="custom-input"
                                 status={fieldErrors["payeeLastBusiness"] ? "error" : ""}
                              />
                              {renderError("payeeLastBusiness")}
                           </div>
                        </div>
                     </div>

                     {/* Row B9 - First/Middle/Suffix */}
                     <div className="form-section-layout">
                        <div className="flex gap-16">
                           <div className="field-container flex-1">
                              <p className="sub-title">Payee First Name</p>
                              <CustomPrefixInput
                                 name="payeeFirstName"
                                 placeholder=""
                                 value={formData.payeeFirstName}
                                 onChange={handleInputChange("payeeFirstName")}
                                 className="custom-input"
                                 status={fieldErrors["payeeFirstName"] ? "error" : ""}
                              />
                              {renderError("payeeFirstName")}
                           </div>
                           <div className="field-container flex-1">
                              <p className="sub-title">Payee Middle Name</p>
                              <CustomPrefixInput
                                 name="payeeMiddleName"
                                 placeholder=""
                                 value={formData.payeeMiddleName}
                                 onChange={handleInputChange("payeeMiddleName")}
                                 className="custom-input"
                                 status={fieldErrors["payeeMiddleName"] ? "error" : ""}
                              />
                              {renderError("payeeMiddleName")}
                           </div>
                           <div className="field-container flex-1">
                              <p className="sub-title">Suffix</p>
                              <CustomPrefixInput
                                 name="suffix"
                                 placeholder=""
                                 value={formData.suffix}
                                 onChange={handleInputChange("suffix")}
                                 className="custom-input"
                                 status={fieldErrors["suffix"] ? "error" : ""}
                              />
                              {renderError("suffix")}
                           </div>
                           <div className="field-container flex-1"></div>
                        </div>
                     </div>
                  </>
               )}

               {/* Row 5 - Generic Fields for Record Type T */}
               {recordType === "T" && (
                  <div className="form-section-layout">
                     <div className="flex gap-16">
                        <div className="field-container flex-1">
                           <p className="sub-title">Magnetic Tape File Ind</p>
                           <CustomPrefixInput
                              name="magneticTapeFileInd"
                              placeholder=""
                              value={formData.magneticTapeFileInd}
                              onChange={handleInputChange(
                                 "magneticTapeFileInd"
                              )}
                              className="custom-input"
                           />
                        </div>
                        <div className="field-container flex-1">
                           <p className="sub-title">Electronic File Name</p>
                           <CustomPrefixInput
                              name="electronicFileName"
                              placeholder=""
                              value={formData.electronicFileName}
                              onChange={handleInputChange("electronicFileName")}
                              className="custom-input"
                           />
                        </div>
                        <div className="field-container flex-1"></div>
                        <div className="field-container flex-1"></div>
                     </div>
                  </div>
               )}
            </div>

            <Divider />

            {/* Action Buttons */}
            <div className="flex-end  gap-16 modal-edit-footer">
               <DefaultButton
                  name="cancel"
                  label={<h6>Cancel</h6>}
                  onClick={handleCancel}
               />
               <CustomStyledButton
                  name="update"
                  label={<h6>Update</h6>}
                  onClick={handleUpdate}
                  loading={isLoading}
               />
            </div>
         </div>
      </div>
   );
};

export default Edit1099File;
