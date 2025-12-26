import {
  Injectable,
  Logger,
  Inject,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import {
  errorResponse,
  paginatedResponse,
  PaginatedResponse,
} from "@src/shared/utils/response-formatter";
import { ERROR_CONSTANTS } from "@src/shared/constants/error-constant";
import {
  purchaseJournalReportDto,
  SubmitPurchaseJournalDto,
  PurchaseJournalEntryDto,
  PrepaidValidationResponseDto,
  PrepaidValidationErrorDto,
} from "@src/main/account-payable/application/purchase-journal/dto/purchase-journal.dto";
import { SpooledMetaDataReportInterface } from "../../interface/spooled-meta-data-report.interface";
import { SpooledMetaDataReportEntity } from "../../entities/spooled-meta-data-report.entity";
import {
  VoucherDetailInterface,
  VoucherHeaderHistoryInterface,
  VoucherDetailHistoryInterface,
} from "@src/main/account-payable/domain/interface/voucher.interface";
import { CheckInquiryInterface } from "@src/main/account-payable/domain/interface/check-inquiry.interface";
import { VoucherAppService } from "@src/main/account-payable/domain/services/voucher/voucher.service";
import { ReportService } from "@src/main/account-payable/domain/services/report/report.service";
import {
  VoucherHeader,
  VoucherDetail,
} from "@src/main/account-payable/domain/entities/voucher.entity";
import { VOUCHER_STATUS_CODES } from "@src/shared/constants/status-map";
import {
  POST_TO_PURCHASE_JOURNAL_STORE_PROCEDURE,
  Report_Type,
} from "@src/shared/constants/constant";
import { callSP } from "@src/shared/config/store-procedure-config";
import { currentUserInitials } from "@src/shared/utils/user-context";
import { StoredProcedureType } from "@src/shared/constants/voucher-type.enum";
import { MakePrepaidFlag } from "@src/shared/constants/payment-constant";
import { CACHE_KEYS } from "@src/shared/cache/cache.config";
import { CacheService } from "@src/shared/cache/cache.service";

@Injectable()
export class PurchaseJournalService {
  private readonly logger = new Logger(PurchaseJournalService.name);

  constructor(
    @Inject("SpooledMetaDataReportInterface")
    private readonly SpooledMetaDataRepository: SpooledMetaDataReportInterface,
    private readonly voucherAppService: VoucherAppService,
    @Inject("VoucherDetailInterface")
    private readonly voucherDetailInterface: VoucherDetailInterface,
    @Inject("VoucherHeaderHistoryInterface")
    private readonly voucherHeaderHistoryInterface: VoucherHeaderHistoryInterface,
    @Inject("VoucherDetailHistoryInterface")
    private readonly voucherDetailHistoryInterface: VoucherDetailHistoryInterface,
    @Inject("CheckInquiryInterface")
    private readonly checkInquiryInterface: CheckInquiryInterface,
    private readonly reportService: ReportService,
    private readonly cacheService: CacheService
  ) {}

  async SpooledMetadataReports(
    dto: purchaseJournalReportDto
  ): Promise<PaginatedResponse<SpooledMetaDataReportEntity>> {
    this.logger.log(`Get list for Spooled Meta Data Reports`);
    const { reports, count, limit, page } =
      await this.SpooledMetaDataRepository.SpooledMetadataReports(dto);

    this.logger.log(`Get list for Spooled Meta Data Reports`);

    if (!reports) {
      this.logger.warn("Reports not found");

      throw new HttpException(
        errorResponse(ERROR_CONSTANTS.NOT_FOUND, [
          {
            field: "apGLNo",
            code: ERROR_CONSTANTS.NOT_FOUND.code,
            message: "Record not found",
          },
        ]),
        HttpStatus.NOT_FOUND
      );
    }

    return paginatedResponse(reports, count, page, limit);
  }

  async submitPurchaseJournal(dto: SubmitPurchaseJournalDto) {
    this.logger.log(`Submitting Post to Purchase Journal`);
    const { entries, companyNo, purchaseJD, keyCashDJD } = dto;
    //loop through entries make thier status to P

     // Validate prepaid entries before processing
     const validationResult = await this.validatePrepaidEntries(entries);
     if (!validationResult.isValid) {
       const errorDetails = validationResult.errors.map(err => ({
         field: "entryNo",
         code: err.code,
         message: err.message
       }));
       throw new HttpException(
         errorResponse(ERROR_CONSTANTS.VALIDATION_ERROR, errorDetails),
         HttpStatus.BAD_REQUEST
       );
     }

     // Separate entries into normal and prepaid
    const normalEntries = entries.filter(entry => entry.prepaidCode !==  MakePrepaidFlag.PREPAID && entry.prepaidCode !== MakePrepaidFlag.EMPLOYEE_EXPENSE && entry.prepaidCode !== MakePrepaidFlag.WIRE && entry.prepaidCode !== MakePrepaidFlag.ADVANCE);
    const prepaidEntries = entries.filter(entry => entry.prepaidCode ===  MakePrepaidFlag.PREPAID || entry.prepaidCode === MakePrepaidFlag.EMPLOYEE_EXPENSE || entry.prepaidCode === MakePrepaidFlag.WIRE || entry.prepaidCode === MakePrepaidFlag.ADVANCE);
    
    this.logger.log(` [PURCHASE JOURNAL] Normal entries: ${normalEntries.length}, Prepaid entries: ${prepaidEntries.length}`);
    
    const processedEntries = await Promise.all(
      entries.map((entry) => this.processPurchaseJournalEntry(entry))
    );

    //Get path frpm process type
    const reportList = await this.reportService.getListByReportType(
      Report_Type.VOUCHER_POSTING
    );

    const path = reportList[0]?.path?.trim() ?? "";
    const userId = ""; //This parameter should be blank until USER id is in place for adding record while adding voucher entry.
  
    const user = currentUserInitials();
    this.logger.debug(`user: ${user}`);

    //Call the stored procedure
    const normalResult = await this.callStoredProcedureForEntries(normalEntries, StoredProcedureType.NORMAL, "000000", companyNo, userId, user, purchaseJD, path);
    const prepaidResult = await this.callStoredProcedureForEntries(prepaidEntries, StoredProcedureType.PREPAID, keyCashDJD, companyNo, userId, user, purchaseJD, path);
    
    // Use the last result for backward compatibility (or combine results as needed)
    const spResult = prepaidResult || normalResult;

    this.logger.debug(
      `Purchase journal submitted: ${JSON.stringify(spResult)}`
    );

    //Insert history records
    await this.createHistoryFromProcessedEntries(processedEntries);

    //Delete all entries
    await Promise.all(
      entries.map((entry) => this.voucherAppService.hardDeleteVoucher(entry))
    );

    await this.cacheService.delete(CACHE_KEYS.COMPANY.BY_ID(companyNo));

    return {
      message: "Purchase Journal submitted successfully",
      spResult,
      processedEntries,
    };
  }

  private async validatePrepaidEntries(entries: PurchaseJournalEntryDto[]): Promise<PrepaidValidationResponseDto> {
    this.logger.log(` [PREPAID VALIDATION] Starting validation for ${entries.length} entries`);
    
    const errors: PrepaidValidationErrorDto[] = [];
    const success: PurchaseJournalEntryDto[] = [];
    
    // Filter entries that need validation (prepaidCode = "P" and have prepaidCheckNo)
    const prepaidEntries = entries.filter(entry => 
      entry.prepaidCode ===  MakePrepaidFlag.PREPAID && entry.prepaidCheckNo
    );
    
    this.logger.log(`Found ${prepaidEntries.length} prepaid entries to validate`);
    
    if (prepaidEntries.length === 0) {
      // No prepaid entries to validate, all entries are successful
      this.logger.log(` [PREPAID VALIDATION] No prepaid entries found, all entries are valid`);
      return {
        isValid: true,
        errors: [],
        success: entries
      };
    }
    
    // Group entries by prepaidCheckNo AND bankGl combination
    const groupedByCheckAndBank = new Map<string, PurchaseJournalEntryDto[]>();
    prepaidEntries.forEach(entry => {
      const checkNo = entry.prepaidCheckNo!;
      const bankGl = entry.bankGl;
      
      this.logger.log(` [PREPAID VALIDATION] Processing entry ${entry.entryNo}: checkNo=${checkNo}, bankGl=${bankGl}`);
      
      if (!bankGl) {
        // Add to errors if bankGl is missing
        this.logger.log(` [PREPAID VALIDATION] Entry ${entry.entryNo} missing bankGl`);
        errors.push({
          entryNo: entry.entryNo,
          message: "Bank GL number is required for prepaid check validation",
          code: "MISSING_BANK_GL"
        });
        return;
      }
      
      const groupKey = `${checkNo}-${bankGl}`;
      if (!groupedByCheckAndBank.has(groupKey)) {
        groupedByCheckAndBank.set(groupKey, []);
        this.logger.log(` [PREPAID VALIDATION] Created new group: ${groupKey}`);
      }
      groupedByCheckAndBank.get(groupKey)!.push(entry);
      this.logger.log(` [PREPAID VALIDATION] Added entry ${entry.entryNo} to group ${groupKey}`);
    });
    
    this.logger.log(` [PREPAID VALIDATION] Created ${groupedByCheckAndBank.size} groups for validation`);
    
    // Validate each group
    for (const [groupKey, groupEntries] of groupedByCheckAndBank) {
      this.logger.log(` [PREPAID VALIDATION] Validating group: ${groupKey} with ${groupEntries.length} entries`);
      
      try {
        // Calculate total invoice amount (make all positive)
        const totalInvoiceAmount = groupEntries.reduce((sum, entry) => {
          const amount = entry.invoiceAmount || 0;
          return sum + Math.abs(amount);
        }, 0);
        
        this.logger.log(` [PREPAID VALIDATION] Group ${groupKey} - Total invoice amount: ${totalInvoiceAmount}`);
        
        // Get all entryNos and vendorNos for this group
        const entryNos = groupEntries.map(entry => entry.entryNo);
        const vendorNos = groupEntries.map(entry => entry.vendorNo);
        
        this.logger.log(` [PREPAID VALIDATION] Group ${groupKey} - EntryNos: [${entryNos.join(', ')}], VendorNos: [${vendorNos.join(', ')}]`);
        
        // Get discount amounts for all entryNos with vendor numbers
        const totalDiscountAmount = await this.getTotalDiscountAmount(entryNos, vendorNos);
        
        this.logger.log(` [PREPAID VALIDATION] Group ${groupKey} - Total discount amount: ${totalDiscountAmount}`);
        
        // Calculate final amount
        const finalAmount = totalInvoiceAmount - totalDiscountAmount;
        
        this.logger.log(` [PREPAID VALIDATION] Group ${groupKey} - Final amount (invoice - discount): ${finalAmount}`);
        
        // Extract checkNo and bankGl from groupKey
        const [checkNo, bankGlStr] = groupKey.split('-');
        const bankGl = Number(bankGlStr);
        
        if (!checkNo) {
          throw new Error("Invalid group key format");
        }
        
        this.logger.log(` [PREPAID VALIDATION] Group ${groupKey} - Validating against APCHKR: checkNo=${checkNo}, bankGl=${bankGl}, amount=${finalAmount}`);
        
        // Validate against APCHKR table
        await this.validateCheckInquiryHistory(checkNo, finalAmount, groupEntries, bankGl);
        
        this.logger.log(` [PREPAID VALIDATION] Group ${groupKey} - Validation passed!`);
        
        // If validation passes, add to success
        success.push(...groupEntries);
        
      } catch (error) {
        // Add all entries in this group to errors
        const errorMessage = error instanceof Error ? error.message : "Validation failed";
        this.logger.log(` [PREPAID VALIDATION] Group ${groupKey} - Validation failed: ${errorMessage}`);
        
        groupEntries.forEach(entry => {
          errors.push({
            entryNo: entry.entryNo,
            message: errorMessage,
            code: "PREPAID_VALIDATION_ERROR"
          });
        });
      }
    }
    
    // Add non-prepaid entries to success
    const nonPrepaidEntries = entries.filter(entry => 
      !(entry.prepaidCode ===  MakePrepaidFlag.PREPAID && entry.prepaidCheckNo)
    );
    success.push(...nonPrepaidEntries);
    
    this.logger.log(` [PREPAID VALIDATION] Final results: ${success.length} successful, ${errors.length} errors`);
    this.logger.log(` [PREPAID VALIDATION] Non-prepaid entries: ${nonPrepaidEntries.length}`);
    
    const result = {
      isValid: errors.length === 0,
      errors,
      success
    };
    
    this.logger.log(` [PREPAID VALIDATION] Validation completed. Valid: ${result.isValid}`);
    return result;
  }

  private async getTotalDiscountAmount(entryNos: number[], vendorNos: number[]): Promise<number> {
    this.logger.log(` [DISCOUNT CALC] Getting total discount amount for entryNos: [${entryNos.join(', ')}] and vendorNos: [${vendorNos.join(', ')}]`);
    
    let totalDiscount = 0;
    
    for (let i = 0; i < entryNos.length; i++) {
      const entryNo = entryNos[i];
      const vendorNo = vendorNos[i];
      const CompanyNo = 10;
      
      this.logger.log(` [DISCOUNT CALC] Processing entryNo: ${entryNo}, vendorNo: ${vendorNo}`);
      
      const details = await this.voucherDetailInterface.findByEntry(CompanyNo, entryNo, vendorNo);
      
      if (details && details.length > 0) {
        this.logger.log(` [DISCOUNT CALC] Found ${details.length} voucher details for entryNo: ${entryNo}`);
        
        const entryDiscount = details.reduce((sum, detail) => {
          // Calculate discount amount using discountPercentage and productAmount
          let calculatedDiscountAmount = 0;
          if (detail.discountPercentage && detail.productAmount) {
            calculatedDiscountAmount = detail.productAmount * (detail.discountPercentage / 100);
          }
          
          // Add both the calculated discount amount and existing discountAmount
          const totalDetailDiscount = calculatedDiscountAmount + (detail.discountAmount || 0);
          this.logger.log(` [DISCOUNT CALC] EntryNo ${entryNo} - Detail discount: ${totalDetailDiscount} (calculated: ${calculatedDiscountAmount}, fixed: ${detail.discountAmount || 0})`);
          
          return sum + totalDetailDiscount;
        }, 0);
        
        this.logger.log(` [DISCOUNT CALC] EntryNo ${entryNo} total discount: ${entryDiscount}`);
        totalDiscount += entryDiscount;
      } else {
        this.logger.log(` [DISCOUNT CALC] No voucher details found for entryNo: ${entryNo}, vendorNo: ${vendorNo}`);
      }
    }
    
    this.logger.log(` [DISCOUNT CALC] Total discount amount: ${totalDiscount}`);
    return totalDiscount;
  }


  private async validateCheckInquiryHistory(checkNo: string, amount: number, entries: PurchaseJournalEntryDto[], bankGl: number): Promise<void> {
    this.logger.log(` [APCHKR VALIDATION] Validating check inquiry history for checkNo: ${checkNo}, bankGl: ${bankGl}, amount: ${amount}`);
    
    // Get entry numbers for better error messages
    const entryNos = entries.map(entry => entry.entryNo).join(', ');
    this.logger.log(` [APCHKR VALIDATION] Validating for entries: [${entryNos}]`);
    
    // Use the new validation method with bankGl for purchase journal
    const validationData = {
      checkNo: Number(checkNo),
      checkAmount: amount,
      clearDateMmddyy: "000000", // Not used in validation
      rowIndex: entryNos, // Pass entry numbers for better error messages
      bankGl: bankGl // Required for purchase journal validation
    };
    
    this.logger.log(` [APCHKR VALIDATION] Validation data:`, validationData);
    
    const result = await this.checkInquiryInterface.validateCheckInquiryHistoryWithBankGl(validationData);
    
    this.logger.log(` [APCHKR VALIDATION] Validation result:`, { isValid: result.isValid, errors: result.errors });
    
    if (!result.isValid) {
      const errorMessage = result.errors.map(err => err.message).join('; ');
      this.logger.log(` [APCHKR VALIDATION] Validation failed: ${errorMessage}`);
      throw new Error(errorMessage);
    }
    
    this.logger.log(`Check inquiry validation passed for checkNo: ${checkNo}, bankGl: ${bankGl}`);
  }

  private async processPurchaseJournalEntry(entry: PurchaseJournalEntryDto) {
    this.logger.log(
      `Processing purchase journal entry: ${JSON.stringify(entry)}`
    );
    try {
      const voucherHeaderData = {
        invoiceNo: entry.invoiceNo,
        companyNo: entry.companyNo,
        entryNo: entry.entryNo,
        vendorNo: entry.vendorNo,
        entrySequence: 0,
        status: VOUCHER_STATUS_CODES.P,
      };

      // Upsert header
      const headerItem =
        await this.voucherAppService.createOrUpdateVoucherHeader(
          voucherHeaderData
        );
      if (!headerItem) {
        throw new HttpException(
          errorResponse(ERROR_CONSTANTS.NOT_FOUND, [
            {
              field: "entryNo",
              code: ERROR_CONSTANTS.NOT_FOUND.code,
              message: `No Matching record found for entry ${entry.entryNo}.`,
            },
          ]),
          HttpStatus.NOT_FOUND
        );
      }

      // Process details
      const detailItems = await this.voucherDetailInterface.findByEntry(
        entry.companyNo,
        entry.entryNo,
        entry.vendorNo
      );

      if (!detailItems || detailItems.length === 0) {
        throw new HttpException(
          errorResponse(ERROR_CONSTANTS.NOT_FOUND, [
            {
              field: "entryNo",
              code: ERROR_CONSTANTS.NOT_FOUND.code,
              message: `No detail records found for entry ${entry.entryNo}.`,
            },
          ]),
          HttpStatus.NOT_FOUND
        );
      }

      const updatedDetails = detailItems.map((item) => ({
        ...item,
        status: VOUCHER_STATUS_CODES.P,
      })) as VoucherDetail[];

      await this.voucherAppService.createOrUpdateVoucherDetail(updatedDetails);

      this.logger.log(
        `Successfully updated voucher header & details for entry ${entry.entryNo}`
      );

      return {
        header: headerItem,
        details: updatedDetails,
      };
    } catch (error) {
      // Re-throw as clean HTTP error if not already one
      if (!(error instanceof HttpException)) {
        // Case 1: Unexpected or unhandled error type
        throw new HttpException(
          errorResponse(ERROR_CONSTANTS.SERVER_ERROR, [
            {
              field: "entryNo",
              code: ERROR_CONSTANTS.SERVER_ERROR.code,
              message: `Unexpected error while processing entry ${entry.entryNo}.`,
            },
          ]),
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
      throw error; // Case 2: Already a HttpException — rethrow unchanged
    }
  }

  private async createHistoryFromProcessedEntries(
    processedEntries: {
      header: VoucherHeader;
      details: VoucherDetail[];
    }[]
  ) {
   
    this.logger.log(` [HISTORY CREATION] Processing ${processedEntries.length} entries for history creation`);

    for (let i = 0; i < processedEntries.length; i++) {
      const entry = processedEntries[i];
      if (!entry) continue;
      
      const { header, details } = entry;
      const entryNo = header.entryNo;
      
      try {
        this.logger.log(` [HISTORY CREATION] Creating history for entry ${entryNo} (${i + 1}/${processedEntries.length})`);
        
        this.logger.log(` [HISTORY CREATION] Details count: ${details.length}`);

        await Promise.all([
          this.voucherHeaderHistoryInterface.create(header),
          this.voucherDetailHistoryInterface.create(details),
        ]);

        this.logger.log(` [HISTORY CREATION] Successfully created history for entry ${entryNo}`);
        
       
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Server error';
        this.logger.log(` [HISTORY CREATION] Failed to create history for entry ${entryNo}: ${errorMessage}`);
        throw error; // Re-throw to trigger retry logic
      }
    }

  
    this.logger.log(` [HISTORY CREATION] All ${processedEntries.length} entries processed successfully`);

  }

  private async callStoredProcedureForEntries(
    entries: PurchaseJournalEntryDto[],
    type: StoredProcedureType,
    keyCashDJD: string,
    companyNo: number,
    userId: string,
    user: string,
    purchaseJD: string,
    path: string
  ): Promise<any> {
    if (entries.length === 0) return null;
    
    this.logger.log(`[PURCHASE JOURNAL] Calling SP for ${entries.length} ${type} entries with keyCashDJD: "${keyCashDJD}"`);
    
    const result = await callSP(POST_TO_PURCHASE_JOURNAL_STORE_PROCEDURE.AP200PRC).execute({
      companyNo,
      userId,
      user,
      purchaseJD,
      keyCashDJD,
      path,
    });

    this.logger.log(` [PURCHASE JOURNAL] ${type} entries SP result:`, result);
    return result;
  }
}
