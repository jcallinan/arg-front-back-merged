export const TABLE_REGISTRY = {
  Company: {
    name: "APCONT",
    description: "Company",
    defaultSchema: "dataLib",
  },
  VoucherHeader: {
    name: "APTRANH",
    description: "Voucher Header Table",
    defaultSchema: "dataLib",
  },
  Vendor: {
    name: "APVEND",
    description: "Vendor",
    defaultSchema: "dataLib",
  },
  VoucherDetail: {
    name: "APTRAND",
    description: "Voucher Detail Table",
    defaultSchema: "dataLib",
  },
  Apdate: {
    name: "APDATE",
    description: "apdate Model",
    defaultSchema: "dataLib",
  },
  GeneralSystem: {
    name: "GSTABL",
    description: "General System Model",
    defaultSchema: "dataLib",
  },
  FreightInvoiceHeader: {
    name: "FRCINH",
    description: "Freight Invoice Header Model",
    defaultSchema: "dataLib",
  },
  GlMaster: {
    name: "GLMAST",
    description: "Gl Master Model",
    defaultSchema: "dataLib",
  },
  CarrierInvoiceHeader: {
    name: "FRCFBH",
    description: "Carrier Invoice Header Model",
    defaultSchema: "dataLib",
  },
  InventoryHistory: {
    name: "INFIL1",
    description: "Inventory History",
    defaultSchema: "dataLib",
  },
  InventoryFutureTrans: {
    name: "INTZH1",
    description: "Inventory Future Trans",
    defaultSchema: "dataLib",
  },
  VendorMasterAdditional: {
    name: "APVENY",
    description: "Vendor Master Additional",
    defaultSchema: "dataLib",
  },
  ContainerUnitofMeasureConversion: {
    name: 'GSCTUM',
    description: 'Container Unit of Measure Conversion',
    defaultSchema: 'dataLib',
  },
  BillingControlFile: {
    name: 'BICONT',
    description: 'Billing Control File',
    defaultSchema: 'dataLib',
  },
  ProdMoveMiscLogical: {
    name: 'SA5MOUM',
    description: 'Prod Move Misc Logical',
    defaultSchema: 'dataLib',
  },
  SalesAnalysisDetail: {
    name: 'SA5FIUD',
    description: 'Sales AnalysisDetail Model',
    defaultSchema: 'dataLib',
  },
  ProdMoveDetailLogical: {
    name: 'SA5MOUD',
    description: 'Prod Move Detail Logical',
    defaultSchema: 'dataLib',
  },
  SalesAnalysisMisc: {
    name: 'SA5FIUM',
    description: 'Sales Analysis Misc Model',
    defaultSchema: 'dataLib',
  },
  FreightOutBalancingInvoice: {
    name: "FRBINH",
    description: "Freight Out Balancing Invoice Header",
    defaultSchema: "dataLib",
  },
  FreightCarrierInvoice: {
    name: "FRCIFHV",
    description: "Freight Carrier Invoice Model",
    defaultSchema: "dataLib",
  },
  SpooledMetadataReport: {
    name: "SPLFMETA",
    description: "Spooled Meta Data Report",
    defaultSchema: "dataLib",
  },
  OwnerVendorReference: {
    name: "APSGACH",
    description: "Owner Vendor Reference",
    defaultSchema: "dataLib",
  },
  VoucherHeaderHistory: {
    name: "APTRANHH",
    description: "Voucher Header History Table",
    defaultSchema: "dataLib",
  },
  VoucherDetailHistory: {
    name: "APTRANDH",
    description: "Voucher Detail History Table",
    defaultSchema: "dataLib",
  },
  AP200PRC: {
    name: 'AP200PRC',
    description: "Store Procedure for AP200",
    defaultSchema: 'spLib'
  },
  ProcessType: {
    name: "SPLFRPTN",
    description: "Process Type",
    defaultSchema: "dataLib",
  },
  CheckInquiry: {
    name: "APHSTHB",
    description: "Check Inquiry",
    defaultSchema: "dataLib",
  },
  CheckInquiryHistory: {
    name: "APCHKR",
    description: "Check Inquiry History",
    defaultSchema: "dataLib",
  },
  CheckInquiryVoucherDetail: {
    name: "APHSTHA",
    description: "Check Inquiry Voucher Detail",
    defaultSchema: "dataLib",
  },
  CheckInquiryLineItem: {
    name: "APHSTDA",
    description: "Check Inquiry Line Items details",
    defaultSchema: "dataLib",
  },
  OpenPayableHeader: {
    name: "APOPNH",
    description: "Open Payable Header",
    defaultSchema: "dataLib",
  },
  OpenPayableDetails: {
    name: "APOPND",
    description: "Open Payable Details",
    defaultSchema: "dataLib",
  },
  OpenPayableVendor: {
    name: "APOPNV",
    description: "Open Payable Vendor",
    defaultSchema: "dataLib",
  },
  VendorContactDetail: {
    name: "APVNFM",
    description: "Vendor Contact Detail",
    defaultSchema: "dataLib",
  },
  SpInfo: {
    name: "GSPINFO",
    description: "Stored Procedure Information",
    defaultSchema: "workDataLib",
  },
  OpenPayableHistoryHeader: {
    name: "APHSTH",
    description: "Open Payable History Header",
    defaultSchema: "dataLib",
  },
  OpenPayableHistoryDetail: {
    name: "APHSTD",
    description: "Open Payable History Detail",
    defaultSchema: "dataLib",
  },
  OpenPayableHistoryVendor: {
    name: "APHSTV",
    description: "Open Payable History Vendor",
    defaultSchema: "dataLib",
  },
  Clearchecks: {
    name: "APCHKR",
    description: "clearChecks",
    defaultSchema: "dataLib",
  },
  ApPeriodEnd: {
    name: "AP1099I",
    description: "Ap Period End",
    defaultSchema: "workDataLib",
  },
  Carrier: {
    name: "BBCAID",
    description: "Carrier",
    defaultSchema: "dataLib",
  },
  GeneralSystemCompany: {
    name: "GSCONT",
    description: "General System Company",
    defaultSchema: "dataLib",
  },
  NachaForAchPayments: {
    name: "ACHFIL",
    description: "Nacha for Ach Payments",
    defaultSchema: "workDataLib",
  },
  PA1099YearEndPatax: {
    name: "PATAX",
    description: "PA1099 Year End Process Tax",
    defaultSchema: "workDataLib",
  },
  IRSTax: {
    name: "IRSTAX",
    description: "1099 IRS Tax Reporting",
    defaultSchema: "workDataLib",
  },
} as const;

export type TableName = keyof typeof TABLE_REGISTRY;
