export class GeneralSystemCompany {
  public fixedAssets!: string;
  public orderEntryInvoicing!: string;
  public salesAnalysis!: string;
  public inventory!: string;
  public purchaseOrder!: string;
  public billOfMaterial!: string;
  public jobShop!: string;
  public jobCost!: string;
  public filler1!: string;
  public multiWarehouseYn!: string;
  public thirteenAccountingPeriodsYn!: string;
  public fractionalQtyActive!: string;
  public apPostOverrideCode!: number;
  public arPostOverrideCode!: number;
  public faPostOverrideCode!: number;
  public glPostOverrideCode!: number;
  public companyNo!: number;
  public filler2!: string;
  constructor(partial: Partial<GeneralSystemCompany>) {
    Object.assign(this, partial);
  }

  static create(partial: Partial<GeneralSystemCompany>): GeneralSystemCompany {
    return new GeneralSystemCompany(partial);
  }

  update(partial: Partial<GeneralSystemCompany>): void {
    Object.assign(this, partial);
  }
}