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

  const advanceStage = async (correct = true) => {
    if (isAdvancingRef.current) return;
    isAdvancingRef.current = true;
    setShowResult(correct);

    await fetch('/api/words/progress', {
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
    });

    setTimeout(() => {
      setShowResult(null);
      setSelectedOption(null);
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
        }, 1200);
      }
    }, 900);
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
    const correct = sentenceAnswer.trim().toLowerCase().includes(word.word.toLowerCase());
    setSentenceFeedback(correct);
    setTimeout(() => advanceStage(correct), 800);
  };

  const handleQuizAnswer = (opt: string) => {
    if (selectedOption || isAdvancingRef.current) return;
    setSelectedOption(opt);
    const correct = opt === word.meaningAr;
    setTimeout(() => advanceStage(correct), 1200);
  };

  return (
    <div className="max-w-2xl mx-auto">
      
      {/* ── Stage progress indicators ──────────────────────────────────── */}
      <div className="flex items-center justify-between max-w-sm mx-auto mb-6 px-2">
        {STAGES.map((s, idx) => {
          const isDone = s.id < stage || wordCompleted;
          const isCurrent = s.id === stage && !wordCompleted;

          return (
            <div key={s.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  title={s.label}
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 relative ${
                    isDone
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : isCurrent
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white scale-110 shadow-md shadow-indigo-300 ring-4 ring-indigo-100'
                      : 'bg-white text-slate-400 border border-slate-200'
                  }`}
                >
                  {isDone ? <Check size={16} strokeWidth={3} /> : <span>{s.emoji}</span>}
                </button>
                <span className={`text-[10px] font-bold mt-1 transition-colors ${
                  isCurrent ? 'text-indigo-600' : isDone ? 'text-emerald-600' : 'text-slate-400'
                }`}>
                  {s.label}
                </span>
              </div>

              {idx < STAGES.length - 1 && (
                <div className={`h-1 flex-1 mx-1.5 -mt-3.5 rounded-full transition-colors duration-300 ${
                  s.id < stage || wordCompleted ? 'bg-emerald-400' : 'bg-slate-200'
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
            className="bg-white rounded-3xl p-8 text-center border border-slate-100 shadow-xl"
          >
            <div className="w-20 h-20 mx-auto mb-4 bg-emerald-50 rounded-full flex items-center justify-center text-4xl shadow-inner border border-emerald-100 animate-bounce-gentle">
              {lastCorrect ? '🎉' : '👏'}
            </div>
            <div className="text-3xl font-black text-slate-800 mb-1 ltr">{word.word}</div>
            <div className="text-indigo-600 text-lg font-bold mb-4">{word.meaningAr}</div>
            <div className="text-emerald-600 font-black text-xl mb-1">
              {lastCorrect ? 'أحسنت! تم إتقان الكلمة بنجاح ✓' : 'عمل رائع! استمر في التقدم 💪'}
            </div>
            <div className="text-slate-400 text-xs mt-2 flex items-center justify-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>جاري الانتقال للكلمة التالية...</span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={stage}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
          >

            {/* ── STAGE 1 — RECOGNITION ──────────────────────────────────── */}
            {stage === 1 && (
              <div className="text-center">
                <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-xs font-black px-3 py-1 rounded-full border border-indigo-100 mb-4">
                  <span>👁️</span>
                  <span>المرحلة 1: التعرف على الكلمة وصورتها</span>
                </div>

                {/* Smart Visual Photo */}
                <WordVisualCard word={word.word} category={word.category} />

                {/* Phonetics & Audio Button */}
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="font-mono text-xl ltr text-slate-500 bg-slate-50 px-3 py-1 rounded-xl border border-slate-200">
                    {word.phonetic}
                  </span>
                  <button
                    onClick={speakWord}
                    title="استمع للنطق"
                    className="w-10 h-10 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center transition-all active:scale-95 shadow-xs border border-indigo-100"
                  >
                    <Volume2 size={19} />
                  </button>
                </div>

                {/* Part of speech badge */}
                <div className="mb-6">
                  <span className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 text-slate-600 px-3.5 py-1 rounded-xl text-xs font-bold">
                    <span>{word.partOfSpeechAr}</span>
                    <span className="text-slate-300">•</span>
                    <span className="ltr font-semibold text-slate-500">{word.partOfSpeech}</span>
                  </span>
                </div>

                <button
                  onClick={() => advanceStage()}
                  disabled={isAdvancingRef.current}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 rounded-2xl font-black text-base shadow-lg shadow-indigo-200 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <span>فهمت الكلمة</span>
                  <ChevronRight size={18} />
                </button>
              </div>
            )}

            {/* ── STAGE 2 — MEANING ─────────────────────────────────────── */}
            {stage === 2 && (
              <div>
                <div className="text-center mb-4">
                  <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-xs font-black px-3 py-1 rounded-full border border-indigo-100">
                    <span>📖</span>
                    <span>المرحلة 2: المعنى والاستخدام</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 mb-4">
                  <span className="text-3xl md:text-4xl font-black text-slate-800 ltr">{word.word}</span>
                  <button
                    onClick={speakWord}
                    title="استمع للنطق"
                    className="w-9 h-9 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center transition-all active:scale-95 border border-indigo-100"
                  >
                    <Volume2 size={17} />
                  </button>
                </div>

                {/* Visual miniature */}
                <WordVisualCard word={word.word} category={word.category} showWordOverlay={false} className="h-32 mb-4" />

                {/* Arabic Meaning & English definition */}
                <div className="bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/70 rounded-2xl p-5 mb-4 border border-indigo-100/80 shadow-xs">
                  <div className="text-xs font-bold text-indigo-500 mb-1">المعنى بالعربية:</div>
                  <div className="text-2xl font-black text-indigo-900 mb-3">{word.meaningAr}</div>
                  <div className="text-xs font-bold text-slate-400 mb-1">التعريف بالإنجليزية:</div>
                  <div className="text-slate-600 text-sm ltr leading-relaxed">{word.meaningEn}</div>
                </div>

                {/* Synonyms & Antonyms */}
                {word.synonyms && word.synonyms.length > 0 && (
                  <div className="mb-3.5">
                    <div className="text-xs text-slate-400 mb-1.5 font-bold">مرادفات مشابهة (Synonyms):</div>
                    <div className="flex flex-wrap gap-1.5">
                      {word.synonyms.map(s => (
                        <span key={s} className="bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-3 py-1 rounded-xl text-xs font-bold ltr">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {word.antonyms && word.antonyms.length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs text-slate-400 mb-1.5 font-bold">الأضداد المعاكسة (Antonyms):</div>
                    <div className="flex flex-wrap gap-1.5">
                      {word.antonyms.map(s => (
                        <span key={s} className="bg-rose-50 text-rose-800 border border-rose-200/80 px-3 py-1 rounded-xl text-xs font-bold ltr">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Examples */}
                {word.examples && word.examples.length > 0 && (
                  <div className="mb-6">
                    <div className="text-xs text-slate-400 mb-2 font-bold">أمثلة في سياق واقعي:</div>
                    <div className="space-y-2">
                      {word.examples.slice(0, 2).map((ex, i) => (
                        <div key={i} className="flex items-center justify-between gap-2 bg-slate-50 border border-slate-200/70 rounded-xl px-3.5 py-2.5 text-xs md:text-sm text-slate-700">
                          <span className="ltr flex-1 font-medium">{ex}</span>
                          <button
                            onClick={() => speakText(ex)}
                            title="استمع للمثال"
                            className="text-slate-400 hover:text-indigo-600 p-1 flex-none"
                          >
                            <Volume2 size={15} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => advanceStage()}
                  disabled={isAdvancingRef.current}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 rounded-2xl font-black text-base shadow-lg shadow-indigo-200 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <span>فهمت المعنى</span>
                  <ChevronRight size={18} />
                </button>
              </div>
            )}

            {/* ── STAGE 3 — PRONUNCIATION ───────────────────────────────── */}
            {stage === 3 && (
              <div className="text-center">
                <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-xs font-black px-3 py-1 rounded-full border border-indigo-100 mb-5">
                  <span>🔊</span>
                  <span>المرحلة 3: إتقان النطق الصحيح</span>
                </div>

                <div className="text-4xl md:text-5xl font-black text-slate-800 mb-2 ltr">{word.word}</div>
                <div className="font-mono text-xl text-slate-500 bg-slate-50 px-4 py-1.5 rounded-xl border border-slate-200 inline-block mb-6 ltr">
                  {word.phonetic}
                </div>

                {/* Big Audio Playback Button */}
                <button
                  onClick={speakWord}
                  title="انقر للاستماع للنطق الصحيح"
                  className="w-20 h-20 bg-gradient-to-tr from-indigo-500 to-purple-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-300 hover:scale-105 active:scale-95 transition-all"
                >
                  <Volume2 size={36} />
                </button>

                {/* Speech Recording Section */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 mb-6 text-center">
                  <div className="text-xs font-bold text-slate-600 mb-3 flex items-center justify-center gap-1.5">
                    <Mic size={14} className="text-indigo-600" />
                    <span>جرّب نطق الكلمة بصوتك عبر الميكروفون</span>
                  </div>

                  <button
                    onClick={isRecording ? undefined : startRecording}
                    className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
                      isRecording
                        ? 'bg-rose-100 text-rose-700 border border-rose-300 animate-pulse'
                        : 'bg-white text-indigo-700 border-2 border-indigo-200 hover:border-indigo-400 shadow-xs'
                    }`}
                  >
                    {isRecording ? (
                      <>
                        <MicOff size={18} />
                        <span>جاري الاستماع... تحدّث الآن</span>
                      </>
                    ) : (
                      <>
                        <Mic size={18} />
                        <span>سجّل نطقك الآن</span>
                      </>
                    )}
                  </button>

                  {recordingScore !== null && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
                      <div className={`font-black text-sm ${recordingScore >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {recordingScore >= 80 ? '✅ نطق ممتاز ومتقن!' : '🔄 نطق جيد، حاول مرة أخرى للتحسين'}
                      </div>
                      <div className="h-2.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
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
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 rounded-2xl font-black text-base shadow-lg shadow-indigo-200 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <span>التالي للمرحلة 4</span>
                  <ChevronRight size={18} />
                </button>
              </div>
            )}

            {/* ── STAGE 4 — SENTENCE ────────────────────────────────────── */}
            {stage === 4 && (
              <div>
                <div className="text-center mb-5">
                  <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-xs font-black px-3 py-1 rounded-full border border-indigo-100">
                    <span>✍️</span>
                    <span>المرحلة 4: توظيف الكلمة في جملة</span>
                  </div>
                </div>

                <div className="text-2xl font-black text-center text-slate-800 mb-1 ltr">
                  {word.word}
                </div>
                <div className="text-center text-xs text-indigo-600 font-bold mb-4">
                  {word.meaningAr}
                </div>

                <div className="text-xs font-bold text-slate-500 mb-2">أكمل الفراغ بالكلمة المناسبة:</div>
                <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4 text-base md:text-lg ltr text-center font-bold text-slate-800 mb-4 leading-relaxed">
                  {word.examples[0]?.replace(new RegExp(word.word, 'gi'), '______')}
                </div>

                <input
                  className="w-full border-2 border-slate-200 focus:border-indigo-500 rounded-2xl px-4 py-3.5 text-base md:text-lg ltr outline-none mb-3 text-center shadow-xs font-bold transition-all"
                  placeholder="اكتب الكلمة الناقصة هنا..."
                  value={sentenceAnswer}
                  onChange={e => setSentenceAnswer(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !isAdvancingRef.current && checkSentence()}
                  dir="ltr"
                  disabled={sentenceFeedback !== null}
                />

                {sentenceFeedback !== null && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`text-center font-black text-sm mb-3 py-2 px-3 rounded-xl border ${
                      sentenceFeedback
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border-rose-200'
                    }`}
                  >
                    {sentenceFeedback ? '✅ إجابة صحيحة ومتقنة!' : `❌ الكلمة الصحيحة هي: "${word.word}"`}
                  </motion.div>
                )}

                {word.examples[1] && (
                  <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-3 mb-5 text-xs ltr text-slate-600 font-medium">
                    <span className="font-bold text-slate-400 block mb-0.5">مثال إضافي:</span>
                    <span>{word.examples[1]}</span>
                  </div>
                )}

                <button
                  onClick={checkSentence}
                  disabled={!sentenceAnswer.trim() || sentenceFeedback !== null || isAdvancingRef.current}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 rounded-2xl font-black text-base shadow-lg shadow-indigo-200 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <span>تحقق من الجملة</span>
                  <ChevronRight size={18} />
                </button>
              </div>
            )}

            {/* ── STAGE 5 — QUIZ ────────────────────────────────────────── */}
            {stage === 5 && (
              <div>
                <div className="text-center mb-5">
                  <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-xs font-black px-3 py-1 rounded-full border border-indigo-100">
                    <span>🧪</span>
                    <span>المرحلة 5: اختبار التثبيت النهائي</span>
                  </div>
                </div>

                <div className="text-4xl md:text-5xl font-black text-center text-slate-800 mb-1 ltr">
                  {word.word}
                </div>
                <div className="text-center text-slate-400 text-xs mb-6 font-semibold">
                  اختر المعنى العربي الدقيق للكلمة أعلاه:
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {quizOptions.map((opt, i) => {
                    const isCorrect = opt === word.meaningAr;
                    const isSelected = opt === selectedOption;

                    let btnStyle = 'border-slate-200 bg-white hover:border-indigo-400 hover:bg-indigo-50/50 text-slate-800';
                    let badgeStyle = 'bg-slate-100 text-slate-600';

                    if (selectedOption) {
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
                        onClick={() => handleQuizAnswer(opt)}
                        disabled={!!selectedOption}
                        className={`w-full text-right px-4 py-3.5 rounded-2xl border-2 font-bold flex items-center justify-between transition-all duration-200 active:scale-[0.99] ${btnStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-8 h-8 rounded-xl text-xs font-black flex items-center justify-center flex-none ${badgeStyle}`}>
                            {['A', 'B', 'C', 'D'][i] ?? `${i + 1}`}
                          </span>
                          <span className="text-base">{opt}</span>
                        </div>

                        {selectedOption && isCorrect && (
                          <CheckCircle size={22} className="text-emerald-600 flex-none" />
                        )}
                        {selectedOption && isSelected && !isCorrect && (
                          <XCircle size={22} className="text-rose-500 flex-none" />
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
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border-rose-200'
                    }`}
                  >
                    {selectedOption === word.meaningAr
                      ? '🎉 ممتاز! إجابة صحيحة'
                      : `❌ الإجابة الصحيحة: ${word.meaningAr}`
                    }
                  </motion.div>
                )}
              </div>
            )}

            {/* ── Overlay animation for correct/wrong flash ──────────────────── */}
            {showResult !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center rounded-3xl bg-white/85 backdrop-blur-xs pointer-events-none z-30"
              >
                {showResult ? (
                  <div className="flex flex-col items-center">
                    <CheckCircle className="text-emerald-500 drop-shadow-lg" size={80} />
                    <span className="text-emerald-700 font-black text-lg mt-2">ممتاز!</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <XCircle className="text-rose-500 drop-shadow-lg" size={80} />
                    <span className="text-rose-700 font-black text-lg mt-2">حاول ثانية</span>
                  </div>
                )}
              </motion.div>
            )}

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
