import { useState, useEffect, useCallback } from "react";
import { useSocket } from "@hooks/useSocket";
import { useClearChecks } from "@hooks/useClearChecks";
import { useApMaintenance } from "@hooks/useApMaintenance";
import { useTemplateDownload } from "@hooks/useTemplateDownload";
import { Tooltip } from "antd";
import Toaster from "@widget-library/Toaster";
import type { ColumnType } from "antd/es/table";
import {
   EditOutlined,
   UploadOutlined,
   PlusOutlined,
   DeleteOutlined,
   DownloadOutlined,
} from "@ant-design/icons";
import TableWidget from "@widget-library/Table";
import Card from "@widget-library/Card";
import { DefaultButton, CustomStyledButton } from "@widget-library/Buttons";
import AddCheckModal from "./AddCheckModal";
import EditCheckModal from "./EditCheckModal";
import UploadCSVModal from "../voucher-entry/process-types/flexi/UploadCSVModal";
import ModalContent from "@widget-library/Modal";
import DeleteConfirmationModal from "@widget-library/DeleteConfirmationModal";
import bankGlIcon from "@assets/icons/card-bank-agl-icon.svg";
import popupOk from "@assets/icons/popup-ok.svg";
import downloadIcon from "@assets/icons/Download.svg";
import { VOUCHER_ENTRY_TEXTS } from "@constants/commonConstants";
import { formatCurrency } from "@utils/formatters";
import "./clear-checks.scss";
import {
   formatMMDDYYForDisplay,
   formatNumberToMMDDYY,
} from "@/utils/dateFormat";
import {
   createCheckNumberSorter,
   createCustomDateSorter,
   createNumericSorter,
   createStatusSorter,
} from "@utils/sortingUtils";
import { getColumnSearchProps } from "@utils/tableFilters";
import ActionPermissionGuard from "@shared-components/permissions/ActionPermissionGuard";

// API Error interface
interface ErrorItem {
   code: string;
   field: string;
   id: string;
   message: string;
}

// WebSocket response interfaces
interface ClearCheckItem {
   checkNo: string;
   checkAmount: number;
   date: string;
   status: "E" | "S" | "W";
   errors: ErrorItem[];
   warnings: Array<{ message: string }>;
}

// Component data interface
interface ClearCheckData {
   key: string;
   checkNumber: string;
   clearDate: string;
   clearAmount: number;
   validationStatus: "Error" | "Success" | "Warning";
}

