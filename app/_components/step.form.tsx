import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import React from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";
import * as z from "zod";

type FormStepProps = {
  children: React.ReactNode;
  stepNumber: number;
};

const FormStep = ({ children, stepNumber }: FormStepProps) => {
  return <div className="w-full flex-1">{children}</div>;
};

const Step = ({ step, length, isActive }: { step: number; length: number; isActive: boolean }) => {
  switch (step) {
    case length:
      return <div>
          <Badge variant="outline" className={`rounded-full shrink-0 h-8 w-8 flex items-center justify-center ${isActive ? 'bg-primary text-primary-foreground' : ''}`}>
            {step}
          </Badge>
      </div>;
    default:
      return <div className="flex items-center">
          <Badge variant="outline" className={`shrink-0 rounded-full h-8 w-8 flex items-center justify-center ${isActive ? 'bg-primary text-primary-foreground' : ''}`}>
            {step}
          </Badge>
          <div className="w-full min-w-10 border-b border-gray-200" />
      </div>
  }
};

const Stepper = ({ currentStep, steps }: { currentStep: number; steps: number[] }) => {
  return (
    <div className="flex">
      {steps.map((step) => (
        <Step key={step} step={step} length={steps.length} isActive={step === currentStep} />
      ))}
    </div>
  );
};

type StepForm<T extends FieldValues> = {
  children: React.ReactNode;
  form: UseFormReturn<T>;
};

const StepForm = <T extends FieldValues>({ children, form }: StepForm<T>) => {
  const [currentStep, setCurrentStep] = React.useState(1);
  const steps = React.Children.toArray(children);
  const stepNumbers = Array.from({ length: steps.length }, (_, i) => i + 1);

  const getCurrentStepFields = () => {
    const currentChild = steps[currentStep - 1] as React.ReactElement;
    const formFields = React.Children.toArray(currentChild.props.children);
    return formFields.map((field: any) => field.props.name);
  };

  const isCurrentStepValid = () => {
    const currentFields = getCurrentStepFields();
    const formState = form.getValues();
    
    return currentFields.every((field) => {
      const value = formState[field];
      try {
        const fieldSchema = (form.formState.errors[field]?.type === 'too_small') ? 
          z.string().min(2) : z.string().min(1);
        fieldSchema.parse(value);
        return true;
      } catch {
        return false;
      }
    }) && !currentFields.some(field => form.formState.errors[field]);
  };

  return (
    <div className="space-y-4 flex flex-col items-center w-full flex-1">
      <Stepper steps={stepNumbers} currentStep={currentStep} />
      {steps[currentStep - 1]}
      <div className="flex justify-between mt-4 w-full">
        <Button
          variant="outline"
          type="button"
          size="sm"
          onClick={() => setCurrentStep(step => Math.max(1, step - 1))}
          disabled={currentStep === 1}
        >
          Previous
        </Button>
        <Button
          variant={currentStep === steps.length ? "default" : "outline"}
          size="sm"
          type={currentStep === steps.length ? "submit" : "button"}
          onClick={() => setCurrentStep(step => Math.min(steps.length, step + 1))}
          disabled={!isCurrentStepValid()}
        >
          {currentStep === steps.length ? "Submit" : "Next"}
        </Button>
      </div>
    </div>
  );
};

export { FormStep, StepForm };

