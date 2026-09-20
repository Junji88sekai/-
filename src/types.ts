export type Mode = 'character' | 'word';

export type AnswerMode = 'katakana' | 'romaji';

export type WordSelectionType = 'char' | 'word';

export type Difficulty = 'easy' | 'normal' | 'hard';

export type CharacterGroupKey = 'a-ka' | 'sa-ta' | 'na-ha' | 'ma-ya' | 'ra-wa-n';

export interface CharacterItem {
  romaji: string;
  katakana: string;
  row: string;
}

export interface WordItem {
  id: number;
  word: string; // Katakana word, e.g. "アイス"
  romaji: string; // e.g. "aisu"
  spanish: string; // e.g. "helado"
}

export interface QuizQuestion {
  id: string | number;
  romaji: string;
  correctKatakana: string;
  options: string[]; // choices (Katakana or Romaji depending on answerMode)
  spanishHint?: string; // provided in word mode
  mode: Mode;
  answerMode: AnswerMode;
}

export interface QuizResultItem {
  questionNumber: number;
  romaji: string;
  correctKatakana: string;
  answerMode: AnswerMode;
  promptText: string;
  correctAnswer: string;
  selectedAnswer: string;
  isCorrect: boolean;
  spanish?: string;
}

export type QuizState = 'config' | 'playing' | 'result';
