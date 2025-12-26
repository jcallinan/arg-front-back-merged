import { Sequelize, ConnectionOptions } from "@sequelize/core";
import { IBMiDialect } from "@sequelize/db2-ibmi";
import { Logger } from "@nestjs/common";
import { DbTarget } from "@src/shared/constants/db-target.enum";
import { initializeCompany } from "@src/main/account-payable/data/models/company.model";
import { initializeVoucherDetail } from "@src/main/account-payable/data/models/voucher-detail.model";
import { initializeVoucherHeader } from "@src/main/account-payable/data/models/voucher-header.model";
import { initializeVendor, VendorModel } from "@src/main/account-payable/data/models/vendor.model";
import { initializeGeneralSystem } from "@src/main/account-payable/data/models/general-system.model";
import {
  initializeFreightInvoiceHeader,
  FreightInvoiceHeaderModel,
} from "@src/main/account-payable/data/models/freight-invoice-header.model";
import { initializeGlMaster } from "@src/main/account-payable/data/models/gl-master.model";
import {
  initializeCarrierInvoiceHeader,
  CarrierInvoiceHeaderModel,
} from "@src/main/account-payable/data/models/carrier-invoice-header.model";
import { initializeApdate } from "@src/main/account-payable/data/models/apdate.model";
import { initializeInventoryFutureTrans } from "@src/main/account-payable/data/models/inventory-future-trans.model";
import { initializeInventoryHistory } from "@src/main/account-payable/data/models/inventory-history.model";
import { initializeFreightOutBalancingInvoice } from "@src/main/account-payable/data/models/freight-out-balancing-header.model";
import { initializeFreightCarrierInvoice } from "@src/main/account-payable/data/models/freight-carrier-invoice.model";
import { initializeSpooledMetadataReport } from "../../main/account-payable/data/models/spooled-metadata-report.model";
import { OwnerVendorReferenceModel, initializeOwnerVendorReference } from "@src/main/account-payable/data/models/owner-vendor-reference.model";
import { initializeVoucherHeaderHistory } from "@src/main/account-payable/data/models/voucher-header-history.model";
import { initializeVoucherDetailHistory } from "@src/main/account-payable/data/models/voucher-detail-history.model";
import { initializeProcessType } from "@src/main/account-payable/data/models/process-type.model";
import { initializeSalesAnalysisDetail } from "@src/main/account-payable/data/models/sales-analysis-detail.model";
import { initializeSalesAnalysisMisc } from "@src/main/account-payable/data/models/sales-analysis-misc.model";
import { initializeProdMoveDetailLogical } from "@src/main/account-payable/data/models/prod-move-detail-logical.model";
import { initializeProdMoveMiscLogical } from "@src/main/account-payable/data/models/prod-move-misc-logical.model";
import { initializeBillingControlFile } from "@src/main/account-payable/data/models/billing-control-file.model";
import { initializeContainerUnitofMeasureConversion } from "@src/main/account-payable/data/models/container-uom-conversion.model";
import { CheckInquiryModel, initializeCheckInquiry } from "@src/main/account-payable/data/models/check-inquiry.model";
import { CheckInquiryHistoryModel, initializeCheckInquiryHistory } from "@src/main/account-payable/data/models/check-inquiry-history.model";
import {
  initializeOpenPayableHeaderModel,
  OpenPayableHeaderModel,
} from "@src/main/account-payable/data/models/open-payable-header.model";
import {
  initializeOpenPayableDetailsModel,
  OpenPayableDetailsModel,
} from "@src/main/account-payable/data/models/open-payable-details.model";
import {
  initializeOpenPayableVendorModel,
  OpenPayableVendorModel,
} from "@src/main/account-payable/data/models/open-payable-vendor.model";
import { initializeVendorContactDetail, VendorContactDetailModel } from "@src/main/account-payable/data/models/vendor-contact-detail.model";
import { initializeOpenPayableHistoryHeader } from "@src/main/account-payable/data/models/open-payable-history-header.model";
import { initializeOpenPayableHistoryVendor } from "@src/main/account-payable/data/models/open-payable-history-vendor.model";
import { initializeOpenPayableHistoryDetail } from "@src/main/account-payable/data/models/open-payable-history-detail.model";
import { initializeSpInfo } from "@src/main/global-states/data/models/spinfo.model";
import { CheckInquiryLineItemModel, initializeCheckInquiryLineItem } from "@src/main/account-payable/data/models/check-inquiry-line-item.model";
import { CheckInquiryVoucherDetailModel, initializeCheckInquiryVoucherDetail } from "@src/main/account-payable/data/models/check-inquiry-voucher-detail.model";
import { initializeClearchecks } from "@src/main/account-payable/data/models/clearchecks.model";
import { initializeApPeriodEnd } from "@src/main/account-payable/data/models/ap-period-end.model";
import { initializeCarrier } from "@src/main/account-payable/data/models/carrier-model";
import { initializeGeneralSystemCompany } from "@src/main/global-states/data/models/general-system-company.model";
import { initializeNachaForAchPayments } from "@src/main/global-states/data/models/nacha-for-ach-payments.model";
import { initializePA1099YearEndPatax } from "@src/main/global-states/data/models/pa1099-year-end-patax.model";
import { initializeIRSTax } from "@src/main/global-states/data/models/irs-tax.model";
import { DynamicLibraryManager } from "@src/main/global-states/data/stored-procedure/dynamic-library-manager";
import { Environment } from "@src/shared/config/env-library-config";

