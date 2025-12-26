import React, { useState, useEffect, useRef } from "react";
import {
   EyeOutlined,
   DownloadOutlined,
   FileExcelOutlined,
   FilePdfOutlined,
   FileTextOutlined,
} from "@ant-design/icons";
import { Tooltip, Button } from "antd";
import type { ColumnType } from "antd/es/table";
import TableWidget from "@widget-library/Table";
import { useApPeriodEnd } from "@hooks/useApPeriodEnd";
import {
   createPdfFileNameSorter,
   createReportDateTimeSorter,
   createReportTypeSorter,
   createReportFileTypeSorter,
   createStatusSorter,
} from "@utils/sortingUtils";
import { getColumnSearchProps } from "@utils/tableFilters";
import { useFileDownload } from "@hooks/useFileDownload";
import ActionPermissionGuard from "@shared-components/permissions/ActionPermissionGuard";
 
interface FileData {
   key: string;
   reportType?: string;
   fileName?: string;
   reportDateTime?: string;
   filePath?: string;
   // Adding these for backward compatibility with existing columns
   formType?: string;
   reportFile?: string;
   status: "Ready" | "Processing" | "Error";
   fileType?: string;
}
 
interface PaginationInfo {
   total_items?: number;
   current_page?: number;
   items_per_page?: number;
   total_pages?: number;
}

