'use client';
import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Sparkles,
  Award,
  CheckCircle2,
  ChevronRight,
  Search,
  X,
  Target,
  Volume2,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import RoleplayChatModal from '@/components/RoleplayChatModal';
import { ROLEPLAY_SCENARIOS, RoleplayScenario } from '@/data/roleplayScenarios';

const LEVEL_TABS = ['الكل', 'A1', 'A2', 'B1', 'B2', 'C1'];

function RoleplayContent() {
  const searchParams = useSearchParams();
  const initialUnitId = searchParams.get('unit');
  const initialScenarioId = searchParams.get('id');

  const [selectedLevel, setSelectedLevel] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const [completedScenarios, setCompletedScenarios] = useState<string[]>([]);
  const [activeScenario, setActiveScenario] = useState<RoleplayScenario | null>(null);
  const [userXp, setUserXp] = useState<number | null>(null);

  // Auto-launch scenario if query param passed (e.g. /roleplay?unit=b1-u5)
  useEffect(() => {
    if (initialUnitId || initialScenarioId) {
      const found = ROLEPLAY_SCENARIOS.find(
        s => s.unitId === initialUnitId || s.id === initialScenarioId || s.id === initialUnitId
      );
      if (found) {
        setActiveScenario(found);
        if (found.level) setSelectedLevel(found.level);
      }
    }
  }, [initialUnitId, initialScenarioId]);

  // Fetch completed scenarios and user data
  useEffect(() => {
    fetch('/api/roleplay')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.completedScenarios) {
          setCompletedScenarios(data.data.completedScenarios);
        }
      })
      .catch(() => {});

    fetch('/api/user')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setUserXp(data.data.xp);
        }
      })
      .catch(() => {});
  }, []);

  // Counts per level
  const levelCounts = useMemo(() => {
    const counts: Record<string, number> = { 'الكل': ROLEPLAY_SCENARIOS.length };
    ROLEPLAY_SCENARIOS.forEach(s => {
      counts[s.level] = (counts[s.level] || 0) + 1;
    });
    return counts;
  }, []);

  const filteredScenarios = useMemo(() => {
    return ROLEPLAY_SCENARIOS.filter(s => {
      if (selectedLevel !== 'الكل' && s.level !== selectedLevel) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = s.title.toLowerCase().includes(q) || s.titleAr.includes(q);
        const matchChar =
          s.character.name.toLowerCase().includes(q) ||
          (s.character.roleAr && s.character.roleAr.includes(q));
        const matchWords =
          s.targetWords.some(w => w.toLowerCase().includes(q)) ||
          (s.targetWordDetails &&
            s.targetWordDetails.some(
              d => d.meaningAr.includes(q) || d.word.toLowerCase().includes(q)
            ));
        return matchTitle || matchChar || matchWords;
      }
      return true;
    });
  }, [selectedLevel, searchQuery]);

  const handleScenarioFinished = (earned: number) => {
    if (activeScenario && !completedScenarios.includes(activeScenario.id)) {
      setCompletedScenarios(prev => [...prev, activeScenario.id]);
    }
    if (userXp !== null) {
      setUserXp(prev => (prev || 0) + earned);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-800 pb-28 md:pt-20">
      <Navbar />

      <main className="w-full max-w-2xl mx-auto px-4 pt-6 md:pt-4">
        {/* ── Hero Banner ────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 text-white shadow-xl shadow-indigo-500/20 mb-5"
        >
          <div className="absolute -top-12 -left-12 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-44 h-44 bg-purple-400/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white/95 mb-2.5 border border-white/20">
                <Sparkles size={14} className="text-amber-300" />
                <span>محادثات ذكية موجهة · AI Roleplay</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                تحدث بالإنجليزية بثقة
              </h1>
              <p className="text-xs md:text-sm text-white/85 font-medium mt-1 max-w-md leading-relaxed">
                حوارات واقعية وتدريب صوتي تفاعلي لكل وحدات المنهج ({ROLEPLAY_SCENARIOS.length} وحدة) مع الكلمات المستهدفة ومكافأة +30 XP!
              </p>
            </div>

            <div className="hidden sm:flex w-20 h-20 bg-white/15 backdrop-blur-md rounded-3xl items-center justify-center text-4xl shadow-inner border border-white/20 flex-none">
              💬
            </div>
          </div>
        </motion.div>

        {/* ── Search Input ────────────────────────────────────────────── */}
        <div className="relative mb-4">
          <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="ابحث عن وحدة، موضوع، أو كلمة مستهدفة (مثال: Health, Food, Success)..."
            className="w-full bg-white border border-slate-200/90 rounded-2xl py-3 pr-11 pl-10 text-xs md:text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 shadow-2xs transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* ── Level Filter Tabs ───────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-2 mb-5 overflow-x-auto pb-1 no-scrollbar">
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-slate-200/80 shadow-2xs flex-none">
            {LEVEL_TABS.map(tab => {
              const active = selectedLevel === tab;
              const count = levelCounts[tab] || 0;
              return (
                <button
                  key={tab}
                  onClick={() => setSelectedLevel(tab)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 ${
                    active
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <span>{tab}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="text-xs font-bold text-slate-400 flex-none hidden sm:block">
            {completedScenarios.length} من {ROLEPLAY_SCENARIOS.length} مكتمل
          </div>
        </div>

        {/* ── Scenarios List ─────────────────────────────────────────── */}
        <div className="space-y-3.5">
          {filteredScenarios.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200/80 shadow-xs">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="font-black text-slate-800 text-base mb-1">لم نجد محادثة مطابقة</h3>
              <p className="text-xs text-slate-400">
                جرّب البحث بكلمة أخرى أو اختر تبويباً مختلفاً للمستوى.
              </p>
            </div>
          ) : (
            filteredScenarios.map((scenario, idx) => {
              const isCompleted = completedScenarios.includes(scenario.id);

              return (
                <motion.div
                  key={scenario.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(idx * 0.03, 0.3) }}
                  onClick={() => setActiveScenario(scenario)}
                  role="button"
                  tabIndex={0}
                  className="w-full bg-white rounded-3xl p-4 md:p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group active:scale-[0.99] text-right relative overflow-hidden"
                >
                  <div className="flex items-start gap-4">
                    {/* Character Avatar */}
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-100 to-indigo-50 border border-slate-200 flex items-center justify-center text-3xl shadow-2xs group-hover:scale-105 transition-transform flex-none">
                      {scenario.character.avatar}
                    </div>

                    {/* Scenario Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">
                          {scenario.level}
                        </span>
                        <h3 className="font-extrabold text-slate-800 text-base">
                          {scenario.titleAr}
                        </h3>
                        {isCompleted && (
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 font-black px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 size={11} className="text-emerald-600" />
                            <span>مكتملة (+30 XP)</span>
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-400 font-medium ltr mb-2">
                        {scenario.title} · with {scenario.character.name} (
                        {scenario.character.roleAr || scenario.character.role})
                      </div>

                      <div className="text-xs text-slate-500 font-semibold line-clamp-1 mb-2.5">
                        {scenario.descriptionAr}
                      </div>

                      {/* Target words preview chips */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                          <Target size={11} className="text-indigo-500" />
                          <span>الكلمات المستهدفة ({scenario.targetWords.length}):</span>
                        </span>
                        {scenario.targetWords.slice(0, 5).map(w => (
                          <span
                            key={w}
                            className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-md"
                          >
                            {w}
                          </span>
                        ))}
                        {scenario.targetWords.length > 5 && (
                          <span className="text-[10px] text-slate-400 font-bold">
                            +{scenario.targetWords.length - 5}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Launch Action Button */}
                    <div className="flex flex-col items-center justify-center flex-none self-center">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition-all shadow-2xs">
                        <ChevronRight size={18} className="transform rotate-180" />
                      </div>
                      <span className="text-[10px] font-black text-amber-600 mt-1.5">
                        +30 XP
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </main>

      {/* ── Active Roleplay Chat Modal ──────────────────────────────── */}
      <AnimatePresence>
        {activeScenario && (
          <RoleplayChatModal
            scenario={activeScenario}
            onClose={() => setActiveScenario(null)}
            onFinish={handleScenarioFinished}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function RoleplayPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <RoleplayContent />
    </Suspense>
  );
}
