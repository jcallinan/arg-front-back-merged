import { Injectable } from "@nestjs/common";
import { VoucherAppService } from "@src/main/account-payable/domain/services/voucher/voucher.service";
import { AppLogger } from "@src/shared/logger/logger.service";
import { GetSogasHeadersDto } from "../../dto/voucher.dto";
import { PaginatedResponse } from "@src/shared/utils/response-formatter";
import { formatToMMDDYY } from "@src/shared/utils/format-date";
import { VoucherEntryResponseDto } from "../../dto/voucher.dto";
import { PROCESS_TYPE_ENUM } from "@src/shared/constants/constant";
import { VoucherHeader } from "@src/main/account-payable/domain/entities/voucher.entity";

@Injectable()
export class GetSogasEntryUseCase {
  private readonly logger = new AppLogger(GetSogasEntryUseCase.name);

  constructor(private readonly voucherAppService: VoucherAppService) {}

  async execute(dto: GetSogasHeadersDto): Promise<PaginatedResponse<VoucherEntryResponseDto>> {
    this.logger.log("Fetching SOGAS Voucher Grid Entry Data");
    // Always use companyNo=10 and processType='SOGAS'
    const sogasDto = { ...dto, companyNo: 10 };
    const response = await this.voucherAppService.getSogasVoucherHeaders(sogasDto);
    const formattedItems: VoucherEntryResponseDto[] = response.items.map((item: VoucherHeader) => ({
      ...item,
      processType: item.processType as PROCESS_TYPE_ENUM,
      invoiceDate: item.invoiceDate ? formatToMMDDYY(item.invoiceDate) : '',
      dueDate: item.dueDate ? formatToMMDDYY(item.dueDate) : '',
      discountDueDate: item.discountDueDate ? formatToMMDDYY(item.discountDueDate) : '',
    }));
    return {
      ...response,
      items: formattedItems,
    };
  }
} 