import { Injectable, Inject } from "@nestjs/common";
import { Op } from "@sequelize/core";
import { AppLogger } from "@src/shared/logger/logger.service";
import { ProdMoveDetailLogicalModel } from "../models/prod-move-detail-logical.model";
import { ProdMoveDetailLogicalInterface } from "../../domain/interface/prod-move-detail-logic.interface";
import { prodMoveDetailLogicalMapper } from "../mappers/prod-move-detail-logical.mapper";
import { ProdMoveDetailLogical } from "../../domain/entities/prod-move-detail-logical.entity";

@Injectable()
export class ProdMoveDetailLogicalRepository implements ProdMoveDetailLogicalInterface {

    private readonly logger = new AppLogger(ProdMoveDetailLogicalRepository.name)

    constructor(
        @Inject("ProdMoveDetailLogicalModel")
        private readonly prodMoveDetailLogicalModel: typeof ProdMoveDetailLogicalModel
    ) { }

    async findAll(
        companyNo: Number,
        orderNo: Number,
        shippingReferenceNo: Number,
        invoiceDate: string
        ): Promise<ProdMoveDetailLogical[]> {


        this.logger.log(`Prod Move Detail Logic`)

        const result = await this.prodMoveDetailLogicalModel.findAll({
            where: {
                companyNo,
                orderNo,
                shippingReferenceNo,
                shipDateYmd8: {
                    [Op.gte]: invoiceDate
                }
            }
        })


        return result.map(prodMoveDetailLogicalMapper)
    }

}