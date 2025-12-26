import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Tooltip, message } from "antd";
import type { ColumnType } from "antd/es/table";
import { CustomSelectDropdown } from "@/widget-library/Dropdown";
import { CustomPrefixInput } from "@/widget-library/Input";
import { CustomStyledButton } from "@/widget-library/Buttons";
import TableWidget from "@/widget-library/Table";
import DeleteConfirmationModal from "@/widget-library/DeleteConfirmationModal";
import Update1099FileViewModal from "./Update1099FileViewModal";
import type {
   ApPeriodEndReportItem,
   Update1099FileData,
} from "@/types/accounts-payable.types";
import type { ApPeriodEndDto } from "@/api/api-schema/api";
import Toaster from "@/widget-library/Toaster";
import { useDropdownData } from "@/hooks/useDropdownData";
import { useApPeriodEnd } from "@/hooks/useApPeriodEnd";
import ActionPermissionGuard from "@shared-components/permissions/ActionPermissionGuard";
import {
   createTextSorter
} from "@/utils/sortingUtils";
import { getColumnSearchProps } from "@/utils/tableFilters";

const Update1099File: React.FC = () => {
   const navigate = useNavigate();

   // AP Period End custom hook
   const {
      fetchAllApPeriodEndReports,
      fetchApPeriodEndReports,
      softDeleteRecord,
      transform1099FileData,
   } = useApPeriodEnd();

   // Dropdown data hook for record types
   const { data: recordTypeOptions, isLoading: isLoadingRecordTypes } =
      useDropdownData("RECORD_TYPE_OPTIONS");

   // Filter states
   const [recordType, setRecordType] = useState<string>("");
   const [ctlNumber, setCtlNumber] = useState<string>("");
   const [tinNumber, setTinNumber] = useState<string>("");

   // Data and loading states
   const [allReportData, setAllReportData] = useState<Update1099FileData[]>([]);
   const [isTableLoading, setIsTableLoading] = useState<boolean>(false);

   // Pagination states
   const [currentPage, setCurrentPage] = useState<number>(1);
   const [pageSize, setPageSize] = useState<number>(10);
   const serverItemsPerPage = 500;
   const [hasMoreServerPages, setHasMoreServerPages] = useState<boolean>(true);
   const isAppendingRef = useRef<boolean>(false);

   // Modal states
   const [isViewModalVisible, setIsViewModalVisible] = useState<boolean>(false);
   const [selectedRecord, setSelectedRecord] =
      useState<Update1099FileData | null>(null);
   
   // Delete confirmation modal states
   const [showDeleteModal, setShowDeleteModal] = useState(false);
   const [selectedDeleteRecord, setSelectedDeleteRecord] = useState<Update1099FileData | null>(null);

   const [toasterType, setToasterType] = useState<
      "success" | "error" | "warning"
   >("success");
   const [toasterMessage, setToasterMessage] = useState<string>("");
   const [toasterDescription, setToasterDescription] = useState<string>("");

   // Fetch data from API
   const fetchTableData = async (page: number = 1, search: string = "", filters?: {
      recordType?: string;
      ctlNumber?: string;
      tinNumber?: string;
   }) => {
      try {
         setIsTableLoading(true);

         const queryParams: any = {
           current_page: page,
           items_per_page: serverItemsPerPage,
            search: search.trim() || undefined,
         };

         // Add filter parameters to query if provided
         if (filters?.recordType) {
            queryParams.recordType = filters.recordType;
         }
         if (filters?.ctlNumber) {
            queryParams.ctl = filters.ctlNumber;
         }
         if (filters?.tinNumber) {
            queryParams.tin = filters.tinNumber;
         }

         const response = await fetchAllApPeriodEndReports(queryParams);

         if (response?.items) {
            // Check if items is an array or single object
            let itemsArray: ApPeriodEndReportItem[] = [];

            if (Array.isArray(response.items)) {
               itemsArray = response.items;
            } else {
               // If it's a single object, wrap it in an array
               itemsArray = [response.items];
            }

            // Transform API data to match our interface
            const transformedData: Update1099FileData[] = transform1099FileData(itemsArray);

            if (isAppendingRef.current) {
               setAllReportData((prev) => [...prev, ...transformedData]);
               isAppendingRef.current = false;
            } else {
               setAllReportData(transformedData);
            }

            // Update hasMore flag based on last batch size
            setHasMoreServerPages((itemsArray?.length || 0) === serverItemsPerPage);
         } else {
            // Fallback to empty array if no data
            setAllReportData([]);
            setHasMoreServerPages(false);
         }
      } catch (error) {
         console.error("Error fetching 1099 data:", error);
         message.error("Failed to load 1099 data. Please try again.");
         // Set empty arrays on error - no fallback data
         setAllReportData([]);
         setHasMoreServerPages(false);
      } finally {
         setIsTableLoading(false);
      }
   };

   // Initialize data on component mount
   React.useEffect(() => {
      // Initial load
      fetchTableData(1);
   }, []);

   // Handle dynamic pagination like Voucher Maintenance
   const handlePaginationChange = async (page: number, size: number) => {
      setCurrentPage(page);
      setPageSize(size);

      const totalLoaded = allReportData.length;
      const neededCount = page * size;
      // Fetch when user reaches or goes beyond the last loaded page AND server indicates more pages exist
      if (neededCount >= totalLoaded && hasMoreServerPages) {
         const fetchedServerPages = Math.ceil(totalLoaded / serverItemsPerPage);
         const nextServerPage = fetchedServerPages + 1;

         try {
            isAppendingRef.current = true;
            const currentFilters = {
               recordType: recordType || undefined,
               ctlNumber: ctlNumber || undefined,
               tinNumber: tinNumber || undefined,
            };
            await fetchTableData(nextServerPage, "", currentFilters);
         } catch (err) {
            console.error("Error fetching additional 1099 records:", err);
            isAppendingRef.current = false;
         }
      }
   };

   // Handle action clicks
   const handleViewClick = async (record: Update1099FileData) => {
      try {
         setSelectedRecord(record);

         // Prepare query parameters based on the record data
         const queryParams = {
            tin: record.tin !== "-" ? record.tin : "",
            ctl: record.ctl !== "-" ? record.ctl : "",
         };

         const response = await fetchApPeriodEndReports(queryParams);

         if (response) {

            // Update the selected record with API data for the modal
            // Use response directly since items is undefined
            const updatedRecord = {
               ...record,
               ...response,
            };
            setSelectedRecord(updatedRecord);
            // Open the modal after successful API call
            setIsViewModalVisible(true);
         }
      } catch (error) {
         console.error("Error fetching AP Period End Reports:", error);
       
         // Still open the modal even if API call fails
         setIsViewModalVisible(true);
      }
   };

   const handleViewModalClose = () => {
      setIsViewModalVisible(false);
      setSelectedRecord(null);
   };

   const handleViewModalEdit = async () => {
      if (!selectedRecord) return;

      try {
         setIsViewModalVisible(false);

         // Prepare query parameters based on the selected record data
         const queryParams = {
            tin: selectedRecord.tin !== "-" ? selectedRecord.tin : "",
            ctl: selectedRecord.ctl !== "-" ? selectedRecord.ctl : "",
         };

         const response = await fetchApPeriodEndReports(queryParams);

         if (response) {
            // Use the fresh API data for editing
            const editData = {
               ...selectedRecord,
               ...response,
            };

            navigate("edit", { state: { editData } });
         } else {
            // If no data from API, use selected record data
            navigate("edit", { state: { editData: selectedRecord } });
         }
      } catch (error) {
         console.error(
            "Error fetching fresh record data for edit from modal:",
            error
         );
         message.error(
            "Failed to fetch latest record data. Using current data for editing."
         );
         // Fall back to using the selected record data
         navigate("edit", { state: { editData: selectedRecord } });
      } finally {
         // No loading state cleanup needed
      }
   };

   const handleEditClick = async (record: Update1099FileData) => {
      try {
         // Prepare query parameters based on the record data
         const queryParams = {
            tin: record.tin !== "-" ? record.tin : "",
            ctl: record.ctl !== "-" ? record.ctl : "",
         };

         const response = await fetchApPeriodEndReports(queryParams);

         if (response) {
            // Use the fresh API data for editing
            const editData = {
               ...record,
               ...response,
            };

            navigate("edit", { state: { editData } });
         }
      } catch (error) {
         console.error("Error fetching fresh record data for edit:", error);
         message.error(
            "Failed to fetch latest record data. Using current data for editing."
         );
         // Fall back to using the table data
         navigate("edit", { state: { editData: record } });
      } finally {
         // No loading state cleanup needed
      }
   };

   const handleDeleteClick = (record: Update1099FileData) => {
      // Check if record type is B (only B records can be deleted)
      if (record.recordType !== "B") {
         setToasterType("error");
         setToasterMessage("Delete Not Allowed");
         setToasterDescription(
            "This record type cannot be deleted. Only Record Type B can be deleted."
         );
         return;
      }

      // Show delete confirmation modal for Record Type B
      setSelectedDeleteRecord(record);
      setShowDeleteModal(true);
   };

   // Actual delete function called after confirmation
   const performDelete = async (record: Update1099FileData) => {
      try {
         // Prepare query parameters for soft delete
         const queryParams = {
            tin: record.tin !== "-" ? record.tin : "",
            ctl: record.ctl !== "-" ? record.ctl : "",
         };

         // Prepare body data for soft delete
         const deleteData: ApPeriodEndDto = {
            tin: record.tin !== "-" ? record.tin : "",
            ctl: record.ctl !== "-" ? record.ctl : "",
         };

         const response = await softDeleteRecord(queryParams, deleteData);

         if (response.status === 200) {
            setToasterType("success");
            setToasterMessage("Delete Successful");
            setToasterDescription(
               response.data?.items?.message || "Record deleted successfully"
            );

            // Refresh table data after successful deletion with current filters
            const currentFilters = {
               recordType: recordType || undefined,
               ctlNumber: ctlNumber || undefined,
               tinNumber: tinNumber || undefined,
            };
            fetchTableData(currentPage, "", currentFilters);
         } else {
            setToasterType("error");
            setToasterMessage("Delete Failed");
            setToasterDescription(
               response.data?.items?.message || "Failed to delete the record"
            );
         }
      } catch (error) {
         console.error("Error deleting record:", error);
         setToasterType("error");
         setToasterMessage("Delete Failed");
         setToasterDescription(
            "Failed to delete the record. Please try again."
         );
      }
   };

   // Apply filters function (server-side filtering via API)
   const handleApplyFilters = () => {
      const filters = {
         recordType: recordType || undefined,
         ctlNumber: ctlNumber || undefined,
         tinNumber: tinNumber || undefined,
      };

      // Reset to first page and clear loaded pages
      setCurrentPage(1);
      setHasMoreServerPages(true);
      isAppendingRef.current = false;
      fetchTableData(1, "", filters);
   };

  // Handle pagination changes
  /* const _handleTableChange = (page: number, pageSize?: number) => {
      setCurrentPage(page);
      if (pageSize && pageSize !== itemsPerPage) {
         setItemsPerPage(pageSize);
      }
      
      // Maintain current filters during pagination
      const currentFilters = {
         recordType: recordType || undefined,
         ctlNumber: ctlNumber || undefined,
         tinNumber: tinNumber || undefined,
      };
      
      fetchTableData(page, "", currentFilters);
   }; */

   // Table columns configuration with filterable support
   const columns: (ColumnType<Update1099FileData> & {
      filterable?: boolean;
   })[] = [
      {
         title: "Actions",
         dataIndex: "actions",
         key: "actions",
         align: "center",
         width: 120,
         render: (_: unknown, record: Update1099FileData) => (
            <div className="action-icons flex-align">
               <ActionPermissionGuard actionId="update-1099-file.view">
                  <Tooltip title="View">
                     <EyeOutlined
                        className="action-icon point-cursor"
                        onClick={() => handleViewClick(record)}
                     />
                  </Tooltip>
               </ActionPermissionGuard>
               <ActionPermissionGuard actionId="update-1099-file.edit">
                  <Tooltip title="Edit">
                     <EditOutlined
                        className="action-icon point-cursor"
                        onClick={() => handleEditClick(record)}
                     />
                  </Tooltip>
               </ActionPermissionGuard>
               <ActionPermissionGuard actionId="update-1099-file.delete">
                  <Tooltip title="Delete">
                     <DeleteOutlined
                        className="action-icon point-cursor"
                        onClick={() => handleDeleteClick(record)}
                     />
                  </Tooltip>
               </ActionPermissionGuard>
            </div>
         ),
      },
      {
         title: "Record Type",
         dataIndex: "recordType",
         key: "recordType",
         
         sorter: createTextSorter("recordType"),
         ...getColumnSearchProps("recordType", "Search Record Type"),
      },
      {
         title: "Ctl#",
         dataIndex: "ctl",
         key: "ctl",
         
         sorter: createTextSorter("ctl"),
         ...getColumnSearchProps("ctl", "Search Ctl#"),
      },
      {
         title: "Tin#",
         dataIndex: "tin",
         key: "tin",
         
         sorter: createTextSorter("tin"),
         ...getColumnSearchProps("tin", "Search Tin#"),
      },
      {
         title: "First Payee Name",
         dataIndex: "firstPayeeName",
         key: "firstPayeeName",
         
         sorter: createTextSorter("firstPayeeName"),
         ...getColumnSearchProps("firstPayeeName", "Search First Payee Name"),
      },
   ];

   return (
      <div className="voucherentry-container">
         <h3 className="title">Update 1099 File</h3>
         <div className="content-div-container">
            {/* Filter Bar */}
            <div className="filter-grids-container">
               <div className="filter-field">
                  <p className="sub-title">Record Type</p>
                  <CustomSelectDropdown
                     name="recordType"
                     options={
                        recordTypeOptions?.map((option) => ({
                           label: option.label || "",
                           value: option.value || "",
                        })) || []
                     }
                     value={recordType}
                     onChange={setRecordType}
                     placeholder="All"
                     className="ui-dropdown-cn"
                     loading={isLoadingRecordTypes}
                     dropdownMatchSelectWidth={false}
                     dropdownStyle={{
                        minWidth: 'fit-content',
                        maxWidth: '300px'
                     }}
                  />
               </div>
               <div className="filter-field">
                  <p className="sub-title">Ctl#</p>
                <CustomPrefixInput
                     name="ctlNumber"
                     placeholder="Enter Ctl#"
                     value={ctlNumber}
                     onChange={(e) => {
                        const value = e.target.value;
                        // Hardstop: Only allow exactly 4 characters for CTL#
                        if (value.length <= 4) {
                           setCtlNumber(value);
                        } else {
                           // Show validation toaster if user tries to add extra characters
                           setToasterType("warning");
                           setToasterMessage("Invalid Input");
                           setToasterDescription("CTL# cannot exceed 4 characters");
                        }
                     }}
                     className="custom-input"
                  />
               </div>
               <div className="filter-field">
                  <p className="sub-title">Tin#</p>
                 <CustomPrefixInput
                     name="tinNumber"
                     placeholder="Enter Tin#"
                     value={tinNumber}
                     onChange={(e) => {
                        const value = e.target.value;
                        // Hardstop: Only allow exactly 9 characters for TIN#
                        if (value.length <= 9) {
                           setTinNumber(value);
                        } else {
                           // Show validation toaster if user tries to add extra characters
                           setToasterType("warning");
                           setToasterMessage("Invalid Input");
                           setToasterDescription("TIN# cannot exceed 9 characters");
                        }
                     }}
                     className="custom-input"
                  />
               </div>
                <div className="btn-field">
                  <CustomStyledButton
                     name="applyFilters"
                     label={<span>Apply Filters</span>}
                     onClick={handleApplyFilters}
                  />
               </div>
            </div>

            {/* Data Table */}
            <div className="table-responsive-container">
            <TableWidget<Update1099FileData>
                  columns={columns}
                  dataSource={allReportData}
                  rowKey="key"
                  loading={isTableLoading}
                  pagination={{
                     current: currentPage,
                     pageSize: pageSize,
                     total: allReportData.length,
                     showSizeChanger: true,
                     showQuickJumper: true,
                     showTotal: (total) => `Total ${total} records`,
                     onChange: handlePaginationChange,
                  }}
               />
            </div>
         </div>
         {/* View Modal */}
         <Update1099FileViewModal
            visible={isViewModalVisible}
            onClose={handleViewModalClose}
            onEdit={handleViewModalEdit}
            data={selectedRecord}
         />

         {/* Delete Confirmation Modal */}
         {selectedDeleteRecord && (
            <DeleteConfirmationModal
               visible={showDeleteModal}
               onCancel={() => {
                  setShowDeleteModal(false);
                  setSelectedDeleteRecord(null);
               }}
               onConfirm={async () => {
                  await performDelete(selectedDeleteRecord);
                  setShowDeleteModal(false);
                  setSelectedDeleteRecord(null);
               }}
               itemName="1099 Record"
            />
         )}

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
};

export default Update1099File;
