import { CharacterGroupKey, CharacterItem } from '../types';

export interface CharacterGroupDef {
  key: CharacterGroupKey;
  label: string;
  description: string;
  items: CharacterItem[];
}

export const A_ROW: CharacterItem[] = [
  { katakana: 'ア', romaji: 'a', row: 'ア行' },
  { katakana: 'イ', romaji: 'i', row: 'ア行' },
  { katakana: 'ウ', romaji: 'u', row: 'ア行' },
  { katakana: 'エ', romaji: 'e', row: 'ア行' },
  { katakana: 'オ', romaji: 'o', row: 'ア行' },
];

export const KA_ROW: CharacterItem[] = [
  { katakana: 'カ', romaji: 'ka', row: 'カ行' },
  { katakana: 'キ', romaji: 'ki', row: 'カ行' },
  { katakana: 'ク', romaji: 'ku', row: 'カ行' },
  { katakana: 'ケ', romaji: 'ke', row: 'カ行' },
  { katakana: 'コ', romaji: 'ko', row: 'カ行' },
];

export const SA_ROW: CharacterItem[] = [
  { katakana: 'サ', romaji: 'sa', row: 'サ行' },
  { katakana: 'シ', romaji: 'shi', row: 'サ行' },
  { katakana: 'ス', romaji: 'su', row: 'サ行' },
  { katakana: 'セ', romaji: 'se', row: 'サ行' },
  { katakana: 'ソ', romaji: 'so', row: 'サ行' },
];

export const TA_ROW: CharacterItem[] = [
  { katakana: 'タ', romaji: 'ta', row: 'タ行' },
  { katakana: 'チ', romaji: 'chi', row: 'タ行' },
  { katakana: 'ツ', romaji: 'tsu', row: 'タ行' },
  { katakana: 'テ', romaji: 'te', row: 'タ行' },
  { katakana: 'ト', romaji: 'to', row: 'タ行' },
];

export const NA_ROW: CharacterItem[] = [
  { katakana: 'ナ', romaji: 'na', row: 'ナ行' },
  { katakana: 'ニ', romaji: 'ni', row: 'ナ行' },
  { katakana: 'ヌ', romaji: 'nu', row: 'ナ行' },
  { katakana: 'ネ', romaji: 'ne', row: 'ナ行' },
  { katakana: 'ノ', romaji: 'no', row: 'ナ行' },
];

export const HA_ROW: CharacterItem[] = [
  { katakana: 'ハ', romaji: 'ha', row: 'ハ行' },
  { katakana: 'ヒ', romaji: 'hi', row: 'ハ行' },
  { katakana: 'フ', romaji: 'fu', row: 'ハ行' },
  { katakana: 'ヘ', romaji: 'he', row: 'ハ行' },
  { katakana: 'ホ', romaji: 'ho', row: 'ハ行' },
];

export const MA_ROW: CharacterItem[] = [
  { katakana: 'マ', romaji: 'ma', row: 'マ行' },
  { katakana: 'ミ', romaji: 'mi', row: 'マ行' },
  { katakana: 'ム', romaji: 'mu', row: 'マ行' },
  { katakana: 'メ', romaji: 'me', row: 'マ行' },
  { katakana: 'モ', romaji: 'mo', row: 'マ行' },
];

export const YA_ROW: CharacterItem[] = [
  { katakana: 'ヤ', romaji: 'ya', row: 'ヤ行' },
  { katakana: 'ユ', romaji: 'yu', row: 'ヤ行' },
  { katakana: 'ヨ', romaji: 'yo', row: 'ヤ行' },
];

export const RA_ROW: CharacterItem[] = [
  { katakana: 'ラ', romaji: 'ra', row: 'ラ行' },
  { katakana: 'リ', romaji: 'ri', row: 'ラ行' },
  { katakana: 'ル', romaji: 'ru', row: 'ラ行' },
  { katakana: 'レ', romaji: 're', row: 'ラ行' },
  { katakana: 'ロ', romaji: 'ro', row: 'ラ行' },
];

