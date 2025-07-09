// src/pages/ContributePerson/AwardsSection.jsx
import React from "react";
import { FaTrophy } from "react-icons/fa";

const AwardCard = ({ text }) => (
    <div className="bg-white/5 rounded-lg p-4 border border-white/10 flex items-center gap-2">
        <FaTrophy className="text-yellow-400 inline mr-2" />
        <span className="text-white/80">{text}</span>
    </div>
);

const AwardsSection = ({ awards }) => (
    <section>
        <h2 className="text-2xl font-bold mb-6 border-b border-white/10 pb-2">Awards & Recognition</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {awards.map((award, i) => <AwardCard key={i} text={award} />)}
        </div>
    </section>
);

export default AwardsSection;
