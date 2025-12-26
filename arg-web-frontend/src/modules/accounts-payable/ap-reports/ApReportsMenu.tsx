import React, { useRef, useState } from "react";
import type { Dayjs } from "dayjs";
import { ReloadOutlined, SyncOutlined } from "@ant-design/icons";
import { Divider, Tooltip } from "antd";
import { REPORTS_LABEL } from "@constants/commonConstants";
import CustomDatePicker from "@widget-library/DatePicker";
// import CustomRangePicker from "@shared-components/date-range/RangePicker";
import CompanyNo from "@shared-components/company-number/CompanyNo";
import {
   CustomStyledButton,
   DefaultButton,
} from "@widget-library/Buttons";

import "./ap-report-menu.scss";
import ReportsFilterBar from "@shared-components/report-filter-bar/ReportsFilterBar";
import PurchaseJournalTable from "@shared-components/reports-table/ReportsTable";
import type { SubmitReportsMenuPayload } from "@api/api-schema/api";
import ReportType from "@/shared-components/report-type/ReportType";
import dayjs from "dayjs";
import Toaster from "../../../widget-library/Toaster";
import { useApReportsMenu } from "@/hooks/useApReportsMenu";
import ActionPermissionGuard from "@shared-components/permissions/ActionPermissionGuard";

