export interface UploadFileFactoryOptions {
  fieldname?: string;
  originalname?: string;
  encoding?: string;
  mimetype?: string;
  size?: number;
  destination?: string;
  filename?: string;
  path?: string;
  buffer?: Buffer;
}

export interface UploadConfigFactoryOptions {
  expectedHeaders?: string[];
}

export interface UploadOrchestratorResultFactoryOptions {
  uploadId?: string;
  totalBatches?: number;
  totalGroups?: number;
  parentJobId?: string;
  childJobIds?: string[];
  groups?: Array<{
    header: { uploadId: string };
    details: any[];
  }>;
}

export interface UploadCleanupResultFactoryOptions {
  deletedHeaders?: number;
  deletedDetails?: number;
}

export class UploadFactory {
  /**
   * Creates a basic upload file mock with default values
   */
  static createUploadFile(overrides: Partial<UploadFileFactoryOptions> = {}) {
    const defaultFile: UploadFileFactoryOptions = {
      fieldname: "file",
      originalname: "test.xlsx",
      encoding: "7bit",
      mimetype:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      size: 1024,
      destination: "uploads/csv/FLEXI",
      filename: "file-1234567890-uuid.xlsx",
      path: "/tmp/test-file.xlsx",
      buffer: Buffer.from("test data"),
    };

    return { ...defaultFile, ...overrides };
  }

  /**
   * Creates a CSV upload file mock
   */
  static createCsvUploadFile(
    overrides: Partial<UploadFileFactoryOptions> = {}
  ) {
    return this.createUploadFile({
      originalname: "test.csv",
      mimetype: "text/csv",
      destination: "uploads/csv/FLEXI",
      filename: "file-1234567890-uuid.csv",
      path: "/tmp/test-file.csv",
      ...overrides,
    });
  }

  /**
   * Creates an Excel upload file mock
   */
  static createExcelUploadFile(
    overrides: Partial<UploadFileFactoryOptions> = {}
  ) {
    return this.createUploadFile({
      originalname: "test.xlsx",
      mimetype:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      destination: "uploads/csv/FLEXI",
      filename: "file-1234567890-uuid.xlsx",
      path: "/tmp/test-file.xlsx",
      ...overrides,
    });
  }

  /**
   * Creates a basic upload config with default values
   */
  static createUploadConfig(
    overrides: Partial<UploadConfigFactoryOptions> = {}
  ) {
    const defaultConfig: UploadConfigFactoryOptions = {
      expectedHeaders: ["header1", "header2", "header3"],
    };

    return { ...defaultConfig, ...overrides };
  }

  /**
   * Creates a basic upload orchestrator result with default values
   */
  static createUploadOrchestratorResult(
    overrides: Partial<UploadOrchestratorResultFactoryOptions> = {}
  ) {
    const defaultResult: UploadOrchestratorResultFactoryOptions = {
      uploadId: "U-12345-uuid",
      totalBatches: 5,
      totalGroups: 3,
      parentJobId: "JOB001",
      childJobIds: ["CHILD001", "CHILD002"],
      groups: [
        { header: { uploadId: "U-12345-uuid" }, details: [] },
        { header: { uploadId: "U-12345-uuid" }, details: [] },
      ],
    };

    return { ...defaultResult, ...overrides };
  }

  /**
   * Creates a basic upload cleanup result with default values
   */
  static createUploadCleanupResult(
    overrides: Partial<UploadCleanupResultFactoryOptions> = {}
  ) {
    const defaultResult: UploadCleanupResultFactoryOptions = {
      deletedHeaders: 0,
      deletedDetails: 0,
    };

    return { ...defaultResult, ...overrides };
  }

  /**
   * Creates a user request mock
   */
  static createUserRequest(userId: string = "user123") {
    return { user: { id: userId } };
  }

  /**
   * Creates a flexi upload file mock
   */
  static createFlexiUploadFile(
    overrides: Partial<UploadFileFactoryOptions> = {}
  ) {
    return this.createCsvUploadFile({
      destination: "uploads/csv/FLEXI",
      ...overrides,
    });
  }

  /**
   * Creates a sogas upload file mock
   */
  static createSogasUploadFile(
    overrides: Partial<UploadFileFactoryOptions> = {}
  ) {
    return this.createCsvUploadFile({
      destination: "uploads/csv/SOGAS",
      ...overrides,
    });
  }

  /**
   * Creates a paper upload file mock
   */
  static createPaperUploadFile(
    overrides: Partial<UploadFileFactoryOptions> = {}
  ) {
    return this.createCsvUploadFile({
      destination: "uploads/csv/PAPER",
      ...overrides,
    });
  }

  /**
   * Creates an LMS upload file mock
   */
  static createLmsUploadFile(
    overrides: Partial<UploadFileFactoryOptions> = {}
  ) {
    return this.createCsvUploadFile({
      destination: "uploads/csv/LMS",
      ...overrides,
    });
  }
}
