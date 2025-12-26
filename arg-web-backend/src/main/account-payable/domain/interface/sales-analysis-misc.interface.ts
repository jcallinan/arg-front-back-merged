import { SalesAnalysisMisc } from "../entities/sales-analysis-misc.entity";

export interface SalesAnalysisMiscInterface {
    findAll(
        companyNo: Number, 
        orderNo: Number, 
        shippingReferenceNo: Number, 
        invoiceDate: string
    ): Promise<SalesAnalysisMisc[]>;
}
