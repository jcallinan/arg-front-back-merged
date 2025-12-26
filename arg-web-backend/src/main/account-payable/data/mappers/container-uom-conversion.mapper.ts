import { ContainerUnitofMeasureConversion } from "../../domain/entities/container-uom-conversion.entity";
import { ContainerUnitofMeasureConversionModel } from "../models/container-uom-conversion.model";

/**
 * Maps a container unit of measure conversion database model to a domain entity
 * @function containerUnitofMeasureConversionMapper
 * @param {ContainerUnitofMeasureConversionModel} record - The container unit of measure conversion database model to map
 * @returns {ContainerUnitofMeasureConversion} The mapped container unit of measure conversion domain entity
 * @throws {Error} If the record is null or undefined
 * @example
 * const containerUnitofMeasureConversionModel = await ContainerUnitofMeasureConversionModel.findByPk(1);
 * const containerUnitofMeasureConversion = containerUnitofMeasureConversionMapper(containerUnitofMeasureConversionModel);
 */
export function containerUnitofMeasureConversionMapper(record: ContainerUnitofMeasureConversionModel): ContainerUnitofMeasureConversion {
  if (!record) {
    throw new Error("ContainerUnitofMeasureConversion record is null or undefined");
  }

  // Use factory method to create entity
  return ContainerUnitofMeasureConversion.create({
    isDeleted: record.isDeleted,
    companyNo: record.companyNo,
    productCode: record.productCode,
    containerCode: record.containerCode,
    unitOfMeasure: record.unitOfMeasure,
    operandMultDiv: record.operandMultDiv,
    conversionFactor: record.conversionFactor,
    hazMatYN: record.hazMatYN,
    imsIssueUnitOfMeas: record.imsIssueUnitOfMeas,
    freightExpenseGl: record.freightExpenseGl,
    filler: record.filler
  });
}
