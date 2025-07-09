// src/pages/ContributePerson/LinksSection.jsx
import React from "react";
import { FaGlobe } from "react-icons/fa";

const LinksSection = ({ portfolioLinksRef, externalLinks }) => (
    <section ref={portfolioLinksRef}>
        <h2 className="text-2xl font-bold mb-6 border-b border-white/10 pb-2">Portfolio & Links</h2>
        <div className="flex flex-wrap gap-4">
            {externalLinks.map((link, i) => (
                <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/10 hover:bg-white/20 text-purple-300 hover:text-white transition px-6 py-3 rounded-lg text-sm font-medium flex items-center gap-2 border border-white/10"
                >
                    {link.label} <FaGlobe size={14} />
                </a>
            ))}
        </div>
    </section>
);

export default LinksSection;