import React from 'react';

const StepIndicator = ({ currentStep, totalSteps = 2, className = "" }) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isActive = currentStep >= stepNumber;
          
          return (
            <div key={stepNumber} className="flex-1">
              <div 
                className={`
                  h-1 transition-all duration-300
                  ${isActive ? 'bg-yellow-400' : 'bg-gray-600'}
                `}
              />
              <div className="text-center mt-2">
                <span className="text-sm text-gray-400">
                  Step {stepNumber}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;