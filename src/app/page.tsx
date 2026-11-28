'use client';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from 'framer-motion';
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
  Sparkles,
  CheckCircle2,
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
  A1: 0,
  A2: 500,
  B1: 1500,
  B2: 3000,
  C1: 5000,
  C2: 8000,
};

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

// Deterministic particles so SSR and client hydration always match cleanly
const PARTICLES = [
  { id: 0, x: 10, y: 16, size: 3.5, dur: 12, delay: 0.2, opacity: 0.28 },
  { id: 1, x: 24, y: 74, size: 2.5, dur: 15, delay: 1.5, opacity: 0.2 },
  { id: 2, x: 38, y: 28, size: 4, dur: 11, delay: 0.8, opacity: 0.24 },
  { id: 3, x: 52, y: 62, size: 3, dur: 14, delay: 2.1, opacity: 0.22 },
  { id: 4, x: 68, y: 18, size: 4.5, dur: 16, delay: 0.5, opacity: 0.3 },
  { id: 5, x: 82, y: 44, size: 2.5, dur: 13, delay: 1.8, opacity: 0.18 },
  { id: 6, x: 91, y: 78, size: 3.5, dur: 17, delay: 0.9, opacity: 0.26 },
  { id: 7, x: 14, y: 52, size: 3, dur: 14, delay: 2.7, opacity: 0.22 },
  { id: 8, x: 45, y: 86, size: 4, dur: 12, delay: 1.1, opacity: 0.24 },
  { id: 9, x: 75, y: 68, size: 3, dur: 15, delay: 0.3, opacity: 0.21 },
  { id: 10, x: 61, y: 34, size: 2.5, dur: 11, delay: 2.4, opacity: 0.19 },
  { id: 11, x: 31, y: 46, size: 3.5, dur: 16, delay: 1.3, opacity: 0.23 },
];

/* ═══════════════ Helpers ═══════════════ */
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

/* ═══════════════ Counting Animated Number ═══════════════ */
function CountUp({
  target,
  duration = 1.0,
  className,
}: {
  target: number;
  duration?: number;
  className?: string;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === 0) {
      setCount(0);
      return;
    }

    let rafId = 0;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      }
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [target, duration]);

  return <span className={className}>{count.toLocaleString('en-US')}</span>;
}

/* ═══════════════ Ambient Floating Particles (Parallax) ═══════════════ */
function FloatingParticles({
  parallaxX,
  parallaxY,
}: {
  parallaxX: ReturnType<typeof useSpring>;
  parallaxY: ReturnType<typeof useSpring>;
}) {
  const shiftX = useTransform(parallaxX, [-1, 1], [-18, 18]);
  const shiftY = useTransform(parallaxY, [-1, 1], [-18, 18]);

  return (
    <motion.div
      style={{ x: shiftX, y: shiftY }}
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden
    >
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-indigo-500/70 dark:bg-indigo-300"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          animate={{
            y: [0, -28, 0],
            opacity: [p.opacity * 0.45, p.opacity, p.opacity * 0.45],
            scale: [0.85, 1.2, 0.85],
          }}
          transition={{
            duration: p.dur,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </motion.div>
  );
}

/* ═══════════════ Spotlight + 3D Tilt Interactive Card ═══════════════ */
interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  borderGlowColor?: string;
  tiltIntensity?: number;
  href?: string;
  onClick?: () => void;
}

