import React from "react";
import { Modal } from "antd";
import deleteIcon from "@/assets/icons/delete-pop-up-icon.svg";
import { CustomStyledButton, DefaultButton } from "./Buttons";

interface DeleteConfirmationModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  itemName: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  visible,
  onConfirm,
  onCancel,
  itemName,
}) => {
  return (
  <Modal
  className="cne-modal descripition"
  open={visible}
  onCancel={onCancel}
  footer={[
    <DefaultButton key="cancel" name="no" label="No" onClick={onCancel} />,
    <CustomStyledButton key="confirm" name="yes" label="Yes" onClick={onConfirm} />,
  ]}
  closable={false}
  centered
  title={null}
>
  <div className="modal-body-wrapper flex-column">
    <img src={deleteIcon} alt="Delete" className="delete-icon" />
    <h5 className="modal-utiliy-title">{`Would You Like to Delete ${itemName}?`}</h5>
    <p className="p-xs">{`${itemName} will be deleted permanently`}</p>
  </div>
</Modal>

  );
};

export default DeleteConfirmationModal;
