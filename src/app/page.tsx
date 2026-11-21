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
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import XPBar from '@/components/XPBar';
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

export default function Home() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [retakingTest, setRetakingTest] = useState(false);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#0b0f19]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/60 rounded-2xl flex items-center justify-center text-3xl animate-bounce-gentle">
            📚
          </div>
          <div className="text-slate-500 dark:text-slate-400 font-bold text-sm">جاري التحميل...</div>
        </div>
      </div>
    );
  }

  // Not taken placement test yet
  if (user && !user.placement_completed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50/60 via-white to-purple-50/60 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-xl text-center"
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-3xl flex items-center justify-center text-4xl shadow-lg shadow-indigo-200 dark:shadow-indigo-950 text-white">
            🎓
          </div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white mb-2">مرحباً بك في رحلة التعلم!</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed">
            قبل أن تبدأ، سنحدد مستواك الحقيقي في الإنجليزية لنضع لك مساراً مخصصاً يتناسب مع قدراتك بدقة.
          </p>
          <Link
            href="/placement-test"
            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3.5 rounded-2xl font-bold text-base hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-indigo-950 active:scale-95"
          >
            <span>ابدأ اختبار تحديد المستوى</span>
            <ChevronRight size={18} />
          </Link>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-4 flex items-center justify-center gap-1">
            <span>⚡ مدة الاختبار: 3 إلى 5 دقائق فقط</span>
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28 pt-4 md:pt-24 bg-[#f8fafc] dark:bg-[#0b0f19] flex flex-col items-center">
      <Navbar />
      <main className="w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl px-4 lg:px-8 py-5 lg:py-8">
        
        {/* Top Header Card */}
        <div className="flex items-center justify-between mb-5 lg:mb-7">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-2 lg:gap-3">
              <span className="text-2xl lg:text-4xl">👋</span>
              <div>
                <h1 className="text-xl lg:text-3xl font-black text-slate-800 dark:text-white">أهلاً بك مجدداً!</h1>
                <p className="text-xs lg:text-base text-slate-400 dark:text-slate-400 mt-0.5">واصل تقدمك اليومي خطوة بخطوة</p>
              </div>
            </div>
          </motion.div>

          <button
            onClick={handleRetakePlacement}
            disabled={retakingTest}
            title="إعادة اختبار تحديد المستوى لتحديث مستواك"
            className="flex items-center gap-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 px-3 py-1.5 lg:px-4 lg:py-2.5 rounded-xl text-xs lg:text-sm font-bold transition-all shadow-xs active:scale-95 disabled:opacity-50"
          >
            <RefreshCw size={13} className={retakingTest ? 'animate-spin' : ''} />
            <span>إعادة الامتحان</span>
          </button>
        </div>

        {/* XP & Streak Bar */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 lg:mb-7"
          >
            <XPBar xp={stats.xp} streak={stats.streak} level={stats.level} />
          </motion.div>
        )}

        {/* Level Banner Card */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 p-5 lg:p-8 text-white shadow-lg shadow-indigo-500/20 mb-6 lg:mb-8"
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
                className="bg-white text-indigo-700 hover:bg-indigo-50 px-4 py-2.5 lg:px-6 lg:py-3.5 rounded-xl text-xs lg:text-base font-extrabold transition-all flex items-center gap-1.5 shadow-md shadow-black/10 active:scale-95"
              >
                <span>متابعة التعلم</span>
                <ChevronRight size={14} className="lg:hidden" />
                <ChevronRight size={18} className="hidden lg:block" />
              </Link>
            </div>
          </motion.div>
        )}

        {/* 4 Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 gap-3.5 lg:gap-5 mb-6 lg:mb-8">
            {[
              {
                label: 'كلمة تعلمتها',
                value: stats.learnedWords,
                icon: '📚',
                badge: 'مفردات',
              },
              {
                label: 'للمراجعة اليوم',
                value: stats.reviewDue,
                icon: '🔄',
                badge: 'تكرار متباعد',
              },
              {
                label: 'مجموع نقاطك',
                value: stats.xp,
                icon: '⭐',
                badge: 'XP',
              },
              {
                label: 'سلسلة الالتزام',
                value: `${stats.streak} يوم`,
                icon: '🔥',
                badge: 'يومي',
              },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05 * i }}
                className="bg-white dark:bg-slate-900 rounded-2xl p-4 lg:p-6 border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between mb-2 lg:mb-3">
                  <span className="text-2xl lg:text-4xl">{item.icon}</span>
                  <span className="text-[10px] lg:text-xs font-bold text-slate-400 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-100 dark:border-slate-700">
                    {item.badge}
                  </span>
                </div>
                <div className="text-xl lg:text-3xl font-black text-slate-800 dark:text-white">{item.value}</div>
                <div className="text-xs lg:text-sm font-semibold text-slate-400 dark:text-slate-400 mt-0.5">{item.label}</div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Action Hub */}
        <div className="space-y-3 lg:space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-extrabold text-sm lg:text-lg text-slate-700 dark:text-slate-300">الانتقال السريع</h2>
            <span className="text-xs lg:text-sm text-slate-400 dark:text-slate-500">اختر وجهتك</span>
          </div>

          <div className="space-y-3 lg:space-y-4">
            <Link
              href="/learn"
              className="flex items-center gap-3.5 lg:gap-5 bg-white dark:bg-slate-900 rounded-2xl p-4 lg:p-6 shadow-sm hover:shadow-md border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-700 transition-all group active:scale-[0.99]"
            >
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-tr from-indigo-500 to-indigo-600 text-white rounded-xl flex items-center justify-center shadow-md shadow-indigo-100 dark:shadow-indigo-950 group-hover:scale-105 transition-transform flex-none">
                <BookOpen size={22} className="lg:hidden" />
                <BookOpen size={30} className="hidden lg:block" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-slate-800 dark:text-white text-sm lg:text-lg flex items-center gap-1.5">
                  <span>وحدات الدروس والكلمات</span>
                  <span className="text-[10px] lg:text-xs bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded-full font-bold">الرئيسي</span>
                </div>
                <div className="text-xs lg:text-base text-slate-400 dark:text-slate-400 mt-0.5">وحدات مرتبة حسب مستواك مع اختبارات سريعة</div>
              </div>
              <ChevronRight className="text-slate-300 dark:text-slate-600 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex-none" size={18} />
            </Link>

            <Link
              href="/learn"
              className="flex items-center gap-3.5 lg:gap-5 bg-white dark:bg-slate-900 rounded-2xl p-4 lg:p-6 shadow-sm hover:shadow-md border border-teal-100 dark:border-teal-900/50 hover:border-teal-300 dark:hover:border-teal-700 transition-all group active:scale-[0.99]"
            >
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-tr from-teal-500 to-emerald-500 text-white rounded-xl flex items-center justify-center shadow-md shadow-teal-100 dark:shadow-teal-950 group-hover:scale-105 transition-transform flex-none">
                <Sparkles size={22} className="lg:hidden" />
                <Sparkles size={30} className="hidden lg:block" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-slate-800 dark:text-white text-sm lg:text-lg flex items-center gap-1.5">
                  <span>قصص الوحدات التفاعلية</span>
                  <span className="text-[10px] lg:text-xs bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 px-2 py-0.5 rounded-full font-bold">جديد ✨ (+20 XP)</span>
                </div>
                <div className="text-xs lg:text-base text-slate-500 dark:text-slate-400 mt-0.5">قصص واقعية لترسيخ الكلمات مع قراءة صوتية وأسئلة فهم</div>
              </div>
              <ChevronRight className="text-slate-300 dark:text-slate-600 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors flex-none" size={18} />
            </Link>

            <Link
              href="/roleplay"
              className="flex items-center gap-3.5 lg:gap-5 bg-white dark:bg-slate-900 rounded-2xl p-4 lg:p-6 shadow-sm hover:shadow-md border border-purple-100 dark:border-purple-900/50 hover:border-purple-300 dark:hover:border-purple-700 transition-all group active:scale-[0.99]"
            >
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-tr from-purple-500 to-pink-600 text-white rounded-xl flex items-center justify-center shadow-md shadow-purple-100 dark:shadow-purple-950 group-hover:scale-105 transition-transform flex-none">
                <MessageSquare size={22} className="lg:hidden" />
                <MessageSquare size={30} className="hidden lg:block" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-slate-800 dark:text-white text-sm lg:text-lg flex items-center gap-1.5">
                  <span>المحادثات التفاعلية الموجهة</span>
                  <span className="text-[10px] lg:text-xs bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 px-2 py-0.5 rounded-full font-bold">AI Chat 🤖 (+30 XP)</span>
                </div>
                <div className="text-xs lg:text-base text-slate-500 dark:text-slate-400 mt-0.5">تحدث مع شخصيات ذكية بالصوت والنص ومارس كلماتك في سيناريوهات واقعية</div>
              </div>
              <ChevronRight className="text-slate-300 dark:text-slate-600 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors flex-none" size={18} />
            </Link>

            {stats && stats.reviewDue > 0 ? (
              <Link
                href="/review"
                className="flex items-center gap-3.5 lg:gap-5 bg-white dark:bg-slate-900 rounded-2xl p-4 lg:p-6 shadow-sm hover:shadow-md border border-amber-200 dark:border-amber-900/50 hover:border-amber-300 dark:hover:border-amber-700 transition-all group active:scale-[0.99]"
              >
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-tr from-amber-500 to-orange-500 text-white rounded-xl flex items-center justify-center shadow-md shadow-amber-100 dark:shadow-amber-950 group-hover:scale-105 transition-transform flex-none">
                  <RotateCcw size={22} className="lg:hidden" />
                  <RotateCcw size={30} className="hidden lg:block" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-800 dark:text-white text-sm lg:text-lg flex items-center gap-1.5">
                    <span>مراجعة اليوم المجدولة</span>
                    <span className="text-[10px] lg:text-xs bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full font-bold">هام</span>
                  </div>
                  <div className="text-xs lg:text-base text-amber-600 dark:text-amber-400 font-semibold mt-0.5">
                    لديك {stats.reviewDue} كلمة تتطلب مراجعة لترسيخ الحفظ
                  </div>
                </div>
                <ChevronRight className="text-amber-400 dark:text-amber-500 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors flex-none" size={18} />
              </Link>
            ) : (
              <Link
                href="/review"
                className="flex items-center gap-3.5 lg:gap-5 bg-white dark:bg-slate-900 rounded-2xl p-4 lg:p-6 shadow-sm hover:shadow-md border border-slate-100 dark:border-slate-800 hover:border-amber-200 dark:hover:border-amber-700 transition-all group active:scale-[0.99]"
              >
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform flex-none">
                  <RotateCcw size={22} className="lg:hidden" />
                  <RotateCcw size={30} className="hidden lg:block" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-800 dark:text-white text-sm lg:text-lg">مراجعة عامة</div>
                  <div className="text-xs lg:text-base text-slate-400 dark:text-slate-400 mt-0.5">تدرب على كلماتك السابقة بأسلوب البطاقات الذكية</div>
                </div>
                <ChevronRight className="text-slate-300 dark:text-slate-600 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors flex-none" size={18} />
              </Link>
            )}

            <Link
              href="/vocabulary"
              className="flex items-center gap-3.5 lg:gap-5 bg-white dark:bg-slate-900 rounded-2xl p-4 lg:p-6 shadow-sm hover:shadow-md border border-slate-100 dark:border-slate-800 hover:border-purple-200 dark:hover:border-purple-700 transition-all group active:scale-[0.99]"
            >
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform flex-none">
                <Archive size={22} className="lg:hidden" />
                <Archive size={30} className="hidden lg:block" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-slate-800 dark:text-white text-sm lg:text-lg">بنك المفردات</div>
                <div className="text-xs lg:text-base text-slate-400 dark:text-slate-400 mt-0.5">تصفح وفلترة كل الكلمات المخزنة مع إظهار وإخفاء المعاني</div>
              </div>
              <ChevronRight className="text-slate-300 dark:text-slate-600 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors flex-none" size={18} />
            </Link>

            <Link
              href="/stats"
              className="flex items-center gap-3.5 lg:gap-5 bg-white dark:bg-slate-900 rounded-2xl p-4 lg:p-6 shadow-sm hover:shadow-md border border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-700 transition-all group active:scale-[0.99]"
            >
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform flex-none">
                <BarChart2 size={22} className="lg:hidden" />
                <BarChart2 size={30} className="hidden lg:block" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-slate-800 dark:text-white text-sm lg:text-lg">الإحصائيات والتحليلات</div>
                <div className="text-xs lg:text-base text-slate-400 dark:text-slate-400 mt-0.5">معدل الدقة، تدرج المستويات، وتفاصيل أدائك</div>
              </div>
              <ChevronRight className="text-slate-300 dark:text-slate-600 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors flex-none" size={18} />
            </Link>
          </div>
        </div>

      </main>
    </div>
  );
}
