
import { CarrierModel } from "../models/carrier-model";
import { CarrierEntity } from "../../domain/entities/carrier.entity";

export class CarrierMapper {
    static toEntity(model: CarrierModel): CarrierEntity {
        return new CarrierEntity(
            model.isDeleted,
            model.companyNo,
            model.carrierId.trim(),
            model.carrierName.trim(),
            model.ein,
            model.fuelfacsCarrierId,
            model.filler01,
        );
    }


}