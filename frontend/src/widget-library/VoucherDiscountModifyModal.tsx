import React, { useState, useEffect } from "react";
import "../modules/accounts-payable/voucher-management/sub-modules/voucher-maintenance/voucher-maintenanece.scss";
import ModalContent from "@widget-library/Modal";
import Card from "@widget-library/Card";
import vendorIcon from "@assets/icons/vendor-icon.svg";
import calendarIcon from "@assets/icons/calender-icon.svg";
import paidAmountIcon from "@assets/icons/last-paid-card-icon.svg";
import vendorNoIcon from "@assets/icons/vendor-no-icon.svg";
import entryNoIcon from "@assets/icons/entry-no-icon.svg";
import companyIcon from "@assets/icons/company-icon.svg";
import { CustomPrefixInput } from "@widget-library/Input";
import { Divider, message } from "antd";
import CustomDatePicker from "@widget-library/DatePicker";
import type { ModalAction } from "@type-definitions/accounts-payable.types";
import { useUpdateVoucherDiscount } from "@hooks/useVoucherMaintenance";
import { formatMMDDYYForDisplay } from "@utils/dateFormat";
 
interface VoucherDiscountData {
   companyNo: string;
   vendorName: string;
   vendorNo: string;
   voucherNo: string;
   discountDueDate: string;
   discountAmount: string;
}
 
interface VoucherDiscountModifyProps {
   visible: boolean;
   onCancel: () => void;
   voucherData?: VoucherDiscountData;
   onSuccess?: () => void;
}
 
