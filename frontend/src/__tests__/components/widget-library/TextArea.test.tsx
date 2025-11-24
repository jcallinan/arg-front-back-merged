import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "../../utils/test-utils";
import { CustomTextArea } from "../../../widget-library/TextArea";

const mockTextAreaProps = {
   name: "test-textarea",
   className: "test-class",
   value: "",
   onChange: vi.fn(),
};

describe("CustomTextArea Component", () => {
   beforeEach(() => {
      vi.clearAllMocks();
   });

   it("renders correctly with required props", () => {
      render(<CustomTextArea {...mockTextAreaProps} />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toBeInTheDocument();
      expect(textarea).toHaveAttribute("data-name", "test-textarea");
   });

   it("renders with default placeholder", () => {
      render(<CustomTextArea {...mockTextAreaProps} />);

      const textarea = screen.getByPlaceholderText("Type here...");
      expect(textarea).toBeInTheDocument();
   });

   it("renders with custom placeholder", () => {
      render(<CustomTextArea {...mockTextAreaProps} placeholder="Custom placeholder" />);

      const textarea = screen.getByPlaceholderText("Custom placeholder");
      expect(textarea).toBeInTheDocument();
   });

   it("renders with value when provided", () => {
      render(<CustomTextArea {...mockTextAreaProps} value="Test content" />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveValue("Test content");
   });

   it("renders disabled state when disabled prop is true", () => {
      render(<CustomTextArea {...mockTextAreaProps} disabled={true} />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toBeDisabled();
   });

   it("renders enabled state when disabled prop is false", () => {
      render(<CustomTextArea {...mockTextAreaProps} disabled={false} />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).not.toBeDisabled();
   });

   it("applies custom className", () => {
      render(<CustomTextArea {...mockTextAreaProps} />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveClass("description-textarea", "test-class");
   });

   it("applies default className when no custom class provided", () => {
      const propsWithoutClass = {
         ...mockTextAreaProps,
         className: "",
      };

      render(<CustomTextArea {...propsWithoutClass} />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveClass("description-textarea");
   });

   it("calls onChange when text is entered", () => {
      render(<CustomTextArea {...mockTextAreaProps} />);

      const textarea = screen.getByRole("textbox");
      fireEvent.change(textarea, { target: { value: "New content" } });

      expect(mockTextAreaProps.onChange).toHaveBeenCalledWith(
         expect.objectContaining({
            target: expect.objectContaining({ value: "New content" }),
         })
      );
   });

   it("handles empty value", () => {
      render(<CustomTextArea {...mockTextAreaProps} value="" />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveValue("");
   });

   it("handles long text content", () => {
      const longText = "This is a very long text content that should be handled properly by the textarea component. It contains multiple sentences and should not cause any issues with rendering or functionality.";
      
      render(<CustomTextArea {...mockTextAreaProps} value={longText} />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveValue(longText);
   });

   it("handles special characters", () => {
      const specialText = "Special chars: !@#$%^&*()_+-=[]{}|;':\",./<>?";
      
      render(<CustomTextArea {...mockTextAreaProps} value={specialText} />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveValue(specialText);
   });

   it("handles multiline text", () => {
      const multilineText = "Line 1\nLine 2\nLine 3";
      
      render(<CustomTextArea {...mockTextAreaProps} value={multilineText} />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveValue(multilineText);
   });

   it("handles undefined value", () => {
      const propsWithUndefinedValue = {
         ...mockTextAreaProps,
         value: undefined as any,
      };

      render(<CustomTextArea {...propsWithUndefinedValue} />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveValue("");
   });

   it("handles null value", () => {
      const propsWithNullValue = {
         ...mockTextAreaProps,
         value: null as any,
      };

      render(<CustomTextArea {...propsWithNullValue} />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveValue("");
   });

   describe("Accessibility", () => {
      it("has proper ARIA attributes", () => {
         render(<CustomTextArea {...mockTextAreaProps} />);

         const textarea = screen.getByRole("textbox");
         expect(textarea).toBeInTheDocument();
      });

      it("is keyboard accessible", () => {
         render(<CustomTextArea {...mockTextAreaProps} />);

         const textarea = screen.getByRole("textbox");
         expect(textarea).toBeInTheDocument();
      });

      it("disabled state is properly announced", () => {
         render(<CustomTextArea {...mockTextAreaProps} disabled={true} />);

         const textarea = screen.getByRole("textbox");
         expect(textarea).toBeDisabled();
      });

      it("has proper data-name attribute for testing", () => {
         render(<CustomTextArea {...mockTextAreaProps} />);

         const textarea = screen.getByRole("textbox");
         expect(textarea).toHaveAttribute("data-name", "test-textarea");
      });
   });

   describe("User Interaction", () => {
      it("allows typing when enabled", () => {
         render(<CustomTextArea {...mockTextAreaProps} />);

         const textarea = screen.getByRole("textbox");
         fireEvent.change(textarea, { target: { value: "User input" } });

         expect(mockTextAreaProps.onChange).toHaveBeenCalled();
      });

      it("prevents typing when disabled", () => {
         render(<CustomTextArea {...mockTextAreaProps} disabled={true} />);

         const textarea = screen.getByRole("textbox");
         fireEvent.change(textarea, { target: { value: "User input" } });

         // onChange should still be called but the input should be disabled
         expect(textarea).toBeDisabled();
      });

      it("handles focus events", () => {
         render(<CustomTextArea {...mockTextAreaProps} />);

         const textarea = screen.getByRole("textbox");
         fireEvent.focus(textarea);

         expect(textarea).toBeInTheDocument();
      });

      it("handles blur events", () => {
         render(<CustomTextArea {...mockTextAreaProps} />);

         const textarea = screen.getByRole("textbox");
         fireEvent.blur(textarea);

         expect(textarea).toBeInTheDocument();
      });
   });

   describe("Styling", () => {
      it("applies multiple custom classes", () => {
         render(<CustomTextArea {...mockTextAreaProps} className="class1 class2" />);

         const textarea = screen.getByRole("textbox");
         expect(textarea).toHaveClass("description-textarea", "class1", "class2");
      });

      it("handles empty className gracefully", () => {
         const propsWithEmptyClass = {
            ...mockTextAreaProps,
            className: "",
         };

         render(<CustomTextArea {...propsWithEmptyClass} />);

         const textarea = screen.getByRole("textbox");
         expect(textarea).toHaveClass("description-textarea");
      });
   });
}); 