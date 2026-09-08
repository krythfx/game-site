import React from 'react';
import { GameItem } from '../types';
import { Play, Heart, Flame, Atom, Sparkles, Trophy, Puzzle, Crosshair } from 'lucide-react';

interface GameCardProps {
  game: GameItem;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onPlay: (game: GameItem) => void;
}

export const GameCard: React.FC<GameCardProps> = ({
  game,
  isFavorite,
  onToggleFavorite,
  onPlay,
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Arcade': return <Flame className="w-3.5 h-3.5" />;
      case 'Puzzle': return <Puzzle className="w-3.5 h-3.5" />;
      case 'Action': return <Crosshair className="w-3.5 h-3.5" />;
      case 'Sports': return <Trophy className="w-3.5 h-3.5" />;
      default: return <Sparkles className="w-3.5 h-3.5" />;
    }
  };

  const themeColor = game.themeColor || '#10b981';

  return (
    <div
      id={`game-card-${game.id}`}
      onClick={() => onPlay(game)}
      className="group relative flex flex-col bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-950/20 cursor-pointer"
    >
      {/* Visual Header / Banner */}
      <div 
        className="relative h-36 w-full flex items-center justify-center overflow-hidden"
        style={{
          background: `radial-gradient(circle at 50% 30%, ${themeColor}22 0%, #020617 85%)`
        }}
      >
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Big Module Icon */}
        <div 
          className="relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
          style={{
            backgroundColor: `${themeColor}20`,
            border: `1px solid ${themeColor}50`,
            boxShadow: `0 8px 24px ${themeColor}25`
          }}
        >
          <Atom className="w-8 h-8" style={{ color: themeColor }} />
        </div>

        {/* Badge */}
        {game.badge && (
          <span 
            className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide shadow-sm"
            style={{
              backgroundColor: `${themeColor}25`,
              color: themeColor,
              border: `1px solid ${themeColor}40`
            }}
          >
            {game.badge}
          </span>
        )}

        {/* Favorite Button */}
        <button
          id={`favorite-btn-${game.id}`}
          onClick={(e) => onToggleFavorite(game.id, e)}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-slate-950/60 backdrop-blur-sm border border-slate-700/60 flex items-center justify-center text-slate-400 hover:text-rose-400 hover:scale-110 transition-all cursor-pointer"
          title={isFavorite ? "Remove from favorites" : "Save to favorites"}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Hover Launch Overlay */}
        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 backdrop-blur-[2px] flex items-center justify-center transition-opacity duration-200">
          <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/30 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>LAUNCH NOW</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Status */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1.5">
            {getCategoryIcon(game.category)}
            <span>{game.category}</span>
            {game.isCustom && (
              <span className="ml-auto text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-semibold">
                Custom
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-bold text-slate-100 text-base leading-snug group-hover:text-emerald-400 transition-colors">
            {game.title}
          </h3>

          {/* Description */}
          <p className="mt-1.5 text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {game.description}
          </p>
        </div>

        {/* Tags */}
        <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex flex-wrap gap-1.5">
          {(game.tags || []).slice(0, 3).map((tag, i) => (
            <span
              key={i}
              className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
