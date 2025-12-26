import { Injectable, Inject } from "@nestjs/common";
import { getAs400Connection } from "@src/shared/infrastructure/connection";
import { QueryTypes } from "@sequelize/core";
import { AppLogger } from "@src/shared/logger/logger.service";

import { ENV_LIBRARY_CONFIG, Environment } from "@src/shared/config/env-library-config";
import { SpInfoInterface, SpExecutionInterface, SpParameter } from "../../domain/interface/spinfo.interface";
import { SpInfo } from "../../domain/entities/spinfo.entity";
import { ReportInterface } from "@src/main/account-payable/domain/interface/report.interface";
import { ReportEntity } from "@src/main/account-payable/domain/entities/report.entity";
import { ignoreFieldsLowerCase } from "@src/shared/constants/sp";
import { currentUserInitials } from "@src/shared/utils/user-context";
import { cleanupVariables } from "@src/shared/utils/db.utils";

export interface DynamicSpExecutionResult {
  success: boolean;
  data?: Record<string, any>;
  error?: string;
  spInfo?: SpInfo[];
}

@Injectable()
export class DynamicSpExecutor implements SpExecutionInterface {
  private readonly logger = new AppLogger(DynamicSpExecutor.name);

  constructor(
    @Inject("SpInfoInterface")
    private readonly spInfoInterface: SpInfoInterface,
    @Inject("ReportInterface")
    private readonly reportInterface: ReportInterface
  ) { }
  /**
   * Execute a stored procedure dynamically based on report name
   * @param data - The execution data containing report name and parameters
   * @returns Execution result with SP info and output
   */
  async executeSpByReportName(
    data: { name: string, parameters: SpParameter[] }
  ): Promise<Record<string, any>> {
    this.logger.log(`Executing SP for report name: ${data.name}`);
    const useCase = data.name;
    try {
      // promise .all for these two below db calls
      // Step 1: Get SP information from database
      const spInfo = await this.spInfoInterface.findAllByReportName({ name: useCase, variableType: "all" });
      const reportName = [...new Set(spInfo.map(sp => sp.reportName))];
      const reportsData = await this.reportInterface.findAll(reportName);
      // Create Map with trimmed keys to avoid trailing space issues
      const reportData = new Map(reportsData.map(report => [report.reportName.trim(), report]));


      if (!spInfo || spInfo.length === 0) {
        return {
          success: false,
          error: `No stored procedure found for report name: ${reportName}`,
        };
      }
      // Step 2: Validate parameters against each SP separately
      const validationResult = this.validateParametersPerSp(spInfo, data);
      if (!validationResult.isValid) {
        return {
          success: false,
          error: validationResult.error,
        };
      }

      // Step 3: Execute the stored procedure
      const executionResult = await this.executeStoredProcedure(spInfo, data.parameters, reportData);
      this.logger.log(`Execution result: ${JSON.stringify(executionResult)}`);
      return executionResult.finalOutput;
    } catch (error: unknown) {
      this.logger.error(`Error executing SP for ${data.name}:`, error as string);
      return {
        success: false,
        error: `Failed to execute stored procedure: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }

  /**
   * Validate that provided parameters match requirements for each SP separately
   * Groups by reportName + storedProcedureName and validates each SP's parameter requirements per report
   */
  private validateParametersPerSp(
    spInfo: SpInfo[],
    data: { name: string, parameters: SpParameter[] }
  ): { isValid: boolean; error?: string } {
    // Group SP info by reportName + storedProcedureName to validate each SP separately per report
    const spGroups = spInfo.reduce((groups, info) => {
      const uniqueKey = `${info.reportName.trim()}::::${info.storedProcedureName}`;
      if (!groups[uniqueKey]) {
        groups[uniqueKey] = [];
      }
      groups[uniqueKey]!.push(info);
      return groups;
    }, {} as Record<string, SpInfo[]>);

    this.logger.log(`Validating parameters for ${Object.keys(spGroups).length} unique SPs: ${Object.keys(spGroups).join(', ')}`);

    // Validate each SP's parameters separately
    for (const [uniqueKey, spGroup] of Object.entries(spGroups)) {
      const [reportName, spName] = uniqueKey.split("::::");
      this.logger.log(`Validating SP: ${spName} for report: ${reportName}`);

      // Get required input parameters for this specific SP
      const requiredInputs = spGroup
        .filter(info => info.variableType.trim().toLowerCase() === 'in')
        .map(info => info.fieldKey.toLowerCase());

      this.logger.log(`SP ${spName} requires inputs: [${requiredInputs.join(', ')}]`);

      // Get provided parameter names
      const providedNames = data.parameters.map(param => param.name.toLowerCase());

      // Define parameters that have default values (don't need to be provided)
      const parametersWithDefaults = ignoreFieldsLowerCase;

      // Check if all required inputs are provided (excluding those with defaults)
      const missingParams = requiredInputs.filter(
        required => !providedNames.includes(required.toLowerCase()) && !parametersWithDefaults.includes(required.toLowerCase())
      );

      if (missingParams.length > 0) {
        this.logger.error(`SP ${spName} for report ${reportName} validation failed: Missing parameters: [${missingParams.join(', ')}]`);
        return {
          isValid: false,
          error: `Missing required parameters for SP ${spName} (report: ${reportName}): ${missingParams.join(', ')}`,
        };
      }

      // Check for extra parameters
      const extraParams = providedNames.filter(
        provided => !requiredInputs.includes(provided.toLowerCase())
      );

      if (extraParams.length > 0) {
        this.logger.warn(`SP ${spName} for report ${reportName}: Extra parameters provided: [${extraParams.join(', ')}]`);
      }

      this.logger.log(`SP ${spName} for report ${reportName} validation passed successfully`);
    }

    return { isValid: true };
  }

  /**
   * Execute the stored procedure with the provided parameters
   */
  private async executeStoredProcedure(
    spInfo: SpInfo[],
    parameters: SpParameter[],
    reportData: Map<string, ReportEntity>
  ): Promise<Record<string, any>> {
    const sequelize = getAs400Connection();
    let env = (process.env.NODE_ENV as Environment);
    const spSchema = ENV_LIBRARY_CONFIG[env].spLib;
    if (!spSchema) {
      throw new Error("ENV_LIBRARY_CONFIG[env].spLib is not configured. Set DB_SP_LIB for the current NODE_ENV.");
    }
    const envUpper = env.toUpperCase()
    
    const uid = Math.random().toString(36).slice(2, 8);

    // Group SPs by reportName + storedProcedureName to handle same SP for different reports
    const uniqueSpMap = new Map<string, SpInfo>();
    for (const info of spInfo) {
      const uniqueKey = `${info.reportName.trim()}::::${info.storedProcedureName}`;
      if (!uniqueSpMap.has(uniqueKey) || uniqueSpMap.get(uniqueKey)!.spSequence > info.spSequence) {
        uniqueSpMap.set(uniqueKey, info);
      }
    }

    // Sort unique SPs by spSequence to ensure correct execution order
    const sortedUniqueSpInfo = Array.from(uniqueSpMap.values())
      .sort((a, b) => a.spSequence - b.spSequence);

    this.logger.log(`Executing ${sortedUniqueSpInfo.length} unique SPs in sequence for report: ${reportData}`);
    this.logger.log(`SP execution order: ${sortedUniqueSpInfo.map(sp => `${sp.storedProcedureName} for ${sp.reportName.trim()} (seq: ${sp.spSequence})`).join(' -> ')}`);

    const allResults: Record<string, any>[] = [];
    let lastOutput: Record<string, any> = {};

    // Execute each unique SP once in sequence
    for (let i = 0; i < sortedUniqueSpInfo.length; i++) {
      const currentSp = sortedUniqueSpInfo[i]!;
      const spName = currentSp.storedProcedureName;
      const spSequence = currentSp.spSequence;

      this.logger.log(`Executing SP ${i + 1}/${sortedUniqueSpInfo.length}: ${spName} with sequence: ${spSequence} in schema: ${spSchema}`);

      // Declare resolvedVars outside try block to ensure cleanup in error cases
      let resolvedVars: Record<string, { fullName: string; type: string }> = {};

      try {
        // Verify SP exists before execution
        await this.verifyStoredProcedure(sequelize, spSchema, spName);

        // Prepare and execute SP
        const inputParams = this.prepareInputParametersForSp(currentSp, spInfo, parameters, reportData, envUpper);
        const outputVars = this.prepareOutputVariablesForSp(currentSp, spInfo);
        resolvedVars = this.generateUniqueVariableNames(outputVars, spSchema, uid);

        try {
          await this.setupExecutionEnvironment(sequelize, spSchema, resolvedVars);
          const result = await this.executeStoredProcedureCall(sequelize, spSchema, spName, inputParams, resolvedVars);

          // Store result for this SP
          allResults.push({
            spName,
            spSequence,
            executionOrder: i + 1,
            result,
            success: true
          });

          // Update lastOutput for potential use in next SP
          lastOutput = result;

          this.logger.log(`SP ${spName} executed successfully. Output: ${JSON.stringify(result)}`);
        } finally {
          // Ensure cleanup in success path
          await cleanupVariables(sequelize, resolvedVars);
        }
      } catch (error) {
        this.logger.error(`Error executing SP ${spName} (sequence: ${spSequence}):`, error as string);

        // Store error result for this SP
        allResults.push({
          spName,
          spSequence,
          executionOrder: i + 1,
          error: error instanceof Error ? error.message : String(error),
          success: false
        });

        // Decide whether to continue or stop on error
        // For now, we'll continue with next SPs, but you can modify this behavior
        this.logger.warn(`Continuing with next SPs despite error in ${spName}`);
      }
      finally {
        await cleanupVariables(sequelize, resolvedVars);
      }
    }

    // Return comprehensive results
    return {
      totalSps: sortedUniqueSpInfo.length,
      executedSps: allResults.filter(r => r.success).length,
      failedSps: allResults.filter(r => !r.success).length,
      results: allResults,
      finalOutput: lastOutput
    };
  }

  /**
   * Verify that the stored procedure exists in the specified schema
   */
  private async verifyStoredProcedure(
    sequelize: any,
    spSchema: string,
    spName: string
  ): Promise<void> {
    try {
      const spExists = await sequelize.query(
        `SELECT ROUTINE_NAME FROM QSYS2.SYSROUTINES WHERE ROUTINE_SCHEMA = '${spSchema}' AND ROUTINE_NAME = '${spName}'`,
        { type: QueryTypes.SELECT }
      );

      if (!spExists || spExists.length === 0) {
        throw new Error(`Stored procedure ${spName} not found in schema ${spSchema}`);
      }

      this.logger.log(`Verified SP ${spName} exists in ${spSchema}`);
    } catch (error) {
      this.logger.error(`Error verifying SP ${spName}:`, error as string);
      throw new Error(`Stored procedure ${spName} not found or not accessible in ${spSchema}. Please check if the SP exists and is accessible.`);
    }
  }

  /**
   * Prepare input parameters for a single SP, considering previous SP's output
   */
  private prepareInputParametersForSp(
    currentSp: SpInfo,
    spInfo: SpInfo[],
    parameters: SpParameter[],
    reportData: Map<string, ReportEntity>,
    env: string
  ): (string | number)[] {
    const inputParams: (string | number)[] = [];
    const spName = currentSp.storedProcedureName;

    // Add environment as first parameter (always first for AS400 SPs)
    // Only add if the SP expects an environment parameter
    const hasEnvironmentInSpInfo = spInfo.some(info =>
      info.reportName.trim() === currentSp.reportName.trim() &&
      info.storedProcedureName === currentSp.storedProcedureName &&
      (info.fieldKey.toLowerCase() === 'environment' || info.fieldKey.toLowerCase() === 'env')
    );

    if (spInfo.length > 0 && hasEnvironmentInSpInfo) {
      const environmentParam = parameters.find(p =>
        p.name.toLowerCase() === 'environment' || p.name.toLowerCase() === 'env'
      );
      const environmentValue = environmentParam ? environmentParam.value : env;
      inputParams.push(environmentValue);
    }

    // Get all input parameters for this specific SP and report
    // Filter spInfo by reportName, storedProcedureName and variableType = 'in', then sort by fieldSequence
    const spInputs = spInfo
      .filter(info =>
        info.reportName.trim() === currentSp.reportName.trim() &&
        info.storedProcedureName === currentSp.storedProcedureName &&
        info.variableType.trim().toLowerCase() === 'in'
      )
      .sort((a, b) => Number(a.fieldSequence) - Number(b.fieldSequence));

    this.logger.log(`SP ${spName} has ${spInputs.length} input parameters: ${spInputs.map(i => `${i.fieldKey}(${i.fieldSequence})`).join(', ')}`);

    // Add parameters in exact order based on fieldSequence
    for (const input of spInputs) {
      if (input.fieldKey.toLowerCase() === 'environment' || input.fieldKey.toLowerCase() === 'env') {
        this.logger.log(`Skipping Environment parameter as it's already added as first parameter`);
        continue;
      }

      const param = parameters.find(p => p.name.toLowerCase() === input.fieldKey.toLowerCase());
      if (param) {
        inputParams.push(param.value);
        this.logger.log(`Added parameter: ${input.fieldKey} = ${param.value} (sequence: ${input.fieldSequence})`);
      } else {
        const defaultValue = this.getDefaultValueForParameter(input, reportData);
        inputParams.push(defaultValue);
        this.logger.log(`Added default parameter for: ${input.fieldKey} = ${defaultValue} (sequence: ${input.fieldSequence})`);
      }
    }

    this.logger.log(`Final parameter order for SP ${spName}: [${inputParams.map((p, i) => `${i}: ${p}`).join(', ')}]`);
    return inputParams;
  }

