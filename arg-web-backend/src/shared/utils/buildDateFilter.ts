import { literal } from "@sequelize/core";
import { convertMMDDYYtoYYYYMMDD, formatNumberToMMDDYY } from "./format-date";

/**
 * Builds a DB2-safe SQL date comparison for MMDDYY columns.
 *
 * Converts:
 *   - DB column MMDDYY → YYYYMMDD (numeric)
 *   - Input startDate (MMDDYY) → YYYYMMDD (numeric)
 *
 * Returns literal SQL usable in Sequelize WHERE.
 */
export function buildDateFilter(column: string, startDate?: string | number) {
  if (!startDate) return null;

  // Normalize input MMDDYY (pad leading zero)
  const cleanStartDate = formatNumberToMMDDYY(startDate);

  // Convert MMDDYY → YYYYMMDD (number)
  const startYYYYMMDD = convertMMDDYYtoYYYYMMDD(cleanStartDate);

  // Convert DB column MMDDYY → YYYYMMDD (SQL expression)
  const columnToYYYYMMDD = `
    CASE 
      WHEN ${column} = 0 THEN 0
      ELSE INTEGER(
        (CASE 
          WHEN INTEGER(SUBSTR(LPAD(${column}, 6, '0'), 5, 2)) <= 80 
            THEN '20' ELSE '19'
        END)
        || SUBSTR(LPAD(${column}, 6, '0'), 5, 2)
        || SUBSTR(LPAD(${column}, 6, '0'), 1, 2)
        || SUBSTR(LPAD(${column}, 6, '0'), 3, 2)
      )
    END
  `;

  return literal(`${columnToYYYYMMDD} >= ${startYYYYMMDD}`);
}
