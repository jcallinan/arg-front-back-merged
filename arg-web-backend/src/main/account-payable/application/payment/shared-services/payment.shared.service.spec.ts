import { PaymentSharedService } from "./payment.shared.service";
import { PaymentValidationService } from "../validations/payment.validation.service";
import { VoucherHeaderValidationService } from "../../voucher/validations/voucher-header.validation.service";
import {
  FORCED_DISCOUNT_VALUES,
  MakePrepaidFlag,
  PAY_OR_HOLD_CODES,
  PAYMENT_OPERATION_MODE,
  PAYMENT_VOUCHER_TYPES,
  SingleCheckFlag,
  KEY_HOLD_CODES,
} from "@src/shared/constants/payment-constant";
import { SubmitVendorPaymentsDto } from "../dto/payment.dto";
import { HEADER } from "@src/shared/constants/constant";
import { ERROR_MESSAGES } from "@src/shared/constants/error-constant";
import { SubmitPaymentSelectionTypeDto } from "../dto/payment.dto";

describe("PaymentSharedService.vendorPaymentValidation", () => {
  let service: PaymentSharedService;
  let validation: jest.Mocked<PaymentValidationService>;
  let voucherHeaderValidation: jest.Mocked<VoucherHeaderValidationService>;

  const baseDto: SubmitVendorPaymentsDto = {
    companyNo: 10,
    voucherToPay: PAYMENT_VOUCHER_TYPES.CHECK,
    bankAccountGl: 11000001,
    startingCheckNo: 123456,
    checkDate: "080125",
    dateToPayBy: "080225",
    item: {
      entrySequence: "00001",
      vendorNo: 1875,
      voucherNo: 80980,
      partialPayAmount: 1200,
      discountAmount: 50,
      payOrHold: PAY_OR_HOLD_CODES.PAY,
      singleCheck: SingleCheckFlag.SINGLE,
      makePrepaid: MakePrepaidFlag.PREPAID,
      prepaidCheckNo: "000123",
      prepaidDate: "080125",
      forcedDiscount: FORCED_DISCOUNT_VALUES.YES,
      mode: PAYMENT_OPERATION_MODE.SAVE,
    },
  };

  const userId = "CH";
  const baseSelectionDto: SubmitPaymentSelectionTypeDto = {
    companyNo: 10,
    voucherToPay: PAYMENT_VOUCHER_TYPES.CHECK,
    startingCheckNo: 123456,
    checkDate: "080125",
    dateToPayBy: "080225",
    bankAccountGl: 11000001,
    forcedDiscount: FORCED_DISCOUNT_VALUES.YES,
    mode: PAYMENT_OPERATION_MODE.SAVE,
  };

  beforeEach(() => {
    validation = {
      validateCheckDate: jest.fn(),
      validateDateToPayBy: jest.fn(),
      validateStartingCheckNo: jest.fn(),
      validateEntrySequenceFormat: jest.fn(),
      validateVendor: jest.fn(),
      validateEntrySequenceInDB: jest.fn(),
      validateVoucher: jest.fn().mockResolvedValue({
        bankGlNo: 11000001,
        grossAmount: 2000,
        partialPaidToDate: 500,
        holdPaymentFlag: "",
      }),
      validatePartialPay: jest.fn(),
      validateDiscount: jest.fn(),
      validatePayOrHold: jest.fn(),
      validateSingleCheck: jest.fn(),
      validateMakePrepaid: jest.fn(),
      validatePrepaidCheckNo: jest.fn(),
      validateBankGlWithExpectedValue: jest.fn(),
      validateVendorAndVoucher: jest.fn(),
      validateVoucherToPay: jest.fn(),
      validateMakePrepaidBasedOnVoucherToPay: jest.fn(),
      validateVoucherHoldPaymentFlag: jest.fn(),
    } as any;

    voucherHeaderValidation = {
      validateGlNumber: jest.fn(),
    } as any;

    service = new PaymentSharedService(validation, voucherHeaderValidation);
  });

  it("returns success when no validator pushes errors: SAVE mode", async () => {
    const res = await service.vendorPaymentValidation(baseDto, userId);
    expect(res).toEqual({ message: expect.any(String) });

    // Ensure critical validators were called with expected args
    expect(validation.validateCheckDate).toHaveBeenCalledWith(
      baseDto.checkDate,
      expect.any(Array)
    );
    expect(validation.validateDateToPayBy).toHaveBeenCalledWith(
      baseDto.dateToPayBy,
      expect.any(Array)
    );
    expect(voucherHeaderValidation.validateGlNumber).toHaveBeenCalledWith(
      baseDto.companyNo,
      baseDto.bankAccountGl,
      HEADER.BANK_GL,
      ERROR_MESSAGES.INVALID_BANK_GL,
      expect.any(Array)
    );
    expect(validation.validateVoucher).toHaveBeenCalledWith(
      baseDto.item.voucherNo,
      baseDto.companyNo,
      baseDto.item.vendorNo,
      expect.any(Array)
    );
    expect(validation.validateBankGlWithExpectedValue).toHaveBeenCalledWith(
      baseDto.item.voucherNo,
      baseDto.bankAccountGl,
      expect.any(Object),
      expect.any(Array)
    );
    expect(validation.validateVoucherHoldPaymentFlag).toHaveBeenCalledWith(
      baseDto.item.voucherNo,
      KEY_HOLD_CODES[baseDto.voucherToPay],
      expect.any(Object),
      expect.any(Array)
    );
    // For SAVE mode, entry sequence is auto-generated, so no validation
    expect(validation.validateEntrySequenceInDB).not.toHaveBeenCalled();
  });

  it("calls validateEntrySequenceInDB in EDIT mode", async () => {
    const dto = {
      ...baseDto,
      item: { ...baseDto.item, mode: PAYMENT_OPERATION_MODE.EDIT },
    };
    await service.vendorPaymentValidation(dto, userId);

    expect(validation.validateEntrySequenceInDB).toHaveBeenCalledWith(
      dto.item.entrySequence,
      userId,
      expect.any(Array)
    );
  });
  
  it("calls entry sequence DB validation when mode = EDIT", async () => {
    const dto = {
      ...baseDto,
      item: { ...baseDto.item, mode: PAYMENT_OPERATION_MODE.EDIT },
    };
  
    await service.vendorPaymentValidation(dto, userId);
  
    expect(validation.validateEntrySequenceInDB).toHaveBeenCalledWith(
      dto.item.entrySequence,
      userId,
      expect.any(Array)
    );
  });
  

  it("returns aggregated errors when validators push errors", async () => {
    validation.validateCheckDate.mockImplementation((_, errors) => {
      errors.push({
        field: "checkDate",
        code: "checkDate",
        message: "Invalid",
      });
    });
    voucherHeaderValidation.validateGlNumber.mockImplementation(
      async (_, __, ___, ____, errors) => {
        errors.push({
          field: "bankAccountGl",
          code: "bankAccountGl",
          message: "Invalid bank GL",
        });
      }
    );

    const result = await service.vendorPaymentValidation(baseDto, userId);
    expect(Array.isArray(result)).toBe(true);
    const errors = result as any[];
    expect(errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: "checkDate" }),
        expect.objectContaining({ field: "bankAccountGl" }),
      ])
    );
  });

  describe("paymentTypeValidation (CHECK)", () => {
    it("returns success when no errors are added", async () => {
      const res = await service.paymentTypeValidation(baseSelectionDto);
      expect(res).toEqual({ message: expect.any(String) });

      expect(validation.validateCheckDate).toHaveBeenCalledWith(
        baseSelectionDto.checkDate,
        expect.any(Array)
      );
      expect(validation.validateDateToPayBy).toHaveBeenCalledWith(
        baseSelectionDto.dateToPayBy,
        expect.any(Array)
      );
      expect(validation.validateStartingCheckNo).toHaveBeenCalledWith(
        baseSelectionDto.startingCheckNo,
        expect.any(Array)
      );
      expect(voucherHeaderValidation.validateGlNumber).toHaveBeenCalledWith(
        baseSelectionDto.companyNo,
        baseSelectionDto.bankAccountGl,
        HEADER.BANK_GL,
        ERROR_MESSAGES.INVALID_BANK_GL,
        expect.any(Array)
      );
    });

    it("returns aggregated errors when validators push errors", async () => {
      validation.validateCheckDate.mockImplementation((_, errors) => {
        errors.push({
          field: "checkDate",
          code: "checkDate",
          message: "Invalid",
        });
      });
      voucherHeaderValidation.validateGlNumber.mockImplementation(
        async (_, __, ___, ____, errors) => {
          errors.push({
            field: "bankAccountGl",
            code: "bankAccountGl",
            message: "Invalid bank GL",
          });
        }
      );

      const result = await service.paymentTypeValidation(baseSelectionDto);
      expect(Array.isArray(result)).toBe(true);
      const errors = result as any[];
      expect(errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: "checkDate" }),
          expect.objectContaining({ field: "bankAccountGl" }),
        ])
      );
    });
  });

  it("passes kyhold '' (CHECK) to dependent validators (vendorPaymentValidation)", async () => {
    const dto = { ...baseDto, voucherToPay: PAYMENT_VOUCHER_TYPES.CHECK };
    await service.vendorPaymentValidation(dto, userId);

    const kyhold = KEY_HOLD_CODES[dto.voucherToPay]; // '' for CHECK
    expect(kyhold).toBe("");
    expect(validation.validateMakePrepaid).toHaveBeenCalledWith(
      kyhold,
      dto.item.makePrepaid,
      expect.any(Array)
    );
    expect(validation.validateVoucherToPay).toHaveBeenCalledWith(
      kyhold,
      expect.any(Array)
    );
    expect(
      validation.validateMakePrepaidBasedOnVoucherToPay
    ).toHaveBeenCalledWith(kyhold, dto.item.makePrepaid, expect.any(Array));
    expect(validation.validateVoucherHoldPaymentFlag).toHaveBeenCalledWith(
      dto.item.voucherNo,
      kyhold,
      expect.any(Object),
      expect.any(Array)
    );
  });
});
