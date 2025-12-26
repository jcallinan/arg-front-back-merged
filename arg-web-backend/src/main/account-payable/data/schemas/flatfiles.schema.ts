import { calculateLength } from "@src/shared/utils/flatfiles-slicers.utils";

export const RecordFormatA1099 = {
    recordType: {
        field: "A2REC",
        startFrom: 1,
        startTo: 1,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    paymentYear: {
        field: "A2YR",
        startFrom: 2,
        startTo: 5,
        type: Number,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    combineFedStateFiler: {
        field: "A2CFSF",
        startFrom: 6,
        startTo: 6,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    blank01: {
        field: "A2BL01",
        startFrom: 7,
        startTo: 11,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    taxPayerId: {
        field: "A2TIN",
        startFrom: 12,
        startTo: 20,
        type: Number,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    payerNameControl: {
        field: "A2PYNC",
        startFrom: 21,
        startTo: 24,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    lastFilingIndicator: {
        field: "A2LFI",
        startFrom: 25,
        startTo: 25,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    typeOfReturn: {
        field: "A2TYRT",
        startFrom: 26,
        startTo: 27,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    amountCodes: {
        field: "A2CODE",
        startFrom: 28,
        startTo: 43,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    blank02: {
        field: "A2BL02",
        startFrom: 44,
        startTo: 51,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    foreignEntityIndicator: {
        field: "A2FEI",
        startFrom: 52,
        startTo: 52,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    firstPayeeName: {
        field: "A2FPNM",
        startFrom: 53,
        startTo: 92,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    secondPayerName: {
        field: "A2SPNM",
        startFrom: 93,
        startTo: 132,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    transferAgentIndicator: {
        field: "A2TAI",
        startFrom: 133,
        startTo: 133,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    payerShippingAddress: {
        field: "A2PSAD",
        startFrom: 134,
        startTo: 173,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    payerCity: {
        field: "A2PCTY",
        startFrom: 174,
        startTo: 213,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    payerState: {
        field: "A2PSTA",
        startFrom: 214,
        startTo: 215,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    payerZipCode: {
        field: "A2PZP9",
        startFrom: 216,
        startTo: 224,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    payerPhoneNumber: {
        field: "A2PPH#",
        startFrom: 225,
        startTo: 239,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    blank03: {
        field: "A2BL03",
        startFrom: 240,
        startTo: 495,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    blank04: {
        field: "A2BL04",
        startFrom: 496,
        startTo: 499,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    sequenceNumber: {
        field: "A2SEQ#",
        startFrom: 500,
        startTo: 507,
        type: Number,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    blank05: {
        field: "A2BL05",
        startFrom: 508,
        startTo: 748,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    blank06: {
        field: "A2BL06",
        startFrom: 749,
        startTo: 750,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    }
};

export const RecordFormatB1009I = {
    recordType: {
        field: "A3REC",
        startFrom: 1,
        startTo: 1,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    paymentYear: {
        field: "A3YR",
        startFrom: 2,
        startTo: 5,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    correctedReturnIndicator: {
        field: "A3CRI",
        startFrom: 6,
        startTo: 6,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    nameControl: {
        field: "A3NCTL",
        startFrom: 7,
        startTo: 10,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    typeOfTIN: {
        field: "A3TTIN",
        startFrom: 11,
        startTo: 11,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    taxPayerId: {
        field: "A3TIN#",
        startFrom: 12,
        startTo: 20,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    payerAccountNum: {
        field: "A3PANP",
        startFrom: 21,
        startTo: 40,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    payerOfficeCode: {
        field: "A3POCD",
        startFrom: 41,
        startTo: 44,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    deletionIndicator: {
        field: "A3DEL",
        startFrom: 45,
        startTo: 45,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    blank01: {
        field: "A3BL01",
        startFrom: 46,
        startTo: 54,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    payAmt1: {
        field: "A3PAY1",
        startFrom: 55,
        startTo: 66,
        type: "decimal",
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    payAmt2: {
        field: "A3PAY2",
        startFrom: 67,
        startTo: 78,
        type: "decimal",
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    payAmt3: {
        field: "A3PAY3",
        startFrom: 79,
        startTo: 90,
        type: "decimal",
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    payAmt4: {
        field: "A3PAY4",
        startFrom: 91,
        startTo: 102,
        type: "decimal",
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    payAmt5: {
        field: "A3PAY5",
        startFrom: 103,
        startTo: 114,
        type: "decimal",
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    payAmt6: {
        field: "A3PAY6",
        startFrom: 115,
        startTo: 126,
        type: "decimal",
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    payAmt7: {
        field: "A3PAY7",
        startFrom: 127,
        startTo: 138,
        type: "decimal",
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    payAmt8: {
        field: "A3PAY8",
        startFrom: 139,
        startTo: 150,
        type: "decimal",
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    payAmt9: {
        field: "A3PAY9",
        startFrom: 151,
        startTo: 162,
        type: "decimal",
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    payAmtA: {
        field: "A3PAYA",
        startFrom: 163,
        startTo: 174,
        type: "decimal",
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    payAmtB: {
        field: "A3PAYB",
        startFrom: 175,
        startTo: 186,
        type: "decimal",
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    payAmtC: {
        field: "A3PAYC",
        startFrom: 187,
        startTo: 198,
        type: "decimal",
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    payAmtD: {
        field: "A3PAYD",
        startFrom: 199,
        startTo: 210,
        type: "decimal",
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    payAmtE: {
        field: "A3PAYE",
        startFrom: 211,
        startTo: 222,
        type: "decimal",
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    payAmtF: {
        field: "A3PAYF",
        startFrom: 223,
        startTo: 234,
        type: "decimal",
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    payAmtG: {
        field: "A3PAYG",
        startFrom: 235,
        startTo: 246,
        type: "decimal",
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    foreignCountryCode: {
        field: "A3FCI",
        startFrom: 247,
        startTo: 247,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    firstPayeeName: {
        field: "A3FPYN",
        startFrom: 288,
        startTo: 327,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    secondPayeeName: {
        field: "A3SPYN",
        startFrom: 328,
        startTo: 367,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    payeeAddress: {
        field: "A3PYEA",
        startFrom: 368,
        startTo: 407,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    payeeCity: {
        field: "A3PYEC",
        startFrom: 448,
        startTo: 487,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    payeeState: {
        field: "A3PYES",
        startFrom: 488,
        startTo: 489,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    payeeZip: {
        field: "A3PYEZ",
        startFrom: 490,
        startTo: 498,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    blank05: {
        field: "A3BL05",
        startFrom: 499,
        startTo: 499,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    sequenceNumber: {
        field: "A3SEQ#",
        startFrom: 500,
        startTo: 507,
        type: Number,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    blank06: {
        field: "A3BL06",
        startFrom: 508,
        startTo: 543,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    secondTinNotice: {
        field: "A32TIN",
        startFrom: 544,
        startTo: 544,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    blank07: {
        field: "A3BL07",
        startFrom: 545,
        startTo: 546,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    foreignCountryOrUsPos: {
        field: "A3FCUS",
        startFrom: 547,
        startTo: 586,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    blank08: {
        field: "A3BL08",
        startFrom: 587,
        startTo: 662,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    directorSalesInd: {
        field: "A3DSI",
        startFrom: 547,
        startTo: 547,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    blank09: {
        field: "A3BL09",
        startFrom: 548,
        startTo: 662,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    specialDataEntry: {
        field: "A3SDE",
        startFrom: 663,
        startTo: 722,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    stateIncomeTaxWithheld: {
        field: "A3SITW",
        startFrom: 723,
        startTo: 734,
        type: Number,
        decimal: 2,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    localIncomeTaxWithheld: {
        field: "A3LITW",
        startFrom: 735,
        startTo: 746,
        type: Number,
        decimal: 2,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    combinedFedStateCode: {
        field: "A3CFSC",
        startFrom: 747,
        startTo: 748,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    blank10: {
        field: "A3BL10",
        startFrom: 749,
        startTo: 750,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    payeeLastOrBusinessName: {
        field: "A3LNAM",
        startFrom: 751,
        startTo: 780,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    payeeFirstName: {
        field: "A3FNAM",
        startFrom: 781,
        startTo: 800,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    payeeMiddleName: {
        field: "A3MNAM",
        startFrom: 801,
        startTo: 820,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    payeeSuffix: {
        field: "A3SUFF",
        startFrom: 821,
        startTo: 824,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    }

};


export const RecordFormatT1009I = {
    recordType: {
        field: "A1REC",
        startFrom: 1,
        startTo: 1,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    paymentYear: {
        field: "A1YR",
        startFrom: 2,
        startTo: 5,
        type: Number,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    priorYearDataInd: {
        field: "A1PYRD",
        startFrom: 6,
        startTo: 6,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    transmitterId: {
        field: "A1TIN",
        startFrom: 7,
        startTo: 15,
        type: Number,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    transControlCode: {
        field: "A1TCC",
        startFrom: 16,
        startTo: 20,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    replacementAlphaChar: {
        field: "A1RAC",
        startFrom: 21,
        startTo: 22,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    blank01: {
        field: "A1BL01",
        startFrom: 23,
        startTo: 27,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    testFileInd: {
        field: "A1TFI",
        startFrom: 28,
        startTo: 28,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    foreignEntityInd: {
        field: "A1FEI",
        startFrom: 29,
        startTo: 29,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    transmitterName: {
        field: "A1TRNM",
        startFrom: 30,
        startTo: 69,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    transmitterName2: {
        field: "A1TRN2",
        startFrom: 70,
        startTo: 109,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    companyName: {
        field: "A1CONM",
        startFrom: 110,
        startTo: 149,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    companyName2: {
        field: "A1CON2",
        startFrom: 150,
        startTo: 189,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    companyAddress: {
        field: "A1ADDR",
        startFrom: 190,
        startTo: 229,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    companyCity: {
        field: "A1CITY",
        startFrom: 230,
        startTo: 269,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    companyState: {
        field: "A1STAT",
        startFrom: 270,
        startTo: 271,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    companyZipCode: {
        field: "A1ZIP9",
        startFrom: 272,
        startTo: 280,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    blank02: {
        field: "A1BL02",
        startFrom: 281,
        startTo: 295,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    totalNumberOfPayees: {
        field: "A1TPAY",
        startFrom: 296,
        startTo: 303,
        type: Number,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    contactName: {
        field: "A1CNNM",
        startFrom: 304,
        startTo: 343,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    contactPhoneNumber: {
        field: "A1CPH#",
        startFrom: 344,
        startTo: 358,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    contactEmail: {
        field: "A1CEML",
        startFrom: 359,
        startTo: 408,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    blank03: {
        field: "A1BL03",
        startFrom: 409,
        startTo: 499,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    sequenceNumber: {
        field: "A1SEQ#",
        startFrom: 500,
        startTo: 507,
        type: Number,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    blank04: {
        field: "A1BL04",
        startFrom: 508,
        startTo: 517,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    vendorInd: {
        field: "A1VNIN",
        startFrom: 518,
        startTo: 518,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    blank05: {
        field: "A1BL05",
        startFrom: 519,
        startTo: 748,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    },
    blank06: {
        field: "A1BL06",
        startFrom: 749,
        startTo: 750,
        type: String,
        length() {
            return calculateLength(this.startFrom, this.startTo);
        }
    }
};


