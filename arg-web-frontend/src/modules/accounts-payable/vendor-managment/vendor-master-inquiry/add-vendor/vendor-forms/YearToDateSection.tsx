import React, { useState } from "react";
import { Divider } from "antd";
import type { YearToDateSectionProps } from "@/types/accounts-payable.types";
import { formatCurrency } from "@/utils/formatters";
import { CustomPrefixInput } from "@/widget-library/Input";

const YearToDateSection: React.FC<YearToDateSectionProps> = ({
  title = "Year - To - Date Values",
  values,
  onChange,
  editableFields = [],
  context = "vendor-management",
}) => {
  const isFieldEditable = (field: keyof typeof values) => editableFields.includes(field);

  // Local input state to allow typing decimals (e.g., "12." or "0.5") before commit
  const [thisYearPaymentsInput, setThisYearPaymentsInput] = useState<string | null>(null);
  const [paymentsError, setPaymentsError] = useState<string>("");

  const handlePaymentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    // Allow up to 9 digits before decimal and up to 2 digits after decimal
    const validPattern = /^\d{0,9}(\.\d{0,2})?$/;
    if (validPattern.test(input)) {
      setThisYearPaymentsInput(input);
      setPaymentsError("");
    } else {
      // Hard stop: do not update input value, show specific validation error
      const parts = input.split(".");
      const before = (parts[0] || "").replace(/\D/g, "");
      const after = (parts[1] || "").replace(/\D/g, "");

      if (before.length > 9) {
        setPaymentsError("Maximum 9 digits allowed before decimal");
      } else if (parts.length > 2 || after.length > 2) {
        setPaymentsError("Maximum 2 digits allowed after decimal");
      } else {
        // Fallback for other invalid characters
        setPaymentsError("Maximum 9 digits allowed before decimal");
      }
    }
  };

  const handlePaymentsBlur = () => {
    const raw = thisYearPaymentsInput ?? values.thisYearPayments?.toString() ?? "0";
    // Convert blank or just "." to 0
    const normalized = raw === "" || raw === "." ? "0" : raw;
    const num = parseFloat(normalized);
    const rounded = isNaN(num) ? 0 : Number(num.toFixed(2));
    setThisYearPaymentsInput(null);
    setPaymentsError("");
    onChange?.("thisYearPayments", rounded);
  };

  // For AP Period End context, show the original layout with editable This Year Payments
  if (context === "ap-period-end") {
    return (
      <div className="add-vendor-section year-to-date-section">
        <h4 className="section-title">{title}</h4>
        <Divider />
        
        <div className="cne-modal">
          <div className="value-label">This Year Payments</div>
          {isFieldEditable('thisYearPayments') ? (
            <>
              <CustomPrefixInput
                name="thisYearPayments"
                value={(thisYearPaymentsInput ?? values.thisYearPayments?.toString()) || ""}
                onChange={handlePaymentsChange}
                onBlur={handlePaymentsBlur}
                status={paymentsError ? "error" : ""}
                className="custom-input"
              />
              {paymentsError && <p className="error-message">{paymentsError}</p>}
            </>
          ) : (
            <div className="value-num">
              {formatCurrency(values.thisYearPayments)}
            </div>
          )}
        </div>

        <Divider />

        <div className="month-year-values-row">
          <div className="value-col">
            <div className="value-label">This Year Purchases</div>
            <div className="value-num">
              {formatCurrency(values.thisYearPurchases)}
            </div>
          </div>
          <div className="value-col">
            <div className="value-label">This Year Discounts</div>
            <div className="value-num">
              {formatCurrency(values.thisYearDiscounts)}
            </div>
          </div>
          <div className="value-col">
            <div className="value-label">Last Payment Date</div>
            <div className="value-num">{values.lastPaymentDate}</div>
          </div>
          <div className="value-col">
            <div className="value-label">Last Year Purchases</div>
            <div className="value-num">
              {formatCurrency(values.lastYearPurchases)}
            </div>
          </div>
          <div className="value-col">
            <div className="value-label">Last Year Payments</div>
            <div className="value-num">
              {formatCurrency(values.lastYearPayments)}
            </div>
          </div>
          <div className="value-col">
            <div className="value-label">Last Payment Amount</div>
            <div className="value-num">
              {formatCurrency(values.lastPaymentAmount)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // For vendor management context, show all fields in one row (old layout)
  return (
    <div className="add-vendor-section year-to-date-section">
      <h4 className="section-title">{title}</h4>
      <Divider />
      
      <div className="month-year-values-row">
        <div className="value-col">
          <div className="value-label">This Year Payments</div>
          <div className="value-num">
            {formatCurrency(values.thisYearPayments)}
          </div>
        </div>
        <div className="value-col">
          <div className="value-label">This Year Purchases</div>
          <div className="value-num">
            {formatCurrency(values.thisYearPurchases)}
          </div>
        </div>
        <div className="value-col">
          <div className="value-label">This Year Discounts</div>
          <div className="value-num">
            {formatCurrency(values.thisYearDiscounts)}
          </div>
        </div>
        <div className="value-col">
          <div className="value-label">Last Payment Date</div>
          <div className="value-num">{values.lastPaymentDate}</div>
        </div>
        <div className="value-col">
          <div className="value-label">Last Year Purchases</div>
          <div className="value-num">
            {formatCurrency(values.lastYearPurchases)}
          </div>
        </div>
        <div className="value-col">
          <div className="value-label">Last Year Payments</div>
          <div className="value-num">
            {formatCurrency(values.lastYearPayments)}
          </div>
        </div>
        <div className="value-col">
          <div className="value-label">Last Payment Amount</div>
          <div className="value-num">
            {formatCurrency(values.lastPaymentAmount)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default YearToDateSection;
