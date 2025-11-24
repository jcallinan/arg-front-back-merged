import { Test, TestingModule } from "@nestjs/testing";
import { ClearChecksController } from "./clear-checks.controller";
import { ClearChecksUploadUseCase } from "../usecases/upload/upload.usecase";
import { ValidateSingleCheckUseCase } from "../usecases/validate-single-check/validate-single-check.usecase";
import { ProcessMultipleChecksUseCase } from "../usecases/process-multiple-checks/process-multiple-checks.usecase";
import {
  SingleCheckValidationDto,
  SingleCheckValidationResponseDto,
} from "../dto/clear-checks.dto";

describe("ClearChecksController", () => {
  let controller: ClearChecksController;

  const mockUploadUseCase = {
    execute: jest.fn(),
  };

  const mockValidateSingleCheckUseCase = {
    execute: jest.fn(),
  };

  const mockProcessMultipleChecksUseCase = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClearChecksController],
      providers: [
        {
          provide: ClearChecksUploadUseCase,
          useValue: mockUploadUseCase,
        },
        {
          provide: ValidateSingleCheckUseCase,
          useValue: mockValidateSingleCheckUseCase,
        },
        {
          provide: ProcessMultipleChecksUseCase,
          useValue: mockProcessMultipleChecksUseCase,
        },
      ],
    }).compile();

    controller = module.get<ClearChecksController>(ClearChecksController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("validateSingleCheck", () => {
    it("should validate a single check successfully", async () => {
      const validationData: SingleCheckValidationDto = {
        checkNo: "210091",
        checkAmount: 11.55,
        checkDate: "061025",
      };

      const mockValidationResult: SingleCheckValidationResponseDto = {
        checkNo: "210091",
        checkAmount: 11.55,
        checkDate: "061025",
        isValid: true,
        errors: [],
        warnings: [],
      };

      mockValidateSingleCheckUseCase.execute.mockResolvedValue(
        mockValidationResult
      );

      const result = await controller.validateSingleCheck(validationData);

      expect(result.items.isValid).toBe(true);
      expect(result.items.errors).toHaveLength(0);
      expect(result.items.checkNo).toBe("210091");
      expect(result.items.checkAmount).toBe(11.55);
      expect(result.items.checkDate).toBe("061025");
      expect(mockValidateSingleCheckUseCase.execute).toHaveBeenCalledWith(
        validationData
      );
    });

    it("should return validation errors when check is invalid", async () => {
      const validationData: SingleCheckValidationDto = {
        checkNo: "999999",
        checkAmount: 100.0,
        checkDate: "061025",
      };

      const mockValidationResult: SingleCheckValidationResponseDto = {
        checkNo: "999999",
        checkAmount: 100.0,
        checkDate: "061025",
        isValid: false,
        errors: [
          {
            field: "checkNo",
            message: "Check not found in database",
            code: "CHECK_NOT_FOUND",
          },
        ],
        warnings: [],
      };

      mockValidateSingleCheckUseCase.execute.mockResolvedValue(
        mockValidationResult
      );

      const result = await controller.validateSingleCheck(validationData);

      expect(result.items.isValid).toBe(false);
      expect(result.items.errors).toHaveLength(1);
      expect(result.items.errors?.[0]?.code).toBe("CHECK_NOT_FOUND");
      expect(result.items.errors?.[0]?.message).toBe(
        "Check not found in database"
      );
      expect(mockValidateSingleCheckUseCase.execute).toHaveBeenCalledWith(
        validationData
      );
    });

    it("should handle use case errors gracefully", async () => {
      const validationData: SingleCheckValidationDto = {
        checkNo: "999999",
        checkAmount: 100.0,
        checkDate: "061025",
      };

      mockValidateSingleCheckUseCase.execute.mockRejectedValue(
        new Error("Database connection failed")
      );

      await expect(
        controller.validateSingleCheck(validationData)
      ).rejects.toThrow("Database connection failed");
    });
  });
});
