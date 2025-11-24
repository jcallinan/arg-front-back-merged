import React from "react";
import { Divider, Switch } from "antd";
import { CustomSelectDropdown } from "@/widget-library/Dropdown";
import { CustomPrefixInput } from "@/widget-library/Input";
import { validateIntegerInput } from "@/utils/validation";
import { formatPhoneNumberInput } from "@utils/MobilenumberFormat";
import { useDropdownData } from "@/hooks/useDropdownData";
import "./vendor-forms.scss";

interface VendorDetailsFormProps {
  formData: {
    vendorNo?: number;
    vendorName?: string;
    vendorAdd1?: string;
    vendorAdd2?: string;
    vendorAdd3?: string;
    vendorAdd4?: string;
    vendorCountryCode?: string;
    vendorZipCode?: number;
    vendorAreaCode?: number;
    vendorTelephoneNo?: number;
    vendorNameOverflow?: boolean;
  };
  onChange: (field: string, value: string | number | boolean) => void;
  onRefreshVendorNo?: () => void;
  vendorNoLoading?: boolean;
  isAddMode?: boolean;
  errors?: Record<string, string>;
}

const VendorDetailsForm: React.FC<VendorDetailsFormProps> = ({
  formData,
  onChange,
  isAddMode = false,
  errors,
}) => {
  const [validationErrors, setValidationErrors] = React.useState<
    Record<string, string>
  >({});
  const { data: countries } = useDropdownData("COUNTRIES_ISO");

const handleBlur = (field: string) => () => {
  // Special validation for telephone field on blur
  if (field === "vendorTelephoneNo") {
    const phoneValue = formData.vendorTelephoneNo;
    const phoneDigits = (phoneValue?.toString() || "").replace(/\D/g, "");
    
    // If field is empty or 0, clear any validation errors
    if (!phoneValue || phoneValue === 0 || phoneDigits.length === 0 || phoneDigits === "0") {
      setValidationErrors((prev) => {
        const { [field]: _, ...rest } = prev;
        return rest;
      });
      return;
    }
    
    // If user has entered something, validate it must be exactly 10 digits
    if (phoneDigits.length !== 10) {
      setValidationErrors((prev) => ({
        ...prev,
        [field]: "Phone number must be exactly 10 digits"
      }));
      return;
    }
  }
  
  // Clear validation errors for valid input
  setValidationErrors((prev) => {
    const { [field]: _, ...rest } = prev;
    return rest;
  });
};


  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const numericFields = ["vendorNo", "vendorZipCode", "vendorTelephoneNo"];
      const value = e.target.value;
      
      // Special handling for telephone number formatting
      if (field === "vendorTelephoneNo") {
        const formattedValue = formatPhoneNumberInput(value);
        const cleanedValue = value.replace(/\D/g, ''); // Remove non-numeric for storage
        
        // If field is cleared, clear validation errors and set to 0
        if (cleanedValue.length === 0) {
          setValidationErrors((prev) => {
            const { [field]: _, ...rest } = prev;
            return rest;
          });
          onChange(field, 0);
          e.target.value = '';
          return;
        }
        
        // Limit to 10 digits with validation message
        if (cleanedValue.length > 10) {
          setValidationErrors((prev) => ({
            ...prev,
            [field]: 'Phone number cannot exceed 10 digits',
          }));
          return;
        }
        
        // Clear validation errors
        setValidationErrors((prev) => {
          const { [field]: _, ...rest } = prev;
          return rest;
        });
        
        // Store the full 10-digit number (including area code)
        onChange(field, parseInt(cleanedValue) || 0);
        
        // Update the input display value
        e.target.value = formattedValue;
        return;
      }
      
      // Define max lengths for each field
      const maxLengths: Record<string, number> = {
        vendorName: 30,
        vendorAdd1: 30,
        vendorAdd2: 30,
        vendorAdd3: 30,
        vendorAdd4: 30,
      };
    // Special handling for zip code with 5 character limit
    if (field === "vendorZipCode" || field === "vendorTelephoneNo") {
  const maxLengths: Record<string, number> = {
    vendorZipCode: 5,
    vendorTelephoneNo: 10,
  };
  const maxLength = maxLengths[field];

  if (value.length > maxLength) {
    setValidationErrors((prev) => ({
      ...prev,
      [field]: `${field === "vendorZipCode" ? "Zip code" : "Phone number"} CANNOT EXCEED ${maxLength} CHARACTERS`,
    }));
    return; // Hard stop - don't update the field value
  }

  // Validate that it's numeric
  const validation = validateIntegerInput(e);

  if (validation.hasError && value.length > 0) {
    // Show numeric validation error if input is not numeric
    setValidationErrors((prev) => ({
      ...prev,
      [field]: validation.errorMessage!,
    }));
    onChange(field, validation.value); // Update with valid numeric portion
  } else {
    // Clear validation error if input is valid and within length limit
    setValidationErrors((prev) => {
      const { [field]: _, ...rest } = prev;
      return rest;
    });
    onChange(field, validation.value); // Update field value
  }
}
 else if (numericFields.includes(field)) {
        const validation = validateIntegerInput(e);
        onChange(field, validation.value);
        if (validation.hasError) {
          setValidationErrors((prev) => ({
            ...prev,
            [field]: validation.errorMessage!,
          }));
        } else {
          setValidationErrors((prev) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [field]: _, ...rest } = prev;
            return rest;
          });
        }
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

  return (
    <div className="add-vendor-section">
      <h4>Vendor Details</h4>
      <Divider />
      <div className="vendor-details-form">
        <div className="row first-row">
          <div className="form-field vendor-no required">
            <label className="sub-title">Vendor No</label>
            <CustomPrefixInput
              name="vendorNo"
              placeholder={isAddMode ? "" : "Enter Vendor No"}
              value={formData.vendorNo?.toString() || ""}
              onChange={handleChange("vendorNo")}
              disabled={true}
              status={validationErrors.vendorNo ? "error" : ""}
            />
            {(errors?.vendorNo || validationErrors.vendorNo) && (
              <p className="error-message">
                {validationErrors.vendorNo || errors?.vendorNo}
              </p>
            )}
          </div>
          <div className="form-field vendor-name required">
            <label className="sub-title">Vendor Name</label>
            <CustomPrefixInput
              name="vendorName"
              placeholder="Enter Vendor Name"
              value={formData.vendorName || ""}
              onChange={handleChange("vendorName")}
              onBlur={handleBlur("vendorName")}
              maxLength={31}
              status={validationErrors.vendorName ? "error" : ""}
            />
            {(errors?.vendorName || validationErrors.vendorName) && (
              <p className="error-message">
                {validationErrors.vendorName || errors?.vendorName}
              </p>
            )}
          </div>
          <div className="form-field vendor-name-overflow">
            <label className="sub-title">Vendor Name Overflow</label>
            <Switch
              checked={formData.vendorNameOverflow}
              onChange={(checked) => onChange("vendorNameOverflow", checked)}
            />
          </div>
        </div>

        <div className="row second-row">
          <div className="form-field">
            <label className="sub-title">Address 1</label>
            <CustomPrefixInput
              name="vendorAdd1"
              placeholder="Enter Address 1"
              value={formData.vendorAdd1 || ""}
              onChange={handleChange("vendorAdd1")}
              onBlur={handleBlur("vendorAdd1")}
              maxLength={31}
              status={validationErrors.vendorAdd1 ? "error" : ""}
            />
            {validationErrors.vendorAdd1 && (
              <p className="error-message">{validationErrors.vendorAdd1}</p>
            )}
          </div>
          <div className="form-field">
            <label className="sub-title">Address 2</label>
            <CustomPrefixInput
              name="vendorAdd2"
              placeholder="Enter Address 2"
              value={formData.vendorAdd2 || ""}
              onChange={handleChange("vendorAdd2")}
              onBlur={handleBlur("vendorAdd2")}
              maxLength={31}
              status={validationErrors.vendorAdd2 ? "error" : ""}
            />
            {validationErrors.vendorAdd2 && (
              <p className="error-message">{validationErrors.vendorAdd2}</p>
            )}
          </div>
          <div className="form-field">
            <label className="sub-title">Address 3</label>
            <CustomPrefixInput
              name="vendorAdd3"
              placeholder="Enter Address 3"
              value={formData.vendorAdd3 || ""}
              onChange={handleChange("vendorAdd3")}
              onBlur={handleBlur("vendorAdd3")}
              maxLength={31}
              status={validationErrors.vendorAdd3 ? "error" : ""}
            />
            {validationErrors.vendorAdd3 && (
              <p className="error-message">{validationErrors.vendorAdd3}</p>
            )}
          </div>
          <div className="form-field">
            <label className="sub-title">Address 4</label>
            <CustomPrefixInput
              name="vendorAdd4"
              placeholder="Enter Address 4"
              value={formData.vendorAdd4 || ""}
              onChange={handleChange("vendorAdd4")}
              onBlur={handleBlur("vendorAdd4")}
              maxLength={31}
              status={validationErrors.vendorAdd4 ? "error" : ""}
            />
            {validationErrors.vendorAdd4 && (
              <p className="error-message">{validationErrors.vendorAdd4}</p>
            )}
          </div>
        </div>

        <div className="row third-row">
          <div className="form-field required">
            <label className="sub-title">Country</label>
            <CustomSelectDropdown
              name="vendorCountryCode"
              placeholder="Select Country"
              options={
                countries?.map((country) => ({
                  label: country.label || "",
                  value: country.value || "",
                })) || []
              }
              value={formData.vendorCountryCode || ""}
              onChange={(value) => onChange("vendorCountryCode", value)}
            />
            {errors?.vendorCountryCode && (
              <p className="error-message">{errors.vendorCountryCode}</p>
            )}
          </div>
          <div className="form-field required">
            <label className="sub-title">Zipcode</label>
            <CustomPrefixInput
              name="vendorZipCode"
              placeholder="Enter Zipcode"
              value={formData.vendorZipCode?.toString() || ""}
              onChange={handleChange("vendorZipCode")}
              onBlur={handleBlur("vendorZipCode")}
              status={validationErrors.vendorZipCode ? "error" : ""}
            />
            {(errors?.vendorZipCode || validationErrors.vendorZipCode) && (
              <p className="error-message">
                {validationErrors.vendorZipCode || errors?.vendorZipCode}
              </p>
            )}
          </div>
          <div className="form-field">
            <label className="sub-title">Phone</label>
            <CustomPrefixInput
              name="vendorTelephoneNo"
              placeholder="Enter Phone Number"
              value={formData.vendorTelephoneNo && formData.vendorTelephoneNo !== 0 ? formatPhoneNumberInput(formData.vendorTelephoneNo.toString()) : ""}
              onChange={handleChange("vendorTelephoneNo")}
              onBlur={handleBlur("vendorTelephoneNo")}
              status={validationErrors.vendorTelephoneNo || errors?.vendorTelephoneNo ? "error" : ""}
            />
            {(errors?.vendorTelephoneNo || validationErrors.vendorTelephoneNo) && (
              <p className="error-message">
                {validationErrors.vendorTelephoneNo || errors?.vendorTelephoneNo}
              </p>
            )}
          </div>
          <div className="form-field empty-placeholder"></div>{" "}
          {/* this creates the blank 25% */}
        </div>
      </div>
    </div>
  );
};

export default VendorDetailsForm;
