import React, { useState } from "react";
import Toaster from "./Toaster";
import { Divider, Row, Col } from "antd";
import "../modules/accounts-payable/voucher-management/sub-modules/voucher-entry/process-types/normal/create-entry/create-entry.scss";
import ModalContent from "./Modal";
import { CustomStyledButton } from "./Buttons";
import Card from "./Card";
import ActionPermissionGuard from "@shared-components/permissions/ActionPermissionGuard";
import { useLocation } from "react-router-dom";
export interface CardData {
   icon: string; // path to icon
   label: string;
   value: string | number;

   width?: string;
}

export interface FieldBlock {
   label: string;
   value: string | number | null;
   bold?: boolean;
}

export interface LineItem {
   title: string;
   fields: FieldBlock[][];
}

export interface VoucherViewModalWidgetProps {
   visible: boolean;
   title: string;
   onClose: () => void;
   onEdit?: () => void;
   editActionId?: string;
   cardData: CardData[];
   fieldSections: FieldBlock[][];
   lineItems?: LineItem[];
}

const VoucherViewModalWidget: React.FC<VoucherViewModalWidgetProps> = ({
   visible,
   title,
   onClose,
   onEdit,
   editActionId,
   cardData,
   fieldSections,
   lineItems = [],
}) => {
    const location = useLocation();
    const [toasterType, _setToasterType] = useState<"success" | "error">("success");
    const [toasterMessage, setToasterMessage] = useState("");
    const [toasterDescription, setToasterDescription] = useState("");
    const showEditButton = location.pathname.includes('voucher-entry');

   const renderField = (label: string, value: any, bold = false) => (
      <div className="field-block">
         <p className="p-xs">{label}</p>
         <h6 className={bold ? "bold" : ""}>{value ?? "-"}</h6>
      </div>
   );

   const cardWrapper = (
      <div className="card-container-row flex-align gap-16">
         {cardData.map((card, idx) => (
            <div
               key={idx}
               className="card-single"
               style={{ width: card.width ?? "100%" }}
            >
               <Card
                  icon={<img src={card.icon} alt={`${card.label} Icon`} />}
                  label={card.label}
                  value={card.value ?? "-"}
               />
            </div>
         ))}
      </div>
   );

   const descriptionContent = (
      <div className="voucher-section">
         {fieldSections.map((section, rowIdx) => (
            <Row gutter={[16, 16]} key={rowIdx}>
               {section.map((field, colIdx) => (
                  <Col span={6} key={colIdx}>
                     {renderField(field.label, field.value, field.bold)}
                  </Col>
               ))}
            </Row>
         ))}

         {lineItems.length > 0 && <Divider />}
         {lineItems.map((line, idx) => (
            <div key={idx} style={{ marginBottom: "24px" }}>
               <h5 style={{ marginBottom: "12px", fontWeight: 600 }}>
                  {`Line Item ${idx + 1}${line.title ? ` - ${line.title}` : ""}`}
               </h5>
               {line.fields.map((rowFields, rowIdx) => (
                  <Row gutter={[16, 16]} key={rowIdx}>
                     {rowFields.map((field, colIdx) => (
                        <Col span={6} key={colIdx}>
                           {renderField(field.label, field.value, field.bold)}
                        </Col>
                     ))}
                  </Row>
               ))}
               {idx !== lineItems.length - 1 && <Divider />}
            </div>
         ))}
      </div>
   );

   return (
      <>
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
               {showEditButton && (
                 <div className="modal-footer">
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
               )}
            </div>
         }
      />
      </>
   );
};

export default VoucherViewModalWidget;
