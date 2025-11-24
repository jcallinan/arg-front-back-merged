import { mapFlatFile, padString, padInteger, padDecimal } from "@src/shared/utils/flatfiles-slicers.utils";
import { ApPeriodEndEntity, RecordA, RecordB, RecordT } from "../../domain/entities/ap-period-end.entity";

type FieldDef = {
  field: string;
  startFrom: number;
  startTo: number;
  type: StringConstructor | NumberConstructor | "decimal";
  length: () => number;
};

export class ApPeriodEndMapper {

  static toModel(payload: ReturnType<ApPeriodEndEntity['createRecordA'] | ApPeriodEndEntity['createRecordB'] | ApPeriodEndEntity['createRecordT']>, recordFormat: FieldDef[]): string {
    // Find the maximum end position to determine total record length
    let maxEndPosition = 0;
    for (const fieldDef of Object.values(recordFormat)) {
      if (fieldDef.startTo > maxEndPosition) {
        maxEndPosition = fieldDef.startTo;
      }
    }

    // Create an array of spaces with the total record length
    const recordArray = new Array(maxEndPosition).fill(' ');

    // Place each field at its exact position
    for (const [key, fieldDef] of Object.entries(recordFormat)) {
      const length = fieldDef.length();
      const value = payload[key];
      let formattedValue: string;

      if (fieldDef.type === String) {
        formattedValue = padString(value, length);
      } else if (fieldDef.type === "decimal") {
        formattedValue = padDecimal(value, length);
      } else if (fieldDef.type === Number) {
        formattedValue = padInteger(value, length);
      } else {
        // Default to string padding if type not explicitly handled
        formattedValue = padString(value, length);
      }

      // Place the formatted value at the correct position (startFrom is 1-based, array is 0-based)
      const startIndex = fieldDef.startFrom - 1;
      for (let i = 0; i < formattedValue.length && (startIndex + i) < recordArray.length; i++) {
        recordArray[startIndex + i] = formattedValue[i];
      }
    }

    return recordArray.join('');
  }


  static toEntity(text, schema): RecordA | RecordB | RecordT {
    return mapFlatFile(text, schema) as RecordA | RecordB | RecordT;
  }
}
