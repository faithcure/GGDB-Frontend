// 📁 components/admin/GameEdit/TabReview.jsx
import React from "react";

const TabReview = ({ game, editMode }) => {
  return (
    <div className="md:col-span-2">
      {editMode ? (
        <textarea
          defaultValue={game.reviews?.join("\n\n") || ""}
          placeholder="Enter review content..."
          className="bg-gray-800 text-white p-4 rounded border border-gray-700 w-full min-h-[200px]"
        />
      ) : (
        <div className="space-y-4">
          {game.reviews?.length ? (
            game.reviews.map((r, i) => (
              <p key={i} className="text-gray-300 bg-gray-800 p-4 rounded border border-gray-700">
                {r}
              </p>
            ))
          ) : (
            <p className="text-gray-500">No reviews available yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TabReview;
