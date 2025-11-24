import { ApiProperty } from "@nestjs/swagger";
import {
  PAYMENT_OPERATION_MODE_VALUES,
  PAYMENT_VOUCHER_TYPE_VALUES,
  PAYMENT_VOUCHER_TYPES,
  PaymentOperationMode,
} from "@src/shared/constants/payment-constant";
import {
  IsNotEmpty,
  IsIn,
  IsString,
  IsNumber,
  ValidateNested,
  IsOptional,
} from "class-validator";
import { Transform, Type } from "class-transformer";
import { PaymentVoucherType } from "@src/shared/constants/payment-constant";
import {
  FORCED_DISCOUNT_VALUES,
  ForcedDiscount,
  PAY_OR_HOLD_CODES,
  SingleCheckFlag,
  MakePrepaidFlag,
} from "@src/shared/constants/payment-constant";
import { BaseQueryDto } from "@src/shared/dto/base-query.dto";
import { PAYMENT_REPORT_TYPES } from "@src/shared/constants/constant";

export class SubmitPaymentSelectionTypeDto {
  @ApiProperty({
    description: "Company Number",
    required: true,
    example: 10,
  })
  @IsNotEmpty()
  @IsNumber()
  companyNo!: number;

  @ApiProperty({
    description: "Voucher Type (Check, ACH, Wire)",
    required: true,
    example: "Check",
    enum: PAYMENT_VOUCHER_TYPE_VALUES,
  })
  @IsIn(PAYMENT_VOUCHER_TYPE_VALUES)
  voucherToPay!: PaymentVoucherType;

  @ApiProperty({
    description: "Starting Check Number",
    required: true,
    example: "100001",
  })
  @IsNotEmpty()
  @IsNumber()
  startingCheckNo!: number;

  @ApiProperty({
    description: "Check Date (MMDDYY)",
    required: true,
    example: "080125",
  })
  @IsNotEmpty()
  @IsString()
  checkDate!: string;

  @ApiProperty({
    description: "Date to Pay By (MMDDYY)",
    required: true,
    example: "080225",
  })
  @IsString()
  dateToPayBy!: string;

  @ApiProperty({
    description: "Bank Account GL Number",
    required: true,
    example: "113100",
  })
  @IsNotEmpty()
  @IsNumber()
  bankAccountGl!: number;

  @IsIn([FORCED_DISCOUNT_VALUES.YES, FORCED_DISCOUNT_VALUES.NO])
  @ApiProperty({
    description: "Forced Discount",
    required: true,
    enum: [FORCED_DISCOUNT_VALUES.YES, FORCED_DISCOUNT_VALUES.NO],
    example: FORCED_DISCOUNT_VALUES.YES,
  })
  forcedDiscount!: ForcedDiscount;

  @ApiProperty({
    description: "Mode of Operation (save/edit)",
    required: true,
    example: "save",
    enum: PAYMENT_OPERATION_MODE_VALUES,
  })
  @IsIn(PAYMENT_OPERATION_MODE_VALUES)
  mode!: PaymentOperationMode;
}

export class SubmitPaymentSelectionTypeOutputDto {
  @ApiProperty({
    description: "Error or status message returned by SP",
    example: "File GAPPT** created successfully",
  })
  errVar!: string;
}

export class SubmitPaymentSelectionTypeResultDto {
  @ApiProperty({
    description: "Execution mode",
    example: "I",
  })
  mode!: string;

  @ApiProperty({
    description: "Stored Procedure name",
    example: "AP150ACLPRC",
  })
  spName!: string;

  @ApiProperty({
    type: SubmitPaymentSelectionTypeOutputDto,
    description: "Output payload from stored procedure",
  })
  output!: SubmitPaymentSelectionTypeOutputDto;
}

export class SubmitPaymentSelectionTypeResponseWrapperDto {
  @ApiProperty({
    description: "Confirmation message",
    example: "Payment type selection submitted successfully",
  })
  message!: string;

  @ApiProperty({
    type: [SubmitPaymentSelectionTypeResultDto],
    description: "List of stored procedure execution results",
  })
  results!: SubmitPaymentSelectionTypeResultDto[];
}
export class VendorPaymentItemDto {
  @ApiProperty({
    example: "00001",
    description: "Sequence number within this request",
  })
  @Type(() => String)
  @IsString()
  entrySequence!: string;

  @ApiProperty({ example: 18374, description: "APVEND vendor number" })
  @Type(() => Number)
  @IsNumber()
  vendorNo!: number;

  @ApiProperty({ example: 12345, description: "APOPEN voucher number" })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  voucherNo!: number;

  @ApiProperty({ example: 1200.0, description: "Payment amount (>= 0)" })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  partialPayAmount!: number;

  @ApiProperty({ example: 50.0, description: "Discount amount (>= 0)" })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  discountAmount!: number;

  @ApiProperty({
    enum: PAY_OR_HOLD_CODES,
    example: PAY_OR_HOLD_CODES.PAY,
    description: "Pay ('P') or Hold ('H') flag",
  })
  @IsOptional()
  payOrHold!: PAY_OR_HOLD_CODES;

  @ApiProperty({
    enum: SingleCheckFlag,
    example: SingleCheckFlag.SINGLE,
    description: "Single check flag: 'S' for single-check else ''",
  })
  @IsOptional()
  singleCheck!: SingleCheckFlag;

