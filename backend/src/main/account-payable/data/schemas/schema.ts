import { DataTypes } from "@sequelize/core";

export const companySchema = {
  companyIsDeleted: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "ACDEL",
  },
  companyNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "ACCONO",
    primaryKey: true,
  },
  companyName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "ACNAME",
  },
  companyApGlNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "ACAPGL",
  },
  companyBankGlNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "ACBKGL",
  },
  companyDiscountsGlNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "ACDSGL",
  },
  companyIntercoGlNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "ACICGL",
  },
  companyNextPjJrnlNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "ACJRNL",
  },
  companyNextCdJrnlNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "ACCDJR",
  },
  companyNextCheckNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "ACCKNO",
  },
  companyNextEntryNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "ACNXTE",
  },
  companyNextVoucherNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "ACNXVO",
  },
  companyPreEdChks: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "ACPREC",
  },
  companyJobCostAct: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "ACJCYN",
  },
  companyRetentionGlNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "ACRTGL",
  },
  companyPoActive: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "ACPOYN",
  },
  companyEmployeeExpenseGlNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "ACEEGL",
  },
  companyNextEeJrnlNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "ACEENL",
  },
  companyVendorNextEntryNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "ACNXVN",
  },
  company99Name: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "AC99NM",
  },
  company99Address1: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "AC99A1",
  },
  company99Address2: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "AC99A2",
  },
  company99StateZip: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "AC99A4",
  },
  company99EinNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "AC99EI",
  },
  company99EmployeeName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "AC99EN",
  },
  company99Phone: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "AC99PN",
  },
  companyFiller: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "ACF001",
  },
};

export const voucherDetailSchema = {
  isDeleted: { type: DataTypes.STRING(1), allowNull: false, field: "ATDDEL" },
  companyNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "ATCONO",
    primaryKey: true,
  },
  entryNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "ATENT#",
    primaryKey: true,
  },
  entrySequence: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "ATENSQ",
    primaryKey: true,
  },
  vendorNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "ATVEND",
  },
  lineCompanyNo: { type: DataTypes.INTEGER, allowNull: false, field: "ATEXCO" },
  lineGlNo: { type: DataTypes.INTEGER, allowNull: false, field: "ATEXGL" },
  lineDesc: {
    type: DataTypes.STRING(25),
    allowNull: false,
    field: "ATDDES",
  },
  lineAmount: {
    type: DataTypes.DECIMAL(11, 2),
    allowNull: false,
    field: "ATAMT",
  },
  discountAmount: {
    type: DataTypes.DECIMAL(11, 2),
    allowNull: true,
    field: "ATDISC",
  },
  discountPercentage: {
    type: DataTypes.DECIMAL(5, 3),
    allowNull: true,
    field: "ATDSPC",
  },
  inventoryItem: {
    type: DataTypes.STRING(13),
    allowNull: false,
    field: "ATITEM",
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "ATQTY",
  },
  jobNo: { type: DataTypes.STRING(6), allowNull: false, field: "ATJOB#" },
  jobCostCode: { type: DataTypes.STRING(6), allowNull: false, field: "ATCCOD" },
  jobCostType: { type: DataTypes.STRING(2), allowNull: false, field: "ATCTYP" },
  jobCostQuantity: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: false,
    field: "ATJQTY",
  },
  gallons: { type: DataTypes.INTEGER, allowNull: false, field: "ATGALN" },
  receiptNo: { type: DataTypes.INTEGER, allowNull: false, field: "ATRCPT" },
  openClosed: { type: DataTypes.STRING(1), allowNull: false, field: "ATCLCD" },
  poLineNo: { type: DataTypes.INTEGER, allowNull: false, field: "ATPOSQ" },
  productAmount: {
    type: DataTypes.DECIMAL(11, 2),
    allowNull: false,
    field: "ATPRAM",
  },
  freightAmount: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: false,
    field: "ATFRAM",
  },
  poNo: { type: DataTypes.STRING(30), allowNull: false, field: "ATPONO" },
  status: { type: DataTypes.STRING(1), allowNull: true, field: "ATSTAT" },
  userProfile: { type: DataTypes.STRING(10), allowNull: true, field: "ATUSER" },
  userInitials: { type: DataTypes.STRING(2), allowNull: true, field: "ATUSIN" },
  createDate: { type: DataTypes.INTEGER, allowNull: true, field: "ATCRDT" },
  updateDate: { type: DataTypes.INTEGER, allowNull: true, field: "ATUPDT" },
};


export const vendorSchema = {
  vendorIsDeleted: {
    type: DataTypes.STRING(1),
    field: "VNDEL",
    allowNull: false,
    defaultValue: "A",
  },
  vendorCompanyNumber: {
    type: DataTypes.INTEGER,
    field: "VNCO",
    allowNull: false,
  },
  vendorNo: {
    type: DataTypes.INTEGER,
    field: "VNVEND",
    allowNull: false,
    primaryKey: true,
  },
  vendorName: { type: DataTypes.STRING(50), field: "VNNAME", allowNull: false },
  vendorAdd1: {
    type: DataTypes.STRING(30),
    field: "VNADD1",
    allowNull: false,
  },
  vendorAdd2: {
    type: DataTypes.STRING(30),
    field: "VNADD2",
    allowNull: false,
  },
  vendorAdd3: {
    type: DataTypes.STRING(30),
    field: "VNADD3",
    allowNull: false,
  },
  vendorAdd4: {
    type: DataTypes.STRING(30),
    field: "VNADD4",
    allowNull: false,
  },
  vendorZipCode: {
    type: DataTypes.INTEGER,
    field: "VNZIP5",
    allowNull: false,
    validate: {
      max: 99999, // largest 5-digit number
      min: 0,       // optional: disallow negatives
    },
  },
  vendorExtraZip: {
    type: DataTypes.INTEGER,
    field: "VNZPX4",
    allowNull: true,
    validate: {
      max: 9999, // largest 4-digit number
      min: 0,       // optional: disallow negatives
    },
  },
  vendorAlphaSortAbbr: {
    type: DataTypes.STRING(10),
    field: "VNSORT",
    allowNull: true,
  },
  vendorAreaCode: {
    type: DataTypes.INTEGER,
    field: "VNAREA",
    allowNull: true,
    validate: {
      max: 999, 
      min: 0,     
    },
  },
  vendorTelephoneNo: {
    type: DataTypes.INTEGER,
    validate: {
      max: 9999999, // largest 7-digit number
      min: 0,       // optional: disallow negatives
    },
    field: "VNTELE",
    allowNull: true,
  },
  vendorLastPaymentAmt: {
    type: DataTypes.DECIMAL(9, 2),
    field: "VNLPAY",
    allowNull: true,
  },
  vendorLastPaymentDate: {
    type: DataTypes.INTEGER,
    validate: {
      max: 999999, // largest 6-digit number
      min: 0,       // optional: disallow negatives
    },
    field: "VNLPDT",
    allowNull: true,
  },
  vendorYtdPurchases: {
    type: DataTypes.DECIMAL(11, 2),
    field: "VNPYTD",
    allowNull: true,
  },
  vendorLastYearPurchases: {
    type: DataTypes.DECIMAL(11, 2),
    field: "VNPLYR",
    allowNull: true,
  },
  vendorMtdDiscounts: {
    type: DataTypes.DECIMAL(7, 2),
    field: "VNDMTD",
    allowNull: true,
  },
  vendorYtdDiscounts: {
    type: DataTypes.DECIMAL(9, 2),
    field: "VNDYTD",
    allowNull: true,
  },
  vendorNameOverflow: {
    type: DataTypes.STRING(1),
    field: "VNNOVF",
    allowNull: true,
  },
  IdNo1099: {
    type: DataTypes.STRING(11),
    field: "VNIDNO",
    allowNull: true,
  },
  vendorGalRcptsRequired: {
    type: DataTypes.STRING(1),
    field: "VNGRRQ",
    allowNull: true,
  },
  vendorFiller: {
    type: DataTypes.STRING(2),
    field: "VNF001",
    allowNull: true,
  },
  vendorPreviousBalance: {
    type: DataTypes.DECIMAL(9, 2),
    field: "VNPBAL",
    allowNull: true,
  },
  vendorMtdPurchases: {
    type: DataTypes.DECIMAL(9, 2),
    field: "VNPURC",
    allowNull: true,
  },
  vendorMtdPayments: {
    type: DataTypes.DECIMAL(9, 2),
    field: "VNPAY",
    allowNull: true,
  },
  vendorCurrentBalance: {
    type: DataTypes.DECIMAL(9, 2),
    field: "VNCBAL",
    allowNull: true,
  },
  vendorHoldPaymentsVend: {
    type: DataTypes.STRING(1),
    field: "VNHOLD",
    allowNull: true,
  },
  vendorSingleCheck: {
    type: DataTypes.STRING(1),
    field: "VNSNGL",
    allowNull: true,
  },
  vendorThisYrYtdPaid: {
    type: DataTypes.DECIMAL(11, 2),
    field: "VNTYDP",
    allowNull: true,
  },
  vendorLastYrYtdPaid: {
    type: DataTypes.DECIMAL(11, 2),
    field: "VNLYDP",
    allowNull: true,
  },
  vendorExpenseGLSub: {
    type: DataTypes.INTEGER,
    validate: {
      max: 99999999, // largest 8-digit number
      min: 0,       // optional: disallow negatives
    },
    field: "VNEXGL",
    allowNull: true,
  },
  vendorApTermsCode: {
    type: DataTypes.INTEGER,
    validate: {
      max: 99, // largest 2-digit number
      min: 0,       // optional: disallow negatives
    },
    field: "VNTERM",
    allowNull: true,
  },
  vendorAp1099Code: {
    type: DataTypes.STRING(1),
    field: "VN1099",
    allowNull: true,
  },
  vendorIdNumber: {
    type: DataTypes.STRING(11),
    field: "VNIDNO",
    allowNull: true,
  },
  vendorFirst1099BoxNumber: {
    type: DataTypes.INTEGER,
    validate: {
      max: 99, // largest 2-digit number
      min: 0,       // optional: disallow negatives
    },
    field: "VNBOX1",
    allowNull: true,
  },
  vendorSecond1099BoxNumber: {
    type: DataTypes.INTEGER,
    validate: {
      max: 99, // largest 2-digit number
      min: 0,       // optional: disallow negatives
    },
    field: "VNBOX2",
    allowNull: true,
  },
  vendorSecond1099BoxAmount: {
    type: DataTypes.DECIMAL(11, 2),
    field: "VNB2AM",
    allowNull: true,
  },
  vendorLastPaymentDateAlt: {
    type: DataTypes.INTEGER,
    validate: {
      max: 99999999, // largest 8-digit number
      min: 0,       // optional: disallow negatives
    },
    field: "VNLPD8",
    allowNull: true,
  },
  vendorCarrierId: {
    type: DataTypes.STRING(6),
    field: "VNCAID",
    allowNull: true,
  },
  vendorPayeeName1: {
    type: DataTypes.STRING(40),
    field: "VNPYN1",
    allowNull: true,
  },
  vendorPayeeName2: {
    type: DataTypes.STRING(40),
    field: "VNPYN2",
    allowNull: true,
  },
  vendorIrsNameControl: {
    type: DataTypes.STRING(4),
    field: "VNNMCT",
    allowNull: true,
  },
  vendorAdpPayrollId: {
    type: DataTypes.INTEGER,
    validate: {
      max: 9999999, // largest 7-digit number
      min: 0,       // optional: disallow negatives
    },
    field: "VNPRID",
    allowNull: true,
  },
  vendorAchClass: {
    type: DataTypes.STRING(3),
    field: "VNACLS",
    allowNull: true,
  },
  vendorAchCheckingOrSavings: {
    type: DataTypes.STRING(1),
    field: "VNACOS",
    allowNull: true,
  },
  vendorAchBankRoutingCode: {
    type: DataTypes.INTEGER,
    field: "VNARTE",
    validate: {
      max: 999999999, // largest 9-digit number
      min: 0,       // optional: disallow negatives
    },
    allowNull: true,
  },
  vendorAchBankAccountNumber: {
    type: DataTypes.STRING(17),
    field: "VNABK#",
    allowNull: true,
  },
  vendorFirstName: {
    type: DataTypes.STRING(20),
    field: "VNFNAM",
    allowNull: true,
  },
  vendorMiddleName: {
    type: DataTypes.STRING(20),
    field: "VNMNAM",
    allowNull: true,
  },
  vendorBusinessLastName: {
    type: DataTypes.STRING(30),
    field: "VNLNAM",
    allowNull: true,
  },
  vendorNameSuffix: {
    type: DataTypes.STRING(4),
    field: "VNSUFF",
    allowNull: true,
  },
  vendorCountryCode: {
    type: DataTypes.STRING(3),
    field: "VNCTRY",
    allowNull: true,
  },
  vendorCategoryCode: {
    type: DataTypes.STRING(6),
    field: "VNCATG",
    allowNull: true,
  },
  vendorFiller2: {
    type: DataTypes.STRING(79),
    field: "VNF003",
    allowNull: true,
  },
};

// Define the schema for the VoucherHeaderModel model
export const voucherHeaderSchema = {
  isDeleted: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "ATDEL",
  },
  companyNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "ATCONO",
    primaryKey: true,
  },
  entryNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "ATENT#",
    primaryKey: true,
  },
  entrySequence: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "ATENSQ",
    primaryKey: true,
  },
  vendorNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "ATVEND",
    primaryKey: true,
  },
  canceledVoucher: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "ATCNVO",
  },
  apGlNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "ATAPGL",
  },
  invoiceDesc: {
    type: DataTypes.STRING(25),
    allowNull: false,
    field: "ATIDES",
  },
  invoiceDate: { type: DataTypes.INTEGER, allowNull: false, field: "ATINDT" },
  dueDate: { type: DataTypes.INTEGER, allowNull: false, field: "ATDUDT" },
  extendedInvoiceDate: { type: DataTypes.INTEGER, allowNull: true, field: "ATIND8" },
  extendedDueDate: { type: DataTypes.INTEGER, allowNull: true, field: "ATDUD8" },
  singleCheck: { type: DataTypes.STRING(1), allowNull: false, field: "ATSNGL" },
  holdCode: { type: DataTypes.STRING(1), allowNull: false, field: "ATHOLD" },
  holdDesc: {
    type: DataTypes.STRING(25),
    allowNull: false,
    field: "ATHLDD",
  },
  prepaidCode: { type: DataTypes.STRING(1), allowNull: false, field: "ATPAID" },
  prepaidCheckNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "ATPPCK",
  },
  vendorName: { type: DataTypes.STRING(30), allowNull: false, field: "ATVNAM" },
  vendorAdd1: { type: DataTypes.STRING(30), allowNull: false, field: "ATVAD1" },
  vendorAdd2: { type: DataTypes.STRING(30), allowNull: false, field: "ATVAD2" },
  vendorAdd3: { type: DataTypes.STRING(30), allowNull: false, field: "ATVAD3" },
  vendorAdd4: { type: DataTypes.STRING(30), allowNull: false, field: "ATVAD4" },
  bankGl: { type: DataTypes.INTEGER, allowNull: false, field: "ATBKGL" },
  invoiceAmount: {
    type: DataTypes.DECIMAL(11, 2),
    allowNull: false,
    field: "ATIAMT",
  },
  retentionGl: { type: DataTypes.INTEGER, allowNull: false, field: "ATRTGL" },
  retentionPct: {
    type: DataTypes.DECIMAL(6, 3),
    allowNull: false,
    field: "ATRTPC",
  },
  prepaidCheckdate: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "ATPCKD",
  },
  totalFreight: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: false,
    field: "ATFRTL",
  },
  salesOrderNo: { type: DataTypes.INTEGER, allowNull: false, field: "ATSORN" },
  srn: { type: DataTypes.INTEGER, allowNull: false, field: "ATSSRN" },
  carrierId: { type: DataTypes.STRING(6), allowNull: false, field: "ATCAID" },
  vendorPaymentTerms: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "ATTERM",
  },
  processType: { type: DataTypes.STRING(6), allowNull: false, field: "ATPTYP" },
  discountDueDate: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "ATDSDT",
  },
  extendedDiscountDueDate: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "ATDSD8",
  },
  invoiceNo: { type: DataTypes.STRING(20), allowNull: false, field: "ATINV#" },
  status: { type: DataTypes.STRING(1), allowNull: true, field: "ATSTAT" },
  userProfile: { type: DataTypes.STRING(10), allowNull: true, field: "ATUSER" },
  userInitials: { type: DataTypes.STRING(2), allowNull: true, field: "ATUSIN" },
  createDate: { type: DataTypes.INTEGER, allowNull: true, field: "ATCRDT" },
  updateDate: { type: DataTypes.INTEGER, allowNull: true, field: "ATUPDT" },
  fillerOne: { type: DataTypes.STRING(1), allowNull: true, field: "ATFIL1" },
  fillerTwo: { type: DataTypes.STRING(10), allowNull: true, field: "ATFIL2" },
};

export const voucherHeaderHistorySchema = {
  ...voucherHeaderSchema,
};

export const voucherDetailHistorySchema = {
  ...voucherDetailSchema,
};

export const generalSystemSchema = {
  isDeleted: { type: DataTypes.CHAR, allowNull: false, field: "TBDEL" },
  tableType: {
    type: DataTypes.CHAR,
    allowNull: false,
    field: "TBTYPE",
    primaryKey: true,
  },
  tableCode: {
    type: DataTypes.CHAR,
    allowNull: false,
    field: "TBCODE",
    primaryKey: true,
  },
  tableDesc: { type: DataTypes.CHAR, allowNull: false, field: "TBDESC" },
  netDays: { type: DataTypes.INTEGER, allowNull: false, field: "TBNETD" },
  proxDays: { type: DataTypes.INTEGER, allowNull: false, field: "TBPRXD" },
  discount: { type: DataTypes.INTEGER, allowNull: false, field: "TBDISC" },
  rackPriceAddOn: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "TBADON",
  },
  discountDays: { type: DataTypes.INTEGER, allowNull: false, field: "TBDISD" },
  priceListGroup: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "TBPLGR",
  },
  priceListColumn: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "TBPLCL",
  },
  groupHeading: { type: DataTypes.CHAR, allowNull: false, field: "TBPLGH" },
  columnHeading: { type: DataTypes.CHAR, allowNull: false, field: "TBPLCH" },
  productGroupCode: { type: DataTypes.CHAR, allowNull: false, field: "TBPRGP" },
  customerRankingColumnNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "TBTOCO",
  },
  rackColumn: { type: DataTypes.INTEGER, allowNull: false, field: "TBCOL" },
  inventoryColumn: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "TBICOL",
  },
  shippingDescription: {
    type: DataTypes.CHAR,
    allowNull: false,
    field: "TBSHDS",
  },
  productClassCode: { type: DataTypes.CHAR, allowNull: false, field: "TBPRCL" },
  salesmanType: { type: DataTypes.CHAR, allowNull: false, field: "TBSMTY" },
  specialMsgDKG: { type: DataTypes.CHAR, allowNull: false, field: "TBSMSG" },
  stdApiGravity: { type: DataTypes.INTEGER, allowNull: false, field: "TBGRAV" },
  inventoryGroupCode: {
    type: DataTypes.CHAR,
    allowNull: false,
    field: "TBINGP",
  },
  salesGlNo: { type: DataTypes.INTEGER, allowNull: false, field: "TBSGLN" },
  shortDescription: { type: DataTypes.CHAR, allowNull: false, field: "TBABDS" },
  sellProduct: { type: DataTypes.CHAR, allowNull: false, field: "TBSELL" },
  inventoryCompSeq: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "TBCSEQ",
  },
  defaultAltProductDesc: {
    type: DataTypes.CHAR,
    allowNull: false,
    field: "TBALTD",
  },
  inventoryCompSort: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "TBCSRT",
  },
  containerTypeBP: { type: DataTypes.CHAR, allowNull: false, field: "TBCNTY" },
  freightTableCode: { type: DataTypes.CHAR, allowNull: false, field: "TBFRTB" },
  termPt2NetDays: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "TB2NTD",
  },
  termPt3NetDays: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "TB3NTD",
  },
  termsPart1Pct: { type: DataTypes.INTEGER, allowNull: false, field: "TB1PCT" },
  termsPart2Pct: { type: DataTypes.INTEGER, allowNull: false, field: "TB2PCT" },
  termsPart3Pct: { type: DataTypes.INTEGER, allowNull: false, field: "TB3PCT" },
  unitTypeBBlnd: { type: DataTypes.CHAR, allowNull: false, field: "TBUNTY" },
  secondDescription: {
    type: DataTypes.CHAR,
    allowNull: false,
    field: "TBDES2",
  },
  einNumber: { type: DataTypes.INTEGER, allowNull: false, field: "TBEIN" },
  vcfCode: { type: DataTypes.CHAR, allowNull: false, field: "TBVCFC" },
  fluidCode: { type: DataTypes.CHAR, allowNull: false, field: "TBFLCD" },
  terminalIoCode: { type: DataTypes.CHAR, allowNull: false, field: "TBF002" },
  codeLength: { type: DataTypes.INTEGER, allowNull: false, field: "TBCDLE" },
  alphaNumeric: { type: DataTypes.CHAR, allowNull: false, field: "TBCDAN" },
};

