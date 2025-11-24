import { ApiProperty } from '@nestjs/swagger';
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";
import { ConditionalRequired } from './conditional.dto';

export class generateReportDto {
    @ApiProperty({ description: "Company Number", example: "10", required: true })
    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    companyNo!: number;


    @ApiProperty({ description: "Open Payable", example: "10", required: true })
    @IsString()
    @IsNotEmpty()
    openPayables!: string;


    @ApiProperty({ description: "Hold Voucher", example: "10", required: false })
    @IsOptional()
    @IsString()
    @MaxLength(1)
    holdVoucher?: string;


    @ApiProperty({ description: "Date One", example: "10", required: false })
    @IsOptional()
    @IsString()
    dateOne?: Date;


    @ApiProperty({ description: "Date Two", example: "10", required: false })
    @IsOptional()
    @IsString()

    dateTwo?: string;

    @ApiProperty({ description: "Date Three", example: "10", required: false })
    @IsOptional()
    @IsString()
    dateThree?: string;


    @ApiProperty({ description: "Date 4", example: "10", required: false })
    @IsOptional()
    @IsString()
    dateFour?: string;

    @ApiProperty({ description: "Populate Spreedsheet", example: "Y", required: false })
    @IsOptional()
    @IsString()
    @MaxLength(1)
    populateSpreadsheet?: string;

    @ConditionalRequired()
    dummyProperty?: any;
}