function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(99, 102, 241, 0.16)',
  borderGlowColor = 'rgba(129, 140, 248, 0.6)',
  tiltIntensity = 7,
  href,
  onClick,
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const mouseX = useMotionValue(-300);
  const mouseY = useMotionValue(-300);
  const smoothX = useSpring(mouseX, { stiffness: 280, damping: 26 });
  const smoothY = useSpring(mouseY, { stiffness: 280, damping: 26 });

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 220, damping: 22 });
  const springRotateY = useSpring(rotateY, { stiffness: 220, damping: 22 });

  const surfaceGlow = useMotionTemplate`radial-gradient(280px circle at ${smoothX}px ${smoothY}px, ${spotlightColor}, transparent 72%)`;
  const borderGlow = useMotionTemplate`radial-gradient(210px circle at ${smoothX}px ${smoothY}px, ${borderGlowColor}, transparent 70%)`;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      mouseX.set(px);
      mouseY.set(py);

      const nx = px / rect.width - 0.5;
      const ny = py / rect.height - 0.5;
      rotateX.set(-ny * tiltIntensity);
      rotateY.set(nx * tiltIntensity);
    },
    [mouseX, mouseY, rotateX, rotateY, tiltIntensity]
  );

  const handleMouseEnter = useCallback(() => setHovered(true), []);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  const innerContent = (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileHover={{ y: -4, scale: 1.018 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformPerspective: 900,
      }}
      className={`relative overflow-hidden h-full will-change-transform ${className}`}
    >
      {/* Dynamic cursor-tracking border highlight */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] p-[1.5px] z-20 transition-opacity duration-300"
        style={{
          opacity: hovered ? 1 : 0,
          background: borderGlow,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {/* Dynamic cursor-tracking surface spotlight */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] z-10 transition-opacity duration-300"
        style={{
          opacity: hovered ? 1 : 0,
          background: surfaceGlow,
        }}
      />

      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full focus:outline-none">
        {innerContent}
      </Link>
    );
  }

  return innerContent;
}

/* ═══════════════ Magnetic Hero Button ═══════════════ */
function MagneticCTAButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const btnRef = useRef<HTMLDivElement>(null);
  const pullX = useMotionValue(0);
  const pullY = useMotionValue(0);
  const springPullX = useSpring(pullX, { stiffness: 260, damping: 18 });
  const springPullY = useSpring(pullY, { stiffness: 260, damping: 18 });

  const spotX = useMotionValue(0);
  const spotY = useMotionValue(0);
  const [active, setActive] = useState(false);

  const spotBg = useMotionTemplate`radial-gradient(130px circle at ${spotX}px ${spotY}px, rgba(255,255,255,0.3), transparent 70%)`;

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    spotX.set(px);
    spotY.set(py);
    pullX.set(((px / rect.width) - 0.5) * 10);
    pullY.set(((py / rect.height) - 0.5) * 7);
  };

  const handleLeave = () => {
    setActive(false);
    pullX.set(0);
    pullY.set(0);
  };

  return (
    <motion.div
      ref={btnRef}
      onMouseMove={handleMove}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={handleLeave}
      style={{ x: springPullX, y: springPullY }}
      whileTap={{ scale: 0.97 }}
      className="flex-1"
    >
      <Link
        href={href}
        className="group relative w-full bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:brightness-110 text-white py-3.5 sm:py-4 px-6 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/35 hover:shadow-xl hover:shadow-pink-500/30 transition-all btn-shimmer cursor-pointer overflow-hidden"
      >
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 transition-opacity duration-200"
          style={{ opacity: active ? 1 : 0, background: spotBg }}
        />
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </Link>
    </motion.div>
  );
}

