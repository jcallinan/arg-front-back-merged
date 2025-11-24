import { ApiProperty } from '@nestjs/swagger';
import { BaseQueryDto } from "@src/shared/dto/base-query.dto";
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsNumber
} from "class-validator";

export class checkPaymentHistoryDto extends BaseQueryDto {
  @ApiProperty({ description: "Company Number", required: true })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  companyNo!: number;

  @ApiProperty({ description: "File Name", required: true })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  vendorNo!: number;

  @ApiProperty({ description: "Start Date", required: false })
  @IsOptional()
  @IsString()
  startDate?: string;


  @ApiProperty({ description: "Invoice No.", required: false })
  @IsOptional()
  // @Type(() => Number)
  invoiceNo?: string;

  @ApiProperty({ description: "Check No.", required: false })
  @IsOptional()
  @Type(() => Number)
  checkNo?: number;
}

export class BankGLNumberDto {
  @ApiProperty({ description: 'Vendor Name', example: 'ABBOTT GAS PRODUCTS' })
  vendorName!: string;

  @ApiProperty({ description: 'Check Date (Julian format)', example: 20116 })
  checkDate!: number;
}

export class CheckInquiryResponseDto {
  @ApiProperty({ description: 'Company Number', example: 10 })
  companyNo!: number;

  @ApiProperty({ description: 'Vendor Number', example: 1100 })
  vendorNo!: number;

  @ApiProperty({ description: 'Check Number', example: 0 })
  checkNo!: number;

  @ApiProperty({ description: 'Invoice Number', example: '461046' })
  invoiceNo!: string;

  @ApiProperty({ description: 'Invoice Description', example: 'REGULATOR' })
  invoiceDescription!: string;

  @ApiProperty({ description: 'Paid Amount', example: 0 })
  paidAmount!: number;

  @ApiProperty({ description: 'Gross Amount', example: 155.17 })
  grossAmount!: number;

  @ApiProperty({ description: 'Discount', example: 0 })
  discount!: number;

  @ApiProperty({ description: 'Bank GL Number', example: 11000001 })
  bankGLNo!: number;

  @ApiProperty({ description: 'Bank Status', example: 'To be Cleared' })
  bank_status!: string;

  @ApiProperty({
    description: 'Bank GL Info',
    type: () => BankGLNumberDto,
  })
  bankGLNumber!: BankGLNumberDto;
}


export class checkInquiryVoucherDetailDto {
  @ApiProperty({ description: "Company Number", required: true })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  companyNo!: number;

  @ApiProperty({ description: "File Name", required: true })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  vendorNo!: number;


  @ApiProperty({ description: "Voucher No", required: false })
  @IsOptional()
  @Type(() => Number)
  voucherNo!: number;

  @ApiProperty({ description: "Check No.", required: false })
  @IsOptional()
  @Type(() => Number)
  checkNo?: number;


  @ApiProperty({ description: "Invoice No.", required: false })
  @IsOptional()
  @IsString()
  invoiceNo?: string;

}

export class VendorDetailsDto {
  @ApiProperty({ description: 'Vendor Name', example: 'ABCOTT Consulting' })
  vendorName!: string;
}

export class DetailItemDto {
  @ApiProperty({ description: 'Detail Line Description', example: 'AIR, N, WHEELS, DISC' })
  detailLineDescription!: string;

  @ApiProperty({ description: 'Open/Closed Status', example: 'C' })
  openClosedStatus!: string;

  @ApiProperty({ description: 'PO Number', example: '' })
  poNumber!: string;

  @ApiProperty({ description: 'Detail Line Amount', example: 220.69 })
  detailLineAmount!: number;

  @ApiProperty({ description: 'Detail Line Discount', example: 0 })
  detailLineDiscount!: number;

  @ApiProperty({ description: 'Expense GL Account', example: 26100501 })
  expenseGLAccount!: number;

  @ApiProperty({ description: 'Quantity', example: 0 })
  quantity!: number;

  @ApiProperty({ description: 'Receipt Number', example: 0 })
  receiptNumber!: number;

  @ApiProperty({ description: 'Freight Amount', example: 0 })
  freightAmount!: number;
}

export class HeaderItemsDto {
  @ApiProperty({ description: 'Invoice Description', example: 'AIR, N, WHEELS, DISC' })
  invoiceDescription!: string;

  @ApiProperty({ description: 'Prepaid Voucher', example: '' })
  prepaidVoucher!: string;

  @ApiProperty({ description: 'Held Payment Voucher', example: '' })
  heldPaymentVoucher!: string;

  @ApiProperty({ description: 'Held Description', example: '' })
  heldDescription!: string;

  @ApiProperty({ description: 'Single Check', example: '' })
  singleCheck!: string;

  @ApiProperty({ description: 'Invoice Number', example: '234161' })
  invoiceNo!: string;

  @ApiProperty({ description: 'Gross Amount', example: 220.69 })
  grossAmount!: number;

  @ApiProperty({ description: 'Discount', example: 0 })
  discount!: number;

  @ApiProperty({ description: 'AP GL Account Number', example: 12010001 })
  apGLAccountNo!: number;

  @ApiProperty({ description: 'Discount Due Date', example: 0 })
  discountDueDate!: number;

  @ApiProperty({ description: 'Invoice Date', example: 82098 })
  invoiceDate!: number;

  @ApiProperty({ description: 'Due Date', example: 100498 })
  dueDate!: number;

  @ApiProperty({ description: 'Check Number', example: 50774 })
  checkNo!: number;

  @ApiProperty({ description: 'Bank GL Number', example: 11110001 })
  bankGLNo!: number;

  @ApiProperty({ description: 'Paid On', example: 19981001 })
  paidOn8!: number;

  @ApiProperty({ description: 'Freight Total', example: 0 })
  freightTotal!: number;

  @ApiProperty({ description: 'Sales Order Number', example: 0 })
  salesOrderNo!: number;

  @ApiProperty({ description: 'Sales SRN Number', example: 0 })
  salesSRNNo!: number;
}

export class VendorDetailDto {
  @ApiProperty({ description: 'Vendor Number', example: 1100 })
  vendorNo!: number;

  @ApiProperty({ description: 'Company Number', example: 10 })
  companyNo!: number;

  @ApiProperty({ description: 'Voucher Number', example: 16994 })
  voucherNo!: number;

  @ApiProperty({ description: 'Bank GL Number', example: 11110001 })
  bankGLNo!: number;

  @ApiProperty({ description: 'Check Number', example: 50774 })
  checkNo!: number;

  @ApiProperty({ type: VendorDetailsDto })
  vendorDetails!: VendorDetailsDto;
}


export class voucherDetailsResponseDto {
  @ApiProperty({ type: () => VendorDetailDto, required: false, nullable: true })
  vendorDetail!: Partial<VendorDetailDto> | null;

  @ApiProperty({ type: () => HeaderItemsDto, required: false, nullable: true })
  headerItems!: Partial<HeaderItemsDto> | null;

  @ApiProperty({
    type: () => DetailItemDto,
    isArray: true,
    required: false,
    default: [],
  })
  detailItems!: Partial<DetailItemDto>[] | [];
}
