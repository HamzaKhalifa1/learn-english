'use client';
import { Suspense, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { Volume2, CheckCircle2, XCircle, ArrowRight, RotateCcw, Sparkles, BookOpen } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { getWord, getLevelColor } from '@/lib/words';
import { playTTS } from '@/lib/tts';

interface WordProg {
  word_id: string;
  word: string;
  unit_id: string;
  level: string;
  stage: number;
}

function ReviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const customWordsParam = searchParams.get('words');

  const [reviewWords, setReviewWords] = useState<WordProg[]>([]);
  const [current, setCurrent] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (customWordsParam) {
      const targetIds = customWordsParam.split(',').map(s => s.trim().toLowerCase());
      fetch('/api/words')
        .then(r => r.json())
        .then(d => {
          const all: WordProg[] = d.data ?? [];
          const filtered = all.filter(w => targetIds.includes(w.word_id.toLowerCase()));
          setReviewWords(filtered);
          setLoading(false);
        });
    } else {
      fetch('/api/words/review')
        .then(r => r.json())
        .then(d => {
          setReviewWords(d.data ?? []);
          setLoading(false);
        });
    }
  }, [customWordsParam]);

  const speakWord = (word: string) => {
    playTTS(word, { voice: 'en-US-AriaNeural' });
  };

  const handleResult = (correct: boolean) => {
    const w = reviewWords[current];
    if (w) {
      // Non-blocking optimistic update for instant seamless transitions
      fetch('/api/words/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update', wordId: w.word_id, stage: 5, correct }),
      }).catch(err => console.error('Failed to update progress', err));
    }

    if (current + 1 >= reviewWords.length) {
      setDone(true);
    } else {
      setCurrent(c => c + 1);
      setShowMeaning(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#0b0f19]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-amber-50 dark:bg-amber-950/60 border border-amber-100 dark:border-amber-800/60 rounded-2xl flex items-center justify-center text-3xl animate-bounce-gentle">
            🔄
          </div>
          <div className="text-slate-500 dark:text-slate-400 font-bold text-sm">جاري تحميل جلسة المراجعة...</div>
        </div>
      </div>
    );
  }

  if (reviewWords.length === 0) {
    return (
      <div className="min-h-screen pb-28 md:pt-20 bg-[#f8fafc] dark:bg-[#0b0f19]">
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-emerald-50 dark:bg-emerald-950/60 rounded-3xl flex items-center justify-center text-4xl shadow-inner border border-emerald-100 dark:border-emerald-800/60">
            ✅
          </div>
          <h2 className="text-xl font-black text-slate-800 dark:text-white mb-2">لا توجد كلمات للمراجعة حالياً</h2>
          <p className="text-slate-400 dark:text-slate-400 text-xs mb-6 font-medium leading-relaxed">
            جميع كلماتك مراجعة ومحفوظة بنجاح! يمكنك تحديد كلمات معينة من بنك المفردات أو دراسة كلمات جديدة.
          </p>
          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => router.push('/vocabulary')}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 rounded-2xl font-bold text-xs shadow-md shadow-indigo-100 dark:shadow-indigo-950 active:scale-95"
            >
              الذهاب لبنك المفردات 📦
            </button>
            <button
              onClick={() => router.push('/learn')}
              className="w-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 py-3 rounded-2xl font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors active:scale-95"
            >
              متابعة الدروس 📖
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#f8fafc] dark:bg-[#0b0f19]">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-sm w-full bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-slate-100 dark:border-slate-800"
        >
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-tr from-amber-400 to-orange-500 text-white rounded-3xl flex items-center justify-center text-4xl shadow-xl shadow-orange-200 dark:shadow-orange-950">
            🎊
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-1">اكتملت المراجعة بنجاح!</h2>
          <p className="text-slate-400 dark:text-slate-400 text-xs mb-6 font-semibold">
            راجعت بنجاح {reviewWords.length} كلمة وعززت ثباتها في الذاكرة
          </p>
          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => { setDone(false); setCurrent(0); setShowMeaning(false); }}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3.5 rounded-2xl font-bold text-xs hover:from-amber-600 hover:to-orange-600 transition-all shadow-md shadow-orange-200 dark:shadow-orange-950 flex items-center justify-center gap-1.5 active:scale-95"
            >
              <RotateCcw size={15} />
              <span>إعادة مراجعة نفس الكلمات</span>
            </button>
            <button
              onClick={() => router.push('/vocabulary')}
              className="w-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 py-3 rounded-2xl font-bold text-xs hover:bg-purple-100 transition-colors active:scale-95"
            >
              العودة لبنك المفردات 📦
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const w = reviewWords[current];
  const wordData = getWord(w.word_id);
  const progressPct = ((current + 1) / reviewWords.length) * 100;

  return (
    <div className="min-h-screen pb-28 pt-16 md:pt-24 bg-[#f8fafc] dark:bg-[#0b0f19] flex flex-col items-center">
      <Navbar />
      <div className="w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl px-4 lg:px-8 py-4 lg:py-8">
        
        {/* Header */}
        <div className="mb-5 lg:mb-7">
          <div className="flex justify-between items-center text-xs lg:text-sm mb-2.5">
            <span className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 lg:gap-2">
              <span className="text-base lg:text-lg">🔄</span>
              <span>{customWordsParam ? 'مراجعة الكلمات المحددة' : 'المراجعة الذكية المجدولة'}</span>
            </span>
            <span className="font-bold text-amber-600 dark:text-amber-400">
              الكلمة {current + 1} من {reviewWords.length}
            </span>
          </div>
          <div className="h-2 lg:h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Word Flashcard */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.12 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 lg:p-12 text-center border border-slate-100 dark:border-slate-800 shadow-xl relative"
          >
            <span className={`text-[10px] lg:text-xs font-black px-2.5 py-0.5 lg:px-3 lg:py-1 rounded-md mb-4 inline-block ${getLevelColor(w.level)}`}>
              {w.level}
            </span>

            <div className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-800 dark:text-white mb-1.5 ltr tracking-tight">
              {w.word}
            </div>
            {wordData && (
              <div className="text-base lg:text-xl mb-6 lg:mb-8 ltr text-slate-400 dark:text-slate-400 font-mono font-bold">
                {wordData.phonetic}
              </div>
            )}
            
            <button
              onClick={() => speakWord(w.word)}
              title="استمع للنطق"
              className="w-16 h-16 lg:w-20 lg:h-20 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-600 dark:text-indigo-400 rounded-2xl lg:rounded-3xl flex items-center justify-center mx-auto mb-8 transition-all active:scale-95 shadow-xs border border-indigo-100 dark:border-indigo-800/60"
            >
              <Volume2 size={26} className="lg:w-8 lg:h-8" />
            </button>

            {!showMeaning ? (
              <button
                onClick={() => setShowMeaning(true)}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 lg:py-5 rounded-2xl font-black hover:from-indigo-700 hover:to-purple-700 active:scale-95 transition-all shadow-lg shadow-indigo-200 dark:shadow-indigo-950 text-sm lg:text-lg"
              >
                أظهر المعنى 👁️
              </button>
            ) : (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.12 }}>
                {wordData && (
                  <div className="bg-indigo-50/70 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-800/60 rounded-2xl lg:rounded-3xl p-5 lg:p-7 mb-6 text-center">
                    <div className="text-2xl lg:text-4xl font-black text-indigo-900 dark:text-indigo-200 mb-1.5">{wordData.meaningAr}</div>
                    <div className="text-xs lg:text-base text-slate-500 dark:text-slate-400 ltr leading-relaxed font-medium">{wordData.meaningEn}</div>
                  </div>
                )}
                <div className="flex gap-3 lg:gap-4">
                  <button
                    onClick={() => handleResult(false)}
                    className="flex-1 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-2 border-rose-200 dark:border-rose-800/60 py-3.5 lg:py-4.5 rounded-2xl font-black hover:bg-rose-100 transition-colors flex items-center justify-center gap-2 active:scale-95 text-xs md:text-sm lg:text-base"
                  >
                    <XCircle size={18} className="lg:w-5 lg:h-5" />
                    <span>لم أتذكر</span>
                  </button>
                  <button
                    onClick={() => handleResult(true)}
                    className="flex-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border-2 border-emerald-300 dark:border-emerald-800/60 py-3.5 lg:py-4.5 rounded-2xl font-black hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2 active:scale-95 text-xs md:text-sm lg:text-base"
                  >
                    <CheckCircle2 size={18} className="lg:w-5 lg:h-5" />
                    <span>تذكرت بنجاح</span>
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
}

export default function ReviewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#0b0f19]">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-amber-50 dark:bg-amber-950/60 border border-amber-100 dark:border-amber-800/60 rounded-2xl flex items-center justify-center text-3xl animate-bounce-gentle">
              🔄
            </div>
            <div className="text-slate-500 dark:text-slate-400 font-bold text-sm">جاري التحميل...</div>
          </div>
        </div>
      }
    >
      <ReviewContent />
    </Suspense>
  );
}
