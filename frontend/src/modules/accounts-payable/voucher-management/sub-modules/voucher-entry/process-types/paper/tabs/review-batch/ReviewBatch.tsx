import {
   formatCurrency,
   toNumericOrNull,
} from "../../../../../../../../../utils/formatters";
import React, { useState, useEffect, useMemo } from "react";
import { Checkbox, Tooltip, message } from "antd";
import invoiceAmountIcon from "../../../../../../../../../assets/icons/invoice-amount-icon.svg";
import uploadedRecordsIcon from "../../../../../../../../../assets/icons/uploaded-records-icon.svg";
import successIcon from "../../../../../../../../../assets/icons/success-icon.svg";
import warningIcon from "../../../../../../../../../assets/icons/warning-icon.svg";
import errorIcon from "../../../../../../../../../assets/icons/error-icon.svg";
import successStatusIcon from "../../../../../../../../../assets/icons/success-status-icon.svg";
import alertStatusIcon from "../../../../../../../../../assets/icons/alert-status-icon.svg";
import warningStatusIcon from "../../../../../../../../../assets/icons/warning-status-icon.svg";
import FileIcon from "../../../../../../../../../assets/icons/post-to-purchase-icon.svg";
import type { ColumnType } from "antd/es/table";
import {
   FLEXI_PROCESS_CONSTANTS,
   VOUCHER_ENTRY_COLUMN_LABELS,
   VOUCHER_ENTRY_TEXTS,
   ROUTES,
} from "../../../../../../../../../constants/commonConstants";
import { CustomStyledButton } from "../../../../../../../../../widget-library/Buttons";
import TableWidget from "../../../../../../../../../widget-library/Table";
import Card from "../../../../../../../../../widget-library/Card";
import DeleteConfirmationModal from "../../../../../../../../../widget-library/DeleteConfirmationModal";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";

import { Popover } from "antd";
import infoIcon from "../../../../../../../../../assets/icons/info-circle-icon.svg";
import { useNavigate } from "react-router-dom";
import type {
   PaperEntryItem,
   UploadStatusData,
} from "../../../../../../../../../types/accounts-payable.types";
import ViewVoucherModal from "../../../normal/create-entry/ViewVoucherModal";
import PostToPurchaseJournalModal from "../../../../../../../../../shared-components/post-to-purchase-journel-modal/PostToPurchaseJournalModal";
import { formatNumberToMMDDYY } from "@/utils/dateFormat";
import Toaster from "@/widget-library/Toaster";
import ModalContent from "@/widget-library/Modal";
import popupOk from "@/assets/icons/popup-ok.svg";
import {
   createInvoiceNumberSafeSorter,
   createCustomDateSorter,
   createInvoiceAmountSorter,
   createDiscountAmountSorter,
   createVendorNameSorter,
   createVendorNumberStringSorter,
   createStatusSorter,
   createNumericSorter,
} from "@/utils/sortingUtils";
import {
   getColumnSearchProps,
   createNumericFilter,
} from "@/utils/tableFilters";
import { usePaperEntries, usePaperVoucherSummary } from "@hooks/usePaperProcess";
import { usePostToPurchaseJournal } from "@hooks/usePostToPurchaseJournal";
import { useDeleteVoucher } from "@hooks/useDeleteVoucher";
import { useVoucherByEntryNo } from "@hooks/useVoucherByEntryNo";

