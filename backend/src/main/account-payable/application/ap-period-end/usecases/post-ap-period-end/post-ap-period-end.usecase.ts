import { Inject, Injectable } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { ApPeriodEndInterface } from "@src/main/account-payable/domain/interface/ap-period-end.interface";
import { apPeriodEndBodyDto } from "../../dto/ap-period-end.dto";


@Injectable()
export class PostApPeriodEndUsecase {
    private readonly logger = new AppLogger(PostApPeriodEndUsecase.name);

    constructor(
        @Inject("ApPeriodEndInterface")
        private readonly apPeriodEndInterface: ApPeriodEndInterface,

    ) { }

    async execute(data: apPeriodEndBodyDto): Promise<{message: string}> {
        
        const { ctl, tin, data: payload } = data

        this.logger.log(`Fetch data from flat files ctl: ${ctl}, tin: ${tin}`);

        const result = await this.apPeriodEndInterface.postApPeriodEnd(ctl, tin, payload);

        return result

    }
}
