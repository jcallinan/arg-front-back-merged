import { formatCurrency } from "../../../../../../../../../utils/formatters";
import { useState, useEffect, useMemo, forwardRef, useImperativeHandle } from "react";
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
import type {
   FlexiProcessProps,
   UploadStatusData,
   LmsEntryItem,
} from "../../../../../../../../../types/accounts-payable.types";
import { useLocation, useNavigate } from "react-router-dom";
import ViewVoucherModal from "../../../normal/create-entry/ViewVoucherModal";
import PostToPurchaseJournalModal from "../../../../../../../../../shared-components/post-to-purchase-journel-modal/PostToPurchaseJournalModal";
import Toaster from "@/widget-library/Toaster";
import { formatNumberToMMDDYY } from "@/utils/dateFormat";
import ModalContent from "@/widget-library/Modal";
import popupOk from "@/assets/icons/popup-ok.svg";
import {
   createInvoiceNumberSafeSorter,
   createCustomDateSorter,
   createInvoiceAmountSorter,
   createVendorNameSorter,
   createStatusSorter,
   createNumericSorter,
   createOrderNumberSorter,
} from "@/utils/sortingUtils";
import { getColumnSearchProps, createNumericFilter } from "@/utils/tableFilters";
import { useLmsEntries, useLmsVoucherSummary } from "@hooks/useLmsProcess";
import { usePostToPurchaseJournal } from "@hooks/usePostToPurchaseJournal";
import { useDeleteVoucher } from "@hooks/useDeleteVoucher";
import { useVoucherByEntryNo } from "@hooks/useVoucherByEntryNo";

const ReviewBatch = forwardRef<
   { refreshData: () => void },
   FlexiProcessProps & { uploadStatusData?: UploadStatusData }
