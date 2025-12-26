import { VoucherMaintenance } from "../../domain/entities/voucher-maintenance.entity";
import { OpenPayableHeaderModel } from "../models/open-payable-header.model";
import { OpenPayableVendorModel } from "../models/open-payable-vendor.model";
import { OpenPayableDetailsModel } from "../models/open-payable-details.model";
import { OpenPayableHistoryDetailModel } from "../models/open-payable-history-detail.model";
import {
  VoucherHeader,
  VoucherDetail,
} from "../../domain/entities/voucher.entity";
import { AppendInvoiceDescription, CancelledVoucherStatusCode, VoucherType } from "@src/shared/constants/voucher-type.enum";
import { IsDeletedStatus, PROCESS_TYPE_ENUM } from "@src/shared/constants/constant";
import { MakePrepaidFlag } from "@src/shared/constants/payment-constant";
import { convertMMDDYYtoYYYYMMDD } from "@src/shared/utils/format-date";

export function voucherMaintenanceMapper(
  headerModel: OpenPayableHeaderModel,
  vendorModel?: OpenPayableVendorModel
): VoucherMaintenance {
  if (!headerModel) {
    throw new Error("VoucherMaintenance header record is null or undefined");
  }

  return VoucherMaintenance.create({
    // Map from header model
    isDeleted: headerModel.isDeleted,
    companyNo: headerModel.companyNo,
    vendorNo: headerModel.vendorNo,
    voucherNo: headerModel.voucherNo,
    grossAmount: headerModel.grossAmount,
    discountAmount: headerModel.discount,
    partialPaidToDate: headerModel.partialPaidToDate,
    invoiceDescription: headerModel.invoiceDescription,
    invoiceNo: headerModel.invoiceNo,
    invoiceDate6: headerModel.invoiceDate6,
    invoiceDate8: headerModel.invoiceDate8,
    dueDate6: headerModel.dueDate6,
    dueDate8: headerModel.dueDate8,
    discountDueDate6: headerModel.discountDueDate6,
    discountDueDate8: headerModel.discountDueDate8,
    holdPaymentFlag: headerModel.holdPaymentFlag,
    prepaidVoucherFlag: headerModel.prepaidVoucherFlag,
    bankGlNo: headerModel.bankGlNo,
    lastPaidAmount: headerModel.lastPaidAmount,
    lastPaidDate8: headerModel.lastPaidDate8,

    // Map from vendor model if available
    vendorName: vendorModel?.vendorName,
    vendorAddress1: vendorModel?.addressLine1,
    vendorAddress2: vendorModel?.addressLine2,
    vendorAddress3: vendorModel?.addressLine3,
    vendorAddress4: vendorModel?.addressLine4,
  });
}

/**
 * Maps a VoucherMaintenance entity to a response DTO
 * @param entity The VoucherMaintenance entity to map
 * @returns A response DTO object
 */
export function toResponse(
  entity: VoucherMaintenance,
  isFromHistory: boolean = false
): any {
  const netAmount = (entity.grossAmount || 0) - (entity.discountAmount || 0);
  const openPayables =
    (entity.grossAmount || 0) - (entity.partialPaidToDate || 0);

  return {
    // Basic voucher info
    companyNo: entity.companyNo,
    vendorNo: entity.vendorNo,
    voucherNo: entity.voucherNo,

    // Vendor info
    vendorName: entity.vendorName?.trim() || "",
    vendorAddress1: entity.vendorAddress1?.trim() || null,
    vendorAddress2: entity.vendorAddress2?.trim() || null,
    vendorAddress3: entity.vendorAddress3?.trim() || null,
    vendorAddress4: entity.vendorAddress4?.trim() || null,

    // Invoice info
    invoiceNumber: entity.invoiceNo?.trim() || "",
    invoiceDescription: entity.invoiceDescription?.trim() || "",
    invoiceDate: entity.invoiceDate8?.toString() || "",
    dueDate: entity.dueDate8?.toString() || "",
    discountDueDate: entity.discountDueDate6?.toString() || null,

    // Amounts
    grossAmount: entity.grossAmount || 0,
    discountAmount: entity.discountAmount || 0,
    netAmount: netAmount || 0,
    partialPaidToDate: entity.partialPaidToDate || 0,
    openPayables: openPayables > 0 ? openPayables : 0,
    lastPaidAmount: entity.lastPaidAmount || null,
    lastPaidDate: entity.lastPaidDate8?.toString() || null,

    // Flags
    holdPaymentFlag: entity.holdPaymentFlag,
    holdDescription: entity.holdDescription || null,
    prepaidFlag: entity.prepaidVoucherFlag,

    // PAID voucher specific fields
    checkNo: entity.checkNo || null,
    paidDate: entity.paidOnYymmdd?.toString() || null,
    cancelledVoucher: entity.cancelledVoucher || null,

    // Bank GL
    bankGlNo: entity.bankGlNo,
    apGlAccountNo: entity.apGlAccountNo,
    // Calculated fields
    // Set voucherStatus based on cancelled flag for PAID vouchers
    voucherStatus:
      isFromHistory && entity.cancelledVoucher === CancelledVoucherStatusCode.CANCELLED
        ? VoucherType.CANCELLED
        : isFromHistory
          ? VoucherType.PAID
          : VoucherType.UNPAID,
  };
}

