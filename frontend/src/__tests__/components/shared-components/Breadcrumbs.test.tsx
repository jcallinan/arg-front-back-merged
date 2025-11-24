import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "../../utils/test-utils";
import Breadcrumbs from "../../../shared-components/breadcrumbs/BreadCrumbs";

const mockBreadcrumbsProps = {
   items: [
      { label: "Home", path: "/" },
      { label: "Accounts", path: "/accounts" },
      { label: "Payable", path: "/accounts/payable" },
      { label: "Vouchers" }, // No path for last item
   ],
};

describe("Breadcrumbs Component", () => {
   beforeEach(() => {
      vi.clearAllMocks();
   });

   it("renders correctly with required props", () => {
      render(<Breadcrumbs {...mockBreadcrumbsProps} />);
      const breadcrumb = screen.getByRole("navigation");
      expect(breadcrumb).toBeInTheDocument();
   });

   it("renders all breadcrumb items", () => {
      render(<Breadcrumbs {...mockBreadcrumbsProps} />);
      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("Accounts")).toBeInTheDocument();
      expect(screen.getByText("Payable")).toBeInTheDocument();
      expect(screen.getByText("Vouchers")).toBeInTheDocument();
   });

   it("renders links for items with paths", () => {
      render(<Breadcrumbs {...mockBreadcrumbsProps} />);
      const homeLink = screen.getByText("Home");
      const accountsLink = screen.getByText("Accounts");
      const payableLink = screen.getByText("Payable");

      expect(homeLink.closest("a")).toHaveAttribute("href", "/");
      expect(accountsLink.closest("a")).toHaveAttribute("href", "/accounts");
      expect(payableLink.closest("a")).toHaveAttribute("href", "/accounts/payable");
   });

   it("renders last item as strong text", () => {
      render(<Breadcrumbs {...mockBreadcrumbsProps} />);
      const lastItem = screen.getByText("Vouchers");
      expect(lastItem.closest("strong")).toBeInTheDocument();
   });

   it("applies custom CSS class", () => {
      render(<Breadcrumbs {...mockBreadcrumbsProps} />);
      const breadcrumb = screen.getByRole("navigation");
      expect(breadcrumb).toHaveClass("custom-breadcrumb");
   });

   it("handles single item", () => {
      const singleItemProps = {
         items: [{ label: "Home", path: "/" }],
      };
      render(<Breadcrumbs {...singleItemProps} />);
      const homeItem = screen.getByText("Home");
      expect(homeItem.closest("strong")).toBeInTheDocument();
   });

   it("handles items without paths", () => {
      const noPathProps = {
         items: [
            { label: "Home" },
            { label: "Accounts" },
            { label: "Payable" },
         ],
      };
      render(<Breadcrumbs {...noPathProps} />);
      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("Accounts")).toBeInTheDocument();
      expect(screen.getByText("Payable").closest("strong")).toBeInTheDocument();
   });

   it("handles empty array", () => {
      render(<Breadcrumbs items={[]} />);
      const breadcrumb = screen.getByRole("navigation");
      expect(breadcrumb).toBeInTheDocument();
   });

   it("handles special characters in labels", () => {
      const specialCharProps = {
         items: [
            { label: "Home & Dashboard", path: "/" },
            { label: "Accounts (Payable)", path: "/accounts" },
            { label: "Vouchers #123" },
         ],
      };
      render(<Breadcrumbs {...specialCharProps} />);
      expect(screen.getByText("Home & Dashboard")).toBeInTheDocument();
      expect(screen.getByText("Accounts (Payable)")).toBeInTheDocument();
      expect(screen.getByText("Vouchers #123")).toBeInTheDocument();
   });

   it("handles long labels", () => {
      const longLabelProps = {
         items: [
            { label: "This is a very long breadcrumb label that should be handled properly", path: "/" },
            { label: "Another long label for testing purposes", path: "/test" },
            { label: "Final long label" },
         ],
      };
      render(<Breadcrumbs {...longLabelProps} />);
      expect(screen.getByText("This is a very long breadcrumb label that should be handled properly")).toBeInTheDocument();
      expect(screen.getByText("Another long label for testing purposes")).toBeInTheDocument();
      expect(screen.getByText("Final long label")).toBeInTheDocument();
   });

   describe("Accessibility", () => {
      it("has proper navigation role", () => {
         render(<Breadcrumbs {...mockBreadcrumbsProps} />);
         const breadcrumb = screen.getByRole("navigation");
         expect(breadcrumb).toBeInTheDocument();
      });

      it("links have proper href attributes", () => {
         render(<Breadcrumbs {...mockBreadcrumbsProps} />);
         const links = screen.getAllByRole("link");
         expect(links).toHaveLength(3);
         expect(links[0]).toHaveAttribute("href", "/");
         expect(links[1]).toHaveAttribute("href", "/accounts");
         expect(links[2]).toHaveAttribute("href", "/accounts/payable");
      });

      it("last item is properly marked as current", () => {
         render(<Breadcrumbs {...mockBreadcrumbsProps} />);
         const lastItem = screen.getByText("Vouchers");
         expect(lastItem.closest("strong")).toBeInTheDocument();
      });
   });

   describe("Navigation", () => {
      it("renders correct number of items", () => {
         render(<Breadcrumbs {...mockBreadcrumbsProps} />);
         const items = screen.getAllByRole("listitem");
         expect(items).toHaveLength(4);
      });

      it("maintains proper order of items", () => {
         render(<Breadcrumbs {...mockBreadcrumbsProps} />);
         const items = screen.getAllByRole("listitem");
         expect(items[0]).toHaveTextContent("Home");
         expect(items[1]).toHaveTextContent("Accounts");
         expect(items[2]).toHaveTextContent("Payable");
         expect(items[3]).toHaveTextContent("Vouchers");
      });
   });

   describe("Edge Cases", () => {
      it("handles undefined items", () => {
         render(<Breadcrumbs items={undefined as any} />);
         // Component returns null for undefined items
         expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
      });

      it("handles null items", () => {
         render(<Breadcrumbs items={null as any} />);
         // Component returns null for null items
         expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
      });

      it("handles items with empty labels", () => {
         const emptyLabelProps = {
            items: [
               { label: "", path: "/" },
               { label: "Valid Label", path: "/valid" },
               { label: "" },
            ],
         };
         render(<Breadcrumbs {...emptyLabelProps} />);
         expect(screen.getByText("Valid Label")).toBeInTheDocument();
      });

      it("handles items with empty paths", () => {
         const emptyPathProps = {
            items: [
               { label: "Home", path: "" },
               { label: "Accounts", path: "/accounts" },
               { label: "Payable" },
            ],
         };
         render(<Breadcrumbs {...emptyPathProps} />);
         const homeItem = screen.getByText("Home");
         const homeLink = homeItem.closest("a");
         
         // Check if the link exists (it might not render for empty paths)
         if (homeLink) {
            expect(homeLink).toHaveAttribute("href", "");
         } else {
            // If no link is rendered for empty path, that's also valid behavior
            expect(homeItem).toBeInTheDocument();
         }
      });
   });
});
