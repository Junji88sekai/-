import { Volume2, VolumeX, BookOpen, Grid3X3, RotateCcw } from 'lucide-react';
import { Mode } from '../types';

interface HeaderProps {
  currentMode: Mode;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenWordList: () => void;
  onOpenKatakanaChart: () => void;
  onResetToHome: () => void;
  isPlaying: boolean;
}

export function Header({
  currentMode,
  soundEnabled,
  onToggleSound,
  onOpenWordList,
  onOpenKatakanaChart,
  onResetToHome,
  isPlaying,
}: HeaderProps) {
  return (
    <header className="w-full bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        {/* App Title / Logo */}
        <button
          onClick={onResetToHome}
          className="flex items-center gap-2.5 text-left group focus:outline-hidden"
          title="トップに戻る"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold text-xl shadow-xs group-hover:scale-105 transition-transform">
            カ
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-slate-800 text-lg sm:text-xl tracking-tight leading-none">
                カタカナ学習
              </h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                {currentMode === 'word' ? '単語モード' : '文字モード'}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5 font-medium hidden sm:block">
              タブレット・PC対応 カタカナ・ローマ字相互学習
            </p>
          </div>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {isPlaying && (
            <button
              onClick={onResetToHome}
              className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              title="クイズを中止して設定へ"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">最初から</span>
            </button>
          )}

          <button
            onClick={onOpenKatakanaChart}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-100"
            title="カタカナ50音表を見る"
          >
            <Grid3X3 className="w-4 h-4 text-indigo-600" />
            <span className="hidden md:inline">カタカナ表</span>
          </button>

          <button
            onClick={onOpenWordList}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-100"
            title="100単語とスペイン語訳一覧"
          >
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span className="hidden md:inline">単語100選 (西訳)</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className={`p-2 rounded-lg border transition-colors ${
              soundEnabled
                ? 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
                : 'bg-slate-100 border-slate-200 text-slate-400 hover:bg-slate-200'
            }`}
            title={soundEnabled ? '音声: オン (クリックでミュート)' : '音声: オフ (クリックで有効化)'}
            aria-label="音声切り替え"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