/**
 * Maps an array of VoucherMaintenance entities to response DTOs
 * @param entities Array of VoucherMaintenance entities
 * @returns Array of response DTOs
 */
export function toResponseArray(
  entities: VoucherMaintenance[],
  isFromHistory: boolean = false
): any[] {
  return entities.map((entity) => toResponse(entity, isFromHistory));
}
/**
 * Maps OpenPayableDetailsModel to a VoucherMaintenance entity with detail fields
 * @param model The OpenPayableDetailsModel instance
 * @returns A new VoucherMaintenance entity with detail fields
 */
export function toDetailEntity(
  model: OpenPayableDetailsModel
): VoucherMaintenance {
  return VoucherMaintenance.create({
    isDeleted: model.isDeleted,
    companyNo: model.companyNo,
    vendorNo: model.vendorNo,
    voucherNo: model.voucherNo,
    detailType: model.detailType,
    sequenceNo: model.sequenceNo,
    grossAmount: model.grossAmount,
    discountAmount: model.discountAmount,
    partialPaidToDate: model.partialPaidToDate,
    lineDescription: model.lineDescription,
    expenseGlAccount: model.expenseGlAccount,
    expenseCompanyNo: model.expenseCompanyNo,
    lastPaidDate6: model.lastPaidDate6,
    lastPaidDate8: model.lastPaidDate8,
    purchaseJournalNo: model.purchaseJournalNo,
    inventoryItemNo: model.inventoryItemNo,
    quantity: model.quantity,
    gallons: model.gallons,
    jobNo: model.jobNo,
    jobExtraField: model.jobExtraField,
    costCode: model.costCode,
    costType: model.costType,
    jobCostQuantity: model.jobCostQuantity,
    purchaseOrderNo: model.purchaseOrderNo,
    receiptNumber: model.receiptNumber,
    poStatus: model.poStatus,
    poLineSequenceNo: model.poLineSequenceNo,
    productAmount: model.productAmount,
    freightAmount: model.freightAmount,
    poNumber: model.poNumber,
  });
}

/**
 * Maps OpenPayableHistoryDetailModel to a VoucherMaintenance entity with detail fields
 * @param model The OpenPayableHistoryDetailModel instance
 * @returns A new VoucherMaintenance entity with detail fields
 */
export function toHistoryDetailEntity(
  model: OpenPayableHistoryDetailModel
): VoucherMaintenance {
  return VoucherMaintenance.create({
    isDeleted: model.isDeleted,
    companyNo: model.companyNo,
    vendorNo: model.vendorNo,
    voucherNo: model.voucherNo,
    detail: model.detail,
    sequenceNo: model.sequenceNo,
    grossAmount: model.detailLineAmount,
    discountAmount: model.detailLineDiscount,
    partialPaidToDate: model.partialPaidToDate,
    lineDescription: model.detailLineDescript,
    expenseGlAccount: model.expenseGlAccount,
    expenseCompanyNo: model.expCoForGl,
    lastPaidDateYymmdd: model.lastPaidDateYymmdd,
    purchaseJournalNo: model.purchaseJournalNo,
    inventoryItemNo: model.inventoryItemNo,
    quantity: model.quantity,
    gallons: model.gallons,
    jobNo: model.jobNumber,
    jobExtraField: model.extraJobField,
    costCode: model.costCode,
    costType: model.costType,
    jobCostQuantity: model.jobCostQuantity,
    purchaseOrderNo: model.poNo,
    receiptNumber: model.receiptNumber,
    poStatus: model.openClosedStatus,
    poLineSequenceNo: model.poLineSeqNo,
    productAmount: model.productAmount,
    freightAmount: model.freightAmount,
    poNumber: model.poNo,
  });
}

