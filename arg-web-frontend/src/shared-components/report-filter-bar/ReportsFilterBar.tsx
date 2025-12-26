import React from "react";
import ReportType from "@shared-components/report-type/ReportType";
import CustomRangePicker from "@shared-components/date-range/RangePicker";
import { CustomPrefixInput } from "@widget-library/Input";
import { CustomStyledButton } from "@widget-library/Buttons";
import { SyncOutlined } from "@ant-design/icons";
import { PURCHASE_JOURNAL } from "@constants/commonConstants";
import { Tooltip } from "antd";
import type { ApGlobalStates } from "@api/api-schema/api";
import type { Dayjs } from "dayjs";
import ActionPermissionGuard from "../permissions/ActionPermissionGuard";

interface ReportsFilterBarProps {
  reportType: string;
  type: ApGlobalStates.ProcessType.RequestParams["type"];
  fileName: string;
  dateRange?: [Dayjs | null, Dayjs | null] | null;
  onReportTypeChange: (value: string) => void;
  onFileNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDateRangeChange?: (dates: [Dayjs | null, Dayjs | null] | null) => void;
  onApply: () => void;
  onReset: () => void;
  applyActionId?: string;
}

const ReportsFilterBar: React.FC<ReportsFilterBarProps> = ({
  reportType,
  fileName,
  type,
  dateRange,
  onReportTypeChange,
  onFileNameChange,
  onDateRangeChange,
  onApply,
  onReset,
}) => {
  return (
    <div className="filter-bar">
      <CustomRangePicker 
        label="Report Date" 
        value={dateRange}
        onChange={onDateRangeChange}
      />
      <ReportType value={reportType} onChange={onReportTypeChange} type={type} />
      <div>
        <p className="sub-title">File Name</p>
        <CustomPrefixInput
          name="fileName"
          value={fileName}
          onChange={onFileNameChange}
          placeholder="Search"
          className="file-name-input"
        />
      </div>

      <ActionPermissionGuard
        actionId="purchase-journal.view"
        requireManage={false}
      >
        <CustomStyledButton
          name="applyFilters"
          label={PURCHASE_JOURNAL.applyFilter}
          onClick={onApply}
        />
      </ActionPermissionGuard>

      <Tooltip title="Reset" placement="bottom">
        <SyncOutlined onClick={onReset} className="action-icon" />
      </Tooltip>
    </div>
  );
};

export default ReportsFilterBar;