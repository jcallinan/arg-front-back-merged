import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { SubmitVoucherDto } from "../../dto/voucher.dto";
import { AppLogger } from "@src/shared/logger/logger.service";
import { VoucherDetailValidationService } from "../../shared-services/voucher-detail.shared.service";
import { VoucherSharedService } from "../../shared-services/voucher.shared.service";
import { ErrorType } from "@src/shared/utils/error-handler";
import { VoucherAppService } from "@src/main/account-payable/domain/services/voucher/voucher.service";
import { ERROR_CONSTANTS } from "@src/shared/constants/error-constants";
import { errorResponse } from "@src/shared/utils/response-formatter";
import { VOUCHER_STATUS_CODES } from "@src/shared/constants/status-map";

@Injectable()
export class SubmitVoucherUseCase {
  private readonly logger = new AppLogger(SubmitVoucherUseCase.name);

  constructor(
    private readonly voucherDetailValidationService: VoucherDetailValidationService,
    private readonly voucherSharedService: VoucherSharedService,
    private readonly voucherAppService: VoucherAppService, 
  ) {}

  async execute(dto: SubmitVoucherDto) {
    const startTime = Date.now();
    this.logger.sharedTiming("Starting voucher submission", startTime, "start");

    this.logger.log("Submitting voucher");
    const { header, details } = dto;

    this.logger.sharedTiming("DTO destructuring completed", startTime);
    this.logger.log(
      `Processing voucher submission with ${details?.length || 0} details for company ${header?.companyNo}, vendor ${header?.vendorNo}`
    );

    //Validate header
    const headerValidationStartTime = Date.now();
    this.logger.sharedTiming("Starting header validation", startTime);

    const headerValidationResult =
      await this.voucherSharedService.headerValidation(header);

    this.logger.sharedTiming(
      `Header validation completed (${Date.now() - headerValidationStartTime}ms)`,
      startTime
    );

    if (
      Array.isArray(headerValidationResult) &&
      headerValidationResult.length > 0
    ) {
      this.logger.sharedTiming(
        `Header validation failed with ${headerValidationResult.length} errors`,
        startTime,
        "end"
      );
      throw new HttpException(
        errorResponse(ERROR_CONSTANTS.VALIDATION_ERROR, headerValidationResult),
        HttpStatus.BAD_REQUEST
      );
    }

    let newDueDate: number | undefined;
    let newDiscountDueDate: number | undefined;
    let foundVendor: any;

    if (
      headerValidationResult &&
      typeof headerValidationResult === "object" &&
      !Array.isArray(headerValidationResult)
    ) {
      // Check if it's an error response
      if ("errors" in headerValidationResult) {
        throw new HttpException(
          errorResponse(
            ERROR_CONSTANTS.VALIDATION_ERROR,
            headerValidationResult.errors
          ),
          HttpStatus.BAD_REQUEST
        );
      }
      // Check if it's a success response
      else if (
        "newDueDate" in headerValidationResult &&
        "newDiscountDueDate" in headerValidationResult &&
        "foundVendor" in headerValidationResult
      ) {
        ({ newDueDate, newDiscountDueDate, foundVendor } =
          headerValidationResult);
      }
    }

    this.logger.sharedTiming(
      "Header validation data extraction completed",
      startTime
    );
    this.logger.debug(
      `Header validation successful - Due dates: ${newDueDate}, ${newDiscountDueDate}, Vendor: ${foundVendor?.vendorNo}`
    );

    const headerDataBuildStartTime = Date.now();
    const voucherHeaderData = this.voucherSharedService.buildVoucherHeaderData({
      ...header,
      dueDate: newDueDate,
      discountDueDate: newDiscountDueDate,
      foundVendor,
    });

    this.logger.sharedTiming(
      `Header data building completed (${Date.now() - headerDataBuildStartTime}ms)`,
      startTime
    );

    // Validate details
    const detailValidationStartTime = Date.now();
    this.logger.sharedTiming("Starting detail validation", startTime);

    const detailValidationResult =
      await this.voucherDetailValidationService.validateDetail(
        details,
        voucherHeaderData,
        foundVendor
      );

    this.logger.sharedTiming(
      `Detail validation completed (${Date.now() - detailValidationStartTime}ms)`,
      startTime
    );

    if (detailValidationResult.error) {
      const errorProcessingStartTime = Date.now();
      const flatErrors = detailValidationResult.errors.flatMap(
        (errObj: {
          index: number;
          errors: import("@src/shared/utils/error-handler").ValidationError[];
        }) =>
          errObj.errors.map((e) => ({
            field: `${e.field}`,
            message: e.message,
            code: ErrorType.VALIDATION_ERROR,
            id: `${errObj.index}`,
          }))
      );

      this.logger.sharedTiming(
        `Error processing completed (${Date.now() - errorProcessingStartTime}ms)`,
        startTime
      );
      this.logger.sharedTiming(
        `Detail validation failed with ${flatErrors.length} total errors across ${detailValidationResult.errors.length} details`,
        startTime,
        "end"
      );

      throw new HttpException(
        errorResponse(ERROR_CONSTANTS.VALIDATION_ERROR, flatErrors),
        HttpStatus.BAD_REQUEST
      );
    }

    this.logger.debug(
      `Detail validation successful for ${details?.length || 0} details`
    );
    this.logger.sharedTiming(
      "Starting parallel database operations",
      startTime
    );

    // Prepare detail data and compute status based on warnings (W if any warnings present)
    const detailWarningsArray = (detailValidationResult as any).warnings as
      | { index: number; warnings: { field: string; message: string }[] }[]
      | undefined;
    const hasDetailWarnings = Array.isArray(detailWarningsArray)
      ? detailWarningsArray.some(
          (w) => Array.isArray(w.warnings) && w.warnings.length > 0
        )
      : false;

    // Check for header warnings from header validation result
    const headerWarnings = headerValidationResult && 
      typeof headerValidationResult === "object" && 
      !Array.isArray(headerValidationResult) && 
      "warnings" in headerValidationResult 
      ? headerValidationResult.warnings 
      : [];
    
    const hasHeaderWarnings = Array.isArray(headerWarnings) && headerWarnings.length > 0;

    // Set status to W if there are any warnings (header or detail)
    const hasAnyWarnings = hasDetailWarnings || hasHeaderWarnings;
    if (hasAnyWarnings) {
      // Set header status to W
      (voucherHeaderData as any).status = VOUCHER_STATUS_CODES.W;
    }

    // Ensure details inherit final status if set
    const voucherDetailsData = (detailValidationResult.data || []).map(
      (d: any) => ({
        ...d,
        status: hasAnyWarnings ? VOUCHER_STATUS_CODES.W : d.status,
      })
    );

    // ⚡ Run header and detail database operations in parallel (independent operations)
    const dbOperationsStartTime = Date.now();
    const [headerRecord, detailRecords] = await Promise.all([
      this.voucherAppService.createOrUpdateVoucherHeader(voucherHeaderData),
      this.voucherAppService.createOrUpdateVoucherDetail(voucherDetailsData),
    ]);

    const dbOperationsDuration = Date.now() - dbOperationsStartTime;
    this.logger.sharedTiming(
      `Parallel database operations completed (${dbOperationsDuration}ms)`,
      startTime
    );
    this.logger.log(
      `🚀 Header and detail DB operations completed in parallel: ${dbOperationsDuration}ms`
    );

    // Flatten warnings for API consumers (both detail and header warnings)
    const flatDetailWarnings =
      detailWarningsArray?.flatMap((wObj) =>
        (wObj.warnings || []).map((w) => ({
          field: w.field,
          message: w.message,
          id: `${wObj.index}`,
        }))
      ) ?? [];

    const flatHeaderWarnings = headerWarnings?.map((w) => ({
      field: w.field,
      message: w.message,
      id: "header",
    })) ?? [];

    const flatWarnings = [...flatDetailWarnings, ...flatHeaderWarnings];

    const resultItems = {
      header: headerRecord,
      details: detailRecords,
    };

    const warnings =
      flatWarnings.length > 0
        ? {
            code: ERROR_CONSTANTS.VALIDATION_ERROR.code,
            message: ERROR_CONSTANTS.VALIDATION_ERROR.message,
            details: flatWarnings.map((w) => ({
              field: w.field,
              message: w.message,
              code: "Validation error",
              id: w.id,
            })),
          }
        : undefined;

    this.logger.log(
      `Voucher submission successful - Header ID: ${headerRecord?.entryNo}, Details count: ${detailRecords?.length || 0}`
    );
    this.logger.sharedTiming(
      "Voucher submission completed successfully",
      startTime,
      "end"
    );

    // Controller wraps with simpleResponse; we return { items: { header, details }, warnings }
    return { items: resultItems, warnings } as any;
  }
}
