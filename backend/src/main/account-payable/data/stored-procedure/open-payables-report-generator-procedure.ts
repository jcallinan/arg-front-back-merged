import { getAs400Connection } from '@src/shared/infrastructure/connection';
import { QueryTypes } from '@sequelize/core';
import { Logger } from '@nestjs/common';
import { ENV_LIBRARY_CONFIG, Environment } from "@src/shared/config/env-library-config";
import { generateReportDto } from '../../application/open-payables/dto/open-payables.dto';
import { Open_Payables_STORE_PROCEDURE } from '@src/shared/constants/constant';

const logger = new Logger('Open Payable Generate Report');

const dropVariableSP = async () => {

  const sequelize = getAs400Connection(); 

  const env = (process.env.NODE_ENV as Environment);
  const spSchema = ENV_LIBRARY_CONFIG[env].spLib;
  
  if (!spSchema) {
    throw new Error("ENV_LIBRARY_CONFIG[env].spLib is not configured. Set DB_SP_LIB for the current NODE_ENV.");
  }

  try {
    await sequelize.query(`DROP VARIABLE ${spSchema}.parmJrnId;`, { type: QueryTypes.RAW }).catch(() => { });
    await sequelize.query(`DROP VARIABLE ${spSchema}.parmErrMsg;`, { type: QueryTypes.RAW }).catch(() => { });

    // Set schema
    await sequelize.query(`SET SCHEMA ${spSchema}`, { type: QueryTypes.RAW });

    // Create output variables
    await sequelize.query(`CREATE OR REPLACE VARIABLE ${spSchema}.parmJrnId CHAR(4);`, { type: QueryTypes.RAW });
    await sequelize.query(`CREATE OR REPLACE VARIABLE ${spSchema}.parmErrMsg CHAR(50);`, { type: QueryTypes.RAW });

    await sequelize.query(
      `SET ${spSchema}.parmJrnId = '0000';`,
      { type: QueryTypes.RAW }
    );
    await sequelize.query(
      `SET ${spSchema}.parmErrMsg = '';`,
      { type: QueryTypes.RAW }
    );
  } catch (error) {
    logger.error('Error during stored procedure execution:', error);

    // Always attempt cleanup
    await sequelize.query(`DROP VARIABLE ${spSchema}.parmJrnId;`, { type: QueryTypes.RAW }).catch(() => { });
    await sequelize.query(`DROP VARIABLE ${spSchema}.parmErrMsg;`, { type: QueryTypes.RAW }).catch(() => { });

    throw error;
  }
}

export const openPayableVendorAgedAndHold = async (
  reportName: string,
  path: string,
  data: generateReportDto
) => {
  const sequelize = getAs400Connection();

  const { holdVoucher, openPayables, companyNo } = data
 
  const env = (process.env.NODE_ENV as Environment);
  const spSchema = ENV_LIBRARY_CONFIG[env].spLib;
  const openPayablesSPName = `${spSchema}.${Open_Payables_STORE_PROCEDURE[openPayables]}`;
 
  if (!spSchema) {
    throw new Error("ENV_LIBRARY_CONFIG[env].spLib is not configured. Set DB_SP_LIB for the current NODE_ENV.");
  }
  const envUpper = env.toUpperCase()

  const hold = holdVoucher ?? ' '
  const companyId: string = JSON.stringify(companyNo)

  try {

    // Drop Variables
    await dropVariableSP()

    // Log inputs
    logger.log(`SP: ${openPayablesSPName}, env: ${envUpper}, comapanyNo: ${companyId},  reportName: ${reportName}, path: ${path}`);

    // Call stored procedure
    await sequelize.query(
      `CALL ${openPayablesSPName}(:env, :companyId, :hold, :reportName, :path, ${spSchema}.parmErrMsg);`,
      {
        replacements: { env: envUpper, companyId, hold, reportName, path },
        type: QueryTypes.RAW,
      }
    );

    // Get outputs
    const jrnIdResult = await sequelize.query(`VALUES (${spSchema}.parmJrnId);`, { type: QueryTypes.SELECT });
    const errMsgResult = await sequelize.query(`VALUES (${spSchema}.parmErrMsg);`, { type: QueryTypes.SELECT });

    const jrnId = jrnIdResult[0] ? Object.values(jrnIdResult[0])[0] : null;
    const errMsg = errMsgResult[0] ? Object.values(errMsgResult[0])[0] : null;

    logger.log(`Stored Procedure Output - JRNID: ${jrnId}, ErrorMsg: ${errMsg}`);

    // Drop variables
    await sequelize.query(`DROP VARIABLE ${spSchema}.parmJrnId;`, { type: QueryTypes.RAW });
    await sequelize.query(`DROP VARIABLE ${spSchema}.parmErrMsg;`, { type: QueryTypes.RAW });

    return { jrnId, errMsg };
  } catch (error) {
    logger.error('Error during stored procedure execution:', error);

    // Always attempt cleanup
    await sequelize.query(`DROP VARIABLE ${spSchema}.parmJrnId;`, { type: QueryTypes.RAW }).catch(() => { });
    await sequelize.query(`DROP VARIABLE ${spSchema}.parmErrMsg;`, { type: QueryTypes.RAW }).catch(() => { });

    throw error;
  }
}