// Define the schema for the Zglmast model
export const glMasterSchema = {
  isDeleted: { type: DataTypes.CHAR, allowNull: false, field: "GLDEL" },
  companyNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "GLCO",
    primaryKey: true,
  },
  accountNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "GLACCT",
    primaryKey: true,
  },
  subAccountNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "GLSUB",
    primary: true,
  },
  accountType: {
    type: DataTypes.CHAR,
    allowNull: false,
    field: "GLTYPE",
    primaryKey: true,
  },
  description: { type: DataTypes.CHAR, allowNull: false, field: "GLDESC" },
  accountCategory: { type: DataTypes.CHAR, allowNull: false, field: "GLACTY" },
  statementType: { type: DataTypes.CHAR, allowNull: false, field: "GLSTYP" },
  statementLine: { type: DataTypes.INTEGER, allowNull: false, field: "GLLINE" },
  drBalanceForward: {
    type: DataTypes.DECIMAL(11, 2),
    allowNull: false,
    field: "GLBFDR",
  },
  crBalanceForward: {
    type: DataTypes.DECIMAL(11, 2),
    allowNull: false,
    field: "GLBFCR",
  },
  drMonth01: {
    type: DataTypes.DECIMAL(11, 2),
    allowNull: false,
    field: "GLMOD1",
  },
  drMonth02: {
    type: DataTypes.DECIMAL(11, 2),
    allowNull: false,
    field: "GLMOD2",
  },
  drMonth03: {
    type: DataTypes.DECIMAL(11, 2),
    allowNull: false,
    field: "GLMOD3",
  },
  drMonth04: {
    type: DataTypes.DECIMAL(11, 2),
    allowNull: false,
    field: "GLMOD4",
  },
  drMonth05: {
    type: DataTypes.DECIMAL(11, 2),
    allowNull: false,
    field: "GLMOD5",
  },
  drMonth06: {
    type: DataTypes.DECIMAL(11, 2),
    allowNull: false,
    field: "GLMOD6",
  },
  drMonth07: {
    type: DataTypes.DECIMAL(11, 2),
    allowNull: false,
    field: "GLMOD7",
  },
  drMonth08: {
    type: DataTypes.DECIMAL(11, 2),
    allowNull: false,
    field: "GLMOD8",
  },
  drMonth09: {
    type: DataTypes.DECIMAL(11, 2),
    allowNull: false,
    field: "GLMOD9",
  },
  drMonth10: {
    type: DataTypes.DECIMAL(11, 2),
    allowNull: false,
    field: "GLMD10",
  },
  drMonth11: {
    type: DataTypes.DECIMAL(11, 2),
    allowNull: false,
    field: "GLMD11",
  },
  drMonth12: {
    type: DataTypes.DECIMAL(11, 2),
    allowNull: false,
    field: "GLMD12",
  },
  crMonth01: {
    type: DataTypes.DECIMAL(11, 2),
    allowNull: false,
    field: "GLMOC1",
  },
  crMonth02: {
    type: DataTypes.DECIMAL(11, 2),
    allowNull: false,
    field: "GLMOC2",
  },
  crMonth03: {
    type: DataTypes.DECIMAL(11, 2),
    allowNull: false,
    field: "GLMOC3",
  },
  crMonth04: {
    type: DataTypes.DECIMAL(11, 2),
    allowNull: false,
    field: "GLMOC4",
  },
  crMonth05: {
    type: DataTypes.DECIMAL(11, 2),
    allowNull: false,
    field: "GLMOC5",
  },
  crMonth06: {
    type: DataTypes.DECIMAL(11, 2),
    allowNull: false,
    field: "GLMOC6",
  },
  crMonth07: {
    type: DataTypes.DECIMAL(11, 2),
    allowNull: false,
    field: "GLMOC7",
  },
  crMonth08: {
    type: DataTypes.DECIMAL(11, 2),
    allowNull: false,
    field: "GLMOC8",
  },
  crMonth09: {
    type: DataTypes.DECIMAL(11, 2),
    allowNull: false,
    field: "GLMOC9",
  },
  crMonth10: {
    type: DataTypes.DECIMAL(11, 2),
    allowNull: false,
    field: "GLMC10",
  },
  crMonth11: {
    type: DataTypes.DECIMAL(11, 2),
    allowNull: false,
    field: "GLMC11",
  },
  crMonth12: {
    type: DataTypes.DECIMAL(11, 2),
    allowNull: false,
    field: "GLMC12",
  },
  supSched2Type: { type: DataTypes.CHAR, allowNull: false, field: "GLSST2" },
  supSched2Line: { type: DataTypes.INTEGER, allowNull: false, field: "GLSSL2" },
  consSupSched2Line: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "GLCSL2",
  },
  supSched3Type: { type: DataTypes.CHAR, allowNull: false, field: "GLSST3" },
  supSched3Dept: { type: DataTypes.INTEGER, allowNull: false, field: "GLSSD3" },
  supSched3Line: { type: DataTypes.INTEGER, allowNull: false, field: "GLSSL3" },
  consSupSched3Line: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "GLCSL3",
  },
  filler: { type: DataTypes.CHAR, allowNull: false, field: "GLF001" },
  specialAccount: { type: DataTypes.CHAR, allowNull: false, field: "GLSPEC" },
  keyApGal: { type: DataTypes.CHAR, allowNull: false, field: "GLAPCD" },
  productCode: { type: DataTypes.CHAR, allowNull: false, field: "GLPRCD" },
  glType: { type: DataTypes.CHAR, allowNull: false, field: "GLGLTY" },
  secondStmtType: { type: DataTypes.CHAR, allowNull: false, field: "GLSTY2" },
  secondStmtLine: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "GLLIN2",
  },
  secondConsStmtLine: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "GLCLN2",
  },
  consolidatedGroup: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "GLCGRP",
  },
  poRequired: { type: DataTypes.CHAR, allowNull: false, field: "GLPOCD" },
  supSchedGroup: { type: DataTypes.INTEGER, allowNull: false, field: "GLSSGP" },
  suppSchedType: { type: DataTypes.CHAR, allowNull: false, field: "GLSSTY" },
  suppSchedLine: { type: DataTypes.INTEGER, allowNull: false, field: "GLSSLN" },
  consolidatedLine: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "GLCLIN",
  },
  consSupSchLine: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "GLCSLN",
  },
  column: { type: DataTypes.INTEGER, allowNull: false, field: "GLCOLM" },
  unitCode: { type: DataTypes.CHAR, allowNull: false, field: "GLUNCD" },
};

export const carrierInvoiceHeaderSchema = {
  isDeleted: { type: DataTypes.CHAR, allowNull: false, field: "FRDEL" },
  companyNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "FRCO",
    primaryKey: true,
  },
  carrierId: {
    type: DataTypes.CHAR,
    allowNull: false,
    field: "FRCAID",
    primaryKey: true,
  },
  carrierInvoiceNumber: {
    type: DataTypes.CHAR,
    allowNull: false,
    field: "FRCAIN",
    primaryKey: true,
  },
  invoiceType: { type: DataTypes.CHAR, allowNull: false, field: "FRINTY" },
  invoiceDate: { type: DataTypes.INTEGER, allowNull: false, field: "FRINDT" },
  invoiceAmount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "FRINAM",
  },
  orderNumber: { type: DataTypes.INTEGER, allowNull: false, field: "FRRDNO" },
  shippingReferenceNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "FRSRN",
  },
  dateTimeStamp: { type: DataTypes.CHAR, allowNull: false, field: "FRDTTM" },
  carrierInvoiceStatus: {
    type: DataTypes.CHAR,
    allowNull: false,
    field: "FRCIST",
  },
  orderOverrideTotal: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "FRFBOA",
  },
  filler1: { type: DataTypes.CHAR, allowNull: false, field: "FRF001" },
  approvalStatus: { type: DataTypes.CHAR, allowNull: false, field: "FRALST" },
  approvalDateTime: {
    type: DataTypes.CHAR,
    allowNull: false,
    field: "FRALDT",
  },
  apInvoiceStatus: {
    type: DataTypes.CHAR,
    allowNull: false,
    field: "FRAPST",
  },
  apDateTime: { type: DataTypes.CHAR, allowNull: false, field: "FRAPDT" },
  carrierUserId: { type: DataTypes.CHAR, allowNull: false, field: "FRCUID" },
  billingType: { type: DataTypes.CHAR, allowNull: false, field: "FRCBTY" },
  carrierIpAddress: {
    type: DataTypes.CHAR,
    allowNull: false,
    field: "FRIPAD",
  },
  vendorNo: { type: DataTypes.CHAR, allowNull: false, field: "FRVEND" },
  checkNumber: { type: DataTypes.INTEGER, allowNull: false, field: "FRCKNO" },
  checkDate: { type: DataTypes.INTEGER, allowNull: false, field: "FRCKD8" },
  voucherAmount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "FRVAMT",
  },
  filler2: { type: DataTypes.CHAR, allowNull: false, field: "FRF002" },
};

export const freightInvoiceHeaderSchema = {
  isDeleted: { type: DataTypes.CHAR, allowNull: false, field: "FRDEL" },
  companyNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "FRCO",
    primaryKey: true,
  },
  carrierId: {
    type: DataTypes.CHAR,
    allowNull: false,
    field: "FRCAID",
    primaryKey: true,
  },
  carrierInvoiceNo: {
    type: DataTypes.CHAR,
    allowNull: false,
    field: "FRCAIN",
    primaryKey: true,
  },
  invoiceType: { type: DataTypes.CHAR, allowNull: false, field: "FRINTY" },
  invoiceDate: { type: DataTypes.INTEGER, allowNull: false, field: "FRINDT" },
  invoiceAmount: { type: DataTypes.INTEGER, allowNull: false, field: "FRINAM" },
  ourOrderNo: { type: DataTypes.INTEGER, allowNull: false, field: "FRRDNO" },
  shippingReferenceNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "FRSRN",
  },
  dateTimeStamp: { type: DataTypes.CHAR, allowNull: false, field: "FRDTTM" },
  carrierInvoiceStatus: {
    type: DataTypes.CHAR,
    allowNull: false,
    field: "FRCIST",
  },
  freightBalanceOverrideTotal: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "FRFBOA",
  },
  filler1: { type: DataTypes.CHAR, allowNull: false, field: "FRF001" },
  approvalStatus: { type: DataTypes.CHAR, allowNull: false, field: "FRALST" },
  approvalDateTime: { type: DataTypes.CHAR, allowNull: false, field: "FRALDT" },
  apInvoiceStatus: { type: DataTypes.CHAR, allowNull: false, field: "FRAPST" },
  apDateTime: { type: DataTypes.CHAR, allowNull: false, field: "FRAPDT" },
  carrierUserId: { type: DataTypes.CHAR, allowNull: false, field: "FRCUID" },
  billingType: { type: DataTypes.CHAR, allowNull: false, field: "FRCBTY" },
  carrierIpAddress: { type: DataTypes.CHAR, allowNull: false, field: "FRIPAD" },
  vendorNo: { type: DataTypes.CHAR, allowNull: false, field: "FRVEND" },
  checkNumber: { type: DataTypes.INTEGER, allowNull: false, field: "FRCKNO" },
  checkDate: { type: DataTypes.INTEGER, allowNull: false, field: "FRCKD8" },
  voucherAmount: { type: DataTypes.INTEGER, allowNull: false, field: "FRVAMT" },
  filler2: { type: DataTypes.CHAR, allowNull: false, field: "FRF002" },
};

export const apdateSchema = {
  isDeleted: {
    type: DataTypes.CHAR,
    allowNull: false,
    field: "ADDEL",
  },
  companyNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "ADCO",
  },
  calculatedDate: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "ADDUD8",
    primaryKey: true,
  },
  newDate: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "ADNED8",
  },
};

export const inventoryFutureTransSchema = {
  isDeleted: { type: DataTypes.CHAR, allowNull: false, field: "ITDEL" },
  sequenceNo: { type: DataTypes.INTEGER, allowNull: false, field: "ITSEQN" },
  companyNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "ITCO",
    primaryKey: true,
  },
  location: { type: DataTypes.CHAR, allowNull: false, field: "ITLOC" },
  productCode: { type: DataTypes.CHAR, allowNull: false, field: "ITPRCD" },
  tank: { type: DataTypes.CHAR, allowNull: false, field: "ITTANK" },
  extraKeyField: { type: DataTypes.CHAR, allowNull: false, field: "ITXKEY" },
  transactionType: { type: DataTypes.CHAR, allowNull: false, field: "ITTRTY" },
  netQuantity: { type: DataTypes.INTEGER, allowNull: false, field: "ITNQTY" },
  netQtyFraction: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "ITNQTF",
  },
  temperature: { type: DataTypes.INTEGER, allowNull: false, field: "ITTEMP" },
  gravity: { type: DataTypes.INTEGER, allowNull: false, field: "ITGRAV" },
  unitOfMeasure: { type: DataTypes.CHAR, allowNull: false, field: "ITUNMS" },
  transactionDate: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "ITTRDT",
  },
  source: { type: DataTypes.CHAR, allowNull: false, field: "ITSOUR" },
  vendorNo: { type: DataTypes.INTEGER, allowNull: false, field: "ITVEND" },
  vendorLocation: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "ITVLOC",
  },
  carrierCode: { type: DataTypes.INTEGER, allowNull: false, field: "ITCACD" },
  additiveCode: { type: DataTypes.CHAR, allowNull: false, field: "ITADCD" },
  receiptNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "ITREC#",
    primaryKey: true,
  },
  billOfLading: { type: DataTypes.INTEGER, allowNull: false, field: "ITBOL" },
  truckNo: { type: DataTypes.INTEGER, allowNull: false, field: "ITTRK#" },
  customerNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "ITCUS#",
  },
  transferToLocation: {
    type: DataTypes.CHAR,
    allowNull: false,
    field: "ITTLOC",
  },
  transferToProdCode: {
    type: DataTypes.CHAR,
    allowNull: false,
    field: "ITTPCD",
  },
  transferToTank: { type: DataTypes.CHAR, allowNull: false, field: "ITTTAN" },
  transferToXtraKey: {
    type: DataTypes.CHAR,
    allowNull: false,
    field: "ITTXKY",
  },
  sumWhenPosting: { type: DataTypes.CHAR, allowNull: false, field: "ITSUMP" },
  inventoryNetQty: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "ITIQTY",
  },
  inventoryQtyFraction: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "ITIQTF",
  },
  inventoryUnitOfMeasure: {
    type: DataTypes.CHAR,
    allowNull: false,
    field: "ITIUMS",
  },
  grossQuantity: { type: DataTypes.INTEGER, allowNull: false, field: "ITGQTY" },
  grossQtyFraction: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "ITGQTF",
  },
  inventoryGrossQty: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "ITIGQT",
  },
  inventoryGrossQtyFraction: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "ITIGQF",
  },
  useFormula: { type: DataTypes.CHAR, allowNull: false, field: "ITFRM" },
  sortCode: { type: DataTypes.CHAR, allowNull: false, field: "ITSORT" },
  invenCostUnit: { type: DataTypes.CHAR, allowNull: false, field: "ITCOUN" },
  finProdProductCode: {
    type: DataTypes.CHAR,
    allowNull: false,
    field: "ITFPCD",
  },
  transactionDateCYMD: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "ITTRD8",
  },
  openClosedStatus: { type: DataTypes.CHAR, allowNull: false, field: "ITCLCD" },
  apTotalDollars: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "ITAPTD",
  },
  orderNumber: { type: DataTypes.INTEGER, allowNull: false, field: "ITORD#" },
  srnNumber: { type: DataTypes.INTEGER, allowNull: false, field: "ITSRN#" },
  apLastInvNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "ITAPID",
  },
  apLastInvDate: { type: DataTypes.INTEGER, allowNull: false, field: "ITAPLE" },
  apLastExpenseGL: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "ITAPLP",
  },
  apLastPurchaseJournal: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "ITAPTQ",
  },
  apTotalQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "ITAPTF",
  },
  closedDateYMD: { type: DataTypes.INTEGER, allowNull: false, field: "ITCLDT" },
  closedDateCYMD: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "ITCLD8",
  },
  poNumber: { type: DataTypes.INTEGER, allowNull: false, field: "ITPONM" },
  reversingEntry: { type: DataTypes.CHAR, allowNull: false, field: "ITRVYN" },
  costingType: { type: DataTypes.CHAR, allowNull: false, field: "ITCOTY" },
  incomeGL: { type: DataTypes.INTEGER, allowNull: false, field: "ITCIGL" },
  expenseGL: { type: DataTypes.INTEGER, allowNull: false, field: "ITCEGL" },
  filler1: {
    type: DataTypes.CHAR,
    allowNull: false,
    field: "ITFIL1",
  },
  filler2: {
    type: DataTypes.CHAR,
    allowNull: false,
    field: "ITFIL2",
  },
  filler3: {
    type: DataTypes.CHAR,
    allowNull: false,
    field: "ITFIL3",
  },
};

