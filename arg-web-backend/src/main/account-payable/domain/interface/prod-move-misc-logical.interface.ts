import { ProdMoveMiscLogical } from "../entities/prod-move-misc-logical.entity";

export interface ProdMoveMiscLogicalInterface {
    findAll(
        companyNo: Number,
        orderNo: Number,
        shippingReferenceNo: Number,
        invoiceDate: string
    ): Promise<ProdMoveMiscLogical[]>;
}
