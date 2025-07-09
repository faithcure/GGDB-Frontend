// src/components/game/CastAndCrew.jsx
import React from "react";
import { Link } from "react-router-dom"; // dosyanın en üstüne ekle

const CastAndCrew = ({ directors = [], writers = [], designers = [], composers = [], actors = [] }) => {
  const Section = ({ title, people }) => (
    people.length > 0 && (
      <div className="space-y-4 mb-10">
        <h3 className="text-xl font-semibold text-white border-b border-white/10 pb-2">{title}</h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {people.map((person, i) => (
            <div key={i} className="flex items-center gap-4 bg-white/5 p-4 rounded-lg hover:bg-white/10 transition">
              <img src={person.image} alt={person.name} className="w-12 h-12 rounded-full object-cover border border-white/20" />
              <div>
                  <Link
                      to={`/person/${encodeURIComponent(person.name.toLowerCase().replace(/\s+/g, "-"))}`}
                      className="text-white font-medium leading-tight hover:underline hover:text-yellow-400 transition-colors"
                  >
                      {person.name}
                  </Link>
                <p className="text-white/60 text-sm">{person.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  );

  return (
    <section className="max-w-7xl mx-auto px-6 py-10 border-t border-gray-800">
      <h2 className="text-2xl font-bold text-white mb-6">Cast & Crew</h2>
      <Section title="Directors" people={directors} />
      <Section title="Writers" people={writers} />
      <Section title="Game Designers" people={designers} />
      <Section title="Voice Cast" people={actors} />
      <Section title="Composers & Soundtrack" people={composers} />

      <div className="mt-12 space-y-4 border-t border-white/10 pt-6 text-sm">
        <div className="flex justify-between items-center text-white/90">
          <span className="font-semibold">All credits & production info</span>
          <span className="text-white/50 text-lg">›</span>
        </div>
        <div className="flex justify-between items-center text-white/90">
          <span className="font-semibold">Production, revenue & more at GGDBPro</span>
          <span className="text-white/50 text-sm">→</span>
        </div>
      </div>
    </section>
  );
};

export default CastAndCrew;