import React from "react";
import ModalContent from "@widget-library/Modal";
import { CustomPrefixInput } from "@widget-library/Input";
import CustomDatePicker from "@widget-library/DatePicker";
import {
  DefaultButton,
  CustomStyledButton,
} from "@widget-library/Buttons";
import { Divider } from "antd";

interface AddCheckModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  formData: {
    checkNumber: string;
    clearDate: string;
    clearAmount: string;
  };
  onInputChange: (name: string, value: string) => void;
  errors?: {
    checkNumber?: string;
    clearDate?: string;
    clearAmount?: string;
  };
}

const AddCheckModal: React.FC<AddCheckModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  formData,
  onInputChange,
  errors = {},
}) => {
  return (
    <ModalContent
      visible={visible}
      onCancel={onCancel}
      title="Add Check"
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
              placeholder="Please Enter Check Number"
            />
            {errors.checkNumber && (
              <div className="error-message" style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.checkNumber}</div>
            )}
          </div>

          <div className="field-container">
            <label className="sub-title">Clear Date</label>
            <CustomDatePicker
              name="clearDate"
              value={formData.clearDate}
              onChange={onInputChange}
            />
            {errors.clearDate && (
              <div className="error-message" style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.clearDate}</div>
            )}
          </div>

          <div className="field-container">
            <label className="sub-title">Clear Amount</label>
            <CustomPrefixInput
              name="clearAmount"
              value={formData.clearAmount}
              onChange={(e) => onInputChange("clearAmount", e.target.value)}
              placeholder="Please Enter Clear Amount"
            />
            {errors.clearAmount && (
              <div className="error-message" style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.clearAmount}</div>
            )}
          </div>

          <Divider className="divider" />

          <div className="flex-justify-end gap-16">
            <DefaultButton name="cancel" label="Cancel" onClick={onCancel} />
            <CustomStyledButton name="add" label="Add" onClick={onSubmit} />
          </div>
        </div>
      }
      actions={[]}
    />
  );
};

export default AddCheckModal;
