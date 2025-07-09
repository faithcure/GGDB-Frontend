import React, { useState, useRef, useEffect } from 'react';
import { FaChevronDown, FaCheck } from 'react-icons/fa';

const LanguageSelector = ({ 
  selectedLanguages = [], 
  onChange, 
  error,
  label = "Languages",
  placeholder = "Select languages",
  required = false,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageToggle = (languageCode) => {
    const newSelection = selectedLanguages.includes(languageCode)
      ? selectedLanguages.filter(code => code !== languageCode)
      : [...selectedLanguages, languageCode];
    
    onChange(newSelection);
  };

  const getSelectedLanguageNames = () => {
    return selectedLanguages
      .map(code => languages.find(lang => lang.code === code))
      .filter(Boolean)
      .map(lang => lang.name)
      .join(', ');
  };

  const hasValue = selectedLanguages.length > 0;
  const fieldState = error ? 'error' : 'default';
  
  const stateClasses = {
    error: 'border-red-500 focus:border-red-400',
    default: 'border-gray-700 focus:border-yellow-400'
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Selector button */}
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
            setFocused(true);
          }}
          onFocus={() => setFocused(true)}
          className={`
            w-full px-4 py-4 bg-gray-900/80 border rounded text-left
            focus:outline-none transition-all duration-200 text-white
            flex items-center justify-between
            ${stateClasses[fieldState]}
          `}
        >
          <span className={hasValue ? 'text-white' : 'text-gray-400'}>
            {hasValue ? getSelectedLanguageNames() : ''}
          </span>
          <FaChevronDown 
            className={`text-gray-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Floating label */}
        <label 
          className={`
            absolute left-4 transition-all duration-200 pointer-events-none
            ${focused || hasValue || isOpen
              ? 'top-1 text-xs' 
              : 'top-4 text-base'
            }
            ${focused || isOpen
              ? fieldState === 'error' ? 'text-red-400' : 'text-yellow-400'
              : 'text-gray-400'
            }
          `}
        >
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
          <div className="p-2">
            {languages.map((language) => {
              const isSelected = selectedLanguages.includes(language.code);
              
              return (
                <button
                  key={language.code}
                  type="button"
                  onClick={() => handleLanguageToggle(language.code)}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-800 rounded transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{language.flag}</span>
                    <span className="text-white">{language.name}</span>
                  </div>
                  {isSelected && (
                    <FaCheck className="text-yellow-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected languages tags */}
      {hasValue && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedLanguages.map(code => {
            const language = languages.find(lang => lang.code === code);
            return (
              <span
                key={code}
                className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-400/20 text-yellow-400 text-xs rounded border border-yellow-400/30"
              >
                <span>{language?.flag}</span>
                <span>{language?.name}</span>
                <button
                  type="button"
                  onClick={() => handleLanguageToggle(code)}
                  className="ml-1 hover:text-yellow-300 transition-colors"
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mt-2 flex items-center gap-2 text-red-400 text-xs">
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;