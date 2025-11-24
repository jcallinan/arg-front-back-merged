import { Injectable, Inject } from "@nestjs/common";
import { Op } from "@sequelize/core";
import { AppLogger } from "@src/shared/logger/logger.service";
import { ProdMoveMiscLogicalInterface } from "../../domain/interface/prod-move-misc-logical.interface";
import { ProdMoveMiscLogicalModel } from "../models/prod-move-misc-logical.model";
import { prodMoveMiscLogicalMapper } from "../mappers/prod-move-misc-logical.mapper";
import { ProdMoveMiscLogical } from "../../domain/entities/prod-move-misc-logical.entity";

@Injectable()
export class ProdMoveMiscLogicalRepository implements ProdMoveMiscLogicalInterface {

    private readonly logger = new AppLogger(ProdMoveMiscLogicalRepository.name)

    constructor(
        @Inject("ProdMoveDetailLogicalModel")
        private readonly prodMoveMiscLogicalModel: typeof ProdMoveMiscLogicalModel
    ) { }

    async findAll(companyNo: Number, orderNo: Number, shippingReferenceNo: Number, invoiceDate: string)
    : Promise<ProdMoveMiscLogical[]> {

        this.logger.log(`Prod Move Misc Logical Detail`)

        const result = await this.prodMoveMiscLogicalModel.findAll({
            where: {
                companyNo,
                orderNo,
                shippingReferenceNo,
                shipDateYmd8: {
                    [Op.gte]: invoiceDate
                }
            }
        })

        return result.map(prodMoveMiscLogicalMapper)
    }

}