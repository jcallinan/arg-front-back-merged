import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Popover } from "antd";
import ProcessType from "@shared-components/process-type/ProcessType";
import CompanyName from "@shared-components/company-number/CompanyNo";
import { CustomStyledButton } from "@widget-library/Buttons";
import plusIcon from "@assets/icons/plus-icon.svg";
import upload from "@assets/icons/upload.svg";
import uploadIcon from "@assets/icons/upload-csv-icon.svg";
import downloadIcon from "@assets/icons/Download.svg";
import infoIcon from "@assets/icons/info-circle-icon.svg";
import attachmentIcon from "@assets/icons/attachment-paper-clip-icon.svg";
import deleteIcon from "@assets/icons/delete-attach-icon.svg";
import {
  UPLOAD_CSV_MODAL_TEXTS,
  VOUCHER_ENTRY_TEXTS,
} from "@constants/commonConstants";
import "./voucher-entry.scss";
import NormalProcess from "./process-types/normal/NormalProcess";
import FlexiProcess from "./process-types/flexi/FlexiProcess";
import ArglmsProcess from "./process-types/arg-lms/ArglmsProcess";
import PaperProcess from "./process-types/paper/PaperProcess";
import UploadCSVModal from "./process-types/flexi/UploadCSVModal";
import SogasProcess from "./process-types/sogas/SogasProcess";
import { CustomSelectDropdown } from "@widget-library/Dropdown";
import { useSocket } from "@hooks/useSocket";
import { useTemplateDownload } from "@hooks/useTemplateDownload";
import type { ToasterProps } from "@type-definitions/accounts-payable.types";
import Toaster from "@widget-library/Toaster";
import {
  mapUrlToApiValue,
  mapApiValueToUrl,
  getProcessTypeLabel,
} from "@utils/processTypeMapping";
import { useAuth } from "@modules/auth/customhooks/useAuth";
import { hasVoucherEntryAccess } from "@utils/permissionUtils";

