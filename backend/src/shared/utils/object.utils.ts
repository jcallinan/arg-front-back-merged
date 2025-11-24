// Converts camelCase or PascalCase into Title Case with spaces
function toTitleCaseWithSpaces(input: string): string {

  const key = input.includes(".") ? input.split(".").pop()! : input;

  const spaced = key.replace(/([a-z])([A-Z])/g, "$1 $2"); // insert spaces
  return spaced
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // capitalize
    .join("")
    .trim();
}

// Flattens an object and also converts keys to Title Case
export function flattenObject<T extends Record<string, any>>(obj: T): Record<string, any> {
  let result: Record<string, any> = {};

  function recurse(current: any) {
    for (let key in current) {
      const value = current[key];
      const newKey = toTitleCaseWithSpaces(key);

      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        // recurse into nested object
        recurse(value);
      } else {
        result[newKey] = value;
      }
    }
  }

  recurse(obj);
  return result;
}


