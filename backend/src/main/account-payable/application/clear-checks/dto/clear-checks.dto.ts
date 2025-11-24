import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
  Max,
  Matches,
  IsArray,
  ValidateNested,
  ArrayMinSize,
} from "class-validator";
import { Type } from "class-transformer";

export class ClearCheckDto {
  @IsNotEmpty()
  @IsString()
  checkNo!: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  checkAmount!: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1900)
  @Max(2100)
  year!: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(12)
  month!: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(31)
  date!: number;
}

export class SingleCheckValidationDto {
  @IsNotEmpty()
  @IsString()
  checkNo!: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  checkAmount!: number;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([0-9]{2})$/, {
    message:
      "checkDate must be in MMDDYY format (e.g., '061025' for June 10, 2025)",
  })
  checkDate!: string; // Format: MMDDYY (e.g., "061025" for June 10, 2025)
}

export class SingleCheckValidationResponseDto {
  checkNo!: string;
  checkAmount!: number;
  checkDate!: string;
  isValid!: boolean;
  errors!: Array<{
    field: string;
    message: string;
    code: string;
  }>;
  warnings?: Array<{
    field: string;
    message: string;
    code: string;
  }>;
}

export class ProcessMultipleChecksDto {
  @IsArray()
  @ArrayMinSize(1, { message: "At least one check must be provided" })
  @ValidateNested({ each: true })
  @Type(() => SingleCheckValidationDto)
  checks!: SingleCheckValidationDto[];
}

export class ProcessMultipleChecksResponseDto {
  message!: string;
  totalProcessed!: number;
  successful!: number;
  failed!: number;
  results!: Array<{
    checkNo: string;
    checkAmount: number;
    checkDate: string;
    message: string;
    errors?: Array<{
      field: string;
      message: string;
      code: string;
    }>;
  }>;
}

export class ClearCheckUploadResponseDto {
  message!: string;
  uploadId!: string;
  totalGroups!: number;
  totalBatches!: number;
  parentJobId!: string;
  childJobIds!: string[];
}

export class ClearCheckSummaryDto {
  checkNo!: string;
  checkAmount!: number;
  date!: string;
  status!: "S" | "E" | "W"; // Success, Error, Warning
  errors!: string[];
  warnings!: string[];
}
