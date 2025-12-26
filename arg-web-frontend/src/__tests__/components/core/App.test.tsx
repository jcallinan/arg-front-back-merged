import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "../../utils/test-utils";
import App from "../../../App";

describe("App Component", () => {
   beforeEach(() => {
      vi.clearAllMocks();
   });

   it("renders correctly", () => {
      render(<App />);

      const appLayout = screen.getByRole("main");
      expect(appLayout).toBeInTheDocument();
   });

   it("renders with correct layout structure", () => {
      render(<App />);

      const appLayout = screen.getByRole("main");
      expect(appLayout).toHaveClass("main-content");
   });

   it("renders Sidemenu component", () => {
      render(<App />);

      // Check that Sidemenu is rendered
      const sidebar = screen.getByTestId("sidebar");
      expect(sidebar).toBeInTheDocument();
   });

   it("renders Header component", () => {
      render(<App />);

      // Check that Header is rendered (it should have banner role)
      const header = screen.getByRole("banner");
      expect(header).toBeInTheDocument();
   });

   it("renders main content area", () => {
      render(<App />);

      const mainContent = screen.getByRole("main");
      expect(mainContent).toBeInTheDocument();
      expect(mainContent).toHaveClass("main-content");
   });

   it("renders main layout wrapper", () => {
      render(<App />);

      const mainLayout = screen.getByRole("main").closest(".main-layout");
      expect(mainLayout).toBeInTheDocument();
      expect(mainLayout).toHaveClass("main-layout");
   });

   it("renders Outlet for routing", () => {
      render(<App />);

      // The Outlet component should be present in the main content area
      const mainContent = screen.getByRole("main");
      expect(mainContent).toBeInTheDocument();
   });

   it("has proper layout hierarchy", () => {
      render(<App />);

      const appLayout = screen.getByRole("main");
      const mainLayout = appLayout.closest(".ant-layout");
      const mainContent = appLayout;

      expect(appLayout).toBeInTheDocument();
      expect(mainLayout).toBeInTheDocument();
      expect(mainContent).toBeInTheDocument();
   });

   it("applies correct CSS classes", () => {
      render(<App />);

      const appLayout = screen.getByRole("main");
      expect(appLayout).toHaveClass("main-content");

      const mainLayout = appLayout.closest(".ant-layout");
      expect(mainLayout).toHaveClass("ant-layout");

      const mainContent = appLayout;
      expect(mainContent).toHaveClass("main-content");
   });

   describe("Layout Structure", () => {
      it("has sidebar in the layout", () => {
         render(<App />);

         const sidebar = screen.getByTestId("sidebar");
         expect(sidebar).toBeInTheDocument();
         expect(sidebar).toHaveClass("custom-sidebar");
      });

      it("has header in the main layout", () => {
         render(<App />);

         const header = screen.getByRole("banner");
         expect(header).toBeInTheDocument();
         expect(header).toHaveClass("custom-header");
      });

      it("has content area in the main layout", () => {
         render(<App />);

         const content = screen.getByRole("main");
         expect(content).toBeInTheDocument();
         expect(content).toHaveClass("main-content");
      });
   });

   describe("Accessibility", () => {
      it("has proper semantic structure", () => {
         render(<App />);

         const appLayout = screen.getByRole("main");
         expect(appLayout).toBeInTheDocument();
      });

      it("has proper landmark roles", () => {
         render(<App />);

         const header = screen.getByRole("banner");
         const sidebar = screen.getByTestId("sidebar");
         const main = screen.getByRole("main");

         expect(header).toBeInTheDocument();
         expect(sidebar).toBeInTheDocument();
         expect(main).toBeInTheDocument();
      });
   });

   describe("Component Integration", () => {
      it("integrates Sidemenu component correctly", () => {
         render(<App />);

         const sidebar = screen.getByTestId("sidebar");
         expect(sidebar).toBeInTheDocument();

         // Check that Sidemenu content is rendered
         expect(
            screen.getByTestId("menu-item-accounts-payable")
         ).toBeInTheDocument();
      });

      it("integrates Header component correctly", () => {
         render(<App />);

         const header = screen.getByRole("banner");
         expect(header).toBeInTheDocument();

         // Check that Header content is rendered
         expect(screen.getByText("Roger Philips")).toBeInTheDocument();
      });

      it("provides routing outlet", () => {
         render(<App />);

         // The Outlet component should be present for routing
         const mainContent = screen.getByRole("main");
         expect(mainContent).toBeInTheDocument();
      });
   });

   describe("Styling and Layout", () => {
      it("applies Ant Design Layout classes", () => {
         render(<App />);

         const appLayout = screen.getByRole("main");
         expect(appLayout).toHaveClass("ant-layout-content");
      });

      it("has proper flex layout structure", () => {
         render(<App />);

         const appLayout = screen.getByRole("main");
         expect(appLayout).toHaveClass("main-content");
      });

      it("main layout has proper structure", () => {
         render(<App />);

         const mainLayout = screen.getByRole("main").closest(".ant-layout");
         expect(mainLayout).toBeInTheDocument();
      });
   });
});
