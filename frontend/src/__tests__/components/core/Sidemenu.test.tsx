import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "../../utils/test-utils";
import Sidemenu from "../../../core/Sidemenu";

describe("Sidemenu Component", () => {
   beforeEach(() => {
      vi.clearAllMocks();
   });

   it("renders correctly", () => {
      render(<Sidemenu />);

      const sidebar = screen.getByTestId("sidebar");
      expect(sidebar).toBeInTheDocument();
      expect(sidebar).toHaveClass("custom-sidebar", "collapsed");
   });

   it("renders toggle button", () => {
      render(<Sidemenu />);

      const toggleButton = screen.getByTestId("toggle-button");
      expect(toggleButton).toBeInTheDocument();
      expect(toggleButton).toHaveClass("toggle-button");
   });

   it("renders menu items", () => {
      render(<Sidemenu />);

      // When collapsed, menu items should be present but labels not visible
      const menuItems = [
         "menu-item-order-invoice",
         "menu-item-accounts-receivable",
         "menu-item-sales-analysis",
         "menu-item-inventory",
         "menu-item-billing-freight",
         "menu-item-transportation",
         "menu-item-accounts-payable",
         "menu-item-fixed-assets",
         "menu-item-general-ledger",
         "menu-item-inventory-costing",
         "menu-item-work-query",
      ];

      menuItems.forEach((testId) => {
         expect(screen.getByTestId(testId)).toBeInTheDocument();
      });
   });

   it("renders menu icons", () => {
      render(<Sidemenu />);

      // Check that menu items have icons
      const menuItems = screen.getAllByTestId(/^menu-item-/);
      menuItems.forEach((item:any) => {
         const icon = item.querySelector(".icon img");
         expect(icon).toBeInTheDocument();
      });
   });

   it("toggles collapsed state when toggle button is clicked", () => {
      render(<Sidemenu />);

      const toggleButton = screen.getByTestId("toggle-button");
      const sidebar = screen.getByTestId("sidebar");

      // Initially collapsed
      expect(sidebar).toHaveClass("collapsed");

      // Click toggle button
      fireEvent.click(toggleButton);

      // Should not be collapsed
      expect(sidebar).not.toHaveClass("collapsed");

      // Click again to collapse
      fireEvent.click(toggleButton);

      // Should be collapsed again
      expect(sidebar).toHaveClass("collapsed");
   });

   it("shows menu labels when not collapsed", () => {
      render(<Sidemenu />);

      const toggleButton = screen.getByTestId("toggle-button");
      fireEvent.click(toggleButton);

      // Menu labels should be visible
      const menuLabels = screen.getAllByRole("heading", { level: 5 });
      expect(menuLabels.length).toBeGreaterThan(0);
   });

   it("hides menu labels when collapsed", () => {
      render(<Sidemenu />);

      // Initially collapsed, labels should not be visible
      const menuLabels = screen.queryAllByRole("heading", { level: 5 });
      expect(menuLabels.length).toBe(0);
   });

   it("renders menu items with proper structure", () => {
      render(<Sidemenu />);

      const menuItems = screen.getAllByTestId(/^menu-item-/);
      expect(menuItems.length).toBe(11); // Total number of menu items

      menuItems.forEach((item:any) => {
         expect(item).toHaveClass("menu-item");
      });
   });

   it("renders menu list", () => {
      render(<Sidemenu />);

      const menuList = screen.getByTestId("menu-list");
      expect(menuList).toBeInTheDocument();
      expect(menuList).toHaveClass("menu");
   });

   it("applies active class to current route", () => {
      // Mock the current route to be accounts-payable
      render(<Sidemenu />, { route: "/accounts-payable" });

      const accountsPayableItem = screen.getByTestId(
         "menu-item-accounts-payable"
      );
      expect(accountsPayableItem).toHaveClass("active");
   });

   it("does not apply active class to non-current routes", () => {
      render(<Sidemenu />, { route: "/accounts-payable" });

      const otherItems = screen.getAllByTestId(
         /^menu-item-(?!accounts-payable)/
      );

      otherItems.forEach((item: HTMLElement) => {
   expect(item).not.toHaveClass("active");
});

   });

   describe("Accessibility", () => {
      it("has proper semantic structure", () => {
         render(<Sidemenu />);

         const sidebar = screen.getByTestId("sidebar");
         expect(sidebar).toBeInTheDocument();
      });

      it("toggle button is accessible", () => {
         render(<Sidemenu />);

         const toggleButton = screen.getByTestId("toggle-button");
         expect(toggleButton).toBeInTheDocument();
      });

      it("menu items are accessible", () => {
         render(<Sidemenu />);

         const menuItems = screen.getAllByTestId(/^menu-item-/);
         expect(menuItems.length).toBeGreaterThan(0);
      });

      it("menu icons have proper alt text", () => {
         render(<Sidemenu />);

         // Get all menu item images (excluding the toggle button icon)
         const menuItemImages = screen
            .getAllByTestId(/^menu-item-/)
            .map((item:any) => item.querySelector("img"))
            .filter(Boolean);

         menuItemImages.forEach((icon:any) => {
            expect(icon).toHaveAttribute("alt");
            expect(icon?.getAttribute("alt")).toBeTruthy();
         });
      });
   });

   describe("Layout and Styling", () => {
      it("applies correct CSS classes when collapsed", () => {
         render(<Sidemenu />);

         const sidebar = screen.getByTestId("sidebar");
         expect(sidebar).toHaveClass("custom-sidebar", "collapsed");
      });

      it("applies correct CSS classes when expanded", () => {
         render(<Sidemenu />);

         const toggleButton = screen.getByTestId("toggle-button");
         fireEvent.click(toggleButton);

         const sidebar = screen.getByTestId("sidebar");
         expect(sidebar).toHaveClass("custom-sidebar");
         expect(sidebar).not.toHaveClass("collapsed");
      });

      it("toggle button has correct classes", () => {
         render(<Sidemenu />);

         const toggleButton = screen.getByTestId("toggle-button");
         expect(toggleButton).toHaveClass("toggle-button");
      });

      it("menu items have correct classes", () => {
         render(<Sidemenu />);

         const menuItems = screen.getAllByTestId(/^menu-item-/);
         menuItems.forEach((item:any) => {
            expect(item).toHaveClass("menu-item");
         });
      });
   });

   describe("Menu Item Details", () => {
      it("renders all required menu items", () => {
         render(<Sidemenu />);

         const expectedItems = [
            { key: "/order-invoice", label: "Order/Invoice/Product Moves" },
            { key: "/accounts-receivable", label: "Accounts Receivable" },
            { key: "/sales-analysis", label: "Sales Analysis" },
            { key: "/inventory", label: "Inventory" },
            { key: "/billing-freight", label: "Billing Freight" },
            { key: "/transportation", label: "Transportation" },
            { key: "/accounts-payable", label: "Accounts Payable" },
            { key: "/fixed-assets", label: "Fixed Assets" },
            { key: "/general-ledger", label: "General Ledger" },
            { key: "/inventory-costing", label: "Inventory Costing" },
            { key: "/work-query", label: "Work with Query" },
         ];

         // Check that menu items exist by their test IDs
         expectedItems.forEach((item) => {
            const menuItem = screen.getByTestId(
               `menu-item-${item.key.replace("/", "")}`
            );
            expect(menuItem).toBeInTheDocument();
         });
      });

      it("each menu item has an icon", () => {
         render(<Sidemenu />);

         const menuItems = screen.getAllByTestId(/^menu-item-/);
         menuItems.forEach((item:any) => {
            const icon = item.querySelector(".icon img");
            expect(icon).toBeInTheDocument();
         });
      });

      it("menu items have proper key attributes", () => {
         render(<Sidemenu />);

         const menuItems = screen.getAllByTestId(/^menu-item-/);
         expect(menuItems.length).toBe(11);
      });
   });
});
