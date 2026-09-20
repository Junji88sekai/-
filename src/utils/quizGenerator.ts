import { ALL_CHARACTERS, CHARACTER_GROUPS, SIMILAR_KATAKANA_MAP } from '../data/characters';
import { KATAKANA_WORDS } from '../data/words';
import { AnswerMode, CharacterGroupKey, Difficulty, Mode, QuizQuestion, WordSelectionType } from '../types';

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function getChoicesCountForDifficulty(difficulty: Difficulty, poolSize: number): number {
  if (difficulty === 'easy') {
    return Math.min(4, poolSize);
  }
  if (difficulty === 'normal') {
    return Math.min(6, poolSize);
  }
  // 'hard'
  return Math.min(10, poolSize);
}

// Generate single-character options for Word spelling mode (Katakana or Romaji)
export function generateCharOptionsForWord(
  targetWord: string,
  difficulty: Difficulty,
  answerMode: AnswerMode = 'katakana'
): string[] {
  const targetChars = Array.from(new Set(targetWord.split('')));

  let targetCount = 6;
  if (difficulty === 'easy') {
    targetCount = Math.max(5, targetChars.length + 1);
  } else if (difficulty === 'normal') {
    targetCount = Math.max(7, targetChars.length + 3);
  } else {
    targetCount = Math.max(9, targetChars.length + 4);
  }
  targetCount = Math.min(targetCount, 12);

  const neededDistractors = Math.max(0, targetCount - targetChars.length);
  const distractors: string[] = [];

  if (answerMode === 'katakana') {
    if (difficulty === 'hard') {
      // Distractors from visually similar Katakana
      for (const char of targetChars) {
        const similars = SIMILAR_KATAKANA_MAP[char] || [];
        for (const sim of similars) {
          if (!targetChars.includes(sim) && !distractors.includes(sim)) {
            distractors.push(sim);
            if (distractors.length >= neededDistractors) break;
          }
        }
        if (distractors.length >= neededDistractors) break;
      }
    }

    // Fill remaining from ALL_CHARACTERS + common marks
    if (distractors.length < neededDistractors) {
      const allKanaList = ALL_CHARACTERS.map((c) => c.katakana);
      const extraPunctuation = ['ー', 'ッ', 'ン'];
      const candidates = shuffleArray([...allKanaList, ...extraPunctuation]).filter(
        (k) => !targetChars.includes(k) && !distractors.includes(k)
      );
      for (const cand of candidates) {
        if (distractors.length >= neededDistractors) break;
        distractors.push(cand);
      }
    }
  } else {
    // Romaji single-character options
    const commonRomajiLetters = [
      'a', 'i', 'u', 'e', 'o',
      'k', 's', 't', 'n', 'h',
      'm', 'y', 'r', 'w',
      'g', 'z', 'd', 'b', 'p',
    ];
    // Include macrons if target has any or occasionally as distractor
    const macrons = ['ā', 'ī', 'ū', 'ē', 'ō'];
    const candidates = shuffleArray([...commonRomajiLetters, ...macrons]).filter(
      (c) => !targetChars.includes(c) && !distractors.includes(c)
    );
    for (const cand of candidates) {
      if (distractors.length >= neededDistractors) break;
      distractors.push(cand);
    }
  }

  return shuffleArray([...targetChars, ...distractors]);
}

// Generate whole-word options for Word mode (Katakana or Romaji)
export function generateWordOptions(
  correctTarget: string,
  difficulty: Difficulty,
  answerMode: AnswerMode = 'katakana'
): string[] {
  const wordChoicesCount =
    difficulty === 'easy' ? 4 : difficulty === 'normal' ? 6 : 8;
  const distractorsNeeded = wordChoicesCount - 1;

  const isKatakana = answerMode === 'katakana';
  const otherWords = KATAKANA_WORDS.filter((w) =>
    isKatakana ? w.word !== correctTarget : w.romaji !== correctTarget
  );

  let chosenDistractors: string[] = [];

  if (difficulty === 'hard') {
    const firstChar = correctTarget[0];
    const sameFirstCharWords = otherWords
      .filter((w) => (isKatakana ? w.word.startsWith(firstChar) : w.romaji.startsWith(firstChar)))
      .map((w) => (isKatakana ? w.word : w.romaji));

    chosenDistractors = shuffleArray(sameFirstCharWords).slice(0, distractorsNeeded);

    if (chosenDistractors.length < distractorsNeeded) {
      const restWords = otherWords
        .filter((w) => !chosenDistractors.includes(isKatakana ? w.word : w.romaji))
        .map((w) => (isKatakana ? w.word : w.romaji));
      const extra = shuffleArray(restWords).slice(0, distractorsNeeded - chosenDistractors.length);
      chosenDistractors = [...chosenDistractors, ...extra];
    }
  } else {
    chosenDistractors = shuffleArray(otherWords)
      .slice(0, distractorsNeeded)
      .map((w) => (isKatakana ? w.word : w.romaji));
  }

  return shuffleArray([correctTarget, ...chosenDistractors]);
}

