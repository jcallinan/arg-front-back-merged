export class FreightOutBalancingInvoice {
  isDeleted!: string;
  companyNo!: number;
  ourOrderNo!: number;
  shippingReferenceNumber!: number;
  systemDateTime!: string;
  sentToFrtProcessr!: string;
  sentToFrtProcDateTime!: string;
  orderBatch!: number;
  frtProcessorAction!: string;
  customerNo!: number;
  shipToNo!: number;
  pickupDate!: number;
  customerPoDate!: number;
  orderEntryDate!: number;
  billToPoNo!: string;
  shipmentNo!: number;
  timeOfSaleHhmm!: number;
  typeRMC!: string;
  glNo!: number;
  terms!: number;
  salesman!: number;
  railCarNumber!: string;
  carrierCodeCcCtRc!: string;
  frtPerCodeLC!: string;
  completeYN!: string;
  invoiceNo!: number;
  invoiceDate!: number;
  shipDate!: number;
  ppdAmount!: number;
  sortField!: string;
  location!: string;
  inventoryType!: string;
  distributorOrder!: number;
  distribShipOrder!: number;
  distribPurchEnough!: string;
  distribPurchAuth!: string;
  billedCustNo!: number;
  billedCustShipTo!: number;
  lockOutCode!: string;
  lockoutWsid!: string;
  orderYN!: string;
  billOfLadingNo!: number;
  keyedInvoiceNo!: number;
  shipToPoNo!: string;
  userInfoFld1!: string;
  userInfoFld2!: string;
  freightCodeCPA!: string;
  carrierId!: string;
  routeCode!: string;
  routingLine1!: string;
  routingLine2!: string;
  printedPickYN!: string;
  printedBolYN!: string;
  multiloadYN!: string;
  totalLoads!: number;
  loadsDay!: number;
  loadVolume!: number;
  weekendPickUpNY!: string;
  pickupDtCymd!: number;
  customerPoDateCymd!: number;
  orderEntryDateCymd!: number;
  invoiceDateCymd!: number;
  shipDateCymd!: number;
  orderTakenByInitls!: string;
  customerContact!: string;
  separateFrtNY!: string;
  billedCustOrdNo!: number;
  billedCustMemoOrd!: number;
  memoInvcCust!: number;
  memoInvcCustShipto!: number;
  autoReceiptsCoNo!: number;
  sendInvoiceEdi!: string;
  custOwnedProductOnly!: string;
  groupBy!: string;
  responsibleArea!: string;
  majorLocation!: string;
  scheduledShipDate!: number;
  shiptoJoinCustomer!: number;
  shiptoJoinShipToNumber!: number;
  thirdPartyFreightProcessor!: string;
  thirdPartyFrghtProcStatus!: string;
  orderVersionNumber!: number;
  prevShipmentNumberUsed!: number;
  calculateFreightYN!: string;
  facilityBatch!: string;
  pickUpFromTime!: number;
  productTotal!: number;
  miscTotal!: number;
  freightTotal!: number;
  orderTotal!: number;
  pickListRemark1!: string;
  pickListRemark2!: string;
  pickListRemark3!: string;
  pickListRemark4!: string;
  bolRemark1!: string;
  bolRemark2!: string;
  bolRemark3!: string;
  bolRemark4!: string;
  freightBillName!: string;
  freightBillAddr1!: string;
  freightBillAddr2!: string;
  freightBillAddr3!: string;
  invoiceRemark1!: string;
  invoiceRemark2!: string;
  dispatchInfo1!: string;
  dispatchInfo2!: string;
  dispatchInfo3!: string;
  dispatchInfo4!: string;
  customerName!: string;
  addressLine1!: string;
  addressLine2!: string;
  addressLine3!: string;
  addressLine4!: string;
  shiptoName!: string;
  shiptoAddr1!: string;
  shiptoAddr2!: string;
  shiptoAddr3!: string;
  shiptoAddr4!: string;
  city!: string;
  state!: string;
  zipPostalCode!: string;
  country!: string;
  exportYn!: string;
  carrierDescription!: string;
  freightCodeDescription!: string;
  freightBillToName!: string;
  freightBillToAddr1!: string;
  freightBillToAddr2!: string;
  freightBillToCity!: string;
  freightBillToState!: string;
  freightBillToZipPostal!: string;
  freightBillToCountry!: string;
  bookStatusCd!: string;
  rush!: string;
  orderProcessStatusCode!: string;
  freightBalancedClosed!: string;
  frtBalancedClosedDate!: number;
  originalOrderNumber!: number;
  filler!: string;

  constructor(partial: Partial<FreightOutBalancingInvoice>) {
    Object.assign(this, partial);
  }

  static create(partial: Partial<FreightOutBalancingInvoice>): FreightOutBalancingInvoice {
    return new FreightOutBalancingInvoice(partial);
  }

  update(partial: Partial<FreightOutBalancingInvoice>): void {
    Object.assign(this, partial);
  }

  markAsDeleted(): void {
    this.isDeleted = "Y";
  }

  isActive(): boolean {
    return this.isDeleted === "N";
  }
}
