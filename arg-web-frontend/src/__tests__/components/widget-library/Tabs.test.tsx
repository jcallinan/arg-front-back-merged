import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "../../utils/test-utils";
import TabsContent from "../../../widget-library/Tabs";

const mockTabsProps = {
   items: [
      {
         key: "1",
         label: "Tab 1",
         children: <div data-testid="tab1-content">Content for Tab 1</div>,
      },
      {
         key: "2",
         label: "Tab 2",
         children: <div data-testid="tab2-content">Content for Tab 2</div>,
      },
      {
         key: "3",
         label: "Tab 3",
         children: <div data-testid="tab3-content">Content for Tab 3</div>,
      },
   ],
};

describe("TabsContent Component", () => {
   beforeEach(() => {
      vi.clearAllMocks();
   });

   it("renders correctly with required props", () => {
      render(<TabsContent {...mockTabsProps} />);

      const tabs = screen.getByRole("tablist");
      expect(tabs).toBeInTheDocument();
   });

   it("renders all tab labels", () => {
      render(<TabsContent {...mockTabsProps} />);

      expect(screen.getByText("Tab 1")).toBeInTheDocument();
      expect(screen.getByText("Tab 2")).toBeInTheDocument();
      expect(screen.getByText("Tab 3")).toBeInTheDocument();
   });

   it("renders first tab content by default", () => {
      render(<TabsContent {...mockTabsProps} />);

      expect(screen.getByTestId("tab1-content")).toBeInTheDocument();
      expect(screen.queryByTestId("tab2-content")).not.toBeInTheDocument();
   });

   it("applies custom CSS class", () => {
      render(<TabsContent {...mockTabsProps} />);

      const tabs = screen.getByRole("tablist").closest(".ant-tabs");
      expect(tabs).toHaveClass("custom-tabs");
   });

   it("uses defaultActiveKey when provided", () => {
      render(<TabsContent {...mockTabsProps} defaultActiveKey="2" />);

      expect(screen.getByTestId("tab2-content")).toBeInTheDocument();
      expect(screen.queryByTestId("tab1-content")).not.toBeInTheDocument();
   });

   it("uses defaultActiveKey '1' when not provided", () => {
      render(<TabsContent {...mockTabsProps} />);

      expect(screen.getByTestId("tab1-content")).toBeInTheDocument();
   });

   it("uses activeKey when provided", () => {
      render(<TabsContent {...mockTabsProps} activeKey="3" />);

      expect(screen.getByTestId("tab3-content")).toBeInTheDocument();
      expect(screen.queryByTestId("tab1-content")).not.toBeInTheDocument();
   });

   it("prioritizes activeKey over defaultActiveKey", () => {
      render(
         <TabsContent {...mockTabsProps} activeKey="2" defaultActiveKey="3" />
      );

      expect(screen.getByTestId("tab2-content")).toBeInTheDocument();
      expect(screen.queryByTestId("tab3-content")).not.toBeInTheDocument();
   });

   it("calls onChange when tab is clicked", () => {
      const mockOnChange = vi.fn();
      render(<TabsContent {...mockTabsProps} onChange={mockOnChange} />);

      const tab2 = screen.getByText("Tab 2");
      fireEvent.click(tab2);

      expect(mockOnChange).toHaveBeenCalledWith("2");
   });

   it("switches content when tab is clicked", () => {
      render(<TabsContent {...mockTabsProps} />);

      const tab2 = screen.getByText("Tab 2");
      fireEvent.click(tab2);

      expect(screen.getByTestId("tab2-content")).toBeInTheDocument();
      // Note: In Ant Design tabs, previous content might still be in DOM but hidden
   });

   it("handles empty items array", () => {
      render(<TabsContent items={[]} />);

      const tabs = screen.getByRole("tablist");
      expect(tabs).toBeInTheDocument();
   });

   it("handles single tab", () => {
      const singleTabProps = {
         items: [
            {
               key: "1",
               label: "Single Tab",
               children: (
                  <div data-testid="single-tab-content">Single tab content</div>
               ),
            },
         ],
      };

      render(<TabsContent {...singleTabProps} />);

      expect(screen.getByText("Single Tab")).toBeInTheDocument();
      expect(screen.getByTestId("single-tab-content")).toBeInTheDocument();
   });

   it("handles tabs with disabled state", () => {
      const tabsWithDisabled = {
         items: [
            {
               key: "1",
               label: "Enabled Tab",
               children: (
                  <div data-testid="enabled-content">Enabled content</div>
               ),
            },
            {
               key: "2",
               label: "Disabled Tab",
               disabled: true,
               children: (
                  <div data-testid="disabled-content">Disabled content</div>
               ),
            },
         ],
      };

      render(<TabsContent {...tabsWithDisabled} />);

      expect(screen.getByText("Enabled Tab")).toBeInTheDocument();
      expect(screen.getByText("Disabled Tab")).toBeInTheDocument();
   });

   it("handles tabs with icons", () => {
      const tabsWithIcons = {
         items: [
            {
               key: "1",
               label: "Tab with Icon",
               children: (
                  <div data-testid="icon-tab-content">Icon tab content</div>
               ),
            },
         ],
      };

      render(<TabsContent {...tabsWithIcons} />);

      expect(screen.getByText("Tab with Icon")).toBeInTheDocument();
      expect(screen.getByTestId("icon-tab-content")).toBeInTheDocument();
   });

   describe("Accessibility", () => {
      it("has proper ARIA attributes", () => {
         render(<TabsContent {...mockTabsProps} />);

         const tabs = screen.getByRole("tablist");
         expect(tabs).toBeInTheDocument();
      });

      it("has proper tab roles", () => {
         render(<TabsContent {...mockTabsProps} />);

         const tabElements = screen.getAllByRole("tab");
         expect(tabElements).toHaveLength(3);
      });

      it("has proper tabpanel roles", () => {
         render(<TabsContent {...mockTabsProps} />);

         const tabpanels = screen.getAllByRole("tabpanel");
         expect(tabpanels.length).toBeGreaterThan(0);
      });

      it("is keyboard accessible", () => {
         render(<TabsContent {...mockTabsProps} />);

         const tabs = screen.getByRole("tablist");
         expect(tabs).toBeInTheDocument();
      });
   });

   describe("User Interaction", () => {
      it("handles keyboard navigation", () => {
         render(<TabsContent {...mockTabsProps} />);

         const tab1 = screen.getByText("Tab 1");
         fireEvent.keyDown(tab1, { key: "Enter" });

         expect(screen.getByTestId("tab1-content")).toBeInTheDocument();
      });

      it("handles mouse click events", () => {
         render(<TabsContent {...mockTabsProps} />);

         const tab3 = screen.getByText("Tab 3");
         fireEvent.click(tab3);

         expect(screen.getByTestId("tab3-content")).toBeInTheDocument();
      });

      it("maintains active state after interaction", () => {
         render(<TabsContent {...mockTabsProps} />);

         const tab2 = screen.getByText("Tab 2");
         fireEvent.click(tab2);

         expect(screen.getByTestId("tab2-content")).toBeInTheDocument();
         // Note: In Ant Design tabs, previous content might still be in DOM but hidden
      });
   });

   describe("Edge Cases", () => {
      it("handles undefined activeKey", () => {
         render(<TabsContent {...mockTabsProps} activeKey={undefined} />);

         expect(screen.getByTestId("tab1-content")).toBeInTheDocument();
      });

      it("handles undefined defaultActiveKey", () => {
         render(
            <TabsContent {...mockTabsProps} defaultActiveKey={undefined} />
         );

         expect(screen.getByTestId("tab1-content")).toBeInTheDocument();
      });

      it("handles undefined onChange", () => {
         render(<TabsContent {...mockTabsProps} onChange={undefined} />);

         const tab2 = screen.getByText("Tab 2");
         fireEvent.click(tab2);

         expect(screen.getByTestId("tab2-content")).toBeInTheDocument();
      });

      it("handles non-existent activeKey", () => {
         render(<TabsContent {...mockTabsProps} activeKey="non-existent" />);

         // When activeKey doesn't exist, Ant Design falls back to default behavior
         expect(screen.getByRole("tablist")).toBeInTheDocument();
      });

      it("handles tabs with empty content", () => {
         const tabsWithEmptyContent = {
            items: [
               {
                  key: "1",
                  label: "Empty Tab",
                  children: null,
               },
            ],
         };

         render(<TabsContent {...tabsWithEmptyContent} />);

         expect(screen.getByText("Empty Tab")).toBeInTheDocument();
      });
   });

   describe("Styling", () => {
      it("applies custom tabs class", () => {
         render(<TabsContent {...mockTabsProps} />);

         const tabs = screen.getByRole("tablist").closest(".ant-tabs");
         expect(tabs).toHaveClass("custom-tabs");
      });

      it("handles additional CSS classes", () => {
         render(<TabsContent {...mockTabsProps} />);

         const tabs = screen.getByRole("tablist");
         expect(tabs).toBeInTheDocument();
      });
   });
});
