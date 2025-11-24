import React, { useEffect, useState } from "react";
import { Card, Typography, Space } from "antd";
import { KeyOutlined, CopyOutlined } from "@ant-design/icons";
import CompanyNo from "@shared-components/company-number/CompanyNo";
import { CustomStyledButton } from "@/widget-library/Buttons";
import Toaster from "@/widget-library/Toaster";
import { useGeneralSystemCompany } from "@/hooks/useGeneralSystemCompany";
import { useAuthCodeValidation } from "@/hooks/useAuthCodeValidation";
import "./authgenerate.scss";

const { Title, Text } = Typography;

const AuthGenerate: React.FC = () => {
   const [selectedCompany, setSelectedCompany] = useState<string>("");
   const [generatedAuthNumber, setGeneratedAuthNumber] = useState<string>("");
   const [isGenerating, setIsGenerating] = useState<boolean>(false);
   const [toaster, setToaster] = useState<{
      visible: boolean;
      type: "error" | "success" | "warning" | "batch";
      title: string;
      subtitle: string;
   }>({
      visible: false,
      type: "success",
      title: "",
      subtitle: "",
   });

   const { generateAuthCode } = useAuthCodeValidation();

   const companyNoNum = selectedCompany
      ? parseInt(selectedCompany, 10)
      : undefined;
   const { data: generalSystemCompany, error: generalSystemCompanyError } =
      useGeneralSystemCompany(companyNoNum);

   useEffect(() => {
      if (generalSystemCompanyError) {
         showToaster(
            "error",
            "Error",
            "Failed to load general system company details"
         );
      }
   }, [generalSystemCompanyError]);

   useEffect(() => {
      if (generalSystemCompany?.apPostOverrideCode) {
         setGeneratedAuthNumber(`${generalSystemCompany.apPostOverrideCode}`);
      }
   }, [generalSystemCompany?.apPostOverrideCode]);

   const handleCompanyChange = (value: string) => {
      setSelectedCompany(value);
   };

   const showToaster = (
      type: "error" | "success" | "warning" | "batch",
      title: string,
      subtitle: string
   ) => {
      setToaster({
         visible: true,
         type,
         title,
         subtitle,
      });
   };

   const closeToaster = () => {
      setToaster((prev) => ({ ...prev, visible: false }));
   };

   const handleGenerateAuth = async () => {
      if (!selectedCompany || !companyNoNum) {
         return;
      }

      setIsGenerating(true);
      try {
         const response = await generateAuthCode(companyNoNum);
         const items =
            (response as any)?.data?.items ??
            (response as any)?.data ??
            response;
         const latestCode = items?.apPostOverrideCode;
         if (latestCode != null) {
            setGeneratedAuthNumber(String(latestCode));
            showToaster(
               "success",
               "Success",
               "Authorization updated successfully!"
            );
         } else {
            showToaster("warning", "No Code", "No authorization code returned");
         }
      } catch (error) {
         console.error("Error generating authorization:", error);
         showToaster("error", "Error", "Failed to generate authorization");
      } finally {
         setIsGenerating(false);
      }
   };

   const handleCopyAuthNumber = async () => {
      if (!generatedAuthNumber) return;

      try {
         await navigator.clipboard.writeText(generatedAuthNumber);
         showToaster(
            "success",
            "Success",
            "Authorization number copied to clipboard!"
         );
      } catch (error) {
         console.error("Failed to copy:", error);
         showToaster("error", "Error", "Failed to copy to clipboard");
      }
   };

   return (
      <div style={{ padding: "24px" }}>
         <Card>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
               <div>
                  <Title level={3}>
                     <KeyOutlined style={{ marginRight: "8px" }} />
                     Authorization Generate
                  </Title>
                  <Text type="secondary">
                     Generate authorization codes for the selected company
                  </Text>
               </div>

               <div className="flex-align-end auth-div">
                  <CompanyNo
                     value={selectedCompany}
                     onChange={handleCompanyChange}
                  />

                  <CustomStyledButton
                     name="generate-auth"
                     label="Generate Authorization"
                     icon={<KeyOutlined />}
                     onClick={handleGenerateAuth}
                     disabled={
                        !selectedCompany ||
                        !generalSystemCompany?.apPostOverrideCode
                     }
                     loading={isGenerating}
                  />
               </div>

               <div className="auth-result-section">
                  <Text strong>Generated Authorization Number:</Text>
                  <div className="copyable-area">
                     <div className="auth-number-display">
                        <div className="auth-number-text">
                           {generatedAuthNumber}
                        </div>
                     </div>
                     <CustomStyledButton
                        name="copy-auth"
                        label="Copy"
                        icon={<CopyOutlined />}
                        onClick={handleCopyAuthNumber}
                        className="copy-button"
                     />
                  </div>
               </div>
            </Space>
         </Card>
         {toaster.visible && (
            <Toaster
               type={toaster.type}
               title={toaster.title}
               subtitle={toaster.subtitle}
               onClose={closeToaster}
            />
         )}
      </div>
   );
};

export default AuthGenerate;
