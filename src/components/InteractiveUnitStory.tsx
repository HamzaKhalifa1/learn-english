'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  BookOpen,
  Award,
  X,
  HelpCircle,
} from 'lucide-react';
import type { UnitStory, StoryQuestion } from '@/data/unitStories';
import { getUnit } from '@/lib/words';
import { playTTS, stopTTS } from '@/lib/tts';

interface Props {
  unitId: string;
  onClose: () => void;
  onFinish?: (xpEarned: number) => void;
}

interface WordDetail {
  word: string;
  meaningAr: string;
  phonetic?: string;
  partOfSpeechAr?: string;
  isUnitWord?: boolean;
  isLoading?: boolean;
}

function findWordDetail(rawWord: string, map: Record<string, WordDetail>): WordDetail | null {
  const clean = rawWord.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (!clean) return null;
  if (map[clean]) return map[clean];

  // Common inflections & stems
  if (clean.endsWith('ing') && map[clean.slice(0, -3)]) return map[clean.slice(0, -3)];
  if (clean.endsWith('ed') && map[clean.slice(0, -2)]) return map[clean.slice(0, -2)];
  if (clean.endsWith('ed') && map[clean.slice(0, -1)]) return map[clean.slice(0, -1)];
  if (clean.endsWith('s') && map[clean.slice(0, -1)]) return map[clean.slice(0, -1)];
  if (clean.endsWith('es') && map[clean.slice(0, -2)]) return map[clean.slice(0, -2)];

  return null;
}