/**
 * Maps a VoucherMaintenance entity with detail fields to a response DTO
 * @param entity The VoucherMaintenance entity to map
 * @returns A response DTO object
 */
export function toDetailResponse(entity: VoucherMaintenance): any {
  return {
    sequenceNo: entity.sequenceNo,
    detailType: entity.detailType,
    detail: entity.detail,
    lineDescription: entity.lineDescription?.trim() || "",
    grossAmount: entity.grossAmount || 0,
    discountAmount: entity.discountAmount || 0,
    netAmount: entity.netAmount || 0,
    partialPaidToDate: entity.partialPaidToDate || 0,
    expenseGlAccount: entity.expenseGlAccount,
    expenseCompanyNo: entity.expenseCompanyNo,
    lastPaidDate:
      entity.lastPaidDate8?.toString() ||
      entity.lastPaidDateYymmdd?.toString() ||
      null,
    purchaseJournalNo: entity.purchaseJournalNo?.trim() || "",
    inventoryItemNo: entity.inventoryItemNo?.trim() || "",
    quantity: entity.quantity || 0,
    jobNo: entity.jobNo?.trim() || "",
    gallons: entity.gallons || "",
    jobExtraField: entity.jobExtraField?.trim() || "",
    costCode: entity.costCode?.trim() || "",
    costType: entity.costType?.trim() || "",
    jobCostQuantity: entity.jobCostQuantity || 0,
    purchaseOrderNo: entity.purchaseOrderNo?.trim() || "",
    receiptNumber: entity.receiptNumber || 0,
    poStatus: entity.poStatus?.trim() || "",
    poLineSequenceNo: entity.poLineSequenceNo || 0,
    productAmount: entity.productAmount || 0,
    freightAmount: entity.freightAmount || 0,
    poNumber: entity.poNumber?.trim() || "",
  };
}

/**
 * Maps an array of VoucherMaintenance entities with detail fields to response DTOs
 * @param entities Array of VoucherMaintenance entities
 * @returns Array of response DTOs
 */
export function toDetailResponseArray(entities: VoucherMaintenance[]): any[] {
  return entities.map((entity) => toDetailResponse(entity));
}

/**
 * Maps header data and vendor data to VoucherMaintenance entity for view
 * @param headerData The header data from database
 * @param vendorData The vendor data from database
 * @param isPaid Whether this is a PAID voucher
 * @returns A new VoucherMaintenance entity
 */
export function toViewEntity(
  headerData: any,
  vendorData: any,
  isPaid: boolean
): VoucherMaintenance {
  return new VoucherMaintenance({
    isDeleted: headerData.isDeleted,
    companyNo: headerData.companyNo,
    vendorNo: headerData.vendorNo,
    voucherNo: headerData.voucherNo,
    grossAmount: headerData.grossAmount,
    discountAmount: headerData.discount,
    partialPaidToDate: headerData.partialPaidToDate,
    invoiceDescription: headerData.invoiceDescription,
    invoiceNo: headerData.invoiceNo,
    invoiceDate8: isPaid ? headerData.invoiceDate : headerData.invoiceDate6,
    dueDate8: isPaid ? headerData.dueDate : headerData.dueDate6,
    discountDueDate6: isPaid
      ? headerData.discountDueDate
      : headerData.discountDueDate6,
    lastPaidDate8: isPaid
      ? headerData.lastPaidDateYymmdd
      : headerData.lastPaidDate8,
    lastPaidAmount: isPaid
      ? headerData.lastPaymentAmt
      : headerData.lastPaidAmount,
    holdPaymentFlag: isPaid
      ? headerData.HoldPymtVouchr
      : headerData.holdPaymentFlag,
    holdDescription: isPaid
      ? headerData.HoldDescription
      : headerData.holdDescription,
    prepaidVoucherFlag: isPaid
      ? headerData.PrepaidVoucher
      : headerData.prepaidVoucherFlag,
    bankGlNo: headerData.bankGlNo,
    checkNo: isPaid ? headerData.checkNo : undefined,
    paidOnYymmdd: isPaid ? headerData.paidOnYymmdd : undefined,
    vendorName: vendorData?.vendorName,
    vendorAddress1: vendorData?.vendorAdd1,
    vendorAddress2: vendorData?.vendorAdd2,
    vendorAddress3: vendorData?.vendorAdd3,
    vendorAddress4: vendorData?.vendorAdd4,
    apGlAccountNo: headerData.apGlAccountNo,
    cancelledVoucher: isPaid ? headerData.CancelledVoucher : undefined,
  });
}

