import { Table, Input, Button } from "antd";
import type { ColumnType } from "antd/es/table";
import type { PaginationProps } from "antd";
import type { TableWidgetProps } from "@type-definitions/accounts-payable.types";
import type { JSX } from "react";

/** Optional: Pagination callback */
const onPaginationChange: PaginationProps["onChange"] = (_pageNumber) => {};

/** Custom filter dropdown logic */
const getColumnSearchProps = <T extends object>(
   dataIndex: keyof T,
   placeholder: string
): Partial<ColumnType<T>> => ({
   filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
   }) => (
      <div style={{ padding: 8 }}>
         <Input
            placeholder={placeholder}
            value={selectedKeys[0] as string}
            onChange={(e) => {
               const value = e.target.value;
               setSelectedKeys(value ? [value] : []);
               if (value) {
                  confirm({ closeDropdown: false });
               } else {
                  confirm({ closeDropdown: true });
               }
            }}
            onPressEnter={() => confirm({ closeDropdown: true })}
            style={{ width: 188, marginBottom: 8, display: "block" }}
         />
         <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Button
               size="small"
               onClick={() => {
                  if (clearFilters) clearFilters();
                  setSelectedKeys([]);
                  confirm({ closeDropdown: true });
               }}
            >
               Clear
            </Button>
         </div>
      </div>
   ),
   onFilter: (value, record) => {
      const fieldValue = String(record[dataIndex] ?? "").toLowerCase();
      const filterValue = String(value).toLowerCase();
      // Use startsWith instead of includes to avoid "Active" matching "Inactive"
      return fieldValue.startsWith(filterValue);
   },
});

const TableWidget = <T extends object>({
   columns,
   dataSource,
   loading = false,
   onChange,
   rowKey = "key",
   pagination = {
      total: dataSource?.length ?? 0,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total) => `Total ${total} items`,
      onChange: onPaginationChange,
   },
   rowSelection,
}: TableWidgetProps<T>): JSX.Element => {
   const processedColumns = columns.map((col) => {
      if (
         "filterable" in col &&
         col.filterable &&
         "dataIndex" in col &&
         col.dataIndex
      ) {
         return {
            ...col,
            ...getColumnSearchProps(
               col.dataIndex as keyof T,
               `Search ${String(col.title)}`
            ),
         };
      }
      return col;
   });

   return (
      <Table<T>
         columns={processedColumns}
         dataSource={dataSource}
         loading={loading}
         onChange={onChange}
         rowKey={rowKey}
         pagination={pagination}
         rowSelection={rowSelection}
         scroll={{ x: "max-content" }}
      />
   );
};

export default TableWidget;
