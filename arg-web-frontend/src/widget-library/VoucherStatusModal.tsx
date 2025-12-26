import React, { useEffect, useState } from "react";
import Toaster from "@widget-library/Toaster";
import "../modules/accounts-payable/voucher-management/sub-modules/voucher-maintenance/voucher-maintenanece.scss";
import ModalContent from "@widget-library/Modal";
import Card from "@widget-library/Card";
import { CustomSelectDropdown } from "@widget-library/Dropdown";
import { VOUCHER_STATUS_OPTIONS } from "@constants/commonConstants";
import vendorIcon from "@assets/icons/vendor-icon.svg";
import vendorNoIcon from "@assets/icons/vendor-no-icon.svg";
import entryNoIcon from "@assets/icons/entry-no-icon.svg";
import companyIcon from "@assets/icons/company-icon.svg";
import { CustomPrefixInput } from "@widget-library/Input";
import { Divider } from "antd";
import type { ModalAction } from "@type-definitions/accounts-payable.types";
import { useUpdateVoucherStatus } from "@hooks/useVoucherMaintenance";

interface VoucherStatusModalProps {
   visible: boolean;
   onCancel: () => void;
   onSuccess?: () => void;
   voucherData?: {
      companyNo: string;
      vendorName: string;
      vendorNo: string;
      voucherNo: string;
      statusCode?: string;
      statusDescription?: string;
   };
}

