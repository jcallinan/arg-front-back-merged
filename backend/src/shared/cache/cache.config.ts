export interface CacheConfig {
  host: string;
  port: number;
  password?: string;
  db: number;
  keyPrefix: string;
  ttl: {
    vendor: number; // 24 hours in seconds
    company: number; // 48 hours in seconds (Company data changes very rarely)
    apdate: number; // 24 hours in seconds
    glmaster: number; // 48 hours in seconds (GL accounts change very rarely)
    gstable: number; // 48 hours in seconds (General system settings change very rarely)
    freightinvoice: number; // 24 hours in seconds (Freight invoices change moderately)
    default: number;
  };
  enableReadyCheck: boolean;
  maxRetriesPerRequest: number;
  connectTimeout: number;
}

export const cacheConfig: CacheConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0'),
  keyPrefix: process.env.REDIS_KEY_PREFIX || 'arg-backend:',
  ttl: {
    vendor: 24 * 60 * 60, // 24 hours
    company: 48 * 60 * 60, // 48 hours - Company data changes very rarely
    apdate: 24 * 60 * 60, // 24 hours - APDATE changes infrequently
    glmaster: 48 * 60 * 60, // 48 hours - GL accounts change very rarely
    gstable: 48 * 60 * 60, // 48 hours - General system settings change very rarely
    freightinvoice: 24 * 60 * 60, // 24 hours - Freight invoices change moderately
    default: 60 * 60, // 1 hour
  },
  enableReadyCheck: true,
  maxRetriesPerRequest: 3,
  connectTimeout: 10000, // 10 seconds
};

export const CACHE_KEYS = {
  VENDOR: {
    BY_ID: (vendorNo: number, companyNo: number) =>
      `vendor:${companyNo}:${vendorNo}`,
    ALL_BY_COMPANY: (companyNo: number) =>
      `vendors:company:${companyNo}`,
    BULK_CACHE_STATUS: (companyNo: number) =>
      `vendor:bulk:${companyNo}:status`,
  },
  COMPANY: {
    BY_ID: (companyNo: number) =>
      `company:${companyNo}`,
    ALL: () =>
      `companies:all`,
    BULK_CACHE_STATUS: () =>
      `company:bulk:status`,
  },
  APDATE: {
    BY_DATE: (calculatedDate: number, companyNo: number) =>
      `apdate:${companyNo}:${calculatedDate}`,
    ALL_BY_COMPANY: (companyNo: number) =>
      `apdates:company:${companyNo}`,
    BULK_CACHE_STATUS: (companyNo: number) =>
      `apdate:bulk:${companyNo}:status`,
  },
  GLMASTER: {
    BY_ACCOUNT: (companyNo: number, accountNo: number, subAccountNo: number, accountType: string) =>
      `glmaster:${companyNo}:${accountNo}:${subAccountNo}:${accountType}`,
    ALL_BY_COMPANY: (companyNo: number) =>
      `glmasters:company:${companyNo}`,
    BULK_CACHE_STATUS: (companyNo: number) =>
      `glmaster:bulk:${companyNo}:status`,
  },
  GSTABLE: {
    BY_TYPE_CODE: (tableType: string, tableCode: string) =>
      `gstable:${tableType}:${tableCode}`,
    ALL: () =>
      `gstables:all`,
    BULK_CACHE_STATUS: () =>
      `gstable:bulk:status`,
  },
  FREIGHTINVOICE: {
    BY_COMPANY_CARRIER_INVOICE: (companyNo: number, carrierId?: string, carrierInvoiceNo?: string) =>
      `freightinvoice:${companyNo}:${carrierId || 'EMPTY'}:${carrierInvoiceNo || 'EMPTY'}`,
    ALL_BY_COMPANY: (companyNo: number) =>
      `freightinvoices:company:${companyNo}`,
    BULK_CACHE_STATUS: (companyNo: number) =>
      `freightinvoice:bulk:${companyNo}:status`,
  },
} as const; 