export const inventoryHistorySchema = {
  isDeleted: { type: DataTypes.CHAR(1), allowNull: false, field: "IHDEL" },
  companyNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "IHCO",
    primaryKey: true,
  },
  location: { type: DataTypes.CHAR, allowNull: false, field: "IHLOC" },
  productCode: { type: DataTypes.CHAR, allowNull: false, field: "IHPRCD" },
  tank: { type: DataTypes.CHAR, allowNull: false, field: "IHTANK" },
  extraKeyField: { type: DataTypes.CHAR, allowNull: false, field: "IHXKEY" },
  systemDate: { type: DataTypes.INTEGER, allowNull: false, field: "IHSDAT" },
  systemTime: { type: DataTypes.INTEGER, allowNull: false, field: "IHSTIM" },
  transactionType: { type: DataTypes.CHAR, allowNull: false, field: "IHTRTY" },
  netQuantity: { type: DataTypes.INTEGER, allowNull: false, field: "IHNQTY" },
  netQtyFraction: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "IHNQTF",
  },
  unitOfMeasure: { type: DataTypes.CHAR, allowNull: false, field: "IHUNMS" },
  datePosted: { type: DataTypes.INTEGER, allowNull: false, field: "IHDATP" },
  timePosted: { type: DataTypes.INTEGER, allowNull: false, field: "IHTIMP" },
  transactionDate: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "IHTRDT",
  },
  source: { type: DataTypes.CHAR, allowNull: false, field: "IHSOUR" },
  productGroupCode: { type: DataTypes.CHAR, allowNull: false, field: "IHPGRC" },
  vendorNo: { type: DataTypes.INTEGER, allowNull: false, field: "IHVEND" },
  vendorLocation: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "IHVLOC",
  },
  carrierCode: { type: DataTypes.INTEGER, allowNull: false, field: "IHCACD" },
  additiveCode: { type: DataTypes.CHAR, allowNull: false, field: "IHADCD" },
  receiptNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "IHRECN",
    primaryKey: true,
  },
  billOfLadingNo: { type: DataTypes.INTEGER, allowNull: false, field: "IHBOL" },
  truckNo: { type: DataTypes.INTEGER, allowNull: false, field: "IHTRKN" },
  transferLocation: { type: DataTypes.CHAR, allowNull: false, field: "IHTLOC" },
  transferProductCode: {
    type: DataTypes.CHAR,
    allowNull: false,
    field: "IHTPCD",
  },
  transferTank: { type: DataTypes.CHAR, allowNull: false, field: "IHTTAN" },
  transferExtraKeyField: {
    type: DataTypes.CHAR,
    allowNull: false,
    field: "IHTXKE",
  },
  finishedProductCode: {
    type: DataTypes.CHAR,
    allowNull: false,
    field: "IHFPCD",
  },
  tankPhysicalInvent: {
    type: DataTypes.CHAR,
    allowNull: false,
    field: "IHTKPI",
  },
  orderNumber: { type: DataTypes.INTEGER, allowNull: false, field: "IHFORD#" },
  prevOnHandQtyFraction: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "IHPVOF",
  },
  srnNumber: { type: DataTypes.INTEGER, allowNull: false, field: "IHSRN#" },
  costingType: { type: DataTypes.CHAR, allowNull: false, field: "IHCOTY" },
  filler2: { type: DataTypes.CHAR, allowNull: false, field: "IHF002" },
  newOnHandQtyFraction: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "IHNOQF",
  },
  keyedUnitOfMeasure: {
    type: DataTypes.CHAR,
    allowNull: false,
    field: "IHKUNM",
  },
  nextMonthCode: { type: DataTypes.CHAR, allowNull: false, field: "IHNMCD" },
  filler1: { type: DataTypes.CHAR, allowNull: false, field: "IHF001" },
  apLastInvoiceDate: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "IHAPID",
  },
  apLastExpenseGlNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "IHAPLE",
  },
  apLastPurchaseJrnl: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "IHAPLP",
  },
  apTotalQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "IHAPTQ",
  },
  apTotalQtyFraction: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "IHAPTF",
  },
  apTotalDollars: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "IHAPTD",
  },
  temperature: { type: DataTypes.INTEGER, allowNull: false, field: "IHTEMP" },
  gravity: { type: DataTypes.INTEGER, allowNull: false, field: "IHGRAV" },
  grossQuantity: { type: DataTypes.INTEGER, allowNull: false, field: "IHGQTY" },
  grossQtyFraction: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "IHGQTF",
  },
  openClosedStatus: { type: DataTypes.CHAR, allowNull: false, field: "IHCLCD" },
  closedDate: { type: DataTypes.INTEGER, allowNull: false, field: "IHCLDT" },
  accruedGlNo: { type: DataTypes.INTEGER, allowNull: false, field: "IHACGL" },
  accruedTotalDollars: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "IHACTD",
  },
  accruedFreightGlNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "IHACFG",
  },
  accruedFreightDollars: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "IHACFD",
  },
  sortCode: { type: DataTypes.CHAR, allowNull: false, field: "IHSORT" },
  invCostUnitCode: { type: DataTypes.CHAR, allowNull: false, field: "IHCOUN" },
  finprdInvCostUnitCode: {
    type: DataTypes.CHAR,
    allowNull: false,
    field: "IHFPUN",
  },
  previousOnHandQty: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "IHPVOQ",
  },
  newOnHandQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "IHNOQT",
  },
  systemDateCYMD: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "IHSDA8",
  },
  datePostedYMD: { type: DataTypes.INTEGER, allowNull: false, field: "IHDAT8" },
  transactionDateCYMD: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "IHTRD8",
  },
  closedDateCYMD: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "IHCLD8",
  },
  transferInOut: { type: DataTypes.CHAR, allowNull: false, field: "IHINOU" },
  filler3: { type: DataTypes.CHAR, allowNull: false, field: "IHF003" },
  apLastInvoiceNumber: {
    type: DataTypes.CHAR,
    allowNull: false,
    field: "IHAPIN",
  },
  poNumberFromSystem: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "IHPONM",
  },
  incomeGL: { type: DataTypes.INTEGER, allowNull: false, field: "IHCIGL" },
  expenseGL: { type: DataTypes.INTEGER, allowNull: false, field: "IHCEGL" },
  filler4: { type: DataTypes.CHAR, allowNull: false, field: "IHF004" },
};

export const freightOutBalancingInvoiceSchema = {
  isDeleted: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "BODEL",
  },
  companyNo: {
    type: DataTypes.DECIMAL(2, 0),
    allowNull: false,
    field: "BOCO",
  },
  ourOrderNo: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "BORDNO",
  },
  shippingReferenceNumber: {
    type: DataTypes.DECIMAL(3, 0),
    allowNull: false,
    field: "BOSRN",
  },
  systemDateTime: {
    type: DataTypes.STRING(14),
    allowNull: false,
    field: "BOSYDT",
  },
  sentToFrtProcessr: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "BOSENT",
  },
  sentToFrtProcDateTime: {
    type: DataTypes.STRING(14),
    allowNull: false,
    field: "BOSNDT",
  },
  orderBatch: {
    type: DataTypes.DECIMAL(2, 0),
    allowNull: false,
    field: "BOBTCH",
  },
  frtProcessorAction: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "BOACTN",
  },
  customerNo: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "BOCUST",
  },
  shipToNo: {
    type: DataTypes.DECIMAL(3, 0),
    allowNull: false,
    field: "BOSHIP",
  },
  pickupDate: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "BORQDT",
  },
  customerPoDate: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "BOPODT",
  },
  orderEntryDate: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "BOORDT",
  },
  billToPoNo: {
    type: DataTypes.STRING(15),
    allowNull: false,
    field: "BOPORD",
  },
  shipmentNo: {
    type: DataTypes.DECIMAL(1, 0),
    allowNull: false,
    field: "BOSHPN",
  },
  timeOfSaleHhmm: {
    type: DataTypes.DECIMAL(4, 0),
    allowNull: false,
    field: "BOTIME",
  },
  typeRMC: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "BOTYPE",
  },
  glNo: {
    type: DataTypes.DECIMAL(8, 0),
    allowNull: false,
    field: "BOGLNO",
  },
  terms: {
    type: DataTypes.DECIMAL(2, 0),
    allowNull: false,
    field: "BOTERM",
  },
  salesman: {
    type: DataTypes.DECIMAL(2, 0),
    allowNull: false,
    field: "BOSLMN",
  },
  railCarNumber: {
    type: DataTypes.STRING(10),
    allowNull: false,
    field: "BOCAR",
  },
  carrierCodeCcCtRc: {
    type: DataTypes.STRING(2),
    allowNull: false,
    field: "BOCACD",
  },
  frtPerCodeLC: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "BOFPER",
  },
  completeYN: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "BOCMP",
  },
  invoiceNo: {
    type: DataTypes.DECIMAL(7, 0),
    allowNull: false,
    field: "BOINVN",
  },
  invoiceDate: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "BOINDT",
  },
  shipDate: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "BOSHDT",
  },
  ppdAmount: {
    type: DataTypes.DECIMAL(9, 2),
    allowNull: false,
    field: "BOPAMT",
  },
  sortField: {
    type: DataTypes.STRING(3),
    allowNull: false,
    field: "BOSORT",
  },
  location: {
    type: DataTypes.STRING(3),
    allowNull: false,
    field: "BOLOC",
  },
  inventoryType: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "BOINTY",
  },
  distributorOrder: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "BODIOR",
  },
  distribShipOrder: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "BODSOR",
  },
  distribPurchEnough: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "BODIPU",
  },
  distribPurchAuth: {
    type: DataTypes.STRING(3),
    allowNull: false,
    field: "BODIAU",
  },
  billedCustNo: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "BOBCUS",
  },
  billedCustShipTo: {
    type: DataTypes.DECIMAL(3, 0),
    allowNull: false,
    field: "BOBCSH",
  },
  lockOutCode: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "BOLOCK",
  },
  lockoutWsid: {
    type: DataTypes.STRING(10),
    allowNull: false,
    field: "BOWSID",
  },
  orderYN: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "BOORDY",
  },
  billOfLadingNo: {
    type: DataTypes.DECIMAL(7, 0),
    allowNull: false,
    field: "BOBLNO",
  },
  keyedInvoiceNo: {
    type: DataTypes.DECIMAL(7, 0),
    allowNull: false,
    field: "BOKEYI",
  },
  shipToPoNo: {
    type: DataTypes.STRING(15),
    allowNull: false,
    field: "BOSHPN",
  },
  userInfoFld1: {
    type: DataTypes.STRING(20),
    allowNull: false,
    field: "BOUSR1",
  },
  userInfoFld2: {
    type: DataTypes.STRING(20),
    allowNull: false,
    field: "BOUSR2",
  },
  freightCodeCPA: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "BOFRCD",
  },
  carrierId: {
    type: DataTypes.STRING(6),
    allowNull: false,
    field: "BOCAID",
  },
  routeCode: {
    type: DataTypes.STRING(6),
    allowNull: false,
    field: "BORTCD",
  },
  routingLine1: {
    type: DataTypes.STRING(25),
    allowNull: false,
    field: "BORTG1",
  },
  routingLine2: {
    type: DataTypes.STRING(25),
    allowNull: false,
    field: "BORTG2",
  },
  printedPickYN: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "BOPPIK",
  },
  printedBolYN: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "BOPBOL",
  },
  multiloadYN: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "BOMULO",
  },
  totalLoads: {
    type: DataTypes.DECIMAL(3, 0),
    allowNull: false,
    field: "BOTOLO",
  },
  loadsDay: {
    type: DataTypes.DECIMAL(3, 0),
    allowNull: false,
    field: "BOLODA",
  },
  loadVolume: {
    type: DataTypes.DECIMAL(7, 0),
    allowNull: false,
    field: "BOLOVO",
  },
  weekendPickUpNY: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "BOWEPU",
  },
  pickupDtCymd: {
    type: DataTypes.DECIMAL(8, 0),
    allowNull: false,
    field: "BORQD8",
  },
  customerPoDateCymd: {
    type: DataTypes.DECIMAL(8, 0),
    allowNull: false,
    field: "BOPOD8",
  },
  orderEntryDateCymd: {
    type: DataTypes.DECIMAL(8, 0),
    allowNull: false,
    field: "BOORD8",
  },
  invoiceDateCymd: {
    type: DataTypes.DECIMAL(8, 0),
    allowNull: false,
    field: "BOIND8",
  },
  shipDateCymd: {
    type: DataTypes.DECIMAL(8, 0),
    allowNull: false,
    field: "BOSHD8",
  },
  deleteDate: {
    type: DataTypes.DECIMAL(8, 0),
    allowNull: false,
    field: "BODLDT",
  },
  deleteTime: {
    type: DataTypes.STRING(15),
    allowNull: false,
    field: "BODLTM",
  },
  orderTakenByInitls: {
    type: DataTypes.STRING(3),
    allowNull: false,
    field: "BOTKBY",
  },
  customerContact: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: "BOCNCT",
  },
  separateFrtNY: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "BOSFRT",
  },
  billedCustOrdNo: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "BOBCOR",
  },
  billedCustMemoOrd: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "BOBCMO",
  },
  memoInvcCust: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "BOMICU",
  },
  memoInvcCustShipto: {
    type: DataTypes.DECIMAL(3, 0),
    allowNull: false,
    field: "BOMICS",
  },
  autoReceiptsCoNo: {
    type: DataTypes.DECIMAL(2, 0),
    allowNull: false,
    field: "BORRCO",
  },
  sendInvoiceEdi: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "BOEDIS",
  },
  custOwnedProductOnly: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "BOCOON",
  },
  groupBy: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "BOGPBY",
  },
  responsibleArea: {
    type: DataTypes.STRING(5),
    allowNull: false,
    field: "BORACD",
  },
  majorLocation: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "BOMLCD",
  },
  scheduledShipDate: {
    type: DataTypes.DECIMAL(8, 0),
    allowNull: false,
    field: "BOSSD8",
  },
  shiptoJoinCustomer: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "BOSHCU",
  },
  shiptoJoinShipToNumber: {
    type: DataTypes.DECIMAL(3, 0),
    allowNull: false,
    field: "BOSHSH",
  },
  thirdPartyFreightProcessor: {
    type: DataTypes.STRING(6),
    allowNull: false,
    field: "BOFPCD",
  },
  thirdPartyFrghtProcStatus: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "BOFPST",
  },
  orderVersionNumber: {
    type: DataTypes.DECIMAL(3, 0),
    allowNull: false,
    field: "BOVERN",
  },
  prevShipmentNumberUsed: {
    type: DataTypes.DECIMAL(3, 0),
    allowNull: false,
    field: "BOSHPV",
  },
  calculateFreightYN: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "BOCAFR",
  },
  facilityBatch: {
    type: DataTypes.STRING(18),
    allowNull: false,
    field: "BOFACN",
  },
  pickUpFromTime: {
    type: DataTypes.DECIMAL(4, 0),
    allowNull: false,
    field: "BOPUTF",
  },
  // isDeleted: {
  //   type: DataTypes.DECIMAL(4, 0),
  //   allowNull: false,
  //   field: "BODLTF",
  // },
  // isDeleted: {
  //   type: DataTypes.DECIMAL(4, 0),
  //   allowNull: false,
  //   field: "BODLTT",
  // },
  productTotal: {
    type: DataTypes.DECIMAL(11, 2),
    allowNull: false,
    field: "BOPRTO",
  },
  miscTotal: {
    type: DataTypes.DECIMAL(11, 2),
    allowNull: false,
    field: "BOMITO",
  },
  freightTotal: {
    type: DataTypes.DECIMAL(11, 2),
    allowNull: false,
    field: "BOFRTO",
  },
  orderTotal: {
    type: DataTypes.DECIMAL(11, 2),
    allowNull: false,
    field: "BOORTO",
  },
  pickListRemark1: {
    type: DataTypes.STRING(60),
    allowNull: false,
    field: "BXOMK1",
  },
  pickListRemark2: {
    type: DataTypes.STRING(60),
    allowNull: false,
    field: "BXOMK2",
  },
  pickListRemark3: {
    type: DataTypes.STRING(60),
    allowNull: false,
    field: "BXOMK3",
  },
  pickListRemark4: {
    type: DataTypes.STRING(60),
    allowNull: false,
    field: "BXOMK4",
  },
  bolRemark1: {
    type: DataTypes.STRING(60),
    allowNull: false,
    field: "BXBMK1",
  },
  bolRemark2: {
    type: DataTypes.STRING(60),
    allowNull: false,
    field: "BXBMK2",
  },
  bolRemark3: {
    type: DataTypes.STRING(60),
    allowNull: false,
    field: "BXBMK3",
  },
  bolRemark4: {
    type: DataTypes.STRING(60),
    allowNull: false,
    field: "BXBMK4",
  },
  freightBillName: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: "BXFRNM",
  },
  freightBillAddr1: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: "BXFRA1",
  },
  freightBillAddr2: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: "BXFRA2",
  },
  freightBillAddr3: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: "BXFRA3",
  },
  invoiceRemark1: {
    type: DataTypes.STRING(60),
    allowNull: false,
    field: "BXIMK1",
  },
  invoiceRemark2: {
    type: DataTypes.STRING(60),
    allowNull: false,
    field: "BXIMK2",
  },
  dispatchInfo1: {
    type: DataTypes.STRING(60),
    allowNull: false,
    field: "BXDSP1",
  },
  dispatchInfo2: {
    type: DataTypes.STRING(60),
    allowNull: false,
    field: "BXDSP2",
  },
  dispatchInfo3: {
    type: DataTypes.STRING(60),
    allowNull: false,
    field: "BXDSP3",
  },
  dispatchInfo4: {
    type: DataTypes.STRING(60),
    allowNull: false,
    field: "BXDSP4",
  },
  customerName: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: "BONAME",
  },
  addressLine1: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: "BOADR1",
  },
  addressLine2: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: "BOADR2",
  },
  addressLine3: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: "BOADR3",
  },
  addressLine4: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: "BOADR4",
  },
  shiptoName: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: "BOSNAM",
  },
  shiptoAddr1: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: "BOSAD1",
  },
  shiptoAddr2: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: "BOSAD2",
  },
  shiptoAddr3: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: "BOSAD3",
  },
  shiptoAddr4: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: "BOSAD4",
  },
  city: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: "BOSCIT",
  },
  state: {
    type: DataTypes.STRING(2),
    allowNull: false,
    field: "BOSST",
  },
  zipPostalCode: {
    type: DataTypes.STRING(15),
    allowNull: false,
    field: "BOSZP",
  },
  country: {
    type: DataTypes.STRING(3),
    allowNull: false,
    field: "BOSCTY",
  },
  exportYn: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "BOEXPO",
  },
  carrierDescription: {
    type: DataTypes.STRING(25),
    allowNull: false,
    field: "BOCADS",
  },
  freightCodeDescription: {
    type: DataTypes.STRING(10),
    allowNull: false,
    field: "BOFRDS",
  },
  freightBillToName: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: "BOFNAM",
  },
  freightBillToAddr1: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: "BOFAD1",
  },
  freightBillToAddr2: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: "BOFAD2",
  },
  freightBillToCity: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: "BOFCIT",
  },
  freightBillToState: {
    type: DataTypes.STRING(2),
    allowNull: false,
    field: "BOFST",
  },
  freightBillToZipPostal: {
    type: DataTypes.STRING(15),
    allowNull: false,
    field: "BOFZP",
  },
  freightBillToCountry: {
    type: DataTypes.STRING(3),
    allowNull: false,
    field: "BOFCTY",
  },
  bookStatusCd: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "BOBKST",
  },
  rush: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "BORUSH",
  },
  orderProcessStatusCode: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "BOORPR",
  },
  freightBalancedClosed: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "BOCLOS",
  },
  frtBalancedClosedDate: {
    type: DataTypes.DECIMAL(8, 0),
    allowNull: false,
    field: "BOCLD8",
  },
  originalOrderNumber: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "BOOONO",
  },
  filler: {
    type: DataTypes.STRING(82),
    allowNull: false,
    field: "BDF023",
  },
};

