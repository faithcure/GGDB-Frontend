// src/pages/ContributePerson/ShortBio.jsx
import React, { useState } from "react";

const ShortBio = ({ text, maxLength = 180 }) => {
    const [showMore, setShowMore] = useState(false);
    if (!text) return null;
    if (text.length <= maxLength) return <>{text}</>;
    return (
        <>
            {showMore ? text : text.slice(0, maxLength) + "... "}
            <button
                className="text-yellow-400 hover:underline text-xs"
                onClick={() => setShowMore(!showMore)}
            >
                {showMore ? "Show Less" : "Show More"}
            </button>
        </>
    );
};

// Kaldırıldı: mockCredits artık dinamik olarak sunuluyor

export default ShortBio;
