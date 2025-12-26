import { YearEndProcessResponse } from "../../domain/entities/year-end-process.entity";

/**
 * Maps raw year-end process data to a domain entity
 * @function yearEndProcessResponseMapper
 * @param {Object} data - The raw data to map
 * @param {string} data.message - Message describing the result
 * @param {string} [data.tableName] - Name of the table created or processed
 * @param {number} [data.dataCopied] - Number of data rows copied
 * @returns {YearEndProcessResponse} The mapped domain entity
 * @throws {Error} If the data is null or undefined
 */
export function yearEndProcessResponseMapper(data: {
  message: string;
  tableName?: string;
  dataCopied?: number;
}): YearEndProcessResponse {
  if (!data) {
    throw new Error("Year-end process response data is null or undefined");
  }

  return YearEndProcessResponse.create({
    message: data.message,
    tableName: data.tableName,
    dataCopied: data.dataCopied
  });
}
