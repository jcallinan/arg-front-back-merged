import { GlMasterEntity } from "@src/main/account-payable/domain/entities/gl-master.entity";

export interface GlMasterFactoryOptions {
  isDeleted?: string;
  companyNo?: number;
  accountNo?: number;
  subAccountNo?: number;
  accountType?: string;
  description?: string;
  accountCategory?: string;
  statementType?: string;
  statementLine?: number;
  drBalanceForward?: number;
  crBalanceForward?: number;
  drMonth01?: number;
  drMonth02?: number;
  drMonth03?: number;
  drMonth04?: number;
  drMonth05?: number;
  drMonth06?: number;
  drMonth07?: number;
  drMonth08?: number;
  drMonth09?: number;
  drMonth10?: number;
  drMonth11?: number;
  drMonth12?: number;
  crMonth01?: number;
  crMonth02?: number;
  crMonth03?: number;
  crMonth04?: number;
  crMonth05?: number;
  crMonth06?: number;
  crMonth07?: number;
  crMonth08?: number;
  crMonth09?: number;
  crMonth10?: number;
  crMonth11?: number;
  crMonth12?: number;
  supSched2Type?: string;
  supSched2Line?: number;
  consSupSched2Line?: number;
  supSched3Type?: string;
  supSched3Dept?: number;
  supSched3Line?: number;
  consSupSched3Line?: number;
  filler?: string;
  specialAccount?: string;
  keyApGal?: string;
  productCode?: string;
  glType?: string;
  secondStmtType?: string;
  secondStmtLine?: number;
  secondConsStmtLine?: number;
  consolidatedGroup?: number;
  poRequired?: string;
  supSchedGroup?: number;
  suppSchedType?: string;
  suppSchedLine?: number;
  consolidatedLine?: number;
  consSupSchLine?: number;
  column?: number;
  unitCode?: string;
}

export class GlMasterFactory {
  /**
   * Creates a basic GL Master entity with default values
   */
  static createBasicGlMaster(
    overrides: Partial<GlMasterFactoryOptions> = {}
  ): GlMasterEntity {
    const defaultGlMaster: GlMasterFactoryOptions = {
      isDeleted: "A",
      companyNo: 1,
      accountNo: 100000,
      subAccountNo: 1,
      accountType: "C",
      description: "Test GL Account",
      accountCategory: "A",
      statementType: "B",
      statementLine: 1,
      drBalanceForward: 0,
      crBalanceForward: 0,
      drMonth01: 0,
      drMonth02: 0,
      drMonth03: 0,
      drMonth04: 0,
      drMonth05: 0,
      drMonth06: 0,
      drMonth07: 0,
      drMonth08: 0,
      drMonth09: 0,
      drMonth10: 0,
      drMonth11: 0,
      drMonth12: 0,
      crMonth01: 0,
      crMonth02: 0,
      crMonth03: 0,
      crMonth04: 0,
      crMonth05: 0,
      crMonth06: 0,
      crMonth07: 0,
      crMonth08: 0,
      crMonth09: 0,
      crMonth10: 0,
      crMonth11: 0,
      crMonth12: 0,
      supSched2Type: "",
      supSched2Line: 0,
      consSupSched2Line: 0,
      supSched3Type: "",
      supSched3Dept: 0,
      supSched3Line: 0,
      consSupSched3Line: 0,
      filler: "",
      specialAccount: "",
      keyApGal: "",
      productCode: "",
      glType: "",
      secondStmtType: "",
      secondStmtLine: 0,
      secondConsStmtLine: 0,
      consolidatedGroup: 0,
      poRequired: "",
      supSchedGroup: 0,
      suppSchedType: "",
      suppSchedLine: 0,
      consolidatedLine: 0,
      consSupSchLine: 0,
      column: 0,
      unitCode: "",
    };

    const merged = { ...defaultGlMaster, ...overrides };

    return new GlMasterEntity(
      merged.isDeleted!,
      merged.companyNo!,
      merged.accountNo!,
      merged.subAccountNo!,
      merged.accountType!,
      merged.description!,
      merged.accountCategory!,
      merged.statementType!,
      merged.statementLine!,
      merged.drBalanceForward!,
      merged.crBalanceForward!,
      merged.drMonth01!,
      merged.drMonth02!,
      merged.drMonth03!,
      merged.drMonth04!,
      merged.drMonth05!,
      merged.drMonth06!,
      merged.drMonth07!,
      merged.drMonth08!,
      merged.drMonth09!,
      merged.drMonth10!,
      merged.drMonth11!,
      merged.drMonth12!,
      merged.crMonth01!,
      merged.crMonth02!,
      merged.crMonth03!,
      merged.crMonth04!,
      merged.crMonth05!,
      merged.crMonth06!,
      merged.crMonth07!,
      merged.crMonth08!,
      merged.crMonth09!,
      merged.crMonth10!,
      merged.crMonth11!,
      merged.crMonth12!,
      merged.supSched2Type!,
      merged.supSched2Line!,
      merged.consSupSched2Line!,
      merged.supSched3Type!,
      merged.supSched3Dept!,
      merged.supSched3Line!,
      merged.consSupSched3Line!,
      merged.filler!,
      merged.specialAccount!,
      merged.keyApGal!,
      merged.productCode!,
      merged.glType!,
      merged.secondStmtType!,
      merged.secondStmtLine!,
      merged.secondConsStmtLine!,
      merged.consolidatedGroup!,
      merged.poRequired!,
      merged.supSchedGroup!,
      merged.suppSchedType!,
      merged.suppSchedLine!,
      merged.consolidatedLine!,
      merged.consSupSchLine!,
      merged.column!,
      merged.unitCode!
    );
  }

