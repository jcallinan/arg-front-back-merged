import { vi } from "vitest";

// Mock voucher data for testing
export const mockVoucherData = {
  voucherNo: 12345,
  companyNo: 10,
  vendorNo: 1001,
  vendorName: "Test Vendor Company",
  invoiceNumber: "INV-2024-001",
  invoiceDate: "20250701",
  dueDate: "20250703",
  discountDueDate: "80725",
  grossAmount: 10000, // $100.00 in cents
  discountAmount: 500, // $5.00 in cents
  netAmount: 9500, // $95.00 in cents
  invoiceDescription: "Test Invoice Description",
  voucherStatus: "UNPAID",
  paidDate: null,
  checkNo: null,
  paidAmount: 0,
};

export const mockSummaryData = {
  vendorName: "Test Vendor Company",
  companyNo: 10,
  vendorNo: 1001,
  openPayables: 100.0,
  openPayablesDate: "20250701",
  lastPaidAmount: 50.0,
  lastPaidDate: "20250630",
};

export const mockDetailedVoucherData = {
  data: {
    headerItems: {
      vendorName: "Test Vendor Company",
      vendorNo: 1001,
      invoiceNumber: "INV-2024-001",
      invoiceDate: "20250701",
      discountDueDate: "20250705",
      dueDate: "20250703",
      grossAmount: 10000,
      discountAmount: 500,
      invoiceDescription: "Test Invoice Description",
      voucherType: "UNPAID",
      holdPaymentFlag: "N",
      prepaidFlag: "N",
    },
    detailItems: [
      {
        sequenceNo: 1,
        lineDescription: "Test Line Item",
        grossAmount: 10000,
        discountAmount: 500,
        netAmount: 9500,
        expenseGlAccount: 5000,
        expenseCompanyNo: 10,
        quantity: 1,
        jobNo: "JOB001",
        poNumber: "PO001",
        receiptNumber: 12345,
        productAmount: 10000,
        freightAmount: 0,
      },
    ],
  },
  status: "success",
  message: "Successfully retrieved voucher view details",
};

// Mock voucher entry data
export const mockFlexiEntryData = {
  processType: "FLEXI",
  entryNo: 41741,
  invoiceNo: "ABC123",
  invoiceAmount: 1500.5,
  invoiceDate: "02/22/04",
  dueDate: "02/22/04",
  discountDueDate: "02/22/04",
  holdDesc: "Hold",
  companyNo: 10,
  vendorNo: 22204,
  vendorName: "ABSG CONSULTING",
};

export const mockPaperEntryData = {
  processType: "PAPER",
  entryNo: 12345,
  invoiceNo: "PAPER-001",
  invoiceAmount: 2500.75,
  invoiceDate: "01/15/25",
  dueDate: "01/31/25",
  discountDueDate: "01/20/25",
  companyNo: 10,
  vendorNo: 1001,
  vendorName: "Test Paper Vendor",
  status: "success",
};

export const mockLmsEntryData = {
  key: "1",
  processType: "LMS",
  entryNo: 67890,
  invoiceNo: "LMS-001",
  invoiceAmount: 3500.25,
  invoiceDate: "01/10/25",
  dueDate: "01/25/25",
  companyNo: 10,
  vendorNo: 2001,
  vendorName: "Test LMS Vendor",
  status: "success",
};

// Mock voucher summary responses with nested structure
export const mockVoucherSummaryData = {
  // SOGAS - direct structure
  sogas: {
    data: {
      totalAmount: "$50,000.00",
      countE: 2,
      countW: 3,
      countS: 15,
      totalUploads: 20,
    },
  },
  // FLEXI, PAPER, LMS - nested under 'items'
  flexi: {
    data: {
      items: {
        totalAmount: "$273,998.60",
        countE: 0,
        countW: 5,
        countS: 51,
        totalUploads: 56,
      },
    },
  },
  paper: {
    data: {
      items: {
        totalAmount: "$125,750.25",
        countE: 1,
        countW: 2,
        countS: 10,
        totalUploads: 13,
      },
    },
  },
  lms: {
    data: {
      items: {
        totalAmount: "$9,852.79",
        countE: 2,
        countW: 0,
        countS: 18,
        totalUploads: 20,
      },
    },
  },
};

// Mock upload status data
export const mockUploadStatusData = {
  fileName: "test-upload.csv",
  uploadDate: "2025-01-15T10:30:00.000Z",
  status: "completed",
  summary: {
    totalAmount: "$15,000.00",
    totalUploads: 5,
    countS: 3,
    countW: 1,
    countE: 1,
  },
};

