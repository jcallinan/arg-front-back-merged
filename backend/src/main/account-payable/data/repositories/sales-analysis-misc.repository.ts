import { Injectable, Inject } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { SalesAnalysisMiscInterface } from "../../domain/interface/sales-analysis-misc.interface";
import { SalesAnalysisMiscModel } from "../models/sales-analysis-misc.model";
import { Op } from "@sequelize/core";
import { salesAnalysisMiscMapper } from "../mappers/sales-analysis-misc.mapper";
import { SalesAnalysisMisc } from "../../domain/entities/sales-analysis-misc.entity";

@Injectable()
export class SalesAnalysisMiscRepository implements SalesAnalysisMiscInterface {

    private readonly logger = new AppLogger(SalesAnalysisMiscRepository.name)

    constructor(
        @Inject("SalesAnalysisMiscModel")
        private readonly salesAnalysisMiscModel: typeof SalesAnalysisMiscModel
    ) { }

    async findAll(
        companyNo: Number,
        orderNo: Number,
        shippingReferenceNo: Number,
        invoiceDate: string
    ): Promise<SalesAnalysisMisc[]> {


        this.logger.log(`Sales Analysis Misc`)

        const result = await this.salesAnalysisMiscModel.findAll({
            where: {
                companyNo,
                orderNo,
                shippingReferenceNo,
                shipDateYmd8: {
                    [Op.gte]: invoiceDate
                }
            }
        })

        this.logger.log(`Sales Analysis Misc`)


        return result.map(salesAnalysisMiscMapper)
    }

}