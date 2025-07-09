// 📁 components/admin/GameEdit/CoverImage.jsx
import React from "react";

const CoverImage = ({ coverImage }) => {
  if (!coverImage) return null;

  return (
    <div className="mb-8 -mt-6">
      {coverImage.endsWith(".mp4") ? (
        <video
          src={coverImage}
          className="w-full max-h-[420px] object-cover rounded-lg shadow-lg"
          autoPlay
          muted
          loop
        />
      ) : (
        <img
          src={coverImage}
          alt="Cover"
          className="w-full max-h-[420px] object-cover rounded-lg shadow-lg"
        />
      )}
    </div>
  );
};

export default CoverImage;
