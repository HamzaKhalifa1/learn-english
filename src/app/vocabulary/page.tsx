'use client';
import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Volume2,
  Eye,
  EyeOff,
  CheckSquare,
  Square,
  Play,
  RotateCcw,
  Search,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Clock,
  Filter,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { getLevelColor } from '@/lib/words';
import { playTTS } from '@/lib/tts';

interface WordProg {
  id: number;
  word_id: string;
  word: string;
  unit_id: string;
  level: string;
  stage: number;
  total_attempts: number;
  correct_attempts: number;
  is_learned: number;
  is_mastered: number;
  next_review_date: string | null;
  updated_at: string;
  meaningAr?: string;
  meaningEn?: string;
  phonetic?: string;
  category?: string;
}

const STAGE_LABELS = ['لم يبدأ', '👁️ تعرف', '📖 معنى', '🔊 نطق', '✍️ جملة', '✅ مكتمل'];
const LEVEL_LIST = ['all', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;

export default function VocabularyPage() {
  const router = useRouter();
  const [words, setWords] = useState<WordProg[]>([]);
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'learned' | 'in-progress'>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Translation visibility states
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  const [showAllMeanings, setShowAllMeanings] = useState(false);

  // Selection for custom review
  const [selectedWordIds, setSelectedWordIds] = useState<Set<string>>(new Set());

  // Expanded card details
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/words')
      .then(r => r.json())
      .then(d => {
        setWords(d.data ?? []);
        setLoading(false);
      });
  }, []);

  // Count words by level
  const levelCounts = useMemo(() => {
    const counts: Record<string, number> = { all: words.length };
    words.forEach(w => {
      const lvl = w.level.toUpperCase();
      counts[lvl] = (counts[lvl] || 0) + 1;
    });
    return counts;
  }, [words]);

  // Filtered word list
  const filtered = useMemo(() => {
    return words.filter(w => {
      if (levelFilter !== 'all' && w.level.toUpperCase() !== levelFilter) {
        return false;
      }
      if (statusFilter === 'learned' && w.is_learned !== 1) return false;
      if (statusFilter === 'in-progress' && (w.is_learned === 1 || w.stage === 0)) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchWord = w.word.toLowerCase().includes(q);
        const matchMeaning = w.meaningAr?.toLowerCase().includes(q);
        if (!matchWord && !matchMeaning) return false;
      }
      return true;
    });
  }, [words, levelFilter, statusFilter, search]);

  const toggleMeaning = (wordId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setRevealedIds(prev => {
      const next = new Set(prev);
      if (next.has(wordId)) next.delete(wordId);
      else next.add(wordId);
      return next;
    });
  };

  const handleToggleAllMeanings = () => {
    if (showAllMeanings) {
      setShowAllMeanings(false);
      setRevealedIds(new Set());
    } else {
      setShowAllMeanings(true);
      const allIds = new Set(filtered.map(w => w.word_id));
      setRevealedIds(allIds);
    }
  };

  const toggleSelectWord = (wordId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedWordIds(prev => {
      const next = new Set(prev);
      if (next.has(wordId)) next.delete(wordId);
      else next.add(wordId);
      return next;
    });
  };

  const handleSelectAllFiltered = () => {
    if (selectedWordIds.size === filtered.length && filtered.length > 0) {
      setSelectedWordIds(new Set());
    } else {
      setSelectedWordIds(new Set(filtered.map(w => w.word_id)));
    }
  };

  const handleStartCustomReview = () => {
    if (selectedWordIds.size === 0) return;
    const ids = Array.from(selectedWordIds).join(',');
    router.push(`/review?words=${encodeURIComponent(ids)}`);
  };

  const speakWord = (word: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playTTS(word, { voice: 'en-US-AriaNeural' });
  };

  const getAccuracy = (w: WordProg) => {
    if (!w.total_attempts) return null;
    return Math.round((w.correct_attempts / w.total_attempts) * 100);
  };

  const getAccuracyColor = (pct: number | null) => {
    if (pct === null) return 'text-slate-300';
    if (pct >= 80) return 'text-emerald-600';
    if (pct >= 60) return 'text-amber-600';
    return 'text-rose-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#0b0f19]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/60 rounded-2xl flex items-center justify-center text-3xl animate-bounce-gentle">
            📦
          </div>
          <div className="text-slate-500 dark:text-slate-400 font-bold text-sm">جاري تحميل المفردات...</div>
        </div>
      </div>
    );
  }

  const isAllSelected = filtered.length > 0 && selectedWordIds.size === filtered.length;

  return (
    <div className="min-h-screen pb-32 pt-4 md:pt-24 bg-[#f8fafc] dark:bg-[#0b0f19] flex flex-col items-center">
      <Navbar />
      <div className="w-full max-w-2xl px-4 py-5">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
              <span>📦</span>
              <span>بنك المفردات</span>
            </h1>
            <p className="text-slate-400 dark:text-slate-400 text-xs font-semibold mt-0.5">
              {words.length} كلمة مسجلة في مكتبتك التعليمية
            </p>
          </div>

          {/* Toggle All Meanings Single-click Button */}
          <button
            onClick={handleToggleAllMeanings}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 border ${
              showAllMeanings
                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700 hover:bg-amber-100'
                : 'bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-indigo-50/50'
            }`}
          >
            {showAllMeanings ? (
              <>
                <EyeOff size={15} />
                <span>إخفاء المعاني</span>
              </>
            ) : (
              <>
                <Eye size={15} />
                <span>إظهار كل المعاني 👁️</span>
              </>
            )}
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <input
            className="w-full border-2 border-slate-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-400 bg-white dark:bg-slate-900 rounded-2xl pr-10 pl-4 py-3 ltr outline-none shadow-xs text-sm font-semibold text-slate-800 dark:text-white transition-colors placeholder:font-normal placeholder:text-slate-400 dark:placeholder:text-slate-500"
            placeholder="Search word or Arabic meaning..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            dir="ltr"
          />
          <Search className="absolute right-3.5 top-3.5 text-slate-400 dark:text-slate-500" size={18} />
        </div>

        {/* ── Level Filter Chips ───────────────────────────────────── */}
        <div className="mb-3.5">
          <div className="text-[11px] font-bold text-slate-400 mb-1.5 px-1 flex items-center gap-1">
            <Filter size={11} />
            <span>فلترة حسب المستوى:</span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {LEVEL_LIST.map(lvl => {
              const active = levelFilter === lvl;
              const count = levelCounts[lvl.toUpperCase()] || (lvl === 'all' ? words.length : 0);
              return (
                <button
                  key={lvl}
                  onClick={() => setLevelFilter(lvl)}
                  className={`flex-none px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    active
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200 dark:shadow-indigo-950 scale-105'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50/40 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{lvl === 'all' ? 'جميع المستويات' : lvl}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    active ? 'bg-indigo-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Status Filter & Selection Toolbar ───────────────────────── */}
        <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
          <div className="flex gap-1.5">
            {([['all', 'الكل'], ['learned', 'مكتملة ✅'], ['in-progress', 'قيد التعلم 🔄']] as const).map(([val, label]) => (
              <button
                key={val}
                onClick={() => setStatusFilter(val)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  statusFilter === val
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-purple-200 dark:hover:border-purple-700 hover:bg-purple-50/30'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {filtered.length > 0 && (
            <button
              onClick={handleSelectAllFiltered}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 flex items-center gap-1.5 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs active:scale-95"
            >
              {isAllSelected ? <CheckSquare size={14} className="text-indigo-600 dark:text-indigo-400" /> : <Square size={14} className="text-slate-400" />}
              <span>{isAllSelected ? 'إلغاء تحديد الكل' : 'تحديد الكل للمراجعة'}</span>
            </button>
          )}
        </div>

        {/* ── Words List ────────────────────────────────────────────────────── */}
        {words.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-8">
            <div className="text-6xl mb-4">📭</div>
            <div className="text-slate-700 dark:text-slate-200 font-black text-lg mb-1">لم تتعلم أي كلمة بعد</div>
            <p className="text-slate-400 dark:text-slate-400 text-xs mb-5">ابدأ بإجراء اختبار تحديد المستوى أو تصفح الوحدات الأولى</p>
            <a
              href="/learn"
              className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-2xl font-bold text-xs shadow-md shadow-indigo-100 dark:shadow-indigo-950 active:scale-95"
            >
              ابدأ التعلم الآن 🚀
            </a>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-14 text-slate-400 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 text-xs font-semibold">
            لا توجد كلمات مطابقة لمعايير البحث والفلترة المحددة
          </div>
        ) : (
          <div className="space-y-2.5">
            {filtered.map((w, i) => {
              const acc = getAccuracy(w);
              const isOpen = expandedId === w.id;
              const isSelected = selectedWordIds.has(w.word_id);
              const isMeaningRevealed = showAllMeanings || revealedIds.has(w.word_id);

              return (
                <motion.div
                  key={w.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.015, 0.25) }}
                  onClick={() => setExpandedId(isOpen ? null : w.id)}
                  className={`bg-white dark:bg-slate-900 rounded-2xl p-4 cursor-pointer select-none transition-all border ${
                    isSelected
                      ? 'border-indigo-400 dark:border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/40 shadow-md ring-2 ring-indigo-100 dark:ring-indigo-900/50'
                      : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    
                    {/* Checkbox for Custom Review */}
                    <button
                      onClick={(e) => toggleSelectWord(w.word_id, e)}
                      title={isSelected ? 'إلغاء التحديد' : 'تحديد للمراجعة'}
                      className="flex-none p-1 text-indigo-600 dark:text-indigo-400 hover:scale-110 transition-transform"
                    >
                      {isSelected ? (
                        <CheckSquare size={20} className="text-indigo-600 dark:text-indigo-400 fill-indigo-50 dark:fill-indigo-950" />
                      ) : (
                        <Square size={20} className="text-slate-300 dark:text-slate-600 hover:text-slate-500" />
                      )}
                    </button>

                    {/* Word Info & Translation */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="text-base md:text-lg font-black ltr text-slate-800 dark:text-white">{w.word}</span>
                        <span className={`text-[10px] font-black px-2 py-0.2 rounded-md ${getLevelColor(w.level)}`}>
                          {w.level}
                        </span>
                        {w.phonetic && (
                          <span className="text-xs text-slate-400 dark:text-slate-400 font-mono ltr">{w.phonetic}</span>
                        )}
                      </div>

                      {/* ── Translation Area (Hidden by default / revealed on click) ── */}
                      <div
                        onClick={(e) => toggleMeaning(w.word_id, e)}
                        title="انقر لإظهار أو إخفاء المعنى العربي"
                        className="inline-flex items-center gap-1.5 cursor-pointer text-xs group"
                      >
                        {isMeaningRevealed ? (
                          <span className="font-bold text-indigo-800 dark:text-indigo-200 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-lg border border-indigo-100 dark:border-indigo-800/60 flex items-center gap-1.5">
                            <span>{w.meaningAr || '—'}</span>
                            <EyeOff size={12} className="text-indigo-400 opacity-60 group-hover:opacity-100" />
                          </span>
                        ) : (
                          <span className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50/60 px-2.5 py-0.5 rounded-lg border border-slate-100 dark:border-slate-700 transition-colors flex items-center gap-1.5">
                            <span className="filter blur-[3.5px] select-none text-[11px] text-slate-300 dark:text-slate-600">معنى الكلمة هنا</span>
                            <span className="text-[10px] text-indigo-500 dark:text-indigo-400 font-bold underline">إظهار المعنى 👁️</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Accuracy Percentage */}
                    <div className="text-center flex-none w-14">
                      {acc !== null ? (
                        <>
                          <div className={`text-base font-black ${getAccuracyColor(acc)}`}>{acc}%</div>
                          <div className="text-[10px] text-slate-400 font-semibold">دقة</div>
                        </>
                      ) : (
                        <div className="text-slate-300 text-xs font-bold">—</div>
                      )}
                    </div>

                    {/* Speak Button */}
                    <button
                      onClick={e => speakWord(w.word, e)}
                      title="استمع للنطق"
                      className="flex-none w-9 h-9 bg-slate-50 hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 border border-slate-200/80 rounded-xl flex items-center justify-center transition-colors active:scale-95"
                    >
                      <Volume2 size={17} />
                    </button>
                  </div>

                  {/* 5-Segment Stage Progress Bar */}
                  <div className="mt-3 flex gap-1">
                    {[1, 2, 3, 4, 5].map(s => (
                      <div
                        key={s}
                        className={`flex-1 h-1.5 rounded-full transition-all ${
                          w.stage >= s
                            ? w.stage === 5
                              ? 'bg-emerald-500'
                              : 'bg-indigo-500'
                            : 'bg-slate-100'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Expanded Statistics & Options */}
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 pt-3 border-t border-slate-100"
                    >
                      {w.meaningEn && (
                        <div className="text-xs text-slate-600 ltr mb-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
                          {w.meaningEn}
                        </div>
                      )}

                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="bg-slate-50 rounded-xl p-2 border border-slate-100">
                          <div className="font-black text-slate-700 text-sm">{w.total_attempts}</div>
                          <div className="text-[10px] text-slate-400 font-semibold">محاولة</div>
                        </div>
                        <div className="bg-emerald-50 rounded-xl p-2 border border-emerald-100">
                          <div className="font-black text-emerald-700 text-sm">{w.correct_attempts}</div>
                          <div className="text-[10px] text-emerald-600 font-semibold">صحيحة</div>
                        </div>
                        <div className="bg-indigo-50 rounded-xl p-2 border border-indigo-100">
                          <div className="font-black text-indigo-700 text-sm">{STAGE_LABELS[w.stage] ?? '—'}</div>
                          <div className="text-[10px] text-indigo-600 font-semibold">المرحلة</div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ── Floating Bottom Action Bar for Review ───────────────────────── */}
        <AnimatePresence>
          {selectedWordIds.size > 0 && (
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              className="fixed bottom-16 md:bottom-6 left-4 right-4 max-w-lg mx-auto z-40 bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-4 shadow-2xl flex items-center justify-between border border-slate-700"
            >
              <div>
                <div className="text-sm font-bold flex items-center gap-2">
                  <span className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-xs font-black">
                    {selectedWordIds.size}
                  </span>
                  <span>كلمات مختارة للمراجعة</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  اضغط للبدء بجلسة استذكار فورية
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedWordIds(new Set())}
                  className="px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors font-bold"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleStartCustomReview}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-5 py-2.5 rounded-xl font-black text-xs transition-all shadow-md shadow-orange-500/20 flex items-center gap-1.5 active:scale-95"
                >
                  <Play size={14} fill="white" />
                  <span>ابدأ المراجعة</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
