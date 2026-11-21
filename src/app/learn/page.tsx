'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Lock, ChevronRight, RefreshCw, Zap, CheckCircle2, BookOpen, Sparkles, MessageSquare } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { getLevelColor } from '@/lib/words';
import type { Unit } from '@/lib/words';
import InteractiveUnitStory from '@/components/InteractiveUnitStory';

const LEVEL_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const LEVEL_LABELS: Record<string, string> = {
  A1: 'مبتدئ',
  A2: 'مبتدئ متقدم',
  B1: 'متوسط',
  B2: 'متوسط متقدم',
  C1: 'متقدم',
  C2: 'محترف',
};

const LEVEL_ICONS: Record<string, string> = {
  A1: '🌱',
  A2: '🌿',
  B1: '🚀',
  B2: '⚡',
  C1: '🎯',
  C2: '👑',
};

interface UnitWithLevel extends Unit {
  level: string;
}

export default function LearnPage() {
  const router = useRouter();
  const [allUnits, setAllUnits] = useState<UnitWithLevel[]>([]);
  const [userLevel, setUserLevel] = useState('A1');
  const [wordProgress, setWordProgress] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [retakingTest, setRetakingTest] = useState(false);
  const [selectedStoryUnit, setSelectedStoryUnit] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/user').then(r => r.json()),
      fetch('/api/words').then(r => r.json()),
    ]).then(async ([u, w]) => {
      if (!u.data?.placement_completed) {
        router.replace('/placement-test');
        return;
      }

      let level = u.data?.level ?? 'A1';

      const prog: Record<string, number> = {};
      (w.data ?? []).forEach((wp: { word_id: string; stage: number }) => {
        prog[wp.word_id] = wp.stage;
      });
      setWordProgress(prog);

      // Load ALL units from words data, tagged with their level
      const wordsData = await import('@/data/words.json');
      const data = wordsData.default as { levels: Record<string, { units: Unit[] }> };
      const units: UnitWithLevel[] = LEVEL_ORDER
        .filter(lvl => data.levels[lvl])
        .flatMap(lvl => data.levels[lvl].units.map(u => ({ ...u, level: lvl })));
      setAllUnits(units);

      // Check if user has completed all words of their current level; if so, auto-promote!
      const currentLvlUnits = units.filter(un => un.level === level);
      const currentLvlTotal = currentLvlUnits.reduce((acc, un) => acc + un.words.length, 0);
      const currentLvlDone = currentLvlUnits.reduce(
        (acc, un) => acc + un.words.filter(wd => (prog[wd.id] ?? 0) >= 5).length,
        0
      );

      if (currentLvlTotal > 0 && currentLvlDone >= currentLvlTotal) {
        const currentIdx = LEVEL_ORDER.indexOf(level);
        if (currentIdx + 1 < LEVEL_ORDER.length) {
          const nextLvl = LEVEL_ORDER[currentIdx + 1];
          fetch('/api/user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'update-level', level: nextLvl }),
          });
          level = nextLvl;
        }
      }

      setUserLevel(level);
      setLoading(false);
    });
  }, [router]);

  const handleRetakePlacement = async () => {
    const confirmed = window.confirm(
      'هل ترغب حقاً في إعادة اختبار تحديد المستوى؟\nسيتم تقييم مستواك الحالي وفتح الوحدات المناسبة له.'
    );
    if (!confirmed) return;

    setRetakingTest(true);
    try {
      await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset-placement' }),
      });
      router.push('/placement-test');
    } catch {
      setRetakingTest(false);
    }
  };

  const getUnitProgress = (unit: Unit) => {
    const done = unit.words.filter(w => (wordProgress[w.id] ?? 0) >= 5).length;
    return {
      done,
      total: unit.words.length,
      pct: Math.round((done / unit.words.length) * 100),
    };
  };

  const userLevelIndex = LEVEL_ORDER.indexOf(userLevel.substring(0, 2).toUpperCase());

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#0b0f19]">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/60 rounded-2xl flex items-center justify-center text-3xl animate-bounce-gentle">
          📚
        </div>
        <div className="text-slate-500 dark:text-slate-400 font-bold text-sm">جاري تحميل الوحدات...</div>
      </div>
    </div>
  );

  // Group units by level
  const grouped = LEVEL_ORDER
    .filter(lvl => allUnits.some(u => u.level === lvl))
    .map(lvl => ({
      level: lvl,
      label: LEVEL_LABELS[lvl] ?? lvl,
      icon: LEVEL_ICONS[lvl] ?? '📘',
      units: allUnits.filter(u => u.level === lvl),
    }));

  return (
    <div className="min-h-screen pb-28 pt-4 md:pt-24 bg-[#f8fafc] dark:bg-[#0b0f19] flex flex-col items-center">
      <Navbar />
      <div className="w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl px-4 lg:px-8 py-5 lg:py-8">
        
        {/* Header with Level & Retake Button */}
        <div className="mb-6 lg:mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-4xl font-black text-slate-800 dark:text-white flex items-center gap-2 lg:gap-3">
              <span className="text-2xl lg:text-4xl">📖</span>
              <span>وحدات التعلم</span>
            </h1>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-slate-400 dark:text-slate-400 text-xs lg:text-base font-semibold">مستواك الحالي:</span>
              <span className={`text-xs lg:text-sm font-black px-2.5 py-0.5 lg:px-3.5 lg:py-1 rounded-full ${getLevelColor(userLevel)}`}>
                {userLevel} • {LEVEL_LABELS[userLevel] || userLevel}
              </span>
            </div>
          </div>

          <button
            onClick={handleRetakePlacement}
            disabled={retakingTest}
            title="إعادة اختبار تحديد المستوى"
            className="flex items-center gap-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 px-3 py-1.5 lg:px-4 lg:py-2.5 rounded-xl text-xs lg:text-sm font-bold transition-all shadow-xs active:scale-95 disabled:opacity-50"
          >
            <RefreshCw size={13} className={retakingTest ? 'animate-spin' : ''} />
            <span>إعادة الامتحان</span>
          </button>
        </div>

        <div className="space-y-8 lg:space-y-10">
          {grouped.map(({ level, label, icon, units }) => {
            const lvlIndex = LEVEL_ORDER.indexOf(level);
            
            // Check if all previous levels are completed:
            let allPrevCompleted = true;
            for (let i = 0; i < lvlIndex; i++) {
              const pLvl = LEVEL_ORDER[i];
              const pUnits = allUnits.filter(u => u.level === pLvl);
              const pTotal = pUnits.reduce((acc, u) => acc + u.words.length, 0);
              const pDone = pUnits.reduce((acc, u) => acc + u.words.filter(w => (wordProgress[w.id] ?? 0) >= 5).length, 0);
              if (pTotal > 0 && (pDone / pTotal) < 0.8) {
                allPrevCompleted = false;
                break;
              }
            }

            const isLevelLocked = lvlIndex > userLevelIndex && !allPrevCompleted;

            // Track previous unit's pct within this specific level
            let prevUnitPct = 100;

            const totalWordsInLevel = units.reduce((acc, u) => acc + u.words.length, 0);
            const doneWordsInLevel = units.reduce((acc, u) => acc + u.words.filter(w => (wordProgress[w.id] ?? 0) >= 5).length, 0);
            const levelPct = totalWordsInLevel > 0 ? Math.round((doneWordsInLevel / totalWordsInLevel) * 100) : 0;

            return (
              <div key={level} className="space-y-3 lg:space-y-4">
                
                {/* Level header bar */}
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2 lg:gap-3">
                    <span className="text-xl lg:text-3xl">{icon}</span>
                    <span className={`text-xs lg:text-sm font-black px-2.5 py-0.5 lg:px-3 lg:py-1 rounded-lg ${getLevelColor(level)}`}>
                      {level}
                    </span>
                    <span className="text-sm lg:text-xl font-bold text-slate-700 dark:text-slate-200">{label}</span>
                  </div>

                  <div>
                    {isLevelLocked ? (
                      <span className="text-[11px] lg:text-sm font-bold text-slate-400 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 lg:px-3.5 lg:py-1.5 rounded-full flex items-center gap-1.5 border border-slate-200 dark:border-slate-700">
                        <Lock size={12} />
                        <span>أكمل المستوى السابق</span>
                      </span>
                    ) : levelPct === 100 ? (
                      <span className="text-[11px] lg:text-sm font-black text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 lg:px-3.5 lg:py-1.5 rounded-full flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800/60">
                        <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400" />
                        <span>مكتمل بالكامل 100%</span>
                      </span>
                    ) : (
                      <span className="text-[11px] lg:text-sm font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 lg:px-3.5 lg:py-1.5 rounded-full flex items-center gap-1.5 border border-indigo-100 dark:border-indigo-800/60">
                        <span>{doneWordsInLevel}/{totalWordsInLevel} كلمة</span>
                        <span>({levelPct}%)</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Units List - single column, comfortable reading */}
                <div className="space-y-3 lg:space-y-4">
                  {units.map((unit, unitIdx) => {
                    const { done, total, pct } = getUnitProgress(unit);
                    const isCompleted = done === total && total > 0;
                    const isLocked = isLevelLocked || (unitIdx > 0 && prevUnitPct < 50);
                    prevUnitPct = pct;

                    return (
                      <motion.div
                        key={unit.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(unitIdx * 0.03, 0.3) }}
                      >
                        <div
                          onClick={() => {
                            if (!isLocked) router.push(`/learn/${unit.id}`);
                          }}
                          onKeyDown={(e) => {
                            if ((e.key === 'Enter' || e.key === ' ') && !isLocked) {
                              router.push(`/learn/${unit.id}`);
                            }
                          }}
                          role="button"
                          tabIndex={isLocked ? -1 : 0}
                          className={`block bg-white dark:bg-slate-900 rounded-2xl lg:rounded-3xl p-4 lg:p-6 border transition-all cursor-pointer ${
                            isLocked
                              ? 'opacity-55 cursor-not-allowed pointer-events-none border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50'
                              : isCompleted
                              ? 'border-emerald-100 dark:border-emerald-900/50 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-md'
                              : 'border-slate-100 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md active:scale-[0.99]'
                          }`}
                        >
                          <div className="flex items-center gap-3.5 lg:gap-5">
                            
                            {/* Unit Status Icon */}
                            <div className={`w-12 h-12 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl flex items-center justify-center text-xl lg:text-3xl flex-none shadow-xs transition-colors ${
                              isCompleted
                                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/60'
                                : isLocked
                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
                                : done > 0
                                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/60'
                                : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-700'
                            }`}>
                              {isCompleted ? (
                                <CheckCircle2 size={24} className="lg:w-8 lg:h-8 text-emerald-500 fill-emerald-50 dark:fill-emerald-950" />
                              ) : isLocked ? (
                                <Lock size={18} className="lg:w-6 lg:h-6 text-slate-400" />
                              ) : done > 0 ? (
                                <BookOpen size={20} className="lg:w-7 lg:h-7 text-indigo-600 dark:text-indigo-400" />
                              ) : (
                                <span>📖</span>
                              )}
                            </div>

                            {/* Unit Info & Clean Progress Bar */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <div className="font-bold text-slate-800 dark:text-white text-sm lg:text-xl truncate">
                                  {unit.titleAr}
                                </div>
                                <div className="text-xs lg:text-base font-bold flex-none">
                                  {isCompleted ? (
                                    <span className="text-emerald-600 dark:text-emerald-400 font-black">100%</span>
                                  ) : done > 0 ? (
                                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">{done}/{total}</span>
                                  ) : (
                                    <span className="text-slate-400 dark:text-slate-400 font-medium">{total} كلمات</span>
                                  )}
                                </div>
                              </div>

                              <div className="text-xs lg:text-base text-slate-400 dark:text-slate-400 ltr truncate mt-0.5">
                                {unit.title}
                              </div>

                              {/* Progress Track */}
                              <div className="mt-2.5 h-2 lg:h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    isCompleted
                                      ? 'bg-gradient-to-l from-emerald-400 to-teal-500'
                                      : 'bg-gradient-to-l from-indigo-500 to-purple-500'
                                  }`}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>

                            {/* Direct Fast-Track Test Button */}
                            {!isCompleted && !isLocked && (
                              <button
                                type="button"
                                title="إجراء فحص سريع لتخطي الكلمات المعروفة مسبقاً"
                                className="flex items-center gap-1.5 text-[11px] lg:text-sm font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-300 dark:border-amber-800/80 px-2.5 py-1.5 lg:px-3.5 lg:py-2 rounded-xl transition-all shadow-xs flex-none active:scale-95"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  router.push(`/learn/${unit.id}?quiz=1`);
                                }}
                              >
                                <Zap size={14} className="fill-amber-500 text-amber-500" />
                                <span>فحص سريع</span>
                              </button>
                            )}

                            {/* Direct Story Button for Completed Units */}
                            {isCompleted && (
                              <button
                                type="button"
                                title="قراءة واستماع قصة الوحدة التفاعلية (+20 XP)"
                                className="flex items-center gap-1.5 text-[11px] lg:text-sm font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800/80 px-2.5 py-1.5 lg:px-3.5 lg:py-2 rounded-xl transition-all shadow-xs flex-none active:scale-95"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedStoryUnit(unit.id);
                                }}
                              >
                                <BookOpen size={14} className="text-indigo-600 dark:text-indigo-400" />
                                <span>قصة الوحدة</span>
                              </button>
                            )}

                            {/* Direct AI Chat Button for Completed Units */}
                            {isCompleted && (
                              <button
                                type="button"
                                title="خوض محادثة تفاعلية موجهة مع الذكاء الاصطناعي (+30 XP)"
                                className="flex items-center gap-1.5 text-[11px] lg:text-sm font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800/80 px-2.5 py-1.5 lg:px-3.5 lg:py-2 rounded-xl transition-all shadow-xs flex-none active:scale-95"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  router.push(`/roleplay?unit=${unit.id}`);
                                }}
                              >
                                <MessageSquare size={14} className="text-purple-600 dark:text-purple-400" />
                                <span>محادثة AI</span>
                              </button>
                            )}

                            <ChevronRight
                              className={`flex-none transition-colors ${
                                isCompleted
                                  ? 'text-emerald-300'
                                  : isLocked
                                  ? 'text-slate-200 dark:text-slate-700'
                                  : 'text-slate-300 dark:text-slate-600 group-hover:text-indigo-500'
                              }`}
                              size={20}
                            />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

              </div>
            );
          })}
        </div>

        {/* ── Interactive Unit Story Modal ─────────────────────────────── */}
        {selectedStoryUnit && (
          <InteractiveUnitStory
            unitId={selectedStoryUnit}
            onClose={() => setSelectedStoryUnit(null)}
          />
        )}
      </div>
    </div>
  );
}
