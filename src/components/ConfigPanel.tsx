import { CHARACTER_GROUPS } from '../data/characters';
import { AnswerMode, CharacterGroupKey, Difficulty, Mode, WordSelectionType } from '../types';
import { Play, Sparkles, BookA, Languages, Check, Gauge, Type, FileText, ArrowLeftRight } from 'lucide-react';

interface ConfigPanelProps {
  mode: Mode;
  onSelectMode: (mode: Mode) => void;
  answerMode: AnswerMode;
  onSelectAnswerMode: (mode: AnswerMode) => void;
  characterGroupKey: CharacterGroupKey;
  onSelectCharacterGroup: (key: CharacterGroupKey) => void;
  difficulty: Difficulty;
  onSelectDifficulty: (difficulty: Difficulty) => void;
  wordSelectionType: WordSelectionType;
  onSelectWordSelectionType: (type: WordSelectionType) => void;
  questionCount: number;
  onSelectQuestionCount: (count: number) => void;
  onStart: () => void;
}

export function ConfigPanel({
  mode,
  onSelectMode,
  answerMode,
  onSelectAnswerMode,
  characterGroupKey,
  onSelectCharacterGroup,
  difficulty,
  onSelectDifficulty,
  wordSelectionType,
  onSelectWordSelectionType,
  questionCount,
  onSelectQuestionCount,
  onStart,
}: ConfigPanelProps) {
  const wordCountOptions = [10, 20, 30];
  const charCountOptions = [10, 20, 30];

  const difficultyDefs: { key: Difficulty; label: string; badge: string; desc: string }[] = [
    {
      key: 'easy',
      label: '簡単',
      badge: '4文字',
      desc: '横一列に4つの選択肢。初めての方に最適です。',
    },
    {
      key: 'normal',
      label: '普通',
      badge: '6文字',
      desc: '横一列に6つの選択肢。テンポよく学習できます。',
    },
    {
      key: 'hard',
      label: 'ちょっと難しい',
      badge: '8〜10文字・似た文字優先',
      desc: '文字数が多く、似ている文字や音が優先して並びます。',
    },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Intro Card */}
      <div className="bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-xs mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Katakana Learning App</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
            {answerMode === 'katakana'
              ? 'ローマ字を見て、下部の横一列からカタカナを選ぼう！'
              : 'カタカナを見て、下部の横一列からローマ字を選ぼう！'}
          </h2>
          <p className="text-indigo-100 text-sm sm:text-base mt-2 leading-relaxed">
            タブレットの大画面タッチ操作やパソコンのマウス・数字キー（1〜0キー）で快適に学習できます。
          </p>
        </div>

        {/* Decorative background characters */}
        <div className="absolute -right-4 -bottom-6 text-white/10 text-9xl font-black select-none pointer-events-none hidden sm:block">
          {answerMode === 'katakana' ? 'カタ' : 'Roma'}
        </div>
      </div>

      {/* Main Settings Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80 space-y-8">
        {/* Step 1: Mode Selection */}
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">
            STEP 1: 学習モードの選択
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Character Mode Card */}
            <button
              type="button"
              onClick={() => onSelectMode('character')}
              className={`p-5 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                mode === 'character'
                  ? 'border-indigo-600 bg-indigo-50/60 shadow-xs ring-2 ring-indigo-500/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/80'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3">
                  <BookA className="w-5 h-5" />
                </div>
                {mode === 'character' && (
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">文字モード</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  1文字ずつの練習。選択した行（ア・カ行、サ・タ行等）のみが出題・表示されます。
                </p>
              </div>
            </button>

            {/* Word Mode Card */}
            <button
              type="button"
              onClick={() => onSelectMode('word')}
              className={`p-5 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                mode === 'word'
                  ? 'border-indigo-600 bg-indigo-50/60 shadow-xs ring-2 ring-indigo-500/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/80'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                  <Languages className="w-5 h-5" />
                </div>
                {mode === 'word' && (
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-800">単語モード</h3>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                    スペイン語訳付
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  日常外来語100選からランダム出題。問題下部にスペイン語訳が常時表示されます。
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Step 2: Answer Mode Selection (表示される文字と答える文字の切り替え) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              STEP 2: 出題と答える文字の選択
            </label>
            <button
              type="button"
              onClick={() => onSelectAnswerMode(answerMode === 'katakana' ? 'romaji' : 'katakana')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors cursor-pointer"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>向きを入れ替え</span>
            </button>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            出題される文字と、選択肢として下部に並ぶ文字の対応を入れ替えることができます。
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Katakana Answer Mode */}
            <button
              type="button"
              onClick={() => onSelectAnswerMode('katakana')}
              className={`p-4 sm:p-5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                answerMode === 'katakana'
                  ? 'border-indigo-600 bg-indigo-50/70 shadow-xs ring-2 ring-indigo-500/20'
                  : 'border-slate-200 bg-white hover:bg-slate-50/90 text-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 font-black text-sm flex items-center justify-center">
                      カ
                    </span>
                    <span className="text-base font-extrabold text-slate-800">
                      カタカナ文字で選ぶ
                    </span>
                  </div>
                  {answerMode === 'katakana' && (
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
                <div className="space-y-1 mt-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-medium">問題表示:</span>
                    <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      ローマ字 (例: {mode === 'word' ? 'aisu' : 'ka'})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-600 font-bold">答える文字:</span>
                    <span className="font-bold text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded">
                      カタカナ (例: {mode === 'word' ? 'アイス' : 'カ'})
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-3 pt-2 border-t border-slate-100">
                ローマ字を見てカタカナを思い出す標準練習です。
              </p>
            </button>

            {/* Romaji Answer Mode */}
            <button
              type="button"
              onClick={() => onSelectAnswerMode('romaji')}
              className={`p-4 sm:p-5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                answerMode === 'romaji'
                  ? 'border-indigo-600 bg-indigo-50/70 shadow-xs ring-2 ring-indigo-500/20'
                  : 'border-slate-200 bg-white hover:bg-slate-50/90 text-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-violet-100 text-violet-800 font-mono font-bold text-sm flex items-center justify-center">
                      Ro
                    </span>
                    <span className="text-base font-extrabold text-slate-800">
                      ローマ字で選ぶ
                    </span>
                  </div>
                  {answerMode === 'romaji' && (
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
                <div className="space-y-1 mt-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-medium">問題表示:</span>
                    <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      カタカナ (例: {mode === 'word' ? 'アイス' : 'カ'})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-600 font-bold">答える文字:</span>
                    <span className="font-mono font-bold text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded">
                      ローマ字 (例: {mode === 'word' ? 'aisu' : 'ka'})
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-3 pt-2 border-t border-slate-100">
                カタカナを正しく読めるか確認する練習に最適です。
              </p>
            </button>
          </div>
        </div>

        {/* Step 3: Difficulty Selection (簡単、普通、ちょっと難しい) */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Gauge className="w-4 h-4 text-indigo-600" />
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              STEP 3: 難易度の選択
            </label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {difficultyDefs.map((def) => {
              const isSelected = difficulty === def.key;
              return (
                <button
                  key={def.key}
                  type="button"
                  onClick={() => onSelectDifficulty(def.key)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/80 shadow-xs ring-2 ring-indigo-500/20'
                      : 'border-slate-200 bg-white hover:bg-slate-50/90 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-base font-extrabold text-slate-800">{def.label}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {def.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1">{def.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 4: Conditional Settings - Row selection for Character Mode / Word selection type for Word Mode */}
        {mode === 'character' ? (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                STEP 4: 表示する行の選択
              </label>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              ※選択した行以外の文字は出題・選択肢ともに一切表示されません。サ・タ行を選ぶと前の列ア・カ行が自動的に含まれます。
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CHARACTER_GROUPS.map((group) => {
                const isSelected = characterGroupKey === group.key;
                return (
                  <button
                    key={group.key}
                    type="button"
                    onClick={() => onSelectCharacterGroup(group.key)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950 font-bold shadow-2xs ring-1 ring-indigo-500/30'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-base font-extrabold">{group.label}</span>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500 block mt-1.5 leading-relaxed">
                      {group.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                STEP 4: 単語の入力・選択方法
              </label>
              <p className="text-xs text-slate-500 mb-3">
                下部に表示される文字を1文字ずつ選んで単語を完成させるか、完成した単語を直接選ぶかを選択できます。
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Char-by-char selection */}
                <button
                  type="button"
                  onClick={() => onSelectWordSelectionType('char')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                    wordSelectionType === 'char'
                      ? 'border-indigo-600 bg-indigo-50/80 shadow-xs ring-2 ring-indigo-500/20'
                      : 'border-slate-200 bg-white hover:bg-slate-50/90 text-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Type className="w-5 h-5 text-indigo-600" />
                        <span className="text-base font-extrabold text-slate-800">一文字ずつ選択</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
                        おすすめ
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      下部の横一列から1文字ずつ順番に選んで単語を組み立てます（例: {answerMode === 'katakana' ? 'ア → イ → ス' : 'a → i → s → u'}）。
                    </p>
                  </div>
                  {wordSelectionType === 'char' && (
                    <div className="mt-2 text-xs font-bold text-indigo-600 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> 選択中
                    </div>
                  )}
                </button>

                {/* Full-word selection */}
                <button
                  type="button"
                  onClick={() => onSelectWordSelectionType('word')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                    wordSelectionType === 'word'
                      ? 'border-indigo-600 bg-indigo-50/80 shadow-xs ring-2 ring-indigo-500/20'
                      : 'border-slate-200 bg-white hover:bg-slate-50/90 text-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-amber-600" />
                        <span className="text-base font-extrabold text-slate-800">単語で選択</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                        難易度高
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      下部の横一列に並んだ完成単語一覧（例: {answerMode === 'katakana' ? 'アイス、アパート...' : 'aisu, apāto...'}）から直接選びます。
                    </p>
                  </div>
                  {wordSelectionType === 'word' && (
                    <div className="mt-2 text-xs font-bold text-indigo-600 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> 選択中
                    </div>
                  )}
                </button>
              </div>
            </div>

            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3.5 sm:p-4">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs sm:text-sm">
                <Languages className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>日常外来語100語からランダム出題（スペイン語訳付）</span>
              </div>
              <p className="text-xs text-emerald-700/90 mt-1 leading-relaxed">
                問題カード下部にはスペイン語訳が常時表示されます。プレイ中にも画面上部で選択方法や出題の向きを切り替えることができます。
              </p>
            </div>
          </div>
        )}

        {/* Step 5: Question Count */}
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">
            {mode === 'word' ? 'STEP 5: 出題単語数の選択' : 'STEP 5: 出題問題数の選択'}
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(mode === 'word' ? wordCountOptions : charCountOptions).map((count) => {
              const isSelected = questionCount === count;
              return (
                <button
                  key={count}
                  type="button"
                  onClick={() => onSelectQuestionCount(count)}
                  className={`py-3.5 px-4 rounded-xl border text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-600 text-white font-black shadow-xs'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold'
                  }`}
                >
                  <span className="text-xl sm:text-2xl font-black">
                    {count}
                  </span>
                  <span className={`text-xs ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                    {mode === 'word' ? '単語' : '問'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Start Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onStart}
            className="w-full py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-extrabold text-lg sm:text-xl shadow-md shadow-indigo-600/25 flex items-center justify-center gap-3 transition-all cursor-pointer"
          >
            <Play className="w-6 h-6 fill-current" />
            <span>学習スタート</span>
          </button>
        </div>
      </div>
    </div>
  );
}