const ReviewFiles: React.FC = () => {
   // AP Period End custom hook
   const { 
      fetchYearEndProcessMenuReviewFiles,
      transformReviewFilesData 
   } = useApPeriodEnd();
   const { downloadFileForReview } = useFileDownload();

   const [fileData, setFileData] = useState<FileData[]>([]);
   const [loading, setLoading] = useState(false);
   const [_loadingMore, _setLoadingMore] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [pagination, setPagination] = useState<PaginationInfo>({
      current_page: 1,
      items_per_page: 10,
      total_items: 0,
      total_pages: 0,
   });
 
   // Ref to track if initial fetch has been made
   const hasInitialFetch = useRef(false);
 
   // Static company number - you may want to get this from props or context
   const companyNo = 10;
   const reportType = "Printing-1099-File";
   // Fetch review files from API (initial load only)
   const fetchReviewFiles = async () => {
      setLoading(true);
      setError(null);
 
      try {
         const queryParams = {
            companyNo,
            reportType,
         };

         const result = await fetchYearEndProcessMenuReviewFiles(queryParams);

         if (result) {
            const newData = transformReviewFilesData(result.items || []);
            setFileData(newData);

            // Set initial pagination state
            setPagination({
               current_page: 1,
               items_per_page: newData.length,
               total_items: newData.length,
               total_pages: Math.ceil(newData.length / 10),
            });
         }
      } catch (err) {
         console.error("Error fetching review files:", err);
         setError("Failed to load review files. Please try again.");
      } finally {
         setLoading(false);
      }
   };
   // Fetch additional data when needed for pagination
   /* const fetchMoreData = async (page: number, pageSize: number = 500) => {
      setLoadingMore(true);
      setError(null);
 
      try {
         const queryParams = {
            companyNo,
            reportType,
            current_page: page,
            items_per_page: pageSize,
         };
 
         const result = await fetchYearEndProcessMenuReviewFiles(queryParams);

         if (result) {
            const newData = transformReviewFilesData(result.items || []);

            // Append new data to existing data
            setFileData((prevData) => [...prevData, ...newData]);

            // Update pagination with new total
            setPagination((prev) => ({
               ...prev,
               total_items: (prev.total_items || 0) + newData.length,
               total_pages: Math.ceil(
                  ((prev.total_items || 0) + newData.length) /
                     (prev.items_per_page || 10)
               ),
            }));
         }
      } catch (err) {
         console.error("Error fetching more data:", err);
         setError("Failed to load more data. Please try again.");
      } finally {
         setLoadingMore(false);
      }
   }; */
 
   // Check if we need to fetch more data for the requested page
   /* const checkAndFetchMoreData = (page: number, size: number) => {
      const totalItemsNeeded = page * size;
      const currentTotalItems = fileData.length;
 
      // Check if we need more data for the requested page
      if (totalItemsNeeded > currentTotalItems) {
         // Calculate how many more records we need
         const nextApiPage = Math.floor(currentTotalItems / 500) + 1;
 
         // Set loading state for fetching more data
         setLoadingMore(true);
 
         // Fetch next batch of 500 records
         fetchMoreData(nextApiPage, 500);
         return true; // Indicates we're fetching more data
      }
 
      // Also check if user clicked on the last available page
      const currentLastPage = Math.ceil(currentTotalItems / size);
      if (page === currentLastPage && page > 1) {
         // User clicked on the last available page, fetch more data proactively
         const nextApiPage = Math.floor(currentTotalItems / 500) + 1;
 
         // Set loading state for fetching more data
         setLoadingMore(true);
 
         // Fetch next batch of 500 records
         fetchMoreData(nextApiPage, 500);
         return true; // Indicates we're fetching more data
      }
 
      return false; // No need to fetch more data
   }; */
 
  // Handle pagination change
  /* const _handlePaginationChange = (page: number, size: number) => {
      // Check if we need to fetch more data for this page
      const needsMoreData = checkAndFetchMoreData(page, size);
 
      if (!needsMoreData) {
         // No need to fetch more data, just update pagination
         setPagination((prev) => ({
            ...prev,
            current_page: page,
            items_per_page: size,
            total_pages: Math.ceil(fileData.length / size),
         }));
      } else {
         // We're fetching more data, wait for it to complete
         // The fetchMoreData function will update pagination after completion
         // We'll navigate to the requested page after the data is loaded
         setTimeout(() => {
            // After data is loaded, navigate to the requested page
            setPagination((prev) => ({
               ...prev,
               current_page: page,
               items_per_page: size,
               total_pages: Math.ceil((prev.total_items || 0) / size),
            }));
         }, 100); // Small delay to ensure data is loaded
      }
   }; */
 
   // Get paginated data from the full dataset
   const getPaginatedData = (
      data: FileData[],
      page: number,
      pageSize: number
   ) => {
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      return data.slice(startIndex, endIndex);
   };
 
   // Get current page data
   const currentPageData = getPaginatedData(
      fileData,
      pagination.current_page || 1,
      pagination.items_per_page || 10
   );
 
   // Fetch data on component mount
   useEffect(() => {
      if (!hasInitialFetch.current) {
         fetchReviewFiles();
         hasInitialFetch.current = true;
      }
   }, []);
 
   const handleViewFile = (record: FileData) => {
      if (!record.filePath) return;
      // Open PDFs, TXTs and other viewable files in new tab
      window.open(record.filePath, "_blank");
   };
 
   const handleDownloadFile = async (record: FileData) => {
      await downloadFileForReview({
         filePath: record.filePath || "",
         fileName: record.fileName,
      });
   };

   const getFileTypeLabel = (fileType?: string): string => {
      if (fileType === "excel") return "Excel";
      if (fileType === "pdf") return "PDF";
      if (fileType === "txt") return "TXT";
      return "File";
   };

   const columns: (ColumnType<FileData> & { filterable?: boolean })[] = [
      {
         title: "Actions",
         dataIndex: "",
         width: 100,
         render: (_, record) => {
            const normalizedType = (record?.formType || record?.fileType || "")
               .toString()
               .trim()
               .toUpperCase();
            const isViewDisabled = normalizedType === "XLS" || normalizedType === "XLSX";
            return (
               <div className="action-icons flex-align">
                  <ActionPermissionGuard actionId="year-end-1099-process.review-files.view">
                     <Tooltip
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
                        className="table-tooltip action-tooltip point-cursor"
                     >
                        <EyeOutlined
                           className="action-icon"
                           style={{
                              cursor: isViewDisabled ? "not-allowed" : "pointer",
                              opacity: isViewDisabled ? 0.5 : 1,
                           }}
                           onClick={() => {
                              if (isViewDisabled) return;
                              handleViewFile(record);
                           }}
                        />
                     </Tooltip>
                  </ActionPermissionGuard>
                  <ActionPermissionGuard actionId="year-end-1099-process.review-files.download">
                     <Tooltip
                        title={`Download ${getFileTypeLabel(record.fileType)}`}
                        className="table-tooltip action-tooltip point-cursor"
                     >
                        <DownloadOutlined
                           className="action-icon"
                           onClick={() => handleDownloadFile(record)}
                        />
                     </Tooltip>
                  </ActionPermissionGuard>
               </div>
            );
         },
      },
      {
         title: "File Name",
         dataIndex: "fileName",
         key: "fileName",
         align: "left",
         sorter: createPdfFileNameSorter("fileName"),
         ...getColumnSearchProps("fileName", "Search File Name"),
         render: (fileName: string, record: FileData) => (
            <div className="flex-align">
               {record.fileType === "excel" ? (
                  <FileExcelOutlined
                     style={{ color: "#52c41a", marginRight: 8 }}
                  />
               ) : record.fileType === "txt" ? (
                  <FileTextOutlined
                     style={{ color: "#1890ff", marginRight: 8 }}
                  />
               ) : (
                  <FilePdfOutlined
                     style={{ color: "#ff4d4f", marginRight: 8 }}
                  />
               )}
               <span>{fileName}</span>
            </div>
         ),
      },
 
      {
         title: "Report Date",
         dataIndex: "reportDateTime",
         key: "reportDateTime",
         sorter: createReportDateTimeSorter("reportDateTime"),
         ...getColumnSearchProps("reportDateTime", "Search Report Date"),
      },
      {
         title: "Report Type",
         dataIndex: "reportType",
         key: "reportType",
         sorter: createReportTypeSorter("reportType"),
         ...getColumnSearchProps("reportType", "Search Report Type"),
      },
      {
         title: "Report File Type",
         dataIndex: "formType",
         key: "formType",
         align: "left",
         sorter: createReportFileTypeSorter("formType"),
         ...getColumnSearchProps("formType", "Search Report File"),
      },
      {
         title: "Status",
         dataIndex: "status",
         key: "status",
         align: "left",
         render: (status: string) => (
            <span className={`status-pill ${status.toLowerCase()}`}>
               {status}
            </span>
         ),
         sorter: createStatusSorter("status"),
         ...getColumnSearchProps("status", "Search Status"),
      },
   ];
 
   return (
      <div className="content-card-body">
         {error && (
            <div
               className="error-message"
               style={{ marginBottom: "16px", color: "#ff4d4f" }}
            >
               {error}
               <Button
                  type="link"
                  onClick={() => fetchReviewFiles()}
                  style={{ marginLeft: "8px" }}
               >
                  Try Again
               </Button>
            </div>
         )}
 
         <div className="table-responsive-container centered-header">
            <TableWidget
               columns={columns}
               dataSource={currentPageData}
               rowKey="key"
               loading={loading}
              
            />
 
            {_loadingMore && (
               <div
                  style={{
                     textAlign: "center",
                     padding: "16px",
                     color: "#666",
                     borderTop: "1px solid #f0f0f0",
                  }}
               >
                  Loading more data...
               </div>
            )}
         </div>
      </div>
   );
};
 
export default ReviewFiles;
 
 