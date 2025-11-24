import { UploadOrchestrator } from "./upload.orchestrator";
import { FlowProducer } from "bullmq";
import { CompanyService } from "@src/main/account-payable/domain/services/company/companies.service";
import { VoucherSharedService } from "@src/main/account-payable/application/voucher/shared-services/voucher.shared.service";
import { QueueSelector } from "@src/shared/config/queue-selector";

// Mock the external dependencies
jest.mock("@src/shared/utils/xlsx.utils", () => ({
  parseXlsxWithRowHeaders: jest.fn(),
  filterAndNormalizeRows: jest.fn(),
}));

jest.mock("@src/shared/queue/bullmq-connection", () => ({
  redis_connection: "mock-redis-connection",
}));

jest.mock("@src/shared/utils/process-duration-tracker", () => ({
  setUploadStartTime: jest.fn(),
}));

// Mock IORedis completely
jest.mock("ioredis", () => {
  return jest.fn().mockImplementation(() => ({
    set: jest.fn(),
    get: jest.fn(),
  }));
});

// Import mocked functions
import {
  parseXlsxWithRowHeaders,
  filterAndNormalizeRows,
} from "@src/shared/utils/xlsx.utils";
import { setUploadStartTime } from "@src/shared/utils/process-duration-tracker";

describe("UploadOrchestrator", () => {
  let orchestrator: UploadOrchestrator;
  let mockFlowProducer: jest.Mocked<FlowProducer>;
  let mockCompanyService: jest.Mocked<CompanyService>;
  let mockVoucherSharedService: jest.Mocked<VoucherSharedService>;
  let mockQueueSelector: jest.Mocked<QueueSelector>;

  const mockConfig = {
    groupKeys: ["invoiceNo", "vendorNo"],
    batchSize: 100,
  };

  const mockFilePath = "/path/to/test.xlsx";
  const mockUploadType = "PAPER";
  const mockUploadId = "upload-123";
  const mockUserId = "user-456";
  const mockSubType = "freight";

  const mockDataRows = [
    { invoiceNo: "INV001", vendorNo: 1001, amount: 1000 },
    { invoiceNo: "INV002", vendorNo: 1001, amount: 2000 },
    { invoiceNo: "INV001", vendorNo: 1001, amount: 1500 },
    { invoiceNo: "INV003", vendorNo: 1002, amount: 3000 },
  ];

  const mockFilteredRows = [
    { invoiceNo: "INV001", vendorNo: 1001, amount: 1000 },
    { invoiceNo: "INV002", vendorNo: 1001, amount: 2000 },
    { invoiceNo: "INV001", vendorNo: 1001, amount: 1500 },
    { invoiceNo: "INV003", vendorNo: 1002, amount: 3000 },
  ];

  const mockCompany = {
    companyNo: 10,
    companyBankGlNo: 1000,
    companyApGlNo: 2000,
    companyName: "Test Company",
    companyAddress1: "",
    companyAddress2: "",
    companyAddress3: "",
    companyAddress4: "",
    companyCity: "",
    companyState: "",
    companyZip: "",
    companyPhone: "",
    companyFax: "",
    companyEmail: "",
    companyContact: "",
    companyNextEntryNo: 12345,
    companyDiscountsGlDesc: "",
    companyApGlDesc: "",
    companyBankGlDesc: "",
    isDeleted: "N",
    userProfile: "",
    createDate: 0,
    updateDate: 0,
  } as any;

  beforeEach(async () => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock the external utility functions
    (parseXlsxWithRowHeaders as jest.Mock).mockReturnValue(mockDataRows);
    (filterAndNormalizeRows as jest.Mock).mockReturnValue(mockFilteredRows);
    (setUploadStartTime as jest.Mock).mockResolvedValue(undefined);

    // Create mock instances
    mockFlowProducer = {
      add: jest.fn(),
    } as any;

    mockCompanyService = {
      findOne: jest.fn(),
    } as any;

    mockVoucherSharedService = {
      getAndIncrementNextEntryNo: jest.fn(),
    } as any;

    mockQueueSelector = {
      getQueueName: jest.fn(),
    } as any;

    orchestrator = new UploadOrchestrator(
      mockConfig,
      mockFilePath,
      mockFlowProducer,
      mockUploadType,
      mockUploadId,
      mockUserId,
      mockQueueSelector,
      mockCompanyService,
      mockVoucherSharedService,
      mockSubType
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should be defined", () => {
    expect(orchestrator).toBeDefined();
  });

  describe("process", () => {
    beforeEach(() => {
      mockCompanyService.findOne.mockResolvedValue(mockCompany);
      mockVoucherSharedService.getAndIncrementNextEntryNo.mockResolvedValue(
        12345
      );
      mockQueueSelector.getQueueName.mockReturnValue("paper-queue");
      mockFlowProducer.add.mockResolvedValue({
        job: { id: "parent-job-123" },
        children: [
          { job: { id: "child-job-1" } },
          { job: { id: "child-job-2" } },
        ],
      } as any);
    });

    it("should successfully process upload and return correct result", async () => {
      const result = await orchestrator.process();

      expect(result).toEqual({
        uploadId: mockUploadId,
        totalGroups: 3, // 3 unique groups based on invoiceNo + vendorNo
        totalBatches: 1, // 3 groups with batch size 100 = 1 batch
        parentJobId: "parent-job-123",
        childJobIds: ["child-job-1", "child-job-2"],
        groups: expect.any(Array),
      });

      expect(result.groups).toHaveLength(3);
    });

    it("should call external utilities with correct parameters", async () => {
      await orchestrator.process();

      expect(parseXlsxWithRowHeaders).toHaveBeenCalledWith(
        mockFilePath,
        mockSubType
      );
      expect(filterAndNormalizeRows).toHaveBeenCalledWith(
        mockDataRows,
        mockUploadType
      );
    });

    it("should group rows correctly by invoice and vendor", async () => {
      const result = await orchestrator.process();

      // Should have 3 groups: INV001+1001, INV002+1001, INV003+1002
      expect(result.groups).toHaveLength(3);

      const firstGroup = result.groups[0];
      expect(firstGroup?.header).toBeDefined();
      expect(firstGroup?.details).toHaveLength(2); // INV001+1001 has 2 rows

      const secondGroup = result.groups[1];
      expect(secondGroup?.header).toBeDefined();
      expect(secondGroup?.details).toHaveLength(1); // INV002+1001 has 1 row

      const thirdGroup = result.groups[2];
      expect(thirdGroup?.header).toBeDefined();
      expect(thirdGroup?.details).toHaveLength(1); // INV003+1002 has 1 row
    });

    it("should assign entry numbers to groups correctly", async () => {
      await orchestrator.process();

      expect(mockCompanyService.findOne).toHaveBeenCalledWith(10);
      expect(
        mockVoucherSharedService.getAndIncrementNextEntryNo
      ).toHaveBeenCalledWith(mockCompany, 3);
    });

    it("should create batches based on batch size", async () => {
      const result = await orchestrator.process();

      // With 3 groups and batch size 100, should have 1 batch
      expect(result.totalBatches).toBe(1);
    });

    it("should create multiple batches when groups exceed batch size", async () => {
      const smallBatchConfig = { ...mockConfig, batchSize: 1 };
      const smallBatchOrchestrator = new UploadOrchestrator(
        smallBatchConfig,
        mockFilePath,
        mockFlowProducer,
        mockUploadType,
        mockUploadId,
        mockUserId,
        mockQueueSelector,
        mockCompanyService,
        mockVoucherSharedService,
        mockSubType
      );

      const result = await smallBatchOrchestrator.process();

      // With 3 groups and batch size 1, should have 3 batches
      expect(result.totalBatches).toBe(3);
    });

    it("should call queue selector with correct upload type", async () => {
      await orchestrator.process();

      expect(mockQueueSelector.getQueueName).toHaveBeenCalledWith(
        mockUploadType
      );
    });

    it("should create flow producer job with correct structure", async () => {
      await orchestrator.process();

      expect(mockFlowProducer.add).toHaveBeenCalledWith({
        name: `${mockUploadType}-parent-job`,
        queueName: "paper-queue",
        data: { uploadId: mockUploadId, userId: mockUserId },
        children: expect.arrayContaining([
          expect.objectContaining({
            name: `${mockUploadType.toLowerCase()}-batch-0`,
            data: expect.objectContaining({
              uploadType: mockUploadType,
              uploadId: mockUploadId,
              userId: mockUserId,
              batchIndex: 0,
              totalBatches: 1,
              subType: mockSubType,
            }),
            queueName: "paper-queue",
          }),
        ]),
      });
    });

    it("should set upload start time before adding jobs", async () => {
      await orchestrator.process();

      expect(setUploadStartTime).toHaveBeenCalledWith(
        expect.any(Object),
        mockUploadId
      );
    });

    it("should handle empty data rows", async () => {
      (parseXlsxWithRowHeaders as jest.Mock).mockReturnValue([]);
      (filterAndNormalizeRows as jest.Mock).mockReturnValue([]);

      const result = await orchestrator.process();

      expect(result.totalGroups).toBe(0);
      expect(result.totalBatches).toBe(0);
      expect(result.groups).toHaveLength(0);
    });
  });

  describe("groupByKeys", () => {
    it("should group rows by specified keys", () => {
      const rows = [
        { invoiceNo: "INV001", vendorNo: 1001, amount: 1000 },
        { invoiceNo: "INV001", vendorNo: 1001, amount: 1500 },
        { invoiceNo: "INV002", vendorNo: 1001, amount: 2000 },
      ];

      const keys = ["invoiceNo", "vendorNo"];
      const result = orchestrator.groupByKeys(rows, keys);

      expect(result).toHaveLength(2);

      const firstGroup = result[0];
      expect(firstGroup?.header.invoiceNo).toBe("INV001");
      expect(firstGroup?.header.vendorNo).toBe(1001);
      expect(firstGroup?.details).toHaveLength(2);

      const secondGroup = result[1];
      expect(secondGroup?.header.invoiceNo).toBe("INV002");
      expect(secondGroup?.header.vendorNo).toBe(1001);
      expect(secondGroup?.details).toHaveLength(1);
    });

    it("should handle single key grouping", () => {
      const rows = [
        { invoiceNo: "INV001", amount: 1000 },
        { invoiceNo: "INV001", amount: 1500 },
        { invoiceNo: "INV002", amount: 2000 },
      ];

      const keys = ["invoiceNo"];
      const result = orchestrator.groupByKeys(rows, keys);

      expect(result).toHaveLength(2);

      const firstGroup = result[0];
      expect(firstGroup?.header.invoiceNo).toBe("INV001");
      expect(firstGroup?.details).toHaveLength(2);

      const secondGroup = result[1];
      expect(secondGroup?.header.invoiceNo).toBe("INV002");
      expect(secondGroup?.details).toHaveLength(1);
    });

    it("should handle empty rows array", () => {
      const result = orchestrator.groupByKeys([], ["invoiceNo"]);
      expect(result).toHaveLength(0);
    });
  });

  describe("assignEntryNumbersToGroups", () => {
    beforeEach(() => {
      mockCompanyService.findOne.mockResolvedValue(mockCompany);
      mockVoucherSharedService.getAndIncrementNextEntryNo.mockResolvedValue(
        12345
      );
    });

    it("should assign entry numbers and company data to groups", async () => {
      const groups = [
        { header: {} as any, details: [{} as any, {} as any] },
        { header: {} as any, details: [{} as any] },
      ];

      await orchestrator.assignEntryNumbersToGroups(groups, 10);

      expect(mockCompanyService.findOne).toHaveBeenCalledWith(10);
      expect(
        mockVoucherSharedService.getAndIncrementNextEntryNo
      ).toHaveBeenCalledWith(mockCompany, 2);

      // Check that entry numbers are assigned correctly
      expect(groups[0]?.header.entryNo).toBe(12345);
      expect(groups[0]?.header.companyNo).toBe(10);
      expect(groups[0]?.header.bankGl).toBe(1000);
      expect(groups[0]?.header.apGlNo).toBe(2000);

      expect(groups[1]?.header.entryNo).toBe(12346);
      expect(groups[1]?.header.companyNo).toBe(10);
      expect(groups[1]?.header.bankGl).toBe(1000);
      expect(groups[1]?.header.apGlNo).toBe(2000);

      // Check that details have correct entry numbers and sequences
      expect(groups[0]?.details[0]?.entryNo).toBe(12345);
      expect(groups[0]?.details[0]?.companyNo).toBe(10);
      expect(groups[0]?.details[0]?.entrySequence).toBe(1);

      expect(groups[0]?.details[1]?.entryNo).toBe(12345);
      expect(groups[0]?.details[1]?.companyNo).toBe(10);
      expect(groups[0]?.details[1]?.entrySequence).toBe(2);

      expect(groups[1]?.details[0]?.entryNo).toBe(12346);
      expect(groups[1]?.details[0]?.companyNo).toBe(10);
      expect(groups[1]?.details[0]?.entrySequence).toBe(1);
    });

    it("should handle empty groups array", async () => {
      await orchestrator.assignEntryNumbersToGroups([], 10);

      expect(mockCompanyService.findOne).toHaveBeenCalledWith(10);
      expect(
        mockVoucherSharedService.getAndIncrementNextEntryNo
      ).toHaveBeenCalledWith(mockCompany, 0);
    });
  });

  describe("chunkArray", () => {
    it("should chunk array into correct sizes", () => {
      const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const size = 3;

      const result = orchestrator["chunkArray"](array, size);

      expect(result).toHaveLength(4);
      expect(result[0]).toEqual([1, 2, 3]);
      expect(result[1]).toEqual([4, 5, 6]);
      expect(result[2]).toEqual([7, 8, 9]);
      expect(result[3]).toEqual([10]);
    });

    it("should handle array smaller than chunk size", () => {
      const array = [1, 2];
      const size = 5;

      const result = orchestrator["chunkArray"](array, size);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual([1, 2]);
    });

    it("should handle empty array", () => {
      const result = orchestrator["chunkArray"]([], 5);
      expect(result).toHaveLength(0);
    });

    it("should handle chunk size of 1", () => {
      const array = [1, 2, 3];
      const size = 1;

      const result = orchestrator["chunkArray"](array, size);

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual([1]);
      expect(result[1]).toEqual([2]);
      expect(result[2]).toEqual([3]);
    });
  });

  describe("error handling", () => {
    it("should handle company service errors", async () => {
      mockCompanyService.findOne.mockRejectedValue(
        new Error("Company not found")
      );

      await expect(orchestrator.process()).rejects.toThrow("Company not found");
    });

    it("should handle voucher shared service errors", async () => {
      mockVoucherSharedService.getAndIncrementNextEntryNo.mockRejectedValue(
        new Error("Failed to get entry number")
      );

      await expect(orchestrator.process()).rejects.toThrow(
        "Failed to get entry number"
      );
    });

    it("should handle flow producer errors", async () => {
      // Set up the mocks needed for the process method to reach the flow producer
      mockCompanyService.findOne.mockResolvedValue(mockCompany);
      mockVoucherSharedService.getAndIncrementNextEntryNo.mockResolvedValue(
        12345
      );
      mockQueueSelector.getQueueName.mockReturnValue("paper-queue");

      // Now mock the flow producer to throw an error
      mockFlowProducer.add.mockRejectedValue(
        new Error("Failed to create flow")
      );

      await expect(orchestrator.process()).rejects.toThrow(
        "Failed to create flow"
      );
    });

    it("should handle external utility errors", async () => {
      (parseXlsxWithRowHeaders as jest.Mock).mockImplementation(() => {
        throw new Error("Failed to parse Excel file");
      });

      await expect(orchestrator.process()).rejects.toThrow(
        "Failed to parse Excel file"
      );
    });
  });
});
