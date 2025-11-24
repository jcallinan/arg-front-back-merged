import { GlMasterEntity } from "@src/main/account-payable/domain/entities/gl-master.entity";

export interface GlMasterInterface {
  findOne(
    companyNo: number,
    accountNo: number,
    subAccountNos: number[],
    accountType: string,
    activeOnly?: boolean
  ): Promise<GlMasterEntity | null>;

  findMultiple(
    companyNo: number,
    accountDetails: Array<{
      accountNo: number;
      subAccountNo: number;
      accountType: string;
    }>
  ): Promise<Map<string, GlMasterEntity>>;

  cacheAllGlMasterForCompany(companyNo: number): Promise<void>;

  /**
   * Find expense GL accounts for dropdown
   * @param companyNo Company number
   * @param search Optional search term
   * @param limit Optional limit for pagination
   * @param offset Optional offset for pagination
   * @returns Promise with expense GL accounts
   */
  findExpenseGLAccounts(
    companyNo: number,
    search?: string,
    limit?: number,
    offset?: number
  ): Promise<{ rows: GlMasterEntity[]; count: number }>;
}
