import { SalesAnalysisDetail } from "../entities/sales-analysis-detail.entity";

export interface SalesAnalysisDetailInterface {
    findAll(
        companyNo: Number,
        orderNo: Number,
        shippingReferenceNo: Number,
        invoiceDate: string
    ): Promise<SalesAnalysisDetail[]>;
}