// Join of FRCINH and FRCFBH
export const freightCarrierInvoiceSchema = {
  isDeleted: { type: DataTypes.CHAR, allowNull: false, field: "FRDEL" },
  companyNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "FRCO",
    primaryKey: true,
  },
  carrierId: {
    type: DataTypes.CHAR,
    allowNull: false,
    field: "FRCAID",
    primaryKey: true,
  },
  carrierInvoiceNo: {
    type: DataTypes.CHAR,
    allowNull: false,
    field: "FRCAIN",
    primaryKey: true,
  },
  invoiceType: { type: DataTypes.CHAR, allowNull: false, field: "FRINTY" },
  invoiceDate: { type: DataTypes.INTEGER, allowNull: false, field: "FRINDT" },
  invoiceAmount: { type: DataTypes.INTEGER, allowNull: false, field: "FRINAM" },
  ourOrderNo: { type: DataTypes.INTEGER, allowNull: false, field: "FRRDNO" },
  shippingReferenceNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "FRSRN",
  },
  dateTimeStamp: { type: DataTypes.CHAR, allowNull: false, field: "FRDTTM" },
  carrierInvoiceStatus: {
    type: DataTypes.CHAR,
    allowNull: false,
    field: "FRCIST",
  },
  freightBalanceOverrideTotal: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "FRFBOA",
  },
  filler1: { type: DataTypes.CHAR, allowNull: false, field: "FRF001" },
  approvalStatus: { type: DataTypes.CHAR, allowNull: false, field: "FRALST" },
  approvalDateTime: { type: DataTypes.CHAR, allowNull: false, field: "FRALDT" },
  apInvoiceStatus: { type: DataTypes.CHAR, allowNull: false, field: "FRAPST" },
  apDateTime: { type: DataTypes.CHAR, allowNull: false, field: "FRAPDT" },
  carrierUserId: { type: DataTypes.CHAR, allowNull: false, field: "FRCUID" },
  billingType: { type: DataTypes.CHAR, allowNull: false, field: "FRCBTY" },
  carrierIpAddress: { type: DataTypes.CHAR, allowNull: false, field: "FRIPAD" },
  vendorNo: { type: DataTypes.CHAR, allowNull: false, field: "FRVEND" },
  checkNumber: { type: DataTypes.INTEGER, allowNull: false, field: "FRCKNO" },
  checkDate: { type: DataTypes.INTEGER, allowNull: false, field: "FRCKD8" },
  voucherAmount: { type: DataTypes.INTEGER, allowNull: false, field: "FRVAMT" },
  filler2: { type: DataTypes.CHAR, allowNull: false, field: "FRF002" },
};
export const SpooledMetadataReportModelSchema = {
  pdfFileName: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: "MEPDFNM",
  },
  spoolFileName: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: "MESPFNM",
  },
  reportType: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: "MERPTNAM",
  },
  jobName: { type: DataTypes.STRING(10), allowNull: true, field: "MEJOBNM" },
  jobNumber: { type: DataTypes.INTEGER, allowNull: true, field: "MEJOBNO" },
  jobUser: { type: DataTypes.STRING(10), allowNull: true, field: "MEJBUSR" },
  jobSystemName: {
    type: DataTypes.STRING(25),
    allowNull: true,
    field: "MEJBSNM",
  },
  filePath: { type: DataTypes.STRING(100), allowNull: true, field: "MEIFSPT" },
  outputQueueName: {
    type: DataTypes.STRING(15),
    allowNull: true,
    field: "MEOQNM",
  },
  outputQueueLibrary: {
    type: DataTypes.STRING(15),
    allowNull: true,
    field: "MEOQLIB",
  },
  reportDateTime: {
    type: DataTypes.DATE,
    allowNull: true,
    field: "MECRTDT",
    primaryKey: true,
  },
  formType: { type: DataTypes.STRING(10), allowNull: true, field: "MEFRMT" },
  error: { type: DataTypes.STRING(100), allowNull: true, field: "MEERR" },
};

export const ProcessTypeSchema = {
  reportName: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: "MERPTNAM",
  },
  sharedReport: {
    type: DataTypes.STRING(1), // Could be 'Y' or 'N'
    allowNull: true,
    field: "MESHARYN",
  },
  definitionName: {
    type: DataTypes.STRING(10),
    allowNull: true,
    field: "MEDEFNAM",
  },
  reportGroup: {
    type: DataTypes.STRING(30),
    allowNull: true,
    field: "MEREPTGP",
  },
  friendlyName: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: "MEFRNNAM",
    primaryKey: true,
  },
  path: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: "MEBPATH",
  },
};

// APOPNH - Open Payable Header Schema
export const openPayableHeaderSchema = {
  // Primary key fields
  isDeleted: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "OPDEL",
  },
  companyNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "OPCONO",
    primaryKey: true,
  },
  vendorNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "OPVEND",
    primaryKey: true,
  },
  voucherNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "OPVONO",
    primaryKey: true,
  },

  // Header information
  recordType: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "OPRCTY", // 1 = HEADER
  },
  sequenceNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "OPSEQN", // 001 SEQUENCE NO
  },
  grossAmount: {
    type: DataTypes.DECIMAL(11, 2),
    allowNull: false,
    field: "OPGRAM",
  },
  discount: {
    type: DataTypes.DECIMAL(9, 2),
    allowNull: false,
    field: "OPDISC",
  },
  partialPaidToDate: {
    type: DataTypes.DECIMAL(11, 2),
    allowNull: false,
    field: "OPPPTD",
  },
  invoiceDescription: {
    type: DataTypes.STRING(25),
    allowNull: false,
    field: "OPINDS",
  },
  apGlAccountNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "OPAPGL",
  },
  retentionVoucherFlag: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "OPRTCD", // R = RETENTION VOUCHER
  },
  discountDueDate6: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "OPDSDT",
  },
  discountDueDate8: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "OPDSD8",
  },
  filler1: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "OPF006",
  },
  invoiceDate6: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "OPINVD",
  },
  dueDate6: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "OPDUED",
  },
  prepaidCheckNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "OPCKNO",
  },
  prepaidVoucherFlag: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "OPPAID", // P = PREPAID VOUCHER
  },
  filler2: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "OPF001",
  },
  lastPaidDate6: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "OPLPDT",
  },
  filler3: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "OPF002",
  },
  cashDisbJrnlDate6: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "OPCDDT",
  },
  purchJrnlDate6: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "OPPJDT",
  },
  purchaseJrnlNo: {
    type: DataTypes.STRING(8),
    allowNull: false,
    field: "OPJRNO",
  },
  holdPaymentFlag: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "OPHALT",
  },
  holdDescription: {
    type: DataTypes.STRING(25),
    allowNull: false,
    field: "OPHDES",
  },
  singleCheckFlag: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "OPSNGL", // S = SINGLE CHECK
  },
  bankGlNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "OPBKGL",
  },
  lastPaidAmount: {
    type: DataTypes.DECIMAL(11, 2),
    allowNull: false,
    field: "OPLPAM",
  },
  discountTaken: {
    type: DataTypes.DECIMAL(9, 2),
    allowNull: false,
    field: "OPDSTK",
  },
  filler4: {
    type: DataTypes.STRING(8),
    allowNull: false,
    field: "OPF003",
  },
  cancelEntryNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "OPENTN",
  },
  filler5: {
    type: DataTypes.STRING(29),
    allowNull: false,
    field: "OPF004",
  },
  invoiceDate8: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "OPINV8",
  },
  dueDate8: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "OPDUE8",
  },
  lastPaidDate8: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "OPLPD8",
  },
  cashDisbJrnlDate8: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "OPCDD8",
  },
  purchJrnlDate8: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "OPPJD8",
  },
  freightTotal: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: false,
    field: "OPFRTL",
  },
  prodInvVendorNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "OPPIVN",
  },
  prodInvNo: {
    type: DataTypes.STRING(10),
    allowNull: false,
    field: "OPPIIN",
  },
  salesOrderNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "OPSORN",
  },
  salesSrnNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "OPSSRN",
  },
  filler6: {
    type: DataTypes.STRING(23),
    allowNull: false,
    field: "OPF005",
  },
  apTerms: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "OPTERM",
  },
  carrierId: {
    type: DataTypes.STRING(6),
    allowNull: false,
    field: "OPCAID",
  },
  invoiceNo: {
    type: DataTypes.STRING(20),
    allowNull: false,
    field: "OPINVN",
  },
  filler7: {
    type: DataTypes.STRING(44),
    allowNull: false,
    field: "OPF007",
  },
};

// APOPND - Open Payable Details Schema
export const openPayableDetailsSchema = {
  // Primary Key Fields
  isDeleted: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "OPDEL",
  },
  companyNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "OPCONO",
    primaryKey: true,
  },
  vendorNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "OPVEND",
    primaryKey: true,
  },
  voucherNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "OPVONO",
    primaryKey: true,
  },
  detailType: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "OPRCTY",
    primaryKey: true,
    comment: "Detail of Voucher",
  },
  sequenceNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "OPSEQN",
    primaryKey: true,
    comment: "Sequence No",
  },

  // Amount Fields
  grossAmount: {
    type: DataTypes.DECIMAL(11, 2),
    allowNull: false,
    field: "OPGRAM",
    comment: "Detail Line Amount",
  },
  discountAmount: {
    type: DataTypes.DECIMAL(9, 2),
    allowNull: false,
    field: "OPDISC",
    comment: "Detail Line Discount",
  },
  partialPaidToDate: {
    type: DataTypes.DECIMAL(11, 2),
    allowNull: false,
    field: "OPPPTD",
    comment: "Partial Paid to Date",
  },

  // Description and GL Information
  lineDescription: {
    type: DataTypes.STRING(25),
    allowNull: false,
    field: "OPLNDS",
    comment: "Detail Line Description",
  },
  expenseGlAccount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "OPEXGL",
    comment: "Expense GL Account",
  },
  filler1: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "OPF001",
    comment: "Filler",
  },
  expenseCompanyNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "OPEXCO",
    comment: "Exp Co No for GL",
  },
  lastPaidDate6: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "OPLPDT",
    comment: "Last Paid Date (YYMMDD)",
  },

  // Reference Fields
  purchaseJournalNo: {
    type: DataTypes.STRING(8),
    allowNull: false,
    field: "OPJRNO",
    comment: "Purchase Journal No",
  },
  inventoryItemNo: {
    type: DataTypes.STRING(13),
    allowNull: false,
    field: "OPITMN",
    comment: "Inventory Item No",
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "OPQTY",
    comment: "Quantity",
  },
  filler2: {
    type: DataTypes.STRING(9),
    allowNull: false,
    field: "OPF002",
    comment: "Filler",
  },

  // Job Costing
  jobNo: {
    type: DataTypes.STRING(6),
    allowNull: false,
    field: "OPJOBN",
    comment: "Job No",
  },
  jobExtraField: {
    type: DataTypes.STRING(2),
    allowNull: false,
    field: "OPJOBX",
    comment: "Extra Job Field",
  },
  costCode: {
    type: DataTypes.STRING(6),
    allowNull: false,
    field: "OPCCOD",
    comment: "Cost Code",
  },
  costType: {
    type: DataTypes.STRING(2),
    allowNull: false,
    field: "OPCTYP",
    comment: "Cost Type",
  },
  jobCostQuantity: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: false,
    field: "OPJQTY",
    comment: "Job Cost Quantity",
  },

  // Purchase Order References
  purchaseOrderNo: {
    type: DataTypes.STRING(6),
    allowNull: false,
    field: "OPFIL5",
    comment: "PO No",
  },
  gallons: {
    type: DataTypes.DECIMAL(7, 0),
    allowNull: false,
    field: "OPGALN",
    comment: "Gallons",
  },
  receiptNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "OPRCPT",
    comment: "Receipt Number",
  },
  poStatus: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "OPCLCD",
    comment: "Open/Closed PO Status",
  },
  poLineSequenceNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "OPPOSQ",
    comment: "PO Line Seq No",
  },
  productAmount: {
    type: DataTypes.DECIMAL(11, 2),
    allowNull: false,
    field: "OPPRAM",
    comment: "Product Amount",
  },
  freightAmount: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: false,
    field: "OPFRAM",
    comment: "Freight Amount",
  },
  filler3: {
    type: DataTypes.STRING(69),
    allowNull: false,
    field: "OPF003",
    comment: "Filler",
  },

  // Date Field (8-digit format)
  lastPaidDate8: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "OPLPD8",
    comment: "Last Paid Date (YYYYMMDD)",
  },

  // Product Information
  productLocation: {
    type: DataTypes.STRING(3),
    allowNull: false,
    field: "OPLOC",
    comment: "Product Location",
  },
  productCode: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "OPPROD",
    comment: "Product Code",
  },
  productTank: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "OPTANK",
    comment: "Product Tank",
  },
  productContainer: {
    type: DataTypes.STRING(3),
    allowNull: false,
    field: "OPCNTR",
    comment: "Product Container",
  },
  poNumber: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: "OPPONM",
    comment: "PO No",
  },
  filler4: {
    type: DataTypes.STRING(95),
    allowNull: false,
    field: "OPF004",
    comment: "Filler",
  },
};

// APOPNV - Open Payable Vendor Schema
export const openPayableVendorSchema = {
  // Primary Key Fields
  isDeleted: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "OPDEL",
    comment: "Delete flag",
  },
  companyNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "OPCONO",
    primaryKey: true,
    comment: "Company No",
  },
  vendorNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "OPVEND",
    primaryKey: true,
    comment: "Vendor No",
  },
  voucherNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "OPVONO",
    primaryKey: true,
    comment: "Voucher No",
  },

  // Vendor Type and Sequence
  recordType: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "OPRCTY",
    comment: "Record Type (3 = One Time Vendor)",
  },
  sequenceNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "OPSEQN",
    comment: "Sequence No (001)",
  },

  // Vendor Information
  vendorName: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: "OPVNAM",
    comment: "Vendor Name",
  },
  addressLine1: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: "OPVAD1",
    comment: "Address Line 1",
  },
  addressLine2: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: "OPVAD2",
    comment: "Address Line 2",
  },
  addressLine3: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: "OPVAD3",
    comment: "Address Line 3",
  },
  addressLine4: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: "OPVAD4",
    comment: "Address Line 4",
  },

  // Filler Field
  filler1: {
    type: DataTypes.STRING(217),
    allowNull: false,
    field: "OPF001",
    comment: "Filler",
  },
};
export const VendorContactDetailSchema = {
  deleteCode: {
    type: DataTypes.STRING(1),
    allowNull: true,
    field: "FMDEL",
  },
  companyNo: {
    type: DataTypes.INTEGER, // Numeric, length 2
    allowNull: true,
    field: "FMCONO",
    primaryKey: true,
  },
  vendorNo: {
    type: DataTypes.INTEGER, // Numeric, length 5
    allowNull: true,
    field: "FMVEND",
  },
  formType: {
    type: DataTypes.STRING(4),
    allowNull: true,
    field: "FMFMTY",
  },
  sequenceNumber: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: "FMSEQ#",
  },
  contactName: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: "FMCNTC",
  },
  emailAddress: {
    type: DataTypes.STRING(60),
    allowNull: true,
    field: "FMEMLA",
  },
  faxNumber: {
    type: DataTypes.STRING(20),
    allowNull: true,
    field: "FMFAX#",
  },
  sendAchEmail: {
    type: DataTypes.STRING(1), // 'Y' or 'N'
    allowNull: true,
    field: "FMFMYN",
  },
  filler: {
    type: DataTypes.STRING(113),
    allowNull: true,
    field: "FMF001",
  },
};

export const openPayableHistoryHeaderSchema = {
  // Primary key fields
  isDeleted: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "OHDEL",
  },
  companyNo: {
    type: DataTypes.DECIMAL(2, 0),
    allowNull: false,
    field: "OHCONO",
    primaryKey: true,
  },
  vendorNo: {
    type: DataTypes.DECIMAL(5, 0),
    allowNull: false,
    field: "OHVEND",
    primaryKey: true,
  },
  voucherNo: {
    type: DataTypes.DECIMAL(5, 0),
    allowNull: false,
    field: "OHVONO",
    primaryKey: true,
  },
  Header: {
    type: DataTypes.DECIMAL(1, 0),
    allowNull: false,
    field: "OHRCTY",
  },
  SequenceNo: {
    type: DataTypes.DECIMAL(3, 0),
    allowNull: false,
    field: "OHSEQN",
  },
  grossAmount: {
    type: DataTypes.DECIMAL(11, 2),
    allowNull: false,
    field: "OHGRAM",
  },
  discount: {
    type: DataTypes.DECIMAL(9, 2),
    allowNull: false,
    field: "OHDISC",
  },
  partialPaidToDate: {
    type: DataTypes.DECIMAL(11, 2),
    allowNull: false,
    field: "OHPPTD",
  },
  invoiceDescription: {
    type: DataTypes.STRING(25),
    allowNull: false,
    field: "OHINDS",
  },
  apGlAccountNo: {
    type: DataTypes.DECIMAL(8, 0),
    allowNull: false,
    field: "OHAPGL",
  },
  RetentionVoucher: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "OHRTVC",
  },
  discountDueDate: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "OHDSDT",
  },
  filler: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "OHF005",
  },
  invoiceDate: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "OHINVD",
  },
  dueDate: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "OHDUED",
  },
  checkNo: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "OHCKNO",
  },
  PrepaidVoucher: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "OHPAID",
  },
  filler1: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "OHF001",
  },
  lastPaidDateYymmdd: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "OHLPDT",
  },
  filler2: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "OHF002",
  },
  cashDisbJrnlYymmdd: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "OHCDDT",
  },
  purchJrnlYymmdd: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "OHPJDT",
  },
  purchaseJournalNo: {
    type: DataTypes.STRING(8),
    allowNull: false,
    field: "OHJRNO",
  },
  HoldPymtVouchr: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "OHHALT",
  },
  HoldDescription: {
    type: DataTypes.STRING(25),
    allowNull: false,
    field: "OHHDES",
  },
  SingleCheck: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "OHSNGL",
  },
  bankGlNo: {
    type: DataTypes.DECIMAL(8, 0),
    allowNull: false,
    field: "OHBKGL",
  },
  lastPaymentAmt: {
    type: DataTypes.DECIMAL(11, 2),
    allowNull: false,
    field: "OHLPAM",
  },
  discountAlreadyTaken: {
    type: DataTypes.DECIMAL(9, 2),
    allowNull: false,
    field: "OHDSTK",
  },
  discountDueDate8: {
    type: DataTypes.DECIMAL(8, 0),
    allowNull: false,
    field: "OHDSD8",
  },
  filler3: {
    type: DataTypes.STRING(13),
    allowNull: false,
    field: "OHF003",
  },
  companyNo1: {
    type: DataTypes.DECIMAL(2, 0),
    allowNull: false,
    field: "OHKCO",
  },
  vendorNo1: {
    type: DataTypes.DECIMAL(5, 0),
    allowNull: false,
    field: "OHKVEN",
  },
  checkNo1: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "OHKCHK",
  },
  voucherNo1: {
    type: DataTypes.DECIMAL(5, 0),
    allowNull: false,
    field: "OHKVON",
  },
  Header1: {
    type: DataTypes.DECIMAL(1, 0),
    allowNull: false,
    field: "OHKRCT",
  },
  SequenceNo1: {
    type: DataTypes.DECIMAL(3, 0),
    allowNull: false,
    field: "OHKSEQ",
  },
  CancelledVoucher: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "OHKCNL",
  },
  paidOnYymmdd: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "OHKYMD",
  },
  invoiceDate1: {
    type: DataTypes.DECIMAL(8, 0),
    allowNull: false,
    field: "OHINV8",
  },
  dueDate1: {
    type: DataTypes.DECIMAL(8, 0),
    allowNull: false,
    field: "OHDUE8",
  },
  lastPaidDateYymmdd1: {
    type: DataTypes.DECIMAL(8, 0),
    allowNull: false,
    field: "OHLPD8",
  },
  cashDisbJrnlYymmdd1: {
    type: DataTypes.DECIMAL(8, 0),
    allowNull: false,
    field: "OHCDD8",
  },
  purchJrnlYymmdd1: {
    type: DataTypes.DECIMAL(8, 0),
    allowNull: false,
    field: "OHPJD8",
  },
  paidOnYymmdd1: {
    type: DataTypes.DECIMAL(8, 0),
    allowNull: false,
    field: "OHKYM8",
  },
  freightTotal: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: false,
    field: "OHFRTL",
  },
  prodInvVend: {
    type: DataTypes.DECIMAL(5, 0),
    allowNull: false,
    field: "OHPIVN",
  },
  prodInvInv: {
    type: DataTypes.STRING(10),
    allowNull: false,
    field: "OHPIIN",
  },
  salesOrder: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "OHSORN",
  },
  salesSrn: {
    type: DataTypes.DECIMAL(3, 0),
    allowNull: false,
    field: "OHSSRN",
  },
  filler4: {
    type: DataTypes.STRING(15),
    allowNull: false,
    field: "OHF004",
  },
  apTerms: {
    type: DataTypes.DECIMAL(2, 0),
    allowNull: false,
    field: "OHTERM",
  },
  carrierId: {
    type: DataTypes.STRING(6),
    allowNull: false,
    field: "OHCAID",
  },
  invoiceNo: {
    type: DataTypes.STRING(20),
    allowNull: false,
    field: "OHINVN",
  },
  filler5: {
    type: DataTypes.STRING(44),
    allowNull: false,
    field: "OHF006",
  },
};

