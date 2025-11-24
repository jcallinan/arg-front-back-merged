import { Injectable, Inject } from "@nestjs/common";
import {
  VoucherDetailInterface,
  VoucherHeaderInterface,
} from "@src/main/account-payable/domain/interface/voucher.interface";
import {
  VoucherDetail,
  VoucherHeader,
} from "@src/main/account-payable/domain/entities/voucher.entity";
import { AppLogger } from "@src/shared/logger/logger.service";
import {
  GetHeadersDto,
  HardDeleteVoucherDto,
} from "@src/main/account-payable/application/voucher/dto/voucher.dto";
import {
  paginatedResponse,
  PaginatedResponse,
} from "@src/shared/utils/response-formatter";
import { normalizeSearchQuery } from "@src/shared/utils/query.utils";
import { PROCESS_TYPE_ENUM } from "@src/shared/constants/constant";

@Injectable()
export class VoucherAppService {
  private readonly logger = new AppLogger(VoucherAppService.name);

  constructor(
    @Inject("VoucherHeaderInterface")
    private readonly voucherHeaderInterface: VoucherHeaderInterface,
    @Inject("VoucherDetailInterface")
    private readonly voucherDetailInterface: VoucherDetailInterface
  ) { }

  async getVoucherHeaders(
    dto: GetHeadersDto
  ): Promise<PaginatedResponse<VoucherHeader>> {
    this.logger.log(`Fetching voucher entry`);

    const { companyNo, vendorNo, entryNo, processType } = dto;
    const { limit, offset, page, sortBy, sortOrder } =
      normalizeSearchQuery(dto);
    const data = {
      companyNo,
      vendorNo,
      entryNo,
      processType,
      limit,
      offset,
      sortBy,
      sortOrder,
    };
    const { rows, count } = await this.voucherHeaderInterface.findAll(data);

    this.logger.log(`Found ${rows.length} active voucher entry`);

    return paginatedResponse(rows, count, page, limit);
  }

  async getSogasVoucherHeaders(
    dto: GetHeadersDto
  ): Promise<PaginatedResponse<VoucherHeader>> {
    this.logger.log(`Fetching SOGAS voucher entry`);
    const { vendorNo, entryNo } = dto;
    const { limit, offset, page, sortBy, sortOrder } =
      normalizeSearchQuery(dto);
    const data = {
      companyNo: 10,
      vendorNo,
      entryNo,
      limit,
      offset,
      sortBy,
      sortOrder,
      processType: PROCESS_TYPE_ENUM.SOGAS,
    };
    const { rows, count } =
      await this.voucherHeaderInterface.findAllWithAllFields(data);
    this.logger.log(`Found ${rows.length} SOGAS voucher entry`);
    return paginatedResponse(rows, count, page, limit);
  }

  async getPaperVoucherHeaders(
    dto: GetHeadersDto
  ): Promise<PaginatedResponse<VoucherHeader>> {
    this.logger.log(`Fetching PAPER voucher entry`);
    const { companyNo, vendorNo, entryNo } = dto;
    const { limit, offset, page, sortBy, sortOrder } =
      normalizeSearchQuery(dto);
    const data = {
      companyNo,
      vendorNo,
      entryNo,
      limit,
      offset,
      sortBy,
      sortOrder,
      processType: PROCESS_TYPE_ENUM.PAPER,
    };
    const { rows, count } =
      await this.voucherHeaderInterface.findAllWithAllFields(data);
    this.logger.log(`Found ${rows.length} PAPER voucher entry`);
    return paginatedResponse(rows, count, page, limit);
  }

  async getLmsVoucherHeaders(
    dto: GetHeadersDto
  ): Promise<PaginatedResponse<VoucherHeader>> {
    this.logger.log(`Fetching PAPER voucher entry`);
    const { companyNo, vendorNo, entryNo } = dto;
    const { limit, offset, page, sortBy, sortOrder } =
      normalizeSearchQuery(dto);
    const data = {
      companyNo,
      vendorNo,
      entryNo,
      limit,
      offset,
      sortBy,
      sortOrder,
      processType: PROCESS_TYPE_ENUM.ARGLMS,
    };
    const { rows, count } =
      await this.voucherHeaderInterface.findAllWithAllFields(data);
    this.logger.log(`Found ${rows.length} PAPER voucher entry`);
    return paginatedResponse(rows, count, page, limit);
  }

  async getFlexiVoucherHeaders(
    dto: GetHeadersDto
  ): Promise<PaginatedResponse<VoucherHeader>> {
    this.logger.log(`Fetching flexi voucher entry`);
    const { companyNo, vendorNo, entryNo } = dto;
    const { limit, offset, page, sortBy, sortOrder } =
      normalizeSearchQuery(dto);
    const data = {
      companyNo,
      vendorNo,
      entryNo,
      limit,
      offset,
      sortBy,
      sortOrder,
      processType: PROCESS_TYPE_ENUM.FLEXI,
    };
    const { rows, count } =
      await this.voucherHeaderInterface.findAllWithAllFields(data, true);

    this.logger.log(`Found ${rows.length} flexi voucher entry`);

    return paginatedResponse(rows, count, page, limit);
  }

