import { Injectable, Inject } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { SalesAnalysisDetailInterface } from "../../domain/interface/sales-analysis-detail.interface";
import { SalesAnalysisDetailModel } from "../models/sales-analysis-detail.model";
import { Op } from "@sequelize/core";
import { SalesAnalysisDetail } from "../../domain/entities/sales-analysis-detail.entity";
import { salesAnalysisDetailMapper } from "../mappers/sales-analysis-detail.mapper";


@Injectable()
export class SalesAnalysisDetailRepository implements SalesAnalysisDetailInterface {

    private readonly logger = new AppLogger(SalesAnalysisDetailRepository.name)

    constructor(
        @Inject("SalesAnalysisDetailModel")
        private readonly salesAnalysisDetailModel: typeof SalesAnalysisDetailModel
    ) { }

    async findAll(
        companyNo: Number,
        orderNo: Number,
        shippingReferenceNo: Number,
        invoiceDate: string
    ): Promise<SalesAnalysisDetail[]> {

        this.logger.log(`Sales Analysis Detail`)

        const result = await this.salesAnalysisDetailModel.findAll({
            where: {
                companyNo,
                orderNo,
                shippingReferenceNo,
                shipDateYmd8: {
                    [Op.gte]: invoiceDate
                }
            }
        })
        this.logger.log(`Sales Analysis Detail success`)

        return result.map(salesAnalysisDetailMapper)
    }

}