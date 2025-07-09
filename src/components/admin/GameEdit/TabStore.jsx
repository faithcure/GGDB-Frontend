// 📁 components/admin/GameEdit/TabStore.jsx
import React, { useState } from "react";
import { FaPlus, FaMinus, FaCloudDownloadAlt, FaBoxOpen } from "react-icons/fa";

const STORE_OPTIONS = [
  "Steam",
  "Epic Games",
  "EA Games",
  "Amazon",
  "GOG",
  "Ubisoft",
  "Microsoft Store",
  "PlayStation Store",
  "Nintendo eShop",
  "eBay",
  "GameStop",
  "BestBuy",
];

const TabStore = ({ game, editMode, formData, setFormData }) => {
  const [newStore, setNewStore] = useState({ platform: "Steam", url: "", type: "digital" });

  const handleChange = (idx, field, value) => {
    const updated = [...formData.storeLinks];
    updated[idx][field] = value.toLowerCase?.() || value;
    setFormData({ ...formData, storeLinks: updated });
  };

  const removeStore = (index) => {
    const updated = [...formData.storeLinks];
    updated.splice(index, 1);
    setFormData({ ...formData, storeLinks: updated });
  };

  const addStore = () => {
    if (!newStore.url.trim()) return;
    const updated = [...(formData.storeLinks || []), {
      ...newStore,
      type: newStore.type.toLowerCase?.() || "digital"
    }];
    setFormData({ ...formData, storeLinks: updated });
    setNewStore({ platform: "Steam", url: "", type: "digital" });
  };

  return (
    <div className="md:col-span-2">
      <label className="text-gray-400 font-medium">Store Links</label>
      {editMode ? (
        <div className="space-y-4 mt-2">
          {(formData.storeLinks || []).map((link, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-2 items-center">
              <select
                value={link.platform}
                onChange={(e) => handleChange(idx, "platform", e.target.value)}
                className="col-span-3 bg-gray-800 text-white p-2 rounded border border-gray-700"
              >
                {STORE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <input
                type="url"
                placeholder="Store URL"
                value={link.url}
                onChange={(e) => handleChange(idx, "url", e.target.value)}
                className="col-span-6 bg-gray-800 text-white p-2 rounded border border-gray-700"
              />
              <select
                value={link.type || "digital"}
                onChange={(e) => handleChange(idx, "type", e.target.value)}
                className="col-span-2 bg-gray-800 text-white p-2 rounded border border-gray-700"
              >
                <option value="digital">Digital</option>
                <option value="physical">Physical</option>
              </select>
              <button
                type="button"
                onClick={() => removeStore(idx)}
                className="col-span-1 flex items-center justify-center rounded-full bg-red-600 hover:bg-red-500 text-white w-8 h-8"
              >
                <FaMinus />
              </button>
            </div>
          ))}

          <div className="grid grid-cols-12 gap-2 items-center mt-2">
            <select
              value={newStore.platform}
              onChange={(e) => setNewStore({ ...newStore, platform: e.target.value })}
              className="col-span-3 bg-gray-800 text-white p-2 rounded border border-gray-700"
            >
              {STORE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <input
              type="url"
              placeholder="Store URL"
              value={newStore.url}
              onChange={(e) => setNewStore({ ...newStore, url: e.target.value })}
              className="col-span-6 bg-gray-800 text-white p-2 rounded border border-gray-700"
            />
            <select
              value={newStore.type}
              onChange={(e) => setNewStore({ ...newStore, type: e.target.value })}
              className="col-span-2 bg-gray-800 text-white p-2 rounded border border-gray-700"
            >
              <option value="digital">Digital</option>
              <option value="physical">Physical</option>
            </select>
            <button
              type="button"
              onClick={addStore}
              className="col-span-1 flex items-center justify-center rounded-full bg-yellow-400 hover:bg-yellow-300 text-black w-8 h-8"
            >
              <FaPlus />
            </button>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto mt-3">
          <table className="w-full text-sm text-left text-gray-300 border border-gray-700">
            <thead className="bg-gray-800 text-gray-400">
              <tr>
                <th className="px-4 py-2 border-b border-gray-700">Platform</th>
                <th className="px-4 py-2 border-b border-gray-700">URL</th>
                <th className="px-4 py-2 border-b border-gray-700">Type</th>
              </tr>
            </thead>
            <tbody>
              {game.storeLinks?.length ? (
                game.storeLinks.map((link, idx) => (
                  <tr key={idx} className="hover:bg-gray-800/40">
                    <td className="px-4 py-2 border-b border-gray-700">{link.platform}</td>
                    <td className="px-4 py-2 border-b border-gray-700">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-300 hover:text-yellow-300 underline"
                      >
                        {link.url}
                      </a>
                    </td>
                    <td className="px-4 py-2 border-b border-gray-700">
                      {(link.type || "").toLowerCase() === "physical" ? (
                        <span className="text-orange-400 flex items-center gap-1">
                          <FaBoxOpen /> Physical
                        </span>
                      ) : (
                        <span className="text-green-400 flex items-center gap-1">
                          <FaCloudDownloadAlt /> Digital
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center text-gray-500 px-4 py-2">No store links</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TabStore;