const ReviewBatch: React.FC<{ uploadStatusData?: UploadStatusData }> = ({
   uploadStatusData,
}) => {
   const navigate = useNavigate();
   const [voucherData, setVoucherData] = useState<PaperEntryItem[]>([]);
   const [selectedRows, setSelectedRows] = useState<string[]>([]);
   const [isModalVisible, setIsModalVisible] = useState(false);
   const [modalTitle, setModalTitle] = useState("");
   const [viewRecord, setViewRecord] = useState<{
      entryNo: string;
      companyNo: number;
      vendorNo: number;
   } | null>(null);
   const [editVoucherParams, setEditVoucherParams] = useState<{
      entryNo: string;
      companyNo: string;
      vendorNo: string;
   } | null>(null);
   const [totalInvoiceAmount, setTotalInvoiceAmount] = useState(0);
   const [totalRecords, setTotalRecords] = useState(0);
   const [showDeleteModal, setShowDeleteModal] = useState(false);
   const [selectedDeleteRecord, setSelectedDeleteRecord] =
      useState<PaperEntryItem | null>(null);

   // React Query hooks
   const {
      data: paperEntriesData,
      isLoading,
      error: paperEntriesError,
      refetch: refetchPaperEntries,
   } = usePaperEntries(10);

   const {
      data: voucherSummary,
   } = usePaperVoucherSummary(10);

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

   // Process Paper entries data when it changes
   useEffect(() => {
      if (paperEntriesData && Array.isArray(paperEntriesData)) {
         const itemsWithKeys: PaperEntryItem[] = paperEntriesData.map(
            (item, index: number) => ({
               ...item,
               key: (item as any).entryNo?.toString() || `${index}`,
               invoiceAmount: formatCurrency(item.invoiceAmount),
               entryNo: (item as any).entryNo || index + 1, // Add entryNo if missing
            })
         );

         setVoucherData(itemsWithKeys);

         const total = itemsWithKeys.reduce((sum, item) => {
            const amt = toNumericOrNull(item.invoiceAmount) || 0;
            return sum + amt;
         }, 0);

         setTotalInvoiceAmount(total);
         setTotalRecords(itemsWithKeys.length);
         setHasFreshApiData(true);
      }
   }, [paperEntriesData]);

   // Handle errors from React Query
   useEffect(() => {
      if (paperEntriesError) {
         console.error("Failed to fetch paper entries", paperEntriesError);
         let errorMessage = "Failed to load Paper entries";
         const apiError = (paperEntriesError as any)?.error?.error ||
            (paperEntriesError as any)?.error ||
            (paperEntriesError as any)?.response?.data?.error ||
            (paperEntriesError as any)?.data?.error ||
            paperEntriesError;

         if (apiError && (apiError.code || apiError.message)) {
            if (apiError?.code === "NOT_FOUND") {
               errorMessage = apiError.message || "No paper entries found.";
            } else if (apiError?.code === "VALIDATION_ERROR") {
               errorMessage = apiError.message || "Invalid data provided.";
            } else if (apiError?.message) {
               errorMessage = apiError.message;
            }
         }
         showToaster("error", "Error", errorMessage);
      }
   }, [paperEntriesError]);

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
         let errorMessage = "Failed to load voucher details for editing.";

         const apiError = (editVoucherError as any)?.error?.error ||
            (editVoucherError as any)?.error ||
            (editVoucherError as any)?.response?.data?.error ||
            (editVoucherError as any)?.data?.error ||
            editVoucherError;

         if (apiError && (apiError.code || apiError.message)) {
            if (apiError?.code === "NOT_FOUND") {
               errorMessage = apiError.message || "The requested voucher entry could not be found.";
            } else if (apiError?.code === "VALIDATION_ERROR") {
               errorMessage = apiError.message || "Invalid data provided.";
            } else if (apiError?.message) {
               errorMessage = apiError.message;
            }
         }
         showToaster("error", "Error", errorMessage);
         setEditVoucherParams(null);
      }
   }, [editVoucherError]);

   // Calculate status totals from voucherData
   const statusTotals = useMemo(() => {
      return voucherData.reduce(
         (acc, item) => {
            const status = item.status?.toLowerCase() || "e"; // Default to error if status is undefined
            return {
               success: acc.success + (status === "s" ? 1 : 0),
               warning: acc.warning + (status === "w" ? 1 : 0),
               error: acc.error + (status === "e" ? 1 : 0),
            };
         },
         { success: 0, warning: 0, error: 0 }
      );
   }, [voucherData]);
   const [toaster, setToaster] = useState<{
      type: "success" | "error" | "warning";
      message: string;
      description: string;
      visible: boolean;
   } | null>(null);
   const [showPostToPurchaseModal, setShowPostToPurchaseModal] =
      useState(false);
   const [purchaseJournalDate, setPurchaseJournalDate] = useState<string>("");
   const [cashDisbursementDate, setCashDisbursementDate] = useState<string>("");
   // Voucher summary will come from React Query hook
   const [hasFreshApiData, setHasFreshApiData] = useState(false);
   const [showSuccessModal, setShowSuccessModal] = useState(false);

   const showToaster = (
      type: "success" | "error" | "warning",
      title: string,
      description: string
   ) => {
      setToaster({ type, message: title, description, visible: true });
   };

   // useEffect(() => {
   //   const records: VoucherEntryUI[] = invoiceJson.items.map((item, i) => ({
   //     key: `${i + 1}`,
   //     invoiceNo: item.invoiceNo,
   //     invoiceDate: formatDate(item.invoiceDate),
   //     discountDue: formatAmount(item.invoiceAmount),
   //     discountDueDate: formatDate(item.discountDueDate),
   //     vendorName: item.vendorName,
   //     vendorNo: item.vendorNo.toString(),
   //     status: item.holdDesc?.toLowerCase().includes("hold")
   //       ? "warning"
   //       : "success",
   //   }));

   //   const totalAmount = records.reduce((sum, record) => {
   //     const amount = parseFloat(record.discountDue.replace("$", "")) || 0;
   //     return sum + amount;
   //   }, 0);

   //   const successes = records.filter((r) => r.status === "success").length;
   //   const warnings = records.filter((r) => r.status === "warning").length;
   //   const errors = records.filter((r) => r.status === "error").length;

   //   setVoucherData(records);
   //   setTotalInvoiceAmount(totalAmount);
   //   setTotalRecords(records.length);
   //   setTotalSuccesses(successes);
   //   setTotalWarnings(warnings);
   //   setTotalErrors(errors);
   //   setLoading(false);
   // }, [selectedCompany]);
   // Old fetchPaperEntries function removed - now using React Query hooks

   useEffect(() => {
      // Data will be fetched automatically by React Query hooks
   }, []);

   useEffect(() => {
      if (uploadStatusData?.summary) {
         const s = uploadStatusData.summary;
         setTotalInvoiceAmount(
            typeof s.totalAmount === "string"
               ? parseFloat(s.totalAmount.replace(/[$,]/g, ""))
               : Number(s.totalAmount) || 0
         );
         setTotalRecords(Number(s.totalUploads) || 0);
         // Also refetch the table to reflect new batch - like SOGAS
         setHasFreshApiData(false);
         refetchPaperEntries();
      }
   }, [uploadStatusData]);

   const handleViewClick = (record: PaperEntryItem) => {
      setModalTitle(FLEXI_PROCESS_CONSTANTS.modalTitles.view);
      setViewRecord({
         entryNo: String(record.entryNo ?? ""),
         companyNo: Number(record.companyNo ?? 10),
         vendorNo: Number(record.vendorNo ?? 0),
      });
      setIsModalVisible(true);
   };

   const handleEditClick = (record: PaperEntryItem) => {
      // Set the edit parameters to trigger the useVoucherByEntryNo hook
      setEditVoucherParams({
               entryNo: String(record.entryNo),
         companyNo: String(record.companyNo ?? 10),
         vendorNo: String(record.vendorNo),
      });
   };

   const handleDeleteClick = async (record: PaperEntryItem) => {
      try {
         const entryNo = Number(record.entryNo);
         const companyNo = Number(record.companyNo ?? 10);
         const vendorNo = Number(record.vendorNo);
         const invoiceNo = String(record.invoiceNo ?? "");

         await deleteVoucherMutation.mutateAsync({
            entryNo,
            companyNo,
            vendorNo,
            invoiceNo,
         });

            showToaster(
               "success",
               "Deleted",
            `Voucher entry ${String(record.entryNo ?? "")} deleted successfully.`
            );
            return true;
      } catch (error: any) {
         console.error("Delete error:", error);
         let errorMessage = "Something went wrong while deleting.";

         const apiError = (error as any)?.error?.error ||
            (error as any)?.error ||
            (error as any)?.response?.data?.error ||
            (error as any)?.data?.error ||
            error;

         if (apiError && (apiError.code || apiError.message)) {
            if (apiError?.code === "NOT_FOUND") {
               errorMessage = apiError.message || "The voucher entry to delete could not be found.";
            } else if (apiError?.code === "VALIDATION_ERROR") {
                  errorMessage = apiError.message || "Invalid data provided.";
            } else if (apiError?.code === "FORBIDDEN") {
               errorMessage = apiError.message || "You don't have permission to delete this voucher entry.";
            } else if (apiError?.message) {
               errorMessage = apiError.message;
            }
         }

         showToaster("error", "Delete error", errorMessage);
         return false;
      }
   };

   const handlePostToPurchaseJournal = () => {
      const selectedEntries = voucherData.filter((entry) =>
         selectedRows.includes(String(entry.key ?? ""))
      );

      if (selectedEntries.length === 0) {
         message.warning("Please select at least one row.");
         return;
      }

      setShowPostToPurchaseModal(true);
   };

   // Get prepaidCode from selected entries to determine if cash disbursement date should show
   // Enable second date picker if ANY selected entry has a prepaid code
   const getSelectedPrepaidCode = () => {
      const selectedEntries = voucherData.filter((entry) =>
         selectedRows.includes(String(entry.key ?? ""))
      );
      // Check if ANY selected entry has a prepaid code
      const hasPrepaidCode = selectedEntries.some((entry) => {
         const prepaidCode = (entry as any)?.prepaidCode;
         return prepaidCode && prepaidCode !== "";
      });
      return hasPrepaidCode ? "hasPrepaid" : "";
   };

   const handlePostToPurchaseModalCancel = () => {
      setShowPostToPurchaseModal(false);
      setPurchaseJournalDate("");
      setCashDisbursementDate("");
   };

   const handlePostToPurchaseModalChange = (field: string, value: string) => {
      if (field === "purchaseJournalDate") {
         setPurchaseJournalDate(value);
      } else if (field === "cashDisbursementDate") {
         setCashDisbursementDate(value);
      }
   };

   const handlePostToPurchaseModalSubmit = async () => {
      if (!purchaseJournalDate) {
         showToaster(
            "error",
            "Error",
            "Please select a Purchase Journal Date."
         );
         return;
      }

      const selectedEntries = voucherData.filter((entry) =>
         selectedRows.includes(String(entry.key ?? ""))
      );

      if (selectedEntries.length === 0) {
         showToaster("warning", "Warning", "Please select at least one entry.");
         return;
      }

      try {
        // Build payload with prepaid fields for different scenarios
        const payload = {
          entries: selectedEntries.map((entry) => {
            const baseEntry = {
              invoiceNo: entry.invoiceNo || "",
              companyNo: 10,
              vendorNo: Number(entry.vendorNo),
              entryNo: Number(entry.entryNo),
            };

            // Add prepaid fields if entry has prepaid code
            if ((entry as any)?.prepaidCode && (entry as any).prepaidCode !== "") {
              return {
                ...baseEntry,
                prepaidCode: (entry as any).prepaidCode,
                prepaidCheckNo: (entry as any).prepaidCheckNo?.toString() || "",
                bankGl: (entry as any).bankGl || 0,
                invoiceAmount: (entry as any).invoiceAmount || 0,
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

         await postToPurchaseJournalMutation.mutateAsync(payload);

            showToaster(
               "success",
               "Success",
               "Posted to Purchase Journal successfully."
            );
            setSelectedRows([]);
            setShowPostToPurchaseModal(false);
            setPurchaseJournalDate("");
            setCashDisbursementDate("");
            setShowSuccessModal(true);
      } catch (error: any) {
         console.error("Error posting to purchase journal:", error);
         let errorMessage = "Something went wrong while posting.";
         let errorTitle = "Error";

         // Extract API error message from various possible response structures
         let apiError = null;
         
         // Handle native Response objects first
         if (error instanceof Response) {
            try {
               // Clone the response to avoid consuming the body
               const responseClone = error.clone();
               const responseText = await responseClone.text();
               
               if (responseText) {
                  const parsedError = JSON.parse(responseText);
                  apiError = parsedError.error || parsedError;
               }
            } catch (parseError) {
               console.error("Failed to parse Response body:", parseError);
            }
         }
         
         // If not a Response object or parsing failed, check other structures
         if (!apiError) {
            if (error?.response?.data?.error) {
               apiError = error.response.data.error;
            } else if (error?.response?.data?.message) {
               apiError = { message: error.response.data.message };
            } else if (error?.error?.error) {
               apiError = error.error.error;
            } else if (error?.error) {
               apiError = error.error;
            } else if (error?.data?.error) {
               apiError = error.data.error;
            } else if (error?.message) {
               apiError = { message: error.message };
            }
         }


         // Handle specific error codes and messages
         if (apiError) {
            // Always prioritize the actual API error message first
            if (apiError.message) {
               errorMessage = apiError.message;
            }

            // Use switch for cleaner error code handling
            switch (apiError.code) {
               case "NOT_FOUND":
                  errorTitle = "Record Not Found";
                  break;
               case "VALIDATION_ERROR":
                  errorTitle = "Validation Error";
                  break;
               case "SERVER_ERROR":
                  errorTitle = "Server Error";
                  break;
               case "FORBIDDEN":
                  errorTitle = "Access Denied";
                  break;
               case "CHECK_NOT_FOUND":
                  errorTitle = "Check Validation Error";
                  break;
               case "AMOUNT_MISMATCH":
                  errorTitle = "Amount Validation Error";
                  break;
               case "BANK_GL_MISSING":
                  errorTitle = "Missing Required Field";
                  break;
               default:
                  // Keep default title "Error" for unknown codes
                  break;
            }

            // Handle validation details if available (this overrides the message)
            if (apiError.details && Array.isArray(apiError.details) && apiError.details.length > 0) {
               const validationErrors = apiError.details
                  .map((detail: any) => `• ${detail.field}: ${detail.message}`)
                  .join("\n");
               errorMessage = validationErrors;
               errorTitle = "Validation Errors";
            }
         }

         showToaster("error", errorTitle, errorMessage);
      }
   };

   const handleRowSelect = (key: string) => {
      setSelectedRows((prev) =>
         prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
      );
   };
   const handleSelectAllRows = () => {
      setSelectedRows(
         selectedRows.length === voucherData.length
            ? []
            : voucherData.map((entry) => String(entry.key ?? ""))
      );
   };
   // parseAmount function removed as it's no longer used

   const columns: (ColumnType<PaperEntryItem> & { filterable?: boolean })[] = [
      {
         title: (
            <Checkbox
               onChange={handleSelectAllRows}
               checked={selectedRows.length === voucherData.length}
               aria-label={VOUCHER_ENTRY_COLUMN_LABELS.selectAllAria}
            />
         ),
         dataIndex: "",
         fixed: "left",
         render: (_, record) => (
            <Checkbox
               checked={selectedRows.includes(String(record.key))}
               disabled={record.status === "E"}
               onChange={() => handleRowSelect(String(record.key))}
               aria-label={VOUCHER_ENTRY_COLUMN_LABELS.selectRowAria(
                  String(record.key)
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
               <Tooltip title={VOUCHER_ENTRY_COLUMN_LABELS.viewTooltip}>
                  <EyeOutlined
                     className="action-icon"
                     onClick={() => handleViewClick(record)}
                  />
               </Tooltip>
               <Tooltip title={VOUCHER_ENTRY_COLUMN_LABELS.editTooltip}>
                  <EditOutlined
                     className="action-icon"
                     onClick={() => handleEditClick(record)}
                  />
               </Tooltip>
               <Tooltip title={VOUCHER_ENTRY_COLUMN_LABELS.deleteTooltip}>
                  <DeleteOutlined
                     className="action-icon"
                     onClick={() => {
                        setSelectedDeleteRecord(record ?? null);
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
         sorter: createStatusSorter("status"),
         render: (status: string | undefined) => {
            const lowerStatus = status?.toLowerCase() || "error";
            const statusIcons: { [key: string]: string } = {
               s: successStatusIcon,
               w: warningStatusIcon,
               e: alertStatusIcon,
            };
            const iconSrc = statusIcons[lowerStatus] || alertStatusIcon;
            return (
               <Tooltip title={lowerStatus}>
                  <img src={iconSrc} alt={lowerStatus} style={{ width: 20, height: 20 }} />
                  
               </Tooltip>
            );
         },
      },
      {
         title: FLEXI_PROCESS_CONSTANTS.tableColumns.invoiceNo,
         dataIndex: "invoiceNo",
         key: "invoiceNo",
         ...getColumnSearchProps("invoiceNo", "Search Invoice No"),
         sorter: createInvoiceNumberSafeSorter("invoiceNo"),
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
         ...getColumnSearchProps("invoiceAmount", "Enter Invoice Amount", true),
         sorter: createInvoiceAmountSorter("invoiceAmount"),
      },
      {
         title: FLEXI_PROCESS_CONSTANTS.tableColumns.discountDue,
         dataIndex: "discountDue",
         key: "discountDue",
         ...getColumnSearchProps("discountDue", "Enter Discount Due", true),
         sorter: createDiscountAmountSorter("discountDue"),
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
      {
         title: FLEXI_PROCESS_CONSTANTS.tableColumns.orderNo,
         dataIndex: "salesOrderNo",
         key: "salesOrderNo",
         ...getColumnSearchProps("salesOrderNo", "Search Order No"),
         sorter: createNumericSorter("salesOrderNo"),
      },
   
   ];

   return (
      <>
         <div className="content-card-body">
            <div className="flex-between">
               <div>
                  <h4>Batch Entries</h4>
                  <p className="sub-text p-m">Process Type - Paper</p>
               </div>
               <div className="action-buttons">
                  <CustomStyledButton
                     name="postToPurchaseJournal"
                     label={
                        <h6>{VOUCHER_ENTRY_TEXTS.postToPurchaseJournal}</h6>
                     }
                     onClick={handlePostToPurchaseJournal}
                     icon={
                        <img src={FileIcon} alt="file" className="file-icon" />
                     }
                  />
               </div>
            </div>

            <div className="vendor-details-container show-no-padding">
               <div className="cards-container flex w-full">
                  <div className="card-row flex single-row">
                     <div className="flex-1 height-100">
                        <Card
                           icon={
                              <img
                                 src={invoiceAmountIcon}
                                 alt="Invoice Amount"
                              />
                           }
                           label={
                              FLEXI_PROCESS_CONSTANTS.cards.totalInvoiceAmount
                           }
                           value={
                              uploadStatusData?.summary && !hasFreshApiData
                                 ? uploadStatusData.summary.totalAmount ||
                                   "$0.00"
                                 : voucherSummary &&
                                   (voucherSummary as any).totalAmount &&
                                   (voucherSummary as any).totalAmount !== "$0.00"
                                 ? (voucherSummary as any).totalAmount
                                 : formatCurrency(totalInvoiceAmount)
                           }
                        />
                     </div>
                     <div className="flex-1 height-100">
                        <Card
                           icon={
                              <img
                                 src={uploadedRecordsIcon}
                                 alt="Uploaded Records"
                              />
                           }
                           label={FLEXI_PROCESS_CONSTANTS.cards.uploadedRecords}
                           value={
                              uploadStatusData?.summary && !hasFreshApiData
                                 ? (
                                      uploadStatusData.summary.totalUploads || 0
                                   ).toString()
                                 : voucherSummary &&
                                   typeof (voucherSummary as any).totalUploads ===
                                      "number"
                                 ? (voucherSummary as any).totalUploads.toString()
                                 : totalRecords.toString()
                           }
                        />
                     </div>
                     <div className="flex-1 height-100">
                        <Card
                           icon={<img src={successIcon} alt="Success" />}
                           label={FLEXI_PROCESS_CONSTANTS.cards.totalSuccesses}
                           value={
                              uploadStatusData?.summary && !hasFreshApiData
                                 ? (
                                      uploadStatusData.summary.countS || 0
                                   ).toString()
                                 : voucherSummary &&
                                   typeof (voucherSummary as any).countS === "number"
                                 ? (voucherSummary as any).countS.toString()
                                 : statusTotals.success.toString()
                           }
                        />
                     </div>
                     <div className="flex-1 height-100">
                        <Card
                           icon={<img src={warningIcon} alt="Warning" />}
                           label={
                              <div className="warning-label-wrapper">
                                 {FLEXI_PROCESS_CONSTANTS.cards.totalWarnings}
                                 <Popover
                                    placement="rightTop"
                                    overlayClassName="custom-warning-popover"
                                    content={
                                       <div className="warning-popover-content">
                                          <span className="popover-title">
                                             Warning
                                          </span>
                                          <p>
                                             There is a warning in this file
                                             that can be corrected, but you are
                                             still allowed to post this entry to
                                             the purchase journal.
                                          </p>
                                       </div>
                                    }
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
                              uploadStatusData?.summary && !hasFreshApiData
                                 ? (
                                      uploadStatusData.summary.countW || 0
                                   ).toString()
                                 : voucherSummary &&
                                   typeof (voucherSummary as any).countW === "number"
                                 ? (voucherSummary as any).countW.toString()
                                 : statusTotals.warning.toString()
                           }
                        />
                     </div>
                     <div className="flex-1 height-100">
                        <Card
                           icon={<img src={errorIcon} alt="Error" />}
                           label={FLEXI_PROCESS_CONSTANTS.cards.totalErrors}
                           value={
                              uploadStatusData?.summary && !hasFreshApiData
                                 ? (
                                      uploadStatusData.summary.countE || 0
                                   ).toString()
                                 : voucherSummary &&
                                   typeof (voucherSummary as any).countE === "number"
                                 ? (voucherSummary as any).countE.toString()
                                 : statusTotals.error.toString()
                           }
                        />
                     </div>
                  </div>
               </div>
            </div>

            <div className="table-responsive-container">
               <TableWidget<PaperEntryItem>
                  columns={columns}
                  dataSource={voucherData}
                  loading={isLoading}
                  rowKey="key"
               />
            </div>
         </div>

         {viewRecord && (
            <ViewVoucherModal
               visible={isModalVisible}
               title={modalTitle}
               entryNo={viewRecord.entryNo}
               companyNo={viewRecord.companyNo}
               vendorNo={viewRecord.vendorNo}
               onClose={() => setIsModalVisible(false)}
               onEdit={() =>
                  handleEditClick({
                     entryNo: Number(viewRecord.entryNo),
                     companyNo: viewRecord.companyNo,
                     vendorNo: viewRecord.vendorNo,
                  } as PaperEntryItem)
               }
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
                  const success = await handleDeleteClick(selectedDeleteRecord);
                  if (success) {
                     // Data will be automatically refreshed by React Query mutation
                  }
               }
               setShowDeleteModal(false);
               setSelectedDeleteRecord(null);
            }}
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
         <PostToPurchaseJournalModal
            visible={showPostToPurchaseModal}
            onCancel={handlePostToPurchaseModalCancel}
            onChange={handlePostToPurchaseModalChange}
            onSubmit={handlePostToPurchaseModalSubmit}
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
                     // Data will be fetched automatically by React Query hooks
                     navigate(ROUTES.PURCHASE_JOURNAL);
                  },
               },
            ]}
            className="cne-modal descripition button-adjusted"
         />
      </>
   );
};

export default ReviewBatch;
