import React, { useState, useCallback } from "react";
import { Switch, Divider } from "antd";
import CompanyNo from "@/shared-components/company-number/CompanyNo";
import { CustomStyledButton } from "@/widget-library/Buttons";
import { CustomSelectDropdown } from "@/widget-library/Dropdown";
import ModalContent from "@/widget-library/Modal";
import Toaster from "@/widget-library/Toaster";
import popupOk from "@/assets/icons/popup-ok.svg";
import { useVendorYearEnd } from "@/hooks/useVendorYearEnd";
import type { ValidationErrors } from "@/types/accounts-payable.types";

const VendorMonthYearEnd: React.FC = () => {
  const [selectedCompany, setSelectedCompany] = useState<string>("10");
  const [selectedYear, setSelectedYear] = useState<string>("2024");
  const [clearYearToDate, setClearYearToDate] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showToaster, setShowToaster] = useState<boolean>(false);
  const [toasterType, setToasterType] = useState<"error" | "success" | "warning">("error");
  const [toasterMessage, setToasterMessage] = useState<string>("");
  const [toasterDescription, setToasterDescription] = useState<string>("");

  const { mutate, isPending, data } = useVendorYearEnd();
  
  // Toaster helper functions (Employee Expense pattern)
  const closeToaster = useCallback(() => {
    setShowToaster(false);
  }, []);

  const showToasterMessage = useCallback(
    (
      type: "error" | "success" | "warning",
      title: string,
      description: string
    ) => {
      setToasterType(type);
      setToasterMessage(title);
      setToasterDescription(description);
      setShowToaster(true);
    },
    []
  );

  // Generate year options (current year and previous years)
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let i = currentYear; i >= currentYear - 10; i--) {
    yearOptions.push({ label: i.toString(), value: i.toString() });
  }

  const handleSubmit = () => {
    // Clear previous errors (Employee Expense pattern)
    setErrors({});

    mutate(
      {
        companyNo: parseInt(selectedCompany, 10),
        year: selectedYear,
        clearYTD: clearYearToDate,
      },
      {
        onSuccess: () => {
          setIsModalVisible(true);
        },
        onError: (error: any) => {
          console.error("VendorMonthYearEnd process failed:", error);
          let apiError = error?.error?.error || error?.error || error?.response?.data?.error || error?.data?.error || error;
          // Handle field-specific errors from details array (Employee Expense pattern)
          const details: Array<{ field?: string; message?: string }> | undefined =
             apiError?.details || [];
          const fieldSpecificErrors: ValidationErrors = {};
          let hasFieldSpecificErrors = false;
          let toasterErrorMessage = "";
          
          if (Array.isArray(details)) {
             for (const d of details) {
                if (d?.field && d?.field.trim() !== "") {
                  // Field-specific error - highlight field and prepare for toaster
                
                  
                  // Map common field variations
                  if (d.field === "companyNo" || d.field === "company") {
                    fieldSpecificErrors.companyNo = d?.message || "Invalid value";
                    hasFieldSpecificErrors = true;
                    toasterErrorMessage = d?.message || "Invalid company number";
                  } else if (d.field === "year") {
                    fieldSpecificErrors.year = d?.message || "Invalid value";
                    hasFieldSpecificErrors = true;
                    toasterErrorMessage = d?.message || "Invalid year";
                  } else {
                    // Handle any other field-specific errors generically
                 
                    toasterErrorMessage = d?.message || "Field validation error";
                  }
                } else if (d?.message) {
                  // General error without specific field
                  toasterErrorMessage = d.message;
                }
             }
             
             // Set field errors for highlighting
             if (hasFieldSpecificErrors) {
               setErrors(fieldSpecificErrors);
              
             }
          }
          
          let errorTitle = "Error";
          let finalErrorMessage = toasterErrorMessage;
          
          if (apiError && (apiError.code || apiError.message)) {
            if (apiError?.code === "SERVER_ERROR") {
              errorTitle = "Server Error";
              if (!finalErrorMessage) {
                if (apiError?.details && Array.isArray(apiError.details)) {
                  const serverError = apiError.details[0];
                  if (serverError && serverError.message) {
                    finalErrorMessage = serverError.message;
                  } else {
                    finalErrorMessage = apiError.message || "A server error occurred while processing vendor year-end.";
                  }
                } else {
                  finalErrorMessage = apiError.message || "A server error occurred while processing vendor year-end.";
                }
              }
            } else if (apiError?.code === "VALIDATION_ERROR") {
              errorTitle = "Validation Error";
              
              if (!finalErrorMessage) {
                finalErrorMessage = apiError.message || "Invalid data provided.";
              }
            } else if (apiError?.message) {
              finalErrorMessage = apiError.message;
            }
          } else {
            finalErrorMessage = finalErrorMessage || "Failed to process vendor year-end";
          }
          showToasterMessage("error", errorTitle, finalErrorMessage);
        }
      }
    );
  };

  return (
    <div>
      <h3>Vendor Month/Year End Process</h3>

      <div className="content-div-container">
        
          <div className="content-card-body flex-content">
          <CompanyNo 
            value={selectedCompany} 
            onChange={setSelectedCompany}
            status={errors.companyNo ? "error" : undefined}
          />

          <div>
            <div className="flex-align">
              <span className="astricks">*</span>&nbsp;
              <p className="sub-title">
                Save a Copy of the Vendor File For 1099 Year
              </p>
            </div>
            <CustomSelectDropdown
              name="year"
              options={yearOptions}
              value={selectedYear}
              onChange={(value) => setSelectedYear(value)}
              placeholder="Select Year"
              className="ui-dropdown-vnn"
              status={errors.year ? "error" : undefined}
            />
          </div>

          <div>
            <p className="sub-title">Clear Year to Date Fields</p>
            <Switch
              checked={clearYearToDate}
              onChange={setClearYearToDate}
              className="flex-align"
            />
          </div>
        </div>

        <Divider />

        <div className="flex-end">
          <CustomStyledButton
            name="submit"
            label={<h6>Submit</h6>}
            onClick={handleSubmit}
            className="custom-styled-button"
            disabled={isPending}
          />
        </div>
      </div>

      <ModalContent
        title="Success!"
        description={data?.message || `${selectedYear} data is ready for 1099 process`}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        showCloseIcon={false}
        imageUrl={popupOk}
        actions={[
          {
            name: "ok",
            label: "OK",
            onClick: () => setIsModalVisible(false),
          },
        ]}
        className="cne-modal descripition"
      />

      {/* Toaster for error messages (Employee Expense pattern) */}
      {showToaster && (
        <Toaster
          type={toasterType}
          title={toasterMessage}
          subtitle={toasterDescription}
          onClose={closeToaster}
        />
      )}
    </div>
  );
};

export default VendorMonthYearEnd;
