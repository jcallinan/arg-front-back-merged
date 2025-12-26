export class Apdate {
  constructor(
    public readonly companyNo: number,
    public readonly calculatedDate: number,
    public readonly newDate: number,
    public readonly isDeleted: string = "N",
  ) {}
}
