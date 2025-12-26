import { ApiProperty, ApiExtraModels, getSchemaPath } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  IsOptional,
  IsBoolean,
  IsString,
  MaxLength,
  ValidateNested,
  ValidateIf,
} from "class-validator";
import { Type, Transform, plainToInstance } from "class-transformer";
import { BaseQueryDto } from "@src/shared/dto/base-query.dto";
// import { vendorDetailsDto } from "../../vendor-management/dto/vendor-management.dto";

export class GetVendorsByYearDto extends BaseQueryDto {
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

  @ApiProperty({
    description: "Year",
    example: 2024,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @Min(1900)
  @Max(2100)
  year!: number;

}

export class vendorYearEndProcessDto {
  @ApiProperty({
    description: "Company Number",
    example: 10,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  companyNo!: number;

  @ApiProperty({
    description: "Year for vendor year-end process",
    example: "2024",
    required: true,
  })
  @IsNotEmpty()
  year!: string;

  @ApiProperty({
    description: "Clear Year to Date Fields",
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  clearYTD?: boolean;
}

export class YearEndProcessResponseDto {
  @ApiProperty({
    description: "Message describing the result of the year-end process",
    example: "Vendor year-end process completed successfully for company 10, year 2024",
  })
  message!: string;

  @ApiProperty({
    description: "Name of the table created or processed",
    example: "DATADEV.VENDOR_2024",
    required: false,
    nullable: true,
  })
  tableName?: string;

  @ApiProperty({
    description: "Number of data rows copied",
    example: 100,
    required: false,
    nullable: true,
  })
  dataCopied?: number;
}

export class RecordFormatT1009IDto {
  @IsString()
  @MaxLength(1)
  recordType!: string; // A1REC

  @IsNumber()
  @Min(0)
  @Max(9999)
  paymentYear!: number; // A1YR

  @IsString()
  @MaxLength(1)
  priorYearDataInd!: string; // A1PYRD

  @IsNumber()
  @Min(0)
  @Max(999999999)
  transmitterId!: number; // A1TIN

  @IsString()
  @MaxLength(5)
  transControlCode!: string; // A1TCC

  @IsString()
  @MaxLength(2)
  replacementAlphaChar!: string; // A1RAC

  @IsString()
  @MaxLength(5)
  blank01!: string; // A1BL01

  @IsString()
  @MaxLength(1)
  testFileInd!: string; // A1TFI

  @IsString()
  @MaxLength(1)
  foreignEntityInd!: string; // A1FEI

  @IsString()
  @MaxLength(40)
  transmitterName!: string; // A1TRNM

  @IsString()
  @MaxLength(40)
  transmitterName2!: string; // A1TRN2

  @IsString()
  @MaxLength(40)
  companyName!: string; // A1CONM

  @IsString()
  @MaxLength(40)
  companyName2!: string; // A1CON2

  @IsString()
  @MaxLength(40)
  companyAddress!: string; // A1ADDR

  @IsString()
  @MaxLength(40)
  companyCity!: string; // A1CITY

  @IsString()
  @MaxLength(2)
  companyState!: string; // A1STAT

  @IsString()
  @MaxLength(9)
  companyZipCode!: string; // A1ZIP9

  @IsOptional()
  @IsString()
  @MaxLength(15)
  blank02!: string; // A1BL02

  @IsNumber()
  @Min(0)
  @Max(99999999)
  totalNumberOfPayees!: number; // A1TPAY

  @IsString()
  @MaxLength(40)
  contactName!: string; // A1CNNM

  @IsString()
  @MaxLength(15)
  contactPhoneNumber!: string; // A1CPH#

  @IsString()
  @MaxLength(50)
  contactEmail!: string; // A1CEML

  @IsOptional()
  @IsString()
  @MaxLength(91)
  blank03!: string; // A1BL03

  @IsNumber()
  @Min(0)
  @Max(99999999)
  sequenceNumber!: number; // A1SEQ#

  @IsOptional()
  @IsString()
  @MaxLength(10)
  blank04!: string; // A1BL04

  @IsString()
  @MaxLength(1)
  vendorInd!: string; // A1VNIN

  @IsOptional()
  @IsString()
  @MaxLength(230)
  blank05!: string; // A1BL05

  @IsOptional()
  @IsString()
  @MaxLength(2)
  blank06!: string; // A1BL06
}

export class RecordFormatA1099Dto {
  @IsString()
  @MaxLength(1)
  recordType!: string; // A2REC

  @IsNumber()
  @Min(0)
  @Max(9999)
  paymentYear!: number; // A2YR

  @IsString()
  @MaxLength(1)
  combineFedStateFiler!: string; // A2CFSF

  @IsOptional()
  @IsString()
  @MaxLength(5)
  blank01!: string; // A2BL01

  @IsNumber()
  @Min(0)
  @Max(999999999)
  taxPayerId!: number; // A2TIN

  @IsString()
  @MaxLength(4)
  payerNameControl!: string; // A2PYNC

  @IsString()
  @MaxLength(1)
  lastFilingIndicator!: string; // A2LFI

  @IsString()
  @MaxLength(2)
  typeOfReturn!: string; // A2TYRT

  @IsString()
  @MaxLength(16)
  amountCodes!: string; // A2CODE

  @IsOptional()
  @IsString()
  @MaxLength(8)
  blank02!: string; // A2BL02

  @IsString()
  @MaxLength(1)
  foreignEntityIndicator!: string; // A2FEI

  @IsString()
  @MaxLength(40)
  firstPayeeName!: string; // A2FPNM

  @IsString()
  @MaxLength(40)
  secondPayerName!: string; // A2SPNM

  @IsString()
  @MaxLength(1)
  transferAgentIndicator!: string; // A2TAI

  @IsString()
  @MaxLength(40)
  payerShippingAddress!: string; // A2PSAD

  @IsString()
  @MaxLength(40)
  payerCity!: string; // A2PCTY

  @IsString()
  @MaxLength(2)
  payerState!: string; // A2PSTA

  @IsString()
  @MaxLength(9)
  payerZipCode!: string; // A2PZP9

  @IsString()
  @MaxLength(15)
  payerPhoneNumber!: string; // A2PPH#

  @IsOptional()
  @IsString()
  @MaxLength(256)
  blank03!: string; // A2BL03

  @IsOptional()
  @IsString()
  @MaxLength(4)
  blank04!: string; // A2BL04

  @IsNumber()
  @Min(0)
  @Max(99999999)
  sequenceNumber!: number; // A2SEQ#

  @IsOptional()
  @IsString()
  @MaxLength(241)
  blank05!: string; // A2BL05

  @IsOptional()
  @IsString()
  @MaxLength(2)
  blank06!: string; // A2BL06
}

export class RecordFormatB1009IDto {
  @IsString()
  @MaxLength(1)
  recordType!: string;

  @IsString()
  @MaxLength(4)
  paymentYear!: string;

  @IsString()
  @MaxLength(1)
  correctedReturnIndicator!: string;

  @IsString()
  @MaxLength(4)
  nameControl!: string;

  @IsString()
  @MaxLength(1)
  typeOfTIN!: string;

  @IsString()
  @MaxLength(9)
  taxPayerId!: string;

  @IsString()
  @MaxLength(20)
  payerAccountNum!: string;

  @IsString()
  @MaxLength(4)
  payerOfficeCode!: string;

  @IsString()
  @MaxLength(1)
  deletionIndicator!: string;

  // --- DECIMAL FIELDS ---
  @IsNumber()
  @Min(0)
  @Max(9999999999.99) // 12 digits
  @Type(() => Number)
  payAmt1!: number;

  @IsNumber()
  @Min(0)
  @Max(9999999999.99)
  @Type(() => Number)
  payAmt2!: number;

  @IsNumber()
  @Min(0)
  @Max(9999999999.99)
  @Type(() => Number)
  payAmt3!: number;

  @IsNumber()
  @Min(0)
  @Max(9999999999.99)
  @Type(() => Number)
  payAmt4!: number;

  @IsNumber()
  @Min(0)
  @Max(9999999999.99)
  @Type(() => Number)
  payAmt5!: number;

  @IsNumber()
  @Min(0)
  @Max(9999999999.99)
  @Type(() => Number)
  payAmt6!: number;

  @IsNumber()
  @Min(0)
  @Max(9999999999.99)
  @Type(() => Number)
  payAmt7!: number;

  @IsNumber()
  @Min(0)
  @Max(9999999999.99)
  @Type(() => Number)
  payAmt8!: number;

  @IsNumber()
  @Min(0)
  @Max(9999999999.99)
  @Type(() => Number)
  payAmt9!: number;

  @IsNumber()
  @Min(0)
  @Max(9999999999.99)
  @Type(() => Number)
  payAmtA!: number;

  @IsNumber()
  @Min(0)
  @Max(9999999999.99)
  @Type(() => Number)
  payAmtB!: number;

  @IsNumber()
  @Min(0)
  @Max(9999999999.99)
  @Type(() => Number)
  payAmtC!: number;

  @IsNumber()
  @Min(0)
  @Max(9999999999.99)
  @Type(() => Number)
  payAmtD!: number;

  @IsNumber()
  @Min(0)
  @Max(9999999999.99)
  @Type(() => Number)
  payAmtE!: number;

  @IsNumber()
  @Min(0)
  @Max(9999999999.99)
  @Type(() => Number)
  payAmtF!: number;

  @IsNumber()
  @Min(0)
  @Max(9999999999.99)
  @Type(() => Number)
  payAmtG!: number;

  // --- Strings again ---
  @IsString()
  @MaxLength(1)
  foreignCountryCode!: string;

  @IsString()
  @MaxLength(40)
  firstPayeeName!: string;

  @IsString()
  @MaxLength(40)
  secondPayeeName!: string;

  @IsString()
  @MaxLength(40)
  payeeAddress!: string;

  @IsString()
  @MaxLength(40)
  payeeCity!: string;

  @IsString()
  @MaxLength(2)
  payeeState!: string;

  @IsString()
  @MaxLength(9)
  payeeZip!: string;

  @IsNumber()
  @Min(0)
  @Max(99999999) // length 8
  @Type(() => Number)
  sequenceNumber!: number;


  @IsString()
  @MaxLength(1)
  secondTinNotice!: string;

  @IsString()
  @MaxLength(40)
  foreignCountryOrUsPos!: string;

  @IsString()
  @MaxLength(1)
  directorSalesInd!: string;

  @IsString()
  @MaxLength(60)
  specialDataEntry!: string;

  @IsNumber()
  @Min(0)
  @Max(9999999999.99)
  @Type(() => Number)
  stateIncomeTaxWithheld!: number;

  @IsNumber()
  @Min(0)
  @Max(9999999999.99)
  @Type(() => Number)
  localIncomeTaxWithheld!: number;

  @IsString()
  @MaxLength(2)
  combinedFedStateCode!: string;

  @IsString()
  @MaxLength(30)
  payeeLastOrBusinessName!: string;

  @IsString()
  @MaxLength(20)
  payeeFirstName!: string;

  @IsString()
  @MaxLength(20)
  payeeMiddleName!: string;

  @IsString()
  @MaxLength(4)
  payeeSuffix!: string;
}

export class apPeriodEndDto {
  @ApiProperty({ description: "Tin Number", example: "10", required: true })
  @IsString()
  tin!: string;

  @ApiProperty({ description: "Ctl", example: "10", required: true })
  @IsString()
  ctl!: string;
}


@ApiExtraModels(RecordFormatT1009IDto, RecordFormatA1099Dto, RecordFormatB1009IDto)
export class apPeriodEndBodyDto extends apPeriodEndDto {
  @ApiProperty({
    description: 'Payload data object',
    oneOf: [
      { $ref: getSchemaPath(RecordFormatT1009IDto) },
      { $ref: getSchemaPath(RecordFormatA1099Dto) },
      { $ref: getSchemaPath(RecordFormatB1009IDto) },
    ],
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Transform(({ value }) => {
    if (value?.recordType === 'T') {
      return plainToInstance(RecordFormatT1009IDto, value);
    }
    if (value?.recordType === 'A') {
      return plainToInstance(RecordFormatA1099Dto, value);
    }
    if (value?.recordType === 'B') {
      return plainToInstance(RecordFormatB1009IDto, value);
    }
    return value;
  }, { toClassOnly: true })
  data!: RecordFormatT1009IDto | RecordFormatA1099Dto | RecordFormatB1009IDto;

}


export class ApPeriodEndRecordFormatTIResponseDto {
  @ApiProperty({ example: 'A', description: 'Record Type' })
  recordType!: string;

  @ApiProperty({ example: 2024, description: 'Payment Year' })
  paymentYear!: number;

  @ApiProperty({ example: 'Y', description: 'Prior Year Data Indicator' })
  priorYearDataInd!: string;

  @ApiProperty({ example: 123456789, description: 'Transmitter ID' })
  transmitterId!: number;

  @ApiProperty({ example: 'ABCDE', description: 'Trans Control Code' })
  transControlCode!: string;

  @ApiProperty({ example: 'RA', description: 'Replacement Alpha Character' })
  replacementAlphaChar!: string;

  @ApiProperty({ example: '', description: 'Blank field' })
  blank01!: string;

  @ApiProperty({ example: 'T', description: 'Test File Indicator' })
  testFileInd!: string;

  @ApiProperty({ example: 'N', description: 'Foreign Entity Indicator' })
  foreignEntityInd!: string;

  @ApiProperty({ example: 'ABC Transmitters Inc.', description: 'Transmitter Name' })
  transmitterName!: string;

  @ApiProperty({ example: 'Second Name', description: 'Transmitter Name 2' })
  transmitterName2!: string;

  @ApiProperty({ example: 'Company Ltd.', description: 'Company Name' })
  companyName!: string;

  @ApiProperty({ example: 'Branch Division', description: 'Company Name 2' })
  companyName2!: string;

  @ApiProperty({ example: '123 Main St', description: 'Company Address' })
  companyAddress!: string;

  @ApiProperty({ example: 'New York', description: 'Company City' })
  companyCity!: string;

  @ApiProperty({ example: 'NY', description: 'Company State' })
  companyState!: string;

  @ApiProperty({ example: '10001', description: 'Company Zip Code' })
  companyZipCode!: string;

  @ApiProperty({ example: '', description: 'Blank field' })
  blank02!: string;

  @ApiProperty({ example: 500, description: 'Total Number of Payees' })
  totalNumberOfPayees!: number;

  @ApiProperty({ example: 'John Doe', description: 'Contact Name' })
  contactName!: string;

  @ApiProperty({ example: '1234567890', description: 'Contact Phone Number' })
  contactPhoneNumber!: string;

  @ApiProperty({ example: 'john.doe@email.com', description: 'Contact Email' })
  contactEmail!: string;

  @ApiProperty({ example: '', description: 'Blank field' })
  blank03!: string;

  @ApiProperty({ example: 1, description: 'Sequence Number' })
  sequenceNumber!: number;

  @ApiProperty({ example: '', description: 'Blank field' })
  blank04!: string;

  @ApiProperty({ example: 'Y', description: 'Vendor Indicator' })
  vendorInd!: string;

  @ApiProperty({ example: '', description: 'Blank field' })
  blank05!: string;

  @ApiProperty({ example: '', description: 'Blank field' })
  blank06!: string;
}

export class ApPeriodEndRecordFormatA1099ResponseDto {
  @ApiProperty({ example: 'A', description: 'Record Type' })
  recordType!: string;

  @ApiProperty({ example: 2024, description: 'Payment Year' })
  paymentYear!: number;

  @ApiProperty({ example: 'Y', description: 'Combine Fed/State Filer' })
  combineFedStateFiler!: string;

  @ApiProperty({ example: '', description: 'Blank field' })
  blank01!: string;

  @ApiProperty({ example: 123456789, description: 'Tax Payer ID' })
  taxPayerId!: number;

  @ApiProperty({ example: 'ABCD', description: 'Payer Name Control' })
  payerNameControl!: string;

  @ApiProperty({ example: 'Y', description: 'Last Filing Indicator' })
  lastFilingIndicator!: string;

  @ApiProperty({ example: '01', description: 'Type of Return' })
  typeOfReturn!: string;

  @ApiProperty({ example: '1234567890123456', description: 'Amount Codes' })
  amountCodes!: string;

  @ApiProperty({ example: '', description: 'Blank field' })
  blank02!: string;

  @ApiProperty({ example: 'N', description: 'Foreign Entity Indicator' })
  foreignEntityIndicator!: string;

  @ApiProperty({ example: 'First Payer Name', description: 'First Payer Name' })
  firstPayeeName!: string;

  @ApiProperty({ example: 'Second Payer Name', description: 'Second Payer Name' })
  secondPayerName!: string;

  @ApiProperty({ example: 'Y', description: 'Transfer Agent Indicator' })
  transferAgentIndicator!: string;

  @ApiProperty({ example: '123 Main Street', description: 'Payer Shipping Address' })
  payerShippingAddress!: string;

  @ApiProperty({ example: 'New York', description: 'Payer City' })
  payerCity!: string;

  @ApiProperty({ example: 'NY', description: 'Payer State' })
  payerState!: string;

  @ApiProperty({ example: '10001', description: 'Payer Zip Code' })
  payerZipCode!: string;

  @ApiProperty({ example: '1234567890', description: 'Payer Phone Number' })
  payerPhoneNumber!: string;

  @ApiProperty({ example: '', description: 'Blank field' })
  blank03!: string;

  @ApiProperty({ example: '', description: 'Blank field' })
  blank04!: string;

  @ApiProperty({ example: 1, description: 'Sequence Number' })
  sequenceNumber!: number;

  @ApiProperty({ example: '', description: 'Blank field' })
  blank05!: string;

  @ApiProperty({ example: '', description: 'Blank field' })
  blank06!: string;
}

export class ApPeriodEndRecordFormatB1009IResponseDto {
  @ApiProperty({ example: 'B', description: 'Record Type' })
  recordType!: string;

  @ApiProperty({ example: '2024', description: 'Payment Year' })
  paymentYear!: string;

  @ApiProperty({ example: '1', description: 'Corrected Return Indicator' })
  correctedReturnIndicator!: string;

  @ApiProperty({ example: 'ABCD', description: 'Name Control' })
  nameControl!: string;

  @ApiProperty({ example: '1', description: 'Type of TIN' })
  typeOfTIN!: string;

  @ApiProperty({ example: '123456789', description: 'Tax Payer ID' })
  taxPayerId!: string;

  @ApiProperty({ example: 'ACC1234567890', description: 'Payer Account Number' })
  payerAccountNum!: string;

  @ApiProperty({ example: 'OFF1', description: 'Payer Office Code' })
  payerOfficeCode!: string;

  @ApiProperty({ example: 'N', description: 'Deletion Indicator' })
  deletionIndicator!: string;

  // --- Decimal fields ---
  @ApiProperty({ example: 1000, description: 'Payment Amount 1' })
  payAmt1!: number;

  @ApiProperty({ example: 2000, description: 'Payment Amount 2' })
  payAmt2!: number;

  @ApiProperty({ example: 3000, description: 'Payment Amount 3' })
  payAmt3!: number;

  @ApiProperty({ example: 4000, description: 'Payment Amount 4' })
  payAmt4!: number;

  @ApiProperty({ example: 5000, description: 'Payment Amount 5' })
  payAmt5!: number;

  @ApiProperty({ example: 6000, description: 'Payment Amount 6' })
  payAmt6!: number;

  @ApiProperty({ example: 7000, description: 'Payment Amount 7' })
  payAmt7!: number;

  @ApiProperty({ example: 8000, description: 'Payment Amount 8' })
  payAmt8!: number;

  @ApiProperty({ example: 9000, description: 'Payment Amount 9' })
  payAmt9!: number;

  @ApiProperty({ example: 10000, description: 'Payment Amount A' })
  payAmtA!: number;

  @ApiProperty({ example: 11000, description: 'Payment Amount B' })
  payAmtB!: number;

  @ApiProperty({ example: 12000, description: 'Payment Amount C' })
  payAmtC!: number;

  @ApiProperty({ example: 13000, description: 'Payment Amount D' })
  payAmtD!: number;

  @ApiProperty({ example: 14000, description: 'Payment Amount E' })
  payAmtE!: number;

  @ApiProperty({ example: 15000, description: 'Payment Amount F' })
  payAmtF!: number;

  @ApiProperty({ example: 16000, description: 'Payment Amount G' })
  payAmtG!: number;

  // --- Strings again ---
  @ApiProperty({ example: 'N', description: 'Foreign Country Code' })
  foreignCountryCode!: string;

  @ApiProperty({ example: 'John Smith', description: 'First Payee Name' })
  firstPayeeName!: string;

  @ApiProperty({ example: 'Jane Smith', description: 'Second Payee Name' })
  secondPayeeName!: string;

  @ApiProperty({ example: '123 Elm Street', description: 'Payee Address' })
  payeeAddress!: string;

  @ApiProperty({ example: 'Los Angeles', description: 'Payee City' })
  payeeCity!: string;

  @ApiProperty({ example: 'CA', description: 'Payee State' })
  payeeState!: string;

  @ApiProperty({ example: '90001', description: 'Payee Zip Code' })
  payeeZip!: string;

  @ApiProperty({ example: 1, description: 'Sequence Number' })
  sequenceNumber!: number;

  @ApiProperty({ example: 'B', description: '2nd TIN Notice' })
  secondTinNotice!: string;

  @ApiProperty({ example: 'UNITED STATES', description: 'Foreign Country or US Possession' })
  foreignCountryOrUsPos!: string;

  @ApiProperty({ example: 'Y', description: 'Director Sales Indicator' })
  directorSalesInd!: string;

  @ApiProperty({ example: 'SPECIAL DATA ENTRY TEXT', description: 'Special Data Entry' })
  specialDataEntry!: string;

  @ApiProperty({ example: 12345.67, description: 'State Income Tax Withheld' })
  stateIncomeTaxWithheld!: number;

  @ApiProperty({ example: 9876.54, description: 'Local Income Tax Withheld' })
  localIncomeTaxWithheld!: number;

  @ApiProperty({ example: 'CA', description: 'Combined Federal/State Code' })
  combinedFedStateCode!: string;

  @ApiProperty({ example: 'DOE INDUSTRIES', description: 'Payee Last or Business Name' })
  payeeLastOrBusinessName!: string;

  @ApiProperty({ example: 'JOHN', description: 'Payee First Name' })
  payeeFirstName!: string;

  @ApiProperty({ example: 'MICHAEL', description: 'Payee Middle Name' })
  payeeMiddleName!: string;

  @ApiProperty({ example: 'JR', description: 'Payee Suffix' })
  payeeSuffix!: string;
}

export class GetYearEndProcessMenuReviewFilesDto extends BaseQueryDto {
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

  @ApiProperty({
    description: "Report Type",
    required: false,
    example: "example report type",
    type: String
  })
  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }) =>
    Array.isArray(value) ? value : value ? [value] : []
  )
  reportType?: string[];
}

export class ReviewFileResponseDto {
  @ApiProperty({
    description: "Report type",
    example: "sample-test-report",
  })
  reportType!: string;

  @ApiProperty({
    description: "PDF file name",
    example: "sample-test-report_20250813084723655536.PDF",
  })
  pdfFileName!: string;

  @ApiProperty({
    description: "Report generated date/time",
    example: "2025-08-13T08:47:23.655Z",
  })
  reportDateTime!: Date;

  @ApiProperty({
    description: "Download path or URL of the report",
    example: "http://172.16.30.10:5001/G-Drive/sample-test-report_20250813084723655536.PDF",
  })
  filePath!: string;

  @ApiProperty({
    description: "Form type of report",
    example: "PDF",
  })
  formType!: string;
}

export class allReponseDto {
  @ApiProperty({
    description: '',
    example: 'CTL12345',
  })
  ctl!: string;

  @ApiProperty({
    description: '',
    example: 'TIN987654',
  })
  tin!: string;

  @ApiProperty({
    description: 'Record type',
    example: 'A',
  })
  recordType!: string;

  @ApiProperty({
    description: 'First payee name',
    example: 'John Doe',
  })
  firstPayeeName!: string;
}


export class vendorDetailByYearDto {
  @ApiProperty({ description: "Company No", example: 10, required: true })
  @Type(() => Number)
  @IsNumber()
  vendorCompanyNumber!: number;

  @ApiProperty({ description: "Vendor No", example: 1444, required: true })
  @IsString()
  vendorNo!: string;

  @ApiProperty({ description: "Year", example: 2024, required: true })
  @IsString()
  year!: string;
}
export class UpdateVendorByYearDto {
  @ApiProperty({ description: "Company Number", example: 10, required: true })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  vendorCompanyNumber!: number;

  @ApiProperty({ description: "Vendor Name", example: 'ABCOTT Consulting', required: true })
  @IsNotEmpty()
  @IsString()
  vendorName!: string;

  @ApiProperty({ description: "Vendor Address 1", example: "Address", required: false })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  vendorAdd1?: string;

  @ApiProperty({ description: "Vendor Address 2", example: "Address", required: false })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  vendorAdd2?: string;

  @ApiProperty({ description: "Phone Area Code", example: 123, required: false })
  @Type(() => Number)
  @IsOptional()
  @ValidateIf((o) => o.vendorAreaCode !== 0)
  @Min(100, { message: 'Invalid Area Code' })
  @Max(999, { message: 'Invalid Area Code' }) // VNAREA (INTEGER max 999)
  vendorAreaCode?: number;

  @ApiProperty({ description: "Vendor Address 3", example: "Address", required: false })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  vendorAdd3?: string;

  @ApiProperty({ description: "Vendor Address 4", example: "Address", required: false })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  vendorAdd4?: string;

  @ApiProperty({ description: "Country", example: "US", required: false })
  @IsOptional()
  @IsString()
  @MaxLength(3)
  vendorCountryCode?: string;

  @ApiProperty({ description: "ZipCode", example: 401105, required: false })
  @IsOptional()
  @Type(() => Number)
  vendorZipCode?: number;

  @ApiProperty({ description: "Phone", example: 996793, required: false })
  @IsOptional()
  @Type(() => Number)
  @ValidateIf((o) => o.vendorAreaCode !== 0)
  @Min(1000000, { message: 'Invalid Phone Number' })
  @Max(9999999, { message: 'Invalid Phone Number' }) // VNTELE (INTEGER max 9999999)
  vendorTelephoneNo?: number;

  @ApiProperty({ description: "Hold Vendor", example: 'A', required: false })
  @IsOptional()
  @IsString()
  vendorHoldPaymentsVend?: string;

  @ApiProperty({ description: "Gal/Rcpts Required", example: "Y", required: false })
  @IsOptional()
  @IsString()
  vendorGalRcptsRequired?: string;

  @ApiProperty({ description: "Single Check", example: 'Y', required: false })
  @IsOptional()
  @IsString()
  vendorSingleCheck?: string;

  @ApiProperty({ description: "Terms Code", example: 10, required: false })
  @IsOptional()
  @Type(() => Number)
  vendorApTermsCode?: number;

  @ApiProperty({ description: "ADP Payroll ID", example: 123, required: false })
  @IsOptional()
  @Type(() => Number)
  vendorAdpPayrollId?: number;

  @ApiProperty({ description: "Category", example: 'INACT', required: false })
  @IsOptional()
  @MaxLength(6)
  vendorCategoryCode?: string;

  @ApiProperty({ description: "Expense GL", example: 1234, required: false })
  @IsOptional()
  @Type(() => Number)
  vendorExpenseGLSub?: number;

  @ApiProperty({ description: "ACH Bank Account", example: '1234567890', required: false })
  @IsOptional()
  @MaxLength(20)
  vendorAchBankAccountNumber?: string;

  @ApiProperty({ description: "ACH Bank Routing", example: 123456789, required: false })
  @IsOptional()
  @Type(() => Number)
  vendorAchBankRoutingCode?: number;

  @ApiProperty({ description: "ACH Checking or Savings", example: 'C', required: false })
  @IsOptional()
  @MaxLength(1)
  vendorAchCheckingOrSavings?: string;

  @ApiProperty({ description: "ACH Class", example: 'A', required: false })
  @IsOptional()
  @MaxLength(1)
  vendorAchClass?: string;

  @ApiProperty({ description: "First Name", example: 'John', required: false })
  @IsOptional()
  @MaxLength(50)
  vendorFirstName?: string;

  @ApiProperty({ description: "Middle Name", example: 'M', required: false })
  @IsOptional()
  @MaxLength(50)
  vendorMiddleName?: string;

  @ApiProperty({ description: "Last Name", example: 'Doe', required: false })
  @IsOptional()
  @MaxLength(50)
  vendorBusinessLastName?: string;

  @ApiProperty({ description: "Suffix", example: 'Jr', required: false })
  @IsOptional()
  @MaxLength(5)
  vendorNameSuffix?: string;

  @ApiProperty({ description: "1099 Code", example: 'Y', required: false })
  @IsOptional()
  @MaxLength(1)
  vendorAp1099Code?: string;

  @ApiProperty({ description: "1st 1099 Box#", example: 1, required: false })
  @IsOptional()
  @Type(() => Number)
  vendorFirst1099BoxNumber?: number;

  @ApiProperty({ description: "2nd Box#", example: 2, required: false })
  @IsOptional()
  @Type(() => Number)
  vendorSecond1099BoxNumber?: number;

  @ApiProperty({ description: "2nd Box Amt", example: 50, required: false })
  @IsOptional()
  vendorSecond1099BoxAmount?: number;

  @ApiProperty({ description: "Payee #1", example: 'John Doe', required: false })
  @IsOptional()
  @MaxLength(50)
  vendorPayeeName1?: string;

  @ApiProperty({ description: "Payee #2", example: 'Jane Doe', required: false })
  @IsOptional()
  @MaxLength(50)
  vendorPayeeName2?: string;

  @ApiProperty({ description: "IRS Name Control", example: 'D', required: false })
  @IsOptional()
  @MaxLength(1)
  vendorIrsNameControl?: string;
}

export class allApPeriodDto extends BaseQueryDto {
  @ApiProperty({ description: "Record Type", example: 10, required: false })
  @IsString()
  @IsOptional()
  @MaxLength(1)
  recordType?: string;

  @ApiProperty({ description: "ctl", example: 10, required: false })
  @IsOptional()
  @IsString()
  ctl?: string;

  @ApiProperty({ description: "tin", example: 10, required: false })
  @IsOptional()
  @IsString()
  tin?: string;
}
