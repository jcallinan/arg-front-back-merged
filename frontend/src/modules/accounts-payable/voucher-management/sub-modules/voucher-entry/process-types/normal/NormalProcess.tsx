import React, { useState, useEffect } from "react";
import { Checkbox, Tooltip } from "antd";
import Toaster from "@widget-library/Toaster";
import type { ColumnType } from "antd/es/table";
import {
  MAX_STRING_LENGTH,
  VOUCHER_CONSTANTS,
  VOUCHER_ENTRY_TEXTS,
  VOUCHER_ENTRY_COLUMN_LABELS,
  VOUCHER_ENTRY_MESSAGES,
  VOUCHER_ENTRY_DATE_KEYS,
  ROUTES,
} from "@constants/commonConstants";
import { CustomStyledButton } from "@widget-library/Buttons";
import FileIcon from "@assets/icons/post-to-purchase-icon.svg";
import popupOk from "@assets/icons/popup-ok.svg";
// import successStatusIcon from "@assets/icons/success-status-icon.svg";
// import warningStatusIcon from "@assets/icons/warning-status-icon.svg";
// import alertStatusIcon from "@assets/icons/alert-status-icon.svg";
import TableWidget from "@widget-library/Table";

import type {
  NormalProcessProps,
  VoucherEntryUI,
} from "@type-definitions/accounts-payable.types";
import ViewVoucherModal from "./create-entry/ViewVoucherModal";
import PostToPurchaseJournalModal from "@shared-components/post-to-purchase-journel-modal/PostToPurchaseJournalModal";
import DeleteConfirmationModal from "@widget-library/DeleteConfirmationModal";
import ModalContent from "@widget-library/Modal";
import { useNavigate, useLocation } from "react-router-dom";
import {
  getHoldTypeLabel,
  formatCurrency,
} from "@utils/formatters";
import { getColumnSearchProps, createNumericFilter } from "@utils/tableFilters";
import "./create-entry/create-entry.scss";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { useNormalVoucherEntries } from "@hooks/useNormalProcess";
import { usePostToPurchaseJournal } from "@hooks/usePostToPurchaseJournal";
import { useDeleteVoucher } from "@hooks/useDeleteVoucher";
import { useVoucherByEntryNo } from "@hooks/useVoucherByEntryNo";
import { useQueryClient } from "@tanstack/react-query";
// import { checkMissedDiscount } from "@utils/discountValidation";
import { formatNumberToMMDDYY } from "@utils/dateFormat";
import {
   createNumericSorter,
   createInvoiceAmountSorter,
   createCustomDateSorter,
} from "@utils/sortingUtils";

const keyMap: Record<string, keyof VoucherEntryUI> = {
  "Vendor Name": "vendorName",
  "Vendor No": "vendorNo",
  "Invoice No": "invoiceNo",
  "Invoice Amount": "invoiceAmount",
  "Invoice Date": "invoiceDate",
  "Invoice Due": "dueDate",
  "Discount Due": "discountDueDate",
  "Hold Type": "holdCode",
};

