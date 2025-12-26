import { Inject, Injectable } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { ApPeriodEndInterface } from "@src/main/account-payable/domain/interface/ap-period-end.interface";
import { allApPeriodDto, allReponseDto } from "../../dto/ap-period-end.dto";
import { normalizeSearchQuery } from "@src/shared/utils/query.utils";
import { PaginatedResponse } from "@src/shared/utils/response-formatter";


@Injectable()
export class AllApPeriodEndUsecase {
    private readonly logger = new AppLogger(AllApPeriodEndUsecase.name);

    constructor(
        @Inject("ApPeriodEndInterface")
        private readonly apPeriodEndInterface: ApPeriodEndInterface,

    ) { }

    async execute(data: allApPeriodDto): Promise<PaginatedResponse<allReponseDto>> {

        this.logger.log(`Fetch All data from AP Period End`);

        const { ctl, recordType, tin } = data

        const { limit, offset, page } = normalizeSearchQuery(data)

        const result = await this.apPeriodEndInterface.findAll(limit, offset, page, ctl, tin, recordType);

        return result
    }
}
