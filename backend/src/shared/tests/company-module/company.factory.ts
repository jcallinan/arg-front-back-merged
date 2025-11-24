import { Company } from "@src/main/account-payable/domain/entities/company.entity";

export interface CompanyFactoryOptions {
  companyNo?: number;
  companyName?: string;
  companyAddress1?: string;
  companyAddress2?: string;
  companyCity?: string;
  companyState?: string;
  companyZipCode?: string;
  companyPhone?: string;
  companyFax?: string;
  companyEmail?: string;
  companyWebsite?: string;
  companyTaxId?: string;
  companyStatus?: string;
  companyCreatedBy?: string;
  companyCreatedDate?: string;
  companyModifiedBy?: string;
  companyModifiedDate?: string;
}

export class CompanyFactory {
  /**
   * Creates a basic company with default values
   */
  static createBasicCompany(
    overrides: Partial<CompanyFactoryOptions> = {}
  ): Company {
    const defaultCompany: CompanyFactoryOptions = {
      companyNo: 1,
      companyName: "Test Company",
      companyAddress1: "123 Business St",
      companyAddress2: "Suite 100",
      companyCity: "Test City",
      companyState: "TX",
      companyZipCode: "12345",
      companyPhone: "555-123-4567",
      companyFax: "555-123-4568",
      companyEmail: "info@testcompany.com",
      companyWebsite: "www.testcompany.com",
      companyTaxId: "12-3456789",
      companyStatus: "ACTIVE",
      companyCreatedBy: "SYSTEM",
      companyCreatedDate: "20240101",
      companyModifiedBy: "SYSTEM",
      companyModifiedDate: "20240101",
    };

    return Company.create({ ...defaultCompany, ...overrides });
  }

  /**
   * Creates a company with minimal required fields
   */
  static createMinimalCompany(
    overrides: Partial<CompanyFactoryOptions> = {}
  ): Company {
    const minimalCompany: CompanyFactoryOptions = {
      companyNo: 1,
      companyName: "Test Company",
      companyStatus: "ACTIVE",
    };

    return Company.create({ ...minimalCompany, ...overrides });
  }

  /**
   * Creates an active company
   */
  static createActiveCompany(
    overrides: Partial<CompanyFactoryOptions> = {}
  ): Company {
    return this.createBasicCompany({ ...overrides, companyStatus: "ACTIVE" });
  }

  /**
   * Creates an inactive company
   */
  static createInactiveCompany(
    overrides: Partial<CompanyFactoryOptions> = {}
  ): Company {
    return this.createBasicCompany({ ...overrides, companyStatus: "INACTIVE" });
  }

  /**
   * Creates a company with specific company number
   */
  static createCompanyWithNumber(
    companyNo: number,
    overrides: Partial<CompanyFactoryOptions> = {}
  ): Company {
    return this.createBasicCompany({ ...overrides, companyNo });
  }

  /**
   * Creates multiple companies with sequential numbers
   */
  static createMultipleCompanies(
    count: number,
    overrides: Partial<CompanyFactoryOptions> = {}
  ): Company[] {
    return Array.from({ length: count }, (_, index) =>
      this.createBasicCompany({
        ...overrides,
        companyNo: (overrides.companyNo || 1) + index,
        companyName: `${overrides.companyName || "Test Company"} ${index + 1}`,
      })
    );
  }

  /**
   * Creates a company for testing pagination
   */
  static createCompanyForPagination(
    page: number,
    itemIndex: number,
    overrides: Partial<CompanyFactoryOptions> = {}
  ): Company {
    const companyNo = (page - 1) * 10 + itemIndex + 1;
    return this.createBasicCompany({
      ...overrides,
      companyNo,
      companyName: `Company ${companyNo}`,
    });
  }

  /**
   * Creates a company with specific status
   */
  static createCompanyWithStatus(
    status: string,
    overrides: Partial<CompanyFactoryOptions> = {}
  ): Company {
    return this.createBasicCompany({ ...overrides, companyStatus: status });
  }

  /**
   * Creates a company with specific state
   */
  static createCompanyInState(
    state: string,
    overrides: Partial<CompanyFactoryOptions> = {}
  ): Company {
    return this.createBasicCompany({ ...overrides, companyState: state });
  }

  /**
   * Creates a company with specific tax ID
   */
  static createCompanyWithTaxId(
    taxId: string,
    overrides: Partial<CompanyFactoryOptions> = {}
  ): Company {
    return this.createBasicCompany({ ...overrides, companyTaxId: taxId });
  }
}
