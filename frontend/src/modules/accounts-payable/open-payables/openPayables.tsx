import React, { useState, useEffect } from "react";
import {
   OPEN_PAYABLES,
   PURCHASE_JOURNAL,
} from "@constants/commonConstants";
import { CustomSelectDropdown } from "@widget-library/Dropdown";
import {
   CustomStyledButton,
   DefaultButton,
} from "@widget-library/Buttons";
import "./openPayables.scss";
import { Tooltip, Switch, Divider } from "antd";
import Toaster from "@widget-library/Toaster";
import {
   DownloadOutlined,
   EyeOutlined,
   FileExcelOutlined,
   FilePdfOutlined,
   ReloadOutlined,
   SyncOutlined,
} from "@ant-design/icons";
import ReportsFilterBar from "@shared-components/report-filter-bar/ReportsFilterBar";
import type { ColumnType } from "antd/es/table";
import TableWidget from "@widget-library/Table";
import ExcelViewer from "@widget-library/ExcelViewer";
import CompanyNo from "@shared-components/company-number/CompanyNo";
import CustomDatePicker from "@widget-library/DatePicker";
import type { Dayjs } from "dayjs";
import { useDropdownData } from "@hooks/useDropdownData";
import { useOpenPayables } from "@hooks/useOpenPayables";
import {
  createPdfFileNameSorter,
  createReportDateTimeSorter,
  createReportTypeSorter,
  createReportFileTypeSorter,
  createStatusSafeSorter
} from "@utils/sortingUtils";
import { getColumnSearchProps } from "@utils/tableFilters";
import { useFileDownload } from "@hooks/useFileDownload";
import type { OpenPayablesUI } from "@/types/accounts-payable.types";

interface Props {}