  /**
   * Creates a GL Master entity for a specific company
   */
  static createGlMasterForCompany(
    companyNo: number,
    overrides: Partial<GlMasterFactoryOptions> = {}
  ): GlMasterEntity {
    return this.createBasicGlMaster({
      companyNo,
      ...overrides,
    });
  }

  /**
   * Creates a GL Master entity with a specific account number
   */
  static createGlMasterWithAccount(
    accountNo: number,
    subAccountNo: number = 1,
    accountType: string = "C",
    overrides: Partial<GlMasterFactoryOptions> = {}
  ): GlMasterEntity {
    return this.createBasicGlMaster({
      accountNo,
      subAccountNo,
      accountType,
      description: `GL Account ${accountNo}`,
      ...overrides,
    });
  }

  /**
   * Creates multiple GL Master entities
   */
  static createMultipleGlMasters(
    count: number,
    baseOverrides: Partial<GlMasterFactoryOptions> = {}
  ): GlMasterEntity[] {
    return Array.from({ length: count }, (_, i) =>
      this.createBasicGlMaster({
        accountNo: (baseOverrides.accountNo || 100000) + i,
        description: `GL Account ${(baseOverrides.accountNo || 100000) + i}`,
        ...baseOverrides,
      })
    );
  }

  /**
   * Creates a GL Master entity with high balances for testing
   */
  static createHighBalanceGlMaster(
    overrides: Partial<GlMasterFactoryOptions> = {}
  ): GlMasterEntity {
    return this.createBasicGlMaster({
      drBalanceForward: 50000,
      crBalanceForward: 25000,
      drMonth01: 5000,
      drMonth02: 7500,
      crMonth01: 2500,
      crMonth02: 3750,
      ...overrides,
    });
  }

  /**
   * Creates a mock GL Master model for database testing
   */
  static createMockGlMasterModel(
    overrides: Partial<GlMasterFactoryOptions> = {}
  ): Record<string, unknown> {
    const entity = this.createBasicGlMaster(overrides);

    return {
      isDeleted: entity.isDeleted,
      companyNo: entity.companyNo,
      accountNo: entity.accountNo,
      subAccountNo: entity.subAccountNo,
      accountType: entity.accountType,
      description: entity.description,
      accountCategory: entity.accountCategory,
      statementType: entity.statementType,
      statementLine: entity.statementLine,
      drBalanceForward: entity.drBalanceForward,
      crBalanceForward: entity.crBalanceForward,
      drMonth01: entity.drMonth01,
      drMonth02: entity.drMonth02,
      drMonth03: entity.drMonth03,
      drMonth04: entity.drMonth04,
      drMonth05: entity.drMonth05,
      drMonth06: entity.drMonth06,
      drMonth07: entity.drMonth07,
      drMonth08: entity.drMonth08,
      drMonth09: entity.drMonth09,
      drMonth10: entity.drMonth10,
      drMonth11: entity.drMonth11,
      drMonth12: entity.drMonth12,
      crMonth01: entity.crMonth01,
      crMonth02: entity.crMonth02,
      crMonth03: entity.crMonth03,
      crMonth04: entity.crMonth04,
      crMonth05: entity.crMonth05,
      crMonth06: entity.crMonth06,
      crMonth07: entity.crMonth07,
      crMonth08: entity.crMonth08,
      crMonth09: entity.crMonth09,
      crMonth10: entity.crMonth10,
      crMonth11: entity.crMonth11,
      crMonth12: entity.crMonth12,
      supSched2Type: entity.supSched2Type,
      supSched2Line: entity.supSched2Line,
      consSupSched2Line: entity.consSupSched2Line,
      supSched3Type: entity.supSched3Type,
      supSched3Dept: entity.supSched3Dept,
      supSched3Line: entity.supSched3Line,
      consSupSched3Line: entity.consSupSched3Line,
      filler: entity.filler,
      specialAccount: entity.specialAccount,
      keyApGal: entity.keyApGal,
      productCode: entity.productCode,
      glType: entity.glType,
      secondStmtType: entity.secondStmtType,
      secondStmtLine: entity.secondStmtLine,
      secondConsStmtLine: entity.secondConsStmtLine,
      consolidatedGroup: entity.consolidatedGroup,
      poRequired: entity.poRequired,
      supSchedGroup: entity.supSchedGroup,
      suppSchedType: entity.suppSchedType,
      suppSchedLine: entity.suppSchedLine,
      consolidatedLine: entity.consolidatedLine,
      consSupSchLine: entity.consSupSchLine,
      column: entity.column,
      unitCode: entity.unitCode,
    };
  }
}
