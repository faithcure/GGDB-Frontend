// 📁 components/admin/GameEdit/TabSystem.jsx - System Requirements & Content Rating Only
import React from "react";
import { FaDesktop, FaCertificate } from "react-icons/fa";
import Info from "./_Info";
import { AGE_RATINGS } from "../../../data/ageRatings";
import { CONTENT_WARNINGS } from "../../../data/contentWarnings";

const TabSystem = ({ game, formatList, editMode, formData, setFormData }) => {
    const extractLabel = (arr, source) =>
        arr?.map((code) => {
            const item = source.find((i) => i.code === code);
            return item ? `${item.icon} ${item.label}` : code;
        });

    return (
        <>
            {editMode ? (
                <div className="space-y-6">
                    {/* System Requirements Section */}
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                        <div className="flex items-center gap-3 mb-4">
                            <FaDesktop className="text-blue-400 text-xl" />
                            <h3 className="text-lg font-semibold text-white">System Requirements</h3>
                        </div>

                        <div className="space-y-4">
                            <TextAreaInput
                                label="💻 Minimum Requirements"
                                value={formData.systemRequirements?.minimum || ""}
                                onChange={(val) =>
                                    setFormData({
                                        ...formData,
                                        systemRequirements: {
                                            ...formData.systemRequirements,
                                            minimum: val,
                                        },
                                    })
                                }
                                placeholder="OS: Windows 10 64-bit&#10;Processor: Intel Core i5-3570K&#10;Memory: 8 GB RAM&#10;Graphics: NVIDIA GTX 780&#10;DirectX: Version 12&#10;Storage: 70 GB available space"
                            />

                            <TextAreaInput
                                label="🚀 Recommended Requirements"
                                value={formData.systemRequirements?.recommended || ""}
                                onChange={(val) =>
                                    setFormData({
                                        ...formData,
                                        systemRequirements: {
                                            ...formData.systemRequirements,
                                            recommended: val,
                                        },
                                    })
                                }
                                placeholder="OS: Windows 11 64-bit&#10;Processor: Intel Core i7-4790&#10;Memory: 12 GB RAM&#10;Graphics: NVIDIA GTX 1060&#10;DirectX: Version 12&#10;Storage: 70 GB available space"
                            />
                        </div>
                    </div>

                    {/* Content Rating Section */}
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                        <div className="flex items-center gap-3 mb-4">
                            <FaCertificate className="text-yellow-400 text-xl" />
                            <h3 className="text-lg font-semibold text-white">Content Rating & Warnings</h3>
                        </div>

                        <div className="space-y-4">
                            <DropdownChipsGeneric
                                label="🔞 Age Ratings"
                                value={formData.ageRatings || []}
                                setValue={(updated) => setFormData({ ...formData, ageRatings: updated })}
                                options={AGE_RATINGS}
                                isAdmin={true}
                            />

                            <DropdownChipsGeneric
                                label="⚠️ Content Warnings"
                                value={formData.contentWarnings || []}
                                setValue={(updated) =>
                                    setFormData({ ...formData, contentWarnings: updated })
                                }
                                options={CONTENT_WARNINGS}
                                isAdmin={true}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* System Requirements Display */}
                    <div className="bg-gray-800/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <FaDesktop className="text-blue-400" />
                            <h3 className="text-white font-semibold">System Requirements</h3>
                        </div>
                        <div className="space-y-3">
                            <Info
                                label="💻 Minimum Requirements"
                                value={game.systemRequirements?.minimum || "Not specified"}
                            />
                            <Info
                                label="🚀 Recommended Requirements"
                                value={game.systemRequirements?.recommended || "Not specified"}
                            />
                        </div>
                    </div>

                    {/* Content Rating Display */}
                    <div className="bg-gray-800/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <FaCertificate className="text-yellow-400" />
                            <h3 className="text-white font-semibold">Content Rating</h3>
                        </div>
                        <div className="space-y-3">
                            <Info
                                label="🔞 Age Ratings"
                                value={formatList(extractLabel(game.ageRatings, AGE_RATINGS))}
                            />
                            <Info
                                label="⚠️ Content Warnings"
                                value={formatList(extractLabel(game.contentWarnings, CONTENT_WARNINGS))}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

// === Textarea with clear button ===
const TextAreaInput = ({ label, value, onChange, placeholder }) => (
    <div className="mb-4 relative">
        <label className="block text-gray-400 font-medium mb-1">{label}</label>
        <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={Math.max(3, value.split("\n").length)}
            className="bg-gray-800 text-white border border-gray-600 rounded p-2 w-full resize-y pr-10"
            placeholder={placeholder?.replace(/&#10;/g, '\n') || "Enter system requirements..."}
        />
        {value && (
            <button
                type="button"
                onClick={() => onChange("")}
                className="absolute top-[38px] right-3 text-gray-400 hover:text-white"
            >
                ⨉
            </button>
        )}
    </div>
);

// === Generic Dropdown + Chips for age/content ===
const DropdownChipsGeneric = ({ label, value, setValue, options, isAdmin = false }) => {
    const handleAdd = (code) => {
        if (!code || value.includes(code)) return;
        setValue([...value, code]);
    };

    const handleRemove = (code) => {
        setValue(value.filter((v) => v !== code));
    };

    const handleReset = () => {
        setValue([]);
    };

    return (
        <div className="mb-4">
            <label className="block text-gray-400 font-medium mb-1">{label}</label>
            <div className="flex flex-wrap gap-2 mb-2">
                {value.map((code) => {
                    const item = options.find((o) => o.code === code);
                    return (
                        <span key={code} className="bg-gray-700 text-white px-2 py-1 rounded text-sm flex items-center gap-1" title={item?.description}>
              {item ? `${item.icon} ${item.label}` : code}
                            <button onClick={() => handleRemove(code)}>⨉</button>
            </span>
                    );
                })}
            </div>
            <div className="flex gap-2">
                <select
                    onChange={(e) => {
                        handleAdd(e.target.value);
                        e.target.value = "";
                    }}
                    defaultValue=""
                    className="bg-gray-800 text-white border border-gray-600 rounded p-2 w-full"
                >
                    <option value="" disabled>Select an option...</option>
                    {options.map((opt) => (
                        <option key={opt.code} value={opt.code}>
                            {`${opt.icon} ${opt.label}${isAdmin && opt.description ? ` (${opt.description})` : ""}`}
                        </option>
                    ))}
                </select>
                {value.length > 0 && (
                    <button onClick={handleReset} className="text-gray-400 hover:text-white">⨉</button>
                )}
            </div>
        </div>
    );
};

export default TabSystem;