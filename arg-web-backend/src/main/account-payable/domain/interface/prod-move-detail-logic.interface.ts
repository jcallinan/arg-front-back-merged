import { ProdMoveDetailLogical } from "../entities/prod-move-detail-logical.entity";

export interface ProdMoveDetailLogicalInterface {
    findAll(
        companyNo: Number,
        orderNo: Number,
        shippingReferenceNo: Number,
        invoiceDate: string
    ): Promise<ProdMoveDetailLogical[]>;
}
