import { Injectable, Inject } from "@nestjs/common";
import { AppLogger } from "@src/shared/logger/logger.service";
import { GetCarrierInvoicesDto, CarrierInvoiceResponseDto } from "../../dto/voucher.dto";
import { PaginatedResponse } from "@src/shared/utils/response-formatter";
import { FreightInvoiceHeaderInterface } from "@src/main/account-payable/domain/interface/freight-invoice-header.interface";
import { INVOICE_TYPE } from "@src/shared/constants/constant";

@Injectable()
export class GetLmsCarrierInvoicesUseCase {
  private readonly logger = new AppLogger(GetLmsCarrierInvoicesUseCase.name);

  constructor(
    @Inject("FreightInvoiceHeaderInterface")
    private readonly freightInvoiceHeaderInterface: FreightInvoiceHeaderInterface,) { }

  async execute(dto: GetCarrierInvoicesDto): Promise<PaginatedResponse<CarrierInvoiceResponseDto>> {
    dto.invoiceType = INVOICE_TYPE.O
    this.logger.log("Fetching all LMS carrier invoices");
    return await this.freightInvoiceHeaderInterface.findCarrierInvoices(dto);
  }
}