/**
 * Maps source header data to VoucherHeader entity for voucher transfer
 * @param params - Source data and mapping parameters
 * @returns VoucherHeader - Properly formatted header data for APTRANH table
 */
export function mapToAptranHeaderInsertDto(params: {
  source: any;
  vendorData: any;
  voucherType: VoucherType;
  companyNo: number;
  vendorNo: number;
  voucherNo: number;
  entryNo: number;
  entrySequence: number;
  retentionGl: number;
}): VoucherHeader {
  const {
    source,
    vendorData,
    voucherType,
    companyNo,
    vendorNo,
    voucherNo,
    entryNo,
    entrySequence,
    retentionGl,
  } = params;

  // Determine date fields based on voucher type
  const invoiceDate =
    voucherType === VoucherType.UNPAID
      ? source.invoiceDate6 || source.invoiceDate
      : source.invoiceDate;

  const dueDate =
    voucherType === VoucherType.UNPAID
      ? source.dueDate6 || source.dueDate
      : source.dueDate;

  // Calculate amounts with sign changes for ALL vouchers (both PAID and UNPAID)
  const invoiceAmount = (source.grossAmount || 0) * -1;

  // Map hold code/description from the correct origin columns in each table
  const holdCodeRaw =
    voucherType === VoucherType.UNPAID
      ? source.OPHALT ?? source.holdPaymentFlag ?? source.holdCode ?? ""
      : source.OHHALT ?? source.HoldPymtVouchr ?? source.holdCode ?? "";

  const holdDescRaw =
    voucherType === VoucherType.UNPAID
      ? source.OPHDES ?? source.holdDescription ?? ""
      : source.OHHDES ?? source.HoldDescription ?? "";

  const holdCode = holdCodeRaw.toString().trim().substring(0, 1);
  const holdDescriptionSource = holdDescRaw.toString().trim();
  return VoucherHeader.create({
    isDeleted: IsDeletedStatus.ACTIVE, // Initially active, will be set to "A" after transfer
    companyNo,
    entryNo,
    entrySequence,
    vendorNo,
    canceledVoucher: voucherType === VoucherType.UNPAID ? voucherNo : 0,
    apGlNo: source.apGlAccountNo || 0,
    invoiceDesc: voucherType === VoucherType.PAID ? `${AppendInvoiceDescription.VOID} ${source.checkNo} ${source.invoiceDescription || ""}`.substring(0, 25) : `${AppendInvoiceDescription.CANCEL} ${source.invoiceDescription || ""}`.substring(0, 25),
    invoiceDate,
    dueDate,
    singleCheck: "",
    holdCode,
    holdDesc: holdDescriptionSource.substring(0, 25),
    // Map prepaid fields based on voucher type and source table schema
    // UNPAID (APOPNH): OPPAID -> prepaidVoucherFlag, OPCKNO -> prepaidCheckNo
    // PAID   (APHSTH): OHPAID -> PrepaidVoucher,   OHCKNO -> checkNo
    // For PAID vouchers, if PrepaidVoucher is empty/null/undefined/whitespace, default to "P"
    prepaidCode: voucherType === VoucherType.UNPAID
      ? (source.prepaidVoucherFlag || "").substring(0, 1)
      : (source.PrepaidVoucher?.trim() || MakePrepaidFlag.PREPAID).substring(0, 1),
    prepaidCheckNo:
      voucherType === VoucherType.UNPAID
        ? source.prepaidCheckNo || 0
        : source.checkNo || 0,
    vendorName: (vendorData?.vendorName || "").substring(0, 30),
    vendorAdd1: (vendorData?.vendorAdd1 || "").substring(0, 30),
    vendorAdd2: (vendorData?.vendorAdd2 || "").substring(0, 30),
    vendorAdd3: (vendorData?.vendorAdd3 || "").substring(0, 30),
    vendorAdd4: (vendorData?.vendorAdd4 || "").substring(0, 30),
    bankGl: source.bankGlNo || 0,
    invoiceAmount,
    retentionGl,
    retentionPct: 0,
    prepaidCheckdate: 0,
    totalFreight: (source.freightTotal || 0) * -1,
    salesOrderNo: source.salesOrderNo || 0,
    srn: source.salesSrnNo || 0,
    carrierId: voucherType === VoucherType.UNPAID ? (source.carrierId || "").substring(0, 6) : (source.carrierId || "").substring(0, 6),
    vendorPaymentTerms: Math.max(
      0,
      Math.min(99, vendorData?.vendorApTermsCode || source.apTerms || 0)
    ),
    processType: PROCESS_TYPE_ENUM.NORMAL,
    discountDueDate: voucherType === VoucherType.UNPAID ? source.discountDueDate6 || 0 : source.discountDueDate || 0,
    extendedInvoiceDate: convertMMDDYYtoYYYYMMDD(
      invoiceDate.toString().padStart(6, "0")
    ),
    extendedDueDate: convertMMDDYYtoYYYYMMDD(
      dueDate.toString().padStart(6, "0")
    ),
    extendedDiscountDueDate: voucherType === VoucherType.UNPAID ? (source.discountDueDate6 === 0 ? 0 : convertMMDDYYtoYYYYMMDD(source.discountDueDate6.toString().padStart(6, "0"))) : (source.discountDueDate === 0 ? 0 : convertMMDDYYtoYYYYMMDD(source.discountDueDate.toString().padStart(6, "0"))),
    invoiceNo: (source.invoiceNo || "").substring(0, 20),
    status: "",
    companyBankGlDesc: "",
    companyApGlDesc: "",
    userProfile: "",
    prepaidCheckdate8: 0,
    createDate: Math.floor(Date.now() / 1000),
    updateDate: Math.floor(Date.now() / 1000),
    fillerOne: "",
    fillerTwo: "",
  });
}

