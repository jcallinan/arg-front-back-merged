import React, { useState, useCallback, useRef, useEffect } from "react";
import { Tooltip } from "antd";
import Toaster from "@widget-library/Toaster";
import { EyeOutlined, SyncOutlined } from "@ant-design/icons";
import cancelVoucher from "@assets/icons/file-cancel.svg";
import companyIcon from "@assets/icons/company-icon.svg";
import vendorNoIcon from "@assets/icons/vendor-no-icon.svg";
import vendorIcon from "@assets/icons/vendor-icon.svg";
import payablesIcon from "@assets/icons/payables-card-icon.svg";
import paidAmountIcon from "@assets/icons/last-paid-card-icon.svg";
import modifyStatus from "@assets/icons/modify-status.svg";
import discEdit from "@assets/icons/disc-edit.svg";
import calendarIcon from "@assets/icons/calender-icon.svg";
import "./voucher-maintenanece.scss";
import CompanyNo from "@shared-components/company-number/CompanyNo";
import VendorNumberName, {
  type VendorNumberNameRef,
} from "@shared-components/vendor-number-name/VendorNumberName";
import VoucherType from "@shared-components/voucher-type/VoucherType";
import { CustomStyledButton } from "@widget-library/Buttons";
import Card from "@widget-library/Card";
import TableWidget from "@widget-library/Table";
import VoucherViewModalWidget from "@widget-library/ViewModal";
import CancelVoucherModal from "@widget-library/CancelVoucherModal";
import VoucherStatusModal from "@widget-library/VoucherStatusModal";
import VoucherDiscountModify from "@widget-library/VoucherDiscountModifyModal";

import {
  FLEXI_PROCESS_CONSTANTS,
  voucherMaintenanceLabel,
} from "@constants/commonConstants";
import type { ColumnType } from "antd/es/table";
import type {
  VoucherEntryUI,
  VoucherMaintenanceModalData,
} from "@type-definitions/accounts-payable.types";
import { 
  useVoucherMaintenance, 
  useVoucherMaintenanceSummary, 
  useTransferVoucher,
  useVoucherMaintenanceByIdManual 
} from "@hooks/useVoucherMaintenance";
import { CustomPrefixInput } from "@/widget-library/Input";
import { formatMMDDYYForDisplay } from "@utils/dateFormat";
import { formatCurrency } from "@utils/formatters";
import {
   createInvoiceNumberSafeSorter,
   createCustomDateSorter,
   createInvoiceAmountSorter,
   createTextSorter,
   createCheckNumberSorter,
   createStatusSorter
} from "@utils/sortingUtils";
import { getColumnSearchProps, createNumericFilter } from "@utils/tableFilters";
import CustomDatePicker from "@widget-library/DatePicker";

const formatAmountForView = (amount: any): string => {
  if (amount === null || amount === undefined || amount === 0 || amount === "0") return "-";
  return formatCurrency(amount);
};

const formatNumericFieldForView = (value: any): string => {
  if (value === null || value === undefined || value === 0 || value === "0" || value === "") return "-";
  return value.toString();
};

