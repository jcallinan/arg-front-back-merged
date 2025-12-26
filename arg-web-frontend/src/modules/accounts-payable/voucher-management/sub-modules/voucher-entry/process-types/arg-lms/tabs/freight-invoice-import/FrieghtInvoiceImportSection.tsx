import { formatCurrency } from "../../../../../../../../../utils/formatters";
import { useEffect, useMemo, useState, forwardRef, useImperativeHandle } from "react";
import "./freight.scss";
import { Checkbox } from "antd";
import TableWidget from "../../../../../../../../../widget-library/Table";
import Card from "../../../../../../../../../widget-library/Card";
import { CustomStyledButton } from "../../../../../../../../../widget-library/Buttons";
import companyIcon from "../../../../../../../../../assets/icons/company-icon.svg";
import invoiceAmountIcon from "../../../../../../../../../assets/icons/invoice-amount-icon.svg";
import plusIcon from "../../../../../../../../../assets/icons/plus-icon.svg";
import type {
  CustomTableColumnsType,
  FrieghtInvoiceImportSectionProps,
} from "../../../../../../../../../types/accounts-payable.types";
import { VOUCHER_ENTRY_COLUMN_LABELS } from "@/constants/commonConstants";
import {
  createTextSorter,
  createInvoiceNumberSafeSorter,
  createReportDateTimeSorter,
  createInvoiceAmountSorter,
  createNumericSorter,
} from "@/utils/sortingUtils";
import { getColumnSearchProps, createNumericFilter } from "@/utils/tableFilters";
import { useLmsCarrierInvoices, useLmsBatchCreate } from "@hooks/useLmsProcess";
import ActionPermissionGuard from "@shared-components/permissions/ActionPermissionGuard";

const FrieghtInvoiceImportSection = forwardRef<
  { refreshData: () => void },
  FrieghtInvoiceImportSectionProps
