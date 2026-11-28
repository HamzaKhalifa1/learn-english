'use client';
import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  RefreshCw,
  Flame,
  Zap,
  Target,
  Trophy,
  ArrowUpRight,
  Compass,
  RotateCcw,
  MessageSquare,
  Star,
  TrendingUp,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import OnboardingScreen from '@/components/OnboardingScreen';
import LoadingScreen from '@/components/LoadingScreen';
import { getLevelLabel } from '@/lib/words';

/* ═══════════════ Interfaces ═══════════════ */
interface Stats {
  totalWords: number;
  learnedWords: number;
  masteredWords: number;
  reviewDue: number;
  xp: number;
  streak: number;
  level: string;
}

interface User {
  name: string;
  level: string;
  xp: number;
  streak: number;
  placement_completed: number;
}

/* ═══════════════ Constants ═══════════════ */
const MOTIVATIONAL_PHRASES = [
  'كل كلمة جديدة تقرّبك من الطلاقة 🚀',
  'الاستمرارية هي سر النجاح في تعلم اللغات 💪',
  'أنت أقرب مما تظن لإتقان الإنجليزية ✨',
  'تعلّم كلمة واحدة يومياً = 365 كلمة سنوياً 🎯',
  'كل محادثة تخوضها تبني ثقتك بنفسك 🌟',
  'التكرار المتباعد يجعل الحفظ دائماً 🧠',
];

const LEVEL_THRESHOLDS: Record<string, number> = {
  A1: 0, A2: 500, B1: 1500, B2: 3000, C1: 5000, C2: 8000,
};
const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

/* ═══════════════ Helpers ═══════════════ */
function getGreeting(): { text: string; emoji: string } {
  const hour = new Date().getHours();
  if (hour < 12) return { text: 'صباح الخير', emoji: '☀️' };
  if (hour < 17) return { text: 'مساء الخير', emoji: '🌤️' };
  return { text: 'مساء الخير', emoji: '🌙' };
}

function getDailyMotivation(): string {
  const dayIndex = new Date().getDate() % MOTIVATIONAL_PHRASES.length;
  return MOTIVATIONAL_PHRASES[dayIndex];
}

