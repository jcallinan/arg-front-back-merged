import { Apdate } from "@src/main/account-payable/domain/entities/apdate.entity";
import { ApdateModel } from "@src/main/account-payable/data/models/apdate.model";

export class ApdateMapper {
  static toEntity(model: ApdateModel): Apdate {
    return new Apdate(
      model.companyNo,
      model.calculatedDate,
      model.newDate,
      model.isDeleted,
    );
  }

  static toModel(entity: Partial<Apdate>): Partial<ApdateModel> {
    return {
      companyNo: entity.companyNo,
      calculatedDate: entity.calculatedDate,
      newDate: entity.newDate,
      isDeleted: entity.isDeleted,
    };
  }
}
