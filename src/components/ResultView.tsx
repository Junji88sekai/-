import { useEffect, useState } from 'react';
import { QuizResultItem, Mode } from '../types';
import { Trophy, RotateCcw, Sliders, CheckCircle2, XCircle, Volume2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { speakJapanese } from '../utils/audio';

interface ResultViewProps {
  results: QuizResultItem[];
  mode: Mode;
  soundEnabled: boolean;
  onRetry: () => void;
  onChangeSettings: () => void;
}

export function ResultView({
  results,
  mode,
  soundEnabled,
  onRetry,
  onChangeSettings,
}: ResultViewProps) {
  const [filter, setFilter] = useState<'all' | 'wrong'>('all');

  const total = results.length;
  const correctCount = results.filter((r) => r.isCorrect).length;
  const percentage = Math.round((correctCount / total) * 100);
  const wrongCount = total - correctCount;

  useEffect(() => {
    if (percentage >= 80) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore if confetti blocked
      }
    }
  }, [percentage]);

  const displayedResults =
    filter === 'wrong' ? results.filter((r) => !r.isCorrect) : results;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Score Banner Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200 text-center relative overflow-hidden">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center mb-4 shadow-2xs">
          <Trophy className="w-8 h-8 text-amber-500 fill-amber-500/20" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-800">
          クイズ完了！ お疲れ様でした！
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          {mode === 'word' ? 'カタカナ単語モード' : 'カタカナ文字モード'}
        </p>

        {/* Score Numbers */}
        <div className="my-6 inline-flex items-baseline gap-2 bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100">
          <span className="text-5xl sm:text-6xl font-black text-indigo-600 tracking-tight">
            {correctCount}
          </span>
          <span className="text-2xl text-slate-400 font-bold">/ {total} 問正解</span>
          <span className="ml-3 text-lg sm:text-xl font-extrabold px-3 py-1 rounded-full bg-indigo-100 text-indigo-700">
            {percentage}%
          </span>
        </div>

        {/* Message based on percentage */}
        <p className="text-slate-600 text-sm sm:text-base font-medium max-w-md mx-auto">
          {percentage === 100
            ? '満点達成！完璧です！カタカナ マスターですね！'
            : percentage >= 80
            ? '素晴らしい成績です！この調子でカタカナを定着させましょう！'
            : percentage >= 50
            ? 'よく頑張りました！間違えたカタカナを復習して再挑戦しましょう。'
            : '復習あるのみ！もう一度トライしてカタカナを覚えましょう！'}
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={onRetry}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>同じ設定でもう一度</span>
          </button>
          <button
            type="button"
            onClick={onChangeSettings}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Sliders className="w-4 h-4" />
            <span>モード・行・単語数を変更</span>
          </button>
        </div>
      </div>

      {/* Review Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-800">出題結果のふりかえり</h3>
            <p className="text-xs text-slate-500">
              音声アイコンを押すと発音を確認できます
            </p>
          </div>

          {/* Filter toggle */}
          {wrongCount > 0 && (
            <div className="inline-flex rounded-lg bg-slate-100 p-1 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
                  filter === 'all'
                    ? 'bg-white text-slate-800 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                すべて ({total})
              </button>
              <button
                type="button"
                onClick={() => setFilter('wrong')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
                  filter === 'wrong'
                    ? 'bg-white text-rose-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                要復習のみ ({wrongCount})
              </button>
            </div>
          )}
        </div>

        {/* Results List */}
        <div className="divide-y divide-slate-100">
          {displayedResults.map((item) => (
            <div
              key={item.questionNumber}
              className="py-3 sm:py-3.5 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 text-xs font-bold text-slate-400">
                  #{item.questionNumber}
                </span>

                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0">
                  {item.isCorrect ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  ) : (
                    <XCircle className="w-6 h-6 text-rose-500" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-sm sm:text-base font-bold text-slate-700">
                      {item.promptText || (item.answerMode === 'katakana' ? item.romaji : item.correctKatakana)}
                    </span>
                    <span className="text-slate-300">→</span>
                    <span className="text-base sm:text-lg font-black text-indigo-700">
                      {item.correctAnswer || (item.answerMode === 'katakana' ? item.correctKatakana : item.romaji)}
                    </span>
                    {!item.isCorrect && (
                      <span className="text-xs text-rose-500 font-medium line-through ml-1">
                        (選択: {item.selectedAnswer})
                      </span>
                    )}
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 border border-slate-200">
                      {item.answerMode === 'katakana' ? 'カタカナで選択' : 'ローマ字で選択'}
                    </span>
                  </div>

                  {item.spanish && (
                    <span className="text-xs text-amber-700 font-medium block">
                      🇪🇸 西: {item.spanish}
                    </span>
                  )}
                </div>
              </div>

              {/* Audio button */}
              <button
                type="button"
                onClick={() => speakJapanese(item.correctKatakana, soundEnabled)}
                className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-50 transition-colors"
                title="発音を聞く"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
