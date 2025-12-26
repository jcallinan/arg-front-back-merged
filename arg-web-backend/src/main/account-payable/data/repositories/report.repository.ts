import { Injectable, Inject, HttpException, HttpStatus } from "@nestjs/common";
import { ProcessTypeModel } from "@src/main/account-payable/data/models/process-type.model";
import { AppLogger } from "@src/shared/logger/logger.service";
import { ReportInterface } from "../../domain/interface/report.interface";
import { ReportEntity } from "../../domain/entities/report.entity";
import { Report_Type } from "@src/shared/constants/constant";
import { reportListMapper } from "../mappers/report.mapper";
import { errorResponse } from "@src/shared/utils/response-formatter";
import { ERROR_CONSTANTS } from "@src/shared/constants/error-constants";
import { Op } from "sequelize";

@Injectable()
export class ReportRepository
    implements ReportInterface {

    private readonly logger = new AppLogger(ReportRepository.name)

    constructor(
        @Inject("ProcessTypeModel")
        private readonly processTypeModel: typeof ProcessTypeModel
    ) { }

    async findByReportType(reportType: Report_Type): Promise<ReportEntity[]> {
        const reportList = await this.processTypeModel.findAll({
            where: {
                reportGroup: reportType,
            },
            order: [['reportName', 'ASC']],
        });

        this.logger.log(`Get Report Type List`)

        if (!reportList) {
            this.logger.warn("Reports not found");

            throw new HttpException(
                errorResponse(ERROR_CONSTANTS.NOT_FOUND, [
                    {
                        field: "report-list",
                        code: ERROR_CONSTANTS.NOT_FOUND.code,
                        message: "Report List Not Found",
                    },
                ]),
                HttpStatus.NOT_FOUND
            );
        }

        return reportList.map(reportListMapper)

    }


    async findOne(reportName: string): Promise<ReportEntity> {
        const report = await this.processTypeModel.findOne({
            where: {
                reportName,
            },
        });

        this.logger.log(`Get Report Type List`)

        if (!report) {
            this.logger.warn("Reports not found");

            throw new HttpException(
                errorResponse(ERROR_CONSTANTS.NOT_FOUND, [
                    {
                        field: "report",
                        code: ERROR_CONSTANTS.NOT_FOUND.code,
                        message: "Report Not Found",
                    },
                ]),
                HttpStatus.NOT_FOUND
            );
        }

        return report

    }

    async findAll(reportName: string[]): Promise<ReportEntity[]> {
        const report = await this.processTypeModel.findAll({
            where: {
                reportName: {
                    [Op.in]: reportName
                }
            },
        });

        this.logger.log(`Get Report Type List`)

        if (!report) {
            this.logger.warn("Reports not found");

            throw new HttpException(
                errorResponse(ERROR_CONSTANTS.NOT_FOUND, [
                    {
                        field: "report",
                        code: ERROR_CONSTANTS.NOT_FOUND.code,
                        message: "Report Not Found",
                    },
                ]),
                HttpStatus.NOT_FOUND
            );
        }

        return report

    }


}
