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
  purchaseJournalStatus,
  cashDisbursementStatus,
}) => {
  const isPrepaidEnabled = !!prepaidCode && prepaidCode !== "";

  const modalDescription = (
    <>
      <Divider />
      <div className="field-container">
        <label className="sub-title required">Purchase Journal Date</label>
        <CustomDatePicker
          name="purchaseJournalDate"
          value={purchaseJournalDate}
          onChange={(_, val) => onChange("purchaseJournalDate", val)}
          className={`date-picker${
            purchaseJournalStatus === "error" ? " error" : ""
          }`}
          status={purchaseJournalStatus}
        />
      </div>

      <div className="field-container form-row">
        <div className="flex-col">
          <label className={`sub-title${isPrepaidEnabled ? " required" : ""}`}>
            Key Cash Disbursements Journal Date
          </label>
          <span className="p-xs guideline-text">(Prepaid Vouchers Only)</span>
        </div>
        <CustomDatePicker
          name="cashDisbursementDate"
          value={cashDisbursementDate}
          onChange={(_, val) => onChange("cashDisbursementDate", val)}
          disabled={!isPrepaidEnabled}
          className={`date-picker${
            cashDisbursementStatus === "error" ? " error" : ""
          }`}
          status={cashDisbursementStatus}
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
