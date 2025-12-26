import React, { useState, useEffect } from "react";
import { Row, Col, message } from "antd";
import { CustomPrefixInput } from "../../../../../../widget-library/Input";
import type { CompanyData } from "@/types/accounts-payable.types";
import {
   validateNumericInput,
   formatInvoiceAmountOnBlur,
} from "@/utils/validation";
import { useApPeriodEnd } from "@/hooks/useApPeriodEnd";
interface Create1099FileProps {
   reportYear: string;
   formType: string;
   paymentsForReportYear: string;
   inExcessAmount: string;
   onInExcessAmountChange: (value: string) => void;
   onCompanyFieldsChange?: (fields: {
      head1: string;
      head2: string;
      head3: string;
      id: string;
   }) => void;
}

const Create1099File: React.FC<Create1099FileProps> = ({
   reportYear,
   formType,
   paymentsForReportYear,
   inExcessAmount,
   onInExcessAmountChange,
   onCompanyFieldsChange,
}) => {
   // AP Period End custom hook
   const { fetchCompanyDetails } = useApPeriodEnd();

   const [companyData, setCompanyData] = useState<CompanyData | null>(null);
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [validationErrors, setValidationErrors] = useState<
      Record<string, string>
   >({});

   const companyNo = 10;

   const fetchCompanyDetailsData = async () => {
      try {
         setIsLoading(true);

         const queryParams = {
            companyNo: companyNo,
         };

         const companyDetails = await fetchCompanyDetails(queryParams);

         if (companyDetails) {
            setCompanyData(companyDetails);
         } else {
            setCompanyData({});
         }
      } catch (error) {
         console.error("Error fetching company details:", error);
         message.error("Failed to load company details. Please try again.");
         setCompanyData({});
      } finally {
         setIsLoading(false);
      }
   };

   useEffect(() => {
      fetchCompanyDetailsData();
   }, []);
   useEffect(() => {
      if (!companyData) return;

      const name = (companyData?.company99Name || "").trim();
      const address = (companyData?.company99Address1 || "").trim();
      const city = (companyData?.company99Address2 || "").trim();
      const state = getStateFromStateZip(
         companyData?.company99StateZip || ""
      ).trim();
      const zip = getZipFromStateZip(
         companyData?.company99StateZip || ""
      ).trim();
      const federalId = (companyData?.company99EinNumber || "").trim();

      const head3 = [city, state, zip].filter(Boolean).join(" ");

      onCompanyFieldsChange?.({
         head1: name,
         head2: address,
         head3: head3,
         id: federalId,
      });
   }, [companyData]);

   const getStateFromStateZip = (stateZip: string = "") => {
      return stateZip.trim().split(" ")[0] || "-";
   };

   const getZipFromStateZip = (stateZip: string = "") => {
      const parts = stateZip.trim().split(" ");
      return parts.length > 1 ? parts[1] : "-";
   };

   const handleInExcessAmountChange = (
      e: React.ChangeEvent<HTMLInputElement>
   ) => {
      const validation = validateNumericInput(e);

      // Update the field value with the cleaned numeric value
      onInExcessAmountChange(validation.value);

      // Handle validation errors
      if (validation.hasError) {
         setValidationErrors((prev) => ({
            ...prev,
            inExcessAmount: validation.errorMessage!,
         }));
      } else {
         setValidationErrors((prev) => {
            const { inExcessAmount: _, ...rest } = prev;
            return rest;
         });
      }
   };

   const handleInExcessAmountBlur = () => {
      // Format the amount to ensure proper decimal places (e.g., 1 becomes 1.00)
      const formattedValue = formatInvoiceAmountOnBlur(inExcessAmount);
      onInExcessAmountChange(formattedValue);
   };

   const renderField = (label: string, value: any) => {
      return (
         <div className="flex-col">
            <label className="p-s">{label}</label>
            <span className="sub-title">{value}</span>
         </div>
      );
   };

   return (
      <div className="bordered-box">
         <div className="company-details-section">
            {isLoading ? (
               <Row gutter={[24, 16]}>
                  <Col span={24}>
                     <div>
                        <span>Loading company details...</span>
                     </div>
                  </Col>
               </Row>
            ) : (
               <>
                  <Row gutter={[24, 16]}>
                     <Col span={6}>
                        {renderField(
                           "Name",
                           companyData?.company99Name?.trim() || "-"
                        )}
                     </Col>
                     <Col span={6}>
                        {renderField(
                           "Address",
                           companyData?.company99Address1?.trim() || "-"
                        )}
                     </Col>
                     <Col span={6}>
                        {renderField(
                           "City",
                           companyData?.company99Address2?.trim() || "-"
                        )}
                     </Col>
                     <Col span={6}>
                        {renderField(
                           "State",
                           getStateFromStateZip(companyData?.company99StateZip)
                        )}
                     </Col>
                  </Row>

                  <Row gutter={[24, 16]} className="form-row">
                     <Col span={6}>
                        {renderField(
                           "Zipcode",
                           getZipFromStateZip(companyData?.company99StateZip)
                        )}
                     </Col>
                     <Col span={6}>
                        {renderField(
                           "Federal ID#",
                           companyData?.company99EinNumber || "-"
                        )}
                     </Col>
                     <Col span={6}>{renderField("Form Type", formType)}</Col>
                     <Col span={6}>
                        {renderField("Report Year", reportYear)}
                     </Col>
                  </Row>

                  <Row gutter={[24, 16]} className="form-row">
                     <Col span={6}>
                        {renderField(
                           "Payments for Report Year",
                           paymentsForReportYear
                        )}
                     </Col>
                  </Row>
               </>
            )}

            <hr />

            {!isLoading && (
               <Row gutter={[24, 16]} className="form-row">
                  <Col span={6}>
                     <div className="flex-col">
                        <label className="sub-title">In Excess Amount</label>
                        <CustomPrefixInput
                           name="inExcessAmount"
                           value={inExcessAmount}
                           onChange={handleInExcessAmountChange}
                           onBlur={handleInExcessAmountBlur}
                           placeholder="Enter amount"
                           className="ui-dropdown-vnn"
                           status={
                              validationErrors.inExcessAmount ? "error" : ""
                           }
                        />
                        {validationErrors.inExcessAmount && (
                           <div className="error-message">
                              {validationErrors.inExcessAmount}
                           </div>
                        )}
                     </div>
                  </Col>
               </Row>
            )}
         </div>
      </div>
   );
};

export default Create1099File;