export const WA_ROW: CharacterItem[] = [
  { katakana: 'ワ', romaji: 'wa', row: 'ワ行' },
  { katakana: 'ヲ', romaji: 'wo', row: 'ワ行' },
  { katakana: 'ン', romaji: 'n', row: 'ン' },
];

export const ALL_CHARACTERS: CharacterItem[] = [
  ...A_ROW,
  ...KA_ROW,
  ...SA_ROW,
  ...TA_ROW,
  ...NA_ROW,
  ...HA_ROW,
  ...MA_ROW,
  ...YA_ROW,
  ...RA_ROW,
  ...WA_ROW,
];

// Confusing / visually similar Katakana pairs for the "ちょっと難しい" mode
export const SIMILAR_KATAKANA_MAP: Record<string, string[]> = {
  'シ': ['ツ', 'ソ', 'ン', 'ジ'],
  'ツ': ['シ', 'ソ', 'ン'],
  'ソ': ['ン', 'シ', 'ツ', 'リ'],
  'ン': ['ソ', 'シ', 'ツ'],
  'ア': ['マ', 'ヤ', 'イ', 'オ'],
  'マ': ['ア', 'ム', 'モ'],
  'ヤ': ['ア', 'ユ', 'セ'],
  'ク': ['ワ', 'ウ', 'タ', 'ケ'],
  'ワ': ['ク', 'ウ', 'フ', 'ラ'],
  'ウ': ['ワ', 'ク', 'フ'],
  'タ': ['ク', 'ケ', 'チ'],
  'チ': ['テ', 'ラ', 'タ'],
  'テ': ['チ', 'ラ', 'デ'],
  'ト': ['イ', 'ト'],
  'コ': ['ユ', 'ヨ', 'エ', 'ロ'],
  'ユ': ['コ', 'ヨ'],
  'ヨ': ['コ', 'ユ', 'エ'],
  'ヌ': ['ス', 'メ'],
  'ス': ['ヌ', 'セ'],
  'セ': ['サ', 'ス', 'ヤ'],
  'サ': ['キ', 'セ'],
  'キ': ['サ', 'ギ'],
  'カ': ['ケ', 'ク', '力'],
  'ケ': ['カ', 'ク', 'タ'],
  'ラ': ['フ', 'ワ', 'チ'],
  'フ': ['ワ', 'ラ', 'ヘ'],
  'ヘ': ['フ'],
  'オ': ['ホ', 'ア'],
  'ホ': ['オ'],
  'ロ': ['コ', 'ヨ'],
  'ネ': ['ホ', 'ヌ'],
  'ナ': ['メ', 'サ'],
  'ニ': ['ミ', 'エ'],
  'ミ': ['ニ', 'シ'],
  'モ': ['マ', 'モ'],
  'イ': ['ア', 'ト'],
};

export const CHARACTER_GROUPS: CharacterGroupDef[] = [
  {
    key: 'a-ka',
    label: 'ア・カ行',
    description: 'ア〜オ、カ〜コ（10文字のみ）',
    items: [...A_ROW, ...KA_ROW],
  },
  {
    key: 'sa-ta',
    label: 'サ・タ行',
    description: 'サ〜ソ、タ〜ト ＋ 前のア・カ行自動選択（計20文字）',
    items: [...A_ROW, ...KA_ROW, ...SA_ROW, ...TA_ROW],
  },
  {
    key: 'na-ha',
    label: 'ナ・ハ行',
    description: 'ナ〜ノ、ハ〜ホ ＋ 前の全行自動選択（計30文字）',
    items: [...A_ROW, ...KA_ROW, ...SA_ROW, ...TA_ROW, ...NA_ROW, ...HA_ROW],
  },
  {
    key: 'ma-ya',
    label: 'マ・ヤ行',
    description: 'マ〜モ、ヤ〜ヨ ＋ 前の全行自動選択（計38文字）',
    items: [...A_ROW, ...KA_ROW, ...SA_ROW, ...TA_ROW, ...NA_ROW, ...HA_ROW, ...MA_ROW, ...YA_ROW],
  },
  {
    key: 'ra-wa-n',
    label: 'ラ・ワ・ン行',
    description: '五十音すべての行（計46文字）',
    items: ALL_CHARACTERS,
  },
];
