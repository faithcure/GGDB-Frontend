// 📁 src/components/game/sidebar/LanguageSupport.jsx - Fixed language display
import React from "react";
import { FaGlobe } from "react-icons/fa";
import Section from "./Section";

const LanguageSupport = ({ gameData, expanded, onToggle }) => {
    console.log('🔍 LanguageSupport received gameData:', gameData);

    // Game'den language data'sını al
    const languages = gameData?.languages || { audio: [], subtitles: [], interface: [] };
    const hasIGDBData = languages.hasIGDBLanguageData;
    const dataSource = gameData?.dataSource;

    console.log('🔍 Languages data:', languages);
    console.log('🔍 Data source:', dataSource);

    // 🆕 LANGUAGES array'i import et (TabLanguages'dan gelen kodları çözmek için)
    const LANGUAGES = [
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
        { code: 'es', name: 'Spanish', flag: '🇪🇸' },
        { code: 'fr', name: 'French', flag: '🇫🇷' },
        { code: 'de', name: 'German', flag: '🇩🇪' },
        { code: 'it', name: 'Italian', flag: '🇮🇹' },
        { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
        { code: 'ru', name: 'Russian', flag: '🇷🇺' },
        { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
        { code: 'ko', name: 'Korean', flag: '🇰🇷' },
        { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
        { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
        { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
        { code: 'pl', name: 'Polish', flag: '🇵🇱' },
        { code: 'sv', name: 'Swedish', flag: '🇸🇪' },
        { code: 'no', name: 'Norwegian', flag: '🇳🇴' },
        { code: 'da', name: 'Danish', flag: '🇩🇰' },
        { code: 'fi', name: 'Finnish', flag: '🇫🇮' },
        { code: 'cs', name: 'Czech', flag: '🇨🇿' },
        { code: 'hu', name: 'Hungarian', flag: '🇭🇺' },
        { code: 'el', name: 'Greek', flag: '🇬🇷' },
        { code: 'he', name: 'Hebrew', flag: '🇮🇱' },
        { code: 'th', name: 'Thai', flag: '🇹🇭' },
        { code: 'vi', name: 'Vietnamese', flag: '🇻🇳' },
        { code: 'id', name: 'Indonesian', flag: '🇮🇩' },
        { code: 'pt-br', name: 'Portuguese (Brazil)', flag: '🇧🇷' },
        { code: 'es-es', name: 'Spanish (Spain)', flag: '🇪🇸' },
        { code: 'es-mx', name: 'Spanish (Mexico)', flag: '🇲🇽' },
        { code: 'zh-cn', name: 'Chinese (Simplified)', flag: '🇨🇳' },
        { code: 'zh-tw', name: 'Chinese (Traditional)', flag: '🇹🇼' },
        { code: 'en-gb', name: 'English (UK)', flag: '🇬🇧' },
    ];

    // Get display name for language code or name
    const getLanguageDisplay = (langCodeOrName) => {
        // TabLanguages'dan gelen kod mu yoksa IGDB'den gelen tam isim mi kontrol et
        const langByCode = LANGUAGES.find(l => l.code === langCodeOrName);
        if (langByCode) {
            return langByCode.name; // Kod ise tam ismi döndür
        }

        // IGDB'den gelen tam isim ise aynen döndür
        return langCodeOrName;
    };

    // Create unified language list with support types
    const createLanguageList = () => {
        const allLanguages = new Set([
            ...languages.audio,
            ...languages.subtitles,
            ...languages.interface
        ]);

        return Array.from(allLanguages).map(lang => ({
            code: lang, // Orijinal kod/isim
            name: getLanguageDisplay(lang), // Görüntülenecek isim
            displayName: getLanguageDisplay(lang), // Sadece isim (flag yok)
            audio: languages.audio.includes(lang),
            subtitles: languages.subtitles.includes(lang),
            interface: languages.interface.includes(lang)
        })).sort((a, b) => {
            // English first, then alphabetical
            if (a.name === 'English') return -1;
            if (b.name === 'English') return 1;
            return a.name.localeCompare(b.name);
        });
    };

    const languageList = createLanguageList();
    const hasAnyLanguageData = languageList.length > 0;

    // Determine how many languages to show based on expanded state
    const displayLanguages = expanded ? languageList : languageList.slice(0, 5);
    const hasMoreLanguages = languageList.length > 5;

    console.log('🔍 Expanded state:', expanded);
    console.log('🔍 Total languages:', languageList.length);
    console.log('🔍 Displaying languages:', displayLanguages.length);
    console.log('🔍 Has more languages:', hasMoreLanguages);
    console.log('🔍 Language list:', languageList);

    // If no language data, show fallback or empty state
    if (!hasAnyLanguageData) {
        return (
            <Section
                title="Language Support"
                icon={FaGlobe}
                collapsible={true}
                expanded={expanded}
                onToggle={onToggle}
            >
                <div className="text-center py-6">
                    <div className="text-4xl mb-2">🤷‍♂️</div>
                    <div className="text-white/70 text-sm mb-2">No Language Support Data</div>

                    {dataSource === 'igdb' ? (
                        <div className="text-amber-400/70 text-xs">
                            ⚠️ IGDB Import: Language data not available in database
                        </div>
                    ) : dataSource === 'rawg' ? (
                        <div className="text-cyan-400/70 text-xs">
                            ℹ️ RAWG Import: Language data not included
                        </div>
                    ) : (
                        <div className="text-gray-400 text-xs">
                            ✏️ Manual Entry: Language data can be added via admin panel
                        </div>
                    )}
                </div>
            </Section>
        );
    }

    return (
        <Section
            title="Language Support"
            icon={FaGlobe}
            collapsible={true}
            expanded={expanded}
            onToggle={onToggle}
        >
            <div className="overflow-x-auto">
                <table className="w-full text-xs">
                    <thead>
                    <tr className="text-left border-b border-white/10">
                        <th className="py-2 text-white/70 font-medium">Language</th>
                        <th className="py-2 text-center text-white/70 font-medium">Audio</th>
                        <th className="py-2 text-center text-white/70 font-medium">Sub</th>
                        <th className="py-2 text-center text-white/70 font-medium">UI</th>
                    </tr>
                    </thead>
                    <tbody>
                    {displayLanguages.map((lang, i) => (
                        <tr key={lang.code} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                            <td className="py-2 text-white/90">
                                <div className="flex items-center gap-2">
                                    <span>{lang.displayName}</span>
                                    {lang.name === 'English' && (
                                        <span className="text-xs bg-blue-600/20 text-blue-400 px-1 py-0.5 rounded border border-blue-500/30">
                                            Primary
                                        </span>
                                    )}
                                </div>
                            </td>
                            <td className="text-center">
                                {lang.audio ? (
                                    <span className="text-green-400 font-bold">✓</span>
                                ) : (
                                    <span className="text-white/30">—</span>
                                )}
                            </td>
                            <td className="text-center">
                                {lang.subtitles ? (
                                    <span className="text-blue-400 font-bold">✓</span>
                                ) : (
                                    <span className="text-white/30">—</span>
                                )}
                            </td>
                            <td className="text-center">
                                {lang.interface ? (
                                    <span className="text-purple-400 font-bold">✓</span>
                                ) : (
                                    <span className="text-white/30">—</span>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Show "more languages" indicator when collapsed */}
            {!expanded && hasMoreLanguages && (
                <div className="mt-2 text-center">
                    <div className="text-xs text-white/50">
                        +{languageList.length - 5} more languages • Click to expand
                    </div>
                </div>
            )}

            {/* Legend with dynamic counts */}
            <div className="mt-3 flex items-center justify-center gap-6 text-xs">
                <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    <span className="text-white/70">Audio ({languages.audio.length})</span>
                </span>
                <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                    <span className="text-white/70">Sub ({languages.subtitles.length})</span>
                </span>
                <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                    <span className="text-white/70">UI ({languages.interface.length})</span>
                </span>
            </div>

            {/* IGDB info if applicable */}
            {hasIGDBData && dataSource === 'igdb' && (
                <div className="mt-3 text-center">
                    <div className="text-xs text-purple-400/70">
                        Data automatically imported from IGDB database
                    </div>
                </div>
            )}
        </Section>
    );
};

export default LanguageSupport;