  async createOrUpdateVoucherDetail(
    data: Partial<VoucherDetail[]>
  ): Promise<VoucherDetail[]> {
    return await this.voucherDetailInterface.createOrUpdate(data);
  }

  async createOrUpdateVoucherHeader(
    headerData: Partial<VoucherHeader>
  ): Promise<VoucherHeader> {
    this.logger.log("Creating or updating voucher header");

    // Check if header exists
    const existingHeader = await this.voucherHeaderInterface.findOne(
      headerData.companyNo!,
      headerData.entryNo!,
      headerData.vendorNo,
      headerData.entrySequence
    );

    if (existingHeader) {
      this.logger.log("Updating existing voucher header");
      const updatedHeaders = await this.voucherHeaderInterface.update(
        headerData.companyNo!,
        headerData.entryNo!,
        headerData.entrySequence!,
        headerData
      );

      return updatedHeaders;
    } else {
      return await this.createVoucherHeader(headerData);
    }
  }

  async createVoucherHeader(
    headerData: Partial<VoucherHeader>
  ): Promise<VoucherHeader> {
    this.logger.log("Creating new voucher header");
    return await this.voucherHeaderInterface.create(headerData);
  }

  async createVoucherDetail(
    data: Partial<VoucherDetail[]>
  ): Promise<VoucherDetail[]> {
    return await this.voucherDetailInterface.create(data);
  }

  async softDeleteVoucher(
    entryNo: number,
    companyNo: number,
    vendorNo: number,
    invoiceNo: string
  ): Promise<{ success: boolean; message: string }> {
    this.logger.log(
      `Soft deleting voucher with entryNo: ${entryNo}, companyNo: ${companyNo}, vendorNo: ${vendorNo}, invoiceNo: ${invoiceNo}`
    );

    const headerResult = await this.voucherHeaderInterface.softDelete(
      entryNo,
      companyNo,
      vendorNo,
      invoiceNo
    );
    const detailsAffected = await this.voucherDetailInterface.softDeleteByEntry(
      entryNo,
      companyNo,
      vendorNo
    );
    this.logger.debug(
      `Voucher soft deleted: header=${headerResult}, details affected=${detailsAffected}`
    );

    return {
      success: headerResult,
      message: headerResult
        ? `Voucher with entry number ${entryNo}, company number ${companyNo}, vendor number ${vendorNo}, invoice number ${invoiceNo} has been deleted successfully. ${detailsAffected} detail(s) marked as deleted.`
        : `Failed to delete voucher with entry number ${entryNo}, company number ${companyNo}, vendor number ${vendorNo}, invoice number ${invoiceNo}`,
    };
  }

  async hardDeleteVoucher(
    dto: HardDeleteVoucherDto
  ): Promise<{ success: boolean; message: string }> {
    const { invoiceNo, entryNo, companyNo, vendorNo } = dto;

    const headerDeleted = await this.voucherHeaderInterface.hardDelete(
      invoiceNo,
      entryNo,
      companyNo,
      vendorNo
    );
    this.logger.debug(`Header deleted: ${headerDeleted}`);

    const detailsDeleted = await this.voucherDetailInterface.hardDelete(
      entryNo,
      companyNo,
      vendorNo
    );
    this.logger.debug(`Details deleted count: ${detailsDeleted}`);

    const result = detailsDeleted || headerDeleted;

    return {
      success: result,
      message: result
        ? `Voucher with entryNo ${entryNo} deleted successfully (header: ${headerDeleted}, details: ${detailsDeleted})`
        : `Failed to delete voucher with entryNo ${entryNo}`,
    };
  }

  async softDeleteVoucherDetail(
    companyNo: number,
    vendorNo: number,
    entryNo: number,
    entrySequence: number
  ): Promise<{ success: boolean; message: string }> {
    this.logger.log(
      `Soft deleting voucher detail - Company: ${companyNo}, Vendor: ${vendorNo}, Entry: ${entryNo}, Sequence: ${entrySequence}`
    );

    const wasDeleted = await this.voucherDetailInterface.softDeleteDetail(
      companyNo,
      vendorNo,
      entryNo,
      entrySequence
    );

    return {
      success: true,
      message: wasDeleted
        ? `Successfully soft deleted voucher detail - Company: ${companyNo}, Vendor: ${vendorNo}, Entry: ${entryNo}, Sequence: ${entrySequence}`
        : `Voucher detail not found or already deleted - Company: ${companyNo}, Vendor: ${vendorNo}, Entry: ${entryNo}, Sequence: ${entrySequence}`,
    };
  }
}
