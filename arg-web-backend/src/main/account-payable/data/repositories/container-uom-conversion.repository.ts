import { Injectable, Inject } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { ContainerUnitofMeasureConversionModel } from "../models/container-uom-conversion.model";
import { ContainerUomConversionInterface } from "../../domain/interface/container-uom-conversion.interface";
import { containerUnitofMeasureConversionMapper } from "../mappers/container-uom-conversion.mapper";
import { ContainerUnitofMeasureConversion } from "../../domain/entities/container-uom-conversion.entity";

@Injectable()
export class ContainerUomConversionRepository implements ContainerUomConversionInterface {

    private readonly logger = new AppLogger(ContainerUomConversionRepository.name)

    constructor(
        @Inject("ContainerUnitofMeasureConversionModel")
        private readonly containerUnitofMeasureConversionModel: typeof ContainerUnitofMeasureConversionModel
    ) { }

    async findAll(companyNo: Number, orderNo: Number, shippingReferenceNo: Number): Promise<ContainerUnitofMeasureConversion[]> {


        this.logger.log(`Container Unit of Measure Conversion Logic`)

        const result = await this.containerUnitofMeasureConversionModel.findAll({
            where: {
                companyNo,
                orderNo,
                shippingReferenceNo
            }
        })


        return result.map(containerUnitofMeasureConversionMapper)
    }

    async findOne(companyNo: Number, productCode: string, containerCode: string, unitOfMeasure: string): Promise<ContainerUnitofMeasureConversion | null> {

        const result = await this.containerUnitofMeasureConversionModel.findOne({
            where: {
                companyNo,
                productCode,
                containerCode,
                unitOfMeasure
            }
        })

        return result ? containerUnitofMeasureConversionMapper(result) : null
    }
}