'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronRight,
  RefreshCw,
  BookOpen,
  BarChart2,
  Sparkles,
  RotateCcw,
  Archive,
  Flame,
  Award,
  ArrowUpRight,
  Zap,
  MessageSquare,
  Target,
  Trophy,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import XPBar from '@/components/XPBar';
import OnboardingScreen from '@/components/OnboardingScreen';
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
    transition: { staggerChildren: 0.08 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#0b0f19]">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 12 }}
            className="w-16 h-16 mx-auto mb-4 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-indigo-500/25"
          >
            📚
          </motion.div>
          <div className="text-slate-500 dark:text-slate-400 font-bold text-sm">جاري التحميل...</div>
        </div>
      </div>
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
        
        {/* ── Time-Aware Greeting ── */}
        <div className="flex items-center justify-between gap-3 mb-5 lg:mb-7">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 lg:gap-3">
              <motion.span
                className="text-2xl lg:text-4xl"
                animate={{ rotate: [0, 14, -8, 14, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
              >
                {greeting.emoji}
              </motion.span>
              <div>
                <h1 className="text-xl lg:text-3xl font-black text-slate-800 dark:text-white">
                  {greeting.text}!
                </h1>
                <p className="text-xs lg:text-base text-slate-400 dark:text-slate-400 mt-0.5">
                  {motivation}
                </p>
              </div>
            </div>
          </motion.div>

          <button
            onClick={handleRetakePlacement}
            disabled={retakingTest}
            title="إعادة اختبار تحديد المستوى لتحديث مستواك"
            className="flex items-center gap-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 px-3 py-1.5 lg:px-4 lg:py-2.5 rounded-xl text-xs lg:text-sm font-bold transition-all shadow-xs active:scale-95 disabled:opacity-50 flex-none"
          >
            <RefreshCw size={13} className={retakingTest ? 'animate-spin' : ''} />
            <span>إعادة الامتحان</span>
          </button>
        </div>

        {/* ── XP & Streak Bar ── */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 lg:mb-7"
          >
            <XPBar xp={stats.xp} streak={stats.streak} level={stats.level} />
          </motion.div>
        )}

        {/* ── Level Banner Card (Enhanced with gradient animation) ── */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 animate-gradient-shift p-5 lg:p-8 text-white shadow-lg shadow-indigo-500/20 mb-5 lg:mb-7"
          >
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3.5 lg:gap-5">
                <div className="w-14 h-14 lg:w-20 lg:h-20 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl lg:text-5xl shadow-inner border border-white/20">
                  🎯
                </div>
                <div>
                  <div className="text-xs lg:text-base text-white/75 font-semibold">المستوى التعليمي الحالي</div>
                  <div className="text-2xl lg:text-4xl font-black flex items-center gap-2 mt-0.5">
                    <span>{stats.level}</span>
                    <span className="text-xs lg:text-sm bg-white/20 px-2.5 py-0.5 rounded-full font-medium text-white/90">
                      {getLevelLabel(stats.level)}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href="/learn"
                className="bg-white text-indigo-700 hover:bg-indigo-50 px-4 py-2.5 lg:px-6 lg:py-3.5 rounded-xl text-xs lg:text-base font-extrabold transition-all flex items-center gap-1.5 shadow-md shadow-black/10 active:scale-95 btn-shimmer"
              >
                <span>متابعة التعلم</span>
                <ChevronRight size={14} className="lg:hidden" />
                <ChevronRight size={18} className="hidden lg:block" />
              </Link>
            </div>
          </motion.div>
        )}

        {/* ── Daily Quest Card (Gamified) ── */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className={`glass-card rounded-2xl p-4 lg:p-6 mb-5 lg:mb-7 border ${
              dailyComplete
                ? 'border-emerald-200 dark:border-emerald-800/50'
                : 'border-amber-200/60 dark:border-amber-800/40'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-9 h-9 lg:w-11 lg:h-11 rounded-xl flex items-center justify-center ${
                  dailyComplete
                    ? 'bg-gradient-to-tr from-emerald-500 to-emerald-600 text-white'
                    : 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white'
                } shadow-md`}>
                  {dailyComplete ? <Trophy size={18} /> : <Target size={18} />}
                </div>
                <div>
                  <h3 className="font-black text-sm lg:text-base text-slate-800 dark:text-white">
                    🎯 مهمة اليوم
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {dailyComplete ? 'أحسنت! أنجزت مهمة اليوم ✅' : `تعلم ${dailyGoal} كلمات جديدة`}
                  </p>
                </div>
              </div>
              <div className="text-left">
                <div className={`text-lg lg:text-xl font-black ${
                  dailyComplete ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                }`}>
                  <AnimatedNumber value={dailyProgress} /> / {dailyGoal}
                </div>
                <p className="text-[10px] lg:text-xs text-slate-400 font-bold">
                  {dailyComplete ? '🎉 مكتمل!' : '+50 XP عند الإنجاز'}
                </p>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-2.5 lg:h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(dailyProgress / dailyGoal) * 100}%` }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                className={`h-full rounded-full ${
                  dailyComplete
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                    : 'bg-gradient-to-r from-amber-500 to-orange-400'
                } relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* ── 4 Stats Cards (Animated) ── */}
        {stats && (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 gap-3.5 lg:gap-5 mb-5 lg:mb-7"
          >
            {[
              {
                label: 'كلمة تعلمتها',
                value: stats.learnedWords,
                icon: '📚',
                badge: 'مفردات',
                color: 'from-blue-500/10 to-indigo-500/5',
                borderColor: 'border-blue-100 dark:border-blue-900/40',
              },
              {
                label: 'للمراجعة اليوم',
                value: stats.reviewDue,
                icon: '🔄',
                badge: 'تكرار متباعد',
                color: 'from-teal-500/10 to-emerald-500/5',
                borderColor: 'border-teal-100 dark:border-teal-900/40',
              },
              {
                label: 'مجموع نقاطك',
                value: stats.xp,
                icon: '⭐',
                badge: 'XP',
                color: 'from-amber-500/10 to-yellow-500/5',
                borderColor: 'border-amber-100 dark:border-amber-900/40',
              },
              {
                label: 'سلسلة الالتزام',
                value: `${stats.streak} يوم`,
                icon: '🔥',
                badge: 'يومي',
                isStreak: true,
                color: 'from-orange-500/10 to-red-500/5',
                borderColor: 'border-orange-100 dark:border-orange-900/40',
              },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                variants={staggerItem}
                className={`glass-card card-3d rounded-2xl p-4 lg:p-6 border ${item.borderColor} bg-gradient-to-br ${item.color} transition-all ${
                  (item as any).isStreak && stats.streak > 0 ? 'streak-glow' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-2 lg:mb-3">
                  <motion.span
                    className="text-2xl lg:text-4xl"
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', damping: 10, delay: 0.1 * i }}
                  >
                    {item.icon}
                  </motion.span>
                  <span className="text-[10px] lg:text-xs font-bold text-slate-400 dark:text-slate-300 bg-white/60 dark:bg-slate-800/60 px-2 py-0.5 rounded-full border border-slate-100 dark:border-slate-700">
                    {item.badge}
                  </span>
                </div>
                <div className="text-xl lg:text-3xl font-black text-slate-800 dark:text-white">
                  <AnimatedNumber value={item.value} />
                </div>
                <div className="text-xs lg:text-sm font-semibold text-slate-400 dark:text-slate-400 mt-0.5">{item.label}</div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* ── Quick Actions: 2x2 Grid + Bottom Items ── */}
        <div className="space-y-3 lg:space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-extrabold text-sm lg:text-lg text-slate-700 dark:text-slate-300">الانتقال السريع</h2>
            <span className="text-xs lg:text-sm text-slate-400 dark:text-slate-500">اختر وجهتك</span>
          </div>

          {/* 2x2 Grid for primary actions */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 gap-3 lg:gap-4"
          >
            {[
              {
                href: '/learn',
                icon: BookOpen,
                emoji: '📖',
                title: 'وحدات التعلم',
                subtitle: 'دروس وكلمات مرتبة',
                gradient: 'from-indigo-600 to-blue-600',
                shadowColor: 'shadow-indigo-500/20',
                badge: 'الرئيسي',
              },
              {
                href: '/learn',
                icon: Sparkles,
                emoji: '✨',
                title: 'القصص التفاعلية',
                subtitle: 'تعلم بالسياق الممتع',
                gradient: 'from-teal-500 to-emerald-600',
                shadowColor: 'shadow-teal-500/20',
                badge: 'جديد',
              },
              {
                href: '/roleplay',
                icon: MessageSquare,
                emoji: '🤖',
                title: 'محادثة AI',
                subtitle: 'تحدث مع شخصيات ذكية',
                gradient: 'from-purple-600 to-pink-600',
                shadowColor: 'shadow-purple-500/20',
                badge: '+30 XP',
              },
              {
                href: stats && stats.reviewDue > 0 ? '/review' : '/review',
                icon: RotateCcw,
                emoji: '🔄',
                title: 'المراجعة اليومية',
                subtitle: stats && stats.reviewDue > 0 ? `${stats.reviewDue} كلمة بانتظارك` : 'راجع كلماتك',
                gradient: 'from-amber-500 to-orange-600',
                shadowColor: 'shadow-amber-500/20',
                badge: stats && stats.reviewDue > 0 ? 'هام' : 'مراجعة',
              },
            ].map((item, i) => (
              <motion.div key={item.title} variants={staggerItem}>
                <Link
                  href={item.href}
                  className={`glass-card card-3d block rounded-2xl lg:rounded-3xl p-4 lg:p-5 border border-white/60 dark:border-white/5 hover:shadow-lg ${item.shadowColor} transition-all group active:scale-[0.97]`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-11 h-11 lg:w-14 lg:h-14 bg-gradient-to-tr ${item.gradient} text-white rounded-xl lg:rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                      <span className="text-xl lg:text-2xl">{item.emoji}</span>
                    </div>
                    <span className="text-[9px] lg:text-[10px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="font-black text-sm lg:text-base text-slate-800 dark:text-white mb-0.5">{item.title}</h3>
                  <p className="text-[11px] lg:text-xs text-slate-500 dark:text-slate-400 font-medium">{item.subtitle}</p>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Secondary items (smaller) */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="space-y-2.5 lg:space-y-3"
          >
            <motion.div variants={staggerItem}>
              <Link
                href="/vocabulary"
                className="glass-card flex items-center gap-3.5 lg:gap-5 rounded-2xl p-3.5 lg:p-5 border border-white/60 dark:border-white/5 hover:shadow-md transition-all group active:scale-[0.99]"
              >
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform flex-none">
                  <Archive size={20} className="lg:hidden" />
                  <Archive size={24} className="hidden lg:block" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-800 dark:text-white text-sm lg:text-base">بنك المفردات</div>
                  <div className="text-xs lg:text-sm text-slate-400 dark:text-slate-400 mt-0.5">تصفح وفلترة كل الكلمات المخزنة</div>
                </div>
                <ChevronRight className="text-slate-300 dark:text-slate-600 group-hover:text-purple-500 transition-colors flex-none" size={18} />
              </Link>
            </motion.div>

            <motion.div variants={staggerItem}>
              <Link
                href="/stats"
                className="glass-card flex items-center gap-3.5 lg:gap-5 rounded-2xl p-3.5 lg:p-5 border border-white/60 dark:border-white/5 hover:shadow-md transition-all group active:scale-[0.99]"
              >
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform flex-none">
                  <BarChart2 size={20} className="lg:hidden" />
                  <BarChart2 size={24} className="hidden lg:block" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-800 dark:text-white text-sm lg:text-base">الإحصائيات والتحليلات</div>
                  <div className="text-xs lg:text-sm text-slate-400 dark:text-slate-400 mt-0.5">معدل الدقة وتفاصيل أدائك</div>
                </div>
                <ChevronRight className="text-slate-300 dark:text-slate-600 group-hover:text-emerald-500 transition-colors flex-none" size={18} />
              </Link>
            </motion.div>
          </motion.div>
        </div>

      </main>
    </div>
  );
}
