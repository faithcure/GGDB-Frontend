// src/pages/ContributePerson/PersonalInfoSection.jsx
import React from "react";
import ShortBio from "./ShortBio";

const PersonalInfoSection = ({ gamer, personalDetailsRef }) => {
    return (
        <section ref={personalDetailsRef} className="glass-effect rounded-xl p-6 mb-10">
            <h2 className="text-2xl font-bold mb-6 border-b border-white/10 pb-2">Personal Details</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4 text-white/80">
                {gamer.dob && (
                    <li><strong className="text-white">Birthdate:</strong> {gamer.dob}</li>
                )}
                {gamer.country && (
                    <li><strong className="text-white">Country:</strong> {gamer.country}</li>
                )}
                {gamer.createdAt && (
                    <li><strong className="text-white">Member Since:</strong> {new Date(gamer.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</li>
                )}
                {gamer.education && (
                    <li><strong className="text-white">Education:</strong> {gamer.education}</li>
                )}
                {gamer.currentWork && (
                    <li><strong className="text-white">Current Work:</strong> {gamer.currentWork}</li>
                )}
                {gamer.currentProjects && (
                    <li><strong className="text-white">Current Projects:</strong> {gamer.currentProjects}</li>
                )}
                {gamer.careerGoals && (
                    <li><strong className="text-white">Career Goals:</strong> {gamer.careerGoals}</li>
                )}
                {gamer.website && (
                    <li><strong className="text-white">Website:</strong>
                        <a
                            href={gamer.website.startsWith('http') ? gamer.website : `https://${gamer.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 ml-2"
                        >
                            {gamer.website.replace(/^https?:\/\//, '')}
                        </a>
                    </li>
                )}
                {gamer.bio && (
                    <li className="sm:col-span-2 mt-4">
                        <strong className="text-white">Bio:</strong><br />
                        <p className="mt-2 leading-relaxed"><ShortBio text={gamer.bio} /></p>
                    </li>
                )}
            </ul>
        </section>
    );
};

export default PersonalInfoSection;
