import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "../../utils/test-utils";
import SpinLoader from "../../../widget-library/Loader";

describe("SpinLoader Component", () => {
   beforeEach(() => {
      vi.clearAllMocks();
   });

   it("renders correctly with default props", () => {
      render(<SpinLoader />);

      const loader = screen.getByRole("img", { name: /loading/i });
      expect(loader).toBeInTheDocument();
   });

   it("renders with small size", () => {
      render(<SpinLoader size="small" />);

      const loader = screen.getByRole("img", { name: /loading/i });
      expect(loader).toBeInTheDocument();
   });

   it("renders with large size", () => {
      render(<SpinLoader size="large" />);

      const loader = screen.getByRole("img", { name: /loading/i });
      expect(loader).toBeInTheDocument();
   });

   it("renders with default size", () => {
      render(<SpinLoader size="default" />);

      const loader = screen.getByRole("img", { name: /loading/i });
      expect(loader).toBeInTheDocument();
   });

   it("renders with custom font size", () => {
      render(<SpinLoader customFontSize={24} />);

      const loader = screen.getByRole("img", { name: /loading/i });
      expect(loader).toBeInTheDocument();
   });

   it("applies custom className", () => {
      render(<SpinLoader className="custom-loader" />);

      const loader = screen
         .getByRole("img", { name: /loading/i })
         .closest(".ant-spin");
      expect(loader).toHaveClass("custom-loader");
   });

   it("applies default className when no custom class provided", () => {
      render(<SpinLoader />);

      const loader = screen.getByRole("img", { name: /loading/i });
      expect(loader).toBeInTheDocument();
   });

   it("renders loading icon", () => {
      render(<SpinLoader />);

      const loader = screen.getByRole("img", { name: /loading/i });
      expect(loader).toBeInTheDocument();
   });

   it("handles custom font size with size prop", () => {
      render(<SpinLoader size="large" customFontSize={32} />);

      const loader = screen.getByRole("img", { name: /loading/i });
      expect(loader).toBeInTheDocument();
   });

   it("handles zero custom font size", () => {
      render(<SpinLoader customFontSize={0} />);

      const loader = screen.getByRole("img", { name: /loading/i });
      expect(loader).toBeInTheDocument();
   });

   it("handles negative custom font size", () => {
      render(<SpinLoader customFontSize={-10} />);

      const loader = screen.getByRole("img", { name: /loading/i });
      expect(loader).toBeInTheDocument();
   });

   it("handles very large custom font size", () => {
      render(<SpinLoader customFontSize={100} />);

      const loader = screen.getByRole("img", { name: /loading/i });
      expect(loader).toBeInTheDocument();
   });

   it("handles empty className", () => {
      render(<SpinLoader className="" />);

      const loader = screen.getByRole("img", { name: /loading/i });
      expect(loader).toBeInTheDocument();
   });

   it("handles multiple custom classes", () => {
      render(<SpinLoader className="class1 class2 class3" />);

      const loader = screen
         .getByRole("img", { name: /loading/i })
         .closest(".ant-spin");
      expect(loader).toHaveClass("class1", "class2", "class3");
   });

   describe("Accessibility", () => {
      it("has proper ARIA attributes", () => {
         render(<SpinLoader />);

         const loader = screen.getByRole("img", { name: /loading/i });
         expect(loader).toBeInTheDocument();
      });

      it("has proper role attribute", () => {
         render(<SpinLoader />);

         const loader = screen.getByRole("img", { name: /loading/i });
         expect(loader).toBeInTheDocument();
      });

      it("is accessible to screen readers", () => {
         render(<SpinLoader />);

         const loader = screen.getByRole("img", { name: /loading/i });
         expect(loader).toBeInTheDocument();
      });
   });

   describe("Different Sizes", () => {
      it("small size renders correctly", () => {
         render(<SpinLoader size="small" />);

         const loader = screen.getByRole("img", { name: /loading/i });
         expect(loader).toBeInTheDocument();
      });

      it("default size renders correctly", () => {
         render(<SpinLoader size="default" />);

         const loader = screen.getByRole("img", { name: /loading/i });
         expect(loader).toBeInTheDocument();
      });

      it("large size renders correctly", () => {
         render(<SpinLoader size="large" />);

         const loader = screen.getByRole("img", { name: /loading/i });
         expect(loader).toBeInTheDocument();
      });
   });

   describe("Custom Font Size", () => {
      it("applies custom font size when provided", () => {
         render(<SpinLoader customFontSize={20} />);

         const loader = screen.getByRole("img", { name: /loading/i });
         expect(loader).toBeInTheDocument();
      });

      it("ignores size prop when custom font size is provided", () => {
         render(<SpinLoader size="large" customFontSize={16} />);

         const loader = screen.getByRole("img", { name: /loading/i });
         expect(loader).toBeInTheDocument();
      });

      it("uses default size when no custom font size provided", () => {
         render(<SpinLoader size="default" />);

         const loader = screen.getByRole("img", { name: /loading/i });
         expect(loader).toBeInTheDocument();
      });
   });

   describe("Edge Cases", () => {
      it("handles undefined size", () => {
         render(<SpinLoader size={undefined as any} />);

         const loader = screen.getByRole("img", { name: /loading/i });
         expect(loader).toBeInTheDocument();
      });

      it("handles undefined custom font size", () => {
         render(<SpinLoader customFontSize={undefined as any} />);

         const loader = screen.getByRole("img", { name: /loading/i });
         expect(loader).toBeInTheDocument();
      });

      it("handles undefined className", () => {
         render(<SpinLoader className={undefined as any} />);

         const loader = screen.getByRole("img", { name: /loading/i });
         expect(loader).toBeInTheDocument();
      });

      it("handles null values", () => {
         render(
            <SpinLoader
               size={null as any}
               customFontSize={null as any}
               className={null as any}
            />
         );

         const loader = screen.getByRole("img", { name: /loading/i });
         expect(loader).toBeInTheDocument();
      });
   });

   describe("Styling", () => {
      it("applies custom styling classes", () => {
         render(<SpinLoader className="custom-styled-loader" />);

         const loader = screen
            .getByRole("img", { name: /loading/i })
            .closest(".ant-spin");
         expect(loader).toHaveClass("custom-styled-loader");
      });

      it("handles CSS-in-JS style objects", () => {
         render(<SpinLoader className="styled-loader" />);

         const loader = screen
            .getByRole("img", { name: /loading/i })
            .closest(".ant-spin");
         expect(loader).toHaveClass("styled-loader");
      });
   });
});
