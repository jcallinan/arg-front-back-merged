import { Injectable, Inject } from "@nestjs/common";
import { OwnerVendorReferenceModel } from "../models/owner-vendor-reference.model";
import { Op } from "@sequelize/core";
import { IsDeletedStatus } from "@src/shared/constants/constant";
import { OwnerVendorInterface } from "@src/main/account-payable/domain/interface/owner-vendor.interface";
import { OwnerVendorEntity } from "@src/main/account-payable/domain/entities/owner-vendor.entity";
import { ownerVendorMapper } from "../mappers/owner-vendor.mapper";
import { VendorModel } from "../models/vendor.model";
import { PaginatedResponse, paginatedResponse } from "@src/shared/utils/response-formatter";
import { AppLogger } from "@src/shared/logger/logger.service";
import { vendorOwnerFormatter } from "@src/shared/formatters/dropdown.formatter";
import { vendorOwnerListType } from "@src/types/vendor-management-types";

@Injectable()
export class OwnerVendorReferenceRepository implements OwnerVendorInterface {

  private readonly logger = new AppLogger(OwnerVendorReferenceRepository.name);

  constructor(
    @Inject("OwnerVendorReferenceModel")
    private readonly model: typeof OwnerVendorReferenceModel,

    @Inject("VendorModel")
    private readonly vendorModel: typeof VendorModel,
  ) { }

  async findActiveByOwnerNo(
    ownerNo: number,
  ): Promise<OwnerVendorEntity | null> {
    const ownerVendor = await this.model.findOne({
      where: {
        ownerNo,
        isDeleted: {
          [Op.notIn]: [IsDeletedStatus.DELETED, IsDeletedStatus.INACTIVE],
        },
      },
    });

    return ownerVendor ? ownerVendorMapper(ownerVendor) : null;
  }


  async findAndCountAll(data: vendorOwnerListType):
    Promise<PaginatedResponse<{
      items: OwnerVendorEntity[];
      total_items: number;
      current_page: number;
      items_per_page: number;
      total_pages: number,
    }>> {

    this.logger.log(`Fetch all Owner Records`)

    try {

      const { limit, page, vendorCompanyNumber, vendorNo, status, offset, ownerNo } = data

      const { rows } = await this.vendorModel.findAndCountAll({
        attributes: [
          "vendorCompanyNumber",
          "vendorNo",
          "vendorName"
        ],
        where: {
          vendorCompanyNumber,
          ...(vendorNo && { vendorNo }),
        },
        include: [
          {
            model: this.model,
            as: "vendorOwnerDetails",
            required: false,
            attributes: ["ownerNo", "vendorNo", "isDeleted"],
            where: {
              ...(vendorNo && { vendorNo }),
              ...(ownerNo && { ownerNo }),
              ...(status && {
                isDeleted: status
              })
            },
          },
        ],
        offset,
        limit,
      });

      const formatter = vendorOwnerFormatter(rows)

      return paginatedResponse(formatter, formatter.length, page ?? 1, limit ?? 10)

    } catch (error) {
      this.logger.error(`Error in findOwners: ${error}`);
      throw error;
    }

  }

  async findOne(vendorNo: number, ownerNo: number): Promise<OwnerVendorEntity | null> {

    this.logger.log(`Fetch One Owner Records`)
    try {
      const ownerVendor = await this.model.findOne({
        where: {
          ownerNo,
          vendorNo
        },
        include: [
          {
            model: this.vendorModel,
            as: "vendorDetails",
            required: false,
            attributes: ["vendorName"],
            where: {
              vendorNo,
            },
          },
        ],
      });

      return ownerVendor
    } catch (error) {
      this.logger.error(`Error in findOwners ${error}`);
      throw error;
    }

  }

  async createOrUpdateOwner(ownerNo: number, vendorNo: number, isDeleted: string): Promise<{ message: string }> {


    this.logger.log(`Create or Update Owner Details`)

    try {
      const ownerVendor = await this.model.findOne({
        where: {
          ownerNo,
        },
      });

      if (ownerVendor) {
        this.logger.debug(`Update Owner Details`)
        await ownerVendor.update({ vendorNo, isDeleted })
      } else {
        this.logger.debug(`Create Owner Details`)
        await this.model.create({ ownerNo, vendorNo, isDeleted })
      }

      return {
        message: `Owner Details ${ownerVendor ? 'Updated' : 'Save'} Successfully`
      }
    } catch (error) {
      this.logger.error(`Error in Create Or Update Owner: ${error}`);
      throw error;
    }
  }
}
