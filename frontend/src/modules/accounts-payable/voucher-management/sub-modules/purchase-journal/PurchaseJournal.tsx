import React, { useRef, useState } from "react";
import type { Dayjs } from "dayjs";

import "./purchase-journal.scss";
import type { Props } from "@type-definitions/accounts-payable.types";
import { PURCHASE_JOURNAL } from "@constants/commonConstants";
import ReportsFilterBar from "@shared-components/report-filter-bar/ReportsFilterBar";
import { DefaultButton } from "@widget-library/Buttons";
import { ReloadOutlined } from "@ant-design/icons";
import PurchaseJournalTable from "@shared-components/reports-table/ReportsTable";
import { usePurchaseJournalReports } from "@hooks/usePurchaseJournal";

const PurchaseJournal: React.FC<Props> = () => {
   const [reportType, setReportType] = useState<string>("");
   const [fileName, setFileName] = useState<string>("");
   const [dateRange, setDateRange] = useState<
      [Dayjs | null, Dayjs | null] | null
   >(null);

   const tableRef = useRef<{ refresh: (data?: any) => void }>(null);

   // Format dates for API if dateRange is selected
   const startDate = dateRange?.[0]?.format("MMDDYY") || "";
   const endDate = dateRange?.[1]?.format("MMDDYY") || "";

   // React Query hook with exact same query parameters
   const {
      refetch: refetchPurchaseJournal,
      isLoading: _isLoading,
   } = usePurchaseJournalReports({
      companyNo: 10,
      reportType: reportType || "",
      fileName: fileName,
      startDate: startDate,
      endDate: endDate,
   });

   const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFileName(e.target.value);
   };

   const handleDateRangeChange = (
      dates: [Dayjs | null, Dayjs | null] | null
   ) => {
      setDateRange(dates);
   };

   const handleReset = () => {
      setReportType("");
      setFileName("");
      setDateRange(null);
   };

   const postRefreshList = () => {
      refetchPurchaseJournal();
      // Add a small delay to ensure React Query refetch completes
      setTimeout(() => {
         tableRef.current?.refresh();
      }, 100);
   };
   const fetchPurchaseJournalReports = async () => {
      // Always trigger refetch to ensure we get the latest data
      const result = await refetchPurchaseJournal();
      return result.data || [];
   };
   const handleApply = async () => {
      postRefreshList();
   };

   return (
      <div>
         <div className="voucherentry-container">
            <h3 className="title">{PURCHASE_JOURNAL.title}</h3>

            <div className="content-div-container">
               <div className="content-card-header flex-between">
                  <div className="flex">
                     <h5>{PURCHASE_JOURNAL.purchaseJournalPrompt}</h5>
                     <div className="info-icon"></div>
                  </div>
               </div>
               <ReportsFilterBar
                  type="Voucher-Posting"
                  reportType={reportType}
                  fileName={fileName}
                  dateRange={dateRange}
                  onReportTypeChange={setReportType}
                  onFileNameChange={handleFileNameChange}
                  onDateRangeChange={handleDateRangeChange}
                  onApply={handleApply}
                  onReset={handleReset}
               />
            </div>

            <div className="content-div-container">
               <div className="content-card-body">
                  <div className="flex-between">
                     <div>
                        <h5>{PURCHASE_JOURNAL.title}</h5>
                        <p className="sub-text p-xs">
                           {PURCHASE_JOURNAL.genReports}
                        </p>
                     </div>
                     <div className="action-buttons flex-align">
                        <DefaultButton
                           name="postRefresh"
                           label={PURCHASE_JOURNAL.postRefresh}
                           onClick={postRefreshList}
                           icon={<ReloadOutlined />}
                        />
                     </div>
                  </div>

                  <div className="table-responsive-container">
                     <PurchaseJournalTable
                        ref={tableRef}
                        fetchDataFn={fetchPurchaseJournalReports}
                     />
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default PurchaseJournal;