function AP_ReportsMenu() {
   // AP Reports Menu custom hook
   const { submitReportsMenu, fetchReportsMenu } = useApReportsMenu();

   // State for Generate Report section
   const [reportDate, setReportDate] = useState<string | null>(null);

   // State for Apply Filter section
   const [dateRange, setDateRange] = useState<
      [Dayjs | null, Dayjs | null] | null
   >(null);

   const [companyNo, setCompanyNo] = useState("10");
   const [reportType, setReportType] = useState<string>("");
   const [reportGenerateType, setReportGenerateType] = useState<string>(
      "AP-Month-End-Vendor-Details"
   );
   const [fileName, setFileName] = useState<string>("");
   const [_showValidationErrors, _setShowValidationErrors] = useState(false);

   // Toaster state
   const [toasterType, setToasterType] = useState<
      "error" | "success" | "warning" | "batch"
   >("error");
   const [toasterMessage, setToasterMessage] = useState<string>("");
   const [toasterDescription, setToasterDescription] = useState<string>("");

   const tableRef = useRef<{ refresh: (data?: any) => void }>(null);

   const handleGenerateReport = async () => {
      // Check if any required fields are missing (Generate Report uses reportDate)
      if (
         !companyNo ||
         companyNo.trim() === "" ||
         !reportDate ||
         reportDate.trim() === "" ||
         !reportGenerateType ||
         reportGenerateType.trim() === ""
      ) {
         _setShowValidationErrors(true);

         // Show error via toaster
         setToasterType("error");
         setToasterMessage("Validation Error");

         // Build specific error message based on missing fields
         const missingFields = [];
         if (!reportGenerateType || reportGenerateType.trim() === "")
            missingFields.push("Report Type");
         if (!reportDate || reportDate.trim() === "")
            missingFields.push("Report Date");
         if (!companyNo || companyNo.trim() === "")
            missingFields.push("Company");

         setToasterDescription(
            `${missingFields.join(", ")} ${
               missingFields.length > 1 ? "are" : "is"
            } required`
         );
         return;
      }

      // Clear validation errors if all fields are valid
      _setShowValidationErrors(false);

      try {
         // Use outstandingCheckDate for Outstanding-Check-Register, reportDate for others
         const formattedDate = dayjs(reportDate).format("MMDDYY");

         const payload: SubmitReportsMenuPayload =
            reportGenerateType === "Outstanding-Check-Register"
               ? {
                    companyNo: Number(companyNo),
                    outstandingCheckDate: formattedDate,
                    reportType: reportGenerateType,
                 }
               : {
                    companyNo: Number(companyNo),
                    reportDate: formattedDate,
                    reportType: reportGenerateType,
                 };

         await submitReportsMenu(payload);

         // Refresh the reports list after successful generation
         postRefreshList();

         // optional: show success message
      } catch (error: any) {
         console.error("Failed to submit report generation", error);
         // Map API error directly to toaster (no client-side messages)
         const apiError =
            error?.response?.data?.error ||
            error?.error?.error ||
            error?.error ||
            null;

         const title = (apiError && apiError.message) || (typeof error?.message === "string" ? error.message : "");
         const description = Array.isArray(apiError?.details)
            ? apiError.details
                 .map((d: any) => d?.message)
                 .filter(Boolean)
                 .join(", ")
            : "";

         setToasterType("error");
         setToasterMessage(title);
         setToasterDescription(description);
      }
   };

   const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFileName(e.target.value);
   };

   const handleDateRangeChange = (
      dates: [Dayjs | null, Dayjs | null] | null
   ) => {
      setDateRange(dates);
   };

   const postRefreshList = () => {
      tableRef.current?.refresh();
   };
   // Header reset - only clears header fields
   const handleHeaderReset = () => {
      setReportDate(null);
      setCompanyNo("10");
      setReportGenerateType("");
      _setShowValidationErrors(false);
      // Clear toaster
      setToasterMessage("");
      setToasterDescription("");
   };

   // Filter reset - only clears filter fields
   const handleFilterReset = () => {
      setReportType("");
      setFileName("");
      setDateRange(null);
   };
   const fetchReportMenuData = async () => {
      // Format dates for API if dateRange is selected (Apply Filter uses dateRange)
      const startDate = dateRange?.[0]?.format("MMDDYY") || "";
      const endDate = dateRange?.[1]?.format("MMDDYY") || "";

      const queryParams = {
         companyNo: 10,
         reportType: reportType || "",
         fileName: fileName,
         startDate: startDate,
         endDate: endDate,
      };

      return await fetchReportsMenu(queryParams);
   };

   const handleApply = async () => {
      postRefreshList();
   };

   return (
      <div className="voucherentry-container">
         <h4>A/P Reports Menu</h4>

         <div className="content-div-container">
            <div className="report-filter-grid">
               {/* Report Type */}
               <div>
                  <ReportType
                     value={reportGenerateType}
                     onChange={setReportGenerateType}
                     type="AP-MONTH-END"
                     isRequired={true}
                  />
               </div>

               {/* Report Date (Single Date for Generate Report) */}
               <div>
                  <p className="sub-title">
                     <span className=" astricks">*</span>&nbsp;Report Date
                  </p>
                  <CustomDatePicker
                     name="Report Date"
                     value={reportDate ?? undefined}
                     onChange={(_, dateStr) => {
                        setReportDate(dateStr);
                     }}
                     className="custom-input"
                  />
               </div>

               {/* Company No */}
               <div>
                  <CompanyNo value={companyNo} onChange={setCompanyNo} />
               </div>

               {/* Generate Button and Reset Icon */}
               <div className="button-icon-group">
                  <div className="button-wrapper">
                     <ActionPermissionGuard actionId="ap-reports.generate-report">
                        <CustomStyledButton
                           name="generateReport"
                           label={<h6>{REPORTS_LABEL.BUTTON_LABELS}</h6>}
                           onClick={handleGenerateReport}
                        />
                     </ActionPermissionGuard>
                  </div>
                  <div className="icon-wrapper">
                     <Tooltip title="Reset" placement="bottom">
                        <SyncOutlined
                           onClick={handleHeaderReset}
                           className="action-icon"
                        />
                     </Tooltip>
                  </div>
               </div>
            </div>
         </div>

         <div className="content-div-container">
            <div className="content-card-body">
               <div className="flex-between">
                  {/* <h3>
              {reportGenerateType === "AP-Monthly-Audit-Report"
        ? REPORTS_LABEL.title
        : REPORTS_LABEL.outstandingTitle}
            </h3> */}
                  <h3>Generated Reports</h3>
                  <div className="action-buttons flex-align">
                     <DefaultButton
                        name="postRefresh"
                        label={REPORTS_LABEL.postRefresh}
                        onClick={postRefreshList}
                        icon={<ReloadOutlined />}
                     />
                  </div>
               </div>
            </div>
            <Divider className="divider" />
            <ReportsFilterBar
               reportType={reportType}
               fileName={fileName}
               dateRange={dateRange}
               type="AP-MONTH-END"
               onReportTypeChange={setReportType}
               onFileNameChange={handleFileNameChange}
               onDateRangeChange={handleDateRangeChange}
               onApply={handleApply}
               onReset={handleFilterReset}
               applyActionId="ap-reports.apply-filters" 
            />
            <div className="table-margin">
               <div className="table-responsive-container">
                  <PurchaseJournalTable
                     ref={tableRef}
                     fetchDataFn={fetchReportMenuData}
                     viewActionId="ap-reports.view"
                  />
               </div>
            </div>
         </div>

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
      </div>
   );
}

export default AP_ReportsMenu;
