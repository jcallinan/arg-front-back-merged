import { Test, TestingModule } from "@nestjs/testing";
import { OwnerVendorReferenceRepository } from "./owner-vendor-reference.repository";
import { OwnerVendorReferenceModel } from "../models/owner-vendor-reference.model";
import { VendorModel } from "../models/vendor.model";
import { SequelizeModelFactory } from "@src/shared/tests";

// Mock the ownerVendorMapper to avoid Sequelize model initialization issues
jest.mock("../mappers/owner-vendor.mapper", () => ({
  ownerVendorMapper: jest.fn().mockImplementation((row) => ({
    ownerNo: row.ownerNo || 1,
    vendorNo: row.vendorNo || 100,
    isDeleted: row.isDeleted || "A",
    vendorDetails: row.vendorDetails || { vendorName: "Test Vendor" },
  })),
}));

// Mock the vendorOwnerFormatter to avoid initialization issues
jest.mock("@src/shared/formatters/dropdown.formatter", () => ({
  vendorOwnerFormatter: jest.fn().mockImplementation((rows) =>
    rows.map((row: any) => ({
      ownerNo: row.ownerNo || 1,
      vendorNo: row.vendorNo || 100,
      vendorName: row.vendorName || "Test Vendor",
      isDeleted: row.isDeleted || "A",
    }))
  ),
}));

// Mock the logger to avoid initialization issues
jest.mock("@src/shared/logger/logger.service", () => ({
  AppLogger: jest.fn().mockImplementation(() => ({
    debug: jest.fn(),
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  })),
}));

// Mock Sequelize model initialization
jest.mock("../models/owner-vendor-reference.model", () => ({
  OwnerVendorReferenceModel: {
    findOne: jest.fn(),
    create: jest.fn(),
    init: jest.fn(),
    sync: jest.fn(),
    rawAttributes: {},
    _schema: {},
    _dialect: {},
    name: "OwnerVendorReferenceModel",
    tableName: "owner_vendor_reference",
  },
}));

jest.mock("../models/vendor.model", () => ({
  VendorModel: {
    findAndCountAll: jest.fn(),
    init: jest.fn(),
    sync: jest.fn(),
    rawAttributes: {},
    _schema: {},
    _dialect: {},
    name: "VendorModel",
    tableName: "vendor",
  },
}));

