// upload.usecase.spec.ts

import { ClearChecksUploadUseCase } from "./upload.usecase";
import { QueueSelector } from "@src/shared/config/queue-selector";
import { ProcessType } from "@src/shared/constants/strategy-type.enum";
import { getProcessTypeConfig } from "@src/shared/config/process-config";
import { setUploadStartTime } from "@src/shared/utils/process-duration-tracker";
import {
  parseXlsxWithRowHeaders,
  filterAndNormalizeRows,
} from "@src/shared/utils/xlsx.utils";

// Mock external dependencies
jest.mock("@src/shared/config/process-config");
jest.mock("@src/shared/utils/process-duration-tracker");
jest.mock("@src/shared/utils/xlsx.utils");
jest.mock("@src/shared/queue/bullmq-connection", () => ({
  redis_connection: "mock-redis-connection",
}));

// Mock BullMQ
const mockFlowProducer = {
  add: jest.fn(),
};

jest.mock("bullmq", () => ({
  FlowProducer: jest.fn().mockImplementation(() => mockFlowProducer),
}));

// Mock ioredis
const mockRedis = {
  set: jest.fn(),
};

jest.mock("ioredis", () => jest.fn().mockImplementation(() => mockRedis));

describe("ClearChecksUploadUseCase", () => {
  let useCase: ClearChecksUploadUseCase;
  let queueSelector: jest.Mocked<QueueSelector>;

  beforeEach(() => {
    queueSelector = {
      getQueueName: jest.fn(),
    } as jest.Mocked<QueueSelector>;

    useCase = new ClearChecksUploadUseCase(queueSelector);

    // Reset mocks
    jest.clearAllMocks();

    // Mock process config
    (getProcessTypeConfig as jest.Mock).mockReturnValue({
      batchSize: 100,
    });

    // Mock xlsx utils
    (parseXlsxWithRowHeaders as jest.Mock).mockReturnValue([
      {
        "check No": "123",
        "Check Amount": "100.00",
        year: "2024",
        month: "01",
        date: "15",
      },
      {
        "check No": "124",
        "Check Amount": "200.00",
        year: "2024",
        month: "01",
        date: "16",
      },
    ]);

    (filterAndNormalizeRows as jest.Mock).mockReturnValue([
      {
        "check No": "123",
        "Check Amount": "100.00",
        year: "2024",
        month: "01",
        date: "15",
      },
      {
        "check No": "124",
        "Check Amount": "200.00",
        year: "2024",
        month: "01",
        date: "16",
      },
    ]);

    // Mock queue selector
    queueSelector.getQueueName.mockReturnValue("test-queue");

    // Mock flow producer
    mockFlowProducer.add.mockResolvedValue({
      job: { id: "parent-job-123" },
      children: [
        { job: { id: "child-job-1" } },
        { job: { id: "child-job-2" } },
      ],
    });

    // Mock setUploadStartTime
    (setUploadStartTime as jest.Mock).mockResolvedValue(undefined);
  });

  it("should upload clear checks successfully with UI headers", async () => {
    const userId = "user123";
    const uploadType = ProcessType.CLEAR_CHECKS;
    const file = { path: "/path/to/file.xlsx" };

    const result = await useCase.execute(userId, uploadType, file);

    expect(result).toEqual({
      message: "ClearChecks accepted, split into batches",
      uploadId: expect.stringMatching(/^CC-\d+-[a-f0-9-]+$/),
      totalGroups: 2,
      totalBatches: 1,
      parentJobId: "parent-job-123",
      childJobIds: ["child-job-1", "child-job-2"],
    });

    expect(parseXlsxWithRowHeaders).toHaveBeenCalledWith("/path/to/file.xlsx");
    expect(filterAndNormalizeRows).toHaveBeenCalledWith(
      expect.any(Array),
      ProcessType.CLEAR_CHECKS
    );
    expect(queueSelector.getQueueName).toHaveBeenCalledWith(uploadType);
    expect(setUploadStartTime).toHaveBeenCalledWith(
      mockRedis,
      expect.stringMatching(/^CC-\d+-[a-f0-9-]+$/)
    );
  });

  it("should handle APCHKR headers format", async () => {
    (parseXlsxWithRowHeaders as jest.Mock).mockReturnValue([
      { AMCHKN: "123", AMCKAM: "100.00", AMCLDT: "20240115" },
      { AMCHKN: "124", AMCKAM: "200.00", AMCLDT: "20240116" },
    ]);

    (filterAndNormalizeRows as jest.Mock).mockReturnValue([
      { AMCHKN: "123", AMCKAM: "100.00", AMCLDT: "20240115" },
      { AMCHKN: "124", AMCKAM: "200.00", AMCLDT: "20240116" },
    ]);

    const userId = "user123";
    const uploadType = ProcessType.CLEAR_CHECKS;
    const file = { path: "/path/to/file.xlsx" };

    const result = await useCase.execute(userId, uploadType, file);

    expect(result.totalGroups).toBe(2);
    expect(result.totalBatches).toBe(1);
  });

  it("should handle legend headers format", async () => {
    (parseXlsxWithRowHeaders as jest.Mock).mockReturnValue([
      { AMCHKN: "AMCHKN", AMCKAM: "AMCKAM", YYYY: "YYYY", MM: "MM", DD: "DD" },
      { AMCHKN: "123", AMCKAM: "100.00", YYYY: "2024", MM: "01", DD: "15" },
      { AMCHKN: "124", AMCKAM: "200.00", YYYY: "2024", MM: "01", DD: "16" },
    ]);

    (filterAndNormalizeRows as jest.Mock).mockReturnValue([
      { AMCHKN: "123", AMCKAM: "100.00", YYYY: "2024", MM: "01", DD: "15" },
      { AMCHKN: "124", AMCKAM: "200.00", YYYY: "2024", MM: "01", DD: "16" },
    ]);

    const userId = "user123";
    const uploadType = ProcessType.CLEAR_CHECKS;
    const file = { path: "/path/to/file.xlsx" };

    const result = await useCase.execute(userId, uploadType, file);

    expect(result.totalGroups).toBe(2);
    expect(result.totalBatches).toBe(1);
  });

  it("should throw error for unsupported upload type", async () => {
    (getProcessTypeConfig as jest.Mock).mockReturnValue(null);

    const userId = "user123";
    const uploadType = ProcessType.CLEAR_CHECKS;
    const file = { path: "/path/to/file.xlsx" };

    await expect(useCase.execute(userId, uploadType, file)).rejects.toThrow(
      "Unsupported upload type: clear-checks"
    );
  });

  it("should throw error for empty file", async () => {
    (parseXlsxWithRowHeaders as jest.Mock).mockReturnValue([]);

    const userId = "user123";
    const uploadType = ProcessType.CLEAR_CHECKS;
    const file = { path: "/path/to/file.xlsx" };
    await expect(useCase.execute(userId, uploadType, file)).rejects.toThrow(
      "Header mismatch: expected UI headers [check No, Check Amount, year, month, date] or APCHKR headers [AMCHKN, AMCKAM, AMCLDT/AMCLD8] or legend headers [AMCHKN, AMCKAM, YYYY, MM, DD]"
    );
  });

  it("should throw error for header mismatch", async () => {
    (parseXlsxWithRowHeaders as jest.Mock).mockReturnValue([
      { invalid: "header", another: "header" },
    ]);

    const userId = "user123";
    const uploadType = ProcessType.CLEAR_CHECKS;
    const file = { path: "/path/to/file.xlsx" };

    await expect(useCase.execute(userId, uploadType, file)).rejects.toThrow(
      "Header mismatch: expected UI headers [check No, Check Amount, year, month, date] or APCHKR headers [AMCHKN, AMCKAM, AMCLDT/AMCLD8] or legend headers [AMCHKN, AMCKAM, YYYY, MM, DD]"
    );
  });

  it("should create multiple batches when data exceeds batch size", async () => {
    (getProcessTypeConfig as jest.Mock).mockReturnValue({
      batchSize: 1,
    });

    (filterAndNormalizeRows as jest.Mock).mockReturnValue([
      {
        "check No": "123",
        "Check Amount": "100.00",
        year: "2024",
        month: "01",
        date: "15",
      },
      {
        "check No": "124",
        "Check Amount": "200.00",
        year: "2024",
        month: "01",
        date: "16",
      },
    ]);

    const userId = "user123";
    const uploadType = ProcessType.CLEAR_CHECKS;
    const file = { path: "/path/to/file.xlsx" };

    const result = await useCase.execute(userId, uploadType, file);

    expect(result.totalBatches).toBe(2);
  });

  it("should log upload information", async () => {
    const userId = "user123";
    const uploadType = ProcessType.CLEAR_CHECKS;
    const file = { path: "/path/to/file.xlsx" };

    const logSpy = jest.spyOn(useCase["logger"], "log");

    await useCase.execute(userId, uploadType, file);

    expect(logSpy).toHaveBeenCalledWith(
      `[INFO] Uploading ClearChecks for ${uploadType}`
    );
  });

  it("should filter out legend rows", async () => {
    (parseXlsxWithRowHeaders as jest.Mock).mockReturnValue([
      {
        "check No": "AMCHKN",
        "Check Amount": "AMCKAM",
        year: "YYYY",
        month: "MM",
        date: "DD",
      },
      {
        "check No": "123",
        "Check Amount": "100.00",
        year: "2024",
        month: "01",
        date: "15",
      },
      {
        "check No": "124",
        "Check Amount": "200.00",
        year: "2024",
        month: "01",
        date: "16",
      },
    ]);

    (filterAndNormalizeRows as jest.Mock).mockReturnValue([
      {
        "check No": "123",
        "Check Amount": "100.00",
        year: "2024",
        month: "01",
        date: "15",
      },
      {
        "check No": "124",
        "Check Amount": "200.00",
        year: "2024",
        month: "01",
        date: "16",
      },
    ]);

    const userId = "user123";
    const uploadType = ProcessType.CLEAR_CHECKS;
    const file = { path: "/path/to/file.xlsx" };

    const result = await useCase.execute(userId, uploadType, file);

    expect(result.totalGroups).toBe(2);
  });
});