/* ═══════════════ Counting Animated Number ═══════════════ */
function CountUp({ target, duration = 1.4, className }: { target: number; duration?: number; className?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      // ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);

  return <span ref={ref} className={className}>{count.toLocaleString('ar-SA')}</span>;
}

/* ═══════════════ Floating Particle Effect ═══════════════ */
function FloatingParticles() {
  const particles = useMemo(() => 
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      dur: Math.random() * 8 + 10,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.3 + 0.1,
    })), []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-indigo-400 dark:bg-indigo-300"
          style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%`, opacity: 0 }}
          animate={{
            y: [0, -40, 0],
            x: [0, (Math.random() - 0.5) * 30, 0],
            opacity: [0, p.opacity, 0],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

/* ═══════════════ 3D Tilt Card Hook ═══════════════ */
function useTilt3D(intensity = 8) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 200, damping: 20 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    rotateX.set(-y * intensity);
    rotateY.set(x * intensity);
  }, [intensity, rotateX, rotateY]);

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  return { ref, springX, springY, handleMouseMove, handleMouseLeave };
}

/* ═══════════════ Interactive Glow Spot (follows mouse) ═══════════════ */
function MouseGlowOverlay({ parentRef }: { parentRef: React.RefObject<HTMLDivElement | null> }) {
  const glowX = useMotionValue(0);
  const glowY = useMotionValue(0);
  const springGX = useSpring(glowX, { stiffness: 150, damping: 15 });
  const springGY = useSpring(glowY, { stiffness: 150, damping: 15 });

  useEffect(() => {
    const el = parentRef.current;
    if (!el) return;
    const handler = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      glowX.set(e.clientX - rect.left);
      glowY.set(e.clientY - rect.top);
    };
    el.addEventListener('mousemove', handler);
    return () => el.removeEventListener('mousemove', handler);
  }, [parentRef, glowX, glowY]);

  return (
    <motion.div
      className="absolute w-72 h-72 rounded-full pointer-events-none z-[1] mix-blend-soft-light"
      style={{
        x: springGX,
        y: springGY,
        translateX: '-50%',
        translateY: '-50%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 70%)',
      }}
    />
  );
}

/* ═══════════════ Stagger Variants ═══════════════ */
const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 22, scale: 0.95 },
  show: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

/* ═══════════════════════════════════════════════
   ███  MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════ */
export default function Home() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [retakingTest, setRetakingTest] = useState(false);

  const [greeting, setGreeting] = useState({ text: 'أهلاً', emoji: '👋' });
  const [motivation, setMotivation] = useState('');

  // Hero card ref for mouse glow
  const heroRef = useRef<HTMLDivElement>(null);

  // 3D tilt for hero
  const heroTilt = useTilt3D(5);

  useEffect(() => {
    setGreeting(getGreeting());
    setMotivation(getDailyMotivation());
  }, []);

  useEffect(() => {
    Promise.all([
      fetch('/api/stats', { cache: 'no-store' }).then(r => r.json()),
      fetch('/api/user', { cache: 'no-store' }).then(r => r.json()),
    ]).then(([s, u]) => {
      setStats(s.data);
      setUser(u.data);
      setLoading(false);
    });
  }, []);

  const handleRetakePlacement = async () => {
    const confirmed = window.confirm(
      'هل ترغب حقاً في إعادة اختبار تحديد المستوى؟\nسيتم تحديد مستواك من جديد وتحديث خطة تعلمك.'
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

  // Daily quest
  const dailyGoal = 5;
  const dailyProgress = stats ? Math.min(stats.learnedWords % dailyGoal || (stats.learnedWords > 0 ? dailyGoal : 0), dailyGoal) : 0;
  const dailyComplete = dailyProgress >= dailyGoal;

  // Level
  const userLevel = (stats?.level || 'A1').toUpperCase();
  const currentIdx = LEVELS.indexOf(userLevel);
  const nextLevel = LEVELS[currentIdx + 1];
  const currentThreshold = LEVEL_THRESHOLDS[userLevel] ?? 0;
  const nextThreshold = nextLevel ? LEVEL_THRESHOLDS[nextLevel] : currentThreshold + 1000;
  const currentXP = stats?.xp ?? 0;
  const xpInCurrentLevel = Math.max(0, currentXP - currentThreshold);
  const xpNeededForNext = nextThreshold - currentThreshold;
  const levelProgress = Math.min(100, Math.max(5, (xpInCurrentLevel / xpNeededForNext) * 100));

  if (loading) {
    return (
      <LoadingScreen
        message="جاري تحضير لوحة التعلم..."
        subtitle="نسترجع إحصائياتك ومستواك وكلماتك المجدولة"
        icon="🚀"
      />
    );
  }

  if (user && !user.placement_completed) {
    return <OnboardingScreen />;
  }

  return (
    <div className="min-h-screen pb-28 pt-0 md:pt-24 bg-[#f8fafc] dark:bg-[#0b0f19] page-ambient flex flex-col items-center relative">
      <FloatingParticles />
      <Navbar />

      <main className="w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl px-4 lg:px-8 py-4 lg:py-8 relative z-10">

        {/* ═══════════ GREETING HEADER ═══════════ */}
        <div className="flex items-center justify-between gap-3 mb-5 lg:mb-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-2.5 sm:gap-3.5"
          >
            <motion.span
              className="text-2xl sm:text-3xl lg:text-4xl select-none cursor-default"
              animate={{ rotate: [0, 14, -8, 14, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
              whileHover={{ scale: 1.3, rotate: 20 }}
              whileTap={{ scale: 0.8 }}
            >
              {greeting.emoji}
            </motion.span>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-800 dark:text-white tracking-tight">
                {greeting.text}!
              </h1>
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xs sm:text-sm text-slate-400 dark:text-slate-400 font-medium line-clamp-1 mt-0.5"
              >
                {motivation}
              </motion.p>
            </div>
          </motion.div>

          {/* Header Chips */}
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 flex-none"
          >
            {stats && (
              <>
                <motion.div
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  title={`سلسلة التزام ${stats.streak} يوم`}
                  className="flex items-center gap-1.5 bg-gradient-to-tr from-amber-500/10 to-orange-500/15 border border-amber-500/25 text-amber-600 dark:text-amber-400 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-black shadow-2xs cursor-default select-none"
                >
                  <Flame size={15} className="fill-amber-500 text-amber-500 animate-bounce-gentle" />
                  <span>{stats.streak}</span>
                  <span className="text-[10px] text-amber-500/80 font-bold hidden sm:inline">يوم</span>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  title={`إجمالي النقاط ${stats.xp} XP`}
                  className="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-black shadow-2xs cursor-default select-none"
                >
                  <Zap size={14} className="fill-indigo-500 text-indigo-500" />
                  <span>{stats.xp}</span>
                  <span className="text-[10px] text-indigo-400 font-bold hidden sm:inline">XP</span>
                </motion.div>
              </>
            )}

            <motion.button
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={handleRetakePlacement}
              disabled={retakingTest}
              title="إعادة اختبار تحديد المستوى"
              className="p-2 sm:p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shadow-2xs disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw size={14} className={retakingTest ? 'animate-spin' : ''} />
            </motion.button>
          </motion.div>
        </div>

        {/* ═══════════ HERO LEARNING CARD (3D Tilt + Mouse Glow) ═══════════ */}
        {stats && (
          <motion.div
            ref={(node) => {
              (heroTilt.ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
              (heroRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
            }}
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            onMouseMove={heroTilt.handleMouseMove}
            onMouseLeave={heroTilt.handleMouseLeave}
            style={{
              rotateX: heroTilt.springX,
              rotateY: heroTilt.springY,
              transformPerspective: 1000,
            }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 dark:from-[#131b34] dark:via-[#161c38] dark:to-[#0f1426] border border-indigo-400/30 dark:border-indigo-500/25 p-5 sm:p-7 text-white shadow-2xl shadow-indigo-500/20 mb-5 lg:mb-6 will-change-transform"
          >
            {/* Mouse-tracking glow */}
            <MouseGlowOverlay parentRef={heroRef} />

            {/* Ambient Background Glows */}
            <motion.div
              animate={{ x: [0, 15, 0], y: [0, -10, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-12 -left-12 w-56 h-56 bg-white/10 dark:bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"
            />
            <motion.div
              animate={{ x: [0, -15, 0], y: [0, 10, 0] }}
              transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-12 -right-12 w-56 h-56 bg-purple-500/20 dark:bg-purple-500/25 rounded-full blur-3xl pointer-events-none"
            />

            <div className="relative z-10">
              {/* Level Badge Row */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="inline-flex items-center gap-2 bg-white/15 dark:bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-xs sm:text-sm font-black"
                >
                  <motion.span
                    className="text-base"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    🎯
                  </motion.span>
                  <span>المستوى {stats.level}</span>
                  <span className="w-1 h-1 rounded-full bg-white/40" />
                  <span className="text-white/80 font-medium text-xs">{getLevelLabel(stats.level)}</span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-[11px] sm:text-xs font-bold text-white/75 bg-black/20 dark:bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/10"
                >
                  {nextLevel ? `المستوى التالي: ${nextLevel}` : 'المستوى الأقصى 🏆'}
                </motion.div>
              </div>

              {/* Headline */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mb-5"
              >
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight mb-1 text-white">
                  واصل رحلة إتقان الإنجليزية!
                </h2>
                <p className="text-xs sm:text-sm text-indigo-100/80 dark:text-slate-300 font-medium">
                  أتقنت <span className="font-bold text-white">{stats.masteredWords}</span> كلمة · ولديك <span className="font-bold text-white">{stats.learnedWords}</span> كلمة في حصيلتك اللغوية
                </p>
              </motion.div>

              {/* XP Progress */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="mb-5 bg-black/20 dark:bg-black/35 backdrop-blur-md p-3 sm:p-3.5 rounded-2xl border border-white/10"
              >
                <div className="flex justify-between items-center text-xs font-bold mb-1.5 text-white/90">
                  <span className="flex items-center gap-1.5">
                    <Zap size={13} className="text-amber-300 fill-amber-300" />
                    <span>{xpInCurrentLevel} XP في المستوى</span>
                  </span>
                  <span className="text-[11px] text-white/70">
                    {nextLevel ? `متبقي ${Math.max(0, nextThreshold - currentXP)} XP للترقية` : 'أعلى إنجاز متاح'}
                  </span>
                </div>

                <div className="h-2.5 sm:h-3 bg-white/15 rounded-full overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${levelProgress}%` }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                    className="h-full bg-gradient-to-r from-amber-300 via-pink-400 to-indigo-300 rounded-full relative"
                  >
                    <div className="absolute inset-0 bg-white/25 animate-pulse" />
                    {/* Glowing tip */}
                    <motion.div
                      className="absolute top-1/2 right-0 -translate-y-1/2 w-4 h-4 rounded-full bg-white/60 blur-sm"
                      animate={{ opacity: [0.5, 1, 0.5], scale: [0.8, 1.2, 0.8] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  </motion.div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="flex flex-col sm:flex-row gap-2.5 sm:gap-3"
              >
                <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.97 }} className="flex-1">
                  <Link
                    href="/learn"
                    className="w-full bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:opacity-95 text-white py-3.5 sm:py-4 px-6 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30 transition-all btn-shimmer cursor-pointer"
                  >
                    <span>متابعة مسار التعلم</span>
                    <ChevronLeft size={18} />
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }}>
                  {stats.reviewDue > 0 ? (
                    <Link
                      href="/review"
                      className="bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3.5 sm:py-4 px-5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all backdrop-blur-md cursor-pointer"
                    >
                      <RotateCcw size={16} />
                      <span>مراجعة الكلمات ({stats.reviewDue})</span>
                    </Link>
                  ) : (
                    <Link
                      href="/roleplay"
                      className="bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3.5 sm:py-4 px-5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all backdrop-blur-md cursor-pointer"
                    >
                      <MessageSquare size={16} />
                      <span>محادثة AI (+30 XP)</span>
                    </Link>
                  )}
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* ═══════════ DAILY QUEST ═══════════ */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            whileHover={{ scale: 1.01, y: -2 }}
            className={`rounded-2xl p-4 sm:p-5 mb-5 lg:mb-6 border backdrop-blur-xl transition-all shadow-xs cursor-default ${
              dailyComplete
                ? 'bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-500/30 dark:border-emerald-500/20'
                : 'bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-amber-500/30 dark:border-amber-500/20'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={dailyComplete ? { rotate: [0, -15, 15, 0], scale: [1, 1.15, 1] } : {}}
                  transition={{ duration: 0.6, repeat: dailyComplete ? Infinity : 0, repeatDelay: 4 }}
                  className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center shadow-md flex-none ${
                    dailyComplete
                      ? 'bg-gradient-to-tr from-emerald-500 to-teal-500 text-white'
                      : 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white'
                  }`}
                >
                  {dailyComplete ? <Trophy size={20} /> : <Target size={20} />}
                </motion.div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-sm sm:text-base text-slate-800 dark:text-white">
                      مهمة اليوم اليومية
                    </h3>
                    <AnimatePresence>
                      {dailyComplete && (
                        <motion.span
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="text-[10px] font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800"
                        >
                          مكتملة ✨
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                    {dailyComplete
                      ? 'أحسنت! أنجزت هدفك اليومي وحصلت على +50 XP 🌟'
                      : `تعلم ${dailyGoal} كلمات جديدة اليوم لتحصل على +50 XP`}
                  </p>
                </div>
              </div>

              <div className="text-left flex-none">
                <div className={`text-lg sm:text-xl font-black ${
                  dailyComplete ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                }`}>
                  {dailyProgress} / {dailyGoal}
                </div>
                <div className="text-[10px] text-slate-400 font-bold">
                  {dailyComplete ? '100% تم الإنجاز' : `متبقي ${dailyGoal - dailyProgress}`}
                </div>
              </div>
            </div>

            {/* Animated Progress Bar with dot markers */}
            <div className="relative w-full h-2.5 sm:h-3 rounded-full bg-slate-100 dark:bg-slate-800/80 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(dailyProgress / dailyGoal) * 100}%` }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                className={`h-full rounded-full relative overflow-hidden ${
                  dailyComplete
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                    : 'bg-gradient-to-r from-amber-500 to-orange-400'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </motion.div>
            </div>
            {/* Step markers */}
            <div className="flex justify-between mt-1.5 px-0.5">
              {Array.from({ length: dailyGoal }, (_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.08, type: 'spring' }}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    i < dailyProgress
                      ? dailyComplete ? 'bg-emerald-500' : 'bg-amber-500'
                      : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* ═══════════ 4 STATS CARDS (Animated Counters + Hover) ═══════════ */}
        {stats && (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 gap-3 sm:gap-4 mb-5 lg:mb-7"
          >
            {[
              {
                href: '/vocabulary',
                label: 'كلمة متعلمة',
                value: stats.learnedWords,
                icon: '📚',
                badge: 'بنك الكلمات',
                accentBg: 'from-blue-500/10 to-indigo-500/5',
                border: 'border-blue-200/60 dark:border-blue-900/40 hover:border-blue-400 dark:hover:border-blue-600',
                hoverGlow: 'hover:shadow-blue-500/15',
              },
              {
                href: '/review',
                label: 'للمراجعة اليوم',
                value: stats.reviewDue,
                icon: '🔄',
                badge: stats.reviewDue > 0 ? 'متباعد (مطلوب)' : 'متباعد',
                accentBg: 'from-teal-500/10 to-emerald-500/5',
                border: 'border-teal-200/60 dark:border-teal-900/40 hover:border-teal-400 dark:hover:border-teal-600',
                hoverGlow: 'hover:shadow-teal-500/15',
              },
              {
                href: '/stats',
                label: 'مجموع نقاطك',
                value: stats.xp,
                icon: '⚡',
                badge: 'XP الإجمالي',
                accentBg: 'from-amber-500/10 to-yellow-500/5',
                border: 'border-amber-200/60 dark:border-amber-900/40 hover:border-amber-400 dark:hover:border-amber-600',
                hoverGlow: 'hover:shadow-amber-500/15',
              },
              {
                href: '/stats',
                label: 'سلسلة الالتزام',
                value: stats.streak,
                displayValue: `${stats.streak} يوم`,
                icon: '🔥',
                badge: 'يومي',
                accentBg: 'from-orange-500/10 to-red-500/5',
                border: 'border-orange-200/60 dark:border-orange-900/40 hover:border-orange-400 dark:hover:border-orange-600',
                hoverGlow: 'hover:shadow-orange-500/15',
                isStreak: true,
              },
            ].map((item, i) => (
              <motion.div key={item.label} variants={staggerItem}>
                <motion.div
                  whileHover={{ scale: 1.03, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <Link
                    href={item.href}
                    className={`block group rounded-2xl sm:rounded-3xl p-4 sm:p-5 border ${item.border} bg-white dark:bg-slate-900/80 bg-gradient-to-br ${item.accentBg} transition-all duration-300 hover:shadow-xl ${item.hoverGlow} ${
                      item.isStreak && stats.streak > 0 ? 'streak-glow' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <motion.span
                        className="text-2xl sm:text-3xl"
                        whileHover={{ scale: 1.3, rotate: 10 }}
                        transition={{ type: 'spring', stiffness: 400 }}
                      >
                        {item.icon}
                      </motion.span>
                      <div className="flex items-center gap-1 text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-300 bg-white/70 dark:bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-100 dark:border-slate-700/80">
                        <span>{item.badge}</span>
                        <ArrowUpRight size={11} className="opacity-60 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight">
                      {item.isStreak ? (
                        <><CountUp target={item.value} /> <span className="text-base font-bold text-slate-500 dark:text-slate-400">يوم</span></>
                      ) : (
                        <CountUp target={item.value} />
                      )}
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-slate-400 dark:text-slate-400 mt-0.5">
                      {item.label}
                    </div>
                  </Link>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* ═══════════ QUICK NAV: 6 GATEWAYS ═══════════ */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3 sm:space-y-4"
        >
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <Compass size={18} className="text-indigo-600 dark:text-indigo-400" />
              </motion.div>
              <h2 className="font-black text-sm sm:text-base lg:text-lg text-slate-800 dark:text-slate-200">
                الانتقال السريع
              </h2>
            </div>
            <span className="text-xs text-slate-400 dark:text-slate-400 font-medium">
              بوابات التعلم الشاملة
            </span>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4"
          >
            {[
              { href: '/learn', emoji: '📖', title: 'وحدات التعلم', subtitle: 'دروس وكلمات مرتبة', gradient: 'from-indigo-600 to-blue-600', shadowColor: 'hover:shadow-indigo-500/20', badge: 'الرئيسي' },
              { href: '/learn', emoji: '✨', title: 'القصص التفاعلية', subtitle: 'تعلم بالسياق الممتع', gradient: 'from-teal-500 to-emerald-600', shadowColor: 'hover:shadow-teal-500/20', badge: 'جديد' },
              { href: '/roleplay', emoji: '🤖', title: 'محادثة AI', subtitle: 'تحدث مع شخصيات ذكية', gradient: 'from-purple-600 to-pink-600', shadowColor: 'hover:shadow-purple-500/20', badge: '+30 XP' },
              { href: '/review', emoji: '🔄', title: 'المراجعة اليومية', subtitle: stats && stats.reviewDue > 0 ? `${stats.reviewDue} كلمة بانتظارك` : 'تكرار متباعد', gradient: 'from-amber-500 to-orange-600', shadowColor: 'hover:shadow-amber-500/20', badge: stats && stats.reviewDue > 0 ? 'مطلوب' : 'مراجعة' },
              { href: '/vocabulary', emoji: '🗂️', title: 'بنك المفردات', subtitle: 'تصفح وفلترة الكلمات', gradient: 'from-violet-600 to-purple-700', shadowColor: 'hover:shadow-violet-500/20', badge: 'القاموس' },
              { href: '/stats', emoji: '📊', title: 'الإحصائيات والتحليلات', subtitle: 'معدل الدقة وتفاصيل أدائك', gradient: 'from-emerald-500 to-cyan-600', shadowColor: 'hover:shadow-emerald-500/20', badge: 'التقارير' },
            ].map((item) => (
              <motion.div key={item.title} variants={staggerItem}>
                <motion.div
                  whileHover={{ scale: 1.04, y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <Link
                    href={item.href}
                    className={`block group rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-850 hover:shadow-xl ${item.shadowColor} transition-all duration-200 active:scale-[0.97]`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <motion.div
                        whileHover={{ scale: 1.15, rotate: -5 }}
                        transition={{ type: 'spring', stiffness: 400 }}
                        className={`w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-tr ${item.gradient} text-white rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow`}
                      >
                        <span className="text-xl sm:text-2xl">{item.emoji}</span>
                      </motion.div>
                      <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-100 dark:border-indigo-800/60 px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    </div>
                    <h3 className="font-black text-sm sm:text-base text-slate-800 dark:text-white mb-0.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-400 font-medium line-clamp-1">
                      {item.subtitle}
                    </p>
                  </Link>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

      </main>
    </div>
  );
}