/* ═══════════════ Stagger Variants ═══════════════ */
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
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

  // Global cursor tracking for ambient parallax & page-wide subtle cursor aura
  const normMouseX = useMotionValue(0);
  const normMouseY = useMotionValue(0);
  const smoothNormX = useSpring(normMouseX, { stiffness: 70, damping: 20 });
  const smoothNormY = useSpring(normMouseY, { stiffness: 70, damping: 20 });

  const cursorX = useMotionValue(-500);
  const cursorY = useMotionValue(-500);
  const smoothCursorX = useSpring(cursorX, { stiffness: 120, damping: 22 });
  const smoothCursorY = useSpring(cursorY, { stiffness: 120, damping: 22 });
  const [pointerActive, setPointerActive] = useState(false);

  const pageAura = useMotionTemplate`radial-gradient(560px circle at ${smoothCursorX}px ${smoothCursorY}px, rgba(99, 102, 241, 0.11), transparent 70%)`;

  // Hero card 3D & inner parallax
  const heroRef = useRef<HTMLDivElement>(null);
  const [heroHovered, setHeroHovered] = useState(false);
  const heroMouseX = useMotionValue(0);
  const heroMouseY = useMotionValue(0);
  const smoothHeroMX = useSpring(heroMouseX, { stiffness: 200, damping: 22 });
  const smoothHeroMY = useSpring(heroMouseY, { stiffness: 200, damping: 22 });

  const heroRotateX = useMotionValue(0);
  const heroRotateY = useMotionValue(0);
  const springHeroRX = useSpring(heroRotateX, { stiffness: 180, damping: 20 });
  const springHeroRY = useSpring(heroRotateY, { stiffness: 180, damping: 20 });

  // Inner depth parallax offsets inside Hero
  const innerOffsetX = useTransform(springHeroRY, [-6, 6], [-10, 10]);
  const innerOffsetY = useTransform(springHeroRX, [-6, 6], [10, -10]);

  const heroSurfaceGlow = useMotionTemplate`radial-gradient(380px circle at ${smoothHeroMX}px ${smoothHeroMY}px, rgba(165, 180, 252, 0.25), transparent 70%)`;
  const heroBorderGlow = useMotionTemplate`radial-gradient(280px circle at ${smoothHeroMX}px ${smoothHeroMY}px, rgba(255, 255, 255, 0.55), transparent 70%)`;

  const handleGlobalPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.pointerType !== 'mouse') return;
      setPointerActive(true);
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      normMouseX.set(nx);
      normMouseY.set(ny);
    },
    [cursorX, cursorY, normMouseX, normMouseY]
  );

  const handleHeroMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      heroMouseX.set(px);
      heroMouseY.set(py);
      const nx = px / rect.width - 0.5;
      const ny = py / rect.height - 0.5;
      heroRotateX.set(-ny * 6.5);
      heroRotateY.set(nx * 6.5);
    },
    [heroMouseX, heroMouseY, heroRotateX, heroRotateY]
  );

  const handleHeroMouseLeave = useCallback(() => {
    setHeroHovered(false);
    heroRotateX.set(0);
    heroRotateY.set(0);
  }, [heroRotateX, heroRotateY]);

  useEffect(() => {
    setGreeting(getGreeting());
    setMotivation(getDailyMotivation());
  }, []);

  useEffect(() => {
    Promise.all([
      fetch('/api/stats', { cache: 'no-store' }).then((r) => r.json()),
      fetch('/api/user', { cache: 'no-store' }).then((r) => r.json()),
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
  const dailyProgress = stats
    ? Math.min(stats.learnedWords % dailyGoal || (stats.learnedWords > 0 ? dailyGoal : 0), dailyGoal)
    : 0;
  const dailyComplete = dailyProgress >= dailyGoal;

  // Level & smart progress calculation
  const userLevel = (stats?.level || 'A1').toUpperCase();
  const currentIdx = LEVELS.indexOf(userLevel);
  const nextLevel = LEVELS[currentIdx + 1];
  const currentThreshold = LEVEL_THRESHOLDS[userLevel] ?? 0;
  const nextThreshold = nextLevel ? LEVEL_THRESHOLDS[nextLevel] : currentThreshold + 1000;
  const currentXP = stats?.xp ?? 0;
  const xpInCurrentLevel = Math.max(0, currentXP - currentThreshold);
  const xpNeededForNext = nextThreshold - currentThreshold;
  const xpRemaining = Math.max(0, nextThreshold - currentXP);

  const hasLevelXPProgress = Boolean(nextLevel) && currentXP >= currentThreshold;
  const levelProgress = hasLevelXPProgress
    ? Math.min(100, Math.max(6, (xpInCurrentLevel / xpNeededForNext) * 100))
    : stats && stats.learnedWords > 0
      ? Math.min(100, Math.max(8, Math.round((stats.learnedWords / 780) * 100)))
      : 4;

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

  const statCards = stats
    ? [
        {
          href: '/vocabulary',
          label: 'كلمة متعلمة',
          subHint: `${stats.masteredWords.toLocaleString('en-US')} متقنة تماماً`,
          value: stats.learnedWords,
          icon: '📚',
          badge: 'بنك الكلمات',
          accentBg: 'from-blue-500/10 via-indigo-500/5 to-transparent',
          border: 'border-blue-200/70 dark:border-blue-900/40',
          spotlight: 'rgba(59, 130, 246, 0.17)',
          borderGlow: 'rgba(96, 165, 250, 0.6)',
          shadowHover: 'hover:shadow-blue-500/15',
        },
        {
          href: '/review',
          label: 'للمراجعة اليوم',
          subHint: stats.reviewDue > 0 ? 'تنتظر التثبيت الآن' : 'مراجعاتك مكتملة',
          value: stats.reviewDue,
          icon: '🔄',
          badge: stats.reviewDue > 0 ? 'مطلوب الآن' : 'متباعد',
          accentBg: 'from-teal-500/10 via-emerald-500/5 to-transparent',
          border: 'border-teal-200/70 dark:border-teal-900/40',
          spotlight: 'rgba(20, 184, 166, 0.17)',
          borderGlow: 'rgba(45, 212, 191, 0.6)',
          shadowHover: 'hover:shadow-teal-500/15',
          pulseDot: stats.reviewDue > 0,
        },
        {
          href: '/stats',
          label: 'مجموع نقاطك',
          subHint: `رتبة ${getLevelLabel(stats.level)}`,
          value: stats.xp,
          icon: '⚡',
          badge: 'XP الإجمالي',
          accentBg: 'from-amber-500/10 via-yellow-500/5 to-transparent',
          border: 'border-amber-200/70 dark:border-amber-900/40',
          spotlight: 'rgba(245, 158, 11, 0.17)',
          borderGlow: 'rgba(251, 191, 36, 0.6)',
          shadowHover: 'hover:shadow-amber-500/15',
        },
        {
          href: '/stats',
          label: 'سلسلة الالتزام',
          subHint: stats.streak > 0 ? 'حافظ على شعلتك!' : 'ابدأ يومك الأول',
          value: stats.streak,
          icon: '🔥',
          badge: 'يومي',
          accentBg: 'from-orange-500/10 via-red-500/5 to-transparent',
          border: 'border-orange-200/70 dark:border-orange-900/40',
          spotlight: 'rgba(249, 115, 22, 0.19)',
          borderGlow: 'rgba(251, 146, 60, 0.65)',
          shadowHover: 'hover:shadow-orange-500/20',
          isStreak: true,
        },
      ]
    : [];

  const quickNavItems = [
    {
      href: '/learn',
      emoji: '📖',
      title: 'وحدات التعلم',
      subtitle: 'دروس وكلمات مرتبة',
      gradient: 'from-indigo-600 to-blue-600',
      spotlight: 'rgba(99, 102, 241, 0.16)',
      borderGlow: 'rgba(129, 140, 248, 0.6)',
      shadowHover: 'hover:shadow-indigo-500/20',
      badge: 'الرئيسي',
      badgeStyle: 'text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/80 border-indigo-100 dark:border-indigo-800/60',
    },
    {
      href: '/learn',
      emoji: '✨',
      title: 'القصص التفاعلية',
      subtitle: 'تعلّم بالسياق الممتع',
      gradient: 'from-teal-500 to-emerald-600',
      spotlight: 'rgba(16, 185, 129, 0.16)',
      borderGlow: 'rgba(52, 211, 153, 0.6)',
      shadowHover: 'hover:shadow-emerald-500/20',
      badge: 'جديد',
      badgeStyle: 'text-emerald-600 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 border-emerald-100 dark:border-emerald-800/60',
    },
    {
      href: '/roleplay',
      emoji: '🤖',
      title: 'محادثة AI',
      subtitle: 'تحدّث مع شخصيات ذكية',
      gradient: 'from-purple-600 to-pink-600',
      spotlight: 'rgba(192, 38, 211, 0.16)',
      borderGlow: 'rgba(232, 121, 249, 0.6)',
      shadowHover: 'hover:shadow-purple-500/20',
      badge: '+30 XP',
      badgeStyle: 'text-purple-600 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/80 border-purple-100 dark:border-purple-800/60',
    },
    {
      href: '/review',
      emoji: '🔄',
      title: 'المراجعة اليومية',
      subtitle: stats && stats.reviewDue > 0 ? `${stats.reviewDue} كلمة بانتظارك` : 'تكرار متباعد ذكي',
      gradient: 'from-amber-500 to-orange-600',
      spotlight: 'rgba(245, 158, 11, 0.16)',
      borderGlow: 'rgba(251, 191, 36, 0.6)',
      shadowHover: 'hover:shadow-amber-500/20',
      badge: stats && stats.reviewDue > 0 ? 'مطلوب' : 'مراجعة',
      badgeStyle: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/80 border-amber-100 dark:border-amber-800/60',
    },
    {
      href: '/vocabulary',
      emoji: '🗂️',
      title: 'بنك المفردات',
      subtitle: 'تصفّح وفلترة الكلمات',
      gradient: 'from-violet-600 to-purple-700',
      spotlight: 'rgba(139, 92, 246, 0.16)',
      borderGlow: 'rgba(167, 139, 250, 0.6)',
      shadowHover: 'hover:shadow-violet-500/20',
      badge: 'القاموس',
      badgeStyle: 'text-violet-600 dark:text-violet-300 bg-violet-50 dark:bg-violet-950/80 border-violet-100 dark:border-violet-800/60',
    },
    {
      href: '/stats',
      emoji: '📊',
      title: 'مركز الإحصائيات',
      subtitle: 'معدل الدقة وتفاصيل أدائك',
      gradient: 'from-emerald-500 to-cyan-600',
      spotlight: 'rgba(6, 182, 212, 0.16)',
      borderGlow: 'rgba(34, 211, 238, 0.6)',
      shadowHover: 'hover:shadow-cyan-500/20',
      badge: 'التقارير',
      badgeStyle: 'text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/80 border-cyan-100 dark:border-cyan-800/60',
    },
  ];

  return (
    <div
      onPointerMove={handleGlobalPointerMove}
      onPointerLeave={() => setPointerActive(false)}
      className="min-h-screen pb-28 pt-0 md:pt-24 bg-[#f8fafc] dark:bg-[#0b0f19] page-ambient flex flex-col items-center relative"
    >
      {/* Page-wide ambient cursor aurora */}
      <motion.div
        aria-hidden
        className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-500"
        style={{
          opacity: pointerActive ? 1 : 0,
          background: pageAura,
        }}
      />

      {/* Parallax Floating Particles */}
      <FloatingParticles parallaxX={smoothNormX} parallaxY={smoothNormY} />

      <Navbar />

      <main className="w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl px-4 lg:px-8 py-4 lg:py-8 relative z-10">
        {/* ═══════════ GREETING HEADER ═══════════ */}
        <div className="flex items-center justify-between gap-3 mb-5 lg:mb-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-2.5 sm:gap-3.5"
          >
            <motion.span
              className="text-2xl sm:text-3xl lg:text-4xl select-none cursor-pointer"
              animate={{ rotate: [0, 14, -8, 14, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3.5 }}
              whileHover={{ scale: 1.25, rotate: 20 }}
              whileTap={{ scale: 0.85 }}
            >
              {greeting.emoji}
            </motion.span>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-800 dark:text-white tracking-tight">
                {greeting.text}!
              </h1>
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium line-clamp-1 mt-0.5"
              >
                {motivation}
              </motion.p>
            </div>
          </motion.div>

          {/* Header Quick Status Chips + Placement Reset */}
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="flex items-center gap-2 flex-none"
          >
            {stats && (
              <>
                <motion.div
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.94 }}
                >
                  <Link
                    href="/stats"
                    title={`سلسلة التزام ${stats.streak} يوم`}
                    className="flex items-center gap-1.5 bg-gradient-to-tr from-amber-500/10 to-orange-500/15 border border-amber-500/25 hover:border-amber-400/60 text-amber-600 dark:text-amber-400 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-black shadow-2xs transition-colors select-none"
                  >
                    <Flame size={15} className="fill-amber-500 text-amber-500 animate-bounce-gentle" />
                    <span>{stats.streak.toLocaleString('en-US')}</span>
                    <span className="text-[10px] text-amber-500/80 font-bold hidden sm:inline">يوم</span>
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.94 }}
                >
                  <Link
                    href="/stats"
                    title={`إجمالي النقاط ${stats.xp} XP`}
                    className="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/70 dark:border-indigo-800/60 hover:border-indigo-400/70 text-indigo-700 dark:text-indigo-300 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-black shadow-2xs transition-colors select-none"
                  >
                    <Zap size={14} className="fill-indigo-500 text-indigo-500" />
                    <span>{stats.xp.toLocaleString('en-US')}</span>
                    <span className="text-[10px] text-indigo-400 font-bold hidden sm:inline">XP</span>
                  </Link>
                </motion.div>
              </>
            )}

            <motion.button
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
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

        {/* ═══════════ HERO LEARNING CARD (3D Tilt + Border & Surface Spotlight + Depth Parallax) ═══════════ */}
        {stats && (
          <motion.div
            ref={heroRef}
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            onMouseMove={handleHeroMouseMove}
            onMouseEnter={() => setHeroHovered(true)}
            onMouseLeave={handleHeroMouseLeave}
            style={{
              rotateX: springHeroRX,
              rotateY: springHeroRY,
              transformPerspective: 1100,
            }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 dark:from-[#131b34] dark:via-[#161c38] dark:to-[#0f1426] border border-indigo-400/30 dark:border-indigo-500/25 p-5 sm:p-7 text-white shadow-2xl shadow-indigo-500/20 mb-5 lg:mb-6 will-change-transform"
          >
            {/* Dynamic cursor-reactive border glow */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-3xl p-[1.5px] z-20 transition-opacity duration-300"
              style={{
                opacity: heroHovered ? 1 : 0,
                background: heroBorderGlow,
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
              }}
            />

            {/* Dynamic cursor-reactive surface spotlight */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-3xl z-[2] transition-opacity duration-300"
              style={{
                opacity: heroHovered ? 1 : 0,
                background: heroSurfaceGlow,
              }}
            />

            {/* Parallax Ambient Background Orbs */}
            <motion.div
              style={{ x: innerOffsetX, y: innerOffsetY }}
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-12 -left-12 w-60 h-60 bg-white/10 dark:bg-indigo-500/25 rounded-full blur-3xl pointer-events-none"
            />
            <motion.div
              style={{ x: innerOffsetX, y: innerOffsetY }}
              animate={{ scale: [1.05, 0.95, 1.05] }}
              transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-14 -right-14 w-64 h-64 bg-purple-400/20 dark:bg-purple-500/25 rounded-full blur-3xl pointer-events-none"
            />

            <div className="relative z-10">
              {/* Top Level & Status Row */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <motion.div
                  style={{ x: innerOffsetX }}
                  className="inline-flex items-center gap-2 bg-white/15 dark:bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/25 text-xs sm:text-sm font-black shadow-sm"
                >
                  <motion.span
                    className="text-base"
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 8, -8, 0] }}
                    transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    🎯
                  </motion.span>
                  <span>المستوى {stats.level}</span>
                  <span className="w-1 h-1 rounded-full bg-white/50" />
                  <span className="text-white/85 font-semibold text-xs">{getLevelLabel(stats.level)}</span>
                </motion.div>

                <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-white/85 bg-black/20 dark:bg-black/35 backdrop-blur-md px-3 py-1 rounded-full border border-white/15">
                  <Sparkles size={12} className="text-amber-300" />
                  <span>{nextLevel ? `المستوى التالي: ${nextLevel}` : 'المستوى الأقصى 🏆'}</span>
                </div>
              </div>

              {/* Headline */}
              <div className="mb-5">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight mb-1.5 text-white">
                  واصل رحلة إتقان الإنجليزية!
                </h2>
                <p className="text-xs sm:text-sm text-indigo-100/85 dark:text-slate-300 font-medium">
                  أتقنت <span className="font-black text-white">{stats.masteredWords.toLocaleString('en-US')}</span> كلمة · ولديك{' '}
                  <span className="font-black text-white">{stats.learnedWords.toLocaleString('en-US')}</span> كلمة في حصيلتك اللغوية
                </p>
              </div>

              {/* Smart XP / Mastery Progress Track */}
              <div className="mb-5 bg-black/20 dark:bg-black/35 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-white/10">
                <div className="flex justify-between items-center text-xs font-bold mb-2 text-white/95">
                  <span className="flex items-center gap-1.5">
                    <Zap size={13} className="text-amber-300 fill-amber-300" />
                    <span>
                      {hasLevelXPProgress
                        ? `${xpInCurrentLevel.toLocaleString('en-US')} XP في المستوى ${stats.level}`
                        : `${currentXP.toLocaleString('en-US')} XP مكتسبة`}
                    </span>
                  </span>
                  <span className="text-[11px] text-white/75 font-semibold">
                    {hasLevelXPProgress
                      ? `متبقي ${xpRemaining.toLocaleString('en-US')} XP للترقية`
                      : nextLevel
                        ? `هدفك القادم: ${nextLevel}`
                        : `${Math.round((stats.learnedWords / 780) * 100)}% من المنهج الشامل`}
                  </span>
                </div>

                <div className="h-2.5 sm:h-3 bg-white/15 rounded-full overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${levelProgress}%` }}
                    transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
                    className="h-full bg-gradient-to-r from-amber-300 via-pink-400 to-indigo-300 rounded-full relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent animate-shimmer" />
                    <motion.div
                      className="absolute top-1/2 left-0 -translate-y-1/2 w-3 h-3 rounded-full bg-white/80 blur-[2px]"
                      animate={{ opacity: [0.4, 1, 0.4], scale: [0.85, 1.2, 0.85] }}
                      transition={{ duration: 1.6, repeat: Infinity }}
                    />
                  </motion.div>
                </div>
              </div>

              {/* Action Row with Magnetic Primary CTA */}
              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
                <MagneticCTAButton href="/learn">
                  <span>متابعة مسار التعلم</span>
                  <ChevronLeft
                    size={18}
                    className="transition-transform duration-200 group-hover:-translate-x-1"
                  />
                </MagneticCTAButton>

                <motion.div whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }}>
                  {stats.reviewDue > 0 ? (
                    <Link
                      href="/review"
                      className="bg-white/10 hover:bg-white/20 border border-white/25 text-white py-3.5 sm:py-4 px-5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all backdrop-blur-md cursor-pointer"
                    >
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-300 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-400" />
                      </span>
                      <RotateCcw size={15} />
                      <span>مراجعة الكلمات ({stats.reviewDue.toLocaleString('en-US')})</span>
                    </Link>
                  ) : (
                    <Link
                      href="/roleplay"
                      className="bg-white/10 hover:bg-white/20 border border-white/25 text-white py-3.5 sm:py-4 px-5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all backdrop-blur-md cursor-pointer"
                    >
                      <MessageSquare size={16} />
                      <span>محادثة AI (+30 XP)</span>
                    </Link>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════ DAILY QUEST (Interactive Spotlight) ═══════════ */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="mb-5 lg:mb-6"
          >
            <SpotlightCard
              href={dailyComplete ? undefined : '/learn'}
              spotlightColor={dailyComplete ? 'rgba(16, 185, 129, 0.14)' : 'rgba(245, 158, 11, 0.14)'}
              borderGlowColor={dailyComplete ? 'rgba(52, 211, 153, 0.55)' : 'rgba(251, 191, 36, 0.55)'}
              tiltIntensity={3}
              className={`rounded-2xl p-4 sm:p-5 border backdrop-blur-xl transition-all shadow-xs ${
                dailyComplete
                  ? 'bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-white/60 dark:to-slate-900/60 border-emerald-500/30 dark:border-emerald-500/25'
                  : 'bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-white/60 dark:to-slate-900/60 border-amber-500/30 dark:border-amber-500/25 cursor-pointer'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={
                      dailyComplete
                        ? { rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] }
                        : undefined
                    }
                    transition={{ duration: 0.7, repeat: dailyComplete ? Infinity : 0, repeatDelay: 4 }}
                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center shadow-md flex-none ${
                      dailyComplete
                        ? 'bg-gradient-to-tr from-emerald-500 to-teal-500 text-white'
                        : 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white'
                    }`}
                  >
                    {dailyComplete ? <Trophy size={20} /> : <Target size={20} />}
                  </motion.div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-black text-sm sm:text-base text-slate-800 dark:text-white">
                        مهمة اليوم اليومية
                      </h3>
                      <AnimatePresence>
                        {dailyComplete && (
                          <motion.span
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="inline-flex items-center gap-1 text-[10px] font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800"
                          >
                            <CheckCircle2 size={10} />
                            <span>مكتملة</span>
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
                  <div
                    className={`text-lg sm:text-xl font-black ${
                      dailyComplete ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {dailyProgress} / {dailyGoal}
                  </div>
                  <div className="text-[10px] text-slate-400 font-bold">
                    {dailyComplete ? '100% تم الإنجاز' : `متبقي ${dailyGoal - dailyProgress}`}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative w-full h-2.5 sm:h-3 rounded-full bg-slate-200/70 dark:bg-slate-800/80 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(dailyProgress / dailyGoal) * 100}%` }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
                  className={`h-full rounded-full relative overflow-hidden ${
                    dailyComplete
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                      : 'bg-gradient-to-r from-amber-500 to-orange-400'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                </motion.div>
              </div>

              {/* Interactive Step Nodes */}
              <div className="flex justify-between items-center mt-2 px-0.5">
                {Array.from({ length: dailyGoal }, (_, i) => {
                  const done = i < dailyProgress;
                  return (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4 + i * 0.06, type: 'spring' }}
                      className={`h-1.5 w-8 sm:w-12 rounded-full transition-colors duration-300 ${
                        done
                          ? dailyComplete
                            ? 'bg-emerald-500/80'
                            : 'bg-amber-500/80'
                          : 'bg-slate-200 dark:bg-slate-700/70'
                      }`}
                    />
                  );
                })}
              </div>
            </SpotlightCard>
          </motion.div>
        )}

        {/* ═══════════ 4 STATS CARDS (Spotlight + 3D Tilt + Fixed En-US CountUp) ═══════════ */}
        {stats && (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 gap-3 sm:gap-4 mb-5 lg:mb-7"
          >
            {statCards.map((item) => (
              <motion.div key={item.label} variants={staggerItem} className="h-full">
                <SpotlightCard
                  href={item.href}
                  spotlightColor={item.spotlight}
                  borderGlowColor={item.borderGlow}
                  tiltIntensity={7}
                  className={`group rounded-2xl sm:rounded-3xl p-4 sm:p-5 border ${item.border} bg-white/90 dark:bg-slate-900/80 bg-gradient-to-br ${item.accentBg} shadow-xs hover:shadow-xl ${item.shadowHover} ${
                    item.isStreak && stats.streak > 0 ? 'streak-glow' : ''
                  }`}
                >
                  <div className="flex flex-col justify-between h-full">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl sm:text-3xl transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6 inline-block">
                        {item.icon}
                      </span>
                      <div className="flex items-center gap-1 text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-300 bg-white/80 dark:bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-200/70 dark:border-slate-700/80">
                        {item.pulseDot && (
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                        )}
                        <span>{item.badge}</span>
                        <ArrowUpRight
                          size={11}
                          className="opacity-60 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight">
                        {item.isStreak ? (
                          <>
                            <CountUp target={item.value} />{' '}
                            <span className="text-base font-bold text-slate-500 dark:text-slate-400">
                              يوم
                            </span>
                          </>
                        ) : (
                          <CountUp target={item.value} />
                        )}
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-300 mt-0.5">
                        {item.label}
                      </div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-400/90 font-medium mt-0.5">
                        {item.subHint}
                      </div>
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* ═══════════ QUICK NAVIGATION: 6 SYMMETRICAL SPOTLIGHT GATEWAYS ═══════════ */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3 sm:space-y-4"
        >
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
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
            {quickNavItems.map((item) => (
              <motion.div key={item.title} variants={staggerItem} className="h-full">
                <SpotlightCard
                  href={item.href}
                  spotlightColor={item.spotlight}
                  borderGlowColor={item.borderGlow}
                  tiltIntensity={7}
                  className={`group rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800/90 bg-white/90 dark:bg-slate-900/80 shadow-xs hover:shadow-xl ${item.shadowHover}`}
                >
                  <div className="flex flex-col justify-between h-full">
                    <div className="flex items-start justify-between mb-3.5">
                      <div
                        className={`w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-tr ${item.gradient} text-white rounded-2xl flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6`}
                      >
                        <span className="text-xl sm:text-2xl">{item.emoji}</span>
                      </div>
                      <span
                        className={`text-[10px] font-black border px-2 py-0.5 rounded-full whitespace-nowrap ${item.badgeStyle}`}
                      >
                        {item.badge}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="font-black text-sm sm:text-[15px] text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors truncate">
                          {item.title}
                        </h3>
                        <ChevronLeft
                          size={14}
                          className="text-slate-400 opacity-0 group-hover:opacity-100 group-hover:-translate-x-0.5 transition-all flex-none"
                        />
                      </div>
                      <p className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-400 font-medium line-clamp-1 mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
