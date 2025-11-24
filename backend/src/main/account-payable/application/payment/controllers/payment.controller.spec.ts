import { PaymentController } from "./payment.controller";
import { PaymentTypesUseCase } from "../usecases/payment-types/payment-types.usecase";
import { SubmitPaymentTypeUseCase } from "../usecases/payment-selection/submit-payment-type.usecase";
import { SubmitPaymentVendorUseCase } from "../usecases/payment-vendor/submit-payment-vendor.usecase";
import { DropdownOption } from "@src/shared/utils/response-formatter";
import {
  FORCED_DISCOUNT_VALUES,
  MakePrepaidFlag,
  PAY_OR_HOLD_CODES,
  SingleCheckFlag,
  PAYMENT_OPERATION_MODE,
  PAYMENT_STORE_PROCEDURE,
  PAYMENT_VOUCHER_TYPE_DROPDOWN,
  PAYMENT_VOUCHER_TYPES,
} from "@src/shared/constants/payment-constant";
import {
  SubmitPaymentSelectionTypeDto,
  SubmitVendorPaymentsDto,
  GetCashRequirementReportDto,
} from "../dto/payment.dto";
import { HttpException, HttpStatus } from "@nestjs/common";
import { ERROR_MESSAGES } from "@src/shared/constants/error-constant";
import { CashRequirementReportsUsecase } from "../usecases/cash-requirement/cash-requirement-reports.usecase";
import { SpooledMetaDataReportEntity } from "@src/main/account-payable/domain/entities/spooled-meta-data-report.entity";
import { PaginatedResponse } from "@src/shared/utils/response-formatter";
import { PAYMENT_REPORT_TYPES } from "@src/shared/constants/constant";
import { ApCheckReportsUsecase } from "../usecases/ap-check/ap-check-reports.usecase";
import { PaymentFactory } from "@src/shared/tests";

