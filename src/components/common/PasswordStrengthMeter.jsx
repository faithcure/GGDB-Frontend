import React from 'react';
import { validatePassword } from '../../utils/validation';

const PasswordStrengthMeter = ({ password, className = "" }) => {
  const validation = validatePassword(password);
  
  if (!password) return null;
  
  const { strength, strengthText, strengthColor, feedback } = validation;
  
  // Create strength bars
  const bars = Array.from({ length: 6 }, (_, index) => (
    <div
      key={index}
      className={`h-1 rounded-full transition-all duration-300 ${
        index < strength
          ? strength <= 2
            ? 'bg-red-400'
            : strength <= 4
            ? 'bg-yellow-400'
            : strength <= 5
            ? 'bg-blue-400'
            : 'bg-green-400'
          : 'bg-gray-600'
      }`}
    />
  ));
  
  return (
    <div className={`mt-2 ${className}`}>
      {/* Strength bars */}
      <div className="grid grid-cols-6 gap-1 mb-2">
        {bars}
      </div>
      
      {/* Strength text */}
      <div className="flex items-center justify-between text-xs">
        <span className={`font-medium ${strengthColor}`}>
          {strengthText}
        </span>
        <span className="text-gray-400">
          Password strength
        </span>
      </div>
      
      {/* Feedback */}
      {feedback && feedback.length > 0 && strength < 4 && (
        <div className="mt-2 text-xs text-gray-400">
          <div className="font-medium mb-1">To improve strength:</div>
          <ul className="list-disc list-inside space-y-0.5">
            {feedback.slice(0, 3).map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthMeter;