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
      fetch('/api/stats').then(r => r.json()),
      fetch('/api/user').then(r => r.json()),
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
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-3xl animate-bounce-gentle">
            📚
          </div>
          <div className="text-slate-500 font-bold text-sm">جاري التحميل...</div>
        </div>
      </div>
    );
  }

  // Not taken placement test yet
  if (user && !user.placement_completed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50/60 via-white to-purple-50/60">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-100 shadow-xl text-center"
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-3xl flex items-center justify-center text-4xl shadow-lg shadow-indigo-200 text-white">
            🎓
          </div>
          <h1 className="text-2xl font-black text-slate-800 mb-2">مرحباً بك في رحلة التعلم!</h1>
          <p className="text-slate-500 text-sm mb-6 leading-relaxed">
            قبل أن تبدأ، سنحدد مستواك الحقيقي في الإنجليزية لنضع لك مساراً مخصصاً يتناسب مع قدراتك بدقة.
          </p>
          <Link
            href="/placement-test"
            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3.5 rounded-2xl font-bold text-base hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-200 active:scale-95"
          >
            <span>ابدأ اختبار تحديد المستوى</span>
            <ChevronRight size={18} />
          </Link>
          <p className="text-xs text-slate-400 mt-4 flex items-center justify-center gap-1">
            <span>⚡ مدة الاختبار: 3 إلى 5 دقائق فقط</span>
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28 pt-4 md:pt-24 bg-[#f8fafc] flex flex-col items-center">
      <Navbar />
      <main className="w-full max-w-2xl px-4 py-5">
        
        {/* Top Header Card */}
        <div className="flex items-center justify-between mb-5">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-2">
              <span className="text-2xl">👋</span>
              <div>
                <h1 className="text-xl font-black text-slate-800">أهلاً بك مجدداً!</h1>
                <p className="text-xs text-slate-400">واصل تقدمك اليومي خطوة بخطوة</p>
              </div>
            </div>
          </motion.div>

          <button
            onClick={handleRetakePlacement}
            disabled={retakingTest}
            title="إعادة اختبار تحديد المستوى لتحديث مستواك"
            className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-600 hover:text-indigo-600 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 disabled:opacity-50"
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
            className="mb-5"
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
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 p-5 text-white shadow-lg shadow-indigo-500/20 mb-6"
          >
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-white/20">
                  🎯
                </div>
                <div>
                  <div className="text-xs text-white/75 font-semibold">المستوى التعليمي الحالي</div>
                  <div className="text-2xl font-black flex items-center gap-2 mt-0.5">
                    <span>{stats.level}</span>
                    <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-medium text-white/90">
                      {getLevelLabel(stats.level)}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href="/learn"
                className="bg-white text-indigo-700 hover:bg-indigo-50 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-md shadow-black/10 active:scale-95"
              >
                <span>متابعة التعلم</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </motion.div>
        )}

        {/* 4 Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 gap-3.5 mb-6">
            {[
              {
                label: 'كلمة تعلمتها',
                value: stats.learnedWords,
                icon: '📚',
                bg: 'bg-blue-50/70 border-blue-100',
                text: 'text-blue-700',
                badge: 'مفردات',
              },
              {
                label: 'للمراجعة اليوم',
                value: stats.reviewDue,
                icon: '🔄',
                bg: 'bg-amber-50/70 border-amber-100',
                text: 'text-amber-700',
                badge: 'تكرار متباعد',
              },
              {
                label: 'مجموع نقاطك',
                value: stats.xp,
                icon: '⭐',
                bg: 'bg-purple-50/70 border-purple-100',
                text: 'text-purple-700',
                badge: 'XP',
              },
              {
                label: 'سلسلة الالتزام',
                value: `${stats.streak} يوم`,
                icon: '🔥',
                bg: 'bg-emerald-50/70 border-emerald-100',
                text: 'text-emerald-700',
                badge: 'يومي',
              },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05 * i }}
                className={`bg-white rounded-2xl p-4 border border-slate-100 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 relative overflow-hidden`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                    {item.badge}
                  </span>
                </div>
                <div className="text-xl font-black text-slate-800">{item.value}</div>
                <div className="text-xs font-semibold text-slate-400 mt-0.5">{item.label}</div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Action Hub */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-extrabold text-sm text-slate-700">الانتقال السريع</h2>
            <span className="text-xs text-slate-400">اختر وجهتك</span>
          </div>

          {/* Primary Action: Learn */}
          <Link
            href="/learn"
            className="flex items-center gap-3.5 bg-white rounded-2xl p-4 shadow-sm hover:shadow-md border border-slate-100 hover:border-indigo-200 transition-all group active:scale-[0.99]"
          >
            <div className="w-12 h-12 bg-gradient-to-tr from-indigo-500 to-indigo-600 text-white rounded-xl flex items-center justify-center text-xl shadow-md shadow-indigo-100 group-hover:scale-105 transition-transform flex-none">
              <BookOpen size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <span>وحدات الدروس والكلمات</span>
                <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.2 rounded-full font-bold">الرئيسي</span>
              </div>
              <div className="text-xs text-slate-400 truncate mt-0.5">وحدات مرتبة حسب مستواك مع اختبارات سريعة</div>
            </div>
            <ChevronRight className="text-slate-300 group-hover:text-indigo-600 transition-colors flex-none" size={18} />
          </Link>

          {/* Interactive Unit Stories */}
          <Link
            href="/learn"
            className="flex items-center gap-3.5 bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-transparent bg-white rounded-2xl p-4 shadow-sm hover:shadow-md border border-teal-100 hover:border-teal-300 transition-all group active:scale-[0.99]"
          >
            <div className="w-12 h-12 bg-gradient-to-tr from-teal-500 to-emerald-500 text-white rounded-xl flex items-center justify-center text-xl shadow-md shadow-teal-100 group-hover:scale-105 transition-transform flex-none">
              <Sparkles size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <span>قصص الوحدات التفاعلية</span>
                <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.2 rounded-full font-bold">جديد ✨ (+20 XP)</span>
              </div>
              <div className="text-xs text-slate-500 mt-0.5">قصص واقعية لترسيخ الكلمات مع قراءة صوتية وأسئلة فهم</div>
            </div>
            <ChevronRight className="text-slate-300 group-hover:text-teal-600 transition-colors flex-none" size={18} />
          </Link>

          {/* AI Roleplay Chat */}
          <Link
            href="/roleplay"
            className="flex items-center gap-3.5 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-transparent bg-white rounded-2xl p-4 shadow-sm hover:shadow-md border border-purple-100 hover:border-purple-300 transition-all group active:scale-[0.99]"
          >
            <div className="w-12 h-12 bg-gradient-to-tr from-purple-500 to-pink-600 text-white rounded-xl flex items-center justify-center text-xl shadow-md shadow-purple-100 group-hover:scale-105 transition-transform flex-none">
              <MessageSquare size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <span>المحادثات التفاعلية الموجهة</span>
                <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.2 rounded-full font-bold">AI Chat 🤖 (+30 XP)</span>
              </div>
              <div className="text-xs text-slate-500 mt-0.5">تحدث مع شخصيات ذكية بالصوت والنص ومارس كلماتك في سيناريوهات واقعية</div>
            </div>
            <ChevronRight className="text-slate-300 group-hover:text-purple-600 transition-colors flex-none" size={18} />
          </Link>

          {/* Review Due Action (conditional or persistent) */}
          {stats && stats.reviewDue > 0 ? (
            <Link
              href="/review"
              className="flex items-center gap-3.5 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent bg-white rounded-2xl p-4 shadow-sm hover:shadow-md border border-amber-200 hover:border-amber-300 transition-all group active:scale-[0.99]"
            >
              <div className="w-12 h-12 bg-gradient-to-tr from-amber-500 to-orange-500 text-white rounded-xl flex items-center justify-center text-xl shadow-md shadow-amber-100 group-hover:scale-105 transition-transform flex-none">
                <RotateCcw size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <span>مراجعة اليوم المجدولة</span>
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.2 rounded-full font-bold">هام</span>
                </div>
                <div className="text-xs text-amber-600 font-semibold mt-0.5">
                  لديك {stats.reviewDue} كلمة تتطلب مراجعة لترسيخ الحفظ
                </div>
              </div>
              <ChevronRight className="text-amber-400 group-hover:text-amber-600 transition-colors flex-none" size={18} />
            </Link>
          ) : (
            <Link
              href="/review"
              className="flex items-center gap-3.5 bg-white rounded-2xl p-4 shadow-sm hover:shadow-md border border-slate-100 hover:border-amber-200 transition-all group active:scale-[0.99]"
            >
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center text-xl group-hover:scale-105 transition-transform flex-none">
                <RotateCcw size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-slate-800 text-sm">مراجعة عامة</div>
                <div className="text-xs text-slate-400 mt-0.5">تدرب على كلماتك السابقة بأسلوب البطاقات الذكية</div>
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-amber-500 transition-colors flex-none" size={18} />
            </Link>
          )}

          {/* Vocabulary Bank */}
          <Link
            href="/vocabulary"
            className="flex items-center gap-3.5 bg-white rounded-2xl p-4 shadow-sm hover:shadow-md border border-slate-100 hover:border-purple-200 transition-all group active:scale-[0.99]"
          >
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center text-xl group-hover:scale-105 transition-transform flex-none">
              <Archive size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-slate-800 text-sm">بنك المفردات</div>
              <div className="text-xs text-slate-400 mt-0.5">تصفح وفلترة كل الكلمات المخزنة مع إظهار وإخفاء المعاني</div>
            </div>
            <ChevronRight className="text-slate-300 group-hover:text-purple-600 transition-colors flex-none" size={18} />
          </Link>

          {/* Statistics */}
          <Link
            href="/stats"
            className="flex items-center gap-3.5 bg-white rounded-2xl p-4 shadow-sm hover:shadow-md border border-slate-100 hover:border-emerald-200 transition-all group active:scale-[0.99]"
          >
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-xl group-hover:scale-105 transition-transform flex-none">
              <BarChart2 size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-slate-800 text-sm">الإحصائيات والتحليلات</div>
              <div className="text-xs text-slate-400 mt-0.5">معدل الدقة، تدرج المستويات، وتفاصيل أدائك</div>
            </div>
            <ChevronRight className="text-slate-300 group-hover:text-emerald-600 transition-colors flex-none" size={18} />
          </Link>
        </div>

      </main>
    </div>
  );
}
