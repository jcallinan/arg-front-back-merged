import { DataTypes } from "@sequelize/core";


export const spInfoSchema = {
  reportName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: "MERPTNAM",
    primaryKey: true,

  },
  fieldKey: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: "MEFLDKEY",
    primaryKey: true,
  },
  fieldDescription: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: "MEFLDDSC",
  },
  fieldComponent: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: "MECOMPN",
  },
  fieldDataType: {
    type: DataTypes.STRING(20),
    allowNull: false,
    field: "MEFLDTYP",
  },
  fieldSequence: {
    type: DataTypes.DECIMAL(5, 0),
    allowNull: false,
    field: "MESEQ",
  },
  variableType: {
    type: DataTypes.STRING(10),
    allowNull: false,
    field: "METYPE",
  },
  xmlMetadata: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: "MEMETA",
  },
  storedProcedureName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: "MESP",
    primaryKey: true,
  },
  spSequence: {
    type: DataTypes.DECIMAL(5, 0),
    allowNull: false,
    field: "MESPSEQ",
  },
  fieldLength: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: "MEFLL",
  },
  isApiCall: {
    type: DataTypes.CHAR(1),
    allowNull: true,
    defaultValue: 'n',
    field: "ISAPICALL",
  },
  apiEndpoint: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: "APIEDPOINT",
  },
  status: {
    type: DataTypes.CHAR(1),
    allowNull: true,
    defaultValue: 'A',
    field: "STATUS",
  },
  useCase: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: "MEUSECASE",
  },
};

export const generalSystemCompanySchema = {
  fixedAssets: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "GXFA",
  },
  orderEntryInvoicing: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "GXBI",
  },
  salesAnalysis: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "GXSA",
  },
  inventory: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "GXIN",
  },
  purchaseOrder: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "GXPO",
  },
  billOfMaterial: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "GXBM",
  },
  jobShop: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "GXJS",
  },
  jobCost: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "GXJC",
  },
  filler1: {
    type: DataTypes.STRING(34),
    allowNull: false,
    field: "GXF001",
  },
  multiWarehouseYn: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "GXWHSE",
  },
  thirteenAccountingPeriodsYn: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "GX13GL",
  },
  fractionalQtyActive: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "GXFRQY",
  },
  apPostOverrideCode: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "GXAPOV", // this is column to get the auth code
  },
  arPostOverrideCode: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "GXAROV",
  },
  faPostOverrideCode: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "GXFAOV",
  },
  glPostOverrideCode: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "GXGLOV",
  },
  companyNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "GXCONO",
    primaryKey: true, // candidate for PK
  },
  filler2: {
    type: DataTypes.STRING(434),
    allowNull: false,
    field: "GXF002",
  },
};

export const nachaForAchPaymentsSchema = {
  achOutput: {
    type: DataTypes.STRING(94),
    allowNull: true,
    field: "RECACH",
    primaryKey: true
  }
};

export const pa1099YearEndPataxSchema = {
  payersAccountNumber: { type: DataTypes.STRING(9), allowNull: true, field: "A1ACCT", primaryKey: true, },
  typeOfEntityId: { type: DataTypes.STRING(3), allowNull: true, field: "NEW1" },
  paAssignedEmployerNo: { type: DataTypes.STRING(8), allowNull: true, field: "NEW2" },
  paymentYear: { type: DataTypes.STRING(4), allowNull: true, field: "A1YR" },
  recipientSSN: { type: DataTypes.STRING(9), allowNull: true, field: "A1SS#" },
  typeOfTin: { type: DataTypes.STRING(3), allowNull: true, field: "A1TTIN" },
  recipientNo: { type: DataTypes.STRING(9), allowNull: true, field: "A1REC#" },
  businessName: { type: DataTypes.STRING(70), allowNull: true, field: "A1FPYN" },
  firstName: { type: DataTypes.STRING(70), allowNull: true, field: "A1SPYN" },
  middleName: { type: DataTypes.STRING(70), allowNull: true, field: "NEW3" },
  suffixName: { type: DataTypes.STRING(70), allowNull: true, field: "NEW4" },
  payeeAddress1: { type: DataTypes.STRING(22), allowNull: true, field: "A1PYEA" },
  payeeAddress2: { type: DataTypes.STRING(50), allowNull: true, field: "NEW5" },
  payeeAddress3: { type: DataTypes.STRING(50), allowNull: true, field: "NEW6" },
  payeeCity: { type: DataTypes.STRING(22), allowNull: true, field: "A1PYEC" },
  payeeState: { type: DataTypes.STRING(2), allowNull: true, field: "A1PYES" },
  payeeZipCode: { type: DataTypes.STRING(9), allowNull: true, field: "A1PYEZ" },
  countryCode: { type: DataTypes.STRING(2), allowNull: true, field: "NEW7" },
  rentAmount1: { type: DataTypes.DECIMAL(12,2), allowNull: true, field: "A1RENT" },
  royaltyAmount2: { type: DataTypes.DECIMAL(12,2), allowNull: true, field: "A1ROYL" },
  otherIncomeBox3: { type: DataTypes.DECIMAL(12,2), allowNull: true, field: "NEW8" },
  medicalHealthBox6: { type: DataTypes.DECIMAL(12,2), allowNull: true, field: "NEW9" },
  nonEmployeeCompBox7: { type: DataTypes.DECIMAL(12,2), allowNull: true, field: "A1NECO" },
  grossAttorneyBox14: { type: DataTypes.DECIMAL(12,2), allowNull: true, field: "NEW10" },
  stateTaxWithheldBox16: { type: DataTypes.DECIMAL(12,2), allowNull: true, field: "A1SITW" },
  stateIncomeBox18: { type: DataTypes.DECIMAL(12,2), allowNull: true, field: "A1LITW" },
  payerName: { type: DataTypes.STRING(50), allowNull: true, field: "NEW11" },
  payerAddress1: { type: DataTypes.STRING(50), allowNull: true, field: "NEW12" },
  payerAddress2: { type: DataTypes.STRING(50), allowNull: true, field: "NEW13" },
  payerAddress3: { type: DataTypes.STRING(50), allowNull: true, field: "NEW14" },
  payerCity: { type: DataTypes.STRING(50), allowNull: true, field: "NEW15" },
  payerState: { type: DataTypes.STRING(30), allowNull: true, field: "NEW16" },
  payerZip: { type: DataTypes.STRING(15), allowNull: true, field: "NEW17" },
  payerCountry: { type: DataTypes.STRING(2), allowNull: true, field: "NEW18" },
};

export const irsTaxSchema = {
  irsTax: {
    type: DataTypes.STRING(750),
    allowNull: true,
    field: "IRSTAX",
    primaryKey: true
  }
};