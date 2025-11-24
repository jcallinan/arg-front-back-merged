import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  IsString,
  MinLength,
  MaxLength,
  IsIn,
  Length,
  IsDefined,
} from "class-validator";
import { Type } from "class-transformer";

export class GetCompanyMaintenanceDto {
  @ApiProperty({
    description: "Company Number",
    example: 10,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(99)
  companyNo!: number;
}

export class CompanyMaintenanceResponseDto {
  @ApiProperty({ description: "Company Number", example: 10 })
  companyNo!: number;

  @ApiProperty({ description: "Company Name", example: "ABC Company" })
  companyName!: string;

  @ApiProperty({ description: "Company AP GL Number", example: 20000001 })
  companyApGlNo!: number;

  @ApiProperty({ description: "Company Bank GL Number", example: 10000001 })
  companyBankGlNo!: number;

  @ApiProperty({
    description: "Company Discounts GL Number",
    example: 50000001,
  })
  companyDiscountsGlNo!: number;

  @ApiProperty({ description: "Company Interco GL Number", example: 30000001 })
  companyIntercoGlNo!: number;

  @ApiProperty({ description: "Company Next PJ Journal Number", example: 1001 })
  companyNextPjJrnlNo!: number;

  @ApiProperty({ description: "Company Next CD Journal Number", example: 1001 })
  companyNextCdJrnlNo!: number;

  @ApiProperty({ description: "Company Next Check Number", example: 10001 })
  companyNextCheckNo!: number;

  @ApiProperty({ description: "Company Next Entry Number", example: 10001 })
  companyNextEntryNo!: number;

  @ApiProperty({ description: "Company Next Voucher Number", example: 10001 })
  companyNextVoucherNo!: number;

  @ApiProperty({ description: "Company Pre Ed Checks", example: "Y" })
  companyPreEdChks!: string;

  @ApiProperty({ description: "Company Job Cost Active", example: "Y" })
  companyJobCostAct!: string;

  @ApiProperty({
    description: "Company Retention GL Number",
    example: 40000001,
  })
  companyRetentionGlNo!: number;

  @ApiProperty({ description: "Company PO Active", example: "Y" })
  companyPoActive!: string;

  @ApiProperty({
    description: "Company Employee Expense GL Number",
    example: 60000001,
  })
  companyEmployeeExpenseGlNo!: number;

  @ApiProperty({ description: "Company Next EE Journal Number", example: 1001 })
  companyNextEeJrnlNo!: number;

  @ApiProperty({ description: "Company Filler", example: "" })
  companyFiller!: string;

  @ApiProperty({ description: "Company Is Deleted", example: "A" })
  companyIsDeleted!: string;
}

export class UpdateCompanyMaintenanceDto {
  @ApiProperty({ description: "Company Number", example: 10, required: true })
  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(99)
  companyNo!: number;

  @ApiProperty({
    description: "Company Name",
    example: "ABC Company",
    required: true,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  companyName!: string;

  @ApiProperty({
    description: "Company AP GL Number",
    example: 20000001,
    required: true,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  companyApGlNo!: number;

  @ApiProperty({
    description: "Company Bank GL Number",
    example: 10000001,
    required: true,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  companyBankGlNo!: number;

  @ApiProperty({
    description: "Company Discounts GL Number",
    example: 50000001,
    required: true,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  companyDiscountsGlNo!: number;

  @ApiProperty({
    description: "Company Interco GL Number",
    example: 30000001,
    required: true,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  companyIntercoGlNo!: number;

  @ApiProperty({
    description: "Company Next PJ Journal Number",
    example: 1001,
    required: true,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  companyNextPjJrnlNo!: number;

  @ApiProperty({
    description: "Company Next CD Journal Number",
    example: 1001,
    required: true,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  companyNextCdJrnlNo!: number;

  @ApiProperty({
    description: "Company Next Check Number",
    example: 10001,
    required: true,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  companyNextCheckNo!: number;

  @ApiProperty({
    description: "Company Next Entry Number",
    example: 10001,
    required: true,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  companyNextEntryNo!: number;

  @ApiProperty({
    description: "Company Next Voucher Number",
    example: 10001,
    required: true,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  companyNextVoucherNo!: number;

  @ApiProperty({
    description: "Company Pre Ed Checks",
    example: "Y",
    required: true,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @Length(1, 1)
  @IsIn(["Y", "N"])
  companyPreEdChks!: string;

  @ApiProperty({
    description: "Company Job Cost Active",
    example: "Y",
    required: true,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @Length(1, 1)
  @IsIn(["Y", "N"])
  companyJobCostAct!: string;

  @ApiProperty({
    description: "Company Retention GL Number",
    example: 40000001,
    required: true,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  companyRetentionGlNo!: number;

  @ApiProperty({
    description: "Company PO Active",
    example: "Y",
    required: true,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @Length(1, 1)
  @IsIn(["Y", "N"])
  companyPoActive!: string;

  @ApiProperty({
    description: "Company Employee Expense GL Number",
    example: 60000001,
    required: true,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  companyEmployeeExpenseGlNo!: number;

  @ApiProperty({
    description: "Company Next EE Journal Number",
    example: 1001,
    required: true,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  companyNextEeJrnlNo!: number;

  @ApiProperty({ description: "Company Filler", example: "", required: true })
  @IsDefined()
  @IsString()
  @MaxLength(255)
  companyFiller!: string;
}
