import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, IsOptional, Max} from "class-validator";
import { Type } from "class-transformer";

export class GetGeneralSystemCompanyParamsDto {
  @ApiProperty({
    description: "Company Number",
    example: 10,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  companyNo!: number;
}

export class GeneralSystemAuthDto {
  @ApiProperty({
    description: "authCode",
    example: 526456,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @Max(999999)
  @Type(() => Number)
  authCode!: number;
}





export class GeneralSystemCompanyResponseDto {
  @ApiProperty({ description: 'Fixed Assets flag', example: 'Y' })
  @IsString()
  fixedAssets!: string;

  @ApiProperty({ description: 'Order Entry and Invoicing flag', example: 'Y' })
  @IsString()
  orderEntryInvoicing!: string;

  @ApiProperty({ description: 'Sales Analysis flag', example: 'Y' })
  @IsString()
  salesAnalysis!: string;

  @ApiProperty({ description: 'Inventory flag', example: 'Y' })
  @IsString()
  inventory!: string;

  @ApiProperty({ description: 'Purchase Order flag', example: 'Y' })
  @IsString()
  purchaseOrder!: string;

  @ApiProperty({ description: 'Bill Of Material flag', example: 'Y' })
  @IsString()
  billOfMaterial!: string;

  @ApiProperty({ description: 'Job Shop flag', example: 'Y' })
  @IsString()
  jobShop!: string;

  @ApiProperty({ description: 'Job Cost flag', example: 'Y' })
  @IsString()
  jobCost!: string;

  @ApiProperty({ description: 'Filler field 1', example: '' })
  @IsString()
  @IsOptional()
  filler1!: string;

  @ApiProperty({ description: 'Multi Warehouse active (Y/N)', example: 'Y' })
  @IsString()
  multiWarehouseYn!: string;

  @ApiProperty({ description: '13 Accounting Periods active (Y/N)', example: 'N' })
  @IsString()
  thirteenAccountingPeriodsYn!: string;

  @ApiProperty({ description: 'Fractional Quantity Active (Y/N)', example: 'Y' })
  @IsString()
  fractionalQtyActive!: string;

  @ApiProperty({ description: 'AP Post Override Code', example: 1001 })
  @IsNumber()
  apPostOverrideCode!: number;

  @ApiProperty({ description: 'AR Post Override Code', example: 2001 })
  @IsNumber()
  arPostOverrideCode!: number;

  @ApiProperty({ description: 'FA Post Override Code', example: 3001 })
  @IsNumber()
  faPostOverrideCode!: number;

  @ApiProperty({ description: 'GL Post Override Code', example: 4001 })
  @IsNumber()
  glPostOverrideCode!: number;

  @ApiProperty({ description: 'Company Number', example: 101 })
  @IsNumber()
  companyNo!: number;

  @ApiProperty({ description: 'Filler field 2', example: '' })
  @IsString()
  @IsOptional()
  filler2!: string;
}
