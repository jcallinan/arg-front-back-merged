export class SalesAnalysisMisc {
  isDeleted!: string;
  companyNo!: number;
  customerNo!: number;
  invoiceNo!: number;
  shipToNo!: number;
  salesman!: number;
  invoiceDateYmd!: number;
  miscQuantity!: number;
  filler!: string;
  miscAmount!: number;
  filler1!: string;
  itemBlank!: string;
  typeMCR!: string;
  orderNo!: number;
  orderSeqNo!: number;
  shipDateYmd!: number;
  filler2!: string;
  time!: string;
  filler3!: string;
  miscType!: string;
  filler4!: string;
  filler5!: string;
  inventoryState!: string;
  filler6!: string;
  miscCode!: string;
  filler7!: string;
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
  filler8!: string;
  carrierCd!: string;
  filler9!: string;
  authorizedInitials!: string;
  userId!: string;
  separateFreighyNY!: string;
  filler10!: string;
  invoiceDateYmd8!: number;
  shipDateYmd8!: number;
  multiLoad!: string;
  distributorOrderNo!: number;
  distribShipOrderNo!: number;
  distribPurchAuthIni!: string;
  memoCustNo!: number;
  memoCustShipToNo!: number;
  filler11!: string;
  billedCustOrderNo!: number;
  billedCustMemoOrdN!: number;
  termsSplitCd!: string;
  billedCustNo!: number;
  custOwnedProduct!: string;
  shippingReferenceNo!: number;
  exportCode!: string;
  orderYN!: string;
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
  overrideTaxesYN!: string;
  description!: string;
  origOrderNumber!: number;
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
  filler12!: string;

  constructor(partial: Partial<SalesAnalysisMisc>) {
    Object.assign(this, partial);
  }

  static create(partial: Partial<SalesAnalysisMisc>): SalesAnalysisMisc {
    return new SalesAnalysisMisc(partial);
  }

  update(partial: Partial<SalesAnalysisMisc>): void {
    Object.assign(this, partial);
  }

  markAsDeleted(): void {
    this.isDeleted = "Y";
  }

  isActive(): boolean {
    return this.isDeleted === "N";
  }
}
