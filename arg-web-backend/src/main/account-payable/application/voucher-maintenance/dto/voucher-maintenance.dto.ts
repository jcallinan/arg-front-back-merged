import { ApiProperty } from "@nestjs/swagger";
import {
  IsOptional,
  IsNumber,
  IsString,
  IsEnum,
  Min,
  Max,
  Matches,
  MaxLength,
  IsNotEmpty,
} from "class-validator";
import { Transform, Type } from "class-transformer";
import {
  VoucherType,
  SortBy,
  SortOrder,
  VoucherMaintenanceStatusCode,
} from "@src/shared/constants/voucher-type.enum";

// Request DTO
export class GetVouchersDto {
  @ApiProperty({
    description: "Page number for pagination",
    example: 1,
    required: false,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: "Number of items per page",
    example: 500,
    required: false,
    minimum: 1,
    maximum: 500,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(500)
  limit?: number = 500;

  @ApiProperty({
    description: "Company number to filter by",
    example: 10,
    required: true,
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  companyNo!: number;

  @ApiProperty({
    description: "Vendor number to filter by",
    example: 12345,
    required: true,
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  vendorNo!: number;

  @ApiProperty({
    description: "Voucher type to filter by",
    enum: VoucherType,
    example: VoucherType.UNPAID,
    required: false,
  })
  @IsOptional()
  @IsEnum(VoucherType)
  voucherType?: VoucherType = VoucherType.UNPAID;

  @ApiProperty({
    description: "Invoice date to filter by (MMDDYY format)",
    example: "012524",
    required: false,
    pattern: "^\\d{6}$",
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{6}$/, {
    message: "Invoice date must be in MMDDYY format (6 digits)",
  })
  invoiceDate?: string;

  @ApiProperty({
    description: "Invoice number to filter by",
    example: "INV-2024-001",
    required: false,
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  @Transform(({ value }) => value?.trim())
  invoiceNo?: string;

  @ApiProperty({
    description: "Field to sort by",
    enum: SortBy,
    example: SortBy.INVOICE_DATE,
    required: false,
  })
  @IsOptional()
  @IsEnum(SortBy)
  sortBy?: SortBy = SortBy.INVOICE_DATE;

  @ApiProperty({
    description: "Sort order",
    enum: SortOrder,
    example: SortOrder.DESC,
    required: false,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.DESC;
}

// Response DTO
export class VoucherResponseDto {
  @ApiProperty({
    description: "Vendor name from APOPNV table",
    example: "ABC Supply Company",
  })
  vendorName!: string;

  @ApiProperty({
    description: "Company number",
    example: 10,
  })
  companyNo!: number;

  @ApiProperty({
    description: "Vendor number",
    example: 12345,
  })
  vendorNo!: number;

  @ApiProperty({
    description: "Voucher number",
    example: 67890,
  })
  voucherNo!: number;

  @ApiProperty({
    description: "Open payables amount (calculated from APOPNH)",
    example: 1500.75,
  })
  openPayables!: number;

  @ApiProperty({
    description: "Last paid amount from APOPNH.OPLPAM",
    example: 500.0,
    nullable: true,
  })
  lastPaidAmount!: number | null;

  @ApiProperty({
    description: "Last paid date from APOPNH.OPLPD8 (YYYYMMDD format)",
    example: "20240115",
    nullable: true,
  })
  lastPaidDate!: string | null;

  @ApiProperty({
    description: "Invoice number from APOPNH.OPINVN",
    example: "INV-2024-001",
  })
  invoiceNumber!: string;

  @ApiProperty({
    description:
      "Invoice date from APOPNH.OPINVD (MMDDYY format for unpaid) or APHSTH.OHINVD (MMDDYY format for paid)",
    example: "012524",
  })
  invoiceDate!: string;

  @ApiProperty({
    description: "Due date from APOPNH.OPDUE8 (YYYYMMDD format)",
    example: "20240131",
  })
  dueDate!: string;

  @ApiProperty({
    description: "Gross amount from APOPNH.OPGRAM",
    example: 1500.75,
  })
  grossAmount!: number;

  @ApiProperty({
    description: "Discount amount from APOPNH.OPDISC",
    example: 50.0,
  })
  discountAmount!: number;

  @ApiProperty({
    description: "Discount due date from APOPNH.OPDSDT (YYYYMMDD format)",
    example: "20240115",
    nullable: true,
  })
  discountDueDate!: string | null;

  @ApiProperty({
    description: "Partial paid to date from APOPNH.OPPPTD",
    example: 0.0,
  })
  partialPaidToDate!: number;

  @ApiProperty({
    description: "Invoice description from APOPNH.OPINDS",
    example: "Office supplies purchase",
  })
  invoiceDescription!: string;

  @ApiProperty({
    description: "Hold payment flag from APOPNH.OPHALT",
    example: "N",
  })
  holdPaymentFlag!: string;

  @ApiProperty({
    description: "Hold description from APOPNH.OPHDES (UNPAID) or APHSTH.OHHDES (PAID)",
    example: "Voucher placed on hold",
    nullable: true,
  })
  holdDescription!: string | null;

  @ApiProperty({
    description: "Prepaid voucher flag from APOPNH.OPPAID",
    example: "N",
  })
  prepaidFlag!: string;

  @ApiProperty({
    description: "Check number from APHSTH.OHCKNO (for PAID vouchers)",
    example: 123456,
    nullable: true,
  })
  checkNo!: number | null;

  @ApiProperty({
    description:
      "Paid date from APHSTH.OHKYMD (YYYYMMDD format, for PAID vouchers)",
    example: "20240115",
    nullable: true,
  })
  paidDate!: string | null;

  @ApiProperty({
    description: "Cancelled voucher flag from APHSTH.OHKCNL (for PAID vouchers)",
    example: "C",
    nullable: true,
  })
  cancelledVoucher!: string | null;

  @ApiProperty({
    description: "Vendor address line 1 from APOPNV.OPVAD1",
    example: "123 Main Street",
    nullable: true,
  })
  vendorAddress1!: string | null;

  @ApiProperty({
    description: "Vendor address line 2 from APOPNV.OPVAD2",
    example: "Suite 100",
    nullable: true,
  })
  vendorAddress2!: string | null;

  @ApiProperty({
    description: "Vendor address line 3 from APOPNV.OPVAD3",
    example: "Business District",
    nullable: true,
  })
  vendorAddress3!: string | null;

  @ApiProperty({
    description: "Vendor address line 4 from APOPNV.OPVAD4",
    example: "New York, NY 10001",
    nullable: true,
  })
  vendorAddress4!: string | null;

  @ApiProperty({
    description: "Voucher status (derived from payment status or cancellation status)",
    example: "UNPAID",
  })
  voucherStatus!: VoucherType;

  @ApiProperty({
    description: "Net amount (gross amount - discount amount)",
    example: 1450.75,
  })
  netAmount!: number;
}

export class GetVoucherSummaryDto {
  @ApiProperty({
    description: "Type of vouchers to retrieve",
    enum: VoucherType,
    required: true,
    example: VoucherType.UNPAID,
  })
  @IsEnum(VoucherType)
  @IsNotEmpty()
  voucherType!: VoucherType;

  @ApiProperty({
    description: "Company number",
    required: true,
    example: 10,
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  companyNo!: number;

  @ApiProperty({
    description: "Vendor number",
    required: true,
    example: 6675,
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  vendorNo!: number;
}

export class VoucherSummaryResponseDto {
  @ApiProperty({ description: "Vendor name" })
  vendorName!: string;

  @ApiProperty({ description: "Company number" })
  companyNo!: number;

  @ApiProperty({ description: "Vendor number" })
  vendorNo!: number;

  @ApiProperty({
    description: "Last paid amount",
    nullable: true,
  })
  lastPaidAmount!: number | null;

  @ApiProperty({
    description: "Last paid date (YYYYMMDD format)",
    nullable: true,
  })
  lastPaidDate!: string | null;

  @ApiProperty({
    description: "Open payables amount",
    nullable: true,
  })
  openPayables?: number;

  @ApiProperty({
    description: "Open payables date (for UNPAID vouchers)",
    nullable: true,
  })
  openPayablesDate?: string | null;

  @ApiProperty({
    description: "Voucher type",
    enum: VoucherType,
    example: VoucherType.ALL,
  })
  type!: VoucherType;
}

export class GetVoucherViewDto {
  @ApiProperty({
    description: "Voucher type to filter by",
    enum: VoucherType,
    example: VoucherType.PAID,
    required: true,
  })
  @IsEnum(VoucherType)
  @IsNotEmpty()
  voucherType!: VoucherType;

  @ApiProperty({
    description: "Company number",
    example: 10,
    required: true,
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  companyNo!: number;

  @ApiProperty({
    description: "Vendor number",
    example: 12345,
    required: true,
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  vendorNo!: number;

  @ApiProperty({
    description: "Voucher number",
    example: 67890,
    required: true,
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  voucherNo!: number;
}

export class GetVoucherViewByIdDto {
  @ApiProperty({
    description: "Voucher number",
    example: 67890,
    required: true,
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  voucherNo!: number;
}

export class GetVoucherViewQueryDto {
  @ApiProperty({
    description: "Voucher type to filter by",
    enum: VoucherType,
    example: VoucherType.PAID,
    required: true,
  })
  @IsEnum(VoucherType)
  @IsNotEmpty()
  voucherType!: VoucherType;

  @ApiProperty({
    description: "Company number",
    example: 10,
    required: true,
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  companyNo!: number;

  @ApiProperty({
    description: "Vendor number",
    example: 12345,
    required: true,
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  vendorNo!: number;
}

export class VoucherViewResponseDto {
  @ApiProperty({
    description: "Header information for the voucher",
  })
  headerItems!: {
    vendorName: string;
    companyNo: number;
    vendorNo: number;
    voucherNo: number;
    invoiceNumber: string;
    invoiceDate: string;
    dueDate: string;
    grossAmount: number;
    discountAmount: number;
    partialPaidToDate: number;
    invoiceDescription: string;
    voucherType: VoucherType;
    checkNo: number | null;
    paidDate: string | null;
    lastPaidAmount: number | null;
    lastPaidDate: string | null;
    discountDueDate: string | null;
    holdPaymentFlag: string;
    holdDescription: string | null;
    prepaidFlag: string;
    vendorAddress1: string | null;
    vendorAddress2: string | null;
    vendorAddress3: string | null;
    vendorAddress4: string | null;
    netAmount: number;
  };

  @ApiProperty({
    description: "Detail line items for the voucher",
    type: "array",
  })
  detailItems!: Array<{
    sequenceNo: number;
    detailType?: number;
    detail?: number;
    lineDescription: string;
    grossAmount: number;
    discountAmount: number;
    netAmount: number;
    partialPaidToDate: number;
    expenseGlAccount: number;
    expenseCompanyNo: number;
    lastPaidDate: string | null;
    purchaseJournalNo: string;
    inventoryItemNo: string;
    quantity: number;
    jobNo: string;
    jobExtraField: string;
    costCode: string;
    costType: string;
    jobCostQuantity: number;
    purchaseOrderNo: string;
    receiptNumber: number;
    poStatus: string;
    poLineSequenceNo: number;
    productAmount: number;
    freightAmount: number;
    poNumber: string;
  }>;
}

// POST API DTOs for voucher status update
export class UpdateVoucherStatusDto {
  @ApiProperty({
    description: "Company number",
    example: 10,
    required: true,
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  companyNo!: number;

  @ApiProperty({
    description: "Vendor number",
    example: 12345,
    required: true,
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  vendorNo!: number;

  @ApiProperty({
    description: "Voucher number",
    example: 67890,
    required: true,
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  voucherNo!: number;

  @ApiProperty({
    description: "Voucher maintenance status code for the voucher",
    enum: VoucherMaintenanceStatusCode,
    example: VoucherMaintenanceStatusCode.HOLD,
    required: true,
  })
  @IsEnum(VoucherMaintenanceStatusCode)
  @IsNotEmpty()
  statusCode!: VoucherMaintenanceStatusCode;

  @ApiProperty({
    description: "Status description for the voucher",
    example: "Voucher placed on hold for review",
    required: true,
    maxLength: 25,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(25, { message: "Status description must not exceed 25 characters" })
  @Transform(({ value }) => value?.trim())
  statusDescription!: string;
}

export class UpdateVoucherStatusResponseDto {
  @ApiProperty({
    description: "Success message",
    example: "Voucher status updated successfully",
  })
  message!: string;

  @ApiProperty({
    description: "Updated voucher information",
  })
  voucher!: {
    companyNo: number;
    vendorNo: number;
    voucherNo: number;
    statusCode: VoucherMaintenanceStatusCode;
    statusDescription: string;
    updatedAt: string;
  };
}

// POST API DTOs for updating discount due date and discount
export class UpdateDiscountDto {
  @ApiProperty({
    description: "Company number",
    example: 10,
    required: true,
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  companyNo!: number;

  @ApiProperty({
    description: "Vendor number",
    example: 12345,
    required: true,
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  vendorNo!: number;

  @ApiProperty({
    description: "Voucher number",
    example: 67890,
    required: true,
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  voucherNo!: number;

  @ApiProperty({
    description: "Discount due date (MMDDYY format)",
    example: "011524",
    required: true,
    pattern: "^\\d{6}$",
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{6}$/, {
    message: "Discount due date must be in MMDDYY format (6 digits)",
  })
  discountDueDate!: string;

  @ApiProperty({
    description: "Discount amount",
    example: 50.0,
    required: true,
    minimum: 0,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  discount!: number;
}

export class UpdateDiscountResponseDto {
  @ApiProperty({
    description: "Success message",
    example: "Discount information updated successfully",
  })
  message!: string;

  @ApiProperty({
    description: "Updated voucher discount information",
  })
  voucher!: {
    companyNo: number;
    vendorNo: number;
    voucherNo: number;
    discountDueDate: string;
    discount: number;
    updatedAt: string;
  };
}

// POST API DTOs for transferring vouchers to APTRANH/APTRAND
export class TransferVoucherDto {
  @ApiProperty({
    description: "Voucher type to transfer",
    enum: VoucherType,
    example: VoucherType.UNPAID,
    required: true,
  })
  @IsEnum(VoucherType)
  @IsNotEmpty()
  voucherType!: VoucherType;

  @ApiProperty({
    description: "Company number",
    example: 10,
    required: true,
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  companyNo!: number;

  @ApiProperty({
    description: "Vendor number",
    example: 12345,
    required: true,
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  vendorNo!: number;

  @ApiProperty({
    description: "Voucher number",
    example: 67890,
    required: true,
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  voucherNo!: number;
}

export class TransferVoucherResponseDto {
  @ApiProperty({
    description: "Success message",
    example: "Voucher transferred successfully to APTRANH/APTRAND",
  })
  message!: string;

  @ApiProperty({
    description: "Transferred voucher information",
  })
  voucher!: {
    companyNo: number;
    vendorNo: number;
    voucherNo: number;
    voucherType: VoucherType;
    sourceTable: string;
    targetTable: string;
    transferredAt: string;
    headerRecordId?: number;
    detailRecordIds?: number[];
  };
}
