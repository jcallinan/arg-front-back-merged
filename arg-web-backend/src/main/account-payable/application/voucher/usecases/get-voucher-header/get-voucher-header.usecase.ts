import { Injectable, Inject, HttpException, HttpStatus } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { GetVoucherDataDto } from "../../dto/voucher.dto";
import { errorResponse } from "@src/shared/utils/response-formatter";
import { ERROR_CONSTANTS } from "@src/shared/constants/error-constant";
import {
  VoucherHeader,
  VoucherDetail,
} from "@src/main/account-payable/domain/entities/voucher.entity";
import {
  VoucherHeaderInterface,
  VoucherDetailInterface,
} from "@src/main/account-payable/domain/interface/voucher.interface";
import { Op } from "@sequelize/core";
import {
  formatNumberToMMDDYY,
  formatToMMDDYY,
} from "@src/shared/utils/format-date";
import { GlMasterService } from "@src/main/account-payable/domain/services/gl-master/gl-master.service";
import { VoucherSharedService } from "../../shared-services/voucher.shared.service";
import { VOUCHER_STATUS_CODES } from "@src/shared/constants/status-map";
import { IsDeletedStatus } from "@src/shared/constants/constant";

@Injectable()
export class GetVoucherHeaderUseCase {
  private readonly logger = new AppLogger(GetVoucherHeaderUseCase.name);

  constructor(
    @Inject("VoucherHeaderInterface")
    private readonly voucherHeaderInterface: VoucherHeaderInterface,
    @Inject("VoucherDetailInterface")
    private readonly voucherDetailInterface: VoucherDetailInterface,
    private readonly glMasterService: GlMasterService,
    private readonly voucherSharedService: VoucherSharedService
  ) {}

  async execute(
    entryNumber: string,
    dto: GetVoucherDataDto
  ): Promise<{
    headerItem: VoucherHeader | null;
    detailItems?: VoucherDetail[];
    validationMessages?: { field: string; code: string; message: string }[];
    errors?: {
      code: string;
      message: string;
      details: { field: string; code: string; message: string; id: string }[];
    };

    warnings?: {
      code: string;
      message: string;
      details: { field: string; code: string; message: string; id: string }[];
    };
  }> {
    const { companyNo, vendorNo } = dto;

    if (!entryNumber) {
      throw new HttpException(
        errorResponse(ERROR_CONSTANTS.VALIDATION_ERROR, [
          {
            field: "entryNo",
            code: ERROR_CONSTANTS.VALIDATION_ERROR.code,
            message: `Entry No is required`,
          },
        ]),
        HttpStatus.BAD_REQUEST
      );
    }

    const entryNo = parseInt(entryNumber, 10);
    const whereClause: Record<string, any> = {
      isDeleted: {
        [Op.notIn]: [IsDeletedStatus.DELETED, IsDeletedStatus.INACTIVE],
      },
      companyNo,
      entryNo,
      ...(vendorNo && { vendorNo }),
    };

    this.logger.log(`Query conditions: ${JSON.stringify(whereClause)}`);

    const headerItem = await this.voucherHeaderInterface.findOne(
      companyNo,
      entryNo,
      vendorNo
    );

    if (!headerItem) {
      throw new HttpException(
        errorResponse(ERROR_CONSTANTS.NOT_FOUND, [
          {
            field: "entryNo",
            code: ERROR_CONSTANTS.NOT_FOUND.code,
            message: `No matching record found.`,
          },
        ]),
        HttpStatus.NOT_FOUND
      );
    }

    // Format date fields
    if (
      headerItem.status === VOUCHER_STATUS_CODES.S ||
      headerItem.status === VOUCHER_STATUS_CODES.N
    ) {
      formatHeaderDates(headerItem, formatToMMDDYY);
    } else {
      formatHeaderDates(headerItem, formatNumberToMMDDYY);
    }

    // GL Master validation with try-catch to prevent exceptions
    try {
      const [companyApGlDesc, companyBankGlDesc] = await Promise.all([
        this.glMasterService.getGlDescription(
          headerItem.companyNo,
          headerItem.apGlNo,
          "C",
          true
        ),
        this.glMasterService.getGlDescription(
          headerItem.companyNo,
          headerItem.bankGl,
          "C",
          true
        ),
      ]);
      headerItem.companyApGlDesc = companyApGlDesc;
      headerItem.companyBankGlDesc = companyBankGlDesc;
    } catch (error: any) {
      this.logger.error(
        `GL Master validation failed for header: ${error.message}`
      );
      headerItem.companyApGlDesc = "";
      headerItem.companyBankGlDesc = "";
    }

    const detailItems = await this.voucherDetailInterface.findByEntry(
      companyNo,
      entryNo,
      vendorNo
    );

    // GL Master validation for detail items with try-catch
    try {
      await Promise.all(
        detailItems.map(async (detail) => {
          try {
            detail.description = await this.glMasterService.getGlDescription(
              detail.companyNo,
              detail.lineGlNo,
              "C",
              true
            );
          } catch (error: any) {
            this.logger.error(
              `GL Master validation failed for detail line GL ${detail.lineGlNo}: ${error.message}`
            );
            detail.description = "";
          }
        })
      );
    } catch (error: any) {
      this.logger.error(
        `GL Master validation failed for detail items: ${error.message}`
      );
      // Set default descriptions for all detail items if bulk validation fails
      detailItems.forEach((detail) => {
        detail.description = "";
      });
    }

    this.logger.log("Returning headers with detail items");

    // Return early for 'S' status without validations
    if (
      headerItem.status === VOUCHER_STATUS_CODES.S ||
      headerItem.status === VOUCHER_STATUS_CODES.N
    ) {
      return {
        headerItem,
        detailItems,
      };
    }

    // Get validation messages
    const { validationMessages, errors, warnings } =
      await this.voucherSharedService.getValidationMessages(
        headerItem,
        detailItems
      );

    formatHeaderDates(headerItem, formatToMMDDYY);

    const resultItems = {
      headerItem,
      detailItems,
      validationMessages,
      ...(errors ? { errors } : {}),
      ...(warnings ? { warnings } : {}),
    };
    return resultItems;
  }
}

/**
 * Format all date fields in the header using the given formatter
 */
function formatHeaderDates(
  headerItem: VoucherHeader,
  formatter: (date: number | string) => string
): void {
  if (headerItem.invoiceDate) {
    headerItem.invoiceDate = formatter(headerItem.invoiceDate);
  }
  if (headerItem.dueDate) {
    headerItem.dueDate = formatter(headerItem.dueDate);
  }
  if (headerItem.discountDueDate) {
    headerItem.discountDueDate = formatter(headerItem.discountDueDate);
  }
  if (headerItem.prepaidCheckdate) {
    headerItem.prepaidCheckdate = formatter(headerItem.prepaidCheckdate);
  }
}