export const openPayableHistoryDetailSchema = {
  // Primary key fields
  isDeleted: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "OHDEL",
  },
  companyNo: {
    type: DataTypes.DECIMAL(2, 0),
    allowNull: false,
    field: "OHCONO",
    primaryKey: true,
  },
  vendorNo: {
    type: DataTypes.DECIMAL(5, 0),
    allowNull: false,
    field: "OHVEND",
    primaryKey: true,
  },
  voucherNo: {
    type: DataTypes.DECIMAL(5, 0),
    allowNull: false,
    field: "OHVONO",
    primaryKey: true,
  },
  detail: {
    type: DataTypes.DECIMAL(1, 0),
    allowNull: false,
    field: "OHRCTY",
    primaryKey: true,
  },
  sequenceNo: {
    type: DataTypes.DECIMAL(3, 0),
    allowNull: false,
    field: "OHSEQN",
    primaryKey: true,
  },
  detailLineAmount: {
    type: DataTypes.DECIMAL(11, 2),
    allowNull: false,
    field: "OHGRAM",
  },
  detailLineDiscount: {
    type: DataTypes.DECIMAL(9, 2),
    allowNull: false,
    field: "OHDISC",
  },
  partialPaidToDate: {
    type: DataTypes.DECIMAL(11, 2),
    allowNull: false,
    field: "OHPPTD",
  },
  detailLineDescript: {
    type: DataTypes.STRING(25),
    allowNull: false,
    field: "OHLNDS",
  },
  expenseGlAccount: {
    type: DataTypes.DECIMAL(8, 0),
    allowNull: false,
    field: "OHEXGL",
  },
  filler: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "OHF001",
  },
  expCoForGl: {
    type: DataTypes.DECIMAL(2, 0),
    allowNull: false,
    field: "OHEXCO",
  },
  lastPaidDateYymmdd: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "OHLPDT",
  },
  purchaseJournalNo: {
    type: DataTypes.STRING(8),
    allowNull: false,
    field: "OHJRNO",
  },
  inventoryItemNo: {
    type: DataTypes.STRING(13),
    allowNull: false,
    field: "OHITMN",
  },
  quantity: {
    type: DataTypes.DECIMAL(11, 0),
    allowNull: false,
    field: "OHQTY",
  },
  filler1: {
    type: DataTypes.STRING(9),
    allowNull: false,
    field: "OHF002",
  },
  jobNumber: {
    type: DataTypes.STRING(6),
    allowNull: false,
    field: "OHJOBN",
  },
  extraJobField: {
    type: DataTypes.STRING(2),
    allowNull: false,
    field: "OHJOBX",
  },
  costCode: {
    type: DataTypes.STRING(6),
    allowNull: false,
    field: "OHCCOD",
  },
  costType: {
    type: DataTypes.STRING(2),
    allowNull: false,
    field: "OHCTYP",
  },
  jobCostQuantity: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: false,
    field: "OHJQTY",
  },
  filler2: {
    type: DataTypes.STRING(6),
    allowNull: false,
    field: "OHFIL5",
  },
  gallons: {
    type: DataTypes.DECIMAL(7, 0),
    allowNull: false,
    field: "OHGALN",
  },
  receiptNumber: {
    type: DataTypes.DECIMAL(7, 0),
    allowNull: false,
    field: "OHRCPT",
  },
  openClosedStatus: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "OHCLCD",
  },
  poLineSeqNo: {
    type: DataTypes.DECIMAL(3, 0),
    allowNull: false,
    field: "OHPOSQ",
  },
  productAmount: {
    type: DataTypes.DECIMAL(11, 2),
    allowNull: false,
    field: "OHPRAM",
  },
  freightAmount: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: false,
    field: "OHFRAM",
  },
  filler3: {
    type: DataTypes.STRING(24),
    allowNull: false,
    field: "OHF003",
  },
  companyNo1: {
    type: DataTypes.DECIMAL(2, 0),
    allowNull: false,
    field: "OHKCO",
  },
  vendorNo1: {
    type: DataTypes.DECIMAL(5, 0),
    allowNull: false,
    field: "OHKVEN",
  },
  checkNo: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "OHKCHK",
  },
  voucherNo1: {
    type: DataTypes.DECIMAL(5, 0),
    allowNull: false,
    field: "OHKVON",
  },
  Header1: {
    type: DataTypes.DECIMAL(1, 0),
    allowNull: false,
    field: "OHKRCT",
  },
  SequenceNo: {
    type: DataTypes.DECIMAL(3, 0),
    allowNull: false,
    field: "OHKSEQ",
  },
  CancelledVoucher: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "OHKCNL",
  },
  paidOnYymmdd: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "OHKYMD",
  },
  lastPaidDateYymmdd1: {
    type: DataTypes.DECIMAL(8, 0),
    allowNull: false,
    field: "OHLPD8",
  },
  paidOnYymmdd1: {
    type: DataTypes.DECIMAL(8, 0),
    allowNull: false,
    field: "OHKYM8",
  },
  productLoctaion: {
    type: DataTypes.STRING(3),
    allowNull: false,
    field: "OHLOC",
  },
  productCode: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "OHPROD",
  },
  productTank: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "OHTANK",
  },
  productContainer: {
    type: DataTypes.STRING(3),
    allowNull: false,
    field: "OHCNTR",
  },
  poNo: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: "OHPONM",
  },
  filler4: {
    type: DataTypes.STRING(103),
    allowNull: false,
    field: "OHF004",
  },
};

export const openPayableHistoryVendorSchema = {
  isDeleted: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "OHDEL",
  },
  companyNo: {
    type: DataTypes.DECIMAL(2, 0),
    allowNull: false,
    field: "OHCONO",
  },
  vendorNo: {
    type: DataTypes.DECIMAL(5, 0),
    allowNull: false,
    field: "OHVEND",
  },
  voucherNo: {
    type: DataTypes.DECIMAL(5, 0),
    allowNull: false,
    field: "OHVONO",
  },
  OneTimeVendor: {
    type: DataTypes.DECIMAL(1, 0),
    allowNull: false,
    field: "OHRCTY",
  },
  SequenceNo: {
    type: DataTypes.DECIMAL(3, 0),
    allowNull: false,
    field: "OHSEQN",
  },
  vendorName: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: "OHVNAM",
  },
  addressLine1: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: "OHVAD1",
  },
  addressLine2: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: "OHVAD2",
  },
  addressLine3: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: "OHVAD3",
  },
  addressLine4: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: "OHVAD4",
  },
  filler: {
    type: DataTypes.STRING(25),
    allowNull: false,
    field: "OHF001",
  },
  companyNo1: {
    type: DataTypes.DECIMAL(2, 0),
    allowNull: false,
    field: "OHKCO",
  },
  vendorNo1: {
    type: DataTypes.DECIMAL(5, 0),
    allowNull: false,
    field: "OHKVEN",
  },
  checkNo: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "OHKCHK",
  },
  voucherNo1: {
    type: DataTypes.DECIMAL(5, 0),
    allowNull: false,
    field: "OHKVON",
  },
  Header1: {
    type: DataTypes.DECIMAL(1, 0),
    allowNull: false,
    field: "OHKRCT",
  },
  SequenceNo1: {
    type: DataTypes.DECIMAL(3, 0),
    allowNull: false,
    field: "OHKSEQ",
  },
  CancelledVoucher: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "OHKCNL",
  },
  paidOnYymmdd: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "OHKYMD",
  },
  paidOnYymmdd1: {
    type: DataTypes.DECIMAL(8, 0),
    allowNull: false,
    field: "OHKYM8",
  },
  filler2: {
    type: DataTypes.STRING(155),
    allowNull: false,
    field: "OHF002",
  },
};

export const ownerVendorReferenceSchema = {
  ownerNo: {
    field: "AGOWNR",
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  vendorNo: {
    field: "AGVEND",
    type: DataTypes.INTEGER,
  },
  isDeleted: {
    field: "AGDEL",
    type: DataTypes.STRING(1),
  },
  filler: {
    field: "AGFILL",
    type: DataTypes.STRING(51),
  },
};
export const VendorMasterAdditionalSchema = {
  isDeleted: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "VNDEL",
  },
  companyNo: {
    type: DataTypes.DECIMAL(2, 0),
    allowNull: false,
    field: "VNCO",
  },
  vendorNo: {
    type: DataTypes.DECIMAL(5, 0),
    allowNull: false,
    field: "VNVEND",
  },
  vendorName: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: "VNNAME",
  },
  addressLine1: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: "VNADD1",
  },
  addressLine2: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: "VNADD2",
  },
  addressLine3: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: "VNADD3",
  },
  addressLine4: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: "VNADD4",
  },
  zipCode: {
    type: DataTypes.DECIMAL(5, 0),
    allowNull: false,
    field: "VNZIP5",
  },
  extraZip: {
    type: DataTypes.DECIMAL(4, 0),
    allowNull: false,
    field: "VNZPX4",
  },
  alphaSortAbbr: {
    type: DataTypes.STRING(10),
    allowNull: false,
    field: "VNSORT",
  },
  areaCode: {
    type: DataTypes.DECIMAL(3, 0),
    allowNull: false,
    field: "VNAREA",
  },
  telephoneNo: {
    type: DataTypes.DECIMAL(7, 0),
    allowNull: false,
    field: "VNTELE",
  },
  lastPaymntAmt: {
    type: DataTypes.DECIMAL(9, 2),
    allowNull: false,
    field: "VNLPAY",
  },
  lastPaymntDate: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "VNLPDT",
  },
  ytdPurchases: {
    type: DataTypes.DECIMAL(11, 2),
    allowNull: false,
    field: "VNPYTD",
  },
  lstYrPurchases: {
    type: DataTypes.DECIMAL(11, 2),
    allowNull: false,
    field: "VNPLYR",
  },
  mtdDiscounts: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: false,
    field: "VNDMTD",
  },
  ytdDiscounts: {
    type: DataTypes.DECIMAL(9, 2),
    allowNull: false,
    field: "VNDYTD",
  },
  nameOverflow: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "VNNOVF",
  },
  galRcptsRequired: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "VNGRRQ",
  },
  filler1: {
    type: DataTypes.STRING(2),
    allowNull: false,
    field: "VNF001",
  },
  previousBalance: {
    type: DataTypes.DECIMAL(9, 2),
    allowNull: false,
    field: "VNPBAL",
  },
  mtdPurchases: {
    type: DataTypes.DECIMAL(9, 2),
    allowNull: false,
    field: "VNPURC",
  },
  mtdPayments: {
    type: DataTypes.DECIMAL(9, 2),
    allowNull: false,
    field: "VNPAY",
  },
  currentBalance: {
    type: DataTypes.DECIMAL(9, 2),
    allowNull: false,
    field: "VNCBAL",
  },
  hHoldPmtsVend: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "VNHOLD",
  },
  sEaVoSnglChk: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "VNSNGL",
  },
  thisYrYtdPaid: {
    type: DataTypes.DECIMAL(11, 2),
    allowNull: false,
    field: "VNTYDP",
  },
  lastYrYtdPaid: {
    type: DataTypes.DECIMAL(11, 2),
    allowNull: false,
    field: "VNLYDP",
  },
  expenseGlSub: {
    type: DataTypes.DECIMAL(8, 0),
    allowNull: false,
    field: "VNEXGL",
  },
  apTermsCode: {
    type: DataTypes.DECIMAL(2, 0),
    allowNull: false,
    field: "VNTERM",
  },
  ap1099Code: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "VN1099",
  },
  IdNo1099: {
    type: DataTypes.STRING(11),
    allowNull: false,
    field: "VNIDNO",
  },
  BoxNumber1st1099: {
    type: DataTypes.DECIMAL(2, 0),
    allowNull: false,
    field: "VNBOX1",
  },
  BoxNumber2nd1099: {
    type: DataTypes.DECIMAL(2, 0),
    allowNull: false,
    field: "VNBOX2",
  },
  BoxAmount2nd1099: {
    type: DataTypes.DECIMAL(11, 2),
    allowNull: false,
    field: "VNB2AM",
  },
  lastPaymntDate8: {
    type: DataTypes.DECIMAL(8, 0),
    allowNull: false,
    field: "VNLPD8",
  },
  carrierId: {
    type: DataTypes.STRING(6),
    allowNull: false,
    field: "VNCAID",
  },
  payeeName1: {
    type: DataTypes.STRING(40),
    allowNull: false,
    field: "VNPYN1",
  },
  payeeName2: {
    type: DataTypes.STRING(40),
    allowNull: false,
    field: "VNPYN2",
  },
  irsNameControl: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "VNNMCT",
  },
  adpPayrollId: {
    type: DataTypes.DECIMAL(7, 0),
    allowNull: false,
    field: "VNPRID",
  },
  achClass: {
    type: DataTypes.STRING(3),
    allowNull: false,
    field: "VNACLS",
  },
  achCheckingOrSavings: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "VNACOS",
  },
  achBankRoutingCode: {
    type: DataTypes.DECIMAL(9, 0),
    allowNull: false,
    field: "VNARTE",
  },
  achBankAccountNumber: {
    type: DataTypes.STRING(17),
    allowNull: false,
    field: "VNABK#",
  },
  firstName: {
    type: DataTypes.STRING(20),
    allowNull: false,
    field: "VNFNAM",
  },
  middleName: {
    type: DataTypes.STRING(20),
    allowNull: false,
    field: "VNMNAM",
  },
  businessLastName: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: "VNLNAM",
  },
  nameSuffix: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "VNSUFF",
  },
  countryCode: {
    type: DataTypes.STRING(3),
    allowNull: false,
    field: "VNCTRY",
  },
  categoryCode: {
    type: DataTypes.STRING(6),
    allowNull: false,
    field: "VNCATG",
  },
  filler3: {
    type: DataTypes.STRING(79),
    allowNull: false,
    field: "VNF003",
  },
};

