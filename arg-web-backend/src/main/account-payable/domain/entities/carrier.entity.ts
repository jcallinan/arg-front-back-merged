export class CarrierEntity {
  constructor(
    public readonly deleteCode: string,
    public readonly companyNo: number,
    public readonly carrierId: string,
    public readonly carrierName: string,
    public readonly ein: number,
    public readonly fuelfacsCarrierId: number,
    public readonly filler01: string,
  ) {}
}
