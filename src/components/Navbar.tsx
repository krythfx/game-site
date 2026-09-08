import React from 'react';
import { Atom, Search, Shuffle, Code2, PlusCircle, Heart } from 'lucide-react';
import { CategoryFilter } from '../types';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onRandomGame: () => void;
  onOpenJsonView: () => void;
  onOpenAddGame: () => void;
  totalGames: number;
  favoriteCount: number;
  currentCategory: CategoryFilter;
  onSelectCategory: (cat: CategoryFilter) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  onRandomGame,
  onOpenJsonView,
  onOpenAddGame,
  totalGames,
  favoriteCount,
  currentCategory,
  onSelectCategory,
}) => {
  return (
    <header id="site-header" className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              id="brand-home-btn"
              onClick={() => {
                onSelectCategory('All');
                onSearchChange('');
              }}
              className="flex items-center gap-2.5 group text-left cursor-pointer focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Atom className="w-6 h-6 text-slate-950 stroke-[2.5]" />
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
                  EDULAB<span className="text-emerald-400">INTERACTIVE</span>
                </span>
                <p className="text-[11px] text-slate-400 font-medium">STEM & Computational Modules ({totalGames})</p>
              </div>
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md hidden sm:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="search-input"
                type="text"
                placeholder="Search simulations, concepts, tags..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
              {searchQuery && (
                <button
                  id="clear-search-btn"
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300 px-1"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              id="favorites-filter-btn"
              onClick={() => onSelectCategory(currentCategory === 'Favorites' ? 'All' : 'Favorites')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                currentCategory === 'Favorites'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
              title="Saved Favorites"
            >
              <Heart className={`w-3.5 h-3.5 ${currentCategory === 'Favorites' ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
              <span className="hidden md:inline">Favorites</span>
              {favoriteCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 bg-rose-500 text-[10px] text-white font-bold rounded-full">
                  {favoriteCount}
                </span>
              )}
            </button>

            <button
              id="random-game-btn"
              onClick={onRandomGame}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-slate-300 border border-slate-800 hover:border-emerald-500/50 hover:text-emerald-400 transition-all cursor-pointer"
              title="Launch a random simulation"
            >
              <Shuffle className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">Surprise Me</span>
            </button>

            <button
              id="view-json-btn"
              onClick={onOpenJsonView}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-slate-300 border border-slate-800 hover:border-cyan-500/50 hover:text-cyan-400 transition-all cursor-pointer"
              title="View modules manifest stored iframes"
            >
              <Code2 className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden lg:inline">JSON Iframes</span>
            </button>

            <button
              id="add-game-btn"
              onClick={onOpenAddGame}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors shadow-sm shadow-emerald-500/20 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Module</span>
            </button>
          </div>
        </div>

        {/* Mobile Search input */}
        <div className="pb-3 sm:hidden">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="mobile-search-input"
              type="text"
              placeholder="Search simulations..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