>(({ uploadStatusData }, ref) => {
   const navigate = useNavigate();
   const location = useLocation();
   const [voucherData, setVoucherData] = useState<LmsEntryItem[]>([]);
   const [selectedRows, setSelectedRows] = useState<string[]>([]);
   const [isModalVisible, setIsModalVisible] = useState(false);
   const [modalTitle, setModalTitle] = useState("");
   const [editVoucherParams, setEditVoucherParams] = useState<{
      entryNo: string;
      companyNo: string;
      vendorNo: string;
   } | null>(null);
   const [totalInvoiceAmount, setTotalInvoiceAmount] = useState(0);
   const [totalRecords, setTotalRecords] = useState(0);
   const [showDeleteModal, setShowDeleteModal] = useState(false);
   const [selectedDeleteRecord, setSelectedDeleteRecord] = useState<LmsEntryItem | null>(null);

   // React Query hooks
   const {
      data: lmsEntriesData,
      isLoading,
      error: lmsEntriesError,
      refetch: refetchLmsEntries,
   } = useLmsEntries(10);

   const {
      data: voucherSummary,
   } = useLmsVoucherSummary(10);

   const {
      data: editVoucherData,
      error: editVoucherError,
   } = useVoucherByEntryNo({
      entryNo: editVoucherParams?.entryNo || "",
      companyNo: editVoucherParams?.companyNo || "",
      vendorNo: editVoucherParams?.vendorNo || "",
      enabled: !!editVoucherParams,
   });

   const deleteVoucherMutation = useDeleteVoucher();
   const postToPurchaseJournalMutation = usePostToPurchaseJournal();

   // Calculate status totals from voucherData
   const statusTotals = useMemo(() => {
      return voucherData.reduce(
         (acc, item) => {
            const status = (item.status || "").toLowerCase();
            return {
               success: acc.success + (status === "s" ? 1 : 0),
               warning: acc.warning + (status === "w" ? 1 : 0),
               error: acc.error + (status === "e" ? 1 : 0),
            };
         },
         { success: 0, warning: 0, error: 0 }
      );
   }, [voucherData]);
   
   const [viewRecord, setViewRecord] = useState<{
      entryNo: string;
      companyNo: number;
      vendorNo: number;
   } | null>(null);
   const [toaster, setToaster] = useState<{
      type: "success" | "error";
      message: string;
      description: string;
      visible: boolean;
   } | null>(null);
   const [showPostToPurchaseModal, setShowPostToPurchaseModal] =
      useState(false);
   const [purchaseJournalDate, setPurchaseJournalDate] = useState<string>("");
   const [cashDisbursementDate, setCashDisbursementDate] = useState<string>("");
   const [hasFreshApiData, setHasFreshApiData] = useState(false);
   const [showSuccessModal, setShowSuccessModal] = useState(false);

   const showToaster = (
      type: "success" | "error",
      title: string,
      description: string
   ) => {
      setToaster({ type, message: title, description, visible: true });
   };

   // Process LMS entries data when it changes
   useEffect(() => {
      if (lmsEntriesData && Array.isArray(lmsEntriesData)) {
         const transformedData: LmsEntryItem[] = lmsEntriesData.map(
            (item: any, index: number) => ({
               key: `${item.invoiceNo || index}-${index}`,
               entryNo: (item as any).entryNo || `${index}`,
                  invoiceNo: item.invoiceNo,
                  invoiceDate: item.invoiceDate,
               invoiceAmount: formatCurrency(item.invoiceAmount || 0),
                  discountDue: item.discountDueDate || "-",
                  vendorName: item.vendorName,
                  vendorNo: item.vendorNo,
                  orderNo: item.salesOrderNo,
                  companyNo: item.companyNo,
                  processType: item.processType,
               status: (item as any).status || "E",
               })
         );
         setVoucherData(transformedData);
         setHasFreshApiData(true);
      }
   }, [lmsEntriesData]);

   // Handle LMS entries error
   useEffect(() => {
      if (lmsEntriesError) {
         console.error("Failed to fetch LMS entries", lmsEntriesError);
         message.error("Failed to load LMS entries");
      }
   }, [lmsEntriesError]);

   // Handle edit voucher data
   useEffect(() => {
      if (editVoucherData) {
         navigate("create-new-entry", {
            state: { 
               mode: "edit", 
               entryData: editVoucherData, 
               processType: "ARGLMS" 
            },
         });
         setEditVoucherParams(null); // Reset after navigation
      }
   }, [editVoucherData, navigate]);

   // Handle edit voucher error
   useEffect(() => {
      if (editVoucherError) {
         console.error("Failed to fetch voucher for editing", editVoucherError);
         showToaster("error", "Error", "Failed to load voucher for editing");
         setEditVoucherParams(null); // Reset on error
      }
   }, [editVoucherError]);

   // Expose refresh method to parent
   useImperativeHandle(ref, () => ({
      refreshData: () => {
         refetchLmsEntries();
      }
   }));

   useEffect(() => {
      const state = location.state as unknown as {
         successMessage?: string;
         selectedProcessType?: string;
      } | null;
      if (state?.successMessage) {
         showToaster("success", "Success", state.successMessage);
         refetchLmsEntries();
         navigate(location.pathname, {
            replace: true,
            state: state?.selectedProcessType
               ? { selectedProcessType: state.selectedProcessType }
               : undefined,
         });
      }
   }, [location.state, location.pathname, navigate, refetchLmsEntries]);

   useEffect(() => {
      if (uploadStatusData?.summary) {
         const s = uploadStatusData.summary;
         setTotalInvoiceAmount(
            typeof s.totalAmount === "string"
               ? parseFloat(s.totalAmount.replace(/[$,]/g, ""))
               : Number(s.totalAmount) || 0
         );
         setTotalRecords(Number(s.totalUploads) || 0);
         // Refresh like SOGAS
         setHasFreshApiData(false);
         refetchLmsEntries();
      }
   }, [uploadStatusData, refetchLmsEntries]);
   const handleViewClick = (record: LmsEntryItem) => {
      setModalTitle(FLEXI_PROCESS_CONSTANTS.modalTitles.view);
      setViewRecord({
         entryNo: String(record.entryNo ?? ""),
         companyNo: Number(record.companyNo ?? 10),
         vendorNo: Number(record.vendorNo ?? 0),
      });
      setIsModalVisible(true);
   };

   const handleEditClick = (record: LmsEntryItem) => {
      // Set the edit parameters to trigger the useVoucherByEntryNo hook
      setEditVoucherParams({
               entryNo: String(record.entryNo),
         companyNo: String(record.companyNo ?? 10),
         vendorNo: String(record.vendorNo),
      });
   };

   const handleDeleteClick = (record: LmsEntryItem) => {
      setSelectedDeleteRecord(record);
      setShowDeleteModal(true);
   };

   const confirmDelete = async () => {
      if (!selectedDeleteRecord) return;

      try {
         await deleteVoucherMutation.mutateAsync({
            entryNo: Number(selectedDeleteRecord.entryNo),
            companyNo: Number(selectedDeleteRecord.companyNo ?? 10),
            vendorNo: Number(selectedDeleteRecord.vendorNo),
            invoiceNo: String(selectedDeleteRecord.invoiceNo ?? ""),
         });

            showToaster(
               "success",
               "Deleted",
               `Voucher entry ${String(
               selectedDeleteRecord.entryNo ?? ""
               )} deleted successfully.`
            );

         // Refresh the data
         refetchLmsEntries();
      } catch (error: any) {
         console.error("Delete error:", error);
         showToaster(
            "error",
            "Delete Error",
            error?.message || "Failed to delete voucher entry"
         );
      } finally {
         setShowDeleteModal(false);
         setSelectedDeleteRecord(null);
      }
   };

   const handlePostToPurchaseJournal = () => {
      const selectedEntries = voucherData.filter((entry) =>
         selectedRows.includes(entry.key)
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
         selectedRows.includes(entry.key)
      );
      // Check if ANY selected entry has a prepaid code
      const hasPrepaidCode = selectedEntries.some((entry) => {
         const prepaidCode = (entry as any).prepaidCode;
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
         selectedRows.includes(entry.key)
      );

      if (selectedEntries.length === 0) {
         showToaster("error", "Warning", "Please select at least one entry.");
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

         if (apiError) {
            if (apiError.message) {
               errorMessage = apiError.message;
            }

            // Use switch for cleaner error code handling
            switch (apiError.code) {
               case "NOT_FOUND":
                  errorMessage = apiError.message || "One or more voucher entries could not be found.";
                  break;
               case "VALIDATION_ERROR":
                  errorMessage = apiError.message || "Invalid data provided.";
                  errorTitle = "Validation Error";
                  break;
               case "SERVER_ERROR":
                  errorMessage = apiError.message || "A server error occurred while processing your request.";
                  break;
               case "FORBIDDEN":
                  errorMessage = apiError.message || "You don't have permission to post to purchase journal.";
                  errorTitle = "Access Denied";
                  break;
               case "CHECK_NOT_FOUND":
                  errorMessage = apiError.message || "Check number not found in the system.";
                  errorTitle = "Check Validation Error";
                  break;
               case "AMOUNT_MISMATCH":
                  errorMessage = apiError.message || "Check amount does not match the invoice amount.";
                  errorTitle = "Amount Validation Error";
                  break;
               case "BANK_GL_MISSING":
                  errorMessage = apiError.message || "Bank GL is required for prepaid entries.";
                  errorTitle = "Missing Required Field";
                  break;
               default:
                  break;
            }

            // Handle validation details if available
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
            : voucherData.map((entry) => entry.key)
      );
   };
   const columns: (ColumnType<LmsEntryItem> & { filterable?: boolean })[] = [
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
               checked={selectedRows.includes(record.key)}
               disabled={record.status === "E"}
               onChange={() => handleRowSelect(record.key)}
               aria-label={VOUCHER_ENTRY_COLUMN_LABELS.selectRowAria(record.key)}
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
                     onClick={() => handleDeleteClick(record)}
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
            const lowerStatus =
               typeof status === "string" ? status.toLowerCase() : "error";
            const statusIcons: { [key: string]: string } = {
               s: successStatusIcon,
               w: warningStatusIcon,
               e: alertStatusIcon,
            };
            const iconSrc = statusIcons[lowerStatus] || alertStatusIcon;

            return (
               <Tooltip title={lowerStatus}>
                  <img
                     src={iconSrc}
                     alt={lowerStatus}
                     style={{ width: 20, height: 20 }}
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
         render: (value: any) => formatCurrency(value),
         sorter: createInvoiceAmountSorter("invoiceAmount"),
      },
      {
         title: FLEXI_PROCESS_CONSTANTS.tableColumns.discountDue,
         dataIndex: "discountDue",
         key: "discountDue",
         ...getColumnSearchProps("discountDue", "Enter Discount Due", true),
         sorter: true,
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
         sorter: createNumericSorter("vendorNo"),
      },
      {
         title: FLEXI_PROCESS_CONSTANTS.tableColumns.orderNo,
         dataIndex: "orderNo",
         key: "orderNo",
         ...getColumnSearchProps("orderNo", "Search Order No"),
         sorter: createOrderNumberSorter("orderNo"),
      },
    
   ];

   return (
      <>
         <div className="content-card-body">
            <div className="flex-between">
               <div>
                  <h5>Batch Entries</h5>
                  <p className="sub-text p-m">Process Type - LMS</p>
               </div>
               <div className="action-buttons">
                  <CustomStyledButton
                     name="postToPurchaseJournal"
                     label={
                        <h5>{VOUCHER_ENTRY_TEXTS.postToPurchaseJournal}</h5>
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
                                 ? uploadStatusData.summary.totalAmount
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
                                 ? uploadStatusData.summary.totalUploads.toString()
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
                                 ? uploadStatusData.summary.countS.toString()
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
                                 ? uploadStatusData.summary.countW.toString()
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
                                 ? uploadStatusData.summary.countE.toString()
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
               <TableWidget<LmsEntryItem>
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
                     entryNo: viewRecord.entryNo,
                     companyNo: viewRecord.companyNo,
                     vendorNo: viewRecord.vendorNo,
                     key: String(viewRecord.entryNo),
                  })
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
            onConfirm={confirmDelete}
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
                  Voucher entries posted to purchase journal
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
                     refetchLmsEntries();
                     navigate(ROUTES.PURCHASE_JOURNAL);
                  },
               },
            ]}
            className="cne-modal descripition button-adjusted"
         />
      </>
   );
});

ReviewBatch.displayName = "ReviewBatch";

export default ReviewBatch;
