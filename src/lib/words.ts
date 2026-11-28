import wordsData from '@/data/words.json';

export interface WordData {
  id: string;
  word: string;
  phonetic: string;
  syllables: string;
  partOfSpeech: string;
  partOfSpeechAr: string;
  meaningEn: string;
  meaningAr: string;
  meaning?: string;
  synonyms: string[];
  antonyms: string[];
  examples: string[];
  example?: string;
  exampleAr?: string;
  imageQuery: string;
  category: string;
}

export function normalizeWord(w: any): WordData {
  const meaningAr = w.meaningAr || w.meaning || w.translationAr || '';
  const meaningEn = w.meaningEn || w.definition || '';
  const examples = Array.isArray(w.examples) && w.examples.length > 0 
    ? w.examples 
    : w.example ? [w.example] : [];

  return {
    ...w,
    meaningAr,
    meaning: w.meaning || meaningAr,
    meaningEn,
    examples,
    example: w.example || examples[0] || '',
    synonyms: Array.isArray(w.synonyms) ? w.synonyms : [],
    antonyms: Array.isArray(w.antonyms) ? w.antonyms : [],
  };
}

export interface Unit {
  id: string;
  title: string;
  titleAr: string;
  words: WordData[];
  level?: string; // populated by getAllUnits
}

export interface LevelData {
  units: Unit[];
}

export interface PlacementQuestion {
  id: string;
  level: string;
  type: string;
  question: string;
  questionAr: string;
  options: string[];
  correct: string;
  image?: string;
}

const data = wordsData as {
  levels: Record<string, LevelData>;
  placementTest: { questions: PlacementQuestion[] };
};

export function getAllUnits(): (Unit & { level: string })[] {
  return Object.entries(data.levels).flatMap(([lvl, l]) =>
    l.units.map(u => ({
      ...u,
      level: lvl,
      words: (u.words || []).map(normalizeWord),
    }))
  );
}

// Level order for sorting
const LEVEL_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export function getUnitsByLevel(level: string): Unit[] {
  // Return ALL units from A1 up to and including user's level
  const userLevelKey = level.substring(0, 2).toUpperCase();
  const userLevelIndex = LEVEL_ORDER.indexOf(userLevelKey);
  const cutoff = userLevelIndex === -1 ? 0 : userLevelIndex;

  return LEVEL_ORDER.slice(0, cutoff + 1)
    .flatMap(lvl => data.levels[lvl]?.units ?? []);
}

export function getAllUnitsGrouped(): { level: string; units: Unit[] }[] {
  return LEVEL_ORDER
    .filter(lvl => data.levels[lvl])
    .map(lvl => ({ level: lvl, units: data.levels[lvl].units }));
}

export function getUnit(unitId: string): Unit | undefined {
  return getAllUnits().find(u => u.id === unitId);
}

export function getWord(wordId: string): WordData | undefined {
  for (const unit of getAllUnits()) {
    const word = unit.words.find(w => w.id === wordId);
    if (word) return word;
  }
  return undefined;
}

export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function getPlacementQuestions(): PlacementQuestion[] {
  return data.placementTest.questions.map(q => ({
    ...q,
    options: shuffleArray(q.options),
  }));
}

/**
 * Adaptive level determination.
 * 
 * Uses per-level scoring: for each level band, we check
 * how many questions in that band were answered correctly.
 * The user's level is the HIGHEST level where they scored ≥60%.
 * 
 * This is more accurate than a simple percentage threshold
 * because it properly evaluates each skill band independently.
 */
export function determineLevelFromScore(score: number, total: number, answers?: { questionId: string; correct: boolean }[]): string {
  // If we have detailed per-question answers, use adaptive algorithm
  if (answers && answers.length > 0) {
    const questions = data.placementTest.questions;
    const questionMap = new Map(questions.map(q => [q.id, q]));

    // Count correct answers per level
    const levelCorrect: Record<string, number> = {};
    const levelTotal: Record<string, number> = {};

    for (const a of answers) {
      const q = questionMap.get(a.questionId);
      if (!q) continue;
      levelTotal[q.level] = (levelTotal[q.level] || 0) + 1;
      if (a.correct) levelCorrect[q.level] = (levelCorrect[q.level] || 0) + 1;
    }

    // Find highest level with ≥60% correct
    let determinedLevel = 'A1';
    for (const level of LEVEL_ORDER) {
      const correct = levelCorrect[level] || 0;
      const tot = levelTotal[level] || 0;
      if (tot === 0) continue;
      const pct = (correct / tot) * 100;
      if (pct >= 60) {
        determinedLevel = level;
      } else {
        // Failed this level — stop here (previous level is their level)
        break;
      }
    }

    return determinedLevel;
  }

  // Fallback: simple percentage thresholds (25 questions)
  const pct = (score / total) * 100;
  if (pct < 25) return 'A1';
  if (pct < 45) return 'A2';
  if (pct < 60) return 'B1';
  if (pct < 75) return 'B2';
  if (pct < 88) return 'C1';
  return 'C2';
}

export function getLevelLabel(level: string): string {
  const labels: Record<string, string> = {
    A1: 'مبتدئ',
    A2: 'أساسي',
    B1: 'متوسط',
    B2: 'فوق المتوسط',
    C1: 'متقدم',
    C2: 'متقن',
  };
  return labels[level] ?? level;
}

export function getLevelColor(level: string): string {
  const colors: Record<string, string> = {
    A1: 'bg-green-100 text-green-800',
    A2: 'bg-blue-100 text-blue-800',
    B1: 'bg-yellow-100 text-yellow-800',
    B2: 'bg-orange-100 text-orange-800',
    C1: 'bg-red-100 text-red-800',
    C2: 'bg-purple-100 text-purple-800',
  };
  return colors[level] ?? 'bg-gray-100 text-gray-800';
}

/**
 * Returns a human-readable description of question type
 */
export function getQuestionTypeLabel(type: string): { label: string; emoji: string } {
  const types: Record<string, { label: string; emoji: string }> = {
    vocabulary: { label: 'مفردات', emoji: '📝' },
    grammar: { label: 'قواعد', emoji: '📐' },
    reading: { label: 'فهم القراءة', emoji: '📖' },
    'fill-blank': { label: 'تعبئة الفراغ', emoji: '✏️' },
    meaning: { label: 'معاني', emoji: '💡' },
  };
  return types[type] ?? { label: type, emoji: '❓' };
}
