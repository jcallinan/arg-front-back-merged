import { NachaForAchPaymentsModel } from "@src/main/global-states/data/models/nacha-for-ach-payments.model";
import { PA1099YearEndPataxModel } from "@src/main/global-states/data/models/pa1099-year-end-patax.model";
import {
  nachaForAchPaymentsSchema,
  pa1099YearEndPataxSchema,
  irsTaxSchema,
} from "@src/main/global-states/data/schemas/schema";
import { NachaForAchPaymentsEntity } from "@src/main/global-states/domain/entities/nacha-for-ach-payments.entity";
import { PA1099YearEndPataxEntity } from "@src/main/global-states/domain/entities/pa1099-year-end-patax.entity";
import { getTimestamp, TIMESTAMP_FORMATS } from "../utils/format-date";
import { IRSTaxModel } from "@src/main/global-states/data/models/irs-tax.model";
import { IRSTaxEntity } from "@src/main/global-states/domain/entities/irs-tax.entity";
import { AP_REPORT_TYPES, PAYMENT_REPORT_TYPES } from "../constants/constant";

export const REPORT_USECASES = {
  paymentSelection: {
    key: "paymentSelection",
    usecase: "payment-selection",
    usecaseDescription: "Payment Selection",
  },
  pa1099YearEndPatax: {
    key: "pa1099YearEndPatax",
    usecase: "pa1099-year-end-patax",
    usecaseDescription: "PA1099 Year End (PATAX)",
  },
  irsTax: {
    key: "irsTax",
    usecase: "irs-tax",
    usecaseDescription: "IRS Tax",
  },
};

export const REPORT_USECASES_ENUM = Object.values(REPORT_USECASES).map(u => u.usecase);

export const FILE_TYPE = {
  excel: "xlsx",
  txt: "txt",
};

export const REPORT_OUTPUT_FILES = {
  excel: FILE_TYPE.excel,
  txt: FILE_TYPE.txt,
};

export const REPORT_REQUIRED_PARAMETERS = {
  [REPORT_USECASES.paymentSelection.key]: [],
  [REPORT_USECASES.pa1099YearEndPatax.key]: ["formType", "reportYear"],
  [REPORT_USECASES.irsTax.key]: ["formType", "reportYear"],
};

export const REPORT_FILE_PREFIX = {
  apNachaAchCreation: "AP-Nacha-ACH-Creation",
  pa1099YearEndPatax: "PA1099",
  irsTax: "IRSTAX",
};

export const spooledReportMetaData = {
  spoolFileName: "APREPORT",
  jobUser: "QUSER",
  outputQueueName: "DAMCOOUTQ",
  outputQueueLibrary: "QUSRSYS",
  formType: "XLS",
};

export const GenerateReportConfig = {
  [REPORT_USECASES.paymentSelection.usecase]: {
    model: NachaForAchPaymentsModel,
    entity: NachaForAchPaymentsEntity,
    outputFiles: [REPORT_OUTPUT_FILES.txt],
    reportType: PAYMENT_REPORT_TYPES.AP_Nacha_ACH_Creation,
    getReportMetaData: (fileType: string) => ({
      ...spooledReportMetaData,
      formType: fileType.toUpperCase(),
    }),
    filePrefix: () => {
      return REPORT_FILE_PREFIX.apNachaAchCreation;
    },
    fileSuffix: () => getTimestamp(TIMESTAMP_FORMATS.COMPACT),
    requiredParameters: REPORT_REQUIRED_PARAMETERS.paymentSelection,
    columnMap: Object.fromEntries(
      // remap to actual DB schema column names to text headers
      Object.entries(nachaForAchPaymentsSchema).map(
        ([prop, def]: [string, any]) => [prop, def.field]
      )
    ),
  },
  [REPORT_USECASES.pa1099YearEndPatax.usecase]: {
    model: PA1099YearEndPataxModel,
    entity: PA1099YearEndPataxEntity,
    outputFiles: [REPORT_OUTPUT_FILES.excel],
    reportType: AP_REPORT_TYPES.Printing_1099_File,
    getReportMetaData: (fileType: string) => ({
      ...spooledReportMetaData,
      formType: fileType.toUpperCase(),
    }),
    filePrefix: (params: Record<string, any>) =>
      `${REPORT_FILE_PREFIX.pa1099YearEndPatax}${params.reportYear}${params.formType}`,
    fileSuffix: () => getTimestamp(TIMESTAMP_FORMATS.COMPACT),
    requiredParameters: REPORT_REQUIRED_PARAMETERS.pa1099YearEndPatax,
    columnMap: Object.fromEntries(
      // remap to actual DB schema column names to excel headers
      Object.entries(pa1099YearEndPataxSchema).map(
        ([prop, def]: [string, any]) => [prop, def.field]
      )
    ),
  },
  [REPORT_USECASES.irsTax.usecase]: {
    model: IRSTaxModel,
    entity: IRSTaxEntity,
    outputFiles: [REPORT_OUTPUT_FILES.txt],
    reportType: AP_REPORT_TYPES.Printing_1099_File,
    getReportMetaData: (fileType: string) => ({
      ...spooledReportMetaData,
      formType: fileType.toUpperCase(),
    }),
    filePrefix: (params: Record<string, any>) =>
      `${REPORT_FILE_PREFIX.irsTax}${params.reportYear}${params.formType}`,
    fileSuffix: () => getTimestamp(TIMESTAMP_FORMATS.COMPACT),
    requiredParameters: REPORT_REQUIRED_PARAMETERS.irsTax,
    columnMap: Object.fromEntries(
      // remap to actual DB schema column names to text headers
      Object.entries(irsTaxSchema).map(([prop, def]: [string, any]) => [
        prop,
        def.field,
      ])
    ),
  },
};
