import React from "react";
import { Tabs } from "antd";
import type { TabsContentProps } from "@type-definitions/accounts-payable.types";

const TabsContent: React.FC<TabsContentProps> = ({
  items,
  activeKey,
  defaultActiveKey,
  onChange,
}) => {
  return (
    <Tabs
      className="custom-tabs"
      items={items}
      onChange={onChange}
      {...(activeKey !== undefined
        ? { activeKey }
        : { defaultActiveKey: defaultActiveKey || "1" })}
    />
  );
};

export default TabsContent;
