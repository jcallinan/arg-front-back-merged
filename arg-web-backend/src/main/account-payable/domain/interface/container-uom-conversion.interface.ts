import { ContainerUnitofMeasureConversion } from "../entities/container-uom-conversion.entity";

export interface ContainerUomConversionInterface {
    findAll(
        companyNo: Number,
        orderNo: Number,
        shippingReferenceNo: Number
    ): Promise<ContainerUnitofMeasureConversion[]>;

    findOne(
        companyNo: Number,
        productCode: string,
        containerCode: string,
        unitOfMeasure: string 
    ): Promise<ContainerUnitofMeasureConversion | null>
}
