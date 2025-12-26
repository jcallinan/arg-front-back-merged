import React, { useState, useEffect } from "react";
import { Tooltip } from "antd";
import type { ColumnType } from "antd/es/table";
import { CustomSelectDropdown } from "@widget-library/Dropdown";
import { CustomStyledButton } from "@widget-library/Buttons";
import TableWidget from "@widget-library/Table";
import {
   EditOutlined,
   EyeOutlined,
   PlusOutlined,
   SearchOutlined,
} from "@ant-design/icons";
import Card from "@widget-library/Card";
import companyIcon from "@assets/icons/company-icon.svg";
import { useNavigate } from "react-router-dom";
import CompanyNo from "../../../../shared-components/company-number/CompanyNo";
import OwnerVendorNumberName from "../../../../shared-components/owner-vendor-number-name/OwnerVendorNumberName";
import "./vendor-master.scss";
import { STATUS_OPTIONS } from "@/constants/commonConstants";
import type { VendorData } from "@/types/accounts-payable.types";
import VendorViewModal from "./VendorViewModal";
import { useDropdownData } from "../../../../hooks/useDropdownData";
import { useVendorMaster } from "../../../../hooks/useVendorMaster";
import {
   createNumericSorter,
   createVendorNameSorter,
   createTextSorter,
   createCustomDateSorter,
   createStatusSorter,
   createInvoiceAmountSorter
} from "../../../../utils/sortingUtils";
import { getColumnSearchProps, createNumericFilter } from "../../../../utils/tableFilters";
import ActionPermissionGuard from "@shared-components/permissions/ActionPermissionGuard";


