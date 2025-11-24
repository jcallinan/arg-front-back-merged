import { Injectable, Inject, HttpException, HttpStatus } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { CarrierModel } from "../models/carrier-model";
import { CarrierInterface } from "../../domain/interface/carrier.interface";
import { Op } from "@sequelize/core";
import { CarrierMapper } from "../mappers/carrier.mapper";
import { ERROR_CONSTANTS } from "@src/shared/constants/error-constants";
import { errorResponse } from "@src/shared/utils/response-formatter";

@Injectable()
export class CarrierRepository implements CarrierInterface {
    private readonly logger = new AppLogger(CarrierRepository.name);

    constructor(

        @Inject("CarrierModel")
        private readonly carrierModel: typeof CarrierModel,
    ) { }


    async getDropdownList(companyNo: number, limit: number, offset: number): Promise<{ rows: any[]; count: number }> {
        try {

            this.logger.log("Fetch the dropdown Details")
            const { rows, count } = await this.carrierModel.findAndCountAll({
                where: {
                    companyNo,
                    isDeleted: { [Op.notIn]: ['I', 'A'] },
                },
                attributes: ["carrierName", "carrierId"],
                limit,
                offset
            })

            if (!rows) {
                throw new HttpException(
                    errorResponse(ERROR_CONSTANTS.NOT_FOUND, [
                        {
                            field: "Dropdown list",
                            code: ERROR_CONSTANTS.NOT_FOUND.code,
                            message: `Request Dropdown list not found`,
                        },
                    ]),
                    HttpStatus.NOT_FOUND
                );
            }

            return {
                rows: rows.map((data) => CarrierMapper.toEntity(data)),
                count: count
            }
        } catch (error) {
            this.logger.error(`Failed to get dropdown details for companyNo: ${companyNo}, Error: ${error instanceof Error ? error.message : "Unknown error"}`)
            throw error
        }

    }


}