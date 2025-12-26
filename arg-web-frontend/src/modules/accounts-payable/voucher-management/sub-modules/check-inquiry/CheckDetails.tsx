import { formatCurrency } from "@utils/formatters";
import React, { useCallback, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { message, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import Card from "@widget-library/Card";
import companyIcon from "@assets/icons/company-icon.svg";
import voucherIcon from "@assets/icons/voucherno.svg";
import vendorNoIcon from "@assets/icons/vendor-no-icon.svg";
import vendorIcon from "@assets/icons/vendor-icon.svg";
// import openpayables from "@assets/icons/openpayable.svg";
// import paidAmountIcon from "@assets/icons/last-paid-card-icon.svg";
import calendarIcon from "@assets/icons/calender-icon.svg";
import bankCardIcon from "@assets/icons/card-bank-icon.svg";
import EyeOutlined from "@ant-design/icons/lib/icons/EyeOutlined";
import type {
  CheckPaymentHistoryUI,
} from "@type-definitions/accounts-payable.types";
import TableWidget from "@widget-library/Table";
import VoucherViewModalWidget from "@widget-library/ViewModal";
import { FLEXI_PROCESS_CONSTANTS } from "@constants/commonConstants";
import { useCheckDetailsPaymentHistory, useVoucherDetailsManual } from "@hooks/useCheckInquiry";
import { formatMMDDYYForDisplay } from "@utils/dateFormat";
import {
   createVoucherNumberSorter,
   createInvoiceNumberSafeSorter,
   createInvoiceDescriptionSorter,
   createCustomDateSorter,
   createInvoiceAmountSorter,
   createDiscountAmountSorter
} from "@utils/sortingUtils";
import { getColumnSearchProps, createNumericFilter } from "@utils/tableFilters";
import "./check-inquiry.scss";
 
// API Response Interfaces
interface VendorDetail {
  vendorDetails?: { vendorName?: string };
  vendorName?: string;
  companyNo?: number;
  vendorNo?: number;
  voucherNo?: number;
  bankGLNo?: number;
}
 
interface HeaderItems {
  invoiceNo?: string;
  invoiceDate?: number | string;
  discountDueDate?: number | string;
  dueDate?: number | string;
  grossAmount?: number;
  discount?: number;
  invoiceDescription?: string;
  freightTotal?: number;
  prepaidVoucher?: string;
  singleCheck?: string;
  checkNo?: number;
  apGLAccountNo?: number;
  bankGLNo?: number;
  heldPaymentVoucher?: string;
  heldDescription?: string;
  salesOrderNo?: number;
  salesSRNNo?: number;
}
 
interface DetailItem {
  detailLineAmount?: number;
  detailLineDescription?: string;
  expenseGLAccount?: number;
  discountAmount?: number;
  poNumber?: string;
  freightAmount?: number;
  gallons?: number;
  receiptNumber?: number;
  quantity?: number;
  openClosedStatus?: string;
}
 
interface ApiResponse {
  vendorDetail?: VendorDetail;
  headerItems?: HeaderItems;
  detailItems?: DetailItem[];
}
 
 
 
interface LocationState {
  companyNo?: number;
  vendorNo?: number;
}
 
const CheckDetails: React.FC = () => {
  const { checkNo } = useParams<{ checkNo: string }>();
  const location = useLocation();
 
  const [modalTitle, setModalTitle] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMappedData, setModalMappedData] =
    useState<ReturnType<typeof mapResponseToModalProps>>();
 
  // Prepare query parameters for React Query
  const locationState = location.state as LocationState | null;
  const stateCompanyNo = locationState?.companyNo;
  const stateVendorNo = locationState?.vendorNo;
  const searchParams = new URLSearchParams(location.search);
  const queryCompanyNo = searchParams.get("companyNo");
  const queryVendorNo = searchParams.get("vendorNo");

  // React Query hook for payment history with exact same parameters
  const {
    data: tableData = [],
    isLoading: loading,
    error,
  } = useCheckDetailsPaymentHistory({
    checkNo: Number(checkNo),
    companyNo:
      stateCompanyNo ??
      (queryCompanyNo ? Number(queryCompanyNo) : undefined),
    vendorNo:
      stateVendorNo ??
      (queryVendorNo ? Number(queryVendorNo) : undefined),
    current_page: 1,
    items_per_page: 500,
  }, !!checkNo);

  // Get hook for manual voucher details fetching
  const { fetchVoucherDetails } = useVoucherDetailsManual();
 
  const columns: (ColumnsType<CheckPaymentHistoryUI>[0] & {
    filterable?: boolean;
  })[] = [
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <Tooltip title="View">
          <EyeOutlined
            className="action-icon"
            onClick={() => {
              handleViewClick(record);
            }}
          />
        </Tooltip>
      ),
    },
    {
      title: "Voucher No.",
      dataIndex: "voucherNo",
      ...createNumericFilter("voucherNo", "Enter Voucher No"),
      sorter: createVoucherNumberSorter("voucherNo"),
    },
    {
      title: "Invoice No.",
      dataIndex: "invoiceNo",
      ...getColumnSearchProps("invoiceNo", "Search Invoice No"),
      sorter: createInvoiceNumberSafeSorter("invoiceNo"),
    },
    {
      title: "Invoice Description",
      dataIndex: "invoiceDescription",
      ...getColumnSearchProps("invoiceDescription", "Search Description"),
      sorter: createInvoiceDescriptionSorter("invoiceDescription"),
    },
    {
      title: "Invoice Date",
      dataIndex: "invoiceDate",
      ...getColumnSearchProps("invoiceDate", "Search Invoice Date"),
      sorter: createCustomDateSorter("invoiceDate"),
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      ...getColumnSearchProps("dueDate", "Search Due Date"),
      sorter: createCustomDateSorter("dueDate"),
    },
    {
      title: "Paid Amount",
      dataIndex: "paidAmount",
      ...getColumnSearchProps("paidAmount", "Enter Paid Amount", true),
      align: "right",
      sorter: createInvoiceAmountSorter("paidAmount"),
    },
    {
      title: "Discount Taken",
      dataIndex: "discountAmount",
      ...getColumnSearchProps("discountAmount", "Enter Discount Amount", true),
      align: "right",
      sorter: createDiscountAmountSorter("discountAmount"),
    },
  ];
 
  const mapResponseToModalProps = (data: Record<string, unknown>, detailItems: DetailItem[] = []) => {
    return {
      cardData: [
        {
          icon: vendorIcon,
          label: "Vendor Name",
          value: String(data.vendorName || ""),
          width: "50%",
        },
        {
          icon: companyIcon,
          label: "Company No",
          value: String(data.companyNo || ""),
          width: "16.6%",
        },
        {
          icon: vendorNoIcon,
          label: "Vendor No",
          value: String(data.vendorNo || ""),
          width: "16.6%",
        },
        {
          icon: voucherIcon,
          label: "Voucher No",
          value: String(data.voucherNo || ""),
          width: "16.6%",
        },
      ],
      fieldSections: [
        [
          { label: "Invoice No", value: String(data.invoiceNo || "") },
          { label: "Invoice Date", value: String(data.invoiceDate || "") },
          {
            label: "Invoice Amount",
            value: formatCurrency(Number(data.invoiceAmount) || 0),
          },
          {
            label: "Invoice Description",
            value: String(data.invoiceDesc || ""),
            bold: true,
          },
        ],
        [
          { label: "Discount Date", value: String(data.discountDate || "") },
          { label: "Due Date", value: String(data.dueDate || "") },
          {
            label: "Discount Amount",
            value: formatCurrency(Number(data.discountAmount) || 0),
          },
          { label: "Paid Date", value: String(data.paidDate || "") },
        ],
        [
          { label: "Freight", value: String(data.freight || "") },
          { label: "Prepaid Voucher", value: String(data.prepaidVoucher || "") },
          { label: "Check No", value: String(data.checkNo || "") },
          { label: "Acct Pay G/L", value: String(data.acctPayGL || "") },
        ],
        [
          { label: "Single Check", value: String(data.singleCheck || "") },
          { label: "Hold Voucher", value: String(data.holdVoucher || "") },
          { label: "Hold Description", value: String(data.holdDescription || "") },
          { label: "Bank Acct G/L", value: String(data.bankAcctGL || "") },
        ],
     
      ],
      lineItems: detailItems.map((item) => ({
        title: "", // Empty title for clean "Line Item 1" display
        fields: [
          [
            {
              label: "Line Amount",
              value: formatCurrency(item.detailLineAmount || 0),
              bold: true,
            },
            { label: "Line Desc", value: item.detailLineDescription || "-" },
            { label: "Line G/L", value: item.expenseGLAccount?.toString() || "-" },
            {
              label: "Discount Amount",
              value: item.discountAmount ? formatCurrency(item.discountAmount) : "-",
            },
          ],
          [
            { label: "PO Number", value: item.poNumber || "-" },
            { label: "Freight", value: item.freightAmount?.toString() || "-" },
            { label: "Item Gallons", value: item.gallons?.toString() || "-" },
            { label: "Receipt", value: item.receiptNumber?.toString() || "-" },
          ],
          [
            { label: "Qty", value: item.quantity?.toString() || "-" },
            { label: "Project", value: " " }, // Not available in current API response
            { label: "Status", value: item.openClosedStatus || "-" },
          ],
             [
          { label: "Sales Order", value: String(data.salesOrder || "") },
          { label: "SRN", value: String(data.srn || "") },
        ],
        ],
      })),
    };
  };
  const handleViewClick = useCallback(
    async (record: CheckPaymentHistoryUI) => {
      setModalTitle(FLEXI_PROCESS_CONSTANTS.modalTitles.view);
 
      // Get companyNo and vendorNo from location state (passed from CheckEnquiry)
      const { companyNo, vendorNo } = location.state || {};
 
      // Extract voucherNo from record
      const voucherNo = record.voucherNo;
 
      if (!companyNo || !vendorNo || !voucherNo) {
        message.error("Missing required parameters for voucher details");
        return;
      }
 
      try {
        // Use React Query hook to fetch voucher details with exact same parameters
        const queryParams = {
          companyNo: Number(companyNo),
          vendorNo: Number(vendorNo),
          voucherNo: Number(voucherNo),
        };
 
        // Use the hook with exact same parameters
        const response = await fetchVoucherDetails(queryParams);
 
        if (response?.data) {
          // Handle the actual API response structure which has an 'items' wrapper
          const responseData = response.data as Record<string, unknown>;
          const apiData = (responseData.items || responseData) as ApiResponse;
          const { vendorDetail, headerItems, detailItems } = apiData;
 
          // Helper function to convert different date formats
          const formatDateValue = (
            dateValue: number | string | null | undefined
          ): string => {
            if (!dateValue || dateValue === 0) return " ";
 
            const dateStr = dateValue.toString();
 
            // Handle YYYYMMDD format (8 digits)
            if (dateStr.length === 8) {
              return formatMMDDYYForDisplay(dateStr);
            }
 
            // Handle Excel-like date numbers (days since epoch)
            if (
              typeof dateValue === "number" &&
              dateValue > 30000 &&
              dateValue < 100000
            ) {
              // Convert Excel date number to actual date
              // Excel epoch starts from 1900-01-01, but we need to account for leap year bug
              const excelEpoch = new Date(1900, 0, 1);
              const actualDate = new Date(
                excelEpoch.getTime() + (dateValue - 2) * 24 * 60 * 60 * 1000
              );
              const month = String(actualDate.getMonth() + 1).padStart(2, "0");
              const day = String(actualDate.getDate()).padStart(2, "0");
              const year = String(actualDate.getFullYear()).slice(-2);
              return `${month}/${day}/${year}`;
            }
 
            // Try standard formatting as fallback
            return formatMMDDYYForDisplay(dateValue);
          };
 
          // Transform API response to match modal props structure
          const transformedData = {
            vendorName:
              vendorDetail?.vendorDetails?.vendorName?.trim() ||
              vendorDetail?.vendorName?.trim() ||
              " ",
            companyNo: vendorDetail?.companyNo?.toString() || " ",
            vendorNo: vendorDetail?.vendorNo?.toString() || " ",
            voucherNo: vendorDetail?.voucherNo?.toString() || " ",
            invoiceNo: headerItems?.invoiceNo || record.invoiceNo || " ",
            invoiceDate: formatDateValue(headerItems?.invoiceDate),
            discountDate: formatDateValue(headerItems?.discountDueDate),
            dueDate: formatDateValue(headerItems?.dueDate),
            invoiceAmount: headerItems?.grossAmount || "-",
            discountAmount: headerItems?.discount || "-",
            invoiceDesc:
              headerItems?.invoiceDescription ||
              record.invoiceDescription ||
              "-",
            freight: headerItems?.freightTotal?.toString() || "-",
            prepaidVoucher: headerItems?.prepaidVoucher || "-",
            singleCheck: headerItems?.singleCheck || "-",
            acctPayGL: headerItems?.apGLAccountNo?.toString() || "-",
            bankAcctGL:
              headerItems?.bankGLNo?.toString() ||
              vendorDetail?.bankGLNo?.toString() ||
              "-",
            holdVoucher: headerItems?.heldPaymentVoucher || "-",
            holdDescription: headerItems?.heldDescription || "-",
            salesOrder: headerItems?.salesOrderNo?.toString() || "-",
            srn: headerItems?.salesSRNNo?.toString() || "-",
            checkNo: headerItems?.checkNo?.toString() || "-",
            paidDate: formatDateValue(headerItems?.dueDate), // Using dueDate as paidDate for now
          };
 
          const mapped = mapResponseToModalProps(transformedData, detailItems || []);
          setModalMappedData(mapped);
          setIsModalVisible(true);
        } else {
          message.error("No voucher details found");
        }
      } catch (err) {
        console.error("Error fetching voucher details:", err);
        message.error("Failed to fetch voucher details. Please try again.");
      }
    },
    [location.state]
  );
 
 
  // Derive card data from table rows
  const cardDerived = useMemo(() => {
    if (!tableData.length) {
      return {
        vendorName: "-",
        companyNo: "-",
        vendorNo: "-",
        totalPaid: "$0.00",
        checkDate: "-",
        bankGLNo: "-",
        openPayables: "-",
      };
    }
    const first = tableData[0] as CheckPaymentHistoryUI & {
      vendorName?: string;
      checkDate?: string;
      paidDate?: string;
      bankGLNo?: number;
      companyNo?: number;
      vendorNo?: number;
    };
    const totalPaidNum = tableData.reduce((sum, row) => {
      const amt =
        typeof row.paidAmount === "string"
          ? row.paidAmount.replace("$", "")
          : row.paidAmount;
      const num = Number(amt || 0);
      return sum + (isNaN(num) ? 0 : num);
    }, 0);
 
    const totalGrossNum = tableData.reduce((sum, row) => {
      const num = Number(row.grossAmount || 0);
      return sum + (isNaN(num) ? 0 : num);
    }, 0);
 
    const currency = (n: number) => formatCurrency(n);
 
    return {
      vendorName: first.vendorName || "-",
      companyNo: first.companyNo?.toString?.() || "-",
      vendorNo: first.vendorNo?.toString?.() || "-",
      totalPaid: currency(totalPaidNum),
      checkDate: first.checkDate || first.paidDate || "-",
      bankGLNo: first.bankGLNo?.toString?.() || "-",
      openPayables: totalGrossNum
        ? currency(Math.max(totalGrossNum - totalPaidNum, 0))
        : "-",
    };
  }, [tableData]);
 
  return (
    <div>
      <h2>Check Details</h2>
 
      <div className="content-div-container">
        <div className="content-card-body">
          <h2>Check Details</h2>
          <p>Check Number # {checkNo}</p>
          <div className="check-details-container">
            <div className="check-cards-container">
              <Card
                icon={<img src={vendorIcon} alt="Vendor Name" />}
                label="Vendor Name"
                value={cardDerived.vendorName}
              />
              <div className="single-row">
                <Card
                  icon={<img src={companyIcon} alt="Company No" />}
                  label="Company No"
                  value={cardDerived.companyNo}
                />
                <Card
                  icon={<img src={vendorNoIcon} alt="Vendor No" />}
                  label="Vendor No"
                  value={cardDerived.vendorNo}
                />
                <Card
                  icon={<img src={bankCardIcon} alt="Bank G/L" />}
                  label="Bank G/L"
                  value={cardDerived.bankGLNo}
                />
                <Card
                  icon={<img src={calendarIcon} alt="Check Date" />}
                  label="Check Date"
                  value={cardDerived.checkDate}
                />
              </div>
            </div>
            {error && (
              <div style={{ color: "red", marginTop: 10, fontSize: 14 }}>
                {error.message || "Failed to fetch check details"}
              </div>
            )}
          </div>
 
          <div className="table-responsive-container">
            <TableWidget<CheckPaymentHistoryUI>
              columns={columns}
              dataSource={tableData}
              loading={loading}
              rowKey="key"
            />
          </div>
        </div>
      </div>
      {modalMappedData && (
        <VoucherViewModalWidget
          visible={isModalVisible}
          title={modalTitle}
          onClose={() => setIsModalVisible(false)}
          onEdit={() => console.log("Edit clicked")}
          cardData={modalMappedData.cardData}
          fieldSections={modalMappedData.fieldSections}
          lineItems={modalMappedData.lineItems}
        />
      )}
    </div>
  );
};
 
export default CheckDetails;
 
 