'use client';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { getLevelLabel, getLevelColor, getQuestionTypeLabel } from '@/lib/words';
import { CheckCircle2, XCircle, Brain, BookOpen, Award, ArrowRight, BarChart3, Sparkles } from 'lucide-react';

interface Question {
  id: string;
  level: string;
  type: string;
  question: string;
  questionAr: string;
  options: string[];
  correct: string;
}

const LEVEL_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export default function PlacementTest() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState<{ level: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [answers, setAnswers] = useState<{ questionId: string; correct: boolean; level: string }[]>([]);
  const [consecutiveWrong, setConsecutiveWrong] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    fetch('/api/placement').then(r => r.json()).then(d => {
      setQuestions(d.data ?? []);
      setLoading(false);
    });
  }, []);

  const levelProgress = useMemo(() => {
    const prog: Record<string, { correct: number; total: number }> = {};
    for (const level of LEVEL_ORDER) {
      prog[level] = { correct: 0, total: 0 };
    }
    for (const a of answers) {
      prog[a.level].total++;
      if (a.correct) prog[a.level].correct++;
    }
    return prog;
  }, [answers]);

  const handleAnswer = async (option: string) => {
    if (selected) return;
    setSelected(option);

    const q = questions[current];
    const correct = option === q.correct;
    const newScore = score + (correct ? 1 : 0);
    if (correct) setScore(newScore);

    const newAnswers = [...answers, { questionId: q.id, correct, level: q.level }];
    setAnswers(newAnswers);

    const newConsecutiveWrong = correct ? 0 : consecutiveWrong + 1;
    setConsecutiveWrong(newConsecutiveWrong);

    setShowExplanation(true);

    const shouldStopEarly = newConsecutiveWrong >= 3 && current >= 5;

    setTimeout(async () => {
      setShowExplanation(false);

      if (current + 1 >= questions.length || shouldStopEarly) {
        setSubmitting(true);
        try {
          const res = await fetch('/api/placement', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              score: newScore,
              total: shouldStopEarly ? current + 1 : questions.length,
              answers: newAnswers,
            }),
          });
          const data = await res.json();
          setResult(data.data ?? { level: 'A1' });
        } catch {
          setResult({ level: 'A1' });
        } finally {
          setSubmitting(false);
          setFinished(true);
        }
      } else {
        setCurrent(c => c + 1);
        setSelected(null);
      }
    }, 500);
  };

  if (loading || submitting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-center p-6 max-w-sm mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-3xl animate-bounce-gentle">
            {submitting ? '🎯' : '🧠'}
          </div>
          <div className="text-slate-800 font-bold text-base mb-1">
            {submitting ? 'جاري تحليل إجاباتك وتحديد مستواك...' : 'جاري تحميل الاختبار...'}
          </div>
          {submitting && (
            <p className="text-xs text-slate-400">نقوم بتجهيز وحدات التعلم المناسبة لمستواك بدقة</p>
          )}
        </div>
      </div>
    );
  }

  // ── Results screen ─────────────────────────────────────────────────────────
  if (finished && result) {
    const label = getLevelLabel(result.level);
    const color = getLevelColor(result.level);

    const levelStats = LEVEL_ORDER.map(level => {
      const p = levelProgress[level];
      return {
        level,
        correct: p.correct,
        total: p.total,
        pct: p.total > 0 ? Math.round((p.correct / p.total) * 100) : -1,
        passed: p.total > 0 && (p.correct / p.total) >= 0.6,
      };
    }).filter(s => s.total > 0);

    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#f8fafc] dark:bg-[#0b0f19]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-md w-full"
        >
          {/* Trophy Header */}
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="w-20 h-20 mx-auto mb-3 bg-gradient-to-tr from-amber-400 to-orange-500 text-white rounded-3xl flex items-center justify-center text-4xl shadow-xl shadow-orange-200 dark:shadow-orange-950"
            >
              🏆
            </motion.div>
            <h1 className="text-2xl font-black text-slate-800 dark:text-white mb-1">اكتمل الاختبار بنجاح!</h1>
            <p className="text-slate-400 dark:text-slate-400 text-xs font-semibold">
              أجبت على {score} من {answers.length} سؤال بشكل صحيح
            </p>
          </div>

          {/* Level result card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 mb-4 text-center border border-slate-100 dark:border-slate-800 shadow-md"
          >
            <div className="text-xs font-bold text-slate-400 dark:text-slate-400 mb-2">مستواك المحدد بناءً على إجاباتك:</div>
            <div className={`inline-block px-7 py-2.5 rounded-2xl text-3xl font-black mb-2 ${color}`}>
              {result.level}
            </div>
            <div className="text-lg font-bold text-slate-700 dark:text-slate-200">{label}</div>
          </motion.div>

          {/* Per-level breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-5 mb-5 border border-slate-100 dark:border-slate-800 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-3.5">
              <BarChart3 size={17} className="text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">تفاصيل الأداء حسب المستوى</span>
            </div>
            <div className="space-y-2.5">
              {levelStats.map(s => (
                <div key={s.level} className="flex items-center gap-3">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-md min-w-[36px] text-center ${getLevelColor(s.level)}`}>
                    {s.level}
                  </span>
                  <div className="flex-1">
                    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${s.pct}%` }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className={`h-full rounded-full ${s.passed ? 'bg-emerald-500' : 'bg-rose-400'}`}
                      />
                    </div>
                  </div>
                  <span className={`text-xs font-bold min-w-[48px] text-left ${s.passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                    {s.correct}/{s.total}
                    {s.passed ? ' ✓' : ' ✗'}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Description */}
          <p className="text-slate-400 dark:text-slate-400 text-center mb-5 text-xs font-medium leading-relaxed">
            تم فتح الوحدات المناسبة لمستواك، واحتساب المستويات السابقة كمكتملة تلقائياً لتوفير وقتك.
          </p>

          {/* CTA */}
          <button
            onClick={() => {
              window.location.href = '/';
            }}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 rounded-2xl font-bold text-base hover:from-indigo-700 hover:to-purple-700 active:scale-95 transition-all shadow-lg shadow-indigo-200 dark:shadow-indigo-950 flex items-center justify-center gap-2"
          >
            <span>ابدأ مسار التعلم الآن</span>
            <ArrowRight size={18} />
          </button>
        </motion.div>
      </div>
    );
  }

  // ── Question view ──────────────────────────────────────────────────────────
  if (!questions.length) return null;
  const q = questions[current];
  const progress = ((current + 1) / questions.length) * 100;
  const typeInfo = getQuestionTypeLabel(q.type);
  const currentLevelIdx = LEVEL_ORDER.indexOf(q.level);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b0f19] p-4 flex flex-col justify-center">
      <div className="max-w-2xl mx-auto w-full">
        
        {/* Top header */}
        <div className="mb-5">
          <div className="flex justify-between items-center mb-2 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-200">
              <Brain size={16} className="text-indigo-600 dark:text-indigo-400" />
              <span>اختبار تحديد المستوى التفاعلي</span>
            </div>
            <span className="text-slate-400 dark:text-slate-400 font-bold">
              السؤال {current + 1} من {questions.length}
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-3">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Level Progression Dots */}
          <div className="flex items-center justify-center gap-1.5">
            {LEVEL_ORDER.map((level, i) => {
              const p = levelProgress[level];
              const isActive = level === q.level;
              const isPassed = p.total > 0 && (p.correct / p.total) >= 0.6;
              const isFailed = p.total > 0 && (p.correct / p.total) < 0.6;
              const isUpcoming = p.total === 0 && i > currentLevelIdx;

              return (
                <div key={level} className="flex items-center gap-1.5">
                  <div className={`px-2.5 py-0.5 rounded-md text-[10px] font-black transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white scale-110 shadow-sm shadow-indigo-200'
                      : isPassed
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : isFailed
                          ? 'bg-rose-50 text-rose-600 border border-rose-200'
                          : isUpcoming
                            ? 'bg-slate-100 text-slate-400'
                            : 'bg-slate-50 text-slate-400'
                  }`}>
                    {level}
                  </div>
                  {i < LEVEL_ORDER.length - 1 && (
                    <div className={`w-3 h-0.5 ${isPassed ? 'bg-emerald-300' : 'bg-slate-200'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Question card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-100 dark:border-slate-800 shadow-xl relative overflow-hidden"
          >
            {/* Type & Level badge */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300">
                <span>{typeInfo.emoji}</span>
                <span>{typeInfo.label}</span>
              </div>
              <span className={`text-xs font-black px-2.5 py-0.5 rounded-md ${getLevelColor(q.level)}`}>
                {q.level}
              </span>
            </div>

            {/* Question text */}
            <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white mb-1.5 ltr leading-relaxed">
              {q.question}
            </h2>
            <p className="text-slate-400 dark:text-slate-400 text-xs md:text-sm mb-6 leading-relaxed font-medium">
              {q.questionAr}
            </p>

            {/* Options */}
            <div className="space-y-2.5">
              {q.options.map((opt, i) => {
                const isSelected = selected === opt;
                const isCorrect = opt === q.correct;
                const hasAnswered = selected !== null;
                const optionLetter = ['A', 'B', 'C', 'D'][i] ?? `${i + 1}`;

                let btnStyle = 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-slate-700/60 text-slate-800 dark:text-white';
                let badgeStyle = 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300';

                if (hasAnswered) {
                  if (isCorrect) {
                    btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 shadow-sm';
                    badgeStyle = 'bg-emerald-500 text-white';
                  } else if (isSelected) {
                    btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 shadow-sm';
                    badgeStyle = 'bg-rose-500 text-white';
                  } else {
                    btnStyle = 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-400 opacity-40';
                    badgeStyle = 'bg-slate-200 dark:bg-slate-800 text-slate-400';
                  }
                }

                return (
                  <button
                    key={opt}
                    onClick={() => handleAnswer(opt)}
                    disabled={hasAnswered}
                    className={`w-full text-right px-4 py-3.5 rounded-2xl border-2 font-bold ltr flex items-center justify-between transition-all duration-200 active:scale-[0.99] ${btnStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-xl text-xs font-black flex items-center justify-center flex-none ${badgeStyle}`}>
                        {optionLetter}
                      </span>
                      <span className="font-bold text-sm md:text-base">{opt}</span>
                    </div>

                    {hasAnswered && isCorrect && (
                      <CheckCircle2 size={20} className="text-emerald-600 flex-none ml-2" />
                    )}
                    {hasAnswered && isSelected && !isCorrect && (
                      <XCircle size={20} className="text-rose-500 flex-none ml-2" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation / feedback */}
            <AnimatePresence>
              {showExplanation && selected && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`mt-4 p-3 rounded-xl text-center text-xs font-black border ${
                    selected === q.correct
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}
                >
                  {selected === q.correct
                    ? '✅ إجابة صحيحة! أحسنت'
                    : `❌ الإجابة الصحيحة هي: ${q.correct}`
                  }
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>

        {/* Score indicator */}
        <div className="mt-4 text-center">
          <span className="text-xs text-slate-400 font-bold">
            الإجابات الصحيحة: <span className="text-emerald-600 font-black">{score}</span>
            {'  ·  '}
            غير الصحيحة: <span className="text-rose-500 font-black">{answers.length - score}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
