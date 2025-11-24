import { PaymentValidationService } from "./payment.validation.service";
import { VoucherHeaderValidationService } from "../../voucher/validations/voucher-header.validation.service";
import { VendorAppService } from "@src/main/account-payable/domain/services/vendor/vendor.service";
import { VoucherMaintenanceInterface } from "@src/main/account-payable/domain/interface/voucher-maintenance.interface";
import { GapptUserInterface } from "@src/main/account-payable/domain/interface/gappt-user.interface";
import {
  PAYMENT_TYPE_VALIDATION_FIELDS,
  MakePrepaidFlag,
  PAYMENT_VOUCHER_TYPES,
  KEY_HOLD_CODES,
} from "@src/shared/constants/payment-constant";
import { HEADER } from "@src/shared/constants/constant";
import { ERROR_MESSAGES } from "@src/shared/constants/error-constant";

describe("PaymentValidationService", () => {
  let service: PaymentValidationService;
  let voucherHeaderValidationService: jest.Mocked<VoucherHeaderValidationService>;
  let vendorAppService: jest.Mocked<VendorAppService>;
  let voucherMaintenanceRepository: jest.Mocked<VoucherMaintenanceInterface>;
  let gapptUserRepository: jest.Mocked<GapptUserInterface>;
  let userId = "CH";

  beforeEach(() => {
    voucherHeaderValidationService = {
      validateGlNumber: jest.fn().mockResolvedValue(undefined),
    } as any;
    vendorAppService = {
      findVendorByNo: jest.fn(),
    } as any;
    voucherMaintenanceRepository = {
      findVoucherView: jest.fn(),
    } as any;
    gapptUserRepository = {
      findByEntrySequence: jest.fn(),
    } as any;

    service = new PaymentValidationService(
      voucherHeaderValidationService,
      vendorAppService,
      voucherMaintenanceRepository,
      gapptUserRepository
    );
  });

  it("addNewError duplicates by field", () => {
    const errors: any[] = [];
    service.addNewError(errors, "checkDate", "x");
    service.addNewError(errors, "checkDate", "y");
    expect(errors.length).toBe(1);
  });

  it("validateCheckDate adds error for invalid date", () => {
    const errors: any[] = [];
    service.validateCheckDate("invalid", errors);
    expect(errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: PAYMENT_TYPE_VALIDATION_FIELDS.CHECK_DATE,
        }),
      ])
    );
  });

  it("validateDateToPayBy adds error for invalid date", () => {
    const errors: any[] = [];
    service.validateDateToPayBy("bad", errors);
    expect(errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: PAYMENT_TYPE_VALIDATION_FIELDS.DATE_TO_PAY_BY,
        }),
      ])
    );
  });

  it("validateStartingCheckNo enforces zero and 6-digit rules", () => {
    const e1: any[] = [];
    service.validateStartingCheckNo(0, e1);
    expect(e1).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: ERROR_MESSAGES.CHECK_NO_CANNOT_BE_ZERO,
        }),
      ])
    );

    const e2: any[] = [];
    service.validateStartingCheckNo(1234, e2);
    expect(e2).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: ERROR_MESSAGES.CHECK_NO_MUST_BE_6_DIGITS,
        }),
      ])
    );
  });

  it("validateBankGl calls voucher header validation with proper constants", async () => {
    const errors: any[] = [];
    await service.validateBankGl(10, 11000001, errors);
    expect(
      voucherHeaderValidationService.validateGlNumber
    ).toHaveBeenCalledWith(
      10,
      11000001,
      HEADER.BANK_GL,
      ERROR_MESSAGES.INVALID_BANK_GL,
      errors
    );
  });

  describe("validateEntrySequenceFormat", () => {
    it("adds required error when empty", () => {
      const errors: any[] = [];
      service.validateEntrySequenceFormat("", errors);
      expect(errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: ERROR_MESSAGES.ENTRY_SEQUENCE_IS_REQUIRED,
          }),
        ])
      );
    });

    it("adds cannot be zero for '00000' and length error for non-5 length", () => {
      const e1: any[] = [];
      service.validateEntrySequenceFormat("00000", e1);
      expect(e1).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: ERROR_MESSAGES.ENTRY_SEQUENCE_CANNOT_BE_ZERO,
          }),
        ])
      );

      const e2: any[] = [];
      service.validateEntrySequenceFormat("12", e2);
      expect(e2).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: ERROR_MESSAGES.ENTRY_SEQUENCE_MUST_BE_5_CHARACTERS,
          }),
        ])
      );
    });
  });

  describe("validateEntrySequenceInDB", () => {
    it("skips DB check when errors already present", async () => {
      const errors: any[] = [
        { field: "entrySequence", message: "x", code: "entrySequence" },
      ];
      await service.validateEntrySequenceInDB("00001", userId, errors);
      expect(gapptUserRepository.findByEntrySequence).not.toHaveBeenCalled();
    });

    it("adds not found error when no record", async () => {
      gapptUserRepository.findByEntrySequence.mockResolvedValueOnce(null as any);
      const errors: any[] = [];
      await service.validateEntrySequenceInDB("00001", userId, errors);
      expect(errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: ERROR_MESSAGES.ENTRY_SEQUENCE_NOT_FOUND,
          }),
        ])
      );
    });

    it("adds marked deleted when status > 'D'", async () => {
      gapptUserRepository.findByEntrySequence.mockResolvedValueOnce({
        status: "E",
      } as any);
      const errors: any[] = [];
      await service.validateEntrySequenceInDB("00001", userId, errors);
      expect(errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: ERROR_MESSAGES.ENTRY_SEQUENCE_MARKED_DELETED,
          }),
        ])
      );
    });

    it("no error when record exists with acceptable status", async () => {
      gapptUserRepository.findByEntrySequence.mockResolvedValueOnce({
        status: "B",
      } as any);
      const errors: any[] = [];
      await service.validateEntrySequenceInDB("00001", userId, errors);
      expect(errors.length).toBe(0);
    });

    it("adds validation failed on repository error", async () => {
      gapptUserRepository.findByEntrySequence.mockRejectedValueOnce(
        new Error("db down")
      );
      const errors: any[] = [];
      await service.validateEntrySequenceInDB("00001", userId, errors);
      expect(errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: ERROR_MESSAGES.ENTRY_SEQUENCE_VALIDATION_FAILED,
          }),
        ])
      );
    });
  });

  describe("validateVendor", () => {
    it("adds required when null and cannot be zero when 0", async () => {
      const e1: any[] = [];
      await service.validateVendor(null as any, 10, e1);
      expect(e1).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: ERROR_MESSAGES.VENDOR_IS_REQUIRED,
          }),
        ])
      );

      const e2: any[] = [];
      await service.validateVendor(0, 10, e2);
      expect(e2).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: ERROR_MESSAGES.VENDOR_CANNOT_BE_ZERO,
          }),
        ])
      );
    });

    it("adds invalid vendor when not found; no error when found", async () => {
      vendorAppService.findVendorByNo.mockResolvedValueOnce(null as any);
      const e1: any[] = [];
      await service.validateVendor(123, 10, e1);
      expect(e1).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: ERROR_MESSAGES.INVALID_VENDOR_NO,
          }),
        ])
      );

      vendorAppService.findVendorByNo.mockResolvedValueOnce({ id: 1 } as any);
      const e2: any[] = [];
      await service.validateVendor(123, 10, e2);
      expect(e2.length).toBe(0);
    });
  });

  describe("validateVoucher", () => {
    it("adds required/zero/length errors appropriately", async () => {

      const e2: any[] = [];
      await service.validateVoucher(0, 10, 1, e2);
      expect(e2).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: ERROR_MESSAGES.VOUCHER_NO_CANNOT_BE_ZERO,
          }),
        ])
      );
    });

    it("adds not open or vendor mismatch errors and returns headerItems", async () => {
      // Not open
      voucherMaintenanceRepository.findVoucherView.mockResolvedValueOnce({
        headerItems: undefined,
      } as any);
      const e1: any[] = [];
      await service.validateVoucher(12345, 10, 1, e1);
      expect(e1).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: ERROR_MESSAGES.VOUCHER_IS_NOT_OPEN,
          }),
        ])
      );

      // Mismatch
      voucherMaintenanceRepository.findVoucherView.mockResolvedValueOnce({
        headerItems: { companyNo: 99, vendorNo: 2, bankGlNo: 11000001 },
      } as any);
      const e2: any[] = [];
      await service.validateVoucher(12345, 10, 1, e2);
      expect(e2).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: ERROR_MESSAGES.VENDOR_HAS_NO_OPEN_VOUCHERS,
          }),
        ])
      );

      // Returns header
      voucherMaintenanceRepository.findVoucherView.mockResolvedValueOnce({
        headerItems: { companyNo: 10, vendorNo: 1, bankGlNo: 11000001 },
      } as any);
      const e3: any[] = [];
      const header = await service.validateVoucher(12345, 10, 1, e3);
      expect(header).toEqual({
        companyNo: 10,
        vendorNo: 1,
        bankGlNo: 11000001,
      });
      expect(e3.length).toBe(0);
    });
  });

  describe("amount-related validators", () => {
    it("validatePartialPay errors on zero and over remaining; ok when within remaining", () => {
      const e1: any[] = [];
      service.validatePartialPay(
        0,
        { grossAmount: 1000, partialPaidToDate: 0 },
        e1
      );
      expect(e1).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: ERROR_MESSAGES.PARTIAL_PAY_AMOUNT_CANNOT_BE_ZERO,
          }),
        ])
      );

      const e2: any[] = [];
      service.validatePartialPay(
        200,
        { grossAmount: 1000, partialPaidToDate: 900 },
        e2
      );
      expect(e2).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: "partialPayAmount" }),
        ])
      );

      const e3: any[] = [];
      service.validatePartialPay(
        400,
        { grossAmount: 1000, partialPaidToDate: 500 },
        e3
      );
      expect(e3.length).toBe(0);
    });

    it("validateDiscount handles 0, not open, and too large", () => {
      const e1: any[] = [];
      service.validateDiscount(
        0,
        12345,
        { grossAmount: 1000, partialPaidToDate: 0 },
        e1
      );
      expect(e1).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: ERROR_MESSAGES.DISCOUNT_AMOUNT_REQUIRED,
          }),
        ])
      );

      const e2: any[] = [];
      service.validateDiscount(10, 12345, null as any, e2);
      expect(e2).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: ERROR_MESSAGES.VOUCHER_IS_NOT_OPEN,
          }),
        ])
      );

      const e3: any[] = [];
      service.validateDiscount(
        600,
        12345,
        { grossAmount: 1000, partialPaidToDate: 500 },
        e3
      );
      expect(e3).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: ERROR_MESSAGES.INVALID_DISCOUNT_AMOUNT,
          }),
        ])
      );
    });
  });

  describe("flag validations", () => {
    it("validatePayOrHold errors on invalid", () => {
      const e: any[] = [];
      service.validatePayOrHold("X" as any, e);
      expect(e).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: ERROR_MESSAGES.INVALID_PAY_OR_HOLD,
          }),
        ])
      );
    });

    it("validateSingleCheck errors when not 'S'", () => {
      const e: any[] = [];
      service.validateSingleCheck("X" as any, e);
      expect(e).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: ERROR_MESSAGES.SINGLE_CHECK_MUST_BE_S,
          }),
        ])
      );
    });

    it("validateMakePrepaid requires 'P' when kyhold is blank; ok when P", () => {
      const e1: any[] = [];
      service.validateMakePrepaid("", MakePrepaidFlag.ADVANCE, e1);
      expect(e1).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: ERROR_MESSAGES.MAKE_PREPAID_MUST_BE_P,
          }),
        ])
      );

      const e2: any[] = [];
      service.validateMakePrepaid("", MakePrepaidFlag.PREPAID, e2);
      expect(e2.length).toBe(0);
    });
  });

  describe("validatePrepaidCheckNo", () => {
    it("requires prepaid check no and valid date when makePrepaid set", () => {
      const e1: any[] = [];
      service.validatePrepaidCheckNo(MakePrepaidFlag.PREPAID, "", "080125", e1);
      expect(e1).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: ERROR_MESSAGES.PREPAID_CHECK_NO_MISSING,
          }),
        ])
      );

      const e2: any[] = [];
      service.validatePrepaidCheckNo(
        MakePrepaidFlag.PREPAID,
        "000123",
        "invalid",
        e2
      );
      expect(e2).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: ERROR_MESSAGES.INVALID_PPD_CHECK_DATE,
          }),
        ])
      );
    });

    it("requires blank date when makePrepaid is blank", () => {
      const e: any[] = [];
      service.validatePrepaidCheckNo("", "000123", "080125", e);
      expect(e).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: ERROR_MESSAGES.PPD_CHECK_DATE_MUST_BE_ZERO,
          }),
        ])
      );
    });
  });

  it("validateBankGlWithExpectedValue errors on mismatch", () => {
    const e: any[] = [];
    service.validateBankGlWithExpectedValue(
      12345,
      11000002,
      { bankGlNo: 11000001 },
      e
    );
    expect(e).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: "bankAccountGl" }),
      ])
    );
    expect(e[0].message).toContain("11000001");
  });

  it("validateVendorAndVoucher adds both errors when both are zero", () => {
    const e: any[] = [];
    service.validateVendorAndVoucher(0, 0, e);
    expect(e).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: ERROR_MESSAGES.A_VOUCHER_MUST_BE_KEYED,
        }),
        expect.objectContaining({
          message: ERROR_MESSAGES.TO_SELECT_A_ONE_TIME_VENDOR,
        }),
      ])
    );
  });

  it("validateVoucherToPay errors on invalid kyhold", () => {
    const e: any[] = [];
    service.validateVoucherToPay("X", e);
    expect(e).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: ERROR_MESSAGES.VOUCHER_TO_PAY_MUST_BE_A_W_E_U,
        }),
      ])
    );
  });

  it("validateMakePrepaidBasedOnVoucherToPay errors when makePrepaid mismatches required", () => {
    const e: any[] = [];
    const kyhold = KEY_HOLD_CODES[PAYMENT_VOUCHER_TYPES.ACH];
    service.validateMakePrepaidBasedOnVoucherToPay(
      kyhold,
      MakePrepaidFlag.PREPAID,
      e
    );
    expect(e).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: "makePrepaid" }),
      ])
    );
  });

  describe("validateVoucherHoldPaymentFlag", () => {
    it("errors when kyhold blank and voucher has restricted hold flag", () => {
      const e: any[] = [];
      service.validateVoucherHoldPaymentFlag(
        12345,
        "",
        { holdPaymentFlag: KEY_HOLD_CODES[PAYMENT_VOUCHER_TYPES.ACH] },
        e
      );
      expect(e).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: ERROR_MESSAGES.CANNOT_PAY_THIS_VOUCHER_NOW,
          }),
        ])
      );
    });

    it("errors when kyhold non-blank and does not match voucher flag; ok when matches", () => {
      const kyhold = KEY_HOLD_CODES[PAYMENT_VOUCHER_TYPES.ACH];

      const e1: any[] = [];
      service.validateVoucherHoldPaymentFlag(
        12345,
        kyhold,
        { holdPaymentFlag: KEY_HOLD_CODES[PAYMENT_VOUCHER_TYPES.WIRE] },
        e1
      );
      expect(e1).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: ERROR_MESSAGES.CANNOT_PAY_THIS_VOUCHER_NOW,
          }),
        ])
      );

      const e2: any[] = [];
      service.validateVoucherHoldPaymentFlag(
        12345,
        kyhold,
        { holdPaymentFlag: kyhold },
        e2
      );
      expect(e2.length).toBe(0);
    });
  });
});
