import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Body,
} from "@nestjs/common";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { v4 as uuidv4 } from "uuid";
import * as fs from "fs";
import { extname } from "path";
import { ApiEndpoint } from "@src/api-schema/swagger.decorator";
import { MulterFile } from "@src/shared/utils/multer-file.utils";
import { ProcessType } from "@src/shared/constants/strategy-type.enum";
import { ClearChecksUploadUseCase } from "../usecases/upload/upload.usecase";
import { ValidateSingleCheckUseCase } from "../usecases/validate-single-check/validate-single-check.usecase";
import { ProcessMultipleChecksUseCase } from "../usecases/process-multiple-checks/process-multiple-checks.usecase";
import * as SwaggerConfig from "@src/api-schema/clear-checks.swagger";
import {
  ClearCheckUploadResponseDto,
  SingleCheckValidationDto,
  SingleCheckValidationResponseDto,
  ProcessMultipleChecksDto,
  ProcessMultipleChecksResponseDto,
} from "../dto/clear-checks.dto";
import {
  simpleResponse,
  SimpleResponse,
} from "@src/shared/utils/response-formatter";
import { currentUserInitials } from "@src/shared/utils/user-context";

@ApiTags("ClearChecks")
@Controller("clear-checks")
export class ClearChecksController {
  constructor(
    private readonly clearChecksUploadUseCase: ClearChecksUploadUseCase,
    private readonly validateSingleCheckUseCase: ValidateSingleCheckUseCase,
    private readonly processMultipleChecksUseCase: ProcessMultipleChecksUseCase
  ) {}

  @Post("upload")
  @ApiConsumes("multipart/form-data")
  @ApiEndpoint(SwaggerConfig.uploadClearChecksCsv)
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          const folder = `uploads/csv/${ProcessType.CLEAR_CHECKS}`;
          fs.mkdirSync(folder, { recursive: true });
          cb(null, folder);
        },
        filename: (_req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (_req, file, cb) => {
        // Validate file type
        if (!file.originalname.match(/\.(xlsx|xls|csv)$/)) {
          return cb(
            new BadRequestException(
              "Only Excel (.xlsx, .xls) and CSV files are allowed"
            ),
            false
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
      },
    })
  )
  async upload(
    @UploadedFile() file: MulterFile
  ): Promise<SimpleResponse<ClearCheckUploadResponseDto>> {
    if (!file) {
      throw new BadRequestException("No file uploaded");
    }
    const userId = currentUserInitials();
    if (!userId) {
      throw new BadRequestException("User authentication required");
    }

    const result = await this.clearChecksUploadUseCase.execute(
      userId,
      ProcessType.CLEAR_CHECKS,
      file
    );
    return simpleResponse(result);
  }

  @Post("validate")
  @ApiEndpoint(SwaggerConfig.validateSingleCheck)
  async validateSingleCheck(
    @Body() validationData: SingleCheckValidationDto
  ): Promise<SimpleResponse<SingleCheckValidationResponseDto>> {
    const result =
      await this.validateSingleCheckUseCase.execute(validationData);
    return simpleResponse(result);
  }

  @Post("process")
  @ApiEndpoint(SwaggerConfig.processMultipleChecks)
  async processMultipleChecks(
    @Body() processData: ProcessMultipleChecksDto
  ): Promise<SimpleResponse<ProcessMultipleChecksResponseDto>> {
    const result = await this.processMultipleChecksUseCase.execute(processData);
    return simpleResponse(result);
  }
}
