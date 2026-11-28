'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import OnboardingScreen from '@/components/OnboardingScreen';
import LoadingScreen from '@/components/LoadingScreen';
import { getLevelLabel } from '@/lib/words';

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

const MOTIVATIONAL_PHRASES = [
  'كل كلمة جديدة تقرّبك من الطلاقة 🚀',
  'الاستمرارية هي سر النجاح في تعلم اللغات 💪',
  'أنت أقرب مما تظن لإتقان الإنجليزية ✨',
  'تعلّم كلمة واحدة يومياً = 365 كلمة سنوياً 🎯',
  'كل محادثة تخوضها تبني ثقتك بنفسك 🌟',
  'التكرار المتباعد يجعل الحفظ دائماً 🧠',
];

function getGreeting(): { text: string; emoji: string } {
  const hour = new Date().getHours();
  if (hour < 12) return { text: 'صباح الخير', emoji: '☀️' };
  if (hour < 17) return { text: 'مساء الخير', emoji: '🌤️' };
  return { text: 'مساء الخير', emoji: '🌙' };
}

function getDailyMotivation(): string {
  const today = new Date();
  const dayIndex = today.getDate() % MOTIVATIONAL_PHRASES.length;
  return MOTIVATIONAL_PHRASES[dayIndex];
}

// Animated counter component
function AnimatedNumber({ value, className }: { value: number | string; className?: string }) {
  return (
    <motion.span
      key={String(value)}
      initial={{ scale: 0.5, opacity: 0, y: 10 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: 'spring', damping: 15, stiffness: 300 }}
      className={className}
    >
      {value}
    </motion.span>
  );
}

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 18, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

