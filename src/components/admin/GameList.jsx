// Gamelist
import React, { useEffect, useState, useMemo } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import AddGame from "./AddGame";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../../config/api";

const GameList = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ developer: "", platform: "", genre: "", sort: "desc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);


  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/games`);
        const data = res.data?.data || res.data;
        if (Array.isArray(data)) {
          setGames(data);
        } else {
          console.warn("Unexpected response structure:", res.data);
          setGames([]);
        }
      } catch (err) {
        console.error("Failed to fetch games", err);
        setGames([]);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  const formatList = (items) => Array.isArray(items) ? items.join(", ") : "-";
  const truncate = (text, len = 40) => (text?.length > len ? text.slice(0, len) + "..." : text);

  const toggleSelectOne = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(gid => gid !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
      setSelectAll(false);
    } else {
      const ids = pagedGames.map(g => g._id);
      setSelectedIds(ids);
      setSelectAll(true);
    }
  };

  const handleDelete = async (gameId) => {
    const confirm = window.confirm("Are you sure you want to delete this game?");
    if (!confirm) return;
    try {
      await axios.delete(`${API_BASE}/api/games/${gameId}`);
      setGames(prev => prev.filter(game => game._id !== gameId));
      toast.success("Game deleted successfully");
    } catch (err) {
      console.error("Error deleting game", err);
      toast.error("Failed to delete game");
    }
  };

  const handleBulkDelete = async () => {
    const confirm = window.confirm(`Delete ${selectedIds.length} selected games?`);
    if (!confirm) return;
    try {
      await Promise.all(
        selectedIds.map(id => axios.delete(`${API_BASE}/api/games/${id}`))
      );
      setGames(prev => prev.filter(game => !selectedIds.includes(game._id)));
      setSelectedIds([]);
      setSelectAll(false);
      toast.success("Selected games deleted");
    } catch (err) {
      console.error("Bulk delete error", err);
      toast.error("Failed to delete selected games");
    }
  };

  const filteredGames = useMemo(() => {
    if (!Array.isArray(games)) return [];
    let result = games.filter(game => {
      const matchTitle = game.title?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchDev = filters.developer ? game.developer === filters.developer : true;
      const matchPlat = filters.platform ? (game.platforms || []).includes(filters.platform) : true;
      const matchGenre = filters.genre ? (game.genres || []).includes(filters.genre) : true;
      return matchTitle && matchDev && matchPlat && matchGenre;
    });

    result.sort((a, b) => {
      const dateA = new Date(a.releaseDate);
      const dateB = new Date(b.releaseDate);
      return filters.sort === "asc" ? dateA - dateB : dateB - dateA;
    });

    return result;
  }, [games, searchTerm, filters]);

  const pagedGames = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredGames.slice(start, start + itemsPerPage);
  }, [filteredGames, currentPage, itemsPerPage]);

  const uniqueOptions = (field, flat = false) => {
    if (!Array.isArray(games)) return [];
    try {
      const data = flat
        ? games.flatMap(g => Array.isArray(g[field]) ? g[field] : [])
        : games.map(g => g[field]).filter(Boolean);
      return [...new Set(data)];
    } catch (e) {
      console.warn("uniqueOptions error:", e);
      return [];
    }
  };

  if (loading) return <p className="text-white">Loading games...</p>;

  return (
    <div className="text-white">
      <h2 className="text-2xl font-bold mb-6">Game Database</h2>

      {/* filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
        <input type="text" placeholder="Search title..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-gray-700 px-4 py-2 rounded" />
        <select onChange={(e) => setFilters(f => ({ ...f, developer: e.target.value }))} className="bg-gray-700 px-4 py-2 rounded">
          <option value="">All Developers</option>
          {uniqueOptions("developer").map(dev => <option key={dev}>{dev}</option>)}
        </select>
        <select onChange={(e) => setFilters(f => ({ ...f, platform: e.target.value }))} className="bg-gray-700 px-4 py-2 rounded">
          <option value="">All Platforms</option>
          {uniqueOptions("platforms", true).map(p => <option key={p}>{p}</option>)}
        </select>
        <select onChange={(e) => setFilters(f => ({ ...f, genre: e.target.value }))} className="bg-gray-700 px-4 py-2 rounded">
          <option value="">All Genres</option>
          {uniqueOptions("genres", true).map(g => <option key={g}>{g}</option>)}
        </select>
        <select onChange={(e) => setFilters(f => ({ ...f, sort: e.target.value }))} className="bg-gray-700 px-4 py-2 rounded">
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
        <div className="text-sm text-yellow-400 font-semibold">
          Total: {games.length} games
        </div>
      </div>

      {/* table */}
      <div className="overflow-x-auto bg-gray-800 rounded shadow-md">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-700">
            <tr className="text-left text-xs">
              <th className="px-3 py-2">
                <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} />
              </th>
              <th className="px-3 py-2">Cover</th>
              <th className="px-3 py-2">Title</th>
              <th className="px-3 py-2">Release</th>
              <th className="px-3 py-2">Studio</th>
              <th className="px-3 py-2">Genres</th>
              <th className="px-3 py-2">Story</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pagedGames.map((game) => (
              <tr
                key={game._id}
                className="border-t border-gray-700 hover:bg-gray-700 cursor-pointer"
                onClick={() => navigate(`/admin/view/${game._id}`)}
              >
                <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(game._id)}
                    onChange={() => toggleSelectOne(game._id)}
                  />
                </td>
                <td className="px-3 py-2"><img src={game.coverImage} alt="cover" className="w-10 h-14 object-cover rounded" /></td>
                <td className="px-3 py-2">{truncate(game.title)}</td>
                <td className="px-3 py-2">{game.releaseDate}</td>
                <td className="px-3 py-2">{truncate(game.studio)}</td>
                <td className="px-3 py-2">{truncate(formatList(game.genres))}</td>
                <td className="px-3 py-2">{truncate(game.story)}</td>
                <td className="px-3 py-2 flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => { setSelectedGame(game); setShowEditModal(true); }} className="text-blue-400 hover:scale-110"><FaEdit /></button>
                  <button onClick={() => handleDelete(game._id)} className="text-red-400 hover:scale-110"><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


{/* Pagination */}
<div className="flex items-center justify-between mt-4">
  <div className="flex items-center gap-2">
    <label htmlFor="perPage">Rows per page:</label>
    <select
      id="perPage"
      value={itemsPerPage}
      onChange={(e) => setItemsPerPage(Number(e.target.value))}
      className="bg-gray-800 border border-gray-600 rounded px-2 py-1"
    >
      {[5, 10, 20, 50].map((num) => (
        <option key={num} value={num}>{num}</option>
      ))}
    </select>
  </div>
  <div className="flex items-center gap-2">
    <button
      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
      disabled={currentPage === 1}
      className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
    >
      Prev
    </button>
    <span>Page {currentPage} of {Math.ceil(filteredGames.length / itemsPerPage)}</span>
    <button
      onClick={() => setCurrentPage((p) => Math.min(p + 1, Math.ceil(filteredGames.length / itemsPerPage)))}
      disabled={currentPage === Math.ceil(filteredGames.length / itemsPerPage)}
      className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
    >
      Next
    </button>
  </div>
</div>


      {/* add button */}
    <div className="mt-6 flex gap-4 items-center">  
      <button
        disabled={selectedIds.length === 0}
        onClick={handleBulkDelete}
        className={`px-4 py-2 rounded shadow font-bold transition
          ${selectedIds.length > 0
            ? "bg-red-600 text-white hover:bg-red-500"
            : "bg-gray-700 text-gray-400 cursor-not-allowed"}`}
      >
        Delete Selected{selectedIds.length > 0 ? ` (${selectedIds.length})` : ""}
      </button>

  <button
    onClick={() => setShowAddModal(true)}
    className="bg-yellow-400 text-black font-bold px-4 py-2 rounded shadow hover:bg-yellow-300"
  >
    Add Game
  </button>
</div>


      {/* modals */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg w-full max-w-7xl relative">
            <button onClick={() => setShowAddModal(false)} className="absolute top-2 right-2 text-white text-xl">&times;</button>
            <AddGame
              existingTitles={Array.isArray(games) ? games.map(g => g.title.toLowerCase()) : []}
              onGameAdded={(newGame) => {
                const exists = Array.isArray(games) && games.some(g => g.title.toLowerCase() === newGame.title.toLowerCase());
                if (exists) {
                  toast.warn("A game with this title already exists!");
                  return;
                }
                setGames(prev => [newGame, ...prev]);
                setShowAddModal(false);
                toast.success("Game added successfully");
              }}
            />
          </div>
        </div>
      )}


    </div>
  );
};

export default GameList;
