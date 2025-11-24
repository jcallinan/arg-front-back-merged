import { useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { AutoComplete, Input, Tag, List } from "antd";
import type { CustomAutoCompleteProps } from "@type-definitions/accounts-payable.types";

export default function AutoCompletes({
   id,
   tabs,
   dataMap,
}: CustomAutoCompleteProps) {
   const [activeTab, setActiveTab] = useState(tabs[0]);

   return (
      <AutoComplete
         popupRender={() => (
            <div>
               <div className="category-tabs">
                  {tabs.map((tab) => (
                     <Tag
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`category-tag ${
                           tab === activeTab ? "selected-tab" : ""
                        }`}
                        id={id}
                     >
                        {tab}
                     </Tag>
                  ))}
               </div>

               <h6 className="suggested-tabtitle">Suggested {activeTab}</h6>

               <List
                  size="small"
                  dataSource={dataMap[activeTab] || []}
                  renderItem={(item) => (
                     <List.Item style={{ cursor: "pointer" }}>
                        {item.label}
                     </List.Item>
                  )}
                  style={{ padding: 10 }}
               />
            </div>
         )}
         options={dataMap[activeTab] || []}
      >
         <Input
            placeholder="Search for menu, companies, vendor, invoices etc"
            prefix={<SearchOutlined style={{ color: "#999", fontSize: 16}} />}
            className="custom-search-input"
            id={id}
         />
      </AutoComplete>
   );
}
