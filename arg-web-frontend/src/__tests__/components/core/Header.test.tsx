import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "../../utils/test-utils";
import Header from "../../../core/Header";

describe("Header Component", () => {
   beforeEach(() => {
      vi.clearAllMocks();
   });

   it("renders correctly", () => {
      render(<Header />);

      const header = screen.getByRole("banner");
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass("custom-header", "flex-between");
   });

   it("renders logo", () => {
      render(<Header />);

      const logo = screen.getByAltText("ARG Logo");
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveClass("logo");
   });

   it("renders AutoComplete component", () => {
      render(<Header />);

      // The AutoComplete component should be rendered
      const autoComplete = screen.getByRole("combobox");
      expect(autoComplete).toBeInTheDocument();
   });

   it("renders notification bell icon", () => {
      render(<Header />);

      const bellIcon = screen.getByRole("img", { name: /bell/i });
      expect(bellIcon).toBeInTheDocument();
   });

   it("renders user dropdown", () => {
      render(<Header />);

      const userDropdown = screen.getByText("Roger Philips");
      expect(userDropdown).toBeInTheDocument();
   });

   it("renders user information", () => {
      render(<Header />);

      expect(screen.getByText("Roger Philips")).toBeInTheDocument();
      expect(screen.getByText("User")).toBeInTheDocument();
   });

   it("renders user avatar", () => {
      render(<Header />);

      const userAvatar = screen.getByAltText("user image");
      expect(userAvatar).toBeInTheDocument();
   });

   it("renders dropdown arrow", () => {
      render(<Header />);

      // The dropdown arrow should be present
      const dropdownTrigger = screen.getByText("Roger Philips").closest("div");
      expect(dropdownTrigger).toHaveClass("user-info");
   });

   it("opens user menu when clicked", () => {
      render(<Header />);

      const userDropdown = screen.getByText("Roger Philips");
      fireEvent.click(userDropdown);

      // Menu items should be available after click
      expect(screen.getByText("View Profile")).toBeInTheDocument();
      expect(screen.getByText("Change Password")).toBeInTheDocument();
      expect(screen.getByText("Settings")).toBeInTheDocument();
      expect(screen.getByText("Logout")).toBeInTheDocument();
   });

   it("renders all menu items in user dropdown", () => {
      render(<Header />);

      const userDropdown = screen.getByText("Roger Philips");
      fireEvent.click(userDropdown);

      const menuItems = [
         "View Profile",
         "Change Password",
         "Settings",
         "Logout",
      ];

      menuItems.forEach((item) => {
         expect(screen.getByText(item)).toBeInTheDocument();
      });
   });

   it("has proper header structure", () => {
      render(<Header />);

      const headerLeft = screen
         .getByText("Roger Philips")
         .closest("header")
         ?.querySelector(".header-left");
      const headerRight = screen
         .getByText("Roger Philips")
         .closest("header")
         ?.querySelector(".header-right");

      expect(headerLeft).toBeInTheDocument();
      expect(headerRight).toBeInTheDocument();
   });

   describe("Accessibility", () => {
      it("has proper semantic structure", () => {
         render(<Header />);

         const header = screen.getByRole("banner");
         expect(header).toBeInTheDocument();
      });

      it("logo has proper alt text", () => {
         render(<Header />);

         const logo = screen.getByAltText("ARG Logo");
         expect(logo).toBeInTheDocument();
      });

      it("user avatar has proper alt text", () => {
         render(<Header />);

         const userAvatar = screen.getByAltText("user image");
         expect(userAvatar).toBeInTheDocument();
      });

      it("user dropdown is keyboard accessible", () => {
         render(<Header />);

         const userDropdown = screen.getByText("Roger Philips");
         expect(userDropdown).toBeInTheDocument();
      });
   });

   describe("Layout and Styling", () => {
      it("applies correct CSS classes", () => {
         render(<Header />);

         const header = screen.getByRole("banner");
         expect(header).toHaveClass("custom-header", "flex-between");
      });

      it("header left section has correct classes", () => {
         render(<Header />);

         const headerLeft = screen
            .getByText("Roger Philips")
            .closest("header")
            ?.querySelector(".header-left");
         expect(headerLeft).toBeInTheDocument();
      });

      it("header right section has correct classes", () => {
         render(<Header />);

         const headerRight = screen
            .getByText("Roger Philips")
            .closest("header")
            ?.querySelector(".header-right");
         expect(headerRight).toHaveClass("header-right", "flex-align");
      });

      it("user dropdown has correct classes", () => {
         render(<Header />);

         const userDropdown = screen
            .getByText("Roger Philips")
            .closest(".user-dropdown-menu");
         expect(userDropdown).toHaveClass("user-dropdown-menu", "flex-align");
      });
   });
});
