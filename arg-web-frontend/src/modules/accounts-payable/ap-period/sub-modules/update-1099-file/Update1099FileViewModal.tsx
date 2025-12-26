import React from "react";
import { Divider, Row, Col } from "antd";
import ModalContent from "@/widget-library/Modal";
import { CustomStyledButton } from "@/widget-library/Buttons";
import Card from "@/widget-library/Card";
import fileIcon from "@/assets/icons/card-report-type-icon.svg";
import calendarIcon from "@/assets/icons/card-payment-term-icon.svg";
import transmitterIcon from "@/assets/icons/card-transmitter-icon.svg";
import "./update-1099-file-modal.scss";
import type { Update1099FileData } from "@/types/accounts-payable.types";
import ActionPermissionGuard from "@shared-components/permissions/ActionPermissionGuard";

interface Update1099FileViewModalProps {
  visible: boolean;
  onClose: () => void;
  onEdit?: () => void;
  data: Update1099FileData | null;
  isEditLoading?: boolean;
}

const Update1099FileViewModal: React.FC<Update1099FileViewModalProps> = ({
  visible,
  onClose,
  onEdit,
  data,
  isEditLoading = false,
}) => {
  if (!data) return null;

  // Debug logging
  React.useEffect(() => {
    if (visible && data) {
      
    }
  }, [visible, data]);

  const renderField = (label: string, value: string | number | null) => (
    <div className="field-block">
      <p className="p-xs">{label}</p>
      <h6>{value ?? "-"}</h6>
    </div>
  );

  // Extract record type safely
  const getRecordType = (recordType: string | undefined) => {
    if (!recordType) return "T";
    // If it's already a single character (T, A, B), return it
    if (recordType.length === 1) return recordType;
    // If it's in format "Record Type X", extract the X
    if (recordType.includes(" ")) {
      return recordType.split(" ")[2] || "T";
    }
    // Default fallback
    return recordType || "T";
  };

    // Get the current record type
  const currentRecordType = getRecordType(data.recordType);
  
    // Dynamic card data based on record type
  const getCardData = () => {
    const baseCards = [
    {
      icon: <img src={fileIcon} alt="Record Type" />,
      label: "Record Type",
        value: currentRecordType,
      },
    ];

    if (currentRecordType === "B") {
      const nameControlValue = (data as any).nameControl || "-";
      const taxPayerIdValue = (data as any).taxPayerId || data.tin || "-";
      const paymentYearValue = (data as any).paymentYear || "-";
      
      return [
        ...baseCards,
        {
          icon: <img src={calendarIcon} alt="Name Control" />,
          label: "Name Control",
          value: nameControlValue,
        },
        {
          icon: <img src={transmitterIcon} alt="Tax Payer ID" />,
          label: "Tax Payer ID",
          value: taxPayerIdValue,
    },
    {
      icon: <img src={calendarIcon} alt="Payment Year" />,
      label: "Payment Year",
          value: paymentYearValue,
        },
      ];
    }

    if (currentRecordType === "A") {
      const paymentYearValue = (data as any).paymentYear || "-";
      const taxPayerIdValue = (data as any).taxPayerId || data.tin || "-";
      
      return [
        ...baseCards,
        {
          icon: <img src={calendarIcon} alt="Payment Year" />,
          label: "Payment Year",
          value: String(paymentYearValue),
        },
        {
          icon: <img src={transmitterIcon} alt="Tax Payer ID" />,
          label: "Tax Payer ID",
          value: String(taxPayerIdValue),
        },
      ];
    }

    // Record Type T
    const paymentYearValue = (data as any).paymentYear || "-";
    const transmitterIdValue = (data as any).transmitterId || data.tin || "-";
    
    return [
      ...baseCards,
      {
        icon: <img src={calendarIcon} alt="Payment Year" />,
        label: "Payment Year",
        value: String(paymentYearValue),
    },
    {
      icon: <img src={transmitterIcon} alt="Transmitter ID" />,
      label: "Transmitter ID",
        value: String(transmitterIdValue),
      },
    ];
  };

  const cardData = getCardData();

  // Render Record Type T fields
  const renderRecordTypeT = () => (
    <>
      <Row gutter={[16, 16]}>
        <Col span={6}>{renderField("Prior Year Data Ind", (data as any).priorYearDataInd || "-")}</Col>
        <Col span={6}>{renderField("Trans Control Code", (data as any).transControlCode || data.ctl || "-")}</Col>
        <Col span={6}>{renderField("Replacement Alpha Char", (data as any).replacementAlphaChar || "-")}</Col>
        <Col span={6}>{renderField("Test File Ind", (data as any).testFileInd || "-")}</Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={6}>{renderField("Foreign Entity Ind", (data as any).foreignEntityInd || "-")}</Col>
        <Col span={6}>{renderField("Transmitter Name", (data as any).transmitterName || "-")}</Col>
        <Col span={6}>{renderField("Transmitter Name2", (data as any).transmitterName2 || "-")}</Col>
        <Col span={6}>{renderField("Company Name", (data as any).companyName || "-")}</Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={6}>{renderField("Company Name2", (data as any).companyName2 || "-")}</Col>
        <Col span={6}>{renderField("Company Address", (data as any).companyAddress || "-")}</Col>
        <Col span={6}>{renderField("Company City", (data as any).companyCity || "-")}</Col>
        <Col span={6}>{renderField("Company State", (data as any).companyState || "-")}</Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={6}>{renderField("Company Zip code", (data as any).companyZipCode || "-")}</Col>
        <Col span={6}>{renderField("Total Number of Payees", (data as any).totalNumberOfPayees || "-")}</Col>
        <Col span={6}>{renderField("Contact Name", (data as any).contactName || "-")}</Col>
        <Col span={6}>{renderField("Contact Phone Number", (data as any).contactPhoneNumber || "-")}</Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={6}>{renderField("Magnetic Tape File Ind", (data as any).magneticTapeFileInd || "-")}</Col>
        <Col span={6}>{renderField("Electronic File Name", (data as any).electronicFileName || "-")}</Col>
        <Col span={6}></Col>
        <Col span={6}></Col>
      </Row>
    </>
  );

  // Render Record Type A fields
  const renderRecordTypeA = () => (
    <>
      <Row gutter={[16, 16]}>
        <Col span={6}>{renderField("Payer Name Control", (data as any).payerNameControl || "-")}</Col>
        <Col span={6}>{renderField("Last Filing Indicator", (data as any).lastFilingIndicator || "-")}</Col>
        <Col span={6}>{renderField("Combine Fed/State File", (data as any).combineFedStateFiler || "-")}</Col>
        <Col span={6}>{renderField("Type of Return", (data as any).typeOfReturn || "-")}</Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={6}>{renderField("Amount Codes", (data as any).amountCodes || "-")}</Col>
        <Col span={6}>{renderField("Foreign Entity Indicator", (data as any).foreignEntityIndicator || "-")}</Col>
        <Col span={6}>{renderField("First Payer Name", (data as any).firstPayeeName || data.firstPayeeName || "-")}</Col>
        <Col span={6}>{renderField("Second Payer Name", (data as any).secondPayerName || "-")}</Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={6}>{renderField("Transfer Agent Indicators", (data as any).transferAgentIndicator || "-")}</Col>
        <Col span={6}>{renderField("Payer Shipping Address", (data as any).payerShippingAddress || "-")}</Col>
        <Col span={6}>{renderField("Payer City", (data as any).payerCity || "-")}</Col>
        <Col span={6}>{renderField("Payer State", (data as any).payerState || "-")}</Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={6}>{renderField("Payer Zip 9 Code", (data as any).payerZipCode || "-")}</Col>
        <Col span={6}>{renderField("Payers Phone Number", (data as any).payerPhoneNumber || "-")}</Col>
        <Col span={6}></Col>
        <Col span={6}></Col>
      </Row>
    </>
  );

  // Render Record Type B fields
  const renderRecordTypeB = () => (
    <>
      <Row gutter={[16, 16]}>
        <Col span={6}>{renderField("Type of TIN Number", (data as any).typeOfTIN || "-")}</Col>
        <Col span={6}>{renderField("Corrected Return Ind", (data as any).correctedReturnIndicator || "-")}</Col>
        <Col span={6}>{renderField("Payer Acct # for Payee", (data as any).payerAccountNum || "-")}</Col>
        <Col span={6}>{renderField("Payer Office Code", (data as any).payerOfficeCode || "-")}</Col>
      </Row>
      <Divider/>
      <Row gutter={[16, 16]}>
        <Col span={6}>{renderField("Pay Amount 1", (data as any).payAmt1 || 0)}</Col>
        <Col span={6}>{renderField("Pay Amount 2", (data as any).payAmt2 || 0)}</Col>
        <Col span={6}>{renderField("Pay Amount 3", (data as any).payAmt3 || 0)}</Col>
        <Col span={6}>{renderField("Pay Amount 4", (data as any).payAmt4 || 0)}</Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={6}>{renderField("Pay Amount 5", (data as any).payAmt5 || 0)}</Col>
        <Col span={6}>{renderField("Pay Amount 6", (data as any).payAmt6 || 0)}</Col>
        <Col span={6}>{renderField("Pay Amount 7", (data as any).payAmt7 || 0)}</Col>
        <Col span={6}>{renderField("Pay Amount 8", (data as any).payAmt8 || 0)}</Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={6}>{renderField("Pay Amount 9", (data as any).payAmt9 || 0)}</Col>
        <Col span={6}>{renderField("Pay Amount A", (data as any).payAmtA || 0)}</Col>
        <Col span={6}>{renderField("Pay Amount B", (data as any).payAmtB || 0)}</Col>
        <Col span={6}>{renderField("Pay Amount C", (data as any).payAmtC || 0)}</Col>
      </Row>
      <Divider/>
      <Row gutter={[16, 16]}>
        <Col span={6}>{renderField("Foreign Country Code", (data as any).foreignCountryCode || "-")}</Col>
        <Col span={6}>{renderField("1st Payee Name", (data as any).firstPayeeName || data.firstPayeeName || "-")}</Col>
        <Col span={6}>{renderField("2nd Payee Name", (data as any).secondPayeeName || "-")}</Col>
        <Col span={6}>{renderField("Payee Address", (data as any).payeeAddress || "-")}</Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={6}>{renderField("Payee City", (data as any).payeeCity || "-")}</Col>
        <Col span={6}>{renderField("Payee State/Zip", (data as any).payeeState || "-")}</Col>
        {/* <Col span={6}>{renderField("Payee Zip", (data as any).payeeZip || "-")}</Col> */}
        {/* <Col span={6}>{renderField("Deletion Indicator", (data as any).deletionIndicator || "-")}</Col> */}
          <Col span={6}>{renderField("2nd Tin Notice (2)", (data as any).secondTinNotice || "-")}</Col>
                    <Col span={6}>{renderField("Foreign country/US POS", (data as any).foreignCountryOrUsPos || "-")}</Col>
      </Row>
      <Row gutter={[16, 16]}>
         <Col span={6}>{renderField("Director Sales Ind", (data as any).directorSalesInd || "-")}</Col>
          <Col span={6}>{renderField("Special Data Entr", (data as any).specialDataEntry || "-")}</Col>
           <Col span={6}>{renderField("State INCM Tax Withheld", (data as any).stateIncomeTaxWithheld || "-")}</Col>
            <Col span={6}>{renderField("Local INCM Tax Withheld", (data as any).localIncomeTaxWithheld || "-")}</Col>
        <Col span={6}>{renderField("Sequence Number", (data as any).sequenceNumber || "-")}</Col>
        <Col span={6}></Col>
        <Col span={6}></Col>
        <Col span={6}></Col>
      </Row>
       <Row gutter={[16, 16]}>
         <Col span={6}>{renderField("Combined FED/STATE CODE", (data as any).combinedFedStateCode || "-")}</Col>
         <Col span={6}>{renderField("Payee Last/Business", (data as any).payeeLastOrBusinessName || "-")}</Col>
        <Col span={6}></Col>
        <Col span={6}></Col>
        <Col span={6}></Col>
      </Row>
      <Divider/>
       <Row gutter={[16, 16]}>
        
        <Col span={6}>{renderField("Payee First Name", (data as any).payeeFirstName || "-")}</Col>
      <Col span={6}>{renderField("Payee Middle Name", (data as any).payeeMiddleName || "-")}</Col>
    <Col span={6}>{renderField("Suffix", (data as any).payeeSuffix || "-")}</Col>
        <Col span={6}></Col>
      </Row>
    </>
  );

  const descriptionContent = (
    <div className="modal-wrapper update-1099-modal">
      <div className="modal-header">
        <h3 className="modal-utiliy-title">A/P 1099 File Maintenance</h3>
        <Divider className="vendor-divider" />

        {/* Cards with CSS Grid - Equal Width */}
        <div className="card-grid-container">
          {cardData.map((card, idx) => (
            <Card
              key={idx}
              icon={card.icon}
              label={card.label}
              value={card.value}
            />
          ))}
        </div>

        <Divider className="vendor-divider" />
      </div>

      <div className="modal-body">
        <div className="voucher-section">
          {currentRecordType === "T" && renderRecordTypeT()}
          {currentRecordType === "A" && renderRecordTypeA()}
          {currentRecordType === "B" && renderRecordTypeB()}
        </div>
      </div>

      {/* Divider above Edit Button */}
      <Divider className="vendor-divider" />

      {/* Edit Button with flex-end */}
      <div className="modal-footer flex-end modal-edit-footer">
        <ActionPermissionGuard actionId="update-1099-file.edit">
          <CustomStyledButton
            name="edit-1099-file"
            label={<h6>Edit</h6>}
            onClick={onEdit ?? (() => {})}
            loading={isEditLoading}
          />
        </ActionPermissionGuard>
      </div>
    </div>
  );

  return (
    <ModalContent
      visible={visible}
      onCancel={onClose}
      className="large-voucher-modal"
      description={descriptionContent}
    />
  );
};

export default Update1099FileViewModal;
