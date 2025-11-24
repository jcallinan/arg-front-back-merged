import React from "react";
import "@/index.scss";
import Stepper from "@widget-library/Stepper";

interface PaymentStepperProps {
  currentStep: number;
  voucherType: string;
  stepTitles: string[];
}

const PaymentStepper: React.FC<PaymentStepperProps> = ({
  currentStep,
  stepTitles,
}) => {
  return (
    <div className="payment-stepper-wrapper">
      <Stepper current={currentStep} titles={stepTitles} />
    </div>
  );
};

export default PaymentStepper;
