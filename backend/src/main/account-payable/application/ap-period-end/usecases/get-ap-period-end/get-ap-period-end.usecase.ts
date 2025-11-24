import { Inject, Injectable } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { ApPeriodEndInterface } from "@src/main/account-payable/domain/interface/ap-period-end.interface";
import { apPeriodEndDto, ApPeriodEndRecordFormatTIResponseDto, ApPeriodEndRecordFormatA1099ResponseDto, ApPeriodEndRecordFormatB1009IResponseDto } from "../../dto/ap-period-end.dto";


@Injectable()
export class GetApPeriodEndUsecase {
    private readonly logger = new AppLogger(GetApPeriodEndUsecase.name);

    constructor(
        @Inject("ApPeriodEndInterface")
        private readonly apPeriodEndInterface: ApPeriodEndInterface,

    ) { }

    async execute(data: apPeriodEndDto): Promise<Partial<ApPeriodEndRecordFormatTIResponseDto | ApPeriodEndRecordFormatA1099ResponseDto | ApPeriodEndRecordFormatB1009IResponseDto>> {

        const { ctl, tin } = data

        this.logger.log(`Fetch data from flat files ctl: ${ctl}, tin: ${tin}`);


        const result = await this.apPeriodEndInterface.getApPeriodEnd(ctl, tin);

        return result

    }
}
