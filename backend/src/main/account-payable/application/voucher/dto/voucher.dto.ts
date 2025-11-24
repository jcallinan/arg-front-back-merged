import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { VoucherHeader } from "@src/main/account-payable/domain/entities/voucher.entity";
import { BaseQueryDto } from "@src/shared/dto/base-query.dto";
import {
  IsOptional,
  IsString,
  IsNotEmpty,
  ValidateNested,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationOptions,
  registerDecorator,
  IsNumber,
  Max,
  Min,
  MaxLength,
  IsEnum,
  IsArray
} from "class-validator";
import { IsDeletedStatus, PROCESS_TYPE_ENUM } from "@src/shared/constants/constant";


@ValidatorConstraint({ name: "isNumberOrString", async: false })
export class IsNumberOrStringConstraint
  implements ValidatorConstraintInterface {
  validate(value: any) {
    return typeof value === "string" || typeof value === "number";
  }

  defaultMessage() {
    return "($value) must be a string or a number";
  }
}

export function IsNumberOrString(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsNumberOrStringConstraint,
    });
  };
}

export class GetVoucherDataDto {
  @ApiProperty({ description: "Company Number", example: "10" })
  @Type(() => Number)
  @IsNumber()
  companyNo!: number;

  @ApiProperty({
    description: "Vendor Number",
    example: "02339",
    required: false,
  })
  @IsOptional()
  @IsString()
  vendorNo?: number;
}

export class GetAllVendorsDto extends BaseQueryDto {
  @ApiProperty({ description: "Company number", required: true })
  @IsNotEmpty()
  @IsString()
  companyNo!: number;

  @ApiProperty({ description: "Include Deleted Vendor", required: false })
  @IsOptional()
  @IsString()
  includeIsDeleted?: string;
}

export class GetVendorByNoDto {
  @ApiProperty({ description: "Vendor number", required: true })
  @IsNotEmpty()
  @IsString()
  vendorNo!: number;

  @ApiProperty({ description: "Company number", required: true })
  @IsNotEmpty()
  @IsString()
  companyNo!: number;
}

export class GetHeadersDto extends BaseQueryDto {
  @ApiProperty({ description: "Company Number", example: 10, required: true })
  @IsNotEmpty()
  @IsString()
  companyNo!: number;

  @ApiProperty({
    description: "Vendor Number",
    example: 1001,
    required: false,
  })
  @IsOptional()
  @IsString()
  vendorNo?: number;

  @ApiProperty({
    description: "Entry Number",
    example: 81293,
    required: false,
  })
  @IsOptional()
  @IsString()
  entryNo?: number;

  @ApiProperty({ description: "Process Type", example: PROCESS_TYPE_ENUM.NORMAL, required: false })
  @IsOptional()
  @IsEnum(PROCESS_TYPE_ENUM)
  processType?: PROCESS_TYPE_ENUM;
}

export class GetFlexiHeadersDto extends BaseQueryDto {
  @ApiProperty({ description: "Company Number", example: 10, required: true })
  @IsNotEmpty()
  companyNo!: number;

  @ApiProperty({ description: "Vendor Number", example: 1001, required: false })
  @IsOptional()
  vendorNo?: number;

  @ApiProperty({ description: "Entry Number", example: 81293, required: false })
  @IsOptional()
  entryNo?: number;

  @ApiProperty({
    description: "Process Type (Only FLEXI allowed)",
    example: PROCESS_TYPE_ENUM.FLEXI,
    default: PROCESS_TYPE_ENUM.FLEXI,
    required: false,
  })
  @IsOptional()
  @IsEnum([PROCESS_TYPE_ENUM.FLEXI], {
    message: "processType must be FLEXI",
  })
  processType?: PROCESS_TYPE_ENUM.FLEXI;
}

export class GetSogasHeadersDto extends BaseQueryDto {
  @ApiProperty({ description: "Company Number", example: 10, required: true })
  @IsNotEmpty()
  companyNo!: number;

  @ApiProperty({ description: "Vendor Number", example: 1001, required: false })
  @IsOptional()
  vendorNo?: number;

  @ApiProperty({ description: "Entry Number", example: 81293, required: false })
  @IsOptional()
  entryNo?: number;

