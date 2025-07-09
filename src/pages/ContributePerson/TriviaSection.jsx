// src/pages/ContributePerson/TriviaSection.jsx
import React from "react";
import { FaLightbulb } from "react-icons/fa";

const TriviaCard = ({ text }) => (
    <div className="bg-white/5 rounded-lg p-4 border border-white/10 flex items-center gap-2">
        <FaLightbulb className="text-purple-400 inline mr-2" />
        <span className="text-white/70">{text}</span>
    </div>
);

const TriviaSection = ({ trivia }) => (
    <section>
        <h2 className="text-2xl font-bold mb-6 border-b border-white/10 pb-2">Trivia</h2>
        <div className="grid grid-cols-1 gap-3">
            {trivia.map((fact, i) => <TriviaCard key={i} text={fact} />)}
        </div>
    </section>
);

export default TriviaSection;