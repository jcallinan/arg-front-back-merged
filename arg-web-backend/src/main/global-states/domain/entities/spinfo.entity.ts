export class SpInfo {
  reportName!: string;
  fieldKey!: string;
  fieldDescription!: string;
  fieldComponent!: string;
  fieldDataType!: string;
  fieldSequence!: number;
  variableType!: string;
  xmlMetadata!: string;
  storedProcedureName!: string;
  spSequence!: number;
  fieldLength!: string | null;
  isApiCall!: string;
  apiEndpoint!: string;
  status!: string;
  useCase!: string;
  constructor(partial: Partial<SpInfo>) {
    Object.assign(this, partial);
  }

  static create(partial: Partial<SpInfo>): SpInfo {
    return new SpInfo(partial);
  }

  update(partial: Partial<SpInfo>): void {
    Object.assign(this, partial);
  }
} 