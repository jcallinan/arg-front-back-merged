import React, { useState, useEffect } from "react";
import { Divider } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useGenerateReport } from "@hooks/useGenerateReport";
import { useGenerateReportFiles } from "@hooks/useGenerateReportFiles";
import { useReportDetails } from "@hooks/useReportDetails";
import Stepper from "@widget-library/Stepper";
import { CustomStyledButton, DefaultButton } from "@widget-library/Buttons";
import ModalContent from "@widget-library/Modal";

import modalCancelIcon from "@assets/icons/modal-cancel-icon.svg";
import modalReloadIcon from "@assets/icons/modal-reload-icon.svg";
import popupOk from "@assets/icons/popup-ok.svg";
import OptionsForm from "./year-end-forms/OptionsForm";
import Create1099File from "./year-end-forms/Create1099File";
import ReviewFiles from "./year-end-forms/ReviewFiles";
import PrintForms from "./year-end-forms/PrintForms";
import Toaster from "@widget-library/Toaster";
import padNumber from "@utils/padNumber";

const YearEnd1099ProcessMenu: React.FC = () => {
   const navigate = useNavigate();
   const [currentStep, setCurrentStep] = useState(0);

   // Use the generate report hook
   const { generateReport, isLoading: _isGeneratingReport } =
      useGenerateReport();
   const { generateReportFiles, isLoading: _isGeneratingFiles } =
      useGenerateReportFiles();

   // Use the report details hook for step 0 (Select Options)
   const { reportParameters, fetchReportDetails } = useReportDetails();

   // Step 0: Select Options - fetch report details on component load
   useEffect(() => {
      if (currentStep === 0) {
         fetchReportDetails("Year_End_1099_Process_Menu_options_Submit", "in");
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [currentStep]);

   // Step 3 (index 2): Review Files - fetch report details on component load

   // Step 2: Create 1099 File - fetch report details on component load
   useEffect(() => {
      if (currentStep === 1) {
         fetchReportDetails("Year_End_1099_Process_Menu_Submit", "in");
      }
   }, [currentStep]);

   const [reportYear, setReportYear] = useState("2024");
   const [formType, setFormType] = useState(""); // Will be set from API data
   const [paymentsForReportYear, setPaymentsForReportYear] = useState(""); // Will be set from API data
   const [inExcessAmount, setInExcessAmount] = useState("0.00");
   const [companyHead1, setCompanyHead1] = useState(""); // Company name
   const [companyHead2, setCompanyHead2] = useState(""); // Company address
   const [companyHead3, setCompanyHead3] = useState(""); // City State Zip
   const [federalId, setFederalId] = useState(""); // Federal ID
   const [isRestartModalVisible, setIsRestartModalVisible] = useState(false);
   const [isExitModalVisible, setIsExitModalVisible] = useState(false);
   const [isTestPrintModalVisible, setIsTestPrintModalVisible] =
      useState(false);
   const [isTestPrintSuccessModalVisible, setIsTestPrintSuccessModalVisible] =
      useState(false);
   const [isPrintSuccessModalVisible, setIsPrintSuccessModalVisible] =
      useState(false);
   const [isPrintLoading, setIsPrintLoading] = useState(false);
   const [notification, setNotification] = useState<{
      visible: boolean;
      type: "success" | "error" | "warning" | "batch";
      title: string;
      subtitle: string;
   }>({ visible: false, type: "success", title: "", subtitle: "" });

   const stepTitles = ["Options", "Create 1099 File ", "Review Files", "Print"];

   const stepperTitles = [
      "Select Options",
      "Create 1099 File",
      "Review Files",
      "Print",
   ];

   const handleRestart = () => {
      setIsRestartModalVisible(true);
   };

   const handleRestartConfirm = () => {
      setIsRestartModalVisible(false);
      setCurrentStep(0);
      setReportYear("2024");
      setFormType(""); // Will be set from API data
      setPaymentsForReportYear(""); // Will be set from API data
   };

   const handleVendorMaintenanceClick = () => {
      setIsExitModalVisible(true);
   };

   const handleExitConfirm = () => {
      setIsExitModalVisible(false);
      navigate("/accounts-payable/ap-period/vendor-file-maintenance-1099");
   };

   const handleTestPrint = () => {
      setIsTestPrintModalVisible(true);
   };

   const handleTestPrintConfirm = async () => {
      setIsTestPrintModalVisible(false);

      try {
         const lastTwoDigitsOfYear = reportYear?.slice(-2) || "";

         const mapValueByFieldKey = (fieldKey?: string): string => {
            switch (fieldKey) {
               case "Company":
                  return "10";
               case "Head1":
                  return companyHead1;
               case "Head2":
                  return companyHead2;
               case "Head3":
                  return companyHead3;
               case "ID":
                  return federalId;
               case "FRMTYP":
                  return formType;
               case "Year":
                  return reportYear;
               case "CURLST":
                  return paymentsForReportYear;
               case "ENTAMT":
                  return padNumber(inExcessAmount.replace(".", ""), 8, "0");
               case "NUM":
                  return lastTwoDigitsOfYear;
               case "TOTB":
                  return (
                     (reportParameters || []).find(
                        (p) => p.fieldKey === "TOTB"
                     )?.xmlMetadata || "00000000"
                  );
               case "Rpt_Name":
               case "Path":
                  // Exclude these parameters as per requirements
                  return "";
               default:
                  return "";
            }
         };

         const parameters = [
            ...(reportParameters || [])
               .filter((p) => p.fieldKey !== "Rpt_Name" && p.fieldKey !== "Path")
               .map((p) => ({
                  name: p.fieldKey || "",
                  value: mapValueByFieldKey(p.fieldKey),
               }))
               .filter((p) => p.name !== ""),
            // Add FLAGTP parameter for test print
            { name: "FLAGTP", value: "T" },
         ];

         // Call test print with unified use case
         const response = await generateReport(
            "Year_End_1099_Process_Menu_Test_or_Print_Submit",
            parameters
         );

         // Check if the API call was successful
         if (response?.data?.items?.message) {
            setIsTestPrintSuccessModalVisible(true);
         }
      } catch (error) {
         console.error("Error during test print:", error);
         setNotification({
            visible: true,
            type: "error",
            title: "Error",
            subtitle: "An unexpected error occurred during test print",
         });
      }
   };

   const handlePrint = async () => {
      setIsPrintLoading(true);

      try {
         // Build parameters same as Create 1099 File step (excluding Rpt_Name and Path)
         const lastTwoDigitsOfYear = reportYear?.slice(-2) || "";

         const mapValueByFieldKey = (fieldKey?: string): string => {
            switch (fieldKey) {
               case "Company":
                  return "10";
               case "Head1":
                  return companyHead1;
               case "Head2":
                  return companyHead2;
               case "Head3":
                  return companyHead3;
               case "ID":
                  return federalId;
               case "FRMTYP":
                  return formType;
               case "Year":
                  return reportYear;
               case "CURLST":
                  return paymentsForReportYear;
               case "ENTAMT":
                  return padNumber(inExcessAmount.replace(".", ""), 8, "0");
               case "NUM":
                  return lastTwoDigitsOfYear;
               case "TOTB":
                  return (
                     (reportParameters || []).find(
                        (p) => p.fieldKey === "TOTB"
                     )?.xmlMetadata || "00000000"
                  );
               case "Rpt_Name":
               case "Path":
                  // Exclude these parameters as per requirements
                  return "";
               default:
                  return "";
            }
         };

         const parameters = [
            ...(reportParameters || [])
               .filter((p) => p.fieldKey !== "Rpt_Name" && p.fieldKey !== "Path")
               .map((p) => ({
                  name: p.fieldKey || "",
                  value: mapValueByFieldKey(p.fieldKey),
               }))
               .filter((p) => p.name !== ""),
            // Add FLAGTP parameter for print
            { name: "FLAGTP", value: "F" },
         ];

         // Call print with unified use case
         const response = await generateReport(
            "Year_End_1099_Process_Menu_Test_or_Print_Submit",
            parameters
         );
         const messageObj = response?.data?.items?.message;

         // Handle different response structures
         let isSuccess = false;
         let errorMessage = "";
         let successMessage = "";

         // Check if we got a successful response (201 Created)
         if (response.status === 201 || response.ok) {
            isSuccess = true;

            if (messageObj && typeof messageObj === "object") {
               const messageKeys = Object.keys(messageObj);

               if (messageKeys.length > 0) {
                  // Object has properties, try to extract meaningful content
                  const meaningfulMessages = Object.values(messageObj).filter(
                     (val) => val && typeof val === "string" && val.trim()
                  );

                  if (meaningfulMessages.length > 0) {
                     successMessage = meaningfulMessages[0] as string;
                  } else {
                     // Object has properties but no meaningful strings - show blank
                     successMessage = "";
                  }
               } else {
                  // Empty object {} - show blank (no client-side message)
                  successMessage = "";
               }
            } else {
               // No message object at all - show blank
               successMessage = "";
            }
         } else {
            // API returned an error status
            isSuccess = false;
            errorMessage = "Print operation failed";
         }

         if (isSuccess) {
            // Always show toaster, even if message is blank
            setNotification({
               visible: true,
               type: "success",
               title: "Success",
               subtitle: successMessage, // Will be blank if empty object
            });
            setIsPrintSuccessModalVisible(true);
         } else {
            setNotification({
               visible: true,
               type: "error",
               title: "Error",
               subtitle: errorMessage,
            });
            // Do not navigate/open modal on failure
         }
      } catch (error) {
         console.error("Error generating report:", error);
         setNotification({
            visible: true,
            type: "error",
            title: "Error",
            subtitle: "An unexpected error occurred while printing",
         });
      } finally {
         setIsPrintLoading(false);
      }
   };
 
   const handleTestPrintSuccessClose = () => {
      setIsTestPrintSuccessModalVisible(false);
   };
 
   const handlePrintSuccessClose = () => {
      setIsPrintSuccessModalVisible(false);
      setCurrentStep(0);
      setReportYear("2024");
      setFormType(""); // Will be set from API data
      setPaymentsForReportYear(""); // Will be set from API data
   };

   const handleNext = async () => {
      // Step 0: POST with mapped parameters then advance
      if (currentStep === 0) {
         try {
            // Map known fieldKeys to current selections
            const mapValueByFieldKey = (fieldKey?: string): string => {
               switch (fieldKey) {
                  case "Year":
                     return reportYear;
                  case "FRMTYP":
                     return formType;
                  case "CURLST":
                     return paymentsForReportYear;
                  case "Company":
                     return "10"; // Default company if required
                  default:
                     return "";
               }
            };

            const parameters = (reportParameters || [])
               .map((p) => ({
                  name: p.fieldKey || "",
                  value: mapValueByFieldKey(p.fieldKey),
               }))
               .filter((p) => p.name !== "");

            await generateReport(
               "Year_End_1099_Process_Menu_options_Submit",
               parameters
            );

            if (currentStep < stepperTitles.length - 1) {
               setCurrentStep((prev) => prev + 1);
            }
            return;
         } catch (e) {
            console.error("Error submitting Select Options:", e);
            // still advance only if desired; keeping current behavior to advance
            if (currentStep < stepperTitles.length - 1) {
               setCurrentStep((prev) => prev + 1);
            }
            return;
         }
      }

      // Step 2 (index 1): Create 1099 File - POST with mapped parameters
      if (currentStep === 1) {
         try {
            const lastTwoDigitsOfYear = reportYear?.slice(-2) || "";

            const mapValueByFieldKey = (fieldKey?: string): string => {
               switch (fieldKey) {
                  case "Company":
                     return "10";
                  case "Head1":
                     return companyHead1;
                  case "Head2":
                     return companyHead2;
                  case "Head3":
                     return companyHead3;
                  case "ID":
                     return federalId;
                  case "FRMTYP":
                     return formType;
                  case "Year":
                     return reportYear;
                  case "CURLST":
                     return paymentsForReportYear;
                  case "ENTAMT":
                     return padNumber(inExcessAmount.replace(".", ""), 8, "0");
                  case "NUM":
                     return lastTwoDigitsOfYear;
                  case "TOTB":
                     return (
                        (reportParameters || []).find(
                           (p) => p.fieldKey === "TOTB"
                        )?.xmlMetadata || "00000000"
                     );
                  default:
                     return "";
               }
            };

            const parameters = (reportParameters || [])
               .map((p) => ({
                  name: p.fieldKey || "",
                  value: mapValueByFieldKey(p.fieldKey),
               }))
               .filter((p) => p.name !== "");

            await generateReport(
               "Year_End_1099_Process_Menu_Submit",
               parameters
            );

            // LAST: Generate report files, then navigate (advance) on success
            const filesResult = await generateReportFiles({
               companyNo: 10,
               usecase: "pa1099-year-end-patax",
               parameters: {
                  formType: formType,
                  reportYear: reportYear,
               },
            });

            if (!filesResult.success) {
               setNotification({
                  visible: true,
                  type: "error",
                  title: "Error",
                  subtitle:
                     typeof filesResult.message === "string" &&
                     filesResult.message.trim()
                        ? filesResult.message
                        : "Failed to generate report files",
               });
               return; // stop on failure
            }

            const irsFilesResult = await generateReportFiles({
               companyNo: 10,
               usecase: "irs-tax",
               parameters: {
                  formType: formType,
                  reportYear: reportYear,
               },
            });

            if (!irsFilesResult.success) {
               setNotification({
                  visible: true,
                  type: "error",
                  title: "Error",
                  subtitle:
                     typeof irsFilesResult.message === "string" &&
                     irsFilesResult.message.trim()
                        ? irsFilesResult.message
                        : "Failed to generate IRS tax files",
               });
               return; // stop on failure
            }

            if (currentStep < stepperTitles.length - 1) {
               setCurrentStep((prev) => prev + 1);
            }
            return;
         } catch (e) {
            console.error("Error submitting Create 1099 File:", e);
            return; // stop navigation on error
         }
      }

      if (currentStep < stepperTitles.length - 1) {
         setCurrentStep((prev) => prev + 1);
      }
   };

   const handleBack = () => {
      if (currentStep > 0) {
         setCurrentStep((prev) => prev - 1);
      }
   };

   const isNextEnabled = () => {
      if (currentStep === 0) {
         return reportYear && formType && paymentsForReportYear;
      }
      return true;
   };

   const renderCurrentStep = () => {
      switch (currentStep) {
         case 0:
            return (
               <OptionsForm
                  reportYear={reportYear}
                  formType={formType}
                  paymentsForReportYear={paymentsForReportYear}
                  onReportYearChange={setReportYear}
                  onFormTypeChange={setFormType}
                  onPaymentsChange={setPaymentsForReportYear}
               />
            );
         case 1:
            return (
               <Create1099File
                  reportYear={reportYear}
                  formType={formType}
                  paymentsForReportYear={paymentsForReportYear}
                  inExcessAmount={inExcessAmount}
                  onInExcessAmountChange={setInExcessAmount}
                  onCompanyFieldsChange={({ head1, head2, head3, id }) => {
                     setCompanyHead1(head1);
                     setCompanyHead2(head2);
                     setCompanyHead3(head3);
                     setFederalId(id);
                  }}
               />
            );
         case 2:
            return <ReviewFiles />;
         case 3:
            return <PrintForms />;
         default:
            return null;
      }
   };

   return (
      <div className="voucherentry-container">
         <div className="flex-between">
            <h4>Year End 1099 Process Menu</h4>
         </div>

         <div className="content-div-container">
            <div className="content-card-header">
               <div className="flex-between">
                  <div>
                     <h4>{stepTitles[currentStep]}</h4>
                  </div>
                  {(currentStep === 2 || currentStep === 3) && (
                     <DefaultButton
                        name="restart"
                        label="Restart"
                        icon={<ReloadOutlined />}
                        onClick={handleRestart}
                     />
                  )}
               </div>
            </div>

            <Divider />

            <Stepper
               current={currentStep}
               titles={stepperTitles}
               size="small"
               className="custom-step"
               labelPlacement="vertical"
            />

            <Divider />

            {renderCurrentStep()}

            <div className="flex-end gap-16">
               {currentStep > 0 && currentStep !== 2 && currentStep !== 3 && (
                  <DefaultButton
                     name="back"
                     label={<h6>Back</h6>}
                     onClick={handleBack}
                  />
               )}
               {currentStep === 2 ? (
                  <>
                     <DefaultButton
                        name="vendor-maintenance"
                        label={<h6>1099 Vendor Maintenance</h6>}
                        onClick={handleVendorMaintenanceClick}
                     />
                     <CustomStyledButton
                        name="next"
                        label={<h6>Next</h6>}
                        onClick={handleNext}
                        disabled={!isNextEnabled()}
                     />
                  </>
               ) : currentStep === 3 ? (
                  <>
                     <DefaultButton
                        name="test-print"
                        label={<h6>Test Print</h6>}
                        onClick={handleTestPrint}
                     />
                     <CustomStyledButton
                        name="print"
                        label={
                           <h6>{isPrintLoading ? "Printing..." : "Print"}</h6>
                        }
                        onClick={handlePrint}
                        disabled={isPrintLoading}
                     />
                  </>
               ) : (
                  <CustomStyledButton
                     name="next"
                     label={<h6>Next</h6>}
                     onClick={handleNext}
                     disabled={!isNextEnabled()}
                  />
               )}
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

         <ModalContent
            title={
               <h4 className="modal-utiliy-title">
                  Would you like to restart?
               </h4>
            }
            description={
               <p className="p-xs modal-body-wrapper">
                  All the saved data will be lost and starts from step1
               </p>
            }
            visible={isRestartModalVisible}
            onCancel={() => setIsRestartModalVisible(false)}
            showCloseIcon={false}
            imageUrl={modalReloadIcon}
            actions={[
               {
                  name: "no",
                  label: "No",
                  onClick: () => setIsRestartModalVisible(false),
               },
               {
                  name: "yes-restart",
                  label: "Yes, Restart",
                  onClick: handleRestartConfirm,
               },
            ]}
            className="cne-modal descripition button-adjusted"
         />

         <ModalContent
            title={
               <h4 className="modal-utiliy-title">
                  You Are About to Exit 1099 Process!
               </h4>
            }
            description={
               <p className="p-xs modal-body-wrapper">
                  You will be navigating to the maintenance screen and will need
                  to restart the 1099 process again
               </p>
            }
            visible={isExitModalVisible}
            onCancel={() => setIsExitModalVisible(false)}
            showCloseIcon={false}
            imageUrl={modalCancelIcon}
            actions={[
               {
                  name: "no",
                  label: "No",
                  onClick: () => setIsExitModalVisible(false),
               },
               {
                  name: "yes-exit",
                  label: "Yes, Exit",
                  onClick: handleExitConfirm,
               },
            ]}
            className="cne-modal descripition button-adjusted"
         />

         <ModalContent
            title={
               <h4 className="modal-utiliy-title">Test Print is Success!</h4>
            }
            description={
               <p className="p-xs modal-body-wrapper">
                  If everything looks good, would you like to proceed with the
                  print?
               </p>
            }
            visible={isTestPrintModalVisible}
            onCancel={() => setIsTestPrintModalVisible(false)}
            showCloseIcon={false}
            imageUrl={popupOk}
            actions={[
               {
                  name: "no",
                  label: "No",
                  onClick: () => setIsTestPrintModalVisible(false),
               },
               {
                  name: "yes-print",
                  label: "Yes, Print 1099 file",
                  onClick: handleTestPrintConfirm,
               },
            ]}
            className="cne-modal descripition button-adjusted"
         />
 
         <ModalContent
            title={<h4 className="modal-utiliy-title">Success!</h4>}
            description={
               <p className="p-xs modal-body-wrapper">
                  The 1099 test print has been completed successfully.
               </p>
            }
            visible={isTestPrintSuccessModalVisible}
            onCancel={handleTestPrintSuccessClose}
            showCloseIcon={false}
            imageUrl={popupOk}
            actions={[
               {
                  name: "ok",
                  label: "Ok",
                  onClick: handleTestPrintSuccessClose,
               },
            ]}
            className="cne-modal descripition button-adjusted"
         />
 
         <ModalContent
            title={<h4 className="modal-utiliy-title">Success!</h4>}
            description={
               <p className="p-xs modal-body-wrapper">
                  The 1099 papers have been printed successfully.
               </p>
            }
            visible={isPrintSuccessModalVisible}
            onCancel={handlePrintSuccessClose}
            showCloseIcon={false}
            imageUrl={popupOk}
            actions={[
               {
                  name: "ok",
                  label: "Ok",
                  onClick: handlePrintSuccessClose,
               },
            ]}
            className="cne-modal descripition button-adjusted"
         />
      </div>
   );
};

export default YearEnd1099ProcessMenu;