const logger = new Logger("Database");
let sequelize: Sequelize | null = null;
let isModelsInitialized = false; // Track if models are already initialized
const isNotProd = process.env.NODE_ENV !== "prod";

function buildDsn(): string {
  const system = process.env.DB_SYSTEM;
  const username = process.env.DB_USERNAME;
  const password = process.env.DB_PASSWORD;
  const defaultPkgLibrary = process.env.DB_DEFAULT_PKG_LIBRARY || "QGPL";
  const defaultPackage =
    process.env.DB_DEFAULT_PACKAGE || "A/DEFAULT(IBM),2,0,1,0,512";

  return `DRIVER={IBM i Access ODBC Driver 64-bit};SYSTEM=${system};UID=${username};PWD=${password};DefaultPkgLibrary=${defaultPkgLibrary};DefaultPackage=${defaultPackage};TranslateCCSID=65535;TranslateCCSIDEnabled=1;ForceTranslation=1;`;

}

function getAs400ConnectionConfig(): ConnectionOptions<IBMiDialect> {
  // const dsn = process.env.DB_DSN || "DSN=AS400DB"; 
  const dsn = buildDsn();
  // Optimized connection timeout for development
  const connectionTimeout = isNotProd
    ? parseInt(process.env.DB_CONNECTION_TIMEOUT || "30", 10) // 30 seconds for dev
    : parseInt(process.env.DB_CONNECTION_TIMEOUT || "30", 10); // 30 seconds for prod

  logger.log(`Using ODBC DSN: ${dsn}`);
  return {
    odbcConnectionString: dsn,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    connectionTimeout: connectionTimeout,
  };
}

function initializeJoins() {
  FreightInvoiceHeaderModel.associate();
  CarrierInvoiceHeaderModel.associate();
  VendorModel.associate();
  OpenPayableHeaderModel.associate();
  OpenPayableDetailsModel.associate();
  OpenPayableVendorModel.associate();
  OwnerVendorReferenceModel.associate()
  CheckInquiryModel.associate()
  CheckInquiryHistoryModel.associate()
  CheckInquiryVoucherDetailModel.associate()
  CheckInquiryLineItemModel.associate()
  VendorContactDetailModel.associate()

  // FreightOutBalancingInvoiceModel.associate()
}

// Custom logging function for Sequelize
function customSequelizeLogger(sql: string, timing?: number) {
  const timestamp = new Date().toISOString();

  if (isNotProd) {
    // In development, use warn level to ensure visibility
    logger.warn(`[${timestamp}] [Sequelize Query] ${sql}`);
    if (timing) {
      logger.warn(`[${timestamp}] [Sequelize query Timing] ${timing}ms`);
    }
  } else {
    // In production, use debug level
    logger.debug(`[${timestamp}] [Sequelize Query] ${sql}`);
    if (timing) {
      logger.debug(`[${timestamp}] [Sequelize Timing] ${timing}ms`);
    }
  }
}

