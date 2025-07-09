// 📁 components/admin/GameEdit/TabLanguages.jsx - Complete Language Management
import React, { useState } from "react";
import { FaGlobe, FaMicrophone, FaClosedCaptioning, FaDesktop, FaPlus, FaTimes, FaInfoCircle, FaCheck } from "react-icons/fa";
import Info from "./_Info";
import { LANGUAGES } from "../../../data/languages";

const TabLanguages = ({ game, formatList, editMode, formData, setFormData }) => {
    const [showCustomLanguage, setShowCustomLanguage] = useState(false);
    const [customLanguage, setCustomLanguage] = useState({ name: "", flag: "🌍" });

    // IGDB'den gelen dil verilerini kontrol et
    const hasIGDBLanguageData = game?.languages?.hasIGDBLanguageData || false;
    const dataSource = game?.dataSource || "manual";

    const extractLangNames = (arr) =>
        arr?.map((code) => {
            const lang = LANGUAGES.find((l) => l.code === code);
            return lang ? `${lang.flag} ${lang.name}` : code;
        });

    // Custom dil ekleme fonksiyonu
    const addCustomLanguage = () => {
        if (!customLanguage.name.trim()) return;

        const newLangCode = customLanguage.name.toLowerCase().replace(/\s+/g, '_');

        // LANGUAGES dizisine geçici olarak ekle (bu normalde backend'de yapılmalı)
        const tempLang = {
            code: newLangCode,
            name: customLanguage.name.trim(),
            flag: customLanguage.flag
        };

        // Frontend için geçici ekleme
        if (!LANGUAGES.find(l => l.code === newLangCode)) {
            LANGUAGES.push(tempLang);
        }

        setCustomLanguage({ name: "", flag: "🌍" });
        setShowCustomLanguage(false);
    };

    // Dil desteği durumu kontrolü
    const getLanguageSupportStatus = () => {
        const languages = formData?.languages || game?.languages || {};
        const totalLanguages = new Set([
            ...(languages.audio || []),
            ...(languages.subtitles || []),
            ...(languages.interface || [])
        ]).size;

        if (totalLanguages === 0) {
            return {
                status: "empty",
                message: "No language support data available",
                color: "text-gray-400",
                icon: "🤷‍♂️"
            };
        }

        if (hasIGDBLanguageData && dataSource === 'igdb') {
            return {
                status: "igdb",
                message: `${totalLanguages} languages imported from IGDB`,
                color: "text-purple-400",
                icon: "🎮"
            };
        }

        return {
            status: "manual",
            message: `${totalLanguages} languages manually configured`,
            color: "text-yellow-400",
            icon: "✏️"
        };
    };

    const supportStatus = getLanguageSupportStatus();

    return (
        <>
            {editMode ? (
                <div className="space-y-6">
                    {/* Header with Status */}
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                        <div className="flex items-center gap-3 mb-3">
                            <FaGlobe className="text-blue-400 text-xl" />
                            <h3 className="text-lg font-semibold text-white">Language Support Management</h3>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-2xl">{supportStatus.icon}</span>
                            <span className={supportStatus.color}>{supportStatus.message}</span>
                            {dataSource === 'igdb' && (
                                <span className="ml-2 text-xs bg-purple-600/20 text-purple-400 px-2 py-1 rounded border border-purple-500/30">
                  IGDB Data
                </span>
                            )}
                        </div>

                        {supportStatus.status === "empty" && (
                            <div className="mt-3 p-3 bg-yellow-900/20 border border-yellow-600/30 rounded">
                                <div className="flex items-center gap-2 text-yellow-400 text-sm">
                                    <FaInfoCircle />
                                    <span>No language data found. You can add language support manually below.</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Language Categories */}
                    <div className="grid grid-cols-1 gap-6">
                        {/* Audio Languages */}
                        <LanguageSelector
                            icon={FaMicrophone}
                            label="🎵 Audio Languages"
                            description="Languages with full voice acting/dubbing"
                            field="audio"
                            value={formData.languages?.audio || []}
                            setFormData={setFormData}
                            color="green"
                        />

                        {/* Subtitle Languages */}
                        <LanguageSelector
                            icon={FaClosedCaptioning}
                            label="📝 Subtitle Languages"
                            description="Languages with text subtitles/captions"
                            field="subtitles"
                            value={formData.languages?.subtitles || []}
                            setFormData={setFormData}
                            color="blue"
                        />

                        {/* Interface Languages */}
                        <LanguageSelector
                            icon={FaDesktop}
                            label="🖥️ Interface Languages"
                            description="Languages for UI, menus, and interface elements"
                            field="interface"
                            value={formData.languages?.interface || []}
                            setFormData={setFormData}
                            color="purple"
                        />
                    </div>

                    {/* Custom Language Addition */}
                    <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700 border-dashed">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-white font-medium flex items-center gap-2">
                                <FaPlus className="text-green-400" />
                                Add Custom Language
                            </h4>
                            <button
                                type="button"
                                onClick={() => setShowCustomLanguage(!showCustomLanguage)}
                                className="text-green-400 hover:text-green-300 text-sm"
                            >
                                {showCustomLanguage ? "Cancel" : "Add New"}
                            </button>
                        </div>

                        {showCustomLanguage && (
                            <div className="space-y-3">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <input
                                        type="text"
                                        placeholder="Language name (e.g., Klingon)"
                                        value={customLanguage.name}
                                        onChange={(e) => setCustomLanguage({ ...customLanguage, name: e.target.value })}
                                        className="bg-gray-800 text-white border border-gray-600 rounded p-2 col-span-2"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Flag emoji"
                                        value={customLanguage.flag}
                                        onChange={(e) => setCustomLanguage({ ...customLanguage, flag: e.target.value })}
                                        className="bg-gray-800 text-white border border-gray-600 rounded p-2 text-center"
                                        maxLength={2}
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={addCustomLanguage}
                                        disabled={!customLanguage.name.trim()}
                                        className="bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded text-sm flex items-center gap-2"
                                    >
                                        <FaCheck />
                                        Add Language
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowCustomLanguage(false);
                                            setCustomLanguage({ name: "", flag: "🌍" });
                                        }}
                                        className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded text-sm"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        <p className="text-gray-400 text-xs mt-2">
                            Can't find a language? Add it here and it will be available for all games.
                        </p>
                    </div>
                </div>
            ) : (
                // View Mode
                <div className="space-y-6">
                    {/* Status Header */}
                    <div className="bg-gray-800/30 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <FaGlobe className="text-blue-400" />
                            <h3 className="text-white font-semibold">Language Support</h3>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-xl">{supportStatus.icon}</span>
                            <span className={supportStatus.color}>{supportStatus.message}</span>
                        </div>
                    </div>

                    {/* Language Data Display */}
                    <div className="grid grid-cols-1 gap-4">
                        <div className="bg-gray-800/30 rounded-lg p-4">
                            <Info
                                label="🎵 Audio Languages"
                                value={formatList(extractLangNames(game.languages?.audio)) || "Not specified"}
                            />
                        </div>
                        <div className="bg-gray-800/30 rounded-lg p-4">
                            <Info
                                label="📝 Subtitle Languages"
                                value={formatList(extractLangNames(game.languages?.subtitles)) || "Not specified"}
                            />
                        </div>
                        <div className="bg-gray-800/30 rounded-lg p-4">
                            <Info
                                label="🖥️ Interface Languages"
                                value={formatList(extractLangNames(game.languages?.interface)) || "Not specified"}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

// Enhanced Language Selector Component
const LanguageSelector = ({ icon: Icon, label, description, field, value, setFormData, color }) => {
    const colorClasses = {
        green: {
            bg: "bg-green-900/20",
            border: "border-green-600/30",
            text: "text-green-400",
            chip: "bg-green-700/30 border-green-500/50",
            button: "hover:bg-green-600/20"
        },
        blue: {
            bg: "bg-blue-900/20",
            border: "border-blue-600/30",
            text: "text-blue-400",
            chip: "bg-blue-700/30 border-blue-500/50",
            button: "hover:bg-blue-600/20"
        },
        purple: {
            bg: "bg-purple-900/20",
            border: "border-purple-600/30",
            text: "text-purple-400",
            chip: "bg-purple-700/30 border-purple-500/50",
            button: "hover:bg-purple-600/20"
        }
    };

    const classes = colorClasses[color] || colorClasses.green;

    const handleAdd = (code) => {
        if (!code || value.includes(code)) return;
        setFormData((prev) => ({
            ...prev,
            languages: {
                ...prev.languages,
                [field]: [...value, code],
            },
        }));
    };

    const handleRemove = (code) => {
        setFormData((prev) => ({
            ...prev,
            languages: {
                ...prev.languages,
                [field]: value.filter((v) => v !== code),
            },
        }));
    };

    const handleReset = () => {
        setFormData((prev) => ({
            ...prev,
            languages: {
                ...prev.languages,
                [field]: [],
            },
        }));
    };

    return (
        <div className={`p-4 rounded-lg border ${classes.bg} ${classes.border}`}>
            <div className="flex items-center gap-3 mb-3">
                <Icon className={`${classes.text} text-lg`} />
                <div>
                    <h4 className="text-white font-medium">{label}</h4>
                    <p className="text-gray-400 text-xs">{description}</p>
                </div>
            </div>

            {/* Selected Languages */}
            <div className="flex flex-wrap gap-2 mb-3">
                {value.map((code) => {
                    const lang = LANGUAGES.find((l) => l.code === code);
                    return (
                        <span key={code} className={`${classes.chip} border text-white px-3 py-1 rounded-full text-sm flex items-center gap-2`}>
              {lang ? `${lang.flag} ${lang.name}` : code}
                            <button
                                onClick={() => handleRemove(code)}
                                className={`${classes.button} hover:text-white rounded-full p-0.5`}
                            >
                <FaTimes className="text-xs" />
              </button>
            </span>
                    );
                })}
                {value.length === 0 && (
                    <span className="text-gray-500 text-sm italic">No languages selected</span>
                )}
            </div>

            {/* Language Selector */}
            <div className="flex gap-2">
                <select
                    onChange={(e) => {
                        handleAdd(e.target.value);
                        e.target.value = "";
                    }}
                    defaultValue=""
                    className="bg-gray-800 text-white border border-gray-600 rounded p-2 flex-1"
                >
                    <option value="" disabled>Select a language...</option>
                    {LANGUAGES
                        .filter(lang => !value.includes(lang.code))
                        .map((lang) => (
                            <option key={lang.code} value={lang.code}>
                                {`${lang.flag} ${lang.name}`}
                            </option>
                        ))}
                </select>
                {value.length > 0 && (
                    <button
                        onClick={handleReset}
                        className="text-gray-400 hover:text-white px-3 py-2 border border-gray-600 rounded"
                        title="Clear all"
                    >
                        <FaTimes />
                    </button>
                )}
            </div>

            {/* Language Count */}
            <div className="mt-2 text-right">
        <span className={`text-xs ${classes.text}`}>
          {value.length} language{value.length !== 1 ? 's' : ''} selected
        </span>
            </div>
        </div>
    );
};

export default TabLanguages;