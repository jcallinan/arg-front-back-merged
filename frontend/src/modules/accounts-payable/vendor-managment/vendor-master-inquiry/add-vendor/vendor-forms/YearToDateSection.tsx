import React from "react";
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

  const handleInputChange = (field: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    onChange?.(field, value);
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
            <CustomPrefixInput
              name="thisYearPayments"
              value={values.thisYearPayments?.toString() || ""}
              onChange={handleInputChange('thisYearPayments')}
              className="custom-input"
            />
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
