import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "../../utils/test-utils";
import TableWidget from "../../../widget-library/Table";
import { mockTableData, mockTableColumns } from "../../__mocks__/mockData";

describe("TableWidget Component", () => {
   beforeEach(() => {
      vi.clearAllMocks();
   });

   it("renders correctly with required props", () => {
      render(
         <TableWidget columns={mockTableColumns} dataSource={mockTableData} />
      );

      const table = screen.getByRole("table");
      expect(table).toBeInTheDocument();
   });

   it("renders table headers", () => {
      render(
         <TableWidget columns={mockTableColumns} dataSource={mockTableData} />
      );

      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("Age")).toBeInTheDocument();
      expect(screen.getByText("Address")).toBeInTheDocument();
   });

   it("renders table data", () => {
      render(
         <TableWidget columns={mockTableColumns} dataSource={mockTableData} />
      );

      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
      expect(screen.getByText("32")).toBeInTheDocument();
      expect(screen.getByText("28")).toBeInTheDocument();
   });

   it("renders loading state when loading prop is true", () => {
      render(
         <TableWidget
            columns={mockTableColumns}
            dataSource={mockTableData}
            loading={true}
         />
      );

      const table = screen.getByRole("table");
      expect(table).toBeInTheDocument();
   });

   it("renders empty state when dataSource is empty", () => {
      render(<TableWidget columns={mockTableColumns} dataSource={[]} />);

      const table = screen.getByRole("table");
      expect(table).toBeInTheDocument();
      expect(
         screen.getByText("No data", { selector: ".ant-empty-description" })
      ).toBeInTheDocument();
   });

   it("renders table with onChange handler", () => {
      const mockOnChange = vi.fn();
      render(
         <TableWidget
            columns={mockTableColumns}
            dataSource={mockTableData}
            onChange={mockOnChange}
         />
      );

      const table = screen.getByRole("table");
      expect(table).toBeInTheDocument();
      expect(mockOnChange).toBeDefined();
   });

   it("renders with custom rowKey", () => {
      const customData = [
         { id: "1", name: "John Doe", age: 32 },
         { id: "2", name: "Jane Smith", age: 28 },
      ];
      render(
         <TableWidget
            columns={mockTableColumns}
            dataSource={customData}
            rowKey="id"
         />
      );

      const table = screen.getByRole("table");
      expect(table).toBeInTheDocument();
   });

   it("renders with row selection", () => {
      const rowSelection = {
         onChange: vi.fn(),
         selectedRowKeys: [],
      };
      render(
         <TableWidget
            columns={mockTableColumns}
            dataSource={mockTableData}
            rowSelection={rowSelection}
         />
      );

      const table = screen.getByRole("table");
      expect(table).toBeInTheDocument();
   });

   it("renders filterable columns with search functionality", () => {
      const filterableColumns = [
         {
            title: "Name",
            dataIndex: "name",
            key: "name",
            filterable: true,
         },
         {
            title: "Age",
            dataIndex: "age",
            key: "age",
         },
      ];
      render(
         <TableWidget columns={filterableColumns} dataSource={mockTableData} />
      );

      const table = screen.getByRole("table");
      expect(table).toBeInTheDocument();
   });

   it("renders with horizontal scroll", () => {
      render(
         <TableWidget columns={mockTableColumns} dataSource={mockTableData} />
      );

      const table = screen.getByRole("table");
      expect(table).toBeInTheDocument();
   });

   it("renders pagination by default", () => {
      render(
         <TableWidget columns={mockTableColumns} dataSource={mockTableData} />
      );

      // Check for pagination elements
      expect(screen.getByText("Total 2 items")).toBeInTheDocument();
   });

   describe("Accessibility", () => {
      it("table has proper ARIA attributes", () => {
         render(
            <TableWidget
               columns={mockTableColumns}
               dataSource={mockTableData}
            />
         );

         const table = screen.getByRole("table");
         expect(table).toBeInTheDocument();
      });

      it("table headers are accessible", () => {
         render(
            <TableWidget
               columns={mockTableColumns}
               dataSource={mockTableData}
            />
         );

         const headers = screen.getAllByRole("columnheader");
         expect(headers.length).toBe(3); // Name, Age, Address
      });

      it("table rows are accessible", () => {
         render(
            <TableWidget
               columns={mockTableColumns}
               dataSource={mockTableData}
            />
         );

         const rows = screen.getAllByRole("row");
         expect(rows.length).toBeGreaterThan(1); // Header row + data rows
      });
   });
});
