import React, { useState } from 'react';
import { GameItem } from '../types';
import { X, Copy, Check, Download, FileCode, CheckCircle2 } from 'lucide-react';

interface JsonViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  games: GameItem[];
  onResetDefaults: () => void;
}

export const JsonViewerModal: React.FC<JsonViewerModalProps> = ({
  isOpen,
  onClose,
  games,
  onResetDefaults,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'json' | 'docs'>('json');

  if (!isOpen) return null;

  const jsonString = JSON.stringify(games, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'modules.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div id="json-viewer-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <FileCode className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">modules.json Data Store</h3>
              <p className="text-xs text-slate-400">Each module is stored as an Iframe tag inside the JSON file</p>
            </div>
          </div>

          <button
            id="close-json-modal-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation & Action Bar */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-slate-950/60 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('json')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'json'
                  ? 'bg-slate-800 text-cyan-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Raw JSON ({games.length} Modules)
            </button>
            <button
              onClick={() => setActiveTab('docs')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'docs'
                  ? 'bg-slate-800 text-emerald-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              How It Works
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="copy-json-full-btn"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>

            <button
              id="download-json-btn"
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 flex-1 overflow-y-auto">
          {activeTab === 'json' ? (
            <pre className="p-4 bg-slate-950 border border-slate-800/80 rounded-xl text-xs font-mono text-cyan-300 leading-relaxed overflow-x-auto selection:bg-cyan-900/40">
              {jsonString}
            </pre>
          ) : (
            <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <h4 className="font-bold text-white mb-1 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Storing Modules as Iframes in JSON
                </h4>
                <p className="text-xs text-slate-400">
                  Every module definition contains an <code className="text-cyan-300">"iframe"</code> property storing the complete HTML iframe tag or URL:
                </p>
                <div className="mt-2.5 p-3 bg-slate-900 rounded-lg border border-slate-800 font-mono text-xs text-amber-300">
                  {`"iframe": "<iframe src=\\"/simulations/snake.html\\" title=\\"Coordinate Grid Traversal\\" width=\\"100%\\" height=\\"100%\\" frameborder=\\"0\\" allowfullscreen=\\"true\\"></iframe>"`}
                </div>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <h4 className="font-bold text-white mb-1">JSON Schema Attributes</h4>
                <ul className="text-xs space-y-1.5 text-slate-400 list-disc list-inside mt-2">
                  <li><strong className="text-slate-200">id</strong>: Unique string identifier</li>
                  <li><strong className="text-slate-200">title</strong>: Module display title</li>
                  <li><strong className="text-slate-200">category</strong>: Arcade, Puzzle, Action, Sports, Classic</li>
                  <li><strong className="text-slate-200">description</strong>: Overview of simulation objectives</li>
                  <li><strong className="text-slate-200">iframe</strong>: Complete embed code or link</li>
                  <li><strong className="text-slate-200">controls</strong>: Array of user keybindings</li>
                </ul>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-400">Want to reset any custom added modules back to defaults?</span>
                <button
                  id="reset-defaults-btn"
                  onClick={onResetDefaults}
                  className="px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 text-xs font-bold transition-colors cursor-pointer"
                >
                  Reset to Original JSON
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors cursor-pointer"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
