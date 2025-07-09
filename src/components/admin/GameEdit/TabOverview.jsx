// 📁 components/admin/GameEdit/TabOverview.jsx
import React from "react";
import Info from "./_Info";
import InputChips from "../../common/InputChips";

const TabOverview = ({ game, formatList, editMode, formData, setFormData }) => {
  return (
    <>
      {editMode ? (
        <>
          <Input label="Game Title" value={formData.title} onChange={(val) => setFormData({ ...formData, title: val })} />
          <Input label="Developer" value={formData.developer} onChange={(val) => setFormData({ ...formData, developer: val })} />
          <Input label="Publisher" value={formData.publisher} onChange={(val) => setFormData({ ...formData, publisher: val })} />
          <Input label="Studio" value={formData.studio} onChange={(val) => setFormData({ ...formData, studio: val })} />
          <Input label="Release Date" value={formData.releaseDate} onChange={(val) => setFormData({ ...formData, releaseDate: val })} />

          <InputChips
            label="Platforms"
            value={formData.platforms}
            onChange={(updated) => setFormData({ ...formData, platforms: updated })}
          />
          <InputChips
            label="Genres"
            value={formData.genres}
            onChange={(updated) => setFormData({ ...formData, genres: updated })}
          />
          <InputChips
            label="Tags"
            value={formData.tags}
            onChange={(updated) => setFormData({ ...formData, tags: updated })}
          />

          {/* 🎮 Estimated Playtime (Split) */}
          <div>
            <label className="text-gray-400 font-medium block mb-1">🕒 Estimated Playtime</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-gray-500 block mb-1">🎯 Main Story</label>
                <input
                  type="number"
                  value={formData.mainPlaytime || ""}
                  onChange={(e) => setFormData({ ...formData, mainPlaytime: e.target.value })}
                  placeholder="e.g. 10"
                  className="bg-gray-800 text-white p-2 rounded border border-gray-700 w-full"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">🧩 Extras</label>
                <input
                  type="number"
                  value={formData.extrasPlaytime || ""}
                  onChange={(e) => setFormData({ ...formData, extrasPlaytime: e.target.value })}
                  placeholder="e.g. 15"
                  className="bg-gray-800 text-white p-2 rounded border border-gray-700 w-full"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">🏆 Completionist</label>
                <input
                  type="number"
                  value={formData.completionPlaytime || ""}
                  onChange={(e) => setFormData({ ...formData, completionPlaytime: e.target.value })}
                  placeholder="e.g. 25"
                  className="bg-gray-800 text-white p-2 rounded border border-gray-700 w-full"
                />
              </div>
            </div>
          </div>

          <Input label="Metacritic Score" value={formData.metacriticScore} onChange={(val) => setFormData({ ...formData, metacriticScore: val })} />
          <Input
            label="GGDB Rating"
            value={game.ggdbRating ? Number(game.ggdbRating).toFixed(1) : "-"}
            onChange={() => {}}
            readOnly
            disabled
          />
        </>
      ) : (
        <>
          <Info label="Game Title" value={game.title} />
          <Info label="Developer" value={game.developer} />
          <Info label="Publisher" value={game.publisher} />
          <Info label="Studio" value={game.studio} />
          <Info label="Release Date" value={game.releaseDate} />
          <Info label="Platforms" value={formatList(game.platforms)} />
          <Info label="Genres" value={formatList(game.genres)} />
          <Info label="Tags" value={formatList(game.tags)} />

          <div className="space-y-1">
            <Info label="🕒 Main Story" value={game.mainPlaytime ? `${game.mainPlaytime}h` : "-"} />
            <Info label="🧩 Extras" value={game.extrasPlaytime ? `${game.extrasPlaytime}h` : "-"} />
            <Info label="🏆 Completionist" value={game.completionPlaytime ? `${game.completionPlaytime}h` : "-"} />
          </div>
          <div className="mt-6">
            <label className="text-gray-400 font-semibold block mb-2">🌟 GGDB Score Breakdown</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <Info label="Metacritic Score" value={game.metacriticScore ?? "-"} />
              <Info label="GGDB Rating" value={game.ggdbRating ? Number(game.ggdbRating).toFixed(1) : "-"} />
              <div className="mt-4 text-yellow-400 text-xl font-extrabold tracking-wide">
          </div>
        </div>
      </div>
        </>
      )}
    </>
  );
};

const Input = ({ label, value, onChange }) => (
  <div className="mb-3">
    <label className="text-gray-400 font-medium block mb-1">{label}</label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-gray-800 text-white p-2 rounded border border-gray-700 w-full"
    />
  </div>
);

export default TabOverview;