const OpenPayables: React.FC<Props> = () => {
   const [fileName, setFileName] = useState<string>("");
   const [reportType, setReportType] = useState<string>("");
   const [reportTypes, setReportTypes] = useState<string>("");
   const { downloadFile } = useFileDownload();
   const [dateErrors, setDateErrors] = useState({
      date1: "",
      date2: "",
      date3: "",
      date4: "",
   });

   const [companyNo, setCompanyNo] = useState("10");

   // Use custom hook for API calls
   const {
      loading,
      fetchReportsType,
      getOpenPayablesReportData,
      openPayableGenerateReport,
      buildApiParams,
      buildReportApiParams,
   } = useOpenPayables();
   const [errors, setErrors] = useState<{
      openPayable?: string;
      company?: string;
   }>({});
   const [populateSpreadsheet, setPopulateSpreadsheet] = useState(false);
   const [holdVoucher, setHoldVoucher] = useState("");
   const [dateRange, setDateRange] = useState<
      [Dayjs | null, Dayjs | null] | null
   >(null);

   // Add state for filter bar date range
   const [filterDateRange, setFilterDateRange] = useState<
      [Dayjs | null, Dayjs | null] | null
   >(null);

   const [date1, setDate1] = useState<string>("");
   const [date2, setDate2] = useState<string>("");
   const [date3, setDate3] = useState<string>("");
   const [date4, setDate4] = useState<string>("");
   const [reportData, setReportData] = useState<any[]>([]);
   const [excelViewerVisible, setExcelViewerVisible] = useState(false);
   const [toasterType, setToasterType] = useState<"success" | "error">(
      "success"
   );
   const [toasterMessage, setToasterMessage] = useState("");
   const [toasterDescription, setToasterDescription] = useState("");
   const [selectedExcelFile, setSelectedExcelFile] = useState<{
      fileName: string;
      filePath: string;
   } | null>(null);

   const [dueDateOptions, setDueDateOptions] = useState<any[]>([]);
   const [dueDate, setDueDate] = useState<any>(undefined);

   // Fetch Hold Voucher Code options from common dropdown API
   const {
      data: holdVoucherData,
      isLoading: isHoldVoucherLoading,
      error: holdVoucherError,
   } = useDropdownData("HOLD_VOUCHER_CODE");

   // Transform API data to dropdown format
   const holdVoucherOptions =
      holdVoucherData?.map((item) => ({
         label: item.label || item.value || "",
         value: item.value || item.id || "",
      })) || [];

   // Log error if Hold Voucher data fails to load
   useEffect(() => {
      if (holdVoucherError) {
         console.error(
            "Error fetching hold voucher options:",
            holdVoucherError
         );
         setToasterType("error");
         setToasterMessage("Warning");
         setToasterDescription(
            "Failed to load hold voucher options. Please refresh the page."
         );
      }
   }, [holdVoucherError]);

   // const onChange = (selectedValue: string) => {
   //   setValue(selectedValue);
   // };

   const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFileName(e.target.value);
   };

   const handleFetchReportsType = async () => {
      try {
         const mappedOptions = await fetchReportsType();
         setDueDateOptions(mappedOptions);
      } catch (err) {
         console.error("Error fetching open payable types:", err);
         setToasterType("error");
         setToasterMessage("Error");
         setToasterDescription("Failed to load open payable types");
      }
   };

   useEffect(() => {
      handleFetchReportsType();
   }, []);

   // useEffect(() => {
   //   if (dueDateOptions.length > 0 && !dueDate) {
   //     setDueDate(dueDateOptions[0].value);
   //     setReportTypes(dueDateOptions[0].value);
   //   }
   // }, [dueDateOptions]);

   const handleBuildApiParams = (sourceType: "generate" | "filter" = "generate") => {
      return buildApiParams(sourceType, {
         dueDate,
         reportType,
         companyNo,
         holdVoucher,
         date1,
         date2,
         date3,
         date4,
         populateSpreadsheet,
         dateRange,
      });
   };
   const handleReportApiParams = () => {
      return buildReportApiParams({
         companyNo,
         reportType,
         fileName,
         filterDateRange,
      });
   };

   const handleGetOpenPayablesReportData = async (useFilters: boolean = true) => {
      try {
         // If useFilters is false (called after report generation), only use company number
         const queryParams = useFilters
            ? handleReportApiParams()
            : {
                 companyNo: parseInt(companyNo),
              };

         const transformedData = await getOpenPayablesReportData(queryParams);
         setReportData(transformedData);
         // message.success('Report data loaded successfully');
      } catch (error) {
         console.error("Error fetching open payables report:", error);
         setToasterType("error");
         setToasterMessage("Error");
         setToasterDescription("Failed to fetch report data");
         setReportData([]);
      }
   };
   useEffect(() => {
      handleGetOpenPayablesReportData();
   }, []);

   async function onApply(): Promise<void> {
      // Reset errors
      setErrors({});

      // Validate required fields
      const newErrors: { openPayable?: string; company?: string } = {};

      if (!dueDate) {
         newErrors.openPayable = "Open Payables is required";
      }

      if (!companyNo || companyNo.trim() === "") {
         newErrors.company = "Company is required";
      }

      // If there are validation errors, set them and show toaster
      if (Object.keys(newErrors).length > 0) {
         setErrors(newErrors);

         // Show validation errors via toaster
         const missingFields = [];
         if (newErrors.openPayable) missingFields.push("Open Payables");
         if (newErrors.company) missingFields.push("Company");

         setToasterType("error");
         setToasterMessage("Validation Error");
         setToasterDescription(
            `${missingFields.join(", ")} ${
               missingFields.length > 1 ? "are" : "is"
            } required`
         );
         return;
      }

      if (dueDate === "Open-Payables-in-Hold-Status" && !holdVoucher) {
         setToasterType("error");
         setToasterMessage("Warning");
         setToasterDescription("Please select a hold voucher status");
         return;
      }

      // Validation for date fields when specific report types are selected
      if (
         dueDate === "Open-Payables-By-Vendor-Discounts" ||
         dueDate === "Open-Payables-by-Vendor(Aged)"
      ) {
         const newErrors = {
            date1: date1.trim() ? "" : "Date 1 is required",
            date2: date2.trim() ? "" : "Date 2 is required",
            date3: date3.trim() ? "" : "Date 3 is required",
            date4: date4.trim() ? "" : "Date 4 is required",
         };

         setDateErrors(newErrors);

         // If any error exists, show toaster and stop form submission
         if (Object.values(newErrors).some((err) => err)) {
            const missingDates = [];
            if (newErrors.date1) missingDates.push("Date 1");
            if (newErrors.date2) missingDates.push("Date 2");
            if (newErrors.date3) missingDates.push("Date 3");
            if (newErrors.date4) missingDates.push("Date 4");

            setToasterType("error");
            setToasterMessage("Validation Error");
            setToasterDescription(
               `${missingDates.join(", ")} ${
                  missingDates.length > 1 ? "are" : "is"
               } required`
            );
            return;
         }
      }

      try {
         const postPayload = handleBuildApiParams("generate");
         const result = await openPayableGenerateReport(postPayload);
         setToasterType("success");
         setToasterMessage("Success");
         setToasterDescription(result.message);
         await handleGetOpenPayablesReportData(false); // Don't use filters after generation
      } catch (error) {
         console.error("Error generating report:", error);
         setToasterType("error");
         setToasterMessage("Error");
         setToasterDescription("Failed to generate report");
      }
   }

   async function onReset(): Promise<void> {
      setReportType("");
      setReportTypes("");
      setFileName("");
      // Clear filter date range on reset
      setFilterDateRange(null);
      // Clear all individual date fields
      setDate1("");
      setDate2("");
      setDate3("");
      setDate4("");
      // Clear other fields
      setHoldVoucher("");
      setPopulateSpreadsheet(false);
      setDateErrors({
         date1: "",
         date2: "",
         date3: "",
         date4: "",
      });
   }

   async function onResetHeader(): Promise<void> {
      setDueDate(undefined);
      setDateErrors({
         date1: "",
         date2: "",
         date3: "",
         date4: "",
      });
   }

   async function postRefreshList(): Promise<void> {
      await handleGetOpenPayablesReportData(false); // Refresh without filters, only company number
   }

   function handleViewClick(record: any): void {
      if (!record.filePath) {
         setToasterType("error");
         setToasterMessage("Warning");
         setToasterDescription("File path not available for preview");
         return;
      }

      if (record.fileType === "excel") {
         // Show Excel viewer modal
         setSelectedExcelFile({
            fileName: record.fileName || record.pdfFileName || "report.xls",
            filePath: record.filePath,
         });
         setExcelViewerVisible(true);
         return;
      }

      // For PDFs and other viewable files
      window.open(record.filePath, "_blank");
   }

   async function handleDownloadClick(record: any): Promise<void> {
      const success = await downloadFile({
         filePath: record.filePath,
         fileName: record.fileName,
         fileType: record.fileType,
      });

      if (!success) {
         setToasterType("error");
         setToasterMessage("Error");
         setToasterDescription("Failed to download file");
      }
   }

   const handleExcelDownload = () => {
      if (selectedExcelFile) {
         handleDownloadClick({
            filePath: selectedExcelFile.filePath,
            fileName: selectedExcelFile.fileName,
            fileType: "excel",
         });
         setExcelViewerVisible(false);
      }
   };

   const handleCloseExcelViewer = () => {
      setExcelViewerVisible(false);
      setSelectedExcelFile(null);
   };

   const columns: (ColumnType<OpenPayablesUI> & { filterable?: boolean })[] = [
   {
  title: "Actions",
  dataIndex: "",
  key: "actions",
  align: "center",
  render: (_, record) => {
    const fileType = (record?.reportFileType || "")
      .toString()
      .trim()
      .toUpperCase();
    const isViewDisabled = ["XLS", "XLSX"].includes(fileType);

    return (
      <div className="action-icons flex-all">
        <Tooltip
          title={
            isViewDisabled
              ? "View disabled"
              : `View ${record.fileType === "excel" ? "(Preview)" : ""}`
          }
        >
          <EyeOutlined
            className="action-icon"
            style={{
              cursor: isViewDisabled ? "not-allowed" : "pointer",
              opacity: isViewDisabled ? 0.5 : 1,
            }}
            onClick={() => {
              if (isViewDisabled) return;
              handleViewClick(record);
            }}
          />
        </Tooltip>

        <Tooltip
          title={`Download ${
            record.fileType === "excel" ? "Excel" : "PDF"
          }`}
        >
          <DownloadOutlined
            className="action-icon point-cursor"
            onClick={() => handleDownloadClick(record)}
          />
        </Tooltip>
      </div>
    );
  },
}
,
      {
         title: "File",
         dataIndex: "pdfFileName",
         key: "pdfFileName",
         ...getColumnSearchProps("pdfFileName", "Search File Name"),
         render: (fileName: string, record: any) => (
            <div className="flex-align">
               {record.fileType === "excel" ? (
                  <FileExcelOutlined
                     style={{ color: "#52c41a", marginRight: 8 }}
                  />
               ) : (
                  <FilePdfOutlined
                     style={{ color: "#ff4d4f", marginRight: 8 }}
                  />
               )}
               <span>{fileName}</span>
            </div>
         ),
         sorter: createPdfFileNameSorter("pdfFileName"),
      },
      {
         title: "Report Date & Time",
         dataIndex: "reportDateTime",
         key: "reportDateTime",
         ...getColumnSearchProps("reportDateTime", "Search Report Date"),
         sorter: createReportDateTimeSorter("reportDateTime"),
      },
      {
         title: "Report Type",
         dataIndex: "reportType",
         key: "reportType",
         
         ...getColumnSearchProps("reportType", "Search Report Type"),
         sorter: createReportTypeSorter("reportType"),
      },
      {
         title: "Report File Type",
         dataIndex: "reportFileType",
         key: "reportFileType",
         
         ...getColumnSearchProps("reportFileType", "Search File Type"),
         sorter: createReportFileTypeSorter("reportFileType"),
      },
      {
         title: "Status",
         dataIndex: "status",
         key: "status",
         
         ...getColumnSearchProps("status", "Search Status"),
         sorter: createStatusSafeSorter("status"),
         render: (status: string) => (
            <span
               className={`status-pill ${status?.toLowerCase() || "unknown"}`}
            >
               {status || "Unknown"}
            </span>
         ),
      },
   ];

   const handleDueDateChange = (value: string) => {
      setDueDate(value);
      setReportType(value);
      setHoldVoucher("");
      setDateRange(null);
      setDate1("");
      setDate2("");
      setDate3("");
      setDate4("");
      setDateErrors({
         date1: "",
         date2: "",
         date3: "",
         date4: "",
      });
   };

   // Date change handlers for custom DatePicker
   const handleDateChange = (name: string, value: string) => {
      switch (name) {
         case "date1":
            setDate1(value);
            break;
         case "date2":
            setDate2(value);
            break;
         case "date3":
            setDate3(value);
            break;
         case "date4":
            setDate4(value);
            break;
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
         <div>
            <div className="voucherentry-container">
               <h3 className="title">{OPEN_PAYABLES.title}</h3>
               <div className="content-div-container">
                  <div className="content-card-header flex-between">
                     <div className="filter-fields flex">
                        <div className="filter-item flex-col">
                           <label className="form-label required">
                              Open Payables
                           </label>
                           <div className="input-wrapper">
                              <CustomSelectDropdown
                                 name="openPayable"
                                 options={dueDateOptions}
                                 value={dueDate}
                                 onChange={handleDueDateChange}
                                 placeholder="Select Option"
                                 className="company-dropdown-cn"
                                 status={
                                    errors.openPayable ? "error" : undefined
                                 }
                              />
                           </div>
                        </div>
                        <div className="filter-item flex-col">
                           <div className="input-wrapper ">
                              <CompanyNo
                                 value={companyNo}
                                 onChange={setCompanyNo}
                              />
                           </div>
                        </div>
                        {dueDate === "Open-Payables-in-Hold-Status" && (
                           <div className="filter-item flex-col">
                              <label className="form-label required ">
                                 Hold Voucher
                              </label>
                              <div className="input-wrapper">
                                 <CustomSelectDropdown
                                    name="holdVoucher"
                                    options={holdVoucherOptions}
                                    value={holdVoucher}
                                    onChange={setHoldVoucher}
                                    placeholder={
                                       isHoldVoucherLoading
                                          ? "Loading..."
                                          : holdVoucherError
                                          ? "Error loading options"
                                          : "Select Hold Status"
                                    }
                                    className="ui-dropdown-vnn"
                                    disabled={
                                       isHoldVoucherLoading ||
                                       !!holdVoucherError
                                    }
                                 />
                              </div>
                           </div>
                        )}

                        {![
                           "Open-Payables-By-Vendor-Discounts",
                           "Open-Payables-by-Vendor(Aged)",
                        ].includes(dueDate) && (
                           <div className="filter-actions">
                              <CustomStyledButton
                                 name="applyFilters"
                                 label="Generate Report"
                                 onClick={onApply}
                                 disabled={loading}
                              />
                              <Tooltip title="Reset" placement="bottom">
                                 <SyncOutlined
                                    onClick={onResetHeader}
                                    className="action-icon"
                                 />
                              </Tooltip>
                           </div>
                        )}
                     </div>
                  </div>

                  {[
                     "Open-Payables-By-Vendor-Discounts",
                     "Open-Payables-by-Vendor(Aged)",
                  ].includes(dueDate) && (
                     <div className="">
                        <div className="flex-between">
                           <div className="due-dates-title">Due Dates</div>
                        </div>
                        <div className="date-fields-grid">
                           {(
                              ["Date 1", "Date 2", "Date 3", "Date 4"] as const
                           ).map((label, idx) => {
                              const dateErrorKeys = [
                                 "date1",
                                 "date2",
                                 "date3",
                                 "date4",
                              ] as const;
                              const errorKey = dateErrorKeys[idx];
                              const errorMsg = dateErrors[errorKey];
                              return (
                                 <div
                                    className="filter-item flex-col"
                                    key={label}
                                 >
                                    <label className="form-label required">
                                       {label}
                                    </label>
                                    <CustomDatePicker
                                       name={`date${idx + 1}`}
                                       value={[date1, date2, date3, date4][idx]}
                                       onChange={handleDateChange}
                                       className={`date-picker${
                                          errorMsg ? " error" : ""
                                       }`}
                                       status={errorMsg ? "error" : undefined}
                                    />
                                 </div>
                              );
                           })}
                        </div>
                        <div className="right-toggle-actions flex-end">
                           <div className="populate-spreadsheet-toggle sub-title">
                              <label className="toggle-label">
                                 Populate Spreadsheet
                              </label>
                              <Switch
                                 checked={populateSpreadsheet}
                                 onChange={setPopulateSpreadsheet}
                              />
                           </div>
                           <div className="filter-actions">
                              <CustomStyledButton
                                 name="applyFilters"
                                 label="Generate Report"
                                 onClick={onApply}
                                 disabled={loading}
                              />
                              <Tooltip title="Reset" placement="bottom">
                                 <SyncOutlined
                                    onClick={onReset}
                                    className="action-icon"
                                 />
                              </Tooltip>
                           </div>
                        </div>
                     </div>
                  )}
               </div>

               <div className="content-div-container">
                  <div className="content-card-body">
                     <div className="flex-between section-block">
                        <div>
                           {/* <h3>Open Payables {selectedDueDateLabel}</h3> */}
                           <h3>{PURCHASE_JOURNAL.genReports}</h3>
                        </div>
                        <div className="action-buttons flex-align">
                           <DefaultButton
                              name="postRefresh"
                              label={PURCHASE_JOURNAL.postRefresh}
                              onClick={postRefreshList}
                              icon={<ReloadOutlined />}
                              disabled={loading}
                           />
                        </div>
                     </div>
                     <Divider className="divider" />
                     <div className="section-block">
                        <ReportsFilterBar
                           type="Open-Payables"
                           reportType={reportTypes}
                           fileName={fileName}
                           dateRange={filterDateRange}
                           onDateRangeChange={setFilterDateRange}
                           onReportTypeChange={(val) => {
                              setReportTypes(val);
                              setReportType(val);
                           }}
                           onFileNameChange={handleFileNameChange}
                           onApply={async () => {
                              await handleGetOpenPayablesReportData(true);
                           }}
                           onReset={onReset}
                        />
                     </div>

                     <div className="table-responsive-container section-block">
                        <TableWidget<OpenPayablesUI>
                           columns={columns}
                           dataSource={reportData}
                           loading={loading}
                           rowKey="key"
                        />
                     </div>
                  </div>
               </div>
            </div>

            {selectedExcelFile && (
               <ExcelViewer
                  visible={excelViewerVisible}
                  onClose={handleCloseExcelViewer}
                  fileName={selectedExcelFile.fileName}
                  filePath={selectedExcelFile.filePath}
                  onDownload={handleExcelDownload}
               />
            )}
         </div>
      </>
   );
};

export default OpenPayables;
