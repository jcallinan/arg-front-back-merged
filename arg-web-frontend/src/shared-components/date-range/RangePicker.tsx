import React, { useRef, useEffect } from "react";
import { DatePicker } from "antd";
import type { GetProps } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import type { Dayjs } from "dayjs";

dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

interface CustomRangePickerProps
   extends Omit<
      RangePickerProps,
      "disabledDate" | "showTime" | "format" | "value" | "onChange"
   > {
   label?: string;
   value?: [Dayjs | null, Dayjs | null] | null;
   onChange?: (
      dates: [Dayjs | null, Dayjs | null] | null,
      dateStrings: [string, string]
   ) => void;
}

// Helper function to convert 6-digit input to MM/DD/YY format
const convertSixDigitsToMMDDYY = (sixDigitInput: string): string => {
   const firstTwo = sixDigitInput.slice(0, 2);
   const middleTwo = sixDigitInput.slice(2, 4);
   const lastTwo = sixDigitInput.slice(4);
   
   const firstAsMonth = parseInt(firstTwo);
   const middleAsMonth = parseInt(middleTwo);
   const firstAsDay = parseInt(firstTwo);
   const middleAsDay = parseInt(middleTwo);
   
   const isValidMMDDYY = (firstAsMonth >= 1 && firstAsMonth <= 12) && (middleAsDay >= 1 && middleAsDay <= 31);
   const isValidDDMMYY = (firstAsDay >= 1 && firstAsDay <= 31) && (middleAsMonth >= 1 && middleAsMonth <= 12);
   
   if (isValidMMDDYY && !isValidDDMMYY) {
      return `${firstTwo}/${middleTwo}/${lastTwo}`;
   } else if (isValidDDMMYY && !isValidMMDDYY) {
      return `${middleTwo}/${firstTwo}/${lastTwo}`;
   } else if (isValidDDMMYY && isValidMMDDYY) {
      if (firstAsMonth > 12) return `${middleTwo}/${firstTwo}/${lastTwo}`;
      if (middleAsMonth > 12) return `${firstTwo}/${middleTwo}/${lastTwo}`;
      
      const currentYear = new Date().getFullYear() % 100;
      const yearValue = parseInt(lastTwo);
      
      if (yearValue >= (currentYear - 5) && yearValue <= (currentYear + 10)) {
         return `${firstTwo}/${middleTwo}/${lastTwo}`;
      } else {
         return `${middleTwo}/${firstTwo}/${lastTwo}`;
      }
   }
   return `${firstTwo}/${middleTwo}/${lastTwo}`;
};

// Helper function to convert 8-digit input (MMDDYYYY) to MM/DD/YY format
const convertEightDigitsToMMDDYY = (eightDigitInput: string): string => {
   const mm = eightDigitInput.slice(0, 2);
   const dd = eightDigitInput.slice(2, 4);
   const yy = eightDigitInput.slice(6, 8);
   return `${mm}/${dd}/${yy}`;
};

