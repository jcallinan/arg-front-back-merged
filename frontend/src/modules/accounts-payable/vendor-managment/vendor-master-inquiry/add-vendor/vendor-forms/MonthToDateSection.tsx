import type { MonthToDateSectionProps } from "@/types/accounts-payable.types";
import { Divider } from "antd";
import React from "react";
import { formatCurrency } from "@/utils/formatters";

const MonthToDateSection: React.FC<MonthToDateSectionProps> = ({
  title = "Month - To - Date Values",
  values,
}) => {
  return (
    <div className="add-vendor-section month-to-date-section">
      <h4>{title}</h4>
      <Divider/>
      <div className="month-year-values-row">
        {values.map((item, index) => (
          <div className="value-col" key={index}>
            <div className="value-label">{item.label}</div>
            <div className="value-num">{formatCurrency(item.amount)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthToDateSection;