export const salesAnalysisDetailSchema = {
  isDeleted: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SADEL",
  },
  companyNo: {
    type: DataTypes.DECIMAL(2, 0),
    allowNull: false,
    field: "SACO",
    primaryKey: true
  },
  customerNo: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "SACUST",
    primaryKey: true
  },
  invoiceNo: {
    type: DataTypes.DECIMAL(7, 0),
    allowNull: false,
    field: "SAINVN",
  },
  shipToNo: {
    type: DataTypes.DECIMAL(3, 0),
    allowNull: false,
    field: "SASHIP",
  },
  salesman: {
    type: DataTypes.DECIMAL(2, 0),
    allowNull: false,
    field: "SASLMN",
  },
  invoiceDateYmd: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "SAINDT",
  },
  shipQtyBilgaln: {
    type: DataTypes.DECIMAL(7, 0),
    allowNull: false,
    field: "SAQTY",
  },
  price: {
    type: DataTypes.DECIMAL(9, 4),
    allowNull: false,
    field: "SAPRCE",
  },
  cost: {
    type: DataTypes.DECIMAL(9, 4),
    allowNull: false,
    field: "SACOST",
  },
  location: {
    type: DataTypes.STRING(3),
    allowNull: false,
    field: "SALOC",
  },
  product: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "SAPROD",
  },
  tank: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "SATANK",
  },
  itemFiller: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "SAITFI",
  },
  type: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SATYPE",
  },
  orderNo: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "SAORD",
  },
  orderSeqNo: {
    type: DataTypes.DECIMAL(3, 0),
    allowNull: false,
    field: "SASEQ",
  },
  shipDateYmd: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "SASHDT",
  },
  unitOfMeasure: {
    type: DataTypes.STRING(3),
    allowNull: false,
    field: "SAUM",
  },
  timeOfSaleHhmm: {
    type: DataTypes.DECIMAL(4, 0),
    allowNull: false,
    field: "SATIME",
  },
  productGroup: {
    type: DataTypes.STRING(2),
    allowNull: false,
    field: "SAPRGP",
  },
  costingFreightAmt: {
    type: DataTypes.DECIMAL(9, 2),
    allowNull: false,
    field: "SACOFR",
  },
  filler: {
    type: DataTypes.STRING(2),
    allowNull: false,
    field: "SAF001",
  },
  customerPrice: {
    type: DataTypes.DECIMAL(9, 4),
    allowNull: false,
    field: "SACPRC",
  },
  ovrdCustomerPrice: {
    type: DataTypes.DECIMAL(9, 4),
    allowNull: false,
    field: "SAOCPR",
  },
  grossGallons: {
    type: DataTypes.DECIMAL(7, 0),
    allowNull: false,
    field: "SAGGAL",
  },
  netGallons: {
    type: DataTypes.DECIMAL(7, 0),
    allowNull: false,
    field: "SANGAL",
  },
  temperature: {
    type: DataTypes.DECIMAL(3, 0),
    allowNull: false,
    field: "SATEMP",
  },
  gravity: {
    type: DataTypes.DECIMAL(3, 0),
    allowNull: false,
    field: "SAGRAV",
  },
  gallonsCodeGN: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SAGLCD",
  },
  filler6: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SAF006",
  },
  rackPrice: {
    type: DataTypes.DECIMAL(9, 4),
    allowNull: false,
    field: "SARKPR",
  },
  priceCodeRATSOP: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SAPRCD",
  },
  inventoryState: {
    type: DataTypes.STRING(2),
    allowNull: false,
    field: "SAINST",
  },
  sSummarized: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SASUMY",
  },
  miscCodeMFT: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SAMSCD",
  },
  qtyCalcdCU: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SAQTCA",
  },
  freightRate: {
    type: DataTypes.DECIMAL(6, 4),
    allowNull: false,
    field: "SAFRRT",
  },
  taxCode1: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "SATXC1",
  },
  taxCode2: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "SATXC2",
  },
  taxCode3: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "SATXC3",
  },
  taxCode4: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "SATXC4",
  },
  taxCode5: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "SATXC5",
  },
  taxAmt1: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: false,
    field: "SATXA1",
  },
  taxAmt2: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: false,
    field: "SATXA2",
  },
  taxAmt3: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: false,
    field: "SATXA3",
  },
  taxAmt4: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: false,
    field: "SATXA4",
  },
  taxAmt5: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: false,
    field: "SATXA5",
  },
  deliveryNY: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SADELV",
  },
  billOfLadingNo: {
    type: DataTypes.DECIMAL(7, 0),
    allowNull: false,
    field: "SABOL",
  },
  glNo: {
    type: DataTypes.DECIMAL(8, 0),
    allowNull: false,
    field: "SAGLNO",
  },
  customerState: {
    type: DataTypes.STRING(2),
    allowNull: false,
    field: "SACSST",
  },
  containerCd: {
    type: DataTypes.STRING(3),
    allowNull: false,
    field: "SACNTR",
  },
  productClass: {
    type: DataTypes.STRING(3),
    allowNull: false,
    field: "SAPRCL",
  },
  filler5: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SAF005",
  },
  carrierCd: {
    type: DataTypes.STRING(2),
    allowNull: false,
    field: "SACACD",
  },
  shipCntrQty: {
    type: DataTypes.DECIMAL(7, 0),
    allowNull: false,
    field: "SACTQT",
  },
  authorizedInitials: {
    type: DataTypes.STRING(3),
    allowNull: false,
    field: "SAAUIN",
  },
  userId: {
    type: DataTypes.STRING(8),
    allowNull: false,
    field: "SAUSID",
  },
  separateFreighyNY: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SASFRT",
  },
  inventCostUnitCode: {
    type: DataTypes.STRING(6),
    allowNull: false,
    field: "SACOUN",
  },
  invoiceDateYMD8: {
    type: DataTypes.DECIMAL(8, 0),
    allowNull: false,
    field: "SAIND8",
  },
  shipDateYmd8: {
    type: DataTypes.DECIMAL(8, 0),
    allowNull: false,
    field: "SASHD8",
  },
  multiLoad: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SAMULO",
  },
  distributorOrderNo: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "SADIOR",
  },
  distribShipOrderNo: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "SADSOR",
  },
  distribPurchAuthIni: {
    type: DataTypes.STRING(3),
    allowNull: false,
    field: "SADIAU",
  },
  memoCustNo: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "SAMCUS",
  },
  memoCustShipToNo: {
    type: DataTypes.DECIMAL(3, 0),
    allowNull: false,
    field: "SAMCSH",
  },
  memoInvoicePrice: {
    type: DataTypes.DECIMAL(6, 4),
    allowNull: false,
    field: "SAMIPR",
  },
  billedCustOrderNo: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "SABCOR",
  },
  billedCustMemoOrdN: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "SABCMO",
  },
  termsSplitCd: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SATMSP",
  },
  billedCustNo: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "SABCUS",
  },
  quantityType: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SAQTTY",
  },
  fluidCode: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SAFLCD",
  },
  imsUnitOfMeasure: {
    type: DataTypes.STRING(3),
    allowNull: false,
    field: "SAIUM",
  },
  custOwnedProduct: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SACOON",
  },
  shippingReferenceNo: {
    type: DataTypes.DECIMAL(3, 0),
    allowNull: false,
    field: "SASRN#",
  },
  exportCode: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SAEXPO",
  },
  pctOfTotal: {
    type: DataTypes.DECIMAL(6, 4),
    allowNull: false,
    field: "SAPCTT",
  },
  sepFuelSurchargeAmt: {
    type: DataTypes.DECIMAL(9, 2),
    allowNull: false,
    field: "SASFSC",
  },
  description: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: "SADESC",
  },
  taxCode6: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "SATXC6",
  },
  taxCode7: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "SATXC7",
  },
  taxCode8: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "SATXC8",
  },
  taxCode9: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "SATXC9",
  },
  taxCode10: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "SATXC0",
  },
  taxAmt6: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: false,
    field: "SATXA6",
  },
  taxAmt7: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: false,
    field: "SATXA7",
  },
  taxAmt8: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: false,
    field: "SATXA8",
  },
  taxAmt9: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: false,
    field: "SATXA9",
  },
  taxAmt10: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: false,
    field: "SATXA0",
  },
  xrefProdCode: {
    type: DataTypes.STRING(20),
    allowNull: false,
    field: "SAPRXR",
  },
  vendorNo: {
    type: DataTypes.DECIMAL(5, 0),
    allowNull: false,
    field: "SAVEND",
  },
  ratePerGal: {
    type: DataTypes.DECIMAL(5, 4),
    allowNull: false,
    field: "SARAMT",
  },
  ratePctGal: {
    type: DataTypes.DECIMAL(3, 3),
    allowNull: false,
    field: "SARPCT",
  },
  salesPerGal: {
    type: DataTypes.DECIMAL(5, 4),
    allowNull: false,
    field: "SASAMT",
  },
  salesPctGal: {
    type: DataTypes.DECIMAL(3, 3),
    allowNull: false,
    field: "SASPCT",
  },
  commTotal: {
    type: DataTypes.DECIMAL(9, 2),
    allowNull: false,
    field: "SACMTL",
  },
  filler4: {
    type: DataTypes.STRING(2),
    allowNull: false,
    field: "SAF004",
  },
  salesJournalNo: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "SASJNO",
  },
  salesJournalDate: {
    type: DataTypes.DECIMAL(8, 0),
    allowNull: false,
    field: "SASJDT",
  },
  containerSize: {
    type: DataTypes.STRING(7),
    allowNull: false,
    field: "SASIZE",
  },
  weightInLbs: {
    type: DataTypes.DECIMAL(7, 0),
    allowNull: false,
    field: "SAGWT",
  },
  hazMat: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SAHAZM",
  },
  hazMatShippingDescLine1: {
    type: DataTypes.STRING(45),
    allowNull: false,
    field: "SAHZD1",
  },
  hazMatShippingDescLine2: {
    type: DataTypes.STRING(45),
    allowNull: false,
    field: "SAHZD2",
  },
  hazMatShippingDescLine3: {
    type: DataTypes.STRING(45),
    allowNull: false,
    field: "SAHZD3",
  },
  hazMatShippingDescLine4: {
    type: DataTypes.STRING(45),
    allowNull: false,
    field: "SAHZD4",
  },
  orderContainerQty: {
    type: DataTypes.DECIMAL(7, 0),
    allowNull: false,
    field: "SACQTY",
  },
  customerStkNo: {
    type: DataTypes.STRING(20),
    allowNull: false,
    field: "SACSTK",
  },
  noChargeCode: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SANOCH",
  },
  originalOrderQty: {
    type: DataTypes.DECIMAL(7, 0),
    allowNull: false,
    field: "SAORGQ",
  },
  alreadyBackordered: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SABKCD",
  },
  backorderedBitran: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SASBKC",
  },
  tareWeight: {
    type: DataTypes.DECIMAL(7, 0),
    allowNull: false,
    field: "SATARE",
  },
  grossVehicleWeight: {
    type: DataTypes.DECIMAL(7, 0),
    allowNull: false,
    field: "SAGVWT",
  },
  orderYN: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SAORDC",
  },
  pullPpdInvYN: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SAPUPI",
  },
  pullPpdInvGrossGal: {
    type: DataTypes.DECIMAL(7, 0),
    allowNull: false,
    field: "SAPUPG",
  },
  pullPpdInvNetGal: {
    type: DataTypes.DECIMAL(7, 0),
    allowNull: false,
    field: "SAPUPN",
  },
  freightGl: {
    type: DataTypes.DECIMAL(8, 0),
    allowNull: false,
    field: "SAFRGL",
  },
  overridePrice: {
    type: DataTypes.DECIMAL(9, 4),
    allowNull: false,
    field: "SAOPRC",
  },
  overrideFreightRate: {
    type: DataTypes.DECIMAL(6, 4),
    allowNull: false,
    field: "SAOFRR",
  },
  overrideTaxes: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SAOTX",
  },
  carCapacityGallons: {
    type: DataTypes.DECIMAL(7, 0),
    allowNull: false,
    field: "SACACA",
  },
  outageGallons: {
    type: DataTypes.DECIMAL(7, 0),
    allowNull: false,
    field: "SAOUTA",
  },
  customerProdDesc: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: "SACPDS",
  },
  destinationDate: {
    type: DataTypes.DECIMAL(8, 0),
    allowNull: false,
    field: "SADEA8",
  },
  extPriceComm: {
    type: DataTypes.DECIMAL(9, 2),
    allowNull: false,
    field: "SANPCM",
  },
  filler2: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SAF007",
  },
  pickListProdDesc1: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: "SAPPD1",
  },
  pickListProdDesc2: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: "SAPPD2",
  },
  imsItemPrefix: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SAIMPF",
  },
  imsItemId: {
    type: DataTypes.STRING(7),
    allowNull: false,
    field: "SAIMID",
  },
  imsQtyShipped: {
    type: DataTypes.DECIMAL(7, 0),
    allowNull: false,
    field: "SAISQT",
  },
  reportAsSales: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SARPSL",
  },
  taxExempt1: {
    type: DataTypes.STRING(12),
    allowNull: false,
    field: "SATXE1",
  },
  taxExempt2: {
    type: DataTypes.STRING(12),
    allowNull: false,
    field: "SATXE2",
  },
  taxExempt3: {
    type: DataTypes.STRING(12),
    allowNull: false,
    field: "SATXE3",
  },
  taxExempt4: {
    type: DataTypes.STRING(12),
    allowNull: false,
    field: "SATXE4",
  },
  taxExempt5: {
    type: DataTypes.STRING(12),
    allowNull: false,
    field: "SATXE5",
  },
  taxExempt6: {
    type: DataTypes.STRING(12),
    allowNull: false,
    field: "SATXE6",
  },
  taxExempt7: {
    type: DataTypes.STRING(12),
    allowNull: false,
    field: "SATXE7",
  },
  taxExempt8: {
    type: DataTypes.STRING(12),
    allowNull: false,
    field: "SATXE8",
  },
  taxExempt9: {
    type: DataTypes.STRING(12),
    allowNull: false,
    field: "SATXE9",
  },
  taxExempt10: {
    type: DataTypes.STRING(12),
    allowNull: false,
    field: "SATXE0",
  },
  miscFreightAmt: {
    type: DataTypes.DECIMAL(9, 2),
    allowNull: false,
    field: "SAMSFR",
  },
  origOrderNumber: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "SAOONO",
  },
  discountTakenAmt: {
    type: DataTypes.DECIMAL(9, 2),
    allowNull: false,
    field: "SADSAM",
  },
  discountTakenDate: {
    type: DataTypes.DECIMAL(8, 0),
    allowNull: false,
    field: "SADSDT",
  },
  discTakenPercent: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    field: "SADSPC",
  },
  transitLocation: {
    type: DataTypes.STRING(3),
    allowNull: false,
    field: "SAITLO",
  },
  transitTank: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "SAITTK",
  },
  destinationLocation: {
    type: DataTypes.STRING(3),
    allowNull: false,
    field: "SADTLO",
  },
  destinationTank: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "SADTTK",
  },
};

export const salesAnalysisMiscSchema = {
  isDeleted: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SADEL",
  },
  companyNo: {
    type: DataTypes.DECIMAL(2, 0),
    allowNull: false,
    field: "SACO",
    primaryKey: true
  },
  customerNo: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "SACUST",
    primaryKey: true
  },
  invoiceNo: {
    type: DataTypes.DECIMAL(7, 0),
    allowNull: false,
    field: "SAINVN",
  },
  shipToNo: {
    type: DataTypes.DECIMAL(3, 0),
    allowNull: false,
    field: "SASHIP",
  },
  salesman: {
    type: DataTypes.DECIMAL(2, 0),
    allowNull: false,
    field: "SASLMN",
  },
  invoiceDateYmd: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "SAINDT",
  },
  miscQuantity: {
    type: DataTypes.DECIMAL(5, 0),
    allowNull: false,
    field: "SAMQTY",
  },
  filler: {
    type: DataTypes.STRING(2),
    allowNull: false,
    field: "SAF001",
  },
  miscAmount: {
    type: DataTypes.DECIMAL(9, 2),
    allowNull: false,
    field: "SAMAMT",
  },
  filler2: {
    type: DataTypes.STRING(5),
    allowNull: false,
    field: "SAF002",
  },
  itemBlank: {
    type: DataTypes.STRING(15),
    allowNull: false,
    field: "SAITEM",
  },
  typeMCR: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SATYPE",
  },
  orderNo: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "SAORD",
  },
  orderSeqNo: {
    type: DataTypes.DECIMAL(3, 0),
    allowNull: false,
    field: "SASEQ",
  },
  shipDateYmd: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "SASHDT",
  },
  filler3: {
    type: DataTypes.STRING(3),
    allowNull: false,
    field: "SAF003",
  },
  time: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "SATXCD",
  },
  filler4: {
    type: DataTypes.STRING(2),
    allowNull: false,
    field: "SAF004",
  },
  miscType: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SAMSTY",
  },
  filler5: {
    type: DataTypes.STRING(16),
    allowNull: false,
    field: "SAF005",
  },
  filler6: {
    type: DataTypes.STRING(22),
    allowNull: false,
    field: "SAF006",
  },
  inventoryState: {
    type: DataTypes.STRING(2),
    allowNull: false,
    field: "SAINST",
  },
  filler7: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SAF007",
  },
  miscCode: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SAMSCD",
  },
  filler8: {
    type: DataTypes.STRING(7),
    allowNull: false,
    field: "SAF008",
  },
  taxCode1: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "SATXC1",
  },
  taxCode2: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "SATXC2",
  },
  taxCode3: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "SATXC3",
  },
  taxCode4: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "SATXC4",
  },
  taxCode5: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "SATXC5",
  },
  taxAmt1: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: false,
    field: "SATXA1",
  },
  taxAmt2: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: false,
    field: "SATXA2",
  },
  taxAmt3: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: false,
    field: "SATXA3",
  },
  taxAmt4: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: false,
    field: "SATXA4",
  },
  taxAmt5: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: false,
    field: "SATXA5",
  },
  delivery: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SADELV",
  },
  billOfLadingNo: {
    type: DataTypes.DECIMAL(7, 0),
    allowNull: false,
    field: "SABOLN",
  },
  glNo: {
    type: DataTypes.DECIMAL(8, 0),
    allowNull: false,
    field: "SAGLNO",
  },
  customerState: {
    type: DataTypes.STRING(2),
    allowNull: false,
    field: "SACSST",
  },
  filler9: {
    type: DataTypes.STRING(7),
    allowNull: false,
    field: "SAF009",
  },
  carrierCd: {
    type: DataTypes.STRING(2),
    allowNull: false,
    field: "SACACD",
  },
  filler10: {
    type: DataTypes.STRING(7),
    allowNull: false,
    field: "SAF010",
  },
  authorizedInitials: {
    type: DataTypes.STRING(3),
    allowNull: false,
    field: "SAAUIN",
  },
  userId: {
    type: DataTypes.STRING(8),
    allowNull: false,
    field: "SAUSID",
  },
  separateFreighyNY: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SASFRT",
  },
  filler11: {
    type: DataTypes.STRING(6),
    allowNull: false,
    field: "SAF011",
  },
  invoiceDateYmd8: {
    type: DataTypes.DECIMAL(8, 0),
    allowNull: false,
    field: "SAIND8",
  },
  shipDateYmd8: {
    type: DataTypes.DECIMAL(8, 0),
    allowNull: false,
    field: "SASHD8",
  },
  multiLoad: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SAMULO",
  },
  distributorOrderNo: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "SADIOR",
  },
  distribShipOrderNo: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "SADSOR",
  },
  distribPurchAuthIni: {
    type: DataTypes.STRING(3),
    allowNull: false,
    field: "SADIAU",
  },
  memoCustNo: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "SAMCUS",
  },
  memoCustShipToNo: {
    type: DataTypes.DECIMAL(3, 0),
    allowNull: false,
    field: "SAMCSH",
  },
  filler12: {
    type: DataTypes.STRING(6),
    allowNull: false,
    field: "SAF012",
  },
  billedCustOrderNo: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "SABCOR",
  },
  billedCustMemoOrdN: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "SABCMO",
  },
  termsSplitCd: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SATMSP",
  },
  billedCustNo: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "SABCUS",
  },
  custOwnedProduct: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SACOON",
  },
  shippingReferenceNo: {
    type: DataTypes.DECIMAL(3, 0),
    allowNull: false,
    field: "SASRN#",
  },
  exportCode: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SAEXPO",
  },
  orderYN: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SAORDC",
  },
  taxCode6: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "SATXC6",
  },
  taxCode7: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "SATXC7",
  },
  taxCode8: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "SATXC8",
  },
  taxCode9: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "SATXC9",
  },
  taxCode10: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "SATXC0",
  },
  taxAmt6: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: false,
    field: "SATXA6",
  },
  taxAmt7: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: false,
    field: "SATXA7",
  },
  taxAmt8: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: false,
    field: "SATXA8",
  },
  taxAmt9: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: false,
    field: "SATXA9",
  },
  taxAmt10: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: false,
    field: "SATXA0",
  },
  overrideTaxesYN: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SAOTX",
  },
  description: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: "SADESC",
  },
  origOrderNumber: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "SAOONO",
  },
  taxExempt1: {
    type: DataTypes.STRING(12),
    allowNull: false,
    field: "SATXE1",
  },
  taxExempt2: {
    type: DataTypes.STRING(12),
    allowNull: false,
    field: "SATXE2",
  },
  taxExempt3: {
    type: DataTypes.STRING(12),
    allowNull: false,
    field: "SATXE3",
  },
  taxExempt4: {
    type: DataTypes.STRING(12),
    allowNull: false,
    field: "SATXE4",
  },
  taxExempt5: {
    type: DataTypes.STRING(12),
    allowNull: false,
    field: "SATXE5",
  },
  taxExempt6: {
    type: DataTypes.STRING(12),
    allowNull: false,
    field: "SATXE6",
  },
  taxExempt7: {
    type: DataTypes.STRING(12),
    allowNull: false,
    field: "SATXE7",
  },
  taxExempt8: {
    type: DataTypes.STRING(12),
    allowNull: false,
    field: "SATXE8",
  },
  taxExempt9: {
    type: DataTypes.STRING(12),
    allowNull: false,
    field: "SATXE9",
  },
  taxExempt10: {
    type: DataTypes.STRING(12),
    allowNull: false,
    field: "SATXE0",
  },
  filler14: {
    type: DataTypes.STRING(529),
    allowNull: false,
    field: "SAF014",
  },
};

