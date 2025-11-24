import { CompanyModel } from "@src/main/account-payable/data/models/company.model";
import { VendorModel } from "@src/main/account-payable/data/models/vendor.model";
import { VoucherHeaderModel } from "@src/main/account-payable/data/models/voucher-header.model";
import { VoucherDetailModel } from "@src/main/account-payable/data/models/voucher-detail.model";
import { GeneralSystemModel } from "@src/main/account-payable/data/models/general-system.model";
import { FreightInvoiceHeaderModel } from "@src/main/account-payable/data/models/freight-invoice-header.model";
import { GlMasterModel } from "@src/main/account-payable/data/models/gl-master.model";
import { CarrierInvoiceHeaderModel } from "@src/main/account-payable/data/models/carrier-invoice-header.model";
import { ApdateModel } from "@src/main/account-payable/data/models/apdate.model";
import { InventoryFutureTransModel } from "@src/main/account-payable/data/models/inventory-future-trans.model";
import { InventoryHistoryModel } from "@src/main/account-payable/data/models/inventory-history.model";
import { VendorMasterAdditionalModel } from "@src/main/account-payable/data/models/vendor-master-additional.model";
import { ContainerUnitofMeasureConversionModel } from "@src/main/account-payable/data/models/container-uom-conversion.model";
import { BillingControlFileModel } from "@src/main/account-payable/data/models/billing-control-file.model";
import { ProdMoveMiscLogicalModel } from "@src/main/account-payable/data/models/prod-move-misc-logical.model";
import { ProdMoveDetailLogicalModel } from "@src/main/account-payable/data/models/prod-move-detail-logical.model";
import { SalesAnalysisMiscModel } from "@src/main/account-payable/data/models/sales-analysis-misc.model";
import { FreightOutBalancingInvoiceModel } from "@src/main/account-payable/data/models/freight-out-balancing-header.model";
import { FreightCarrierInvoiceModel } from "@src/main/account-payable/data/models/freight-carrier-invoice.model";
import { VoucherHeaderHistoryModel } from "@src/main/account-payable/data/models/voucher-header-history.model";
import { VoucherDetailHistoryModel } from "@src/main/account-payable/data/models/voucher-detail-history.model";
import { SpInfoModel } from "@src/main/global-states/data/models/spinfo.model";
import { SalesAnalysisDetailModel } from "@src/main/account-payable/data/models/sales-analysis-detail.model";
import { PayablehistoryheaderModel } from "@src/main/account-payable/data/models/open-payable-history-header.model";
import { PayablehistorydetailModel } from "@src/main/account-payable/data/models/open-payable-history-detail.model";
import { PayablehistoryvendorModel } from "@src/main/account-payable/data/models/open-payable-history-vendor.model";
import { ClearchecksModel } from "@src/main/account-payable/data/models/clearchecks.model";
declare module "@sequelize/core" {
  interface Sequelize {
    models: {
      VendorModel: typeof VendorModel;
      VoucherHeaderModel: typeof VoucherHeaderModel;
      CompanyModel: typeof CompanyModel;
      VoucherDetailModel: typeof VoucherDetailModel;
      GeneralSystemModel: typeof GeneralSystemModel;
      FreightInvoiceHeaderModel: typeof FreightInvoiceHeaderModel;
      GlMasterModel: typeof GlMasterModel;
      CarrierInvoiceHeaderModel: typeof CarrierInvoiceHeaderModel;
      ApdateModel: typeof ApdateModel;
      InventoryFutureTransModel: typeof InventoryFutureTransModel;
      InventoryHistoryModel: typeof InventoryHistoryModel;
      VendorMasterAdditionalModel: typeof VendorMasterAdditionalModel;
      ContainerUnitofMeasureConversionModel: typeof ContainerUnitofMeasureConversionModel;
      BillingControlFileModel: typeof BillingControlFileModel;
      ProdMoveMiscLogicalModel: typeof ProdMoveMiscLogicalModel;
      ProdMoveDetailLogicalModel: typeof ProdMoveDetailLogicalModel;
      SalesAnalysisMiscModel: typeof SalesAnalysisMiscModel;
      FreightOutBalancingInvoiceModel: typeof FreightOutBalancingInvoiceModel;
      FreightCarrierInvoiceModel: typeof FreightCarrierInvoiceModel;
      VoucherHeaderHistoryModel: typeof VoucherHeaderHistoryModel;
      VoucherDetailHistoryModel: typeof VoucherDetailHistoryModel;
      SpInfoModel: typeof SpInfoModel;
      SalesAnalysisDetailModel: typeof SalesAnalysisDetailModel;
      PayablehistoryheaderModel: typeof PayablehistoryheaderModel;
      PayablehistorydetailModel: typeof PayablehistorydetailModel;
      PayablehistoryvendorModel: typeof PayablehistoryvendorModel;
      ClearchecksModel: typeof ClearchecksModel;

    };
  }
}
