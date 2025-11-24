import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsNotEmpty, IsString, ValidateNested, MaxLength, IsNumber, IsObject } from "class-validator";
import { Type } from "class-transformer";
import { REPORT_USECASES, REPORT_USECASES_ENUM } from "@src/shared/config/generate-report-config";

export class SpParameterDto {
    @ApiProperty({
        description: "Parameter name",
        example: "Company",
    })
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({
        description: "Parameter value",
        example: "10",
    })
    @IsString()
    @IsNotEmpty()
    value!: string;
}

export class ExecuteSpDto {
    @ApiProperty({
        description: "Report name as kebab case",
        example: "Open-Payables-By-Due-Date",
    })
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({
        description: "Parameters to pass to the stored procedure",
        type: [SpParameterDto],
        example: [
            { name: "Company", value: "10" },
            { name: "Hold", value: "N" },
        ],
    })
    @ValidateNested({ each: true })
    @Type(() => SpParameterDto)
    parameters!: SpParameterDto[];
}

export class SpInfoResponseDto {
    @ApiProperty({
        description: "Report name as kebab case",
        example: "Open-Payables-By-Due-Date",
    })
    reportName!: string;

    @ApiProperty({
        description: "Stored procedure name",
        example: "AP700PRC",
    })
    storedProcedureName!: string;

    @ApiProperty({
        description: "Stored procedure sequence",
        example: 1,
    })
    spSequence!: number;

    @ApiProperty({
        description: "Field key",
        example: "Company",
    })
    fieldKey!: string;

    @ApiProperty({
        description: "Field description",
        example: "Company",
    })
    fieldDescription!: string;

    @ApiProperty({
        description: "Component type for UI rendering",
        example: "Drop Down",
    })
    fieldComponent!: string;

    @ApiProperty({
        description: "Data type",
        example: "string",
    })
    fieldDataType!: string;

    @ApiProperty({
        description: "Field length",
        example: "2",
    })
    fieldLength!: string;

    @ApiProperty({
        description: "Field sequence for ordering",
        example: 2,
    })
    fieldSequence!: number;

    @ApiProperty({
        description: "Variable type (in/out)",
        example: "in",
    })
    variableType!: string;

    @ApiProperty({
        description: "XML metadata for static fields",
        example: "",
        required: false,
    })
    xmlMetadata?: string;
}


export class GetSpInfoByReportNameDto {
    @ApiProperty({
        description: "The report name to find spinfo records for",
        example: "REPORT_NAME",
        required: true,
        maxLength: 100,
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name!: string;

    @ApiProperty({
        description: "The variable type to find spinfo records for",
        example: "in",
        required: true,
        maxLength: 10,
        default: "in",
    })
    @IsOptional()
    @MaxLength(10)
    variableType?: string = "in";
} 

export class GenerateReportFileDto {
    @ApiProperty({
      description: "Company Number",
      example: 10,
    })
    @IsNotEmpty()
    @IsNumber()
    companyNo!: number;
  
    @ApiProperty({
      description: "Usecase key (decides which table/schema to call)",
      enum: REPORT_USECASES_ENUM,
      example: REPORT_USECASES.paymentSelection.usecase,
    })
    @IsNotEmpty()
    @IsString()
    usecase!: string;

    @ApiProperty({
        description: "Optional parameters specific to the usecase",
        example: { formType: "Misc", reportYear: "2024" },
        required: false,
      })
      @IsOptional()
      @IsObject()
      parameters?: Record<string, any>;
  }

  export class GeneratedFileDto {
    @ApiProperty({ example: "AP-Nacha-ACH-Creation_20250827.xlsx" })
    fileName!: string;
  
    @ApiProperty({ example: "http://server:5001/reports/AP-Nacha-ACH-Creation_20250827.xlsx" })
    fullPath!: string;
  }
  
  export class GenerateReportFileResponseDto {
    @ApiProperty({ example: "Report file(s) generated successfully" })
    message!: string;
  
    @ApiProperty({ type: [GeneratedFileDto] })
    files!: GeneratedFileDto[];
  }
  