import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "../../utils/test-utils";
import AutoCompletes from "../../../widget-library/AutoComplete";

const mockAutoCompleteProps = {
   id: "test-autocomplete",
   tabs: ["Vendors", "Invoices", "Companies"],
   dataMap: {
      Vendors: [
         { value: "vendor1", label: "Vendor One" },
         { value: "vendor2", label: "Vendor Two" },
      ],
      Invoices: [
         { value: "inv1", label: "Invoice 001" },
         { value: "inv2", label: "Invoice 002" },
      ],
      Companies: [
         { value: "comp1", label: "Company Alpha" },
         { value: "comp2", label: "Company Beta" },
      ],
   },
};

describe("AutoComplete Component", () => {
   beforeEach(() => {
      vi.clearAllMocks();
   });

   it("renders correctly with required props", () => {
      render(<AutoCompletes {...mockAutoCompleteProps} />);
      const input = screen.getByRole("combobox");
      expect(input).toBeInTheDocument();
   });

   it("renders search icon", () => {
      render(<AutoCompletes {...mockAutoCompleteProps} />);
      const searchIcon = screen.getByRole("img", { name: /search/i });
      expect(searchIcon).toBeInTheDocument();
   });

   it("renders with placeholder", () => {
      render(<AutoCompletes {...mockAutoCompleteProps} />);
      const input = screen.getByPlaceholderText("Search for menu, companies, vendor, invoices etc");
      expect(input).toBeInTheDocument();
   });

   it("handles input change", () => {
      render(<AutoCompletes {...mockAutoCompleteProps} />);
      const input = screen.getByRole("combobox");
      fireEvent.change(input, { target: { value: "test search" } });
      expect(input).toHaveValue("test search");
   });

   it("handles empty data for a tab", () => {
      const propsWithEmptyData = {
         ...mockAutoCompleteProps,
         dataMap: {
            ...mockAutoCompleteProps.dataMap,
            Vendors: [],
         },
      };

      render(<AutoCompletes {...propsWithEmptyData} />);
      const input = screen.getByRole("combobox");
      expect(input).toBeInTheDocument();
   });

   it("applies custom CSS classes", () => {
      render(<AutoCompletes {...mockAutoCompleteProps} />);
      const inputWrapper = screen.getByRole("combobox").closest('.custom-search-input');
      expect(inputWrapper).toHaveClass("custom-search-input");
   });

   describe("Accessibility", () => {
      it("has proper ARIA attributes", () => {
         render(<AutoCompletes {...mockAutoCompleteProps} />);
         const input = screen.getByRole("combobox");
         expect(input).toHaveAttribute("aria-autocomplete", "list");
         expect(input).toHaveAttribute("aria-haspopup", "listbox");
      });

      it("has search icon with proper accessibility", () => {
         render(<AutoCompletes {...mockAutoCompleteProps} />);
         const searchIcon = screen.getByRole("img", { name: /search/i });
         expect(searchIcon).toHaveAttribute("aria-label", "search");
      });

      it("input is accessible", () => {
         render(<AutoCompletes {...mockAutoCompleteProps} />);
         const input = screen.getByRole("combobox");
         expect(input).toBeInTheDocument();
      });
   });
});
