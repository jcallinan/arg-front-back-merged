import type { SkeletonProps, UploadFile } from "antd";
import type {
  SelectProps,
  TableColumnsType,
  TablePaginationConfig,
  TableProps,
} from "antd";
import type { RangePickerProps } from "antd/es/date-picker";

export type CommonButtonProps = {
  name: string;
  label: React.ReactNode;
  onClick: () => void | Promise<void>;
  className?: string;
  items?: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  preload?: Array<() => Promise<any>> | (() => Promise<any>);
};
export type WeekRangePickerProps = {
  name: string;
  label?: string;
  onChange?: RangePickerProps["onChange"];
};

export interface BaseSelectProps
  extends Omit<SelectProps<string>, "options" | "onChange"> {
  name: string;
  options: { label: string; value: string }[];
  value?: any;
  onChange: (value: any) => void;
  className?: string;
  onSearch?: (value: any) => void;
  size?: "small" | "middle" | "large";
  width?: number | string;
  placeholder?: string;
  disabled?: boolean;
  filterOption?: boolean;
  allowClear?: boolean;
}
export type CustomPrefixInputProps = {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  prefix?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  status?: "error" | "warning" | "";
  maxLength?: number;
  showCount?: boolean;
};
export type CustomScrollableTableProps<T> = {
  name?: string;
  columns: TableColumnsType<T>;
  dataSource: T[];
  scroll?: TableProps<T>["scroll"];
  pagination?: false | TablePaginationConfig;
};
export type CustomTextAreaProps = {
  name: string;
  className: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  disabled?: boolean;
};
export type CustomImageUploaderProps = {
  name: string;
  action: string;
  fileList: UploadFile[];
  onChange: (info: { fileList: UploadFile[] }) => void;
};
export type CustomSkeletonProps = SkeletonProps & {
  name?: string;
};

export type StyledButtonProps = CommonButtonProps & {
  backgroundColor?: string;
  color?: string;
  className?: string;
};
export interface VoucherEntry {
  processType: string;
  entryNo: number;
  invoiceNo: string;
  invoiceAmount: number;
  invoiceDate: number;
  dueDate: number;
  discountDueDate: number;
  holdDesc: string;
}

export interface VoucherModalData {
  vendorName: string;
  vendorNo: string | number;
  invoiceNo: string;
  invoiceDate: string;
  discountDueDate: string;
  dueDate: string;
  invoiceAmount: number;
  invoiceDesc: string;
  prepaidCode: string;
  singleCheck: string;
  freight: string;
  acctGL: string;
  bankGL: string;
  holdVoucher: string;
  holdDesc: string;
  salesOrder: string;
  srn: string;
  detailItems: {
    productAmount: number;
    lineDesc: string;
    lineGlNo: string;
    discountAmount: number;
    poNo: string;
    poLineNo: string;
    quantity: number;
    openClosed: string;
    freight: string;
    itemGallon: string;
    receipt: string;
    project: string;
    status: string;
  }[];
}

export type ToasterWidgetProps = {
  type: NotificationType;
  message: string;
  description: string;
  visible: boolean;

  onClose?: () => void;
};
export type NotificationType = "success" | "error";

export interface ExcelViewerProps {
  visible: boolean;
  onClose: () => void;
  fileName: string;
  filePath: string;
  onDownload: () => void;
}
