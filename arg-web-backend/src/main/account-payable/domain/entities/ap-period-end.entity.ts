export interface RecordA {
  recordType: string;
  paymentYear: number;
  c: string;
  blank01: string;
  taxPayerId: number;
  payerNameControl: string;
  lastFilingIndicator: string;
  typeOfReturn: string;
  amountCodes: string;
  blank02: string;
  foreignEntityIndicator: string;
  firstPayeeName: string;
  secondPayerName: string;
  transferAgentIndicator: string;
  payerShippingAddress: string;
  payerCity: string;
  payerState: string;
  payerZipCode: string;
  payerPhoneNumber: string;
  blank03: string;
  blank04: string;
  sequenceNumber: number;
  blank05: string;
  blank06: string;
}

export interface RecordT {
  recordType: string;
  paymentYear: number;
  priorYearDataInd: string;
  transmitterId: number;
  transControlCode: string;
  replacementAlphaChar: string;
  blank01: string;
  testFileInd: string;
  foreignEntityInd: string;
  transmitterName: string;
  transmitterName2: string;
  companyName: string;
  companyName2: string;
  companyAddress: string;
  companyCity: string;
  companyState: string;
  companyZipCode: string;
  blank02: string;
  totalNumberOfPayees: number;
  contactName: string;
  contactPhoneNumber: string;
  contactEmail: string;
  blank03: string;
  sequenceNumber: number;
  blank04: string;
  vendorInd: string;
  blank05: string;
  blank06: string;
}

export interface RecordB {
  recordType: string;
  paymentYear: string;
  correctedReturnIndicator: string;
  nameControl: string;
  typeOfTIN: string;
  taxPayerId: string;
  payerAccountNum: string;
  payerOfficeCode: string;
  deletionIndicator: string;
  blank01: string;
  payAmt1: number;
  payAmt2: number;
  payAmt3: number;
  payAmt4: number;
  payAmt5: number;
  payAmt6: number;
  payAmt7: number;
  payAmt8: number;
  payAmt9: number;
  payAmtA: number;
  payAmtB: number;
  payAmtC: number;
  payAmtD: number;
  payAmtE: number;
  payAmtF: number;
  payAmtG: number;
  foreignCountryCode: string;
  firstPayeeName: string;
  secondPayeeName: string;
  payeeAddress: string;
  payeeCity: string;
  payeeState: string;
  payeeZip: string;
  blank05: string;
  sequenceNumber: number;
  blank06: string;
}

export interface allRecords {
  ctl: string,
  tin: string,
  recordType: string,
  firstPayeeName: string,
}

export class ApPeriodEndEntity {
  constructor(
    public readonly f00001Text: string,
    public readonly k00001Text: string,
    public readonly k00002Text: string,
    public readonly k00003Text: string,
  ) { }

  createRecordA(data: RecordA): RecordA {
    return data;
  }

  createRecordT(data: RecordT): RecordT {
    return data;
  }

  createRecordB(data: RecordB): RecordB {
    return data;
  }

  allRecords(data: allRecords): allRecords {
    return data
  }
}


