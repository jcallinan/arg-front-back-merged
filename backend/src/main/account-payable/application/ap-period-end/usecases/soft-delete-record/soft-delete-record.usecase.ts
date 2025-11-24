import { Inject, Injectable } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { ApPeriodEndInterface } from "@src/main/account-payable/domain/interface/ap-period-end.interface";
import { apPeriodEndDto } from "../../dto/ap-period-end.dto";


@Injectable()
export class SoftDeleteRecordUsecase {
    private readonly logger = new AppLogger(SoftDeleteRecordUsecase.name);

    constructor(
        @Inject("ApPeriodEndInterface")
        private readonly apPeriodEndInterface: ApPeriodEndInterface,

    ) { }

    async execute(data: apPeriodEndDto): Promise<{ message: string }> {

        const { ctl, tin } = data

        this.logger.log(`Fetch data from flat files ctl: ${ctl}, tin: ${tin}`);

        const result = await this.apPeriodEndInterface.softDelete(ctl, tin);

        return result

    }
}
