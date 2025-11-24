import { BillingControlFile } from "../entities/billing-control-file.entity";

export interface BillingControlFileInterface {
    findAll(
        companyNo: Number,
        orderNo: Number,
        shippingReferenceNo: Number
    ): Promise<BillingControlFile[]>;
    
    findOne(
        companyNo: Number
    ): Promise<BillingControlFile | null>;
}
