'use client';
import { Suspense, useEffect, useState, useMemo } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import WordLearningCycle from '@/components/WordLearningCycle';
import UnitFastTrackQuiz from '@/components/UnitFastTrackQuiz';
import InteractiveUnitStory from '@/components/InteractiveUnitStory';
import Navbar from '@/components/Navbar';
import LoadingScreen from '@/components/LoadingScreen';
import type { Unit, WordData } from '@/lib/words';
import { getCuratedWordVisual } from '@/lib/wordVisuals';
import {
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Check,
  ArrowRight,
  Zap,
  Sparkles,
  X,
  BookOpen,
  CheckCircle2,
  MessageSquare,
} from 'lucide-react';
import Link from 'next/link';

function UnitContent() {
  const params = useParams();
  const unitId = params.unitId as string;
  const router = useRouter();
  const searchParams = useSearchParams();
  const autoStartQuiz = searchParams.get('quiz') === '1';

  const [unit, setUnit] = useState<Unit | null>(null);
  const [userLevel, setUserLevel] = useState('A1');
  const [loading, setLoading] = useState(true);

  // Progress state
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [completedWords, setCompletedWords] = useState<string[]>([]);
  const [unitDone, setUnitDone] = useState(false);

  // Optional Fast-Track Quiz state
  const [showFastTrackQuiz, setShowFastTrackQuiz] = useState(false);
  const [showEntryGateModal, setShowEntryGateModal] = useState(false);
  const [showStoryModal, setShowStoryModal] = useState(false);

  // Preload next word images in background for zero-latency instant transitions
  useEffect(() => {
    if (!unit?.words) return;
    const candidates = [
      unit.words[currentWordIdx + 1],
      unit.words[currentWordIdx + 2],
    ].filter(Boolean);

    candidates.forEach(w => {
      const curated = getCuratedWordVisual(w.word.trim().toLowerCase());
      if (curated?.imageUrl) {
        const img = new Image();
        img.src = curated.imageUrl;
      }
    });
  }, [currentWordIdx, unit]);

  useEffect(() => {
    Promise.all([
      import('@/lib/words').then(mod => mod.getUnit(unitId)),
      fetch('/api/user').then(r => r.json()),
      fetch(`/api/words/unit/${unitId}`).then(r => r.json()),
    ]).then(([u, userData, unitWords]) => {
      if (!userData.data?.placement_completed) {
        router.replace('/placement-test');
        return;
      }

      if (!u) { setLoading(false); return; }
      setUnit(u);
      setUserLevel(userData.data?.level ?? 'A1');

      const unitProgress: Array<{ word_id: string; stage: number }> =
        unitWords.data ?? [];

      const doneIds = unitProgress
        .filter(p => p.stage >= 5)
        .map(p => p.word_id);

      setCompletedWords(doneIds);

      const firstIncomplete = u.words.findIndex(w => !doneIds.includes(w.id));

      if (firstIncomplete === -1) {
        setUnitDone(true);
        setCurrentWordIdx(0);
      } else {
        setCurrentWordIdx(firstIncomplete);
        if (autoStartQuiz) {
          setShowFastTrackQuiz(true);
        } else {
          setShowEntryGateModal(true);
        }
      }

      setLoading(false);
    });
  }, [unitId, router, autoStartQuiz]);

  const uncompletedWords = useMemo(() => {
    if (!unit) return [];
    return unit.words.filter(w => !completedWords.includes(w.id));
  }, [unit, completedWords]);

  const handleFastTrackFinish = async (knownIds: string[]) => {
    setShowFastTrackQuiz(false);
    setShowEntryGateModal(false);

    if (!unit || knownIds.length === 0) return;

    const wordsToMark = knownIds.map(id => {
      const w = unit.words.find(x => x.id === id);
      return {
        wordId: id,
        word: w?.word || id,
        unitId: unit.id,
        level: userLevel,
      };
    });

    await fetch('/api/words/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'bulk-mark-known',
        words: wordsToMark,
      }),
    });

    const updatedDone = Array.from(new Set([...completedWords, ...knownIds]));
    setCompletedWords(updatedDone);

    const nextIncomplete = unit.words.findIndex(w => !updatedDone.includes(w.id));
    if (nextIncomplete === -1) {
      setUnitDone(true);
      setCurrentWordIdx(0);
    } else {
      setCurrentWordIdx(nextIncomplete);
      setUnitDone(false);
    }
  };

  const handleWordComplete = (correct: boolean) => {
    if (!unit) return;
    const currentWord = unit.words[currentWordIdx];
    if (!currentWord) return;

    const newDone = completedWords.includes(currentWord.id)
      ? completedWords
      : [...completedWords, currentWord.id];

    setCompletedWords(newDone);

    // If all words in the unit are now completed, conclude the unit!
    if (newDone.length >= unit.words.length) {
      setUnitDone(true);
      return;
    }

    // Smart Navigation: Skip already known words and go straight to the next unlearned word
    // 1. Look ahead from currentWordIdx + 1 to the end of the unit
    let nextIdx = -1;
    for (let i = currentWordIdx + 1; i < unit.words.length; i++) {
      if (!newDone.includes(unit.words[i].id)) {
        nextIdx = i;
        break;
      }
    }

    // 2. If no uncompleted word forward, wrap around from the beginning (0 to currentWordIdx)
    if (nextIdx === -1) {
      for (let i = 0; i < currentWordIdx; i++) {
        if (!newDone.includes(unit.words[i].id)) {
          nextIdx = i;
          break;
        }
      }
    }

    if (nextIdx !== -1) {
      setCurrentWordIdx(nextIdx);
    } else {
      setUnitDone(true);
    }
  };

  const handleReStudy = async () => {
    if (!unit) return;

    await fetch('/api/words/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'reset-unit',
        unitId: unit.id,
      }),
    });

    setCompletedWords([]);
    setCurrentWordIdx(0);
    setUnitDone(false);
    setShowFastTrackQuiz(false);
    setShowEntryGateModal(true);
  };

  const handleSelectWord = (idx: number) => {
    if (!unit || idx < 0 || idx >= unit.words.length) return;
    setUnitDone(false);
    setCurrentWordIdx(idx);
  };

  if (loading) return (
    <LoadingScreen
      message="جاري تحضير الوحدة التعليمية..."
      subtitle="نجهز الكلمات التفاعلية وتمارين التثبيت"
      icon="🎯"
    />
  );

  if (!unit) return (
    <div className="min-h-screen flex items-center justify-center text-slate-400 dark:text-slate-500 bg-[#f8fafc] dark:bg-[#0b0f19]">
      الوحدة المطلوبة غير موجودة
    </div>
  );

  if (showFastTrackQuiz && uncompletedWords.length > 0) {
    return (
      <UnitFastTrackQuiz
        unitTitle={unit.title}
        unitTitleAr={unit.titleAr}
        wordsToTest={uncompletedWords}
        allUnitWords={unit.words}
        onCancel={() => setShowFastTrackQuiz(false)}
        onFinish={handleFastTrackFinish}
      />
    );
  }

  if (unitDone) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#f8fafc] dark:bg-[#0b0f19] page-ambient relative overflow-hidden">
        {/* Dynamic ambient backdrop lights */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-indigo-500/15 dark:bg-indigo-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/15 dark:bg-purple-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 18 }}
          className="max-w-md w-full relative z-10 bg-white/95 dark:bg-[#111827]/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 text-center border border-indigo-100/80 dark:border-slate-800 shadow-2xl"
        >
          {/* ── Top Trophy / Celebration Badge ── */}
          <div className="relative mb-5 flex items-center justify-center">
            {/* Glowing aura */}
            <div className="absolute w-28 h-28 bg-gradient-to-tr from-amber-400/30 via-indigo-500/30 to-purple-500/30 rounded-full blur-xl animate-pulse" />
            
            {/* Rotating dashed ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
              className="absolute w-24 h-24 rounded-full border-2 border-dashed border-amber-400/40 dark:border-amber-400/25 pointer-events-none"
            />

            {/* Central 3D Glass Badge */}
            <motion.div
              animate={{ scale: [1, 1.05, 1], y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="relative w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-50 to-orange-50 dark:from-slate-800 dark:to-indigo-950/70 border-2 border-amber-300/60 dark:border-amber-400/30 shadow-xl flex items-center justify-center text-4xl shadow-amber-500/20"
            >
              <span>🏆</span>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-tr from-amber-400 to-amber-300 flex items-center justify-center shadow-md animate-bounce-gentle">
                <Sparkles size={13} className="text-white" />
              </div>
            </motion.div>
          </div>

          {/* ── Achievement Header ── */}
          <div className="inline-flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-black px-3.5 py-1 rounded-full border border-amber-200/80 dark:border-amber-800/80 mb-2.5">
            <Sparkles size={13} className="text-amber-500 fill-amber-500" />
            <span>إنجاز متميز · اكتملت الوحدة</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight mb-1">
            أحسنت صنعاً!
          </h2>

          <div className="text-base sm:text-lg font-black text-indigo-600 dark:text-indigo-400 mb-1">
            &quot;{unit.titleAr}&quot;
          </div>
          <div className="text-xs text-slate-400 dark:text-slate-500 font-medium ltr mb-4">
            {unit.title}
          </div>

          {/* ── Stats Pill ── */}
          <div className="inline-flex items-center gap-2 bg-slate-50 dark:bg-slate-800/80 px-4 py-2 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 mb-6 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 shadow-2xs">
            <CheckCircle2 size={16} className="text-emerald-500 fill-emerald-50 dark:fill-emerald-950" />
            <span>أتقنت جميع الـ {unit.words.length} كلمات بنسبة 100%</span>
          </div>

          {/* ── Interactive Bonus Activities Grid ── */}
          <div className="mb-5 text-right">
            <div className="text-[11px] font-bold text-slate-400 dark:text-slate-400 mb-2 flex items-center justify-between px-1">
              <span>تحديات ومكافآت الوحدة (+50 XP):</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-black">متاحة الآن ✨</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {/* Story Challenge Card */}
              <button
                type="button"
                onClick={() => setShowStoryModal(true)}
                className="group relative text-right p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 hover:bg-indigo-50/50 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all shadow-2xs hover:shadow-md hover:-translate-y-0.5 active:scale-95 cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl group-hover:scale-110 transition-transform">📖</span>
                  <span className="text-[10px] font-black bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 px-2 py-0.5 rounded-md">
                    +20 XP
                  </span>
                </div>
                <div>
                  <div className="text-xs font-black text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    قصة الوحدة
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-400 font-medium mt-0.5">
                    سياق واقعي ممتع
                  </div>
                </div>
              </button>

              {/* AI Roleplay Challenge Card */}
              <button
                type="button"
                onClick={() => router.push(`/roleplay?unit=${unit.id}`)}
                className="group relative text-right p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 hover:bg-purple-50/50 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all shadow-2xs hover:shadow-md hover:-translate-y-0.5 active:scale-95 cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl group-hover:scale-110 transition-transform">💬</span>
                  <span className="text-[10px] font-black bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/80 px-2 py-0.5 rounded-md">
                    +30 XP
                  </span>
                </div>
                <div>
                  <div className="text-xs font-black text-slate-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    محادثة AI
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-400 font-medium mt-0.5">
                    تحدث بطلاقة
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* ── Main Hero CTA: Continue Learning ── */}
          <button
            type="button"
            onClick={() => router.push('/learn')}
            className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white py-3.5 sm:py-4 rounded-2xl font-black text-sm sm:text-base shadow-lg shadow-indigo-500/25 btn-shimmer active:scale-95 transition-all flex items-center justify-center gap-2 mb-3 cursor-pointer"
          >
            <span>متابعة مسار التعلم</span>
            <ChevronLeft size={18} />
          </button>

          {/* ── Secondary Actions Strip (Review words & Vocabulary) ── */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              type="button"
              onClick={() => {
                setUnitDone(false);
                setCurrentWordIdx(0);
              }}
              className="py-2.5 px-3 rounded-xl border border-slate-200/80 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>استعراض الكلمات</span>
            </button>

            <button
              type="button"
              onClick={() => router.push('/vocabulary')}
              className="py-2.5 px-3 rounded-xl border border-slate-200/80 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>بنك المفردات</span>
            </button>
          </div>

          {/* ── Reset Option (Subtle & Safe) ── */}
          <button
            type="button"
            onClick={() => {
              if (window.confirm('هل تريد حقاً إعادة تعيين تقدم هذه الوحدة ودراستها مجدداً من البداية؟')) {
                handleReStudy();
              }
            }}
            className="text-[11px] text-slate-400 hover:text-rose-500 dark:text-slate-500 dark:hover:text-rose-400 font-semibold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw size={11} />
            <span>إعادة دراسة الوحدة من الصفر</span>
          </button>
        </motion.div>

        {/* Story Modal during celebration */}
        <AnimatePresence>
          {showStoryModal && (
            <InteractiveUnitStory
              unitId={unit.id}
              onClose={() => setShowStoryModal(false)}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  const word = unit.words[currentWordIdx];
  const totalWords = unit.words.length;
  const doneCount = completedWords.length;
  const progress = (doneCount / totalWords) * 100;

  const prevWord = currentWordIdx > 0 ? unit.words[currentWordIdx - 1] : null;
  const nextWord = currentWordIdx + 1 < unit.words.length ? unit.words[currentWordIdx + 1] : null;

  return (
    <div className="min-h-screen pb-28 pt-4 md:pt-24 bg-[#f8fafc] dark:bg-[#0b0f19] flex flex-col items-center">
      <Navbar />
      <div className="w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl px-4 lg:px-8 py-5 lg:py-8">

        {/* ── Entry Gate Modal ────────────────────────────────────────── */}
        <AnimatePresence>
          {showEntryGateModal && uncompletedWords.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 16 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 16 }}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-800 text-center relative"
              >
                <button
                  onClick={() => setShowEntryGateModal(false)}
                  className="absolute top-4 left-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
                  title="إغلاق والبدء بالتعلم"
                >
                  <X size={18} />
                </button>

                <div className="w-16 h-16 bg-gradient-to-tr from-amber-400 to-orange-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-200">
                  <Zap size={32} />
                </div>

                <h2 className="text-xl font-black text-slate-800 mb-1">
                  فحص التخطي السريع ⚡
                </h2>
                <p className="text-xs font-bold text-indigo-600 mb-3">
                  وحدة: &quot;{unit.titleAr}&quot;
                </p>

                <p className="text-slate-500 text-xs leading-relaxed mb-6">
                  هل تعرف بعض كلمات هذه الوحدة مسبقاً؟
                  <br />
                  يمكنك إجراء اختبار سريع ({uncompletedWords.length} أسئلة) لتخطي ما تعرفه فوراً واحتسابه كمدروس، لتركز فقط على الكلمات الجديدة!
                </p>

                <div className="flex flex-col gap-2.5">
                  <button
                    onClick={() => {
                      setShowEntryGateModal(false);
                      setShowFastTrackQuiz(true);
                    }}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-95 text-white py-3.5 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2"
                  >
                    <Zap size={17} fill="white" />
                    <span>إجراء فحص التخطي ({uncompletedWords.length} كلمات)</span>
                  </button>

                  <button
                    onClick={() => setShowEntryGateModal(false)}
                    className="w-full bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 py-3 rounded-2xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>تخطي الفحص وبدء التعلم المباشر</span>
                    <ArrowRight size={15} />
                  </button>
                </div>

                <div className="mt-3.5 text-[10px] text-slate-400">
                  * هذا الفحص اختياري لتسريع وتيرة دراستك
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Top Header Actions */}
        <div className="mb-5 lg:mb-7 flex items-center justify-between flex-wrap gap-2.5">
          <Link
            href="/learn"
            className="inline-flex items-center gap-1.5 text-xs lg:text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors bg-white dark:bg-slate-800 px-3.5 py-2 lg:px-4 lg:py-2.5 rounded-xl lg:rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs active:scale-95"
          >
            <ChevronRight size={18} />
            <span>العودة للوحدات</span>
          </Link>

          <div className="flex items-center gap-2 lg:gap-3 flex-wrap">
            {/* Interactive Story Button */}
            <button
              onClick={() => setShowStoryModal(true)}
              title="قراءة قصة الوحدة التفاعلية والاستماع لها"
              className="inline-flex items-center gap-1.5 text-xs lg:text-sm font-bold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-2 lg:px-4 lg:py-2.5 rounded-xl lg:rounded-2xl border border-indigo-200 dark:border-indigo-800/80 transition-all shadow-xs active:scale-95"
            >
              <BookOpen size={16} className="text-indigo-600 dark:text-indigo-400" />
              <span>قصة الوحدة</span>
            </button>

            {/* AI Roleplay Chat Button */}
            <Link
              href="/roleplay"
              title="محادثة تفاعلية موجهة مع الذكاء الاصطناعي (+30 XP)"
              className="inline-flex items-center gap-1.5 text-xs lg:text-sm font-bold text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/60 bg-purple-50 dark:bg-purple-950/60 px-3 py-2 lg:px-4 lg:py-2.5 rounded-xl lg:rounded-2xl border border-purple-200 dark:border-purple-800/80 transition-all shadow-xs active:scale-95"
            >
              <MessageSquare size={16} className="text-purple-600 dark:text-purple-400" />
              <span>محادثة AI</span>
            </Link>

            {uncompletedWords.length > 0 && (
              <button
                onClick={() => setShowFastTrackQuiz(true)}
                title="فحص سريع لاختبار معلوماتك وتخطي الكلمات المعروفة"
                className="inline-flex items-center gap-1.5 text-xs lg:text-sm font-bold text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 bg-amber-50 dark:bg-amber-950/60 px-3 py-2 lg:px-4 lg:py-2.5 rounded-xl lg:rounded-2xl border border-amber-300 dark:border-amber-800/80 transition-all shadow-xs active:scale-95"
              >
                <Zap size={16} className="fill-amber-500 text-amber-500" />
                <span>فحص التخطي ({uncompletedWords.length})</span>
              </button>
            )}

            <button
              onClick={handleReStudy}
              title="إعادة دراسة هذه الوحدة من البداية"
              className="inline-flex items-center gap-1.5 text-xs lg:text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 bg-white dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-orange-950/40 px-3 py-2 lg:px-4 lg:py-2.5 rounded-xl lg:rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-orange-200 dark:hover:border-orange-800/60 transition-all shadow-xs active:scale-95"
            >
              <RotateCcw size={15} />
              <span>إعادة التعيين</span>
            </button>
          </div>
        </div>

        {/* Unit Info & Interactive Strip Card */}
        <div className="mb-6 lg:mb-8 bg-white dark:bg-slate-900 rounded-3xl p-5 lg:p-7 shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h1 className="text-lg lg:text-2xl font-black text-slate-800 dark:text-white">{unit.titleAr}</h1>
              <div className="text-xs lg:text-sm text-slate-400 dark:text-slate-500 ltr mt-0.5">{unit.title}</div>
            </div>
            <div className="text-left">
              <div className="text-xs lg:text-base font-black text-indigo-600 dark:text-indigo-400">
                الكلمة {currentWordIdx + 1} من {totalWords}
              </div>
              <div className="text-[10px] lg:text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                {doneCount} من {totalWords} مكتملة ({Math.round(progress)}%)
              </div>
            </div>
          </div>

          {/* Unit Progress Bar */}
          <div className="h-2 lg:h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* ── Word Numbers Strip (1..10) ────────────────────────── */}
          <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800">
            <div className="text-[11px] lg:text-sm font-bold text-slate-400 dark:text-slate-500 mb-2.5 flex items-center justify-between">
              <span>انقر على رقم الكلمة للتنقل المباشر:</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-black">{currentWordIdx + 1}/{totalWords}</span>
            </div>
            
            <div className="grid grid-cols-10 gap-1.5 lg:gap-2.5" dir="ltr">
              {unit.words.map((w, idx) => {
                const isDone = completedWords.includes(w.id);
                const isCurrent = idx === currentWordIdx;

                return (
                  <button
                    key={w.id}
                    onClick={() => handleSelectWord(idx)}
                    title={`${idx + 1}. ${w.word} - ${w.meaningAr} ${isDone ? '(مكتملة ✓)' : ''}`}
                    className={`h-9 lg:h-12 rounded-xl lg:rounded-2xl text-xs lg:text-base font-bold transition-all relative flex items-center justify-center ${
                      isCurrent
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-300 dark:shadow-indigo-950 scale-105 ring-2 ring-indigo-200 dark:ring-indigo-500/40'
                        : isDone
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                    }`}
                  >
                    <span>{idx + 1}</span>
                    {isDone && !isCurrent && (
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 lg:w-4 lg:h-4 bg-emerald-500 rounded-full flex items-center justify-center text-[8px] lg:text-[10px] text-white">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Main Word Learning Cycle ───────────────────────────────────────── */}
        <WordLearningCycle
          key={word.id}
          word={word}
          unitId={unit.id}
          level={userLevel}
          unitWords={unit.words}
          onComplete={handleWordComplete}
        />

        {/* ── Bottom Previous / Next Navigation Controls ─────────────────────── */}
        <div className="flex items-center justify-between gap-3 lg:gap-4 mt-6 lg:mt-8 pt-4 lg:pt-6 border-t border-slate-200/60 dark:border-slate-800">
          
          {/* Previous word (moves backwards in unit) */}
          <button
            onClick={() => handleSelectWord(currentWordIdx - 1)}
            disabled={currentWordIdx === 0}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 lg:py-4 lg:px-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-xs md:text-sm lg:text-base text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none shadow-xs"
          >
            <ChevronRight size={18} className="lg:w-5 lg:h-5" />
            <span>الكلمة السابقة</span>
            {prevWord && (
              <span className="text-[11px] lg:text-xs text-slate-400 dark:text-slate-500 font-semibold ltr hidden sm:inline">
                ({prevWord.word})
              </span>
            )}
          </button>

          {/* Word position indicator */}
          <div className="text-center px-2 flex-none">
            <span className="text-xs lg:text-sm font-bold text-slate-500 dark:text-slate-300 bg-white dark:bg-slate-800 px-3.5 py-2 lg:px-4 lg:py-2.5 rounded-xl lg:rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
              الكلمة {currentWordIdx + 1} من {totalWords}
            </span>
          </div>

          {/* Next word (moves forward in unit) */}
          <button
            onClick={() => handleSelectWord(currentWordIdx + 1)}
            disabled={currentWordIdx + 1 >= unit.words.length}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 lg:py-4 lg:px-6 rounded-2xl border border-indigo-200 dark:border-indigo-800/70 bg-indigo-50 dark:bg-indigo-950/60 font-bold text-xs md:text-sm lg:text-base text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none shadow-xs"
          >
            <span>الكلمة التالية</span>
            {nextWord && (
              <span className="text-[11px] lg:text-xs text-indigo-400 dark:text-indigo-400 font-semibold ltr hidden sm:inline">
                ({nextWord.word})
              </span>
            )}
            <ChevronLeft size={18} className="lg:w-5 lg:h-5" />
          </button>
        </div>

        {/* ── Interactive Unit Story Modal ─────────────────────────────── */}
        <AnimatePresence>
          {showStoryModal && (
            <InteractiveUnitStory
              unitId={unit.id}
              onClose={() => setShowStoryModal(false)}
            />
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

export default function UnitPage() {
  return (
    <Suspense
      fallback={
        <LoadingScreen
          message="جاري فتح الوحدة..."
          subtitle="لحظات ونبدأ جلسة التعلم"
          icon="📖"
        />
      }
    >
      <UnitContent />
    </Suspense>
  );
}
