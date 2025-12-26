import {
  Injectable,
  Logger,
  Inject,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { errorResponse } from "@src/shared/utils/response-formatter";
import { ERROR_CONSTANTS } from "@src/shared/constants/error-constant";
import { GlMasterInterface } from "@src/main/account-payable/domain/interface/gl-master.interface";
import { GlMasterEntity } from "@src/main/account-payable/domain/entities/gl-master.entity";



@Injectable()
export class GlMasterService {
  private readonly logger = new Logger(GlMasterService.name);

  constructor(
    @Inject("GlMasterInterface")
    private readonly glMasterRepository: GlMasterInterface,
  ) { }

  async getGlMasterRecord(
    companyNo: number,
    accountNo: number,
    subAccountNo: number,
    accountType: string,
    activeOnly = false,
  ): Promise<GlMasterEntity> {
    if (!companyNo || !accountNo || subAccountNo == null) {
      this.logger.warn(
        "Invalid companyNo, accountNo, or subAccountNo provided",
      );
      throw new HttpException(
        errorResponse(ERROR_CONSTANTS.VALIDATION_ERROR, [
          {
            field: "apGLNo",
            code: ERROR_CONSTANTS.VALIDATION_ERROR.code,
            message: "Valid companyNo, accountNo are required.",
          },
        ]),
        HttpStatus.BAD_REQUEST
      );
    }

    const subAccountNos = [subAccountNo];
    if (subAccountNo < 10) {
      subAccountNos.push(Number(`0${subAccountNo}`));
    }

    const record = await this.glMasterRepository.findOne(
      companyNo,
      accountNo,
      subAccountNos,
      accountType,
      activeOnly,
    );

    if (!record) {
      this.logger.warn("GlMaster not found");

      throw new HttpException(
        errorResponse(ERROR_CONSTANTS.NOT_FOUND, [
          {
            field: 'apGLNo',
            code: ERROR_CONSTANTS.NOT_FOUND.code,
            message: "INVALID DETAIL LINE G/L NUMBER ENTERED",
          },
        ]),
        HttpStatus.NOT_FOUND
      );
    }
    return record;

  }

  async getGlDescription(companyNo: number, glNo: number, accountType: string = 'C', activeOnly = false): Promise<string> {
    if (!glNo) {
      throw new HttpException(
        errorResponse(ERROR_CONSTANTS.VALIDATION_ERROR, [
          {
            field: 'apGLNo',
            code: ERROR_CONSTANTS.VALIDATION_ERROR.code,
            message: "Gl No not found",
          },
        ]),
        HttpStatus.BAD_REQUEST
      );

    }
    const glNoStr = glNo.toString().padStart(8, '0');
    const accountNo = parseInt(glNoStr.substring(0, 6));
    const subAccountNo = parseInt(glNoStr.substring(6));
    const glRecord = await this.getGlMasterRecord(companyNo, accountNo, subAccountNo, accountType, activeOnly);
    return glRecord.description;
  }

  async getBulkGlMasterRecords(
    companyNo: number,
    accountDetails: Array<{ accountNo: number; subAccountNo: number; accountType: string }>,
  ): Promise<Map<string, GlMasterEntity>> {
    return this.glMasterRepository.findMultiple(companyNo, accountDetails);
  }

  async cacheAllGlMasterForCompany(companyNo: number): Promise<void> {
    return this.glMasterRepository.cacheAllGlMasterForCompany(companyNo);
  }
  async cacheGlMasterForCompany(companyNo: number) {
    const startTime = Date.now();

    try {

      await this.cacheAllGlMasterForCompany(companyNo);


      const duration = Date.now() - startTime;

      return {
        success: true,
        duration,
        totalGlMasters: 'N/A', // GL Master count is determined during caching
        cachedGlMasters: 'All active GL accounts',
        message: `GL Master records cached successfully for company ${companyNo}`,
      };
    } catch (error) {
      const duration = Date.now() - startTime;

      return {
        success: false,
        duration,
        totalGlMasters: 0,
        cachedGlMasters: 0,
        message: `Failed to cache GL Master records for company ${companyNo}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }
}