export const openPayablesReportGenerateByVendor = async (
  reportName: string,
  path: string,
  data: generateReportDto
) => {
  const sequelize = getAs400Connection();

  // const env = process.env.NODE_ENV || 'dev'
  const { openPayables, companyNo, dateOne, dateTwo, dateThree, dateFour, populateSpreadsheet } = data

  const env = (process.env.NODE_ENV as Environment);
  const spSchema = ENV_LIBRARY_CONFIG[env].spLib;
  if (!spSchema) {
    throw new Error("ENV_LIBRARY_CONFIG[env].spLib is not configured. Set DB_SP_LIB for the current NODE_ENV.");
  }
  const envUpper = env.toUpperCase()
  const openPayablesSPName = `${spSchema}.${Open_Payables_STORE_PROCEDURE[openPayables]}`;
 
  const companyId: string = JSON.stringify(companyNo)

  try {
    await dropVariableSP()

    // Log inputs
    logger.log(`Schema: ${openPayablesSPName}, env: ${envUpper}, reportName: ${reportName}, path: ${path}`);

    // Date Logs
    logger.log(`DateOne: ${dateOne}, DateTwo: ${dateTwo}, DateThree: ${dateThree}, DatFour: ${dateFour}, populateSpreedsheet: ${populateSpreadsheet}`);

    // Call stored procedure
    const result = await sequelize.query(
      `CALL ${openPayablesSPName}(:env, :companyId, :dateOne, :dateTwo, :dateThree, :dateFour, :populateSpreadsheet, :reportName, :path, ${spSchema}.parmErrMsg);`,
      {
        replacements: { env: envUpper, companyId, dateOne, dateTwo, dateThree, dateFour, populateSpreadsheet, reportName, path },
        type: QueryTypes.RAW,
      }
    );

    logger.log(`${result} ERRROR log`);

    // Get outputs
    const jrnIdResult = await sequelize.query(`VALUES (${spSchema}.parmJrnId);`, { type: QueryTypes.SELECT });
    const errMsgResult = await sequelize.query(`VALUES (${spSchema}.parmErrMsg);`, { type: QueryTypes.SELECT });

    const jrnId = jrnIdResult[0] ? Object.values(jrnIdResult[0])[0] : null;
    const errMsg = errMsgResult[0] ? Object.values(errMsgResult[0])[0] : null;

    logger.log(`Stored Procedure Output - JRNID: ${jrnId}, ErrorMsg: ${errMsg}`);

    // Drop variables
    await sequelize.query(`DROP VARIABLE ${spSchema}.parmJrnId;`, { type: QueryTypes.RAW });
    await sequelize.query(`DROP VARIABLE ${spSchema}.parmErrMsg;`, { type: QueryTypes.RAW });

    return { jrnId, errMsg };
  } catch (error) {
    logger.error('Error during stored procedure execution:', error);

    // Always attempt cleanup
    await sequelize.query(`DROP VARIABLE ${spSchema}.parmJrnId;`, { type: QueryTypes.RAW }).catch(() => { });
    await sequelize.query(`DROP VARIABLE ${spSchema}.parmErrMsg;`, { type: QueryTypes.RAW }).catch(() => { });

    throw error;
  }
};




