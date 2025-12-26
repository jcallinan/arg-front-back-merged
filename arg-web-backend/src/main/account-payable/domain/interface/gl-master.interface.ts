import { GlMasterEntity } from "@src/main/account-payable/domain/entities/gl-master.entity";

export interface GlNumberValidationData {
  glNo: number;
  companyNo: number;
  fieldName: string;
  errorMessage: string;
}

export interface GlNumberValidationResult {
  isValid: boolean;
  field?: string;
  message?: string;
}

export interface GlNumberValidationErrors {
  errors: Array<{
    field: string;
    code: string;
    message: string;
  }>;
}

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

  /**
   * Validate company maintenance GL numbers
   * Validates required GL numbers and optional ones (if != 0)
   * @param companyNo Company number
   * @param apGlNo AP GL Number
   * @param bankGlNo Bank GL Number
   * @param discountsGlNo Discounts GL Number
   * @param intercoGlNo Inter-company GL Number (optional, validated if != 0)
   * @param retentionGlNo Retention GL Number (optional, validated if != 0)
   * @param employeeExpenseGlNo Employee Expense GL Number (optional, validated if != 0)
   * @returns Validation errors for all invalid GL numbers
   */
  validateCompanyMaintenanceGlNumbers(
    companyNo: number,
    apGlNo: number,
    bankGlNo: number,
    discountsGlNo: number,
    intercoGlNo: number,
    retentionGlNo: number,
    employeeExpenseGlNo: number
  ): Promise<GlNumberValidationErrors>;
}
