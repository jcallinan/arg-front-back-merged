export interface GenerateReportInterface {
  /**
   * Fetch all rows from the table defined in the report config
   * @param config - Report mapping config (table, schema, etc.)
   */
  findAll(config: { model: any; entity: any }): Promise<any[]>;
}
