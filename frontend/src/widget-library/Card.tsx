import React from "react";
import type { CardProps } from "@type-definitions/accounts-payable.types";

const Card: React.FC<CardProps> = ({
  icon,
  label,
  value,
  widthClass = "",
  className = "",
}) => {
  return (
    <div className={`card  height-inherit ${widthClass} ${className}`}>
      <div className="icon">{icon}</div>
      <div className="content">
        <span className="text p-m">{label}</span>
        <span className="number sub-title">
          {typeof value === "number"
            ? value.toLocaleString("en-US")
            : value ?? " "}
        </span>
      </div>
    </div>
  );
};

export default Card;