/**
 * Maps source detail data to VoucherDetail entity for voucher transfer
 * @param params - Source data and mapping parameters
 * @returns VoucherDetail - Properly formatted detail data for APTRAND table
 */
export function mapToAptranDetailInsertDto(params: {
  source: any;
  voucherType: VoucherType;
  companyNo: number;
  vendorNo: number;
  entryNo: number;
  lineIndex: number;
}): VoucherDetail {
  const { source, voucherType, companyNo, vendorNo, entryNo, lineIndex } =
    params;

  // Calculate amounts with sign changes for ALL vouchers (both PAID and UNPAID)
  const lineAmount =
    voucherType === VoucherType.UNPAID
      ? ((source.grossAmount || 0) - (source.partialPaidToDate || 0)) * -1
      : (source.detailLineAmount || 0) * -1;

  const discountAmount =
    (source.discountAmount || source.detailLineDiscount || 0) * -1;

  const quantity = (source.quantity || 0) * -1;

  const gallons = (source.gallons || 0) * -1;

  const productAmount = (source.productAmount || 0) * -1;

  return VoucherDetail.create({
    isDeleted: IsDeletedStatus.ACTIVE,
    companyNo,
    entryNo,
    entrySequence: lineIndex + 1,
    vendorNo,
    lineCompanyNo: source.expenseCompanyNo || companyNo,
    lineGlNo: source.expenseGlAccount || 0,
    lineDesc: voucherType === VoucherType.UNPAID ? (source.lineDescription || "").substring(0, 25) : (source.detailLineDescript || "").substring(0, 25),
    lineAmount,
    discountAmount,
    discountPercentage: 0,
    inventoryItem: (source.inventoryItemNo || "").substring(0, 13),
    quantity,
    jobNo: (source.jobNo || "").substring(0, 6),
    jobCostCode: (source.costCode || "").substring(0, 6),
    jobCostType: (source.costType || "").substring(0, 2),
    jobCostQuantity: source.jobCostQuantity || 0,
    gallons,
    receiptNo: source.receiptNumber || 0,
    openClosed: source.poStatus || "",
    poLineNo: source.poLineSequenceNo || 0,
    productAmount: productAmount,
    freightAmount: (source.freightAmount || 0) * -1,
    poNo: (source.poNumber || "").substring(0, 30),
    status: "",
    description: "",
    userProfile: "",
    createDate: Math.floor(Date.now() / 1000),
    updateDate: Math.floor(Date.now() / 1000),
  });
}