const VoucherMaintenance: React.FC = () => {
  const [voucherType, setVoucherType] = useState<"PAID" | "UNPAID" | "ALL">(
    "PAID"
  );
  const [activeVoucherType, setActiveVoucherType] = useState<
    "PAID" | "UNPAID" | "ALL"
  >("PAID");
  const voucherTypeRef = useRef<"PAID" | "UNPAID" | "ALL">("PAID");
  const [companyNo, setCompanyNo] = useState("10");
  const [vendor, setVendor] = useState<string | undefined>();
  const [startDate, setStartDate] = useState<any>(null);
  const [invoiceNo, setInvoiceNo] = useState("");
  const [allVoucherData, setAllVoucherData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [hasMoreServerPages, setHasMoreServerPages] = useState(true);
  const serverItemsPerPage = 500;
  
  // State for controlling React Query hooks
  const [shouldFetchSummary, setShouldFetchSummary] = useState(false);
  const [searchParams, setSearchParams] = useState<{
    vouchers: any;
    summary: any;
  }>({
    vouchers: {},
    summary: {},
  });

  // Get hook for manual voucher maintenance calls
  const { fetchVoucherMaintenanceById } = useVoucherMaintenanceByIdManual();
  const isAppendingRef = useRef(false);
  const [_selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [selectedVoucherForStatus, setSelectedVoucherForStatus] =
    useState<VoucherEntryUI | null>(null);
  const [selectedVoucherForDiscount, setSelectedVoucherForDiscount] =
    useState<VoucherEntryUI | null>(null);
  const [isDiscountModalVisible, setIsDiscountModalVisible] = useState(false);
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [selectedVoucherForCancel, setSelectedVoucherForCancel] =
    useState<VoucherEntryUI | null>(null);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMappedData, setModalMappedData] =
    useState<ReturnType<typeof mapResponseToModalProps>>();
  const [toasterType, setToasterType] = useState<
    "success" | "error" | "warning" | "batch"
  >("success");
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterDescription, setToasterDescription] = useState("");
  const [suppressLoadedToast, setSuppressLoadedToast] = useState(false);

  // Toaster state
  const [showToaster, setShowToaster] = useState<boolean>(false);

  // Vendor ref for reset functionality
  const vendorRef = useRef<VendorNumberNameRef | null>(null);

  // Current form parameters (these change as user types but don't trigger queries)
  const formatDateForAPI = (dateStr: string | null): string | undefined => {
    if (!dateStr) return undefined;
    const date = new Date(dateStr);
    const year = String(date.getFullYear()).slice(-2); // Get last 2 digits of year
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${month}${day}${year}`; // MMDDYY format
  };

  const currentVoucherParams = {
    companyNo: Number(companyNo),
    vendorNo: vendor ? Number(vendor) : undefined,
    voucherType: voucherType,
    invoiceDate: formatDateForAPI(startDate),
    invoiceNo: invoiceNo || undefined,
    sortBy: "invoiceDate" as const,
    sortOrder: "DESC" as const,
    current_page: 1,
    items_per_page: serverItemsPerPage,
  };

  const currentSummaryParams = {
    voucherType: voucherType,
    companyNo: Number(companyNo),
    vendorNo: vendor ? Number(vendor) : 0,
  };

  // React Query hooks with stable parameters (only change when search is triggered)
  const {
    data: voucherData,
    isLoading: loading,
    refetch: refetchVouchers,
  } = useVoucherMaintenance(searchParams.vouchers, false); // Always disabled, only manual refetch

  const {
    data: summaryQueryData,
    refetch: refetchSummary,
  } = useVoucherMaintenanceSummary(searchParams.summary, false); // Always disabled, only manual refetch

  // Transfer voucher mutation
  const transferVoucherMutation = useTransferVoucher();

  // Toaster close handler
  const closeToaster = useCallback(() => {
    setShowToaster(false);
  }, []);

  // Helper function to show toaster
  const showToasterMessage = useCallback(
    (
      type: "error" | "success" | "warning" | "batch",
      title: string,
      description: string
    ) => {
      setToasterType(type);
      setToasterMessage(title);
      setToasterDescription(description);
      setShowToaster(true);
    },
    []
  );

  const [summaryData, setSummaryData] = useState({
    vendorName: "",
    companyNo: "10",
    vendorNo: "",
    openPayables: "",
    openPayablesDate: " ",
    lastPaidAmount: "",
    lastPaidDate: " ",
  });

  // Handle voucher data from React Query (append when loading additional pages)
  useEffect(() => {
    if (!voucherData) return;
    if (isAppendingRef.current) {
      setAllVoucherData((prev) => [...prev, ...voucherData]);
      isAppendingRef.current = false;
    } else {
      setAllVoucherData(voucherData);
    }
    // Update hasMore flag based on last batch size
    setHasMoreServerPages((voucherData?.length || 0) === serverItemsPerPage);
    if (suppressLoadedToast) {
      // Re-enable loaded toast for future user-triggered loads
      setSuppressLoadedToast(false);
      return;
    }
    if (voucherData.length > 0) {
      showToasterMessage(
        "success",
        "Success",
        `Loaded ${voucherData.length} voucher records`
      );
    }
  }, [voucherData, suppressLoadedToast]);

  // Handle summary data from React Query
  useEffect(() => {
    if (summaryQueryData) {
      setSummaryData(summaryQueryData);
    } else if (shouldFetchSummary) {
      // Reset to default values if no data
      setSummaryData({
        vendorName: " ",
        companyNo: companyNo,
        vendorNo: vendor || "",
        openPayables: "$0.00",
        openPayablesDate: " ",
        lastPaidAmount: "$0.00",
        lastPaidDate: " ",
      });
    }
  }, [summaryQueryData, shouldFetchSummary, companyNo, vendor]);



  // Pagination handler for dynamic loading using the same query hook
  const handlePaginationChange = useCallback(async (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);

    const totalLoaded = allVoucherData.length;
    const neededCount = page * size;
    // Fetch when user reaches or goes beyond the last loaded page AND server indicates more pages exist
    if (neededCount >= totalLoaded && hasMoreServerPages) {
      const fetchedServerPages = Math.ceil(totalLoaded / serverItemsPerPage);
      const nextServerPage = fetchedServerPages + 1;

      try {
        // Mark that we're appending so the effect merges data
        isAppendingRef.current = true;
        // Update the stable search params to request the next server page
        setSearchParams((prev) => ({
          ...prev,
          vouchers: {
            ...(prev?.vouchers || currentVoucherParams),
            current_page: nextServerPage,
            items_per_page: serverItemsPerPage,
          },
          summary: prev?.summary || currentSummaryParams,
        }));
        // Defer refetch until after state has been applied
        setTimeout(() => {
          refetchVouchers();
        }, 0);
      } catch (err) {
        console.error("Error fetching additional voucher maintenance:", err);
        // Reset append flag to avoid stale state
        isAppendingRef.current = false;
      }
    }
  }, [allVoucherData, setSearchParams, refetchVouchers, currentVoucherParams, currentSummaryParams, hasMoreServerPages]);

  const handleSearch = () => {
    let hasError = false;
    const missingFields = [];

    // Client-side validation
    if (!voucherType) {
      missingFields.push("Voucher Type");
      hasError = true;
    }

    if (!companyNo || companyNo.trim() === "") {
      missingFields.push("Company Number");
      hasError = true;
    }

    if (!vendor || vendor.trim() === "") {
      missingFields.push("Vendor Number");
      hasError = true;
    }

    if (hasError) {
      // Show validation errors via toaster
      showToasterMessage(
        "error",
        "Validation Error",
        `${missingFields.join(", ")} ${
          missingFields.length > 1 ? "are" : "is"
        } required`
      );
      return;
    }

    // Update the active voucher type to match the selected type
    setActiveVoucherType(voucherType);

    // Reset pagination (keep existing data visible until new results arrive)
    setCurrentPage(1);

    // Set stable search parameters and trigger React Query refetch
    const voucherParams = {
      ...currentVoucherParams,
      invoiceDate: formatDateForAPI(startDate),
      invoiceNo: invoiceNo || undefined,
    };
    
    const summaryParams = {
      ...currentSummaryParams,
      voucherType: voucherType, // Use the current voucher type for search
    };

    setSearchParams({
      vouchers: voucherParams,
      summary: summaryParams,
    });
    // Reset hasMore for a fresh query
    setHasMoreServerPages(true);
    
    setShouldFetchSummary(true);
    
    // Use setTimeout to ensure state is updated before refetch
    setTimeout(() => {
      refetchVouchers().catch((error: any) => {
        console.error("Error fetching vouchers:", error);
        // Handle server-side validation errors
        if (error?.response?.data?.code === "VALIDATION_ERROR") {
          const details = error?.response?.data?.details;
          if (details && Array.isArray(details)) {
            details.forEach((detail: any) => {
              showToasterMessage("error", "Error", detail.message);
            });
          } else {
            showToasterMessage(
              "error",
              "Error",
              error?.response?.data?.message || "Validation error occurred"
            );
          }
        } else {
          showToasterMessage(
            "error",
            "Error",
            "Failed to fetch voucher data. Please try again."
          );
        }
        setAllVoucherData([]);
      });
      
      if (vendor) {
        refetchSummary().catch((error: any) => {
          console.error("Error fetching summary data:", error);
        });
      }
    }, 0);
  };

  const handleReset = () => {
    setVoucherType("PAID");
    setActiveVoucherType("PAID");
    voucherTypeRef.current = "PAID";
    setCompanyNo("10");
    setVendor(undefined);
    setStartDate(null);
    setInvoiceNo("");
    setSelectedRows([]);
    // Reset pagination state
    setCurrentPage(1);
    setPageSize(10);
    setHasMoreServerPages(true);
    // Clear search parameters and disable fetching to reset data
    setSearchParams({
      vouchers: {},
      summary: {},
    });
    setShouldFetchSummary(false);
    // Clear toaster on reset
    setShowToaster(false);
    setToasterType("success");
    setToasterMessage("");
    setToasterDescription("");
    // Reset vendor component
    if (vendorRef.current) {
      vendorRef.current.resetVendor();
    }
    // Reset voucher and summary data
    setAllVoucherData([]);
    setSummaryData({
      vendorName: "",
      companyNo: "10",
      vendorNo: "",
      openPayables: "$0.00",
      openPayablesDate: " ",
      lastPaidAmount: "$0.00",
      lastPaidDate: " ",
    });
  };

  const handleVoucherTypeChange = (newType: string) => {
    const typedNewType = newType as "PAID" | "UNPAID" | "ALL";
    setVoucherType(typedNewType);
    voucherTypeRef.current = typedNewType;
    // Removed automatic API call - user needs to click Search
  };

  const handleViewClick = useCallback(
    async (record: VoucherEntryUI) => {
      setModalTitle(FLEXI_PROCESS_CONSTANTS.modalTitles.view);
      try {
        // Check if we have a valid voucher number
        if (!record.entryNo || record.entryNo === 0) {
          showToasterMessage(
            "error",
            "Error",
            "Invalid voucher number. Cannot fetch details."
          );
          console.error("Invalid voucherNo:", record.entryNo);
          return;
        }

      // Use the API instance from useApi hook
      let apiVoucherType: "PAID" | "UNPAID";
      if (voucherType === "ALL") {
       
        const hasPaidInfo = record.paidDate && record.paidDate !== "-" || 
                           (record.checkNo && record.checkNo !== "-");
        
        if (record.status === "Paid" || (record.status === "Cancelled" && hasPaidInfo)) {
          apiVoucherType = "PAID";
        } else {
          apiVoucherType = "UNPAID";
        }
      } else {
        apiVoucherType = voucherType;
      }
        const payload = {
          voucherNo: record.entryNo,
          voucherType: apiVoucherType,
          companyNo: Number(companyNo),
          vendorNo: Number(record.vendorNo),
        };
        const response = await fetchVoucherMaintenanceById(payload);

        // Check if the response has an error (like 404 Not Found) or no data
        if (
          (response?.data as any)?.error ||
          (!response?.data?.data?.headerItems &&
            !(response?.data as any)?.items?.headerItems)
        ) {
          // Use fallback data from table row
          const fallbackData = {
            vendorName: record.vendorName || "-",
            vendorNo: record.vendorNo || "-",
            invoiceNo: record.invoiceNo || "-",
            invoiceDate: record.invoiceDate || "-",
            discountDate: record.discountDate || "-",
            dueDate: record.dueDate || "-",
            invoiceAmount: 0, // Not available in table row, using grossAmount instead
            discountAmount: 0, // Not available in table row
            invoiceDesc: record.invoiceDesc || "-",
            freight: "-",
            prepaidVoucher: "-", // Not available in table row
            singleCheck: "-",
            acctPayGL: "-", // Not available in table row
            bankAcctGL: "-", // Not available in table row
            holdVoucher: "-", // Not available in table row
            holdDescription: "-",
            salesOrder: "-", // Not available in table row
            srn: "-", // Not available in table row
            lineAmount: 0, // Not available in table row
            lineDesc: record.invoiceDesc || "-",
            lineGL: "-", // Not available in table row
            poNumber: "-",
            freightLine: "-",
            itemGallons: "-",
            receipt: "-",
            qty: "-",
            project: "-",
            status: record.status || "-",
            companyNo:
              typeof record.companyNo === "number"
                ? record.companyNo
                : Number(companyNo),
            voucherNo:
              typeof record.entryNo === "string"
                ? Number(record.entryNo)
                : record.entryNo ?? 0,
          };

          const mapped = mapResponseToModalProps(fallbackData, []);
          setModalMappedData(mapped);
          setIsModalVisible(true);

          // Show warning that we're using limited data
          showToasterMessage(
            "warning",
            "Warning",
            "Using available data from table. Some API details may be limited or unavailable."
          );
          return;
        }

        // Handle different possible response structures
        let headerData, detailData;
        if ((response?.data as any)?.items?.headerItems) {
          // New API response structure: response.data.items.headerItems
          headerData = (response.data as any).items.headerItems;
          detailData = (response.data as any).items.detailItems || [];
        } else if (response?.data?.data?.headerItems) {
          // Old API response structure: response.data.data.headerItems
          headerData = response.data.data.headerItems;
          detailData = response.data.data.detailItems || [];
        } else {
          console.warn("No headerItems found in response:", response?.data);
        }

        if (headerData) {
          try {
            // Transform API response to match modal props structure
            const transformedData = {
              vendorName: headerData.vendorName || record.vendorName || "-",
              vendorNo:
                headerData.vendorNo?.toString() || record.vendorNo || "-",
              invoiceNo: headerData.invoiceNumber || record.invoiceNo || "-",
              invoiceDate:
                formatMMDDYYForDisplay(headerData.invoiceDate) ||
                record.invoiceDate ||
                "-",
              discountDate: formatMMDDYYForDisplay(headerData.discountDueDate),
              dueDate:
                formatMMDDYYForDisplay(headerData.dueDate) ||
                record.dueDate ||
                "-",
              invoiceAmount: headerData.grossAmount || 0,
              discountAmount: headerData.discountAmount || 0,
              invoiceDesc:
                headerData.invoiceDescription || record.invoiceDesc || "-",
              freight:
                detailData.length > 0 &&
                detailData[0].freightAmount !== undefined &&
                detailData[0].freightAmount !== null
                  ? detailData[0].freightAmount.toString()
                  : "-",
              prepaidVoucher: headerData.prepaidFlag,
              singleCheck: "-",
              acctPayGL: headerData.apGlAccountNo
                ? headerData.apGlAccountNo.toString()
                : "-",
              bankAcctGL: headerData.bankGlNo
                ? headerData.bankGlNo.toString()
                : "-",
              holdVoucher:
                headerData.holdPaymentFlag && headerData.holdPaymentFlag,
              holdDescription:
                (headerData as any).holdDescription ||
                (headerData as any).statusDescription ||
                "-",
              salesOrder: "-", // Not available in API response
              srn: "-", // Not available in API response
              lineAmount:
                detailData.length > 0 ? detailData[0].grossAmount || 0 : 0,
              lineDesc:
                detailData.length > 0
                  ? detailData[0].lineDescription || "-"
                  : "-",
              lineGL:
                detailData.length > 0 && detailData[0].expenseGlAccount
                  ? detailData[0].expenseGlAccount.toString()
                  : "-",
              poNumber:
                detailData.length > 0 && detailData[0].purchaseOrderNo
                  ? detailData[0].purchaseOrderNo
                  : detailData.length > 0 && detailData[0].poNumber
                  ? detailData[0].poNumber
                  : "-",
              freightLine:
                detailData.length > 0 &&
                detailData[0].freightAmount !== undefined &&
                detailData[0].freightAmount !== null
                  ? detailData[0].freightAmount.toString()
                  : "-",
              itemGallons: "-", // Not available in API response
              receipt:
                detailData.length > 0 &&
                detailData[0].receiptNumber !== undefined &&
                detailData[0].receiptNumber !== null
                  ? detailData[0].receiptNumber.toString()
                  : "-",
              qty:
                detailData.length > 0 &&
                detailData[0].quantity !== undefined &&
                detailData[0].quantity !== null
                  ? detailData[0].quantity.toString()
                  : "-",
              project:
                detailData.length > 0 && detailData[0].jobNo
                  ? detailData[0].jobNo
                  : "-",
              status:
                (headerData as any).voucherStatus === "PAID"
                  ? "Paid"
                  : (headerData as any).voucherStatus === "CANCELLED"
                  ? "Cancelled"
                  : "Unpaid",
              companyNo:
                headerData.companyNo?.toString() ||
                record.companyNo?.toString() ||
                "",
              voucherNo:
                headerData.voucherNo?.toString() ||
                record.entryNo?.toString() ||
                "",
            };

            const mapped = mapResponseToModalProps(transformedData, detailData);
            setModalMappedData(mapped);
            setIsModalVisible(true);
          } catch (transformError) {
            console.error("Error during data transformation:", transformError);
            console.error("HeaderData that caused error:", headerData);
            console.error("DetailData that caused error:", detailData);

            // Use fallback data if transformation fails
            const fallbackData = {
              vendorName: record.vendorName || "-",
              vendorNo: record.vendorNo || "-",
              invoiceNo: record.invoiceNo || "-",
              invoiceDate: record.invoiceDate || "-",
              discountDate: record.discountDate || "-",
              dueDate: record.dueDate || "-",
              invoiceAmount: 0,
              discountAmount: 0,
              invoiceDesc: record.invoiceDesc || "-",
              freight: "-",
              prepaidVoucher: "-",
              singleCheck: "-",
              acctPayGL: "-",
              bankAcctGL: "-",
              holdVoucher: "-",
              holdDescription: "-",
              salesOrder: "-",
              srn: "-",
              lineAmount: 0,
              lineDesc: record.invoiceDesc || "-",
              lineGL: "-",
              poNumber: "-",
              freightLine: "-",
              itemGallons: "-",
              receipt: "-",
              qty: "-",
              project: "-",
              status: record.status || "-",
              companyNo:
                typeof record.companyNo === "number"
                  ? record.companyNo
                  : Number(companyNo),
              voucherNo:
                typeof record.entryNo === "string"
                  ? Number(record.entryNo)
                  : record.entryNo ?? 0,
            };

            const mapped = mapResponseToModalProps(fallbackData, []);
            setModalMappedData(mapped);
            setIsModalVisible(true);

            showToasterMessage(
              "warning",
              "Warning",
              "Error processing API data. Using available table data instead."
            );
          }
        } else {
          showToasterMessage(
            "warning",
            "Warning",
            "Using table data only. API response format was unexpected."
          );
        }
      } catch (err) {
        console.error("Error fetching voucher details:", err);

        showToasterMessage(
          "error",
          "Error",
          "Failed to fetch voucher details. Please try again."
        );
      }
    },
    [voucherType, companyNo]
  );

  const handleCancelClick = (record: VoucherEntryUI) => {
    setSelectedVoucherForCancel(record);
    setIsCancelModalVisible(true);
  };

  const mapResponseToModalProps = (data: VoucherMaintenanceModalData, detailItems: any[] = []) => {
    return {
      cardData: [
        {
          icon: vendorIcon,
          label: "Vendor Name",
          value: data.vendorName,
          width: "50%",
        },
        {
          icon: vendorNoIcon,
          label: "Vendor No",
          value: data.vendorNo,
          width: "50%",
        },
      ],
      fieldSections: [
        [
          { label: "Invoice No", value: data.invoiceNo },
          { label: "Invoice Date", value: data.invoiceDate },
          { label: "Discount Date", value: data.discountDate },
          { label: "Due Date", value: data.dueDate },
        ],
        [
          {
            label: "Invoice Amount",
            value: formatAmountForView(data.invoiceAmount),
          },
           {
            label: "Discount Amount",
            value: formatAmountForView(data.discountAmount),
          },
          {
            label: "Invoice Description",
            value: data.invoiceDesc,
            bold: true,
          },
        ],
        [
          { label: "Freight", value: formatAmountForView(data.freight) },
          { label: "Prepaid Voucher", value: data.prepaidVoucher },
          { label: "Single Check", value: data.singleCheck },
          { label: "Acct Pay G/L", value: data.acctPayGL },
          { label: "Bank Acct G/L", value: data.bankAcctGL },
              { label: "Voucher No.", value: data.voucherNo },
          { label: "Hold Voucher", value: data.holdVoucher },
          { label: "Hold Description", value: data.holdDescription },
        ],
      ],
      // Map multiple line items from detailItems array
      lineItems: detailItems.map((item) => ({
        title: "", 
        fields: [
          [
            {
              label: "Line Amount",
              value: formatAmountForView(item.productAmount),
              bold: true,
            },
            { label: "Line Desc", value: item.lineDescription || "-" },
            { label: "Line G/L", value: item.expenseGlAccount?.toString() || "-" },
            {
              label: "Discount Amount",
              value: formatAmountForView(item.discountAmount),
            },
          ],
          [
            { label: "PO Number", value: item.poNumber || item.purchaseOrderNo || "-" },
            { label: "Freight", value: formatAmountForView(item.freightAmount) },
            { label: "Item Gallons", value: formatNumericFieldForView(item.gallons) },
            { label: "Receipt", value: formatNumericFieldForView(item.receiptNumber) },
          ],
           [
          { label: "Qty", value: formatNumericFieldForView(item.quantity) },
          { label: "Project", value: data.project },
          { label: "Status", value: data.status },
        ],
         [
          { label: "Sales Order", value: formatNumericFieldForView(item.salesOrderNo) },
          { label: "SRN", value: formatNumericFieldForView(item.srn) },
        ],

        ],
      })),
    };
  };

  const getColumns = (): (ColumnType<any> & { filterable?: boolean })[] => {
    const baseColumns: (ColumnType<any> & { filterable?: boolean })[] = [
      {
        title: "Action",
        dataIndex: "",
        render: (_, record) => (
          <div className="action-icons flex-all flex-align">
            <Tooltip title="View">
              <EyeOutlined
                className="action-icon"
                onClick={() => handleViewClick(record)}
              />
            </Tooltip>
            {(activeVoucherType === "UNPAID" ||
              (activeVoucherType === "ALL" && record.status === "Unpaid")) && (
              <Tooltip title="Status - Modify">
                <img
                  className="action-icon"
                  src={modifyStatus}
                  alt="Modify Status"
                  onClick={() => {
                    setSelectedVoucherForStatus(record);
                    setIsStatusModalVisible(true);
                  }}
                />
              </Tooltip>
            )}
            {(activeVoucherType === "UNPAID" ||
              (activeVoucherType === "ALL" && record.status === "Unpaid")) && (
              <Tooltip title="Discount - Modify">
                <img
                  className="action-icon"
                  src={discEdit}
                  onClick={async () => {
                    // If we don't have discount due date from the list API, fetch detailed info
                    if (!record.discountDate || record.discountDate === "-") {
                      try {
                        const detailedResponse =
                          await fetchVoucherMaintenanceById({
                              voucherNo: record.entryNo,
                              voucherType: "UNPAID",
                              companyNo: Number(companyNo),
                              vendorNo: Number(record.vendorNo),
                            });

                        if (detailedResponse?.data?.data?.headerItems) {
                          const headerData =
                            detailedResponse.data.data.headerItems;
                          // Update the record with detailed discount due date
                          record.discountDate =
                            headerData.discountDueDate &&
                            String(headerData.discountDueDate) !== "0"
                              ? formatMMDDYYForDisplay(
                                  headerData.discountDueDate
                                )
                              : "-";
                        }
                      } catch (error) {
                        console.error(
                          "Error fetching detailed voucher info:",
                          error
                        );
                      }
                    }

                    setSelectedVoucherForDiscount(record);
                    setIsDiscountModalVisible(true);
                  }}
                />
              </Tooltip>
            )}
            {record.status !== "Cancelled" && (
              <Tooltip title={record.status === "Paid" ? "Void Voucher" : "Cancel Voucher"}>
                <img
                  className="action-icon"
                  src={cancelVoucher}
                  alt={record.status === "Paid" ? "Void Voucher" : "Cancel Voucher"}
                  onClick={() => handleCancelClick(record)}
                />
              </Tooltip>
            )}
          </div>
        ),
      },
      {
        title: "Invoice No",
        dataIndex: "invoiceNo",
        key: "invoiceNo",
        ...getColumnSearchProps("invoiceNo", "Search Invoice No."),
        sorter: createInvoiceNumberSafeSorter("invoiceNo"),
      },
      {
        title: "Invoice Date",
        dataIndex: "invoiceDate",
        key: "invoiceDate",
        ...getColumnSearchProps("invoiceDate", "Search Invoice Date"),
        sorter: createCustomDateSorter("invoiceDate"),
      },
      {
        title: "Gross Amount",
        dataIndex: "grossAmount",
        key: "grossAmount",
        ...getColumnSearchProps("grossAmount", "Enter Gross Amount", true),
        sorter: createInvoiceAmountSorter("grossAmount"),
        render: (value: any) => formatCurrency(value),
      },
      {
        title: "Due Date",
        dataIndex: "dueDate",
        key: "dueDate",
        ...getColumnSearchProps("dueDate", "Search Due Date"),
        sorter: createCustomDateSorter("dueDate"),
      },
      {
        title: "Discount Date",
        dataIndex: "discountDate",
        key: "discountDate",
        ...getColumnSearchProps("discountDate", "Search Discount Date"),
        sorter: createCustomDateSorter("discountDate"),
      },
      {
        title: "Disc Amount",
        dataIndex: "discAmount",
        key: "discAmount",
        ...getColumnSearchProps("discAmount", "Enter Discount Amount", true),
        sorter: createInvoiceAmountSorter("discAmount"),
        render: (value: any) => formatCurrency(value),
      },
    ];

    if (voucherType === "UNPAID") {
      baseColumns.splice(
        -1,
        0,
        {
          title: "Net Amount",
          dataIndex: "netAmount",
          key: "netAmount",
          ...getColumnSearchProps("netAmount", "Enter Net Amount", true),
          sorter: createInvoiceAmountSorter("netAmount"),
          render: (value: any) => formatCurrency(value),
        },
        {
          title: "Invoice Desc",
          dataIndex: "invoiceDesc",
          key: "invoiceDesc",
          ...getColumnSearchProps("invoiceDesc", "Search Invoice Description"),
          sorter: createTextSorter("invoiceDesc"),
        }
      );
    }

    if (voucherType === "PAID" || voucherType === "ALL") {
      baseColumns.push(
        {
          title: "Paid Date",
          dataIndex: "paidDate",
          key: "paidDate",
          ...getColumnSearchProps("paidDate", "Search Paid Date"),
          sorter: createCustomDateSorter("paidDate"),
        },
        {
          title: "Check No",
          dataIndex: "checkNo",
          key: "checkNo",
          ...createNumericFilter("checkNo", "Enter Check No"),
          sorter: createCheckNumberSorter("checkNo"),
        },
        {
          title: "Paid Amount",
          dataIndex: "paidAmount",
          key: "paidAmount",
          ...getColumnSearchProps("paidAmount", "Enter Paid Amount", true),
          sorter: createInvoiceAmountSorter("paidAmount"),
          render: (value: any) => formatCurrency(value),
        }
      );
    }

    baseColumns.push({
      title: "Status",
      dataIndex: "status",
      key: "status",
      ...getColumnSearchProps("status", "Search Status"),
      sorter: createStatusSorter("status"),
      render: (status: string) => (
        <span className={`status-pill ${status}`}>{status || "Unknown"}</span>
      ),
    });

    return baseColumns;
  };

  return (
    <>
      {showToaster && (
        <Toaster
          type={toasterType}
          title={toasterMessage}
          subtitle={toasterDescription}
          onClose={closeToaster}
        />
      )}
      <h4>{voucherMaintenanceLabel}</h4>

      <div className="content-div-container">
        <div className="filter-grids-container">
          <div className="filter-field">
            <VoucherType
              value={voucherType}
              onChange={(value) => {
                handleVoucherTypeChange(value);
              }}
              type={""}
              reportType={""}
            />
          </div>
          <div className="filter-field">
            <CompanyNo
              value={companyNo}
              onChange={(value) => {
                setCompanyNo(value);
              }}
            />
          </div>
          <div className="filter-field">
            <VendorNumberName
              ref={vendorRef}
              value={vendor}
              onChange={(value) => {
                setVendor(value);
              }}
              companyNo={companyNo}
            />
          </div>
          <div className="filter-field">
            <p className="sub-title">Start Date</p>
            <CustomDatePicker
              name="startDate"
              value={startDate || undefined}
              onChange={(_, dateString) => setStartDate(dateString)}
              className="ui-dropdown-cn"
            />
          </div>
          <div className="filter-field">
            <p className="sub-title">Invoice No</p>
            <CustomPrefixInput
              placeholder="Enter number"
              value={invoiceNo}
              onChange={(e) => setInvoiceNo(e.target.value)}
              className="ui-dropdown-cn"
              name={""}
            />
          </div>
          <div className="filter-field">
            <CustomStyledButton
              name="search"
              label="Search"
              onClick={handleSearch}
              disabled={loading}
            />
          </div>
          <div className="filter-field">
            <SyncOutlined className="action-icon" onClick={handleReset} />
          </div>
        </div>
      </div>

      <div className="content-div-container">
        <div className="content-card-body">
          <h4>Voucher Payment History</h4>

          <div className="vendor-details-container">
            <div className="cards-container">
              <Card
                icon={<img src={vendorNoIcon} alt="Vendor Name" />}
                label="Vendor Name"
                value={summaryData.vendorName}
              />
              <div className="single-row">
                <Card
                  icon={<img src={companyIcon} alt="Company No" />}
                  label="Company No"
                  value={summaryData.companyNo}
                />
                <Card
                  icon={<img src={vendorIcon} alt="Vendor No" />}
                  label="Vendor No"
                  value={summaryData.vendorNo}
                />
                <Card
                  key={`payables-card-${voucherType}`}
                  icon={
                    <img
                      src={payablesIcon}
                      alt={
                        voucherType === "UNPAID"
                          ? "Open Payables Date"
                          : "Open Payables"
                      }
                    />
                  }
                  label={
                    voucherType === "UNPAID"
                      ? "Open Payables Date"
                      : "Open Payables"
                  }
                  value={
                    voucherType === "UNPAID"
                      ? summaryData.openPayablesDate
                      : summaryData.openPayables
                  }
                />
                <Card
                  icon={<img src={paidAmountIcon} alt="Last Paid Amount" />}
                  label="Last Paid Amount"
                  value={summaryData.lastPaidAmount}
                />
                <Card
                  icon={<img src={calendarIcon} alt="Last Paid Date" />}
                  label="Last Paid Date"
                  value={summaryData.lastPaidDate}
                />
              </div>
            </div>
          </div>

          <div className="table-responsive-container">
            <TableWidget<VoucherEntryUI>
              columns={getColumns()}
              dataSource={allVoucherData}
              loading={loading}
              rowKey="key"
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: allVoucherData.length,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `Total ${total} vouchers`,
                onChange: handlePaginationChange,
              }}
              onChange={(_pagination, _filters, _sorter, extra) => {
                // Reset to page 1 when filters are applied
                if (extra.action === 'filter') {
                  setCurrentPage(1);
                }
              }}
            />
          </div>
        </div>
      </div>

      {modalMappedData && (
        
          <VoucherViewModalWidget
            visible={isModalVisible}
            title={modalTitle}
            onClose={() => setIsModalVisible(false)}
            onEdit={() => {}}
            cardData={modalMappedData.cardData}
            fieldSections={modalMappedData.fieldSections}
            lineItems={modalMappedData.lineItems}
          />

      )}

      <CancelVoucherModal
        visible={isCancelModalVisible}
        voucherType={
          selectedVoucherForCancel?.status?.toLowerCase() === "paid" ? "paid" : "unpaid"
        }
        onConfirm={async () => {
          if (!selectedVoucherForCancel) {
            setIsCancelModalVisible(false);
            return;
          }
          try {
            const voucherTypeForTransfer: "PAID" | "UNPAID" =
              (selectedVoucherForCancel.status || "").toUpperCase() === "PAID"
                ? "PAID"
                : "UNPAID";
            
            const resp = await transferVoucherMutation.mutateAsync({
              voucherType: voucherTypeForTransfer,
              companyNo: Number(
                selectedVoucherForCancel.companyNo ?? companyNo
              ),
              vendorNo: Number(selectedVoucherForCancel.vendorNo),
              voucherNo: Number(selectedVoucherForCancel.entryNo),
            });
            
            setIsCancelModalVisible(false);
            setSelectedVoucherForCancel(null);
            
            // Force refetch data after successful cancellation
            // Use setTimeout to ensure the mutation's onSuccess has completed
            setTimeout(async () => {
              // Clear local state to ensure UI updates
              setAllVoucherData([]);
              // Prevent list reload toast from overriding success toast
              setSuppressLoadedToast(true);
              
              // Force refetch with fresh data
              const voucherResult = await refetchVouchers();
              if (vendor) {
                await refetchSummary();
              }
              
              // Update local state with fresh data (including empty arrays)
              if (voucherResult.data) {
                setAllVoucherData(voucherResult.data);
              }
            }, 100);
            
            const respDataAny = (resp?.data as any) || {};
            const successMsg =
              respDataAny?.items?.message ||
              respDataAny?.message ||
              "Voucher transferred successfully.";
            showToasterMessage("success", "Success", successMsg);
          } catch (error: any) {
            const apiError =
              error?.response?.data?.error ||
              error?.data?.error ||
              error?.error ||
              error;
            const details = apiError?.details || apiError?.error?.details;
            const message =
              (Array.isArray(details) && details.length
                ? details
                    .map((d: any) => d?.message)
                    .filter(Boolean)
                    .join("\n")
                : apiError?.message) ||
              "Failed to transfer voucher. Please try again.";
            showToasterMessage(
              "error",
              apiError?.code === "VALIDATION_ERROR" ? "Validation Error" : "Error",
              message
            );
            setIsCancelModalVisible(false);
          }
        }}
        onCancel={() => {
          setIsCancelModalVisible(false);
          setSelectedVoucherForCancel(null);
        }}
        itemName={
          selectedVoucherForCancel
            ? String(selectedVoucherForCancel.entryNo)
            : ""
        }
      />

      <VoucherStatusModal
        visible={isStatusModalVisible}
        onCancel={() => setIsStatusModalVisible(false)}
        onSuccess={() => {
          // Refresh voucher data after successful update using React Query
          refetchVouchers();
          if (vendor) {
            refetchSummary();
          }
        }}
        voucherData={
          selectedVoucherForStatus
            ? {
                companyNo: selectedVoucherForStatus.companyNo.toString(),
                vendorName: selectedVoucherForStatus.vendorName,
                vendorNo: selectedVoucherForStatus.vendorNo,
                voucherNo: selectedVoucherForStatus.entryNo.toString(),
                // Prefill modal with current values from list API
                statusCode: (selectedVoucherForStatus as any).holdPaymentFlag,
                statusDescription: (selectedVoucherForStatus as any).holdDescription,
              }
            : undefined
        }
      />

      <VoucherDiscountModify
        visible={isDiscountModalVisible}
        onCancel={() => {
          setIsDiscountModalVisible(false);
          setSelectedVoucherForDiscount(null);
        }}
        voucherData={
          selectedVoucherForDiscount
            ? {
                companyNo: selectedVoucherForDiscount.companyNo.toString(),
                vendorName: selectedVoucherForDiscount.vendorName,
                vendorNo: selectedVoucherForDiscount.vendorNo,
                voucherNo: selectedVoucherForDiscount.entryNo.toString(),
                discountDueDate: (selectedVoucherForDiscount as any)
                  .discountDate,
                discountAmount: (selectedVoucherForDiscount as any).discAmount,
              }
            : undefined
        }
        onSuccess={() => {
          // Refresh voucher data after successful update using React Query
          refetchVouchers();
          if (vendor) {
            refetchSummary();
          }
        }}
      />
    </>
  );
};

export default VoucherMaintenance;
