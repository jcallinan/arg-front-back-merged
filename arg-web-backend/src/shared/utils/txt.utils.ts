export function generateTxtFile(
    data: any[],
    columnMap?: Record<string, string>
  ): Buffer {
    // If we have a columnMap, use DB column names as keys
    const lines = data.map((row) => {
      if (columnMap) {
        // Map each entity property → DB column
        const mapped: Record<string, any> = {};
        for (const [entityKey, dbColumn] of Object.entries(columnMap)) {
          mapped[dbColumn] = row[entityKey];
        }
        // Join values with | or space (choose delimiter)
        return Object.values(mapped).join("|");
      }
  
      // Fallback → join raw object values
      return Object.values(row).join("|");
    });
  
    return Buffer.from(lines.join("\n"), "utf-8");
  }
  