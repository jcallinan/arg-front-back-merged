import { Injectable } from "@nestjs/common";
import { VoucherAppService } from "@src/main/account-payable/domain/services/voucher/voucher.service";
import { AppLogger } from "@src/shared/logger/logger.service";
import { GetHeadersDto } from "../../dto/voucher.dto";
import { PaginatedResponse } from "@src/shared/utils/response-formatter";
import { formatToMMDDYY } from "@src/shared/utils/format-date";
import { VoucherEntryResponseDto } from "../../dto/voucher.dto";
import { PROCESS_TYPE_ENUM } from "@src/shared/constants/constant";

@Injectable()
export class GetVoucherEntryUseCase {
  private readonly logger = new AppLogger(GetVoucherEntryUseCase.name);

  constructor(private readonly voucherAppService: VoucherAppService) {}

  async execute(dto: GetHeadersDto): Promise<PaginatedResponse<VoucherEntryResponseDto>> {
    
    this.logger.log("Fetching Voucher Grid Entry Data");
      const response = await this.voucherAppService.getVoucherHeaders(dto);
      
      const formattedItems: VoucherEntryResponseDto[] = response.items.map(item => ({
        ...item,
        processType: item.processType as PROCESS_TYPE_ENUM,
        invoiceDate: item.invoiceDate ? formatToMMDDYY(item.invoiceDate) : '',
        dueDate: item.dueDate ? formatToMMDDYY(item.dueDate) : '',
        discountDueDate: item.discountDueDate ? formatToMMDDYY(item.discountDueDate) : '',
        prepaidCheckdate: item.prepaidCheckdate? formatToMMDDYY(item.prepaidCheckdate):''
      }));
      
      return {
        ...response,
        items: formattedItems,
      };
  }
}
