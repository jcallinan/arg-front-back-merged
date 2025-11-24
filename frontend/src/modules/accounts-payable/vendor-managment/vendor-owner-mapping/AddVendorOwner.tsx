import React, { useState, useEffect } from "react";
import { Switch, message } from "antd";
import ModalContent from "@widget-library/Modal";
import Card from "@widget-library/Card";
import vendorIcon from "@assets/icons/vendor-icon.svg";
import companyIcon from "@assets/icons/company-icon.svg";

import OwnerVendorNumberName from "@shared-components/owner-vendor-number-name/OwnerVendorNumberName";
import type { ModalAction } from "@type-definitions/accounts-payable.types";
import CompanyNo from "@shared-components/company-number/CompanyNo";
import { Divider } from "antd";
import { useVendorOwnerMapping } from "../../../../hooks/useVendorOwnerMapping";
import "./vendor-owner.scss";
import { CustomPrefixInput } from "@/widget-library/Input";

interface VendorOwnerMappingUI {
  key: string;
  vendorId: string;
  vendorName: string;
  ownerId: string;
  ownerName: string;
  mappingDate: string;
  status: string;
}

interface AddVendorOwnerProps {
  visible: boolean;
  onCancel: () => void;
  isEditMode?: boolean;
  selectedRecord?: VendorOwnerMappingUI | null;
  onSuccess?: () => void;
}

