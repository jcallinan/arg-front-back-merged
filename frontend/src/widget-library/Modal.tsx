import React from "react";
import { Modal } from "antd";
import { CustomStyledButton, DefaultButton } from "@widget-library/Buttons";
import type { ModalContentProps } from "@type-definitions/accounts-payable.types";

const ModalContent: React.FC<
  ModalContentProps & { showCloseIcon?: boolean }
> = ({
  className,
  title,
  description,
  visible,
  onCancel,
  actions = [],
  imageUrl,
  showCloseIcon = true,
}) => {
  return (
    <Modal
      className={className}
      title={null}
      centered
      open={visible}
      onCancel={onCancel}
      closable={showCloseIcon}
      footer={actions.map((action, index) =>
        action.type === "default" ? (
          <DefaultButton
            key={index}
            name={action.name}
            label={action.label}
            onClick={action.onClick}
          />
        ) : (
          <CustomStyledButton
            key={index}
            name={action.name}
            label={action.label}
            onClick={action.onClick}
          />
        )
      )}
    >
      {/* Image */}
      {imageUrl && (
        <div
          className="modal-image-wrapper"
          style={{ textAlign: "center", marginBottom: 16 }}
        >
          <img
            src={imageUrl}
            alt={String(title) || "Modal Visual"}
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </div>
      )}

      {/* Title */}
      {title && <h3 className="modal-utiliy-title">{title}</h3>}

      {/* Description */}
      {description && <div>{description}</div>}
    </Modal>
  );
};

export default ModalContent;
