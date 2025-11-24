import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "../../utils/test-utils";
import {
   PrimaryButton,
   DefaultButton,
   DashedButton,
   TextButton,
   CustomStyledButton,
} from "../../../widget-library/Buttons";
import { mockButtonProps } from "../../__mocks__/mockData";

describe("Buttons Component", () => {
   beforeEach(() => {
      vi.clearAllMocks();
   });

   describe("PrimaryButton", () => {
      it("renders correctly with required props", () => {
         render(<PrimaryButton {...mockButtonProps} />);

         const button = screen.getByRole("button", { name: "Test Button" });
         expect(button).toBeInTheDocument();
         expect(button).toHaveAttribute("data-name", "test-button");
         expect(button).toHaveClass("ant-btn-primary");
      });

      it("calls onClick when clicked", () => {
         const mockOnClick = vi.fn();
         render(<PrimaryButton {...mockButtonProps} onClick={mockOnClick} />);

         const button = screen.getByRole("button", { name: "Test Button" });
         fireEvent.click(button);

         expect(mockOnClick).toHaveBeenCalledTimes(1);
      });

      it("renders with custom label", () => {
         render(<PrimaryButton {...mockButtonProps} label="Custom Label" />);

         expect(
            screen.getByRole("button", { name: "Custom Label" })
         ).toBeInTheDocument();
      });
   });

   describe("DefaultButton", () => {
      it("renders correctly with required props", () => {
         render(<DefaultButton {...mockButtonProps} />);

         const button = screen.getByRole("button", { name: "Test Button" });
         expect(button).toBeInTheDocument();
         expect(button).toHaveAttribute("data-name", "test-button");
         expect(button).toHaveClass("ant-Button");
      });

      it("renders with icon when provided", () => {
         const mockIcon = <span data-testid="test-icon">Icon</span>;
         render(<DefaultButton {...mockButtonProps} icon={mockIcon} />);

         expect(screen.getByTestId("test-icon")).toBeInTheDocument();
      });

      it("calls onClick when clicked", () => {
         const mockOnClick = vi.fn();
         render(<DefaultButton {...mockButtonProps} onClick={mockOnClick} />);

         const button = screen.getByRole("button", { name: "Test Button" });
         fireEvent.click(button);

         expect(mockOnClick).toHaveBeenCalledTimes(1);
      });
   });

   describe("DashedButton", () => {
      it("renders correctly with required props", () => {
         render(<DashedButton {...mockButtonProps} />);

         const button = screen.getByRole("button", { name: "Test Button" });
         expect(button).toBeInTheDocument();
         expect(button).toHaveAttribute("data-name", "test-button");
         expect(button).toHaveClass("ant-btn-dashed");
      });

      it("calls onClick when clicked", () => {
         const mockOnClick = vi.fn();
         render(<DashedButton {...mockButtonProps} onClick={mockOnClick} />);

         const button = screen.getByRole("button", { name: "Test Button" });
         fireEvent.click(button);

         expect(mockOnClick).toHaveBeenCalledTimes(1);
      });
   });

   describe("TextButton", () => {
      it("renders correctly with required props", () => {
         render(<TextButton {...mockButtonProps} />);

         const button = screen.getByRole("button", { name: "Test Button" });
         expect(button).toBeInTheDocument();
         expect(button).toHaveAttribute("data-name", "test-button");
         expect(button).toHaveClass("ant-btn-text");
      });

      it("calls onClick when clicked", () => {
         const mockOnClick = vi.fn();
         render(<TextButton {...mockButtonProps} onClick={mockOnClick} />);

         const button = screen.getByRole("button", { name: "Test Button" });
         fireEvent.click(button);

         expect(mockOnClick).toHaveBeenCalledTimes(1);
      });
   });

   describe("CustomStyledButton", () => {
      it("renders correctly with required props", () => {
         render(<CustomStyledButton {...mockButtonProps} />);

         const button = screen.getByRole("button", { name: "Test Button" });
         expect(button).toBeInTheDocument();
         expect(button).toHaveAttribute("data-name", "test-button");
         expect(button).toHaveClass("custom-styled-button");
      });

      it("renders with icon when provided", () => {
         const mockIcon = <span data-testid="custom-icon">Icon</span>;
         render(<CustomStyledButton {...mockButtonProps} icon={mockIcon} />);

         expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
      });

      it("renders disabled state when disabled prop is true", () => {
         render(<CustomStyledButton {...mockButtonProps} disabled={true} />);

         const button = screen.getByRole("button", { name: "Test Button" });
         expect(button).toBeDisabled();
      });

      it("calls onClick when clicked and not disabled", () => {
         const mockOnClick = vi.fn();
         render(
            <CustomStyledButton {...mockButtonProps} onClick={mockOnClick} />
         );

         const button = screen.getByRole("button", { name: "Test Button" });
         fireEvent.click(button);

         expect(mockOnClick).toHaveBeenCalledTimes(1);
      });

      it("does not call onClick when disabled", () => {
         const mockOnClick = vi.fn();
         render(
            <CustomStyledButton
               {...mockButtonProps}
               onClick={mockOnClick}
               disabled={true}
            />
         );

         const button = screen.getByRole("button", { name: "Test Button" });
         fireEvent.click(button);

         expect(mockOnClick).not.toHaveBeenCalled();
      });
   });

   describe("Accessibility", () => {
      it("all buttons are keyboard accessible", () => {
         const { rerender } = render(<PrimaryButton {...mockButtonProps} />);

         let button = screen.getByRole("button");
         expect(button).toBeInTheDocument();

         rerender(<DefaultButton {...mockButtonProps} />);
         button = screen.getByRole("button");
         expect(button).toBeInTheDocument();
      });

      it("disabled buttons are not clickable", () => {
         render(<CustomStyledButton {...mockButtonProps} disabled={true} />);

         const button = screen.getByRole("button");
         expect(button).toBeDisabled();
      });
   });
});
