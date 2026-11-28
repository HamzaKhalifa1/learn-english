'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Home, Archive, BarChart2, MessageSquare } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const navItems = [
  { href: '/', label: 'الرئيسية', icon: Home },
  { href: '/learn', label: 'التعلم', icon: BookOpen },
  { href: '/roleplay', label: 'محادثة AI', icon: MessageSquare },
  { href: '/vocabulary', label: 'كلماتي', icon: Archive },
  { href: '/stats', label: 'إحصائياتي', icon: BarChart2 },
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <>
      {/* Mobile Top Bar - Static at top of page, scrolls off naturally */}
      <header className="md:hidden w-full bg-white/90 dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="w-full max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 active:scale-95 transition-all">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-base shadow-sm shadow-indigo-200 dark:shadow-indigo-950">
              📚
            </div>
            <span className="font-black text-slate-800 dark:text-white text-base tracking-tight">تعلّم</span>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle className="rounded-xl shadow-xs" />
          </div>
        </div>
      </header>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="mx-3 mb-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-slate-200/80 dark:border-slate-800 p-1.5">
          <div className="grid grid-cols-5 gap-1">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex flex-col items-center justify-center gap-1 py-1.5 px-1 rounded-xl transition-all duration-200 ${
                    active
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 font-bold'
                      : 'text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 font-semibold'
                  }`}
                >
                  <div className={`transition-transform duration-200 ${active ? 'scale-110' : ''}`}>
                    <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                  </div>
                  <span className="text-[10px] truncate max-w-full text-center leading-tight">{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Desktop Top Nav */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 z-50">
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800 shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] flex justify-center">
          <div className="w-full max-w-5xl flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 lg:h-18">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 hover:opacity-90 transition-opacity">
              <div className="w-9 h-9 lg:w-11 lg:h-11 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl lg:rounded-2xl flex items-center justify-center text-white text-base lg:text-xl shadow-sm shadow-indigo-200 dark:shadow-indigo-950">
                📚
              </div>
              <span className="font-black text-slate-800 dark:text-white text-lg lg:text-xl">تعلّم</span>
            </Link>

            {/* Actions: Segmented Nav Tabs + Theme Toggle */}
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/80 p-1 lg:p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
                {navItems.map(({ href, label, icon: Icon }) => {
                  const active = pathname === href;
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`flex items-center gap-1.5 px-3 py-1.5 lg:px-4 lg:py-2 rounded-xl text-xs lg:text-sm font-bold transition-all duration-200 whitespace-nowrap ${
                        active
                          ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-white/60 dark:hover:bg-slate-700/50'
                      }`}
                    >
                      <Icon size={16} strokeWidth={active ? 2.5 : 2} className="lg:w-4.5 lg:h-4.5 shrink-0" />
                      <span>{label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Theme Toggle Button */}
              <ThemeToggle />
            </div>

          </div>
        </div>
      </nav>
    </>
  );
}
