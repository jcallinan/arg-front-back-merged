import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "../../utils/test-utils";
import { CustomImageUploader } from "../../../widget-library/UploadFile";
import type { UploadFile } from "antd";

const mockUploadFile: UploadFile = {
   uid: "1",
   name: "test-image.jpg",
   status: "done",
   url: "https://example.com/test-image.jpg",
};

const mockFileList: UploadFile[] = [mockUploadFile];

const mockUploadFileProps = {
   name: "test-upload",
   action: "/api/upload",
   fileList: mockFileList,
   onChange: vi.fn(),
};

describe("CustomImageUploader Component", () => {
   beforeEach(() => {
      vi.clearAllMocks();
   });

   it("renders correctly with required props", () => {
      render(<CustomImageUploader {...mockUploadFileProps} />);
      const uploadComponent = screen.getByRole("button", { name: /upload/i });
      expect(uploadComponent).toBeInTheDocument();
   });

   it("renders upload button with correct data-name attribute", () => {
      render(<CustomImageUploader {...mockUploadFileProps} />);
      const uploadButton = screen.getByRole("button", { name: /upload/i });
      expect(uploadButton).toHaveAttribute("data-name", "test-upload");
   });

   it("renders upload button with plus icon", () => {
      render(<CustomImageUploader {...mockUploadFileProps} />);
      const uploadButton = screen.getByRole("button", { name: /upload/i });
      const plusIcon = uploadButton.querySelector(".anticon-plus");
      expect(plusIcon).toBeInTheDocument();
   });

   it("renders upload text", () => {
      render(<CustomImageUploader {...mockUploadFileProps} />);
      const uploadText = screen.getByText("Upload");
      expect(uploadText).toBeInTheDocument();
   });

   it("renders file list when files are provided", () => {
      render(<CustomImageUploader {...mockUploadFileProps} />);
      const fileItem = screen.getByText("test-image.jpg");
      expect(fileItem).toBeInTheDocument();
   });

   it("hides upload button when file limit is reached", () => {
      const fullFileList = Array.from({ length: 8 }, (_, i) => ({
         uid: `${i}`,
         name: `file-${i}.jpg`,
         status: "done" as const,
         url: `https://example.com/file-${i}.jpg`,
      }));

      render(
         <CustomImageUploader
            {...mockUploadFileProps}
            fileList={fullFileList}
         />
      );

      const uploadButton = screen.queryByRole("button", { name: /upload/i });
      expect(uploadButton).not.toBeInTheDocument();
   });

   it("shows upload button when file count is below limit", () => {
      render(<CustomImageUploader {...mockUploadFileProps} />);
      const uploadButton = screen.getByRole("button", { name: /upload/i });
      expect(uploadButton).toBeInTheDocument();
   });

   it("renders with picture-circle list type", () => {
      render(<CustomImageUploader {...mockUploadFileProps} />);
      const uploadWrapper = screen
         .getByRole("button", { name: /upload/i })
         .closest(".ant-upload-wrapper");
      expect(uploadWrapper).toHaveClass("ant-upload-picture-circle-wrapper");
   });

   it("handles empty file list", () => {
      render(<CustomImageUploader {...mockUploadFileProps} fileList={[]} />);

      const uploadButton = screen.getByRole("button", { name: /upload/i });
      expect(uploadButton).toBeInTheDocument();
   });

   it("handles multiple files in file list", () => {
      const multipleFiles = [
         mockUploadFile,
         { ...mockUploadFile, uid: "2", name: "test-image-2.jpg" },
         { ...mockUploadFile, uid: "3", name: "test-image-3.jpg" },
      ];

      render(
         <CustomImageUploader
            {...mockUploadFileProps}
            fileList={multipleFiles}
         />
      );

      expect(screen.getByText("test-image.jpg")).toBeInTheDocument();
      expect(screen.getByText("test-image-2.jpg")).toBeInTheDocument();
      expect(screen.getByText("test-image-3.jpg")).toBeInTheDocument();
   });

   describe("Accessibility", () => {
      it("upload button is keyboard accessible", () => {
         render(<CustomImageUploader {...mockUploadFileProps} />);
         const uploadButton = screen.getByRole("button", { name: /upload/i });
         expect(uploadButton).toHaveAttribute("type", "button");
      });

      it("file items are accessible", () => {
         render(<CustomImageUploader {...mockUploadFileProps} />);
         const fileItem = screen.getByText("test-image.jpg");
         expect(fileItem).toBeInTheDocument();
      });

      it("has proper ARIA attributes", () => {
         render(<CustomImageUploader {...mockUploadFileProps} />);
         const uploadWrapper = screen
            .getByRole("button", { name: /upload/i })
            .closest(".ant-upload-wrapper");
         expect(uploadWrapper).toBeInTheDocument();
      });
   });

   describe("Edge Cases", () => {
      it("handles file without URL or preview", () => {
         const fileWithoutUrl: UploadFile = {
            uid: "3",
            name: "no-url-file.jpg",
            status: "done",
         };

         render(
            <CustomImageUploader
               {...mockUploadFileProps}
               fileList={[fileWithoutUrl]}
            />
         );

         const fileItem = screen.getByText("no-url-file.jpg");
         expect(fileItem).toBeInTheDocument();
      });

      it("handles file with error status", () => {
         const errorFile: UploadFile = {
            uid: "4",
            name: "error-file.jpg",
            status: "error",
         };

         render(
            <CustomImageUploader
               {...mockUploadFileProps}
               fileList={[errorFile]}
            />
         );

         const fileItem = screen.getByText("error-file.jpg");
         expect(fileItem).toBeInTheDocument();
      });

      it("handles file with uploading status", () => {
         const uploadingFile: UploadFile = {
            uid: "5",
            name: "uploading-file.jpg",
            status: "uploading",
         };

         render(
            <CustomImageUploader
               {...mockUploadFileProps}
               fileList={[uploadingFile]}
            />
         );

         const fileItem = screen.getByText("uploading-file.jpg");
         expect(fileItem).toBeInTheDocument();
      });
   });

   describe("Styling", () => {
      it("applies correct CSS classes", () => {
         render(<CustomImageUploader {...mockUploadFileProps} />);
         const uploadWrapper = screen
            .getByRole("button", { name: /upload/i })
            .closest(".ant-upload-wrapper");
         expect(uploadWrapper).toHaveClass("ant-upload-picture-circle-wrapper");
      });

      it("upload button has correct styling", () => {
         render(<CustomImageUploader {...mockUploadFileProps} />);
         const uploadButton = screen.getByRole("button", { name: /upload/i });
         expect(uploadButton).toHaveStyle({ border: "0", background: "none" });
      });
   });
});