describe("PaymentController", () => {
  let controller: PaymentController;
  let getVoucherPaymentTypes: PaymentTypesUseCase;
  let submitPaymentTypeUseCase: SubmitPaymentTypeUseCase;
  let submitPaymentVendorUseCase: SubmitPaymentVendorUseCase;
  let cashRequirementReportsUsecase: CashRequirementReportsUsecase;
  let apCheckReportsUsecase: ApCheckReportsUsecase;
  const mockVoucherTypes: DropdownOption[] = PAYMENT_VOUCHER_TYPE_DROPDOWN;

  const mockResponseSubmitPaymentType =
    PaymentFactory.createPaymentTypeResponse();

  const mockCashRequirementResponse: PaginatedResponse<SpooledMetaDataReportEntity> =
    PaymentFactory.createCashRequirementResponse();

  const mockApCheckResponse: PaginatedResponse<SpooledMetaDataReportEntity> =
    PaymentFactory.createApCheckResponse();

  beforeEach(() => {
    getVoucherPaymentTypes = {
      execute: jest.fn().mockResolvedValue(mockVoucherTypes),
    } as unknown as PaymentTypesUseCase;

    submitPaymentTypeUseCase = {
      execute: jest.fn().mockResolvedValue(mockResponseSubmitPaymentType),
    } as unknown as SubmitPaymentTypeUseCase;

    submitPaymentVendorUseCase = {
      execute: jest.fn(),
    } as unknown as SubmitPaymentVendorUseCase;

    cashRequirementReportsUsecase = {
      execute: jest.fn().mockResolvedValue(mockCashRequirementResponse),
    } as unknown as CashRequirementReportsUsecase;

    apCheckReportsUsecase = {
      execute: jest.fn().mockResolvedValue(mockApCheckResponse),
    } as unknown as ApCheckReportsUsecase;

    controller = new PaymentController(
      getVoucherPaymentTypes,
      submitPaymentTypeUseCase,
      submitPaymentVendorUseCase,
      cashRequirementReportsUsecase,
      apCheckReportsUsecase
    );
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("getAllVoucherPaymentTypes", () => {
    it("should return all voucher types as items", async () => {
      const result = await controller.getAllVoucherPaymentTypes();

      expect(getVoucherPaymentTypes.execute).toHaveBeenCalled();
      expect(result).toEqual({
        items: mockVoucherTypes,
      });
    });
  });

  describe("submitPaymentSelection", () => {
    let dto: SubmitPaymentSelectionTypeDto;

    beforeEach(() => {
      dto = {
        companyNo: 10,
        voucherToPay: PAYMENT_VOUCHER_TYPES.CHECK,
        startingCheckNo: 123456,
        checkDate: "080125",
        dateToPayBy: "080225",
        bankAccountGl: 12010001,
        forcedDiscount: FORCED_DISCOUNT_VALUES.YES,
        mode: PAYMENT_OPERATION_MODE.SAVE,
      };
    });

    it("returns items when usecase succeeds in SAVE mode (CHECK)", async () => {
      (submitPaymentTypeUseCase.execute as jest.Mock).mockResolvedValue(
        mockResponseSubmitPaymentType
      );

      const result = await controller.submitPaymentSelection(dto);

      expect(submitPaymentTypeUseCase.execute).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ items: mockResponseSubmitPaymentType });
    });

    it("returns items when usecase succeeds in EDIT mode (CHECK)", async () => {
      const editDto: SubmitPaymentSelectionTypeDto = {
        ...dto,
        mode: PAYMENT_OPERATION_MODE.EDIT,
      };

      const editResponse = {
        ...mockResponseSubmitPaymentType,
        results: mockResponseSubmitPaymentType.results.map((r: any) => ({
          ...r,
          mode: PAYMENT_OPERATION_MODE.EDIT,
        })),
      };

      (submitPaymentTypeUseCase.execute as jest.Mock).mockResolvedValue(
        editResponse
      );

      const result = await controller.submitPaymentSelection(editDto);

      expect(submitPaymentTypeUseCase.execute).toHaveBeenCalledWith(editDto);
      expect(result).toEqual({ items: editResponse });
    });

    it("returns items when usecase succeeds in SAVE mode (ACH)", async () => {
      (submitPaymentTypeUseCase.execute as jest.Mock).mockResolvedValue(
        mockResponseSubmitPaymentType
      );
      dto.voucherToPay = PAYMENT_VOUCHER_TYPES.ACH;

      const result = await controller.submitPaymentSelection(dto);

      expect(submitPaymentTypeUseCase.execute).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ items: mockResponseSubmitPaymentType });
    });

    it("returns items when usecase succeeds in EDIT mode (ACH)", async () => {
      dto.voucherToPay = PAYMENT_VOUCHER_TYPES.ACH;
      const editDto: SubmitPaymentSelectionTypeDto = {
        ...dto,
        mode: PAYMENT_OPERATION_MODE.EDIT,
      };

      const editResponse = {
        ...mockResponseSubmitPaymentType,
        results: mockResponseSubmitPaymentType.results.map((r: any) => ({
          ...r,
          mode: PAYMENT_OPERATION_MODE.EDIT,
        })),
      };

      (submitPaymentTypeUseCase.execute as jest.Mock).mockResolvedValue(
        editResponse
      );

      const result = await controller.submitPaymentSelection(editDto);

      expect(submitPaymentTypeUseCase.execute).toHaveBeenCalledWith(editDto);
      expect(result).toEqual({ items: editResponse });
    });

    it("returns items when usecase succeeds in SAVE mode (WIRE)", async () => {
      (submitPaymentTypeUseCase.execute as jest.Mock).mockResolvedValue(
        mockResponseSubmitPaymentType
      );
      dto.voucherToPay = PAYMENT_VOUCHER_TYPES.WIRE;

      const result = await controller.submitPaymentSelection(dto);

      expect(submitPaymentTypeUseCase.execute).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ items: mockResponseSubmitPaymentType });
    });

    it("returns items when usecase succeeds in EDIT mode (WIRE)", async () => {
      dto.voucherToPay = PAYMENT_VOUCHER_TYPES.WIRE;
      const editDto: SubmitPaymentSelectionTypeDto = {
        ...dto,
        mode: PAYMENT_OPERATION_MODE.EDIT,
      };

      const editResponse = {
        ...mockResponseSubmitPaymentType,
        results: mockResponseSubmitPaymentType.results.map((r: any) => ({
          ...r,
          mode: PAYMENT_OPERATION_MODE.EDIT,
        })),
      };

      (submitPaymentTypeUseCase.execute as jest.Mock).mockResolvedValue(
        editResponse
      );

      const result = await controller.submitPaymentSelection(editDto);

      expect(submitPaymentTypeUseCase.execute).toHaveBeenCalledWith(editDto);
      expect(result).toEqual({ items: editResponse });
    });
    it("bubbles validation HttpException from usecase", async () => {
      const validationErrors = [
        {
          field: "checkDate",
          code: "checkDate",
          message: ERROR_MESSAGES.INVALID_CHECK_DATE,
        },
        {
          field: "startingCheckNo",
          code: "startingCheckNo",
          message: ERROR_MESSAGES.CHECK_NO_CANNOT_BE_ZERO,
        },
      ];

      (submitPaymentTypeUseCase.execute as jest.Mock).mockRejectedValueOnce(
        new HttpException(
          { message: "Validation Error", errors: validationErrors },
          HttpStatus.BAD_REQUEST
        )
      );

      await expect(controller.submitPaymentSelection(dto)).rejects.toThrow(
        HttpException
      );
    });

    it("bubbles unexpected errors from usecase", async () => {
      (submitPaymentTypeUseCase.execute as jest.Mock).mockRejectedValueOnce(
        new Error("Unexpected failure")
      );

      await expect(controller.submitPaymentSelection(dto)).rejects.toThrow(
        "Unexpected failure"
      );
    });
  });

  describe("submitVendorPayment", () => {
    it("should return success response when save mode usecase with only Vendor No resolves (CHECK)", async () => {
      const dto: SubmitVendorPaymentsDto = {
        companyNo: 10,
        voucherToPay: PAYMENT_VOUCHER_TYPES.CHECK,
        bankAccountGl: 11000001,
        startingCheckNo: 123456,
        checkDate: "080125",
        dateToPayBy: "080225",
        item: {
          entrySequence: "00001",
          vendorNo: 1875,
          voucherNo: null as unknown as number,
          partialPayAmount: null as unknown as number,
          discountAmount: null as unknown as number,
          payOrHold: null as unknown as PAY_OR_HOLD_CODES,
          singleCheck: null as unknown as SingleCheckFlag,
          makePrepaid: null as unknown as MakePrepaidFlag,
          prepaidCheckNo: null as unknown as string,
          prepaidDate: null as unknown as string,
          forcedDiscount: null as unknown as string,
          mode: PAYMENT_OPERATION_MODE.SAVE,
        },
      };

      const mockResponseSaveSubmitPaymentVendor = {
        message: "Vendor payment submitted successfully",
        results: [
          {
            mode: PAYMENT_OPERATION_MODE.SAVE,
            spName: PAYMENT_STORE_PROCEDURE.APPYTRDCLPRC,
            output: {
              errVar: "Program APPYTRDCLPRC executed successfully",
            },
          },
        ],
      };

      (submitPaymentVendorUseCase.execute as jest.Mock).mockResolvedValue(
        mockResponseSaveSubmitPaymentVendor
      );

      const result = await controller.submitVendorPayment(dto);

      expect(submitPaymentVendorUseCase.execute).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ items: mockResponseSaveSubmitPaymentVendor });
    });

    it("should return success response when save mode usecase resolves (CHECK)", async () => {
      const dto: SubmitVendorPaymentsDto = {
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

      const mockResponseSaveSubmitPaymentVendor = {
        message: "Vendor payment submitted successfully",
        results: [
          {
            mode: PAYMENT_OPERATION_MODE.SAVE,
            spName: PAYMENT_STORE_PROCEDURE.APPYTRDCLPRC,
            output: {
              errVar: "Program APPYTRDCLPRC executed successfully",
            },
          },
        ],
      };

      (submitPaymentVendorUseCase.execute as jest.Mock).mockResolvedValue(
        mockResponseSaveSubmitPaymentVendor
      );

      const result = await controller.submitVendorPayment(dto);

      expect(submitPaymentVendorUseCase.execute).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ items: mockResponseSaveSubmitPaymentVendor });
    });

    it("should return success response when edit mode usecase resolves (CHECK)", async () => {
      const dto: SubmitVendorPaymentsDto = {
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
          mode: PAYMENT_OPERATION_MODE.EDIT,
        },
      };

      const mockResponseEditSubmitPaymentVendor = {
        message: "Vendor payment submitted successfully",
        results: [
          {
            mode: PAYMENT_OPERATION_MODE.EDIT,
            spName: PAYMENT_STORE_PROCEDURE.APPYTRDCLPRC,
            output: {
              errVar: "Program APPYTRDCLPRC executed successfully",
            },
          },
        ],
      };

      (submitPaymentVendorUseCase.execute as jest.Mock).mockResolvedValue(
        mockResponseEditSubmitPaymentVendor
      );

      const result = await controller.submitVendorPayment(dto);

      expect(submitPaymentVendorUseCase.execute).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ items: mockResponseEditSubmitPaymentVendor });
    });

    it("should return success response when delete mode usecase resolves (CHECK)", async () => {
      const dto: SubmitVendorPaymentsDto = {
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
          mode: PAYMENT_OPERATION_MODE.DELETE,
        },
      };

      const mockResponseDeleteSubmitPaymentVendor = {
        message: "Vendor payment submitted successfully",
        results: [
          {
            mode: PAYMENT_OPERATION_MODE.DELETE,
            spName: PAYMENT_STORE_PROCEDURE.APPYTRDCLPRC,
            output: {
              errVar: "Program APPYTRDCLPRC executed successfully",
            },
          },
        ],
      };

      (submitPaymentVendorUseCase.execute as jest.Mock).mockResolvedValue(
        mockResponseDeleteSubmitPaymentVendor
      );

      const result = await controller.submitVendorPayment(dto);

      expect(submitPaymentVendorUseCase.execute).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ items: mockResponseDeleteSubmitPaymentVendor });
    });

    it("should return success response when save mode usecase resolves (ACH)", async () => {
      const dto: SubmitVendorPaymentsDto = {
        companyNo: 10,
        voucherToPay: PAYMENT_VOUCHER_TYPES.ACH,
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

      const mockResponseSaveSubmitPaymentVendor = {
        message: "Vendor payment submitted successfully",
        status: "success",
        results: [
          {
            mode: PAYMENT_OPERATION_MODE.SAVE,
            spName: PAYMENT_STORE_PROCEDURE.APPYTRDCLPRC,
            output: {
              errVar: "Program APPYTRDCLPRC executed successfully",
            },
          },
        ],
      };

      (submitPaymentVendorUseCase.execute as jest.Mock).mockResolvedValue(
        mockResponseSaveSubmitPaymentVendor
      );

      const result = await controller.submitVendorPayment(dto);

      expect(submitPaymentVendorUseCase.execute).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ items: mockResponseSaveSubmitPaymentVendor });
    });

    it("should return success response when edit mode usecase resolves (ACH)", async () => {
      const dto: SubmitVendorPaymentsDto = {
        companyNo: 10,
        voucherToPay: PAYMENT_VOUCHER_TYPES.ACH,
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
          mode: PAYMENT_OPERATION_MODE.EDIT,
        },
      };

      const mockResponseEditSubmitPaymentVendor = {
        message: "Vendor payment submitted successfully",
        status: "success",
        results: [
          {
            mode: PAYMENT_OPERATION_MODE.EDIT,
            spName: PAYMENT_STORE_PROCEDURE.APPYTRDCLPRC,
            output: {
              errVar: "Program APPYTRDCLPRC executed successfully",
            },
          },
        ],
      };

      (submitPaymentVendorUseCase.execute as jest.Mock).mockResolvedValue(
        mockResponseEditSubmitPaymentVendor
      );

      const result = await controller.submitVendorPayment(dto);

      expect(submitPaymentVendorUseCase.execute).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ items: mockResponseEditSubmitPaymentVendor });
    });

    it("should return success response when delete mode usecase resolves (ACH)", async () => {
      const dto: SubmitVendorPaymentsDto = {
        companyNo: 10,
        voucherToPay: PAYMENT_VOUCHER_TYPES.ACH,
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
          mode: PAYMENT_OPERATION_MODE.DELETE,
        },
      };

      const mockResponseDeleteSubmitPaymentVendor = {
        message: "Vendor payment submitted successfully",
        status: "success",
        results: [
          {
            mode: PAYMENT_OPERATION_MODE.DELETE,
            spName: PAYMENT_STORE_PROCEDURE.APPYTRDCLPRC,
            output: {
              errVar: "Program APPYTRDCLPRC executed successfully",
            },
          },
        ],
      };

      (submitPaymentVendorUseCase.execute as jest.Mock).mockResolvedValue(
        mockResponseDeleteSubmitPaymentVendor
      );

      const result = await controller.submitVendorPayment(dto);

      expect(submitPaymentVendorUseCase.execute).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ items: mockResponseDeleteSubmitPaymentVendor });
    });

    it("should return success response when save mode usecase resolves (WIRE)", async () => {
      const dto: SubmitVendorPaymentsDto = {
        companyNo: 10,
        voucherToPay: PAYMENT_VOUCHER_TYPES.WIRE,
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

      const mockResponseSaveSubmitPaymentVendor = {
        message: "Vendor payment submitted successfully",
        status: "success",
        results: [
          {
            mode: PAYMENT_OPERATION_MODE.SAVE,
            spName: PAYMENT_STORE_PROCEDURE.APPYTRDCLPRC,
            output: {
              errVar: "Program APPYTRDCLPRC executed successfully",
            },
          },
        ],
      };

      (submitPaymentVendorUseCase.execute as jest.Mock).mockResolvedValue(
        mockResponseSaveSubmitPaymentVendor
      );

      const result = await controller.submitVendorPayment(dto);

      expect(submitPaymentVendorUseCase.execute).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ items: mockResponseSaveSubmitPaymentVendor });
    });

    it("should return success response when edit mode usecase resolves (WIRE)", async () => {
      const dto: SubmitVendorPaymentsDto = {
        companyNo: 10,
        voucherToPay: PAYMENT_VOUCHER_TYPES.WIRE,
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
          mode: PAYMENT_OPERATION_MODE.EDIT,
        },
      };

      const mockResponseEditSubmitPaymentVendor = {
        message: "Vendor payment submitted successfully",
        status: "success",
        results: [
          {
            mode: PAYMENT_OPERATION_MODE.EDIT,
            spName: PAYMENT_STORE_PROCEDURE.APPYTRDCLPRC,
            output: {
              errVar: "Program APPYTRDCLPRC executed successfully",
            },
          },
        ],
      };

      (submitPaymentVendorUseCase.execute as jest.Mock).mockResolvedValue(
        mockResponseEditSubmitPaymentVendor
      );

      const result = await controller.submitVendorPayment(dto);

      expect(submitPaymentVendorUseCase.execute).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ items: mockResponseEditSubmitPaymentVendor });
    });

    it("should return success response when delete mode usecase resolves (WIRE)", async () => {
      const dto: SubmitVendorPaymentsDto = {
        companyNo: 10,
        voucherToPay: PAYMENT_VOUCHER_TYPES.WIRE,
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
          mode: PAYMENT_OPERATION_MODE.DELETE,
        },
      };

      const mockResponseDeleteSubmitPaymentVendor = {
        message: "Vendor payment submitted successfully",
        status: "success",
        results: [
          {
            mode: PAYMENT_OPERATION_MODE.DELETE,
            spName: PAYMENT_STORE_PROCEDURE.APPYTRDCLPRC,
            output: {
              errVar: "Program APPYTRDCLPRC executed successfully",
            },
          },
        ],
      };

      (submitPaymentVendorUseCase.execute as jest.Mock).mockResolvedValue(
        mockResponseDeleteSubmitPaymentVendor
      );

      const result = await controller.submitVendorPayment(dto);

      expect(submitPaymentVendorUseCase.execute).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ items: mockResponseDeleteSubmitPaymentVendor });
    });
  });

  describe("getCashRequirementReports", () => {
    it("should call usecase and return paginated response", async () => {
      const dto: GetCashRequirementReportDto = {
        voucherToPay: PAYMENT_VOUCHER_TYPES.CHECK,
        reportType: ["AP_Cash_Requirement"],
      };

      const result = await controller.getCashRequirementReports(dto);

      expect(cashRequirementReportsUsecase.execute).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockCashRequirementResponse);
    });

    it("should bubble errors from usecase", async () => {
      const dto: GetCashRequirementReportDto = {
        voucherToPay: PAYMENT_VOUCHER_TYPES.ACH,
        reportType: [],
      };

      (
        cashRequirementReportsUsecase.execute as jest.Mock
      ).mockRejectedValueOnce(new Error("Failed to fetch reports"));

      await expect(controller.getCashRequirementReports(dto)).rejects.toThrow(
        "Failed to fetch reports"
      );
    });
  });

  describe("getApCheckReports", () => {
    it("should call usecase and return paginated response", async () => {
      const dto = {
        voucherToPay: PAYMENT_VOUCHER_TYPES.CHECK,
        reportType: [PAYMENT_REPORT_TYPES.AP_Check_Printing],
      };

      const result = await controller.getApCheckReports(dto);

      expect(apCheckReportsUsecase.execute).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockApCheckResponse);
    });

    it("should bubble errors from usecase", async () => {
      const dto = {
        voucherToPay: PAYMENT_VOUCHER_TYPES.WIRE,
        reportType: [PAYMENT_REPORT_TYPES.AP_Check_Printing],
      };

      (apCheckReportsUsecase.execute as jest.Mock).mockRejectedValueOnce(
        new Error("Failed to fetch AP check reports")
      );

      await expect(controller.getApCheckReports(dto)).rejects.toThrow(
        "Failed to fetch AP check reports"
      );
    });
  });
});
