import React from "react";
import { Steps } from "antd";
import type { StepperProps, StepperItem } from "@/types/accounts-payable.types";



const Stepper: React.FC<StepperProps> = ({
  current,
  titles,
  items,
  size = "small",
  className = "custom-step",
  labelPlacement = "vertical",
}) => {
  const computedItems: StepperItem[] = items ||
    titles?.map((t) => ({ title: t })) ||
    [];

  return (
    <Steps
      current={current}
      labelPlacement={labelPlacement}
      className={className}
      size={size}
      items={computedItems}
    />
  );
};

export default Stepper;
