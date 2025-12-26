import * as fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import {
  Controller,
  Get,
  Query,
  Param,
  Post,
  Body,
  Delete,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { GetCompaniesUseCase } from "../usecases/get-companies/get-companies.usecase";
import { GetAllCompaniesDto } from "../dto/company.dto";
import { ApiTags, ApiConsumes, ApiQuery } from "@nestjs/swagger";
import * as SwaggerConfig from "@src/api-schema/voucher.swagger";
import { GetVoucherHeaderUseCase } from "../usecases/get-voucher-header/get-voucher-header.usecase";
import {
  GetVoucherDataDto,
  GetHeadersDto,
  SubmitVoucherDto,
  CreateBatchRequestDto,
  SoftDeleteVoucherDetailDto,
  PaperBatchCreateResponseDto,
  GetFlexiHeadersDto,
  GetSogasHeadersDto,
  GetPaperHeadersDto,
  GetLmsHeadersDto,
  GetCalculatedDueDatesDto,
} from "../dto/voucher.dto";
import { GetVoucherEntryUseCase } from "../usecases/get-voucher-entry/get-voucher-entry.usecase";
import { GetVendorUseCase } from "../usecases/get-vendors/get-vendor.usecase";
import { GetVendorByIdUseCase } from "../usecases/get-vendor-by-id/get-vendor-by-id.usecase";
import { SoftDeleteVoucherUseCase } from "../usecases/soft-delete-voucher/soft-delete-voucher.usecase";
import { GetVoucherConfigUseCase } from "../usecases/voucher-config/get-voucher-config.usecase";
import {
  GetAllVendorsDto,
  GetVendorByNoDto,
  SoftDeleteVoucherDto,
  VoucherSummaryQueryDto,
  VoucherSummaryResponseDto,
  HeaderDto,
  CarrierInvoiceResponseDto,
  GetCarrierInvoicesDto,
  paperEntryResponseDto,
} from "../dto/voucher.dto";
import {
  formatCompanyDropdown,
  formatVendorDropdown,
} from "@src/shared/formatters/dropdown.formatter";
import {
  paginatedResponse,
  simpleResponse,
  PaginatedResponse,
  SimpleResponse,
} from "@src/shared/utils/response-formatter";
import { MulterFile } from "@src/shared/utils/multer-file.utils";
import { GetProcessTypes } from "../usecases/get-process-types/get-process-types.usecase";
import { SubmitVoucherUseCase } from "../usecases/submit-voucher/submit-voucher.usecase";
import { VoucherCsvUploadUseCase } from "@src/main/account-payable/application/voucher/usecases/upload-csv/upload-csv.usecase";
import { VoucherHeaderValidationUseCase } from "../usecases/post-header-validation/post-header-validation.usecase";
import { ApiEndpoint } from "@src/api-schema/swagger.decorator";
import { ProcessType } from "@src/shared/constants/strategy-type.enum";
import { GetGlMasterUseCase } from "../usecases/gl-master/get-gl-master.usecase";
import { GetGlMasterDto } from "../dto/voucher.dto";
import { PROCESS_TYPE_ENUM } from "@src/shared/constants/constant";
import { GetVoucherSummaryUseCase } from "../usecases/get-voucher-summary/get-voucher-summary.usecase";
import { ValidationPipe } from "@nestjs/common";
import { GetSogasEntryUseCase } from "../usecases/get-sogas-entry/get-sogas-entry.usecase";
import { VoucherEntryResponseDto } from "../dto/voucher.dto";
import { GetCarrierInvoicesUseCase } from "../usecases/get-carrier-invoices/get-carrier-invoices.usecase";
import { GetPaperEntryUseCase } from "../usecases/get-paper-entry/get-paper-entry.usecase";
import { ApdateAppService } from "@src/main/account-payable/domain/services/apdate/apdate.service";
import { GlMasterService } from "@src/main/account-payable/domain/services/gl-master/gl-master.service";
import { GeneralSystemService } from "@src/main/account-payable/domain/services/general-system/general-system.service";
import { FreightInvoiceHeaderService } from "@src/main/account-payable/domain/services/freight-invoice-header/freight-invoice-header.service";
import { GetFlexiEntryUseCase } from "../usecases/get-flexi-entry/get-flexi-entry.usecase";
import { GetLmsEntryUseCase } from "../usecases/get-lms-entry/get-lms-entry.usecase";
import { GetLmsCarrierInvoicesUseCase } from "../usecases/get-lms-carrier-invoices/get-lms-carrier-invoices.usecase";
import { PaperBatchCreateUseCase } from "../usecases/paper-batch-create/paper-batch-create.usecase";
import { LmsBatchCreateUseCase } from "../usecases/lms-batch-create/lms-batch-create.usecase";
import { SoftDeleteVoucherDetailUseCase } from "../usecases/soft-delete-voucher-detail/soft-delete-voucher-detail.usecase";
import { currentUserInitials } from "@src/shared/utils/user-context";
import { GetCalculatedDueDatesUseCase } from "../usecases/get-calculated-due-dates/get-calculated-due-dates.usecase";

@ApiTags("Voucher")
@Controller("account-payable/voucher")
export class VoucherController {
  constructor(
    private readonly getCompaniesUseCase: GetCompaniesUseCase,
    private readonly getVendorUseCase: GetVendorUseCase,
    private readonly getVendorByIdUseCase: GetVendorByIdUseCase,
    private readonly getVoucherUseCase: GetVoucherEntryUseCase,
    private readonly getSogasEntryUseCase: GetSogasEntryUseCase,
    private readonly getFlexiEntryUseCase: GetFlexiEntryUseCase,
    private readonly postVoucherHeaderValidationUseCase: VoucherHeaderValidationUseCase,
    private readonly getProcessTypes: GetProcessTypes,
    private readonly softDeleteVoucherUseCase: SoftDeleteVoucherUseCase,
    private readonly submitVoucherUseCase: SubmitVoucherUseCase,
    private readonly getVoucherConfigUseCase: GetVoucherConfigUseCase,
    private readonly getVoucherHeaderUseCase: GetVoucherHeaderUseCase,
    private readonly VoucherCsvUploadUseCase: VoucherCsvUploadUseCase,
    private readonly getGlMasterUseCase: GetGlMasterUseCase,
    private readonly getCarrierInvoicesUseCase: GetCarrierInvoicesUseCase,
    private readonly getPaperEntryUseCase: GetPaperEntryUseCase,
    private readonly apdateAppService: ApdateAppService,
    private readonly glMasterService: GlMasterService,
    private readonly generalSystemService: GeneralSystemService,
    private readonly freightInvoiceHeaderService: FreightInvoiceHeaderService,
    private readonly getVoucherSummaryUseCase: GetVoucherSummaryUseCase,
    private readonly getLmsEntryUseCase: GetLmsEntryUseCase,
    private readonly getLmsCarrierInvoicesUseCase: GetLmsCarrierInvoicesUseCase,
    private readonly paperBatchCreateUseCase: PaperBatchCreateUseCase,
    private readonly lmsBatchCreateUseCase: LmsBatchCreateUseCase,
    private readonly softDeleteVoucherDetailUseCase: SoftDeleteVoucherDetailUseCase,
    private readonly getCalculatedDueDatesUseCase: GetCalculatedDueDatesUseCase
  ) {}

  @Get("companies")
  @ApiEndpoint(SwaggerConfig.getAllCompanies)
  async getAllCompanies(@Query() query: GetAllCompaniesDto) {
    const {
      items,
      pagination: { total_items, current_page, items_per_page },
    } = await this.getCompaniesUseCase.execute(query);
    return paginatedResponse(
      formatCompanyDropdown(items),
      total_items,
      current_page,
      items_per_page
    );
  }

  // Get all voucher process types
  @Get("process-types")
  @ApiEndpoint(SwaggerConfig.getAllProcessTypes)
  async getAllProcessTypes() {
    const items = await this.getProcessTypes.execute();
    return simpleResponse(items);
  }

  @Get("vendors")
  @ApiEndpoint(SwaggerConfig.getAllVendors)
  async getAllVendors(@Query() query: GetAllVendorsDto) {
    const {
      items,
      pagination: { total_items, current_page, items_per_page },
    } = await this.getVendorUseCase.execute(query);
    return paginatedResponse(
      formatVendorDropdown(items),
      total_items,
      current_page,
      items_per_page
    );
  }

  @Get("get-vendor-by-id")
  @ApiEndpoint(SwaggerConfig.getVendorById)
  async getVendorById(@Query() query: GetVendorByNoDto) {
    const items = await this.getVendorByIdUseCase.execute(query);
    return simpleResponse(items);
  }
  //TODO: Remove this after testing
  @Post("cache")
  @ApiEndpoint(SwaggerConfig.cacheData)
  async cacheDataForCompany(@Body() body: { companyNo: number }) {
    const startTime = Date.now();

    // Cache companies, vendors, APDATE records, GL Master records, GSTable records, and FreightInvoice records in parallel for optimal performance
    const [
      // companyResult,
      vendorResult,
      apdateResult,
      glMasterResult,
      gstableResult,
      freightInvoiceResult,
    ] = await Promise.all([
      // this.getCompaniesUseCase.cacheAllCompanies(),
      this.getVendorByIdUseCase.cacheAllVendorsForCompany(body.companyNo),
      this.apdateAppService.cacheAllApdateForCompany(body.companyNo),
      this.glMasterService.cacheGlMasterForCompany(body.companyNo),
      this.generalSystemService.cacheGSTableData(),
      this.freightInvoiceHeaderService.cacheFreightInvoiceHeaderForCompany(
        body.companyNo
      ),
    ]);

    const totalDuration = Date.now() - startTime;

    const result = {
      // companies: companyResult,
      vendors: vendorResult,
      apdate: apdateResult,
      glmaster: glMasterResult,
      gstable: gstableResult,
      freightinvoice: freightInvoiceResult,
      totalDuration,
      summary: {
        // totalCompanies: companyResult.totalCompanies,
        // cachedCompanies: companyResult.cachedCompanies,
        totalVendors: vendorResult.totalVendors,
        cachedVendors: vendorResult.cachedVendors,
        totalApdates: apdateResult.totalApdates,
        cachedApdates: apdateResult.cachedApdates,
        totalGlMasters: glMasterResult.totalGlMasters,
        cachedGlMasters: glMasterResult.cachedGlMasters,
        totalGSTables: gstableResult.totalGSTables,
        cachedGSTables: gstableResult.cachedGSTables,
        totalFreightInvoices: freightInvoiceResult.totalFreightInvoices,
        cachedFreightInvoices: freightInvoiceResult.cachedFreightInvoices,
        message: `Successfully cached ${vendorResult.cachedVendors} vendors, ${apdateResult.cachedApdates} APDATE records, ${glMasterResult.cachedGlMasters} GL Master records, ${gstableResult.cachedGSTables} GSTable records, and ${freightInvoiceResult.cachedFreightInvoices} FreightInvoice records for company ${body.companyNo}`,
      },
    };

    return simpleResponse(result);
  }

  @Get("get-voucher-entry")
  @ApiEndpoint(SwaggerConfig.getVoucherEntry)
  async getGridEntryData(@Query() query: GetHeadersDto) {
    const {
      items,
      pagination: { total_items, current_page, items_per_page },
    } = await this.getVoucherUseCase.execute(query);
    return paginatedResponse(items, total_items, current_page, items_per_page);
  }

  @Delete("voucher")
  @ApiEndpoint(SwaggerConfig.softDeleteVoucher)
  async softDeleteVoucher(@Body() dto: SoftDeleteVoucherDto) {
    const result = await this.softDeleteVoucherUseCase.execute(dto);
    return simpleResponse(result);
  }
  // Get voucher details by entry no
  @Get("/entry/:entryNo")
  @ApiEndpoint(SwaggerConfig.getDataByEntryNo)
  async getDataByEntryNo(
    @Param("entryNo") entryNo: string,
    @Query() query: GetVoucherDataDto
  ) {
    const items = await this.getVoucherHeaderUseCase.execute(entryNo, query);
    return simpleResponse(items);
  }

  @Post("entry/submit")
  @ApiEndpoint(SwaggerConfig.submitVoucher)
  async submitVoucher(@Body() dto: SubmitVoucherDto) {
    const result = await this.submitVoucherUseCase.execute(dto);
    return simpleResponse(result);
  }

  @Post("header-validation")
  @ApiEndpoint(SwaggerConfig.submitHeaderValidation)
  async submitHeader(@Body() body: HeaderDto) {
    return await this.postVoucherHeaderValidationUseCase.execute(body);
  }

  @Get("config")
  @ApiEndpoint(SwaggerConfig.getVoucherConfig)
  async getVoucherConfig(
    @Query("companyNo") companyNo: number,
    @Query("vendorNo") vendorNo: number
  ): Promise<any> {
    const config = await this.getVoucherConfigUseCase.execute(
      companyNo,
      vendorNo
    );
    return simpleResponse(config);
  }

  @Get("gl-master")
  @ApiEndpoint(SwaggerConfig.getGlMaster)
  async getGlMaster(@Query() dto: GetGlMasterDto): Promise<any> {
    const result = await this.getGlMasterUseCase.execute(dto);
    return simpleResponse(result);
  }

  @Post("flexi/upload")
  @ApiConsumes("multipart/form-data")
  @ApiEndpoint(SwaggerConfig.uploadCsv)
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          const folder = `uploads/csv/${ProcessType.FLEXI}`;
          fs.mkdirSync(folder, { recursive: true });
          cb(null, folder);
        },
        filename: (_req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    })
  )
  async uploadCsv(@UploadedFile() file: MulterFile) {
    const userId = currentUserInitials();
    const result = await this.VoucherCsvUploadUseCase.execute(
      userId,
      ProcessType.FLEXI,
      file
    );
    return simpleResponse(result);
  }

  @Post("sogas/upload")
  @ApiConsumes("multipart/form-data")
  @ApiEndpoint(SwaggerConfig.uploadSogasCsv)
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          const folder = `uploads/csv/${ProcessType.SOGAS}`;
          fs.mkdirSync(folder, { recursive: true });
          cb(null, folder);
        },
        filename: (_req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    })
  )
  async uploadSogasCsv(
    @UploadedFile() file: MulterFile,
    @Query("subType") subType: string
  ) {
    const userId = currentUserInitials();
    // Do NOT normalize subType; use as-is (should be lowercase)
    const result = await this.VoucherCsvUploadUseCase.execute(
      userId,
      ProcessType.SOGAS, // Always use the enum value
      file,
      subType // pass as-is
    );
    return simpleResponse(result);
  }

  @Get("summary")
  @ApiEndpoint(SwaggerConfig.getVoucherSummary)
  @ApiQuery({
    name: "companyNo",
    type: Number,
    required: true,
    description: "Company Number (only 10 allowed)",
  })
  @ApiQuery({
    name: "processType",
    enum: PROCESS_TYPE_ENUM,
    enumName: "PROCESS_TYPE_ENUM",
    required: true,
    description: "Process Type (NORMAL, ARGLMS, PAPER, FLEXI, SOGAS)",
  })
  async getVoucherSummary(
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    query: VoucherSummaryQueryDto
  ): Promise<SimpleResponse<VoucherSummaryResponseDto>> {
    const summary = await this.getVoucherSummaryUseCase.execute(query);
    return simpleResponse(summary);
  }

  @Get("flexi/entries")
  @ApiEndpoint(SwaggerConfig.getFlexiEntry)
  async getFlexiEntryData(@Query() query: GetFlexiHeadersDto) {
    const {
      items,
      pagination: { total_items, current_page, items_per_page },
    } = await this.getFlexiEntryUseCase.execute(query);
    return paginatedResponse(items, total_items, current_page, items_per_page);
  }

  @Get("sogas/entries")
  @ApiEndpoint(SwaggerConfig.getSogasEntry)
  async getSogasEntryData(
    @Query() query: GetSogasHeadersDto
  ): Promise<PaginatedResponse<VoucherEntryResponseDto>> {
    const {
      items,
      pagination: { total_items, current_page, items_per_page },
    } = await this.getSogasEntryUseCase.execute(query);
    return paginatedResponse(items, total_items, current_page, items_per_page);
  }

  @Get("paper/batch-entries")
  @ApiEndpoint(SwaggerConfig.getCarrierInvoices)
  async getCarrierInvoices(
    @Query() query: GetCarrierInvoicesDto
  ): Promise<PaginatedResponse<CarrierInvoiceResponseDto>> {
    const { items, pagination } =
      await this.getCarrierInvoicesUseCase.execute(query);
    return paginatedResponse(
      items,
      pagination.total_items,
      pagination.current_page,
      pagination.items_per_page
    );
  }

  @Get("lms/batch-entries")
  @ApiEndpoint(SwaggerConfig.getLmsCarrierInvoices)
  async getLmsCarrierInvoices(
    @Query() query: GetCarrierInvoicesDto
  ): Promise<PaginatedResponse<CarrierInvoiceResponseDto>> {
    const { items, pagination } =
      await this.getLmsCarrierInvoicesUseCase.execute(query);
    return paginatedResponse(
      items,
      pagination.total_items,
      pagination.current_page,
      pagination.items_per_page
    );
  }

  @Get("paper/entries")
  @ApiEndpoint(SwaggerConfig.getPaperEntry)
  async getPaperEntryData(
    @Query() query: GetPaperHeadersDto
  ): Promise<PaginatedResponse<paperEntryResponseDto>> {
    const {
      items,
      pagination: { total_items, current_page, items_per_page },
    } = await this.getPaperEntryUseCase.execute(query);
    return paginatedResponse(items, total_items, current_page, items_per_page);
  }

  @Get("lms/entries")
  @ApiEndpoint(SwaggerConfig.getLmsEntry)
  async getLmsEntryData(
    @Query() query: GetLmsHeadersDto
  ): Promise<PaginatedResponse<paperEntryResponseDto>> {
    const {
      items,
      pagination: { total_items, current_page, items_per_page },
    } = await this.getLmsEntryUseCase.execute(query);
    return paginatedResponse(items, total_items, current_page, items_per_page);
  }

  @Post("paper/batch")
  @ApiConsumes("application/json")
  @ApiEndpoint(SwaggerConfig.paperBatchCreate)
  async createPaperBatch(
    @Body() dto: CreateBatchRequestDto
  ): Promise<SimpleResponse<PaperBatchCreateResponseDto>> {
    const userId = currentUserInitials();
    const result = await this.paperBatchCreateUseCase.execute(userId, dto);
    const response: PaperBatchCreateResponseDto = {
      batchId: result.batchId,
      totalGroups: result.totalGroups,
      totalBatches: result.totalBatches,
      parentJobId: result.parentJobId ?? "",
      childJobIds: Array.isArray(result.childJobIds)
        ? result.childJobIds.filter(
            (id): id is string => typeof id === "string"
          )
        : [],
      groups: result.groups ?? [],
      message: result.message,
    };
    return simpleResponse(response);
  }

  @Post("lms/batch")
  @ApiConsumes("application/json")
  @ApiEndpoint(SwaggerConfig.lmsBatchCreate)
  async createLmsBatch(@Body() dto: CreateBatchRequestDto) {
    const userId = currentUserInitials();
    const result = await this.lmsBatchCreateUseCase.execute(userId, dto);
    return simpleResponse(result);
  }

  /**
   * Soft deletes a specific voucher detail by marking it as deleted
   * @param dto - Contains the composite key to identify the voucher detail
   * @returns Success response with operation result
   */
  @Post("detail")
  @ApiEndpoint(SwaggerConfig.softDeleteVoucherDetail)
  async softDeleteVoucherDetail(
    @Body() dto: SoftDeleteVoucherDetailDto
  ): Promise<{ success: boolean; message: string }> {
    return this.softDeleteVoucherDetailUseCase.execute(dto);
  }

  @Get("calculate-due-dates")
  @ApiEndpoint(SwaggerConfig.getCalculatedDueDates)
  async calculateDueDates(@Query() dto: GetCalculatedDueDatesDto): Promise<any> {
    console.log("dto", dto);
    const result = await this.getCalculatedDueDatesUseCase.execute(dto);
    return simpleResponse(result);
  }
}