  @ApiProperty({
    description: "Process Type (Only SOGAS allowed)",
    example: PROCESS_TYPE_ENUM.SOGAS,
    default: PROCESS_TYPE_ENUM.SOGAS,
    required: false,
  })
  @IsOptional()
  @IsEnum([PROCESS_TYPE_ENUM.SOGAS], {
    message: "processType must be SOGAS",
  })
  processType?: PROCESS_TYPE_ENUM.SOGAS;
}

export class GetPaperHeadersDto extends BaseQueryDto {
  @ApiProperty({ description: "Company Number", example: 10, required: true })
  @IsNotEmpty()
  companyNo!: number;

  @ApiProperty({ description: "Vendor Number", example: 1001, required: false })
  @IsOptional()
  vendorNo?: number;

  @ApiProperty({ description: "Entry Number", example: 81293, required: false })
  @IsOptional()
  entryNo?: number;

  @ApiProperty({
    description: "Process Type (Only PAPER allowed)",
    example: PROCESS_TYPE_ENUM.PAPER,
    default: PROCESS_TYPE_ENUM.PAPER,
    required: false,
  })
  @IsOptional()
  @IsEnum([PROCESS_TYPE_ENUM.PAPER], {
    message: "processType must be PAPER",
  })
  processType?: PROCESS_TYPE_ENUM.PAPER;
}

export class GetLmsHeadersDto extends BaseQueryDto {
  @ApiProperty({ description: "Company Number", example: 10, required: true })
  @IsNotEmpty()
  companyNo!: number;

  @ApiProperty({ description: "Vendor Number", example: 1001, required: false })
  @IsOptional()
  vendorNo?: number;

  @ApiProperty({ description: "Entry Number", example: 81293, required: false })
  @IsOptional()
  entryNo?: number;

  @ApiProperty({
    description: "Process Type (Only LMS allowed)",
    example: PROCESS_TYPE_ENUM.ARGLMS,
    default: PROCESS_TYPE_ENUM.ARGLMS,
    required: false,
  })
  @IsOptional()
  @IsEnum([PROCESS_TYPE_ENUM.ARGLMS], {
    message: "processType must be LMS",
  })
  processType?: PROCESS_TYPE_ENUM.ARGLMS;
}
export interface VoucherHeaderResponse extends VoucherHeader {
  apGlDesc?: string;
  bankGlDesc?: string;
}

export interface ValidationError {
  field: string;
  error: string;
}


export class HeaderDto {
  @ApiProperty({ description: "Invoice Number", example: "22420" })
  @IsString()
  @IsOptional()
  isDeleted?: string;

  @ApiProperty({ description: "Company Number", required: false })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(99)
  companyNo!: number;

  @ApiProperty({ description: "Entry Number", required: false })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(99999)
  entryNo!: number;

