import React from "react";
import { CustomPrefixInput } from "@/widget-library/Input";
import { CustomSelectDropdown } from "@/widget-library/Dropdown";
import { useDropdownData } from "@/hooks/useDropdownData";
import { Divider } from "antd";
import type { Section1099Props } from "@/types/accounts-payable.types";

interface Section1099FormProps extends Section1099Props {
  errors?: Record<string, string>; // Add errors prop for parent validation errors
}
import { validateNumericInput } from "@/utils/validation";

const Section1099Form: React.FC<Section1099FormProps> = ({ values, onChange, errors }) => {
  const [validationErrors, setValidationErrors] = React.useState<
    Record<string, string>
  >({});

  // Dropdown data hook following the country pattern
  const { data: ap1099Options, isLoading: isLoadingAp1099 } =
    useDropdownData("AP_1099" as any);

 
  const computed1099Description = React.useMemo(() => {
    if (
      values["code1099"] &&
      ap1099Options &&
      ap1099Options.length > 0 &&
      !isLoadingAp1099
    ) {
      // Trim the value to match dropdown options
      const trimmedValue = values["code1099"].trim();
      
      const selectedOption = ap1099Options.find(
        (option) => option.value === trimmedValue
      );
      return selectedOption?.label || "";
    }
    return "";
  }, [values["code1099"], ap1099Options, isLoadingAp1099]);

  React.useEffect(() => {
    if (computed1099Description && !values["desc1099"]) {
      onChange("desc1099", computed1099Description);
    }
  }, [computed1099Description, values, onChange]);

  // Handle 1099 Code selection and auto-populate description
  const handle1099CodeChange = (selectedValue: string) => {
    const selectedOption = ap1099Options?.find(
      (option) => option.value === selectedValue
    );

    onChange("code1099", selectedValue);

    if (selectedOption && selectedOption.label) {
      onChange("desc1099", selectedOption.label);
    } else {
      onChange("desc1099", "");
    }
  };
const handleBlur = (field: string) => () => {
  // For amount field, coerce to numeric on blur so payload is numeric
  if (field === "boxAmt2_1099") {
    const rawValue = String(values["boxAmt2_1099"] ?? "");
    // Normalize to a parseable numeric string
    let normalized = rawValue.replace(/[^0-9.]/g, "");
    const parts = normalized.split(".");
    if (parts.length > 2) {
      normalized = parts[0] + "." + parts.slice(1).join("");
    }
    if (normalized === "" || normalized === ".") {
      onChange(field, 0);
    } else {
      const asNumber = parseFloat(normalized);
      onChange(field, isNaN(asNumber) ? 0 : asNumber);
    }
  }
  setValidationErrors((prev) => {
    const { [field]: _, ...rest } = prev;
    return rest;
  });
};

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const numericFields = ["box1_1099", "box2_1099", "boxAmt2_1099"];
      let value = e.target.value;
      
      // Define max lengths for each field
      const maxLengths: Record<string, number> = {
        firstName: 20,
        middleName: 20,
        lastName: 30,
        suffix: 4,
        id1099: 11,
        irsNameControl: 4,
        payee1: 40,
        payee2: 40,
        box1_1099: 2, 
        box2_1099: 2,
        boxAmt2_1099: 11, // programmatic validation below enforces 9 digits + optional '.' + 2 decimals
      };

      if (numericFields.includes(field)) {
        // Special handling for boxAmt2_1099 field
        if (field === "boxAmt2_1099") {
          // Check if input contains any non-numeric characters except decimal point
          const hasInvalidChars = /[^0-9.]/.test(value);
          
          // Remove any non-numeric characters except decimal point
          let cleanedValue = value.replace(/[^0-9.]/g, '');
          
          // Ensure only one decimal point
          const parts = cleanedValue.split('.');
          if (parts.length > 2) {
            cleanedValue = parts[0] + '.' + parts.slice(1).join('');
          }
          // Enforce 9 digits before decimal and up to 2 after
          const [intPartRaw, decPartRaw] = cleanedValue.split('.');
          const intPart = intPartRaw || '';
          let decPart = decPartRaw || '';

          if (intPart.length > 9) {
            setValidationErrors((prev) => ({
              ...prev,
              [field]: `Maximum 9 digits allowed before decimal`,
            }));
            return;
          }

          if (decPart.length > 2) {
            decPart = decPart.substring(0, 2);
            setValidationErrors((prev) => ({
              ...prev,
              [field]: `Maximum 2 decimal places allowed`,
            }));
            cleanedValue = `${intPart}${decPart ? '.' + decPart : ''}`;
          }
          
          // Handle validation errors for invalid characters
          if (hasInvalidChars) {
            setValidationErrors((prev) => ({
              ...prev,
              [field]: 'Please enter numbers only',
            }));
          } else if (!validationErrors[field] || validationErrors[field] === 'Please enter numbers only') {
            // Clear validation error if no issues
            setValidationErrors((prev) => {
              const { [field]: _, ...rest } = prev;
              return rest;
            });
          }
          // Keep as string to preserve trailing decimal during typing; convert later if needed
          onChange(field, cleanedValue);
          
        
        } else {
          // Handle other numeric fields
          const maxLength = maxLengths[field];
          if (maxLength && value.length > maxLength) {
            setValidationErrors((prev) => ({
              ...prev,
              [field]: `Cannot exceed ${maxLength} characters`,
            }));
            return; 
          }
          
          const validation = validateNumericInput(e);
          value = validation.value;
          // Convert to number if it's a valid numeric value
          const numValue = parseFloat(value);
          const numericValue = !isNaN(numValue) ? numValue : 0;

          if (validation.hasError) {
            setValidationErrors((prev) => ({
              ...prev,
              [field]: validation.errorMessage!,
            }));
          } else {
            setValidationErrors((prev) => {
              const { [field]: _, ...rest } = prev;
              return rest;
            });
          }
          onChange(field, numericValue);
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
    <div className="add-vendor-section section-1099">
      <h4>1099 Section both IRS & PA</h4>
      <Divider />
      <div className="add-vendor-grid grid-1099">
        {[
          {
            label: "First Name",
            name: "firstName",
            placeholder: "Enter First Name",
            type: "input",
            maxLength: 20,
          },
          {
            label: "Middle Name",
            name: "middleName",
            placeholder: "Enter Middle Name",
            type: "input",
            maxLength: 20,
          },
          {
            label: "Last Name",
            name: "lastName",
            placeholder: "Enter Last Name",
            type: "input",
            maxLength: 30,
          },
          {
            label: "Suffix",
            name: "suffix",
            placeholder: "Enter Suffix",
            type: "input",
            maxLength: 4,
          },
          {
            label: "1099 Code",
            name: "code1099",
            placeholder: "Select 1099 Code",
            type: "dropdown",
          },
          {
            label: "1099 Description",
            name: "desc1099",
            placeholder: "Enter Description",
            type: "input",
          },
          {
            label: "1099 ID (TIN)",
            name: "id1099",
            placeholder: "Enter Tax ID",
            type: "input",
            maxLength: 11,
          },
          {
            label: "1st 1099 Box #",
            name: "box1_1099",
            placeholder: "Enter Box Number",
            type: "input",
            maxLength: 2,
          },
          {
            label: "2nd Box #",
            name: "box2_1099",
            placeholder: "Enter Box Number",
            type: "input",
            maxLength: 2,
          },
          {
            label: "2nd Box Amt",
            name: "boxAmt2_1099",
            placeholder: "Enter Amount",
            type: "input",
            maxLength: 13,
          },
          {
            label: "Payee #1",
            name: "payee1",
            placeholder: "Enter Payee Number",
            type: "input",
            maxLength: 40,
          },
          {
            label: "Payee #2",
            name: "payee2",
            placeholder: "Enter Payee Number",
            type: "input",
            maxLength: 40,
          },
        ].map(({ label, name, placeholder, type, maxLength }) => {
          // Map form field names to API field names for error display
          const apiFieldMap: Record<string, string> = {
            firstName: "vendorFirstName",
            middleName: "vendorMiddleName", 
            lastName: "vendorBusinessLastName",
            suffix: "vendorNameSuffix",
            code1099: "vendorAp1099Code",
            desc1099: "vendorAp1099CodeDescription",
            id1099: "vendorIdNumber",
            box1_1099: "vendorFirst1099BoxNumber",
            box2_1099: "vendorSecond1099BoxNumber",
            boxAmt2_1099: "vendorSecond1099BoxAmount",
            payee1: "vendorPayeeName1",
            payee2: "vendorPayeeName2",
          };
          const apiFieldName = apiFieldMap[name];
          const hasParentError = apiFieldName && errors?.[apiFieldName];
          const hasLocalError = validationErrors[name];

          return (
            <div key={name} className="form-field">
              <label className="sub-title">{label}</label>
              <div>
                {type === "dropdown" && name === "code1099" ? (
                  <CustomSelectDropdown
                    name={name}
                    placeholder={placeholder}
                    options={
                      ap1099Options?.map((option) => ({
                        label: option.id || "",
                        value: option.value || "",
                      })) || []
                    }
                    value={values["code1099"]?.trim() || ""}
                    onChange={handle1099CodeChange}
                    loading={isLoadingAp1099}
                  />
                ) : (
                  <CustomPrefixInput
                    name={name}
                    placeholder={name === "desc1099" ? "" : placeholder}
                    value={
                      name === "desc1099" 
                        ? (values["desc1099"] || computed1099Description || "")
                        : (values[name as keyof typeof values] || "")
                    }
                    onChange={handleChange(name)}
                     onBlur={handleBlur(name)} 
                    status={(hasLocalError || hasParentError) ? "error" : ""}
                    disabled={name === "desc1099"}
                    maxLength={maxLength ? maxLength + 1 : undefined}
                  />
                )}
                {(hasParentError || hasLocalError) && (
                  <div className="error-message">
                    {hasLocalError ? validationErrors[name] : (hasParentError ? errors?.[apiFieldName!] : "")}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        <div className="form-field">
          <label className="sub-title">IRS Name Control</label>
          <div>
            <CustomPrefixInput
              name="irsNameControl"
              placeholder="Enter IRS Name Control"
              value={values["irsNameControl"] || ""}
              onChange={handleChange("irsNameControl")}
               onBlur={handleBlur("irsNameControl")}
              maxLength={5}
              status={(validationErrors.irsNameControl || errors?.vendorIrsNameControl) ? "error" : ""}
            />
            {(errors?.vendorIrsNameControl || validationErrors.irsNameControl) && (
              <div className="error-message">
                {validationErrors.irsNameControl || errors?.vendorIrsNameControl}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Section1099Form;
