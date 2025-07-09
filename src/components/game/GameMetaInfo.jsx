import React, { useState } from "react";

const GameMetaInfo = ({ game }) => {
  const [expanded, setExpanded] = useState(false);
  const toggleExpand = () => setExpanded(!expanded);

  const infoBlock = (label, value, isLink = false) => (
    <div>
      <p className="text-gray-500 uppercase text-xs mb-1">{label}</p>
      {isLink && value ? (
        <a href={value} className="text-blue-400 underline" target="_blank" rel="noreferrer">
          {value}
        </a>
      ) : (
        <p>{value || "-"}</p>
      )}
    </div>
  );

  const awardsPreview = () => {
    const awards = game.awards || [];
    if (awards.length === 0) return "-";

    return (
      <div>
        {awards.slice(0, 3).map((award, idx) => (
          <p key={idx} className="text-sm">
            🏆 {award.title} {award.date ? `- ${award.date}` : ""}
          </p>
        ))}
        {awards.length > 3 && (
          <a
            href="#awards"
            onClick={(e) => {
              e.preventDefault();
              const el = document.querySelector("#awards");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="text-sm text-yellow-400 hover:underline mt-2 inline-block"
          >
            → Go to full awards list
          </a>
        )}
      </div>
    );
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-10 border-t border-gray-800">
      <h2 className="text-2xl font-bold text-white mb-6">Game Details</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-gray-300 text-sm">
        {infoBlock("Developer", game.developer)}
        {infoBlock("Publisher", game.publisher)}
        {infoBlock("Studio", game.studio)}
        {infoBlock("Genres", game.genres?.join(", "))}
        {infoBlock("Platforms", game.platforms?.join(", "))}
        {infoBlock("Release Date", game.releaseDate)}
        {infoBlock("Metacritic Score", game.metacriticScore)}
        {infoBlock("Price", game.price ? `$${game.price}` : "-")}

        {/* STORY BLOCK embedded inline */}
        <div className="sm:col-span-2 md:col-span-3 relative max-h-28 overflow-hidden">
          <p className="text-gray-500 uppercase text-xs mb-1">Story</p>
          <p className="text-sm text-gray-300 italic leading-relaxed">
            {game.story || "No story provided."}
          </p>
          {!expanded && (
            <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-10 rounded-b-md" />
          )}
        </div>
      </div>

      {!expanded && (
        <div className="mt-6 text-center">
          <button
            onClick={toggleExpand}
            className="px-5 py-2 border border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black transition duration-200 font-bold tracking-wider uppercase rounded-md"
          >
            Show More Details
          </button>
        </div>
      )}

      {expanded && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-gray-300 text-sm mt-8">
            {infoBlock("Franchise", game.franchise)}
            {infoBlock("Game Engine", game.engine)}
            {infoBlock("Director", game.director)}
            {infoBlock("Composer", game.composer)}
            {infoBlock("Soundtrack", game.soundtrack)}
            {infoBlock("Estimated Playtime", game.estimatedPlaytime + " hours")}
            {infoBlock("Tags", game.tags?.join(", "))}
            {infoBlock("Cast", game.cast?.join(", "))}
            <div>
              <p className="text-gray-500 uppercase text-xs mb-1">Awards</p>
              {awardsPreview()}
            </div>
            {infoBlock("DLCs", game.dlcs?.join(", "))}
            {infoBlock("Inspired By", game.inspiration?.join(", "))}
            {infoBlock("Audio Languages", game.languages?.audio?.join(", "))}
            {infoBlock("Subtitles", game.languages?.subtitles?.join(", "))}
            {infoBlock("Interface Languages", game.languages?.interface?.join(", "))}
            {infoBlock("Content Warnings", game.contentWarnings?.join(", "))}
            {infoBlock("Age Ratings", game.ageRatings?.join(", "))}
            {infoBlock("System Requirements (Min)", game.systemRequirements?.minimum)}
            {infoBlock("System Requirements (Recommended)", game.systemRequirements?.recommended)}
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={toggleExpand}
              className="px-5 py-2 border border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black transition duration-200 font-bold tracking-wider uppercase rounded-md"
            >
              Hide Details Info
            </button>
          </div>
        </>
      )}
       
    </section>
   
  );
};

export default GameMetaInfo;