function initializeModels(sequelize: Sequelize) {
  if (!isModelsInitialized) {
    logger.log("Initializing database models...");
    const startTime = Date.now();

    initializeCompany(sequelize);
    initializeVoucherDetail(sequelize);
    initializeVendor(sequelize);
    initializeVoucherHeader(sequelize);
    initializeGeneralSystem(sequelize);
    initializeFreightInvoiceHeader(sequelize);
    initializeGlMaster(sequelize);
    initializeCarrierInvoiceHeader(sequelize);
    initializeApdate(sequelize);
    initializeInventoryFutureTrans(sequelize);
    initializeInventoryHistory(sequelize);
    initializeSpooledMetadataReport(sequelize);
    initializeOwnerVendorReference(sequelize);
    initializeVoucherHeaderHistory(sequelize);
    initializeVoucherDetailHistory(sequelize);
    initializeProcessType(sequelize);
    initializeFreightOutBalancingInvoice(sequelize);
    initializeFreightCarrierInvoice(sequelize);
    initializeSalesAnalysisDetail(sequelize);
    initializeSalesAnalysisMisc(sequelize);
    initializeProdMoveDetailLogical(sequelize);
    initializeProdMoveMiscLogical(sequelize);
    initializeBillingControlFile(sequelize);
    initializeContainerUnitofMeasureConversion(sequelize);
    initializeOpenPayableHeaderModel(sequelize);
    initializeOpenPayableDetailsModel(sequelize);
    initializeOpenPayableVendorModel(sequelize);
    initializeVendorContactDetail(sequelize);
    initializeOpenPayableHistoryHeader(sequelize);
    initializeOpenPayableHistoryVendor(sequelize);
    initializeOpenPayableHistoryDetail(sequelize);
    initializeSpInfo(sequelize);
    initializeCheckInquiry(sequelize);
    initializeCheckInquiryHistory(sequelize);
    initializeCheckInquiryVoucherDetail(sequelize);
    initializeCheckInquiryLineItem(sequelize);
    initializeClearchecks(sequelize);
    initializeApPeriodEnd(sequelize)
    initializeCarrier(sequelize)
    initializeGeneralSystemCompany(sequelize)
    initializeNachaForAchPayments(sequelize)
    initializePA1099YearEndPatax(sequelize)
    initializeIRSTax(sequelize)

    isModelsInitialized = true;
    const endTime = Date.now();
    logger.log(`Models initialized successfully in ${endTime - startTime}ms`);

    // Initialize Joins
    initializeJoins()
  }
}

export async function connectAs400Db2IBMi() {
  try {
    if (!sequelize) {
      const config = getAs400ConnectionConfig();
      
      sequelize = new Sequelize({
        ...config,
        dialect: DbTarget.AS400IBMI,
        logging: customSequelizeLogger,
        benchmark: true, // Enable benchmarking to get timing information
        logQueryParameters: isNotProd, // Enable query parameters in development
        // define: {
        //   schema: undefined, // Don't use default schema
        //   freezeTableName: true, // Use exact table names
        // },
        pool: {
          max: isNotProd ? 10 : 10, // Increase pool size in development
          min: 2, // Keep minimum connections alive
          acquire: isNotProd ? 30000 : 30000, // Increase acquire timeout
          idle: 10000, // Keep connections alive longer
          evict: 10000,
        },
        retry: {
          max: isNotProd ? 2 : 5, // Fewer retries in development
        },
      });

      // Optimize authentication with timeout
      const authTimeout = isNotProd ? 15000 : 15000; // 15 seconds for dev and prod
      const authPromise = sequelize.authenticate();
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(
          () => reject(new Error("Database authentication timeout")),
          authTimeout
        );
      });

      await Promise.race([authPromise, timeoutPromise]);
      logger.log("Database connection established successfully.");

      // Call SETENVPRC stored procedure to set dynamic libraries
      try {
        const env = (process.env.NODE_ENV as Environment) || "dev";
        logger.log("Setting dynamic libraries from SETENVPRC stored procedure...");
        const dynamicLibManager = DynamicLibraryManager.getInstance();
        const libraryConfig = await dynamicLibManager.setDynamicLibraries(env.toUpperCase());
        
        logger.log("Dynamic libraries set successfully:", libraryConfig);
        
        if (dynamicLibManager.hasErrors()) {
          logger.warn("SETENVPRC returned errors:", dynamicLibManager.getErrorMessage());
        }
        
      } catch (spError) {
        logger.error("SETENVPRC stored procedure failed:", spError);
      }

      // Initialize models
      initializeModels(sequelize);
    }
  } catch (error) {
    logger.error("Database connection failed:", error);
    throw new Error("Failed to connect to the database.");
  }
}

export function getAs400SequelizeInstance(): Sequelize {
  if (!sequelize) {
    throw new Error("Database connection is not established.");
  }
  return sequelize;
}

export function getAs400Connection(): any {
  if (!sequelize) {
    const config = getAs400ConnectionConfig();

    sequelize = new Sequelize({
      ...config,
      dialect: DbTarget.AS400IBMI,
      logging: customSequelizeLogger,
      benchmark: true, // Enable benchmarking to get timing information
      logQueryParameters: isNotProd,
      // define: {
      //   schema: undefined, // Don't use default schema
      //   freezeTableName: true, // Use exact table names
      // },
      pool: {
        max: isNotProd ? 5 : 10,
        min: 0,
        acquire: isNotProd ? 10000 : 30000,
        idle: 10000,
        evict: 10000,
      },
    });
  }
  return sequelize;
}