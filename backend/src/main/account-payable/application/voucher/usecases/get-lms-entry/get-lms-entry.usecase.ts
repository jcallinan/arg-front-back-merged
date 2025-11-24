import { Injectable } from "@nestjs/common";
import { VoucherAppService } from "@src/main/account-payable/domain/services/voucher/voucher.service";
import { AppLogger } from "@src/shared/logger/logger.service";
import { GetLmsHeadersDto } from "../../dto/voucher.dto";
import { PaginatedResponse } from "@src/shared/utils/response-formatter";
import { formatToMMDDYY } from "@src/shared/utils/format-date";
import { paperEntryResponseDto } from "../../dto/voucher.dto";
import { PROCESS_TYPE_ENUM } from "@src/shared/constants/constant";
import { VoucherHeader } from "@src/main/account-payable/domain/entities/voucher.entity";

@Injectable()
export class GetLmsEntryUseCase {
    private readonly logger = new AppLogger(GetLmsEntryUseCase.name);

    constructor(private readonly voucherAppService: VoucherAppService) { }

    async execute(dto: GetLmsHeadersDto): Promise<PaginatedResponse<paperEntryResponseDto>> {
        this.logger.log("Fetching LMS Voucher Grid Entry Data");
        const paperDto = { ...dto, companyNo: 10 };
        const response = await this.voucherAppService.getLmsVoucherHeaders(paperDto);
        const formattedItems: paperEntryResponseDto[] = response.items.map((item: VoucherHeader) => ({
            ...item,
            processType: item.processType as PROCESS_TYPE_ENUM,
            invoiceDate: item.invoiceDate ? formatToMMDDYY(item.invoiceDate) : '',
            discountDueDate: item.discountDueDate ? formatToMMDDYY(item.discountDueDate) : '',
        }));
        return {
            ...response,
            items: formattedItems,
        };
    }
} 