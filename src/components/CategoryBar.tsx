import React from 'react';
import { CategoryFilter } from '../types';
import { LayoutGrid, Flame, Puzzle, Crosshair, Trophy, Sparkles, Heart } from 'lucide-react';

interface CategoryBarProps {
  currentCategory: CategoryFilter;
  onSelectCategory: (cat: CategoryFilter) => void;
  categoryCounts: Record<string, number>;
  totalCount: number;
}

const CATEGORIES: { id: CategoryFilter; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'All', label: 'All Modules', icon: LayoutGrid },
  { id: 'Arcade', label: 'Arcade', icon: Flame },
  { id: 'Puzzle', label: 'Puzzle', icon: Puzzle },
  { id: 'Action', label: 'Action', icon: Crosshair },
  { id: 'Sports', label: 'Sports', icon: Trophy },
  { id: 'Classic', label: 'Classic', icon: Sparkles },
  { id: 'Favorites', label: 'Favorites', icon: Heart },
];

export const CategoryBar: React.FC<CategoryBarProps> = ({
  currentCategory,
  onSelectCategory,
  categoryCounts,
  totalCount,
}) => {
  return (
    <div id="category-bar" className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {CATEGORIES.map((cat) => {
        const Icon = cat.icon;
        const isActive = currentCategory === cat.id;
        const count = cat.id === 'All' 
          ? totalCount 
          : cat.id === 'Favorites'
          ? (categoryCounts['Favorites'] || 0)
          : (categoryCounts[cat.id] || 0);

        return (
          <button
            key={cat.id}
            id={`category-btn-${cat.id.toLowerCase()}`}
            onClick={() => onSelectCategory(cat.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
              isActive
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40 shadow-sm shadow-emerald-500/10'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
            <span>{cat.label}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'
            }`}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
