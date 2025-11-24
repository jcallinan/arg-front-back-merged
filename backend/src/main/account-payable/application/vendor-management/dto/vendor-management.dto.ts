import { BaseQueryDto } from '@src/shared/dto/base-query.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, ValidateNested, IsInt, Max, Min, ValidateIf } from "class-validator";

export class vendorMasterListDto extends BaseQueryDto {
    @ApiProperty({ description: "Company Number", example: 10, required: true })
    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    companyNo!: number;


    @ApiProperty({ description: "Open Payable", example: 1100, required: false })
    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    vendorNo?: number;


    @ApiProperty({ description: "Type", example: "E", required: false })
    @IsOptional()
    @IsString()
    @MaxLength(1)
    type?: string;


    @ApiProperty({ description: "Status", example: "A", required: false })
    @IsOptional()
    @IsString()
    status?: string;

}

export class VendorContactDetailDto {
    @ApiProperty({ description: "Form Type Cdoe", example: 1100, required: false })
    @IsOptional()
    @MaxLength(4)
    formType?: string;

    @ApiProperty({ description: "Contact Name", example: 'Contact Name', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    contactName?: string;

    @ApiProperty({ description: "Delete Code", example: 'I', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(1)
    deleteCode?: string;

    @ApiProperty({ description: "Email Address", example: "Email Address", required: false })
    @IsOptional()
    @IsString()
    @MaxLength(60)
    emailAddress?: string;

    @ApiProperty({ description: "Include ACH Email", example: "Y", required: false })
    @IsOptional()
    @IsString()
    @MaxLength(1)
    sendAchEmail?: string;

    @ApiProperty({ description: "comments", example: "test", required: false })
    @IsOptional()
    @IsString()
    @MaxLength(113)
    filler?: string;

    @ApiProperty({ description: "Sequence Number", example: 4538, required: false })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    sequenceNumber?: number;
}

export class vendorDetailsDto {

    @ApiProperty({ description: "Vendor Deleted", example: 'A', required: true })
    @IsString()
    @MaxLength(1) // VNDEL (STRING 1)
    vendorIsDeleted?: string;

    @ApiProperty({ description: "Company No", example: 10, required: true })
    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    vendorCompanyNumber!: number;

    @ApiProperty({ description: "Vendor No", example: 1100, required: true })
    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    vendorNo!: number;

    @ApiProperty({ description: "Vendor Name", example: 'ABCOTT Consulting', required: true })
    @IsNotEmpty()
    @IsString()
    @MaxLength(50) // VNNAME (STRING 50)
    vendorName!: string;

    @ApiProperty({ description: "Vendor Address 1", example: "Address", required: false })
    @IsString()
    @MaxLength(30) // VNADD1 (STRING 30)
    vendorAdd1!: string;

    @ApiProperty({ description: "Vendor Address 2", example: "Address", required: false })
    @IsString()
    @MaxLength(30)
    vendorAdd2?: string;

    @ApiProperty({ description: "Vendor Address 3", example: "Address", required: false })
    @IsString()
    @MaxLength(30)
    vendorAdd3?: string;

    @ApiProperty({ description: "Vendor Address 4", example: "Address", required: false })
    @IsString()
    @MaxLength(30)
    vendorAdd4?: string;

    @ApiProperty({ description: "Country", example: "US", required: true })
    @IsNotEmpty()
    @IsString()
    @MaxLength(3) // VNCTRY (STRING 3)
    vendorCountryCode!: string;

    @ApiProperty({ description: "1099 Id", example: "test", required: false })
    @IsString()
    @IsOptional()
    @MaxLength(11) // VNCTRY (STRING 3)
    IdNo1099?: string;

    @ApiProperty({ description: "ZipCode", example: 40110, required: true })
    @IsNotEmpty()
    @Type(() => Number)
    @Max(99999) // VNZIP5 (INTEGER max 99999)
    vendorZipCode!: number;

    @ApiProperty({ description: "Phone Area Code", example: 123, required: false })
    @Type(() => Number)
    @IsOptional()
    @ValidateIf((o) => o.vendorAreaCode !== 0)
    @Min(100, { message: 'Invalid Area Code' })
    @Max(999, { message: 'Invalid Area Code' }) // VNAREA (INTEGER max 999)
    vendorAreaCode?: number;

    @ApiProperty({ description: "Phone Number", example: 996793, required: false })
    @Type(() => Number)
    @IsOptional()
    @ValidateIf((o) => o.vendorTelephoneNo !== 0)
    @Min(1000000, { message: 'Invalid Phone Number' })
    @Max(9999999, { message: 'Invalid Phone Number' }) // VNTELE (INTEGER max 9999999)
    vendorTelephoneNo?: number;

    // Expense Details
    @ApiProperty({ description: "Hold Vendor", example: 'A', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(1) // VNHOLD (STRING 1)
    vendorHoldPaymentsVend?: string;

    @ApiProperty({ description: "Gal/Rcpts Required", example: 'A', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(1) // VNGRRQ (STRING 1)
    vendorGalRcptsRequired?: string;

    @ApiProperty({ description: "Single Check", example: 'A', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(1) // VNSNGL (STRING 1)
    vendorSingleCheck?: string;

    @ApiProperty({ description: "Terms Code", example: 10, required: false })
    @IsOptional()
    @Type(() => Number)
    @Max(99) // VNTERM (INTEGER max 99)
    vendorApTermsCode?: number;

    @ApiProperty({ description: "ADP Payroll ID", example: 123, required: false })
    @IsOptional()
    @Type(() => Number)
    @Max(9999999) // VNPRID (INTEGER max 9999999)
    vendorAdpPayrollId?: number;

    @ApiProperty({ description: "Category", example: 'INACT', required: false })
    @IsOptional()
    @MaxLength(6) // VNCATG (STRING 6)
    vendorCategoryCode?: string;

    @ApiProperty({ description: "Carrier", example: 'ACSS', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(6) // VNCAID (STRING 6)
    vendorCarrierId?: string;

    @ApiProperty({ description: "Expense GL", example: 12345678, required: false })
    @IsOptional()
    @Type(() => Number)
    @Max(99999999) // VNEXGL (INTEGER max 99999999)
    vendorExpenseGLSub?: number;

    // Bank Details
    @ApiProperty({ description: "ACH Bank Account", example: '12345678901234567', required: false })
    @IsOptional()
    @MaxLength(17) // VNABK# (STRING 17)
    vendorAchBankAccountNumber?: string;

    @ApiProperty({ description: "ACH Bank Routing", example: 123456789, required: false })
    @IsOptional()
    @Type(() => Number)
    @Max(999999999) // VNARTE (INTEGER max 999999999)
    vendorAchBankRoutingCode?: number;

    @ApiProperty({ description: "ACH Checking or Savings", example: 'C', required: false })
    @IsOptional()
    @MaxLength(1) // VNACOS (STRING 1)
    vendorAchCheckingOrSavings?: string;

    @ApiProperty({ description: "ACH Class", example: 'ABC', required: false })
    @IsOptional()
    @MaxLength(3) // VNACLS (STRING 3)
    vendorAchClass?: string;

    // 1099 Section
    @ApiProperty({ description: "First Name", example: 'John', required: false })
    @IsOptional()
    @MaxLength(20) // VNFNAM (STRING 20)
    vendorFirstName?: string;

    @ApiProperty({ description: "Middle Name", example: 'M', required: false })
    @IsOptional()
    @MaxLength(20) // VNMNAM (STRING 20)
    vendorMiddleName?: string;

    @ApiProperty({ description: "Last Name", example: 'Doe', required: false })
    @IsOptional()
    @MaxLength(30) // VNLNAM (STRING 30)
    vendorBusinessLastName?: string;

    @ApiProperty({ description: "Suffix", example: 'Jr', required: false })
    @IsOptional()
    @MaxLength(4) // VNSUFF (STRING 4)
    vendorNameSuffix?: string;

    @ApiProperty({ description: "1099 Code", example: 'A', required: false })
    @IsOptional()
    @MaxLength(1) // VN1099 (STRING 1)
    vendorAp1099Code?: string;

    @ApiProperty({ description: "1st 1099 Box#", example: 10, required: false })
    @IsOptional()
    @Type(() => Number)
    @Max(99) // VNBOX1 (INTEGER max 99)
    vendorFirst1099BoxNumber?: number;

    @ApiProperty({ description: "2nd Box#", example: 20, required: false })
    @IsOptional()
    @Type(() => Number)
    @Max(99) // VNBOX2 (INTEGER max 99)
    vendorSecond1099BoxNumber?: number;

    @ApiProperty({ description: "2nd Box Amt", example: 2000.50, required: false })
    @IsOptional()
    @Max(999999999.99)
    vendorSecond1099BoxAmount?: number; // VNB2AM (DECIMAL 11,2)

    @ApiProperty({ description: "Payee #1", example: 'John Smith', required: false })
    @IsOptional()
    @MaxLength(40) // VNPYN1 (STRING 40)
    vendorPayeeName1?: string;

    @ApiProperty({ description: "Payee #2", example: 'Jane Smith', required: false })
    @IsOptional()
    @MaxLength(40) // VNPYN2 (STRING 40)
    vendorPayeeName2?: string;

    @ApiProperty({ description: "IRS Name Control", example: 'CTRL', required: false })
    @IsOptional()
    @MaxLength(4) // VNNMCT (STRING 4)
    vendorIrsNameControl?: string;

}

export class vendorandVendorContactDetailsInputDto extends vendorDetailsDto {
    
    @ApiProperty({
        description: "Vendor Contact Details",
        type: () => VendorContactDetailDto,
        isArray: true,
        required: false
    })
    @ValidateNested({ each: true })
    @Type(() => VendorContactDetailDto)
    contactDetails?: VendorContactDetailDto[];
}


export class vendorOwnerList extends BaseQueryDto {
    @ApiProperty({ description: "Company No", example: 10, required: true })
    @Type(() => Number)
    @IsNumber()
    vendorCompanyNumber!: number;

    @ApiProperty({ description: "Vendor No", example: 1444, required: true })
    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    vendorNo?: number;

    @ApiProperty({ description: "Status", example: 'A', required: true })
    @IsString()
    @IsOptional()
    @MaxLength(1)
    status?: string;

    @ApiProperty({ description: "Owner No", example: 2527, required: true })
    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    ownerNo!: number;
}

export class vendorOwnerDto {
    @ApiProperty({ description: "Owner No", example: 63, required: true })
    @Type(() => Number)
    @IsNumber()
    @IsInt({ message: "Owner No must be a valid integer without special characters" })
    ownerNo!: number;

    @ApiProperty({ description: "Vendor No", example: 1444, required: true })
    @Type(() => Number)
    @IsNumber()
    vendorNo!: number;

    @ApiProperty({ description: "Status", example: "I", required: true })
    @IsString()
    isDeleted!: string;
}

export class vendorOwnerDetailsDto {
    @ApiProperty({ description: "Owner No", example: 63875, required: true })
    @Type(() => Number)
    @IsNumber()
    ownerNo!: number;

    @ApiProperty({ description: "Vendor No", example: 1444, required: true })
    @Type(() => Number)
    @IsNumber()
    vendorNo!: number;
}

export class vendorNextNoConfig {
    @ApiProperty({ description: "Company No", example: 10, required: true })
    @Type(() => Number)
    @IsNumber()
    companyNo!: number;

}
export class vendorDetailDto {
    @ApiProperty({ description: "Company No", example: 10, required: true })
    @Type(() => Number)
    @IsNumber()
    vendorCompanyNumber!: number;

    @ApiProperty({ description: "Vendor No", example: 1444, required: true })
    @Type(() => Number)
    @IsNumber()
    vendorNo!: number;
}

export class VendorContactDetailsDto {
    @ApiProperty({ description: 'Delete Code', example: ' ' })
    deleteCode!: string;

    @ApiProperty({ description: 'Company Number', example: 10 })
    companyNo!: number;

    @ApiProperty({ description: 'Vendor Number', example: 9875 })
    vendorNo!: number;

    @ApiProperty({ description: 'Form Type', example: 'ABCY' })
    formType!: string;

    @ApiProperty({ description: 'Sequence Number', example: 232577 })
    sequenceNumber!: number;

    @ApiProperty({ description: 'Contact Name', example: 'Abhishek' })
    contactName!: string;

    @ApiProperty({ description: 'Email Address', example: 'abhishek@amref.com' })
    emailAddress!: string;

    @ApiProperty({ description: 'Fax Number', example: ' ' })
    faxNumber!: string;

    @ApiProperty({ description: 'Send ACH Email', example: 'Y' })
    sendAchEmail!: string;

    @ApiProperty({ description: 'Filler', example: ' ' })
    filler!: string;

    @ApiProperty({ description: 'Form Type Description', example: 'W-9 Form' })
    formtypeDescription!: string;
}

export class VendorDto {
    @ApiProperty({ description: 'Vendor Is Deleted', example: 'A' })
    vendorIsDeleted!: string;

    @ApiProperty({ description: 'Vendor Company Number', example: 10 })
    vendorCompanyNumber!: number;

    @ApiProperty({ description: 'Vendor Number', example: 9875 })
    vendorNo!: number;

    @ApiProperty({ description: 'Vendor Name', example: 'Abhishek Consulting' })
    vendorName!: string;

    @ApiProperty({ description: 'Vendor Address 1', example: '77 North Kendall' })
    vendorAdd1!: string;

    @ApiProperty({ description: 'Vendor Address 2', example: 'Bradford, PA 16701' })
    vendorAdd2!: string;

    @ApiProperty({ description: 'Vendor Address 3', example: 'Address' })
    vendorAdd3!: string;

    @ApiProperty({ description: 'Vendor Address 4', example: 'Address' })
    vendorAdd4!: string;

    @ApiProperty({ description: 'Vendor Zip Code', example: 4015 })
    vendorZipCode!: number;

    @ApiProperty({ description: 'Vendor Extra Zip', example: 0 })
    vendorExtraZip!: number;

    @ApiProperty({ description: 'Vendor Alpha Sort Abbreviation', example: ' ' })
    vendorAlphaSortAbbr!: string;

    @ApiProperty({ description: 'Vendor Area Code', example: 0 })
    vendorAreaCode!: number;

    @ApiProperty({ description: 'Vendor Telephone Number', example: 996 })
    vendorTelephoneNo!: number;

    @ApiProperty({ description: '1099 Id', example: "Test" })
    IdNo1099!: string;

    @ApiProperty({ description: 'Vendor Last Payment Amount', example: 0 })
    vendorLastPaymentAmt!: number;

    @ApiProperty({ description: 'Vendor Last Payment Date', example: 0 })
    vendorLastPaymentDate!: number;

    @ApiProperty({ description: 'Vendor Year To Date Purchases', example: 0 })
    vendorYtdPurchases!: number;

    @ApiProperty({ description: 'Vendor Last Year Purchases', example: 0 })
    vendorLastYearPurchases!: number;

    @ApiProperty({ description: 'Vendor Month To Date Discounts', example: 0 })
    vendorMtdDiscounts!: number;

    @ApiProperty({ description: 'Vendor Year To Date Discounts', example: 0 })
    vendorYtdDiscounts!: number;

    @ApiProperty({ description: 'Vendor Name Overflow', example: ' ' })
    vendorNameOverflow!: string;

    @ApiProperty({ description: 'Vendor GAL Receipts Required', example: 'T' })
    vendorGalRcptsRequired!: string;

    @ApiProperty({ description: 'Vendor Filler', example: '  ' })
    vendorFiller!: string;

    @ApiProperty({ description: 'Vendor Previous Balance', example: 0 })
    vendorPreviousBalance!: number;

    @ApiProperty({ description: 'Vendor Month To Date Purchases', example: 0 })
    vendorMtdPurchases!: number;

    @ApiProperty({ description: 'Vendor Month To Date Payments', example: 0 })
    vendorMtdPayments!: number;

    @ApiProperty({ description: 'Vendor Current Balance', example: 0 })
    vendorCurrentBalance!: number;

    @ApiProperty({ description: 'Vendor Hold Payments Vendor', example: 'A' })
    vendorHoldPaymentsVend!: string;

    @ApiProperty({ description: 'Vendor Single Check', example: 'T' })
    vendorSingleCheck!: string;

    @ApiProperty({ description: 'Vendor This Year YTD Paid', example: 0 })
    vendorThisYrYtdPaid!: number;

    @ApiProperty({ description: 'Vendor Last Year YTD Paid', example: 0 })
    vendorLastYrYtdPaid!: number;

    @ApiProperty({ description: 'Vendor Expense GL Sub', example: 1234 })
    vendorExpenseGLSub!: number;

    @ApiProperty({ description: 'Vendor AP Terms Code', example: 10 })
    vendorApTermsCode!: number;

    @ApiProperty({ description: 'Vendor AP 1099 Code', example: 'T' })
    vendorAp1099Code!: string;

    @ApiProperty({ description: 'Vendor ID Number', example: ' ' })
    vendorIdNumber!: string;

    @ApiProperty({ description: 'Vendor First 1099 Box Number', example: 1 })
    vendorFirst1099BoxNumber!: number;

    @ApiProperty({ description: 'Vendor Second 1099 Box Number', example: 2 })
    vendorSecond1099BoxNumber!: number;

    @ApiProperty({ description: 'Vendor Second 1099 Box Amount', example: 50 })
    vendorSecond1099BoxAmount!: number;

    @ApiProperty({ description: 'Vendor Last Payment Date Alt', example: 0 })
    vendorLastPaymentDateAlt!: number;

    @ApiProperty({ description: 'Vendor Carrier ID', example: ' ' })
    vendorCarrierId!: string;

    @ApiProperty({ description: 'Vendor Payee Name 1', example: 'Test' })
    vendorPayeeName1!: string;

    @ApiProperty({ description: 'Vendor Payee Name 2', example: 'Test' })
    vendorPayeeName2!: string;

    @ApiProperty({ description: 'Vendor IRS Name Control', example: 'T' })
    vendorIrsNameControl!: string;

    @ApiProperty({ description: 'Vendor ADP Payroll ID', example: 123 })
    vendorAdpPayrollId!: number;

    @ApiProperty({ description: 'Vendor ACH Class', example: 'A' })
    vendorAchClass!: string;

    @ApiProperty({ description: 'Vendor ACH Checking Or Savings', example: 'C' })
    vendorAchCheckingOrSavings!: string;

    @ApiProperty({ description: 'Vendor ACH Bank Routing Code', example: 123456789 })
    vendorAchBankRoutingCode!: number;

    @ApiProperty({ description: 'Vendor ACH Bank Account Number', example: 'Test' })
    vendorAchBankAccountNumber!: string;

    @ApiProperty({ description: 'Vendor First Name', example: 'Test' })
    vendorFirstName!: string;

    @ApiProperty({ description: 'Vendor Middle Name', example: 'Test' })
    vendorMiddleName!: string;

    @ApiProperty({ description: 'Vendor Business Last Name', example: 'Test' })
    vendorBusinessLastName!: string;

    @ApiProperty({ description: 'Vendor Name Suffix', example: 'Sr' })
    vendorNameSuffix!: string;

    @ApiProperty({ description: 'Vendor Country Code', example: 'US' })
    vendorCountryCode!: string;

    @ApiProperty({ description: 'Vendor Category Code', example: 'INA' })
    vendorCategoryCode!: string;

    @ApiProperty({ description: 'Vendor Filler 2', example: ' ' })
    vendorFiller2!: string;

    @ApiProperty({ description: 'Vendor AP Terms Code Description', example: 'Net 30 Days' })
    vendorApTermsCodeDescription?: string;

    @ApiProperty({ description: 'Vendor AP 1099 Code Description', example: 'Independent Contractor' })
    vendorAp1099CodeDescription?: string;

    @ApiProperty({ description: 'Vendor Category Code Description', example: 'Supplier' })
    vendorCategoryCodeDescription?: string;
}

export class VendorResponseDto {
    @ApiProperty({ description: 'Vendor Details' })
    vendor!: VendorDto;

    @ApiProperty({ description: 'Vendor Contact Details', type: [VendorContactDetailDto] })
    vendorContactDetails!: VendorContactDetailsDto[];
}
