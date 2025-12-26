import type { FC } from "react";
import { Breadcrumb } from "antd";
import { useNavigate } from "react-router-dom";
import type { BreadcrumbsProps } from "@type-definitions/accounts-payable.types";

const Breadcrumbs: FC<BreadcrumbsProps> = ({ items }) => {
  const navigate = useNavigate();

  // Handle undefined or null items
  if (!items || !Array.isArray(items)) {
    return null;
  }

  const lastIndex = items.length - 1;

  const handleClick = (path: string, event: React.MouseEvent) => {
    event.preventDefault();
    navigate(path);
  };

  return (
    <Breadcrumb
      className="custom-breadcrumb"
      items={items.map(({ label, path }, index) => {
        const isLast = index === lastIndex;

        const content = isLast ? (
          <strong>{label}</strong>
        ) : path ? (
          <a
            href={path}
            onClick={(e) => handleClick(path, e)}
            style={{ cursor: "pointer" }}
          >
            {label}
          </a>
        ) : (
          label
        );

        return {
          key: label || String(index),
          title: content,
        };
      })}
    />
  );
};

export default Breadcrumbs;
