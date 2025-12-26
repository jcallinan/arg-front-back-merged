import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, Min, Max, IsInt } from "class-validator";
import { Type } from "class-transformer";

export class BaseQueryDto {
  @ApiPropertyOptional({
    description: "Search term for filtering results",
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: "Page number for pagination",
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  current_page?: number = 1;

  @ApiPropertyOptional({
    description: "Limit:Number of items per page",
    default: 500,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(500)
  items_per_page?: number = 500;

  @ApiPropertyOptional({
    description: "Sort field",
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({
    description: "Sort direction (asc or desc)",
    enum: ["asc", "desc"],
  })
  @IsOptional()
  @IsString()
  sortOrder?: "asc" | "desc" = "asc";
}
