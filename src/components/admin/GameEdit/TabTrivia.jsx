// 📁 components/admin/GameEdit/TabTrivia.jsx
import React from "react";

const TabTrivia = ({ game, editMode }) => {
  return (
    <div className="md:col-span-2">
      {editMode ? (
        <textarea
          defaultValue={game.trivia?.join("\n") || ""}
          placeholder="Enter trivia items (one per line)"
          className="bg-gray-800 text-white p-4 rounded border border-gray-700 w-full min-h-[160px]"
        />
      ) : (
        game.trivia?.length ? (
          <ul className="list-disc pl-5 space-y-2">
            {game.trivia.map((fact, idx) => (
              <li key={idx} className="text-gray-300">
                {fact}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No trivia available.</p>
        )
      )}
    </div>
  );
};

export default TabTrivia;