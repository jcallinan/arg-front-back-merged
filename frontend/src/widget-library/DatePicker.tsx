import React, { useRef, useEffect } from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import type { Dayjs } from "dayjs";
import type { CustomDatePickerProps } from "@type-definitions/accounts-payable.types";

dayjs.extend(customParseFormat);

// Helper function to convert 6-digit input to MM/DD/YY format
const convertSixDigitsToMMDDYY = (sixDigitInput: string): string => {
   const firstTwo = sixDigitInput.slice(0, 2);
   const middleTwo = sixDigitInput.slice(2, 4);
   const lastTwo = sixDigitInput.slice(4);
   
   const firstAsMonth = parseInt(firstTwo);
   const middleAsMonth = parseInt(middleTwo);
   const firstAsDay = parseInt(firstTwo);
   const middleAsDay = parseInt(middleTwo);
   
   // Check for MMDDYY format: first two are valid month (1-12) AND middle two are valid day (1-31)
   const isValidMMDDYY = (firstAsMonth >= 1 && firstAsMonth <= 12) && (middleAsDay >= 1 && middleAsDay <= 31);
   
   // Check for DDMMYY format: first two are valid day (1-31) AND middle two are valid month (1-12)
   const isValidDDMMYY = (firstAsDay >= 1 && firstAsDay <= 31) && (middleAsMonth >= 1 && middleAsMonth <= 12);
   
   if (isValidMMDDYY && !isValidDDMMYY) {
      // Only MMDDYY is valid
      return `${firstTwo}/${middleTwo}/${lastTwo}`;
   } else if (isValidDDMMYY && !isValidMMDDYY) {
      // Only DDMMYY is valid, convert to MM/DD/YY
      return `${middleTwo}/${firstTwo}/${lastTwo}`;
   } else if (isValidDDMMYY && isValidMMDDYY) {
      // Both formats are valid, use some heuristics
      // If first two > 12, it's definitely DDMMYY
      if (firstAsMonth > 12) {
         return `${middleTwo}/${firstTwo}/${lastTwo}`;
      }
      // If middle two > 12, it's definitely MMDDYY  
      if (middleAsMonth > 12) {
         return `${firstTwo}/${middleTwo}/${lastTwo}`;
      }
      // If both are <= 12, prefer interpretation based on context
      // For ambiguous cases like 090925, prefer MMDDYY if it results in current/future year
      const currentYear = new Date().getFullYear() % 100; // Get last 2 digits of current year
      const yearValue = parseInt(lastTwo);
      
      // If year seems like a recent year (within reasonable range), prefer MMDDYY
      if (yearValue >= (currentYear - 5) && yearValue <= (currentYear + 10)) {
         return `${firstTwo}/${middleTwo}/${lastTwo}`;
      } else {
         // Otherwise prefer DDMMYY interpretation
         return `${middleTwo}/${firstTwo}/${lastTwo}`;
      }
   } else {
      // Neither format is completely valid, default to MMDDYY
      return `${firstTwo}/${middleTwo}/${lastTwo}`;
   }
};

// Helper function to convert 8-digit input (MMDDYYYY) to MM/DD/YY format
const convertEightDigitsToMMDDYY = (eightDigitInput: string): string => {
   const mm = eightDigitInput.slice(0, 2);
   const dd = eightDigitInput.slice(2, 4);
   const yyyy = eightDigitInput.slice(4, 8);
   const yy = yyyy.slice(-2); // Take last 2 digits of year
   
   return `${mm}/${dd}/${yy}`;
};