// Generate Character options for Character mode (Katakana or Romaji)
export function generateCharOptions(
  correctKatakana: string,
  correctRomaji: string,
  difficulty: Difficulty,
  characterGroupKey: CharacterGroupKey,
  answerMode: AnswerMode = 'katakana'
): string[] {
  const group =
    CHARACTER_GROUPS.find((g) => g.key === characterGroupKey) || CHARACTER_GROUPS[0];
  const pool = group.items;
  const targetChoicesCount = getChoicesCountForDifficulty(difficulty, pool.length);
  const distractorsNeeded = targetChoicesCount - 1;

  if (answerMode === 'katakana') {
    const poolKatakana = pool.map((c) => c.katakana);
    const otherKatakanaInPool = poolKatakana.filter((k) => k !== correctKatakana);

    let chosenDistractors: string[] = [];

    if (difficulty === 'hard') {
      const similarCandidates = (SIMILAR_KATAKANA_MAP[correctKatakana] || []).filter((k) =>
        otherKatakanaInPool.includes(k)
      );
      chosenDistractors = [...similarCandidates];
      const remainingOther = otherKatakanaInPool.filter((k) => !chosenDistractors.includes(k));
      const shuffledRemaining = shuffleArray(remainingOther);
      for (const rem of shuffledRemaining) {
        if (chosenDistractors.length >= distractorsNeeded) break;
        chosenDistractors.push(rem);
      }
    } else {
      chosenDistractors = shuffleArray(otherKatakanaInPool).slice(0, distractorsNeeded);
    }

    return shuffleArray([correctKatakana, ...chosenDistractors]);
  } else {
    // Answer mode is 'romaji': prompt is Katakana, user selects Romaji
    const poolRomaji = pool.map((c) => c.romaji);
    const otherRomajiInPool = poolRomaji.filter((r) => r !== correctRomaji);

    let chosenDistractors: string[] = [];

    if (difficulty === 'hard') {
      // Find similar Katakana, and if their romaji is in pool, prioritize them
      const similarKana = SIMILAR_KATAKANA_MAP[correctKatakana] || [];
      const similarRomajiInPool = pool
        .filter((item) => similarKana.includes(item.katakana) && item.romaji !== correctRomaji)
        .map((item) => item.romaji);

      chosenDistractors = [...similarRomajiInPool];
      const remainingOther = otherRomajiInPool.filter((r) => !chosenDistractors.includes(r));
      const shuffledRemaining = shuffleArray(remainingOther);
      for (const rem of shuffledRemaining) {
        if (chosenDistractors.length >= distractorsNeeded) break;
        chosenDistractors.push(rem);
      }
    } else {
      chosenDistractors = shuffleArray(otherRomajiInPool).slice(0, distractorsNeeded);
    }

    return shuffleArray([correctRomaji, ...chosenDistractors]);
  }
}

export function generateQuiz(
  mode: Mode,
  options: {
    characterGroupKey: CharacterGroupKey;
    questionCount: number;
    difficulty: Difficulty;
    wordSelectionType?: WordSelectionType;
    answerMode?: AnswerMode;
  }
): QuizQuestion[] {
  const {
    difficulty,
    characterGroupKey,
    questionCount,
    wordSelectionType = 'char',
    answerMode = 'katakana',
  } = options;

  if (mode === 'character') {
    const group =
      CHARACTER_GROUPS.find((g) => g.key === characterGroupKey) || CHARACTER_GROUPS[0];
    const pool = group.items;

    // Build question sequence
    const selectedItems = [];
    while (selectedItems.length < questionCount) {
      const batch = shuffleArray(pool);
      for (const item of batch) {
        selectedItems.push(item);
        if (selectedItems.length >= questionCount) break;
      }
    }

    return selectedItems.map((item, index) => {
      const choices = generateCharOptions(
        item.katakana,
        item.romaji,
        difficulty,
        characterGroupKey,
        answerMode
      );

      return {
        id: `char-${index}-${item.katakana}-${Date.now()}`,
        romaji: item.romaji,
        correctKatakana: item.katakana,
        options: choices,
        mode: 'character',
        answerMode,
      };
    });
  } else {
    // Word Mode
    const shuffledWords = shuffleArray(KATAKANA_WORDS);
    const count = Math.min(questionCount, shuffledWords.length);
    const selectedWords = shuffledWords.slice(0, count);

    return selectedWords.map((wordItem, index) => {
      let choices: string[] = [];
      if (wordSelectionType === 'char') {
        const target = answerMode === 'katakana' ? wordItem.word : wordItem.romaji;
        choices = generateCharOptionsForWord(target, difficulty, answerMode);
      } else {
        const target = answerMode === 'katakana' ? wordItem.word : wordItem.romaji;
        choices = generateWordOptions(target, difficulty, answerMode);
      }

      return {
        id: `word-${index}-${wordItem.id}`,
        romaji: wordItem.romaji,
        correctKatakana: wordItem.word,
        options: choices,
        spanishHint: wordItem.spanish,
        mode: 'word',
        answerMode,
      };
    });
  }
}

export function generateOptionsForQuestion(
  correctKatakana: string,
  romaji: string,
  mode: Mode,
  difficulty: Difficulty,
  characterGroupKey: CharacterGroupKey,
  wordSelectionType: WordSelectionType = 'char',
  answerMode: AnswerMode = 'katakana'
): string[] {
  if (mode === 'character') {
    return generateCharOptions(
      correctKatakana,
      romaji,
      difficulty,
      characterGroupKey,
      answerMode
    );
  } else {
    // Word Mode
    const target = answerMode === 'katakana' ? correctKatakana : romaji;
    if (wordSelectionType === 'char') {
      return generateCharOptionsForWord(target, difficulty, answerMode);
    }
    return generateWordOptions(target, difficulty, answerMode);
  }
}
