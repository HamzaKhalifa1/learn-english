'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Mic, MicOff, ChevronRight, CheckCircle, XCircle, Sparkles, Check, ArrowRight } from 'lucide-react';
import type { WordData } from '@/lib/words';
import WordVisualCard from '@/components/WordVisualCard';
import { playTTS } from '@/lib/tts';

interface Props {
  word: WordData;
  unitId: string;
  level: string;
  unitWords?: WordData[];
  onComplete: (correct: boolean) => void;
}

const STAGES = [
  { id: 1, label: 'التعرف', emoji: '👁️' },
  { id: 2, label: 'المعنى', emoji: '📖' },
  { id: 3, label: 'النطق', emoji: '🔊' },
  { id: 4, label: 'الجملة', emoji: '✍️' },
  { id: 5, label: 'الاختبار', emoji: '🧪' },
];

export default function WordLearningCycle({ word, unitId, level, unitWords, onComplete }: Props) {
  const [stage, setStage] = useState(1);
  const [showResult, setShowResult] = useState<boolean | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [wrongOptions, setWrongOptions] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingScore, setRecordingScore] = useState<number | null>(null);
  const [quizOptions, setQuizOptions] = useState<string[]>([]);
  const [sentenceAnswer, setSentenceAnswer] = useState('');
  const [sentenceFeedback, setSentenceFeedback] = useState<boolean | null>(null);
  const [wordCompleted, setWordCompleted] = useState(false);
  const [lastCorrect, setLastCorrect] = useState(true);

  const isAdvancingRef = useRef(false);
  const stageRef = useRef(stage);
  useEffect(() => { stageRef.current = stage; }, [stage]);

  // Reset stage-specific feedback & wrong options when word or stage changes
  useEffect(() => {
    setWrongOptions([]);
    setSentenceFeedback(null);
    setSelectedOption(null);
    setShowResult(null);
    isAdvancingRef.current = false;
  }, [word.id, stage]);

  // Register word in DB on mount
  useEffect(() => {
    fetch('/api/words/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'start',
        wordId: word.id,
        word: word.word,
        unitId,
        level,
      }),
    });
  }, [word.id, word.word, unitId, level]);

  // Build quiz options on reaching stage 5
  useEffect(() => {
    if (stage === 5) {
      const candidateMeanings: string[] = [];
      if (unitWords && unitWords.length > 0) {
        for (const w of unitWords) {
          if (w.id !== word.id && w.meaningAr && w.meaningAr !== word.meaningAr) {
            candidateMeanings.push(w.meaningAr);
          }
        }
      }

      const fallbackPool = [
        'تواصل وتفاعل', 'تحقيق الهدف', 'إدارة الوقت', 'تطوير المهارات',
        'العمل الجماعي', 'اتخاذ القرار', 'التفكير الإبداعي', 'حل النزاعات',
        'حماية البيئة', 'التخطيط المستقبلي', 'البحث والتحليل'
      ];

      const shuffledCandidates = [...candidateMeanings];
      for (let i = shuffledCandidates.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledCandidates[i], shuffledCandidates[j]] = [shuffledCandidates[j], shuffledCandidates[i]];
      }

      const distractors: string[] = [];
      for (const m of shuffledCandidates) {
        if (!distractors.includes(m) && m !== word.meaningAr) {
          distractors.push(m);
          if (distractors.length >= 3) break;
        }
      }

      let fallbackIdx = 0;
      while (distractors.length < 3 && fallbackIdx < fallbackPool.length) {
        const candidate = fallbackPool[fallbackIdx++];
        if (!distractors.includes(candidate) && candidate !== word.meaningAr) {
          distractors.push(candidate);
        }
      }

      const finalOptions = [word.meaningAr, ...distractors];
      for (let i = finalOptions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [finalOptions[i], finalOptions[j]] = [finalOptions[j], finalOptions[i]];
      }

      setQuizOptions(finalOptions);
    }
  }, [stage, word, unitWords]);

  const speakText = useCallback((text: string) => {
    playTTS(text, { voice: 'en-US-AriaNeural' });
  }, []);

  const speakWord = useCallback(() => {
    speakText(word.word);
  }, [word.word, speakText]);

  useEffect(() => {
    if (stage === 3) speakWord();
  }, [stage, speakWord]);

  const advanceStage = (correct = true, showOverlay = false) => {
    if (isAdvancingRef.current) return;
    isAdvancingRef.current = true;
    if (showOverlay) {
      setShowResult(correct);
    }

    // Fire progress update optimistically in background (zero UI latency)
    fetch('/api/words/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update',
        wordId: word.id,
        word: word.word,
        unitId,
        level,
        stage: stageRef.current,
        correct,
      }),
    }).catch(console.error);

    const delay = showOverlay ? 750 : 180;

    setTimeout(() => {
      setShowResult(null);
      setSelectedOption(null);
      setWrongOptions([]);
      setSentenceAnswer('');
      setSentenceFeedback(null);
      setRecordingScore(null);

      const currentStage = stageRef.current;
      if (currentStage < 5) {
        setStage(currentStage + 1);
        isAdvancingRef.current = false;
      } else {
        setLastCorrect(correct);
        setWordCompleted(true);
        setTimeout(() => {
          onComplete(correct);
        }, 450);
      }
    }, delay);
  };

  const startRecording = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) { setRecordingScore(70); return; }

    const recognition = new SR();
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 5;
    setIsRecording(true);
    recognition.start();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (e: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const spoken = Array.from(e.results[0]).map((r: any) => r.transcript.toLowerCase().trim());
      const correct = spoken.some((s: string) => s.includes(word.word.toLowerCase()));
      setRecordingScore(correct ? 100 : 55);
      setIsRecording(false);
    };
    recognition.onerror = () => { setRecordingScore(50); setIsRecording(false); };
  };

  const checkSentence = () => {
    if (isAdvancingRef.current) return;
    const cleaned = sentenceAnswer.trim().toLowerCase();
    const target = word.word.trim().toLowerCase();
    const correct = cleaned === target || cleaned.includes(target);

    setSentenceFeedback(correct);

    if (correct) {
      // CORRECT: Advance with brief rewarding 750ms overlay
      advanceStage(true, true);
    } else {
      // WRONG: Show brief retry animation for 650ms, then let learner retry (DO NOT ADVANCE)
      isAdvancingRef.current = true;
      setShowResult(false);
      setTimeout(() => {
        setShowResult(null);
        isAdvancingRef.current = false;
      }, 650);
    }
  };

  const handleQuizAnswer = (opt: string) => {
    if (selectedOption || isAdvancingRef.current || wrongOptions.includes(opt)) return;

    setSelectedOption(opt);
    const correct = opt === word.meaningAr;

    if (correct) {
      // CORRECT: Advance & complete with brief rewarding 750ms overlay
      advanceStage(true, true);
    } else {
      // WRONG: Mark option as wrong, show brief cross for 650ms, then allow retry (DO NOT ADVANCE)
      isAdvancingRef.current = true;
      setShowResult(false);
      setWrongOptions(prev => [...prev, opt]);
      setTimeout(() => {
        setShowResult(null);
        setSelectedOption(null);
        isAdvancingRef.current = false;
      }, 650);
    }
  };

  return (
    <div className="w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto">
      
      {/* ── Stage progress indicators ──────────────────────────────────── */}
      <div className="flex items-center justify-between max-w-sm lg:max-w-md mx-auto mb-6 lg:mb-8 px-2">
        {STAGES.map((s, idx) => {
          const isDone = s.id < stage || wordCompleted;
          const isCurrent = s.id === stage && !wordCompleted;

          return (
            <div key={s.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  title={s.label}
                  className={`w-9 h-9 lg:w-12 lg:h-12 rounded-full flex items-center justify-center text-xs lg:text-sm font-bold transition-all duration-300 relative ${
                    isDone
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : isCurrent
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white scale-110 shadow-md shadow-indigo-300 dark:shadow-indigo-950 ring-4 ring-indigo-100 dark:ring-indigo-900/60'
                      : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {isDone ? <Check size={16} className="lg:w-5 lg:h-5" strokeWidth={3} /> : <span className="text-xs lg:text-base">{s.emoji}</span>}
                </button>
                <span className={`text-[10px] lg:text-xs font-bold mt-1.5 transition-colors ${
                  isCurrent ? 'text-indigo-600 dark:text-indigo-400' : isDone ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-400'
                }`}>
                  {s.label}
                </span>
              </div>

              {idx < STAGES.length - 1 && (
                <div className={`h-1 lg:h-1.5 flex-1 mx-1.5 -mt-3.5 rounded-full transition-colors duration-300 ${
                  s.id < stage || wordCompleted ? 'bg-emerald-400' : 'bg-slate-200 dark:bg-slate-700'
                }`} />
              )}
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {/* ── WORD COMPLETED CELEBRATION ──────────────────────────────────── */}
        {wordCompleted ? (
          <motion.div
            key="completed"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-8 lg:p-12 text-center border border-slate-100 dark:border-slate-800 shadow-xl"
          >
            <div className="w-20 h-20 lg:w-28 lg:h-28 mx-auto mb-4 bg-emerald-50 dark:bg-emerald-950/60 rounded-full flex items-center justify-center text-4xl lg:text-6xl shadow-inner border border-emerald-100 dark:border-emerald-800/60 animate-bounce-gentle">
              {lastCorrect ? '🎉' : '👏'}
            </div>
            <div className="text-3xl lg:text-5xl font-black text-slate-800 dark:text-white mb-2 ltr">{word.word}</div>
            <div className="text-indigo-600 dark:text-indigo-400 text-lg lg:text-2xl font-bold mb-4">{word.meaningAr}</div>
            <div className="text-emerald-600 dark:text-emerald-400 font-black text-xl lg:text-3xl mb-1">
              {lastCorrect ? 'أحسنت! تم إتقان الكلمة بنجاح ✓' : 'عمل رائع! استمر في التقدم 💪'}
            </div>
            <div className="text-slate-400 dark:text-slate-400 text-xs lg:text-sm mt-3 flex items-center justify-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>جاري الانتقال للكلمة التالية...</span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={stage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 lg:p-10 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
          >

            {/* ── STAGE 1 — RECOGNITION ──────────────────────────────────── */}
            {stage === 1 && (
              <div className="text-center">
                <div className="inline-flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs lg:text-sm font-black px-3.5 py-1 lg:px-4 lg:py-1.5 rounded-full border border-indigo-100 dark:border-indigo-800/60 mb-5">
                  <span>👁️</span>
                  <span>المرحلة 1: التعرف على الكلمة وصورتها</span>
                </div>

                {/* Smart Visual Photo */}
                <WordVisualCard word={word.word} category={word.category} />

                {/* Phonetics & Audio Button */}
                <div className="flex items-center justify-center gap-2.5 mb-4">
                  <span className="font-mono text-xl lg:text-2xl ltr text-slate-500 dark:text-indigo-300 bg-slate-50 dark:bg-slate-800 px-4 py-1.5 lg:px-5 lg:py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold">
                    {word.phonetic}
                  </span>
                  <button
                    onClick={speakWord}
                    title="استمع للنطق"
                    className="w-10 h-10 lg:w-12 lg:h-12 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 rounded-xl flex items-center justify-center transition-all active:scale-95 shadow-xs border border-indigo-100 dark:border-indigo-800/60"
                  >
                    <Volume2 size={20} className="lg:w-6 lg:h-6" />
                  </button>
                </div>

                {/* Part of speech badge */}
                <div className="mb-6 lg:mb-8">
                  <span className="inline-flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 px-4 py-1.5 rounded-xl text-xs lg:text-sm font-bold">
                    <span>{word.partOfSpeechAr}</span>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span className="ltr font-semibold text-slate-500 dark:text-slate-400">{word.partOfSpeech}</span>
                  </span>
                </div>

                <button
                  onClick={() => advanceStage()}
                  disabled={isAdvancingRef.current}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 lg:py-5 rounded-2xl font-black text-base lg:text-xl shadow-lg shadow-indigo-200 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <span>فهمت الكلمة</span>
                  <ChevronRight size={20} />
                </button>
              </div>
            )}

            {/* ── STAGE 2 — MEANING ─────────────────────────────────────── */}
            {stage === 2 && (
              <div>
                <div className="text-center mb-5">
                  <div className="inline-flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs lg:text-sm font-black px-3.5 py-1 lg:px-4 lg:py-1.5 rounded-full border border-indigo-100 dark:border-indigo-800/60">
                    <span>📖</span>
                    <span>المرحلة 2: المعنى والاستخدام</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 mb-4">
                  <span className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white ltr">{word.word}</span>
                  <button
                    onClick={speakWord}
                    title="استمع للنطق"
                    className="w-9 h-9 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 rounded-xl flex items-center justify-center transition-all active:scale-95 border border-indigo-100 dark:border-indigo-800/60"
                  >
                    <Volume2 size={17} />
                  </button>
                </div>

                {/* Visual miniature */}
                <WordVisualCard word={word.word} category={word.category} showWordOverlay={false} className="h-32 lg:h-44 mb-5" />

                {/* Arabic Meaning & English definition */}
                <div className="bg-gradient-to-br from-indigo-50/80 to-purple-50/80 dark:from-slate-800/95 dark:to-slate-900 rounded-2xl lg:rounded-3xl p-5 lg:p-7 mb-5 border border-indigo-100/80 dark:border-slate-700/80 shadow-xs">
                  <div className="text-xs lg:text-sm font-bold text-indigo-600 dark:text-indigo-400 mb-1">المعنى بالعربية:</div>
                  <div className="text-2xl lg:text-4xl font-black text-slate-800 dark:text-white mb-3.5">{word.meaningAr}</div>
                  <div className="text-xs lg:text-sm font-bold text-slate-400 dark:text-slate-400 mb-1">التعريف بالإنجليزية:</div>
                  <div className="text-slate-600 dark:text-slate-200 text-sm lg:text-lg ltr leading-relaxed font-medium">{word.meaningEn}</div>
                </div>

                {/* Synonyms & Antonyms */}
                {word.synonyms && word.synonyms.length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs lg:text-sm text-slate-400 dark:text-slate-400 mb-1.5 font-bold">مرادفات مشابهة (Synonyms):</div>
                    <div className="flex flex-wrap gap-2">
                      {word.synonyms.map(s => (
                        <span key={s} className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 px-3.5 py-1.5 rounded-xl text-xs lg:text-sm font-bold ltr">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {word.antonyms && word.antonyms.length > 0 && (
                  <div className="mb-5">
                    <div className="text-xs lg:text-sm text-slate-400 dark:text-slate-400 mb-1.5 font-bold">الأضداد المعاكسة (Antonyms):</div>
                    <div className="flex flex-wrap gap-2">
                      {word.antonyms.map(s => (
                        <span key={s} className="bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/60 px-3.5 py-1.5 rounded-xl text-xs lg:text-sm font-bold ltr">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Examples */}
                {word.examples && word.examples.length > 0 && (
                  <div className="mb-6 lg:mb-8">
                    <div className="text-xs lg:text-sm text-slate-400 dark:text-slate-400 mb-2.5 font-bold">أمثلة في سياق واقعي:</div>
                    <div className="space-y-2.5">
                      {word.examples.slice(0, 2).map((ex, i) => (
                        <div key={i} className="flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/70 rounded-xl lg:rounded-2xl px-4 py-3 lg:px-5 lg:py-3.5 text-xs md:text-sm lg:text-base text-slate-700 dark:text-slate-200">
                          <span className="ltr flex-1 font-medium">{ex}</span>
                          <button
                            onClick={() => speakText(ex)}
                            title="استمع للمثال"
                            className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-1.5 flex-none transition-colors"
                          >
                            <Volume2 size={16} className="lg:w-5 lg:h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => advanceStage()}
                  disabled={isAdvancingRef.current}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 lg:py-5 rounded-2xl font-black text-base lg:text-xl shadow-lg shadow-indigo-200 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <span>فهمت المعنى</span>
                  <ChevronRight size={20} />
                </button>
              </div>
            )}

            {/* ── STAGE 3 — PRONUNCIATION ───────────────────────────────── */}
            {stage === 3 && (
              <div className="text-center">
                <div className="inline-flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs lg:text-sm font-black px-3.5 py-1 lg:px-4 lg:py-1.5 rounded-full border border-indigo-100 dark:border-indigo-800/60 mb-5">
                  <span>🔊</span>
                  <span>المرحلة 3: إتقان النطق الصحيح</span>
                </div>

                <div className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-800 dark:text-white mb-2.5 ltr">{word.word}</div>
                <div className="font-mono text-xl lg:text-2xl text-slate-500 dark:text-indigo-300 bg-slate-50 dark:bg-slate-800 px-4 py-1.5 lg:px-5 lg:py-2 rounded-xl border border-slate-200 dark:border-slate-700 inline-block mb-6 lg:mb-8 ltr font-bold">
                  {word.phonetic}
                </div>

                {/* Big Audio Playback Button */}
                <button
                  onClick={speakWord}
                  title="انقر للاستماع للنطق الصحيح"
                  className="w-20 h-20 lg:w-28 lg:h-28 bg-gradient-to-tr from-indigo-500 to-purple-600 text-white rounded-3xl lg:rounded-4xl flex items-center justify-center mx-auto mb-6 lg:mb-8 shadow-xl shadow-indigo-300 dark:shadow-indigo-950 hover:scale-105 active:scale-95 transition-all"
                >
                  <Volume2 size={36} className="lg:w-12 lg:h-12" />
                </button>

                {/* Speech Recording Section */}
                <div className="bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700 rounded-2xl lg:rounded-3xl p-5 lg:p-7 mb-6 lg:mb-8 text-center">
                  <div className="text-xs lg:text-sm font-bold text-slate-600 dark:text-slate-300 mb-3.5 flex items-center justify-center gap-2">
                    <Mic size={16} className="text-indigo-600 dark:text-indigo-400" />
                    <span>جرّب نطق الكلمة بصوتك عبر الميكروفون</span>
                  </div>

                  <button
                    onClick={isRecording ? undefined : startRecording}
                    className={`w-full py-3.5 lg:py-4.5 rounded-xl lg:rounded-2xl font-bold text-sm lg:text-base flex items-center justify-center gap-2 transition-all active:scale-95 ${
                      isRecording
                        ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-700 animate-pulse'
                        : 'bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 border-2 border-indigo-200 dark:border-indigo-800/80 hover:border-indigo-400 dark:hover:border-indigo-600 shadow-xs'
                    }`}
                  >
                    {isRecording ? (
                      <>
                        <MicOff size={18} className="lg:w-5 lg:h-5" />
                        <span>جاري الاستماع... تحدّث الآن</span>
                      </>
                    ) : (
                      <>
                        <Mic size={18} className="lg:w-5 lg:h-5" />
                        <span>سجّل نطقك الآن</span>
                      </>
                    )}
                  </button>

                  {recordingScore !== null && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 lg:mt-5">
                      <div className={`font-black text-sm lg:text-base ${recordingScore >= 80 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                        {recordingScore >= 80 ? '✅ نطق ممتاز ومتقن!' : '🔄 نطق جيد، حاول مرة أخرى للتحسين'}
                      </div>
                      <div className="h-2.5 lg:h-3.5 bg-slate-200 dark:bg-slate-700 rounded-full mt-2.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            recordingScore >= 80 ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${recordingScore}%` }}
                        />
                      </div>
                    </motion.div>
                  )}
                </div>

                <button
                  onClick={() => advanceStage()}
                  disabled={isAdvancingRef.current}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 lg:py-5 rounded-2xl font-black text-base lg:text-xl shadow-lg shadow-indigo-200 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <span>التالي للمرحلة 4</span>
                  <ChevronRight size={20} />
                </button>
              </div>
            )}

            {/* ── STAGE 4 — SENTENCE ────────────────────────────────────── */}
            {stage === 4 && (
              <div>
                <div className="text-center mb-5">
                  <div className="inline-flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-black px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-800/60">
                    <span>✍️</span>
                    <span>المرحلة 4: توظيف الكلمة في جملة</span>
                  </div>
                </div>

                <div className="text-2xl font-black text-center text-slate-800 dark:text-white mb-1 ltr">
                  {word.word}
                </div>
                <div className="text-center text-xs text-indigo-600 dark:text-indigo-400 font-bold mb-4">
                  {word.meaningAr}
                </div>

                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">أكمل الفراغ بالكلمة المناسبة:</div>
                
                {/* Enhanced Sentence Container with styled blank slot & real-time preview */}
                <div className="bg-slate-50/90 dark:bg-slate-800/85 border-2 border-indigo-100 dark:border-indigo-500/30 rounded-2xl lg:rounded-3xl p-5 lg:p-7 text-base md:text-xl lg:text-2xl ltr text-center font-bold text-slate-800 dark:text-slate-100 mb-4 lg:mb-6 leading-relaxed shadow-sm dark:shadow-indigo-950/40">
                  {(() => {
                    const rawExample = word.examples[0] || '';
                    const escaped = word.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    const regex = new RegExp(`(${escaped})`, 'gi');
                    const parts = rawExample.split(regex);

                    if (parts.length > 1) {
                      return (
                        <span>
                          {parts.map((part, i) => {
                            if (part.toLowerCase() === word.word.toLowerCase()) {
                              return (
                                <span
                                  key={i}
                                  className="inline-flex items-center justify-center min-w-[100px] lg:min-w-[140px] px-3 py-0.5 lg:px-4 lg:py-1 mx-1.5 rounded-xl border-2 border-dashed border-indigo-400 dark:border-indigo-400 bg-indigo-100/70 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-extrabold text-sm md:text-base lg:text-xl tracking-wider shadow-inner select-none transition-all align-middle"
                                >
                                  {sentenceAnswer.trim() ? (
                                    <span className="text-indigo-700 dark:text-indigo-200 font-black">{sentenceAnswer}</span>
                                  ) : (
                                    <span className="tracking-[0.2em] font-mono text-indigo-500 dark:text-indigo-400 font-black">______</span>
                                  )}
                                </span>
                              );
                            }
                            return <span key={i}>{part}</span>;
                          })}
                        </span>
                      );
                    }

                    return <span>{rawExample.replace(new RegExp(escaped, 'gi'), '______')}</span>;
                  })()}
                </div>

                <input
                  className="w-full border-2 border-slate-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-400 bg-white dark:bg-slate-800 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-2xl px-4 py-3.5 lg:py-4.5 text-base md:text-lg lg:text-2xl ltr outline-none mb-3 lg:mb-4 text-center shadow-xs dark:shadow-inner font-bold transition-all"
                  placeholder="اكتب الكلمة الناقصة هنا..."
                  value={sentenceAnswer}
                  onChange={e => {
                    setSentenceAnswer(e.target.value);
                    if (sentenceFeedback !== null) setSentenceFeedback(null);
                  }}
                  onKeyDown={e => e.key === 'Enter' && !isAdvancingRef.current && checkSentence()}
                  dir="ltr"
                  disabled={sentenceFeedback === true || (isAdvancingRef.current && showResult === true)}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                />

                {sentenceFeedback !== null && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`text-center font-black text-sm lg:text-base mb-3.5 py-2.5 px-4 rounded-xl border ${
                      sentenceFeedback
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
                        : 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800/60'
                    }`}
                  >
                    {sentenceFeedback ? '✅ إجابة صحيحة ومتقنة!' : '❌ الكلمة غير صحيحة، حاول كتابتها مرة أخرى'}
                  </motion.div>
                )}

                {word.examples[1] && (
                  <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 rounded-xl lg:rounded-2xl p-3.5 lg:p-4 mb-5 lg:mb-7 text-xs lg:text-sm ltr text-slate-600 dark:text-slate-300 font-medium">
                    <span className="font-bold text-slate-400 dark:text-slate-400 block mb-1">مثال إضافي:</span>
                    <span>{word.examples[1]}</span>
                  </div>
                )}

                <button
                  onClick={checkSentence}
                  disabled={!sentenceAnswer.trim() || sentenceFeedback !== null || isAdvancingRef.current}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 lg:py-5 rounded-2xl font-black text-base lg:text-xl shadow-lg shadow-indigo-200 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <span>تحقق من الجملة</span>
                  <ChevronRight size={20} />
                </button>
              </div>
            )}

            {/* ── STAGE 5 — QUIZ ────────────────────────────────────────── */}
            {stage === 5 && (
              <div>
                <div className="text-center mb-5">
                  <div className="inline-flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs lg:text-sm font-black px-3.5 py-1 lg:px-4 lg:py-1.5 rounded-full border border-indigo-100 dark:border-indigo-800/60">
                    <span>🧪</span>
                    <span>المرحلة 5: اختبار التثبيت النهائي</span>
                  </div>
                </div>

                <div className="text-4xl md:text-5xl lg:text-6xl font-black text-center text-slate-800 dark:text-white mb-2 ltr">
                  {word.word}
                </div>
                <div className="text-center text-slate-400 dark:text-slate-400 text-xs lg:text-base mb-6 lg:mb-8 font-semibold">
                  اختر المعنى العربي الدقيق للكلمة أعلاه:
                </div>

                <div className="grid grid-cols-1 gap-2.5 lg:gap-3.5">
                  {quizOptions.map((opt, i) => {
                    const isCorrect = opt === word.meaningAr;
                    const isSelected = opt === selectedOption;
                    const isPreviouslyWrong = wrongOptions.includes(opt);

                    let btnStyle = 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/40 text-slate-800 dark:text-slate-100';
                    let badgeStyle = 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300';

                    if (isPreviouslyWrong) {
                      btnStyle = 'border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 text-rose-400 dark:text-rose-400 opacity-50 cursor-not-allowed';
                      badgeStyle = 'bg-rose-100 dark:bg-rose-900/80 text-rose-600 dark:text-rose-300';
                    } else if (selectedOption) {
                      if (isCorrect) {
                        btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 shadow-sm';
                        badgeStyle = 'bg-emerald-500 text-white';
                      } else if (isSelected) {
                        btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 shadow-sm';
                        badgeStyle = 'bg-rose-500 text-white';
                      } else {
                        btnStyle = 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500 opacity-40';
                        badgeStyle = 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500';
                      }
                    }

                    return (
                      <button
                        key={opt}
                        onClick={() => handleQuizAnswer(opt)}
                        disabled={!!selectedOption || isAdvancingRef.current || isPreviouslyWrong}
                        className={`w-full text-right px-4 py-3.5 lg:px-6 lg:py-5 rounded-2xl lg:rounded-3xl border-2 font-bold flex items-center justify-between transition-all duration-200 active:scale-[0.99] ${btnStyle}`}
                      >
                        <div className="flex items-center gap-3 lg:gap-4">
                          <span className={`w-8 h-8 lg:w-11 lg:h-11 rounded-xl text-xs lg:text-base font-black flex items-center justify-center flex-none ${badgeStyle}`}>
                            {['A', 'B', 'C', 'D'][i] ?? `${i + 1}`}
                          </span>
                          <span className="text-base lg:text-xl font-bold">{opt}</span>
                        </div>

                        {selectedOption && isCorrect && (
                          <CheckCircle size={22} className="lg:w-7 lg:h-7 text-emerald-600 dark:text-emerald-400 flex-none" />
                        )}
                        {selectedOption && isSelected && !isCorrect && (
                          <XCircle size={22} className="lg:w-7 lg:h-7 text-rose-500 dark:text-rose-400 flex-none" />
                        )}
                        {isPreviouslyWrong && (
                          <XCircle size={18} className="lg:w-6 lg:h-6 text-rose-400 flex-none" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {selectedOption && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-4 text-center text-sm font-black py-2.5 px-4 rounded-xl border ${
                      selectedOption === word.meaningAr
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
                        : 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800/60'
                    }`}
                  >
                    {selectedOption === word.meaningAr
                      ? '🎉 ممتاز! إجابة صحيحة'
                      : '❌ إجابة غير صحيحة، حاول اختيار معنى آخر'
                    }
                  </motion.div>
                )}

                {!selectedOption && wrongOptions.length > 0 && (
                  <div className="mt-3 text-center text-xs text-rose-500 dark:text-rose-400 font-bold flex items-center justify-center gap-1">
                    <span>حاول مجدداً باختيار المعنى الصحيح من الخيارات المتبقية 👆</span>
                  </div>
                )}
              </div>
            )}

            {/* ── Overlay animation for correct/wrong flash ──────────────────── */}
            {showResult !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.18 }}
                className="absolute inset-0 flex items-center justify-center rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs pointer-events-none z-30"
              >
                {showResult ? (
                  <motion.div
                    initial={{ scale: 0.75 }}
                    animate={{ scale: [0.75, 1.15, 1] }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="flex flex-col items-center"
                  >
                    <CheckCircle className="text-emerald-500 drop-shadow-lg" size={84} />
                    <span className="text-emerald-700 dark:text-emerald-400 font-black text-2xl mt-3 tracking-wide">
                      ممتاز!
                    </span>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ x: 0 }}
                    animate={{ x: [-10, 10, -8, 8, -4, 4, 0] }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center"
                  >
                    <XCircle className="text-rose-500 drop-shadow-lg" size={84} />
                    <span className="text-rose-600 dark:text-rose-400 font-black text-2xl mt-3 tracking-wide">
                      حاول ثانية
                    </span>
                  </motion.div>
                )}
              </motion.div>
            )}

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
