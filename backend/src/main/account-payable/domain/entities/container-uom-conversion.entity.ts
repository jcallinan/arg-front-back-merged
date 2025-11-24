export class ContainerUnitofMeasureConversion {
  isDeleted!: string;
  companyNo!: number;
  productCode!: string;
  containerCode!: string;
  unitOfMeasure!: string;
  operandMultDiv!: string;
  conversionFactor!: number;
  hazMatYN!: string;
  imsIssueUnitOfMeas!: string;
  freightExpenseGl!: number;
  filler!: string;

  constructor(partial: Partial<ContainerUnitofMeasureConversion>) {
    Object.assign(this, partial);
  }

  static create(partial: Partial<ContainerUnitofMeasureConversion>): ContainerUnitofMeasureConversion {
    return new ContainerUnitofMeasureConversion(partial);
  }

  update(partial: Partial<ContainerUnitofMeasureConversion>): void {
    Object.assign(this, partial);
  }

  markAsDeleted(): void {
    this.isDeleted = "Y";
  }

  isActive(): boolean {
    return this.isDeleted === "N";
  }
}