const VoucherStatusModal: React.FC<VoucherStatusModalProps> = ({
   visible,
   onCancel,
   onSuccess,
   voucherData,
}) => {
   const MAX_DESC_LENGTH = 25;
   const [statusCode, setStatusCode] = useState("");
   const [statusDesc, setStatusDesc] = useState("");
   const [statusDescError, setStatusDescError] = useState<string | undefined>(
      undefined
   );
   const [toasterType, setToasterType] = useState<"success" | "error">(
      "success"
   );
   const [toasterMessage, setToasterMessage] = useState("");
   const [toasterDescription, setToasterDescription] = useState("");

   // React Query mutation hook
   const updateVoucherStatusMutation = useUpdateVoucherStatus();

  // Prefill form with values from API/list when modal opens
  useEffect(() => {
    if (visible) {
      const initialCode = voucherData?.statusCode ?? "";
      const initialDesc = voucherData?.statusDescription ?? "";
      setStatusCode(initialCode);
      setStatusDesc(initialDesc);
      setStatusDescError(
        initialDesc && initialDesc.length > MAX_DESC_LENGTH
          ? `Maximum ${MAX_DESC_LENGTH} characters allowed for Status Description.`
          : undefined
      );
    }
  }, [visible, voucherData]);

   const handleReset = () => {
      setStatusCode("");
      setStatusDesc("");
      setStatusDescError(undefined);
   };

   const handleSave = async () => {
      // Validation
      if (!voucherData) {
         setToasterType("error");
         setToasterMessage("Error");
         setToasterDescription("No voucher data available. Please try again.");
         return;
      }

      if (!statusCode) {
         setToasterType("error");
         setToasterMessage("Error");
         setToasterDescription("Please select a status code.");
         return;
      }

      if (!statusDesc.trim()) {
         setStatusDescError("Please enter a status description.");
         return;
      }

      if (statusDesc.trim().length > MAX_DESC_LENGTH) {
         setStatusDescError(
            `Status Description must be at most ${MAX_DESC_LENGTH} characters.`
         );
         return;
      }

      try {
         const updateData = {
            companyNo: Number(voucherData.companyNo),
            vendorNo: Number(voucherData.vendorNo),
            voucherNo: Number(voucherData.voucherNo),
            statusCode: statusCode as " " | "H" | "A" | "W" | "E" | "U",
            statusDescription: statusDesc.trim(),
         };

         // Validate converted numbers
         if (
            isNaN(updateData.companyNo) ||
            isNaN(updateData.vendorNo) ||
            isNaN(updateData.voucherNo)
         ) {
            setToasterType("error");
            setToasterMessage("Error");
            setToasterDescription(
               "Invalid voucher data. Please close and reopen the modal."
            );
            console.error("Invalid number conversion:", {
               companyNo: updateData.companyNo,
               vendorNo: updateData.vendorNo,
               voucherNo: updateData.voucherNo,
            });
            return;
         }

         const response = await updateVoucherStatusMutation.mutateAsync(updateData);

         if (response?.data?.data?.message) {
            setToasterType("success");
            setToasterMessage("Success");
            setToasterDescription(response.data.data.message);
         } else {
            setToasterType("success");
            setToasterMessage("Success");
            setToasterDescription("Voucher status updated successfully");
         }

         // Reset form and close modal
         handleReset();
         onCancel();

         // Call success callback to refresh data
         if (onSuccess) {
            onSuccess();
         }
      } catch (error: any) {
         console.error("Error updating voucher status:", error);
         console.error(
            "Error details:",
            error?.response?.data || error?.data || error
         );

         // Handle specific error types
         if (error?.response?.data?.error?.code === "NOT_FOUND") {
            const details = error.response.data.error.details;
            if (details && details.length > 0) {
               const voucherError = details.find(
                  (detail: any) => detail.field === "voucher"
               );
               if (voucherError) {
                  setToasterType("error");
                  setToasterMessage("Error");
                  setToasterDescription(
                     `Voucher not found: ${voucherError.message}`
                  );
                  //console.error("Voucher lookup failed with data:", updateData);
                  return;
               }
            }
            setToasterType("error");
            setToasterMessage("Error");
            setToasterDescription(
               "Voucher not found in the system. This may be a data consistency issue - the voucher exists in the list but not in the status update system. Please contact support if this persists."
            );
         } else if (error?.response?.data?.error?.message) {
            setToasterType("error");
            setToasterMessage("Error");
            setToasterDescription(error.response.data.error.message);
         } else {
            setToasterType("error");
            setToasterMessage("Error");
            setToasterDescription(
               "Failed to update voucher status. Please try again."
            );
         }
      }
   };

   const footerActions: ModalAction[] = [
      {
         name: "reset",
         label: "Reset",
         onClick: handleReset,
         type: "default",
      },
      {
         name: "save",
         label: updateVoucherStatusMutation.isPending ? "Saving..." : "Save",
         onClick: handleSave,
         type: "custom",
      },
   ];

   return (
      <>
         {toasterMessage && (
            <Toaster
               type={toasterType}
               title={toasterMessage}
               subtitle={toasterDescription}
               onClose={() => {
                  setToasterMessage("");
                  setToasterDescription("");
               }}
            />
         )}
         <ModalContent
            title="A/P Voucher Status Code Entry"
            visible={visible}
            onCancel={onCancel}
            className="voucher-status-modal"
            actions={footerActions}
            description={
               <div className="voucher-modal">
                  <Divider />
                  <div className="voucher-card-grid">
                     <div className="grid-item quarter">
                        <Card
                           icon={<img src={companyIcon} alt="Company" />}
                           label="Company No"
                           value={voucherData?.companyNo || "10"}
                        />
                     </div>
                     <div className="grid-item three-quarter">
                        <Card
                           icon={<img src={vendorIcon} alt="Vendor Name" />}
                           label="Vendor Name"
                           value={voucherData?.vendorName || " "}
                        />
                     </div>
                     <div className="grid-item quarter">
                        <Card
                           icon={<img src={vendorNoIcon} alt="Vendor No" />}
                           label="Vendor No"
                           value={voucherData?.vendorNo || " "}
                        />
                     </div>
                     <div className="grid-item quarter">
                        <Card
                           icon={<img src={entryNoIcon} alt="Voucher No" />}
                           label="Voucher No"
                           value={voucherData?.voucherNo || " "}
                        />
                     </div>
                  </div>

                  <div className="voucher-form-section">
                     <div className="form-row">
                        <span className="sub-title">Status Code</span>
                        <CustomSelectDropdown
                           className="status-dropdown"
                           options={VOUCHER_STATUS_OPTIONS}
                           placeholder="Select"
                           value={statusCode}
                           onChange={(val) => setStatusCode(val)}
                           name="statusCode"
                        />
                     </div>

                     <div className="form-row">
                        <span className="sub-title">Status Description</span>
                        <CustomPrefixInput
                           placeholder="Enter description"
                           value={statusDesc}
                           onChange={(e) => {
                              const value = e.target.value;
                              if (value.length > MAX_DESC_LENGTH) {
                                 setStatusDescError(
                                    `Maximum ${MAX_DESC_LENGTH} characters allowed for Status Description.`
                                 );
                                 return; // hard stop at 25
                              }
                              setStatusDescError(undefined);
                              setStatusDesc(value);
                           }}
                           status={statusDescError ? "error" : undefined}
                           name={""}
                        />
                        {statusDescError && (
                           <div
                              className="error-message"
                           >
                              {statusDescError}
                           </div>
                        )}
                     </div>
                     <Divider />
                  </div>
               </div>
            }
         />
      </>
   );
};

export default VoucherStatusModal;
