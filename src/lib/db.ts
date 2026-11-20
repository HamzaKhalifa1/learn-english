import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(process.cwd(), 'data', 'learn-eng.db');

let db: any = null;

export function getDb(): any {
  if (!db) {
    const dataDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const Database = require('better-sqlite3');
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initializeSchema();
  }
  return db;
}

function initializeSchema() {
  const database = db;
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL DEFAULT 'Learner',
      level TEXT NOT NULL DEFAULT 'A1',
      xp INTEGER NOT NULL DEFAULT 0,
      streak INTEGER NOT NULL DEFAULT 0,
      last_activity_date TEXT,
      placement_completed INTEGER NOT NULL DEFAULT 0,
      session_token TEXT UNIQUE,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    INSERT OR IGNORE INTO users (id, name) VALUES (1, 'متعلم');

    CREATE TABLE IF NOT EXISTS word_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL DEFAULT 1,
      word_id TEXT NOT NULL,
      word TEXT NOT NULL,
      unit_id TEXT NOT NULL,
      level TEXT NOT NULL,
      stage INTEGER NOT NULL DEFAULT 0,
      total_attempts INTEGER NOT NULL DEFAULT 0,
      correct_attempts INTEGER NOT NULL DEFAULT 0,
      pronunciation_score INTEGER NOT NULL DEFAULT 0,
      ease_factor REAL NOT NULL DEFAULT 2.5,
      interval_days INTEGER NOT NULL DEFAULT 1,
      next_review_date TEXT,
      last_reviewed_date TEXT,
      is_learned INTEGER NOT NULL DEFAULT 0,
      is_mastered INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(user_id, word_id)
    );

    CREATE TABLE IF NOT EXISTS quiz_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL DEFAULT 1,
      unit_id TEXT NOT NULL,
      score INTEGER NOT NULL DEFAULT 0,
      total_questions INTEGER NOT NULL DEFAULT 0,
      correct_answers INTEGER NOT NULL DEFAULT 0,
      duration_seconds INTEGER NOT NULL DEFAULT 0,
      completed_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS daily_activity (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL DEFAULT 1,
      date TEXT NOT NULL,
      words_learned INTEGER NOT NULL DEFAULT 0,
      words_reviewed INTEGER NOT NULL DEFAULT 0,
      xp_earned INTEGER NOT NULL DEFAULT 0,
      minutes_studied INTEGER NOT NULL DEFAULT 0,
      UNIQUE(user_id, date)
    );

    CREATE TABLE IF NOT EXISTS placement_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL DEFAULT 1,
      score INTEGER NOT NULL,
      total_questions INTEGER NOT NULL,
      level TEXT NOT NULL,
      completed_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS story_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL DEFAULT 1,
      unit_id TEXT NOT NULL,
      is_completed INTEGER NOT NULL DEFAULT 0,
      score INTEGER NOT NULL DEFAULT 0,
      completed_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(user_id, unit_id)
    );

    CREATE TABLE IF NOT EXISTS dictionary_cache (
      word TEXT PRIMARY KEY,
      meaning_ar TEXT NOT NULL,
      phonetic TEXT,
      part_of_speech_ar TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS roleplay_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL DEFAULT 1,
      scenario_id TEXT NOT NULL,
      unit_id TEXT,
      level TEXT NOT NULL,
      turns_count INTEGER NOT NULL DEFAULT 0,
      target_words_used INTEGER NOT NULL DEFAULT 0,
      xp_earned INTEGER NOT NULL DEFAULT 30,
      completed_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(user_id, scenario_id)
    );
  `);

  // Safe migration for session_token column and index
  try {
    database.exec(`ALTER TABLE users ADD COLUMN session_token TEXT`);
  } catch {
    // Column already exists
  }
  try {
    database.exec(`CREATE UNIQUE INDEX IF NOT EXISTS idx_users_session_token ON users(session_token)`);
  } catch {
    // Index already exists
  }
}

// ============ Roleplay ============
export function getCompletedRoleplayScenarios(userId = 1): string[] {
  const rows = getDb().prepare(
    'SELECT scenario_id FROM roleplay_sessions WHERE user_id = ?'
  ).all(userId) as { scenario_id: string }[];
  return rows.map(r => r.scenario_id);
}

export function saveRoleplaySession(
  scenarioId: string,
  unitId: string | null,
  level: string,
  turnsCount: number,
  targetWordsUsed: number,
  xp = 30,
  userId = 1
) {
  getDb().prepare(`
    INSERT INTO roleplay_sessions (user_id, scenario_id, unit_id, level, turns_count, target_words_used, xp_earned, completed_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
    ON CONFLICT(user_id, scenario_id) DO UPDATE SET
      turns_count = MAX(turns_count, excluded.turns_count),
      target_words_used = MAX(target_words_used, excluded.target_words_used),
      completed_at = datetime('now')
  `).run(userId, scenarioId, unitId || null, level, turnsCount, targetWordsUsed, xp);

  addXP(xp, userId);
}

// ============ Dictionary Cache ============
export function getDictionaryCache(word: string): { meaning_ar: string; phonetic?: string; part_of_speech_ar?: string } | undefined {
  return getDb().prepare('SELECT meaning_ar, phonetic, part_of_speech_ar FROM dictionary_cache WHERE word = ?').get(word.toLowerCase().trim()) as any;
}

export function saveDictionaryCache(word: string, meaningAr: string, phonetic?: string, partOfSpeechAr?: string) {
  getDb().prepare(`
    INSERT INTO dictionary_cache (word, meaning_ar, phonetic, part_of_speech_ar)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(word) DO UPDATE SET
      meaning_ar = excluded.meaning_ar,
      phonetic = COALESCE(excluded.phonetic, dictionary_cache.phonetic),
      part_of_speech_ar = COALESCE(excluded.part_of_speech_ar, dictionary_cache.part_of_speech_ar)
  `).run(word.toLowerCase().trim(), meaningAr, phonetic || null, partOfSpeechAr || null);
}

// ============ User ============
export function getUser(userId = 1): User {
  return getDb().prepare('SELECT * FROM users WHERE id = ?').get(userId) as User;
}

export function updateUserLevel(level: string, userId = 1) {
  return getDb().prepare(
    'UPDATE users SET level = ?, placement_completed = 1 WHERE id = ?'
  ).run(level, userId);
}

export function addXP(amount: number, userId = 1) {
  const user = getUser(userId);
  if (!user) return;
  const today = new Date().toISOString().split('T')[0];
  const isNewDay = user.last_activity_date !== today;

  let newStreak = user.streak;
  if (isNewDay) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    newStreak = user.last_activity_date === yesterday ? user.streak + 1 : 1;
  }

  getDb().prepare(
    'UPDATE users SET xp = xp + ?, streak = ?, last_activity_date = ? WHERE id = ?'
  ).run(amount, newStreak, today, userId);

  getDb().prepare(`
    INSERT INTO daily_activity (user_id, date, xp_earned)
    VALUES (?, ?, ?)
    ON CONFLICT(user_id, date) DO UPDATE SET xp_earned = xp_earned + ?
  `).run(userId, today, amount, amount);
}

// ============ Placement: bulk-mark lower-level words as known ============
export function markLowerLevelWordsAsKnown(
  userLevel: string,
  words: { id: string; word: string; unitId: string; level: string }[],
  userId = 1
) {
  const LEVEL_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const userIdx = LEVEL_ORDER.indexOf(userLevel);
  if (userIdx <= 0) return; // A1 → nothing to skip

  const insert = getDb().prepare(`
    INSERT INTO word_progress (user_id, word_id, word, unit_id, level, stage, is_learned, correct_attempts, total_attempts)
    VALUES (?, ?, ?, ?, ?, 5, 1, 1, 1)
    ON CONFLICT(user_id, word_id) DO NOTHING
  `);

  const run = getDb().transaction(() => {
    for (const w of words) {
      const wLevelIdx = LEVEL_ORDER.indexOf(w.level.substring(0, 2).toUpperCase());
      if (wLevelIdx < userIdx) {
        insert.run(userId, w.id, w.word, w.unitId, w.level);
      }
    }
  });
  run();
}

// ============ Word Progress ============
export function getWordProgress(wordId: string, userId = 1): WordProgress | undefined {
  return getDb()
    .prepare('SELECT * FROM word_progress WHERE user_id = ? AND word_id = ?')
    .get(userId, wordId) as WordProgress | undefined;
}

export function getAllWordProgress(userId = 1): WordProgress[] {
  return getDb()
    .prepare('SELECT * FROM word_progress WHERE user_id = ? ORDER BY updated_at DESC')
    .all(userId) as WordProgress[];
}

export function upsertWordProgress(data: {
  word_id: string;
  word: string;
  unit_id: string;
  level: string;
  stage?: number;
  user_id?: number;
}) {
  const userId = data.user_id ?? 1;
  const existing = getWordProgress(data.word_id, userId);
  if (!existing) {
    getDb().prepare(`
      INSERT INTO word_progress (user_id, word_id, word, unit_id, level, stage)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(userId, data.word_id, data.word, data.unit_id, data.level, data.stage ?? 1);
  }
}

