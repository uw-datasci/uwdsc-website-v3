interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  label?: string;
}

export function StepIndicator({
  currentStep,
  totalSteps,
  label = "CXC 2026",
}: StepIndicatorProps) {
  // for extra step number validation
  const stepNumber = currentStep > totalSteps ? totalSteps : currentStep;
  return (
    <div className="flex flex-col gap-10 w-full">
      <div className="flex flex-col gap-10">
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-light">
          Step {stepNumber}
        </h2>
        {/* Step Progress Bars */}
        <div className="flex gap-2">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`h-1 flex-1 transition-colors duration-300 ${
                index < stepNumber ? "bg-white" : "bg-gray-600"
              }`}
            />
          ))}
        </div>
      </div>
      <p className="text-lg md:text-3xl">{label}</p>
    </div>
  );
}
