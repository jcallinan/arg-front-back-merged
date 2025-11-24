import { SubmitPaymentTypeUseCase } from "./submit-payment-type.usecase";
import { PaymentSharedService } from "../../shared-services/payment.shared.service";
import {
  FORCED_DISCOUNT_VALUES,
  PAYMENT_OPERATION_MODE,
  PAYMENT_STORE_PROCEDURE,
  PAYMENT_VOUCHER_TYPES,
} from "@src/shared/constants/payment-constant";
import { SubmitPaymentSelectionTypeDto } from "../../dto/payment.dto";
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

describe("SubmitPaymentTypeUseCase", () => {
  let usecase: SubmitPaymentTypeUseCase;
  let paymentSharedService: jest.Mocked<PaymentSharedService>;

  const baseDto: SubmitPaymentSelectionTypeDto = {
    companyNo: 10,
    voucherToPay: PAYMENT_VOUCHER_TYPES.CHECK,
    startingCheckNo: 123456,
    checkDate: "080125",
    dateToPayBy: "080225",
    bankAccountGl: 12010001,
    forcedDiscount: FORCED_DISCOUNT_VALUES.YES,
    mode: PAYMENT_OPERATION_MODE.SAVE,
  };

  beforeEach(() => {
    paymentSharedService = {
      paymentTypeValidation: jest.fn().mockResolvedValue([]),
      vendorPaymentValidation: jest.fn(),
    } as any;

    usecase = new SubmitPaymentTypeUseCase(paymentSharedService);
    (callSP as jest.Mock).mockReset();
  });

  it("should throw HttpException when validation returns errors", async () => {
    paymentSharedService.paymentTypeValidation.mockResolvedValueOnce([
      { field: "checkDate", code: "checkDate", message: "Invalid" },
    ]);

    await expect(usecase.execute(baseDto)).rejects.toBeInstanceOf(
      HttpException
    );
  });

  it("should call AP150ACLPRC and APPYTRHCLPRC for CHECK when mode is SAVE", async () => {
    const ap150Spy = jest.fn().mockResolvedValue({ errVar: "ok1" });
    const appytrhSpy = jest.fn().mockResolvedValue({ errVar: "ok2" });

    (callSP as jest.Mock)
      .mockReturnValueOnce({ execute: () => ap150Spy({ userId: "CH" }) })
      .mockReturnValueOnce({
        execute: (params: any) => appytrhSpy(params),
      });

    const res = await usecase.execute({
      ...baseDto,
      mode: PAYMENT_OPERATION_MODE.SAVE,
    });

    expect(callSP).toHaveBeenNthCalledWith(
      1,
      PAYMENT_STORE_PROCEDURE.AP150ACLPRC
    );
    expect(callSP).toHaveBeenNthCalledWith(
      2,
      PAYMENT_STORE_PROCEDURE.APPYTRHCLPRC
    );
    expect(res.results).toEqual([
      {
        mode: PAYMENT_OPERATION_MODE.SAVE,
        spName: PAYMENT_STORE_PROCEDURE.AP150ACLPRC,
        output: { errVar: "ok1" },
      },
      {
        mode: PAYMENT_OPERATION_MODE.SAVE,
        spName: PAYMENT_STORE_PROCEDURE.APPYTRHCLPRC,
        output: { errVar: "ok2" },
      },
    ]);
  });

  it("should call AP150ACLPRC and APPYTRHCLPRC for CHECK when mode is EDIT", async () => {
    const ap150Spy = jest.fn().mockResolvedValue({ errVar: "ok1" });
    const appytrhSpy = jest.fn().mockResolvedValue({ errVar: "ok2" });

    (callSP as jest.Mock)
      .mockReturnValueOnce({ execute: () => ap150Spy({ userId: "CH" }) })
      .mockReturnValueOnce({
        execute: (params: any) => appytrhSpy(params),
      });

    const res = await usecase.execute({
      ...baseDto,
      mode: PAYMENT_OPERATION_MODE.EDIT,
    });

    expect(ap150Spy).toHaveBeenCalledWith({ userId: "CH" });
    expect(callSP).toHaveBeenNthCalledWith(
      1,
      PAYMENT_STORE_PROCEDURE.AP150ACLPRC
    );
    expect(callSP).toHaveBeenNthCalledWith(
      2,
      PAYMENT_STORE_PROCEDURE.APPYTRHCLPRC
    );

    expect(res.results).toEqual([
      {
        mode: PAYMENT_OPERATION_MODE.EDIT,
        spName: PAYMENT_STORE_PROCEDURE.AP150ACLPRC,
        output: { errVar: "ok1" },
      },
      {
        mode: PAYMENT_OPERATION_MODE.EDIT,
        spName: PAYMENT_STORE_PROCEDURE.APPYTRHCLPRC,
        output: { errVar: "ok2" },
      },
    ]);
  });

  it("should call AP150ACLPRC and APPYTRHCLPRC for ACH when mode is SAVE", async () => {
    const ap150Spy = jest.fn().mockResolvedValue({ errVar: "ok1" });
    const appytrhSpy = jest.fn().mockResolvedValue({ errVar: "ok2" });

    (callSP as jest.Mock)
      .mockReturnValueOnce({ execute: () => ap150Spy({ userId: "CH" }) })
      .mockReturnValueOnce({
        execute: (params: any) => appytrhSpy(params),
      });

    baseDto.voucherToPay = PAYMENT_VOUCHER_TYPES.ACH;

    const res = await usecase.execute({
      ...baseDto,
      mode: PAYMENT_OPERATION_MODE.SAVE,
    });

    expect(callSP).toHaveBeenNthCalledWith(
      1,
      PAYMENT_STORE_PROCEDURE.AP150ACLPRC
    );
    expect(callSP).toHaveBeenNthCalledWith(
      2,
      PAYMENT_STORE_PROCEDURE.APPYTRHCLPRC
    );
    expect(res.results).toEqual([
      {
        mode: PAYMENT_OPERATION_MODE.SAVE,
        spName: PAYMENT_STORE_PROCEDURE.AP150ACLPRC,
        output: { errVar: "ok1" },
      },
      {
        mode: PAYMENT_OPERATION_MODE.SAVE,
        spName: PAYMENT_STORE_PROCEDURE.APPYTRHCLPRC,
        output: { errVar: "ok2" },
      },
    ]);
  });

  it("should call AP150ACLPRC and APPYTRHCLPRC for ACH when mode is EDIT", async () => {
    const ap150Spy = jest.fn().mockResolvedValue({ errVar: "ok1" });
    const appytrhSpy = jest.fn().mockResolvedValue({ errVar: "ok2" });

    (callSP as jest.Mock)
      .mockReturnValueOnce({ execute: () => ap150Spy({ userId: "CH" }) })
      .mockReturnValueOnce({
        execute: (params: any) => appytrhSpy(params),
      });

    baseDto.voucherToPay = PAYMENT_VOUCHER_TYPES.ACH;

    const res = await usecase.execute({
      ...baseDto,
      mode: PAYMENT_OPERATION_MODE.EDIT,
    });

    expect(ap150Spy).toHaveBeenCalledWith({ userId: "CH" });
    expect(callSP).toHaveBeenNthCalledWith(
      1,
      PAYMENT_STORE_PROCEDURE.AP150ACLPRC
    );
    expect(callSP).toHaveBeenNthCalledWith(
      2,
      PAYMENT_STORE_PROCEDURE.APPYTRHCLPRC
    );

    expect(res.results).toEqual([
      {
        mode: PAYMENT_OPERATION_MODE.EDIT,
        spName: PAYMENT_STORE_PROCEDURE.AP150ACLPRC,
        output: { errVar: "ok1" },
      },
      {
        mode: PAYMENT_OPERATION_MODE.EDIT,
        spName: PAYMENT_STORE_PROCEDURE.APPYTRHCLPRC,
        output: { errVar: "ok2" },
      },
    ]);
  });

  it("should call AP150ACLPRC and APPYTRHCLPRC for WIRE when mode is SAVE", async () => {
    const ap150Spy = jest.fn().mockResolvedValue({ errVar: "ok1" });
    const appytrhSpy = jest.fn().mockResolvedValue({ errVar: "ok2" });

    (callSP as jest.Mock)
      .mockReturnValueOnce({ execute: () => ap150Spy({ userId: "CH" }) })
      .mockReturnValueOnce({
        execute: (params: any) => appytrhSpy(params),
      });

    baseDto.voucherToPay = PAYMENT_VOUCHER_TYPES.WIRE;

    const res = await usecase.execute({
      ...baseDto,
      mode: PAYMENT_OPERATION_MODE.SAVE,
    });

    expect(callSP).toHaveBeenNthCalledWith(
      1,
      PAYMENT_STORE_PROCEDURE.AP150ACLPRC
    );
    expect(callSP).toHaveBeenNthCalledWith(
      2,
      PAYMENT_STORE_PROCEDURE.APPYTRHCLPRC
    );
    expect(res.results).toEqual([
      {
        mode: PAYMENT_OPERATION_MODE.SAVE,
        spName: PAYMENT_STORE_PROCEDURE.AP150ACLPRC,
        output: { errVar: "ok1" },
      },
      {
        mode: PAYMENT_OPERATION_MODE.SAVE,
        spName: PAYMENT_STORE_PROCEDURE.APPYTRHCLPRC,
        output: { errVar: "ok2" },
      },
    ]);
  });

  it("should call AP150ACLPRC and APPYTRHCLPRC for WIRE when mode is EDIT", async () => {
    const ap150Spy = jest.fn().mockResolvedValue({ errVar: "ok1" });
    const appytrhSpy = jest.fn().mockResolvedValue({ errVar: "ok2" });

    (callSP as jest.Mock)
      .mockReturnValueOnce({ execute: () => ap150Spy({ userId: "CH" }) })
      .mockReturnValueOnce({
        execute: (params: any) => appytrhSpy(params),
      });

    baseDto.voucherToPay = PAYMENT_VOUCHER_TYPES.WIRE;

    const res = await usecase.execute({
      ...baseDto,
      mode: PAYMENT_OPERATION_MODE.EDIT,
    });

    expect(ap150Spy).toHaveBeenCalledWith({ userId: "CH" });
    expect(callSP).toHaveBeenNthCalledWith(
      1,
      PAYMENT_STORE_PROCEDURE.AP150ACLPRC
    );
    expect(callSP).toHaveBeenNthCalledWith(
      2,
      PAYMENT_STORE_PROCEDURE.APPYTRHCLPRC
    );

    expect(res.results).toEqual([
      {
        mode: PAYMENT_OPERATION_MODE.EDIT,
        spName: PAYMENT_STORE_PROCEDURE.AP150ACLPRC,
        output: { errVar: "ok1" },
      },
      {
        mode: PAYMENT_OPERATION_MODE.EDIT,
        spName: PAYMENT_STORE_PROCEDURE.APPYTRHCLPRC,
        output: { errVar: "ok2" },
      },
    ]);
  });

  it("should throw for unsupported voucher type", async () => {
    const dto = { ...baseDto, voucherToPay: "Unknown" as any };
    await expect(usecase["callStoredProcedure"](dto)).rejects.toThrow(
      "Unsupported voucher type"
    );
  });
});
