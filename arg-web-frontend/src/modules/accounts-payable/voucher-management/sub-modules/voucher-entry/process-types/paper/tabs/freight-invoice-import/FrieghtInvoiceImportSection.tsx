import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { CustomStyledButton } from "../../../../../../../../../widget-library/Buttons";
import Card from "../../../../../../../../../widget-library/Card";
import TableWidget from "../../../../../../../../../widget-library/Table";
import invoiceAmountIcon from "../../../../../../../../../assets/icons/invoice-amount-icon.svg";
import companyIcon from "../../../../../../../../../assets/icons/company-icon.svg";
import plusIcon from "../../../../../../../../../assets/icons/plus-icon.svg";

import "./freight.scss";
import type {
   DataType,
   CustomColumnType,
} from "../../../../../../../../../types/accounts-payable.types";
import { formatCurrency } from "../../../../../../../../../utils/formatters";
import {
   MENU_LABELS,
   VOUCHER_ENTRY_COLUMN_LABELS,
} from "../../../../../../../../../constants/commonConstants";
import { Checkbox } from "antd";
import {
   createTextSorter,
   createInvoiceNumberSafeSorter,
   createReportDateTimeSorter,
   createNumericSorter,
   createInvoiceAmountSorter,
} from "@/utils/sortingUtils";
import {
   getColumnSearchProps,
   createNumericFilter,
} from "@/utils/tableFilters";
import { useCarrierInvoices, usePaperBatchCreate } from "@hooks/usePaperProcess";
import ActionPermissionGuard from "@shared-components/permissions/ActionPermissionGuard";

interface FrieghtInvoiceImportSectionProps {
   showToaster: (
      type: "error" | "success" | "warning" | "batch",
      title: string,
      subtitle: string
   ) => void;
   onBatchSuccess: (message: string) => void;
  isProcessing?: boolean;
}

const FrieghtInvoiceImportSection = forwardRef<
   { refreshData: () => void },
   FrieghtInvoiceImportSectionProps
