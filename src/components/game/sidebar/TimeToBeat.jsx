// sidebar/TimeToBeat.jsx
import React from "react";
import { FaClock } from "react-icons/fa";
import Section from "./Section";

const PlaytimeBar = ({ label, hours, maxHours, color }) => (
    <div className="space-y-2">
        <div className="flex justify-between items-center">
            <span className="text-sm text-white/80">{label}</span>
            <span className="text-sm font-semibold text-white">{hours}H</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
                className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-500`}
                style={{ width: `${(hours / maxHours) * 100}%` }}
            />
        </div>
    </div>
);

const TimeToBeat = ({ playtime }) => {
    return (
        <Section title="Time to Beat" icon={FaClock}>
            <div className="space-y-4">
                <PlaytimeBar
                    label="Main Story"
                    hours={playtime.main}
                    maxHours={100}
                    color="from-blue-400 to-blue-600"
                />
                <PlaytimeBar
                    label="Main + Extras"
                    hours={playtime.extras}
                    maxHours={100}
                    color="from-purple-400 to-purple-600"
                />
                <PlaytimeBar
                    label="Completionist"
                    hours={playtime.complete}
                    maxHours={100}
                    color="from-yellow-400 to-yellow-600"
                />
            </div>
            <div className="mt-4 pt-3 border-t border-white/10">
                <p className="text-xs text-white/60 text-center">
                    Data from community submissions
                </p>
            </div>
        </Section>
    );
};

export default TimeToBeat;