'use client';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, CheckCircle2, XCircle, ArrowRight, Sparkles, Zap, Award, SkipForward } from 'lucide-react';
import type { WordData } from '@/lib/words';
import { playTTS } from '@/lib/tts';

interface Props {
  unitTitle: string;
  unitTitleAr: string;
  wordsToTest: WordData[];
  allUnitWords: WordData[];
  onFinish: (knownWordIds: string[]) => void;
  onCancel: () => void;
}

export default function UnitFastTrackQuiz({
  unitTitle,
  unitTitleAr,
  wordsToTest,
  allUnitWords,
  onFinish,
  onCancel,
}: Props) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [knownIds, setKnownIds] = useState<string[]>([]);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  const currentWord = wordsToTest[currentIdx];

  // Memoized Fisher-Yates shuffled options
  const options = useMemo(() => {
    if (!currentWord) return [];

    const otherMeanings = allUnitWords
      .filter(w => w.id !== currentWord.id && w.meaningAr && w.meaningAr !== currentWord.meaningAr)
      .map(w => w.meaningAr);

    const fallbackPool = [
      'تواصل وتفاعل', 'تحقيق الهدف', 'إدارة الوقت', 'تطوير المهارات',
      'العمل الجماعي', 'اتخاذ القرار', 'التفكير الإبداعي', 'حل النزاعات',
      'حماية البيئة', 'التخطيط المستقبلي', 'البحث والتحليل'
    ];

    const pool = [...otherMeanings];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    const distractors: string[] = [];
    for (const m of pool) {
      if (!distractors.includes(m) && m !== currentWord.meaningAr) {
        distractors.push(m);
        if (distractors.length >= 3) break;
      }
    }

    let fbIdx = 0;
    while (distractors.length < 3 && fbIdx < fallbackPool.length) {
      const fb = fallbackPool[fbIdx++];
      if (!distractors.includes(fb) && fb !== currentWord.meaningAr) {
        distractors.push(fb);
      }
    }

    const combined = [currentWord.meaningAr, ...distractors];
    for (let i = combined.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [combined[i], combined[j]] = [combined[j], combined[i]];
    }

    return combined;
  }, [currentWord, allUnitWords]);

  const speakWord = (text: string) => {
    playTTS(text, { voice: 'en-US-AriaNeural' });
  };

  const handleSelect = (opt: string) => {
    if (selectedOpt !== null || !currentWord) return;
    setSelectedOpt(opt);

    const isCorrect = opt === currentWord.meaningAr;
    const nextKnown = isCorrect ? [...knownIds, currentWord.id] : knownIds;
    if (isCorrect) setKnownIds(nextKnown);

    setTimeout(() => {
      if (currentIdx + 1 >= wordsToTest.length) {
        setShowSummary(true);
      } else {
        setCurrentIdx(i => i + 1);
        setSelectedOpt(null);
      }
    }, 700);
  };

  const handleSkipUnknown = () => {
    if (selectedOpt !== null || !currentWord) return;
    if (currentIdx + 1 >= wordsToTest.length) {
      setShowSummary(true);
    } else {
      setCurrentIdx(i => i + 1);
      setSelectedOpt(null);
    }
  };

  // ─── Summary Screen ────────────────────────────────────────────────────────
  if (showSummary) {
    const knownWords = wordsToTest.filter(w => knownIds.includes(w.id));
    const remainingWords = wordsToTest.filter(w => !knownIds.includes(w.id));
    const pct = Math.round((knownIds.length / wordsToTest.length) * 100);

    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-lg w-full bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-100 text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-tr from-amber-400 to-orange-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-200">
            <Award size={34} />
          </div>

          <h2 className="text-xl font-black text-slate-800 mb-1">نتيجة فحص الكلمات المسبقة</h2>
          <p className="text-slate-400 text-xs mb-5 font-semibold">
            وحدة: <span className="font-bold text-indigo-600">&quot;{unitTitleAr}&quot;</span>
          </p>

          <div className="bg-gradient-to-br from-indigo-50/70 to-purple-50/70 rounded-2xl p-5 mb-5 border border-indigo-100">
            <div className="text-4xl font-black text-indigo-600 mb-1">
              {knownIds.length} <span className="text-slate-400 text-lg font-bold">/ {wordsToTest.length}</span>
            </div>
            <div className="text-xs font-bold text-indigo-500 mb-3">
              نسبة معرفتك السابقة: {pct}%
            </div>

            {knownIds.length > 0 ? (
              <p className="text-xs text-emerald-800 font-bold bg-emerald-50 py-2.5 px-3 rounded-xl border border-emerald-200">
                ✨ تم تخطي {knownIds.length} كلمات بنجاح واحتسابها كمدروسة!
              </p>
            ) : (
              <p className="text-xs text-slate-600 bg-white/80 py-2.5 px-3 rounded-xl font-medium">
                ستبدأ دراسة جميع كلمات الوحدة خطوة بخطوة من البداية لترسيخها 🌟
              </p>
            )}
          </div>

          {knownWords.length > 0 && (
            <div className="mb-4 text-right">
              <div className="text-xs font-bold text-slate-400 mb-2 flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-500" />
                <span>الكلمات التي تم تخطيها ({knownWords.length}):</span>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1">
                {knownWords.map(w => (
                  <span
                    key={w.id}
                    className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-lg text-xs font-bold"
                  >
                    <span>✓</span>
                    <span className="ltr font-semibold">{w.word}</span>
                    <span className="text-emerald-500 text-[10px]">({w.meaningAr})</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {remainingWords.length > 0 && (
            <div className="mb-6 text-right">
              <div className="text-xs font-bold text-slate-400 mb-2 flex items-center gap-1.5">
                <Sparkles size={14} className="text-indigo-500" />
                <span>الكلمات التي ستتعلمها الآن ({remainingWords.length}):</span>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1">
                {remainingWords.map(w => (
                  <span
                    key={w.id}
                    className="inline-flex items-center gap-1 bg-slate-50 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-lg text-xs font-medium"
                  >
                    <span className="ltr font-bold text-slate-800">{w.word}</span>
                    <span className="text-slate-400 text-[10px]">({w.meaningAr})</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => onFinish(knownIds)}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 rounded-2xl font-bold text-sm hover:from-indigo-700 hover:to-purple-700 active:scale-95 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
          >
            {remainingWords.length > 0 ? (
              <>
                <span>متابعة تعلم الكلمات المتبقية ({remainingWords.length})</span>
                <ArrowRight size={16} />
              </>
            ) : (
              <>
                <span>رائع! لقد أتقنت جميع كلمات الوحدة 🎉</span>
                <CheckCircle2 size={16} />
              </>
            )}
          </button>
        </motion.div>
      </div>
    );
  }

  // ─── Question Screen ───────────────────────────────────────────────────────
  const progressPct = ((currentIdx + 1) / wordsToTest.length) * 100;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        
        {/* Header bar */}
        <div className="flex items-center justify-between mb-3 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
            <Zap size={14} className="fill-amber-500 text-amber-500" />
            <span>فحص التخطي السريع (اختياري)</span>
          </div>

          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 font-bold transition-colors"
          >
            إلغاء والبدء مباشرة ✕
          </button>
        </div>

        {/* Progress bar */}
        <div className="mb-5">
          <div className="flex justify-between items-center text-xs text-slate-400 mb-1.5 font-semibold">
            <span>الكلمة {currentIdx + 1} من {wordsToTest.length}</span>
            <span className="font-bold text-indigo-600">{Math.round(progressPct)}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Question card */}
        <AnimatePresence mode="wait">
          {currentWord && (
            <motion.div
              key={currentWord.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-xl"
            >
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="text-4xl md:text-5xl font-black text-slate-800 ltr tracking-tight">
                    {currentWord.word}
                  </span>
                  <button
                    onClick={() => speakWord(currentWord.word)}
                    title="استمع للنطق"
                    className="w-9 h-9 rounded-xl bg-slate-50 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 flex items-center justify-center transition-colors active:scale-95"
                  >
                    <Volume2 size={18} />
                  </button>
                </div>
                {currentWord.phonetic && (
                  <div className="text-sm font-mono text-slate-400 ltr">{currentWord.phonetic}</div>
                )}
                <div className="text-xs text-slate-400 mt-2 font-bold">
                  ما المعنى الصحيح لهذه الكلمة؟
                </div>
              </div>

              {/* Shuffled Options */}
              <div className="space-y-2.5 mb-5">
                {options.map((opt, i) => {
                  const isSelected = selectedOpt === opt;
                  const isCorrect = opt === currentWord.meaningAr;
                  const hasAnswered = selectedOpt !== null;
                  const letter = ['A', 'B', 'C', 'D'][i] ?? `${i + 1}`;

                  let btnStyle = 'border-slate-200 bg-white hover:border-indigo-400 hover:bg-indigo-50/50 text-slate-800';
                  let badgeStyle = 'bg-slate-100 text-slate-600';

                  if (hasAnswered) {
                    if (isCorrect) {
                      btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm';
                      badgeStyle = 'bg-emerald-500 text-white';
                    } else if (isSelected) {
                      btnStyle = 'border-rose-500 bg-rose-50 text-rose-900 shadow-sm';
                      badgeStyle = 'bg-rose-500 text-white';
                    } else {
                      btnStyle = 'border-slate-100 bg-slate-50/50 text-slate-400 opacity-40';
                      badgeStyle = 'bg-slate-200 text-slate-400';
                    }
                  }

                  return (
                    <button
                      key={opt}
                      onClick={() => handleSelect(opt)}
                      disabled={hasAnswered}
                      className={`w-full text-right px-4 py-3.5 rounded-2xl border-2 font-bold flex items-center justify-between transition-all duration-200 active:scale-[0.99] ${btnStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-xl text-xs font-black flex items-center justify-center flex-none ${badgeStyle}`}>
                          {letter}
                        </span>
                        <span className="text-sm md:text-base font-bold">{opt}</span>
                      </div>

                      {hasAnswered && isCorrect && (
                        <CheckCircle2 size={20} className="text-emerald-600 flex-none" />
                      )}
                      {hasAnswered && isSelected && !isCorrect && (
                        <XCircle size={20} className="text-rose-500 flex-none" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Skip Unknown Button */}
              <button
                onClick={handleSkipUnknown}
                disabled={selectedOpt !== null}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-50 border border-dashed border-slate-200 transition-all flex items-center justify-center gap-1.5 disabled:opacity-40"
              >
                <SkipForward size={14} />
                <span>لا أعرف هذه الكلمة (تخطي للسؤال التالي)</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
