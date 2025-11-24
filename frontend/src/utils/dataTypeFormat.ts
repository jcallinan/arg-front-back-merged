export const toNumberOrUndefined = (val: string) => {
  const num = Number(val);
  return isNaN(num) ? undefined : num;
};

export const toStringOrUndefined = (val: string) => {
  const trimmed = val?.trim();
  return trimmed ? trimmed : undefined;
};