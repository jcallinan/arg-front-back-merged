import React from "react";
import { Divider, Row, Col } from "antd";
import type { VendorData } from "@/types/accounts-payable.types";
import { formatCurrency } from "@/utils/formatters";
import { formatPhoneNumber } from "@utils/MobilenumberFormat";
import ModalContent from "@widget-library/Modal";
import { CustomStyledButton } from "@widget-library/Buttons";
import Card from "@widget-library/Card";
import companyIcon from "@assets/icons/company-icon.svg";
import vendorIcon from "@assets/icons/vendor-icon.svg";
import vendorNoIcon from "@assets/icons/vendor-no-icon.svg";
import zipCodeIcon from "@assets/icons/card-zip-code-icon.svg";
import phoneIcon from "@assets/icons/card-phone-icon.svg";
 
export interface VendorViewModalProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  onEdit?: () => void;
  vendorData?: VendorData | null;
  hideContacts?: boolean;
}
 
const VendorViewModal: React.FC<VendorViewModalProps> = ({
  visible,
  title,
  onClose,
  onEdit,
  vendorData,
  hideContacts = false,
}) => {
  const vendor = vendorData?.vendorDetails?.vendor;
 
  const renderField = (
    label: string,
    value: string | number | null,
    bold = false
  ) => (
    <div className="field-block">
      <p className="p-xs">{label}</p>
      <h6 className={bold ? "bold" : ""}>{value || "-"}</h6>
    </div>
  );
 
  const sectionHeading = (title: string) => <h4>{title}</h4>;
 
  return (
    <ModalContent
      visible={visible}
      onCancel={onClose}
      className="large-voucher-modal"
      description={
        <div className="modal-wrapper">
          {/* Modal Header */}
          <div className="modal-header">
            <h3>{title}</h3>
          </div>
          <Divider className="vendor-divider" />
 
          {/* Top Cards */}
          <div className="vendor-cards-container">
            <div className="vendor-cards-grid first-row">
              <div className="card-item">
                <Card icon={<img src={companyIcon} alt="" />} label="Company No" value={vendorData?.vendorDetails?.vendor?.vendorCompanyNumber?.toString() || "-"} />
              </div>
              <div className="card-item">
                <Card icon={<img src={companyIcon} alt="" />} label="Company Name" value="A.R.G. BRADFORD DIVISION" />
              </div>
              <div className="card-item">
                <Card icon={<img src={vendorNoIcon} alt="" />} label="Vendor No" value={vendor?.vendorNo?.toString() || "-"} />
              </div>
              <div className="card-item">
                <Card icon={<img src={vendorIcon} alt="" />} label="Vendor Name" value={vendor?.vendorName?.trim() || "-"} />
              </div>
            </div>
 
            <div className="vendor-cards-grid second-row">
              <div className="card-item wide">
                <Card
                  icon={<img src={zipCodeIcon} alt="" />}
                  label="Vendor Address"
                  value={[
                    vendor?.vendorAdd1?.trim(),
                    vendor?.vendorAdd2?.trim(),
                    vendor?.vendorAdd3?.trim(),
                    vendor?.vendorAdd4?.trim()
                  ].filter(Boolean).join(", ") || "-"}
                />
              </div>
              <div className="card-item">
                <Card
                  icon={<img src={zipCodeIcon} alt="" />}
                  label="Zip Code"
                  value={vendor?.vendorZipCode || "-"}
                />
              </div>
              <div className="card-item">
                <Card
                  icon={<img src={phoneIcon} alt="" />}
                  label="Phone"
                  value={vendor?.vendorTelephoneNo ? formatPhoneNumber(vendor.vendorAreaCode, vendor.vendorTelephoneNo) : "-"}
                />
              </div>
            </div>
          </div>
 
          {/* Sections */}
          <div className="modal-body">
 
          {/* Expense Details */}
{sectionHeading("Expense Details")}
 
{/* Row 1 — 3 columns */}
<Row gutter={[16, 16]}>
  <Col span={6}>{renderField("Hold Vendor", vendor?.vendorHoldPaymentsVend?.trim() || "-", true)}</Col>
  <Col span={6}>{renderField("Gals/Rcpts Required", vendor?.vendorGalRcptsRequired || "-", true)}</Col>
  <Col span={6}>{renderField("Single Check", vendor?.vendorSingleCheck?.trim() || "-", true)}</Col>
</Row>
 
{/* Row 2 — 3 columns */}
<Row gutter={[16, 16]}>
  <Col span={6}>{renderField("Terms Code", vendor?.vendorApTermsCode?.toString() || "-", true)}</Col>
 <Col span={6}>{renderField("Terms Description",  vendor?.vendorApTermsCodeDescription?.toString() || "-", true)}</Col>
  <Col span={6}>{renderField("ADP Payroll ID", vendor?.vendorAdpPayrollId?.toString() || "-")}</Col>
</Row>
 
{/* Row 3 — 4 columns */}
<Row gutter={[16, 16]}>
  <Col span={6}>{renderField("Category", vendor?.vendorCategoryCode?.trim() || "-", true)}</Col>
  <Col span={6}>{renderField("Category Description",vendor?.vendorCategoryCodeDescription?.trim() || "-", true)}</Col>
  <Col span={6}>{renderField("Carrier", vendor?.vendorCarrierId?.trim() || "-")}</Col>
  <Col span={6}>{renderField("Expense G/L #", vendor?.vendorExpenseGLSub?.toString() || "-")}</Col>
</Row>
 
 
            <Divider />
 
            {/* Bank Details */}
            {sectionHeading("Bank Details")}
            <Row gutter={[16, 16]}>
              <Col span={6}>{renderField("ACH Bank Account", vendor?.vendorAchBankAccountNumber?.trim() || "-")}</Col>
              <Col span={6}>{renderField("ACH Bank Routing Code", vendor?.vendorAchBankRoutingCode?.toString() || "-")}</Col>
              <Col span={6}>{renderField("ACH Checking or Savings", vendor?.vendorAchCheckingOrSavings?.trim() || "-")}</Col>
              <Col span={6}>{renderField("Class", vendor?.vendorAchClass?.trim() || "-")}</Col>
            </Row>
 
            <Divider />
 
            {/* 1099 Section */}
            {sectionHeading("1099 Section both IRS & PA")}
            <Row gutter={[16, 16]}>
              <Col span={6}>{renderField("First Name", vendor?.vendorFirstName?.trim() || "-")}</Col>
              <Col span={6}>{renderField("Middle Name", vendor?.vendorMiddleName?.trim() || "-")}</Col>
              <Col span={6}>{renderField("Last Name", vendor?.vendorBusinessLastName?.trim() || "-")}</Col>
              <Col span={6}>{renderField("Suffix", vendor?.vendorNameSuffix?.trim() || "-")}</Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={6}>{renderField("1099 Code", vendor?.vendorAp1099Code || "-", true)}</Col>
              <Col span={6}>{renderField("1099 Code Description", vendor?.vendorAp1099CodeDescription || "-", true)}</Col>
              <Col span={6}>{renderField("1099 ID (TIN)", vendor?.vendorIdNumber || "-", true)}</Col>
              <Col span={6}>{renderField("1st 1099 Box #", vendor?.vendorFirst1099BoxNumber?.toString() || "-")}</Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={6}>{renderField("2nd Box #", vendor?.vendorSecond1099BoxNumber?.toString() || "-", true)}</Col>
              <Col span={6}>{renderField("2nd Box Amt", vendor?.vendorSecond1099BoxAmount?.toString() || "-")}</Col>
              <Col span={6}>{renderField("Payee #1", vendor?.vendorPayeeName1?.trim() || "-")}</Col>
              <Col span={6}>{renderField("Payee #2", vendor?.vendorPayeeName2?.trim() || "-")}</Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={6}>{renderField("IRS Name Control", vendor?.vendorIrsNameControl?.trim() || "-")}</Col>
            </Row>
 
            <Divider />
 
            {/* Month-To-Date Values */}
            {sectionHeading("Month - To - Date Values")}
            <Row gutter={[16, 16]}>
              <Col span={6}>{renderField("Current Balance", formatCurrency(vendor?.vendorCurrentBalance || 0), true)}</Col>
              <Col span={6}>{renderField("Purchases", formatCurrency(vendor?.vendorMtdPurchases || 0), true)}</Col>
              <Col span={6}>{renderField("Payments", formatCurrency(vendor?.vendorMtdPayments || 0))}</Col>
              <Col span={6}>{renderField("Discounts", formatCurrency(vendor?.vendorMtdDiscounts || 0))}</Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={6}>{renderField("Previous Bal", formatCurrency(vendor?.vendorPreviousBalance || 0))}</Col>
            </Row>
 
            <Divider />
 
            {/* Year-To-Date Values */}
            {sectionHeading("Year - To - Date Values")}
            <Row gutter={[16, 16]}>
              <Col span={6}>{renderField("This Year Purchases", formatCurrency(vendor?.vendorYtdPurchases || 0))}</Col>
              <Col span={6}>{renderField("This Year Payments", formatCurrency(vendor?.vendorThisYrYtdPaid || 0))}</Col>
              <Col span={6}>{renderField("This Year Discounts", formatCurrency(vendor?.vendorYtdDiscounts || 0))}</Col>
              <Col span={6}>{renderField("Last Payment Date", vendor?.vendorLastPaymentDate ? new Date(vendor.vendorLastPaymentDate).toLocaleDateString() : "-")}</Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={6}>{renderField("Last Year Purchases", formatCurrency(vendor?.vendorLastYearPurchases || 0))}</Col>
              <Col span={6}>{renderField("Last Year Payments", formatCurrency(vendor?.vendorLastYrYtdPaid || 0))}</Col>
              <Col span={6}>{renderField("Last Payment Amount", formatCurrency(vendor?.vendorLastPaymentAmt || 0))}</Col>
            </Row>

            {!hideContacts && (
              <>
                <Divider />

                {/* Vendor Form Type Contacts */}
                {sectionHeading("Vendor Form Type Contacts")}
                {(
                  vendorData?.vendorDetails?.vendorContactDetails || []
                ).length > 0 ? (
                  (vendorData?.vendorDetails?.vendorContactDetails || []).map(
                    (contact: any, idx: number) => (
                      <div key={idx}>
                        <Row gutter={[16, 16]}>
                          <Col span={6}>{renderField("Email", contact?.emailAddress || "-")}</Col>
                          <Col span={6}>{renderField("Form Type Code", contact?.formType || "-")}</Col>
                          <Col span={6}>{renderField("Form Type Description", contact?.formtypeDescription || "-")}</Col>
                          <Col span={6}>{renderField("Contact Name", contact?.contactName || "-")}</Col>
                        </Row>
                        <Row gutter={[16, 16]}>
                          <Col span={6}>{renderField("Comments", contact?.filler || "-")}</Col>
                          <Col span={6}>{renderField("Include ACH Mail", contact?.sendAchEmail || "-")}</Col>
                        </Row>
                        {idx < (vendorData?.vendorDetails?.vendorContactDetails?.length || 0) - 1 && (
                          <Divider />
                        )}
                      </div>
                    )
                  )
                ) : (
                  <Row gutter={[16, 16]}>
                    <Col span={6}>{renderField("Email", "-")}</Col>
                  </Row>
                )}
              </>
            )}
 
          </div>
          <Divider />
 
          <div className="modal-footer">
            <CustomStyledButton name="edit-vendor" label="Edit" onClick={onEdit ?? (() => {})} />
          </div>
        </div>
      }
    />
  );
};
 
export default VendorViewModal;
 
 