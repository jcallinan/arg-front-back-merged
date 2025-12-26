// Helper functions to map between API values and URL-friendly values for process types

/**
 * Maps API value to URL-friendly lowercase value
 * @param apiValue - API value like 'NORMAL', 'ARGLMS', etc.
 * @returns URL-friendly value like 'normal', 'arglms', etc.
 */
export const mapApiValueToUrl = (apiValue: string): string => {
  const mapping: Record<string, string> = {
    NORMAL: "normal",
    ARGLMS: "arglms",
    PAPER: "paper",
    FLEXI: "flexi",
    SOGAS: "sogas",
  };
  return mapping[apiValue] || apiValue.toLowerCase();
};

/**
 * Maps URL-friendly value to API value
 * @param urlValue - URL value like 'normal', 'arglms', etc.
 * @returns API value like 'NORMAL', 'ARGLMS', etc.
 */
export const mapUrlToApiValue = (urlValue: string): string => {
  const mapping: Record<string, string> = {
    normal: "NORMAL",
    arglms: "ARGLMS",
    paper: "PAPER",
    flexi: "FLEXI",
    sogas: "SOGAS",
  };
  return mapping[urlValue] || urlValue.toUpperCase();
};

/**
 * Gets the process type display label from API value
 * @param apiValue - API value like 'NORMAL', 'ARGLMS', etc.
 * @returns Display label like 'Normal', 'LMS', etc.
 */
export const getProcessTypeLabel = (apiValue: string): string => {
  const mapping: Record<string, string> = {
    NORMAL: "Normal",
    ARGLMS: "LMS",
    PAPER: "Paper",
    FLEXI: "Flexi",
    SOGAS: "SOGAS",
  };
  return mapping[apiValue] || apiValue;
};

/**
 * Gets the API value from display label
 * @param label - Display label like 'Normal', 'LMS', etc.
 * @returns API value like 'NORMAL', 'ARGLMS', etc.
 */
export const getApiValueFromLabel = (label: string): string => {
  const mapping: Record<string, string> = {
    Normal: "NORMAL",
    LMS: "ARGLMS",
    Paper: "PAPER",
    Flexi: "FLEXI",
    SOGAS: "SOGAS",
  };
  return mapping[label] || label;
};

/**
 * Gets all available process type mappings
 * @returns Array of process type mappings
 */
export const getAllProcessTypes = () => [
  { apiValue: "NORMAL", urlValue: "normal", label: "Normal" },
  { apiValue: "ARGLMS", urlValue: "arglms", label: "LMS" },
  { apiValue: "PAPER", urlValue: "paper", label: "Paper" },
  { apiValue: "FLEXI", urlValue: "flexi", label: "Flexi" },
  { apiValue: "SOGAS", urlValue: "sogas", label: "SOGAS" },
];