  /**
   * Get default value for a parameter based on its field key
   */
  private getDefaultValueForParameter(input: SpInfo, reportData: Map<string, ReportEntity>): string {
    const reportName = input.reportName.trim();
    const report = reportData.get(reportName);
    if (input.fieldKey.toLowerCase() === 'rpt_name') {
      const defaultValue = report?.reportName?.trim() || '';
      this.logger.log(`Using default Rpt_Name: ${defaultValue}`);
      return defaultValue;
    } else if (input.fieldKey.toLowerCase() === 'path') {
      const defaultValue = report?.path?.trim() || "/QNTC/B-P-DAMCOUB1/public/G-Drive/";
      this.logger.log(`Using empty default for Path: ${defaultValue}`);
      return defaultValue;
    } else if (ignoreFieldsLowerCase.includes(input.fieldKey.toLowerCase())) {
      const userId = currentUserInitials();
      const defaultValue = userId;
      this.logger.log(`Using default UsrID: ${defaultValue}`);
      return defaultValue;
    } else {
      const defaultValue = '';
      this.logger.log(`Using empty default for: ${input.fieldKey}`);
      return defaultValue;
    }
  }

  /**
   * Prepare output variables for a single SP
   */
  private prepareOutputVariablesForSp(currentSp: SpInfo, spInfo: SpInfo[]): Record<string, string> {
    const outputVars: Record<string, string> = {};
    const spName = currentSp.storedProcedureName;

    // Get all output variables for this specific SP and report
    // Filter spInfo by reportName, storedProcedureName and variableType = 'out'
    const spOutputs = spInfo
      .filter(info =>
        info.reportName.trim() === currentSp.reportName.trim() &&
        info.storedProcedureName === currentSp.storedProcedureName &&
        info.variableType.trim().toLowerCase() === 'out'
      );

    this.logger.log(`SP ${spName} has ${spOutputs.length} output variables: ${spOutputs.map(o => o.fieldKey).join(', ')}`);

    for (const output of spOutputs) {
      // Determine data type based on fieldDataType
      const dataType = output.fieldDataType?.toLowerCase() === 'integer' ? 'INTEGER' : 'VARCHAR(255)';
      outputVars[output.fieldKey] = dataType;
      this.logger.log(`Added output variable: ${output.fieldKey} = ${dataType}`);
    }

    this.logger.log(`Final output variables for SP ${spName}: ${JSON.stringify(outputVars)}`);
    return outputVars;
  }