const AddVendorOwner: React.FC<AddVendorOwnerProps> = ({
  visible,
  onCancel,
  isEditMode = false,
  selectedRecord,
  onSuccess,
}) => {
  const [companyNo, setCompanyNo] = useState("10");
  const [ownerNo, setOwnerNo] = useState("");
  const [vendorNo, setVendorNo] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ownerDetails, setOwnerDetails] = useState<{
    ownerNo?: number;
    vendorNo?: number;
    isDeleted?: string;
    vendorDetails?: {
      vendorName?: string;
    };
  } | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedVendorName, setSelectedVendorName] = useState("");

  // Use custom hook
  const { fetchOwnerDetails, createOrUpdateOwner } = useVendorOwnerMapping();

  // Initialize form when modal opens
  useEffect(() => {
    if (visible && !isInitialized) {
      if (isEditMode && selectedRecord) {
        // Set initial values for edit mode
        setCompanyNo("10");
        setOwnerNo(selectedRecord.ownerId);
        setVendorNo(selectedRecord.vendorId);
        setIsActive(selectedRecord.status === "active");
        setSelectedVendorName(selectedRecord.vendorName);
        setOwnerDetails(null); // Reset owner details for fresh API call
        setIsInitialized(true);
      } else {
        // Reset form for add mode
        setCompanyNo("10");
        setOwnerNo("");
        setVendorNo("");
        setIsActive(false);
        setSelectedVendorName("");
        setOwnerDetails(null);
        setIsInitialized(true);
      }
    }
  }, [visible, isEditMode, selectedRecord, isInitialized]);

  // Reset initialization flag and owner details when modal closes or selectedRecord changes
  useEffect(() => {
    if (!visible) {
      setIsInitialized(false);
      setOwnerDetails(null); // Clear owner details when modal closes
    }
  }, [visible]);

  // Reset owner details when selectedRecord changes (for switching between different edit records)
  useEffect(() => {
    if (isEditMode && selectedRecord) {
      setOwnerDetails(null); // Clear previous owner details to force fresh API call
    }
  }, [selectedRecord, isEditMode]);

  // Load owner details only once when entering edit mode
  useEffect(() => {
    if (
      isEditMode &&
      selectedRecord &&
      visible &&
      isInitialized &&
      !ownerDetails
    ) {
      loadOwnerDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, selectedRecord, visible, isInitialized, ownerDetails]);

  const loadOwnerDetails = async () => {
    if (!selectedRecord) return;

    setLoading(true);
    try {
      const ownerDetailsData = await fetchOwnerDetails(
        parseInt(selectedRecord.ownerId),
        parseInt(selectedRecord.vendorId)
      );

      if (ownerDetailsData) {
        setOwnerDetails(ownerDetailsData);

        // Update form with API data - use the actual response structure
        const apiData = ownerDetailsData;

        // Only update if API returned valid data
        if (apiData.ownerNo !== undefined) {
          setOwnerNo(apiData.ownerNo.toString());
        }

        if (apiData.vendorNo !== undefined) {
          setVendorNo(apiData.vendorNo.toString());
        }

        // Handle isDeleted status - "I" means inactive, "A" means active
        if (apiData.isDeleted !== undefined) {
          setIsActive(apiData.isDeleted === "A");
        }

        // Update vendor name from API if available
        if (apiData.vendorDetails?.vendorName) {
          setSelectedVendorName(apiData.vendorDetails.vendorName);
        }
      }
    } catch (error: any) {
      message.error(error.message || "Failed to load owner details");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (isEditMode && selectedRecord) {
      setOwnerNo(selectedRecord.ownerId);
      setVendorNo(selectedRecord.vendorId);
      setIsActive(selectedRecord.status === "active");
      setSelectedVendorName(selectedRecord.vendorName);
    } else {
      setOwnerNo("");
      setVendorNo("");
      setIsActive(false);
      setSelectedVendorName("");
    }
  };

  const handleSaveOrUpdate = async () => {
    // Enhanced validation
    if (!ownerNo.trim()) {
      message.error("Please enter Owner No");
      return;
    }

    if (!vendorNo.trim()) {
      message.error("Please select Vendor No");
      return;
    }

    // Validate numeric values
    const ownerNoNum = parseInt(ownerNo);
    const vendorNoNum = parseInt(vendorNo);

    if (isNaN(ownerNoNum) || ownerNoNum <= 0) {
      message.error("Please enter a valid Owner No");
      return;
    }

    if (isNaN(vendorNoNum) || vendorNoNum <= 0) {
      message.error("Please select a valid Vendor No");
      return;
    }

    setLoading(true);
    try {
      // Prepare the data for API call
      const vendorOwnerData = {
        ownerNo: ownerNoNum,
        vendorNo: vendorNoNum,
        isDeleted: isActive ? "A" : "I", // "A" for active, "I" for inactive
      };

      // Call the API to save/update the owner mapping
      const response = await createOrUpdateOwner(vendorOwnerData);

      // Handle successful response
      if (response.data?.message) {
        message.success(response.data.message);
      } else {
        message.success(
          isEditMode
            ? "Owner mapping updated successfully"
            : "Owner mapping added successfully"
        );
      }

      // Refresh the parent component data
      if (onSuccess) {
        onSuccess();
      }

      // Close the modal
      onCancel();
    } catch (error: any) {
      message.error(error.message || "Failed to save owner mapping");
    } finally {
      setLoading(false);
    }
  };

  const handleOwnerNoChange = (value: string) => {
    setOwnerNo(value);
  };

  const handleVendorNoChange = (value: string) => {
    setVendorNo(value);

    // The vendor name will be updated when the VendorNumberName component loads the data
    // We'll rely on the API response to get the vendor name
  };

  const handleActiveChange = (checked: boolean) => {
    setIsActive(checked);
  };

  const footerActions: ModalAction[] = [
    {
      name: "reset",
      label: "Reset",
      onClick: handleReset,
      type: "default",
    },
    {
      name: "saveOrUpdate",
      label: isEditMode ? "Update" : "Save",
      onClick: handleSaveOrUpdate,
      type: "custom",
    },
  ];

  return (
    <ModalContent
      title={isEditMode ? "Edit Owner" : "Add Owner"}
      visible={visible}
      onCancel={onCancel}
      className="add-vendor-owner-modal"
      actions={footerActions}
      description={
        <div className="add-vendor-owner-wrapper">
          <Divider className="modal-divider" />
          <div className="card-grid">
            <Card
              icon={<img src={companyIcon} alt="Company" />}
              label="Company No"
              value={companyNo}
            />
            <Card
              icon={<img src={vendorIcon} alt="Vendor Name" />}
              label="Vendor Name"
              value={selectedVendorName || "A.R.G. BRADFORD DIVISION"}
            />
          </div>

          <div className="input-row">
            <div className="input-item company-dropdown-inquiry">
              <CompanyNo value={companyNo} onChange={setCompanyNo} />
            </div>
            <div className="input-item">
              <span className="sub-title">Owner No.</span>
              <CustomPrefixInput
                value={ownerNo}
                onChange={(e) => handleOwnerNoChange(e.target.value)}
                placeholder="Enter Owner No"
                className="ui-input"
                disabled={loading || isEditMode}
                name={""}
              />
            </div>
          </div>

          <div className="vendor-section">
            <div className="vendor-input-container">
              <OwnerVendorNumberName
                value={vendorNo}
                onChange={handleVendorNoChange}
                companyNo={companyNo}
                disabled={loading}
              />
            </div>
            <div className="active-switch-container">
              <span className="sub-title">Active</span>
              <Switch
                checked={isActive}
                onChange={handleActiveChange}
                disabled={loading}
              />
            </div>
          </div>

          <Divider className="modal-divider" />
        </div>
      }
    />
  );
};

export default AddVendorOwner;
