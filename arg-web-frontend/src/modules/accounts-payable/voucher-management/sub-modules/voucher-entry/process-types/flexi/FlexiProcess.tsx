import { formatCurrency, toNumericOrNull } from "@utils/formatters";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tooltip, Popover, Checkbox } from "antd";
import {
   FLEXI_PROCESS_CONSTANTS,
   VOUCHER_ENTRY_COLUMN_LABELS,
   VOUCHER_ENTRY_MESSAGES,
   VOUCHER_ENTRY_TEXTS,
   ROUTES,
} from "@constants/commonConstants";
import { CustomStyledButton } from "@widget-library/Buttons";
import FileIcon from "@assets/icons/post-to-purchase-icon.svg";
import invoiceAmountIcon from "@assets/icons/invoice-amount-icon.svg";
import uploadedRecordsIcon from "@assets/icons/uploaded-records-icon.svg";
import successIcon from "@assets/icons/success-icon.svg";
import warningIcon from "@assets/icons/warning-icon.svg";
import errorIcon from "@assets/icons/error-icon.svg";
import successStatusIcon from "@assets/icons/success-status-icon.svg";
import alertStatusIcon from "@assets/icons/alert-status-icon.svg";
import warningStatusIcon from "@assets/icons/warning-status-icon.svg";
import Card from "@widget-library/Card";
import TableWidget from "@widget-library/Table";
import infoIcon from "@assets/icons/info-circle-icon.svg";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnType } from "antd/es/table";
import type { FlexiProcessProps, UnprocessedRecord } from "@type-definitions/accounts-payable.types";
import DeleteConfirmationModal from "@widget-library/DeleteConfirmationModal";
import ViewVoucherModal from "../normal/create-entry/ViewVoucherModal";
import PostToPurchaseJournalModal from "@shared-components/post-to-purchase-journel-modal/PostToPurchaseJournalModal";
import UnprocessedRecordsModal from "../sogas/UnprocessedRecordsModal";
import { formatNumberToMMDDYY } from "@utils/dateFormat";
import Toaster from "@widget-library/Toaster";
import {
   createStatusSorter,
   createInvoiceNumberSorter,
   createCustomDateSorter,
   createInvoiceAmountSorter,
   createDiscountDueDateSorter,
   createDiscountAmountSorter,
   createVendorNameSorter,
   createVendorNumberStringSorter,
} from "@utils/sortingUtils";
import { getColumnSearchProps, createNumericFilter } from "@utils/tableFilters";
import ModalContent from "@widget-library/Modal";
import popupOk from "@assets/icons/popup-ok.svg";
import {
   useFlexiEntries,
   useFlexiVoucherSummary,
} from "@hooks/useFlexiProcess";
import { usePostToPurchaseJournal } from "@hooks/usePostToPurchaseJournal";
import ActionPermissionGuard from "@shared-components/permissions/ActionPermissionGuard";
import { useDeleteVoucher } from "@hooks/useDeleteVoucher";
import { useVoucherByEntryNo } from "@hooks/useVoucherByEntryNo";
// Removed hardcoded discount validation - now using backend status only