  /**
   * Generate unique variable names for output variables
   */
  private generateUniqueVariableNames(
    outputVars: Record<string, string>,
    spSchema: string,
    uid: string
  ): Record<string, { fullName: string; type: string }> {
    return Object.entries(outputVars).reduce(
      (acc, [name, type]) => {
        const varName = `${name}_${uid}`;
        acc[name] = { fullName: `${spSchema}.${varName}`, type };
        return acc;
      },
      {} as Record<string, { fullName: string; type: string }>
    );
  }

  /**
   * Setup execution environment (schema, variables)
   */
  private async setupExecutionEnvironment(
    sequelize: any,
    spSchema: string,
    resolvedVars: Record<string, { fullName: string; type: string }>
  ): Promise<void> {
    // Drop any existing variables (safe cleanup)
    for (const { fullName } of Object.values(resolvedVars)) {
      await sequelize
        .query(`DROP VARIABLE ${fullName};`, { type: QueryTypes.RAW })
        .catch(() => { });
    }

    // Set schema
    await sequelize.query(`SET SCHEMA ${spSchema}`, { type: QueryTypes.RAW });

    // Create output variables
    for (const { fullName, type } of Object.values(resolvedVars)) {
      await sequelize.query(`CREATE OR REPLACE VARIABLE ${fullName} ${type};`, {
        type: QueryTypes.RAW,
      });
      await sequelize.query(`SET ${fullName} = '';`, { type: QueryTypes.RAW });
    }
  }

