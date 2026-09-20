import { useState } from 'react';
import { KATAKANA_WORDS } from '../data/words';
import { X, Search, Volume2, Languages } from 'lucide-react';
import { speakJapanese } from '../utils/audio';

interface WordListModalProps {
  isOpen: boolean;
  onClose: () => void;
  soundEnabled: boolean;
}

export function WordListModal({ isOpen, onClose, soundEnabled }: WordListModalProps) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filtered = KATAKANA_WORDS.filter(
    (item) =>
      item.word.includes(searchTerm) ||
      item.romaji.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.spanish.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-800">
                カタカナ単語100選 (スペイン語訳付)
              </h2>
              <p className="text-xs text-slate-500">
                出題される全100単語の一覧です。クリックで発音を聞くことができます。
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title="閉じる"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-4 sm:px-6 py-3 bg-slate-50 border-b border-slate-200">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="カタカナ、ローマ字、スペイン語で検索 (例: アイス, aisu, helado)..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Words Grid / List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 divide-y divide-slate-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-200 hover:bg-indigo-50/20 transition-all flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 text-xs font-mono font-bold text-slate-400 shrink-0">
                    #{item.id}
                  </span>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-black text-slate-800 tracking-tight">
                        {item.word}
                      </span>
                      <span className="text-xs font-mono font-bold text-indigo-600">
                        {item.romaji}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-amber-800 block">
                      🇪🇸 {item.spanish}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => speakJapanese(item.word, soundEnabled)}
                  className="p-2 rounded-xl text-slate-400 group-hover:text-indigo-600 hover:bg-indigo-100/50 transition-colors shrink-0"
                  title="発音を聞く"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-sm">
              一致する単語が見つかりませんでした。
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500">
          合計 100 単語収録 • スペイン語訳対応
        </div>
      </div>
    </div>
  );
}