const CustomRangePicker: React.FC<CustomRangePickerProps> = ({
   label,
   value,
   onChange,
   ...props
}) => {
   const displayFormat = "MM/DD/YY";
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const inputRef = useRef<any>(null);

   // Parse date string to dayjs object
   const parseDate = (input: string): Dayjs | null => {
      if (!input) return null;

      const parsed = dayjs(input, displayFormat, true);
      if (parsed.isValid()) return parsed;

      if (input.length === 6 && /^\d{6}$/.test(input)) {
         return dayjs(convertSixDigitsToMMDDYY(input), displayFormat, true);
      }
      if (input.length === 8 && /^\d{8}$/.test(input)) {
         return dayjs(convertEightDigitsToMMDDYY(input), displayFormat, true);
      }

      return null;
   };

   // Update date value based on which input
   const updateDate = (target: HTMLInputElement, formattedDate: string) => {
      const parsed = parseDate(formattedDate);
      if (!parsed || !onChange) return;

      const pickerWrapper = target.closest(".ant-picker-range");
      const inputs = pickerWrapper?.querySelectorAll("input");
      const isStartInput = inputs && target === inputs[0];

      const newValue: [Dayjs | null, Dayjs | null] = isStartInput
         ? [parsed, value?.[1] || null]
         : [value?.[0] || null, parsed];
      
      onChange(newValue, [
         newValue[0]?.format(displayFormat) || "",
         newValue[1]?.format(displayFormat) || "",
      ]);
   };

   useEffect(() => {
      const handlePaste = (e: ClipboardEvent) => {
         e.preventDefault();
         const pastedText = e.clipboardData?.getData("text/plain").trim() || "";
         const target = e.target as HTMLInputElement;
         
         const digitsOnly = pastedText.replace(/\D/g, "");
         let formattedDate = pastedText;
         
         if (digitsOnly.length === 6) {
            formattedDate = convertSixDigitsToMMDDYY(digitsOnly);
         } else if (digitsOnly.length === 8) {
            formattedDate = convertEightDigitsToMMDDYY(digitsOnly);
         }

         target.value = formattedDate;
         target.setSelectionRange(formattedDate.length, formattedDate.length);
         target.dispatchEvent(new Event("input", { bubbles: true }));
         updateDate(target, formattedDate);
      };

      const timer = setTimeout(() => {
         const host = inputRef.current?.nativeElement as HTMLElement | undefined;
         const inputEls = host?.querySelectorAll?.("input") as NodeListOf<HTMLInputElement> | null;
         inputEls?.forEach((inputEl) => {
            inputEl.removeEventListener("paste", handlePaste);
            inputEl.addEventListener("paste", handlePaste);
         });
      }, 100);

      return () => {
         clearTimeout(timer);
         const host = inputRef.current?.nativeElement as HTMLElement | undefined;
         const inputEls = host?.querySelectorAll?.("input") as NodeListOf<HTMLInputElement> | null;
         inputEls?.forEach((inputEl) => inputEl.removeEventListener("paste", handlePaste));
      };
   }, [value, onChange]);

   // Handle keydown - auto-format as typing
   const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
      if (e.key.length > 1 || e.ctrlKey || e.metaKey) return;
      if (!/[0-9/]/.test(e.key)) {
         e.preventDefault();
         return;
      }

      const target = e.target as HTMLInputElement;
      const currentValue = target.value;
      const predictedValue = currentValue + e.key;
      const nextDigits = predictedValue.replace(/\D/g, "").slice(0, 8);

      let formattedNext = predictedValue;
      if (nextDigits.length === 2) {
         formattedNext = `${nextDigits}/`;
      } else if (nextDigits.length > 2 && nextDigits.length <= 4) {
         formattedNext = `${nextDigits.slice(0, 2)}/${nextDigits.slice(2)}`;
      } else if (nextDigits.length === 8) {
         formattedNext = convertEightDigitsToMMDDYY(nextDigits);
      } else if (nextDigits.length > 4) {
         formattedNext = `${nextDigits.slice(0, 2)}/${nextDigits.slice(2, 4)}/${nextDigits.slice(4)}`;
      }

      setTimeout(() => {
         if (target.value !== formattedNext) {
            target.value = formattedNext;
            target.setSelectionRange(formattedNext.length, formattedNext.length);
            target.dispatchEvent(new Event("input", { bubbles: true }));
         }
      }, 0);
   };

   // Handle blur - save date when leaving input
   const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      const target = event.target;
      const inputValue = target.value;
      const digitsOnly = inputValue.replace(/\D/g, "");
      
      if (digitsOnly.length === 6 || digitsOnly.length === 8) {
         const formattedDate = digitsOnly.length === 6 
            ? convertSixDigitsToMMDDYY(digitsOnly)
            : convertEightDigitsToMMDDYY(digitsOnly);
         
         if (inputValue !== formattedDate) {
            target.value = formattedDate;
         }
         updateDate(target, formattedDate);
      }
   };

   return (
      <div className="custom-range-picker-wrapper">
         {label && <p className="sub-title">{label}</p>}
         <RangePicker
            ref={inputRef}
            format={displayFormat}
            value={value}
            onChange={onChange}
            onBlur={handleBlur as any}
            onKeyDown={handleKeyDown}
            inputReadOnly={false}
            allowEmpty={[true, true]}
            allowClear={true}
            showToday={false}
            {...props}
         />
      </div>
   );
};

export default CustomRangePicker;
