import { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import { Tooltip } from "antd";
// import dayjs from "dayjs";
import {
   DownloadOutlined,
   EyeOutlined,
   FileExcelOutlined,
   FilePdfOutlined,
   FileTextOutlined,
} from "@ant-design/icons";
import type { ColumnType } from "antd/es/table";
import TableWidget from "@widget-library/Table";
import ExcelViewer from "@widget-library/ExcelViewer";
import type { PurchaseJournalEntry } from "@type-definitions/accounts-payable.types";
import { cleanFileName } from "@utils/formatters";
import {
   createPdfFileNameSorter,
   createReportDateTimeSorter,
   createReportTypeSorter,
   createReportFileTypeSorter,
   createStatusSafeSorter,
} from "@utils/sortingUtils";
import { getColumnSearchProps } from "@utils/tableFilters";
import { useFileDownload } from "@hooks/useFileDownload";
import ActionPermissionGuard from "@shared-components/permissions/ActionPermissionGuard";

export type PurchaseJournalTableProps = {
   fetchDataFn: () => Promise<any[]>;
   columnsOverride?: ColumnType<any>[];
   /**
    * Optional actionId to control VIEW (eye icon) permission.
    * When provided, users need at least R permission (via config)
    * to see the view icon enabled.
    */
   viewActionId?: string;
};

const PurchaseJournalTable = forwardRef(
   ({ fetchDataFn, columnsOverride, viewActionId }: PurchaseJournalTableProps, ref) => {
      const [tableData, setTableData] = useState<any[]>([]);
      const [loading, setLoading] = useState(false);
      const [excelViewerVisible, setExcelViewerVisible] = useState(false);
      const [selectedExcelFile, setSelectedExcelFile] = useState<{
         fileName: string;
         filePath: string;
      } | null>(null);
      const { downloadFileForReportsTable } = useFileDownload();

      const fetchReports = async () => {
         try {
            setLoading(true);
            const items = await fetchDataFn();
            setTableData(items);
         } catch (err) {
            console.error("Error fetching report data", err);
            setTableData([]);
         } finally {
            setLoading(false);
         }
      };

      useImperativeHandle(ref, () => ({
         refresh: fetchReports,
      }));

      useEffect(() => {
         fetchReports();
      }, []);

      const handleView = (
         filePath: string,
         fileType?: string,
         fileName?: string
      ) => {
         if (fileType === "excel") {
            // Show Excel viewer modal
            setSelectedExcelFile({
               fileName: cleanFileName(fileName) || cleanFileName(filePath.split("/").pop()) || "excel-report.xlsx",
               filePath: filePath,
            });
            setExcelViewerVisible(true);
            return;
         }

         // For PDFs, TXTs and other viewable files: open in new tab
         const anchor = document.createElement("a");
         anchor.href = filePath;
         anchor.target = "_blank";
         anchor.click();
      };

      const handleExcelDownload = () => {
         if (selectedExcelFile) {
            handleDownload({
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

      const handleDownload = async (record: any) => {
         await downloadFileForReportsTable({
            filePath: record.filePath,
            fileName:
               cleanFileName(record.fileName) ||
               cleanFileName((record.filePath || '').split('/').pop()),
            fileType: cleanFileName(record.fileType),
         });
      };

      const getFileTypeLabel = (fileType?: string): string => {
         if (fileType === "excel") return "Excel";
         if (fileType === "pdf") return "PDF";
         if (fileType === "txt") return "TXT";
         return "File";
      };

      const defaultColumns: (ColumnType<PurchaseJournalEntry> & {
         filterable?: boolean;
      })[] = [
         {
            title: "Actions",
            key: "action",
            align: "center",
            render: (_, record) => {
               const normalizedType = (
                  (record?.formType ?? record?.fileType) ?? ""
               )
                  .toString()
                  .trim()
                  .toUpperCase();
               const isViewDisabled =
                  normalizedType === "XLS" || normalizedType === "XLSX";

               const viewNode = (
                  <Tooltip
                     key={`view-${record.key}`}
                     title={
                        isViewDisabled
                           ? "View disabled"
                           : record.fileType === "excel"
                           ? "View Excel (Preview)"
                           : record.fileType === "pdf"
                           ? "View PDF"
                           : record.fileType === "txt"
                           ? "View TXT"
                           : "View File"
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
                           handleView(
                              record.filePath,
                              record.fileType,
                              record.fileName
                           );
                        }}
                     />
                  </Tooltip>
               );

               return (
                  <div className="action-icons flex-align">
                     {viewActionId ? (
                        <ActionPermissionGuard
                           actionId={viewActionId}
                           requireManage={false}
                        >
                           {viewNode}
                        </ActionPermissionGuard>
                     ) : (
                        viewNode
                     )}
                     <Tooltip
                        key={`download-${record.key}`}
                        title={`Download ${getFileTypeLabel(record.fileType)}`}
                     >
                        <DownloadOutlined
                           className="action-icon"
                           onClick={() => handleDownload(record)}
                        />
                     </Tooltip>
                  </div>
               );
            },
         },
         {
            title: "File",
            dataIndex: "pdfFileName",
            key: "pdfFileName",
            ...getColumnSearchProps("pdfFileName", "Search File Name"),
            render: (fileName: string, record: any) => (
               <div className="flex-align">
                  {record.fileType === "excel" ? (
                     <FileExcelOutlined
                        key={`excel-icon-${record.key}`}
                        style={{ color: "#52c41a", marginRight: 8 }}
                     />
                  ) : record.fileType === "txt" ? (
                     <FileTextOutlined
                        key={`txt-icon-${record.key}`}
                        style={{ color: "#1890ff", marginRight: 8 }}
                     />
                  ) : (
                     <FilePdfOutlined
                        key={`pdf-icon-${record.key}`}
                        style={{ color: "#ff4d4f", marginRight: 8 }}
                     />
                  )}
                  <span key={`filename-${record.key}`}>{fileName}</span>
               </div>
            ),
            sorter: createPdfFileNameSorter("pdfFileName"),
         },
         {
            title: "Report Date & Time",
            dataIndex: "reportDateTime",
            key: "reportDateTime",
            ...getColumnSearchProps("reportDateTime", "Search Date & Time"),
          
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
            dataIndex: "formType",
            key: "formType",
            ...getColumnSearchProps("formType" as any, "Search File Type"),
            sorter: createReportFileTypeSorter("reportFileType"),
         },
         {
            title: "Status",
            dataIndex: "status",
            key: "status",
            ...getColumnSearchProps("status", "Search Status"),
            sorter: createStatusSafeSorter("status"),
            render: (status: string, record: any) => (
               <span
                  key={`status-${record.key}`}
                  className={`status-pill ${
                     status?.toLowerCase() || "ready"
                  }`}
               >
                  {status || "Ready"}
               </span>
            ),
         },
      ];

      return (
         <>
            <TableWidget
               columns={columnsOverride || defaultColumns}
               dataSource={tableData}
               loading={loading}
               rowKey={(record: any) =>
                  record?.key || record?.filePath || `${record?.pdfFileName}-${record?.reportDateTime}`
               }
               
            />

            {selectedExcelFile && (
               <ExcelViewer
                  visible={excelViewerVisible}
                  onClose={handleCloseExcelViewer}
                  fileName={selectedExcelFile.fileName}
                  filePath={selectedExcelFile.filePath}
                  onDownload={handleExcelDownload}
               />
            )}
         </>
      );
   }
);

export default PurchaseJournalTable;
