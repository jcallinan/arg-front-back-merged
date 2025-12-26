import React, { useState, useEffect } from "react";
import { Tooltip, message } from "antd";
import { EditOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { CustomSelectDropdown } from "@widget-library/Dropdown";
import { CustomStyledButton } from "@widget-library/Buttons";
import TableWidget from "@widget-library/Table";
import CompanyNo from "@shared-components/company-number/CompanyNo";
import OwnerVendorNumberName from "@shared-components/owner-vendor-number-name/OwnerVendorNumberName";
import type { ColumnType } from "antd/es/table";
import "../vendor-master-inquiry/vendor-master.scss";
import companyIcon from "@assets/icons/company-icon.svg";
import Card from "@widget-library/Card";
import AddVendorOwner from "./AddVendorOwner";
import type {
  VendorOwnerMappingUI,
  OwnerNoOption,
} from "@/types/accounts-payable.types";
import { statusOptions } from "@/constants/commonConstants";
import { useVendorOwnerMapping } from "../../../../hooks/useVendorOwnerMapping";
import {
   createVendorNumberStringSorter,
   createVendorNameSorter,
   createStatusSorter
} from "../../../../utils/sortingUtils";
import { getColumnSearchProps, createNumericFilter } from "../../../../utils/tableFilters";
import ActionPermissionGuard from "@shared-components/permissions/ActionPermissionGuard";

const VendorOwner: React.FC = () => {
  const [addOwnerModalVisible, setAddOwnerModalVisible] = useState(false);
  const [companyNo, setCompanyNo] = useState("10");
  const [vendorFilter, setVendorFilter] = useState<any>(undefined);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [ownerNoFilter, setOwnerNoFilter] = useState<any>(undefined);
  const [mappingData, setMappingData] = useState<VendorOwnerMappingUI[]>([]);
  const [selectedRecord, setSelectedRecord] =
    useState<VendorOwnerMappingUI | null>(null);
  const [ownerNoOptions, setOwnerNoOptions] = useState<OwnerNoOption[]>([]);

  // Use custom hook
  const { 
    loading, 
    ownerOptionsLoading, 
    fetchOwnerNumbers, 
    fetchMappingData 
  } = useVendorOwnerMapping();

  const columns: (ColumnType<VendorOwnerMappingUI> & { filterable?: boolean })[] = [
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="action-buttons">
          <ActionPermissionGuard actionId="vendor-owner-mapping.edit-owner">
            <Tooltip title="Edit Mapping">
              <EditOutlined
                className="action-icon edit-icon"
                onClick={() => handleEdit(record)}
              />
            </Tooltip>
          </ActionPermissionGuard>
        </div>
      ),
    },
    {
      title: "Vendor No",
      dataIndex: "vendorId",
      key: "vendorId",
      ...createNumericFilter("vendorId", "Enter Vendor No"),
      sorter: createVendorNumberStringSorter("vendorId"),
    },
    {
      title: "Owner No",
      dataIndex: "ownerId",
      key: "ownerId",
      ...createNumericFilter("ownerId", "Enter Owner No"),
      sorter: createVendorNumberStringSorter("ownerId"),
    },
    {
      title: "Vendor Name",
      dataIndex: "vendorName",
      key: "vendorName",
      ...getColumnSearchProps("vendorName", "Search Vendor Name"),
      sorter: createVendorNameSorter("vendorName"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      ...getColumnSearchProps("status", "Search Status"),
      sorter: createStatusSorter("status"),
      render: (status: string) => (
        <span className={`status-pill ${status?.toLowerCase() || "unknown"}`}>
          {status?.charAt(0).toUpperCase() + status?.slice(1) || "Unknown"}
        </span>
      ),
    },
  ];

  const handleFetchOwnerNumbers = async () => {
    try {
      const ownerNumbers = await fetchOwnerNumbers(companyNo, vendorFilter, statusFilter);
      setOwnerNoOptions(ownerNumbers);
    } catch (error: any) {
      message.error(error.message || "Failed to load owner numbers");
    }
  };

  useEffect(() => {
    handleFetchOwnerNumbers();
  }, [companyNo, vendorFilter, statusFilter]);

  useEffect(() => {
    handleFetchMappingData();
  }, [companyNo]);

  const handleFetchMappingData = async () => {
    try {
      const mappingData = await fetchMappingData(companyNo, vendorFilter, statusFilter, ownerNoFilter);
      setMappingData(mappingData);
    } catch (error: any) {
      message.error(error.message || "Failed to load vendor owner mappings");
      setMappingData([]);
    }
  };

  const handleApplyFilters = () => {
    handleFetchMappingData();
    handleFetchOwnerNumbers();
  };

  const handleEdit = (record: VendorOwnerMappingUI) => {
    setSelectedRecord(record);
    setAddOwnerModalVisible(true);
  };

  const handleCreateMapping = () => {
    setSelectedRecord(null);
    setAddOwnerModalVisible(true);
  };

  return (
    <div>
      <div className="">
        <h3 className="title">Vendor Owner Mapping</h3>
        <div className="content-div-container">
          <div className="filter-grids-containers">
            <div className="filter-field">
              <CompanyNo value={companyNo} onChange={setCompanyNo} />
            </div>
            <div className="filter-field">
              <OwnerVendorNumberName
                value={vendorFilter}
                onChange={setVendorFilter}
                companyNo={companyNo}
              />
            </div>
            <div className="filter-field">
              <p className="sub-title">Owner No Status</p>
              <CustomSelectDropdown
                name="status"
                options={statusOptions}
                value={statusFilter}
                onChange={setStatusFilter}
                placeholder="All"
                className="ui-dropdown-cn"
              />
            </div>
            <div className="filter-field">
              <p className="sub-title">Owner No</p>
              <CustomSelectDropdown
                name="ownerNo"
                options={ownerNoOptions.map((option) => ({
                  label: String(option.label || ""),
                  value: String(option.value || ""),
                }))}
                value={ownerNoFilter}
                onChange={setOwnerNoFilter}
                placeholder="All"
                className="ui-dropdown-cn"
                loading={ownerOptionsLoading}
              />
            </div>
            <div className="btn-field">
            <ActionPermissionGuard
              actionId="vendor-owner-mapping.search"
              requireManage={false}
            >
              <CustomStyledButton
                name="search"
                label="Search"
                icon={<SearchOutlined />}
                onClick={handleApplyFilters}
              />
            </ActionPermissionGuard>
          </div>

          </div>
        </div>
        <div className="content-div-container">
          <div className="content-card-body">
            <AddVendorOwner
              visible={addOwnerModalVisible}
              onCancel={() => setAddOwnerModalVisible(false)}
              isEditMode={!!selectedRecord}
              selectedRecord={selectedRecord}
              onSuccess={handleFetchMappingData}
            />
            <div className="flex-between section-block">
              <div>
                <h5>Owner List</h5>
              </div>
              <div className="action-buttons flex-align">
                <ActionPermissionGuard actionId="vendor-owner-mapping.add-owner">
                  <CustomStyledButton
                    name="addOwner"
                    label="Add Owner"
                    onClick={handleCreateMapping}
                    icon={<PlusOutlined />}
                  />
                </ActionPermissionGuard>
              </div>
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
            <div className="table-responsive-container section-block">
              <TableWidget<VendorOwnerMappingUI>
                columns={columns}
                dataSource={mappingData}
                loading={loading}
                rowKey="key"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorOwner;
