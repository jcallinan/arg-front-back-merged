import { Model } from "@sequelize/core";
import { Sequelize } from "@sequelize/core";
import { SpooledMetadataReportModelSchema } from "../schemas/schema";
import { initializeModel } from "@src/shared/config/model-initializer";

export class SpooledMetadataReportModel extends Model {
  public pdfFileName!: string;
  public spoolFileName!: string;
  public reportType!: string;
  public jobName!: string;
  public jobNumber!: number;
  public jobUser!: string;
  public jobSystemName!: string;
  public filePath!: string;
  public outputQueueName!: string;
  public outputQueueLibrary!: string;
  public reportDateTime!: Date;
  public formType!: string;
  public error!: string;
}

export function initializeSpooledMetadataReport(sequelize: Sequelize): void {
  initializeModel(sequelize, SpooledMetadataReportModel, "SpooledMetadataReport", SpooledMetadataReportModelSchema);
}

