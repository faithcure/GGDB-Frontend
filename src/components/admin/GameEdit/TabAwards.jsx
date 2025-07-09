// 📁 components/admin/GameEdit/TabAwards.jsx
import React from "react";
import { FaPlus, FaTrash } from "react-icons/fa";

const TabAwards = ({ game, editMode, formData, setFormData }) => {
  const awards = formData.awards || [];

  const handleChange = (index, field, value) => {
    const updated = [...awards];
    updated[index][field] = value;
    setFormData({ ...formData, awards: updated });
  };

  const addAward = () => {
    setFormData({
      ...formData,
      awards: [
        ...awards,
        {
          title: "",
          date: "",
          category: "",
          recipient: ""
        }
      ]
    });
  };

  const removeAward = (index) => {
    const updated = [...awards];
    updated.splice(index, 1);
    setFormData({ ...formData, awards: updated });
  };

  return (
    <div className="md:col-span-2 space-y-6">
      <h2 className="text-cyan-300 font-semibold text-lg mb-2">🏆 Awards</h2>

      {editMode ? (
        <>
          {awards.map((award, idx) => (
            <div
              key={idx}
              className="grid grid-cols-12 gap-2 items-end bg-gray-800 p-4 rounded border border-gray-700"
            >
              <input
                type="text"
                placeholder="🏆 Award Title"
                value={award.title || ""}
                onChange={(e) => handleChange(idx, "title", e.target.value)}
                className="col-span-3 p-2 rounded bg-gray-900 text-white border border-gray-600"
              />
              <input
                type="text"
                placeholder="📅 Date (e.g. 2022)"
                value={award.date || ""}
                onChange={(e) => handleChange(idx, "date", e.target.value)}
                className="col-span-2 p-2 rounded bg-gray-900 text-white border border-gray-600"
              />
              <input
                type="text"
                placeholder="🗂️ Category"
                value={award.category || ""}
                onChange={(e) => handleChange(idx, "category", e.target.value)}
                className="col-span-3 p-2 rounded bg-gray-900 text-white border border-gray-600"
              />
              <input
                type="text"
                placeholder="👤 Recipient"
                value={award.recipient || ""}
                onChange={(e) => handleChange(idx, "recipient", e.target.value)}
                className="col-span-3 p-2 rounded bg-gray-900 text-white border border-gray-600"
              />
              <button
                onClick={() => removeAward(idx)}
                className="text-red-400 hover:text-red-200 text-lg col-span-1"
                title="Remove"
              >
                <FaTrash />
              </button>
            </div>
          ))}

          <button
            onClick={addAward}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold rounded"
          >
            <FaPlus /> Add Award
          </button>
        </>
      ) : (
        <>
          {game.awards?.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left text-gray-300 border border-gray-700">
                <thead className="bg-gray-800 text-gray-400">
                  <tr>
                    <th className="px-4 py-2 border-b border-gray-700">🏆 Award</th>
                    <th className="px-4 py-2 border-b border-gray-700">📅 Date</th>
                    <th className="px-4 py-2 border-b border-gray-700">🗂️ Category</th>
                    <th className="px-4 py-2 border-b border-gray-700">👤 Recipient</th>
                  </tr>
                </thead>
                <tbody>
                  {game.awards.map((a, idx) => (
                    <tr key={idx} className="hover:bg-gray-800/40">
                      <td className="px-4 py-2 border-b border-gray-700">{a.title || "-"}</td>
                      <td className="px-4 py-2 border-b border-gray-700">{a.date || "-"}</td>
                      <td className="px-4 py-2 border-b border-gray-700">{a.category || "-"}</td>
                      <td className="px-4 py-2 border-b border-gray-700">{a.recipient || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No awards recorded.</p>
          )}
        </>
      )}
    </div>
  );
};

export default TabAwards;
