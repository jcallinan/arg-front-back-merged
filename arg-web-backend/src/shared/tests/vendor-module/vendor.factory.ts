import { Vendor } from "@src/main/account-payable/domain/entities/vendor.entity";
import { VendorContactDetailEntity } from "@src/main/account-payable/domain/entities/vendor-contact-detail.entity";
import { OwnerVendorEntity } from "@src/main/account-payable/domain/entities/owner-vendor.entity";
import { NO, YES } from "@src/shared/constants/constant";

export interface VendorFactoryOptions {
  vendorCompanyNumber?: number;
  vendorNo?: number;
  vendorName?: string;
  vendorAdd1?: string;
  vendorAdd2?: string;
  vendorAdd3?: string;
  vendorAdd4?: string;
  vendorZipCode?: number;
  vendorExtraZip?: number;
  vendorAlphaSortAbbr?: string;
  vendorAreaCode?: number;
  vendorTelephoneNo?: number;
  vendorLastPaymentAmt?: number;
  vendorLastPaymentDate?: number;
  vendorYtdPurchases?: number;
  vendorLastYearPurchases?: number;
  vendorMtdDiscounts?: number;
  vendorYtdDiscounts?: number;
  vendorNameOverflow?: string;
  vendorGalRcptsRequired?: string;
  vendorFiller?: string;
  vendorPreviousBalance?: number;
  vendorMtdPurchases?: number;
  vendorMtdPayments?: number;
  vendorCurrentBalance?: number;
  vendorHoldPaymentsVend?: string;
  vendorSingleCheck?: string;
  vendorThisYrYtdPaid?: number;
  vendorLastYrYtdPaid?: number;
  vendorExpenseGLSub?: number;
  vendorApTermsCode?: number;
  vendorAp1099Code?: string;
  vendorIdNumber?: string;
  vendorFirst1099BoxNumber?: number;
  vendorSecond1099BoxNumber?: number;
  vendorSecond1099BoxAmount?: number;
  vendorLastPaymentDateAlt?: number;
  vendorCarrierId?: string;
  vendorIsDeleted?: string;
  vendorPayeeName1?: string;
  vendorPayeeName2?: string;
  vendorIrsNameControl?: string;
  vendorAdpPayrollId?: number;
  vendorAchClass?: string;
  vendorAchCheckingOrSavings?: string;
  vendorAchBankRoutingCode?: number;
  vendorAchBankAccountNumber?: string;
  vendorFirstName?: string;
  vendorMiddleName?: string;
  vendorBusinessLastName?: string;
  vendorNameSuffix?: string;
  vendorCountryCode?: string;
  vendorCategoryCode?: string;
  vendorFiller2?: string;
}

export interface VendorContactDetailFactoryOptions {
  deleteCode?: string;
  companyNo?: number;
  vendorNo?: number;
  formType?: string;
  sequenceNumber?: number;
  contactName?: string;
  emailAddress?: string;
  faxNumber?: string;
  sendAchEmail?: string;
  filler?: string;
}

export interface OwnerVendorFactoryOptions {
  ownerNo?: number;
  vendorNo?: number;
  isDeleted?: string;
  filler?: string;
}

export class VendorFactory {
  /**
   * Creates a basic vendor with default values
   */
  static createBasicVendor(
    overrides: Partial<VendorFactoryOptions> = {}
  ): Vendor {
    const defaultVendor: VendorFactoryOptions = {
      vendorCompanyNumber: 1,
      vendorNo: 100,
      vendorName: "Test Vendor",
      vendorAdd1: "123 Test St",
      vendorAdd2: "Suite 100",
      vendorAdd3: "",
      vendorAdd4: "",
      vendorZipCode: 12345,
      vendorExtraZip: 0,
      vendorAlphaSortAbbr: "TV",
      vendorAreaCode: 555,
      vendorTelephoneNo: 1234567,
      vendorLastPaymentAmt: 1000.0,
      vendorLastPaymentDate: 20231201,
      vendorYtdPurchases: 50000.0,
      vendorLastYearPurchases: 45000.0,
      vendorMtdDiscounts: 500.0,
      vendorYtdDiscounts: 2500.0,
      vendorNameOverflow: "",
      vendorGalRcptsRequired: NO,
      vendorFiller: "",
      vendorPreviousBalance: 5000.0,
      vendorMtdPurchases: 5000.0,
      vendorMtdPayments: 3000.0,
      vendorCurrentBalance: 7000.0,
      vendorHoldPaymentsVend: "A",
      vendorSingleCheck: NO,
      vendorThisYrYtdPaid: 20000.0,
      vendorLastYrYtdPaid: 18000.0,
      vendorExpenseGLSub: 1000,
      vendorApTermsCode: 30,
      vendorAp1099Code: NO,
      vendorIdNumber: "123456789",
      vendorFirst1099BoxNumber: 0,
      vendorSecond1099BoxNumber: 0,
      vendorSecond1099BoxAmount: 0,
      vendorLastPaymentDateAlt: 0,
      vendorCarrierId: "CAR001",
      vendorIsDeleted: "A",
    };

    return Vendor.create({ ...defaultVendor, ...overrides });
  }