const VendorMaster: React.FC = () => {
   const [selectedType, setSelectedType] = useState<string>("");
   const [selectedStatus, setSelectedStatus] = useState<string>("");
   const [editLoading, setEditLoading] = useState(false);
   const [companyNo, setCompanyNo] = useState("10");
   const [vendor, setVendor] = useState<string | undefined>();
   const [currentPage, setCurrentPage] = useState(1);
   const [pageSize, setPageSize] = useState(10);
   const [allVendorData, setAllVendorData] = useState<VendorData[]>([]);
   const navigate = useNavigate();
   const [selectedVendorForView, setSelectedVendorForView] =
      useState<VendorData | null>(null);
   const [isViewModalVisible, setIsViewModalVisible] = useState(false);

   // Use custom hooks
   const { loading, fetchVendorList, fetchVendorDetails, formatVendorData } = useVendorMaster();
   const { data: vendorMaintenanceTypes, isLoading: isLoadingTypes } = 
      useDropdownData("HOLD_VOUCHER_CODE");

   // Transform API data to dropdown format with "All" option
   const typeOptions = [
      { label: "All", value: "" },
      ...(vendorMaintenanceTypes?.map(item => ({
         label: item.label || item.value || "",
         value: item.value || item.id || "",
      })) || [])
   ];



   const columns: (ColumnType<VendorData> & {
      filterable?: boolean;
   })[] = [
      {
         title: "Actions",
         key: "actions",
         width: 100,
         align: "center",
         render: (_, record) => (
            <div className="action-icons flex-align">
               <ActionPermissionGuard actionId="vendor-master.view-vendor">
                  <Tooltip title="View">
                     <EyeOutlined
                        className="action-icon"
                        onClick={() => handleView(record)}
                     />
                  </Tooltip>
               </ActionPermissionGuard>
               <ActionPermissionGuard actionId="vendor-master.edit-vendor">
                  <Tooltip title="Edit">
                     <EditOutlined
                        className={`action-icon ${editLoading ? "disabled" : ""}`}
                        onClick={() => !editLoading && handleEdit(record)}
                        style={{ cursor: editLoading ? "not-allowed" : "pointer" }}
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
         align: "right",
         ...getColumnSearchProps("lastPmtAmt", "Enter Last Payment Amount", true),
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
         
         sorter: createTextSorter("type"),
         ...getColumnSearchProps("type", "Search Type"),
      },
      {
         title: "Status",
         dataIndex: "status",
         key: "status",
         width: 100,
         
         sorter: createStatusSorter("status"),
         ...getColumnSearchProps("status", "Search Status"),
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

   const handleFetchVendorList = async (
      apiPage: number = 1,
      apiSize: number = 500,
      isPaginationCall: boolean = false
   ) => {
      try {
         const transformed = await fetchVendorList(
            companyNo,
            vendor,
            selectedStatus,
            selectedType,
            apiPage,
            apiSize,
            isPaginationCall
         );

         setAllVendorData((prev) => {
            const existingVendorNos = new Set(prev.map(v => v.vendorNo));
            
            const newUniqueRecords = transformed.filter(
               vendor => !existingVendorNos.has(vendor.vendorNo)
            );
            
            return [...prev, ...newUniqueRecords];
         });
      } catch (error) {
         console.error("Error fetching vendor list:", error);
      }
   };

   const handleSearch = () => {
      setCurrentPage(1);
      setAllVendorData([]);
      handleFetchVendorList(1, 500, false); // false = search call, include vendor filter
   };

   const handlePaginationChange = (page: number, size: number) => {
      setCurrentPage(page);
      setPageSize(size);

      // Calculate total pages available with current data
      const totalPagesAvailable = Math.ceil(allVendorData.length / size);

      // If user is on the last available page, fetch more records
      if (page >= totalPagesAvailable) {
         // Calculate the correct API page number
         const apiPage = Math.floor(allVendorData.length / 500) + 1;

         handleFetchVendorList(apiPage, 500, true); // true = pagination call, don't include vendor filter
      }
   };

   const handleFetchVendorDetails = async (vendorNo: number) => {
      return await fetchVendorDetails(vendorNo, companyNo);
   };

   const handleView = async (record: VendorData) => {
      setSelectedVendorForView(record);
      const vendorDetails = await handleFetchVendorDetails(record.vendorNo);
      if (vendorDetails) {
         setSelectedVendorForView({
            ...record,
            vendorDetails: vendorDetails,
         });
      }
      setIsViewModalVisible(true);
   };

   const handleEdit = async (record: VendorData) => {
      try {
         setEditLoading(true);
         const vendorDetails = await handleFetchVendorDetails(record.vendorNo);
         if (vendorDetails?.vendor) {
            const formattedVendor = formatVendorData(vendorDetails.vendor);
            const vendorDataWithDetails = {
               ...record,
               vendorDetails: {
                  vendor: formattedVendor,
                  vendorContactDetails:
                     vendorDetails.vendorContactDetails || [],
               },
            };
            // Navigate to edit vendor page with vendor data
            navigate(`edit-vendor/${record.vendorNo}`, {
               state: { vendorData: vendorDataWithDetails },
            });
         } else {
            throw new Error("Failed to fetch vendor details");
         }
      } catch (error) {
         console.error("Error editing vendor:", error);
         // You might want to show an error message to the user here
      } finally {
         setEditLoading(false);
      }
   };

   // Initial load - only call once
   useEffect(() => {
      handleFetchVendorList(1, 500, false); // false = initial load, include vendor filter
   }, []); // Empty dependency array ensures it only runs once on mount

   // Remove custom filtering - let Ant Design handle it on full dataset



   const handleViewModalClose = () => {
      setIsViewModalVisible(false);
      setSelectedVendorForView(null);
   };

   const handleViewModalEdit = () => {
      if (selectedVendorForView) {
         handleEdit(selectedVendorForView);
         handleViewModalClose();
      }
   };

   return (
      <div className="voucherentry-container">
         <h3 className="title">Vendor Maintenance</h3>

         <div className="content-div-container">
            <div className="filter-grids-containers">
               <div className="filter-field">
                  <CompanyNo value={companyNo} onChange={setCompanyNo} />
               </div>
               <div className="filter-field">
                  <OwnerVendorNumberName
                     value={vendor}
                     onChange={setVendor}
                     companyNo={companyNo}
                  />
               </div>
               <div className="filter-field">
                  <p className="sub-title">Type</p>
                  <CustomSelectDropdown
                     name="Type"
                     options={typeOptions}
                     value={selectedType}
                     onChange={setSelectedType}
                     placeholder="All"
                     className="ui-dropdown-cn"
                     loading={isLoadingTypes}
                  />
               </div>
               <div className="filter-field">
                  <p className="sub-title">Status</p>
                  <CustomSelectDropdown
                     name="status"
                     options={STATUS_OPTIONS}
                     value={selectedStatus}
                     onChange={setSelectedStatus}
                     placeholder="All"
                     className="ui-dropdown-cn"
                  />
               </div>
               <div className="btn-field">
                  <ActionPermissionGuard actionId="vendor-master.view-vendor">
                  <CustomStyledButton
                     name="search"
                     label="Search"
                     onClick={handleSearch}
                     icon={<SearchOutlined />}
                  />
                  </ActionPermissionGuard>
               </div>
            </div>
         </div>

         <div className="content-div-container">
            <div className="content-card-header flex-between">
               <div className="flex-column">
                  <h4>Vendor Master List</h4>
               </div>
               <ActionPermissionGuard actionId="vendor-master.add-vendor">
                  <CustomStyledButton
                     name="addVendor"
                     label={<h6>Add Vendor</h6>}
                     onClick={() => navigate("add-vendor")}
                     icon={<PlusOutlined />}
                  />
               </ActionPermissionGuard>
            </div>

            <div className="cards-container-vendor-master grid-card">
               <div className="card-left">
                  <Card
                     icon={<img src={companyIcon} alt="Company No" />}
                     label="Company No"
                     value={companyNo}
                  />
               </div>
               <div className="card-right">
                  <Card
                     icon={<img src={companyIcon} alt="Company Name" />}
                     label="Company Name"
                     value="A.R.G. BRADFORD DIVISI"
                  />
               </div>
            </div>

            <div>
               <TableWidget<VendorData>
                  columns={columns}
                  dataSource={allVendorData}
                  loading={loading}
                  rowKey="key"
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
                     if (extra.action === 'filter') {
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
         />
      </div>
   );
};

export default VendorMaster;