const NormalProcess: React.FC<NormalProcessProps> = ({ selectedCompany }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [voucherData, setVoucherData] = useState<VoucherEntryUI[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [viewRecord, setViewRecord] = useState<{
    entryNo: string;
    companyNo: number;
    vendorNo: number;
  } | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [purchaseJournalDate, setPurchaseJournalDate] = useState("");
  const [cashDisbursementDate, setCashDisbursementDate] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDeleteRecord, setSelectedDeleteRecord] = useState<{
    entryNo: number;
    companyNo: number;
    vendorNo: number;
    invoiceNo: string;
  } | null>(null);

  // Success modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Toaster state
  const [toasterType, setToasterType] = useState<
    "success" | "error" | "warning"
  >("success");
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterDescription, setToasterDescription] = useState("");

  // React Query hooks
  const {
    data: voucherEntriesData,
    isLoading,
    isError,
    refetch: refetchVoucherEntries,
  } = useNormalVoucherEntries(selectedCompany);

  const [editVoucherParams, setEditVoucherParams] = useState<{
    entryNo: string;
    companyNo: number;
    vendorNo: number;
  } | null>(null);

  const {
    data: editVoucherData,
    error: editVoucherError,
  } = useVoucherByEntryNo({
    entryNo: editVoucherParams?.entryNo || "",
    companyNo: editVoucherParams?.companyNo?.toString() || "",
    vendorNo: editVoucherParams?.vendorNo?.toString() || "",
    enabled: !!editVoucherParams,
  });

  const deleteVoucherMutation = useDeleteVoucher();
  const postToPurchaseJournalMutation = usePostToPurchaseJournal();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isError) {
      setToasterType("error");
      setToasterMessage("Error");
      setToasterDescription("Failed to fetch voucher entry data");
    }
  }, [isError]);

  // Process voucher entries data
  useEffect(() => {
    if (voucherEntriesData && voucherEntriesData.length === 0) {
      setToasterType("warning");
      setToasterMessage("Warning");
      setToasterDescription("No voucher entry data found");
    }
  }, [voucherEntriesData]);

  useEffect(() => {
    if (voucherEntriesData && Array.isArray(voucherEntriesData)) {
      // Transform the data to match VoucherEntryUI interface
      const transformedData: VoucherEntryUI[] = voucherEntriesData.map((item: any, index: number) => ({
        key: item.entryNo?.toString() || `${index}`,
        entryNo: item.entryNo || 0,
        vendorNo: item.vendorNo || "",
        vendorName: item.vendorName || "",
        invoiceNo: item.invoiceNo || "",
        invoiceAmount: item.invoiceAmount || 0,
        invoiceDate: item.invoiceDate || "",
        dueDate: item.dueDate || "",
        holdCode: item.holdCode || "",
        companyNo: item.companyNo || 0,
        prepaidCode: item.prepaidCode || "",
        // Add all required fields from VoucherEntryUI interface
        discountDue: item.discountDue || "",
        status: item.status || "",
        entrySequence: item.entrySequence || 0,
        discountDueDate: item.discountDueDate || "",
        holdDesc: item.holdDesc || "",
        canceledVoucher: item.canceledVoucher || 0,
        apGlNo: item.apGlNo || 0,
        invoiceDesc: item.invoiceDesc || "",
        singleCheck: item.singleCheck || "",
        prepaidCheckNo: item.prepaidCheckNo || 0,
        vendorAdd1: item.vendorAdd1 || "",
        vendorAdd2: item.vendorAdd2 || "",
        vendorAdd3: item.vendorAdd3 || "",
        vendorAdd4: item.vendorAdd4 || "",
        bankGl: item.bankGl || 0,
        retentionGl: item.retentionGl || 0,
        retentionPct: item.retentionPct || 0,
        prepaidCheckdate: item.prepaidCheckdate || 0,
        salesOrderNo: item.salesOrderNo || 0,
        srn: item.srn || 0,
        carrierId: item.carrierId || "",
        vendorPaymentTerms: item.vendorPaymentTerms || 0,
        processType: item.processType || "NORMAL",
        extendedDiscountDueDate: item.extendedDiscountDueDate || 0,
        checkNo: item.checkNo || "",
      }));
      setVoucherData(transformedData);
    }
  }, [voucherEntriesData]);

  // Handle edit voucher data
  useEffect(() => {
    if (editVoucherData) {
      navigate("create-new-entry", {
        state: {
          mode: "edit",
          entryData: editVoucherData,
          processType: "NORMAL",
        },
      });
      setEditVoucherParams(null); // Reset after navigation
    }
  }, [editVoucherData, navigate]);

  // Handle edit voucher error
  useEffect(() => {
    if (editVoucherError) {
      console.error("Failed to fetch voucher for editing", editVoucherError);
      setToasterType("error");
      setToasterMessage("Error");
      setToasterDescription("Failed to load voucher details for editing.");
      setEditVoucherParams(null); // Reset on error
    }
  }, [editVoucherError]);

  // Handle success message and invalidate queries on navigation
  useEffect(() => {
    if (location.state?.successMessage) {
      queryClient.invalidateQueries({
        queryKey: ["voucher-entry", selectedCompany],
      });
      navigate(location.pathname, {
        replace: true,
        state: { selectedProcessType: location.state.selectedProcessType },
      });
    }
  }, [location.state, navigate, queryClient, selectedCompany]);
  // Handle success message and invalidate queries on navigation
  useEffect(() => {
    if (location.state?.successMessage) {
      queryClient.invalidateQueries({
        queryKey: ["voucher-entry", selectedCompany],
      });
      navigate(location.pathname, {
        replace: true,
        state: { selectedProcessType: location.state.selectedProcessType },
      });
    }
  }, [location.state, navigate, queryClient, selectedCompany]);

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

  const handleViewClick = (record: any) => {
    setModalTitle("Voucher Details");
    setViewRecord({
      entryNo: record.entryNo,
      companyNo: record.companyNo,
      vendorNo: record.vendorNo,
    });
    setIsModalVisible(true);
  };

  const handleEditClick = (record: any) => {
    // Set the edit parameters to trigger the useVoucherByEntryNo hook
    setEditVoucherParams({
      entryNo: String(record.entryNo),
      companyNo: record.companyNo,
      vendorNo: record.vendorNo,
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

  const handleDeleteClick = async (
    entryNo: number,
    companyNo: number,
    vendorNo: number,
    invoiceNo: string
  ) => {
    try {
      // Maintain exact same payload structure as original
      await deleteVoucherMutation.mutateAsync({
        entryNo,
        companyNo,
        vendorNo,
        invoiceNo,
      });

      setToasterType("success");
      setToasterMessage("Success");
      setToasterDescription(VOUCHER_ENTRY_MESSAGES.deleteSuccess);
      
      // Refresh the data
      refetchVoucherEntries();
    } catch (error: any) {
      console.error("Delete error:", error);
      
      let errorTitle = "Error";
      let errorMessage = VOUCHER_ENTRY_MESSAGES.deleteError;
      
      if (error?.response?.data?.error) {
        const apiError = error.response.data.error;
        errorMessage = apiError.message;
        
        // Show validation details if available
        if (apiError.details && apiError.details.length > 0) {
          const validationErrors = apiError.details
            .map((detail: any) => `${detail.field}: ${detail.message}`)
            .join(", ");
          errorMessage = validationErrors;
        }
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setToasterType("error");
      setToasterMessage(errorTitle);
      setToasterDescription(errorMessage);
    }
  };

  const columns: ColumnType<any>[] = [
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
      render: (_, { key }) => (
        <Checkbox
          checked={selectedRows.includes(key)}
          onChange={() => handleRowSelect(key)}
          aria-label={VOUCHER_ENTRY_COLUMN_LABELS.selectRowAria(key)}
        />
      ),
    },
    {
      title: VOUCHER_ENTRY_COLUMN_LABELS.actions,
      dataIndex: "",
      fixed: "left",
      render: (_, record) => (
        <div className="action-icons flex-align">
          <Tooltip
            title={VOUCHER_ENTRY_COLUMN_LABELS.viewTooltip}
            className="table-tooltip action-tooltip point-cursor"
          >
            <EyeOutlined
              className="action-icon"
              onClick={() => handleViewClick(record)}
            />
          </Tooltip>
          <Tooltip
            title={VOUCHER_ENTRY_COLUMN_LABELS.editTooltip}
            className="table-tooltip action-tooltip point-cursor"
          >
            <EditOutlined
              className="action-icon"
              onClick={() => handleEditClick(record)}
            />
          </Tooltip>
          <Tooltip
            title={VOUCHER_ENTRY_COLUMN_LABELS.deleteTooltip}
            className="table-tooltip action-tooltip point-cursor"
          >
            <DeleteOutlined
              className="action-icon"
              onClick={() => {
                setSelectedDeleteRecord({
                  entryNo: record.entryNo,
                  companyNo: record.companyNo,
                  vendorNo: record.vendorNo,
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
      title: VOUCHER_ENTRY_COLUMN_LABELS.entryNo,
      dataIndex: "entryNo",
      key: "entryNo",
      sorter: createNumericSorter("entryNo"),
      ...createNumericFilter("entryNo", "Enter Entry No"),
      render: (entryNo: number | string) => {
        const stringText = entryNo?.toString() || "";
        return stringText.length > MAX_STRING_LENGTH ? (
          <Tooltip title={stringText} className="table-tooltip">
            <span>{stringText}</span>
          </Tooltip>
        ) : (
          <span>{stringText}</span>
        );
      },
    },
    ...Object.entries(keyMap)
      .filter(([label]) => label !== "Process Type")
      .map(([label, key]) => {
        const typedKey = key as any;
        const isRightAligned =
          typedKey === "invoiceAmount" ||
          typedKey === "dueDate" ||
          typedKey === "discountDueDate" ||
          typedKey === "invoiceDate";

        const column: ColumnType<any> = {
          title: label,
          dataIndex: typedKey,
          key: typedKey,
          align: isRightAligned ? "right" : "left",
          // Use appropriate filter type based on field
          ...(typedKey === "invoiceAmount"
            ? getColumnSearchProps(typedKey, `Enter ${label}`, true)
            : typedKey === "vendorNo"
            ? createNumericFilter(typedKey, `Enter ${label}`)
            : getColumnSearchProps(typedKey, `Search ${label}`)),
          render: (text: string | number, _record: any) => {
            let displayText = text?.toString() || "";

            if (typedKey === "holdCode") {
              displayText = getHoldTypeLabel(text as string);
            }

            // For discount due date, check if it contains a valid discount date
            if (typedKey === "discountDueDate") {
              // If discount due date is empty, null, undefined, "0", "00", "000000", or any variation of zeros
              if (
                !displayText ||
                displayText === "0" ||
                displayText === "00" ||
                displayText === "000000" ||
                displayText.trim() === "" ||
                /^0+$/.test(displayText.trim())
              ) {
                return <span>-</span>;
              }
            }

            if (VOUCHER_ENTRY_DATE_KEYS.includes(typedKey)) {
              if (displayText.length === 5 || displayText.length === 6) {
                const padded = displayText.padStart(6, "0");
                const day = padded.substring(0, 2);
                const month = padded.substring(2, 4);
                const year = padded.substring(4, 6);
                displayText = `${month}/${day}/${year}`;
              }
            }

            if (typedKey === "invoiceAmount") {
              displayText = formatCurrency(displayText);
            }


            return displayText.length > MAX_STRING_LENGTH ? (
              <Tooltip title={displayText} className="table-tooltip">
                <span>{displayText}</span>
              </Tooltip>
            ) : (
              <span>{displayText}</span>
            );
          },
        };

        // Add sorter for specific fields
        if (typedKey === "invoiceAmount") {
          column.sorter = createInvoiceAmountSorter(typedKey);
        } else if (VOUCHER_ENTRY_DATE_KEYS.includes(typedKey)) {
          column.sorter = createCustomDateSorter(typedKey);
                } else if (typedKey === "vendorNo") {
           column.sorter = createNumericSorter(typedKey);
        } else if (typeof typedKey === "string") {
          column.sorter = (a, b) => {
            const valA = a[typedKey]?.toString().toLowerCase() || "";
            const valB = b[typedKey]?.toString().toLowerCase() || "";
            return valA.localeCompare(valB);
          };
        }

        return column;
      }),
  ];
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
      setToasterType("error");
      setToasterMessage("Error");
      setToasterDescription("Please select a Purchase Journal Date.");
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

    try {
      // Build payload with prepaid fields for different scenarios
      const payload = {
        entries: selectedEntries.map((entry) => {
          const baseEntry = {
            invoiceNo: entry.invoiceNo,
            companyNo: 10,
            vendorNo: Number(entry.vendorNo),
            entryNo: entry.entryNo,
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

      await postToPurchaseJournalMutation.mutateAsync(payload);

      setSelectedRows([]);
      setIsPostModalOpen(false);
      setPurchaseJournalDate("");
      setCashDisbursementDate("");
      setShowSuccessModal(true);
    } catch (err: any) {
      console.error("Error posting to purchase journal:", err);
      
      let errorTitle = "Error";
      let errorMessage = "Something went wrong while posting.";
      
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
        if (err?.response?.data?.error) {
          apiError = err.response.data.error;
        } else if (err?.response?.data?.message) {
          apiError = { message: err.response.data.message };
        } else if (err?.error?.error) {
          apiError = err.error.error;
        } else if (err?.error) {
          apiError = err.error;
        } else if (err?.data?.error) {
          apiError = err.data.error;
        } else if (err?.message) {
          apiError = { message: err.message };
        }
      }


        if (apiError) {
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
              break;
          }

          if (apiError.details && Array.isArray(apiError.details) && apiError.details.length > 0) {
            const validationErrors = apiError.details
              .map((detail: any) => `• ${detail.field}: ${detail.message}`)
              .join("\n");
            errorMessage = validationErrors;
            errorTitle = "Validation Errors";
          }
        }
      
      setToasterType("error");
      setToasterMessage(errorTitle);
      setToasterDescription(errorMessage);
    }
  };

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
      <div className="content-card-body">
        <div className="flex-between">
          <div>
            <h4>{VOUCHER_CONSTANTS.apVoucherEntryTitle}</h4>
            <p className="p-xs process-type">
              {VOUCHER_ENTRY_TEXTS.processTypeText}
            </p>
          </div>
          <div className="action-buttons">
            <CustomStyledButton
              name="postToPurchaseJournal"
              label={<h6>{VOUCHER_ENTRY_TEXTS.postToPurchaseJournal}</h6>}
              onClick={handlePostToPurchaseJournal}
              icon={
                <img
                  src={FileIcon}
                  alt={VOUCHER_ENTRY_COLUMN_LABELS.fileAlt}
                  className="file-icon"
                />
              }
            />
          </div>
        </div>
        <div className="table-responsive-container centered-header">
          <TableWidget
            columns={columns}
            dataSource={voucherData}
            rowKey="key"
            loading={isLoading}
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

      {selectedDeleteRecord && (
        <DeleteConfirmationModal
          visible={showDeleteModal}
          onCancel={() => {
            setShowDeleteModal(false);
            setSelectedDeleteRecord(null);
          }}
          onConfirm={async () => {
            await handleDeleteClick(
              selectedDeleteRecord.entryNo,
              selectedDeleteRecord.companyNo,
              selectedDeleteRecord.vendorNo,
              selectedDeleteRecord.invoiceNo
            );

            setShowDeleteModal(false);
            setSelectedDeleteRecord(null);
          }}
          itemName={"Voucher Entry"}
        />
      )}

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
        onCancel={() => {
          setIsPostModalOpen(false);
          setPurchaseJournalDate("");
          setCashDisbursementDate("");
        }}
        showCloseIcon={false}
        imageUrl={popupOk}
        actions={[
          {
            name: "ok",
            label: "Ok",
            onClick: () => {
              setShowSuccessModal(false);
              navigate(ROUTES.PURCHASE_JOURNAL);
            },
          },
        ]}
        className="cne-modal descripition button-adjusted"
      />
    </>
  );
};

export default NormalProcess;
