/**
 * Domain entity for year-end process response data
 */
export class YearEndProcessResponse {
  message!: string;
  tableName?: string;
  dataCopied?: number;

  constructor(partial: Partial<YearEndProcessResponse>) {
    Object.assign(this, partial);
  }

  static create(partial: Partial<YearEndProcessResponse>): YearEndProcessResponse {
    return new YearEndProcessResponse(partial);
  }

  update(partial: Partial<YearEndProcessResponse>): void {
    Object.assign(this, partial);
  }
}