export const prodMoveDetailLogicalSchema = {
  isDeleted: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SADEL",
  },
  companyNo: {
    type: DataTypes.DECIMAL(2, 0),
    allowNull: false,
    field: "SACO",
    primaryKey: true
  },
  customerNo: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "SACUST",
  },
  invoiceNo: {
    type: DataTypes.DECIMAL(7, 0),
    allowNull: false,
    field: "SAINVN",
  },
  shipToNo: {
    type: DataTypes.DECIMAL(3, 0),
    allowNull: false,
    field: "SASHIP",
  },
  salesman: {
    type: DataTypes.DECIMAL(2, 0),
    allowNull: false,
    field: "SASLMN",
  },
  invoiceDateYmd: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "SAINDT",
  },
  shipQtyBilgaln: {
    type: DataTypes.DECIMAL(7, 0),
    allowNull: false,
    field: "SAQTY",
  },
  price: {
    type: DataTypes.DECIMAL(9, 4),
    allowNull: false,
    field: "SAPRCE",
  },
  cost: {
    type: DataTypes.DECIMAL(9, 4),
    allowNull: false,
    field: "SACOST",
  },
  location: {
    type: DataTypes.STRING(3),
    allowNull: false,
    field: "SALOC",
  },
  product: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "SAPROD",
  },
  tank: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "SATANK",
  },
  itemFiller: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "SAITFI",
  },
  typeMCR: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SATYPE",
  },
  orderNo: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "SAORD",
  },
  orderSeqNo: {
    type: DataTypes.DECIMAL(3, 0),
    allowNull: false,
    field: "SASEQ",
  },
  shipDateYmd: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "SASHDT",
  },
  unitOfMeasure: {
    type: DataTypes.STRING(3),
    allowNull: false,
    field: "SAUM",
  },
  timeOfSaleHhmm: {
    type: DataTypes.DECIMAL(4, 0),
    allowNull: false,
    field: "SATIME",
  },
  productGroup: {
    type: DataTypes.STRING(2),
    allowNull: false,
    field: "SAPRGP",
  },
  costingFreightAmt: {
    type: DataTypes.DECIMAL(9, 2),
    allowNull: false,
    field: "SACOFR",
  },
  filler: {
    type: DataTypes.STRING(12),
    allowNull: false,
    field: "SAF001",
  },
  grossGallons: {
    type: DataTypes.DECIMAL(7, 0),
    allowNull: false,
    field: "SAGGAL",
  },
  netGallons: {
    type: DataTypes.DECIMAL(7, 0),
    allowNull: false,
    field: "SANGAL",
  },
  temperature: {
    type: DataTypes.DECIMAL(3, 0),
    allowNull: false,
    field: "SATEMP",
  },
  gravity: {
    type: DataTypes.DECIMAL(3, 0),
    allowNull: false,
    field: "SAGRAV",
  },
  gallonsCodeGN: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SAGLCD",
  },
  filler6: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SAF006",
  },
  rackPrice: {
    type: DataTypes.DECIMAL(9, 4),
    allowNull: false,
    field: "SARKPR",
  },
  priceCodeRATSOP: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SAPRCD",
  },
  inventoryState: {
    type: DataTypes.STRING(2),
    allowNull: false,
    field: "SAINST",
  },
  sSummarized: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SASUMY",
  },
  miscCodeMFT: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SAMSCD",
  },
  qtyCalcdCU: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SAQTCA",
  },
  freightRate: {
    type: DataTypes.DECIMAL(6, 4),
    allowNull: false,
    field: "SAFRRT",
  },
  taxCode1: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "SATXC1",
  },
  taxCode2: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "SATXC2",
  },
  taxCode3: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "SATXC3",
  },
  taxCode4: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "SATXC4",
  },
  taxCode5: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "SATXC5",
  },
  taxAmt1: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: false,
    field: "SATXA1",
  },
  taxAmt2: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: false,
    field: "SATXA2",
  },
  taxAmt3: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: false,
    field: "SATXA3",
  },
  taxAmt4: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: false,
    field: "SATXA4",
  },
  taxAmt5: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: false,
    field: "SATXA5",
  },
  deliveryYN: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SADELV",
  },
  billOfLadingNo: {
    type: DataTypes.DECIMAL(7, 0),
    allowNull: false,
    field: "SABOL",
  },
  glNo: {
    type: DataTypes.DECIMAL(8, 0),
    allowNull: false,
    field: "SAGLNO",
  },
  customerState: {
    type: DataTypes.STRING(2),
    allowNull: false,
    field: "SACSST",
  },
  containerCd: {
    type: DataTypes.STRING(3),
    allowNull: false,
    field: "SACNTR",
  },
  productClass: {
    type: DataTypes.STRING(3),
    allowNull: false,
    field: "SAPRCL",
  },
  filler5: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SAF005",
  },
  carrierCd: {
    type: DataTypes.STRING(2),
    allowNull: false,
    field: "SACACD",
  },
  shipCntrQty: {
    type: DataTypes.DECIMAL(7, 0),
    allowNull: false,
    field: "SACTQT",
  },
  authorizedInitials: {
    type: DataTypes.STRING(3),
    allowNull: false,
    field: "SAAUIN",
  },
  userId: {
    type: DataTypes.STRING(8),
    allowNull: false,
    field: "SAUSID",
  },
  separateFreighyNY: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SASFRT",
  },
  inventCostUnitCode: {
    type: DataTypes.STRING(6),
    allowNull: false,
    field: "SACOUN",
  },
  invoiceDateYmd8: {
    type: DataTypes.DECIMAL(8, 0),
    allowNull: false,
    field: "SAIND8",
  },
  shipDateYmd8: {
    type: DataTypes.DECIMAL(8, 0),
    allowNull: false,
    field: "SASHD8",
  },
  multiLoad: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SAMULO",
  },
  distributorOrderNo: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "SADIOR",
  },
  distribShipOrderNo: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "SADSOR",
  },
  distribPurchAuthIni: {
    type: DataTypes.STRING(3),
    allowNull: false,
    field: "SADIAU",
  },
  memoCustNo: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "SAMCUS",
  },
  memoCustShipToNo: {
    type: DataTypes.DECIMAL(3, 0),
    allowNull: false,
    field: "SAMCSH",
  },
  memoInvoicePrice: {
    type: DataTypes.DECIMAL(6, 4),
    allowNull: false,
    field: "SAMIPR",
  },
  billedCustOrderNo: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "SABCOR",
  },
  billedCustMemoOrdN: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "SABCMO",
  },
  termsSplitCd: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SATMSP",
  },
  billedCustNo: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "SABCUS",
  },
  quantityType: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SAQTTY",
  },
  fluidCode: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SAFLCD",
  },
  imsUnitOfMeasure: {
    type: DataTypes.STRING(3),
    allowNull: false,
    field: "SAIUM",
  },
  custOwnedProduct: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SACOON",
  },
  shippingReferenceNo: {
    type: DataTypes.DECIMAL(3, 0),
    allowNull: false,
    field: "SASRN#",
  },
  exportCode: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SAEXPO",
  },
  pctOfTotal: {
    type: DataTypes.DECIMAL(6, 4),
    allowNull: false,
    field: "SAPCTT",
  },
  sepFuelSurchargeAmt: {
    type: DataTypes.DECIMAL(9, 2),
    allowNull: false,
    field: "SASFSC",
  },
  description: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: "SADESC",
  },
  taxCode6: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "SATXC6",
  },
  taxCode7: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "SATXC7",
  },
  taxCode8: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "SATXC8",
  },
  taxCode9: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "SATXC9",
  },
  taxCode10: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "SATXC0",
  },
  taxAmt6: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: false,
    field: "SATXA6",
  },
  taxAmt7: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: false,
    field: "SATXA7",
  },
  taxAmt8: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: false,
    field: "SATXA8",
  },
  taxAmt9: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: false,
    field: "SATXA9",
  },
  taxAmt10: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: false,
    field: "SATXA0",
  },
  xrefProdCode: {
    type: DataTypes.STRING(20),
    allowNull: false,
    field: "SAPRXR",
  },
  filler4: {
    type: DataTypes.STRING(20),
    allowNull: false,
    field: "SAF004",
  },
  salesJournalNo: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "SASJNO",
  },
  salesJournalDate: {
    type: DataTypes.DECIMAL(8, 0),
    allowNull: false,
    field: "SASJDT",
  },
  containerSize: {
    type: DataTypes.STRING(7),
    allowNull: false,
    field: "SASIZE",
  },
  weightInLbs: {
    type: DataTypes.DECIMAL(7, 0),
    allowNull: false,
    field: "SAGWT",
  },
  hazMat: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SAHAZM",
  },
  hazMatShippingDescLine1: {
    type: DataTypes.STRING(45),
    allowNull: false,
    field: "SAHZD1",
  },
  hazMatShippingDescLine2: {
    type: DataTypes.STRING(45),
    allowNull: false,
    field: "SAHZD2",
  },
  hazMatShippingDescLine3: {
    type: DataTypes.STRING(45),
    allowNull: false,
    field: "SAHZD3",
  },
  hazMatShippingDescLine4: {
    type: DataTypes.STRING(45),
    allowNull: false,
    field: "SAHZD4",
  },
  orderContainerQty: {
    type: DataTypes.DECIMAL(7, 0),
    allowNull: false,
    field: "SACQTY",
  },
  customerStkNo: {
    type: DataTypes.STRING(20),
    allowNull: false,
    field: "SACSTK",
  },
  noChargeCode: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SANOCH",
  },
  originalOrderQty: {
    type: DataTypes.DECIMAL(7, 0),
    allowNull: false,
    field: "SAORGQ",
  },
  alreadyBackordered: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SABKCD",
  },
  backorderedBitran: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SASBKC",
  },
  tareWeight: {
    type: DataTypes.DECIMAL(7, 0),
    allowNull: false,
    field: "SATARE",
  },
  grossVehicleWeight: {
    type: DataTypes.DECIMAL(7, 0),
    allowNull: false,
    field: "SAGVWT",
  },
  orderYN: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SAORDC",
  },
  pullPpdInvYN: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SAPUPI",
  },
  pullPpdInvGrossGal: {
    type: DataTypes.DECIMAL(7, 0),
    allowNull: false,
    field: "SAPUPG",
  },
  pullPpdInvNetGal: {
    type: DataTypes.DECIMAL(7, 0),
    allowNull: false,
    field: "SAPUPN",
  },
  freightGl: {
    type: DataTypes.DECIMAL(8, 0),
    allowNull: false,
    field: "SAFRGL",
  },
  overridePrice: {
    type: DataTypes.DECIMAL(9, 4),
    allowNull: false,
    field: "SAOPRC",
  },
  overrideFreightRate: {
    type: DataTypes.DECIMAL(6, 4),
    allowNull: false,
    field: "SAOFRR",
  },
  overrideTaxes: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SAOTX",
  },
  carCapacityGallons: {
    type: DataTypes.DECIMAL(7, 0),
    allowNull: false,
    field: "SACACA",
  },
  outageGallons: {
    type: DataTypes.DECIMAL(7, 0),
    allowNull: false,
    field: "SAOUTA",
  },
  customerProdDesc: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: "SACPDS",
  },
  destinationDate: {
    type: DataTypes.DECIMAL(8, 0),
    allowNull: false,
    field: "SADEA8",
  },
  filler7: {
    type: DataTypes.STRING(6),
    allowNull: false,
    field: "SAF007",
  },
  pickListProdDesc1: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: "SAPPD1",
  },
  pickListProdDesc2: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: "SAPPD2",
  },
  imsItemPrefix: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SAIMPF",
  },
  imsItemId: {
    type: DataTypes.STRING(7),
    allowNull: false,
    field: "SAIMID",
  },
  imsQtyShipped: {
    type: DataTypes.DECIMAL(7, 0),
    allowNull: false,
    field: "SAISQT",
  },
  reportAsSales: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SARPSL",
  },
  taxExempt1: {
    type: DataTypes.STRING(12),
    allowNull: false,
    field: "SATXE1",
  },
  taxExempt2: {
    type: DataTypes.STRING(12),
    allowNull: false,
    field: "SATXE2",
  },
  taxExempt3: {
    type: DataTypes.STRING(12),
    allowNull: false,
    field: "SATXE3",
  },
  taxExempt4: {
    type: DataTypes.STRING(12),
    allowNull: false,
    field: "SATXE4",
  },
  taxExempt5: {
    type: DataTypes.STRING(12),
    allowNull: false,
    field: "SATXE5",
  },
  taxExempt6: {
    type: DataTypes.STRING(12),
    allowNull: false,
    field: "SATXE6",
  },
  taxExempt7: {
    type: DataTypes.STRING(12),
    allowNull: false,
    field: "SATXE7",
  },
  taxExempt8: {
    type: DataTypes.STRING(12),
    allowNull: false,
    field: "SATXE8",
  },
  taxExempt9: {
    type: DataTypes.STRING(12),
    allowNull: false,
    field: "SATXE9",
  },
  taxExempt10: {
    type: DataTypes.STRING(12),
    allowNull: false,
    field: "SATXE0",
  },
  miscFreightAmt: {
    type: DataTypes.DECIMAL(9, 2),
    allowNull: false,
    field: "SAMSFR",
  },
  origOrderNumber: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "SAOONO",
  },
  discountTakenAmt: {
    type: DataTypes.DECIMAL(9, 2),
    allowNull: false,
    field: "SADSAM",
  },
  discountTakenDate: {
    type: DataTypes.DECIMAL(8, 0),
    allowNull: false,
    field: "SADSDT",
  },
  discTakenPercent: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    field: "SADSPC",
  },
  transitLocation: {
    type: DataTypes.STRING(3),
    allowNull: false,
    field: "SAITLO",
  },
  transitTank: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "SAITTK",
  },
  destinationLocation: {
    type: DataTypes.STRING(3),
    allowNull: false,
    field: "SADTLO",
  },
  destinationTank: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "SADTTK",
  },
};

export const prodMoveMiscLogicalSchema = {
  isDeleted: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SADEL",
  },
  companyNo: {
    type: DataTypes.DECIMAL(2, 0),
    allowNull: false,
    field: "SACO",
    primaryKey: true
  },
  customerNo: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "SACUST",
  },
  invoiceNo: {
    type: DataTypes.DECIMAL(7, 0),
    allowNull: false,
    field: "SAINVN",
  },
  shipToNo: {
    type: DataTypes.DECIMAL(3, 0),
    allowNull: false,
    field: "SASHIP",
  },
  salesman: {
    type: DataTypes.DECIMAL(2, 0),
    allowNull: false,
    field: "SASLMN",
  },
  invoiceDateYmd: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "SAINDT",
  },
  miscQuantity: {
    type: DataTypes.DECIMAL(5, 0),
    allowNull: false,
    field: "SAMQTY",
  },
  filler: {
    type: DataTypes.STRING(2),
    allowNull: false,
    field: "SAF001",
  },
  miscAmount: {
    type: DataTypes.DECIMAL(9, 2),
    allowNull: false,
    field: "SAMAMT",
  },
  filler2: {
    type: DataTypes.STRING(5),
    allowNull: false,
    field: "SAF002",
  },
  itemBlank: {
    type: DataTypes.STRING(15),
    allowNull: false,
    field: "SAITEM",
  },
  typeMCR: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SATYPE",
  },
  orderNo: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "SAORD",
  },
  orderSeqNo: {
    type: DataTypes.DECIMAL(3, 0),
    allowNull: false,
    field: "SASEQ",
  },
  shipDateYmd: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "SASHDT",
  },
  filler3: {
    type: DataTypes.STRING(3),
    allowNull: false,
    field: "SAF003",
  },
  time: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "SATXCD",
  },
  filler4: {
    type: DataTypes.STRING(2),
    allowNull: false,
    field: "SAF004",
  },
  miscType: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SAMSTY",
  },
  filler5: {
    type: DataTypes.STRING(16),
    allowNull: false,
    field: "SAF005",
  },
  filler6: {
    type: DataTypes.STRING(22),
    allowNull: false,
    field: "SAF006",
  },
  inventoryState: {
    type: DataTypes.STRING(2),
    allowNull: false,
    field: "SAINST",
  },
  filler7: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SAF007",
  },
  miscCode: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SAMSCD",
  },
  filler8: {
    type: DataTypes.STRING(7),
    allowNull: false,
    field: "SAF008",
  },
  taxCode1: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "SATXC1",
  },
  taxCode2: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "SATXC2",
  },
  taxCode3: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "SATXC3",
  },
  taxCode4: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "SATXC4",
  },
  taxCode5: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "SATXC5",
  },
  taxAmt1: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: false,
    field: "SATXA1",
  },
  taxAmt2: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: false,
    field: "SATXA2",
  },
  taxAmt3: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: false,
    field: "SATXA3",
  },
  taxAmt4: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: false,
    field: "SATXA4",
  },
  taxAmt5: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: false,
    field: "SATXA5",
  },
  delivery: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SADELV",
  },
  billOfLadingNo: {
    type: DataTypes.DECIMAL(7, 0),
    allowNull: false,
    field: "SABOLN",
  },
  glNo: {
    type: DataTypes.DECIMAL(8, 0),
    allowNull: false,
    field: "SAGLNO",
  },
  customerState: {
    type: DataTypes.STRING(2),
    allowNull: false,
    field: "SACSST",
  },
  filler9: {
    type: DataTypes.STRING(7),
    allowNull: false,
    field: "SAF009",
  },
  carrierCd: {
    type: DataTypes.STRING(2),
    allowNull: false,
    field: "SACACD",
  },
  filler10: {
    type: DataTypes.STRING(7),
    allowNull: false,
    field: "SAF010",
  },
  authorizedInitials: {
    type: DataTypes.STRING(3),
    allowNull: false,
    field: "SAAUIN",
  },
  userId: {
    type: DataTypes.STRING(8),
    allowNull: false,
    field: "SAUSID",
  },
  separateFreighyNY: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SASFRT",
  },
  filler11: {
    type: DataTypes.STRING(6),
    allowNull: false,
    field: "SAF011",
  },
  invoiceDateYmd8: {
    type: DataTypes.DECIMAL(8, 0),
    allowNull: false,
    field: "SAIND8",
  },
  shipDateYmd8: {
    type: DataTypes.DECIMAL(8, 0),
    allowNull: false,
    field: "SASHD8",
  },
  multiLoad: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SAMULO",
  },
  distributorOrderNo: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "SADIOR",
  },
  distribShipOrderNo: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "SADSOR",
  },
  distribPurchAuthIni: {
    type: DataTypes.STRING(3),
    allowNull: false,
    field: "SADIAU",
  },
  memoCustNo: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "SAMCUS",
  },
  memoCustShipToNo: {
    type: DataTypes.DECIMAL(3, 0),
    allowNull: false,
    field: "SAMCSH",
  },
  filler12: {
    type: DataTypes.STRING(6),
    allowNull: false,
    field: "SAF012",
  },
  billedCustOrderNo: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "SABCOR",
  },
  billedCustMemoOrdN: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "SABCMO",
  },
  termsSplitCd: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SATMSP",
  },
  billedCustNo: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "SABCUS",
  },
  custOwnedProduct: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SACOON",
  },
  shippingReferenceNo: {
    type: DataTypes.DECIMAL(3, 0),
    allowNull: false,
    field: "SASRN#",
  },
  exportCode: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SAEXPO",
  },
  orderYN: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SAORDC",
  },
  taxCode6: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "SATXC6",
  },
  taxCode7: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "SATXC7",
  },
  taxCode8: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "SATXC8",
  },
  taxCode9: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "SATXC9",
  },
  taxCode10: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "SATXC0",
  },
  taxAmt6: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: false,
    field: "SATXA6",
  },
  taxAmt7: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: false,
    field: "SATXA7",
  },
  taxAmt8: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: false,
    field: "SATXA8",
  },
  taxAmt9: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: false,
    field: "SATXA9",
  },
  taxAmt10: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: false,
    field: "SATXA0",
  },
  overrideTaxesYN: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "SAOTX",
  },
  description: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: "SADESC",
  },
  origOrderNumber: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "SAOONO",
  },
  taxExempt1: {
    type: DataTypes.STRING(12),
    allowNull: false,
    field: "SATXE1",
  },
  taxExempt2: {
    type: DataTypes.STRING(12),
    allowNull: false,
    field: "SATXE2",
  },
  taxExempt3: {
    type: DataTypes.STRING(12),
    allowNull: false,
    field: "SATXE3",
  },
  taxExempt4: {
    type: DataTypes.STRING(12),
    allowNull: false,
    field: "SATXE4",
  },
  taxExempt5: {
    type: DataTypes.STRING(12),
    allowNull: false,
    field: "SATXE5",
  },
  taxExempt6: {
    type: DataTypes.STRING(12),
    allowNull: false,
    field: "SATXE6",
  },
  taxExempt7: {
    type: DataTypes.STRING(12),
    allowNull: false,
    field: "SATXE7",
  },
  taxExempt8: {
    type: DataTypes.STRING(12),
    allowNull: false,
    field: "SATXE8",
  },
  taxExempt9: {
    type: DataTypes.STRING(12),
    allowNull: false,
    field: "SATXE9",
  },
  taxExempt10: {
    type: DataTypes.STRING(12),
    allowNull: false,
    field: "SATXE0",
  },
  filler14: {
    type: DataTypes.STRING(529),
    allowNull: false,
    field: "SAF014",
  },
};

