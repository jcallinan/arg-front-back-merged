import React from "react";
import type {
   StepperItem,
   StepFormProps,
} from "@type-definitions/accounts-payable.types";
import Stepper from "@widget-library/Stepper";

const StepForm: React.FC<StepFormProps> = ({
   current,
   items,
   size = "default",
   children,
   className,
   dynamicDescriptions = {},
}) => {
   const enhancedItems: StepperItem[] = items.map(
      ({ descriptionKey, className, description, title }) => {
         const isLineItem = descriptionKey === "lineItemDetails";
         const isEntryHeader = descriptionKey === "entryHeaderTotal";

         if (!isLineItem && !isEntryHeader) {
            return { title, className, description };
         }

         const raw = `${
            dynamicDescriptions[descriptionKey] ?? description ?? ""
         }`;
         const amounts = raw
            .replace(/\r/g, "")
            .replace(/\n+/g, " ")
            .replace(/^\s*Item\s*:?\s*/i, "")
            .trim();

         if (isLineItem) {
            const titleWithItem = /\bItem\b/i.test(String(title))
               ? title
               : `${title} Item`;

            return {
               title: titleWithItem,
               className: "line-item-step",
               description: amounts ? (
                  <span className="stepper-nowrap">{amounts}</span>
               ) : undefined,
            };
         }

         if (isEntryHeader) {
            return {
               title,
               className,
               description: amounts ? (
                  <span className="stepper-nowrap">{amounts}</span>
               ) : undefined,
            };
         }

         return { title, className, description };
      }
   );

   const stepperClassName = `custom-step center-two-steps${
      className ? ` ${className}` : ""
   }`;

   // Force a predictable class on the container to scope styles reliably
   const containerClassName = className
      ? `${className} stepform-container`
      : "stepform-container";

   return (
      <div className={containerClassName}>
         <Stepper
            current={current}
            size={size === "small" ? "small" : "default"}
            items={enhancedItems}
            className={stepperClassName}
         />
         {children && <div className="step-content">{children}</div>}
      </div>
   );
};

export default StepForm;
