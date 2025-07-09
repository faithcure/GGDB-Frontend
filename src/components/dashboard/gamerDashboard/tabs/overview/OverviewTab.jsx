import React, { useState } from "react";
import AboutSection from "./AboutSection";
import PlatformsSection from "./PlatformsSection";
import GenresSection from "./GenresSection";
import ConsolesSection from "./ConsolesSection";
import GamingExperienceSection from "./GamingExperienceSection";
import QuickAccessSection from "./QuickAccessSection";
import RecentActivitySection from "./RecentActivitySection";
import RecentlyUpdatedGamesSection from "./RecentlyUpdatedGamesSection";
import StatsCard from "./StatsCard";
import AdComponent from "../../../../common/AdComponent"
import { PLATFORM_LIST, GENRES_LIST, CONSOLES_LIST } from "../../../../../data/gameConstants";

const OverviewTab = ({ gamer: initialGamer, setActiveTab, canEdit = false, editingSection, setEditingSection, setGamer: setParentGamer, quickUpdate }) => {
    // Use parent gamer state directly when available
    const gamer = initialGamer;
    const [viewMode, setViewMode] = useState("grid");

    // Bütün bölümleri modüler çağırıyoruz
    return (
        <div className="space-y-8 animate-slide-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <AboutSection
                        gamer={gamer}
                        setGamer={setParentGamer}
                        editingSection={editingSection}
                        setEditingSection={setEditingSection}
                        canEdit={canEdit}
                    />
                    <div className="glass-effect rounded-xl p-6 space-y-8">
                        <PlatformsSection
                            gamer={gamer}
                            setGamer={setParentGamer}
                            editingSection={editingSection}
                            setEditingSection={setEditingSection}
                            canEdit={canEdit}
                        />
                    </div>
                    <div className="glass-effect rounded-xl p-6 space-y-8">
                        <GenresSection
                            gamer={gamer}
                            setGamer={setParentGamer}
                            editingSection={editingSection}
                            setEditingSection={setEditingSection}
                            canEdit={canEdit}
                        />
                    </div>
                    <div className="glass-effect rounded-xl p-6 space-y-8">
                        <ConsolesSection
                            gamer={gamer}
                            setGamer={setParentGamer}
                            editingSection={editingSection}
                            setEditingSection={setEditingSection}
                            canEdit={canEdit}
                        />
                    </div>
                    <div className="glass-effect rounded-xl p-6 space-y-8">
                        <GamingExperienceSection gamer={gamer} />
                        <QuickAccessSection />

                    </div>
                    <RecentActivitySection gamer={initialGamer} setActiveTab={setActiveTab} />
                    <RecentlyUpdatedGamesSection
                        gamer={initialGamer}
                        viewMode={viewMode}
                        setViewMode={setViewMode}
                    />

                </div>
                <div className="space-y-6">
                    <StatsCard gamer={gamer} setEditingSection={setEditingSection} />
                    <AdComponent />
                    <AdComponent size="skyscraper" />
                </div>
            </div>
        </div>
    );
};

export default OverviewTab;