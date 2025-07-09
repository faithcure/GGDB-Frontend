// 📁 components/admin/GameEdit/TabCreative.jsx
import React from "react";
import Info from "./_Info";

const TabCreative = ({ game, formatList, editMode, formData, setFormData }) => {
  return (
    <>
      {editMode ? (
        <>
          <Input label="Franchise" value={formData.franchise} onChange={(val) => setFormData({ ...formData, franchise: val })} />
          <Input label="Game Engine" value={formData.engine} onChange={(val) => setFormData({ ...formData, engine: val })} />
          <Input label="Director" value={formData.director} onChange={(val) => setFormData({ ...formData, director: val })} />
          <Input label="Composer" value={formData.composer} onChange={(val) => setFormData({ ...formData, composer: val })} />
          <Input label="Soundtrack / Music" value={formData.soundtrack} onChange={(val) => setFormData({ ...formData, soundtrack: val })} />
          <Input label="Cast" value={formData.cast?.join(", ")} onChange={(val) => setFormData({ ...formData, cast: val.split(",").map(s => s.trim()) })} />
          <Input label="Inspired By" value={formData.inspiration?.join(", ")} onChange={(val) => setFormData({ ...formData, inspiration: val.split(",").map(s => s.trim()) })} />
          <Input label="DLCs" value={formData.dlcs?.join(", ")} onChange={(val) => setFormData({ ...formData, dlcs: val.split(",").map(s => s.trim()) })} />
         

          <div className="md:col-span-2">
            <label className="text-gray-400 font-medium block mb-1">Story</label>
            <textarea
              value={formData.story || ""}
              onChange={(e) => setFormData({ ...formData, story: e.target.value })}
              className="bg-gray-800 text-white p-3 rounded border border-gray-700 w-full min-h-[120px]"
            />
          </div>
        </>
      ) : (
        <>
          <Info label="Franchise" value={game.franchise} />
          <Info label="Game Engine" value={game.engine} />
          <Info label="Director" value={game.director} />
          <Info label="Composer" value={game.composer} />
          <Info label="Soundtrack / Music" value={game.soundtrack} />
          <Info label="Cast" value={formatList(game.cast)} />
          <Info label="Inspired By" value={formatList(game.inspiration)} />
          <Info label="DLCs" value={formatList(game.dlcs)} />

          <div className="md:col-span-2">
            <label className="text-gray-400 font-medium">Story</label>
            <p className="bg-gray-800 p-4 rounded border border-gray-700 whitespace-pre-line leading-relaxed text-justify mt-1">
              {game.story || "-"}
            </p>
          </div>
        </>
      )}
    </>
  );
};

const Input = ({ label, value, onChange }) => (
  <div>
    <label className="text-gray-400 font-medium block mb-1">{label}</label>
    <input
      type="text"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="bg-gray-800 text-white p-2 rounded border border-gray-700 w-full"
    />
  </div>
);

export default TabCreative;