function ClearChecks() {
   const [loading, setLoading] = useState(false);
   const { uploadStatusData, emitSocketEvent } = useSocket();
   const [currentUploadSession, setCurrentUploadSession] = useState<
      string | null
   >(null);
   const [toasterType, setToasterType] = useState<"success" | "error">(
      "success"
   );
   const [toasterMessage, setToasterMessage] = useState("");
   const [toasterDescription, setToasterDescription] = useState("");
   const { validateSingleCheck, processMultipleChecks } = useClearChecks();
   const { fetchCompanyMaintenanceManual } = useApMaintenance();
   const { downloadTemplate, isDownloading } = useTemplateDownload();

   useEffect(() => {
      const fetchCompanyData = async () => {
         try {
            const response = await fetchCompanyMaintenanceManual({
               companyNo: 10,
            });

            if (response.data?.items) {
               const bankGlNo = response.data.items.companyBankGlNo;
               setCompanyData({
                  companyBankGlNo: bankGlNo,
                  companyName: response.data.items.companyName,
               });
               // Don't update bankGLTotal here as it's for the total amount, not the GL number
            }
         } catch (error) {
            console.error("Error fetching company data:", error);
            setToasterType("error");
            setToasterMessage("Error");
            setToasterDescription("Failed to fetch company data");
         }
      };

      if (!uploadStatusData) {
         // Fetch company data when there's no upload status
         fetchCompanyData();
         return;
      }

      // Check if this is an error response

      try {
         // Direct access to the data structure we saw in the console
         const data = uploadStatusData as {
            id: string;
            summary: {
               countE: number;
               countS: number;
               countW: number;
               totalAmount: string;
               totalUploads: number;
            };
            items: Array<{
               checkAmount: number;
               checkNo: string;
               date: string;
               status: string;
               errors: Array<any>;
               warnings: Array<any>;
            }>;
            status: string;
         };

         // Log session information for debugging

         // Temporarily disabled strict session validation for backward compatibility
         // TODO: Re-enable once backend supports sessionId in responses
         /*
         if (currentUploadSession && data.id && data.id !== currentUploadSession) {
            console.log("Ignoring stale WebSocket response. Expected session:", currentUploadSession, "Received:", data.id);
            return;
         }
         */

         if (data.status === "Completed") {
            // Update table data with consistent key generation
            const newCheckData: ClearCheckData[] = data.items.map(
               (item, index) => {
                  const validationStatus: ClearCheckData["validationStatus"] =
                     item.status === "E"
                        ? "Error"
                        : item.status === "W"
                        ? "Warning"
                        : "Success";

                  const mappedData: ClearCheckData = {
                     key: `websocket_${item.checkNo}_${index}`, // More unique key
                     checkNumber: item.checkNo,
                     clearDate: formatMMDDYYForDisplay(item.date),
                     clearAmount: item.checkAmount,
                     validationStatus,
                  };

                  return mappedData;
               }
            );

            // Parse total amount - remove "$" and convert to number
            const totalAmountStr = data.summary.totalAmount;
            const numericAmount = parseFloat(
               totalAmountStr.replace(/[$,]/g, "")
            );

            // Update states
            setLoading(false);
            setCheckData(newCheckData);

            // Ensure we're setting valid numbers
            if (!isNaN(numericAmount)) {
               setBankGLTotal(numericAmount);

               // After setting bank GL total, fetch fresh company data
               fetchCompanyData();
            } else {
               console.error("Failed to parse total amount:", totalAmountStr);
            }

            // Show success modal if no errors
            if (data.summary.countE === 0) {
               setShowSuccessModal(true);
            }

            // Clear the current upload session after processing
            setCurrentUploadSession(null);
         } else if (data.status === "Processing") {
            setLoading(true);
         }
      } catch (error: any) {
         setLoading(false);
         // Clear upload session on error
         setCurrentUploadSession(null);
         handleUploadError("Failed to process upload response");
      }
   }, [uploadStatusData, currentUploadSession]);
   const [showAddCheckModal, setShowAddCheckModal] = useState(false);
   const [showEditCheckModal, setShowEditCheckModal] = useState(false);
   const [showUploadModal, setShowUploadModal] = useState(false);
   const [showSuccessModal, setShowSuccessModal] = useState(false);
   const [showDeleteModal, setShowDeleteModal] = useState(false);
   const [selectedDeleteRecord, setSelectedDeleteRecord] =
      useState<ClearCheckData | null>(null);
   const [formData, setFormData] = useState({
      checkNumber: "",
      clearDate: "",
      clearAmount: "",
   });
   const [formErrors, setFormErrors] = useState<{
      checkNumber?: string;
      clearDate?: string;
      clearAmount?: string;
   }>({});
   const [editFormData, setEditFormData] = useState({
      checkNumber: "",
      clearDate: "",
      clearAmount: "",
   });
   const [editErrors, setEditErrors] = useState<{
      checkNumber?: string;
      clearDate?: string;
      clearAmount?: string;
   }>({});
   const [editingRecordKey, setEditingRecordKey] = useState<string | null>(
      null
   );
   const [checkData, setCheckData] = useState<ClearCheckData[]>([]);

   // Company data state
   const [companyData, setCompanyData] = useState<{
      companyBankGlNo: number;
      companyName: string;
   } | null>(null);

   // Summary data
   const [bankGLTotal, setBankGLTotal] = useState(0);

   const handleAddCheck = () => {
      // Clear any lingering upload session when manually adding checks
      setCurrentUploadSession(null);
      setShowAddCheckModal(true);
   };

   const handleModalCancel = () => {
      setShowAddCheckModal(false);
      setFormData({
         checkNumber: "",
         clearDate: "",
         clearAmount: "",
      });
      // Clear any existing errors when closing the modal
      setFormErrors({});
   };

   const handleModalSubmit = async () => {
      // Clear previous errors
      setFormErrors({});

      if (
         !formData.checkNumber ||
         !formData.clearDate ||
         !formData.clearAmount
      ) {
         setFormErrors({
            checkNumber: !formData.checkNumber
               ? "Check Number is required"
               : undefined,
            clearDate: !formData.clearDate
               ? "Clear Date is required"
               : undefined,
            clearAmount: !formData.clearAmount
               ? "Clear Amount is required"
               : undefined,
         });
         return;
      }

      try {
         const response = await validateSingleCheck(
            formData.checkNumber,
            parseFloat(formData.clearAmount),
            formData.clearDate
         );

         // Check for errors either in items or directly in response
         const errors = response.items?.errors || response.errors || [];

         if (errors.length > 0) {
            // Map errors to form fields
            const newErrors: typeof formErrors = {};

            errors.forEach((error) => {
               if (error.field && error.message) {
                  const fieldMapping: Record<string, keyof typeof formErrors> =
                     {
                        checkNo: "checkNumber",
                        checkDate: "clearDate",
                        checkAmount: "clearAmount",
                     };

                  if (error.field === "general") {
                     setToasterType("error");
                     setToasterMessage("Error");
                     setToasterDescription(error.message);
                  } else {
                     const mappedField = fieldMapping[error.field];
                     if (mappedField) {
                        newErrors[mappedField] = error.message;
                     } else {
                        console.warn(
                           `No mapping found for field: ${error.field}`
                        );
                        // If no specific field mapping, show in toaster
                        setToasterType("error");
                        setToasterMessage("Error");
                        setToasterDescription(error.message);
                     }
                  }
               }
            });

            setFormErrors(newErrors);
            return; // Exit early if we have validation errors
         }

         if (response.isValid) {
            const newAmount = parseFloat(formData.clearAmount);
            setCheckData((prev) => [
               ...prev,
               {
                  key: `manual_${formData.checkNumber}_${Date.now()}`, // Consistent key generation
                  checkNumber: formData.checkNumber,
                  clearDate: formData.clearDate,
                  clearAmount: newAmount,
                  validationStatus: response.warnings?.length
                     ? "Warning"
                     : "Success",
               },
            ]);
            // Update Bank GL Total when adding a new check
            setBankGLTotal((prev) => prev + newAmount);
            handleModalCancel();
         } else {
            // Show generic error if validation failed but no specific errors were provided
            setToasterType("error");
            setToasterMessage("Error");
            setToasterDescription("Validation failed");
         }
      } catch (error) {
         setToasterType("error");
         setToasterMessage("Error");
         setToasterDescription("Failed to validate check");
         setShowAddCheckModal(false);
      }
   };

   const handleInputChange = (name: string, value: string) => {
      setFormData((prev) => ({
         ...prev,
         [name]: value,
      }));

      // Clear error when user starts typing
      if (formErrors[name as keyof typeof formErrors]) {
         setFormErrors((prev) => ({
            ...prev,
            [name]: undefined,
         }));
      }
   };

   const handleUploadFile = () => {
      setShowUploadModal(true);
   };

   const handleUploadCancel = () => {
      setShowUploadModal(false);
   };

   const handleUploadSuccess = async (fileName: string) => {
      try {
         setShowUploadModal(false);

         // Generate a unique session ID for this upload
         const uploadSessionId = `upload_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`;
         setCurrentUploadSession(uploadSessionId);

         // Emit socket event to start monitoring the upload status
         emitSocketEvent("clear-checks-upload-start", {
            fileName,
            sessionId: uploadSessionId,
         });

         // The success modal will be shown when we receive the completion status via socket
         setLoading(true);
      } catch (error: any) {
         console.error("=== CLEARCHECK UPLOAD ERROR CAUGHT ===");
         console.error("Full error object:", error);
         console.error("Error type:", typeof error);
         console.error("Error constructor:", error?.constructor?.name);
         console.error("Error message:", error?.message);
         console.error("Error response:", error?.response);
         console.error("Error response data:", error?.response?.data);
         console.error("Error response status:", error?.response?.status);
         console.error("Error response headers:", error?.response?.headers);

         // Try to extract the detailed error message here too
         let detailedMessage = "Upload failed";

         if (error?.response?.data?.error?.details?.[0]?.message) {
            detailedMessage = error.response.data.error.details[0].message;
         } else if (error?.response?.data?.error?.message) {
            detailedMessage = error.response.data.error.message;
         } else if (error?.message) {
            detailedMessage = error.message;
         }
         handleUploadError(detailedMessage);
      }
   };

   const handleUploadError = (errorMessage: string) => {
      setLoading(false);
      setCurrentUploadSession(null);
      setToasterType("error");
      setToasterMessage("Upload Error");
      setToasterDescription(errorMessage);
   };

   const handleUploadComplete = () => {
      // This function can be used for any cleanup or final UI updates after upload
   };

   const handleDownloadTemplate = async () => {
      await downloadTemplate("clearChecks");
   };

   // Check if there are any records with "Error" status
   const hasErrors = checkData.some(
      (record) => record.validationStatus === "Error"
   );
   const errorCount = checkData.filter(
      (record) => record.validationStatus === "Error"
   ).length;

   const handleSubmit = async () => {
      if (checkData.length === 0) {
         setToasterType("error");
         setToasterMessage("Error");
         setToasterDescription("No checks to process");
         return;
      }

      if (hasErrors) {
         setToasterType("error");
         setToasterMessage("Error");
         setToasterDescription(
            "Please fix validation errors before submitting"
         );
         return;
      }

      try {
         setLoading(true);
         // Convert display date format (MM/DD/YY) back to API format (MMDDYY)
         const processPayload = checkData.map((check) => {
           // let apiDateFormat = check.clearDate;
            return {
               checkNo: check.checkNumber,
               checkAmount: check.clearAmount,
               clearDate: check.clearDate,
            };
         });

         const result = await processMultipleChecks(processPayload);

         // Debug logging to understand what the API is returning

         // Use the actual number of checks processed if API doesn't return counts properly
         const actualSuccessful =
            result.successful || checkData.length - (result.failed || 0);
         const actualFailed = result.failed || 0;

         if (actualFailed > 0) {
            setToasterType("error");
            setToasterMessage("Warning");
            setToasterDescription(
               `Processed ${actualSuccessful} checks successfully, ${actualFailed} failed`
            );

            // Update validation status for failed checks
            setCheckData((prev) =>
               prev.map((check) => {
                  const failedResult = result.results.find(
                     (r) => r.checkNo === check.checkNumber
                  );
                  if (failedResult?.errors?.length) {
                     return {
                        ...check,
                        validationStatus: "Error",
                     };
                  }
                  return check;
               })
            );
         } else {
            // If successful count is 0 but we have checks and no failures, use checkData.length
            const finalSuccessfulCount =
               actualSuccessful > 0 ? actualSuccessful : checkData.length;

            setToasterType("success");
            setToasterMessage("Success");
            setToasterDescription(
               `Successfully processed ${finalSuccessfulCount} checks`
            );
            setShowSuccessModal(true);
            // Clear the table after successful processing
            setCheckData([]);
            setBankGLTotal(0);
         }
      } catch (error) {
         setToasterType("error");
         setToasterMessage("Error");
         setToasterDescription("Failed to process checks");
      } finally {
         setLoading(false);
      }
   };

   const handleSuccessModalClose = () => {
      setShowSuccessModal(false);
      setCurrentUploadSession(null);
   };

   const handleEdit = useCallback(
      (record: ClearCheckData) => {
         setEditingRecordKey(record.key);
         const formData = {
            checkNumber: record.checkNumber,
            clearDate: record.clearDate,
            clearAmount: record.clearAmount.toString(),
         };
         setEditFormData(formData);

         // Find the corresponding item in the WebSocket response data
         if (uploadStatusData?.items) {
            const item = uploadStatusData.items.find(
               (item: ClearCheckItem) => item.checkNo === record.checkNumber
            );
            if (item?.errors?.length > 0) {
               // Map the API errors to our form fields
               const apiErrors = item.errors.reduce(
                  (acc: typeof editErrors, error: ErrorItem) => {
                     if (error.field === "checkNo") {
                        acc.checkNumber = error.message;
                     }
                     return acc;
                  },
                  {} as typeof editErrors
               );

               setEditErrors(apiErrors);
            } else {
               // Clear any existing errors if no API errors
               setEditErrors({});
            }
         } else {
            // Clear any existing errors if no upload status data
            setEditErrors({});
         }

         setShowEditCheckModal(true);
      },
      [uploadStatusData]
   );

   const handleEditModalCancel = () => {
      setShowEditCheckModal(false);
      setEditingRecordKey(null);
      setEditFormData({
         checkNumber: "",
         clearDate: "",
         clearAmount: "",
      });
      setEditErrors({});
   };

   const handleEditModalSave = async () => {
      if (
         !editFormData.checkNumber ||
         !editFormData.clearDate ||
         !editFormData.clearAmount ||
         !editingRecordKey
      ) {
         setToasterType("error");
         setToasterMessage("Error");
         setToasterDescription("Please fill in all required fields");
         return;
      }

      try {
         const result = await validateSingleCheck(
            editFormData.checkNumber,
            parseFloat(editFormData.clearAmount),
            editFormData.clearDate
         );

         // Update the specific record using the unique key for proper React reconciliation
         const newAmount = parseFloat(editFormData.clearAmount);
         let oldAmount = 0;
         setCheckData((prev) =>
            prev.map((check) => {
               if (check.key === editingRecordKey) {
                  oldAmount = check.clearAmount; // Capture old amount for Bank GL Total adjustment
                  return {
                     ...check,
                     checkNumber: editFormData.checkNumber, // Allow check number to be updated
                     clearDate: editFormData.clearDate,
                     clearAmount: newAmount,
                     validationStatus: result.isValid ? "Success" : "Error",
                  };
               }
               return check;
            })
         );

         // Update Bank GL Total with the difference between new and old amounts
         setBankGLTotal((prev) => prev - oldAmount + newAmount);

         // Check for validation errors and map them to form fields
         const errors = result.items?.errors || result.errors || [];

         if (errors.length > 0) {
            // Map errors to form fields
            const newErrors: typeof editErrors = {};

            errors.forEach((error) => {
               if (error.field && error.message) {
                  const fieldMapping: Record<string, keyof typeof editErrors> =
                     {
                        checkNo: "checkNumber",
                        checkDate: "clearDate",
                        checkAmount: "clearAmount",
                     };

                  if (error.field === "general") {
                     // Show general errors in toaster
                     setToasterType("error");
                     setToasterMessage("Error");
                     setToasterDescription(error.message);
                  } else {
                     const mappedField = fieldMapping[error.field];
                     if (mappedField) {
                        newErrors[mappedField] = error.message;
                     } else {
                        console.warn(
                           `Edit: No mapping found for field: ${error.field}`
                        );
                        // If no specific field mapping, show in toaster
                        setToasterType("error");
                        setToasterMessage("Error");
                        setToasterDescription(error.message);
                     }
                  }
               }
            });
            setEditErrors(newErrors);
            return; // Exit early if we have validation errors
         }

         if (result.isValid) {
            // Show success message
            setToasterType("success");
            setToasterMessage("Success");
            setToasterDescription("Check validation completed successfully");

            // Close modal and reset state
            setShowEditCheckModal(false);
            setEditingRecordKey(null);
            setEditFormData({
               checkNumber: "",
               clearDate: "",
               clearAmount: "",
            });
            setEditErrors({});
         } else {
            // Show generic error message if no specific errors were provided
            setToasterType("error");
            setToasterMessage("Error");
            setToasterDescription("Validation failed");
            return; // Exit early when validation fails
         }
      } catch (error) {
         // Set status to Error when API call fails using the unique key
         const newAmount = parseFloat(editFormData.clearAmount);
         let oldAmount = 0;

         setCheckData((prev) =>
            prev.map((check) => {
               if (check.key === editingRecordKey) {
                  oldAmount = check.clearAmount; // Capture old amount for Bank GL Total adjustment
                  return {
                     ...check,
                     checkNumber: editFormData.checkNumber,
                     clearDate: editFormData.clearDate,
                     clearAmount: newAmount,
                     validationStatus: "Error",
                  };
               }
               return check;
            })
         );

         // Update Bank GL Total with the difference between new and old amounts even on error
         setBankGLTotal((prev) => prev - oldAmount + newAmount);

         setToasterType("error");
         setToasterMessage("Error");
         setToasterDescription("Failed to validate check");
         return; // Exit early when API call fails
      }
   };

   const handleEditInputChange = (name: string, value: string) => {
      setEditFormData((prev) => ({
         ...prev,
         [name]: value,
      }));

      //  AUTO-CLEAR ERRORS: Clears validation error when user starts typing in any field
      if (editErrors[name as keyof typeof editErrors]) {
         setEditErrors((prev) => ({
            ...prev,
            [name]: undefined,
         }));
      }
   };

   const handleDelete = (record: ClearCheckData) => {
      setCheckData((prev) => prev.filter((item) => item.key !== record.key));
      setBankGLTotal((prev) => prev - record.clearAmount);
   };

   const columns: ColumnType<ClearCheckData>[] = [
      {
         title: "Actions",
         dataIndex: "",
         fixed: "left",
         width: 100,
         align: "center",
         render: (_, record) => (
            <div
               className="action-icons flex-align"
               style={{ justifyContent: "center" }}
            >
               {record.validationStatus === "Error" && (
                  <span className="table-tooltip action-tooltip point-cursor">
                     <Tooltip title="Edit Check">
                        <EditOutlined
                           className="action-icon"
                           onClick={() => handleEdit(record)}
                        />
                     </Tooltip>
                  </span>
               )}
               <span className="table-tooltip action-tooltip point-cursor">
                  <Tooltip title="Delete Check">
                     <DeleteOutlined
                        className="action-icon"
                        onClick={() => {
                           setSelectedDeleteRecord(record);
                           setShowDeleteModal(true);
                        }}
                     />
                  </Tooltip>
               </span>
            </div>
         ),
      },
      {
         title: "Check Number",
         dataIndex: "checkNumber",
         key: "checkNumber",
         align: "left",
         sorter: createCheckNumberSorter("checkNumber"),
         ...getColumnSearchProps("checkNumber", "Search Check Number"),
      },
      {
         title: "Clear Date",
         dataIndex: "clearDate",
         key: "clearDate",
         align: "left",
         sorter: createCustomDateSorter("clearDate"),
         ...getColumnSearchProps("clearDate", "Search Clear Date"),
      },
      {
         title: "Clear Amount",
         dataIndex: "clearAmount",
         key: "clearAmount",
         align: "right",
         sorter: createNumericSorter("clearAmount"),
         render: (amount: number) => formatCurrency(amount),
         ...getColumnSearchProps("clearAmount", "Search Clear Amount", true),
      },
      {
         title: " Validation Status",
         dataIndex: "validationStatus",
         key: "validationStatus",
         align: "center",
         render: (status: string) => {
            const statusClass =
               status.toLowerCase() === "success"
                  ? "ready"
                  : status.toLowerCase() === "error"
                  ? "failed"
                  : status.toLowerCase();
            return (
               <span className={`status-pill ${statusClass}`}>{status}</span>
            );
         },
         sorter: createStatusSorter("validationStatus"),
         ...getColumnSearchProps("validationStatus", "Search Status"),
      },
   ];

   return (
      <>
         {toasterMessage &&
            (() => {
               return (
                  <Toaster
                     type={toasterType}
                     title={toasterMessage}
                     subtitle={toasterDescription}
                     onClose={() => {
                        setToasterMessage("");
                        setToasterDescription("");
                     }}
                  />
               );
            })()}
         <div className="content-card-body">
            <h4>Clear Checks</h4>
            <div className="vendor-details-container ">
               <div className="flex-between">
                  <h4>Validate Checks</h4>
                  <div className="flex-end gap-16">
                     <ActionPermissionGuard actionId="clear-checks.download-template">
                        <CustomStyledButton
                           name="downloadTemplate"
                           label={<h6>{VOUCHER_ENTRY_TEXTS.downloadTemplate}</h6>}
                           onClick={handleDownloadTemplate}
                           loading={isDownloading}
                           icon={
                              <DownloadOutlined className="file-icons" />
                           }
                        />
                     </ActionPermissionGuard>
                     <ActionPermissionGuard actionId="clear-checks.add-check">
                        <CustomStyledButton
                           name="addCheck"
                           label={<h6>Add Check</h6>}
                           icon={<PlusOutlined />}
                           onClick={handleAddCheck}
                        />
                     </ActionPermissionGuard>
                     <ActionPermissionGuard actionId="clear-checks.upload-file">
                        <DefaultButton
                           name="uploadFile"
                           label={<h6>Upload File</h6>}
                           icon={<UploadOutlined />}
                           onClick={handleUploadFile}
                        />
                     </ActionPermissionGuard>
                  </div>
               </div>

               <div className="bordered-box ">
                  <div className="cards-section">
                     <div className="clear-checks-cards">
                        <Card
                           icon={<img src={bankGlIcon} alt="Bank Account" />}
                           label="Bank Acct G/L"
                           value={
                              companyData?.companyBankGlNo?.toString() || "-"
                           }
                        />
                        <Card
                           icon={<img src={bankGlIcon} alt="Bank GL Total" />}
                           label="Bank G/L Total"
                           value={formatCurrency(bankGLTotal)}
                           className={bankGLTotal > 0 ? "highlight" : ""}
                        />
                     </div>
                  </div>

                  <div className="table-responsive-container centered-header">
                     <TableWidget<ClearCheckData>
                        columns={columns}
                        dataSource={checkData}
                        loading={loading}
                        rowKey="key"
                     />
                  </div>
               </div>
               <div className="flex-end">
                  <span className="submit-button-wrapper">
                     <Tooltip
                        title={
                           hasErrors
                              ? `Please resolve ${errorCount} validation error${
                                   errorCount > 1 ? "s" : ""
                                } before submitting`
                              : checkData.length === 0
                              ? "No checks available to process"
                              : ""
                        }
                        placement="top"
                     >
                        <div>
                           {" "}
                           {/* Additional wrapper div for Tooltip */}
                           <CustomStyledButton
                              name="submit"
                              label={<h6>Submit</h6>}
                              onClick={handleSubmit}
                              disabled={hasErrors || checkData.length === 0}
                           />
                        </div>
                     </Tooltip>
                  </span>
               </div>
            </div>
            <AddCheckModal
               visible={showAddCheckModal}
               onCancel={handleModalCancel}
               onSubmit={handleModalSubmit}
               formData={formData}
               onInputChange={handleInputChange}
               errors={formErrors}
            />
            <EditCheckModal
               visible={showEditCheckModal}
               onCancel={handleEditModalCancel}
               onSave={handleEditModalSave}
               formData={editFormData}
               onInputChange={handleEditInputChange}
               errors={editErrors}
            />
            <UploadCSVModal
               visible={showUploadModal}
               onCancel={handleUploadCancel}
               onUploadSuccess={handleUploadSuccess}
               onUploadError={handleUploadError}
               uploadComplete={handleUploadComplete}
               source="ClearChecks"
            />
            <ModalContent
               title="Successful!"
               description={
                  <p className="p-xs modal-body-wrapper">
                     All the cancelled checks have been submitted
                  </p>
               }
               visible={showSuccessModal}
               onCancel={handleSuccessModalClose}
               showCloseIcon={false}
               imageUrl={popupOk}
               actions={[
                  {
                     name: "ok",
                     label: "Ok",
                     onClick: handleSuccessModalClose,
                  },
               ]}
               className="cne-modal descripition button-adjusted"
            />

            {selectedDeleteRecord && (
               <DeleteConfirmationModal
                  visible={showDeleteModal}
                  onCancel={() => {
                     setShowDeleteModal(false);
                     setSelectedDeleteRecord(null);
                  }}
                  onConfirm={() => {
                     handleDelete(selectedDeleteRecord);
                     setShowDeleteModal(false);
                     setSelectedDeleteRecord(null);
                  }}
                  itemName={"Check"}
               />
            )}
         </div>
      </>
   );
}

export default ClearChecks;
