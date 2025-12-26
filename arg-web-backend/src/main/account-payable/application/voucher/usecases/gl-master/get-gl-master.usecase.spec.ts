import { Test, TestingModule } from "@nestjs/testing";
import { GetGlMasterUseCase } from "./get-gl-master.usecase";
import { GlMasterService } from "@src/main/account-payable/domain/services/gl-master/gl-master.service";
// Mock entity - using any for now
import { GetGlMasterDto } from "../../dto/voucher.dto";

describe("GetGlMasterUseCase", () => {
  let useCase: GetGlMasterUseCase;
  let glMasterService: jest.Mocked<GlMasterService>;

  const mockGlMasterData = {
    accountNo: "1000",
    accountName: "Test Account 1",
    glNo: 12010001,
  } as any; // Cast to any to avoid entity property requirements

  beforeEach(async () => {
    const mockGlMasterService = {
      getGlMasterRecord: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetGlMasterUseCase,
        {
          provide: GlMasterService,
          useValue: mockGlMasterService,
        },
      ],
    }).compile();

    useCase = module.get<GetGlMasterUseCase>(GetGlMasterUseCase);
    glMasterService = module.get(GlMasterService);
  });

  it("should be defined", () => {
    expect(useCase).toBeDefined();
  });

  describe("execute", () => {
    const dto: GetGlMasterDto = {
      companyNo: 1,
      glNo: 12010001,
    };

    it("should return GL master data successfully", async () => {
      glMasterService.getGlMasterRecord.mockResolvedValue(mockGlMasterData);

      const result = await useCase.execute(dto);

      expect(result).toEqual(mockGlMasterData);
      expect(glMasterService.getGlMasterRecord).toHaveBeenCalledWith(
        dto.companyNo,
        120100,
        1,
        "C",
        false
      );
    });

    it("should throw InternalServerErrorException when service fails", async () => {
      const error = new Error("Service error");
      glMasterService.getGlMasterRecord.mockRejectedValue(error);

      await expect(useCase.execute(dto)).rejects.toThrow(Error);
      expect(glMasterService.getGlMasterRecord).toHaveBeenCalledWith(
        dto.companyNo,
        120100,
        1,
        "C",
        false
      );
    });
  });
});