>(({ showToaster, onBatchSuccess, isProcessing }, ref) => {
   const [selectedRows, setSelectedRows] = useState<string[]>([]);
   const [totalAmount, setTotalAmount] = useState(0);
   const [filteredData, setFilteredData] = useState<any[]>([]);
   const [data, setData] = useState<any>([]);

   // React Query hooks
   const {
      data: carrierInvoicesData,
      isLoading,
      error: carrierInvoicesError,
      refetch: refetchCarrierInvoices,
   } = useCarrierInvoices(10);

   const paperBatchCreateMutation = usePaperBatchCreate();

   // Expose refresh method to parent
   useImperativeHandle(ref, () => ({
      refreshData: () => {
         refetchCarrierInvoices();
      },
   }));

   // Process carrier invoices data when it changes
   useEffect(() => {
      if (carrierInvoicesData && Array.isArray(carrierInvoicesData)) {
         const itemsWithKeys = carrierInvoicesData.map((item: any, index: number) => ({
            ...item,
            key: item.entryNo?.toString() || `${index}`,
            invoiceAmount: formatCurrency(item.invoiceAmount),
         }));

         setData(itemsWithKeys);
         setFilteredData(itemsWithKeys);
         setTotalAmount(0); // Initialize with 0 since no rows are selected
      }
   }, [carrierInvoicesData]);

   // Handle errors from React Query
   useEffect(() => {
      if (carrierInvoicesError) {
         console.error("Failed to fetch carrier invoices", carrierInvoicesError);
         let errorMessage = "Failed to load Paper entries";

         const apiError = (carrierInvoicesError as any)?.error?.error ||
            (carrierInvoicesError as any)?.error ||
            (carrierInvoicesError as any)?.response?.data?.error ||
            (carrierInvoicesError as any)?.data?.error ||
            carrierInvoicesError;

         if (apiError && (apiError.code || apiError.message)) {
            if (apiError?.code === "NOT_FOUND") {
               errorMessage = apiError.message || "No paper entries found.";
            } else if (apiError?.code === "VALIDATION_ERROR") {
               errorMessage = apiError.message || "Invalid data provided.";
            } else if (apiError?.message) {
               errorMessage = apiError.message;
            }
         }

         showToaster("error", "Load Failed", errorMessage);
      }
   }, [carrierInvoicesError, showToaster]);

   // Data will be fetched automatically by React Query hooks

   const calculateSelectedTotal = (selectedKeys: string[], data: any[]) => {
      return data
         .filter((item) => selectedKeys.includes(item.key))
         .reduce((sum, item) => {
            const amt =
               typeof item.invoiceAmount === "string"
                  ? parseFloat(item.invoiceAmount.replace(/[$,]/g, ""))
                  : Number(item.invoiceAmount);
            return sum + (isNaN(amt) ? 0 : amt);
         }, 0);
   };

   const handleTableChange = (filters: any) => {
      let filtered = [...data];
      if (filters) {
         Object.keys(filters).forEach((key) => {
            if (filters[key]?.length > 0) {
               filtered = filtered.filter((item) =>
                  String(item[key as keyof DataType] || "")
                     .toLowerCase()
                     .includes(filters[key][0].toLowerCase())
               );
            }
         });
      }
      setFilteredData(filtered);
      setTotalAmount(calculateSelectedTotal(selectedRows, filtered));
   };

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
         const selectedData = filteredData.filter((item) =>
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
            processType: "PAPER",
            invoices: selectedData.map((item: any) => ({
               carrierId: item.carrierId || "",
               carrierInvoiceNo: item.carrierInvoiceNo || "",
               ordShipDate: formatDateToMMDDYY(item.ordShipDate || ""),
               invoiceType: "PAPER",
               ourOrderNo: Number(item.ourOrderNo) || 0,
               shippingReferenceNo: Number(item.shippingReferenceNo) || 0,
               invoiceAmount: parseFloat(item.invoiceAmount.replace(/[$,]/g, "")),
               invoiceDate: formatDateToMMDDYY(item.invoiceDate || ""),
               companyNo: 10,
            })),
         };

         const response = await paperBatchCreateMutation.mutateAsync(payload);
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
         console.error("Failed to create Paper batch:", error);

         // Map specific API error responses
         let errorMessage = "Failed to create batch";

         // Check if it's a structured API error response - try multiple nested paths
         const apiError =
            error?.error?.error ||
            error?.error ||
            error?.response?.data?.error ||
            error?.data?.error ||
            error;

         if (apiError && (apiError.code || apiError.message)) {
            if (apiError?.code === "NOT_FOUND") {
               if (apiError?.details && Array.isArray(apiError.details)) {
                  const fieldError = apiError.details[0];
                  if (fieldError && fieldError.message) {
                     errorMessage = fieldError.message;
                  } else {
                     errorMessage =
                        apiError.message || "No data found to create batch.";
                  }
               } else {
                  errorMessage =
                     apiError.message || "No data found to create batch.";
               }
            } else if (apiError?.code === "VALIDATION_ERROR") {
               if (apiError?.details && Array.isArray(apiError.details)) {
                  const fieldErrors = apiError.details
                     .map((detail: any) => `${detail.field}: ${detail.message}`)
                     .join(", ");
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

         showToaster("error", "Batch Creation Failed", errorMessage);
      }
   };
   const handleRowSelect = (key: string) => {
      const newSelectedRows = selectedRows.includes(key)
         ? selectedRows.filter((k) => k !== key)
         : [...selectedRows, key];
      setSelectedRows(newSelectedRows);
      setTotalAmount(calculateSelectedTotal(newSelectedRows, filteredData));
   };

   const handleSelectAllRows = () => {
      const newSelectedRows =
         selectedRows.length === filteredData.length
            ? []
            : filteredData.map((entry) => entry.key);
      setSelectedRows(newSelectedRows);
      setTotalAmount(calculateSelectedTotal(newSelectedRows, filteredData));
   };

   const columns: CustomColumnType<any>[] = [
      {
         title: (
            <Checkbox
               onChange={handleSelectAllRows}
               checked={selectedRows.length === filteredData.length}
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
         title: "Carrier ID",
         dataIndex: "carrierId",
         key: "carrierId",
         ...getColumnSearchProps("carrierId", "Search Carrier ID"),
         sorter: createTextSorter("carrierId"),
         align: "left",
      },
      {
         title: "Carrier Invoice",
         dataIndex: "carrierInvoiceNo",
         key: "carrierInvoiceNo",
         ...getColumnSearchProps("carrierInvoiceNo", "Search Carrier Invoice"),
         sorter: createInvoiceNumberSafeSorter("carrierInvoiceNo"),
         align: "left",
      },
      {
         title: "Ord Ship Date",
         dataIndex: "ordShipDate",
         key: "ordShipDate",
         ...getColumnSearchProps("ordShipDate", "Search Ship Date"),
         sorter: createReportDateTimeSorter("ordShipDate"),
         align: "left",
      },
      {
         title: "INV type",
         dataIndex: "invoiceType",
         key: "invoiceType",
         ...getColumnSearchProps("invoiceType", "Search Invoice Type"),
         align: "left",
         sorter: createTextSorter("invoiceType"),
         render: (v) => (v != null ? v.toString() : ""),
      },
      {
         title: "Order #",
         dataIndex: "ourOrderNo",
         key: "ourOrderNo",
         ...createNumericFilter("ourOrderNo", "Enter Order No"),
         align: "left",
         sorter: createNumericSorter("ourOrderNo"),
         render: (v) => (v != null ? v.toString() : ""),
      },
      {
         title: "Shp Ref",
         dataIndex: "shippingReferenceNo",
         key: "shippingReferenceNo",
         ...createNumericFilter("shippingReferenceNo", "Enter Shipping Ref"),
         align: "left",
         sorter: createNumericSorter("shippingReferenceNo"),
         render: (v) => (v != null ? v.toString() : ""),
      },
      {
         title: <div className="amount-header">Invoice Amount</div>,
         dataIndex: "invoiceAmount",
         key: "invoiceAmount",
         ...getColumnSearchProps("invoiceAmount", "Enter Invoice Amount", true),
         align: "right",
         render: (value: any) => formatCurrency(value),
         sorter: createInvoiceAmountSorter("invoiceAmount"),
      },
   ];

   return (
      <div className="content-card-body">
         <div className="flex-between">
            <div>
               <h4>Entries</h4>
               <p className="sub-text p-m">Process Type - Paper</p>
            </div>
            <div className="action-buttons">
               <ActionPermissionGuard actionId="voucher-entry.paper.create-batch">
                  <CustomStyledButton
                     name="createBatch"
                     label={
                        <h6>
                           {paperBatchCreateMutation.isPending
                              ? "Creating Batch..."
                              : MENU_LABELS.CREATE_BATCH}
                        </h6>
                     }
                     onClick={handleCreateBatch}
                     disabled={Boolean(paperBatchCreateMutation.isPending || isProcessing)}
                     icon={<img src={plusIcon} alt="plus" className="plus-icon" />}
                  />
               </ActionPermissionGuard>
            </div>
         </div>

         <div className="card-container ">
            <div className="card-flex-2 ">
               <Card
                  icon={<img src={companyIcon} alt="Company Name" />}
                  label="Company Name"
                  value="A.R.G. BRADFORD DIVISION"
               />
            </div>
            <div className="card-flex-1  ">
               <Card
                  icon={<img src={companyIcon} alt="Company No" />}
                  label="Company No"
                  value="10"
               />
            </div>
            <div className="card-flex-1  ">
               <Card
                  icon={<img src={invoiceAmountIcon} alt="Selected Total" />}
                  label="Selected Total"
                  value={formatCurrency(totalAmount)}
               />
            </div>
         </div>

         <div
            className="content-card-body table-responsive-container"
            style={{ marginTop: "16px" }}
         >
            <TableWidget<DataType>
               columns={columns}
               dataSource={filteredData}
               rowKey="key"
               loading={Boolean(isLoading || isProcessing || paperBatchCreateMutation.isPending)}
               onChange={handleTableChange}
            />
         </div>
      </div>
   );
});

export default FrieghtInvoiceImportSection;