const LEVEL_THRESHOLDS: Record<string, number> = {
  A1: 0,
  A2: 500,
  B1: 1500,
  B2: 3000,
  C1: 5000,
  C2: 8000,
};

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export default function Home() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [retakingTest, setRetakingTest] = useState(false);

  const [greeting, setGreeting] = useState({ text: 'أهلاً', emoji: '👋' });
  const [motivation, setMotivation] = useState('');

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

  // Daily quest progress (learn 5 new words today)
  const dailyGoal = 5;
  const dailyProgress = stats ? Math.min(stats.learnedWords % dailyGoal || (stats.learnedWords > 0 ? dailyGoal : 0), dailyGoal) : 0;
  const dailyComplete = dailyProgress >= dailyGoal;

  // Level threshold calculation
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

  // Not taken placement test yet — show immersive onboarding
  if (user && !user.placement_completed) {
    return <OnboardingScreen />;
  }

  return (
    <div className="min-h-screen pb-28 pt-0 md:pt-24 bg-[#f8fafc] dark:bg-[#0b0f19] page-ambient flex flex-col items-center">
      <Navbar />
      <main className="w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl px-4 lg:px-8 py-4 lg:py-8 relative z-10">
        
        {/* ── Time-Aware Greeting Header ── */}
        <div className="flex items-center justify-between gap-3 mb-5 lg:mb-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2.5 sm:gap-3.5"
          >
            <motion.span
              className="text-2xl sm:text-3xl lg:text-4xl select-none"
              animate={{ rotate: [0, 14, -8, 14, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
            >
              {greeting.emoji}
            </motion.span>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-800 dark:text-white tracking-tight">
                {greeting.text}!
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-400 font-medium line-clamp-1 mt-0.5">
                {motivation}
              </p>
            </div>
          </motion.div>

          {/* Quick Header Status & Discreet Test Reset */}
          <div className="flex items-center gap-2 flex-none">
            {stats && (
              <>
                <div
                  title={`سلسلة التزام ${stats.streak} يوم`}
                  className="flex items-center gap-1.5 bg-gradient-to-tr from-amber-500/10 to-orange-500/15 border border-amber-500/25 text-amber-600 dark:text-amber-400 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-black shadow-2xs"
                >
                  <Flame size={15} className="fill-amber-500 text-amber-500 animate-bounce-gentle" />
                  <span>{stats.streak}</span>
                  <span className="text-[10px] text-amber-500/80 font-bold hidden sm:inline">يوم</span>
                </div>

                <div
                  title={`إجمالي النقاط ${stats.xp} XP`}
                  className="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-black shadow-2xs"
                >
                  <Zap size={14} className="fill-indigo-500 text-indigo-500" />
                  <span>{stats.xp}</span>
                  <span className="text-[10px] text-indigo-400 font-bold hidden sm:inline">XP</span>
                </div>
              </>
            )}

            <button
              type="button"
              onClick={handleRetakePlacement}
              disabled={retakingTest}
              title="إعادة اختبار تحديد المستوى"
              className="p-2 sm:p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-2xs active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw size={14} className={retakingTest ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* ── Unified Hero Learning Card ── */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 dark:from-[#131b34] dark:via-[#161c38] dark:to-[#0f1426] border border-indigo-400/30 dark:border-indigo-500/25 p-5 sm:p-7 text-white shadow-2xl shadow-indigo-500/20 mb-5 lg:mb-6"
          >
            {/* Ambient Background Glows */}
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-white/10 dark:bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-purple-500/20 dark:bg-purple-500/25 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              {/* Top Bar of Hero: Level Badge & Status */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="inline-flex items-center gap-2 bg-white/15 dark:bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-xs sm:text-sm font-black">
                  <span className="text-base">🎯</span>
                  <span>المستوى {stats.level}</span>
                  <span className="w-1 h-1 rounded-full bg-white/40" />
                  <span className="text-white/80 font-medium text-xs">{getLevelLabel(stats.level)}</span>
                </div>

                <div className="text-[11px] sm:text-xs font-bold text-white/75 bg-black/20 dark:bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                  {nextLevel ? `المستوى التالي: ${nextLevel}` : 'المستوى الأقصى 🏆'}
                </div>
              </div>

              {/* Main Headline & Learner Stats */}
              <div className="mb-5">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight mb-1 text-white">
                  واصل رحلة إتقان الإنجليزية!
                </h2>
                <p className="text-xs sm:text-sm text-indigo-100/80 dark:text-slate-300 font-medium">
                  أتقنت <span className="font-bold text-white">{stats.masteredWords}</span> كلمة · ولديك <span className="font-bold text-white">{stats.learnedWords}</span> كلمة في حصيلتك اللغوية
                </p>
              </div>

              {/* XP Progress towards Next Goal */}
              <div className="mb-5 bg-black/20 dark:bg-black/35 backdrop-blur-md p-3 sm:p-3.5 rounded-2xl border border-white/10">
                <div className="flex justify-between items-center text-xs font-bold mb-1.5 text-white/90">
                  <span className="flex items-center gap-1.5">
                    <Zap size={13} className="text-amber-300 fill-amber-300" />
                    <span>{xpInCurrentLevel} XP في المستوى</span>
                  </span>
                  <span className="text-[11px] text-white/70">
                    {nextLevel ? `متبقي ${Math.max(0, nextThreshold - currentXP)} XP للترقية` : 'أعلى إنجاز متاح'}
                  </span>
                </div>

                {/* Progress Bar Track */}
                <div className="h-2 sm:h-2.5 bg-white/15 rounded-full overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${levelProgress}%` }}
                    transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
                    className="h-full bg-gradient-to-r from-amber-300 via-pink-400 to-indigo-300 rounded-full relative"
                  >
                    <div className="absolute inset-0 bg-white/25 animate-pulse" />
                  </motion.div>
                </div>
              </div>

              {/* Hero Action Row */}
              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
                <Link
                  href="/learn"
                  className="flex-1 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:opacity-95 text-white py-3.5 sm:py-4 px-6 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30 active:scale-95 transition-all btn-shimmer cursor-pointer"
                >
                  <span>متابعة مسار التعلم</span>
                  <ChevronLeft size={18} />
                </Link>

                {stats.reviewDue > 0 ? (
                  <Link
                    href="/review"
                    className="bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3.5 sm:py-4 px-5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 backdrop-blur-md cursor-pointer"
                  >
                    <RotateCcw size={16} />
                    <span>مراجعة الكلمات ({stats.reviewDue})</span>
                  </Link>
                ) : (
                  <Link
                    href="/roleplay"
                    className="bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3.5 sm:py-4 px-5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 backdrop-blur-md cursor-pointer"
                  >
                    <MessageSquare size={16} />
                    <span>محادثة AI (+30 XP)</span>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Daily Quest Card (Gamified & Sleek) ── */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className={`rounded-2xl p-4 sm:p-5 mb-5 lg:mb-6 border backdrop-blur-xl transition-all shadow-xs ${
              dailyComplete
                ? 'bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-500/30 dark:border-emerald-500/20'
                : 'bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-amber-500/30 dark:border-amber-500/20'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center shadow-md flex-none ${
                    dailyComplete
                      ? 'bg-gradient-to-tr from-emerald-500 to-teal-500 text-white'
                      : 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white'
                  }`}
                >
                  {dailyComplete ? <Trophy size={20} /> : <Target size={20} />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-sm sm:text-base text-slate-800 dark:text-white">
                      مهمة اليوم اليومية
                    </h3>
                    {dailyComplete && (
                      <span className="text-[10px] font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                        مكتملة ✨
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                    {dailyComplete
                      ? 'أحسنت! أنجزت هدفك اليومي وحصلت على +50 XP 🌟'
                      : `تعلم ${dailyGoal} كلمات جديدة اليوم لتحصل على +50 XP`}
                  </p>
                </div>
              </div>

              <div className="text-left flex-none">
                <div
                  className={`text-lg sm:text-xl font-black ${
                    dailyComplete ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                  }`}
                >
                  <AnimatedNumber value={dailyProgress} /> / {dailyGoal}
                </div>
                <div className="text-[10px] text-slate-400 font-bold">
                  {dailyComplete ? '100% تم الإنجاز' : `متبقي ${dailyGoal - dailyProgress}`}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 sm:h-2.5 rounded-full bg-slate-100 dark:bg-slate-800/80 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(dailyProgress / dailyGoal) * 100}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                className={`h-full rounded-full relative overflow-hidden ${
                  dailyComplete
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                    : 'bg-gradient-to-r from-amber-500 to-orange-400'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* ── 4 Stats Cards (Interactive Links) ── */}
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
              },
              {
                href: '/review',
                label: 'للمراجعة اليوم',
                value: stats.reviewDue,
                icon: '🔄',
                badge: stats.reviewDue > 0 ? 'متباعد (مطلوب)' : 'متباعد',
                accentBg: 'from-teal-500/10 to-emerald-500/5',
                border: 'border-teal-200/60 dark:border-teal-900/40 hover:border-teal-400 dark:hover:border-teal-600',
              },
              {
                href: '/stats',
                label: 'مجموع نقاطك',
                value: stats.xp,
                icon: '⚡',
                badge: 'XP الإجمالي',
                accentBg: 'from-amber-500/10 to-yellow-500/5',
                border: 'border-amber-200/60 dark:border-amber-900/40 hover:border-amber-400 dark:hover:border-amber-600',
              },
              {
                href: '/stats',
                label: 'سلسلة الالتزام',
                value: `${stats.streak} يوم`,
                icon: '🔥',
                badge: 'يومي',
                accentBg: 'from-orange-500/10 to-red-500/5',
                border: 'border-orange-200/60 dark:border-orange-900/40 hover:border-orange-400 dark:hover:border-orange-600',
                isStreak: true,
              },
            ].map((item, i) => (
              <motion.div key={item.label} variants={staggerItem}>
                <Link
                  href={item.href}
                  className={`block group rounded-2xl sm:rounded-3xl p-4 sm:p-5 border ${item.border} bg-white dark:bg-slate-900/80 bg-gradient-to-br ${item.accentBg} transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:scale-[0.98] ${
                    (item as any).isStreak && stats.streak > 0 ? 'streak-glow' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <span className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform duration-200">
                      {item.icon}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-300 bg-white/70 dark:bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-100 dark:border-slate-700/80">
                      <span>{item.badge}</span>
                      <ArrowUpRight size={11} className="opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight">
                    <AnimatedNumber value={item.value} />
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-400 dark:text-slate-400 mt-0.5">
                    {item.label}
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* ── Quick Navigation: 6 Balanced Gateways ── */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Compass size={18} className="text-indigo-600 dark:text-indigo-400" />
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
              {
                href: '/learn',
                emoji: '📖',
                title: 'وحدات التعلم',
                subtitle: 'دروس وكلمات مرتبة',
                gradient: 'from-indigo-600 to-blue-600',
                shadowColor: 'hover:shadow-indigo-500/20',
                badge: 'الرئيسي',
              },
              {
                href: '/learn',
                emoji: '✨',
                title: 'القصص التفاعلية',
                subtitle: 'تعلم بالسياق الممتع',
                gradient: 'from-teal-500 to-emerald-600',
                shadowColor: 'hover:shadow-teal-500/20',
                badge: 'جديد',
              },
              {
                href: '/roleplay',
                emoji: '🤖',
                title: 'محادثة AI',
                subtitle: 'تحدث مع شخصيات ذكية',
                gradient: 'from-purple-600 to-pink-600',
                shadowColor: 'hover:shadow-purple-500/20',
                badge: '+30 XP',
              },
              {
                href: '/review',
                emoji: '🔄',
                title: 'المراجعة اليومية',
                subtitle: stats && stats.reviewDue > 0 ? `${stats.reviewDue} كلمة بانتظارك` : 'تكرار متباعد',
                gradient: 'from-amber-500 to-orange-600',
                shadowColor: 'hover:shadow-amber-500/20',
                badge: stats && stats.reviewDue > 0 ? 'مطلوب' : 'مراجعة',
              },
              {
                href: '/vocabulary',
                emoji: '🗂️',
                title: 'بنك المفردات',
                subtitle: 'تصفح وفلترة الكلمات',
                gradient: 'from-violet-600 to-purple-700',
                shadowColor: 'hover:shadow-violet-500/20',
                badge: 'القاموس',
              },
              {
                href: '/stats',
                emoji: '📊',
                title: 'الإحصائيات والتحليلات',
                subtitle: 'معدل الدقة وتفاصيل أدائك',
                gradient: 'from-emerald-500 to-cyan-600',
                shadowColor: 'hover:shadow-emerald-500/20',
                badge: 'التقارير',
              },
            ].map((item) => (
              <motion.div key={item.title} variants={staggerItem}>
                <Link
                  href={item.href}
                  className={`block group rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-850 hover:shadow-lg ${item.shadowColor} hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.97]`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-tr ${item.gradient} text-white rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200`}
                    >
                      <span className="text-xl sm:text-2xl">{item.emoji}</span>
                    </div>
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
            ))}
          </motion.div>
        </div>

      </main>
    </div>
  );
}
