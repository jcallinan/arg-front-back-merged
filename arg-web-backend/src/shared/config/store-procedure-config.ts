import { executeStoredProcedure } from "@src/main/account-payable/data/stored-procedure/executeStoredProcedure";
import {
  POST_TO_PURCHASE_JOURNAL_STORE_PROCEDURE,
  REPORT_MENU_STORE_PROCEDURE,
} from "@src/shared/constants/constant";
import { PAYMENT_STORE_PROCEDURE } from "@src/shared/constants/payment-constant";

// Define reusable config type
type SPConfig = {
  inputParams: string[]; // ordered keys to extract from paramsObj
  outputVars?: Record<string, string>; // optional output variables
  execute: (
    paramsObj: Record<string, string | number>
  ) => Promise<Record<string, string | null>>;
};

export const storeProcedureConfig: Record<string, SPConfig> = {
  [REPORT_MENU_STORE_PROCEDURE.AP_Month_End_Vendor_Totals]: {
    inputParams: ["companyNo", "reportDate", "reportName", "reportPath"],
    outputVars: { errVar: "CHAR(50)" },
    execute: async function (paramsObj) {
      const inputParams = mapInputParams(this, paramsObj);
      return executeStoredProcedure({
        procedureName: REPORT_MENU_STORE_PROCEDURE.AP_Month_End_Vendor_Totals,
        inputParams,
        outputVars: this.outputVars,
      });
    },
  },
  [REPORT_MENU_STORE_PROCEDURE.Outstanding_Check_Register]: {
    inputParams: [
      "companyNo",
      "outstandingCheckDate",
      "reportName",
      "reportPath",
    ],
    outputVars: { errVar: "CHAR(50)" },
    execute: async function (paramsObj) {
      const inputParams = mapInputParams(this, paramsObj);
      return executeStoredProcedure({
        procedureName: REPORT_MENU_STORE_PROCEDURE.Outstanding_Check_Register,
        inputParams,
        outputVars: this.outputVars,
      });
    },
  },
  [REPORT_MENU_STORE_PROCEDURE.AP_Month_End_Vendor_Subtotals]: {
    inputParams: ["companyNo", "reportDate", "reportName", "reportPath"],
    outputVars: { errVar: "CHAR(50)" },
    execute: async function (paramsObj) {
      const inputParams = mapInputParams(this, paramsObj);
      return executeStoredProcedure({
        procedureName: REPORT_MENU_STORE_PROCEDURE.AP_Month_End_Vendor_Subtotals,
        inputParams,
        outputVars: this.outputVars,
      });
    },
  },
  [REPORT_MENU_STORE_PROCEDURE.AP_Month_End_Vendor_Details]: {
    inputParams: ["companyNo", "reportDate", "reportName", "reportPath"],
    outputVars: { errVar: "CHAR(50)" },
    execute: async function (paramsObj) {
      const inputParams = mapInputParams(this, paramsObj);
      return executeStoredProcedure({
        procedureName:
          REPORT_MENU_STORE_PROCEDURE.AP_Month_End_Vendor_Details,
        inputParams,
        outputVars: this.outputVars,
      });
    },
  },
  [POST_TO_PURCHASE_JOURNAL_STORE_PROCEDURE.AP200PRC]: {
    inputParams: [
      "companyNo",
      "userId",
      "user",
      "purchaseJD",
      "keyCashDJD",
      "path",
    ],
    outputVars: { jrnVar: "CHAR(4)", errVar: "CHAR(50)" },
    execute: async function (paramsObj) {
      const inputParams = mapInputParams(this, paramsObj);
      return executeStoredProcedure({
        procedureName: POST_TO_PURCHASE_JOURNAL_STORE_PROCEDURE.AP200PRC,
        inputParams,
        outputVars: this.outputVars,
      });
    },
  },
  [PAYMENT_STORE_PROCEDURE.AP150ACLPRC]: {
    inputParams: ["userId"],
    outputVars: { errVar: "CHAR(50)" },
    execute: async function (paramsObj) {
      const inputParams = mapInputParams(this, paramsObj);
      return executeStoredProcedure({
        procedureName: PAYMENT_STORE_PROCEDURE.AP150ACLPRC,
        inputParams,
        outputVars: this.outputVars,
      });
    },
  },
  [PAYMENT_STORE_PROCEDURE.APPYTRHCLPRC]: {
    inputParams: [
      "userId",
      "companyNo",
      "bankAccountGl",
      "startingCheckNo",
      "checkDate",
      "dateToPayBy",
      "forcedDiscount",
      "keyHold",
    ],
    outputVars: { errVar: "CHAR(50)" },
    execute: async function (paramsObj) {
      const inputParams = mapInputParams(this, paramsObj);
      return executeStoredProcedure({
        procedureName: PAYMENT_STORE_PROCEDURE.APPYTRHCLPRC,
        inputParams,
        outputVars: this.outputVars,
      });
    },
  },
  [PAYMENT_STORE_PROCEDURE.APPYTRDCLPRC]: {
    inputParams: [
      "userId",
      "companyNo",
      "entrySequence",
      "bankAccountGl",
      "startingCheckNo",
      "checkDate",
      "dateToPayBy",
      "forcedDiscount",
      "vendorNo",
      "voucherNo",
      "partialPayAmount",
      "discountAmount",
      "payOrHold",
      "singleCheck",
      "makePrepaid",
      "prepaidCheckNo",
      "prepaidDate",
      "mode",
    ],
    outputVars: { errVar: "CHAR(50)" },
    execute: async function (paramsObj) {
      const inputParams = mapInputParams(this, paramsObj);
      return executeStoredProcedure({
        procedureName: PAYMENT_STORE_PROCEDURE.APPYTRDCLPRC,
        inputParams,
        outputVars: this.outputVars,
      });
    },
  },
};

function mapInputParams(
  config: SPConfig,
  paramsObj: Record<string, string | number>
): (string | number)[] {
  return config.inputParams.map((key) => {
    if (!(key in paramsObj)) {
      throw new Error(`Missing input param: ${key}`);
    }
    const value = paramsObj[key];
    if (value === undefined) {
      throw new Error(`Parameter ${key} is undefined`);
    }
    return value;
  });
}

// Helper function to safely get configuration for calling store procedure
export function callSP(reportType: string): SPConfig {
  const config = storeProcedureConfig[reportType];
  if (!config) {
    throw new Error(
      `Unsupported reportType: ${reportType}. Available types: ${Object.keys(storeProcedureConfig).join(", ")}`
    );
  }
  return config;
}
