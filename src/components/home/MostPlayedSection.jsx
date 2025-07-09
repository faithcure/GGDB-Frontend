import React from "react";

const mostPlayed = [
  {
    title: "Counter-Strike 2",
    players: "782K",
    image: "https://picsum.photos/300/180?random=21",
  },
  {
    title: "Dota 2",
    players: "621K",
    image: "https://picsum.photos/300/180?random=22",
  },
  {
    title: "PUBG: Battlegrounds",
    players: "398K",
    image: "https://picsum.photos/300/180?random=23",
  },
  {
    title: "Apex Legends",
    players: "362K",
    image: "https://picsum.photos/300/180?random=24",
  },
];

const MostPlayedSection = () => {
  return (
    <section className="bg-gray-900 text-white px-4 py-16">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-green-400 mb-2">🔥 Most Played Games</h2>
        <p className="text-sm text-gray-400 mb-8">
          Real-time popular titles based on active players.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {mostPlayed.map((game, idx) => (
            <div key={idx} className="relative rounded-lg overflow-hidden group shadow-md hover:shadow-xl transition">
              <img
                src={game.image}
                alt={game.title}
                className="w-full h-[180px] object-cover group-hover:brightness-75 transition"
              />
              <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/60 to-transparent">
                <h3 className="text-lg font-semibold">{game.title}</h3>
                <div className="text-sm text-green-400">{game.players} players online</div>
              </div>
              <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded hidden group-hover:block">
                Now Playing
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MostPlayedSection;
