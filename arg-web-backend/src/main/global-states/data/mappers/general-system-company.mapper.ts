import { GeneralSystemCompanyModel } from "../models/general-system-company.model";
import { GeneralSystemCompany } from "../../domain/entities/general-system-company.entity";

export function mapGeneralSystemCompanyModelToEntity(model: GeneralSystemCompanyModel): GeneralSystemCompany {
  return GeneralSystemCompany.create({
    fixedAssets: model.fixedAssets,
    orderEntryInvoicing: model.orderEntryInvoicing,
    salesAnalysis: model.salesAnalysis,
    inventory: model.inventory,
    purchaseOrder: model.purchaseOrder,
    billOfMaterial: model.billOfMaterial,
    jobShop: model.jobShop,
    jobCost: model.jobCost,
    filler1: model.filler1,
    multiWarehouseYn: model.multiWarehouseYn,
    thirteenAccountingPeriodsYn: model.thirteenAccountingPeriodsYn,
    fractionalQtyActive: model.fractionalQtyActive,
    apPostOverrideCode: model.apPostOverrideCode,
    arPostOverrideCode: model.arPostOverrideCode,
    faPostOverrideCode: model.faPostOverrideCode,
    glPostOverrideCode: model.glPostOverrideCode,
    companyNo: model.companyNo,
    filler2: model.filler2,
  });
}