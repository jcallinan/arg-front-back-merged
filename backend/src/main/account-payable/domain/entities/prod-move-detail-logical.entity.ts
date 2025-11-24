export class ProdMoveDetailLogical {
  isDeleted!: string;
  companyNo!: number;
  customerNo!: number;
  invoiceNo!: number;
  shipToNo!: number;
  salesman!: number;
  invoiceDateYmd!: number;
  shipQtyBilgaln!: number;
  price!: number;
  cost!: number;
  location!: string;
  product!: string;
  tank!: string;
  itemFiller!: string;
  typeMCR!: string;
  orderNo!: number;
  orderSeqNo!: number;
  shipDateYmd!: number;
  unitOfMeasure!: string;
  timeOfSaleHhmm!: number;
  productGroup!: string;
  costingFreightAmt!: number;
  filler!: string;
  grossGallons!: number;
  netGallons!: number;
  temperature!: number;
  gravity!: number;
  gallonsCodeGN!: string;
  filler1!: string;
  rackPrice!: number;
  priceCodeRATSOP!: string;
  inventoryState!: string;
  sSummarized!: string;
  miscCodeMFT!: string;
  qtyCalcdCU!: string;
  freightRate!: number;
  taxCode1!: string;
  taxCode2!: string;
  taxCode3!: string;
  taxCode4!: string;
  taxCode5!: string;
  taxAmt1!: number;
  taxAmt2!: number;
  taxAmt3!: number;
  taxAmt4!: number;
  taxAmt5!: number;
  deliveryNY!: string;
  billOfLadingNo!: number;
  glNo!: number;
  customerState!: string;
  containerCd!: string;
  productClass!: string;
  filler3!: string;
  carrierCd!: string;
  shipCntrQty!: number;
  authorizedInitials!: string;
  userId!: string;
  separateFreighyNY!: string;
  inventCostUnitCode!: string;
  invoiceDateYmd8!: number;
  shipDateYmd8!: number;
  multiLoad!: string;
  distributorOrderNo!: number;
  distribShipOrderNo!: number;
  distribPurchAuthIni!: string;
  memoCustNo!: number;
  memoCustShipToNo!: number;
  memoInvoicePrice!: number;
  billedCustOrderNo!: number;
  billedCustMemoOrdN!: number;
  termsSplitCd!: string;
  billedCustNo!: number;
  quantityType!: string;
  fluidCode!: string;
  imsUnitOfMeasure!: string;
  custOwnedProduct!: string;
  shippingReferenceNo!: number;
  exportCode!: string;
  pctOfTotal!: number;
  sepFuelSurchargeAmt!: number;
  description!: string;
  taxCode6!: string;
  taxCode7!: string;
  taxCode8!: string;
  taxCode9!: string;
  taxCode10!: string;
  taxAmt6!: number;
  taxAmt7!: number;
  taxAmt8!: number;
  taxAmt9!: number;
  taxAmt10!: number;
  xrefProdCode!: string;
  filler4!: string;
  salesJournalNo!: string;
  salesJournalDate!: number;
  containerSize!: string;
  weightInLbs!: number;
  hazMat!: string;
  hazMatShippingDescLine1!: string;
  hazMatShippingDescLine2!: string;
  hazMatShippingDescLine3!: string;
  hazMatShippingDescLine4!: string;
  orderContainerQty!: number;
  customerStkNo!: string;
  noChargeCode!: string;
  originalOrderQty!: number;
  alreadyBackordered!: string;
  backorderedBitran!: string;
  tareWeight!: number;
  grossVehicleWeight!: number;
  orderYN!: string;
  pullPpdInvYN!: string;
  pullPpdInvGrossGal!: number;
  pullPpdInvNetGal!: number;
  freightGl  !: number;
  overridePrice!: number;
  overrideFreightRate!: number;
  overrideTaxes!: string;
  carCapacityGallons!: number;
  outageGallons!: number;
  customerProdDesc!: string;
  destinationDate!: number;
  filler2!: string;
  pickListProdDesc1!: string;
  pickListProdDesc2!: string;
  imsItemPrefix!: string;
  imsItemId!: string;
  imsQtyShipped!: number;
  reportAsSales!: string;
  taxExempt1!: string;
  taxExempt2!: string;
  taxExempt3!: string;
  taxExempt4!: string;
  taxExempt5!: string;
  taxExempt6!: string;
  taxExempt7!: string;
  taxExempt8!: string;
  taxExempt9!: string;
  taxExempt10!: string;
  miscFreightAmt!: number;
  origOrderNumber!: number;
  discountTakenAmt!: number;
  discountTakenDate!: number;
  discTakenPercent!: number;
  transitLocation!: string;
  transitTank!: string;
  destinationLocation!: string;
  destinationTank!: string;

  constructor(partial: Partial<ProdMoveDetailLogical>) {
    Object.assign(this, partial);
  }

  static create(partial: Partial<ProdMoveDetailLogical>): ProdMoveDetailLogical {
    return new ProdMoveDetailLogical(partial);
  }

  update(partial: Partial<ProdMoveDetailLogical>): void {
    Object.assign(this, partial);
  }

  markAsDeleted(): void {
    this.isDeleted = "Y";
  }

  isActive(): boolean {
    return this.isDeleted === "N";
  }
}