export function updateWordStage(wordId: string, stage: number, correct?: boolean, userId = 1) {
  const existing = getWordProgress(wordId, userId);
  if (!existing) return;

  let totalAttempts = existing.total_attempts;
  let correctAttempts = existing.correct_attempts;
  let isLearned = existing.is_learned;
  let easeFactor = existing.ease_factor;
  let intervalDays = existing.interval_days;
  let nextReviewDate = existing.next_review_date;
  const lastReviewedDate = new Date().toISOString().split('T')[0];

  if (correct !== undefined) {
    totalAttempts += 1;
    if (correct) correctAttempts += 1;

    if (stage >= 5) {
      isLearned = 1;
      const sm2 = calculateSM2(existing, correct);
      easeFactor = sm2.ease_factor;
      intervalDays = sm2.interval_days;
      nextReviewDate = new Date(
        Date.now() + intervalDays * 86400000
      ).toISOString().split('T')[0];
    }
  }

  getDb().prepare(`
    UPDATE word_progress
    SET stage = ?,
        total_attempts = ?,
        correct_attempts = ?,
        is_learned = ?,
        ease_factor = ?,
        interval_days = ?,
        next_review_date = ?,
        last_reviewed_date = ?,
        updated_at = datetime('now')
    WHERE user_id = ? AND word_id = ?
  `).run(
    stage,
    totalAttempts,
    correctAttempts,
    isLearned,
    easeFactor,
    intervalDays,
    nextReviewDate,
    lastReviewedDate,
    userId,
    wordId
  );
}