  /**
   * Creates a vendor with minimal required fields
   */
  static createMinimalVendor(
    overrides: Partial<VendorFactoryOptions> = {}
  ): Vendor {
    const minimalVendor: VendorFactoryOptions = {
      vendorCompanyNumber: 1,
      vendorNo: 100,
      vendorName: "Test Vendor",
      vendorIsDeleted: "A",
    };

    return Vendor.create({ ...minimalVendor, ...overrides });
  }

  /**
   * Creates an active vendor (not deleted)
   */
  static createActiveVendor(
    overrides: Partial<VendorFactoryOptions> = {}
  ): Vendor {
    return this.createBasicVendor({ ...overrides, vendorIsDeleted: "A" });
  }

  /**
   * Creates a deleted vendor
   */
  static createDeletedVendor(
    overrides: Partial<VendorFactoryOptions> = {}
  ): Vendor {
    return this.createBasicVendor({ ...overrides, vendorIsDeleted: "D" });
  }

  /**
   * Creates a vendor on hold
   */
  static createVendorOnHold(
    overrides: Partial<VendorFactoryOptions> = {}
  ): Vendor {
    return this.createBasicVendor({
      ...overrides,
      vendorHoldPaymentsVend: "H",
    });
  }

  /**
   * Creates a vendor with specific company number
   */
  static createVendorForCompany(
    companyNo: number,
    overrides: Partial<VendorFactoryOptions> = {}
  ): Vendor {
    return this.createBasicVendor({
      ...overrides,
      vendorCompanyNumber: companyNo,
    });
  }

  /**
   * Creates multiple vendors with sequential numbers
   */
  static createMultipleVendors(
    count: number,
    overrides: Partial<VendorFactoryOptions> = {}
  ): Vendor[] {
    return Array.from({ length: count }, (_, index) =>
      this.createBasicVendor({
        ...overrides,
        vendorNo: (overrides.vendorNo || 100) + index,
        vendorName: `${overrides.vendorName || "Test Vendor"} ${index + 1}`,
      })
    );
  }

  /**
   * Creates a vendor with high balance
   */
  static createHighBalanceVendor(
    overrides: Partial<VendorFactoryOptions> = {}
  ): Vendor {
    return this.createBasicVendor({
      ...overrides,
      vendorCurrentBalance: 100000.0,
      vendorPreviousBalance: 95000.0,
      vendorMtdPurchases: 15000.0,
    });
  }

  /**
   * Creates a vendor with no balance
   */
  static createZeroBalanceVendor(
    overrides: Partial<VendorFactoryOptions> = {}
  ): Vendor {
    return this.createBasicVendor({
      ...overrides,
      vendorCurrentBalance: 0.0,
      vendorPreviousBalance: 0.0,
      vendorMtdPurchases: 0.0,
      vendorMtdPayments: 0.0,
    });
  }

  /**
   * Creates a vendor with specific payment terms
   */
  static createVendorWithTerms(
    termsCode: number,
    overrides: Partial<VendorFactoryOptions> = {}
  ): Vendor {
    return this.createBasicVendor({
      ...overrides,
      vendorApTermsCode: termsCode,
    });
  }

  /**
   * Creates a vendor with 1099 information
   */
  static create1099Vendor(
    overrides: Partial<VendorFactoryOptions> = {}
  ): Vendor {
    return this.createBasicVendor({
      ...overrides,
      vendorAp1099Code: "Y",
      vendorIdNumber: "987654321",
      vendorFirst1099BoxNumber: 1,
      vendorSecond1099BoxNumber: 2,
      vendorSecond1099BoxAmount: 1000.0,
    });
  }

  /**
   * Creates a vendor with specific carrier ID
   */
  static createCarrierVendor(
    carrierId: string,
    overrides: Partial<VendorFactoryOptions> = {}
  ): Vendor {
    return this.createBasicVendor({ ...overrides, vendorCarrierId: carrierId });
  }

  /**
   * Creates a vendor for testing pagination
   */
  static createVendorForPagination(
    page: number,
    itemIndex: number,
    overrides: Partial<VendorFactoryOptions> = {}
  ): Vendor {
    const vendorNo = (page - 1) * 10 + itemIndex + 1;
    return this.createBasicVendor({
      ...overrides,
      vendorNo,
      vendorName: `Vendor ${vendorNo}`,
    });
  }

