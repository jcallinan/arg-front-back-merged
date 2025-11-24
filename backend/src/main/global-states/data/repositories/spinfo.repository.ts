import { Inject, Injectable } from "@nestjs/common";
import { SpInfoInterface } from "../../domain/interface/spinfo.interface";
import { SpInfo } from "../../domain/entities/spinfo.entity";
import { SpInfoModel } from "../models/spinfo.model";
import { spinfoMapper } from "../mappers/spinfo.mapper";
import { Op } from "@sequelize/core";
import { AppLogger } from "@src/shared/logger/logger.service";

/**
 * Repository implementation for spinfo data access
 * @class SpInfoRepository
 * @implements {SpInfoInterface}
 * @description Handles all database operations for spinfo records
 */
@Injectable()
export class SpInfoRepository implements SpInfoInterface {
  private readonly logger = new AppLogger(SpInfoRepository.name);

  /**
   * Creates an instance of SpInfoRepository
   * @param {typeof SpInfoModel} spinfoModel - The Sequelize model for spinfo
   */
  constructor(
    @Inject("SpInfoModel") private readonly spinfoModel: typeof SpInfoModel
  ) { }

  /**
   * Find all spinfo records by report name
   * @param {string} reportName - The report name to find spinfo records for
   * @returns {Promise<SpInfo[]>} Array of spinfo records
   * @throws {Error} If there's an error fetching spinfo records
   * @example
   * const spinfoRecords = await spinfoRepository.findAllByReportName("REPORT_NAME");
   */
  async findAllByReportName(params: { name: string, variableType?: string }): Promise<SpInfo[]> {
    this.logger.log(`Finding all spinfo records for report: ${params.name}`);

    try {
      const where: any = {
        useCase: {
          [Op.eq]: params.name,
        },
        [Op.or]: [
          {
            status: {
              [Op.is]: null
            }
          },
          {
            status: {
              [Op.notIn]: ['D', 'I']
            }
          }
        ],
      };

      if (params.variableType && params.variableType !== "all") {
        where.variableType = {
          [Op.or]: [
            params.variableType,
            ''
          ]
        };
      }

      const records = await this.spinfoModel.findAll({
        where,
        order: [["fieldSequence", "ASC"]],
      });

      return records.map(spinfoMapper);
    } catch (error: unknown) {
      this.logger.error(`Error finding spinfo records for report ${params}:`, (error as Error).message);
      throw new Error(`Failed to fetch spinfo records for report: ${params}`);
    }
  }

  /**
   * Get all unique report names (kebab cases) available in the system
   * @returns {Promise<string[]>} Array of unique report names
   * @throws {Error} If there's an error fetching report names
   * @example
   * const reportNames = await spinfoRepository.getAllReportNames();
   */
  async getAllReportNames(): Promise<string[]> {
    this.logger.log("Finding all unique report names");

    try {
      const records = await this.spinfoModel.findAll({
        attributes: ['useCase'],
        order: [['useCase', 'ASC']],
      });

      return [...new Set(records.map(record => spinfoMapper(record).useCase))];
    } catch (error: unknown) {
      this.logger.error("Error finding all report names:", (error as Error).message);
      throw new Error("Failed to fetch all report names");
    }
  }
} 