describe("OwnerVendorReferenceRepository", () => {
  let repository: OwnerVendorReferenceRepository;
  let ownerVendorModel: jest.Mocked<typeof OwnerVendorReferenceModel>;
  let vendorModel: jest.Mocked<typeof VendorModel>;

  const mockOwnerVendor = SequelizeModelFactory.createMockSequelizeModel({
    ownerNo: 1,
    vendorNo: 100,
    isDeleted: "A",
    vendorDetails: {
      vendorName: "Test Vendor",
    },
  });

  const mockVendor = SequelizeModelFactory.createMockSequelizeModel({
    vendorCompanyNumber: 1,
    vendorNo: 100,
    vendorName: "Test Vendor",
    vendorOwnerDetails: [
      {
        ownerNo: 1,
        vendorNo: 100,
        isDeleted: "A",
      },
    ],
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OwnerVendorReferenceRepository,
        {
          provide: "OwnerVendorReferenceModel",
          useValue: OwnerVendorReferenceModel,
        },
        {
          provide: "VendorModel",
          useValue: VendorModel,
        },
      ],
    }).compile();

    repository = module.get<OwnerVendorReferenceRepository>(
      OwnerVendorReferenceRepository
    );
    ownerVendorModel = module.get("OwnerVendorReferenceModel");
    vendorModel = module.get("VendorModel");

    // Reset all mocks
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(repository).toBeDefined();
  });

  describe("findActiveByOwnerNo", () => {
    it("should return active owner vendor when found", async () => {
      ownerVendorModel.findOne.mockResolvedValue(mockOwnerVendor);

      const result = await repository.findActiveByOwnerNo(1);

      expect(result).toBeDefined();
      expect(ownerVendorModel.findOne).toHaveBeenCalledWith({
        where: {
          ownerNo: 1,
          isDeleted: expect.any(Object),
        },
      });
    });

    it("should return null when owner vendor not found", async () => {
      ownerVendorModel.findOne.mockResolvedValue(null);

      const result = await repository.findActiveByOwnerNo(999);

      expect(result).toBeNull();
      expect(ownerVendorModel.findOne).toHaveBeenCalled();
    });

    it("should handle database errors gracefully", async () => {
      ownerVendorModel.findOne.mockRejectedValue(new Error("Database error"));

      await expect(repository.findActiveByOwnerNo(1)).rejects.toThrow(
        "Database error"
      );
    });
  });

  describe("findAndCountAll", () => {
    it("should return paginated owner vendor list successfully", async () => {
      const searchData = {
        vendorCompanyNumber: 1,
        vendorNo: 100,
        status: "A",
        ownerNo: 1,
        limit: 10,
        page: 1,
        offset: 0,
      };

      const mockResponse = {
        rows: [mockVendor],
        count: [{ count: 1 }],
      };

      vendorModel.findAndCountAll.mockResolvedValue(mockResponse);

      const result = await repository.findAndCountAll(searchData);

      expect(result).toBeDefined();
      expect(result.items).toBeDefined();
      expect(result.pagination.total_items).toBeDefined();
      expect(result.pagination.current_page).toBe(searchData.page);
      expect(result.pagination.items_per_page).toBe(searchData.limit);
      expect(vendorModel.findAndCountAll).toHaveBeenCalledWith({
        attributes: ["vendorCompanyNumber", "vendorNo", "vendorName"],
        where: {
          vendorCompanyNumber: 1,
          vendorNo: 100,
        },
        include: [
          {
            model: ownerVendorModel,
            as: "vendorOwnerDetails",
            required: false,
            attributes: ["ownerNo", "vendorNo", "isDeleted"],
            where: {
              vendorNo: 100,
              ownerNo: 1,
              isDeleted: "A",
            },
          },
        ],
        offset: 0,
        limit: 10,
      });
    });

    it("should handle search without optional parameters", async () => {
      const searchData = {
        vendorCompanyNumber: 1,
        limit: 10,
        page: 1,
        offset: 0,
      };

      const mockResponse = {
        rows: [mockVendor],
        count: [{ count: 1 }],
      };

      vendorModel.findAndCountAll.mockResolvedValue(mockResponse);

      const result = await repository.findAndCountAll(searchData);

      expect(result).toBeDefined();
      expect(vendorModel.findAndCountAll).toHaveBeenCalledWith({
        attributes: ["vendorCompanyNumber", "vendorNo", "vendorName"],
        where: {
          vendorCompanyNumber: 1,
        },
        include: [
          {
            model: ownerVendorModel,
            as: "vendorOwnerDetails",
            required: false,
            attributes: ["ownerNo", "vendorNo", "isDeleted"],
            where: {},
          },
        ],
        offset: 0,
        limit: 10,
      });
    });

    it("should handle database errors gracefully", async () => {
      const searchData = {
        vendorCompanyNumber: 1,
        limit: 10,
        page: 1,
        offset: 0,
      };

      vendorModel.findAndCountAll.mockRejectedValue(
        new Error("Database error")
      );

      await expect(repository.findAndCountAll(searchData)).rejects.toThrow(
        "Database error"
      );
    });
  });

  describe("findOne", () => {
    it("should return owner vendor with vendor details when found", async () => {
      ownerVendorModel.findOne.mockResolvedValue(mockOwnerVendor);

      const result = await repository.findOne(100, 1);

      expect(result).toBeDefined();
      expect(ownerVendorModel.findOne).toHaveBeenCalledWith({
        where: {
          ownerNo: 1,
          vendorNo: 100,
        },
        include: [
          {
            model: vendorModel,
            as: "vendorDetails",
            required: false,
            attributes: ["vendorName"],
            where: {
              vendorNo: 100,
            },
          },
        ],
      });
    });

    it("should return null when owner vendor not found", async () => {
      ownerVendorModel.findOne.mockResolvedValue(null);

      const result = await repository.findOne(999, 999);

      expect(result).toBeNull();
      expect(ownerVendorModel.findOne).toHaveBeenCalled();
    });

    it("should handle database errors gracefully", async () => {
      ownerVendorModel.findOne.mockRejectedValue(new Error("Database error"));

      await expect(repository.findOne(100, 1)).rejects.toThrow(
        "Database error"
      );
    });
  });

  describe("createOrUpdateOwner", () => {
    it("should create new owner vendor successfully", async () => {
      ownerVendorModel.findOne.mockResolvedValue(null);
      ownerVendorModel.create.mockResolvedValue(mockOwnerVendor);

      const result = await repository.createOrUpdateOwner(1, 100, "A");

      expect(result.message).toBe("Owner Details Save Successfully");
      expect(ownerVendorModel.findOne).toHaveBeenCalledWith({
        where: {
          ownerNo: 1,
        },
      });
      expect(ownerVendorModel.create).toHaveBeenCalledWith({
        ownerNo: 1,
        vendorNo: 100,
        isDeleted: "A",
      });
    });

    it("should update existing owner vendor successfully", async () => {
      const existingOwnerVendor = {
        ...mockOwnerVendor,
        update: jest.fn().mockResolvedValue(mockOwnerVendor),
      };

      ownerVendorModel.findOne.mockResolvedValue(existingOwnerVendor);

      const result = await repository.createOrUpdateOwner(1, 200, "I");

      expect(result.message).toBe("Owner Details Updated Successfully");
      expect(ownerVendorModel.findOne).toHaveBeenCalledWith({
        where: {
          ownerNo: 1,
        },
      });
      expect(existingOwnerVendor.update).toHaveBeenCalledWith({
        vendorNo: 200,
        isDeleted: "I",
      });
    });

    it("should handle database errors gracefully", async () => {
      ownerVendorModel.findOne.mockRejectedValue(new Error("Database error"));

      await expect(repository.createOrUpdateOwner(1, 100, "A")).rejects.toThrow(
        "Database error"
      );
    });
  });
});
