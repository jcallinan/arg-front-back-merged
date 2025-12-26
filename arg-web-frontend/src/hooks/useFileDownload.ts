import { useState, useCallback } from "react";
import { message } from "antd";

export const useFileDownload = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  // Download file using fetch with exact same logic as used in components
  const downloadFile = useCallback(async (record: {
    filePath: string;
    fileName?: string;
    fileType?: string;
  }): Promise<boolean> => {
    if (!record.filePath) {
      message.warning("File path not available for download");
      return false;
    }

    try {
      setIsDownloading(true);
      
      // Exact same fetch logic as used in components
      const response = await fetch(record.filePath, { method: "GET" });

      if (!response.ok) {
        // Try to parse error response for more specific messages first
        try {
          const errorData = await response.json();
          if (errorData.message && errorData.statusCode) {
            throw new Error(errorData.message || "File download failed");
          }
        } catch (parseError) {
          // If we can't parse the error response, fall back to status-based error
        }

        // Handle specific error responses based on status code
        if (response.status === 404) {
          throw new Error("The requested file could not be found on the server");
        }

        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      
      // Determine appropriate file extension based on file type
      const defaultExtension = record.fileType === "excel" ? ".xls" : ".pdf";
      const fileName = record.fileName || `report${defaultExtension}`;
      link.download = fileName;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error("Download failed:", error);
      message.error(error instanceof Error ? error.message : "Failed to download file");
      return false;
    } finally {
      setIsDownloading(false);
    }
  }, []);

  // Download file for ReviewFiles component (slightly different logic)
  const downloadFileForReview = useCallback(async (record: {
    filePath: string;
    fileName?: string;
  }): Promise<boolean> => {
    if (!record.filePath) {
      console.warn("No file path available for download");
      return false;
    }

    try {
      setIsDownloading(true);
      
      // Fetch the file as blob to force download
      const response = await fetch(record.filePath);
      const blob = await response.blob();

      // Create object URL from blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link element for download
      const link = document.createElement("a");
      link.href = url;
      link.download = record.fileName || "file";

      // Force download for all file types (PDF, XLSX, TXT, etc.)
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the object URL
      window.URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error("Error downloading file:", error);
      
      // Fallback to direct link if fetch fails
      try {
        const link = document.createElement("a");
        link.href = record.filePath;
        link.download = record.fileName || "file";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return true;
      } catch (fallbackError) {
        console.error("Fallback download also failed:", fallbackError);
        return false;
      }
    } finally {
      setIsDownloading(false);
    }
  }, []);

  // Download file for ReportsTable component (exact same logic)
  const downloadFileForReportsTable = useCallback(async (record: {
    filePath: string;
    fileName?: string;
    fileType?: string;
  }): Promise<boolean> => {
    if (!record.filePath) {
      message.warning("File path not available for download");
      return false;
    }

    try {
      setIsDownloading(true);
      
      const response = await fetch(record.filePath, { method: "GET" });
      if (!response.ok) throw new Error("Network response was not ok");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      
      // Determine appropriate file extension based on file type
      const defaultExtension = record.fileType === "excel" ? ".xlsx" : ".pdf";
      // Clean fileName function would need to be imported or defined
      const fileName = record.fileName || `downloaded-report${defaultExtension}`;
      link.download = fileName;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error("Download failed:", error);
      message.error("Failed to download file");
      return false;
    } finally {
      setIsDownloading(false);
    }
  }, []);

  return {
    isDownloading,
    downloadFile,
    downloadFileForReview,
    downloadFileForReportsTable,
  };
};

export default useFileDownload;
