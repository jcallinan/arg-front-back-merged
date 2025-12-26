import { QueryTypes } from '@sequelize/core';
import { Injectable, Logger } from '@nestjs/common';
import { getAs400Connection } from '@src/shared/infrastructure/connection';
import { getDynamicTableAndSchemaInfo } from '@src/shared/config/env-library-config';


@Injectable()
export class DynamicTableOperations {
    private readonly logger = new Logger(DynamicTableOperations.name);
    
    /**
     * Creates a table using model and suffix
     * Usage: createTable(model.vendor, { suffix: '2024' })
     */
    async createTable(newTableName: string, sourceTable: string, dataSchema: string, whereClause?: string): Promise<{
        dataCopied: number;
        tableName: string;
    }> {
        try {
            this.logger.log(`Starting table creation process for ${newTableName} based on ${sourceTable}${whereClause ? ` with WHERE clause: ${whereClause}` : ''}`);


            const tableExists = await this.tableExists(newTableName, dataSchema as string);
            let result: any;
            if (!tableExists) {
                this.logger.log(`Table ${newTableName} does not exist. Creating new table with data...`);
                result = await this.createTableWithData(sourceTable, newTableName, dataSchema as string, whereClause);
                this.logger.log(`Table ${newTableName} created successfully with data`);
            } else {
                this.logger.log(`Table ${newTableName} already exists. Dropping and recreating table with data...`);
                await this.dropTable(newTableName, dataSchema as string);
                result = await this.createTableWithData(sourceTable, newTableName, dataSchema as string, whereClause);
                this.logger.log(`Table ${newTableName} dropped and recreated successfully with data`);
            }

            return {
                dataCopied: result[0].count,
                tableName: `${dataSchema}.${newTableName}`
            };

        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            this.logger.error(`Failed to create table using mapper: ${errMsg}`, error);
            throw error;
        }
    }

    /**
     * Creates a new table using LIKE clause (much simpler approach)
     */
    async createTableStructure(sourceTable: string, newTableName: string, dataSchema: string): Promise<boolean> {
        try {
            const createTableSQL = `CREATE TABLE ${dataSchema}.${newTableName} LIKE ${dataSchema}.${sourceTable}`;

            this.logger.log(`Creating table with SQL: ${createTableSQL}`);

            const sequelize = getAs400Connection();
            await sequelize.query(createTableSQL, {
                type: QueryTypes.RAW,
                raw: true
            });

            this.logger.log(`Table ${newTableName} created with LIKE clause from ${sourceTable}`);
            return true;
        } catch (error) {
            this.logger.error(`Failed to create table ${newTableName} using LIKE clause:`, error);
            throw error;
        }
    }


    async copyDataFromSource(
        sourceTable: string,
        targetTable: string,
        dataSchema: string
    ): Promise<number> {
        try {
            let insertQuery = `INSERT INTO ${dataSchema}.${targetTable}
            SELECT * FROM ${dataSchema}.${sourceTable}`

            this.logger.log(`Executing data copy query: ${insertQuery}`);

            const sequelize = getAs400Connection();
            const result = await sequelize.query(insertQuery, {
                type: QueryTypes.INSERT,
                raw: true,
            });

            let rowCount = 0;
            if (Array.isArray(result) && typeof result[1] === 'number') {
                rowCount = result[1];
                this.logger.log(`Data copy completed: ${rowCount} rows copied from ${sourceTable} to ${targetTable}`);
            }

            return rowCount;
        } catch (error) {
            this.logger.error(`Failed to copy data from ${sourceTable} to ${targetTable}:`, error);
            throw error;
        }
    }


    /**
     * Truncates a table (removes all data but keeps structure)
     */
    async truncateTable(tableName: string, dataSchema: string): Promise<boolean> {
        try {
            const truncateQuery = `TRUNCATE TABLE ${dataSchema}.${tableName}`;
            const sequelize = getAs400Connection();
            await sequelize.query(truncateQuery, {
                type: QueryTypes.RAW,
                raw: true
            });

            this.logger.log(`Table ${tableName} truncated successfully`);
            return true;
        } catch (error) {
            this.logger.error(`Failed to truncate table ${tableName}:`, error);
            throw error;
        }
    }

