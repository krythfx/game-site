import React, { useState } from 'react';
import { GameItem } from '../types';
import { createIframeString } from '../utils/iframeParser';
import { X, Plus, AlertCircle } from 'lucide-react';

interface AddGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGame: (newGame: GameItem) => void;
}

export const AddGameModal: React.FC<AddGameModalProps> = ({
  isOpen,
  onClose,
  onAddGame,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Arcade' | 'Puzzle' | 'Action' | 'Sports' | 'Classic'>('Arcade');
  const [description, setDescription] = useState('');
  const [iframeInput, setIframeInput] = useState('');
  const [controlsInput, setControlsInput] = useState('');
  const [themeColor, setThemeColor] = useState('#10b981');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a module title.');
      return;
    }
    if (!iframeInput.trim()) {
      setError('Please provide an iframe snippet or embed URL.');
      return;
    }

    let finalIframe = iframeInput.trim();
    if (!finalIframe.toLowerCase().startsWith('<iframe')) {
      finalIframe = createIframeString(finalIframe, title.trim());
    }

    const controls = controlsInput
      .split('\n')
      .map(c => c.trim())
      .filter(Boolean);

    const newGame: GameItem = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      category,
      description: description.trim() || 'Custom added interactive simulation model.',
      iframe: finalIframe,
      author: 'User Added',
      tags: ['Custom', category],
      badge: 'New',
      themeColor,
      controls: controls.length > 0 ? controls : ['Mouse and keyboard controls'],
      isCustom: true,
    };

    onAddGame(newGame);
    onClose();

    // Reset form
    setTitle('');
    setDescription('');
    setIframeInput('');
    setControlsInput('');
    setError('');
  };

  const samplePresets = [
    {
      name: 'Hextris (Geometry & Logic)',
      url: 'https://hextris.io/',
      category: 'Puzzle' as const,
      color: '#ec4899',
    },
    {
      name: 'Paper Minecraft (Scratch Embed)',
      url: 'https://scratch.mit.edu/projects/10128407/embed',
      category: 'Action' as const,
      color: '#10b981',
    }
  ];

  return (
    <div id="add-game-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-slate-100 text-base">Add Interactive Module</h3>
            <p className="text-xs text-slate-400">Stores your module as an iframe in the local modules catalog</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg flex items-center gap-2 text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Preset Buttons */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">Quick Examples</label>
            <div className="flex flex-wrap gap-2">
              {samplePresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setTitle(preset.name);
                    setIframeInput(`<iframe src="${preset.url}" width="100%" height="100%" frameborder="0" allowfullscreen="true"></iframe>`);
                    setCategory(preset.category);
                    setThemeColor(preset.color);
                  }}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] cursor-pointer"
                >
                  Fill with {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Module Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Hexagonal Geometry"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="Arcade">Arcade</option>
                <option value="Puzzle">Puzzle</option>
                <option value="Action">Action</option>
                <option value="Sports">Sports</option>
                <option value="Classic">Classic</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Description</label>
            <textarea
              rows={2}
              placeholder="Brief summary of how the simulation works..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Iframe Input */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Iframe HTML or Embed URL *
            </label>
            <textarea
              rows={3}
              required
              placeholder='<iframe src="https://..." allowfullscreen="true"></iframe>'
              value={iframeInput}
              onChange={(e) => setIframeInput(e.target.value)}
              className="w-full px-3 py-2 font-mono bg-slate-950 border border-slate-800 rounded-lg text-cyan-300 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
            <p className="mt-1 text-[11px] text-slate-500">
              Paste the full &lt;iframe&gt; embed code or direct simulation URL. Stored as an iframe in JSON.
            </p>
          </div>

          {/* Controls */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Controls (One instruction per line)
            </label>
            <textarea
              rows={2}
              placeholder="Arrow keys to navigate&#10;Spacebar to activate"
              value={controlsInput}
              onChange={(e) => setControlsInput(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Theme Color */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Accent Theme Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={themeColor}
                onChange={(e) => setThemeColor(e.target.value)}
                className="w-10 h-8 rounded border border-slate-800 bg-slate-950 cursor-pointer"
              />
              <span className="font-mono text-slate-400">{themeColor}</span>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Save to Modules JSON</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
