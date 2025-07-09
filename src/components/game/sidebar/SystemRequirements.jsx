// sidebar/SystemRequirements.jsx
import React from "react";
import { FaGamepad } from "react-icons/fa";
import Section from "./Section";

const SystemRequirements = ({ systemRequirements, expanded, onToggle }) => {
    return (
        <Section
            title="System Requirements"
            icon={FaGamepad}
            collapsible={true}
            expanded={expanded}
            onToggle={onToggle}
        >
            <div className="space-y-4">
                <div>
                    <h4 className="text-green-400 font-medium mb-2 text-sm">Minimum</h4>
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <pre className="text-xs text-white/80 whitespace-pre-wrap leading-relaxed">
              {systemRequirements.minimum}
            </pre>
                    </div>
                </div>
                <div>
                    <h4 className="text-blue-400 font-medium mb-2 text-sm">Recommended</h4>
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <pre className="text-xs text-white/80 whitespace-pre-wrap leading-relaxed">
              {systemRequirements.recommended}
            </pre>
                    </div>
                </div>
            </div>
        </Section>
    );
};

export default SystemRequirements;