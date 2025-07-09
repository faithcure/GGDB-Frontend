import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaTimes } from 'react-icons/fa';

const DateSelector = ({ 
  value = "", 
  onChange, 
  label = "Date", 
  required = false, 
  error, 
  warning,
  className = ""
}) => {
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [focused, setFocused] = useState(false);

  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" }
  ];

  // Generate years (from 1920 to current year)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1919 }, (_, i) => currentYear - i);

  // Generate days based on month and year
  const getDaysInMonth = (month, year) => {
    if (!month) return 31; // Default to 31 days if no month selected
    if (!year) return new Date(2024, month, 0).getDate(); // Use 2024 as default year
    return new Date(year, month, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(parseInt(month), parseInt(year));
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Parse initial value
  useEffect(() => {
    if (value) {
      const [yearPart, monthPart, dayPart] = value.split('-');
      setYear(yearPart || "");
      setMonth(monthPart || "");
      setDay(dayPart || "");
    }
  }, [value]);

  // Update parent when date changes
  useEffect(() => {
    if (day && month && year) {
      const dateString = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      onChange({ target: { name: 'dob', value: dateString } });
    } else if (!day && !month && !year) {
      onChange({ target: { name: 'dob', value: '' } });
    }
  }, [day, month, year]);

  const hasValue = day && month && year;
  const fieldState = error ? 'error' : warning ? 'warning' : 'default';
  
  const stateClasses = {
    error: 'border-red-500 focus:border-red-400',
    warning: 'border-yellow-500 focus:border-yellow-400',
    default: 'border-gray-700 focus:border-yellow-400'
  };

  return (
    <div className={`relative ${className}`}>
      {/* Date selector container */}
      <div className="relative">
        <div className={`
          w-full px-4 py-4 bg-gray-900/80 border rounded 
          transition-all duration-200 
          ${stateClasses[fieldState]}
        `}>
          <div className="grid grid-cols-3 gap-2">
            {/* Month */}
            <div className="relative">
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className="w-full bg-transparent text-white text-sm focus:outline-none appearance-none cursor-pointer pr-4"
              >
                <option value="" className="bg-gray-800 text-gray-400 py-3 text-sm">
                  Month
                </option>
                {months.map((m) => (
                  <option 
                    key={m.value} 
                    value={m.value} 
                    className="bg-gray-800 text-white py-3 text-sm hover:bg-yellow-400 hover:text-black"
                  >
                    {m.label}
                  </option>
                ))}
              </select>
              <FaChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
            </div>

            {/* Day */}
            <div className="relative">
              <select
                value={day}
                onChange={(e) => setDay(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className="w-full bg-transparent text-white text-sm focus:outline-none appearance-none cursor-pointer pr-4 disabled:text-gray-500 disabled:cursor-not-allowed"
                disabled={false}
              >
                <option value="" className="bg-gray-800 text-gray-400 py-3 text-sm">
                  Day
                </option>
                {days.map((d) => (
                  <option 
                    key={d} 
                    value={d.toString().padStart(2, '0')} 
                    className="bg-gray-800 text-white py-3 text-sm hover:bg-yellow-400 hover:text-black"
                  >
                    {d}
                  </option>
                ))}
              </select>
              <FaChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
            </div>

            {/* Year */}
            <div className="relative">
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className="w-full bg-transparent text-white text-sm focus:outline-none appearance-none cursor-pointer pr-4"
              >
                <option value="" className="bg-gray-800 text-gray-400 py-3 text-sm">
                  Year
                </option>
                {years.map((y) => (
                  <option 
                    key={y} 
                    value={y} 
                    className="bg-gray-800 text-white py-3 text-sm hover:bg-yellow-400 hover:text-black"
                  >
                    {y}
                  </option>
                ))}
              </select>
              <FaChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Floating label - always at top when there are dropdowns */}
        <label 
          className={`
            absolute left-4 top-1 text-xs transition-all duration-200 pointer-events-none
            ${focused 
              ? fieldState === 'error' ? 'text-red-400' : 
                fieldState === 'warning' ? 'text-yellow-400' : 'text-yellow-400'
              : 'text-gray-400'
            }
          `}
        >
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-2 flex items-center gap-2 text-red-400 text-xs">
          <FaTimes className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      {/* Warning message */}
      {warning && !error && (
        <div className="mt-2 flex items-center gap-2 text-yellow-400 text-xs">
          <span>{warning}</span>
        </div>
      )}
    </div>
  );
};

export default DateSelector;