const VoucherDiscountModify: React.FC<VoucherDiscountModifyProps> = ({
   visible,
   onCancel,
   voucherData,
   onSuccess,
}) => {
   const [newDueDate, setNewDueDate] = useState<string>("");
   const [newAmount, setNewAmount] = useState("");
   const [amountError, setAmountError] = useState<string>("");
   const [errorTimeout, setErrorTimeout] = useState<NodeJS.Timeout | null>(null);

   // React Query mutation hook
   const updateVoucherDiscountMutation = useUpdateVoucherDiscount();
 
   // Initialize form fields when voucherData changes or modal opens
   useEffect(() => {
      if (visible && voucherData) {
         // Always start with empty fields for "new" values
         setNewDueDate("");
         setNewAmount("");
         setAmountError("");
         // Clear any existing error timeout
         if (errorTimeout) {
            clearTimeout(errorTimeout);
            setErrorTimeout(null);
         }
      } else if (!visible) {
         // Reset fields when modal closes
         setNewDueDate("");
         setNewAmount("");
         setAmountError("");
         // Clear timeout when modal closes
         if (errorTimeout) {
            clearTimeout(errorTimeout);
            setErrorTimeout(null);
         }
      }
   }, [visible, voucherData, errorTimeout]);
 
   // Cleanup timeout on unmount
   useEffect(() => {
      return () => {
         if (errorTimeout) {
            clearTimeout(errorTimeout);
         }
      };
   }, [errorTimeout]);
 
   // Helper function to show error with auto-clear
   /* const _showTemporaryError = (errorMsg: string) => {
      // Clear any existing timeout
      if (errorTimeout) {
         clearTimeout(errorTimeout);
      }
     
      // Set the error message
      setAmountError(errorMsg);
     
      // Auto-clear after 3 seconds
      const timeout = setTimeout(() => {
         setAmountError("");
         setErrorTimeout(null);
      }, 3000);
     
      setErrorTimeout(timeout);
   }; */
 
   const handleReset = () => {
      // Reset to empty fields for new values
      setNewDueDate("");
      setNewAmount("");
      setAmountError("");
      // Clear any existing timeout
      if (errorTimeout) {
         clearTimeout(errorTimeout);
         setErrorTimeout(null);
      }
   };
 
   // Convert MM/DD/YY from DatePicker to MMDDYY for API
   const formatDateForAPI = (dateStr: string): string => {
      if (!dateStr || dateStr.trim() === "") return "";
 
      try {
         // Parse MM/DD/YY format from CustomDatePicker and convert to MMDDYY
         const [month, day, year] = dateStr.split("/");
         return `${month.padStart(2, "0")}${day.padStart(
            2,
            "0"
         )}${year.padStart(2, "0")}`;
      } catch (error) {
         console.error("Error formatting date for API:", error);
         return "";
      }
   };
 
   const handleSave = async () => {
      if (!voucherData) {
         message.error("No voucher data available");
         return;
      }
 
      if (!newDueDate || newDueDate.trim() === "") {
         message.error("Please select a valid discount due date");
         return;
      }
 
      // Clear any previous amount errors
      setAmountError("");
 
      if (!newAmount || newAmount.trim() === "") {
         setAmountError("Please enter a discount amount");
         message.error("Please enter a discount amount");
         return;
      }
 
      if (newAmount.length > 7) {
         setAmountError("Discount amount cannot exceed 7 characters");
         message.error("Discount amount cannot exceed 7 characters");
         return;
      }
 
      if (isNaN(parseFloat(newAmount))) {
         setAmountError("Please enter a valid numeric amount");
         message.error("Please enter a valid numeric amount");
         return;
      }
 
      if (parseFloat(newAmount) < 0) {
         setAmountError("Discount amount cannot be negative");
         message.error("Discount amount cannot be negative");
         return;
      }
 
      try {
         const updateData = {
            companyNo: parseInt(voucherData.companyNo),
            vendorNo: parseInt(voucherData.vendorNo),
            voucherNo: parseInt(voucherData.voucherNo),
            discountDueDate: formatDateForAPI(newDueDate),
            discount: parseFloat(newAmount), // API expects discount amount in dollars, not cents
         };

         const response = await updateVoucherDiscountMutation.mutateAsync(updateData);

         if (response.data?.data?.message) {
            message.success(response.data.data.message);
            onSuccess?.();
            onCancel();
         } else {
            message.success("Discount information updated successfully");
            onSuccess?.();
            onCancel();
         }
      } catch (error) {
         console.error("Error updating voucher discount:", error);
         message.error(
            "Failed to update discount information. Please try again."
         );
      }
   };
 
   const footerActions: ModalAction[] = [
      {
         name: "reset",
         label: "Reset",
         onClick: handleReset,
         type: "default" as const,
      },
      {
         name: "save",
         label: updateVoucherDiscountMutation.isPending ? "Saving..." : "Save",
         onClick: handleSave,
         type: "custom" as const,
      },
   ];
 
   return (
      <ModalContent
         title="A/P Voucher Discount Data Modify"
         visible={visible}
         onCancel={onCancel}
         className="voucher-status-modal "
         actions={footerActions}
         description={
            <div className="voucher-modal voucher-discount-modal-content">
               <Divider />
               <div className="voucher-card-grid">
                  <div className="grid-item quarter">
                     <Card
                        icon={<img src={companyIcon} alt="Company" />}
                        label="Company No"
                        value={voucherData?.companyNo || " "}
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
                  <div className="grid-item quarter">
                     <Card
                        icon={
                           <img src={calendarIcon} alt="Discount Due Date" />
                        }
                        label="Discount Due Date"
                        value={formatMMDDYYForDisplay(
                           voucherData?.discountDueDate
                        )}
                     />
                  </div>
                  <div className="grid-item quarter">
                     <Card
                        icon={
                           <img src={paidAmountIcon} alt="Discount Amount" />
                        }
                        label="Discount Amount"
                        value={voucherData?.discountAmount || "$0.00"}
                     />
                  </div>
               </div>
 
               <div className="form-row">
                  <div>
                     <span className="sub-title">New Discount Due Date</span>
                     <CustomDatePicker
                        value={newDueDate}
                        onChange={(_, dateStr) => {
                           setNewDueDate(dateStr || "");
                        }}
                        name={"newDiscountDueDate"}
                        disabled={updateVoucherDiscountMutation.isPending}
                     />
                  </div>
                  <div>
                     <span className="sub-title">New Discount Amount</span>
                     <CustomPrefixInput
                        placeholder="Enter new discount amount (e.g., 10.99)"
                        value={newAmount}
                        onChange={(e) => {
                           const inputValue = e.target.value;
                           
                           // Clear error when user starts typing valid input
                           if (amountError && inputValue.length <= 7) {
                              setAmountError("");
                           }
                           
                           // Check for maximum length (7 characters)
                           if (inputValue.length > 7) {
                              setAmountError("Discount amount cannot exceed 7 characters");
                              return; // Don't update the value
                           }
                           
                           // Check if input contains alphabetical characters
                           if (/[a-zA-Z]/.test(inputValue)) {
                              setAmountError("Alphabetical characters are not allowed");
                              return; // Don't update the value
                           }
                           
                           // Check if input contains invalid special characters (except decimal point)
                           if (/[^0-9.]/.test(inputValue)) {
                              setAmountError("Only numbers and decimal point are allowed");
                              return; // Don't update the value
                           }
                           
                           // Prevent multiple decimal points
                           const decimalCount = (inputValue.match(/\./g) || []).length;
                           if (decimalCount > 1) {
                              setAmountError("Only one decimal point is allowed");
                              return; // Don't update the value
                           }
                           
                           // Only allow valid decimal number format
                           if (/^\d*\.?\d*$/.test(inputValue) || inputValue === '') {
                              setNewAmount(inputValue);
                           }
                        }}
                        prefix="$"
                        name={"newDiscountAmount"}
                        disabled={updateVoucherDiscountMutation.isPending}
                     />
                     {amountError && (
                        <div className="error-message">
                           {amountError}
                        </div>
                     )}
                  </div>
               </div>
 
               <Divider />
            </div>
         }
      />
   );
};
 
export default VoucherDiscountModify;
 
 