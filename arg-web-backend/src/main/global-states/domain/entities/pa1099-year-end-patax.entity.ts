export class PA1099YearEndPataxEntity {
    payersAccountNumber!: string;
    typeOfEntityId!: string;
    paAssignedEmployerNo!: string;
    paymentYear!: string;
    recipientSSN!: string;
    typeOfTin!: string;
    recipientNo!: string;
    businessName!: string;
    firstName!: string;
    middleName!: string;
    suffixName!: string;
    payeeAddress1!: string;
    payeeAddress2!: string;
    payeeAddress3!: string;
    payeeCity!: string;
    payeeState!: string;
    payeeZipCode!: string;
    countryCode!: string;
    rentAmount1!: number;
    royaltyAmount2!: number;
    otherIncomeBox3!: number;
    medicalHealthBox6!: number;
    nonEmployeeCompBox7!: number;
    grossAttorneyBox14!: number;
    stateTaxWithheldBox16!: number;
    stateIncomeBox18!: number;
    payerName!: string;
    payerAddress1!: string;
    payerAddress2!: string;
    payerAddress3!: string;
    payerCity!: string;
    payerState!: string;
    payerZip!: string;
    payerCountry!: string;
  
    constructor(partial: Partial<PA1099YearEndPataxEntity>) {
      Object.assign(this, partial);
    }
  
    static create(partial: Partial<PA1099YearEndPataxEntity>): PA1099YearEndPataxEntity {
      return new PA1099YearEndPataxEntity(partial);
    }
  }
  