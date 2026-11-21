'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import XPBar from '@/components/XPBar';
import { getLevelLabel } from '@/lib/words';
import { RefreshCw, BarChart2, Award, Zap, Flame, BookOpen, RotateCcw, Target } from 'lucide-react';

interface Stats {
  totalWords: number;
  learnedWords: number;
  masteredWords: number;
  reviewDue: number;
  xp: number;
  streak: number;
  level: string;
}

export default function StatsPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(d => setStats(d.data));
  }, []);

  const handleRetakeTest = async () => {
    if (!confirm('هل أنت متأكد من رغبتك في إعادة اختبار تحديد المستوى وتحديث مستواك؟')) return;
    setResetting(true);
    await fetch('/api/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reset-placement' }),
    });
    router.push('/placement-test');
  };

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#0b0f19]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-800/60 rounded-2xl flex items-center justify-center text-3xl animate-bounce-gentle">
            📊
          </div>
          <div className="text-slate-500 dark:text-slate-400 font-bold text-sm">جاري تحميل الإحصائيات...</div>
        </div>
      </div>
    );
  }

  const cards = [
    { label: 'المستوى الحالي', value: stats.level, sub: getLevelLabel(stats.level), icon: '🎯', badge: 'المستوى' },
    { label: 'نقاط XP الإجمالية', value: stats.xp, sub: 'نقطة خبرة مكتسبة', icon: '⭐', badge: 'XP' },
    { label: 'الكلمات المتعلمة', value: stats.learnedWords, sub: 'كلمة أتممت مراحلها', icon: '📚', badge: 'مفردات' },
    { label: 'سلسلة الالتزام', value: `${stats.streak} يوم`, sub: 'أيام متتالية', icon: '🔥', badge: 'يومي' },
    { label: 'للمراجعة اليوم', value: stats.reviewDue, sub: 'كلمة مجدولة', icon: '🔄', badge: 'تكرار متباعد' },
    { label: 'الكلمات المتقنة', value: stats.masteredWords, sub: 'إتقان تام وتكرار عالي', icon: '👑', badge: 'إتقان' },
  ];

  return (
    <div className="min-h-screen pb-28 pt-4 md:pt-24 bg-[#f8fafc] dark:bg-[#0b0f19] flex flex-col items-center">
      <Navbar />
      <div className="w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl px-4 lg:px-8 py-5 lg:py-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-5 lg:mb-7">
          <h1 className="text-2xl lg:text-4xl font-black text-slate-800 dark:text-white flex items-center gap-2 lg:gap-3">
            <span className="text-2xl lg:text-4xl">📊</span>
            <span>لوحة الإحصائيات والتحليلات</span>
          </h1>

          <button
            onClick={handleRetakeTest}
            disabled={resetting}
            title="إعادة اختبار تحديد المستوى"
            className="flex items-center gap-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 px-3 py-1.5 lg:px-4 lg:py-2.5 rounded-xl text-xs lg:text-sm font-bold transition-all shadow-xs active:scale-95 disabled:opacity-50"
          >
            <RefreshCw size={13} className={resetting ? 'animate-spin' : ''} />
            <span>إعادة الامتحان</span>
          </button>
        </div>

        {/* XP Bar */}
        <div className="mb-5 lg:mb-7">
          <XPBar xp={stats.xp} streak={stats.streak} level={stats.level} />
        </div>

        {/* 6 Stats Cards Grid */}
        <div className="grid grid-cols-2 gap-3.5 lg:gap-5 mb-6 lg:mb-8">
          {cards.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{c.icon}</span>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-100 dark:border-slate-700">
                  {c.badge}
                </span>
              </div>
              <div className="text-xl font-black text-slate-800 dark:text-white mb-0.5">{c.value}</div>
              <div className="text-xs font-bold text-slate-600 dark:text-slate-300">{c.label}</div>
              <div className="text-[10px] text-slate-400 dark:text-slate-400 mt-0.5">{c.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* Progress Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm mb-6">
          <h2 className="font-black text-sm text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <Target size={16} className="text-indigo-600 dark:text-indigo-400" />
            <span>تقدم إتقان المفردات</span>
          </h2>
          <div className="space-y-4">
            {[
              {
                label: 'الكلمات المتعلمة (أكملت الـ 5 مراحل)',
                value: stats.learnedWords,
                max: Math.max(stats.totalWords, 1),
                gradient: 'from-emerald-400 to-teal-500',
              },
              {
                label: 'الكلمات المتقنة (مراجعات متكررة ناجحة)',
                value: stats.masteredWords,
                max: Math.max(stats.totalWords, 1),
                gradient: 'from-indigo-500 to-purple-500',
              },
            ].map(item => {
              const pct = Math.round((item.value / item.max) * 100);
              return (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1.5 font-bold">
                    <span className="text-slate-600 dark:text-slate-300">{item.label}</span>
                    <span className="text-slate-800 dark:text-white">{item.value} / {item.max} ({pct}%)</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${item.gradient} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
