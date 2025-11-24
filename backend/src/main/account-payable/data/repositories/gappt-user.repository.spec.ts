import { GapptUserRepository } from "./gappt-user.repository";
import { DynamicModelInitializationRepository } from "@src/shared/infrastructure/data/repository/dynamic-model-initialization.repository";
import { gapptUserMapper } from "../mappers/gappt-user.mappers";

jest.mock("@src/shared/infrastructure/connection", () => ({
  getAs400SequelizeInstance: jest.fn().mockReturnValue({ id: "sequelize" }),
}));

jest.mock("../models/gappt-user.dynamic.model", () => ({
  GapptUserModel: jest.fn(),
}));

jest.mock("../mappers/gappt-user.mappers", () => ({
  gapptUserMapper: jest.fn(),
}));

describe("GapptUserRepository", () => {
  let repo: GapptUserRepository;
  let mockDynamicModelInitializationRepository: jest.Mocked<DynamicModelInitializationRepository>;
  const userId = "CH";

  beforeEach(() => {
    jest.clearAllMocks();

    mockDynamicModelInitializationRepository = {
      initDynamicTable: jest.fn(),
    } as any;

    repo = new GapptUserRepository(mockDynamicModelInitializationRepository);
  });

  describe("findByEntrySequence", () => {
    it("returns mapped entity when record found", async () => {
      // Arrange
      const record = { entrySequence: "00001", status: "A" } as any;
      const mockModel = { findOne: jest.fn().mockResolvedValue(record) } as any;
      mockDynamicModelInitializationRepository.initDynamicTable.mockReturnValue(
        mockModel
      );
      (gapptUserMapper as jest.Mock).mockReturnValue({ mapped: true });

      // Act
      const res = await repo.findByEntrySequence("00001", userId);

      // Assert
      expect(
        mockDynamicModelInitializationRepository.initDynamicTable
      ).toHaveBeenCalledWith("GapptUser", { suffix: "CH" });
      expect(mockModel.findOne).toHaveBeenCalledWith({
        where: { entrySequence: "00001" },
        raw: true,
      });
      expect(gapptUserMapper).toHaveBeenCalledWith(record);
      expect(res).toEqual({ mapped: true });
    });

    it("returns mapped entity when record not found (null)", async () => {
      // Arrange
      const mockModel = { findOne: jest.fn().mockResolvedValue(null) } as any;
      mockDynamicModelInitializationRepository.initDynamicTable.mockReturnValue(
        mockModel
      );
      (gapptUserMapper as jest.Mock).mockReturnValue(null);

      // Act
      const res = await repo.findByEntrySequence("99999", userId);

      // Assert
      expect(
        mockDynamicModelInitializationRepository.initDynamicTable
      ).toHaveBeenCalledWith("GapptUser", { suffix: "CH" });
      expect(mockModel.findOne).toHaveBeenCalledWith({
        where: { entrySequence: "99999" },
        raw: true,
      });
      expect(gapptUserMapper).toHaveBeenCalledWith(null);
      expect(res).toBeNull();
    });

    it("throws error when model initialization fails", async () => {
      // Arrange
      mockDynamicModelInitializationRepository.initDynamicTable.mockReturnValue(
        null
      );

      // Act & Assert
      await expect(repo.findByEntrySequence("00001", userId)).rejects.toThrow(
        "Failed to initialize dynamic model for GAPPTCH"
      );
    });
  });
});
