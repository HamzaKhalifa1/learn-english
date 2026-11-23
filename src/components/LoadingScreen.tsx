'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const LEARNING_TIPS = [
  '💡 حفظ 800 كلمة شائعة يمكّنك من فهم أكثر من 75% من المحادثات اليومية.',
  '🎯 استخدام الكلمة في جملة بصوت مسموع يرسخها في الذاكرة طويلة المدى.',
  '🚀 خوارزمية التكرار المتباعد تذكّرك بالكلمات في التوقيت العصبي المثالي.',
  '✨ 10 دقائق من التركيز اليومي أفضل من ساعات دراسة متقطعة في عطلة الأسبوع.',
  '🎧 الاستماع المتكرر للنطق الطبيعي يدرّب عقلك على التفكير بالإنجليزية.',
  '🌟 الخطأ أثناء الممارسة هو أسرع وأقوى طريقة لترسيخ الصواب.',
  '💬 التحدث بثقة لا يتطلب حفظ كل القواعد، بل الشجاعة في استخدام ما تعرفه.',
];

export interface LoadingScreenProps {
  message?: string;
  subtitle?: string;
  icon?: string;
  fullScreen?: boolean;
}

export default function LoadingScreen({
  message = 'جاري تحضير المحتوى...',
  subtitle = 'نجهز لك تجربة تعليمية سلسة وممتعة',
  icon = '✨',
  fullScreen = true,
}: LoadingScreenProps) {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    // Pick a random tip initially
    setTipIndex(Math.floor(Math.random() * LEARNING_TIPS.length));

    const interval = setInterval(() => {
      setTipIndex(prev => (prev + 1) % LEARNING_TIPS.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const content = (
    <div className="relative z-10 flex flex-col items-center justify-center px-6 max-w-md w-full text-center">
      {/* ── Central Animated Emblem ── */}
      <div className="relative mb-8 flex items-center justify-center">
        {/* Pulsing ambient glow backdrops */}
        <div className="absolute -inset-6 bg-gradient-to-r from-indigo-500/25 via-purple-500/25 to-pink-500/25 rounded-full blur-2xl animate-pulse" />
        <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-3xl opacity-20 blur-md" />

        {/* Orbit Ring 1 (Dashed slow clockwise spin) */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
          className="absolute w-28 h-28 rounded-full border-2 border-dashed border-indigo-400/30 dark:border-indigo-400/20 pointer-events-none"
        />

        {/* Orbit Ring 2 (Counter-clockwise gentle pulse) */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
          className="absolute w-24 h-24 rounded-full border border-purple-400/35 dark:border-purple-400/25 pointer-events-none flex items-center justify-start"
        >
          {/* Orbiting particle */}
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 shadow-[0_0_8px_rgba(236,72,153,0.8)]" />
        </motion.div>

        {/* Core Floating Glass Badge */}
        <motion.div
          animate={{
            y: [0, -6, 0],
            scale: [1, 1.03, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="relative w-20 h-20 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-[0_12px_40px_rgba(99,102,241,0.2)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.5)] flex items-center justify-center text-4xl select-none"
        >
          <span>{icon}</span>

          {/* Micro sparkle in corner */}
          <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-gradient-to-tr from-amber-400 to-amber-300 flex items-center justify-center shadow-md animate-bounce-gentle">
            <Sparkles size={12} className="text-white" />
          </div>
        </motion.div>
      </div>

      {/* ── Status Titles ── */}
      <motion.h3
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-lg md:text-xl font-black text-slate-800 dark:text-white tracking-tight mb-1"
      >
        {message}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-xs md:text-sm text-slate-400 dark:text-slate-400 font-medium mb-6"
      >
        {subtitle}
      </motion.p>

      {/* ── Modern Dynamic Gradient Shimmer Bar ── */}
      <div className="w-48 h-1.5 bg-slate-200/80 dark:bg-slate-800/80 rounded-full overflow-hidden relative mb-7 shadow-inner">
        <motion.div
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-1/2 h-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent rounded-full shadow-[0_0_12px_rgba(99,102,241,0.6)]"
        />
      </div>

      {/* ── Interactive Learning Trivia / Dynamic Tip ── */}
      <div className="w-full">
        <div className="glass-card rounded-2xl px-4 py-3 border border-indigo-100/70 dark:border-indigo-950/70 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 mb-1">
            <Sparkles size={12} />
            <span>معلومة تهمك</span>
          </div>

          <div className="min-h-[38px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={tipIndex}
                initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="text-xs font-semibold text-slate-600 dark:text-slate-300 leading-relaxed"
              >
                {LEARNING_TIPS[tipIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );

  if (!fullScreen) {
    return (
      <div className="w-full py-16 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc] dark:bg-[#0b0f19] page-ambient relative overflow-hidden select-none">
      {/* Decorative ambient background orbs */}
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      {content}
    </div>
  );
}
