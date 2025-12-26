import { SpInfo } from "../../domain/entities/spinfo.entity";
import { SpInfoModel } from "../models/spinfo.model";

/**
 * Maps a SpInfo database model to a domain entity
 * @function spinfoMapper
 * @param {SpInfoModel} record - The SpInfo database model to map
 * @returns {SpInfo} The mapped SpInfo domain entity
 * @throws {Error} If the record is null or undefined
 * @example
 * const spinfoModel = await SpInfoModel.findByPk(1);
 * const spinfo = spinfoMapper(spinfoModel);
 */
export function spinfoMapper(record: SpInfoModel): SpInfo {
  if (!record) {
    throw new Error("SpInfo record is null or undefined");
  }

  // Use factory method to create entity
  return SpInfo.create({
    reportName: record?.reportName?.trim(),
    fieldKey: record?.fieldKey?.trim(),
    fieldDescription: record?.fieldDescription?.trim(),
    fieldComponent: record?.fieldComponent?.trim(),
    fieldDataType: record?.fieldDataType?.trim(),
    fieldSequence: record?.fieldSequence,
    variableType: record?.variableType?.trim(),
    xmlMetadata: record?.xmlMetadata?.trim(),
    storedProcedureName: record?.storedProcedureName?.trim(),
    spSequence: record?.spSequence,
    fieldLength: record?.fieldLength?.trim() || null,
    isApiCall: record?.isApiCall?.trim() || 'n',
    apiEndpoint: record?.apiEndpoint?.trim() || '',
    status: record?.status?.trim() || 'A',
    useCase: record?.useCase?.trim() || '',
  });
} 