const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
   name,
   value,
   onChange,
   onBlur,
   disabled,
   className = "",
   status,
}) => {
   const displayFormat = "MM/DD/YY";
   // Using any type for inputRef as Ant Design's DatePicker ref structure is complex
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const inputRef = useRef<any>(null);

   useEffect(() => {
      const handlePaste = (e: ClipboardEvent) => {
         e.preventDefault();

         const pastedText = e.clipboardData?.getData("text/plain").trim() || "";

         // Handle 8-digit format (MMDDYYYY)
         if (pastedText.length === 8 && /^\d{8}$/.test(pastedText)) {
            const formattedDate = convertEightDigitsToMMDDYY(pastedText);

            // Update the input value
            const target = e.target as HTMLInputElement;
            if (target) {
               target.value = formattedDate;
               target.setSelectionRange(
                  formattedDate.length,
                  formattedDate.length
               );
               target.dispatchEvent(new Event("input", { bubbles: true }));
            }

            onChange(name, formattedDate);
            return;
         }

         // Handle 6-digit format (MMDDYY or DDMMYY)
         if (pastedText.length === 6 && /^\d{6}$/.test(pastedText)) {
            const formattedDate = convertSixDigitsToMMDDYY(pastedText);

            // Update the input value
            const target = e.target as HTMLInputElement;
            if (target) {
               target.value = formattedDate;
               target.setSelectionRange(
                  formattedDate.length,
                  formattedDate.length
               );
               target.dispatchEvent(new Event("input", { bubbles: true }));
            }

            onChange(name, formattedDate);
            return;
         }

         // Handle MM/DD/YY format (e.g., "01/01/21")
         if (
            pastedText.length === 8 &&
            /^\d{2}\/\d{2}\/\d{2}$/.test(pastedText)
         ) {
            const formattedDate = pastedText;

            // Update the input value
            const target = e.target as HTMLInputElement;
            if (target) {
               target.value = formattedDate;
               target.setSelectionRange(
                  formattedDate.length,
                  formattedDate.length
               );
               target.dispatchEvent(new Event("input", { bubbles: true }));
            }

            onChange(name, formattedDate);
            return;
         }

         // For other formats, let the default paste work but process it
         setTimeout(() => {
            const target = e.target as HTMLInputElement;
            if (target && target.value) {
               const currentValue = target.value;
               const digitsOnly = currentValue.replace(/\D/g, "");
               if (digitsOnly.length === 8) {
                  const formattedDate = convertEightDigitsToMMDDYY(digitsOnly);
                  
                  target.value = formattedDate;
                  target.setSelectionRange(
                     formattedDate.length,
                     formattedDate.length
                  );
                  target.dispatchEvent(new Event("input", { bubbles: true }));
                  onChange(name, formattedDate);
               } else if (digitsOnly.length === 6) {
                  const formattedDate = convertSixDigitsToMMDDYY(digitsOnly);
                  
                  target.value = formattedDate;
                  target.setSelectionRange(
                     formattedDate.length,
                     formattedDate.length
                  );
                  target.dispatchEvent(new Event("input", { bubbles: true }));
                  onChange(name, formattedDate);
               }
            }
         }, 0);
      };

      // Find the input element and add paste listener
      const addPasteListener = () => {
         const host = inputRef.current?.nativeElement as
            | HTMLElement
            | undefined;
         const inputEl = host?.querySelector?.(
            "input"
         ) as HTMLInputElement | null;
         if (inputEl) {
            inputEl.removeEventListener("paste", handlePaste);
            inputEl.addEventListener("paste", handlePaste);
         }
      };

      // Add listener after a short delay to ensure the component is mounted
      const timer = setTimeout(addPasteListener, 100);

      return () => {
         clearTimeout(timer);
         const host = inputRef.current?.nativeElement as
            | HTMLElement
            | undefined;
         const inputEl = host?.querySelector?.(
            "input"
         ) as HTMLInputElement | null;
         if (inputEl) {
            inputEl.removeEventListener("paste", handlePaste);
         }
      };
   }, [name, onChange]);

   // Parse date string to dayjs object, handling both MM/DD/YY and DD/MM/YY formats
   const parseDate = (input: string): Dayjs | null => {
      if (!input) return null;

      // First try to parse as MM/DD/YY format
      let parsed = dayjs(input, displayFormat, true);
      if (parsed.isValid()) return parsed;

      // If that fails, try DD/MM/YY format (common API format)
      parsed = dayjs(input, "DD/MM/YY", true);
      if (parsed.isValid()) return parsed;

      if (input.length === 8 && /^\d{8}$/.test(input)) {
         const month = input.substring(0, 2);
         const day = input.substring(2, 4);
         const year = input.substring(6, 8); // Take last 2 digits of year
         const formattedDate = `${month}/${day}/${year}`;
         parsed = dayjs(formattedDate, displayFormat, true);
         if (parsed.isValid()) return parsed;
      }

      if (input.length === 6 && /^\d{6}$/.test(input)) {
         const month = input.substring(0, 2);
         const day = input.substring(2, 4);
         const year = input.substring(4, 6);
         const formattedDate = `${month}/${day}/${year}`;
         parsed = dayjs(formattedDate, displayFormat, true);
         if (parsed.isValid()) return parsed;
      }

      // If all fail, try other common formats
      const formats = ["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"];
      for (const format of formats) {
         parsed = dayjs(input, format, true);
         if (parsed.isValid()) return parsed;
      }

      return null;
   };

   // Custom onChange handler that bypasses Ant Design's validation
   const handleCustomChange = (
      date: Dayjs | null,
      dateString: string | string[]
   ) => {
      // Handle clear functionality - when user clicks clear button or clears all content
      if (
         !date &&
         (!dateString || dateString === "" || dateString === "undefined")
      ) {
         onChange(name, "");
         return;
      }

      // Priority 1: If we have a valid dayjs object (from dropdown selection), use it
      if (date && date.isValid()) {
         const formattedDate = date.format(displayFormat);
         onChange(name, formattedDate);
         return;
      }

      // Priority 2: Process dateString for manual input
      const dateStr = Array.isArray(dateString) ? dateString[0] : dateString;

      // Handle empty or invalid dateString
      if (!dateStr || dateStr === "" || dateStr === "undefined") {
         onChange(name, "");
         return;
      }

      // Check if this looks like a paste (8 digits without slashes)
      if (dateStr.length === 8 && /^\d{8}$/.test(dateStr)) {
         const formattedDate = convertEightDigitsToMMDDYY(dateStr);
         
         onChange(name, formattedDate);
         return;
      }

      // Check if this looks like a paste (6 digits without slashes)
      if (dateStr.length === 6 && /^\d{6}$/.test(dateStr)) {
         const formattedDate = convertSixDigitsToMMDDYY(dateStr);
         
         onChange(name, formattedDate);
         return;
      }

      // Handle MM/DD/YY format with slashes (e.g., "01/01/21")
      if (dateStr.length === 8 && /^\d{2}\/\d{2}\/\d{2}$/.test(dateStr)) {
         onChange(name, dateStr);
         return;
      }

      // Also check for 8 or 6 digits in the middle of longer strings (common with paste)
      const digitsOnly = dateStr.replace(/\D/g, "");
      if (digitsOnly.length === 8) {
         const formattedDate = convertEightDigitsToMMDDYY(digitsOnly);
         
         onChange(name, formattedDate);
         return;
      } else if (digitsOnly.length === 6) {
         const formattedDate = convertSixDigitsToMMDDYY(digitsOnly);
         
         onChange(name, formattedDate);
         return;
      }

      // Auto-format the input if it's just digits
      const digitsOnlyForFormatting = dateStr.replace(/\D/g, "");
      let formattedValue = dateStr;

      if (digitsOnlyForFormatting.length === 2) {
         // MM/
         formattedValue = `${digitsOnlyForFormatting}/`;
      } else if (
         digitsOnlyForFormatting.length > 2 &&
         digitsOnlyForFormatting.length <= 4
      ) {
         // MM/DD
         formattedValue = `${digitsOnlyForFormatting.slice(
            0,
            2
         )}/${digitsOnlyForFormatting.slice(2)}`;
      } else if (digitsOnlyForFormatting.length === 8) {
         // Handle 8-digit input (MMDDYYYY) - convert to MM/DD/YY
         const mm = digitsOnlyForFormatting.slice(0, 2);
         const dd = digitsOnlyForFormatting.slice(2, 4);
         const yyyy = digitsOnlyForFormatting.slice(4, 8);
         const yy = yyyy.slice(-2); // Take last 2 digits of year
         formattedValue = `${mm}/${dd}/${yy}`;
      } else if (digitsOnlyForFormatting.length > 4 && digitsOnlyForFormatting.length !== 8) {
         // MM/DD/YY for 6-digit or other formats
         formattedValue = `${digitsOnlyForFormatting.slice(
            0,
            2
         )}/${digitsOnlyForFormatting.slice(
            2,
            4
         )}/${digitsOnlyForFormatting.slice(4)}`;
      }

      // Update with formatted value
      onChange(name, formattedValue);
   };

   // Handle keydown events with simple filtering
   const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
      // Handle backspace and delete keys directly
      if (e.key === 'Backspace' || e.key === 'Delete') {
         const target = e.target as HTMLInputElement;
         
         // Use setTimeout to check the value after the key event is processed
         setTimeout(() => {
            const newValue = target.value;
            if (!newValue || newValue.trim() === "") {
               onChange(name, "");
            }
         }, 0);
         return;
      }
      // Allow other navigation keys and shortcuts (Arrow keys, Tab, etc.)
      if (e.key.length > 1 || e.ctrlKey || e.metaKey) {
         return;
      }

      // Only allow numbers and '/'
      if (!/[0-9/]/.test(e.key)) {
         e.preventDefault();
         return;
      }

      const target = e.target as HTMLInputElement;
      const currentValue = target.value;

      // Predict next typed value (do not block the key press)
      const predictedValue = /[0-9/]/.test(e.key)
         ? currentValue + e.key
         : currentValue;

      const nextDigits = predictedValue.replace(/\D/g, "").slice(0, 8); // Allow up to 8 digits

      let formattedNext = predictedValue;
      if (nextDigits.length === 2) {
         formattedNext = `${nextDigits}/`;
      } else if (nextDigits.length > 2 && nextDigits.length <= 4) {
         formattedNext = `${nextDigits.slice(0, 2)}/${nextDigits.slice(2)}`;
      } else if (nextDigits.length === 8) {
         // Handle 8-digit input (MMDDYYYY) - convert to MM/DD/YY
         const mm = nextDigits.slice(0, 2);
         const dd = nextDigits.slice(2, 4);
         const yyyy = nextDigits.slice(4, 8);
         const yy = yyyy.slice(-2); // Take last 2 digits of year
         formattedNext = `${mm}/${dd}/${yy}`;
      } else if (nextDigits.length > 4 && nextDigits.length !== 8) {
         formattedNext = `${nextDigits.slice(0, 2)}/${nextDigits.slice(
            2,
            4
         )}/${nextDigits.slice(4)}`;
      }

      // Apply immediately after AntD processes this key
      setTimeout(() => {
         const host = inputRef.current?.nativeElement as
            | HTMLElement
            | undefined;
         const inputEl = host?.querySelector?.(
            "input"
         ) as HTMLInputElement | null;
         if (!inputEl) return;

         if (inputEl.value !== formattedNext) {
            inputEl.value = formattedNext;
            try {
               inputEl.setSelectionRange(
                  formattedNext.length,
                  formattedNext.length
               );
            } catch {}
            inputEl.dispatchEvent(new Event("input", { bubbles: true }));
            onChange(name, formattedNext);
         }
      }, 0);
   };

   // Handle input events for better paste support and clearing
   const handleInput = (e: React.FormEvent<HTMLElement>) => {
      const target = e.target as HTMLInputElement;
      const value = target.value;

      // Handle empty input - clear the value
      if (!value || value === "" || value.trim() === "") {
         onChange(name, "");
         return;
      }

      // Handle partial clearing - if user backspaced to less than a valid date
      const digitsOnly = value.replace(/\D/g, "");
      if (digitsOnly.length < 6 && digitsOnly.length > 0) {
         return;
      }

      // Don't process input if it looks like a valid MM/DD/YY format (likely from dropdown)
      if (value.length === 8 && /^\d{2}\/\d{2}\/\d{2}$/.test(value)) {
         // This is likely from dropdown selection, don't interfere
         return;
      }

      // Check for 8-digit or 6-digit format in the input
      if (value && value.length >= 6) {
         const digitsOnly = value.replace(/\D/g, "");
         if (digitsOnly.length === 8) {
            const formattedDate = convertEightDigitsToMMDDYY(digitsOnly);

            // Only update if the current value is different from formatted
            if (value !== formattedDate) {
               target.value = formattedDate;
               target.setSelectionRange(
                  formattedDate.length,
                  formattedDate.length
               );
               onChange(name, formattedDate);
            }
         } else if (digitsOnly.length === 6) {
            const formattedDate = convertSixDigitsToMMDDYY(digitsOnly);

            // Only update if the current value is different from formatted
            if (value !== formattedDate) {
               target.value = formattedDate;
               target.setSelectionRange(
                  formattedDate.length,
                  formattedDate.length
               );
               onChange(name, formattedDate);
            }
         }
      }
   };

   // Check if value is zero or falsy, show empty string
   const shouldShowEmpty = !value || value === "0";

  // Handle blur event
  const handleBlur = () => {
     // On blur, if the visible input is not a valid date, hard-clear the value
     try {
        const host = inputRef.current?.nativeElement as HTMLElement | undefined;
        const inputEl = host?.querySelector?.("input") as HTMLInputElement | null;
        const currentText = (inputEl?.value || "").trim();

        // If there is text but it cannot be parsed into a valid date, clear it
        if (currentText && !parseDate(currentText)) {
           onChange(name, "");
        }
     } catch {}

     if (onBlur) {
        onBlur(name, value || "");
     }
  };

   const datePickerClassName = `custom-input ${className}`;
   const statusClass =
      status === "error"
         ? "ant-picker-status-error"
         : status === "warning"
         ? "ant-picker-status-warning"
         : "";

   return (
      <DatePicker
         ref={inputRef}
         value={shouldShowEmpty ? null : parseDate(value)}
         onChange={handleCustomChange}
         onBlur={handleBlur}
         format={displayFormat}
         placeholder="MM/DD/YY"
         style={{ width: "100%" }}
         disabled={disabled}
         className={`custom-input${className} ${datePickerClassName} ${statusClass}`.trim()}
         status={status}
         onKeyDown={handleKeyDown}
         onInput={handleInput}
         inputReadOnly={false}
         allowClear={true}
         showToday={false}
      />
   );
};

export default CustomDatePicker;
