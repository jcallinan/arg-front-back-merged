import { SubmitPaymentVendorUseCase } from "./submit-payment-vendor.usecase";
import { PaymentSharedService } from "../../shared-services/payment.shared.service";
import {
  FORCED_DISCOUNT_VALUES,
  MakePrepaidFlag,
  PAY_OR_HOLD_CODES,
  PAYMENT_OPERATION_MODE,
  PAYMENT_STORE_PROCEDURE,
  PAYMENT_VOUCHER_TYPES,
  SingleCheckFlag,
} from "@src/shared/constants/payment-constant";
import { SubmitVendorPaymentsDto } from "../../dto/payment.dto";
import { callSP } from "@src/shared/config/store-procedure-config";
import { HttpException } from "@nestjs/common";

jest.mock("@src/shared/config/store-procedure-config", () => {
  const actual = jest.requireActual(
    "@src/shared/config/store-procedure-config"
  );
  return {
    ...actual,
    callSP: jest.fn(),
  };
});

describe("SubmitPaymentVendorUseCase", () => {
  let usecase: SubmitPaymentVendorUseCase;
  let paymentSharedService: jest.Mocked<PaymentSharedService>;

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

  beforeEach(() => {
    paymentSharedService = {
      paymentTypeValidation: jest.fn(),
      vendorPaymentValidation: jest.fn().mockResolvedValue([]),
    } as any;
    usecase = new SubmitPaymentVendorUseCase(paymentSharedService);
    (callSP as jest.Mock).mockReset();
  });

  it("should throw HttpException when validation returns errors", async () => {
    paymentSharedService.vendorPaymentValidation.mockResolvedValueOnce([
      { field: "vendorNo", code: "vendorNo", message: "Invalid" },
    ]);
    await expect(usecase.execute(baseDto)).rejects.toBeInstanceOf(
      HttpException
    );
  });

  it("should call APPYTRDCLPRC for CHECK when mode is SAVE", async () => {
    const appytrdSpy = jest.fn().mockResolvedValue({ errVar: "ok" });
    (callSP as jest.Mock).mockReturnValueOnce({
      execute: (params: any) => appytrdSpy(params),
    });

    const res = await usecase.execute(baseDto);

    expect(callSP).toHaveBeenCalledWith(PAYMENT_STORE_PROCEDURE.APPYTRDCLPRC);
    expect(res.results).toEqual([
      {
        mode: PAYMENT_OPERATION_MODE.SAVE,
        spName: PAYMENT_STORE_PROCEDURE.APPYTRDCLPRC,
        output: { errVar: "ok" },
      },
    ]);
  });

  it("should throw for unsupported voucher type", async () => {
    const dto = { ...baseDto, voucherToPay: "Unknown" as any };
    await expect(usecase["callStoredProcedure"](dto, "CH")).rejects.toThrow(
      "Unsupported voucher type"
    );
  });

  it("should call APPYTRDCLPRC for CHECK when mode is EDIT", async () => {
    const appytrdSpy = jest.fn().mockResolvedValue({ errVar: "ok-edit" });
    (callSP as jest.Mock).mockReturnValueOnce({
      execute: (params: any) => appytrdSpy(params),
    });

    const res = await usecase.execute({
      ...baseDto,
      item: { ...baseDto.item, mode: PAYMENT_OPERATION_MODE.EDIT },
    });

    expect(callSP).toHaveBeenCalledWith(PAYMENT_STORE_PROCEDURE.APPYTRDCLPRC);
    expect(res.results).toEqual([
      {
        mode: PAYMENT_OPERATION_MODE.EDIT,
        spName: PAYMENT_STORE_PROCEDURE.APPYTRDCLPRC,
        output: { errVar: "ok-edit" },
      },
    ]);
  });
});
