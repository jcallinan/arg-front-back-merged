import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, Min, Max } from "class-validator";
import { Type } from "class-transformer";
import { BaseQueryDto } from "@src/shared/dto/base-query.dto";

export class GetAllCompaniesDto extends BaseQueryDto {}

export class GetCompanyDetailsDto {
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
  
  export class CompanyDetailsResponseDto {
    @ApiProperty({ description: "Company Number", example: 10 })
    companyNo!: number;
  
    @ApiProperty({ description: "Company Name", example: "ABC Company" })
    companyName!: string;
  
    @ApiProperty({ description: "Company AP GL Number", example: 20000001 })
    companyApGlNo!: number;
  
    @ApiProperty({ description: "Company Bank GL Number", example: 10000001 })
    companyBankGlNo!: number;
  
    @ApiProperty({ description: "Company Discounts GL Number", example: 50000001 })
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
  
    @ApiProperty({ description: "Company Pre-edit Checks Flag", example: "Y" })
    companyPreEdChks!: string;
  
    @ApiProperty({ description: "Company Job Cost Active Flag", example: "Y" })
    companyJobCostAct!: string;
  
    @ApiProperty({ description: "Company Retention GL Number", example: 40000001 })
    companyRetentionGlNo!: number;
  
    @ApiProperty({ description: "Company PO Active Flag", example: "Y" })
    companyPoActive!: string;
  
    @ApiProperty({ description: "Company Employee Expense GL Number", example: 60000001 })
    companyEmployeeExpenseGlNo!: number;
  
    @ApiProperty({ description: "Company Next EE Journal Number", example: 1001 })
    companyNextEeJrnlNo!: number;
  
    @ApiProperty({ description: "Company Filler Field", example: "" })
    companyFiller!: string;
  
    @ApiProperty({ description: "Company Vendor Next Entry Number", example: 10001 })
    companyVendorNextEntryNo!: number;
  }
