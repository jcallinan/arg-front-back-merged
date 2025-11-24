import { Test, TestingModule } from "@nestjs/testing";
import { HttpException, HttpStatus } from "@nestjs/common";
import { ApPeriodEndRepository } from "./ap-period-end.repository";
import { ApPeriodEndModel } from "../models/ap-period-end.model";
import { ApPeriodEndMapper } from "../mappers/ap-period-end.mapper";
import { ERROR_CONSTANTS } from "@src/shared/constants/error-constants";
import {
  RecordA,
  RecordB,
  RecordT,
} from "@src/main/account-payable/domain/entities/ap-period-end.entity";

describe("ApPeriodEndRepository", () => {
  let repository: ApPeriodEndRepository;
  let ap1099IModel: jest.Mocked<typeof ApPeriodEndModel>;

  const mockAp1099IModel = {
    findOne: jest.fn(),
    findAndCountAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApPeriodEndRepository,
        {
          provide: "ApPeriodEndModel",
          useValue: mockAp1099IModel,
        },
      ],
    }).compile();

    repository = module.get<ApPeriodEndRepository>(ApPeriodEndRepository);
    ap1099IModel = module.get("ApPeriodEndModel");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getApPeriodEnd", () => {
    const ctl = "12345";
    const tin = "987654321";

    it("should successfully retrieve AP period end data for record type A", async () => {
      const mockModelData = {
        k00001Text: "A",
        k00002Text: ctl,
        k00003Text: tin,
        f00001Text: "A2024Y987654321ABCDY01...",
      };

      const mockEntityData: RecordA = {
        recordType: "A",
        paymentYear: 2024,
        c: "Y",
        blank01: "",
        taxPayerId: 987654321,
        payerNameControl: "ABCD",
        lastFilingIndicator: "Y",
        typeOfReturn: "01",
        amountCodes: "1234567890123456",
        blank02: "",
        foreignEntityIndicator: "N",
        firstPayeeName: "Test Company",
        secondPayerName: "Test Division",
        transferAgentIndicator: "Y",
        payerShippingAddress: "123 Test St",
        payerCity: "Test City",
        payerState: "TS",
        payerZipCode: "12345",
        payerPhoneNumber: "1234567890",
        blank03: "",
        blank04: "",
        sequenceNumber: 1,
        blank05: "",
        blank06: "",
      };

      jest.spyOn(ApPeriodEndMapper, "toEntity").mockReturnValue(mockEntityData);
      mockAp1099IModel.findOne.mockResolvedValue(mockModelData);

      const result = await repository.getApPeriodEnd(ctl, tin);

      expect(ap1099IModel.findOne).toHaveBeenCalledWith({
        where: {
          k00002Text: ctl,
          k00003Text: tin,
        },
      });
      expect(ApPeriodEndMapper.toEntity).toHaveBeenCalledWith(
        mockModelData.f00001Text,
        expect.any(Object)
      );
      expect(result).toEqual(mockEntityData);
    });

    it("should successfully retrieve AP period end data for record type B", async () => {
      const mockModelData = {
        k00001Text: "B",
        k00002Text: ctl,
        k00003Text: tin,
        f00001Text: "B2024ABCD1987654321...",
      };

      const mockEntityData: RecordB = {
        recordType: "B",
        paymentYear: "2024",
        correctedReturnIndicator: "1",
        nameControl: "ABCD",
        typeOfTIN: "1",
        taxPayerId: "987654321",
        payerAccountNum: "ACC1234567890",
        payerOfficeCode: "OFF1",
        deletionIndicator: "N",
        blank01: "",
        payAmt1: 1000,
        payAmt2: 2000,
        payAmt3: 3000,
        payAmt4: 4000,
        payAmt5: 5000,
        payAmt6: 6000,
        payAmt7: 7000,
        payAmt8: 8000,
        payAmt9: 9000,
        payAmtA: 10000,
        payAmtB: 11000,
        payAmtC: 12000,
        payAmtD: 13000,
        payAmtE: 14000,
        payAmtF: 15000,
        payAmtG: 16000,
        foreignCountryCode: "N",
        firstPayeeName: "Test Payee",
        secondPayeeName: "Test Second",
        payeeAddress: "123 Payee St",
        payeeCity: "Payee City",
        payeeState: "PS",
        payeeZip: "54321",
        blank05: "",
        sequenceNumber: 1,
        blank06: "",
      };

      jest.spyOn(ApPeriodEndMapper, "toEntity").mockReturnValue(mockEntityData);
      mockAp1099IModel.findOne.mockResolvedValue(mockModelData);

      const result = await repository.getApPeriodEnd(ctl, tin);

      expect(result).toEqual(mockEntityData);
    });

    it("should successfully retrieve AP period end data for record type T", async () => {
      const mockModelData = {
        k00001Text: "T",
        k00002Text: ctl,
        k00003Text: tin,
        f00001Text: "T2024Y987654321ABCDE...",
      };

      const mockEntityData: RecordT = {
        recordType: "T",
        paymentYear: 2024,
        priorYearDataInd: "Y",
        transmitterId: 987654321,
        transControlCode: "ABCDE",
        replacementAlphaChar: "RA",
        blank01: "",
        testFileInd: "T",
        foreignEntityInd: "N",
        transmitterName: "Test Transmitter",
        transmitterName2: "Second Name",
        companyName: "Test Company",
        companyName2: "Test Division",
        companyAddress: "123 Company St",
        companyCity: "Company City",
        companyState: "CS",
        companyZipCode: "12345",
        blank02: "",
        totalNumberOfPayees: 100,
        contactName: "Test Contact",
        contactPhoneNumber: "1234567890",
        contactEmail: "test@email.com",
        blank03: "",
        sequenceNumber: 1,
        blank04: "",
        vendorInd: "Y",
        blank05: "",
        blank06: "",
      };

      jest.spyOn(ApPeriodEndMapper, "toEntity").mockReturnValue(mockEntityData);
      mockAp1099IModel.findOne.mockResolvedValue(mockModelData);

      const result = await repository.getApPeriodEnd(ctl, tin);

      expect(result).toEqual(mockEntityData);
    });

    it("should throw NOT_FOUND error when AP1099 record is not found", async () => {
      mockAp1099IModel.findOne.mockResolvedValue(null);

      await expect(repository.getApPeriodEnd(ctl, tin)).rejects.toThrow(
        HttpException
      );

      try {
        await repository.getApPeriodEnd(ctl, tin);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect((error as HttpException).getStatus()).toBe(HttpStatus.NOT_FOUND);
        expect((error as HttpException).getResponse()).toEqual(
          expect.objectContaining({
            error: {
              code: ERROR_CONSTANTS.NOT_FOUND.code,
              message: ERROR_CONSTANTS.NOT_FOUND.message,
              details: [
                {
                  field: "ap-1009",
                  code: ERROR_CONSTANTS.NOT_FOUND.code,
                  message: "Ap1009 not found",
                },
              ],
            },
          })
        );
      }
    });

    it("should handle database errors gracefully", async () => {
      const dbError = new Error("Database connection failed");
      mockAp1099IModel.findOne.mockRejectedValue(dbError);

      await expect(repository.getApPeriodEnd(ctl, tin)).rejects.toThrow(
        dbError
      );
    });

    it("should handle partial parameters correctly", async () => {
      const mockModelData = {
        k00001Text: "A",
        k00002Text: ctl,
        k00003Text: tin,
        f00001Text: "A2024Y987654321ABCDY01...",
      };

      jest.spyOn(ApPeriodEndMapper, "toEntity").mockReturnValue({} as RecordA);
      mockAp1099IModel.findOne.mockResolvedValue(mockModelData);

      // Test with only ctl
      await repository.getApPeriodEnd(ctl, "");
      expect(ap1099IModel.findOne).toHaveBeenCalledWith({
        where: {
          k00002Text: ctl,
        },
      });

      // Test with only tin
      await repository.getApPeriodEnd("", tin);
      expect(ap1099IModel.findOne).toHaveBeenCalledWith({
        where: {
          k00003Text: tin,
        },
      });
    });
  });

  describe("postApPeriodEnd", () => {
    const ctl = "12345";
    const tin = "987654321";
    const payload = {
      recordType: "A",
      paymentYear: 2024,
      c: "Y",
      // ... other fields
    };

    it("should successfully update AP period end data", async () => {
      const mockModelData = {
        k00001Text: "A",
        k00002Text: ctl,
        k00003Text: tin,
        f00001Text: "old data",
        update: jest.fn().mockResolvedValue(true),
      };

      const mockMappedData = "updated data string";
      jest.spyOn(ApPeriodEndMapper, "toModel").mockReturnValue(mockMappedData);
      mockAp1099IModel.findOne.mockResolvedValue(mockModelData);

      const result = await repository.postApPeriodEnd(ctl, tin, payload);

      expect(ap1099IModel.findOne).toHaveBeenCalledWith({
        where: {
          k00002Text: ctl,
          k00003Text: tin,
        },
      });
      expect(ApPeriodEndMapper.toModel).toHaveBeenCalledWith(
        payload,
        expect.any(Object)
      );
      expect(mockModelData.update).toHaveBeenCalledWith({
        f00001Text: mockMappedData,
      });
      expect(result).toEqual({ message: "successfully updated" });
    });

    it("should throw NOT_FOUND error when AP1099 record is not found", async () => {
      mockAp1099IModel.findOne.mockResolvedValue(null);

      await expect(
        repository.postApPeriodEnd(ctl, tin, payload)
      ).rejects.toThrow(HttpException);

      try {
        await repository.postApPeriodEnd(ctl, tin, payload);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect((error as HttpException).getStatus()).toBe(HttpStatus.NOT_FOUND);
        expect((error as HttpException).getResponse()).toEqual(
          expect.objectContaining({
            error: {
              code: ERROR_CONSTANTS.NOT_FOUND.code,
              message: ERROR_CONSTANTS.NOT_FOUND.message,
              details: [
                {
                  field: "ap-1009",
                  code: ERROR_CONSTANTS.NOT_FOUND.code,
                  message: `Ap1009 data not found fro tin:${tin} , ctl: ${ctl}`,
                },
              ],
            },
          })
        );
      }
    });

    it("should handle database errors gracefully", async () => {
      const dbError = new Error("Database update failed");
      mockAp1099IModel.findOne.mockRejectedValue(dbError);

      await expect(
        repository.postApPeriodEnd(ctl, tin, payload)
      ).rejects.toThrow(dbError);
    });

    it("should handle update errors gracefully", async () => {
      const mockModelData = {
        k00001Text: "A",
        k00002Text: ctl,
        k00003Text: tin,
        f00001Text: "old data",
        update: jest.fn().mockRejectedValue(new Error("Update failed")),
      };

      jest.spyOn(ApPeriodEndMapper, "toModel").mockReturnValue("updated data");
      mockAp1099IModel.findOne.mockResolvedValue(mockModelData);

      await expect(
        repository.postApPeriodEnd(ctl, tin, payload)
      ).rejects.toThrow("Update failed");
    });
  });

  describe("findAll", () => {
    const limit = 10;
    const offset = 0;
    const page = 1;

    it("should successfully retrieve all AP period end records with pagination", async () => {
      const mockRows = [
        {
          k00001Text: "A",
          k00002Text: "ctl1",
          k00003Text: "tin1",
          f00001Text: "A2024Y123456789ABCDY01...",
        },
        {
          k00001Text: "B",
          k00002Text: "ctl2",
          k00003Text: "tin2",
          f00001Text: "B2024ABCD2123456789...",
        },
      ];

      const mockCount = 2;

      mockAp1099IModel.findAndCountAll.mockResolvedValue({
        rows: mockRows,
        count: mockCount,
      });

      jest
        .spyOn(ApPeriodEndMapper, "toEntity")
        .mockReturnValueOnce({
          recordType: "A",
          deletionIndicator: "N",
        } as unknown as RecordA)
        .mockReturnValueOnce({
          recordType: "B",
          deletionIndicator: "N",
        } as unknown as RecordB);

      const result = await repository.findAll(limit, offset, page);

      expect(ap1099IModel.findAndCountAll).toHaveBeenCalledWith({
        limit,
        offset,
      });
      expect(result.items).toHaveLength(2);
      expect(result.pagination.total_items).toBe(2);
      expect(result.pagination.current_page).toBe(page);
      expect(result.pagination.items_per_page).toBe(limit);
    });

    it("should filter out deleted records (deletionIndicator = Y)", async () => {
      const mockRows = [
        {
          k00001Text: "A",
          k00002Text: "ctl1",
          k00003Text: "tin1",
          f00001Text: "A2024Y123456789ABCDY01...",
        },
        {
          k00001Text: "B",
          k00002Text: "ctl2",
          k00003Text: "tin2",
          f00001Text: "B2024ABCD2123456789...",
        },
      ];

      mockAp1099IModel.findAndCountAll.mockResolvedValue({
        rows: mockRows,
        count: 2,
      });

      jest
        .spyOn(ApPeriodEndMapper, "toEntity")
        .mockReturnValueOnce({
          recordType: "A",
          deletionIndicator: "N",
        } as unknown as RecordA)
        .mockReturnValueOnce({
          recordType: "B",
          deletionIndicator: "Y", // This should be filtered out
        } as unknown as RecordB);

      const result = await repository.findAll(limit, offset, page);

      expect(result.items).toHaveLength(1); // Only non-deleted records
      expect(result.items[0]?.ctl).toBe("ctl1");
    });

    it("should return empty paginated response when no records are found", async () => {
      mockAp1099IModel.findAndCountAll.mockResolvedValue({
        rows: [],
        count: 0,
      });

      const result = await repository.findAll(limit, offset, page);

      expect(result.items).toHaveLength(0);
      expect(result.pagination.total_items).toBe(0);
      expect(result.pagination.current_page).toBe(page);
      expect(result.pagination.items_per_page).toBe(limit);
    });

    it("should handle database errors gracefully", async () => {
      const dbError = new Error("Database query failed");
      mockAp1099IModel.findAndCountAll.mockRejectedValue(dbError);

      await expect(repository.findAll(limit, offset, page)).rejects.toThrow(
        dbError
      );
    });

    it("should handle different pagination parameters", async () => {
      const mockRows = [
        {
          k00001Text: "A",
          k00002Text: "ctl1",
          k00003Text: "tin1",
          f00001Text: "A2024Y123456789ABCDY01...",
        },
      ];

      mockAp1099IModel.findAndCountAll.mockResolvedValue({
        rows: mockRows,
        count: 1,
      });

      jest.spyOn(ApPeriodEndMapper, "toEntity").mockReturnValue({
        recordType: "A",
        deletionIndicator: "N",
      } as unknown as RecordA);

      const result = await repository.findAll(5, 10, 3);

      expect(ap1099IModel.findAndCountAll).toHaveBeenCalledWith({
        limit: 5,
        offset: 10,
      });
      expect(result.pagination.current_page).toBe(3);
      expect(result.pagination.items_per_page).toBe(5);
    });
  });

  describe("softDelete", () => {
    const ctl = "12345";
    const tin = "987654321";

    it("should successfully soft delete AP period end record", async () => {
      const mockModelData = {
        k00001Text: "B",
        k00002Text: ctl,
        k00003Text: tin,
        f00001Text: "B2024ABCD1987654321...",
        update: jest.fn().mockResolvedValue(true),
      };

      const mockEntityData: RecordB = {
        recordType: "B",
        paymentYear: "2024",
        correctedReturnIndicator: "1",
        nameControl: "ABCD",
        typeOfTIN: "1",
        taxPayerId: "987654321",
        payerAccountNum: "ACC1234567890",
        payerOfficeCode: "OFF1",
        deletionIndicator: "N",
        blank01: "",
        payAmt1: 1000,
        payAmt2: 2000,
        payAmt3: 3000,
        payAmt4: 4000,
        payAmt5: 5000,
        payAmt6: 6000,
        payAmt7: 7000,
        payAmt8: 8000,
        payAmt9: 9000,
        payAmtA: 10000,
        payAmtB: 11000,
        payAmtC: 12000,
        payAmtD: 13000,
        payAmtE: 14000,
        payAmtF: 15000,
        payAmtG: 16000,
        foreignCountryCode: "N",
        firstPayeeName: "Test Payee",
        secondPayeeName: "Test Second",
        payeeAddress: "123 Payee St",
        payeeCity: "Payee City",
        payeeState: "PS",
        payeeZip: "54321",
        blank05: "",
        sequenceNumber: 1,
        blank06: "",
      };

      jest.spyOn(ApPeriodEndMapper, "toEntity").mockReturnValue(mockEntityData);
      jest
        .spyOn(ApPeriodEndMapper, "toModel")
        .mockReturnValue("updated data with Y indicator");
      mockAp1099IModel.findOne.mockResolvedValue(mockModelData);

      const result = await repository.softDelete(ctl, tin);

      expect(ap1099IModel.findOne).toHaveBeenCalledWith({
        where: {
          k00001Text: "B",
          k00002Text: ctl,
          k00003Text: tin,
        },
      });
      expect(ApPeriodEndMapper.toEntity).toHaveBeenCalledWith(
        mockModelData.f00001Text,
        expect.any(Object)
      );
      expect(ApPeriodEndMapper.toModel).toHaveBeenCalledWith(
        expect.objectContaining({ deletionIndicator: "Y" }),
        expect.any(Object)
      );
      expect(mockModelData.update).toHaveBeenCalledWith({
        f00001Text: "updated data with Y indicator",
      });
      expect(result).toEqual({ message: "Deleted Successfully" });
    });

    it("should throw NOT_FOUND error when record is not found", async () => {
      mockAp1099IModel.findOne.mockResolvedValue(null);

      await expect(repository.softDelete(ctl, tin)).rejects.toThrow(
        HttpException
      );

      try {
        await repository.softDelete(ctl, tin);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect((error as HttpException).getStatus()).toBe(HttpStatus.NOT_FOUND);
        expect((error as HttpException).getResponse()).toEqual(
          expect.objectContaining({
            error: {
              code: ERROR_CONSTANTS.NOT_FOUND.code,
              message: ERROR_CONSTANTS.NOT_FOUND.message,
              details: [
                {
                  field: "ap-period end",
                  code: ERROR_CONSTANTS.NOT_FOUND.code,
                  message: `AP Period end record not found fro tin:${tin} , ctl: ${ctl}`,
                },
              ],
            },
          })
        );
      }
    });

    it("should handle database errors gracefully", async () => {
      const dbError = new Error("Database query failed");
      mockAp1099IModel.findOne.mockRejectedValue(dbError);

      await expect(repository.softDelete(ctl, tin)).rejects.toThrow(dbError);
    });

    it("should handle update errors gracefully", async () => {
      const mockModelData = {
        k00001Text: "B",
        k00002Text: ctl,
        k00003Text: tin,
        f00001Text: "B2024ABCD1987654321...",
        update: jest.fn().mockRejectedValue(new Error("Update failed")),
      };

      jest.spyOn(ApPeriodEndMapper, "toEntity").mockReturnValue({
        recordType: "B",
        deletionIndicator: "N",
      } as RecordB);
      jest.spyOn(ApPeriodEndMapper, "toModel").mockReturnValue("updated data");
      mockAp1099IModel.findOne.mockResolvedValue(mockModelData);

      await expect(repository.softDelete(ctl, tin)).rejects.toThrow(
        "Update failed"
      );
    });

    it("should only work with record type B", async () => {
      // Mock should return null since we're looking for k00001Text: 'B'
      mockAp1099IModel.findOne.mockResolvedValue(null);

      await expect(repository.softDelete(ctl, tin)).rejects.toThrow(
        HttpException
      );

      try {
        await repository.softDelete(ctl, tin);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect((error as HttpException).getStatus()).toBe(HttpStatus.NOT_FOUND);
      }
    });
  });
});