  @ApiProperty({
    enum: MakePrepaidFlag,
    example: MakePrepaidFlag.PREPAID,
    description: "Prepaid code: '', 'P' (prepaid), 'A' (advance), 'W' (wire)",
  })
  @IsOptional()
  makePrepaid!: MakePrepaidFlag;

  @ApiProperty({
    example: "123456",
    required: false,
    description: "Optional prepaid check no if makePrepaid requires it",
  })
  @IsString()
  @IsOptional()
  prepaidCheckNo!: string;

  @ApiProperty({
    description: "Prepaid Date (MMDDYY)",
    required: true,
    example: "080125",
  })
  @IsString()
  @IsOptional()
  prepaidDate!: string;

  @IsIn([FORCED_DISCOUNT_VALUES.YES, FORCED_DISCOUNT_VALUES.NO])
  @ApiProperty({
    description: "Forced Discount",
    required: true,
    enum: [FORCED_DISCOUNT_VALUES.YES, FORCED_DISCOUNT_VALUES.NO],
    example: FORCED_DISCOUNT_VALUES.YES,
  })
  @IsOptional()
  forcedDiscount!: ForcedDiscount;

  @ApiProperty({
    description: "Mode of Operation (save/edit)",
    required: true,
    example: "save",
    enum: PAYMENT_OPERATION_MODE_VALUES,
  })
  @IsIn(PAYMENT_OPERATION_MODE_VALUES)
  mode!: PaymentOperationMode;
}
export class SubmitVendorPaymentsDto {
  @ApiProperty({
    example: 10,
    description: "Company number (must match selection header)",
  })
  @Type(() => Number)
  @IsNumber()
  companyNo!: number;

  @ApiProperty({
    description: "Voucher Type (Check, ACH, Wire)",
    required: true,
    example: "Check",
    enum: PAYMENT_VOUCHER_TYPE_VALUES,
  })
  @IsIn(PAYMENT_VOUCHER_TYPE_VALUES)
  voucherToPay!: PaymentVoucherType;

  @ApiProperty({
    example: 111200,
    description: "Bank GL (must match selection header)",
  })
  @Type(() => Number)
  @IsNumber()
  bankAccountGl!: number;

  @ApiProperty({
    description: "Starting Check Number",
    required: true,
    example: "100001",
  })
  @Type(() => Number)
  @IsNumber()
  startingCheckNo!: number;

  @ApiProperty({
    description: "Check Date (MMDDYY)",
    required: true,
    example: "080125",
  })
  @IsString()
  checkDate!: string;

  @ApiProperty({
    description: "Date to Pay By (MMDDYY)",
    required: true,
    example: "080225",
  })
  @IsString()
  dateToPayBy!: string;

  @ApiProperty({
    type: VendorPaymentItemDto,
    description: "Single vendor payment line to add/modify/delete",
  })
  @ValidateNested()
  @Type(() => VendorPaymentItemDto)
  item!: VendorPaymentItemDto;
}

export class GetCashRequirementReportDto extends BaseQueryDto {
  @ApiProperty({
    example: "Check",
    description: "Voucher type (Check, ACH, Wire)",
    enum: PAYMENT_VOUCHER_TYPE_VALUES,
  })
  @IsIn(PAYMENT_VOUCHER_TYPE_VALUES)
  voucherToPay!: string;

  @ApiProperty({
    description: "Report Type",
    required: false,
    example: PAYMENT_REPORT_TYPES.AP_Cash_Requirement,
    type: String
  })
  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }) =>
    Array.isArray(value) ? value : value ? [value] : []
  )
  reportType?: string[];
}

export class GetApCheckReportDto extends BaseQueryDto {
  @ApiProperty({
    example: PAYMENT_VOUCHER_TYPES.CHECK,
    description: "Voucher type (Check)", 
  })
  @IsIn([PAYMENT_VOUCHER_TYPES.CHECK])
  voucherToPay!: string;

  @ApiProperty({
    description: "Report Type",
    required: false,
    example: PAYMENT_REPORT_TYPES.AP_Check_Printing,
    type: String
  })
  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }) =>
    Array.isArray(value) ? value : value ? [value] : []
  )
  reportType?: string[];
}
export class SubmitVendorPaymentOutputDto {
  @ApiProperty({
    description: "Error or status message returned by SP",
    example: "Program APPYTRDCL executed successfully",
  })
  errVar!: string;
}

export class SubmitVendorPaymentResultDto {
  @ApiProperty({
    description: "Execution mode",
    example: "I",
  })
  mode!: string;

  @ApiProperty({
    description: "Stored Procedure name",
    example: "APPYTRDCLPRC",
  })
  spName!: string;

  @ApiProperty({
    type: SubmitVendorPaymentOutputDto,
    description: "Output payload from stored procedure",
  })
  output!: SubmitVendorPaymentOutputDto;
}

export class SubmitVendorPaymentResponseWrapperDto {
  @ApiProperty({
    description: "Confirmation message",
    example: "Vendor payment submitted successfully",
  })
  message!: string;

  @ApiProperty({
    type: [SubmitVendorPaymentResultDto],
    description: "List of stored procedure execution results",
  })
  results!: SubmitVendorPaymentResultDto[];
}
