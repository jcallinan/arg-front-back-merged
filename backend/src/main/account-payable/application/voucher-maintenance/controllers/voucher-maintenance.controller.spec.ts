import { Test, TestingModule } from "@nestjs/testing";
import { VoucherMaintenanceController } from "./voucher-maintenance.controller";
import { GetVoucherMaintenanceUseCase } from "../usecases/get-voucher-maintenance/get-voucher-maintenance.usecase";
import { GetVoucherSummaryMaintenanceUseCase } from "../usecases/get-voucher-summary/get-voucher-summary.usecase";
import { getVoucherMaintenanceViewUseCase } from "../usecases/get-voucher-view/get-voucher-view.usecase";
import { UpdateVoucherMaintenanceStatusUseCase } from "../usecases/update-voucher-status/update-voucher-status.usecase";
import { UpdateDiscountUseCase } from "../usecases/update-discount/update-discount.usecase";
import { TransferVoucherUseCase } from "../usecases/transfer-voucher/transfer-voucher.usecase";
import {
  VoucherType,
  VoucherMaintenanceStatusCode,
} from "@src/shared/constants/voucher-type.enum";

describe("VoucherMaintenanceController", () => {
  let controller: VoucherMaintenanceController;

  const mockGetVoucherMaintenanceUseCase = { execute: jest.fn() };
  const mockGetVoucherSummaryUseCase = { execute: jest.fn() };
  const mockGetVoucherMaintenanceViewUseCase = { execute: jest.fn() };
  const mockUpdateVoucherMaintenanceStatusUseCase = { execute: jest.fn() };
  const mockUpdateDiscountUseCase = { execute: jest.fn() };
  const mockTransferVoucherUseCase = { execute: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VoucherMaintenanceController],
      providers: [
        {
          provide: GetVoucherMaintenanceUseCase,
          useValue: mockGetVoucherMaintenanceUseCase,
        },
        {
          provide: GetVoucherSummaryMaintenanceUseCase,
          useValue: mockGetVoucherSummaryUseCase,
        },
        {
          provide: getVoucherMaintenanceViewUseCase,
          useValue: mockGetVoucherMaintenanceViewUseCase,
        },
        {
          provide: UpdateVoucherMaintenanceStatusUseCase,
          useValue: mockUpdateVoucherMaintenanceStatusUseCase,
        },
        { provide: UpdateDiscountUseCase, useValue: mockUpdateDiscountUseCase },
        {
          provide: TransferVoucherUseCase,
          useValue: mockTransferVoucherUseCase,
        },
      ],
    }).compile();

    controller = module.get<VoucherMaintenanceController>(
      VoucherMaintenanceController
    );
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("getVouchers", () => {
    it("should return paginated vouchers", async () => {
      const query = {
        page: 2,
        limit: 10,
        companyNo: 10,
        vendorNo: 100,
        voucherType: VoucherType.UNPAID,
      } as any;
      const repoResponse = { rows: [{ voucherNo: 1 }], count: 25 };
      mockGetVoucherMaintenanceUseCase.execute.mockResolvedValue(repoResponse);

      const result = await controller.getVouchers(query);

      expect(result).toEqual({
        items: repoResponse.rows,
        pagination: {
          total_items: 25,
          current_page: 2,
          items_per_page: 10,
          total_pages: Math.ceil(25 / 10),
        },
      });
      expect(mockGetVoucherMaintenanceUseCase.execute).toHaveBeenCalledWith(
        query
      );
    });
  });

  describe("getVoucherSummary", () => {
    it("should return simple response", async () => {
      const query = {
        voucherType: VoucherType.ALL,
        companyNo: 10,
        vendorNo: 100,
      } as any;
      const payload = [
        {
          vendorName: "V1",
          companyNo: 10,
          vendorNo: 100,
          lastPaidAmount: 0,
          lastPaidDate: null,
          type: VoucherType.ALL,
        },
      ];
      mockGetVoucherSummaryUseCase.execute.mockResolvedValue(payload);

      const result = await controller.getVoucherSummary(query);
      expect(result).toEqual({ items: payload });
      expect(mockGetVoucherSummaryUseCase.execute).toHaveBeenCalledWith(query);
    });
  });

  describe("getVoucherView", () => {
    it("should return voucher view for params and query", async () => {
      const params = { voucherNo: 123 } as any;
      const query = {
        voucherType: VoucherType.UNPAID,
        companyNo: 10,
        vendorNo: 100,
      } as any;
      const payload = { headerItems: { voucherNo: 123 }, detailItems: [] };
      mockGetVoucherMaintenanceViewUseCase.execute.mockResolvedValue(payload);

      const result = await controller.getVoucherView(params, query);
      expect(result).toEqual({ items: payload });
      expect(mockGetVoucherMaintenanceViewUseCase.execute).toHaveBeenCalledWith(
        { ...query, voucherNo: 123 }
      );
    });
  });

  describe("updateVoucherStatus", () => {
    it("should return update message", async () => {
      const body = {
        companyNo: 10,
        vendorNo: 100,
        voucherNo: 1,
        statusCode: VoucherMaintenanceStatusCode.HOLD,
        statusDescription: "Hold",
      } as any;
      const payload = {
        message: "ok",
        voucher: {
          companyNo: 10,
          vendorNo: 100,
          voucherNo: 1,
          statusCode: VoucherMaintenanceStatusCode.HOLD,
          statusDescription: "Hold",
          updatedAt: new Date().toISOString(),
        },
      };
      mockUpdateVoucherMaintenanceStatusUseCase.execute.mockResolvedValue(
        payload
      );

      const result = await controller.updateVoucherStatus(body);
      expect(result).toEqual({ items: payload });
      expect(
        mockUpdateVoucherMaintenanceStatusUseCase.execute
      ).toHaveBeenCalledWith(body);
    });
  });

  describe("updateDiscount", () => {
    it("should return discount update message", async () => {
      const body = {
        companyNo: 10,
        vendorNo: 100,
        voucherNo: 1,
        discountDueDate: "011524",
        discount: 10,
      } as any;
      const payload = {
        message: "ok",
        voucher: {
          companyNo: 10,
          vendorNo: 100,
          voucherNo: 1,
          discountDueDate: "011524",
          discount: 10,
          updatedAt: new Date().toISOString(),
        },
      };
      mockUpdateDiscountUseCase.execute.mockResolvedValue(payload);

      const result = await controller.updateDiscount(body);
      expect(result).toEqual({ items: payload });
      expect(mockUpdateDiscountUseCase.execute).toHaveBeenCalledWith(body);
    });
  });

  describe("transferVoucher", () => {
    it("should return transfer voucher message", async () => {
      const body = {
        companyNo: 10,
        vendorNo: 100,
        voucherNo: 1,
        transferToCompanyNo: 20,
        transferToVendorNo: 200,
      } as any;
      const payload = {
        message: "ok",
        voucher: {
          companyNo: 10,
          vendorNo: 100,
          voucherNo: 1,
          transferToCompanyNo: 20,
          transferToVendorNo: 200,
          updatedAt: new Date().toISOString(),
        },
      };
      mockTransferVoucherUseCase.execute.mockResolvedValue(payload);

      const result = await controller.transferVoucher(body);
      expect(result).toEqual({ items: payload });
      expect(mockTransferVoucherUseCase.execute).toHaveBeenCalledWith(body);
    });
  });
});