  /**
   * Execute the stored procedure call
   */
  private async executeStoredProcedureCall(
    sequelize: any,
    spSchema: string,
    spName: string,
    inputParams: (string | number)[],
    resolvedVars: Record<string, { fullName: string; type: string }>
  ): Promise<Record<string, any>> {
    // Prepare param placeholders like :1, :2, ...
    const paramPlaceholders = inputParams
      .map((_, i) => `:param${i + 1}`)
      .join(", ");

    const outputPlaceholders = Object.values(resolvedVars)
      .map((v) => v.fullName)
      .join(", ");

    // Build the CALL SQL
    const callSql = `CALL ${spSchema}.${spName}(${[paramPlaceholders, outputPlaceholders].filter(Boolean).join(", ")});`;

    // Create named replacements for the query
    const replacements = inputParams.reduce(
      (acc, val, idx) => {
        acc[`param${idx + 1}`] = val;
        return acc;
      },
      {} as Record<string, string | number>
    );

    this.logger.log(`callSql: ${callSql}`);
    this.logger.log(`replacements: ${JSON.stringify(replacements)}`);
    this.logger.log(`Calling SP: ${spName} with params: ${JSON.stringify(inputParams)}`);

    await sequelize.query(callSql, {
      replacements,
      type: QueryTypes.RAW,
    });

    this.logger.log(`after calling SP: ${spName} with params: ${JSON.stringify(inputParams)}`);

    // Read output values
    const output: Record<string, any> = {};
    for (const [name, { fullName }] of Object.entries(resolvedVars)) {
      const result = await sequelize.query(`VALUES (${fullName});`, {
        type: QueryTypes.SELECT,
      });
      output[name] = result[0] ? (Object.values(result[0])[0] as string) : null;
    }

    this.logger.log(`SP execution completed successfully`);
    return output ? Object.values(output) : {};
  }

 
} 
