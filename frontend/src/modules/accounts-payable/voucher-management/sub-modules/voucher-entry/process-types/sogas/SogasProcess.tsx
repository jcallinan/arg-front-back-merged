import { formatCurrency } from "../../../../../../../utils/formatters";
// Removed hardcoded discount validation - now using backend status only
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
   FLEXI_PROCESS_CONSTANTS,
   VOUCHER_CONSTANTS,
   VOUCHER_ENTRY_COLUMN_LABELS,
   VOUCHER_ENTRY_MESSAGES,
   VOUCHER_ENTRY_TEXTS,
   ROUTES,
} from "../../../../../../../constants/commonConstants";
import { CustomStyledButton } from "../../../../../../../widget-library/Buttons";
import invoiceAmountIcon from "../../../../../../../assets/icons/invoice-amount-icon.svg";
import uploadedRecordsIcon from "../../../../../../../assets/icons/uploaded-records-icon.svg";
import successIcon from "../../../../../../../assets/icons/success-icon.svg";
import warningIcon from "../../../../../../../assets/icons/warning-icon.svg";
import errorIcon from "../../../../../../../assets/icons/error-icon.svg";
import successStatusIcon from "../../../../../../../assets/icons/success-status-icon.svg";
import alertStatusIcon from "@assets/icons/alert-status-icon.svg";
import warningStatusIcon from "@assets/icons/warning-status-icon.svg";
import FileIcon from "@assets/icons/post-to-purchase-icon.svg";
import infoIcon from "@assets/icons/info-circle-icon.svg";
import type {
   SogasEntryItem,
   SogasProcessProps,
   VoucherEntryUI,
   UnprocessedRecord,
} from "@type-definitions/accounts-payable.types";
import TableWidget from "@widget-library/Table";
import type { ColumnType } from "antd/es/table";
import Card from "@widget-library/Card";
import { Checkbox, Popover, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import ViewVoucherModal from "../normal/create-entry/ViewVoucherModal";
import DeleteConfirmationModal from "@widget-library/DeleteConfirmationModal";
import PostToPurchaseJournalModal from "@shared-components/post-to-purchase-journel-modal/PostToPurchaseJournalModal";
import { formatNumberToMMDDYY } from "@/utils/dateFormat";
import {
   createStatusSorter,
   createVendorNameSorter,
   createVendorNumberStringSorter,
   createInvoiceNumberSafeSorter,
   createInvoiceAmountSorter,
   createCustomDateSorter,
} from "../../../../../../../utils/sortingUtils";
import {
   getColumnSearchProps,
   createNumericFilter,
} from "../../../../../../../utils/tableFilters";
import Toaster from "../../../../../../../widget-library/Toaster";
import ModalContent from "../../../../../../../widget-library/Modal";
import popupOk from "../../../../../../../assets/icons/popup-ok.svg";
import UnprocessedRecordsModal from "./UnprocessedRecordsModal";
import { useSogasEntries, useSogasVoucherSummary } from "@hooks/useSogasProcess";
import { usePostToPurchaseJournal } from "@hooks/usePostToPurchaseJournal";
import { useDeleteVoucher } from "@hooks/useDeleteVoucher";
import { useVoucherByEntryNo } from "@hooks/useVoucherByEntryNo";

const SogasProcess: React.FC<SogasProcessProps> = ({
   uploadStatusData,
   useUploadSummary,
}) => {
   const navigate = useNavigate();
   const [voucherData, setVoucherData] = useState<VoucherEntryUI[]>([]);
   const [selectedRows, setSelectedRows] = useState<string[]>([]);
   const [totalInvoiceAmount, setTotalInvoiceAmount] = useState(0);
   const [totalRecords, setTotalRecords] = useState(0);
   const [totalSuccesses, setTotalSuccesses] = useState(0);
   const [totalWarnings, setTotalWarnings] = useState(0);
   const [totalErrors, setTotalErrors] = useState(0);
   const [showDeleteModal, setShowDeleteModal] = useState(false);
   const [isPostModalOpen, setIsPostModalOpen] = useState(false);
   const [purchaseJournalDate, setPurchaseJournalDate] = useState("");
   const [cashDisbursementDate, setCashDisbursementDate] = useState("");
   const [selectedDeleteRecord, setSelectedDeleteRecord] = useState<{
      entryNo: number;
      companyNo: number;
      vendorNo: number;
      invoiceNo: string;
   } | null>(null);
   const [isModalVisible, setIsModalVisible] = useState(false);
   const [viewRecord, setViewRecord] = useState<{
      entryNo: string;
      companyNo: number;
      vendorNo: string;
   } | null>(null);
   const [editVoucherParams, setEditVoucherParams] = useState<{
      entryNo: string;
      companyNo: string;
      vendorNo: string;
   } | null>(null);
   // Toaster state for displaying messages
   const [toaster, setToaster] = useState<{
      visible: boolean;
      type: "error" | "success" | "warning" | "batch";
      message: string;
      description: string;
   } | null>(null);
   const [modalTitle, setModalTitle] = useState("Voucher Details");
   // Flag to indicate fresh data fetch (prioritizes API data over upload data)
   const [hasFreshApiData, setHasFreshApiData] = useState(false);
   const [showSuccessModal, setShowSuccessModal] = useState(false);
   const [shouldFetchData, setShouldFetchData] = useState(true); // Control when to fetch data
   
   // Unprocessed records modal state
   const [showUnprocessedModal, setShowUnprocessedModal] = useState(false);
   const [unprocessedRecords, setUnprocessedRecords] = useState<UnprocessedRecord[]>([]);

   // React Query hooks - controlled fetching
   const {
      data: sogasEntriesData,
      isLoading,
      error: sogasEntriesError,
      refetch: refetchSogasEntries,
   } = useSogasEntries(10, shouldFetchData);

   const {
      data: voucherSummary,
      refetch: refetchVoucherSummary,
   } = useSogasVoucherSummary(10, shouldFetchData);

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
            refetchSogasEntries(),
            refetchVoucherSummary()
         ]).then(() => {
            setShouldFetchData(false); // Disable automatic fetching after initial load
         });
      }
   }, [shouldFetchData, refetchSogasEntries, refetchVoucherSummary]);

   // Helper function to show toaster messages
   const showToaster = (
      type: "error" | "success" | "warning" | "batch",
      message: string,
      description: string = ""
   ) => {
      setToaster({
         visible: true,
         type,
         message,
         description,
      });
   };

   // Process SOGAS entries data when it changes
   useEffect(() => {
      if (sogasEntriesData && Array.isArray(sogasEntriesData)) {
         const mapped: VoucherEntryUI[] = sogasEntriesData.map(
            (item: SogasEntryItem) => {
               const statusMap: { [key: string]: string } = {
                  S: "success",
                  W: "warning",
                  E: "error",
               };
               const code = (item.status ?? "E") as keyof typeof statusMap;
               const uiStatus = statusMap[code] ?? "error";

               return {
                  key: String(item.entryNo),
                  invoiceNo: item.invoiceNo || "-",
                  invoiceDate: item.invoiceDate || "-", // default
                  discountDue: item.discountDue || "0", // default
                  discountDueDate: item.discountDueDate || "-", // default
                  vendorName: item.vendorName || "-",
                  vendorNo: String(item.vendorNo),
                  status: uiStatus,
                  entryNo: Number(item.entryNo),
                  entrySequence: item.entrySequence || 0, // default
                  companyNo: Number(item.companyNo || 10),
                  canceledVoucher: item.canceledVoucher || 0,
                  apGlNo: item.apGlNo || 0,
                  invoiceDesc: item.invoiceDesc || "-",
                  dueDate: item.dueDate || "-",
                  singleCheck: item.singleCheck || "-",
                  holdCode: item.holdCode || "-",
                  holdDesc: item.holdDesc || "-",
                  prepaidCode: item.prepaidCode || "",
                  prepaidCheckNo: item.prepaidCheckNo || 0,
                  vendorAdd1: item.vendorAdd1 || "-",
                  vendorAdd2: item.vendorAdd2 || "-",
                  vendorAdd3: item.vendorAdd3 || "-",
                  vendorAdd4: item.vendorAdd4 || "-",
                  bankGl: item.bankGl || 0,
                  invoiceAmount: item.invoiceAmount || 0,
                  retentionGl: item.retentionGl || 0,
                  retentionPct: item.retentionPct || 0,
                  prepaidCheckdate: item.prepaidCheckdate || 0,
                  salesOrderNo: item.salesOrderNo || 0,
                  srn: item.srn || 0,
                  carrierId: item.carrierId || "-",
                  vendorPaymentTerms: item.vendorPaymentTerms || 0,
                  processType: item.processType || "-",
                  extendedDiscountDueDate: item.extendedDiscountDueDate || 0,
                  checkNo: item.checkNo || "-",
               };
            }
         );

         const invoiceTotal = mapped.reduce(
            (sum, r) => sum + Number(r.invoiceAmount || 0),
            0
         );
         const successCount = mapped.filter(
            (r) => r.status === "success"
         ).length;
         const warningCount = mapped.filter(
            (r) => r.status === "warning"
         ).length;
         const errorCount = mapped.filter((r) => r.status === "error").length;

         setVoucherData(mapped);
         setTotalInvoiceAmount(invoiceTotal);
         setTotalRecords(mapped.length);
         setTotalSuccesses(successCount);
         setTotalWarnings(warningCount);
         setTotalErrors(errorCount);
         setHasFreshApiData(true);
      }
   }, [sogasEntriesData]);

   // Handle errors from React Query
   useEffect(() => {
      if (sogasEntriesError) {
         console.error("getSogasData error:", sogasEntriesError);

         // Map specific API error responses
         let errorMessage = "Failed to load sogas entries";

         // Check if it's a structured API error response
         const apiError = (sogasEntriesError as any)?.error?.error ||
            (sogasEntriesError as any)?.error ||
            (sogasEntriesError as any)?.response?.data?.error ||
            (sogasEntriesError as any)?.data?.error ||
            sogasEntriesError;

         if (apiError && (apiError.code || apiError.message)) {
            if (apiError?.code === "NOT_FOUND") {
               if (apiError?.details && Array.isArray(apiError.details)) {
                  const fieldError = apiError.details[0];
                  if (fieldError && fieldError.message) {
                     errorMessage = fieldError.message;
                  } else {
                     errorMessage =
                        apiError.message || "No sogas entries found.";
                  }
               } else {
                  errorMessage = apiError.message || "No sogas entries found.";
               }
            } else if (apiError?.code === "VALIDATION_ERROR") {
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

         showToaster("error", errorMessage);
      }
   }, [sogasEntriesError]);

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
         let errorMessage = "Failed to load voucher details for editing.";

         // Check if it's a structured API error response
         const apiError = (editVoucherError as any)?.error?.error ||
            (editVoucherError as any)?.error ||
            (editVoucherError as any)?.response?.data?.error ||
            (editVoucherError as any)?.data?.error ||
            editVoucherError;

         if (apiError && (apiError.code || apiError.message)) {
            if (apiError?.code === "NOT_FOUND") {
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
         showToaster("error", errorMessage);
         // Reset the edit params on error
         setEditVoucherParams(null);
      }
   }, [editVoucherError]);

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
               refetchSogasEntries(),
               refetchVoucherSummary()
            ]).then(() => {
               console.log("✅ Upload complete - fetched fresh data");
            }).catch((error) => {
               console.error("❌ Error fetching data after upload:", error);
            });
         }
      }
   }, [useUploadSummary, uploadStatusData, refetchSogasEntries, refetchVoucherSummary]);

   // Handler for closing unprocessed records modal
   const handleCloseUnprocessedModal = () => {
      setShowUnprocessedModal(false);
      setUnprocessedRecords([]);
   };

   const handleRowSelect = (key: string) => {
      setSelectedRows((prev) =>
         prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
      );
   };

  const handleSelectAllRows = () => {
      const selectableKeys = voucherData
         .filter((entry) => entry.status !== "error")
         .map((entry) => entry.key);
      setSelectedRows(
         selectedRows.length === selectableKeys.length ? [] : selectableKeys
      );
   };

   const handleViewClick = (record: VoucherEntryUI) => {
      setModalTitle("Voucher Details");
      setViewRecord({
         entryNo: record.key,
         companyNo: record.companyNo ?? "10",
         vendorNo: record.vendorNo,
      });
      setIsModalVisible(true);
   };

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
            showToaster("success", "Voucher entry deleted successfully.");
            refetchSogasEntries();
            refetchVoucherSummary();
            return true;
         } else {
            showToaster(
               "error",
               response.data?.message || "Failed to delete voucher entry."
            );
            return false;
         }
      } catch (error: any) {
         console.error("Delete error:", error);

         // Map specific API error responses
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
               errorMessage =
                  apiError.message ||
                  "You don't have permission to delete this voucher entry.";
            } else if (apiError?.message) {
               errorMessage = apiError.message;
            }
         }

         showToaster("error", errorMessage);
         return false;
      }
   };

   const columns: (ColumnType<VoucherEntryUI> & { filterable?: boolean })[] = [
      {
         title: (
            (() => {
               const selectableCount = voucherData.filter((r) => r.status !== "error").length;
               const allSelected = selectedRows.length > 0 && selectedRows.length === selectableCount;
               const isIndeterminate = selectedRows.length > 0 && selectedRows.length < selectableCount;
               return (
                  <Checkbox
                     onChange={handleSelectAllRows}
                     checked={allSelected}
                     indeterminate={isIndeterminate}
                     aria-label={VOUCHER_ENTRY_COLUMN_LABELS.selectAllAria}
                  />
               );
            })()
         ),
         dataIndex: "",
         render: (_, record) => (
            <Checkbox
               checked={selectedRows.includes(record.key)}
               disabled={record.status === "error"}
               onChange={() => handleRowSelect(record.key)}
               aria-label={VOUCHER_ENTRY_COLUMN_LABELS.selectRowAria(
                  record.key
               )}
            />
         ),
      },
      {
         title: FLEXI_PROCESS_CONSTANTS.tableColumns.actions,
         dataIndex: "",
         fixed: "left",
         align: "center",
         render: (_, record) => (
            <div className="action-icons flex-all">
               <Tooltip title="View">
                  <EyeOutlined
                     className="action-icon"
                     onClick={() => handleViewClick(record)}
                  />
               </Tooltip>
               <Tooltip title="Edit">
                  <EditOutlined
                     onClick={() => handleEditClick(record)}
                     className="action-icon"
                  />
               </Tooltip>
               <Tooltip title="Delete">
                  <DeleteOutlined
                     className="action-icon"
                     onClick={() => {
                        setSelectedDeleteRecord({
                           entryNo: Number(record.key),
                           companyNo: Number(record.companyNo),
                           vendorNo: Number(record.vendorNo),
                           invoiceNo: record.invoiceNo,
                        });
                        setShowDeleteModal(true);
                     }}
                  />
               </Tooltip>
            </div>
         ),
      },
      {
         title: FLEXI_PROCESS_CONSTANTS.tableColumns.status,
         dataIndex: "status",
         key: "status",
         ...getColumnSearchProps("status", "Search Status"),
         align: "center",
         render: (status: string) => {
            const statusIcons: Record<string, string> = {
               success: successStatusIcon,
               warning: warningStatusIcon,
               error: alertStatusIcon,
            };
            
            // Use backend status only - no frontend discount validation
            let tooltipTitle = status;
            
            const iconSrc =
               statusIcons[status.toLowerCase()] ?? alertStatusIcon;
            return (
               <Tooltip title={tooltipTitle}>
                  <img
                     src={iconSrc}
                     alt={status}
                     style={{ width: 20, height: 20 }}
                  />
               </Tooltip>
            );
         },
         sorter: createStatusSorter("status"),
      },
      {
         title: "Vendor Name",
         dataIndex: "vendorName",
         key: "vendorName",
         ...getColumnSearchProps("vendorName", "Search Vendor Name"),
         sorter: createVendorNameSorter("vendorName"),
      },
      {
         title: "Vendor No",
         dataIndex: "vendorNo",
         key: "vendorNo",
         ...createNumericFilter("vendorNo", "Enter Vendor No"),
         sorter: createVendorNumberStringSorter("vendorNo"),
      },
      {
         title: "CHECK #",
         dataIndex: "invoiceNo",
         key: "invoiceNo",
         ...getColumnSearchProps("invoiceNo", "Search Check No"),
         sorter: createInvoiceNumberSafeSorter("invoiceNo"),
      },
      {
         title: <div className="amount-header">AMOUNT</div>,
         dataIndex: "invoiceAmount",
         key: "invoiceAmount",
         ...getColumnSearchProps("invoiceAmount", "Enter Amount", true),
         align: "right",
         render: (value: number | string) => formatCurrency(value),
         sorter: createInvoiceAmountSorter("invoiceAmount"),
      },
      {
         title: "Payment Due Date",
         dataIndex: "dueDate",
         key: "dueDate",
         ...getColumnSearchProps("dueDate", "Search Due Date"),
         sorter: createCustomDateSorter("invoiceDate"),
      },
   ];

   type MinimalEditRecord = Pick<
      VoucherEntryUI,
      "key" | "companyNo" | "vendorNo"
   > & { entryNo: number };
   const handleEditClick = (record: MinimalEditRecord) => {
      // Set the parameters to trigger the React Query hook
      setEditVoucherParams({
         entryNo: String(record.key),
         companyNo: String(record.companyNo || "10"),
         vendorNo: String(record.vendorNo),
      });
   };


   // Watch for unprocessed items in upload status data
   useEffect(() => {
      if (uploadStatusData?.unprocessedItems && uploadStatusData.unprocessedItems.length > 0) {
         // Set the unprocessed records and show modal
         setUnprocessedRecords(uploadStatusData.unprocessedItems);
         setShowUnprocessedModal(true);
      }
   }, [uploadStatusData]);

   const handlePostToPurchaseJournal = () => {
      const selectedEntries = voucherData.filter((entry) =>
         selectedRows.includes(entry.key)
      );
      if (selectedEntries.length === 0) {
         showToaster("warning", VOUCHER_ENTRY_MESSAGES.selectAtLeastOne);
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
   const handlePostModalChange = (
      field: "purchaseJournalDate" | "cashDisbursementDate",
      value: string
   ) => {
      if (field === "purchaseJournalDate") {
         setPurchaseJournalDate(value);
      } else {
         setCashDisbursementDate(value);
      }
   };
   const handlePostModalSubmit = async () => {
      if (!purchaseJournalDate) {
         showToaster("error", "Please select a Purchase Journal Date.");
         return;
      }

      const selectedEntries = voucherData.filter((entry) =>
         selectedRows.includes(entry.key)
      );

      if (selectedEntries.length === 0) {
         showToaster("warning", VOUCHER_ENTRY_MESSAGES.selectAtLeastOne);
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
            showToaster("success", "Posted to Purchase Journal successfully.");
            setSelectedRows([]);
            setIsPostModalOpen(false);
            setPurchaseJournalDate("");
            setCashDisbursementDate("");
            setShowSuccessModal(true);
         } else {
            const maybeErr = (
               response as unknown as { data?: { message?: string } }
            )?.data?.message;
            showToaster("error", maybeErr || "Failed to post entries.");
         }
      } catch (err: any) {
         console.error("Error posting to purchase journal:", err);

         // Map specific API error responses
         let errorMessage = "Something went wrong while posting.";

         // Check if it's a native Response object that needs to be parsed
         let apiError = null;

         if (err instanceof Response) {
            try {
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
                  errorMessage =
                     apiError.message ||
                     "You don't have permission to post to purchase journal.";
                  break;
               
               case "CHECK_NOT_FOUND":
                  errorMessage = apiError.message || "Check number not found in the system.";
                  break;
               
               case "AMOUNT_MISMATCH":
                  errorMessage = apiError.message || "Check amount does not match the invoice amount.";
                  break;
               
               case "BANK_GL_MISSING":
                  errorMessage = apiError.message || "Bank GL is required for prepaid entries.";
                  break;
               
               default:
                  if (apiError.message) {
                     errorMessage = apiError.message;
                  }
                  break;
            }
         }

         showToaster("error", errorMessage);
      }
   };
   return (
      <div>
         <div className="flex-between">
            <div>
               <h4>{VOUCHER_CONSTANTS.apVoucherEntryTitle}</h4>
               <p className="sub-text p-m guideline-text">
                  {VOUCHER_ENTRY_TEXTS.processTypeTextSogas}
               </p>
            </div>
            <div className="action-buttons">
               <CustomStyledButton
                  name="postToPurchaseJournal"
                  label={<h6>{VOUCHER_ENTRY_TEXTS.postToPurchaseJournal}</h6>}
                  icon={<img src={FileIcon} alt="file" className="file-icons" />}
                  onClick={handlePostToPurchaseJournal}
               />
            </div>
         </div>

         {/* dashboard cards */}
         <div className="vendor-details-container show-no-padding">
            <div className="cards-container flex w-full">
               <div className="card-row flex single-row">
                  <div className=" flex-1 height-100">
                     <Card
                        icon={
                           <img src={invoiceAmountIcon} alt="Invoice Amount" />
                        }
                        label={FLEXI_PROCESS_CONSTANTS.cards.totalInvoiceAmount}
                        value={
                           useUploadSummary &&
                           uploadStatusData?.summary &&
                           !hasFreshApiData
                              ? uploadStatusData.summary.totalAmount
                              : voucherSummary &&
                                (voucherSummary as any)?.totalAmount &&
                                (voucherSummary as any)?.totalAmount !== "$0.00"
                              ? (voucherSummary as any)?.totalAmount
                              : formatCurrency(totalInvoiceAmount)
                        }
                     />
                  </div>

                  <div className=" flex-1 height-100">
                     <Card
                        icon={
                           <img
                              src={uploadedRecordsIcon}
                              alt="Uploaded Records"
                           />
                        }
                        label={FLEXI_PROCESS_CONSTANTS.cards.uploadedRecords}
                        value={
                           useUploadSummary &&
                           uploadStatusData?.summary &&
                           !hasFreshApiData
                              ? uploadStatusData.summary.totalUploads.toString()
                              : voucherSummary &&
                                typeof (voucherSummary as any)?.totalUploads === "number"
                              ? (voucherSummary as any)?.totalUploads.toString()
                              : totalRecords.toString()
                        }
                     />
                  </div>

                  <div className=" flex-1 height-100">
                     <Card
                        icon={<img src={successIcon} alt="Success" />}
                        label={FLEXI_PROCESS_CONSTANTS.cards.totalSuccesses}
                        value={
                           useUploadSummary &&
                           uploadStatusData?.summary &&
                           !hasFreshApiData
                              ? uploadStatusData.summary.countS.toString()
                              : voucherSummary &&
                                typeof (voucherSummary as any)?.countS === "number"
                              ? (voucherSummary as any)?.countS.toString()
                              : totalSuccesses.toString()
                        }
                     />
                  </div>

                  <div className=" flex-1 height-100">
                     <Card
                        icon={<img src={warningIcon} alt="Warning" />}
                        label={
                           <div className="warning-label-wrapper">
                              {FLEXI_PROCESS_CONSTANTS.cards.totalWarnings}
                              <Popover
                                 title="Warning"
                                 content="There is a warning in this file that can be corrected, but you are still allowed to post this entry to the purchase journal"
                                 placement="rightTop"
                                 overlayClassName="custom-warning-popover"
                              >
                                 <img
                                    src={infoIcon}
                                    alt="info"
                                    className="info-icon"
                                 />
                              </Popover>
                           </div>
                        }
                        value={
                           useUploadSummary &&
                           uploadStatusData?.summary &&
                           !hasFreshApiData
                              ? uploadStatusData.summary.countW.toString()
                              : voucherSummary &&
                                typeof (voucherSummary as any)?.countW === "number"
                              ? (voucherSummary as any)?.countW.toString()
                              : totalWarnings.toString()
                        }
                     />
                  </div>

                  <div className=" flex-1 height-100">
                     <Card
                        icon={<img src={errorIcon} alt="Error" />}
                        label={FLEXI_PROCESS_CONSTANTS.cards.totalErrors}
                        value={
                           useUploadSummary &&
                           uploadStatusData?.summary &&
                           !hasFreshApiData
                              ? uploadStatusData.summary.countE.toString()
                              : voucherSummary &&
                                typeof (voucherSummary as any)?.countE === "number"
                              ? (voucherSummary as any)?.countE.toString()
                              : totalErrors.toString()
                        }
                     />
                  </div>
               </div>
            </div>
         </div>

         {/* table */}
         <div className="table-responsive-container">
            <TableWidget<VoucherEntryUI>
               columns={columns}
               dataSource={voucherData}
               loading={isLoading}
               rowKey="key"
            />
         </div>
         {viewRecord && (
            <ViewVoucherModal
               visible={isModalVisible}
               title={modalTitle}
               entryNo={viewRecord.entryNo}
               companyNo={viewRecord.companyNo}
               vendorNo={Number(viewRecord.vendorNo)}
               onClose={() => setIsModalVisible(false)}
               onEdit={() => {
                  if (viewRecord) {
                     handleEditClick({
                        key: viewRecord.entryNo,
                        entryNo: Number(viewRecord.entryNo),
                        companyNo: viewRecord.companyNo,
                        vendorNo: viewRecord.vendorNo,
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
                  // Data will be automatically refreshed by React Query mutation
               }
            }}
         />
         <PostToPurchaseJournalModal
            visible={isPostModalOpen}
            onCancel={() => setIsPostModalOpen(false)}
            onChange={handlePostModalChange}
            onSubmit={handlePostModalSubmit}
            purchaseJournalDate={purchaseJournalDate}
            cashDisbursementDate={cashDisbursementDate}
            prepaidCode={getSelectedPrepaidCode()}
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
                     refetchSogasEntries();
                     navigate(ROUTES.PURCHASE_JOURNAL);
                  },
               },
            ]}
            className="cne-modal descripition button-adjusted"
         />

         {toaster && toaster.visible && (
            <Toaster
               type={toaster.type}
               title={toaster.message}
               subtitle={toaster.description}
               onClose={() =>
                  setToaster((prev) =>
                     prev ? { ...prev, visible: false } : prev
                  )
               }
            />
         )}

         {/* Unprocessed Records Modal */}
         <UnprocessedRecordsModal
            visible={showUnprocessedModal}
            onClose={handleCloseUnprocessedModal}
            unprocessedItems={unprocessedRecords}
         />
      </div>
   );
};

export default SogasProcess;
