export function padDecimal(numStr: string | number, length: number, decimalPosition = 2): string {
  // Ensure the input is a string
  const numString = String(numStr ?? '0');

  // Split the integer and decimal parts
  const [integer, decimal = ''] = numString.split('.');

  // Ensure there are exactly 'decimalPosition' digits after the decimal point
  const paddedDecimal = decimal.padEnd(decimalPosition, '0').slice(0, decimalPosition);

  // Combine integer and decimal without the dot
  const combined = integer + paddedDecimal;

  // Add leading zeros (left padding)
  return combined.padStart(length, '0');
}

export function padString(value: string | null | undefined, length: number): string {
  const strValue = String(value ?? '');

  const formattedValue = strValue.length > length ? strValue.slice(0, length) : strValue;

  return formattedValue.padEnd(length, ' ');
}

export function padInteger(value: number | null | undefined, length: number): string {
  if (value === null || value === undefined) {
    return '0'.repeat(length);
  }

  let strValue = Math.abs(value).toString();

  // If the value is longer than the specified length, truncate it.
  if (strValue.length > length) {
    strValue = strValue.slice(-length);
  }

  // Add leading zeros to match the required length.
  return strValue.padStart(length, '0');
}


export function mapFlatFile(text, schema) {
  const result = {};
  for (let key in schema) {
    let decimalPosition = 2
    const { startFrom, startTo, type } = schema[key];
    let rawValue = text.substring(startFrom - 1, startTo); // adjust index (1-based → 0-based)
    rawValue = rawValue.trim(); // remove spaces

    // Cast to type
    if (type === Number) {
      result[key] = rawValue ? Number(rawValue) : null;
    }
    else if (type === "decimal") {
      // Handle decimals stored without a dot
      const intPart = rawValue.slice(0, rawValue.length - decimalPosition) || "0";
      const decPart = rawValue.slice(-decimalPosition).padEnd(decimalPosition, "0");
      result[key] = Number(`${intPart}.${decPart}`);
    }
    else {
      result[key] = rawValue;
    }
  }
  return result;
}

export function calculateLength(startFrom, startTo) {
  return startTo - startFrom + 1;
}