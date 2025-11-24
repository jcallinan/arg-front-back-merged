import { SpInfo } from "../entities/spinfo.entity";

export interface SpParameter {
  name: string;
  value: string;
}

/**
 * Interface for spinfo repository operations
 * @interface SpInfoInterface
 * @description Defines the contract for spinfo data access operations
 */
export interface SpInfoInterface {
  /**
   * Find all spinfo records by report name
   * @param {string} reportName - The report name to find spinfo records for
   * @returns {Promise<SpInfo[]>} Array of spinfo records
   * @throws {Error} If there's an error fetching spinfo records
   * @example
   * const spinfoRecords = await spinfoRepository.findAllByReportName("REPORT_NAME");
   */
  findAllByReportName(params: { name: string, variableType?: string }): Promise<SpInfo[]>;

  /**
   * Get all unique report names (kebab cases) available in the system
   * @returns {Promise<string[]>} Array of unique report names
   * @throws {Error} If there's an error fetching report names
   * @example
   * const reportNames = await spinfoRepository.getAllReportNames();
   */
  getAllReportNames(): Promise<string[]>;
}

/**
 * Interface for stored procedure execution operations
 * @interface SpExecutionInterface
 * @description Defines the contract for executing stored procedures
 */
export interface SpExecutionInterface {
  /**
   * Execute a stored procedure dynamically based on report name
   * @param {Object} data - The execution data containing report name and parameters
   * @returns {Promise<Record<string, any>>} Execution result
   */
  executeSpByReportName(data: { name: string, parameters: SpParameter[] }): Promise<Record<string, any>>;
} 