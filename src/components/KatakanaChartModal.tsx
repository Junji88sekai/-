import { X, Volume2, Grid3X3 } from 'lucide-react';
import {
  A_ROW,
  KA_ROW,
  SA_ROW,
  TA_ROW,
  NA_ROW,
  HA_ROW,
  MA_ROW,
  YA_ROW,
  RA_ROW,
  WA_ROW,
} from '../data/characters';
import { speakJapanese } from '../utils/audio';

interface KatakanaChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  soundEnabled: boolean;
}

export function KatakanaChartModal({ isOpen, onClose, soundEnabled }: KatakanaChartModalProps) {
  if (!isOpen) return null;

  const rows = [
    { name: 'ア行', items: A_ROW },
    { name: 'カ行', items: KA_ROW },
    { name: 'サ行', items: SA_ROW },
    { name: 'タ行', items: TA_ROW },
    { name: 'ナ行', items: NA_ROW },
    { name: 'ハ行', items: HA_ROW },
    { name: 'マ行', items: MA_ROW },
    { name: 'ヤ行', items: YA_ROW },
    { name: 'ラ行', items: RA_ROW },
    { name: 'ワ行', items: WA_ROW },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
              <Grid3X3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-800">
                カタカナ五十音表
              </h2>
              <p className="text-xs text-slate-500">
                各文字をタップすると音声を聞くことができます。
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

        {/* Chart Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {rows.map((row) => (
              <div
                key={row.name}
                className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-200"
              >
                <div className="text-xs font-bold text-slate-500 mb-2 px-1">
                  {row.name}
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {row.items.map((char) => (
                    <button
                      key={char.katakana}
                      type="button"
                      onClick={() => speakJapanese(char.katakana, soundEnabled)}
                      className="p-2 sm:p-2.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 flex flex-col items-center justify-center transition-all group active:scale-95 shadow-2xs"
                      title={`${char.romaji} (クリックで発音)`}
                    >
                      <span className="text-xl sm:text-2xl font-black text-slate-800 group-hover:text-indigo-600">
                        {char.katakana}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-slate-400 mt-0.5">
                        {char.romaji}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
          <Volume2 className="w-3.5 h-3.5 text-indigo-500" />
          <span>文字をクリックするとネイティブ発音を再生します</span>
        </div>
      </div>
    </div>
  );
}
