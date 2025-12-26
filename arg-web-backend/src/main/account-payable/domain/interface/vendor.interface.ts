import { GetVendorsByYearDto, UpdateVendorByYearDto } from "../../application/ap-period-end/dto/ap-period-end.dto";
import { vendorDetailsDto, vendorMasterListDto } from "../../application/vendor-management/dto/vendor-management.dto";
import { VendorContactDetailEntity } from "../entities/vendor-contact-detail.entity";
import { Vendor } from "../entities/vendor.entity";
import { YearEndProcessResponse } from "../entities/year-end-process.entity";
  
/**
 * Interface for vendor repository operations
 */
export interface VendorInterface {
  /**
   * Find all active vendors for a company
   * @param companyNo Company number to find vendors for
   * @param search Optional search parameter
   * @param limit Optional limit for pagination
   * @param offset Optional offset for pagination
   * @param fullDetails Optional flag to return full vendor details (default: false)
   * @returns Promise<Vendor[]> Array of active vendors
   */
  findAll(
    companyNo: number,
    search?: string,
    limit?: number,
    offset?: number,
    fullDetails?: boolean,
    includeisDeleted?: boolean
  ): Promise<{ rows: Vendor[]; count: number }>;

  /**
   * Find a vendor by its number and company number
   * @param vendorNo Vendor number to find
   * @param companyNo Company number
   * @returns Promise<Vendor | null> Vendor if found, null otherwise
   */
  findOne(vendorNo: number, companyNo: number): Promise<Vendor | null>;

  /**
   * Cache all vendors for a company - useful for CSV upload scenarios
   * @param companyNo Company number to cache vendors for
   * @returns Promise with cache statistics
   */
  cacheAllVendorsForCompany(companyNo: number): Promise<{
    totalVendors: number;
    cachedVendors: number;
    duration: number;
  }>;

  getVendorTypes(): Promise<any>

  getVendorMasterList(data: vendorMasterListDto): Promise<{
    rows: Vendor[];
    count: number,
    page: number,
    limit: number
  }>

  createOrUpdateVendor(data: vendorDetailsDto): Promise<{ message: string }>

  getVendorNoByCompanyAndCarrierId(
    companyNo: number,
    carrierId: string
  ): Promise<Vendor | null>


  getVendorAndContactDetails(vendorCompanyNumber: number, vendorNo: number): Promise<{
    vendor: Vendor;
    vendorContactDetails: VendorContactDetailEntity[];
  } | null>

  clearVendorTotals(clearYTD: boolean): Promise<void>;

  saveVendorFileForIRS(dataSchema?: string, sourceTableName?: string): Promise<{
    success: boolean;
    message: string;
  }>;

  getVendorMasterListByYear(data: GetVendorsByYearDto): Promise<{
    rows: Vendor[];
    count: number,
    page: number,
    limit: number
  }>


  getVendorDetailsByYear(
    vendorCompanyNumber: number,
    vendorNo: number,
    year: string
  ): Promise<Vendor | null>
  updateVendorByYear(data: UpdateVendorByYearDto, year: string, vendorNo: string): Promise<{ message: string }>

  processVendorYearEnd(companyNo: number, year: string, clearYTD: boolean): Promise<YearEndProcessResponse>
}
