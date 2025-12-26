import type { BankDetailsSectionProps } from "@/types/accounts-payable.types";

interface BankDetailsSectionPropsWithErrors extends BankDetailsSectionProps {
  errors?: Record<string, string>; // Add errors prop for API validation errors
}
import { CustomPrefixInput } from "@/widget-library/Input";
import { Divider } from "antd";
import React from "react";
import { validateIntegerInput } from "@/utils/validation";

const BankDetailsSection: React.FC<BankDetailsSectionPropsWithErrors> = ({
  values,
  onChange,
  errors,
}) => {
  const [validationErrors, setValidationErrors] = React.useState<Record<string, string>>({});

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericFields = ["achBankAccount", "achBankRouting"];
    const value = e.target.value;
    
    // Define max lengths for each field
    const maxLengths: Record<string, number> = {
      achBankAccount: 17,
      achBankRouting: 9, 
      achCheckingOrSavings: 1,
      bankClass: 3,
    };

    // Special handling for single character fields with hard stop (exactly like zip code)
    if (field === "achCheckingOrSavings") {
      const maxLength = maxLengths[field];
      
      // Hard stop: if length exceeds max characters, show error and don't update field
      if (value.length > maxLength) {
        console.log(`${field} exceeded max length ${maxLength}, showing error`);
        setValidationErrors((prev) => {
          const newErrors = {
            ...prev,
            [field]: `Cannot exceed ${maxLength} character${maxLength > 1 ? 's' : ''}`,
          };
        
          return newErrors;
        });
        return; // Hard stop - don't update the field value
      }
      
      
      setValidationErrors((prev) => {
        const { [field]: _, ...rest } = prev;
        return rest;
      });
      onChange(field, value); // Update field value
    } else if (field === "bankClass") {
      const maxLength = maxLengths[field];
      
      // Hard stop: if length exceeds max characters, show error and don't update field
      if (value.length > maxLength) {
        console.log(`${field} exceeded max length ${maxLength}, showing error`);
        setValidationErrors((prev) => {
          const newErrors = {
            ...prev,
            [field]: `Cannot exceed ${maxLength} characters`,
          };
        
          return newErrors;
        });
        return; // Hard stop - don't update the field value
      }
      
      
      setValidationErrors((prev) => {
        const { [field]: _, ...rest } = prev;
        return rest;
      });
      onChange(field, value); // Update field value
    } else if (numericFields.includes(field)) {
      const validation = validateIntegerInput(e);
      
      // Check maxLength for numeric fields
      const maxLength = maxLengths[field];
      if (maxLength && validation.value.length > maxLength) {
        setValidationErrors((prev) => ({
          ...prev,
          [field]: `Cannot exceed ${maxLength} characters`,
        }));
        return; 
      }
      
      if (validation.hasError) {
        setValidationErrors((prev) => ({ ...prev, [field]: validation.errorMessage! }));
      } else {
        setValidationErrors((prev) => {
          const { [field]: _, ...rest } = prev;
          return rest;
        });
      }
      onChange(field, validation.value);
    } else {
      const maxLength = maxLengths[field];
      if (maxLength && value.length > maxLength) {
        setValidationErrors((prev) => ({
          ...prev,
          [field]: `Cannot exceed ${maxLength} characters`,
        }));
        return; 
      }
      
      setValidationErrors((prev) => {
        const { [field]: _, ...rest } = prev;
        return rest;
      });
      onChange(field, value);
    }
  };
const handleBlur = (field: string) => () => {
  setValidationErrors((prev) => {
    const { [field]: _, ...rest } = prev;
    return rest;
  });
};


  return (
    <div className="add-vendor-section bank-details-section">
      <h4>Bank Details</h4>
      <Divider />
      <div className="add-vendor-grid">
        {[
          {
            field: "achBankAccount",
            apiField: "vendorAchBankAccountNumber",
            label: "ACH Bank Account",
            placeholder: "Enter Bank Account",
            maxLength: 17,
          },
          {
            field: "achBankRouting", 
            apiField: "vendorAchBankRoutingCode",
            label: "ACH Bank Routing Code",
            placeholder: "Enter Routing Code",
            maxLength: 9,
          },
          {
            field: "achCheckingOrSavings",
            apiField: "vendorAchCheckingOrSavings", 
            label: "ACH Checking or Savings",
            placeholder: "Enter C for Checking or S for Savings",
            maxLength: 1,
          },
          {
            field: "bankClass",
            apiField: "vendorAchClass",
            label: "Class",
            placeholder: "Enter Bank Class", 
            maxLength: 3,
          },
        ].map(({ field, apiField, label, placeholder, maxLength }) => {
          const hasLocalError = validationErrors[field];
          const hasParentError = errors?.[apiField];
          const hasError = hasLocalError || hasParentError;

          return (
            <div key={field} className="form-field">
              <label className="sub-title">{label}</label>
              <div>
                <CustomPrefixInput
                  name={field}
                  placeholder={placeholder}
                  value={values[field as keyof typeof values] || ""}
                  onChange={handleInputChange(field)}
                onBlur={handleBlur(field)}
                  status={hasError ? "error" : ""}
                  maxLength={maxLength ? maxLength + 1 : undefined}
                />
                {hasError && (
                  <div className="error-message">
                    {hasLocalError ? validationErrors[field] : errors?.[apiField]}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BankDetailsSection;