export const billingControlFileSchema = {
  isDeleted: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "BCDEL",
  },
  companyNo: {
    type: DataTypes.DECIMAL(2, 0),
    allowNull: false,
    field: "BCCO",
  },
  companyName: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: "BCNAME",
    primaryKey: true
  },
  nextOrderNumbe: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "BCORDN",
  },
  inventoryGl: {
    type: DataTypes.DECIMAL(8, 0),
    allowNull: false,
    field: "BCINGL",
  },
  cogsGl: {
    type: DataTypes.DECIMAL(8, 0),
    allowNull: false,
    field: "BCCGGL",
  },
  freightGl: {
    type: DataTypes.DECIMAL(8, 0),
    allowNull: false,
    field: "BCFRGL",
  },
  miscGl: {
    type: DataTypes.DECIMAL(8, 0),
    allowNull: false,
    field: "BCMSGL",
  },
  nextInvoiceNum: {
    type: DataTypes.DECIMAL(7, 0),
    allowNull: false,
    field: "BCINVN",
  },
  minOrderAmt: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    field: "BCMIN",
  },
  salesGl: {
    type: DataTypes.DECIMAL(8, 0),
    allowNull: false,
    field: "BCSLGL",
  },
  invoicingSytl: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "BCINST",
  },
  nextBolNumber: {
    type: DataTypes.DECIMAL(7, 0),
    allowNull: false,
    field: "BCBOLN",
  },
  nextInvOrderNumber: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "BCIORD",
  },
  outagePercent: {
    type: DataTypes.DECIMAL(3, 0),
    allowNull: false,
    field: "BCIOPE",
  },
  nextMemoInvoic: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "BCMINV",
  },
  cusAgreeMntPw: {
    type: DataTypes.STRING(8),
    allowNull: false,
    field: "BCAGPW",
  },
  addressLine1: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: "BCADR1",
  },
  addressLine2: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: "BCADR2",
  },
  daysForDupOrderCheck: {
    type: DataTypes.DECIMAL(3, 0),
    allowNull: false,
    field: "BCDUPD",
  },
  bicuagSequenceNumber: {
    type: DataTypes.DECIMAL(9, 0),
    allowNull: false,
    field: "BCSEQN",
  },
  rackPricePassword: {
    type: DataTypes.STRING(10),
    allowNull: false,
    field: "BCRKPW",
  },
  tollingGl: {
    type: DataTypes.DECIMAL(8, 0),
    allowNull: false,
    field: "BCTLGL",
  },
  collectFreightServiceFee: {
    type: DataTypes.DECIMAL(9, 2),
    allowNull: false,
    field: "BCCSVC",
  },
  filler: {
    type: DataTypes.STRING(35),
    allowNull: false,
    field: "BCF001",
  },
};

export const containerUnitofMeasureConversionSchema = {
  isDeleted: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "CUDEL",
  },
  companyNo: {
    type: DataTypes.DECIMAL(2, 0),
    allowNull: false,
    field: "CUCONO",
    primaryKey: true
  },
  productCode: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "CUPROD",
  },
  containerCode: {
    type: DataTypes.STRING(3),
    allowNull: false,
    field: "CUCNTR",
  },
  unitOfMeasure: {
    type: DataTypes.STRING(3),
    allowNull: false,
    field: "CUUNMS",
  },
  operandMultDiv: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "CUOPER",
  },
  conversionFactor: {
    type: DataTypes.DECIMAL(12, 7),
    allowNull: false,
    field: "CUCVFA",
  },
  hazMatYN: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "CUHAZM",
  },
  imsIssueUnitOfMeas: {
    type: DataTypes.STRING(3),
    allowNull: false,
    field: "CUIUM",
  },
  freightExpenseGl: {
    type: DataTypes.DECIMAL(8, 0),
    allowNull: false,
    field: "CUFEGL",
  },
  filler: {
    type: DataTypes.STRING(26),
    allowNull: false,
    field: "CUF001",
  },
};

export const checkInquirySchema = {
  isDeleted: {
    type: DataTypes.CHAR,
    allowNull: false,
    field: "OHDEL",
  },
  companyNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "OHCONO",
    primaryKey: true,
  },
  vendorNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "OHVEND",
  },
  voucherNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "OHVONO",
  },
  header: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "OHRCTY",
  },
  sequenceNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "OHSEQN",
  },
  grossAmount: {
    type: DataTypes.DECIMAL(11, 2),
    allowNull: false,
    field: "OHGRAM",
  },
  discount: {
    type: DataTypes.DECIMAL(9, 2),
    allowNull: true,
    field: "OHDISC",
  },
  partialPaidToDate: {
    type: DataTypes.DECIMAL(11, 2),
    allowNull: true,
    field: "OHPPTD",
  },
  invoiceDescription: {
    type: DataTypes.STRING(25),
    allowNull: true,
    field: "OHINDS",
  },
  apGLAccountNo: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: "OHAPGL",
  },
  retentionVoucher: {
    type: DataTypes.CHAR,
    allowNull: true,
    field: "OHRTVC",
  },
  discountDueDate: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: "OHDSDT",
  },
  invoiceDate: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: "OHINVD",
  },
  dueDate: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: "OHDUED",
  },
  checkNo: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: "OHCKNO",
    primaryKey: true,
  },
  prepaidVoucher: {
    type: DataTypes.CHAR,
    allowNull: true,
    field: "OHPAID",
  },
  lastPaidDate: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: "OHLPDT",
  },
  cashDisbursedDate: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: "OHCDDT",
  },
  purchaseJournalDate: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: "OHPJDT",
  },
  purchaseJournalNo: {
    type: DataTypes.STRING(8),
    allowNull: true,
    field: "OHJRNO",
  },
  heldPaymentVoucher: {
    type: DataTypes.CHAR,
    allowNull: true,
    field: "OHHALT",
  },
  heldDescription: {
    type: DataTypes.STRING(25),
    allowNull: true,
    field: "OHHDES",
  },
  singleCheck: {
    type: DataTypes.CHAR,
    allowNull: true,
    field: "OHSNGL",
  },
  bankGLNo: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: "OHBKGL",
    primaryKey: true,
  },
  paidAmount: {
    type: DataTypes.DECIMAL(11, 2),
    allowNull: true,
    field: "OHLPAM",
  },
  discountTaken: {
    type: DataTypes.DECIMAL(9, 2),
    allowNull: true,
    field: "OHDSTK",
  },
  invoiceNo: {
    type: DataTypes.STRING(20),
    allowNull: true,
    field: "OHINVN",
  }
};

export const checkInquiryHistorySchema = {
  code: {
    type: DataTypes.CHAR,
    allowNull: false,
    field: "AMCODE",
  },
  companyNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "AMCONO",
    primaryKey: true,
  },
  bankGLNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "AMBKGL",
    primaryKey: true,
  },
  checkNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "AMCHKN",
    primaryKey: true,
  },
  vendorNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "AMVEND",
  },
  checkAmount: {
    type: DataTypes.DECIMAL(11, 2),
    allowNull: false,
    field: "AMCKAM",
  },
  checkDate: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: "AMCKDT",
  },
  clearDate: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: "AMCLDT",
  },
  vendorName: {
    type: DataTypes.STRING(30),
    allowNull: true,
    field: "AMVNNM",
  },
  checkDate8: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: "AMCKD8",
  },
  clearDate8: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: "AMCLD8",
  },
  originalCheckAmount: {
    type: DataTypes.DECIMAL(11, 2),
    allowNull: true,
    field: "AMOCAM",
  },
};

export const checkInquiryVoucherDetailSchema = {
  isDeleted: {
    field: "OHDEL",
    type: DataTypes.STRING(1),
    allowNull: true,
  },
  companyNo: {
    field: "OHCONO",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  vendorNo: {
    field: "OHVEND",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  voucherNo: {
    field: "OHVONO",
    type: DataTypes.INTEGER,
    allowNull: true,
    primaryKey: true
  },
  header: {
    field: "OHRCTY",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  sequenceNo: {
    field: "OHSEQN",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  grossAmount: {
    field: "OHGRAM",
    type: DataTypes.DECIMAL(11, 2),
    allowNull: true,
  },
  discount: {
    field: "OHDISC",
    type: DataTypes.DECIMAL(9, 2),
    allowNull: true,
  },
  partialPaidToDate: {
    field: "OHPPTD",
    type: DataTypes.DECIMAL(11, 2),
    allowNull: true,
  },
  invoiceDescription: {
    field: "OHINDS",
    type: DataTypes.STRING(25),
    allowNull: true,
  },
  apGLAccountNo: {
    field: "OHAPGL",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  retentionVoucher: {
    field: "OHRTVC",
    type: DataTypes.STRING(1),
    allowNull: true,
  },
  discountDueDate: {
    field: "OHDSDT",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  invoiceDate: {
    field: "OHINVD",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  dueDate: {
    field: "OHDUED",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  checkNo: {
    field: "OHCKNO",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  prepaidVoucher: {
    field: "OHPAID",
    type: DataTypes.STRING(1),
    allowNull: true,
  },
  lastPaidDate: {
    field: "OHLPDT",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  cashDisbursedDate: {
    field: "OHCDDT",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  purchaseJournalDate: {
    field: "OHPJDT",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  purchaseJournalNo: {
    field: "OHJRNO",
    type: DataTypes.STRING(8),
    allowNull: true,
  },
  heldPaymentVoucher: {
    field: "OHHALT",
    type: DataTypes.STRING(1),
    allowNull: true,
  },
  heldDescription: {
    field: "OHHDES",
    type: DataTypes.STRING(25),
    allowNull: true,
  },
  singleCheck: {
    field: "OHSNGL",
    type: DataTypes.STRING(1),
    allowNull: true,
  },
  bankGLNo: {
    field: "OHBKGL",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  paidAmount: {
    field: "OHLPAM",
    type: DataTypes.DECIMAL(11, 2),
    allowNull: true,
  },
  discountTaken: {
    field: "OHDSTK",
    type: DataTypes.DECIMAL(9, 2),
    allowNull: true,
  },
  discountDueDate8: {
    field: "OHDSD8",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  kCompanyNo: {
    field: "OHKCO",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  kVendorNo: {
    field: "OHKVEN",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  kCheckNo: {
    field: "OHKCHK",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  kVoucherNo: {
    field: "OHKVON",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  kHeader: {
    field: "OHKRCT",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  kSequenceNo: {
    field: "OHKSEQ",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  cancelledVoucher: {
    field: "OHKCNL",
    type: DataTypes.STRING(1),
    allowNull: true,
  },
  paidOn: {
    field: "OHKYMD",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  invoiceDate8: {
    field: "OHINV8",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  dueDate8: {
    field: "OHDUE8",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  lastPaidDate8: {
    field: "OHLPD8",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  cashDisbursedDate8: {
    field: "OHCDD8",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  purchaseJournalDate8: {
    field: "OHPJD8",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  paidOn8: {
    field: "OHKYM8",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  freightTotal: {
    field: "OHFRTL",
    type: DataTypes.DECIMAL(7, 2),
    allowNull: true,
  },
  prodInvVendorNo: {
    field: "OHPIVN",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  prodInvInvoiceNo: {
    field: "OHPIIN",
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  salesOrderNo: {
    field: "OHSORN",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  salesSRNNo: {
    field: "OHSSRN",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  apTerms: {
    field: "OHTERM",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  carrierId: {
    field: "OHCAID",
    type: DataTypes.STRING(6),
    allowNull: true,
  },
  invoiceNo: {
    field: "OHINVN",
    type: DataTypes.STRING(20),
    allowNull: true,
  },
};

export const checkInquiryLineItemSchema = {
  isDeleted: {
    field: "OHDEL",
    type: DataTypes.STRING(1),
    allowNull: true,
  },
  companyNo: {
    field: "OHCONO",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  vendorNo: {
    field: "OHVEND",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  voucherNo: {
    field: "OHVONO",
    type: DataTypes.INTEGER,
    allowNull: true,
    primaryKey: true
  },
  detailType: {
    field: "OHRCTY",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  sequenceNo: {
    field: "OHSEQN",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  detailLineAmount: {
    field: "OHGRAM",
    type: DataTypes.DECIMAL(11, 2),
    allowNull: true,
  },
  detailLineDiscount: {
    field: "OHDISC",
    type: DataTypes.DECIMAL(9, 2),
    allowNull: true,
  },
  partialPaidToDate: {
    field: "OHPPTD",
    type: DataTypes.DECIMAL(11, 2),
    allowNull: true,
  },
  detailLineDescription: {
    field: "OHLNDS",
    type: DataTypes.STRING(25),
    allowNull: true,
  },
  expenseGLAccount: {
    field: "OHEXGL",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  filler1: {
    field: "OHF001",
    type: DataTypes.STRING(1),
    allowNull: true,
  },
  expenseCompanyGL: {
    field: "OHEXCO",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  lastPaidDateYYMMDD: {
    field: "OHLPDT",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  purchaseJournalNo: {
    field: "OHJRNO",
    type: DataTypes.STRING(8),
    allowNull: true,
  },
  inventoryItemNo: {
    field: "OHITMN",
    type: DataTypes.STRING(13),
    allowNull: true,
  },
  quantity: {
    field: "OHQTY",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  filler2: {
    field: "OHF002",
    type: DataTypes.STRING(9),
    allowNull: true,
  },
  jobNumber: {
    field: "OHJOBN",
    type: DataTypes.STRING(6),
    allowNull: true,
  },
  extraJobField: {
    field: "OHJOBX",
    type: DataTypes.STRING(2),
    allowNull: true,
  },
  costCode: {
    field: "OHCCOD",
    type: DataTypes.STRING(6),
    allowNull: true,
  },
  costType: {
    field: "OHCTYP",
    type: DataTypes.STRING(2),
    allowNull: true,
  },
  jobCostQuantity: {
    field: "OHJQTY",
    type: DataTypes.DECIMAL(7, 2),
    allowNull: true,
  },
  filler5: {
    field: "OHFIL5",
    type: DataTypes.STRING(6),
    allowNull: true,
  },
  gallons: {
    field: "OHGALN",
    type: DataTypes.DECIMAL(7, 0),
    allowNull: true,
  },
  receiptNumber: {
    field: "OHRCPT",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  openClosedStatus: {
    field: "OHCLCD",
    type: DataTypes.STRING(1),
    allowNull: true,
  },
  poLineSeqNo: {
    field: "OHPOSQ",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  productAmount: {
    field: "OHPRAM",
    type: DataTypes.DECIMAL(11, 2),
    allowNull: true,
  },
  freightAmount: {
    field: "OHFRAM",
    type: DataTypes.DECIMAL(7, 2),
    allowNull: true,
  },
  filler3: {
    field: "OHF003",
    type: DataTypes.STRING(24),
    allowNull: true,
  },
  kCompanyNo: {
    field: "OHKCO",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  kVendorNo: {
    field: "OHKVEN",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  checkNo: {
    field: "OHKCHK",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  kVoucherNo: {
    field: "OHKVON",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  headerType: {
    field: "OHKRCT",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  sequence001No: {
    field: "OHKSEQ",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  cancelledVoucher: {
    field: "OHKCNL",
    type: DataTypes.STRING(1),
    allowNull: true,
  },
  paidOnYYMMDD: {
    field: "OHKYMD",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  lastPaidDateYYMMDD_8: {
    field: "OHLPD8",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  paidOnYYMMDD_8: {
    field: "OHKYM8",
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  productLocation: {
    field: "OHLOC",
    type: DataTypes.STRING(3),
    allowNull: true,
  },
  productCode: {
    field: "OHPROD",
    type: DataTypes.STRING(4),
    allowNull: true,
  },
  productTank: {
    field: "OHTANK",
    type: DataTypes.STRING(4),
    allowNull: true,
  },
  productContainer: {
    field: "OHCNTR",
    type: DataTypes.STRING(3),
    allowNull: true,
  },
  poNumber: {
    field: "OHPONM",
    type: DataTypes.STRING(30),
    allowNull: true,
  },
  filler4: {
    field: "OHF004",
    type: DataTypes.STRING(103),
    allowNull: true,
  },
};


export const Ap1099IModelSchema = {
  f00001Text: {
    type: DataTypes.STRING(5000),
    allowNull: true,
    field: 'F00001',    // match actual column name in DB
  },
  k00001Text: {
    type: DataTypes.STRING(10),
    allowNull: true,
    field: 'K00001',    // actual DB column
    primaryKey: true
  },
  k00002Text: {
    type: DataTypes.STRING(10),
    allowNull: true,
    field: 'K00002',
  },
  k00003Text: {
    type: DataTypes.STRING(20),
    allowNull: true,
    field: 'K00003',
  },
};


export const gapptUserSchema = {
  entrySequence: {
    type: DataTypes.STRING(5),
    allowNull: false,
    primaryKey: true,
    field: "K00001", // Entry Sequence
  },
  status: {
    type: DataTypes.STRING(1),
    allowNull: true,
    field: "F00001", // Status flag
  },
};

export const clearchecksSchema = {
  dORV: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "AMCODE",
  },
  companyNo: {
    type: DataTypes.DECIMAL(2, 0),
    allowNull: false,
    field: "AMCONO",
  },
  bankGlNumber: {
    type: DataTypes.DECIMAL(8, 0),
    allowNull: false,
    field: "AMBKGL",
  },
  checkNumber: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "AMCHKN",
  },
  vendorNo: {
    type: DataTypes.DECIMAL(5, 0),
    allowNull: false,
    field: "AMVEND",
  },
  checkAmount: {
    type: DataTypes.DECIMAL(11, 2),
    allowNull: false,
    field: "AMCKAM",
  },
  checkDate: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "AMCKDT",
  },
  clearDate: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
    field: "AMCLDT",
  },
  vendorName: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: "AMVNNM",
  },
  checkDate1: {
    type: DataTypes.DECIMAL(8, 0),
    allowNull: false,
    field: "AMCKD8",
  },
  clearDate1: {
    type: DataTypes.DECIMAL(8, 0),
    allowNull: false,
    field: "AMCLD8",
  },
  origChkAmt: {
    type: DataTypes.DECIMAL(11, 2),
    allowNull: false,
    field: "AMOCAM",
  },
  filler: {
    type: DataTypes.STRING(26),
    allowNull: false,
    field: "AMF001",
  },
};

export const carrierSchema = {
  isDeleted: {
    type: DataTypes.STRING(1),
    allowNull: false,
    field: "CIDEL",
  },
  companyNo: {
    type: DataTypes.DECIMAL(2, 0),
    allowNull: false,
    field: "CICO",
  },
  carrierId: {
    type: DataTypes.STRING(6),
    allowNull: false,
    field: "CICAID",
    primaryKey: true
  },
  carrierName: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: "CICANM",
  },
  ein: {
    type: DataTypes.DECIMAL(9, 0),
    allowNull: false,
    field: "CIEIN",
  },
  fuelfacsCarrierId: {
    type: DataTypes.DECIMAL(10, 0),
    allowNull: false,
    field: "CIFFID",
  },
  filler01: {
    type: DataTypes.STRING(142),
    allowNull: false,
    field: "CIFIL1",
  },
};