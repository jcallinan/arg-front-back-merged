import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@/__tests__/utils/test-utils";
import { CustomPrefixInput } from "@/widget-library/Input";
import { mockInputProps } from "@/__tests__/__mocks__/mockData";

describe("CustomPrefixInput Component", () => {
   beforeEach(() => {
      vi.clearAllMocks();
   });

   it("renders correctly with required props", () => {
      render(<CustomPrefixInput {...mockInputProps} />);

      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("data-name", "test-input");
      expect(input).toHaveClass("custom-input");
   });

   it("renders with placeholder", () => {
      render(
         <CustomPrefixInput
            {...mockInputProps}
            placeholder="Custom placeholder"
         />
      );

      const input = screen.getByPlaceholderText("Custom placeholder");
      expect(input).toBeInTheDocument();
   });

   it("renders with prefix when provided", () => {
      const prefix = <span data-testid="prefix">$</span>;
      render(<CustomPrefixInput {...mockInputProps} prefix={prefix} />);

      expect(screen.getByTestId("prefix")).toBeInTheDocument();
   });

   it("calls onChange when value changes", () => {
      const mockOnChange = vi.fn();
      render(<CustomPrefixInput {...mockInputProps} onChange={mockOnChange} />);

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "new value" } });

      expect(mockOnChange).toHaveBeenCalled();
   });

   it("calls onBlur when input loses focus", () => {
      const mockOnBlur = vi.fn();
      render(<CustomPrefixInput {...mockInputProps} onBlur={mockOnBlur} />);

      const input = screen.getByRole("textbox");
      fireEvent.blur(input);

      expect(mockOnBlur).toHaveBeenCalled();
   });

   it("renders disabled state when disabled prop is true", () => {
      render(<CustomPrefixInput {...mockInputProps} disabled={true} />);

      const input = screen.getByRole("textbox");
      expect(input).toBeDisabled();
   });

   it("applies custom className", () => {
      render(
         <CustomPrefixInput {...mockInputProps} className="custom-class" />
      );

      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("custom-input", "custom-class");
   });

   it("renders with default placeholder when not provided", () => {
      render(<CustomPrefixInput {...mockInputProps} placeholder={undefined} />);

      const input = screen.getByPlaceholderText("Enter text");
      expect(input).toBeInTheDocument();
   });

   describe("Accessibility", () => {
      it("input is keyboard accessible", () => {
         render(<CustomPrefixInput {...mockInputProps} />);

         const input = screen.getByRole("textbox");
         expect(input).toBeInTheDocument();
      });

      it("disabled input is not interactive", () => {
         render(<CustomPrefixInput {...mockInputProps} disabled={true} />);

         const input = screen.getByRole("textbox");
         expect(input).toBeDisabled();
      });
   });
});