export default function InteractiveUnitStory({ unitId, onClose, onFinish }: Props) {
  const [story, setStory] = useState<UnitStory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Audio narration state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeParagraphIdx, setActiveParagraphIdx] = useState<number | null>(null);

  // Translation visibility
  const [showAllTranslations, setShowAllTranslations] = useState(false);

  // Word popover tooltip state
  const [selectedWord, setSelectedWord] = useState<WordDetail | null>(null);

  // Unit words lookup map for instant translations
  const [unitWordsMap, setUnitWordsMap] = useState<Record<string, WordDetail>>({});

  // Client cache for on-demand word translations
  const [clientDictCache, setClientDictCache] = useState<Record<string, WordDetail>>({});

  // Comprehension quiz state
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Completion modal state
  const [isCompleted, setIsCompleted] = useState(false);

  // Load story & unit words
  useEffect(() => {
    fetch(`/api/stories/${unitId}`)
      .then(res => res.json())
      .then(async data => {
        if (data.success && data.data?.story) {
          setStory(data.data.story);

          // Build dictionary of words in unit for tooltip details
          const u = await import('@/lib/words').then(m => m.getUnit(unitId));
          if (u && u.words) {
            const map: Record<string, WordDetail> = {};
            u.words.forEach(w => {
              const lower = w.word.toLowerCase().trim();
              const detail: WordDetail = {
                word: w.word,
                meaningAr: w.meaningAr,
                phonetic: w.phonetic,
                partOfSpeechAr: w.partOfSpeechAr,
              };
              map[lower] = detail;
              // If word contains spaces (e.g. "thank you"), also index parts
              if (lower.includes(' ')) {
                lower.split(' ').forEach(part => {
                  if (part.length > 2 && !map[part]) {
                    map[part] = detail;
                  }
                });
              }
            });
            setUnitWordsMap(map);
          }
        } else {
          setError('لم يتم العثور على قصة لهذه الوحدة');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('حدث خطأ في تحميل القصة');
        setLoading(false);
      });
  }, [unitId]);

  // Audio Playback using Microsoft Edge Natural Neural TTS
  const speakText = useCallback((text: string, onEnd?: () => void) => {
    const clean = text.replace(/["'()]/g, '');
    playTTS(clean, {
      voice: 'en-US-AriaNeural',
      onEnd,
    });
  }, []);

  const stopAudio = useCallback(() => {
    stopTTS();
    setIsPlayingAudio(false);
    setActiveParagraphIdx(null);
  }, []);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      stopTTS();
    };
  }, []);

  // Play full story sequence paragraph by paragraph
  const playStoryNarration = () => {
    if (!story) return;
    if (isPlayingAudio) {
      stopAudio();
      return;
    }

    setIsPlayingAudio(true);
    let pIdx = 0;

    const playNextParagraph = () => {
      if (!story || pIdx >= story.paragraphs.length) {
        setIsPlayingAudio(false);
        setActiveParagraphIdx(null);
        return;
      }

      setActiveParagraphIdx(pIdx);
      speakText(story.paragraphs[pIdx], () => {
        pIdx++;
        // Small delay between paragraphs for natural pacing
        setTimeout(playNextParagraph, 700);
      });
    };

    playNextParagraph();
  };

  const handleWordClick = (rawWord: string) => {
    const found = findWordDetail(rawWord, unitWordsMap);
    if (found) {
      setSelectedWord({ ...found, isUnitWord: true });
      speakText(found.word);
    } else {
      handleGeneralWordClick(rawWord);
    }
  };

  const handleGeneralWordClick = async (rawWord: string) => {
    const clean = rawWord.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!clean) return;

    // Pronounce the word immediately
    speakText(clean);

    // If in client cache, show immediately
    if (clientDictCache[clean]) {
      setSelectedWord(clientDictCache[clean]);
      return;
    }

    const cleanDisplay = rawWord.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '');

    // Show instant loading state with speech
    setSelectedWord({
      word: cleanDisplay || clean,
      meaningAr: 'جاري جلب المعنى...',
      isUnitWord: false,
      isLoading: true,
    });

    try {
      const res = await fetch(`/api/dictionary?word=${encodeURIComponent(clean)}`);
      const data = await res.json();
      if (data.success && data.data) {
        const entry: WordDetail = {
          word: data.data.word || cleanDisplay,
          meaningAr: data.data.meaningAr || 'كلمة في سياق القصة',
          phonetic: data.data.phonetic,
          partOfSpeechAr: data.data.partOfSpeechAr,
          isUnitWord: !!data.data.isUnitWord,
          isLoading: false,
        };
        setClientDictCache(prev => ({ ...prev, [clean]: entry }));
        setSelectedWord(entry);
      } else {
        setSelectedWord({
          word: cleanDisplay || clean,
          meaningAr: 'كلمة في سياق القصة',
          isUnitWord: false,
          isLoading: false,
        });
      }
    } catch {
      setSelectedWord({
        word: cleanDisplay || clean,
        meaningAr: 'كلمة في سياق القصة',
        isUnitWord: false,
        isLoading: false,
      });
    }
  };

  // Submit quiz & save progress
  const handleSubmitQuiz = async () => {
    if (!story) return;
    setQuizSubmitted(true);

    let score = 0;
    story.questions.forEach(q => {
      if (quizAnswers[q.id] === q.correctIndex) {
        score++;
      }
    });
    setQuizScore(score);

    // Save progress to DB (+20 XP)
    await fetch(`/api/stories/${unitId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score, xp: 20 }),
    });

    setIsCompleted(true);
    if (onFinish) onFinish(20);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-slate-100 dark:border-slate-800">
          <div className="w-16 h-16 mx-auto mb-4 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/60 rounded-2xl flex items-center justify-center text-3xl animate-bounce-gentle">
            📖
          </div>
          <div className="text-slate-600 dark:text-slate-300 font-bold text-sm">جاري تحضير القصة التفاعلية...</div>
        </div>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl border border-slate-100 dark:border-slate-800">
          <div className="text-4xl mb-3">⚠️</div>
          <div className="text-slate-700 dark:text-slate-200 font-bold text-sm mb-4">{error || 'تعذر تحميل القصة'}</div>
          <button
            onClick={onClose}
            className="w-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            إغلاق
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 dark:border-slate-800 my-auto overflow-hidden relative flex flex-col max-h-[92vh]"
      >
        
        {/* ── Top Header ────────────────────────────────────────────── */}
        <div className="p-4 md:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between flex-none bg-slate-50/70 dark:bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-200 dark:shadow-indigo-950 flex-none text-lg">
              📖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-2 py-0.5 rounded-md border border-indigo-100 dark:border-indigo-800/60">
                  قصة الوحدة
                </span>
                <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800/60 flex items-center gap-1">
                  <Sparkles size={11} className="fill-amber-500" />
                  <span>+20 XP</span>
                </span>
              </div>
              <h2 className="text-sm md:text-base font-black text-slate-800 dark:text-white mt-0.5">
                {story.titleAr}
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              stopAudio();
              onClose();
            }}
            className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors flex items-center justify-center flex-none"
            title="إغلاق"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Toolbar: Audio Narration & Translation Toggle ─────────── */}
        <div className="px-5 py-3 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap flex-none">
          {/* Audio narration button */}
          <button
            onClick={playStoryNarration}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-xs ${
              isPlayingAudio
                ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 animate-pulse'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100 dark:shadow-indigo-950'
            }`}
          >
            {isPlayingAudio ? (
              <>
                <Pause size={14} className="fill-rose-700" />
                <span>إيقاف القراءة الصوتية</span>
              </>
            ) : (
              <>
                <Play size={14} className="fill-white" />
                <span>استمع للقصة كاملة 🔊</span>
              </>
            )}
          </button>

          {/* Translation reveal toggle */}
          <button
            onClick={() => setShowAllTranslations(!showAllTranslations)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              showAllTranslations
                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            {showAllTranslations ? (
              <>
                <EyeOff size={14} />
                <span>إخفاء الترجمة</span>
              </>
            ) : (
              <>
                <Eye size={14} />
                <span>إظهار الترجمة العربية</span>
              </>
            )}
          </button>
        </div>

        {/* ── Scrollable Story Body ─────────────────────────────────── */}
        <div className="p-5 md:p-7 overflow-y-auto flex-1 space-y-6">
          
          {/* English story title banner */}
          <div className="text-center pb-2">
            <h1 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white ltr tracking-tight mb-1">
              {story.title}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold flex items-center justify-center gap-1.5 flex-wrap">
              <span>انقر على أي كلمة في القصة للاستماع لنطقها ورؤية معناها العربي 💡</span>
              <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full font-bold border border-indigo-200/50 dark:border-indigo-800/50">
                البنفسجي: كلمات وحدتك
              </span>
            </p>
          </div>

          {/* Paragraphs */}
          <div className="space-y-5">
            {story.paragraphs.map((pText, pIdx) => {
              const isCurrentPlaying = activeParagraphIdx === pIdx;
              const pArabic = story.paragraphsAr[pIdx];

              // Tokenize words to highlight unit vocabulary
              const words = pText.split(' ');

              return (
                <div
                  key={pIdx}
                  className={`p-4 md:p-5 rounded-2xl transition-all duration-300 border ${
                    isCurrentPlaying
                      ? 'bg-indigo-50/70 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-700 ring-2 ring-indigo-300/60 shadow-sm'
                      : 'bg-slate-50/50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
                  }`}
                >
                  {/* English paragraph */}
                  <div className="text-base md:text-lg ltr leading-relaxed text-slate-800 dark:text-slate-100 font-medium">
                    {words.map((w, wIdx) => {
                      const clean = w.toLowerCase().replace(/[^a-z0-9]/g, '');
                      if (!clean) return <span key={wIdx}>{w} </span>;

                      const found = findWordDetail(w, unitWordsMap);

                      if (found) {
                        return (
                          <span
                            key={wIdx}
                            onClick={() => {
                              setSelectedWord({ ...found, isUnitWord: true });
                              speakText(found.word);
                            }}
                            className="inline-block cursor-pointer font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-100/70 dark:bg-indigo-950/80 hover:bg-indigo-200 dark:hover:bg-indigo-900 px-1.5 py-0.5 rounded-md transition-all mx-0.5 shadow-2xs hover:scale-105 active:scale-95 border border-indigo-200/50 dark:border-indigo-800/50"
                            title="كلمة من الوحدة - انقر لمعرفة المعنى والنطق"
                          >
                            {w}{' '}
                          </span>
                        );
                      }

                      return (
                        <span
                          key={wIdx}
                          onClick={() => handleGeneralWordClick(w)}
                          className="inline-block cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/70 dark:hover:bg-indigo-950/60 px-1 py-0.2 rounded transition-all hover:scale-105 active:scale-95"
                          title="انقر للاستماع للنطق ورؤية المعنى"
                        >
                          {w}{' '}
                        </span>
                      );
                    })}
                  </div>

                  {/* Paragraph audio playback mini-button */}
                  <div className="mt-2.5 pt-2 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between text-xs">
                    <button
                      onClick={() => speakText(pText)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      <Volume2 size={13} />
                      <span>استمع للفقرة</span>
                    </button>

                    {showAllTranslations && pArabic && (
                      <span className="text-[10px] text-slate-400 dark:text-slate-400 font-bold">عربي</span>
                    )}
                  </div>

                  {/* Arabic Translation (Collapsible or Revealed) */}
                  {showAllTranslations && pArabic && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-2 text-xs md:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed bg-white/80 dark:bg-slate-900/80 p-3 rounded-xl border border-slate-100 dark:border-slate-800"
                    >
                      {pArabic}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ── Comprehension Questions Section ────────────────────── */}
          {story.questions && story.questions.length > 0 && (
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center font-black border border-amber-200 dark:border-amber-800/60">
                  ❓
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-800 dark:text-white">
                    أسئلة الفهم والاستيعاب
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-400 font-semibold">
                    أجب على السؤالين لتأكيد فهمك للقصة ونيل نقاط الـ XP
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {story.questions.map((q, qIdx) => {
                  const selectedOpt = quizAnswers[q.id];
                  const hasAnswered = selectedOpt !== undefined;

                  return (
                    <div
                      key={q.id}
                      className="bg-white dark:bg-slate-900 rounded-2xl p-4 md:p-5 border border-slate-200 dark:border-slate-800 shadow-xs"
                    >
                      <div className="flex items-center gap-2 text-xs font-black text-indigo-600 dark:text-indigo-400 mb-1">
                        <span>السؤال {qIdx + 1}</span>
                      </div>
                      <div className="text-sm md:text-base font-bold text-slate-800 dark:text-white mb-1 ltr">
                        {q.question}
                      </div>
                      <div className="text-xs text-slate-500 font-medium mb-3">
                        {q.questionAr}
                      </div>

                      {/* Options */}
                      <div className="space-y-2">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = selectedOpt === optIdx;
                          const isCorrect = optIdx === q.correctIndex;

                          let btnStyle = 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/40 text-slate-700';
                          let badgeStyle = 'bg-slate-100 text-slate-600';

                          if (quizSubmitted) {
                            if (isCorrect) {
                              btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-xs font-bold';
                              badgeStyle = 'bg-emerald-500 text-white';
                            } else if (isSelected) {
                              btnStyle = 'border-rose-400 bg-rose-50 text-rose-900 font-bold';
                              badgeStyle = 'bg-rose-500 text-white';
                            } else {
                              btnStyle = 'border-slate-100 bg-slate-50 opacity-40';
                              badgeStyle = 'bg-slate-200 text-slate-400';
                            }
                          } else if (isSelected) {
                            btnStyle = 'border-indigo-500 bg-indigo-50 text-indigo-900 font-bold';
                            badgeStyle = 'bg-indigo-600 text-white';
                          }

                          return (
                            <button
                              key={optIdx}
                              disabled={quizSubmitted}
                              onClick={() => {
                                setQuizAnswers(prev => ({ ...prev, [q.id]: optIdx }));
                              }}
                              className={`w-full text-right px-3.5 py-2.5 rounded-xl border-2 text-xs md:text-sm flex items-center justify-between transition-all ltr active:scale-[0.99] ${btnStyle}`}
                            >
                              <div className="flex items-center gap-2.5">
                                <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center flex-none ${badgeStyle}`}>
                                  {['A', 'B', 'C', 'D'][optIdx] ?? `${optIdx + 1}`}
                                </span>
                                <span>{opt}</span>
                              </div>

                              {quizSubmitted && isCorrect && (
                                <CheckCircle2 size={18} className="text-emerald-600 flex-none ml-2" />
                              )}
                              {quizSubmitted && isSelected && !isCorrect && (
                                <XCircle size={18} className="text-rose-500 flex-none ml-2" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation after submission */}
                      {quizSubmitted && (
                        <div className="mt-2.5 pt-2 border-t border-slate-100 text-xs font-medium text-slate-600 flex items-center gap-1.5">
                          <span className="font-bold text-indigo-600">الشرح:</span>
                          <span>{q.explanationAr}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Submit Quiz Button */}
              {!quizSubmitted && (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(quizAnswers).length < story.questions.length}
                  className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-indigo-200 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Award size={18} />
                  <span>تأكيد الإجابات ونيل +20 XP</span>
                </button>
              )}
            </div>
          )}

        </div>

        {/* ── Interactive Word Tooltip Popover ──────────────────────── */}
        <AnimatePresence>
          {selectedWord && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="absolute bottom-4 left-4 right-4 z-40 bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-slate-700 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => speakText(selectedWord.word)}
                  title="استمع للنطق"
                  className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-none hover:bg-indigo-500 active:scale-95 transition-colors shadow-sm"
                >
                  <Volume2 size={19} />
                </button>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base font-black ltr">{selectedWord.word}</span>
                    {selectedWord.phonetic && (
                      <span className="text-xs text-slate-400 font-mono ltr">{selectedWord.phonetic}</span>
                    )}
                    {selectedWord.partOfSpeechAr && (
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700">
                        {selectedWord.partOfSpeechAr}
                      </span>
                    )}
                    {selectedWord.isUnitWord ? (
                      <span className="text-[10px] bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 px-2 py-0.5 rounded-full font-bold">
                        كلمة من الوحدة ⭐
                      </span>
                    ) : (
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full font-bold">
                        قاموس القصة 📖
                      </span>
                    )}
                  </div>
                  <div className={`text-sm font-bold text-amber-400 mt-0.5 ${selectedWord.isLoading ? 'animate-pulse text-slate-400' : ''}`}>
                    {selectedWord.meaningAr}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedWord(null)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg flex-none"
              >
                <X size={18} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Completion Celebration Dialog ─────────────────────────── */}
        <AnimatePresence>
          {isCompleted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center"
            >
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-tr from-amber-400 to-orange-500 text-white rounded-3xl flex items-center justify-center text-4xl shadow-xl shadow-orange-200 animate-bounce-gentle">
                🎉
              </div>

              <h2 className="text-2xl font-black text-slate-800 mb-1">
                رائع! أتممت قصة الوحدة بنجاح
              </h2>
              <p className="text-xs text-slate-400 mb-5 font-semibold">
                عززت استيعاب الكلمات في سياق واقعي متكامل
              </p>

              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 max-w-xs w-full mb-6">
                <div className="text-3xl font-black text-emerald-700 mb-0.5">
                  +20 XP
                </div>
                <div className="text-xs font-bold text-emerald-600">
                  أجبت على {quizScore} من {story.questions.length} أسئلة بشكل صحيح
                </div>
              </div>

              <button
                onClick={() => {
                  stopAudio();
                  onClose();
                }}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3.5 rounded-2xl font-black text-sm shadow-lg shadow-indigo-200 hover:from-indigo-700 hover:to-purple-700 active:scale-95 transition-all flex items-center gap-2"
              >
                <span>متابعة التعلم 🚀</span>
                <ArrowRight size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
}
