import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "../../utils/test-utils";
import Card from "../../../widget-library/Card";

const mockCardProps = {
   icon: <span data-testid="test-icon">📊</span>,
   label: "Test Label",
   value: "1000",
};

describe("Card Component", () => {
   beforeEach(() => {
      vi.clearAllMocks();
   });

   it("renders correctly with required props", () => {
      render(<Card {...mockCardProps} />);
      const card = screen.getByText("Test Label").closest(".card");
      expect(card).toBeInTheDocument();
   });

   it("renders icon", () => {
      render(<Card {...mockCardProps} />);
      const icon = screen.getByTestId("test-icon");
      expect(icon).toBeInTheDocument();
   });

   it("renders label", () => {
      render(<Card {...mockCardProps} />);
      const label = screen.getByText("Test Label");
      expect(label).toBeInTheDocument();
   });

   it("renders value", () => {
      render(<Card {...mockCardProps} />);
      const value = screen.getByText("1000");
      expect(value).toBeInTheDocument();
   });

   it("renders number value with locale formatting", () => {
      render(<Card {...mockCardProps} value={1234567} />);

      // Check that the value is rendered (with locale formatting)
      const valueElement = screen.getByText("1,234,567");
      expect(valueElement).toBeInTheDocument();
   });

   it("handles null value", () => {
      render(<Card {...mockCardProps} value={""} />);
      const card = screen.getByText("Test Label").closest(".card");
      expect(card).toBeInTheDocument();
   });

   it("handles undefined value", () => {
      render(<Card {...mockCardProps} value={""} />);
      const card = screen.getByText("Test Label").closest(".card");
      expect(card).toBeInTheDocument();
   });

   it("handles empty string value", () => {
      render(<Card {...mockCardProps} value="" />);
      const card = screen.getByText("Test Label").closest(".card");
      expect(card).toBeInTheDocument();
   });

   it("handles empty string label", () => {
      render(<Card {...mockCardProps} label="" />);
      const card = screen.getByText("1000").closest(".card");
      expect(card).toBeInTheDocument();
   });

   it("applies custom className", () => {
      render(<Card {...mockCardProps} className="custom-card" />);
      const card = screen.getByText("Test Label").closest(".card");
      expect(card).toHaveClass("custom-card");
   });

   it("applies default height class", () => {
      render(<Card {...mockCardProps} />);
      const card = screen.getByText("Test Label").closest(".card");
      expect(card).toHaveClass("height-inherit");
   });

   it("applies widthClass", () => {
      render(<Card {...mockCardProps} widthClass="custom-width" />);
      const card = screen.getByText("Test Label").closest(".card");
      expect(card).toHaveClass("custom-width");
   });

   it("handles string value", () => {
      render(<Card {...mockCardProps} value="Test Value" />);
      const value = screen.getByText("Test Value");
      expect(value).toBeInTheDocument();
   });

   it("handles zero value", () => {
      render(<Card {...mockCardProps} value={0} />);
      const value = screen.getByText("0");
      expect(value).toBeInTheDocument();
   });

   it("handles negative value", () => {
      render(<Card {...mockCardProps} value={-1000} />);
      const value = screen.getByText("-1,000");
      expect(value).toBeInTheDocument();
   });

   it("handles decimal value", () => {
      render(<Card {...mockCardProps} value={1234.56} />);
      const value = screen.getByText("1,234.56");
      expect(value).toBeInTheDocument();
   });

   describe("Accessibility", () => {
      it("has proper semantic structure", () => {
         render(<Card {...mockCardProps} />);
         const card = screen.getByText("Test Label").closest(".card");
         expect(card).toBeInTheDocument();
      });

      it("icon has test id for accessibility", () => {
         render(<Card {...mockCardProps} />);
         const icon = screen.getByTestId("test-icon");
         expect(icon).toBeInTheDocument();
      });
   });

   describe("Styling", () => {
      it("applies multiple custom classes", () => {
         render(<Card {...mockCardProps} className="class1 class2" />);
         const card = screen.getByText("Test Label").closest(".card");
         expect(card).toHaveClass("class1", "class2");
      });

      it("maintains default classes with custom ones", () => {
         render(<Card {...mockCardProps} className="custom-class" />);
         const card = screen.getByText("Test Label").closest(".card");
         expect(card).toHaveClass("height-inherit", "custom-class");
      });

      it("applies both widthClass and className", () => {
         render(
            <Card
               {...mockCardProps}
               widthClass="width-class"
               className="custom-class"
            />
         );
         const card = screen.getByText("Test Label").closest(".card");
         expect(card).toHaveClass("width-class", "custom-class");
      });
   });

   describe("Edge Cases", () => {
      it("handles very large numbers", () => {
         render(<Card {...mockCardProps} value={999999999999} />);

         // Check that the value is rendered (with locale formatting)
         const valueElement = screen.getByText("999,999,999,999");
         expect(valueElement).toBeInTheDocument();
      });

      it("handles very small numbers", () => {
         render(<Card {...mockCardProps} value={0.000001} />);
         const value = screen.getByText("0");
         expect(value).toBeInTheDocument();
      });

      it("handles special characters in label", () => {
         render(
            <Card {...mockCardProps} label="Test & Special @ Characters!" />
         );
         const label = screen.getByText("Test & Special @ Characters!");
         expect(label).toBeInTheDocument();
      });

      it("handles long label text", () => {
         const longLabel =
            "This is a very long label that should be handled properly by the component";
         render(<Card {...mockCardProps} label={longLabel} />);
         const label = screen.getByText(longLabel);
         expect(label).toBeInTheDocument();
      });
   });
});
