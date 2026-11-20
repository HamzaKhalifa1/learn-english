'use client';
import { motion } from 'framer-motion';
import { Zap, Flame, Award } from 'lucide-react';
import { getLevelLabel } from '@/lib/words';

interface XPBarProps {
  xp: number;
  streak: number;
  level: string;
}

export default function XPBar({ xp, streak, level }: XPBarProps) {
  const levelThresholds: Record<string, number> = {
    A1: 0, A2: 500, B1: 1500, B2: 3000, C1: 5000, C2: 8000
  };
  const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const currentIdx = levels.indexOf(level.toUpperCase());
  const nextLevel = levels[currentIdx + 1];
  const currentThreshold = levelThresholds[level.toUpperCase()] ?? 0;
  const nextThreshold = nextLevel ? levelThresholds[nextLevel] : currentThreshold + 1000;
  
  const xpInCurrentLevel = Math.max(0, xp - currentThreshold);
  const xpNeededForNext = nextThreshold - currentThreshold;
  const progress = Math.min(100, Math.max(3, (xpInCurrentLevel / xpNeededForNext) * 100));

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-slate-100/80 transition-all hover:shadow-md">
      <div className="flex items-center gap-3">
        
        {/* Streak badge */}
        <div className="flex items-center gap-1.5 bg-gradient-to-br from-amber-50 to-orange-50 border border-orange-200/70 text-orange-600 px-3 py-2 rounded-xl flex-none shadow-xs">
          <Flame size={18} className="fill-orange-500 text-orange-500 animate-bounce-gentle" />
          <div className="flex flex-col items-center leading-none">
            <span className="font-black text-sm">{streak}</span>
            <span className="text-[9px] font-bold text-orange-400">يوم</span>
          </div>
        </div>

        {/* Progress Center */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-700">
              <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md text-[11px] font-black border border-indigo-100">
                {level}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                {getLevelLabel(level)}
              </span>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
              <Zap size={12} className="fill-amber-500 text-amber-500" />
              <span>{xp} XP</span>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full relative"
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </motion.div>
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1 font-medium">
            <span>{xpInCurrentLevel} XP في المستوى</span>
            {nextLevel ? (
              <span>متبقي {Math.max(0, nextThreshold - xp)} للوصول لـ {nextLevel}</span>
            ) : (
              <span>المستوى الأعلى 🏆</span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
