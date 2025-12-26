import { Injectable, Inject } from "@nestjs/common";
import {
  DropdownInterface,
  DropdownOptions,
} from "../../domain/interface/filters-list.interface";
import { DropdownType } from "@src/types/types";
import {
  DropdownTypeEnum,
  DropdownDbTypeEnum,
  getDropdownData,
  DropdownKey,
} from "@src/shared/utils/dropdown";
import { VendorRepository } from "@src/main/account-payable/data/repositories/vendor.repository";
import { CompanyRepository } from "@src/main/account-payable/data/repositories/company.repository";
import { GlMasterRepository } from "@src/main/account-payable/data/repositories/gl-master.repository";
import { AppLogger } from "@src/shared/logger/logger.service";
import { GeneralSystemRepository } from "@src/main/account-payable/data/repositories/general-system.repository";
import { VendorManagementDropdownTypes } from "@src/shared/constants/constant";
import { CarrierRepository } from "@src/main/account-payable/data/repositories/carrier.repository";
import { VendorType } from "@src/shared/constants/constant";

@Injectable()
export class FiltersListRepository implements DropdownInterface {
  private readonly logger = new AppLogger(FiltersListRepository.name);

  constructor(
    @Inject("VendorRepository")
    private readonly vendorRepository: VendorRepository,
    @Inject("CompanyRepository")
    private readonly companyRepository: CompanyRepository,
    @Inject("GlMasterRepository")
    private readonly glMasterRepository: GlMasterRepository,
    @Inject("GeneralSystemRepository")
    private readonly generalSystemRepository: GeneralSystemRepository,
    @Inject("CarrierRepository")
    private readonly carrierRepository: CarrierRepository
  ) { }

  async getDropdownData(
    type: DropdownTypeEnum | DropdownDbTypeEnum,
    options?: DropdownOptions
  ): Promise<{ rows: DropdownType[]; count: number }> {
    this.logger.log(`Getting dropdown data for type: ${type}`);

    try {
      // The ValidationPipe has already transformed the query parameters
      // We can use the options directly
      this.logger.debug(`Raw options: ${JSON.stringify(options)}`);
      this.logger.debug(
        `Using limit: ${options?.limit}, offset: ${options?.offset}`
      );

      switch (type) {
        case DropdownDbTypeEnum.VENDOR_NAMES: {
          const result =
            await this.vendorRepository.getVendorCategoriesForDropdown(
              options?.companyNo || 1,
              options?.search,
              options?.limit || 10,
              options?.offset || 0
            );

          return {
            rows: result.rows.map((vendor) => ({
              id: String(vendor.vendorNo),
              value: vendor.vendorName,
              label: vendor.vendorName,
            })),
            count: result.count,
          };
        }

        case DropdownDbTypeEnum.COMPANY_NAMES: {
          const result =
            await this.companyRepository.getCompanyNamesForDropdown(
              options?.search,
              options?.limit || 10,
              options?.offset || 0,
              options?.companyNo
            );

          return {
            rows: result.rows.map((company) => ({
              id: String(company.companyNo),
              value: company.companyName,
              label: company.companyName,
            })),
            count: result.count,
          };
        }

        case DropdownDbTypeEnum.EXPENSE_GL: {
          const result =
            await this.glMasterRepository.getExpenseGLAccountsForDropdown(
              options?.companyNo || 1,
              options?.search,
              options?.limit || 10,
              options?.offset || 0
            );

          return {
            rows: result.rows.map((account) => ({
              id: `${account.accountNo}`,
              value: account.description,
              label: `${account.accountNo} - ${account.description}`,
            })),
            count: result.count,
          };
        }

        case DropdownDbTypeEnum.VENDOR_TERMS_CODE:
        case DropdownDbTypeEnum.VENDOR_CATEGORY:
        case DropdownDbTypeEnum.AP_1099:
        case DropdownDbTypeEnum.VENDOR_FORM_TYPE:
        case DropdownDbTypeEnum.VENDOR_GAL_RECEIPT:
          {
            const result =
              await this.generalSystemRepository.getDropdownlist(
                VendorManagementDropdownTypes[type],
                options?.limit || 10,
                options?.offset || 0
              );

            const ap1099ExcludeValues = ["#", "D", "I", "P", "R"];

            const filteredRows =
              type === DropdownDbTypeEnum.AP_1099
                ? result.rows.filter(
                  (record) => !ap1099ExcludeValues.includes(record.tableCode)
                )
                : result.rows;

            return {
              rows: filteredRows.map((record) => ({
                id: `${record.tableCode} - ${record.tableDesc}`,
                value: record.tableCode,
                label: `${record.tableDesc}`,
              })),
              count: result.count,
            };
          }

        case DropdownDbTypeEnum.VENDOR_CARRIER: {
          const result =
            await this.carrierRepository.getDropdownList(
              options?.companyNo || 10,
              options?.limit || 10,
              options?.offset || 0
            );

          return {
            rows: result.rows.map((record) => ({
              id: `${record.carrierId} - ${record.carrierName}`,
              value: record.carrierId,
              label: `${record.carrierName}`,
            })),
            count: result.count,
          };
        }

        case DropdownDbTypeEnum.VENDOR_MAINTENANCE_TYPE: {
          const result = await this.vendorRepository.getVendorTypes();

          return {
            rows: result.map((type) => ({
              id: type.vendorHoldPaymentsVend,
              value: VendorType[type.vendorHoldPaymentsVend] ?? '',
              label: VendorType[type.vendorHoldPaymentsVend] ?? '',
            })),
            count: result.length,
          };
        }

        case DropdownDbTypeEnum.AP_PERIOD_END_YEARS: {
          const currentYear = new Date().getFullYear();
          const previousYear = currentYear - 1;

          const result = [
            {
              id: String(currentYear),
              value: String(currentYear),
              label: String(currentYear),
            },
            {
              id: String(previousYear),
              value: String(previousYear),
              label: String(previousYear),
            },
          ];

          return {
            rows: result,
            count: result.length,
          };
        }

        default:
          const dropdownKey = type as DropdownKey;

          const allItems = getDropdownData(dropdownKey, options?.search);

          const items = getDropdownData(
            dropdownKey,
            options?.search,
            options?.limit || 10,
            options?.offset || 0
          );

          return {
            rows: items,
            count: allItems.length,
          };
      }
    } catch (error) {
      this.logger.error(
        `Error getting dropdown data for type ${type}: ${error instanceof Error ? error.message : "Unknown error"}`
      );
      throw error;
    }
  }
}
