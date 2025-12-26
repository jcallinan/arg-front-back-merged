import React, { useEffect, useState } from "react";
import { Divider, Row, Col, message } from "antd";
import { useVoucherEntry } from "@hooks/useVoucherEntry";
import ModalContent from "@widget-library/Modal";
import Card from "@widget-library/Card";
import { CustomStyledButton } from "@widget-library/Buttons";
import ActionPermissionGuard from "@shared-components/permissions/ActionPermissionGuard";
import vendorIcon from "@assets/icons/vendor-icon.svg";
import vendorNoIcon from "@assets/icons/vendor-no-icon.svg";
import "../create-entry/create-entry.scss";
import type {
  ViewVoucherModalProps,
 
} from "@type-definitions/accounts-payable.types";
import { holdVoucherDescriptions } from "@constants/commonConstants";
import { formatAmountValue } from "@utils/formatters";
 
const ViewVoucherModal: React.FC<ViewVoucherModalProps> = ({
  visible,
  title,
  entryNo,
  vendorNo,
  companyNo,
  onClose,
  onEdit,
  editActionId,
}) => {
  const [voucherData, setVoucherData] = useState<any>(null);
  const [detailItems, setDetailItems] = useState<any[]>([]);
  const { fetchVoucherDataByEntryNo } = useVoucherEntry();
 
  useEffect(() => {
    const fetchVoucherDataByEntry = async () => {
      if (!visible) return;
      try {
        const response = await fetchVoucherDataByEntryNo({
          entryNo: Number(entryNo),
          companyNo,
          vendorNo,
        });
 
        setVoucherData(response.data?.items?.headerItem || null);
        setDetailItems(response.data?.items?.detailItems || []);
      } catch (err) {
        console.error("Voucher fetch error:", err);
        message.error("Failed to fetch voucher data.");
      }
    };
 
    fetchVoucherDataByEntry();
  }, [entryNo, companyNo, vendorNo, visible, fetchVoucherDataByEntryNo]);
 
  const formatAmount = (label: string, value: any): string => {
    if (value === null || value === undefined || value === "" || value === 0 || value === "0") return "-";
    const formatted = formatAmountValue(label, value?.toString());
    return formatted === "" ? "-" : `$${formatted}`;
  };
 
  const renderField = (label: string, value: any, bold = false) => {
    // Handle zero values for numeric fields that should display as "-"
    let displayValue = value;
    if (value === 0 || value === "0") {
      displayValue = "-";
    } else if (!value) {
      displayValue = "-";
    }
   
    return (
      <div className="field-block">
        <p className="p-xs">{label}</p>
        <h6 className={bold ? "bold" : ""}>{displayValue}</h6>
      </div>
    );
  };
 
  const cardWrapper = (
    <div className="card-container-row flex-align gap-16">
      <div className="card-left">
        <Card
          icon={<img src={vendorIcon} alt="Vendor Icon" />}
          label="Vendor Name"
          value={voucherData?.vendorName || "-"}
        />
      </div>
      <div className="card-right">
        <Card
          icon={<img src={vendorNoIcon} alt="Vendor No Icon" />}
          label="Vendor No"
          value={
            voucherData?.vendorNo && voucherData.vendorNo !== 0
              ? voucherData.vendorNo.toString()
              : "-"
          }
        />
      </div>
    </div>
  );
 
  const descriptionContent = (
    <div className="voucher-section">
      <Row gutter={[16, 16]}>
        <Col span={6}>{renderField("Invoice No", voucherData?.invoiceNo)}</Col>
        <Col span={6}>
          {renderField("Invoice Date", voucherData?.invoiceDate)}
        </Col>
        <Col span={6}>
          {renderField("Discount Due Date", voucherData?.discountDueDate)}
        </Col>
        <Col span={6}>{renderField("Due Date", voucherData?.dueDate)}</Col>
      </Row>
 
      <Row gutter={[16, 16]}>
        <Col span={6}>
          {renderField("Invoice Amount", formatAmount("Invoice Amount", voucherData?.invoiceAmount))}
        </Col>
        <Col span={6}>
          {renderField("Invoice Description", voucherData?.invoiceDesc, true)}
        </Col>
        <Col span={6}>
          {renderField("Freight", formatAmount("Freight", voucherData?.totalFreight))}
        </Col>
        <Col span={6}>
          {renderField("Prepaid Voucher", voucherData?.prepaidCode)}
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          {renderField("Single Check", voucherData?.singleCheck)}
        </Col>
        <Col span={6}>{renderField("Acct Pay G/L", voucherData?.apGlNo)}</Col>
        <Col span={6}>{renderField("Bank Acct G/L", voucherData?.bankGl)}</Col>
        <Col span={6}>{renderField("Hold Voucher", voucherData?.holdCode)}</Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          {renderField(
            "Hold Description",
            holdVoucherDescriptions[voucherData?.holdCode || ""] || "-",
            true
          )}
        </Col>
        <Col span={6}>
          {renderField("Sales Order", voucherData?.salesOrderNo)}
        </Col>
        <Col span={6}>{renderField("SRN", voucherData?.srn)}</Col>
      </Row>
 
      <Divider />
 
      {detailItems.map((item, idx) => (
        <div key={idx} style={{ marginBottom: "24px" }}>
          <h5 style={{ marginBottom: "12px", fontWeight: 600 }}>
            Line Item {idx + 1}
          </h5>
          <Row gutter={[16, 16]}>
            <Col span={6}>
              {renderField("Product Amount", formatAmount("Product Amount", item.productAmount))}
            </Col>
            <Col span={6}>{renderField("Line Desc", item.lineDesc)}</Col>
            <Col span={6}>{renderField("Line G/L", item.lineGlNo)}</Col>
            <Col span={6}>
              {renderField("Discount Amount", formatAmount("Discount Amount", item.discountAmount))}
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={6}>
              {renderField(
                "Discount Percentage",
                item.discountPercentage && item.discountPercentage !== 0 && item.discountPercentage !== "0"
                  ? `${item.discountPercentage}%`
                  : "-"
              )}
            </Col>
            <Col span={6}>{renderField("PO Number", item.poNo)}</Col>
            <Col span={6}>{renderField("Freight", formatAmount("Freight", item.freightAmount))}</Col>
            <Col span={6}>{renderField("PO Line No", item.poLineNo)}</Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={6}>{renderField("Quantity", item.quantity)}</Col>
            <Col span={6}>{renderField("Gallons", item.gallons)}</Col>
            <Col span={6}>{renderField("Receipt No", item.receiptNo)}</Col>
            <Col span={6}>{renderField("Open/Closed", item.openClosed)}</Col>
          </Row>
          {idx !== detailItems.length - 1 && <Divider />}
        </div>
      ))}
    </div>
  );
 
  return (
    <ModalContent
      visible={visible}
      onCancel={onClose}
      className="large-voucher-modal"
      description={
        <div className="modal-wrapper">
          <div className="modal-header">
            <h3 className="modal-utiliy-title">{title}</h3>
            <Divider className="vendor-divider" />
            {cardWrapper}
            <Divider className="vendor-divider" />
          </div>
 
          <div className="modal-body">{descriptionContent}</div>
  <Divider className="vendor-divider" />
          <div className="view-modal">
            {editActionId ? (
              <ActionPermissionGuard actionId={editActionId}>
                <CustomStyledButton
                  name="edit-voucher"
                  label="Edit"
                  onClick={onEdit ?? (() => {})}
                />
              </ActionPermissionGuard>
            ) : (
              <CustomStyledButton
                name="edit-voucher"
                label="Edit"
                onClick={onEdit ?? (() => {})}
              />
            )}
          </div>
        </div>
      }
    />
  );
};
 
export default ViewVoucherModal;
 
 