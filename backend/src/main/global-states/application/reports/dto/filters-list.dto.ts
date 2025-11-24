import { IsEnum, IsOptional, IsNumber, Min } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import {
  DropdownTypeEnum,
  DropdownDbTypeEnum,
} from "@src/shared/utils/dropdown";
import { BaseQueryDto } from "@src/shared/dto/base-query.dto";

export class DropdownRequestDto extends BaseQueryDto {
  @ApiProperty({
    description: "Type of dropdown data to retrieve",
    enum: [
      ...Object.values(DropdownTypeEnum),
      ...Object.values(DropdownDbTypeEnum),
    ],
    example: DropdownTypeEnum.PROCESS_TYPES,
    required: true,
  })
  @IsEnum(
    [...Object.values(DropdownTypeEnum), ...Object.values(DropdownDbTypeEnum)],
    { message: "Invalid dropdown type" }
  )
  type!: DropdownTypeEnum | DropdownDbTypeEnum;

  @ApiProperty({
    description: "Optional company number for company-specific dropdowns",
    required: false,
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  companyNo?: number;
}

export class DropdownResponseDto {
  @ApiProperty({
    description: "Array of dropdown options",
    example: [
      { id: "1", value: "Company A", label: "Company A" },
      { id: "2", value: "Company B", label: "Company B" },
    ],
  })
  items!: Array<{
    id: string;
    value: string;
    label: string;
  }>;
}
