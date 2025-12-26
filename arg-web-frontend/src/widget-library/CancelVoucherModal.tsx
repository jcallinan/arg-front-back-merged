import React from "react";
import { Modal } from "antd";
import cancelVoucherIcon from "@/assets/icons/cancel-voucher-modal-icon.svg";
import { CustomStyledButton, DefaultButton } from "./Buttons";

interface CancelVoucherModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  itemName: string;
  voucherType?: "paid" | "unpaid";
}

const CancelVoucherModal: React.FC<CancelVoucherModalProps> = ({
  visible,
  onConfirm,
  onCancel,
  voucherType = "unpaid",
}) => {
  return (
  <Modal
  className="cne-modal descripition"
  open={visible}
  onCancel={onCancel}
  footer={[
    <DefaultButton key="cancel" name="no" label="No" onClick={onCancel} />,
    <CustomStyledButton
      key="confirm"
      name="yes"
      label={voucherType === "paid" ? "Yes, Void" : "Yes, Cancel"}
      onClick={onConfirm}
    />,
  ]}
  closable={false}
  centered
  title={null}
>
  <div className="modal-body-wrapper flex-column">
    <img src={cancelVoucherIcon} alt="Cancel Voucher" className="delete-icon" />
    <h5 className="modal-utiliy-title">
      {voucherType === "paid" ? "Would You Like to Void Paid Voucher?" : "Would You Like to Cancel Voucher?"}
    </h5>
    <p className="p-xs">{`This cancelled record will be moved to voucher entry section`}</p>
  </div>
</Modal>

  );
};

export default CancelVoucherModal;