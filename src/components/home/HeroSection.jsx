import React from "react";
import { FaUserPlus } from "react-icons/fa";

const JoinAsArtistSection = () => {
  return (
    <section className="bg-gradient-to-br from-yellow-50 via-white to-yellow-100 text-gray-900 py-24 px-6 text-center relative overflow-hidden">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
          Not every game is a masterpiece... <br className="hidden md:block" />
          but every creator is. ✨
        </h2>

        <p className="text-lg text-gray-700 mb-8">
          Show the world your genius. Join now and start building your own{" "}
          <strong className="text-yellow-600">gameography</strong> or{" "}
          <strong className="text-yellow-600">portfolio</strong> as a visionary artist, developer, or storyteller.
        </p>

        <a
          href="/register"
          className="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 px-8 py-3 rounded-full font-semibold text-lg hover:bg-yellow-300 transition shadow-md"
        >
          <FaUserPlus /> Join the Community
        </a>

        <div className="mt-6 text-sm text-gray-600">
          Already have an account? <a href="/login" className="text-yellow-600 underline">Log in</a>
        </div>
      </div>
    </section>
  );
};

export default JoinAsArtistSection;
