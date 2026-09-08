import React, { useState, useEffect, useMemo } from 'react';
import { GameItem, CategoryFilter } from './types';
import { Navbar } from './components/Navbar';
import { CategoryBar } from './components/CategoryBar';
import { GameCard } from './components/GameCard';
import { GamePlayer } from './components/GamePlayer';
import { JsonViewerModal } from './components/JsonViewerModal';
import { AddGameModal } from './components/AddGameModal';
import { Gamepad2, Sparkles, Filter, Code, HeartHandshake } from 'lucide-react';

export default function App() {
  const [games, setGames] = useState<GameItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [activeGame, setActiveGame] = useState<GameItem | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('unblocked_games_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isJsonModalOpen, setIsJsonModalOpen] = useState<boolean>(false);
  const [isAddGameOpen, setIsAddGameOpen] = useState<boolean>(false);

  // Load games from public/games.json
  const fetchGames = async () => {
    try {
      setLoading(true);
      const res = await fetch('/games.json');
      if (!res.ok) throw new Error('Failed to load games.json');
      const data: GameItem[] = await res.json();

      // Retrieve any custom user-added games from localStorage
      const customSaved = localStorage.getItem('unblocked_games_custom');
      const customGames: GameItem[] = customSaved ? JSON.parse(customSaved) : [];

      // Combine base games and custom games
      const merged = [...data, ...customGames];
      setGames(merged);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError('Could not load games list. Please ensure games.json is accessible.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('unblocked_games_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.warn('Unable to persist favorites:', e);
    }
  }, [favorites]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleAddGame = (newGame: GameItem) => {
    const updated = [newGame, ...games];
    setGames(updated);

    // Save custom games
    try {
      const customSaved = localStorage.getItem('unblocked_games_custom');
      const currentCustom: GameItem[] = customSaved ? JSON.parse(customSaved) : [];
      localStorage.setItem('unblocked_games_custom', JSON.stringify([newGame, ...currentCustom]));
    } catch (e) {
      console.warn(e);
    }

    setActiveGame(newGame);
  };

  const handleResetDefaults = async () => {
    localStorage.removeItem('unblocked_games_custom');
    await fetchGames();
    setIsJsonModalOpen(false);
  };

  const handleRandomGame = () => {
    if (games.length === 0) return;
    const randomIndex = Math.floor(Math.random() * games.length);
    setActiveGame(games[randomIndex]);
  };

  // Filtered games
  const filteredGames = useMemo(() => {
    return games.filter(game => {
      // Category filtering
      if (selectedCategory === 'Favorites') {
        if (!favorites.includes(game.id)) return false;
      } else if (selectedCategory !== 'All') {
        if (game.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
      }

      // Search query filtering
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = game.title.toLowerCase().includes(q);
        const matchesDesc = game.description.toLowerCase().includes(q);
        const matchesCat = game.category.toLowerCase().includes(q);
        const matchesTags = (game.tags || []).some(t => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesCat && !matchesTags) {
          return false;
        }
      }

      return true;
    });
  }, [games, selectedCategory, searchQuery, favorites]);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      Favorites: favorites.length,
    };
    games.forEach(g => {
      counts[g.category] = (counts[g.category] || 0) + 1;
    });
    return counts;
  }, [games, favorites]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950 font-sans antialiased">
      {/* Top Navigation */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onRandomGame={handleRandomGame}
        onOpenJsonView={() => setIsJsonModalOpen(true)}
        onOpenAddGame={() => setIsAddGameOpen(true)}
        totalGames={games.length}
        favoriteCount={favorites.length}
        currentCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Main Content */}
      <main className="flex-1">
        {activeGame ? (
          /* Active Game Player Stage */
          <GamePlayer
            game={activeGame}
            isFavorite={favorites.includes(activeGame.id)}
            onToggleFavorite={toggleFavorite}
            onClose={() => setActiveGame(null)}
            onSelectGame={setActiveGame}
            allGames={games}
          />
        ) : (
          /* Game Catalog Grid View */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
            {/* Quick Hero / Directory Banner */}
            <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 border border-slate-800 p-6 sm:p-8 overflow-hidden shadow-xl">
              <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(circle_at_70%_50%,rgba(16,185,129,0.15),transparent_70%)] pointer-events-none" />
              
              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Interactive Learning Laboratory • JSON Iframe Archive</span>
                </div>
                
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  Interactive STEM & Computational Models.
                </h1>
                
                <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
                  Explore discrete mathematics, physics dynamics, and spatial logic simulations embedded directly from JSON iframe definitions. Completely self-contained, high-performance experiential workbenches.
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    {games.length} Interactive Modules
                  </span>
                  <span>•</span>
                  <span>Full Screen Workbench</span>
                  <span>•</span>
                  <span>Custom Iframe Sandbox</span>
                </div>
              </div>
            </div>

            {/* Category Filter Pills */}
            <CategoryBar
              currentCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              categoryCounts={categoryCounts}
              totalCount={games.length}
            />

            {/* Catalog Header / Filter Status */}
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/60 pb-3">
              <div className="flex items-center gap-2 font-medium">
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                <span>
                  Showing <strong className="text-slate-200">{filteredGames.length}</strong> {selectedCategory === 'All' ? 'modules' : `${selectedCategory} modules`}
                  {searchQuery && ` matching "${searchQuery}"`}
                </span>
              </div>

              {(searchQuery || selectedCategory !== 'All') && (
                <button
                  id="reset-filter-btn"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
                >
                  Clear filters
                </button>
              )}
            </div>

            {/* Games Grid or Empty State */}
            {loading ? (
              <div className="py-20 text-center">
                <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm text-slate-400">Loading interactive modules catalog...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center bg-rose-500/10 border border-rose-500/30 rounded-xl">
                <p className="text-sm text-rose-300 font-semibold">{error}</p>
                <button
                  onClick={fetchGames}
                  className="mt-3 px-4 py-2 bg-rose-500 text-white rounded-lg text-xs font-bold"
                >
                  Retry Loading
                </button>
              </div>
            ) : filteredGames.length === 0 ? (
              <div className="py-16 text-center bg-slate-900/40 border border-slate-800/80 rounded-2xl">
                <Gamepad2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-200">No modules found</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  No simulations match your current filter or search criteria. Try a different query or add a custom module.
                </p>
                <div className="mt-4 flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
                  >
                    Show All Modules
                  </button>
                  <button
                    onClick={() => setIsAddGameOpen(true)}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-500 text-slate-950 hover:bg-emerald-400 text-xs font-bold cursor-pointer"
                  >
                    Add Custom Module
                  </button>
                </div>
              </div>
            ) : (
              <div 
                id="games-catalog-grid"
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
              >
                {filteredGames.map(game => (
                  <GameCard
                    key={game.id}
                    game={game}
                    isFavorite={favorites.includes(game.id)}
                    onToggleFavorite={toggleFavorite}
                    onPlay={setActiveGame}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 mt-12 py-6 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-300 tracking-tight">
              EDULAB<span className="text-emerald-400">INTERACTIVE</span>
            </span>
            <span>•</span>
            <span>STEM & Computational Learning Modules</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsJsonModalOpen(true)}
              className="hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Code className="w-3.5 h-3.5" />
              <span>View modules.json</span>
            </button>
            <span>•</span>
            <span>Fast, zero-latency Sandboxes</span>
          </div>
        </div>
      </footer>

      {/* JSON Viewer Modal */}
      <JsonViewerModal
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
        games={games}
        onResetDefaults={handleResetDefaults}
      />

      {/* Add Game Modal */}
      <AddGameModal
        isOpen={isAddGameOpen}
        onClose={() => setIsAddGameOpen(false)}
        onAddGame={handleAddGame}
      />
    </div>
  );
}
