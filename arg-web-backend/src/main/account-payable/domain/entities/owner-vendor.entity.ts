export class OwnerVendorEntity {
  public ownerNo!: number;
  public vendorNo!: number;
  public isDeleted!: string;
  public filler!: string;

  constructor(partial: Partial<OwnerVendorEntity>) {
    Object.assign(this, partial);
  }

  static create(partial: Partial<OwnerVendorEntity>): OwnerVendorEntity {
    return new OwnerVendorEntity(partial);
  }

  update(partial: Partial<OwnerVendorEntity>): void {
    Object.assign(this, partial);
  }
}