  /**
   * Creates a vendor specifically for AP Period End testing with detailed data
   */
  static createAPPeriodEndVendor(
    vendorNo: number,
    companyNo: number,
    overrides: Partial<VendorFactoryOptions> = {}
  ): Vendor {
    return this.createVendorForCompany(companyNo, {
      vendorNo,
      vendorName: `Test Vendor ${vendorNo}`,
      vendorAdd1: `${vendorNo}23 Test St`,
      vendorAdd2: `Suite ${vendorNo}00`,
      vendorAdd3: "Test City",
      vendorAdd4: "Test State",
      vendorZipCode: 12345,
      vendorExtraZip: 6789,
      vendorAlphaSortAbbr: `TV${vendorNo}`,
      vendorAreaCode: 555,
      vendorTelephoneNo: 1000000 + vendorNo,
      vendorLastPaymentAmt: vendorNo * 1000.0,
      vendorLastPaymentDate: 20241201 + (vendorNo - 1001),
      vendorYtdPurchases: vendorNo * 50000.0,
      vendorLastYearPurchases: vendorNo * 45000.0,
      vendorMtdDiscounts: vendorNo * 500.0,
      vendorYtdDiscounts: vendorNo * 2000.0,
      vendorNameOverflow: "",
      vendorGalRcptsRequired: NO,
      vendorFiller: "",
      vendorPreviousBalance: vendorNo * 5000.0,
      vendorMtdPurchases: vendorNo * 10000.0,
      vendorMtdPayments: vendorNo * 8000.0,
      vendorCurrentBalance: vendorNo * 7000.0,
      vendorHoldPaymentsVend: NO,
      vendorSingleCheck: YES,
      vendorThisYrYtdPaid: vendorNo * 40000.0,
      vendorLastYrYtdPaid: vendorNo * 35000.0,
      vendorExpenseGLSub: 5000,
      vendorApTermsCode: 30,
      vendorAp1099Code: NO,
      vendorIdNumber: `${vendorNo}23456789`,
      vendorFirst1099BoxNumber: 0,
      vendorSecond1099BoxNumber: 0,
      vendorSecond1099BoxAmount: 0,
      vendorLastPaymentDateAlt: 20241201 + (vendorNo - 1001),
      vendorCarrierId: `CAR${vendorNo.toString().padStart(3, "0")}`,
      vendorPayeeName1: `Test Vendor ${vendorNo}`,
      vendorPayeeName2: "",
      vendorIrsNameControl: "TEST",
      vendorAdpPayrollId: 0,
      vendorAchClass: "PPD",
      vendorAchCheckingOrSavings: "C",
      vendorAchBankRoutingCode: vendorNo * 123456789,
      vendorAchBankAccountNumber: `${vendorNo}234567890`,
      vendorFirstName: "Test",
      vendorMiddleName: "",
      vendorBusinessLastName: "Vendor",
      vendorNameSuffix: "",
      vendorCountryCode: "US",
      vendorCategoryCode: "SUP",
      vendorFiller2: "",
      vendorIsDeleted: NO,
      ...overrides,
    });
  }

  /**
   * Creates multiple vendors for AP Period End testing
   */
  static createMultipleAPPeriodEndVendors(
    vendorNumbers: number[],
    companyNo: number,
    overrides: Partial<VendorFactoryOptions> = {}
  ): Vendor[] {
    return vendorNumbers.map((vendorNo) =>
      this.createAPPeriodEndVendor(vendorNo, companyNo, overrides)
    );
  }

  /**
   * Creates a vendor for pagination testing in AP Period End
   */
  static createAPPeriodEndVendorForPagination(
    page: number,
    itemIndex: number,
    companyNo: number,
    overrides: Partial<VendorFactoryOptions> = {}
  ): Vendor {
    const vendorNo = 1000 + (page - 1) * 5 + itemIndex + 1;
    return this.createAPPeriodEndVendor(vendorNo, companyNo, overrides);
  }

  /**
   * Creates a vendor contact detail with default values
   */
  static createVendorContactDetail(
    overrides: Partial<VendorContactDetailFactoryOptions> = {}
  ): VendorContactDetailEntity {
    const defaultContact: VendorContactDetailFactoryOptions = {
      deleteCode: "",
      companyNo: 10,
      vendorNo: 100,
      formType: "ABCY",
      sequenceNumber: 232577,
      contactName: "Test Contact",
      emailAddress: "test@example.com",
      faxNumber: "",
      sendAchEmail: YES,
      filler: "",
    };

    return VendorContactDetailEntity.create({
      ...defaultContact,
      ...overrides,
    });
  }

