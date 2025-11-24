import { Inject, Injectable, Logger } from "@nestjs/common";
import { YearEndProcessInterface } from "../../domain/interface/year-end-process.interface";
import { YearEndProcessResponse } from "../../domain/entities/year-end-process.entity";
import { DynamicTableOperations } from "@src/shared/infrastructure/dynamicTableOperations/dynamicTableOperation";
import { buildTableName } from "@src/shared/utils/db.utils";
import { getDynamicTableAndSchemaInfo } from "@src/shared/config/env-library-config";
import { yearEndProcessResponseMapper } from "../mappers/year-end-process.mapper";
import { VendorInterface } from "../../domain/interface/vendor.interface";

@Injectable()
export class YearEndProcessRepository implements YearEndProcessInterface {
    private readonly logger = new Logger(YearEndProcessRepository.name);

    constructor(
        @Inject("VendorInterface")
        private readonly vendorRepository: VendorInterface,
        private readonly dynamicTableOperations: DynamicTableOperations) { }

    async processVendorYearEnd(companyNo: number, year: string, clearYTD: boolean): Promise<YearEndProcessResponse> {
        this.logger.log(`Processing vendor year-end for company ${companyNo}, year ${year}, clearYTD: ${clearYTD}`);

        try {
            const { newTableName, sourceTableName, dataSchema } = await this.getTableAndSchemaInfo('VendorYear', year);
            const tableResult = await this.dynamicTableOperations.createTable(newTableName, sourceTableName, dataSchema);
            
            this.logger.log('Saving vendor file for IRS backup');
            const irsBackupResult = await this.vendorRepository.saveVendorFileForIRS(dataSchema,sourceTableName);
            
            if (!irsBackupResult.success) {
                this.logger.warn(`IRS backup failed: ${irsBackupResult.message}`);
            } else {
                this.logger.log(`IRS backup completed: ${irsBackupResult.message}`);
            }
            
            await this.vendorRepository.clearVendorTotals(clearYTD);
            const message = `Vendor year-end process completed successfully for company ${companyNo}, year ${year}`;
            this.logger.log(`Year-end process completed successfully for company ${companyNo}, year ${year}`);

            return yearEndProcessResponseMapper({
                message,
                tableName: tableResult.tableName,
                dataCopied: tableResult.dataCopied
            });

        } catch (error) {
            this.logger.error(`Year-end process failed for company ${companyNo}, year ${year}:`, error as string);

            const errorMessage = error instanceof Error ? error.message : String(error);

            return yearEndProcessResponseMapper({
                message: `Year-end process failed: ${errorMessage}`,
                tableName: undefined,
                dataCopied: 0
            });
        }
    }

    /**
     * Helper method to get dynamic table and schema info for year-end process.
     * Uses getDynamicTableAndSchemaInfo and buildTableName to return newTableName, sourceTableName, and dataSchema.
     */
    async getTableAndSchemaInfo(
        modelName: string,
        year: string
    ): Promise<{ newTableName: string; sourceTableName: string; dataSchema: string }> {

        const tableInfo = getDynamicTableAndSchemaInfo(modelName);

        const newTableName = buildTableName({ suffix: year }, tableInfo);

        return {
            newTableName,
            sourceTableName: tableInfo.metadata.prefix!,
            dataSchema: tableInfo.schemaName
        };
    }
}
