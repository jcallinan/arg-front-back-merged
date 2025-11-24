import React from "react";
import ModalContent from "@widget-library/Modal";
import { CustomPrefixInput } from "@widget-library/Input";
import CustomDatePicker from "@widget-library/DatePicker";
import {
  DefaultButton,
  CustomStyledButton,
} from "@widget-library/Buttons";
import { Divider } from "antd";

interface EditCheckModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: () => void;
  formData: {
    checkNumber: string;
    clearDate: string;
    clearAmount: string;
  };
  onInputChange: (name: string, value: string) => void;
  errors: {
    checkNumber?: string;
    clearDate?: string;
    clearAmount?: string;
  };
}

const EditCheckModal: React.FC<EditCheckModalProps> = ({
  visible,
  onCancel,
  onSave,
  formData,
  onInputChange,
  errors,
}) => {
  return (
    <ModalContent
      visible={visible}
      onCancel={onCancel}
      title="Edit Check"
      className="add-check-modal"
      showCloseIcon={false}
      description={
        <div>
          <hr />

          <div className="field-container">
            <label className="sub-title">Check Number</label>
            <CustomPrefixInput
              name="checkNumber"
              value={formData.checkNumber}
              onChange={(e) => onInputChange("checkNumber", e.target.value)}
              placeholder="209967"
              status={errors.checkNumber ? "error" : undefined}
            />
            {errors.checkNumber && (
              <div className="field-error">{errors.checkNumber}</div>
            )}
          </div>

          <div className="field-container">
            <label className="sub-title">Clear Date</label>
            <CustomDatePicker
              name="clearDate"
              value={formData.clearDate}
              onChange={onInputChange}
              status={errors.clearDate ? "error" : undefined}
            />
            {errors.clearDate && (
              <div className="field-error">{errors.clearDate}</div>
            )}
          </div>

          <div className="field-container">
            <label className="sub-title">Clear Amount</label>
            <CustomPrefixInput
              name="clearAmount"
              value={formData.clearAmount}
              onChange={(e) => onInputChange("clearAmount", e.target.value)}
              placeholder="27223.00"
              status={errors.clearAmount ? "error" : undefined}
            />
            {errors.clearAmount && (
              <div className="field-error">{errors.clearAmount}</div>
            )}
          </div>
          <Divider />

          <div className="flex-justify-end gap-16">
            <DefaultButton name="cancel" label="Cancel" onClick={onCancel} />
            <CustomStyledButton name="save" label="Save" onClick={onSave} />
          </div>
        </div>
      }
      actions={[]}
    />
  );
};

export default EditCheckModal;
