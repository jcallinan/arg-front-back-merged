import { VendorContactDetailEntity } from "../../domain/entities/vendor-contact-detail.entity";
import { VendorContactDetailModel } from "../models/vendor-contact-detail.model";

// ModelToEntity
export function vendorContactDetailMapper(record: VendorContactDetailModel): VendorContactDetailEntity {
    
    if (!record) {
        throw new Error("Vendor Contact Details is null or undefined");
    }

    return VendorContactDetailEntity.create({
        deleteCode: record.deleteCode,
        companyNo: record.companyNo,
        vendorNo: record.vendorNo,
        formType: record.formType,
        sequenceNumber: record.sequenceNumber,
        contactName: record.contactName,
        emailAddress: record.emailAddress,
        faxNumber: record.faxNumber,
        sendAchEmail: record.sendAchEmail,
        filler: record.filler
    });
}
