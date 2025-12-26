import React from "react";
import ModalContent from "@/widget-library/Modal";
import TableWidget from "@/widget-library/Table";
import type { ColumnType } from "antd/es/table";
import type { 
  UnprocessedRecord, 
  UnprocessedRecordsModalProps,
  ModalAction
} from "@/types/accounts-payable.types";
import errorIcon from "@/assets/icons/error-icon.svg";
import warningIcon from "@/assets/icons/warning-icon.svg";

// Transform data for table display
interface UnprocessedRecordDisplay extends UnprocessedRecord {
  key: string;
  errorType: string;
  status: string;
}

const UnprocessedRecordsModal: React.FC<UnprocessedRecordsModalProps> = ({
  visible,
  onClose,
  unprocessedItems
}) => {
  // Transform the data for display in the table
  const transformedData: UnprocessedRecordDisplay[] = unprocessedItems.map((item, index) => ({
    ...item,
    key: `${item.invoiceNo}_${item.ownerNo}_${index}`,
    errorType: item.error.code === "VENDOR_NOT_FOUND" ? "Vendor Not Found" : item.error.code,
    status: "error"
  }));

  // Table columns configuration
  const columns: ColumnType<UnprocessedRecordDisplay>[] = [
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 80,
      align: "center",
      render: (status: string) => (
        <img 
          src={status === "error" ? errorIcon : warningIcon} 
          alt={status}
          className="status-icon"
        />
      ),
    },
    {
      title: "Invoice No",
      dataIndex: "invoiceNo",
      key: "invoiceNo",
      width: 120,
      sorter: (a, b) => a.invoiceNo.localeCompare(b.invoiceNo),
    },
    {
      title: "Owner No",
      dataIndex: "ownerNo",
      key: "ownerNo",
      width: 100,
      sorter: (a, b) => a.ownerNo.localeCompare(b.ownerNo),
    },
    {
      title: "Error Type",
      dataIndex: "errorType",
      key: "errorType",
      width: 150,
    },
    {
      title: "Error Message",
      dataIndex: ["error", "message"],
      key: "errorMessage",
      ellipsis: true,
      render: (message: string) => (
        <span title={message} className="error-message">
          {message}
        </span>
      ),
    },
    {
      title: "Field",
      dataIndex: ["error", "field"],
      key: "errorField",
      width: 120,
      render: (field: string) => (
        <span className="field-name">
          {field}
        </span>
      ),
    },
  ];

  // Get unique error counts for summary
  const errorSummary = unprocessedItems.reduce((acc, item) => {
    const errorType = item.error.code;
    acc[errorType] = (acc[errorType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const footerActions: ModalAction[] = [
    {
      name: "close",
      label: "Close",
      onClick: onClose,
      type: "custom",
    },
  ];

  const modalContent = (
    <div className="unprocessed-modal-content">
      {/* Error Summary */}
      <div className="error-summary-container">
        <p className="error-summary-text">
          {unprocessedItems.length} record(s) could not be processed due to the following issues:
        </p>
        <ul className="error-list">
          {Object.entries(errorSummary).map(([errorType, count]) => (
            <li key={errorType} className="error-item">
              <strong>{count}</strong> {errorType.replace(/_/g, " ").toLowerCase()} error(s)
            </li>
          ))}
        </ul>
      </div>

      {/* Table */}
      <div className="table-responsive-container table-container">
        <TableWidget
          columns={columns}
          dataSource={transformedData}
          rowKey="key"
          pagination={false}
        />
      </div>

      {/* Instructions */}
      <div className="instructions-container">
        <p className="instructions-text">
          <strong>💡 Next Steps:</strong> Please verify and correct the excel data, then re-upload the file.
        </p>
      </div>
    </div>
  );

  return (
    <ModalContent
      title={
        <div className="flex-align gap-16 ">
          <img src={warningIcon} alt="Warning" className="warning-icon" />
          <span>Unprocessed Records Found</span>
        </div>
      }
      visible={visible}
      onCancel={onClose}
      className="unprocessed-records-modal"
      actions={footerActions}
      description={modalContent}
    />
  );
};

export default UnprocessedRecordsModal;
