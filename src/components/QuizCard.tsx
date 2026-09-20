import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  AnswerMode,
  CharacterGroupKey,
  Difficulty,
  QuizQuestion,
  QuizResultItem,
  WordSelectionType,
} from '../types';
import {
  Volume2,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Gauge,
  Layers,
  Undo2,
  Type,
  FileText,
  ArrowLeftRight,
} from 'lucide-react';
import { playSoundEffect, speakJapanese } from '../utils/audio';
import { generateOptionsForQuestion } from '../utils/quizGenerator';
import { CHARACTER_GROUPS } from '../data/characters';

interface QuizCardProps {
  question: QuizQuestion;
  currentIndex: number;
  totalQuestions: number;
  difficulty: Difficulty;
  onChangeDifficulty: (difficulty: Difficulty) => void;
  wordSelectionType: WordSelectionType;
  onChangeWordSelectionType: (type: WordSelectionType) => void;
  answerMode: AnswerMode;
  onChangeAnswerMode: (mode: AnswerMode) => void;
  characterGroupKey: CharacterGroupKey;
  soundEnabled: boolean;
  onAnswer: (result: QuizResultItem) => void;
}

export function QuizCard({
  question,
  currentIndex,
  totalQuestions,
  difficulty,
  onChangeDifficulty,
  wordSelectionType,
  onChangeWordSelectionType,
  answerMode,
  onChangeAnswerMode,
  characterGroupKey,
  soundEnabled,
  onAnswer,
}: QuizCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [currentOptions, setCurrentOptions] = useState<string[]>(question.options);

  // Character-by-character spelling state for word mode
  const [enteredChars, setEnteredChars] = useState<string[]>([]);
  const [mistakeCount, setMistakeCount] = useState<number>(0);
  const [shakingOption, setShakingOption] = useState<string | null>(null);

  const isCharByChar = question.mode === 'word' && wordSelectionType === 'char';

  // The correct answer string based on current answerMode
  const targetAnswerString = useMemo(() => {
    return answerMode === 'katakana' ? question.correctKatakana : question.romaji;
  }, [answerMode, question.correctKatakana, question.romaji]);

  // Target characters sequence for char-by-char mode
  const targetChars = useMemo(() => {
    return targetAnswerString.split('');
  }, [targetAnswerString]);

  // Regenerate options if difficulty, wordSelectionType, or answerMode changes
  useEffect(() => {
    if (!isAnswered) {
      const freshOptions = generateOptionsForQuestion(
        question.correctKatakana,
        question.romaji,
        question.mode,
        difficulty,
        characterGroupKey,
        wordSelectionType,
        answerMode
      );
      setCurrentOptions(freshOptions);
      setEnteredChars([]);
      setMistakeCount(0);
      setSelectedOption(null);
    }
  }, [
    difficulty,
    wordSelectionType,
    answerMode,
    question.id,
    question.correctKatakana,
    question.romaji,
    question.mode,
    characterGroupKey,
    isAnswered,
  ]);

  // Reset state when question changes
  useEffect(() => {
    setSelectedOption(null);
    setIsAnswered(false);
    setEnteredChars([]);
    setMistakeCount(0);
    setShakingOption(null);
    const freshOptions = generateOptionsForQuestion(
      question.correctKatakana,
      question.romaji,
      question.mode,
      difficulty,
      characterGroupKey,
      wordSelectionType,
      answerMode
    );
    setCurrentOptions(freshOptions);
  }, [
    question.id,
    question.correctKatakana,
    question.romaji,
    question.mode,
    difficulty,
    characterGroupKey,
    wordSelectionType,
    answerMode,
  ]);

  // Character match helper (handles macrons like ā -> a)
  const isMatchingChar = useCallback((input: string, expected: string): boolean => {
    if (input.toLowerCase() === expected.toLowerCase()) return true;
    if (expected === 'ā' && (input === 'a' || input === 'ā')) return true;
    if (expected === 'ī' && (input === 'i' || input === 'ī')) return true;
    if (expected === 'ū' && (input === 'u' || input === 'ū')) return true;
    if (expected === 'ē' && (input === 'e' || input === 'ē')) return true;
    if (expected === 'ō' && (input === 'o' || input === 'ō')) return true;
    return false;
  }, []);

  // Handle character-by-character tap
  const handleCharByCharSelect = useCallback(
    (char: string) => {
      if (isAnswered) return;

      const currentTargetChar = targetChars[enteredChars.length];

      if (char === currentTargetChar || isMatchingChar(char, currentTargetChar)) {
        // Correct character in sequence
        const newEntered = [...enteredChars, currentTargetChar];
        setEnteredChars(newEntered);

        // Sound feedback
        if (soundEnabled) {
          if (answerMode === 'katakana') {
            speakJapanese(currentTargetChar, soundEnabled);
          }
        }

        // Check if word is complete
        if (newEntered.length === targetChars.length) {
          setIsAnswered(true);
          setSelectedOption(targetAnswerString);
          playSoundEffect('correct', soundEnabled);

          if (soundEnabled) {
            setTimeout(() => {
              speakJapanese(question.correctKatakana, soundEnabled);
            }, 250);
          }
        }
      } else {
        // Wrong character chosen
        setMistakeCount((prev) => prev + 1);
        playSoundEffect('wrong', soundEnabled);
        setShakingOption(char);
        setTimeout(() => {
          setShakingOption(null);
        }, 500);
      }
    },
    [
      isAnswered,
      targetChars,
      enteredChars,
      isMatchingChar,
      soundEnabled,
      answerMode,
      targetAnswerString,
      question.correctKatakana,
    ]
  );

  // Handle single-tap selection (Character mode OR Word full-word mode)
  const handleSingleSelectOption = useCallback(
    (option: string) => {
      if (isAnswered) return;

      const isCorrect = option === targetAnswerString;
      setSelectedOption(option);
      setIsAnswered(true);

      playSoundEffect(isCorrect ? 'correct' : 'wrong', soundEnabled);

      if (soundEnabled) {
        setTimeout(() => {
          speakJapanese(question.correctKatakana, soundEnabled);
        }, 120);
      }
    },
    [isAnswered, targetAnswerString, soundEnabled, question.correctKatakana]
  );

  // Dispatcher for option clicks
  const handleSelectOption = useCallback(
    (option: string) => {
      if (isCharByChar) {
        handleCharByCharSelect(option);
      } else {
        handleSingleSelectOption(option);
      }
    },
    [isCharByChar, handleCharByCharSelect, handleSingleSelectOption]
  );

  // Backspace undo for char-by-char mode
  const handleBackspace = useCallback(() => {
    if (isAnswered || enteredChars.length === 0) return;
    setEnteredChars((prev) => prev.slice(0, prev.length - 1));
  }, [isAnswered, enteredChars.length]);

  const handleNext = useCallback(() => {
    const isCorrect = isCharByChar
      ? mistakeCount === 0
      : selectedOption === targetAnswerString;

    const promptText = answerMode === 'katakana' ? question.romaji : question.correctKatakana;
    const correctAnswer = targetAnswerString;
    const selectedAnswer = selectedOption || targetAnswerString;

    onAnswer({
      questionNumber: currentIndex + 1,
      romaji: question.romaji,
      correctKatakana: question.correctKatakana,
      answerMode,
      promptText,
      correctAnswer,
      selectedAnswer,
      isCorrect,
      spanish: question.spanishHint,
    });
  }, [
    isCharByChar,
    mistakeCount,
    selectedOption,
    targetAnswerString,
    answerMode,
    question,
    currentIndex,
    onAnswer,
  ]);

  // Keyboard shortcut support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isAnswered) {
        if (e.key === 'Backspace' && isCharByChar) {
          e.preventDefault();
          handleBackspace();
          return;
        }

        // Direct letter typing in Romaji char-by-char mode
        if (isCharByChar && answerMode === 'romaji' && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          const pressedKey = e.key.toLowerCase();
          const targetChar = targetChars[enteredChars.length];
          if (targetChar && isMatchingChar(pressedKey, targetChar)) {
            e.preventDefault();
            handleCharByCharSelect(targetChar);
            return;
          }
        }

        // Number keys 1-9 and 0
        let index = -1;
        if (['1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(e.key)) {
          index = parseInt(e.key, 10) - 1;
        } else if (e.key === '0') {
          index = 9;
        }

        if (index >= 0 && index < currentOptions.length) {
          handleSelectOption(currentOptions[index]);
        }
      } else {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isAnswered,
    currentOptions,
    isCharByChar,
    answerMode,
    targetChars,
    enteredChars,
    isMatchingChar,
    handleCharByCharSelect,
    handleBackspace,
    handleSelectOption,
    handleNext,
  ]);

  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  const groupDef = useMemo(() => {
    return CHARACTER_GROUPS.find((g) => g.key === characterGroupKey);
  }, [characterGroupKey]);

  const difficultyItems: { key: Difficulty; label: string; desc: string }[] = [
    { key: 'easy', label: '簡単', desc: '選択肢4つ' },
    { key: 'normal', label: '普通', desc: '選択肢6つ' },
    { key: 'hard', label: 'ちょっと難しい', desc: '選択肢多数・似た文字優先' },
  ];

  // Primary prompt text to display in large font
  const displayedPrompt = answerMode === 'katakana' ? question.romaji : question.correctKatakana;
  const promptLabel =
    answerMode === 'katakana' ? 'ローマ字 (Romaji)' : 'カタカナ (Katakana)';

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-4 sm:gap-6">
      {/* Upper Area: Progress & Top Controls */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200/90 flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Progress Info */}
          <div className="flex-1">
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-600 mb-2">
              <span className="flex items-center gap-2">
                <span className="text-indigo-600 font-extrabold text-base">第 {currentIndex + 1} 問</span>
                <span className="text-slate-400">/ {totalQuestions}</span>
                {question.mode === 'character' && groupDef && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    <Layers className="w-3 h-3 text-indigo-500" />
                    {groupDef.label} (のみ表示)
                  </span>
                )}
              </span>
              <span className="text-slate-500 font-medium">進捗: {progressPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Top Control Bar: Difficulty Switcher, Answer Mode Switcher & Word Input Method Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            {/* Difficulty Switcher (簡単 / 普通 / ちょっと難しい) */}
            <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80">
              <div className="flex items-center gap-1 px-1.5 text-xs font-bold text-slate-500 hidden md:flex">
                <Gauge className="w-3.5 h-3.5 text-indigo-600" />
                <span>難易度:</span>
              </div>
              {difficultyItems.map((item) => {
                const isSelected = difficulty === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => onChangeDifficulty(item.key)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                    }`}
                    title={item.desc}
                  >
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Answer Mode Switcher: カタカナで選ぶ ⇄ ローマ字で選ぶ */}
            <div className="flex items-center gap-1 bg-indigo-50/80 p-1 rounded-xl border border-indigo-200/70">
              <button
                type="button"
                onClick={() => onChangeAnswerMode('katakana')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1 ${
                  answerMode === 'katakana'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-indigo-900 hover:bg-indigo-100/70'
                }`}
                title="ローマ字を見てカタカナを選びます"
              >
                <span>カタカナで選ぶ</span>
              </button>
              <button
                type="button"
                onClick={() => onChangeAnswerMode(answerMode === 'katakana' ? 'romaji' : 'katakana')}
                className="p-1.5 text-indigo-500 hover:text-indigo-800 transition-colors"
                title="出題と回答の向きを入れ替える"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onChangeAnswerMode('romaji')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1 ${
                  answerMode === 'romaji'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-indigo-900 hover:bg-indigo-100/70'
                }`}
                title="カタカナを見てローマ字を選びます"
              >
                <span>ローマ字で選ぶ</span>
              </button>
            </div>
          </div>

          {/* Word Mode: Character-by-character vs Full-word Switcher */}
          {question.mode === 'word' && (
            <div className="flex items-center gap-1 bg-amber-50/90 p-1 rounded-xl border border-amber-200/80">
              <button
                type="button"
                onClick={() => onChangeWordSelectionType('char')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                  wordSelectionType === 'char'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-amber-900 hover:bg-amber-100/70'
                }`}
                title="下部の横一列から1文字ずつ選んで単語を組み立てます"
              >
                <Type className="w-3.5 h-3.5" />
                <span>1文字ずつ</span>
              </button>
              <button
                type="button"
                onClick={() => onChangeWordSelectionType('word')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                  wordSelectionType === 'word'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-amber-900 hover:bg-amber-100/70'
                }`}
                title="完成した単語を直接選択するモード"
              >
                <FileText className="w-3.5 h-3.5 text-rose-500" />
                <span>単語で選択</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Middle Area: Question Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/90 text-center relative overflow-hidden">
        {/* Prompt label */}
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center justify-center gap-1.5">
          <span>{promptLabel}</span>
          <span className="text-slate-300">→</span>
          <span className="text-indigo-600">
            {answerMode === 'katakana' ? 'カタカナで選択' : 'ローマ字で選択'}
          </span>
        </div>

        {/* Primary Prompt Character or Word */}
        <div className="my-2 flex items-center justify-center gap-3">
          <span className="text-4xl sm:text-6xl font-black text-slate-800 tracking-wider font-mono select-none">
            {displayedPrompt}
          </span>
          <button
            type="button"
            onClick={() => speakJapanese(question.correctKatakana, soundEnabled)}
            className="p-3 rounded-2xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 transition-colors cursor-pointer"
            title="発音を聞く"
            aria-label="発音を聞く"
          >
            <Volume2 className="w-6 h-6" />
          </button>
        </div>

        {/* Word Mode in Character-by-character: Letter Construction Slots */}
        {isCharByChar && (
          <div className="mt-4 mb-2 flex flex-col items-center">
            <div className="text-xs font-bold text-indigo-600 mb-2 flex items-center gap-1.5">
              <span>
                {answerMode === 'katakana'
                  ? 'カタカナを1文字ずつ選んでください:'
                  : 'ローマ字を1文字ずつ選んでください:'}
              </span>
              <span className="text-slate-400 font-normal">
                ({enteredChars.length} / {targetChars.length} 文字完成)
              </span>
            </div>

            <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
              {targetChars.map((_, idx) => {
                const entered = enteredChars[idx];
                const isCurrent = idx === enteredChars.length && !isAnswered;
                return (
                  <div
                    key={idx}
                    className={`w-12 h-14 sm:w-16 sm:h-20 rounded-2xl border-2 flex items-center justify-center font-black text-2xl sm:text-4xl transition-all select-none ${
                      entered
                        ? 'bg-indigo-50 border-indigo-600 text-indigo-950 shadow-xs scale-100 animate-in zoom-in-95'
                        : isCurrent
                        ? 'border-indigo-500 bg-white shadow-xs ring-4 ring-indigo-200/80 animate-pulse text-slate-300'
                        : 'border-dashed border-slate-300 bg-slate-50/70 text-slate-300'
                    }`}
                  >
                    {entered ? entered : isCurrent ? '?' : '・'}
                  </div>
                );
              })}

              {/* Backspace Button */}
              {enteredChars.length > 0 && !isAnswered && (
                <button
                  type="button"
                  onClick={handleBackspace}
                  className="px-3 py-2 sm:py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer ml-1 sm:ml-2"
                  title="最後の1文字を消す (Backspace)"
                >
                  <Undo2 className="w-4 h-4" />
                  <span className="hidden sm:inline">1文字消す</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Word Mode: Spanish Translation at bottom of card */}
        {question.mode === 'word' && question.spanishHint && (
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-900 text-sm sm:text-base font-medium">
              <span className="text-base" role="img" aria-label="Spain flag">🇪🇸</span>
              <span className="font-bold text-amber-800 text-xs uppercase tracking-wider">スペイン語訳:</span>
              <span className="font-black text-amber-950">{question.spanishHint}</span>
            </div>
          </div>
        )}

        {/* Guidance Prompt */}
        <p className="text-xs text-slate-400 mt-3">
          {isCharByChar
            ? `下部に横一列に並んだ文字から、次の${answerMode === 'katakana' ? 'カタカナ' : 'ローマ字'}をタップしてください`
            : `下部に横一列に並んだ選択肢の中から、対応する${answerMode === 'katakana' ? 'カタカナ' : 'ローマ字'}を選んでください`}
        </p>
      </div>

      {/* Bottom Area: Horizontal Single Row of Choices (下部に横一列に並べた文字) */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-md border border-slate-200/90 space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            {isCharByChar ? (
              <span>文字候補 ({currentOptions.length}文字)</span>
            ) : question.mode === 'word' ? (
              <span>単語の選択肢 ({currentOptions.length}語)</span>
            ) : (
              <span>
                {answerMode === 'katakana' ? 'カタカナ選択肢' : 'ローマ字選択肢'} ({currentOptions.length}文字)
              </span>
            )}
            {difficulty === 'hard' && (
              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                似ている文字を出題中
              </span>
            )}
          </div>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            PC: 1〜{currentOptions.length <= 9 ? currentOptions.length : '0'} キー またはクリック
            {isCharByChar && ' / Backspace: 1文字消す'}
          </span>
        </div>

        {/* Horizontal Single Row Container */}
        <div className="w-full overflow-x-auto pb-2 pt-1 no-scrollbar">
          <div className="flex flex-row items-center justify-start sm:justify-center gap-2 sm:gap-3 min-w-max px-1">
            {currentOptions.map((option, idx) => {
              const isWordModeFullWord = question.mode === 'word' && wordSelectionType === 'word';
              const isSingleChar = !isWordModeFullWord;

              let buttonStyle =
                'bg-slate-50 hover:bg-indigo-50/70 border-2 border-slate-200 hover:border-indigo-400 text-slate-800 shadow-2xs';

              // Shake effect if this option was tapped incorrectly
              const isShaking = shakingOption === option;

              if (isCharByChar) {
                if (isAnswered) {
                  buttonStyle =
                    'bg-emerald-50 border-2 border-emerald-500 text-emerald-900 opacity-90';
                } else if (isShaking) {
                  buttonStyle =
                    'bg-rose-50 border-2 border-rose-500 text-rose-900 shadow-xs animate-shake';
                }
              } else {
                // Single select mode
                const isSelected = selectedOption === option;
                const isCorrect = option === targetAnswerString;

                if (isAnswered) {
                  if (isCorrect) {
                    buttonStyle =
                      'bg-emerald-50 border-2 border-emerald-500 text-emerald-900 shadow-xs ring-2 ring-emerald-500/20';
                  } else if (isSelected && !isCorrect) {
                    buttonStyle =
                      'bg-rose-50 border-2 border-rose-500 text-rose-900 shadow-xs animate-shake';
                  } else {
                    buttonStyle = 'bg-slate-50/60 border-2 border-slate-200 text-slate-400 opacity-50';
                  }
                }
              }

              const keyNumber = idx === 9 ? '0' : String(idx + 1);

              return (
                <button
                  key={`${question.id}-${option}-${idx}`}
                  type="button"
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(option)}
                  className={`relative flex flex-col items-center justify-center rounded-2xl transition-all cursor-pointer active:scale-95 select-none ${
                    isSingleChar
                      ? 'min-w-[64px] sm:min-w-[76px] h-20 sm:h-24 px-3'
                      : 'min-w-[104px] sm:min-w-[130px] h-18 sm:h-22 px-4'
                  } ${buttonStyle}`}
                >
                  {/* PC Key Hint */}
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/80 text-slate-400 border border-slate-200 absolute top-1.5 left-1.5 hidden sm:block">
                    {keyNumber}
                  </span>

                  {/* Status Badges for non-char-by-char */}
                  {!isCharByChar && isAnswered && option === targetAnswerString && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 absolute top-1.5 right-1.5" />
                  )}
                  {!isCharByChar &&
                    isAnswered &&
                    selectedOption === option &&
                    option !== targetAnswerString && (
                      <XCircle className="w-4 h-4 text-rose-600 absolute top-1.5 right-1.5" />
                    )}

                  {/* Option display */}
                  <span
                    className={`font-black tracking-tight ${
                      isSingleChar
                        ? 'text-3xl sm:text-4xl'
                        : 'text-base sm:text-lg font-bold font-mono'
                    }`}
                  >
                    {option}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Answer Feedback & Advance Bar */}
      {isAnswered && (
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-150">
          <div className="flex items-center gap-3 text-left">
            {(isCharByChar ? mistakeCount === 0 : selectedOption === targetAnswerString) ? (
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <XCircle className="w-6 h-6" />
              </div>
            )}
            <div>
              <p className="font-bold text-slate-800 text-sm sm:text-base">
                {(isCharByChar ? mistakeCount === 0 : selectedOption === targetAnswerString)
                  ? '正解です！ 素晴らしい！'
                  : isCharByChar
                  ? `完成しました！（間違い: ${mistakeCount}回） 正解は「${targetAnswerString}」`
                  : `惜しい！ 正解は「${targetAnswerString}」です`}
              </p>
              <p className="text-xs text-slate-500">
                {answerMode === 'katakana'
                  ? `${question.romaji} → ${question.correctKatakana}`
                  : `${question.correctKatakana} → ${question.romaji}`}
                {question.spanishHint ? ` (🇪🇸 ${question.spanishHint})` : ''}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-sm sm:text-base shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>{currentIndex + 1 === totalQuestions ? '結果を見る' : '次の問題へ'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
