export const padNumber = (
   value: string | number = "",
   length: number = 9,
   padValue: string = "0"
): string => {
   return value.toString().padStart(length, padValue);
};

export default padNumber;
