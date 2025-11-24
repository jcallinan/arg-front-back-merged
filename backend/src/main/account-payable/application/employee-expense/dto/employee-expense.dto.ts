import { ApiProperty } from '@nestjs/swagger';
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class employeeExpenseGenerateReportDto {
    @ApiProperty({ description: "Company Number", example: "10", required: true })
    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    companyNo!: number;

    @ApiProperty({ description: "Bank GL No", example: 62890262, required: true })
    @Type(() => Number)
    @IsNumber()
    bankGlNo!: number;

    @ApiProperty({ description: "Date To Pay", example: "20251125", required: true })
    @IsString()
    @IsNotEmpty()
    dateToPay!: string;

}

export class ReportResponseDto {
    @ApiProperty({ description: 'Type of the report' })
    reportType!: string;

    @ApiProperty({ description: 'Name of the PDF file' })
    pdfFileName!: string;

    @ApiProperty({ description: 'Date and time when the report was generated' })
    reportDateTime!: Date; // or `Date` if you want to use JS Date object

    @ApiProperty({ description: 'File path of the PDF' })
    filePath!: string;

    @ApiProperty({ description: 'Form type of the report' })
    formType!: string;
}