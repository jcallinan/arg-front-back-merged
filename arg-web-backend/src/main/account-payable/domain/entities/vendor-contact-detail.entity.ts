export class VendorContactDetailEntity {
    deleteCode!: string;
    companyNo!: number;
    vendorNo!: number;
    formType!: string;
    sequenceNumber!: number;
    contactName!: string;
    emailAddress!: string;
    faxNumber!: string;
    sendAchEmail!: string;
    filler!: string;


    constructor(partial: Partial<VendorContactDetailEntity>) {
        Object.assign(this, partial);
    }

    static create(partial: Partial<VendorContactDetailEntity>): VendorContactDetailEntity {
        return new VendorContactDetailEntity(partial);
    }

}
