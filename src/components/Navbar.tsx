'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Home, Archive, BarChart2, MessageSquare } from 'lucide-react';

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
      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="mx-3 mb-3 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-slate-200/80 px-2 py-2">
          <div className="flex items-center justify-around">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex flex-col items-center gap-1 px-3.5 py-1.5 rounded-xl transition-all duration-200 ${
                    active
                      ? 'text-indigo-600 bg-indigo-50 font-bold'
                      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50 font-semibold'
                  }`}
                >
                  <div className={`transition-transform duration-200 ${active ? 'scale-110' : ''}`}>
                    <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                  </div>
                  <span className="text-[10px]">{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Desktop Top Nav */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 z-50">
        <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex justify-center">
          <div className="w-full max-w-2xl flex items-center justify-between px-4 h-16">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-base shadow-sm shadow-indigo-200">
                📚
              </div>
              <span className="font-black text-slate-800 text-lg">تعلّم</span>
            </Link>

            {/* Segmented Nav Tabs */}
            <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/60">
              {navItems.map(({ href, label, icon: Icon }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                      active
                        ? 'bg-white text-indigo-600 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-white/60'
                    }`}
                  >
                    <Icon size={15} strokeWidth={active ? 2.5 : 2} />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </div>

          </div>
        </div>
      </nav>
    </>
  );
}
