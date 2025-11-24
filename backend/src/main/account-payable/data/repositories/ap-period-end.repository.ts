import { Injectable, Inject, HttpException, HttpStatus } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { ApPeriodEndInterface } from "../../domain/interface/ap-period-end.interface";
import { ApPeriodEndModel } from "../models/ap-period-end.model";
import { ApPeriodEndMapper } from "../mappers/ap-period-end.mapper";
import { RecordFormatA1099, RecordFormatB1009I, RecordFormatT1009I } from "../schemas/flatfiles.schema"
import { ApPeriodEndEntity, RecordB } from "../../domain/entities/ap-period-end.entity";
import { ERROR_CONSTANTS } from "@src/shared/constants/error-constants";
import { errorResponse, PaginatedResponse, paginatedResponse } from "@src/shared/utils/response-formatter";


const ap1009IRecords = {
    "A": RecordFormatA1099,
    "B": RecordFormatB1009I,
    "T": RecordFormatT1009I,
}

@Injectable()
export class ApPeriodEndRepository implements ApPeriodEndInterface {
    private readonly logger = new AppLogger(ApPeriodEndRepository.name);

    constructor(

        @Inject("ApPeriodEndModel")
        private readonly ap1099IModel: typeof ApPeriodEndModel,

    ) { }


    async getApPeriodEnd(ctl: string, tin: string): Promise<ReturnType<ApPeriodEndEntity['createRecordA'] | ApPeriodEndEntity['createRecordB'] | ApPeriodEndEntity['createRecordT']>> {
        this.logger.log(`Get Flat file Details for AP1099 ctl:${ctl}  tin:${tin}`)

        try {
            const ap1099I = await this.ap1099IModel.findOne({
                where: {
                    ...(tin && { k00003Text: tin }),
                    ...(ctl && { k00002Text: ctl }),
                }
            });

            if (!ap1099I) {

                this.logger.warn(`AP1099 file not found for tin: ${tin} ctl: ${ctl}`);

                throw new HttpException(
                    errorResponse(ERROR_CONSTANTS.NOT_FOUND, [
                        {
                            field: "ap-1009",
                            code: ERROR_CONSTANTS.NOT_FOUND.code,
                            message: "Ap1009 not found",
                        },
                    ]),
                    HttpStatus.NOT_FOUND
                );
            }

            return ApPeriodEndMapper.toEntity(ap1099I?.f00001Text, ap1009IRecords[ap1099I.k00001Text])

        } catch (error) {
            this.logger.error(
                `Failed to fetch flat files for  tin: ${tin} ctl: ${ctl}: ${error instanceof Error ? error.message : "Unknown error"}`
            );
            throw error
        }
    }

    async postApPeriodEnd(ctl: string, tin: string, data: any): Promise<{ message: string }> {
        try {

            const ap1099IRecord = await this.ap1099IModel.findOne({
                where: {
                    ...(tin && { k00003Text: tin }),
                    ...(ctl && { k00002Text: ctl }),
                }
            })

            // Check it exists or not
            if (!ap1099IRecord) {

                this.logger.warn(`AP1099 file not found for tin: ${tin} ctl: ${ctl}`);

                throw new HttpException(
                    errorResponse(ERROR_CONSTANTS.NOT_FOUND, [
                        {
                            field: "ap-1009",
                            code: ERROR_CONSTANTS.NOT_FOUND.code,
                            message: `Ap1009 data not found fro tin:${tin} , ctl: ${ctl}`,
                        },
                    ]),
                    HttpStatus.NOT_FOUND
                );
            }

            const record = ApPeriodEndMapper.toModel(data, ap1009IRecords[data.recordType])

            this.logger.log(`New Record for Data: ${record}`)

            await this.ap1099IModel.update(
                { f00001Text: record },
                {
                    where: {
                        ...(tin && { k00003Text: tin }),
                        ...(ctl && { k00002Text: ctl }),
                    }
                }
            )

            return { message: 'successfully updated' }

        } catch (error) {
            this.logger.error(
                `Failed to Update flat files for  tin: ${tin} ctl: ${ctl}: ${error instanceof Error ? error.message : "Unknown error"}`
            );
            throw error
        }
    }

    async findAll(limit: number, offset: number, page: number, ctl?: string, tin?: string, recordType?: string): Promise<PaginatedResponse<ReturnType<ApPeriodEndEntity['allRecords']>>> {
        try {
            const { rows , count } = await this.ap1099IModel.findAndCountAll({
                where: {
                    ...(recordType && { k00001Text: recordType }),
                    ...(tin && { k00003Text: tin }),
                    ...(ctl && { k00002Text: ctl }),
                },
                limit,
                offset,
            });


            if (!rows) {

                this.logger.warn(`AP Period End not founds`);

                throw new HttpException(
                    errorResponse(ERROR_CONSTANTS.NOT_FOUND, [
                        {
                            field: "Ap-period-end",
                            code: ERROR_CONSTANTS.NOT_FOUND.code,
                            message: "Ap Period End not found",
                        },
                    ]),
                    HttpStatus.NOT_FOUND
                );
            }

            const allFormattedData = rows.map((records) => {
                const entity: any = ApPeriodEndMapper.toEntity(
                    records.f00001Text,
                    ap1009IRecords[records.k00001Text]
                )

                if (!entity.deletionIndicator || entity?.deletionIndicator.trim() !== 'Y') {
                    return {
                        ctl: records.k00002Text,
                        tin: records.k00003Text,
                        recordType: entity.recordType,
                        firstPayeeName: entity.recordType ?? "",
                    };
                } else {
                    return undefined
                }
            }).filter((item) => item !== undefined);;


            return paginatedResponse(allFormattedData, count, page, limit)


        } catch (error) {
            throw error
        }
    }

    async softDelete(ctl: string, tin: string): Promise<{ message: string }> {
        try {
            const recordFormatB = await this.ap1099IModel.findOne({
                where: {
                    k00001Text: 'B',
                    ...(tin && { k00003Text: tin }),
                    ...(ctl && { k00002Text: ctl }),
                }
            })

            if (!recordFormatB) {
                throw new HttpException(
                    errorResponse(ERROR_CONSTANTS.NOT_FOUND, [
                        {
                            field: "ap-period end",
                            code: ERROR_CONSTANTS.NOT_FOUND.code,
                            message: `AP Period end record not found fro tin:${tin} , ctl: ${ctl}`,
                        },
                    ]),
                    HttpStatus.NOT_FOUND
                );
            }


            let recordFormatBobject = ApPeriodEndMapper.toEntity(recordFormatB?.f00001Text, ap1009IRecords[recordFormatB.k00001Text]) as RecordB
            recordFormatBobject.deletionIndicator = 'Y'

            const record = ApPeriodEndMapper.toModel(recordFormatBobject, ap1009IRecords[recordFormatBobject.recordType])

            this.logger.warn(`Ap Period end Update Record for tin: ${tin} ctl: ${ctl}`);
            await this.ap1099IModel.update(
                { f00001Text: record },
                {
                    where: {
                        k00001Text: 'B',
                        ...(tin && { k00003Text: tin }),
                        ...(ctl && { k00002Text: ctl }),
                    }
                }
            )

            return { message: "Deleted Successfully" }

        } catch (error) {
            throw error
        }
    }

}