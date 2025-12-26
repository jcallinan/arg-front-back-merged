import React from "react";
import { Alert, Typography, Space } from "antd";
import {
   FileExcelOutlined,
   InfoCircleOutlined,
} from "@ant-design/icons";
import ModalContent from "./Modal";
import type { ExcelViewerProps } from "./widgetLibrary.types";

const { Title, Text } = Typography;

const ExcelViewer: React.FC<ExcelViewerProps> = ({
   visible,
   onClose,
   fileName,
   filePath,
   onDownload,
}) => {
   const modalActions = [
      {
         type: "custom" as const,
         name: "download",
         label: "Download Excel File",
         onClick: onDownload,
      },
      {
         type: "default" as const,
         name: "close",
         label: "Close",
         onClick: onClose,
      },
   ];

   const modalDescription = (
      <Space direction="vertical" style={{ width: "100%" }} size="large">
         <Alert
            message="Excel File Preview"
            description="Excel files cannot be previewed directly in the browser. Please download the file to view its contents in a spreadsheet application."
            type="info"
            icon={<InfoCircleOutlined />}
            showIcon
         />

         <div>
            <Title level={5}>File Information</Title>
            <div style={{ marginLeft: 16 }}>
               <Text strong>File Name: </Text>
               <Text>{fileName}</Text>
               <br />
               <Text strong>File Type: </Text>
               <Text>Excel Spreadsheet (.xlsx)</Text>
               <br />
               <Text strong>File Path: </Text>
               <Text type="secondary" style={{ fontSize: "12px" }}>
                  {filePath}
               </Text>
            </div>
         </div>

         <div>
            <Title level={5}>Recommended Actions</Title>
            <ul style={{ marginLeft: 16 }}>
               <li>Download the file to your computer</li>
               <li>
                  Open with Microsoft Excel, Google Sheets, or LibreOffice
                  Calc
               </li>
               <li>
                  For collaborative viewing, upload to Google Sheets or
                  Microsoft 365
               </li>
            </ul>
         </div>
      </Space>
   );

   return (
      <ModalContent
         title={
            <Space>
               <FileExcelOutlined style={{ color: "#52c41a" }} />
               <span>Excel File Viewer</span>
            </Space>
         }
         description={modalDescription}
         visible={visible}
         onCancel={onClose}
         actions={modalActions}
      />
   );
};

export default ExcelViewer;