  @ApiProperty({ description: "Entry Sequence", required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(999)
  entrySequence?: number;

  @ApiProperty({ description: "Vendor Number", required: false })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(99999)
  vendorNo!: number;

  @ApiProperty({ description: "Canceled Voucher", required: false })
  @IsOptional()
  @IsNumber()
  canceledVoucher?: number;

  @ApiProperty({ description: "AP GL Number", required: false })
  @IsNotEmpty()
  @IsNumber()
  @Min(10000000, { message: "apGlNo must be 8 digits" })
  @Max(99999999)
  apGlNo!: number;

  @ApiProperty({ description: "Invoice Description", required: false })
  @IsOptional()
  @IsString()
  invoiceDesc?: string;

  @ApiProperty({ description: "Invoice Date", required: false })
  @IsString()
  @IsNotEmpty()
  invoiceDate!: string;

  @ApiProperty({ description: "Due Date", required: false })
  @IsOptional()
  @IsString()
  dueDate?: string;

  @ApiProperty({ description: "Extended Invoice Date (YYYYMMDD format)", required: false })
  @IsOptional()
  @IsNumber()
  extendedInvoiceDate?: number;

  @ApiProperty({ description: "Extended Due Date (YYYYMMDD format)", required: false })
  @IsOptional()
  @IsNumber()
  extendedDueDate?: number;

  @ApiProperty({ description: "Single Check", required: false })
  @IsOptional()
  @IsString()
  singleCheck?: string;

  @ApiProperty({ description: "Hold Code", required: false })
  @IsOptional()
  @IsString()
  holdCode?: string;

  @ApiProperty({ description: "Hold Description", required: false })
  @IsOptional()
  @IsString()
  holdDesc?: string;

  @ApiProperty({ description: "Prepaid Code", required: false })
  @IsOptional()
  @IsString()
  prepaidCode?: string;

  @ApiProperty({ description: "Prepaid Check Number", required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(999999)
  prepaidCheckNo?: number;

  @ApiProperty({ description: "Vendor Name", required: false })
  @IsOptional()
  @IsString()
  vendorName?: string;

  @ApiProperty({ description: "Vendor Add1", required: false })
  @IsOptional()
  @IsString()
  vendorAdd1?: string;

  @ApiProperty({ description: "Vendor Add2", required: false })
  @IsOptional()
  @IsString()
  vendorAdd2?: string;

  @ApiProperty({ description: "Vendor Add3", required: false })
  @IsOptional()
  @IsString()
  vendorAdd3?: string;

  @ApiProperty({ description: "Vendor Add4", required: false })
  @IsOptional()
  @IsString()
  vendorAdd4?: string;

  @ApiProperty({ description: "Bank GL", required: false })
  @IsNotEmpty()
  @IsNumber()
  @Min(10000000, { message: "bankGl must be 8 digits" })
  @Max(99999999)
  bankGl!: number;

  @ApiProperty({ description: "Invoice Amount", required: false })
  @IsNumber()
  @IsNotEmpty()
  @Max(999999999.99)
  @Min(-999999999.99, { message: 'TOTAL INVOICE AMOUNT MUST BE BETWEEN -999,999,999.99 AND 999,999,999.99' })
  invoiceAmount!: number;

  @ApiProperty({ description: "Retention GL", required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(99999999)
  retentionGl?: number;

  @ApiProperty({ description: "Retention Pct", required: false })
  @IsOptional()
  @IsNumber()
  retentionPct?: number;

  @ApiProperty({ description: "Prepaid Check Date", required: false })
  @IsOptional()
  @IsString()
  prepaidCheckdate?: string;

  @ApiProperty({ description: "Total Freight", required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(9999999.99)
  totalFreight?: number;

  @ApiProperty({ description: "Sales Order No", required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(999999)
  salesOrderNo?: number;

  @ApiProperty({ description: "SRN", required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(999)
  srn?: number;

  @ApiProperty({ description: "Carrier Id", required: false })
  @IsOptional()
  @IsString()
  carrierId?: string;

  @ApiProperty({ description: "Vendor Payment Terms", required: false })
  @IsOptional()
  @IsNumber()
  vendorPaymentTerms?: number;

  @ApiProperty({ description: "Process Type", required: false })
  @IsNotEmpty()
  @IsString()
  processType!: string;

  @ApiProperty({ description: "Discount Due Date", required: false })
  @IsOptional()
  @IsString()
  discountDueDate?: string;

  @ApiProperty({ description: "Extended Discount Due Date", example: "22420" })
  @IsOptional()
  @IsString()
  extendedDiscountDueDate?: string;

  @ApiProperty({ description: "Invoice Number", example: "22420" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20, { message: "Invoice number must be a string at most 20 characters long" })
  invoiceNo!: string;

  @ApiProperty({ description: "Status Code (1=S,2=E,3=W,4=P)", required: false, example: 'S' })
  @IsOptional()
  @IsString()
  status?: string;
}
export class DetailDto {
  @ApiProperty({ description: "Is Deleted", enum: IsDeletedStatus, required: false })
  @IsOptional()
  @IsString()
  isDeleted?: IsDeletedStatus;

  @ApiProperty({ description: "Company Number" })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(99)
  companyNo!: number;

  @ApiProperty({ description: "Entry Number" })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(99999)
  entryNo?: number;

  @ApiProperty({ description: "Entry Sequence" })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(999)
  entrySequence?: number;

  @ApiProperty({ description: "Vendor Number" })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(99999)
  vendorNo?: number;

  @ApiProperty({ description: "Line Company Number" })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(99)
  lineCompanyNo?: number;

  @ApiProperty({ description: "Line GL Number" })
  @IsNumber()
  @IsNotEmpty()
  @Min(10000000, { message: "lineGlNo must be 8 digits" })
  @Max(99999999)
  lineGlNo!: number;

  @ApiProperty({ description: "Line Description" })
  @IsOptional()
  @IsString()
  lineDesc?: string;

  @ApiProperty({ description: "Line Amount" })
  @IsOptional()
  @IsNumber()
  @Max(999999999.99)
  lineAmount?: number;

  @ApiProperty({ description: "Discount Amount" })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(999999999.99)
  discountAmount?: number;

  @ApiProperty({ description: "Discount Percentage" })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(99.999)
  discountPercentage?: number;

  @ApiProperty({ description: "Inventory Item" })
  @IsOptional()
  @IsString()
  inventoryItem?: string;

  @ApiProperty({ description: "Quantity" })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(99999999999)
  quantity?: number;

  @ApiProperty({ description: "Job Number" })
  @IsOptional()
  @IsString()
  jobNo?: string;

  @ApiProperty({ description: "Job Cost Code" })
  @IsOptional()
  @IsString()
  jobCostCode?: string;

  @ApiProperty({ description: "Job Cost Type" })
  @IsOptional()
  @IsString()
  jobCostType?: string;

  @ApiProperty({ description: "Job Cost Quantity" })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(9999999.99)
  jobCostQuantity?: number;

  @ApiProperty({ description: "Gallons" })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(9999999)
  gallons?: number;

  @ApiProperty({ description: "Receipt Number" })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(9999999)
  receiptNo?: number;

  @ApiProperty({ description: "Open/Closed" })
  @IsOptional()
  @IsString()
  openClosed?: string;

  @ApiProperty({ description: "PO Line Number" })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(999)
  poLineNo?: number;

  @ApiProperty({ description: "Product Amount" })
  @IsNumber()
  @IsNotEmpty()
  @Max(999999999.99)
  // @Min(0.01, { message: 'PRODUCT AMOUNT MAY NOT BE ZERO' })
  @Min(-99999999.99)//  { message: 'PRODUCT AMOUNT MAY NOT BE ZERO' }
  productAmount!: number;

  @ApiProperty({ description: "Freight Amount" })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(9999999.99)
  freightAmount?: number;

  @ApiProperty({ description: "PO Number" })
  @IsOptional()
  @IsString()
  poNo?: string;

  @ApiProperty({ description: "Status Code (1=S,2=E,3=W,4=P)", required: false, example: 'S' })
  @IsOptional()
  @IsString()
  status?: string;
}

export class SubmitVoucherDto {
  @ApiProperty({ type: HeaderDto })
  @ValidateNested()
  @Type(() => HeaderDto)
  header!: HeaderDto;

  @ApiProperty({ type: [DetailDto] })
  @ValidateNested({ each: true })
  @Type(() => DetailDto)
  details!: DetailDto[];
}

export class VoucherConfigCompanyDto {
  // Define properties as needed, or use @ApiProperty({ type: Object }) for dynamic
}

export class VoucherConfigVendorDto {
  // Define properties as needed, or use @ApiProperty({ type: Object }) for dynamic
}

export class VoucherConfigResponseDto {
  @ApiProperty({ type: VoucherConfigCompanyDto })
  company!: any;

  @ApiProperty({ type: Object })
  vendor!: any;

  @ApiProperty({ description: "General System Record", example: "2%" })
  lineDiscountPercentage!: string;
}

export class SoftDeleteVoucherDto {
  @ApiProperty({ description: "Entry number", required: true })
  @IsNotEmpty()
  @IsNumber()
  entryNo!: number;

  @ApiProperty({ description: "Company number", required: true })
  @IsNotEmpty()
  @IsNumber()
  companyNo!: number;

  @ApiProperty({ description: "Vendor number", required: true })
  @IsNotEmpty()
  @IsNumber()
  vendorNo!: number;

  @ApiProperty({ description: "Invoice number", required: true })
  @IsNotEmpty()
  @IsString()
  invoiceNo!: string;
}

export class HardDeleteVoucherDto {
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
}

export class GetGlMasterDto {
  @ApiProperty({ description: "Company Number", example: 10 })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  companyNo!: number;

  @ApiProperty({
    description: "GL Account Number (8 digits: first 6 digits are account number, last 2 digits are sub-account number)",
    example: 12010001
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @Min(10000000)
  @Max(99999999)
  glNo!: number;
}

export class VoucherEntryResponseDto {
  @ApiProperty({ description: "Process Type", example: PROCESS_TYPE_ENUM.NORMAL })
  processType!: PROCESS_TYPE_ENUM;
  @ApiProperty({ description: "Entry Number", example: 41741 })
  entryNo!: number;
  @ApiProperty({ description: "Invoice Number", example: "ABC123" })
  invoiceNo!: string;
  @ApiProperty({ description: "Invoice Amount", example: 2443500 })
  invoiceAmount!: number;
  @ApiProperty({ description: "Invoice Date", example: "02/22/04" })
  invoiceDate!: string;
  @ApiProperty({ description: "Due Date", example: "02/22/04" })
  dueDate!: string;
  @ApiProperty({ description: "Discount Due Date", example: "02/22/04" })
  discountDueDate!: string;
  @ApiProperty({ description: "Hold Description", example: "123" })
  holdDesc!: string;
  @ApiProperty({ description: "Company Number", example: 10 })
  companyNo!: number;
  @ApiProperty({ description: "Vendor Number", example: 1001 })
  vendorNo!: number;
  @ApiProperty({ description: "Vendor Name", example: "ABSG CONSULTING" })
  vendorName!: string;
}

export class paperEntryResponseDto {
  @ApiProperty({ description: "Invoice Number", example: "ABC123" })
  invoiceNo!: string;
  @ApiProperty({ description: "Invoice Date", example: "02/22/04" })
  invoiceDate!: string;
  @ApiProperty({ description: "Invoice Amount", example: 2443500 })
  invoiceAmount!: number;
  @ApiProperty({ description: "Discount Due Date", example: "02/22/04" })
  discountDueDate!: string;
  @ApiProperty({ description: "Vendor Name", example: "ABSG CONSULTING" })
  vendorName!: string;
  @ApiProperty({ description: "Vendor Number", example: 1001 })
  vendorNo!: number;
  @ApiProperty({ description: "Order Number", example: 101010 })
  salesOrderNo!: number;
  @ApiProperty({ description: "Company Number", example: 10 })
  companyNo!: number;
  @ApiProperty({ description: "Process Type", example: PROCESS_TYPE_ENUM.NORMAL })
  processType!: PROCESS_TYPE_ENUM;
}
export class VoucherSummaryQueryDto {
  @ApiProperty({ description: 'Company Number', example: 10 })
  @Type(() => Number)
  @IsNumber()
  companyNo!: number;

  @ApiProperty({ description: 'Process Type', enum: PROCESS_TYPE_ENUM })
  @IsEnum(PROCESS_TYPE_ENUM)
  processType!: PROCESS_TYPE_ENUM;
}

export class VoucherSummaryResponseDto {
  totalAmount!: string;
  countE!: number;
  countW!: number;
  countS!: number;
  totalUploads!: number;
}

export class CarrierInvoiceResponseDto {
  @ApiProperty({ description: "Carrier ID", example: "APPA" })
  carrierId!: string;

  @ApiProperty({ description: "Carrier Invoice Number", example: "24601" })
  carrierInvoiceNo!: string;

  @ApiProperty({ description: "Order Ship Date", example: "2025-04-29" })
  ordShipDate!: string;

  @ApiProperty({ description: "Invoice Type", example: "P" })
  invoiceType!: string;

  @ApiProperty({ description: "Our Order Number", example: 363822 })
  ourOrderNo!: number;

  @ApiProperty({ description: "Shipping Reference Number", example: 1 })
  shippingReferenceNo!: number;

  @ApiProperty({ description: "Invoice Amount", example: 1373.50 })
  invoiceAmount!: number;

  @ApiProperty({ description: "Invoice Date", example: "04/29/25" })
  invoiceDate?: number;
}

export class GetCarrierInvoicesDto extends BaseQueryDto {
  @ApiProperty({ description: "Company Number", example: 10, required: true })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  companyNo!: number;


  @ApiProperty({ description: "Process Type", example: PROCESS_TYPE_ENUM.NORMAL, required: false })
  @IsNotEmpty()
  @IsString()
  processType?: PROCESS_TYPE_ENUM;


  @ApiProperty({ description: "Invoice Type", example: PROCESS_TYPE_ENUM.NORMAL, required: false })
  @IsOptional()
  @IsString()
  invoiceType?: string;
}

export class InvoiceDto {
  @IsString()
  carrierId!: string;

  @IsString()
  carrierInvoiceNo!: string;

  @IsString()
  ordShipDate!: string;

  @IsString()
  invoiceType!: string;

  @IsNumber()
  ourOrderNo!: number;

  @IsNumber()
  shippingReferenceNo!: number;

  @IsNumber()
  invoiceAmount!: number;

  @ApiProperty({ description: "Company Number", example: 10, required: true })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  companyNo!: number;

  @ApiProperty({ description: "Invoice Date", example: "04/29/25" })
  @IsString()
  @IsNotEmpty()
  invoiceDate!: string;
}

export class CreateBatchRequestDto {
  @ApiProperty({
    description: 'Array of paper invoices to be processed in the batch',
    required: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceDto)
  invoices!: InvoiceDto[];
}


export class PaperBatchCreateResponseDto {
  @ApiProperty({ example: 'Paper batch create accepted, split into 2 batches' })
  message!: string;

  @ApiProperty({ example: 'P-1712345678901-uuid' })
  batchId!: string;

  @ApiProperty({ example: 10 })
  totalGroups!: number;

  @ApiProperty({ example: 2 })
  totalBatches!: number;

  @ApiProperty({ example: 'job-id-1' })
  parentJobId!: string;

  @ApiProperty({ example: ['job-id-2', 'job-id-3'] })
  childJobIds!: string[];

  @ApiProperty({
    type: [Object],
    description: 'Optional group metadata per batch',
  })
  groups: object[] = [];
}

export class SalesDto {
  @ApiProperty({ description: "Company Number", example: 10, required: true })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  companyNo!: number;


  @ApiProperty({ description: "Order No", example: 10, required: true })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  orderNo!: number;

  @ApiProperty({ description: "Shipment Reference", example: 10, required: true })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  shippingReferenceNo!: number;


  @ApiProperty({ description: "Invoice Date", example: "", required: true })
  @IsNotEmpty()
  @IsOptional()
  invoiceDate!: string;
}

export class containerUomConversionDto {
  @ApiProperty({ description: "Company Number", example: 10, required: true })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  companyNo!: number;


  @ApiProperty({ description: "Product Code", example: "", required: true })
  @IsNotEmpty()
  @IsString()
  ProductCode!: string;

  @ApiProperty({ description: "Container Code", example: 10, required: true })
  @IsNotEmpty()
  @IsString()
  containerCode!: string;


  @ApiProperty({ description: "Unit of Measure", example: "", required: true })
  @IsNotEmpty()
  @IsString()
  UnitOfMeasure!: string;
}

export class SoftDeleteVoucherDetailDto {
  @ApiProperty({
    description: "Company number",
    example: 10,
    required: true
  })
  @IsNotEmpty()
  @IsNumber()
  companyNo!: number;

  @ApiProperty({
    description: "Vendor number",
    example: 1001,
    required: true
  })
  @IsNotEmpty()
  @IsNumber()
  vendorNo!: number;

  @ApiProperty({
    description: "Entry number",
    example: 12345,
    required: true
  })
  @IsNotEmpty()
  @IsNumber()
  entryNo!: number;

  @ApiProperty({
    description: "Entry sequence number",
    example: 1,
    required: true
  })
  @IsNotEmpty()
  @IsNumber()
  entrySequenceNo!: number;
}


export class GetCalculatedDueDatesDto {
  @ApiProperty({ description: "Company Number", example: 10 })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  companyNo!: number;

  @ApiProperty({
    description: "Vendor number",
    example: 1001,
    required: true
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  vendorNo!: number;

  @ApiProperty({ description: "Invoice Date", example: "101525" })
  @IsNotEmpty()
  @IsString()
  invoiceDate!: string;
}