const FlexiProcess: React.FC<FlexiProcessProps> = ({
   selectedCompany,
   uploadStatusData,
   useUploadSummary,
}) => {
   const navigate = useNavigate();
   const [voucherData, setVoucherData] = useState<any[]>([]);
   const [selectedRows, setSelectedRows] = useState<string[]>([]);
   const [isModalVisible, setIsModalVisible] = useState(false);
   const [modalTitle, setModalTitle] = useState("Voucher Details");
   const [totalInvoiceAmount, setTotalInvoiceAmount] = useState(0);
   const [totalRecords, setTotalRecords] = useState(0);
   const [totalSuccesses, setTotalSuccesses] = useState(0);
   const [totalWarnings, setTotalWarnings] = useState(0);
   const [totalErrors, setTotalErrors] = useState(0);
   const [showDeleteModal, setShowDeleteModal] = useState(false);
   const [isPostModalOpen, setIsPostModalOpen] = useState(false);
   const [purchaseJournalDate, setPurchaseJournalDate] = useState("");
   const [cashDisbursementDate, setCashDisbursementDate] = useState("");
   const [purchaseJournalStatus, setPurchaseJournalStatus] = useState<
      "error" | "warning" | undefined
   >(undefined);
   const [cashDisbursementStatus, setCashDisbursementStatus] = useState<
      "error" | "warning" | undefined
   >(undefined);
   const [selectedDeleteRecord, setSelectedDeleteRecord] = useState<{
      entryNo: number;
      companyNo: number;
      vendorNo: number;
      invoiceNo: string;
   } | null>(null);
   const [viewRecord, setViewRecord] = useState<{
      entryNo: string;
      companyNo: string;
      vendorNo: string;
   } | null>(null);
   const [editVoucherParams, setEditVoucherParams] = useState<{
      entryNo: string;
      companyNo: string;
      vendorNo: string;
   } | null>(null);

   const [toasterType, setToasterType] = useState<
      "success" | "error" | "warning"
   >("success");
   const [toasterMessage, setToasterMessage] = useState("");
   const [toasterDescription, setToasterDescription] = useState("");

   // Success modal state
   const [showSuccessModal, setShowSuccessModal] = useState(false);
   const [hasFreshApiData, setHasFreshApiData] = useState(false);
   const [shouldFetchData, setShouldFetchData] = useState(true); // Control when to fetch data

   // Unprocessed records modal state
   const [showUnprocessedModal, setShowUnprocessedModal] = useState(false);
   const [unprocessedRecords, setUnprocessedRecords] = useState<UnprocessedRecord[]>([]);

   // React Query hooks - controlled fetching
   const {
      data: flexiEntriesData,
      isLoading: isFlexiEntriesLoading,
      error: flexiEntriesError,
      refetch: refetchFlexiEntries,
      
   } = useFlexiEntries(10, shouldFetchData);

   const {
      data: voucherSummary,

      refetch: refetchVoucherSummary,
   } = useFlexiVoucherSummary(10, shouldFetchData);

   const {
      data: editVoucherData,
      isLoading: isEditVoucherLoading,
      error: editVoucherError,
   } = useVoucherByEntryNo({
      entryNo: editVoucherParams?.entryNo || "",
      companyNo: editVoucherParams?.companyNo || "",
      vendorNo: editVoucherParams?.vendorNo || "",
      enabled: !!editVoucherParams,
   });

   const deleteVoucherMutation = useDeleteVoucher();
   const postToPurchaseJournalMutation = usePostToPurchaseJournal();

   // Initial data fetch on component mount (only once)
   useEffect(() => {
      if (shouldFetchData) {
         Promise.all([
            refetchFlexiEntries(),
            refetchVoucherSummary()
         ]).then(() => {
            setShouldFetchData(false); // Disable automatic fetching after initial load
         });
      }
   }, [shouldFetchData, refetchFlexiEntries, refetchVoucherSummary]);

   // Process flexi entries data when it changes
   useEffect(() => {
      if (flexiEntriesData && Array.isArray(flexiEntriesData)) {
         const mappedData: any[] = flexiEntriesData.map((item: any, index) => {
            const statusMap: { [key: string]: string } = {
               S: "success",
               W: "warning",
               E: "error",
            };
            const uiStatus = statusMap[item.status] || "error";

            return {
               key: `${index + 1}`,
               invoiceNo: item.invoiceNo || "-",
               invoiceDate: item.invoiceDate || "-",
               discountDueDate: item.discountDueDate || "-",
               dueDate: item.dueDate || "-",
               companyNo: String(item.companyNo || 10),
               invoiceAmount: formatCurrency(item.invoiceAmount || 0),
               discountAmount: item.discountAmount
                  ? formatCurrency(item.discountAmount)
                  : "-",
               vendorName: item.vendorName || "-",
               vendorNo: String(item.vendorNo || "-"),
               status: uiStatus,
               entryNo: String(item.entryNo || "-"),
               // Prepaid-related fields needed for selection and posting
               prepaidCode: item.prepaidCode || "",
               prepaidCheckNo: item.prepaidCheckNo || 0,
               bankGl: item.bankGl || 0,
               prepaidCheckdate: item.prepaidCheckdate || 0,
            };
         });

         setVoucherData(mappedData);
         setTotalRecords(mappedData.length);
         setTotalInvoiceAmount(
            mappedData.reduce(
               (sum, record) =>
                  sum + (toNumericOrNull(record.invoiceAmount) || 0),
               0
            )
         );
         setTotalSuccesses(
            mappedData.filter((r) => r.status === "success").length
         );
         setTotalWarnings(
            mappedData.filter((r) => r.status === "warning").length
         );
         setTotalErrors(
            mappedData.filter((r) => r.status === "error").length
         );
         setHasFreshApiData(true);
      }
   }, [flexiEntriesData]);

   // Handle errors from React Query
   useEffect(() => {
      if (flexiEntriesError) {
         console.error("getFlexiEntry error:", flexiEntriesError);

         // Map specific API error responses
         let errorTitle = "Error";
         let errorMessage = "Failed to load flexi entries";

         // Check if it's a structured API error response
         const apiError = (flexiEntriesError as any)?.error?.error ||
            (flexiEntriesError as any)?.error ||
            (flexiEntriesError as any)?.response?.data?.error ||
            (flexiEntriesError as any)?.data?.error ||
            flexiEntriesError;

         if (apiError && (apiError.code || apiError.message)) {
            if (apiError?.code === "NOT_FOUND") {
               errorTitle = "Record Not Found";
               if (apiError?.details && Array.isArray(apiError.details)) {
                  const fieldError = apiError.details[0];
                  if (fieldError && fieldError.message) {
                     errorMessage = fieldError.message;
                  } else {
                     errorMessage =
                        apiError.message || "No flexi entries found.";
                  }
               } else {
                  errorMessage = apiError.message || "No flexi entries found.";
               }
            } else if (apiError?.code === "VALIDATION_ERROR") {
               errorTitle = "Validation Error";
               if (apiError?.details && Array.isArray(apiError.details)) {
                  const fieldErrors = apiError.details
                     .map((detail: any) => `• ${detail.field}: ${detail.message}`)
                     .join("\n");
                  errorMessage =
                     fieldErrors ||
                     apiError.message ||
                     "Invalid data provided.";
               } else {
                  errorMessage = apiError.message || "Invalid data provided.";
               }
            } else if (apiError?.message) {
               errorMessage = apiError.message;
            }
         }

         setToasterType("error");
         setToasterMessage(errorTitle);
         setToasterDescription(errorMessage);
      }
   }, [flexiEntriesError]);

   useEffect(() => {
      if (
        useUploadSummary &&
        uploadStatusData &&
        Object.keys(uploadStatusData).length > 0
      ) {
         setHasFreshApiData(false);
         
         // Only refetch when WebSocket indicates processing is complete
         // This prevents race condition where API is called during backend processing
         if (uploadStatusData.status === "Completed") {
            // Make exactly one API call each for entries and summary
            Promise.all([
               refetchFlexiEntries(),
               refetchVoucherSummary()
            ]).then(() => {
               console.log("✅ Upload complete - fetched fresh data");
            }).catch((error) => {
               console.error("❌ Error fetching data after upload:", error);
            });
         }
      }
   }, [uploadStatusData, useUploadSummary, refetchFlexiEntries, refetchVoucherSummary]);

   // Watch for unprocessed items in upload status data
   useEffect(() => {
      if (uploadStatusData?.unprocessedItems && uploadStatusData.unprocessedItems.length > 0) {
         // Set the unprocessed records and show modal
         setUnprocessedRecords(uploadStatusData.unprocessedItems);
         setShowUnprocessedModal(true);
      }
   }, [uploadStatusData]);

   // Handler for closing unprocessed records modal
   const handleCloseUnprocessedModal = () => {
      setShowUnprocessedModal(false);
      setUnprocessedRecords([]);
   };

   // Handle edit voucher data when it's loaded
   useEffect(() => {
      if (editVoucherData && !isEditVoucherLoading) {
         navigate("create-new-entry", {
            state: {
               mode: "edit",
               entryData: editVoucherData,
            },
         });
         // Reset the edit params after navigation
         setEditVoucherParams(null);
      }
   }, [editVoucherData, isEditVoucherLoading, navigate]);

   // Handle edit voucher error
   useEffect(() => {
      if (editVoucherError) {
         console.error("Error fetching voucher for edit:", editVoucherError);

         // Map specific API error responses
         let errorTitle = "Error";
         let errorMessage = "Failed to load voucher details for editing.";

         // Check if it's a structured API error response
         const apiError = (editVoucherError as any)?.error?.error ||
            (editVoucherError as any)?.error ||
            (editVoucherError as any)?.response?.data?.error ||
            (editVoucherError as any)?.data?.error ||
            editVoucherError;

         if (apiError && (apiError.code || apiError.message)) {
            if (apiError?.code === "NOT_FOUND") {
               errorTitle = "Record Not Found";
               if (apiError?.details && Array.isArray(apiError.details)) {
                  const entryNoError = apiError.details.find(
                     (detail: any) => detail.field === "entryNo"
                  );
                  if (entryNoError) {
                     errorMessage =
                        entryNoError.message ||
                        "No matching voucher entry found.";
                  } else {
                     errorMessage =
                        apiError.message ||
                        "The requested voucher entry could not be found.";
                  }
               } else {
                  errorMessage =
                     apiError.message ||
                     "The requested voucher entry could not be found.";
               }
            } else if (apiError?.code === "VALIDATION_ERROR") {
               errorTitle = "Validation Error";
               if (apiError?.details && Array.isArray(apiError.details)) {
                  const fieldErrors = apiError.details
                     .map((detail: any) => `• ${detail.field}: ${detail.message}`)
                     .join("\n");
                  errorMessage =
                     fieldErrors ||
                     apiError.message ||
                     "Invalid data provided.";
               } else {
                  errorMessage = apiError.message || "Invalid data provided.";
               }
            } else if (apiError?.message) {
               errorMessage = apiError.message;
            }
         }
         setToasterType("error");
         setToasterMessage(errorTitle);
         setToasterDescription(errorMessage);
         // Reset the edit params on error
         setEditVoucherParams(null);
      }
   }, [editVoucherError]);

   const handleViewClick = (record: any) => {
      setModalTitle(FLEXI_PROCESS_CONSTANTS.modalTitles.view);
      setViewRecord({
         entryNo: String(record.entryNo),
         companyNo: record.companyNo || String(selectedCompany || "10"),
         vendorNo: String(record.vendorNo),
      });
      setIsModalVisible(true);
   };

   const handleEditClick = (record: any) => {
      // Set the parameters to trigger the React Query hook
      setEditVoucherParams({
         entryNo: String(record.entryNo),
         companyNo: record.companyNo || String(selectedCompany || "10"),
         vendorNo: String(record.vendorNo),
      });
   };

   const handlePostToPurchaseJournal = () => {
      const selectedEntries = voucherData.filter((entry) =>
         selectedRows.includes(entry.key)
      );
      if (selectedEntries.length === 0) {
         setToasterType("warning");
         setToasterMessage("Warning");
         setToasterDescription(VOUCHER_ENTRY_MESSAGES.selectAtLeastOne);
         return;
      }

      setIsPostModalOpen(true);
   };

   // Get prepaidCode from selected entries to determine if cash disbursement date should show
   // Enable second date picker if ANY selected entry has a prepaid code
   const getSelectedPrepaidCode = () => {
      const selectedEntries = voucherData.filter((entry) =>
         selectedRows.includes(entry.key)
      );
      // Check if ANY selected entry has a prepaid code
      const hasPrepaidCode = selectedEntries.some((entry) => 
         entry.prepaidCode && entry.prepaidCode !== ""
      );
      return hasPrepaidCode ? "hasPrepaid" : "";
   };

   const cardStats = [
      {
         icon: <img src={invoiceAmountIcon} alt="Invoice Amount" />,
         label: FLEXI_PROCESS_CONSTANTS.cards.totalInvoiceAmount,
         value:
            useUploadSummary && uploadStatusData?.summary && !hasFreshApiData
               ? uploadStatusData.summary.totalAmount
               : voucherSummary &&
                 (voucherSummary as any)?.totalAmount &&
                 (voucherSummary as any)?.totalAmount !== "$0.00"
               ? (voucherSummary as any)?.totalAmount
               : formatCurrency(totalInvoiceAmount),
      },
      {
         icon: <img src={uploadedRecordsIcon} alt="Uploaded Records" />,
         label: FLEXI_PROCESS_CONSTANTS.cards.uploadedRecords,
         value:
            useUploadSummary && uploadStatusData?.summary && !hasFreshApiData
               ? uploadStatusData.summary.totalUploads.toString()
               : voucherSummary &&
                 typeof (voucherSummary as any)?.totalUploads === "number"
               ? (voucherSummary as any)?.totalUploads.toString()
               : totalRecords.toString(),
      },
      {
         icon: <img src={successIcon} alt="Success" />,
         label: FLEXI_PROCESS_CONSTANTS.cards.totalSuccesses,
         value:
            useUploadSummary && uploadStatusData?.summary && !hasFreshApiData
               ? uploadStatusData.summary.countS.toString()
               : voucherSummary && typeof (voucherSummary as any)?.countS === "number"
               ? (voucherSummary as any)?.countS.toString()
               : totalSuccesses.toString(),
      },
      {
         icon: <img src={warningIcon} alt="Warning" />,
         label: (
            <div className="warning-label-wrapper">
               {FLEXI_PROCESS_CONSTANTS.cards.totalWarnings}
               <Popover
                  placement="rightTop"
                  overlayClassName="custom-warning-popover"
                  content={
                     <div className="warning-popover-content">
                        <span className="popover-title">Warning</span>
                        <p>
                           There is a warning in this file that can be
                           corrected, but you are still allowed to post this
                           entry to the purchase journal.
                        </p>
                     </div>
                  }
               >
                  <img src={infoIcon} alt="info" className="info-icon" />
               </Popover>
            </div>
         ),
         value:
            useUploadSummary && uploadStatusData?.summary && !hasFreshApiData
               ? uploadStatusData.summary.countW.toString()
               : voucherSummary && typeof (voucherSummary as any)?.countW === "number"
               ? (voucherSummary as any)?.countW.toString()
               : totalWarnings.toString(),
      },
      {
         icon: <img src={errorIcon} alt="Error" />,
         label: FLEXI_PROCESS_CONSTANTS.cards.totalErrors,
         value:
            useUploadSummary && uploadStatusData?.summary && !hasFreshApiData
               ? uploadStatusData.summary.countE.toString()
               : voucherSummary && typeof (voucherSummary as any)?.countE === "number"
               ? (voucherSummary as any)?.countE.toString()
               : totalErrors.toString(),
      },
   ];

   // Determine if a row is eligible to be selected for posting
   // Business rule: if a voucher is prepaid but does not have a prepaidCheckdate,
   // it should not be selectable for Post to Purchase Journal.
   const isRowSelectable = (entry: any) => {
      const hasErrorStatus = entry.status === "error";
      const prepaidCode = entry.prepaidCode;
      const prepaidCheckdate = entry.prepaidCheckdate;
      const hasPrepaidCode = prepaidCode && prepaidCode !== "";
      const hasPrepaidCheckDate = !!prepaidCheckdate;
      return !(hasErrorStatus || (hasPrepaidCode && !hasPrepaidCheckDate));
   };

   const handleRowSelect = (key: string) => {
      setSelectedRows((prev) =>
         prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
      );
   };
 
  const handleSelectAllRows = () => {
      const selectableKeys = voucherData
         .filter((entry) => isRowSelectable(entry))
         .map((entry) => entry.key);
 
      setSelectedRows(
         selectedRows.length === selectableKeys.length ? [] : selectableKeys
      );
   };

   const columns: (ColumnType<any> & { filterable?: boolean })[] = [
      {
         title: (
            (() => {
               const selectableCount = voucherData.filter((entry) =>
                  isRowSelectable(entry)
               ).length;
               const allSelected =
                  selectableCount > 0 &&
                  selectedRows.length === selectableCount;
               return (
                  <Checkbox
                     onChange={handleSelectAllRows}
                     checked={allSelected}
                     aria-label={VOUCHER_ENTRY_COLUMN_LABELS.selectAllAria}
                  />
               );
            })()
         ),
         dataIndex: "",
         fixed: "left",
         render: (_, record) => (
            <Checkbox
               checked={selectedRows.includes(record.key)}
               disabled={!isRowSelectable(record)}
               onChange={() =>
                  isRowSelectable(record) && handleRowSelect(record.key)
               }
               aria-label={VOUCHER_ENTRY_COLUMN_LABELS.selectRowAria(
                  record.key
               )}
            />
         ),
      },
      {
         title: FLEXI_PROCESS_CONSTANTS.tableColumns.actions,
         dataIndex: "",
         align: "center",
         render: (_, record) => (
            <div className="action-icons flex-align">
               <ActionPermissionGuard actionId="voucher-entry.flexi.view">
                  <Tooltip
                     title={VOUCHER_ENTRY_COLUMN_LABELS.viewTooltip}
                     className="table-tooltip action-tooltip point-cursor"
                  >
                     <EyeOutlined
                        className="action-icon"
                        onClick={() => handleViewClick(record)}
                     />
                  </Tooltip>
               </ActionPermissionGuard>
               <ActionPermissionGuard actionId="voucher-entry.flexi.edit">
                  <Tooltip
                     title={VOUCHER_ENTRY_COLUMN_LABELS.editTooltip}
                     className="table-tooltip action-tooltip point-cursor"
                  >
                     <EditOutlined
                        className="action-icon"
                        onClick={() => handleEditClick(record)}
                     />
                  </Tooltip>
               </ActionPermissionGuard>
               <ActionPermissionGuard actionId="voucher-entry.flexi.delete">
                  <Tooltip
                     title={VOUCHER_ENTRY_COLUMN_LABELS.deleteTooltip}
                     className="table-tooltip action-tooltip point-cursor"
                  >
                     <DeleteOutlined
                        className="action-icon"
                        onClick={() => {
                           setSelectedDeleteRecord({
                              entryNo: Number(record.entryNo),
                              companyNo: Number(record.companyNo),
                              vendorNo: Number(record.vendorNo),
                              invoiceNo: record.invoiceNo,
                           });
                           setShowDeleteModal(true);
                        }}
                     />
                  </Tooltip>
               </ActionPermissionGuard>
            </div>
         ),
      },
      {
         title: FLEXI_PROCESS_CONSTANTS.tableColumns.status,
         dataIndex: "status",
         key: "status",
         ...getColumnSearchProps("status", "Search Status"),
         align: "center",
         sorter: createStatusSorter("status"),
         render: (status: string) => {
            const statusIcons: { [key: string]: string } = {
               success: successStatusIcon,
               warning: warningStatusIcon,
               error: alertStatusIcon,
            };
            
            // Use backend status only - no frontend discount validation
            let tooltipTitle = status;
            
            const iconSrc =
               statusIcons[status.toLowerCase()] || alertStatusIcon;
            return (
               <Tooltip title={tooltipTitle}>
                  <img
                     src={iconSrc}
                     alt={status}
                     className="status-icon"
                  />
               </Tooltip>
            );
         },
      },
      {
         title: FLEXI_PROCESS_CONSTANTS.tableColumns.invoiceNo,
         dataIndex: "invoiceNo",
         key: "invoiceNo",
         ...getColumnSearchProps("invoiceNo", "Search Invoice No"),
         sorter: createInvoiceNumberSorter("invoiceNo"),
      },
      {
         title: FLEXI_PROCESS_CONSTANTS.tableColumns.invoiceDate,
         dataIndex: "invoiceDate",
         key: "invoiceDate",
         ...getColumnSearchProps("invoiceDate", "Search Invoice Date"),
         sorter: createCustomDateSorter("invoiceDate"),
      },
      {
         title: FLEXI_PROCESS_CONSTANTS.tableColumns.invoiceAmount,
         dataIndex: "invoiceAmount",
         key: "invoiceAmount",
         align: "right",
         ...getColumnSearchProps("invoiceAmount", "Enter Invoice Amount", true),
         sorter: createInvoiceAmountSorter("invoiceAmount"),
      },
      {
         title: FLEXI_PROCESS_CONSTANTS.tableColumns.discountDue,
         dataIndex: "discountDueDate",
         key: "discountDueDate",
         ...getColumnSearchProps("discountDueDate", "Search Discount Due Date"),
         sorter: createDiscountDueDateSorter("discountDueDate"),
         render: (text: string) => {
            if (!text || text === "-") return text;
            
            return text;
         },
      },
        {
         title: FLEXI_PROCESS_CONSTANTS.tableColumns.invoiceDue,
         dataIndex: "dueDate",
         key: "dueDate",
         ...getColumnSearchProps("dueDate", "Search Discount Due Date"),
         sorter: createDiscountDueDateSorter("dueDate"),
      },
      {
         title: FLEXI_PROCESS_CONSTANTS.tableColumns.DiscountAmount,
         dataIndex: "discountAmount",
         key: "discountAmount",
         align: "right",
         ...getColumnSearchProps(
            "discountAmount",
            "Enter Discount Amount",
            true
         ),
         sorter: createDiscountAmountSorter("discountAmount"),
      },
      {
         title: FLEXI_PROCESS_CONSTANTS.tableColumns.vendorName,
         dataIndex: "vendorName",
         key: "vendorName",
         ...getColumnSearchProps("vendorName", "Search Vendor Name"),
         sorter: createVendorNameSorter("vendorName"),
      },
      {
         title: FLEXI_PROCESS_CONSTANTS.tableColumns.vendorNo,
         dataIndex: "vendorNo",
         key: "vendorNo",
         ...createNumericFilter("vendorNo", "Enter Vendor No"),
         sorter: createVendorNumberStringSorter("vendorNo"),
      },
   ];

   const handleDeleteClick = async (
      entryNo: number,
      companyNo: number,
      vendorNo: number,
      invoiceNo: string
   ) => {
      try {
         const response = await deleteVoucherMutation.mutateAsync({
            entryNo,
            companyNo,
            vendorNo,
            invoiceNo,
         });

         if (response.status === 200) {
            setToasterType("success");
            setToasterMessage("Success");
            setToasterDescription("Voucher entry deleted successfully.");
            
            Promise.all([
               refetchFlexiEntries(),
               refetchVoucherSummary()
            ]).catch((error) => {
               console.error("Error refetching data after delete:", error);
            });
            
            return true;
         } else {
            setToasterType("error");
            setToasterMessage("Error");
            setToasterDescription(
               response.data?.message || "Failed to delete voucher entry."
            );
            return false;
         }
      } catch (error: any) {
         console.error("Delete error:", error);

         // Map specific API error responses
         let errorTitle = "Error";
         let errorMessage =
            "An error occurred while deleting the voucher entry.";

         // Check if it's a structured API error response
         const apiError =
            error?.error?.error ||
            error?.error ||
            error?.response?.data?.error ||
            error?.data?.error ||
            error;

         if (apiError && (apiError.code || apiError.message)) {
            if (apiError?.code === "NOT_FOUND") {
               errorTitle = "Record Not Found";
               if (apiError?.details && Array.isArray(apiError.details)) {
                  const entryNoError = apiError.details.find(
                     (detail: any) => detail.field === "entryNo"
                  );
                  if (entryNoError) {
                     errorMessage =
                        entryNoError.message ||
                        "No matching voucher entry found.";
                  } else {
                     errorMessage =
                        apiError.message ||
                        "The voucher entry to delete could not be found.";
                  }
               } else {
                  errorMessage =
                     apiError.message ||
                     "The voucher entry to delete could not be found.";
               }
            } else if (apiError?.code === "VALIDATION_ERROR") {
               errorTitle = "Validation Error";
               if (apiError?.details && Array.isArray(apiError.details)) {
                  const fieldErrors = apiError.details
                     .map((detail: any) => `• ${detail.field}: ${detail.message}`)
                     .join("\n");
                  errorMessage =
                     fieldErrors ||
                     apiError.message ||
                     "Invalid data provided.";
               } else {
                  errorMessage = apiError.message || "Invalid data provided.";
               }
            } else if (apiError?.code === "FORBIDDEN") {
               errorTitle = "Access Denied";
               errorMessage =
                  apiError.message ||
                  "You don't have permission to delete this voucher entry.";
            } else if (apiError?.message) {
               errorMessage = apiError.message;
            }
         }

         setToasterType("error");
         setToasterMessage(errorTitle);
         setToasterDescription(errorMessage);
         return false;
      }
   };
   const handlePostModalChange = (
      field: "purchaseJournalDate" | "cashDisbursementDate",
      value: string
   ) => {
      if (field === "purchaseJournalDate") {
         setPurchaseJournalDate(value);
         setPurchaseJournalStatus(undefined);
      } else {
         setCashDisbursementDate(value);
         setCashDisbursementStatus(undefined);
      }
   };
   const handlePostModalSubmit = async () => {
      if (!purchaseJournalDate) {
         setToasterType("error");
         setToasterMessage("Error");
         setToasterDescription("Please select a Purchase Journal Date.");
         setPurchaseJournalStatus("error");
         return;
      }

      const selectedEntries = voucherData.filter((entry) =>
         selectedRows.includes(entry.key)
      );

      if (selectedEntries.length === 0) {
         setToasterType("warning");
         setToasterMessage("Warning");
         setToasterDescription(VOUCHER_ENTRY_MESSAGES.selectAtLeastOne);
         return;
      }

      // If any selected entry is prepaid, require Key Cash Disbursements Journal Date
      const hasPrepaidEntry = selectedEntries.some(
         (entry) => (entry as any)?.prepaidCode && (entry as any).prepaidCode !== ""
      );
      if (hasPrepaidEntry && !cashDisbursementDate) {
         setToasterType("error");
         setToasterMessage("Error");
         setToasterDescription(
            "Key Cash Disbursements Journal Date is required for prepaid vouchers."
         );
         setCashDisbursementStatus("error");
         return;
      }

      try {
        // Build payload with prepaid fields for different scenarios
        const payload = {
          entries: selectedEntries.map((entry) => {
            const baseEntry = {
              invoiceNo: entry.invoiceNo,
              companyNo: 10,
              vendorNo: Number(entry.vendorNo),
              entryNo: Number(entry.entryNo),
            };

            // Add prepaid fields if entry has prepaid code
            if (entry.prepaidCode && entry.prepaidCode !== "") {
              return {
                ...baseEntry,
                prepaidCode: entry.prepaidCode,
                prepaidCheckNo: entry.prepaidCheckNo?.toString() || "",
                bankGl: entry.bankGl || 0,
                invoiceAmount: entry.invoiceAmount || 0,
              };
            }

            return baseEntry;
          }),
          companyNo: 10,
          purchaseJD: formatNumberToMMDDYY(purchaseJournalDate) || "000000",
          keyCashDJD: cashDisbursementDate
            ? formatNumberToMMDDYY(cashDisbursementDate) || "000000"
            : "000000",
        };

         const response = await postToPurchaseJournalMutation.mutateAsync(payload);

         if (response) {
            setSelectedRows([]);
            setIsPostModalOpen(false);
            setPurchaseJournalDate("");
            setCashDisbursementDate("");
            setShowSuccessModal(true);
         } else {
            setToasterType("error");
            setToasterMessage("Error");
            setToasterDescription(
               (response as any)?.data?.message || "Failed to post entries."
            );
         }
      } catch (err: any) {
         console.error("Error posting to purchase journal:", err);

         // Map specific API error responses
         let errorTitle = "Error";
         let errorMessage = "Something went wrong while posting.";

         // Check if it's a native Response object that needs to be parsed
         let apiError = null;

         // Handle native Response objects first
         if (err instanceof Response) {
            try {
               // Clone the response to avoid consuming the body
               const responseClone = err.clone();
               const responseText = await responseClone.text();
               
               if (responseText) {
                  const parsedError = JSON.parse(responseText);
                  apiError = parsedError.error || parsedError;
               }
            } catch (parseError) {
               console.error("Failed to parse Response body:", parseError);
            }
         }
         
         if (!apiError) {
            apiError =
               err?.error?.error ||
               err?.error ||
               err?.response?.data?.error ||
               err?.data?.error ||
               err;
         }

         if (apiError && (apiError.code || apiError.message)) {
            // Use switch for cleaner error code handling
            switch (apiError.code) {
               case "NOT_FOUND":
                  errorTitle = "Record Not Found";
                  if (apiError?.details && Array.isArray(apiError.details)) {
                     const entryNoError = apiError.details.find(
                        (detail: any) => detail.field === "entryNo"
                     );
                     if (entryNoError) {
                        errorMessage =
                           entryNoError.message ||
                           "No matching voucher entry found.";
                     } else {
                        errorMessage =
                           apiError.message ||
                           "One or more voucher entries could not be found.";
                     }
                  } else {
                     errorMessage =
                        apiError.message ||
                        "One or more voucher entries could not be found.";
                  }
                  break;
               
               case "VALIDATION_ERROR":
                  errorTitle = "Validation Error";
                  if (apiError?.details && Array.isArray(apiError.details)) {
                     const fieldErrors = apiError.details
                        .map((detail: any) => `• ${detail.field}: ${detail.message}`)
                        .join("\n");
                     errorMessage =
                        fieldErrors ||
                        apiError.message ||
                        "Invalid data provided.";
                  } else {
                     errorMessage = apiError.message || "Invalid data provided.";
                  }
                  break;
               
               case "SERVER_ERROR":
                  errorTitle = "Server Error";
                  if (apiError?.details && Array.isArray(apiError.details)) {
                     const serverError = apiError.details[0];
                     if (serverError && serverError.message) {
                        errorMessage = serverError.message;
                     } else {
                        errorMessage =
                           apiError.message ||
                           "A server error occurred while processing your request.";
                     }
                  } else {
                     errorMessage =
                        apiError.message ||
                        "A server error occurred while processing your request.";
                  }
                  break;
               
               case "FORBIDDEN":
                  errorTitle = "Access Denied";
                  errorMessage =
                     apiError.message ||
                     "You don't have permission to post to purchase journal.";
                  break;
               
               case "CHECK_NOT_FOUND":
                  errorTitle = "Check Validation Error";
                  errorMessage = apiError.message || "Check number not found in the system.";
                  break;
               
               case "AMOUNT_MISMATCH":
                  errorTitle = "Amount Validation Error";
                  errorMessage = apiError.message || "Check amount does not match the invoice amount.";
                  break;
               
               case "BANK_GL_MISSING":
                  errorTitle = "Missing Required Field";
                  errorMessage = apiError.message || "Bank GL is required for prepaid entries.";
                  break;
               
               default:
                  // Handle cases where there's a message but no specific code
                  if (apiError.message) {
                     errorMessage = apiError.message;
                  }
                  break;
            }
         }

         setToasterType("error");
         setToasterMessage(errorTitle);
         setToasterDescription(errorMessage);
      }
   };
   return (
      <>
         <div className="content-card-body">
            <div className="flex-between">
               <div>
                  <h4>{FLEXI_PROCESS_CONSTANTS.processTitle}</h4>
                  <p className="sub-text p-xs">
                     {FLEXI_PROCESS_CONSTANTS.processTypeLabel}
                  </p>
               </div>
               <div className="action-buttons">
                  <ActionPermissionGuard actionId="voucher-entry.flexi.post">
                     <CustomStyledButton
                        name="postToPurchaseJournal"
                        label={
                           <h6>{VOUCHER_ENTRY_TEXTS.postToPurchaseJournal}</h6>
                        }
                        onClick={handlePostToPurchaseJournal}
                        icon={
                           <img
                              src={FileIcon}
                              alt="file"
                              className="file-icons"
                           />
                        }
                     />
                  </ActionPermissionGuard>
               </div>
            </div>

            <div className="vendor-details-container show-no-padding">
               <div className="cards-container flex w-full">
                  <div className="card-row flex single-row">
                     {cardStats.map((card, index) => (
                        <div className="flex-1 height-100" key={index}>
                           <Card
                              icon={card.icon}
                              label={card.label}
                              value={card.value}
                           />
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            <div className="table-responsive-container centered-header">
               <TableWidget
                  columns={columns}
                  dataSource={voucherData}
                  loading={isFlexiEntriesLoading}
                  rowKey="key"
               />
            </div>
         </div>

         {viewRecord && (
            <ViewVoucherModal
               visible={isModalVisible}
               title={modalTitle}
               entryNo={viewRecord.entryNo}
               companyNo={Number(viewRecord.companyNo)}
               vendorNo={Number(viewRecord.vendorNo)}
               onClose={() => setIsModalVisible(false)}
               editActionId="voucher-entry.flexi.edit"
               onEdit={() => {
                  if (viewRecord) {
                     handleEditClick({
                        entryNo: Number(viewRecord.entryNo),
                        companyNo: Number(viewRecord.companyNo),
                        vendorNo: viewRecord.vendorNo,
                        key: String(viewRecord.entryNo),
                        invoiceNo:
                           voucherData.find(
                              (item) => item.entryNo === viewRecord.entryNo
                           )?.invoiceNo || "",
                        invoiceAmount:
                           voucherData.find(
                              (item) => item.entryNo === viewRecord.entryNo
                           )?.invoiceAmount || "",
                        invoiceDate:
                           voucherData.find(
                              (item) => item.entryNo === viewRecord.entryNo
                           )?.invoiceDate || "",
                        discountDueDate:
                           voucherData.find(
                              (item) => item.entryNo === viewRecord.entryNo
                           )?.discountDueDate || "",
                        discountDue:
                           voucherData.find(
                              (item) => item.entryNo === viewRecord.entryNo
                           )?.discountDue || "",
                        vendorName:
                           voucherData.find(
                              (item) => item.entryNo === viewRecord.entryNo
                           )?.vendorName || "",
                        status:
                           voucherData.find(
                              (item) => item.entryNo === viewRecord.entryNo
                           )?.status || "",
                     });
                  }
               }}
            />
         )}

         <DeleteConfirmationModal
            visible={showDeleteModal}
            itemName="Voucher Entry"
            onCancel={() => {
               setShowDeleteModal(false);
               setSelectedDeleteRecord(null);
            }}
            onConfirm={async () => {
               if (selectedDeleteRecord) {
                  await handleDeleteClick(
                     selectedDeleteRecord.entryNo,
                     selectedDeleteRecord.companyNo,
                     selectedDeleteRecord.vendorNo,
                     selectedDeleteRecord.invoiceNo
                  );
                  setShowDeleteModal(false);
                  setSelectedDeleteRecord(null);
                  // Data will be refreshed by manual refetch in handleDeleteClick
               }
            }}
         />
         <PostToPurchaseJournalModal
            visible={isPostModalOpen}
            onCancel={() => {
               setIsPostModalOpen(false);
               setPurchaseJournalDate("");
               setCashDisbursementDate("");
               setPurchaseJournalStatus(undefined);
               setCashDisbursementStatus(undefined);
            }}
            onChange={handlePostModalChange}
            onSubmit={handlePostModalSubmit}
            purchaseJournalDate={purchaseJournalDate}
            cashDisbursementDate={cashDisbursementDate}
            prepaidCode={getSelectedPrepaidCode()}
            purchaseJournalStatus={purchaseJournalStatus}
            cashDisbursementStatus={cashDisbursementStatus}
         />

         {/* Success Modal */}
         <ModalContent
            title={
               <h4 className="modal-utiliy-title">
                  Voucher Entries Posted Successfully!
               </h4>
            }
            description={
               <p className="p-xs modal-body-wrapper">
                  Voucher entries have been moved to purchase journal
               </p>
            }
            visible={showSuccessModal}
            onCancel={() => setShowSuccessModal(false)}
            showCloseIcon={false}
            imageUrl={popupOk}
            actions={[
               {
                  name: "ok",
                  label: "Ok",
                  onClick: () => {
                     setShowSuccessModal(false);
                     refetchFlexiEntries();
                     navigate(ROUTES.PURCHASE_JOURNAL);
                  },
               },
            ]}
            className="cne-modal descripition button-adjusted"
         />

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

         {/* Unprocessed Records Modal */}
         <UnprocessedRecordsModal
            visible={showUnprocessedModal}
            onClose={handleCloseUnprocessedModal}
            unprocessedItems={unprocessedRecords}
         />
      </>
   );
};

export default FlexiProcess;
