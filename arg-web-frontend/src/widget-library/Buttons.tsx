import React, { useState } from "react";
import { Button } from "antd";
import type { CommonButtonProps } from "./widgetLibrary.types";

export const PrimaryButton: React.FC<CommonButtonProps> = ({
   name,
   label,
   onClick,
   disabled,
   loading,
   preload,
}) => {
   const [isPending, setIsPending] = useState(false);
   const handleClick = async () => {
      if (isPending) return;
      try {
         setIsPending(true);
         // If preloaders are provided, ensure they are loaded before executing the action
         if (preload) {
            const tasks = Array.isArray(preload) ? preload : [preload];
            for (const task of tasks) {
               try {
                  await task();
               } catch {
                  // ignore preload failure, still try to run onClick
               }
            }
         }
         await onClick?.();
      } finally {
         setIsPending(false);
      }
   };
   return (
      <Button
         type="primary"
         onClick={handleClick}
         data-name={name}
         disabled={disabled || isPending}
         loading={loading || isPending}
      >
         {label}
      </Button>
   );
};

export const DefaultButton: React.FC<CommonButtonProps> = ({
   name,
   label,
   onClick,
   icon,
   disabled,
   loading,
   preload,
}) => {
   const [isPending, setIsPending] = useState(false);
   const handleClick = async () => {
      if (isPending) return;
      try {
         setIsPending(true);
         if (preload) {
            const tasks = Array.isArray(preload) ? preload : [preload];
            for (const task of tasks) {
               try {
                  await task();
               } catch {}
            }
         }
         await onClick?.();
      } finally {
         setIsPending(false);
      }
   };
   return (
      <Button
         onClick={handleClick}
         data-name={name}
         icon={icon}
         className="ant-Button"
         disabled={disabled || isPending}
         loading={loading || isPending}
      >
         {label}
      </Button>
   );
};

export const DashedButton: React.FC<CommonButtonProps> = ({
   name,
   label,
   onClick,
   disabled,
   loading,
   preload,
}) => {
   const [isPending, setIsPending] = useState(false);
   const handleClick = async () => {
      if (isPending) return;
      try {
         setIsPending(true);
         if (preload) {
            const tasks = Array.isArray(preload) ? preload : [preload];
            for (const task of tasks) {
               try {
                  await task();
               } catch {}
            }
         }
         await onClick?.();
      } finally {
         setIsPending(false);
      }
   };
   return (
      <Button
         type="dashed"
         onClick={handleClick}
         data-name={name}
         disabled={disabled || isPending}
         loading={loading || isPending}
      >
         {label}
      </Button>
   );
};

export const TextButton: React.FC<CommonButtonProps> = ({
   name,
   label,
   onClick,
   disabled,
   loading,
   preload,
}) => {
   const [isPending, setIsPending] = useState(false);
   const handleClick = async () => {
      if (isPending) return;
      try {
         setIsPending(true);
         if (preload) {
            const tasks = Array.isArray(preload) ? preload : [preload];
            for (const task of tasks) {
               try {
                  await task();
               } catch {}
            }
         }
         await onClick?.();
      } finally {
         setIsPending(false);
      }
   };
   return (
      <Button
         type="text"
         onClick={handleClick}
         data-name={name}
         disabled={disabled || isPending}
         loading={loading || isPending}
      >
         {label}
      </Button>
   );
};

// src/components/widget-library/Buttons.tsx
export const CustomStyledButton: React.FC<CommonButtonProps> = ({
   name,
   label,
   onClick,
   icon,
   disabled,
   loading,
   preload,
}) => {
   const [isPending, setIsPending] = useState(false);
   const handleClick = async () => {
      if (isPending) return;
      try {
         setIsPending(true);
         if (preload) {
            const tasks = Array.isArray(preload) ? preload : [preload];
            for (const task of tasks) {
               try {
                  await task();
               } catch {}
            }
         }
         await onClick?.();
      } finally {
         setIsPending(false);
      }
   };
   return (
      <Button
         className="custom-styled-button"
         onClick={handleClick}
         data-name={name}
         icon={icon}
         disabled={disabled || isPending}
         loading={loading || isPending}
      >
         {label}
      </Button>
   );
};
