import React, { useState } from "react";
import { Tooltip } from "antd";
import Toaster from "@/widget-library/Toaster";
import { EyeOutlined, EditOutlined } from "@ant-design/icons";
import type { ColumnType } from "antd/es/table";
import { CustomStyledButton } from "@/widget-library/Buttons";
import { CustomSelectDropdown } from "@/widget-library/Dropdown";
import TableWidget from "@/widget-library/Table";
import type { UpdateVendorByYearData } from "@/types/accounts-payable.types";
import { useApPeriodEnd } from "@/hooks/useApPeriodEnd";
// import { formatCurrency } from "@/utils/formatters";
// import { formatMMDDYYForDisplay } from "@/utils/dateFormat";
import type {
   // VendorApiResponse,
   Vendor1099Data,
   VendorData,
} from "@/types/accounts-payable.types";
import VendorViewModal from "../../../vendor-managment/vendor-master-inquiry/VendorViewModal";
import AddVendor from "../../../vendor-managment/vendor-master-inquiry/add-vendor/AddVendor";
import {
   createNumericSorter,
   createVendorNameSorter,
   createTextSorter,
   createCustomDateSorter,
   createStatusSorter,
   createInvoiceAmountSorter,
} from "@/utils/sortingUtils";
import {
   getColumnSearchProps,
   createNumericFilter,
} from "@/utils/tableFilters";
// import { formatPhoneNumber } from "@utils/MobilenumberFormat";
import ModalContent from "@/widget-library/Modal";
import { modalActions } from "@/constants/commonConstants";
import popupOk from "@/assets/icons/popup-ok.svg";
import {
   buildApiErrorNotification,
   normalizeGlAccountErrorMessage,
} from "@/utils/apiErrorUtils";
import ActionPermissionGuard from "@/shared-components/permissions/ActionPermissionGuard";

// Note: handleApiError function moved inside the component to access state

/* const getVendorType = (vendor: VendorApiResponse): string => {
   const holdPayments = vendor.vendorHoldPaymentsVend?.trim() || "";
   const ap1099Code = vendor.vendorAp1099Code?.trim() || "";
   const categoryCode = vendor.vendorCategoryCode?.trim() || "";

   if (holdPayments === "Y" || holdPayments === "H") return "Hold";
   if (ap1099Code === "V" || ap1099Code === "Y") return "1099";
   if (categoryCode === "INACT") return "Inactive";
   return "Regular";
}; */

/* const getVendorStatus = (isDeleted?: string): string => {
   const status = isDeleted?.trim() || "";
   return status === "Inactive" || status === "D" || status === "Y"
      ? "Inactive"
      : "Active";
}; */

// Transform API response to display format (matching VendorMaster pattern)
/* const _transformVendorData = (
   vendors: VendorApiResponse[],
   apiPage: number
): Vendor1099Data[] => {
   return vendors.map((vendor, index) => ({
      key: `${vendor.vendorNo || index}_${apiPage}_${index}`,
      vendorNo: vendor.vendorNo || 0,
      vendorName:
         vendor.vendorName?.trim() || `Vendor ${vendor.vendorNo || index}`,
      telephone: formatPhoneNumber(
         vendor.vendorAreaCode,
         vendor.vendorTelephoneNo
      ),
      lastPmtAmt: formatCurrency(vendor.vendorLastPaymentAmt),
      lastPmtDate: formatMMDDYYForDisplay(vendor.vendorLastPaymentDate),
      type: getVendorType(vendor),
      status: getVendorStatus(vendor.vendorIsDeleted),
      originalData: vendor,
   }));
}; */

