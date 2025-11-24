import React from "react";
import CustomDatePicker from "@widget-library/DatePicker";
import ModalContent from "@widget-library/Modal";
import type { PostToPurchase } from "@type-definitions/accounts-payable.types";
import { Divider } from "antd";

const PostToPurchaseJournalModal: React.FC<PostToPurchase> = ({
  visible,
  onCancel,
  onChange,
  onSubmit,
  purchaseJournalDate,
  cashDisbursementDate,
  prepaidCode,
}) => {
  const modalDescription = (
    <>
      <Divider />
      <div className="field-container">
        <label className="sub-title">Purchase Journal Date</label>
        <CustomDatePicker
          name="purchaseJournalDate"
          value={purchaseJournalDate}
          onChange={(_, val) => onChange("purchaseJournalDate", val)}
        />
      </div>

      <div className="field-container form-row">
        <div className="flex-col">
          <label className="sub-title">
            Key Cash Disbursements Journal Date
          </label>
          <span className="p-xs guideline-text">(Prepaid Vouchers Only)</span>
        </div>
        <CustomDatePicker
          name="cashDisbursementDate"
          value={cashDisbursementDate}
          onChange={(_, val) => onChange("cashDisbursementDate", val)}
          disabled={!prepaidCode || prepaidCode === ""}
        />
      </div>
      <Divider />
    </>
  );

  return (
    <ModalContent
      className="flex-align-end"
      title="Post to Purchase Journal"
      visible={visible}
      onCancel={onCancel}
      description={modalDescription}
      actions={[
        {
          name: "submit-post",
          label: "Submit",
          onClick: onSubmit,
        },
      ]}
    />
  );
};

export default PostToPurchaseJournalModal;
