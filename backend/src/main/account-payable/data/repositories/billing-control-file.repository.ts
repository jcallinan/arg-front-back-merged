import { Injectable, Inject } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { BillingControlFileModel } from "../models/billing-control-file.model";
import { BillingControlFileInterface } from "../../domain/interface/billing-control-file.interface";
import { bicontMapper } from "../mappers/billing-control-file.mapper";
import { BillingControlFile } from "../../domain/entities/billing-control-file.entity";

@Injectable()
export class BillingControlFileRepository implements BillingControlFileInterface {

    private readonly logger = new AppLogger(BillingControlFileRepository.name)

    constructor(
        @Inject("BillingControlFileModel")
        private readonly billingControlFileModel: typeof BillingControlFileModel
    ) { }

    async findAll(companyNo: Number, orderNo: Number, shippingReferenceNo: Number): Promise<BillingControlFile[]> {

        this.logger.log(`billing Control File Logic`)

        const result = await this.billingControlFileModel.findAll({
            where: {
                companyNo,
                orderNo,
                shippingReferenceNo
            }
        })

        return result.map(bicontMapper)
    }


    async findOne(companyNo: Number): Promise<BillingControlFile | null> {

        this.logger.log(`Find Bill based on company No`)

        const result = await this.billingControlFileModel.findOne({
            where: {
                companyNo,
            }
        })

        return result ? bicontMapper(result) : null;
    }
}