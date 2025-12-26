import {
  SogasSubType,
  ProcessType,
} from "@src/shared/constants/strategy-type.enum";
import {
  csvFlexiHeaderMapping,
  totalBatchSize,
  FLEXI_XLSX_HEADERS,
  csvSogasHeaderMapping,
  SOGAS_XLSX_HEADERS,
  CLEAR_CHECKS_XLSX_HEADERS,
} from "@src/shared/constants/upload-file-constant";

export const processTypeConfig = {
  [ProcessType.FLEXI]: {
    groupKeys: [
      csvFlexiHeaderMapping.invoiceNo,
      csvFlexiHeaderMapping.vendorNo,
    ],
    batchSize: totalBatchSize,
    expectedHeaders: FLEXI_XLSX_HEADERS,
  },
  [ProcessType.SOGAS]: {
    [SogasSubType.REGULAR]: {
      groupKeys: [csvSogasHeaderMapping.invoiceNo],
      batchSize: totalBatchSize,
      expectedHeaders: SOGAS_XLSX_HEADERS,
    },
    [SogasSubType.TAX]: {
      groupKeys: [csvSogasHeaderMapping.invoiceNo],
      batchSize: totalBatchSize,
      expectedHeaders: SOGAS_XLSX_HEADERS,
    },
  },
  [ProcessType.PAPER]: {
    batchSize: totalBatchSize,
  },
  [ProcessType.CLEAR_CHECKS]: {
    groupKeys: ["check No"], // Group by check number since each record is unique
    batchSize: totalBatchSize,
    expectedHeaders: CLEAR_CHECKS_XLSX_HEADERS,
  },
};

export function getProcessTypeConfig(
  processType: string,
  subType?: string
): any {
  if (processType === ProcessType.SOGAS) {
    if (!subType) {
      throw new Error("subType is required for SOGAS process");
    }
    const config = processTypeConfig[processType][subType];
    if (!config) {
      throw new Error(
        `Unsupported process type or subtype: ${processType}${subType ? " / " + subType : ""}`
      );
    }
    return config;
  } else if (processType === ProcessType.FLEXI) {
    const config = processTypeConfig[processType];
    if (!config) {
      throw new Error(`Unsupported process type: ${processType}`);
    }
    return config;
  } else if (processType === ProcessType.PAPER) {
    const config = processTypeConfig[processType];
    if (!config) {
      throw new Error(`Unsupported process type: ${processType}`);
    }
    return config;
  } else if (processType === ProcessType.CLEAR_CHECKS) {
    const config = processTypeConfig[processType];
    if (!config) {
      throw new Error(`Unsupported process type: ${processType}`);
    }
    return config;
  } else {
    throw new Error(`No such process type exists: ${processType}`);
  }
}