// Mock API responses
export const mockApiResponses = {
  voucherMaintenance: {
    data: {
      items: [mockVoucherData],
      pagination: {
        total_items: 1,
        current_page: 1,
        items_per_page: 10,
        total_pages: 1,
      },
    },
  },
  voucherMaintenanceSummary: {
    data: {
      items: [mockSummaryData],
    },
  },
  voucherMaintenanceById: mockDetailedVoucherData,
  updateVoucherDiscount: {
    data: {
      data: {
        message: "Discount information updated successfully",
        voucher: {
          companyNo: 10,
          vendorNo: 1001,
          voucherNo: 12345,
          discountDueDate: "071525",
          discount: 2000,
          updatedAt: "2024-01-15T10:30:00.000Z",
        },
      },
    },
  },
  // Flexi Entry API responses
  flexiEntry: {
    data: {
      items: [mockFlexiEntryData],
      pagination: {
        total_items: 1,
        current_page: 1,
        items_per_page: 500,
        total_pages: 1,
      },
    },
  },
  // Paper Entry API responses
  paperEntry: {
    data: {
      items: [mockPaperEntryData],
      pagination: {
        total_items: 1,
        current_page: 1,
        items_per_page: 500,
        total_pages: 1,
      },
    },
  },
  // LMS Entry API responses
  lmsEntry: {
    data: {
      items: [mockLmsEntryData],
      pagination: {
        total_items: 1,
        current_page: 1,
        items_per_page: 500,
        total_pages: 1,
      },
    },
  },
  // Voucher Summary API responses
  voucherSummary: mockVoucherSummaryData,
};

// Create mock API instance
export const createMockApi = () => ({
  voucherMaintenance: {
    voucherMaintenance: vi
      .fn()
      .mockResolvedValue(mockApiResponses.voucherMaintenance),
    getVoucherMaintenanceSummary: vi
      .fn()
      .mockResolvedValue(mockApiResponses.voucherMaintenanceSummary),
    getVoucherMaintenanceById: vi
      .fn()
      .mockResolvedValue(mockApiResponses.voucherMaintenanceById),
    updateVoucherDiscount: vi
      .fn()
      .mockResolvedValue(mockApiResponses.updateVoucherDiscount),
  },
  accountPayable: {
    // Flexi Entry APIs
    getFlexiEntry: vi.fn().mockResolvedValue(mockApiResponses.flexiEntry),
    deleteFlexiEntry: vi.fn().mockResolvedValue({ success: true }),

    // Paper Entry APIs
    getPaperEntry: vi.fn().mockResolvedValue(mockApiResponses.paperEntry),
    deletePaperEntry: vi.fn().mockResolvedValue({ success: true }),
    submitPurchaseJournal: vi
      .fn()
      .mockResolvedValue({ success: true, message: "Success" }),

    // LMS Entry APIs
    getLmsEntry: vi.fn().mockResolvedValue(mockApiResponses.lmsEntry),
    deleteLmsEntry: vi.fn().mockResolvedValue({ success: true }),
    updateLmsEntry: vi.fn().mockResolvedValue({ success: true }),

    // Voucher Summary APIs - with processType-based responses
    getVoucherSummary: vi.fn().mockImplementation(({ processType }) => {
      switch (processType) {
        case "FLEXI":
          return Promise.resolve(mockApiResponses.voucherSummary.flexi);
        case "PAPER":
          return Promise.resolve(mockApiResponses.voucherSummary.paper);
        case "LMS":
          return Promise.resolve(mockApiResponses.voucherSummary.lms);
        case "SOGAS":
          return Promise.resolve(mockApiResponses.voucherSummary.sogas);
        default:
          return Promise.resolve(mockApiResponses.voucherSummary.flexi);
      }
    }),
  },
});

// Mock API factory
export const mockApiFactory = vi.fn().mockImplementation(() => createMockApi());

// Helper functions for test scenarios
export const createErrorResponse = (message: string) => ({
  response: {
    status: 400,
    data: {
      error: message,
    },
  },
});

export const createNetworkError = () => new Error("Network Error");

export const createTimeoutError = () => new Error("Request timeout");

// Test data builders
export const createVoucherData = (
  overrides: Partial<typeof mockVoucherData> = {}
) => ({
  ...mockVoucherData,
  ...overrides,
});

export const createSummaryData = (
  overrides: Partial<typeof mockSummaryData> = {}
) => ({
  ...mockSummaryData,
  ...overrides,
});

// Date format test cases
export const dateFormatTestCases = [
  { input: "20250701", expected: "07/01/2025", format: "YYYYMMDD" },
  { input: "070125", expected: "07/01/2025", format: "MMDDYY" },
  { input: "80725", expected: "08/07/2025", format: "MDDYY" },
  { input: "0", expected: "-", format: "zero" },
  { input: "", expected: "-", format: "empty" },
  { input: "123149", expected: "12/31/2049", format: "MMDDYY (2049)" },
  { input: "010150", expected: "01/01/1950", format: "MMDDYY (1950)" },
];

// Amount format test cases
export const amountFormatTestCases = [
  { input: 10000, expected: "$100.00" },
  { input: 500, expected: "$5.00" },
  { input: 1, expected: "$0.01" },
  { input: 0, expected: "$0.00" },
  { input: 1234567, expected: "$12345.67" },
  { input: -500, expected: "$-5.00" },
];

// Form validation test cases
export const validationTestCases = {
  validInputs: [
    { date: "07/15/25", amount: "15.50" },
    { date: "12/31/25", amount: "100.00" },
    { date: "01/01/25", amount: "0.01" },
  ],
  invalidInputs: [
    {
      date: "",
      amount: "15.50",
      error: "Please select a valid discount due date",
    },
    {
      date: "07/15/25",
      amount: "",
      error: "Please enter a valid discount amount",
    },
    {
      date: "07/15/25",
      amount: "-10.00",
      error: "Please enter a valid discount amount",
    },
    {
      date: "07/15/25",
      amount: "invalid",
      error: "Please enter a valid discount amount",
    },
  ],
};
