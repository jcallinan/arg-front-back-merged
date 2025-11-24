import { PaginatedResponse } from "@src/shared/utils/response-formatter"
import { ApPeriodEndEntity } from "../entities/ap-period-end.entity"

export interface ApPeriodEndInterface {

    getApPeriodEnd(
        ctl: string,
        tin: string
    ): Promise<ReturnType<ApPeriodEndEntity['createRecordA'] | ApPeriodEndEntity['createRecordB'] | ApPeriodEndEntity['createRecordT']>>

    postApPeriodEnd(
        ctL: string,
        tin: string,
        data: any
    ): Promise<{ message: string }>

    findAll(limit: number , offset: number, page: number, ctl?: string, tin?: string, recordType?: string): Promise<PaginatedResponse<ReturnType<ApPeriodEndEntity['allRecords']>>>

    softDelete(ctl: string, tin: string): Promise<{ message: string }> 

}
