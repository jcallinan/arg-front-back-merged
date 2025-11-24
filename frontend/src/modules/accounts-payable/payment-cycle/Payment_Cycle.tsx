import { useState, useRef, useEffect } from "react";
import { Divider } from "antd";
// import { useNavigate } from "react-router-dom";
import { CustomStyledButton, DefaultButton } from "@widget-library/Buttons";
import { ReloadOutlined } from "@ant-design/icons";
import popupOk from "@assets/icons/popup-ok.svg";
import ModalContent from "@widget-library/Modal";
import { CustomPrefixInput } from "@widget-library/Input";
import PaymentStepper from "./payment-stepper/PaymentStepper";
import PaymentSelection from "./payment-stepper/payment-forms/PaymentSelection";
import CashRequirment from "./payment-stepper/payment-forms/CashRequirment";
import CheckRegister from "./payment-stepper/payment-forms/CheckRegister";

import APCheck from "./payment-stepper/payment-forms/APCheck";
import type {
   PaymentFormState,
   PaymentTypeState,
   PaymentItem,
   PrintChecksRef,
} from "../../../types/accounts-payable.types";
import "./payment-cycle.scss";
import PrintChecks from "./payment-stepper/payment-forms/PrintChecks";
import { useReportDetails } from "../../../hooks/useReportDetails";
import { useGenerateReport } from "../../../hooks/useGenerateReport";
import { useGenerateReportFiles } from "../../../hooks/useGenerateReportFiles";
import { useAuthCodeValidation } from "../../../hooks/useAuthCodeValidation";
import { usePaymentCycle } from "../../../hooks/usePaymentCycle";
import Toaster from "../../../widget-library/Toaster";