function calculateSM2(word: WordProgress, correct: boolean) {
  let { ease_factor, interval_days } = word;
  if (correct) {
    if (interval_days <= 1) interval_days = 3;
    else if (interval_days <= 3) interval_days = 7;
    else interval_days = Math.round(interval_days * ease_factor);
    ease_factor = Math.min(3.0, ease_factor + 0.1);
  } else {
    interval_days = 1;
    ease_factor = Math.max(1.3, ease_factor - 0.2);
  }
  return { ease_factor, interval_days };
}

export function getWordsForReview(userId = 1): WordProgress[] {
  const today = new Date().toISOString().split('T')[0];
  return getDb().prepare(`
    SELECT * FROM word_progress
    WHERE user_id = ?
      AND is_learned = 1
      AND (next_review_date IS NULL OR next_review_date <= ?)
    ORDER BY next_review_date ASC
    LIMIT 20
  `).all(userId, today) as WordProgress[];
}

export function savePlacementResult(score: number, total: number, level: string, userId = 1) {
  getDb().prepare(
    'INSERT INTO placement_results (user_id, score, total_questions, level) VALUES (?, ?, ?, ?)'
  ).run(userId, score, total, level);
  updateUserLevel(level, userId);
}

export function getStats(userId = 1) {
  const database = getDb();
  const totalWords = (database.prepare(
    'SELECT COUNT(*) as count FROM word_progress WHERE user_id = ?'
  ).get(userId) as { count: number }).count;

  const learnedWords = (database.prepare(
    'SELECT COUNT(*) as count FROM word_progress WHERE user_id = ? AND is_learned = 1'
  ).get(userId) as { count: number }).count;

  const masteredWords = (database.prepare(
    'SELECT COUNT(*) as count FROM word_progress WHERE user_id = ? AND is_mastered = 1'
  ).get(userId) as { count: number }).count;

  const reviewDue = (database.prepare(`
    SELECT COUNT(*) as count FROM word_progress
    WHERE user_id = ?
      AND is_learned = 1
      AND (next_review_date IS NULL OR next_review_date <= date('now'))
  `).get(userId) as { count: number }).count;

  const user = getUser(userId);

  return {
    totalWords,
    learnedWords,
    masteredWords,
    reviewDue,
    xp: user?.xp ?? 0,
    streak: user?.streak ?? 0,
    level: user?.level ?? 'A1',
  };
}

export interface StoryProgress {
  id: number;
  user_id: number;
  unit_id: string;
  is_completed: number;
  score: number;
  completed_at: string;
}

// ============ Story Progress ============
export function getStoryProgress(unitId: string, userId = 1): StoryProgress | undefined {
  return getDb().prepare(
    'SELECT * FROM story_progress WHERE user_id = ? AND unit_id = ?'
  ).get(userId, unitId) as StoryProgress | undefined;
}

export function saveStoryProgress(unitId: string, score: number, xp = 20, userId = 1) {
  getDb().prepare(`
    INSERT INTO story_progress (user_id, unit_id, is_completed, score, completed_at)
    VALUES (?, ?, 1, ?, datetime('now'))
    ON CONFLICT(user_id, unit_id) DO UPDATE SET
      is_completed = 1,
      score = MAX(score, excluded.score),
      completed_at = datetime('now')
  `).run(userId, unitId, score);

  addXP(xp, userId);
}

export function getAllCompletedStoryUnits(userId = 1): string[] {
  const rows = getDb().prepare(
    'SELECT unit_id FROM story_progress WHERE user_id = ? AND is_completed = 1'
  ).all(userId) as { unit_id: string }[];
  return rows.map(r => r.unit_id);
}

export interface User {
  id: number;
  name: string;
  level: string;
  xp: number;
  streak: number;
  last_activity_date: string | null;
  placement_completed: number;
  session_token?: string | null;
  created_at: string;
}

export interface WordProgress {
  id: number;
  user_id: number;
  word_id: string;
  word: string;
  unit_id: string;
  level: string;
  stage: number;
  total_attempts: number;
  correct_attempts: number;
  pronunciation_score: number;
  ease_factor: number;
  interval_days: number;
  next_review_date: string | null;
  last_reviewed_date: string | null;
  is_learned: number;
  is_mastered: number;
  created_at: string;
  updated_at: string;
}
