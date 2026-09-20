/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import {
  AnswerMode,
  CharacterGroupKey,
  Difficulty,
  Mode,
  QuizQuestion,
  QuizResultItem,
  QuizState,
  WordSelectionType,
} from './types';
import { generateQuiz } from './utils/quizGenerator';
import { Header } from './components/Header';
import { ConfigPanel } from './components/ConfigPanel';
import { QuizCard } from './components/QuizCard';
import { ResultView } from './components/ResultView';
import { WordListModal } from './components/WordListModal';
import { KatakanaChartModal } from './components/KatakanaChartModal';

export default function App() {
  const [mode, setMode] = useState<Mode>('character');
  const [answerMode, setAnswerMode] = useState<AnswerMode>('katakana');
  const [characterGroupKey, setCharacterGroupKey] = useState<CharacterGroupKey>('a-ka');
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');
  const [wordSelectionType, setWordSelectionType] = useState<WordSelectionType>('char');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [quizState, setQuizState] = useState<QuizState>('config');

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [results, setResults] = useState<QuizResultItem[]>([]);

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('katakana_sound_enabled');
      return saved !== null ? saved === 'true' : true;
    }
    return true;
  });

  const [isWordListModalOpen, setIsWordListModalOpen] = useState(false);
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);

  // Sync sound preference
  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('katakana_sound_enabled', String(next));
      }
      return next;
    });
  };

  // Start new quiz
  const handleStartQuiz = () => {
    const newQuestions = generateQuiz(mode, {
      characterGroupKey,
      questionCount,
      difficulty,
      wordSelectionType,
      answerMode,
    });
    setQuestions(newQuestions);
    setCurrentIndex(0);
    setResults([]);
    setQuizState('playing');
  };

  // Handle single question result
  const handleAnswerQuestion = (result: QuizResultItem) => {
    const nextResults = [...results, result];
    setResults(nextResults);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setQuizState('result');
    }
  };

  // Retry with same settings
  const handleRetry = () => {
    handleStartQuiz();
  };

  // Back to config panel
  const handleBackToConfig = () => {
    setQuizState('config');
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navigation Header */}
      <Header
        currentMode={mode}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        onOpenWordList={() => setIsWordListModalOpen(true)}
        onOpenKatakanaChart={() => setIsChartModalOpen(true)}
        onResetToHome={handleBackToConfig}
        isPlaying={quizState === 'playing'}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-center">
        {quizState === 'config' && (
          <ConfigPanel
            mode={mode}
            onSelectMode={(newMode) => {
              setMode(newMode);
            }}
            answerMode={answerMode}
            onSelectAnswerMode={setAnswerMode}
            characterGroupKey={characterGroupKey}
            onSelectCharacterGroup={setCharacterGroupKey}
            difficulty={difficulty}
            onSelectDifficulty={setDifficulty}
            wordSelectionType={wordSelectionType}
            onSelectWordSelectionType={setWordSelectionType}
            questionCount={questionCount}
            onSelectQuestionCount={setQuestionCount}
            onStart={handleStartQuiz}
          />
        )}

        {quizState === 'playing' && questions.length > 0 && (
          <QuizCard
            key={questions[currentIndex]?.id || currentIndex}
            question={questions[currentIndex]}
            currentIndex={currentIndex}
            totalQuestions={questions.length}
            difficulty={difficulty}
            onChangeDifficulty={setDifficulty}
            wordSelectionType={wordSelectionType}
            onChangeWordSelectionType={setWordSelectionType}
            answerMode={answerMode}
            onChangeAnswerMode={setAnswerMode}
            characterGroupKey={characterGroupKey}
            soundEnabled={soundEnabled}
            onAnswer={handleAnswerQuestion}
          />
        )}

        {quizState === 'result' && (
          <ResultView
            results={results}
            mode={mode}
            soundEnabled={soundEnabled}
            onRetry={handleRetry}
            onChangeSettings={handleBackToConfig}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-slate-600 border-t border-slate-200 bg-white/50">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>カタカナ学習アプリ • タブレット & パソコン対応</span>
          <span>出題・回答入れ替え対応 • カタカナで選ぶ / ローマ字で選ぶ</span>
        </div>
      </footer>

      {/* Word List Reference Modal (100 words with Spanish) */}
      <WordListModal
        isOpen={isWordListModalOpen}
        onClose={() => setIsWordListModalOpen(false)}
        soundEnabled={soundEnabled}
      />

      {/* Katakana Chart Reference Modal */}
      <KatakanaChartModal
        isOpen={isChartModalOpen}
        onClose={() => setIsChartModalOpen(false)}
        soundEnabled={soundEnabled}
      />
    </div>
  );
}
