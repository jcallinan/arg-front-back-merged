import { GeneralSystemEntity } from "../entities/general-system.entity";

export interface GeneralSystemInterface {
  findOne(
    tableType: string,
    tableCode?: string,
  ): Promise<GeneralSystemEntity | null>;

  findMultiple(
    requests: Array<{ tableType: string; tableCode: string }>,
  ): Promise<Map<string, GeneralSystemEntity>>;

  cacheAllGeneralSystem(): Promise<void>;
  findTableTypeAndCode(
    tableType: string,
    tableCode: string
  ): Promise<GeneralSystemEntity | null>;

  getDropdownlist(
    tableType: string,
    limit: number,
    offset: number
  ): Promise<{ rows: GeneralSystemEntity[]; count: number }>;
}
