// 📁 components/common/InputList.jsx
import React, { useState } from "react";

const InputList = ({ label, values, onChange }) => {
  const [input, setInput] = useState("");

  const addItem = () => {
    if (input.trim()) {
      onChange([...values, input.trim()]);
      setInput("");
    }
  };

  const removeItem = (index) => {
    const updated = values.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addItem();
    }
  };

  return (
    <div className="mb-4">
      <label className="text-gray-400 font-medium block mb-1">{label}</label>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add and press Enter"
          className="bg-gray-800 text-white p-2 rounded border border-gray-700 flex-1"
        />
        <button
          onClick={addItem}
          className="bg-yellow-600 hover:bg-yellow-500 text-black font-semibold px-3 rounded"
        >
          +
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {values.map((val, idx) => (
          <span
            key={idx}
            className="flex items-center gap-2 bg-yellow-600/10 border border-yellow-400 text-yellow-300 px-3 py-1 rounded-full text-xs font-medium"
          >
            {val}
            <button
              onClick={() => removeItem(idx)}
              className="hover:text-red-400 text-xs"
            >
              &times;
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default InputList;