  /**
   * Creates multiple vendor contact details
   */
  static createMultipleVendorContacts(
    count: number,
    overrides: Partial<VendorContactDetailFactoryOptions> = {}
  ): VendorContactDetailEntity[] {
    return Array.from({ length: count }, (_, index) =>
      this.createVendorContactDetail({
        ...overrides,
        sequenceNumber: (overrides.sequenceNumber || 232577) + index,
        contactName: `${overrides.contactName || "Test Contact"} ${index + 1}`,
        emailAddress: `${overrides.contactName || "test"}${index + 1}@example.com`,
      })
    );
  }

  /**
   * Creates an owner vendor mapping with default values
   */
  static createOwnerVendorMapping(
    overrides: Partial<OwnerVendorFactoryOptions> = {}
  ): OwnerVendorEntity {
    const defaultMapping: OwnerVendorFactoryOptions = {
      ownerNo: 1,
      vendorNo: 100,
      isDeleted: "A",
      filler: "",
    };

    return OwnerVendorEntity.create({ ...defaultMapping, ...overrides });
  }

  /**
   * Creates multiple owner vendor mappings
   */
  static createMultipleOwnerVendorMappings(
    count: number,
    overrides: Partial<OwnerVendorFactoryOptions> = {}
  ): OwnerVendorEntity[] {
    return Array.from({ length: count }, (_, index) =>
      this.createOwnerVendorMapping({
        ...overrides,
        ownerNo: (overrides.ownerNo || 1) + index,
        vendorNo: (overrides.vendorNo || 100) + index,
      })
    );
  }

  /**
   * Creates a vendor with contact details
   */
  static createVendorWithContacts(
    vendorOverrides: Partial<VendorFactoryOptions> = {},
    contactOverrides: Partial<VendorContactDetailFactoryOptions> = {},
    contactCount: number = 1
  ): { vendor: Vendor; vendorContactDetails: VendorContactDetailEntity[] } {
    const vendor = this.createBasicVendor(vendorOverrides);
    const contacts = this.createMultipleVendorContacts(contactCount, {
      ...contactOverrides,
      companyNo: vendor.vendorCompanyNumber,
      vendorNo: vendor.vendorNo,
    });

    return { vendor, vendorContactDetails: contacts };
  }

  /**
   * Creates a vendor with owner mappings
   */
  static createVendorWithOwners(
    vendorOverrides: Partial<VendorFactoryOptions> = {},
    ownerOverrides: Partial<OwnerVendorFactoryOptions> = {},
    ownerCount: number = 1
  ): { vendor: Vendor; ownerMappings: OwnerVendorEntity[] } {
    const vendor = this.createBasicVendor(vendorOverrides);
    const owners = this.createMultipleOwnerVendorMappings(ownerCount, {
      ...ownerOverrides,
      vendorNo: vendor.vendorNo,
    });

    return { vendor, ownerMappings: owners };
  }

  /**
   * Creates a complete vendor setup with contacts and owners
   */
  static createCompleteVendorSetup(
    vendorOverrides: Partial<VendorFactoryOptions> = {},
    contactOverrides: Partial<VendorContactDetailFactoryOptions> = {},
    ownerOverrides: Partial<OwnerVendorFactoryOptions> = {},
    contactCount: number = 1,
    ownerCount: number = 1
  ): {
    vendor: Vendor;
    vendorContactDetails: VendorContactDetailEntity[];
    ownerMappings: OwnerVendorEntity[];
  } {
    const vendor = this.createBasicVendor(vendorOverrides);
    const contacts = this.createMultipleVendorContacts(contactCount, {
      ...contactOverrides,
      companyNo: vendor.vendorCompanyNumber,
      vendorNo: vendor.vendorNo,
    });
    const owners = this.createMultipleOwnerVendorMappings(ownerCount, {
      ...ownerOverrides,
      vendorNo: vendor.vendorNo,
    });

    return { vendor, vendorContactDetails: contacts, ownerMappings: owners };
  }

  /**
   * Creates a vendor contact detail DTO for testing
   */
  static createVendorContactDetailDto(
    overrides: Partial<{
      formType: string;
      contactName: string;
      emailAddress: string;
      sendAchEmail: string;
    }> = {}
  ) {
    const defaultContact = {
      formType: "ABCY",
      contactName: "Test Contact",
      emailAddress: "test@example.com",
      sendAchEmail: YES,
    };

    return { ...defaultContact, ...overrides };
  }

  /**
   * Creates multiple vendor contact detail DTOs
   */
  static createMultipleVendorContactDtos(
    count: number,
    overrides: Partial<{
      formType: string;
      contactName: string;
      emailAddress: string;
      sendAchEmail: string;
    }> = {}
  ) {
    return Array.from({ length: count }, (_, index) =>
      this.createVendorContactDetailDto({
        ...overrides,
        contactName: `${overrides.contactName || "Test Contact"} ${index + 1}`,
        emailAddress: `${overrides.contactName || "test"}${index + 1}@example.com`,
      })
    );
  }
}
