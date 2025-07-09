import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaCheck, FaTimes, FaExclamationTriangle } from 'react-icons/fa';

const FormField = ({
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  label,
  error,
  warning,
  success,
  required = false,
  disabled = false,
  autoComplete,
  suggestions = [],
  onSuggestionClick,
  children,
  className = "",
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);
  
  const isPassword = type === "password";
  const hasValue = value && value.length > 0;
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;
  
  // Determine field state
  const fieldState = error ? 'error' : warning ? 'warning' : success ? 'success' : 'default';
  
  const stateClasses = {
    error: 'border-red-500 focus:border-red-400',
    warning: 'border-yellow-500 focus:border-yellow-400',
    success: 'border-green-500 focus:border-green-400',
    default: 'border-gray-700 focus:border-yellow-400'
  };
  
  const stateIconColors = {
    error: 'text-red-400',
    warning: 'text-yellow-400',
    success: 'text-green-400',
    default: 'text-gray-400'
  };
  
  return (
    <div className={`relative ${className}`}>
      {/* Input container */}
      <div className="relative">
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          autoComplete={autoComplete}
          aria-label={label}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : warning ? `${name}-warning` : undefined}
          className={`
            w-full px-4 py-4 bg-gray-900/80 border rounded 
            focus:outline-none transition-all duration-200 text-white 
            placeholder-transparent peer disabled:opacity-50 disabled:cursor-not-allowed
            ${stateClasses[fieldState]}
            ${isPassword ? 'pr-12' : ''}
            ${(error || warning || success) ? 'pr-10' : ''}
          `}
          placeholder={placeholder}
          {...props}
        />
        
        {/* Floating label */}
        <label 
          className={`
            absolute left-4 transition-all duration-200 pointer-events-none
            ${focused || hasValue 
              ? 'top-1 text-xs' 
              : 'top-4 text-base'
            }
            ${focused 
              ? fieldState === 'error' ? 'text-red-400' : 
                fieldState === 'warning' ? 'text-yellow-400' :
                fieldState === 'success' ? 'text-green-400' : 'text-yellow-400'
              : 'text-gray-400'
            }
          `}
        >
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
        
        {/* Password visibility toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}
        
        {/* Status icon */}
        {(error || warning || success) && !isPassword && (
          <div className={`absolute right-4 top-1/2 -translate-y-1/2 ${stateIconColors[fieldState]}`}>
            {error && <FaTimes />}
            {warning && <FaExclamationTriangle />}
            {success && <FaCheck />}
          </div>
        )}
      </div>
      
      {/* Email suggestions */}
      {suggestions.length > 0 && focused && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50">
          <div className="p-2">
            <div className="text-xs text-gray-400 mb-2">Did you mean:</div>
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => onSuggestionClick && onSuggestionClick(suggestion)}
                className="w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-800 rounded transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Children (for additional components like password meter) */}
      {children}
      
      {/* Error message */}
      {error && (
        <div id={`${name}-error`} className="mt-2 flex items-center gap-2 text-red-400 text-xs">
          <FaTimes className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      {/* Warning message */}
      {warning && !error && (
        <div id={`${name}-warning`} className="mt-2 flex items-center gap-2 text-yellow-400 text-xs">
          <FaExclamationTriangle className="flex-shrink-0" />
          <span>{warning}</span>
        </div>
      )}
      
      {/* Success message */}
      {success && !error && !warning && (
        <div className="mt-2 flex items-center gap-2 text-green-400 text-xs">
          <FaCheck className="flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}
    </div>
  );
};

export default FormField;