    /**
     * Checks if a table exists
     */
    async tableExists(tableName: string, dataSchema: string): Promise<boolean> {
        try {
            const checkQuery = `
            SELECT TABLE_SCHEMA, TABLE_NAME
            FROM QSYS2.SYSTABLES
            WHERE TABLE_SCHEMA = '${dataSchema}'
            AND TABLE_NAME = '${tableName.toUpperCase()}'
      `;

            const sequelize = getAs400Connection();
            const result = await sequelize.query(checkQuery, {
                type: QueryTypes.SELECT,
                raw: true
            });
            return Array.isArray(result) && result.length > 0;
        } catch (error) {
            this.logger.error(`Failed to check if table ${tableName} exists:`, error);
            return false;
        }
    }

    /**
     * Creates a new table with data using CREATE TABLE AS SELECT
     */
    async createTableWithData(
        sourceTable: string,
        newTableName: string,
        dataSchema: string,
        whereClause?: string
    ): Promise<any> {
        try {

            const sequelize = getAs400Connection();
            const whereCondition = whereClause ? ` WHERE ${whereClause}` : '';
            
            // Check if sourceTable is APVEND, then use sourceTableSchema from configuration
            let sourceSchemaForQuery = dataSchema;
            if (sourceTable === 'APVEND') {
                const tableInfo = getDynamicTableAndSchemaInfo('VendorYear');
                sourceSchemaForQuery = tableInfo.sourceSchemaName || dataSchema;
            }
            
            const createTableSQL = `CREATE TABLE ${dataSchema}.${newTableName} AS (
                SELECT * FROM ${sourceSchemaForQuery}.${sourceTable}${whereCondition}
            ) WITH DATA`;

            this.logger.log(`Creating table with data using SQL: ${createTableSQL}`);

            const result = await sequelize.query(createTableSQL, {
                type: QueryTypes.RAW,
                raw: true
            });

            this.logger.log(`Table ${newTableName} created with data from ${sourceSchemaForQuery}.${sourceTable}${whereClause ? ` with WHERE clause: ${whereClause}` : ''}`);
            return result;
        } catch (error) {
            this.logger.error(`Failed to create table ${newTableName} with data:`, error);
            throw error;
        }
    }

    /**
     * Gets the row count of a table
     */
    async getTableRowCount(tableName: string, dataSchema: string): Promise<number> {
        try {
            const countQuery = `SELECT COUNT(*) as rowCount FROM ${dataSchema}.${tableName}`;
            const sequelize = getAs400Connection();
            const result = await sequelize.query(countQuery, {
                type: QueryTypes.SELECT,
                raw: true
            });

            if (
                Array.isArray(result) &&
                result.length > 0 &&
                result[0] &&
                typeof (result[0] as any).rowCount !== 'undefined'
            ) {
                const rowCountValue = (result[0] as { rowCount?: string | number }).rowCount;
                return parseInt(rowCountValue as string, 10) || 0;
            }
            return 0;
        } catch (error) {
            this.logger.error(`Failed to get row count for table ${tableName}:`, error);
            return 0;
        }
    }


    async dropTable(tableName: string, dataSchema: string): Promise<boolean> {
        try {
            const dropQuery = `DROP TABLE ${dataSchema}.${tableName}`;
            const sequelize = getAs400Connection();
            await sequelize.query(dropQuery, {
                type: QueryTypes.RAW,
                raw: true
            });

            this.logger.log(`Table ${tableName} dropped successfully`);
            return true;
        } catch (error) {
            this.logger.error(`Failed to drop table ${tableName}:`, error);
            throw error;
        }
    }


    async renameTable(oldTableName: string, newTableName: string, dataSchema: string): Promise<boolean> {
        try {
            const renameSQL = `RENAME TABLE ${dataSchema}.${oldTableName} TO ${newTableName}`;
            const sequelize = getAs400Connection();
            
            this.logger.log(`Renaming table: ${renameSQL}`);
            
            await sequelize.query(renameSQL, {
                type: QueryTypes.RAW,
                raw: true
            });

            this.logger.log(`Table ${oldTableName} renamed to ${newTableName} successfully`);
            return true;
        } catch (error) {
            this.logger.error(`Failed to rename table ${oldTableName} to ${newTableName}:`, error);
            throw error;
        }
    }

}
