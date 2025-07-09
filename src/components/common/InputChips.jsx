// 📁 components/common/InputChips.jsx
import React, { useState, useRef } from "react";

const InputChips = ({ label, value, onChange }) => {
  const initialItems = Array.isArray(value) ? value : [];
  const [items, setItems] = useState(initialItems);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    const val = e.target.value;
    if (val.includes(",")) {
      const split = val.split(",").map(v => v.trim()).filter(Boolean);
      const updated = [...items, ...split];
      setItems(updated);
      setInputValue("");
      onChange(updated);
    } else {
      setInputValue(val);
    }
  };

  const handleRemove = (index) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
    onChange(updated);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Backspace" && !inputValue && items.length) {
      handleRemove(items.length - 1);
    }
  };

  return (
    <div className="mb-4">
      <label className="text-gray-400 font-medium block mb-1">{label}</label>
      <div
        className="flex flex-wrap items-center gap-2 bg-gray-800 text-white p-2 rounded border border-gray-700 min-h-[42px]"
        onClick={() => inputRef.current?.focus()}
      >
        {items.map((item, idx) => (
          <span
            key={idx}
            className="flex items-center gap-1 bg-yellow-600/10 border border-yellow-400 text-yellow-300 px-3 py-1 rounded-full text-xs font-medium"
          >
            {item}
            <button
              onClick={() => handleRemove(idx)}
              className="hover:text-red-400 focus:outline-none text-xs"
            >
              &times;
            </button>
          </span>
        ))}

        <input
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="bg-transparent outline-none flex-1 text-sm min-w-[100px]"
          placeholder="Type and press comma..."
        />
      </div>
    </div>
  );
};

export default InputChips;
