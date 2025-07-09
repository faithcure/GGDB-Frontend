// 📁 components/admin/GameEdit/TabCredits.jsx
import React from "react";
import Info from "./_Info";
import Input from "../../common/InputChips";
import InputList from "../../common/InputList";

const TabCredits = ({ game, formatList, editMode, formData, setFormData }) => {
  return (
    <div className="space-y-8 md:col-span-2">
      {/* 🎬 Yönetim */}
      <div>
        <h2 className="text-cyan-300 font-semibold text-lg mb-2">🎬 Director & Scenario</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {editMode ? (
            <>
              <Input label="Game Director" value={formData.director} onChange={(val) => setFormData({ ...formData, director: val })} />
              <InputList label="Writers / Scenario" values={formData.writers || []} onChange={(vals) => setFormData({ ...formData, writers: vals })} />
              <Input label="Art Director" value={formData.artDirector} onChange={(val) => setFormData({ ...formData, artDirector: val })} />
            </>
          ) : (
            <>
              <Info label="Game Director" value={game.director} />
              <Info label="Writers / Scenario" value={formatList(game.writers)} />
              <Info label="Art Director" value={game.artDirector} />
            </>
          )}
        </div>
      </div>

      {/* 🎭 Oyuncular */}
      <div>
        <h2 className="text-cyan-300 font-semibold text-lg mb-2">🎭 Cast & Voice</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {editMode ? (
            <>
              <InputList label="Lead Actors" values={formData.cast || []} onChange={(vals) => setFormData({ ...formData, cast: vals })} />
              <InputList label="Voice Actors" values={formData.voiceActors || []} onChange={(vals) => setFormData({ ...formData, voiceActors: vals })} />
            </>
          ) : (
            <>
              <Info label="Lead Actors" value={formatList(game.cast)} />
              <Info label="Voice Actors" value={formatList(game.voiceActors)} />
            </>
          )}
        </div>
      </div>

      {/* 🎼 Müzik & VFX */}
      <div>
        <h2 className="text-cyan-300 font-semibold text-lg mb-2">🎼 Music & Visual Effects</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {editMode ? (
            <>
              <Input label="Composer / Music" value={formData.composer} onChange={(val) => setFormData({ ...formData, composer: val })} />
              <InputList label="Cinematics / VFX Team" values={formData.vfxTeam || []} onChange={(vals) => setFormData({ ...formData, vfxTeam: vals })} />
            </>
          ) : (
            <>
              <Info label="Composer / Music" value={game.composer || game.soundtrack || "-"} />
              <Info label="Cinematics / VFX" value={formatList(game.vfxTeam)} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TabCredits;
