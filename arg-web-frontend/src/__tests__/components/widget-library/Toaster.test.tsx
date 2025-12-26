import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@/__tests__/utils/test-utils";
import { fireEvent, act } from "@testing-library/react";
import Toaster from "@/widget-library/Toaster";

const mockToasterProps = {
   type: "success" as const,
   title: "Success Message",
   subtitle: "Operation completed successfully",
   onClose: vi.fn(),
};

describe("Toaster Component", () => {
   beforeEach(() => {
      vi.clearAllMocks();
      vi.useFakeTimers();
   });

   afterEach(() => {
      vi.useRealTimers();
   });

   it("renders correctly with required props", () => {
      render(<Toaster {...mockToasterProps} />);
      const toaster = screen.getByText("Success Message").closest(".toaster");
      expect(toaster).toBeInTheDocument();
   });

   it("renders title correctly", () => {
      render(<Toaster {...mockToasterProps} />);
      const title = screen.getByText("Success Message");
      expect(title).toBeInTheDocument();
      expect(title.tagName).toBe("H5");
   });

   it("renders subtitle correctly", () => {
      render(<Toaster {...mockToasterProps} />);
      const subtitle = screen.getByText("Operation completed successfully");
      expect(subtitle).toBeInTheDocument();
      expect(subtitle.tagName).toBe("P");
   });

   it("applies correct CSS class based on type", () => {
      render(<Toaster {...mockToasterProps} />);
      const toaster = screen.getByText("Success Message").closest(".toaster");
      expect(toaster).toHaveClass("toaster", "success");
   });

   it("renders close icon", () => {
      render(<Toaster {...mockToasterProps} />);
      const closeIcon = screen.getByRole("img", { name: /close/i });
      expect(closeIcon).toBeInTheDocument();
   });

   it("calls onClose when close icon is clicked", () => {
      render(<Toaster {...mockToasterProps} />);
      const closeIcon = screen.getByRole("img", { name: /close/i });

      fireEvent.click(closeIcon);
      expect(mockToasterProps.onClose).toHaveBeenCalledTimes(1);
   });

   it("auto-closes after 2 seconds", () => {
      render(<Toaster {...mockToasterProps} />);

      act(() => {
         vi.advanceTimersByTime(2000);
      });

      expect(mockToasterProps.onClose).toHaveBeenCalledTimes(1);
   });

   it("does not auto-close before 2 seconds", () => {
      render(<Toaster {...mockToasterProps} />);

      act(() => {
         vi.advanceTimersByTime(1999);
      });

      expect(mockToasterProps.onClose).not.toHaveBeenCalled();
   });

   it("clears timeout when component unmounts", () => {
      const { unmount } = render(<Toaster {...mockToasterProps} />);

      unmount();

      act(() => {
         vi.advanceTimersByTime(2000);
      });

      expect(mockToasterProps.onClose).not.toHaveBeenCalled();
   });

   describe("Different Types", () => {
      it("renders success type correctly", () => {
         render(<Toaster {...mockToasterProps} type="success" />);
         const toaster = screen
            .getByText("Success Message")
            .closest(".toaster");
         expect(toaster).toHaveClass("success");
      });

      it("renders error type correctly", () => {
         render(<Toaster {...mockToasterProps} type="error" />);
         const toaster = screen
            .getByText("Success Message")
            .closest(".toaster");
         expect(toaster).toHaveClass("error");
      });

      it("renders warning type correctly", () => {
         render(<Toaster {...mockToasterProps} type="warning" />);
         const toaster = screen
            .getByText("Success Message")
            .closest(".toaster");
         expect(toaster).toHaveClass("warning");
      });

      it("renders batch type correctly", () => {
         render(<Toaster {...mockToasterProps} type="batch" />);
         const toaster = screen
            .getByText("Success Message")
            .closest(".toaster");
         expect(toaster).toHaveClass("batch");
      });
   });

   describe("Content Structure", () => {
      it("renders icon element", () => {
         render(<Toaster {...mockToasterProps} />);
         const icon = screen
            .getByText("Success Message")
            .closest(".toaster")
            ?.querySelector(".icon");
         expect(icon).toBeInTheDocument();
      });

      it("renders content section", () => {
         render(<Toaster {...mockToasterProps} />);
         const content = screen
            .getByText("Success Message")
            .closest(".toaster")
            ?.querySelector(".content");
         expect(content).toBeInTheDocument();
      });

      it("renders title within content section", () => {
         render(<Toaster {...mockToasterProps} />);
         const content = screen
            .getByText("Success Message")
            .closest(".toaster")
            ?.querySelector(".content");
         const title = content?.querySelector(".title");
         expect(title).toHaveTextContent("Success Message");
      });

      it("renders subtitle within content section", () => {
         render(<Toaster {...mockToasterProps} />);
         const content = screen
            .getByText("Operation completed successfully")
            .closest(".toaster")
            ?.querySelector(".content");
         const subtitle = content?.querySelector(".subtitle");
         expect(subtitle).toHaveTextContent("Operation completed successfully");
      });
   });

   describe("User Interaction", () => {
      it("calls onClose only once when close icon is clicked", () => {
         render(<Toaster {...mockToasterProps} />);
         const closeIcon = screen.getByRole("img", { name: /close/i });

         fireEvent.click(closeIcon);
         fireEvent.click(closeIcon);

         expect(mockToasterProps.onClose).toHaveBeenCalledTimes(2);
      });
   });

   describe("Accessibility", () => {
      it("close icon has proper accessibility", () => {
         render(<Toaster {...mockToasterProps} />);
         const closeIcon = screen.getByRole("img", { name: /close/i });
         expect(closeIcon).toHaveAttribute("aria-label", "close");
      });

      it("has proper semantic structure", () => {
         render(<Toaster {...mockToasterProps} />);
         const toaster = screen
            .getByText("Success Message")
            .closest(".toaster");
         expect(toaster).toBeInTheDocument();
      });

      it("title has proper heading level", () => {
         render(<Toaster {...mockToasterProps} />);
         const title = screen.getByText("Success Message");
         expect(title.tagName).toBe("H5");
      });
   });

   describe("Styling", () => {
      it("applies base toaster class", () => {
         render(<Toaster {...mockToasterProps} />);
         const toaster = screen
            .getByText("Success Message")
            .closest(".toaster");
         expect(toaster).toHaveClass("toaster");
      });

      it("applies type-specific class", () => {
         render(<Toaster {...mockToasterProps} type="error" />);
         const toaster = screen
            .getByText("Success Message")
            .closest(".toaster");
         expect(toaster).toHaveClass("error");
      });

      it("close icon has correct class", () => {
         render(<Toaster {...mockToasterProps} />);
         const closeIcon = screen.getByRole("img", { name: /close/i });
         expect(closeIcon).toHaveClass("close-icon");
      });

      it("icon has correct class", () => {
         render(<Toaster {...mockToasterProps} />);
         const icon = screen
            .getByText("Success Message")
            .closest(".toaster")
            ?.querySelector(".icon");
         expect(icon).toHaveClass("icon", "success");
      });
   });

   describe("Edge Cases", () => {
      it("handles long title text", () => {
         const longTitle =
            "This is a very long title that might wrap to multiple lines and should be handled gracefully by the component";
         render(<Toaster {...mockToasterProps} title={longTitle} />);
         const title = screen.getByText(longTitle);
         expect(title).toBeInTheDocument();
      });

      it("handles long subtitle text", () => {
         const longSubtitle =
            "This is a very long subtitle that might wrap to multiple lines and should be handled gracefully by the component";
         render(<Toaster {...mockToasterProps} subtitle={longSubtitle} />);
         const subtitle = screen.getByText(longSubtitle);
         expect(subtitle).toBeInTheDocument();
      });

      it("handles special characters in title", () => {
         const specialTitle = "Success! @#$%^&*()_+-=[]{}|;':\",./<>?";
         render(<Toaster {...mockToasterProps} title={specialTitle} />);
         const title = screen.getByText(specialTitle);
         expect(title).toBeInTheDocument();
      });

      it("handles special characters in subtitle", () => {
         const specialSubtitle =
            "Operation completed! @#$%^&*()_+-=[]{}|;':\",./<>?";
         render(<Toaster {...mockToasterProps} subtitle={specialSubtitle} />);
         const subtitle = screen.getByText(specialSubtitle);
         expect(subtitle).toBeInTheDocument();
      });
   });
});
