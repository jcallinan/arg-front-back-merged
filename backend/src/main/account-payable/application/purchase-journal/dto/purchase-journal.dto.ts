import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { BaseQueryDto } from "@src/shared/dto/base-query.dto";
import {
  IsOptional,
  IsString,
  IsArray,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
  Matches,
  ArrayMinSize
} from "class-validator";

export class purchaseJournalReportDto extends BaseQueryDto {
  @ApiProperty({ description: "Report Type", required: false })
  @IsOptional()
  @IsString()
  reportType?: string | string[];

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

export class PurchaseJournalEntryDto {
  @ApiProperty({ description: "Invoice number", example: "123456" })
  @IsNotEmpty()
  @IsString()
  invoiceNo!: string;

  @ApiProperty({ description: "Company number", example: 10 })
  @IsNotEmpty()
  @IsNumber()
  companyNo!: number;

  @ApiProperty({ description: "Vendor number", example: 1001 })
  @IsNotEmpty()
  @IsNumber()
  vendorNo!: number;

  @ApiProperty({ description: "Entry number", example: 19042 })
  @IsNotEmpty()
  @IsNumber()
  entryNo!: number;
  
  @ApiProperty({ description: "Prepaid code", example: "P", required: false })
  @IsOptional()
  @IsString()
  prepaidCode?: string;

  @ApiProperty({ description: "Prepaid check number", example: "12345", required: false })
  @IsOptional()
  @IsString()
  prepaidCheckNo?: string;

  @ApiProperty({ description: "Bank GL number", example: 10000001, required: false })
  @IsOptional()
  @IsNumber()
  bankGl?: number;

  @ApiProperty({ description: "Invoice amount", example: 1000.50, required: false })
  @IsOptional()
  @IsNumber()
  invoiceAmount?: number;
}

export class SubmitPurchaseJournalDto {
  @ApiProperty({
    description: "List of voucher entries to post to purchase journal",
    type: [PurchaseJournalEntryDto],
  })
  @IsArray()
  @ArrayMinSize(1, { message: "entries must contain at least one item" })
  @ValidateNested({ each: true })
  @Type(() => PurchaseJournalEntryDto)
  entries!: PurchaseJournalEntryDto[];

  @ApiProperty({ description: "Company number", example: 10 })
  @IsNotEmpty()
  @IsNumber()
  companyNo!: number;

  @ApiProperty({
    description: "Purchase Journal Date (MMDDYY)",
    example: "070725",
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{6}$/, {
    message: "purchaseJD must be in YYMMDD format (e.g., '070725')",
  })
  purchaseJD!: string;

  @ApiProperty({
    description: "Key Cash Disbursement Journal Date (MMDDYY)",
    example: "000000",
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{6}$/, {
    message: "keyCashDJD must be in YYMMDD format (e.g., '070725')",
  })
  keyCashDJD!: string;
}

export class PrepaidValidationErrorDto {
  @ApiProperty({ description: "Entry number that has error" })
  entryNo!: number;

  @ApiProperty({ description: "Error message" })
  message!: string;

  @ApiProperty({ description: "Error code" })
  code!: string;
}

export class PrepaidValidationResponseDto {
  @ApiProperty({ description: "Whether validation passed" })
  isValid!: boolean;

  @ApiProperty({ description: "Array of entries with errors", type: [PrepaidValidationErrorDto] })
  errors!: PrepaidValidationErrorDto[];

  @ApiProperty({ description: "Array of successful entries", type: [PurchaseJournalEntryDto] })
  success!: PurchaseJournalEntryDto[];
}