// src/components/game/StoreLinks.jsx
import React from "react";
import {
  FaSteam,
  FaWindows,
  FaStore,
  FaAmazon,
  FaItchIo,
  FaPlaystation,
  FaXbox,
  FaApple,
} from "react-icons/fa";
import { SiNintendo, SiUbisoft, SiEa } from "react-icons/si";

const storeIcons = {
  steam: FaSteam,
  epicgames: FaStore,
  gog: FaWindows,
  amazon: FaAmazon,
  amazongames: FaAmazon,
  itchio: FaItchIo,
  playstationstore: FaPlaystation,
  ps: FaPlaystation,
  xbox: FaXbox,
  xboxstore: FaXbox,
  microsoftstore: FaWindows,
  apple: FaApple,
  appstore: FaApple,
  nintendo: SiNintendo,
  nintendoeshop: SiNintendo,
  nintendostore: SiNintendo,
  ubisoft: SiUbisoft,
  uplay: SiUbisoft,
  ea: SiEa,
  eagames: SiEa,
};

const getNormalizedKey = (name = "") =>
  name.toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9]/g, "");

const StoreLinks = ({ gameTitle, links }) => {
  const hasLinks = links && links.length > 0;

  return (
    <section className="max-w-7xl mx-auto px-6 py-10 border-t border-gray-800">
      <h2 className="text-2xl font-bold text-white mb-6">Buy This Game</h2>

      {hasLinks ? (
        <div className="flex flex-wrap gap-4">
          {links.map((store, index) => {
            const normalized = getNormalizedKey(store.platform || store.name);
            const Icon = storeIcons[normalized];

            return (
              <a
                key={index}
                href={store.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-4 py-2 rounded-md border border-gray-600 bg-gray-900/40 backdrop-blur-sm text-white hover:border-yellow-400 hover:text-yellow-300 transition-all duration-200"
              >
                {Icon && <Icon className="text-lg" />}
                <span className="font-medium">{store.platform || store.name}</span>
              </a>
            );
          })}
        </div>
      ) : (
        <div className="bg-gray-800 p-4 rounded text-gray-300 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <p className="mb-3 sm:mb-0">No purchase links available.</p>
          <a
            href={`https://www.google.com/search?q=buy+${encodeURIComponent(
              gameTitle
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-yellow-500 text-black rounded hover:bg-yellow-400 transition"
          >
            🔍 Search on Google
          </a>
        </div>
      )}
    </section>
  );
};

export default StoreLinks;