const VendorFileMaintenance1099: React.FC = () => {
   // AP Period End custom hook
   const {
      fetchVendorsByYear,
      fetchVendorDetailsByYear,
      fetchVendorDetails,
      updateVendorByYear,
      transformVendorData,
   } = useApPeriodEnd();

   const [selectedYear, setSelectedYear] = useState<string>("2024");
   const [currentPage, setCurrentPage] = useState(1);
   const [pageSize, setPageSize] = useState(10);
   const [allVendorData, setAllVendorData] = useState<Vendor1099Data[]>([]);
   const [loading, setLoading] = useState(false);
   const [totalCount, setTotalCount] = useState<number | null>(null);
   const [hasNextPage, setHasNextPage] = useState<boolean>(true);
   const [lastApiPage, setLastApiPage] = useState<number>(0);
   const [editLoading, setEditLoading] = useState<boolean>(false);
   const [isViewModalVisible, setIsViewModalVisible] = useState<boolean>(false);
   const [selectedVendorForView, setSelectedVendorForView] =
      useState<VendorData | null>(null);
   const [isEditMode, setIsEditMode] = useState<boolean>(false);
   const [selectedVendorForEdit, setSelectedVendorForEdit] =
      useState<VendorData | null>(null);
   const [notification, setNotification] = useState<{
      visible: boolean;
      type: "error" | "success" | "warning" | "batch";
      title: string;
      subtitle: string;
   }>({ visible: false, type: "error", title: "", subtitle: "" });
   const [successModalVisible, setSuccessModalVisible] =
      useState<boolean>(false);

   // Static company number
   const companyNo = 10;

   // Generate year options (current year and previous years)
   const currentYear = new Date().getFullYear();
   const yearOptions = [];
   for (let i = currentYear; i >= currentYear - 10; i--) {
      yearOptions.push({ label: i.toString(), value: i.toString() });
   }

   // Utility function for API error handling
   const handleApiError = (error: any, context: string) => {
      const { title, subtitle } = buildApiErrorNotification(error, context);

      const normalizedSubtitle = normalizeGlAccountErrorMessage(subtitle);

      setNotification({
         visible: true,
         type: "error",
         title,
         subtitle: normalizedSubtitle,
      });
   };

   // Success modal is used instead of toaster on update

   // Fetch vendors from API with server-side pagination
   const fetchVendorsByYearData = async (
      apiPage: number = 1,
      apiSize: number = 500
   ) => {
      setLoading(true);
      try {
         const queryParams = {
            companyNo,
            year: parseInt(selectedYear) || currentYear,
            current_page: apiPage,
            items_per_page: apiSize,
         };

         const result = await fetchVendorsByYear(queryParams);

         // Transform API response to display format (matching VendorMaster pattern)
         const transformed: Vendor1099Data[] = transformVendorData(
            result.items || [],
            apiPage
         );

         // Add new records to existing data
         setAllVendorData((prev) => [...prev, ...transformed]);

         // Update pagination tracking from server, if provided
         const p = (result as any)?.pagination || {};
         const nextCount = typeof p.count === "number" ? p.count : null;
         if (nextCount !== null) setTotalCount(nextCount);
         if (typeof p.hasNextPage === "boolean") {
            setHasNextPage(p.hasNextPage);
         } else if (
            typeof p.page === "number" &&
            typeof p.totalPages === "number"
         ) {
            setHasNextPage(p.page < p.totalPages);
         }
         if (typeof p.page === "number") {
            setLastApiPage(p.page);
         } else {
            setLastApiPage(apiPage);
         }
      } catch (error: any) {
         // Handle specific NOT_FOUND error structure
         handleApiError(error, "fetching vendor list");
      } finally {
         setLoading(false);
      }
   };

   const handleSearch = () => {
      if (!selectedYear) {
         alert("Please select a year first");
         return;
      }
      setCurrentPage(1);
      setAllVendorData([]);
      setTotalCount(null);
      setHasNextPage(true);
      setLastApiPage(0);
      fetchVendorsByYearData(1, 500); // search call
   };

   const handlePaginationChange = (page: number, size: number) => {
      setCurrentPage(page);
      setPageSize(size);

      // Calculate total pages available with current data
      const totalPagesAvailable = Math.ceil(allVendorData.length / size);

      // Only fetch more if server indicates more data or client has fewer than totalCount
      const shouldLoadMore =
         hasNextPage === true ||
         (typeof totalCount === "number" && allVendorData.length < totalCount);

      // If user is on the last available client page and there is more data on server, fetch next server page
      if (page >= totalPagesAvailable && shouldLoadMore) {
         const nextApiPage =
            lastApiPage > 0
               ? lastApiPage + 1
               : Math.floor(allVendorData.length / 500) + 1;
         fetchVendorsByYearData(nextApiPage, 500); // pagination call
      }
   };

   // Remove custom filtering - let Ant Design handle it on full dataset

   // Fetch vendor details by year from API
   const fetchVendorDetailsByYearData = async (vendorNo: number) => {
      try {
         const requestParams = {
            year: selectedYear,
            vendorNo: vendorNo.toString(),
            vendorCompanyNumber: Number(companyNo),
         };

         const vendorData = await fetchVendorDetailsByYear(requestParams);

         // The API returns the vendor data directly
         if (vendorData) {
            return {
               vendor: vendorData,
               vendorContactDetails: [], // No contact details in this API
            };
         }
         return null;
      } catch (error: any) {
         // Handle specific NOT_FOUND error structure
         handleApiError(
            error,
            `fetching vendor details for vendor #${vendorNo}`
         );
         return null;
      }
   };

   // Fetch vendor details from API (reusing VendorMaster pattern - kept for compatibility)
   const fetchVendorDetailsData = async (vendorNo: number) => {
      try {
         const requestParams = {
            vendorCompanyNumber: Number(companyNo),
            vendorNo: vendorNo,
         };

         const result = await fetchVendorDetails(requestParams);
         return result;
      } catch (error: any) {
         // Handle specific NOT_FOUND error structure
         handleApiError(
            error,
            `fetching vendor details for vendor #${vendorNo}`
         );
         return null;
      }
   };

   // Format vendor data for edit mode (reusing VendorMaster pattern)
   const formatVendorData = (vendor: any) => {
      return {
         vendorNo: vendor.vendorNo || 0,
         vendorName: vendor.vendorName || "",
         vendorAdd1: vendor.vendorAdd1 || "",
         vendorAdd2: vendor.vendorAdd2 || "",
         vendorAdd3: vendor.vendorAdd3 || "",
         vendorAdd4: vendor.vendorAdd4 || "",
         vendorCountryCode: vendor.vendorCountryCode || "",
         vendorZipCode: vendor.vendorZipCode || 0,
         // Pass split values as-is; combination is handled by AddVendor
         vendorAreaCode: vendor.vendorAreaCode || 0,
         vendorTelephoneNo: vendor.vendorTelephoneNo || 0,
         vendorNameOverflow: vendor.vendorNameOverflow || false,
         vendorHoldPaymentsVend: vendor.vendorHoldPaymentsVend || "",
         vendorGalRcptsRequired: vendor.vendorGalRcptsRequired || "",
         vendorSingleCheck: vendor.vendorSingleCheck || "",
         vendorApTermsCode: vendor.vendorApTermsCode || 0,
         vendorAdpPayrollId: vendor.vendorAdpPayrollId || 0,
         vendorCategoryCode: vendor.vendorCategoryCode || "",
         vendorCarrierId: vendor.vendorCarrierId || "",
         vendorExpenseGLSub: vendor.vendorExpenseGLSub || 0,
         vendorAchBankAccountNumber: vendor.vendorAchBankAccountNumber || "",
         vendorAchBankRoutingCode: vendor.vendorAchBankRoutingCode || 0,
         vendorAchCheckingOrSavings: vendor.vendorAchCheckingOrSavings || "",
         vendorAchClass: vendor.vendorAchClass || "",
         vendorFirstName: vendor.vendorFirstName || "",
         vendorMiddleName: vendor.vendorMiddleName || "",
         vendorBusinessLastName: vendor.vendorBusinessLastName || "",
         vendorNameSuffix: vendor.vendorNameSuffix || "",
         vendorAp1099Code: vendor.vendorAp1099Code || "",
         vendorFirst1099BoxNumber: vendor.vendorFirst1099BoxNumber || 0,
         vendorSecond1099BoxNumber: vendor.vendorSecond1099BoxNumber || 0,
         vendorSecond1099BoxAmount: vendor.vendorSecond1099BoxAmount || 0,
         vendorPayeeName1: vendor.vendorPayeeName1 || "",
         vendorPayeeName2: vendor.vendorPayeeName2 || "",
         vendorIrsNameControl: vendor.vendorIrsNameControl || "",
         vendorIdNumber:
            (vendor as { IdNo1099?: string }).IdNo1099 ??
            vendor.vendorIdNumber ??
            "",
         // Month-To-Date values
         vendorCurrentBalance: vendor.vendorCurrentBalance ?? 0,
         vendorMtdPurchases: vendor.vendorMtdPurchases ?? 0,
         vendorMtdPayments: vendor.vendorMtdPayments ?? 0,
         vendorMtdDiscounts: vendor.vendorMtdDiscounts ?? 0,
         vendorPreviousBalance: vendor.vendorPreviousBalance ?? 0,
         // Year-To-Date and related values for edit form
         vendorYtdPurchases: vendor.vendorYtdPurchases || 0,
         vendorThisYrYtdPaid: vendor.vendorThisYrYtdPaid || 0,
         vendorYtdDiscounts: vendor.vendorYtdDiscounts || 0,
         vendorLastYearPurchases: vendor.vendorLastYearPurchases || 0,
         vendorLastYrYtdPaid: vendor.vendorLastYrYtdPaid || 0,
         vendorLastPaymentAmt: vendor.vendorLastPaymentAmt || 0,
         vendorLastPaymentDate: vendor.vendorLastPaymentDate || 0,
         vendorIsDeleted: vendor.vendorIsDeleted || "", // Add the missing vendorIsDeleted field
      };
   };

   const handleViewClick = async (record: Vendor1099Data) => {
      if (!selectedYear) {
         alert("Please select a year first");
         return;
      }

      const vendorData = {
         vendorNo: record.vendorNo,
         vendorName: record.vendorName,
         telephone: record.telephone,
         lastPmtAmt: record.lastPmtAmt,
         lastPmtDate: record.lastPmtDate,
         key: record.key,
         type: record.type,
         status: record.status,
      };
      setSelectedVendorForView(vendorData);

      // Call the getVendorDetailsByYear API first
      const vendorDetailsByYear = await fetchVendorDetailsByYearData(
         record.vendorNo
      );

      // If the new API returns data, use it; otherwise fallback to the original API
      if (vendorDetailsByYear) {
         setSelectedVendorForView({
            ...vendorData,
            vendorDetails: vendorDetailsByYear,
         });
      } else {
         // Fallback to original API for compatibility
         const vendorDetails = await fetchVendorDetailsData(record.vendorNo);
         if (vendorDetails) {
            setSelectedVendorForView({
               ...vendorData,
               vendorDetails: vendorDetails,
            });
         }
      }
      setIsViewModalVisible(true);
   };

   const handleEditClick = async (record: Vendor1099Data) => {
      try {
         if (!selectedYear) {
            alert("Please select a year first");
            return;
         }

         setEditLoading(true);

         // First try to get vendor details by year
         const vendorDetailsByYear = await fetchVendorDetailsByYearData(
            record.vendorNo
         );

         // If the new API returns data, use it; otherwise fallback to the original API
         const vendorDetails =
            vendorDetailsByYear ||
            (await fetchVendorDetailsData(record.vendorNo));

         if (vendorDetails?.vendor) {
            const formattedVendor = formatVendorData(vendorDetails.vendor);
            const vendorDataWithDetails = {
               vendorNo: record.vendorNo,
               vendorName: record.vendorName,
               telephone: record.telephone,
               lastPmtAmt: record.lastPmtAmt,
               lastPmtDate: record.lastPmtDate,
               key: record.key,
               type: record.type,
               status: record.status,
               vendorDetails: {
                  vendor: formattedVendor,
                  vendorContactDetails:
                     vendorDetails.vendorContactDetails || [],
               },
            };
            // Switch to inline edit mode with vendor data
            setSelectedVendorForEdit(vendorDataWithDetails as VendorData);
            setIsEditMode(true);
         } else {
            throw new Error("Failed to fetch vendor details");
         }
      } catch (error) {
      } finally {
         setEditLoading(false);
      }
   };

   // Modal close handlers
   const handleViewModalClose = () => {
      setIsViewModalVisible(false);
      setSelectedVendorForView(null);
   };

   const handleViewModalEdit = async () => {
      if (selectedVendorForView) {
         handleViewModalClose();
         await handleEditClick({
            vendorNo: selectedVendorForView.vendorNo,
            vendorName: selectedVendorForView.vendorName,
            telephone: selectedVendorForView.telephone,
            lastPmtAmt: selectedVendorForView.lastPmtAmt,
            lastPmtDate: selectedVendorForView.lastPmtDate,
            key: selectedVendorForView.key,
            type: selectedVendorForView.type,
            status: selectedVendorForView.status,
            originalData: {}, // Will be populated with actual data when needed
         });
      }
   };

   // Inline Edit handlers
   const handleEditCancel = () => {
      setIsEditMode(false);
      setSelectedVendorForEdit(null);
   };

   // Custom save handler for updateVendorByYear API
   const handleCustomSave = async (
      vendorData: any,
      _contacts?: any[],
      extras?: { thisYearPayments?: number }
   ) => {
      try {
         const updatePayload: UpdateVendorByYearData = {
            vendorCompanyNumber: vendorData.vendorCompanyNumber,
            vendorName: vendorData.vendorName,
            vendorAdd1: vendorData.vendorAdd1,
            vendorAdd2: vendorData.vendorAdd2,
            vendorAdd3: vendorData.vendorAdd3,
            vendorAdd4: vendorData.vendorAdd4,
            vendorCountryCode: vendorData.vendorCountryCode,
            vendorZipCode: vendorData.vendorZipCode,
            vendorAreaCode: vendorData.vendorAreaCode || 0,
            vendorTelephoneNo: vendorData.vendorTelephoneNo || 0,
            vendorThisYrYtdPaid:
               extras?.thisYearPayments !== undefined
                  ? Number(Number(extras.thisYearPayments).toFixed(2))
                  : undefined,
            vendorExtraZip: vendorData.vendorExtraZip || 0,
            vendorAlphaSortAbbr: vendorData.vendorAlphaSortAbbr || "",
            vendorHoldPaymentsVend: vendorData.vendorHoldPaymentsVend,
            vendorGalRcptsRequired: vendorData.vendorGalRcptsRequired,
            vendorSingleCheck: vendorData.vendorSingleCheck,
            vendorApTermsCode: vendorData.vendorApTermsCode,
            vendorAdpPayrollId: Number(vendorData.vendorAdpPayrollId || 0),
            vendorCategoryCode: vendorData.vendorCategoryCode,
            vendorExpenseGLSub: vendorData.vendorExpenseGLSub,
            vendorAchBankAccountNumber: vendorData.vendorAchBankAccountNumber,
            vendorAchBankRoutingCode: vendorData.vendorAchBankRoutingCode,
            vendorAchCheckingOrSavings: vendorData.vendorAchCheckingOrSavings,
            vendorAchClass: vendorData.vendorAchClass,
            vendorFirstName: vendorData.vendorFirstName,
            vendorMiddleName: vendorData.vendorMiddleName,
            vendorBusinessLastName: vendorData.vendorBusinessLastName,
            vendorNameSuffix: vendorData.vendorNameSuffix,
            vendorAp1099Code: vendorData.vendorAp1099Code,
            vendorFirst1099BoxNumber: vendorData.vendorFirst1099BoxNumber,
            vendorSecond1099BoxNumber: vendorData.vendorSecond1099BoxNumber,
            vendorSecond1099BoxAmount: vendorData.vendorSecond1099BoxAmount,
            vendorCarrierId: vendorData.vendorCarrierId || "",
            vendorPayeeName1: vendorData.vendorPayeeName1,
            vendorPayeeName2: vendorData.vendorPayeeName2,
            vendorIdNumber: vendorData.vendorIdNumber || "",
            IdNo1099:
               (vendorData as { IdNo1099?: string }).IdNo1099 ??
               vendorData.vendorIdNumber ??
               "",
            vendorIrsNameControl: vendorData.vendorIrsNameControl,
            vendorIsDeleted: vendorData.vendorIsDeleted || "A",
            vendorNo: vendorData.vendorNo,
            year: selectedYear,
         };

         await updateVendorByYear(
            selectedYear,
            vendorData.vendorNo.toString(),
            updatePayload
         );

         setSuccessModalVisible(true);
      } catch (error: any) {
         // Handle specific NOT_FOUND error structure
         handleApiError(error, `updating vendor #${vendorData.vendorNo}`);
         throw error; // Re-throw to let AddVendor component handle error display
      }
   };

   const handleEditSaveSuccess = () => {
      setIsEditMode(false);
      setSelectedVendorForEdit(null);
      // Refresh the vendor list
      handleSearch();
   };

   const columns: (ColumnType<Vendor1099Data> & { filterable?: boolean })[] = [
      {
         title: "Actions",
         key: "actions",
         width: 100,
         align: "center",
         render: (_, record) => (
            <div className="action-icons flex-align">
               <ActionPermissionGuard
                  actionId="vendor-file-maintenance-1099.view"
                  requireManage={false}
               >
                  <Tooltip title="View">
                     <EyeOutlined
                        className="action-icon"
                        onClick={() => handleViewClick(record)}
                     />
                  </Tooltip>
               </ActionPermissionGuard>
               <ActionPermissionGuard actionId="vendor-file-maintenance-1099.edit">
                  <Tooltip title="Edit">
                     <EditOutlined
                        className={`action-icon ${
                           editLoading ? "disabled" : ""
                        }`}
                        onClick={() => !editLoading && handleEditClick(record)}
                        style={{
                           cursor: editLoading ? "not-allowed" : "pointer",
                        }}
                     />
                  </Tooltip>
               </ActionPermissionGuard>
            </div>
         ),
      },
      {
         title: "Vendor No",
         dataIndex: "vendorNo",
         key: "vendorNo",
         width: 130,
         ...createNumericFilter("vendorNo", "Enter Vendor No"),
         sorter: createNumericSorter("vendorNo"),
      },
      {
         title: "Vendor Name",
         dataIndex: "vendorName",
         key: "vendorName",
         width: 180,
         ...getColumnSearchProps("vendorName", "Search Vendor Name"),
         sorter: createVendorNameSorter("vendorName"),
      },
      {
         title: "Telephone",
         dataIndex: "telephone",
         key: "telephone",
         width: 150,
         ...getColumnSearchProps("telephone", "Enter Telephone"),
         sorter: createTextSorter("telephone"),
      },
      {
         title: "Last Pmt Amount",
         dataIndex: "lastPmtAmt",
         key: "lastPmtAmt",
         width: 180,
         ...getColumnSearchProps(
            "lastPmtAmt",
            "Enter Last Payment Amount",
            true
         ),
         sorter: createInvoiceAmountSorter("lastPmtAmt"),
      },
      {
         title: "Last Pmt Date",
         dataIndex: "lastPmtDate",
         key: "lastPmtDate",
         width: 150,
         ...getColumnSearchProps("lastPmtDate", "Search Last Payment Date"),
         sorter: createCustomDateSorter("lastPmtDate"),
      },
      {
         title: "Type",
         dataIndex: "type",
         key: "type",
         width: 100,
         ...getColumnSearchProps("type", "Search Type"),
         sorter: createTextSorter("type"),
      },
      {
         title: "Status",
         dataIndex: "status",
         key: "status",
         width: 100,
         ...getColumnSearchProps("status", "Search Status"),
         sorter: createStatusSorter("status"),
         render: (status: string) => {
            const normalizedClass = (status || "unknown")
               .toLowerCase()
               .replace(/\s+/g, "-");

            return (
               <span className={`status-pill ${normalizedClass}`}>
                  {status || "Unknown"}
               </span>
            );
         },
      },
   ];

   // Removed duplicate edit mode rendering - now handled in main return statement

   const handleSuccessModalClose = () => {
      setSuccessModalVisible(false);
      // After acknowledging success, exit edit mode and refresh list
      handleEditSaveSuccess();
   };

   return (
      <div>
         {isEditMode && selectedVendorForEdit ? (
            <AddVendor
               mode="edit"
               vendorData={selectedVendorForEdit}
               onSaveSuccess={() => {
                  /* handled by local success modal */
               }}
               onCancel={handleEditCancel}
               onSave={handleCustomSave}
               hideContacts={true}
               context="ap-period-end"
            />
         ) : (
            <>
               <div className="flex-between">
                  <h3>Vendor File Maintenance for 1099</h3>
               </div>

               <div className="content-div-container">
                  <div className="content-card-body flex-content">
                     <div>
                        <div className="flex-align">
                           <span className="astricks">*</span>&nbsp;
                           <p className="sub-title">Year</p>
                        </div>
                        <CustomSelectDropdown
                           name="year"
                           options={yearOptions}
                           value={selectedYear}
                           onChange={(value) => setSelectedYear(value)}
                           placeholder="Select Year"
                           className="ui-dropdown-vnn"
                        />
                     </div>

                     <div className="flex-align-end">
                        <ActionPermissionGuard
                           actionId="vendor-file-maintenance-1099.search"
                           requireManage={false}
                        >
                           <CustomStyledButton
                              name="search"
                              label={<h6>Search</h6>}
                              onClick={handleSearch}
                              className="custom-styled-button"
                              disabled={!selectedYear || loading}
                           />
                        </ActionPermissionGuard>
                     </div>
                  </div>

                  <div className="table-responsive-container centered-header table-margin">
                     <TableWidget
                        columns={columns}
                        dataSource={allVendorData}
                        rowKey="key"
                        loading={loading}
                        pagination={{
                           current: currentPage,
                           pageSize: pageSize,
                           total: allVendorData.length,
                           showSizeChanger: true,
                           showQuickJumper: true,
                           showTotal: (total) => `Total ${total} vendors`,
                           onChange: handlePaginationChange,
                        }}
                        onChange={(_pagination, _filters, _sorter, extra) => {
                           // Reset to page 1 when filters are applied
                           if (extra.action === "filter") {
                              setCurrentPage(1);
                           }
                        }}
                     />
                  </div>
               </div>

               <VendorViewModal
                  visible={isViewModalVisible}
                  title="Vendor Details"
                  onClose={handleViewModalClose}
                  onEdit={handleViewModalEdit}
                  vendorData={selectedVendorForView}
                  hideContacts={true}
                  editActionId="vendor-file-maintenance-1099.edit"
               />

               {notification.visible && (
                  <Toaster
                     type={notification.type}
                     title={notification.title}
                     subtitle={notification.subtitle}
                     onClose={() =>
                        setNotification((prev) => ({ ...prev, visible: false }))
                     }
                  />
               )}
            </>
         )}
         <ModalContent
            title={"Vendor Updated"}
            description={"Vendor has been updated successfully."}
            visible={successModalVisible}
            onCancel={handleSuccessModalClose}
            showCloseIcon={false}
            imageUrl={popupOk}
            actions={[
               {
                  name: modalActions[0].name,
                  label: modalActions[0].label,
                  onClick: handleSuccessModalClose,
               },
            ]}
            className="cne-modal descripition"
         />
      </div>
   );
};

export default VendorFileMaintenance1099;
