import { Injectable, Inject } from "@nestjs/common";
import { CarrierInvoiceHeaderEntity } from "@src/main/account-payable/domain/entities/carrier-invoice-header.entity";
import { CarrierInvoiceHeaderModel } from "@src/main/account-payable/data/models/carrier-invoice-header.model";
import { CarrierInvoiceHeaderMapper } from "@src/main/account-payable/data/mappers/carrier-invoice-header.mapper";
import { CarrierInvoiceHeaderInterface } from "@src/main/account-payable/domain/interface/carrier-invoice-header.interface";
import { Op } from "@sequelize/core";

@Injectable()
export class CarrierInvoiceHeaderRepository
  implements CarrierInvoiceHeaderInterface {
  constructor(
    @Inject("CarrierInvoiceHeaderModel")
    private readonly carrierInvoiceHeaderModel: typeof CarrierInvoiceHeaderModel,
  ) { }

  async findByCompanyNo(
    companyNo: number,
  ): Promise<CarrierInvoiceHeaderEntity[]> {
    const records = await this.carrierInvoiceHeaderModel.findAll({
      where: {
        companyNo,
        isDeleted: "N",
      },
    });
    return records.map(CarrierInvoiceHeaderMapper.toEntity);
  }

  async findByCompanyAndCarrier(
    companyNo: number,
    carrierId?: string,
    carrierInvoiceNumber?: string,
    orderNo?: number | string,
  ): Promise<CarrierInvoiceHeaderEntity | null> {
    // Return null if mandatory parameter is missing
    if (!companyNo) {
      console.log(`CarrierInvoiceHeader query skipped - missing mandatory param: companyNo=${companyNo}`);
      return null;
    }

    // Build WHERE clause with only valid parameters
    const whereClause: any = {
      companyNo,
      isDeleted: "N",
    };

    if (carrierId && carrierId.trim() !== '') {
      whereClause.carrierId = carrierId;
    }

    if (carrierInvoiceNumber && carrierInvoiceNumber.trim() !== '') {
      whereClause.carrierInvoiceNumber = carrierInvoiceNumber;
    }

    if (orderNo) {
      whereClause.orderNumber = orderNo;
    }

    const record = await this.carrierInvoiceHeaderModel.findOne({
      where: whereClause,
    });
    return record ? CarrierInvoiceHeaderMapper.toEntity(record) : null;
  }

  // Update Invoice Status to processed (Y)
  async updateInvoiceStatus(orderNo: number, companyNo: number, carrierId: string, carrierInvoiceNumber: string) {

    const result = await this.carrierInvoiceHeaderModel.update(
      { apInvoiceStatus: 'Y' },
      {
        where: {
          invoiceNumber: {
            [Op.in]: orderNo
          },
          companyNo,
          carrierId,
          carrierInvoiceNumber
        }
      }
    );

    return result
  }
}
