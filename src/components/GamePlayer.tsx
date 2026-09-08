import React, { useState, useRef, useEffect } from 'react';
import { GameItem } from '../types';
import { extractIframeSrc } from '../utils/iframeParser';
import { 
  ArrowLeft, 
  Maximize2, 
  Minimize2, 
  RotateCw, 
  ExternalLink, 
  Heart, 
  Info, 
  Keyboard, 
  Code2, 
  Share2,
  Check,
  Atom
} from 'lucide-react';

interface GamePlayerProps {
  game: GameItem;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onClose: () => void;
  onSelectGame: (game: GameItem) => void;
  allGames: GameItem[];
}

export const GamePlayer: React.FC<GamePlayerProps> = ({
  game,
  isFavorite,
  onToggleFavorite,
  onClose,
  onSelectGame,
  allGames,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [showIframeCode, setShowIframeCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const iframeSrc = extractIframeSrc(game.iframe);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.warn('Fullscreen error:', err);
      });
    } else {
      document.exitFullscreen().catch(err => {
        console.warn('Exit fullscreen error:', err);
      });
    }
  };

  const handleReload = () => {
    setIframeKey(prev => prev + 1);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(game.iframe);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const otherGames = allGames.filter(g => g.id !== game.id).slice(0, 4);

  return (
    <div id="game-player-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* Top Navigation & Controls Bar */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <button
          id="back-to-games-btn"
          onClick={onClose}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-xs font-bold transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Reload Button */}
          <button
            id="reload-game-btn"
            onClick={handleReload}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100 hover:border-slate-700 transition-colors cursor-pointer"
            title="Reload Simulation Frame"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          {/* Fullscreen Button */}
          <button
            id="fullscreen-game-btn"
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-emerald-400 hover:border-slate-700 transition-colors cursor-pointer"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Workbench"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Open in New Window */}
          {iframeSrc && (
            <a
              id="open-new-tab-btn"
              href={iframeSrc}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-slate-700 transition-colors inline-flex items-center justify-center cursor-pointer"
              title="Open simulation in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}

          {/* Favorite Button */}
          <button
            id="player-favorite-btn"
            onClick={(e) => onToggleFavorite(game.id, e)}
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              isFavorite
                ? 'bg-rose-500/10 border-rose-500/40 text-rose-400'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-rose-400'
            }`}
            title={isFavorite ? "In Favorites" : "Add to Favorites"}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Primary Game Stage / Frame Container */}
      <div
        ref={containerRef}
        id="game-iframe-stage"
        className={`relative w-full bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl transition-all ${
          isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none' : 'h-[540px] sm:h-[620px]'
        }`}
      >
        {/* If in fullscreen mode, show overlay exit button */}
        {isFullscreen && (
          <button
            id="exit-fullscreen-btn"
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 z-50 px-3 py-1.5 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-700 text-slate-200 text-xs font-bold hover:bg-slate-900 cursor-pointer flex items-center gap-1.5 shadow-lg"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span>Exit Fullscreen</span>
          </button>
        )}

        {/* Embedded Iframe */}
        {iframeSrc ? (
          <iframe
            key={iframeKey}
            src={iframeSrc}
            title={game.title}
            className="w-full h-full border-0 block"
            allow="fullscreen; autoplay"
            allowFullScreen={true}
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            loading="eager"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
            <Atom className="w-12 h-12 text-slate-600 mb-3" />
            <p className="text-slate-400 text-sm">No valid iframe source found in JSON for this module.</p>
          </div>
        )}
      </div>

      {/* Game Information & Controls Guide */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Details & Controls */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header & Meta */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  {game.title}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {game.category}
                </span>
                {game.badge && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300">
                    {game.badge}
                  </span>
                )}
              </div>

              {game.author && (
                <span className="text-xs text-slate-400 font-medium">
                  By {game.author}
                </span>
              )}
            </div>

            <p className="text-sm text-slate-300 leading-relaxed mt-2">
              {game.description}
            </p>

            {/* Tags */}
            <div className="mt-4 flex flex-wrap gap-2">
              {(game.tags || []).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800/80 text-slate-400 border border-slate-700/50"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Controls Instructions (from JSON) */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3 text-slate-200 font-bold text-sm">
              <Keyboard className="w-4 h-4 text-emerald-400" />
              <span>Interactive Controls & Guide</span>
            </div>

            {game.controls && game.controls.length > 0 ? (
              <ul className="space-y-2">
                {game.controls.map((ctrl, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>{ctrl}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-400">Use standard mouse click or arrow keys to interact with this simulation.</p>
            )}
          </div>

          {/* Stored Iframe JSON Snippet */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-slate-200 font-bold text-sm">
                <Code2 className="w-4 h-4 text-cyan-400" />
                <span>Stored Iframe Tag in JSON</span>
              </div>
              <button
                id="copy-iframe-btn"
                onClick={handleCopyCode}
                className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Tag'}</span>
              </button>
            </div>

            <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-cyan-300 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
              {game.iframe}
            </pre>
          </div>
        </div>

        {/* Right Col: More Modules Recommendations */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-200 text-sm tracking-wide uppercase flex items-center gap-2">
            <Atom className="w-4 h-4 text-emerald-400" />
            <span>More Interactive Modules</span>
          </h3>

          <div className="space-y-3">
            {otherGames.map(item => (
              <div
                key={item.id}
                onClick={() => onSelectGame(item)}
                className="flex items-center gap-3 p-3 bg-slate-900/70 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/80 rounded-xl cursor-pointer transition-all group"
              >
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0 border border-slate-700/50"
                  style={{ backgroundColor: `${item.themeColor || '#10b981'}15` }}
                >
                  <Atom className="w-6 h-6" style={{ color: item.themeColor || '#10b981' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-slate-200 group-hover:text-emerald-400 truncate transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate">{item.category} • {item.badge || 'Module'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