const VoucherEntry: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get auth data for permission checking
  const { lastLoginResponse, isLoading: authLoading } = useAuth();
  
  // Check if user has access to voucher entry
  const { hasPermission: hasAccess } = hasVoucherEntryAccess(lastLoginResponse);
  
  // Show loading while checking permissions
  if (authLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div>Loading...</div>
        <div style={{ fontSize: '14px', color: '#666' }}>Checking permissions...</div>
      </div>
    );
  }
  
  // Show access denied if user doesn't have permission
  if (!hasAccess) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        flexDirection: 'column',
        gap: '16px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '48px' }}>🔒</div>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#d32f2f' }}>
          Access Denied
        </div>
        <div style={{ fontSize: '16px', color: '#666', maxWidth: '400px' }}>
          You don't have permission to access Voucher Entry. Please contact your administrator to request access.
        </div>
        <div style={{ marginTop: '16px' }}>
          <CustomStyledButton 
            name="back-button"
            onClick={() => navigate('/accounts-payable')}
            label="Back to Accounts Payable"
          />
        </div>
      </div>
    );
  }

  // Initialize process type from URL parameter
  const urlProcessType = id ? mapUrlToApiValue(id) : "NORMAL";
  const [selectedProcessType, setSelectedProcessType] = useState(
    getProcessTypeLabel(urlProcessType)
  );
  const [selectedProcessTypeApi, setSelectedProcessTypeApi] =
    useState(urlProcessType);
  const [selectedCompany, setSelectedCompany] = useState("10");
  const [selectedSogasType, setSelectedSogasType] = useState("SOGAS Regular");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [uploadSource, setUploadSource] = useState<"Flexi" | "Sogas" | null>(
    null
  );
  const [uploadedFlexiFileName, setUploadedFlexiFileName] = useState<
    string | null
  >(null);
  const [uploadedSogasFileName, setUploadedSogasFileName] = useState<
    string | null
  >(null);
  const [lastUploadSource, setLastUploadSource] = useState<
    "Flexi" | "Sogas" | null
  >(null);
  const [toasterData, setToasterData] = useState<ToasterProps | null>(null);

  const {
    uploadStatusData,
    uploadPaperStatusData,
    uploadLmsStatusData,
    emitSocketEvent,
  } = useSocket();

  const { downloadTemplate, isDownloading } = useTemplateDownload();

  const sogasOptions = [
    { label: "SOGAS Regular", value: "SOGAS Regular" },
    { label: "SOGAS Tax", value: "SOGAS Tax" },
  ];

  // Download template handlers
  const handleDownloadFlexiTemplate = async () => {
    await downloadTemplate('flexi');
  };

  const handleDownloadSogasTemplate = async () => {
    await downloadTemplate('sogas');
  };

  // Handle process type change and update URL
  const handleProcessTypeChange = (apiValue: string) => {
    // Update both the display label and API value in state
    const label = getProcessTypeLabel(apiValue);
    setSelectedProcessType(label);
    setSelectedProcessTypeApi(apiValue);

    // Convert API value to URL-friendly format and navigate
    const urlValue = mapApiValueToUrl(apiValue);
    navigate(`/accounts-payable/voucher-management/voucher-entry/${urlValue}`);
  };

  // Update process type when URL parameter changes
  useEffect(() => {
    if (id) {
      const apiValue = mapUrlToApiValue(id);
      const label = getProcessTypeLabel(apiValue);
      setSelectedProcessType(label);
      setSelectedProcessTypeApi(apiValue);
    }
  }, [id]);

  useEffect(() => {
    if (location.state?.selectedProcessType) {
      setSelectedProcessType(location.state.selectedProcessType);

      if (location.state?.successMessage) {
        setToasterData({
          type: "success",
          title: "Success",
          subtitle: location.state.successMessage,
          onClose: () => setToasterData(null),
        });
      }

      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    return () => {
      setUploadedFlexiFileName(null);
    };
  }, [selectedProcessType]);

  useEffect(() => {}, [uploadStatusData]);

  const popoverContent = (
    <div>
      <p className="p-m">
        This screen allows you to select the process to be used for entering A/P
        vouchers. The <strong>'NORMAL'</strong> option allows for normal
        processing using the interactive A/P voucher entry screens. By selecting{" "}
        <strong>'ARGLMS'</strong> the importing from the LMS selection screen is
        displayed allowing you to select whichever vouchers are to be processed.{" "}
        <strong>'PAPER'</strong> will allow selection of manually entered
        freight matching invoices. <strong>'FLEXI'</strong> will import a CSV
        table from the FlexiCapture application for Normal voucher entry.
      </p>
      <br />

      <p className="p-m">
        Note: Only <strong>'NORMAL'</strong>, <strong>'ARGLMS'</strong>,{" "}
        <strong>'PAPER'</strong>, or <strong>'FLEXI'</strong> values are allowed
      </p>
    </div>
  );

  return (
    <div className="voucherentry-container">
      <h3 className="title">{VOUCHER_ENTRY_TEXTS.title}</h3>

      <div className="content-div-container">
        <div className="content-card-header flex-between">
          <div className="flex">
            <h4>{VOUCHER_ENTRY_TEXTS.voucherProcessSelection}</h4>
            <div className="info-icon">
              <Popover
                placement="rightTop"
                title={
                  <span className="h5">A/P Voucher Process Selection</span>
                }
                content={popoverContent}
                overlayClassName="custom-popover"
              >
                <img src={infoIcon} alt="info" className="info-icon" />
              </Popover>
            </div>
          </div>
        </div>

        <div className="content-card-body flex-content">
          <ProcessType
            value={selectedProcessTypeApi}
            onChange={handleProcessTypeChange}
          />

          {selectedProcessTypeApi === "NORMAL" && (
            <>
              <CompanyName
                value={selectedCompany}
                onChange={setSelectedCompany}
              />
              <CustomStyledButton
                name="createNewEntry"
                label={<h6>{VOUCHER_ENTRY_TEXTS.createNewEntry}</h6>}
                onClick={() => {
                  navigate(`create-new-entry`, {
                    state: {
                      mode: "create",
                      processType: selectedProcessType,
                    },
                  });
                }}
                icon={<img src={plusIcon} alt="plus" className="plus-icon" />}
              />
            </>
          )}

          {selectedProcessTypeApi === "FLEXI" && (
            <>
              <CustomStyledButton
                name="uploadCSV"
                label={<h6>{UPLOAD_CSV_MODAL_TEXTS.TITLE}</h6>}
                onClick={() => {
                  setUploadSource("Flexi");
                  setIsModalVisible(true);
                }}
                icon={
                  <img src={uploadIcon} alt="upload" className="plus-icon" />
                }
              />
              <CustomStyledButton
                name="downloadTemplate"
                label={<h6>{VOUCHER_ENTRY_TEXTS.downloadTemplate}</h6>}
                onClick={handleDownloadFlexiTemplate}
                loading={isDownloading}
                icon={
                  <img src={downloadIcon} alt="download" className="file-icons" />
                }
              />

              {uploadedFlexiFileName && (
                <div className="uploaded-file-tag">
                  <img src={attachmentIcon} alt="attach" />
                  <span className="file-name">{uploadedFlexiFileName}</span>
                  <img
                    src={deleteIcon}
                    alt="delete"
                    className="delete-icon"
                    onClick={() => setUploadedFlexiFileName(null)}
                  />
                </div>
              )}
            </>
          )}

          {selectedProcessTypeApi === "SOGAS" && (
            <>
              <div>
                <p className="sub-title">
                  {" "}
                  <span className="astricks">*</span> Select
                </p>
                <CustomSelectDropdown
                  name="processType"
                  options={sogasOptions}
                  value={selectedSogasType}
                  onChange={(value) => setSelectedSogasType(value)}
                  placeholder="Select SOGAS Type"
                  className="ui-dropdown-pt"
                />
              </div>
              <CustomStyledButton
                name="uploadCSV"
                label={<h6>{UPLOAD_CSV_MODAL_TEXTS.TITLE}</h6>}
                onClick={() => {
                  setUploadSource("Sogas");
                  setIsModalVisible(true);
                }}
                icon={<img src={upload} alt="upload" className="plus-icon" />}
              />
              <CustomStyledButton
                name="downloadTemplate"
                label={<h6>{VOUCHER_ENTRY_TEXTS.downloadTemplate}</h6>}
                onClick={handleDownloadSogasTemplate}
                loading={isDownloading}
                icon={
                  <img src={downloadIcon} alt="download" className="file-icons" />
                }
              />

              {uploadedSogasFileName && (
                <div className="uploaded-file-tag">
                  <img src={attachmentIcon} alt="attach" />
                  <span className="file-name">{uploadedSogasFileName}</span>
                  <img
                    src={deleteIcon}
                    alt="delete"
                    className="delete-icon"
                    onClick={() => setUploadedSogasFileName(null)}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="content-div-container">
        {selectedProcessTypeApi === "NORMAL" && (
          <NormalProcess selectedCompany={selectedCompany} />
        )}

        {selectedProcessTypeApi === "FLEXI" && (
          <FlexiProcess
            uploadStatusData={uploadStatusData}
            selectedCompany={""}
            useUploadSummary={lastUploadSource === "Flexi"}
          />
        )}

        {selectedProcessTypeApi === "ARGLMS" && (
          <ArglmsProcess uploadStatusData={uploadLmsStatusData} />
        )}
        {selectedProcessTypeApi === "PAPER" && (
          <PaperProcess
            uploadStatusData={uploadPaperStatusData}
            defaultActiveTab={(location.state as any)?.defaultActiveTab}
          />
        )}
        {selectedProcessTypeApi === "SOGAS" && (
          <SogasProcess
            sogasType={selectedSogasType}
            uploadStatusData={uploadStatusData}
            useUploadSummary={lastUploadSource === "Sogas"}
          />
        )}
      </div>

      {uploadSource && (
        <UploadCSVModal
          visible={isModalVisible}
          source={uploadSource}
          sogasType={uploadSource === "Sogas" ? selectedSogasType : undefined}
          onCancel={() => {
            setIsModalVisible(false);
            setUploadSource(null);
          }}
          onUploadSuccess={(fileName: string) => {
            if (uploadSource === "Flexi") {
              setUploadedFlexiFileName(fileName);
              setLastUploadSource("Flexi");
            } else if (uploadSource === "Sogas") {
              setUploadedSogasFileName(fileName);
              setLastUploadSource("Sogas");
            }
            setToasterData({
              type: "success",
              title: "Upload Successful",
              subtitle: `${fileName} uploaded successfully.`,
              onClose: () => setToasterData(null),
            });
            emitSocketEvent("upload-complete", {
              source: uploadSource,
              timestamp: new Date().toISOString(),
            });
            setIsModalVisible(false);
            setUploadSource(null);
          }}
          onUploadError={(errMsg) => {
            setToasterData({
              type: "error",
              title: "Upload Failed",
              subtitle: errMsg,
              onClose: () => setToasterData(null),
            });
            setIsModalVisible(false);
            setUploadSource(null);
          }}
          uploadComplete={() => {
            setIsModalVisible(false);
            setUploadSource(null);
          }}
        />
      )}

      {toasterData && (
        <Toaster
          type={toasterData.type}
          title={toasterData.title}
          subtitle={toasterData.subtitle}
          onClose={toasterData.onClose}
        />
      )}
    </div>
  );
};

export default VoucherEntry;
