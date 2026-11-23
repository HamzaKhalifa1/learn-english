'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Zap,
  Flame,
  Bot,
  Star,
  BookOpen,
  Award,
  CheckCircle2,
  Clock,
  Compass,
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

interface OnboardingScreenProps {
  className?: string;
}

export default function OnboardingScreen({ className = '' }: OnboardingScreenProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [direction, setDirection] = useState<number>(1);

  const goToStep = (nextStep: 1 | 2 | 3) => {
    setDirection(nextStep > step ? 1 : -1);
    setStep(nextStep);
  };

  const handleNext = () => {
    if (step < 3) {
      goToStep((step + 1) as 1 | 2 | 3);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      goToStep((step - 1) as 1 | 2 | 3);
    }
  };

  // Transition variants for screen switching
  const pageVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 40 : -40,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -40 : 40,
      opacity: 0,
      scale: 0.98,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 1, 1] as [number, number, number, number],
      },
    }),
  };

  // Feature cards data for Screen 2
  const features = [
    {
      id: 'gamification',
      emoji: '📚',
      title: 'تعلم بطريقة اللعب',
      description: 'اكسب نقاط XP ومكافآت مع كل كلمة جديدة',
      tag: 'تحفيز مستمر',
      accent: 'from-amber-500/20 via-orange-500/10 to-transparent',
      borderColor: 'border-amber-500/20 dark:border-amber-400/20',
      badgeBg: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
      iconGlow: 'shadow-amber-500/20',
    },
    {
      id: 'ai-chat',
      emoji: '🎭',
      title: 'تحدث مع شخصيات ذكية',
      description: 'محادثات AI واقعية لتدريب النطق والثقة',
      tag: 'تحدث حقيقي',
      accent: 'from-purple-500/20 via-indigo-500/10 to-transparent',
      borderColor: 'border-purple-500/20 dark:border-purple-400/20',
      badgeBg: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300',
      iconGlow: 'shadow-purple-500/20',
    },
    {
      id: 'stories',
      emoji: '📖',
      title: 'قصص تفاعلية',
      description: 'اقرأ قصصاً ممتعة وتعلم كلمات جديدة بالسياق',
      tag: 'سياق واقعي',
      accent: 'from-emerald-500/20 via-teal-500/10 to-transparent',
      borderColor: 'border-emerald-500/20 dark:border-emerald-400/20',
      badgeBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
      iconGlow: 'shadow-emerald-500/20',
    },
  ];

  return (
    <div
      className={`min-h-screen w-full relative overflow-hidden flex flex-col justify-between bg-slate-50 dark:bg-[#0b0f19] page-ambient text-slate-800 dark:text-slate-100 transition-colors duration-300 select-none ${className}`}
      dir="rtl"
    >
      {/* ── Background Ambient Blobs & Floating Shapes ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Animated ambient blob 1 */}
        <div className="absolute -top-32 -right-32 w-96 h-96 sm:w-[480px] sm:h-[480px] rounded-full bg-gradient-to-br from-indigo-500/25 via-purple-500/20 to-transparent blur-3xl animate-blob-1" />

        {/* Animated ambient blob 2 */}
        <div className="absolute -bottom-32 -left-32 w-96 h-96 sm:w-[480px] sm:h-[480px] rounded-full bg-gradient-to-tr from-pink-500/25 via-rose-500/20 to-transparent blur-3xl animate-blob-2" />

        {/* Centered soft radial highlight */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-[130px]" />

        {/* Floating subtle English vocabulary badges in the backdrop */}
        <motion.div
          animate={{ y: [0, -14, 0], rotate: [0, 4, -4, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-24 left-[10%] opacity-20 dark:opacity-15 hidden sm:block"
        >
          <span className="font-mono text-xs sm:text-sm px-3 py-1.5 rounded-full border border-indigo-400/40 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300">
            Hello! ✨
          </span>
        </motion.div>

        <motion.div
          animate={{ y: [0, 16, 0], rotate: [0, -3, 3, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-40 right-[8%] opacity-20 dark:opacity-15 hidden sm:block"
        >
          <span className="font-mono text-xs sm:text-sm px-3 py-1.5 rounded-full border border-purple-400/40 bg-purple-50/50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300">
            Fluent 🚀
          </span>
        </motion.div>

        <motion.div
          animate={{ y: [0, -12, 0], rotate: [0, 5, -3, 0] }}
          transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-32 right-[12%] opacity-20 dark:opacity-15 hidden sm:block"
        >
          <span className="font-mono text-xs sm:text-sm px-3 py-1.5 rounded-full border border-emerald-400/40 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
            Level A1 ➔ C2 ⭐
          </span>
        </motion.div>

        <motion.div
          animate={{ y: [0, 14, 0], rotate: [0, -4, 4, 0] }}
          transition={{ duration: 8.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="absolute bottom-36 left-[14%] opacity-20 dark:opacity-15 hidden sm:block"
        >
          <span className="font-mono text-xs sm:text-sm px-3 py-1.5 rounded-full border border-amber-400/40 bg-amber-50/50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300">
            Daily Streak 🔥
          </span>
        </motion.div>
      </div>

      {/* ── Top Header Bar ── */}
      <header className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 pt-5 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
            <Sparkles size={18} className="animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-sm sm:text-base tracking-tight text-slate-900 dark:text-white">
              تعلّم الإنجليزية
            </span>
            <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-mono -mt-1">
              English Master
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {step < 3 && (
            <button
              onClick={() => goToStep(3)}
              className="text-xs sm:text-sm font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
            >
              تخطي إلى الاختبار
            </button>
          )}
          <ThemeToggle />
        </div>
      </header>

      {/* ── Main Dynamic Stage Content ── */}
      <main className="relative z-10 w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 flex flex-col justify-center items-center">
        <AnimatePresence mode="wait" custom={direction}>
          {/* ════════════ SCREEN 1: WELCOME ════════════ */}
          {step === 1 && (
            <motion.div
              key="step-1"
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full flex flex-col items-center text-center max-w-xl mx-auto"
            >
              {/* Badge above title */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/60 text-indigo-600 dark:text-indigo-400 text-xs sm:text-sm font-bold mb-6 shadow-xs"
              >
                <Sparkles size={14} className="text-indigo-500" />
                <span>الجيل الجديد من منصات تعلم اللغات</span>
              </motion.div>

              {/* Large Animated Greeting: "مرحباً! 👋" */}
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center justify-center gap-3 mb-3"
              >
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tight">
                  مرحباً!
                </h1>
                <motion.span
                  animate={{ rotate: [0, 18, -10, 18, -4, 12, 0] }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    repeatDelay: 2,
                    ease: 'easeInOut',
                  }}
                  className="inline-block text-4xl sm:text-6xl md:text-7xl origin-bottom-right"
                >
                  👋
                </motion.span>
              </motion.div>

              {/* Subtitle: "رحلتك لإتقان الإنجليزية تبدأ الآن" */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-lg sm:text-2xl text-slate-600 dark:text-slate-300 font-medium max-w-md mx-auto leading-relaxed mb-10"
              >
                رحلتك لإتقان الإنجليزية تبدأ الآن
              </motion.p>

              {/* Big Pulsing Button with Shimmer: "ابدأ الآن →" */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="relative group mb-14"
              >
                {/* Glow ring under the button */}
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 opacity-60 blur-lg group-hover:opacity-100 transition duration-300 animate-pulse-soft" />

                <button
                  onClick={handleNext}
                  className="relative flex items-center justify-center gap-3 px-8 sm:px-12 py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white font-black text-lg sm:text-xl shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer btn-shimmer"
                >
                  <span>ابدأ الآن →</span>
                </button>
              </motion.div>

              {/* 3 Small Floating Feature Pills at Bottom */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="w-full flex flex-wrap items-center justify-center gap-3 sm:gap-4"
              >
                {/* Pill 1: ⭐ نقاط XP */}
                <motion.div
                  animate={{ y: [0, -7, 0] }}
                  transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
                  className="glass-card flex items-center gap-2 px-4 py-2.5 rounded-full border border-amber-500/25 dark:border-amber-400/25 bg-amber-50/70 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 shadow-sm shadow-amber-500/10 font-bold text-xs sm:text-sm"
                >
                  <span className="text-base">⭐</span>
                  <span>نقاط XP</span>
                </motion.div>

                {/* Pill 2: 🔥 سلسلة يومية */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                  className="glass-card flex items-center gap-2 px-4 py-2.5 rounded-full border border-rose-500/25 dark:border-rose-400/25 bg-rose-50/70 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 shadow-sm shadow-rose-500/10 font-bold text-xs sm:text-sm"
                >
                  <span className="text-base">🔥</span>
                  <span>سلسلة يومية</span>
                </motion.div>

                {/* Pill 3: 🤖 محادثات AI */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
                  className="glass-card flex items-center gap-2 px-4 py-2.5 rounded-full border border-indigo-500/25 dark:border-indigo-400/25 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 shadow-sm shadow-indigo-500/10 font-bold text-xs sm:text-sm"
                >
                  <span className="text-base">🤖</span>
                  <span>محادثات AI</span>
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {/* ════════════ SCREEN 2: FEATURES ════════════ */}
          {step === 2 && (
            <motion.div
              key="step-2"
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-xl mx-auto flex flex-col items-center"
            >
              {/* Header */}
              <div className="text-center mb-6 sm:mb-8">
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-100 dark:border-purple-800/60 text-purple-600 dark:text-purple-400 text-xs font-bold mb-2 shadow-xs"
                >
                  <Sparkles size={13} />
                  <span>طريقة أذكى وأسرع للتعلم</span>
                </motion.div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-2">
                  مميزات مصممة لنجاحك
                </h2>
                <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium">
                  كل أداة تحتاجها لاكتساب المفردات والطلاقة بثقة
                </p>
              </div>

              {/* 3 Animated Feature Cards (Staggered) */}
              <motion.div
                initial="hidden"
                animate="show"
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.14,
                    },
                  },
                }}
                className="w-full flex flex-col gap-3.5 sm:gap-4 mb-7"
              >
                {features.map((feature, idx) => (
                  <motion.div
                    key={feature.id}
                    variants={{
                      hidden: { opacity: 0, y: 22, scale: 0.97 },
                      show: {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
                      },
                    }}
                    whileHover={{ scale: 1.015, transition: { duration: 0.2 } }}
                    className={`glass-card relative p-4 sm:p-5 rounded-2xl sm:rounded-3xl border ${feature.borderColor} overflow-hidden shadow-sm hover:shadow-md transition-all group`}
                  >
                    {/* Background gradient wash */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${feature.accent} opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none`}
                    />

                    <div className="relative z-10 flex items-start gap-4">
                      {/* Emoji Icon Badge */}
                      <div
                        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/80 shadow-md ${feature.iconGlow} shrink-0 group-hover:scale-105 transition-transform`}
                      >
                        {feature.emoji}
                      </div>

                      {/* Card Content */}
                      <div className="flex-1 min-w-0 text-right">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white">
                            {feature.title}
                          </h3>
                          <span
                            className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full ${feature.badgeBg}`}
                          >
                            {feature.tag}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Action Buttons: التالي → & السابق */}
              <div className="w-full flex items-center gap-3">
                <button
                  onClick={handlePrev}
                  className="px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-1 active:scale-95"
                  title="الرجوع للخطوة السابقة"
                >
                  <ChevronRight size={18} />
                  <span>السابق</span>
                </button>

                <button
                  onClick={handleNext}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 sm:py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-base sm:text-lg shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer btn-shimmer"
                >
                  <span>التالي →</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* ════════════ SCREEN 3: START TEST ════════════ */}
          {step === 3 && (
            <motion.div
              key="step-3"
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-lg mx-auto"
            >
              <div className="glass-card relative p-7 sm:p-9 rounded-3xl border border-white/80 dark:border-white/10 shadow-2xl shadow-indigo-500/10 dark:shadow-black/40 text-center overflow-hidden">
                {/* Subtle top gradient accent */}
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

                {/* Animated Graduation Icon (🎓) */}
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.1 }}
                  className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-5"
                >
                  {/* Glowing ring pulse */}
                  <div className="absolute inset-0 rounded-3xl bg-indigo-500/30 dark:bg-indigo-500/40 animate-ping opacity-75 pointer-events-none" />

                  {/* Icon box */}
                  <div className="relative w-full h-full rounded-3xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-4xl sm:text-5xl shadow-xl shadow-indigo-500/35 text-white">
                    <motion.span
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                      className="inline-block"
                    >
                      🎓
                    </motion.span>
                  </div>
                </motion.div>

                {/* Headline: "خلنا نعرف مستواك! ⚡" */}
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-2"
                >
                  خلنا نعرف مستواك! ⚡
                </motion.h2>

                {/* Description: "اختبار قصير يستغرق 3 دقائق فقط لنحدد المستوى الأنسب لك" */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.28 }}
                  className="text-slate-600 dark:text-slate-300 text-sm sm:text-base mb-6 leading-relaxed font-medium"
                >
                  اختبار قصير يستغرق 3 دقائق فقط لنحدد المستوى الأنسب لك
                </motion.p>

                {/* Quick Info Badges */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.35 }}
                  className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 mb-7 text-xs font-bold"
                >
                  <div className="flex flex-col items-center gap-1 py-1">
                    <Clock size={16} className="text-indigo-500" />
                    <span className="text-slate-700 dark:text-slate-200">3 دقائق</span>
                    <span className="text-[10px] text-slate-400 font-normal">سريع ومرن</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 py-1 border-x border-slate-200 dark:border-slate-700/60">
                    <Compass size={16} className="text-purple-500" />
                    <span className="text-slate-700 dark:text-slate-200">A1 إلى C2</span>
                    <span className="text-[10px] text-slate-400 font-normal">معيار دولي</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 py-1">
                    <Zap size={16} className="text-amber-500" />
                    <span className="text-slate-700 dark:text-slate-200">مسار مخصص</span>
                    <span className="text-[10px] text-slate-400 font-normal">بدقة فائقة</span>
                  </div>
                </motion.div>

                {/* Big CTA Button: "ابدأ اختبار تحديد المستوى →" */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.42 }}
                  className="w-full relative group mb-3"
                >
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 opacity-60 blur-lg group-hover:opacity-100 transition duration-300" />

                  <Link
                    href="/placement-test"
                    className="relative w-full inline-flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white font-black text-base sm:text-lg shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all btn-shimmer"
                  >
                    <span>ابدأ اختبار تحديد المستوى →</span>
                  </Link>
                </motion.div>

                {/* Small Reassurance Text: "لا تقلق، يمكنك إعادته لاحقاً" */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-xs text-slate-400 dark:text-slate-500 font-medium"
                >
                  لا تقلق، يمكنك إعادته لاحقاً
                </motion.p>
              </div>

              {/* Back to Features button */}
              <div className="mt-4 text-center">
                <button
                  onClick={handlePrev}
                  className="text-xs sm:text-sm font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 inline-flex items-center gap-1 px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                >
                  <ChevronRight size={16} />
                  <span>العودة للمميزات</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── Bottom Progress Indicator ── */}
      <footer className="relative z-10 w-full max-w-md mx-auto px-4 pb-6 pt-2 flex flex-col items-center gap-2.5">
        {/* Step Indicator Dots */}
        <div className="flex items-center gap-2">
          {([1, 2, 3] as const).map((s) => (
            <button
              key={s}
              onClick={() => goToStep(s)}
              aria-label={`الانتقال إلى الخطوة ${s}`}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                step === s
                  ? 'w-8 bg-gradient-to-r from-indigo-600 to-purple-600 shadow-sm shadow-indigo-500/30'
                  : 'w-2.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'
              }`}
            />
          ))}
        </div>

        {/* Step Text Label */}
        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 tracking-wider">
          خطوة {step} من 3
        </span>
      </footer>
    </div>
  );
}