>(({ showToaster, onBatchSuccess, isProcessing }, ref) => {
  const [data, setData] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // React Query hooks
  const {
    data: lmsCarrierInvoicesData,
    isLoading,
    error: lmsCarrierInvoicesError,
    refetch: refetchLmsCarrierInvoices,
  } = useLmsCarrierInvoices(10);

  const lmsBatchCreateMutation = useLmsBatchCreate();

  // Process LMS carrier invoices data when it changes
  useEffect(() => {
    if (lmsCarrierInvoicesData && Array.isArray(lmsCarrierInvoicesData)) {
      const transformedData: any[] =
        lmsCarrierInvoicesData.map((item: any, index) => ({
          key: `${item.carrierInvoiceNo || index}`,
          carrierId: item.carrierId,
          
          carrierInvoiceNo: item.carrierInvoiceNo || "-",
          orderShipDate: item.ordShipDate,
          invoiceDate: item.invoiceDate || "",
          invType: item.invoiceType || "-",
          orderNo: item.ourOrderNo || "-",
          shipRef: item.shippingReferenceNo || "-",
          invoiceAmount: formatCurrency(Number(item.invoiceAmount || 0)),
        }));
      setData(transformedData);
    }
  }, [lmsCarrierInvoicesData]);

  // Handle LMS carrier invoices error
  useEffect(() => {
    if (lmsCarrierInvoicesError) {
      console.error("Failed to fetch LMS carrier invoices", lmsCarrierInvoicesError);
      showToaster("error", "Load Failed", "Failed to load LMS carrier invoices");
    }
  }, [lmsCarrierInvoicesError, showToaster]);

  // Expose refresh method to parent
  useImperativeHandle(ref, () => ({
    refreshData: () => {
      refetchLmsCarrierInvoices();
    }
  }));

  // Get total amount for selected rows only
  const getTotalAmount = () => {
    const selectedData = data.filter((item) => selectedRows.includes(item.key));
    return selectedData.reduce((sum, item) => {
      const numeric =
        typeof item.invoiceAmount === "string"
          ? Number(item.invoiceAmount.replace(/[$,]/g, ""))
          : Number(item.invoiceAmount || 0);
      return sum + (isNaN(numeric) ? 0 : numeric);
    }, 0);
  };

  // Row selection handlers
  const handleRowSelect = (key: string) => {
    setSelectedRows((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleSelectAllRows = () => {
    setSelectedRows(
      selectedRows.length === data.length ? [] : data.map((entry) => entry.key)
    );
  };

  const pagination = useMemo(
    () => ({
      total: data.length,
      pageSize: 10,
      showTotal: (total: number) => `Total ${total} items`,
      showSizeChanger: true,
      showQuickJumper: true,
    }),
    [data.length]
  );

  const handleCreateBatch = async () => {
    // Check if any rows are selected
    if (selectedRows.length === 0) {
      showToaster(
        "error",
        "No Records Selected",
        "Please select at least one invoice to create a batch."
      );
      return;
    }

    try {
      // Show processing toaster
      showToaster(
        "batch",
        "Batch Processing",
        "The selected records are being processed."
      );

      // Get selected data and transform it for the API
      const selectedData = data.filter((item) =>
        selectedRows.includes(item.key)
      );

      // Helper function to format date to MMDDYY
      const formatDateToMMDDYY = (dateString: string) => {
        if (!dateString) return "";
        try {
          const date = new Date(dateString);
          if (isNaN(date.getTime())) return dateString; // Return original if invalid date

          const month = (date.getMonth() + 1).toString().padStart(2, "0");
          const day = date.getDate().toString().padStart(2, "0");
          const year = date.getFullYear().toString().slice(-2);

          return `${month}${day}${year}`;
        } catch (error) {
          console.error("Date formatting error:", error);
          return dateString; // Return original if error
        }
      };

      const payload = {
        companyNo: 10,
        processType: "LMS",
        invoices: selectedData.map((item: any) => ({
          carrierId: item.carrierId || "",
          carrierInvoiceNo: item.carrierInvoiceNo || "",
          ordShipDate: formatDateToMMDDYY(item.orderShipDate || ""),
          invoiceType: item.invType || "",
          ourOrderNo: Number(item.orderNo) || 0,
          shippingReferenceNo: Number(item.shipRef) || 0,
          invoiceAmount: parseFloat(item.invoiceAmount.replace(/[$,]/g, "")),
          invoiceDate: formatDateToMMDDYY(item.invoiceDate || ""),
          companyNo: 10,
        })),
      };

      const response = await lmsBatchCreateMutation.mutateAsync(payload);
      setSelectedRows([]);

      // Extract API success message robustly from Response or JSON-like object
      const extractApiMessage = async (resp: any, defaultMsg: string) => {
        try {
          if (resp && typeof resp.json === "function") {
            const parsed = await resp.json();
            return parsed?.items?.message || parsed?.message || defaultMsg;
          }
          const r = resp as any;
          return (
            r?.data?.items?.message ||
            r?.data?.message ||
            r?.items?.message ||
            r?.message ||
            defaultMsg
          );
        } catch {
          return defaultMsg;
        }
      };
      const apiMessage = await extractApiMessage(
        response as any,
        "Batch has been created successfully."
      );
      onBatchSuccess(apiMessage);
    } catch (error: any) {
      console.error("Failed to create batch:", error);

      let errorMessage = "Failed to create batch";

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

      showToaster("error", "Batch Creation Failed", errorMessage);
    }
  };

  const columns: CustomTableColumnsType<any> = [
    {
      title: (
        <Checkbox
          disabled={Boolean(isProcessing || lmsBatchCreateMutation.isPending)}
          onChange={handleSelectAllRows}
          checked={selectedRows.length === data.length}
          aria-label={VOUCHER_ENTRY_COLUMN_LABELS.selectAllAria}
        />
      ),
      dataIndex: "",
      fixed: "left",
      render: (_, { key }) => (
        <Checkbox
          disabled={Boolean(isProcessing || lmsBatchCreateMutation.isPending)}
          checked={selectedRows.includes(key)}
          onChange={() => handleRowSelect(key)}
          aria-label={VOUCHER_ENTRY_COLUMN_LABELS.selectRowAria(key)}
        />
      ),
    },
    {
      title: "Carrier ID",
      dataIndex: "carrierId",
      ...getColumnSearchProps("carrierId", "Search Carrier ID"),
      sorter: createTextSorter("carrierId"),
    },
    {
      title: "Carrier Invoice",
      dataIndex: "carrierInvoiceNo",
      ...getColumnSearchProps("carrierInvoiceNo", "Search Carrier Invoice"),
      sorter: createInvoiceNumberSafeSorter("carrierInvoiceNo"),
    },
    {
      title: "Ord Ship Date",
      dataIndex: "orderShipDate",
      ...getColumnSearchProps("orderShipDate", "Search Ship Date"),
      sorter: createReportDateTimeSorter("orderShipDate"),
    },
    {
      title: "Invoice Date",
      dataIndex: "invoiceDate",
      ...getColumnSearchProps("invoiceDate", "Search Invoice Date"),
      sorter: createReportDateTimeSorter("invoiceDate"),
    },
    {
      title: "INV type",
      dataIndex: "invType",
      ...getColumnSearchProps("invType", "Search Invoice Type"),
      sorter: createTextSorter("invType"),
    },
    {
      title: "Order #",
      dataIndex: "orderNo",
      ...createNumericFilter("orderNo", "Enter Order No"),
      sorter: createNumericSorter("orderNo"),
    },
    {
      title: "Shp Ref",
      dataIndex: "shipRef",
      ...createNumericFilter("shipRef", "Enter Shipping Ref"),
      sorter: createTextSorter("shipRef"),
    },
    {
      title: "Invoice Amount",
      dataIndex: "invoiceAmount",
      ...getColumnSearchProps("invoiceAmount", "Enter Invoice Amount", true),
      sorter: createInvoiceAmountSorter("invoiceAmount"),
    },
  ];

  return (
    <div className="content-card-body">
      <div className="arg-entries-div flex-between">
        <div>
          <h4>Entries</h4>
          <p className="sub-text p-m">Process Type - LMS</p>
        </div>
        <div className="action-buttons">
          <ActionPermissionGuard actionId="voucher-entry.lms.create-batch">
            <CustomStyledButton
              name="postToPurchaseJournal"
              label={
                lmsBatchCreateMutation.isPending
                  ? "Creating Batch..."
                  : "Create Batch"
              }
              onClick={handleCreateBatch}
              disabled={Boolean(
                lmsBatchCreateMutation.isPending || isProcessing
              )}
              icon={<img src={plusIcon} alt="plus" className="plus-icon" />}
            />
          </ActionPermissionGuard>
        </div>
      </div>

      <div className="card-container ">
        <div className="card-flex-2 height-100 ">
          <Card
            icon={<img src={companyIcon} alt="Company Name" />}
            label="Company Name"
            value="A.R.G. BRADFORD DIVISION"
          />
        </div>
        <div className="card-flex-1  height-100 ">
          <Card
            icon={<img src={companyIcon} alt="Company No" />}
            label="Company No"
            value={10}
          />
        </div>
        <div className="card-flex-1  height-100 ">
          <Card
            icon={<img src={invoiceAmountIcon} alt="Selected Total" />}
            label="Selected Total"
            value={formatCurrency(getTotalAmount())}
          />
        </div>
      </div>
      <div className="content-card-body table-responsive-container">
        <TableWidget
          columns={columns}
          dataSource={data}
          rowKey="key"
          pagination={pagination}
          loading={Boolean(isLoading || isProcessing || lmsBatchCreateMutation.isPending)}
        />
      </div>
    </div>
  );
});

FrieghtInvoiceImportSection.displayName = "FrieghtInvoiceImportSection";

export default FrieghtInvoiceImportSection;