const Payment_Cycle = () => {
   // const navigate = useNavigate();
   const printChecksRef = useRef<PrintChecksRef>(null);

   const [currentStep, setCurrentStep] = useState(0);
   const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
   const [isRestartModalVisible, setIsRestartModalVisible] = useState(false);
   const [isSimpleRestartModalVisible, setIsSimpleRestartModalVisible] =
      useState(false);
   const [authCode, setAuthCode] = useState("");
   const [voucherType, setVoucherType] = useState("");
   const [isPaymentTypeSubmitted, setIsPaymentTypeSubmitted] = useState(false);
   const [hasSavedPayments, setHasSavedPayments] = useState(false);
   const [dateToPayBy, setDateToPayBy] = useState("");
   const [isFinalApiSuccessful, setIsFinalApiSuccessful] = useState(false);

   // Lifted state from PaymentSelection component
   const generateEntrySequence = (index: number): string => {
      return (index + 1).toString().padStart(5, "0");
   };

   const createDefaultPayment = (): PaymentItem => ({
      id: Date.now(),
      entrySequence: generateEntrySequence(0),
      voucherToPay: "Check",
      startingCheck: "",
      checkDate: "",
      dateToPayBy: "",
      forcedDiscount1: false,
      bankAccountGL: "",
      bankAccountGLDescription: "",
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
   });

   const [paymentFormState, setPaymentFormState] = useState<PaymentFormState>({
      payments: [createDefaultPayment()],
   });

   const [paymentTypeState, setPaymentTypeState] = useState<PaymentTypeState>({
      companyNo: "10",
      voucherToPay: "Check",
      startingCheck: "",
      checkDate: "",
      dateToPayBy: "",
      forcedDiscount1: false,
      bankAccountGL: "",
      bankAccountGLDescription: "",
   });

   const [isPaymentFormSubmitted, setIsPaymentFormSubmitted] = useState(false);
   const [isEditMode, setIsEditMode] = useState(false);
   const [notification, setNotification] = useState<{
      visible: boolean;
      type: "success" | "error";
      title: string;
      subtitle: string;
   }>({
      visible: false,
      type: "success",
      title: "",
      subtitle: "",
   });

   // Hooks for dynamic report parameter fetch and report generation
   const {
      reportParameters,
      loading: reportDetailsLoading,
      fetchReportDetails,
   } = useReportDetails();
   const { generateReport: _originalGenerateReport, isLoading: _generateReportLoading } =
      useGenerateReport();
   const { generateReportFiles: _originalGenerateReportFiles, isLoading: _generateReportFilesLoading } =
      useGenerateReportFiles();
   const {
      validateAuthCode,
      isLoading: isAuthCodeLoading,
      error: authCodeError,
   } = useAuthCodeValidation();
   
   // Payment Cycle custom hook
   const {
      generateReport,
      generateReportFiles,
   } = usePaymentCycle();

   // Debug: Monitor authCodeError changes
   useEffect(() => {}, [authCodeError]);

   // When voucher type becomes "Check" during Payment Selection, fetch report parameter definitions
   useEffect(() => {
      const useCaseMap: Record<string, string> = {
         Check: "Payment_Cycle_Check_Submit",
         ACH: "Payment_Cycle_Ach_Submit",
         Wire: "Payment_Cycle_Wire_Submit",
      };
      const useCase = useCaseMap[voucherType as keyof typeof useCaseMap];
      if (useCase) {
         fetchReportDetails(useCase, "in");
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [voucherType]);

   // Initial load - if voucherType is already set (e.g., "Check" from dropdown default), fetch report details
   useEffect(() => {
      // Check if voucherType is set and we haven't loaded report parameters yet
      if (voucherType && reportParameters.length === 0) {
         const useCaseMap: Record<string, string> = {
            Check: "Payment_Cycle_Check_Submit",
            ACH: "Payment_Cycle_Ach_Submit",
            Wire: "Payment_Cycle_Wire_Submit",
         };
         const useCase = useCaseMap[voucherType as keyof typeof useCaseMap];
         if (useCase) {
            fetchReportDetails(useCase, "in");
         }
      }
      // If voucherType is not set but we have no report parameters, try to fetch for "Check" as default
      else if (!voucherType && reportParameters.length === 0) {
         fetchReportDetails("Payment_Cycle_Check_Submit", "in");
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [voucherType, reportParameters.length]);

   // Step 5: Check Register - fetch report details on component load
   useEffect(() => {
      if (currentStep === 4) {
         const useCaseMap: Record<string, string> = {
            Check: "Payment_Cycle_Check_Finalize",
            ACH: "Payment_Cycle_Arch_And_Wire_Finalize",
            Wire: "Payment_Cycle_Arch_And_Wire_Finalize",
         };
         const useCase = useCaseMap[voucherType as keyof typeof useCaseMap];
         if (useCase) {
            fetchReportDetails(useCase, "in");
         }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [currentStep, voucherType]);

   const defaultStepTitles = [
      "Payment Selection",
      "Cash Requirement",
      "AP Check",
      "Print Checks",
      "Check Register",
   ];

   const getStepConfig = () => {
      const selectionStep = (
         <PaymentSelection
            onVoucherTypeChange={setVoucherType}
            onPaymentTypeSubmit={setIsPaymentTypeSubmitted}
            isPaymentTypeSubmitted={isPaymentTypeSubmitted}
            onPaymentSaved={setHasSavedPayments}
            hasSavedPayments={hasSavedPayments}
            onDateToPayByChange={setDateToPayBy}
            // Lifted state props
            paymentFormState={paymentFormState}
            setPaymentFormState={setPaymentFormState}
            paymentTypeState={paymentTypeState}
            setPaymentTypeState={setPaymentTypeState}
            isPaymentFormSubmitted={isPaymentFormSubmitted}
            setIsPaymentFormSubmitted={setIsPaymentFormSubmitted}
            isEditMode={isEditMode}
            setIsEditMode={setIsEditMode}
            generateEntrySequence={generateEntrySequence}
         />
      );

      // After moving to step 1 or beyond, adjust steps based on voucher type
      if (currentStep > 0) {
         // For voucher types other than "Check", only show Payment Selection and Cash Requirement
         if (voucherType && voucherType !== "Check") {
            return {
               steps: [
                  selectionStep,
                  <CashRequirment voucherType={voucherType} />,
               ],
               stepTitles: ["Payment Selection", "Cash Requirement"],
            };
         }
         // For "Check" voucher type, show all steps
         else if (voucherType === "Check") {
            return {
               steps: [
                  selectionStep,
                  <CashRequirment voucherType={voucherType} />,
                  <APCheck voucherType={voucherType} />,
                  <PrintChecks ref={printChecksRef} />,
                  <CheckRegister />,
               ],
               stepTitles: defaultStepTitles,
            };
         }
      }

      // Default case - show all steps initially (step 0)
      return {
         steps: [
            selectionStep,
            <CashRequirment voucherType={voucherType} />,
            <APCheck voucherType={voucherType} />,
            <PrintChecks ref={printChecksRef} />,
            <CheckRegister />,
         ],
         stepTitles: defaultStepTitles,
      };
   };

   const { steps, stepTitles } = getStepConfig();

   const handleNext = () => {
      if (currentStep < steps.length - 1) {
         setCurrentStep((prev) => prev + 1);
      } else {
         setIsSuccessModalVisible(true);
      }
   };

   const handleBack = () => {
      if (currentStep > 0) {
         setCurrentStep((prev) => prev - 1);
      }
   };

   const handlePrint = async () => {
      try {
         if (printChecksRef.current) {
            await printChecksRef.current.handlePrint();
            handleNext();
         }
      } catch (error) {
         console.error("Error during print process:", error);
         // Still proceed to next step even if printing fails
         handleNext();
      }
   };

   const handleModalClose = () => {
      setIsSuccessModalVisible(false);
      if (isFinalApiSuccessful) {
         handleRestartLogic();
      }
   };

   const handleRestart = () => {
      // Different restart behavior based on current step
      if (currentStep === 0 || currentStep === 1) {
         // Step 0 and 1: Show simple restart confirmation modal
         setIsSimpleRestartModalVisible(true);
      } else {
         // Step 2 onwards: Show authorization popup
         setIsRestartModalVisible(true);
      }
   };

   const handleSimpleRestartConfirm = () => {
      setIsSimpleRestartModalVisible(false);
      handleRestartLogic();
   };

   const handleRestartConfirm = async () => {
      // Validate auth code via API for restart from step 2 onwards
      if (authCode) {
         const isValid = await validateAuthCode(10, parseInt(authCode, 10));

         if (isValid) {
            // If API call is successful, clear all data and land on step 0
            setIsRestartModalVisible(false);
            setAuthCode("");
            handleRestartLogic();
         } else {
            setNotification({
               visible: true,
               type: "error",
               title: "Authorization Failed",
               subtitle:
                  authCodeError || "Authorization failed. Please try again.",
            });
         }
      } else {
         setNotification({
            visible: true,
            type: "error",
            title: "Authorization Required",
            subtitle: "Please enter an authorization code to restart.",
         });
      }
   };

   const handleRestartLogic = () => {
      // Always do a complete restart to step 0 with all data cleared
      setCurrentStep(0);
      setVoucherType("");
      setIsPaymentTypeSubmitted(false);
      setHasSavedPayments(false);
      setDateToPayBy("");
      setIsFinalApiSuccessful(false);
      // Reset lifted state
      setPaymentFormState({ payments: [createDefaultPayment()] });
      setPaymentTypeState({
         companyNo: "10",
         voucherToPay: "Check",
         startingCheck: "",
         checkDate: "",
         dateToPayBy: "",
         forcedDiscount1: false,
         bankAccountGL: "",
         bankAccountGLDescription: "",
      });
      setIsPaymentFormSubmitted(false);
      setIsEditMode(false);
   };

   const isNextEnabled = () => {
      if (currentStep === 0) {
         // For Payment Selection step - need payment type submitted, voucher type, and either saved payments OR date to pay by
         // Also disable if GET is still loading
         return (
            isPaymentTypeSubmitted &&
            voucherType &&
            (hasSavedPayments || dateToPayBy) &&
            !reportDetailsLoading
         );
      }
      // If we're on the Print Checks step and printing is in progress, disable button
      if (currentStep === 3 && voucherType === "Check") {
         return !printChecksRef.current?.isPrintLoading;
      }
      // For all other steps, always enabled
      return true;
   };

   const getButtonLabel = () => {
      // If voucher type is not "Check" and we're on step 1 (Cash Requirement), show "Finalise"
      if (voucherType !== "Check" && currentStep === 1) {
         return "Finalize";
      }
      // If voucher type is "Check" and we're on step 3 (Print Checks), show "Print" or "Printing..."
      if (currentStep === 3 && voucherType === "Check") {
         return printChecksRef.current?.isPrintLoading
            ? "Printing..."
            : "Print";
      }
      // If we're on the last step, show "Finish"
      if (currentStep === steps.length - 1) {
         return "Finalize";
      }
      // Otherwise show "Next"
      return "Next";
   };

   const handleButtonClick = async () => {
      // Special handling for Print button
      if (currentStep === 3 && voucherType === "Check") {
         handlePrint();
         return;
      }

      // Step 0: Payment Selection -> when voucher type is Check/ACH/Wire, call POST generate report
      if (currentStep === 0 && ["Check", "ACH", "Wire"].includes(voucherType)) {
         // Wait for GET response to complete before POST
         if (reportDetailsLoading) {
            return;
         }

         try {
            const useCaseMap: Record<string, string> = {
               Check: "Payment_Cycle_Check_Submit",
               ACH: "Payment_Cycle_Ach_Submit",
               Wire: "Payment_Cycle_Wire_Submit",
            };
            const useCase = useCaseMap[voucherType as keyof typeof useCaseMap];

            // Map all reportParameters to parameters array
            const fullParameters = (reportParameters || [])
               .map((p) => ({
                  name: p.fieldKey || "",
                  value: p.xmlMetadata || "",
               }))
               .filter((p) => p.name !== ""); // Filter out empty fieldKeys

            await generateReport(useCase, fullParameters);

            // LAST: Generate report files, then navigate (advance) on success
            const filesResult = await generateReportFiles({
               companyNo: parseInt(paymentTypeState.companyNo, 10),
               usecase: "payment-selection",
            });

            if (!filesResult.success) {
               setNotification({
                  visible: true,
                  type: "error",
                  title: "Error",
                  subtitle:
                     filesResult.message || "Failed to generate report files",
               });
               return; // stop here on failure
            }
         } catch (error) {
            // Proceed regardless, per flow requirements unless told otherwise
            console.error("Error generating Payment Cycle useCase:", error);
            return;
         }
         // On success path only, advance
         handleNext();
         return;
      }

      // Step 1: Cash Requirement -> POST finalize based on voucher type with empty parameters
      if (currentStep === 1 && ["Check", "ACH", "Wire"].includes(voucherType)) {
         try {
            const useCaseMap: Record<string, string> = {
               Check: "Payment_Cycle_Check_Cash_Requirement_Submit",
               ACH: "Payment_Cycle_Arch_And_Wire_Finalize",
               Wire: "Payment_Cycle_Arch_And_Wire_Finalize",
            };
            const useCase = useCaseMap[voucherType as keyof typeof useCaseMap];
            const response = await generateReport(useCase, []);

            if (voucherType === "ACH" || voucherType === "Wire") {
               setIsFinalApiSuccessful(true);
               
               if (response?.data?.items?.message?.[0]) {
                  setNotification({
                     visible: true,
                     type: "success",
                     title: "Success",
                     subtitle: response.data.items.message[0],
                  });
               }
            }
         } catch (error) {
            console.error(
               "Error posting Cash Requirement submit/finalize:",
               error
            );
            
            if (voucherType === "ACH" || voucherType === "Wire") {
               setIsFinalApiSuccessful(false);
               setNotification({
                  visible: true,
                  type: "error",
                  title: "Error",
                  subtitle: "An error occurred while finalizing the payment cycle",
               });
            }
         } finally {
            handleNext();
         }
         return;
      }

      // Step 5: Check Register -> POST finalize with empty parameters
      if (currentStep === 4 && ["Check", "ACH", "Wire"].includes(voucherType)) {
         try {
            const useCaseMap: Record<string, string> = {
               Check: "Payment_Cycle_Check_Finalize",
               ACH: "Payment_Cycle_Arch_And_Wire_Finalize",
               Wire: "Payment_Cycle_Arch_And_Wire_Finalize",
            };
            const useCase = useCaseMap[voucherType as keyof typeof useCaseMap];
            const response = await generateReport(useCase, []);

            // Only proceed if API call was successful
            setIsFinalApiSuccessful(true);
            
            // Show success message from response
            // if (response?.data?.items?.message?.[0]) {
            //    setNotification({
            //       visible: true,
            //       type: "success",
            //       title: "Success",
            //       subtitle: response.data.items.message[0],
            //    });
            // }
            
            // Only show success modal if API was successful
            handleNext();
         } catch (error) {
            console.error("Error posting Check Register finalize:", error);
            setIsFinalApiSuccessful(false);
            setNotification({
               visible: true,
               type: "error",
               title: "Error",
               subtitle: "An error occurred while finalizing the payment cycle",
            });
         }
         return;
      }

      handleNext();
   };

   return (
      <div className="voucherentry-container">
         <h4>Payment Cycle</h4>
         <div className="content-div-container">
            <div className="flex-between">
               <h4>{stepTitles[currentStep]}</h4>
               <DefaultButton
                  name="restart"
                  label="Restart"
                  icon={<ReloadOutlined />}
                  onClick={handleRestart}
               />
            </div>

            <Divider />

            <PaymentStepper
               currentStep={currentStep}
               voucherType={voucherType}
               stepTitles={stepTitles}
            />

            <div>{steps[currentStep]}</div>

            <div className="flex-end gap-16 button-position">
               {/* Show back button only for Cash Requirement step when Check is selected */}
               {currentStep === 1 && voucherType === "Check" && (
                  <DefaultButton
                     name="back"
                     label="Back"
                     onClick={handleBack}
                  />
               )}
               <CustomStyledButton
                  name={getButtonLabel().toLowerCase()}
                  label={getButtonLabel()}
                  onClick={handleButtonClick}
                  disabled={!isNextEnabled()}
               />
            </div>
         </div>

         <ModalContent
            title="Payment Cycle is Complete!"
            description="Checks have been posted to general ledger"
            visible={isSuccessModalVisible}
            onCancel={handleModalClose}
            showCloseIcon={false}
            imageUrl={popupOk}
            actions={[
               {
                  name: "ok",
                  label: "Ok",
                  onClick: handleModalClose,
               },
            ]}
            className="cne-modal descripition"
         />

         <ModalContent
            title={
               <h4 className="modal-utiliy-title">
                  Would you like to restart?
               </h4>
            }
            description={
               <p className="p-xs modal-body-wrapper">
                  You are about to restart the process. All entered data will be
                  lost.
               </p>
            }
            visible={isSimpleRestartModalVisible}
            onCancel={() => setIsSimpleRestartModalVisible(false)}
            showCloseIcon={false}
            imageUrl={popupOk}
            actions={[
               {
                  name: "no",
                  label: "No",
                  onClick: () => setIsSimpleRestartModalVisible(false),
               },
               {
                  name: "yes-restart",
                  label: "Yes, Restart",
                  onClick: handleSimpleRestartConfirm,
               },
            ]}
            className="cne-modal descripition button-adjusted"
         />

         <ModalContent
            title="Authorization Code"
            visible={isRestartModalVisible}
            onCancel={() => setIsRestartModalVisible(false)}
            actions={[
               {
                  name: "submit",
                  label: isAuthCodeLoading ? "Validating..." : "Submit",
                  onClick: handleRestartConfirm,
                  className: "modal-restart__submit",
               },
            ]}
            className="modal-restart"
            description={
               <div className="modal-restart__body">
                  <label className="modal-restart__label" htmlFor="authCode">
                     Enter Authorization Code
                  </label>
                  <CustomPrefixInput
                     name="authCode"
                     value={authCode}
                     onChange={(e) => setAuthCode(e.target.value)}
                     placeholder="Enter Authorization Code"
                     className="modal-restart__input"
                     disabled={isAuthCodeLoading}
                  />
                  <p className="modal-restart__note">
                     <strong>Note:</strong> Your manager can provide you the
                     authorization code
                  </p>
               </div>
            }
         />

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

export default Payment_Cycle;