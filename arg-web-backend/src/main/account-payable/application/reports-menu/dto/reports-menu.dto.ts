import { ApiProperty,  } from "@nestjs/swagger";
import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsNotEmpty, IsNumber, ValidateIf, Matches } from "class-validator";
import { BaseQueryDto } from "@src/shared/dto/base-query.dto";
import { REPORTS_MENU_TYPES } from "@src/shared/constants/constant";

export class ReportsMenuDto extends BaseQueryDto {
  @ApiProperty({
    description: "Report Type",
    required: false,
    example: "AP-Month-End-Vendor-Totals",
    type: String
  })
  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }) =>
    Array.isArray(value) ? value : value ? [value] : []
  )
  reportType?: string[];

  @ApiProperty({ description: "File Name", required: false })
  @IsOptional()
  @IsString()
  fileName?: string;

  @ApiProperty({ description: "Start Date", required: false })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiProperty({ description: "End Date", required: false })
  @IsOptional()
  @IsString()
  endDate?: string;
}

export class SubmitReportsMenuDto {
  @ApiProperty({
    description: "Report Type",
    required: true,
    example: "AP-Month-End-Vendor-Totals",
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  reportType!: string;

  @ApiProperty({
    description: "Company Number",
    required: true,
    example: 10,
  })
  @IsNotEmpty()
  @IsNumber()
  companyNo!: number;

  @ApiProperty({
    description: "Report Date (for AP-Month-End-Vendor-Totals)",
    required: false,
    example: "070725",
  })
  @ValidateIf((o) => o.reportType === REPORTS_MENU_TYPES.AP_Month_End_Vendor_Totals)
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{6}$/, {
    message: "reportDate must be in YYMMDD format (e.g., '070725')",
  })
  reportDate?: string;

  @ApiProperty({
    description: "Outstanding Check Date (for Outstanding-Check-Register)",
    required: false,
    example: "070725",
  })
  @ValidateIf((o) => o.reportType === REPORTS_MENU_TYPES.Outstanding_Check_Register)
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{6}$/, {
    message: "outstandingCheckDate must be in YYMMDD format (e.g., '070725')",
  })
  outstandingCheckDate?: string;
}
