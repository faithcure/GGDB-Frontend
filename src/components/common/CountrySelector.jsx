import React, { useState, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";
import { COUNTRIES } from "../../data/countries";
import "flag-icons/css/flag-icons.min.css";

export const CountrySelector = ({ selectedValue, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState(COUNTRIES);

  useEffect(() => {
    const q = query.toLowerCase();
    setFiltered(
      COUNTRIES.filter((c) =>
        c.label.toLowerCase().includes(q)
      )
    );
  }, [query]);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const handleSelect = (country) => {
    onChange(country.value);
    setIsOpen(false);
    setQuery("");
  };

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={toggleDropdown}
        className={`w-full flex justify-between items-center px-4 py-2 bg-gray-700 text-white border border-gray-600 transition-all
          ${isOpen ? "rounded-t-md" : "rounded-md"} 
          hover:bg-gray-600`}
      >
        <span className="flex items-center gap-2">
          <span className={`fi fi-${selectedValue?.value.toLowerCase()}`}></span>
          {selectedValue?.label || "Select Country"}
        </span>
        <FiChevronDown />
      </button>

      {isOpen && (
        <div className="absolute z-20 mt-0 w-full bg-gray-800 border-t-0 border border-gray-600 rounded-b-xl shadow-lg overflow-hidden">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="w-full px-4 py-1.5 text-sm bg-gray-700 text-white border-b border-gray-600 outline-none placeholder-gray-400"
          />
<ul className="max-h-56 overflow-y-auto text-sm custom-scroll">
  {filtered.map((country) => (
    <li
      key={country.value}
      onClick={() => handleSelect(country)}
      className="px-4 py-2 flex items-center gap-2 hover:bg-brand-aqua/20 cursor-pointer transition-all"
    >
      <span className={`fi fi-${country.value.toLowerCase()}`}></span>
      {country.label}
    </li>
  ))}
</ul>

        </div>
      )}
    </div>
  );
};
