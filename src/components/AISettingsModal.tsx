'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Key, CheckCircle2, AlertCircle, ExternalLink, RefreshCw, Trash2, ShieldCheck, Zap } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onKeyUpdated?: (hasKey: boolean) => void;
}

export default function AISettingsModal({ isOpen, onClose, onKeyUpdated }: Props) {
  const [provider, setProvider] = useState<'gemini' | 'groq' | 'openai'>('gemini');
  const [apiKey, setApiKey] = useState('');
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedKey = localStorage.getItem('user_ai_api_key');
      const storedProvider = (localStorage.getItem('user_ai_provider') as any) || 'gemini';
      if (storedKey) {
        setSavedKey(storedKey);
        setApiKey(storedKey);
        setProvider(storedProvider);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestAndSave = async () => {
    const keyToTest = apiKey.trim();
    if (!keyToTest) return;

    setIsTesting(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/roleplay/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'test-key',
          userApiKey: keyToTest,
          userProvider: provider,
        }),
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem('user_ai_api_key', keyToTest);
        localStorage.setItem('user_ai_provider', provider);
        setSavedKey(keyToTest);
        setTestResult({
          success: true,
          message: `تم التحقق بنجاح والاتصال بـ ${data.model || provider}! ردود الـ AI الآن حية وديناميكية 100% 🚀`,
        });
        if (onKeyUpdated) onKeyUpdated(true);
      } else {
        setTestResult({
          success: false,
          message: data.error || 'تعذر التحقق من المفتاح. تأكد من صحة المفتاح والمزود المختار.',
        });
      }
    } catch {
      setTestResult({
        success: false,
        message: 'حدث خطأ أثناء الاتصال بالخادم. تحقق من اتصالك بالإنترنت.',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleClearKey = () => {
    localStorage.removeItem('user_ai_api_key');
    localStorage.removeItem('user_ai_provider');
    setSavedKey(null);
    setApiKey('');
    setTestResult({
      success: true,
      message: 'تم مسح المفتاح بنجاح والعودة إلى المحرك التفاعلي الذكي.',
    });
    if (onKeyUpdated) onKeyUpdated(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden"
        >
          {/* Header */}
          <div className="p-5 md:p-6 border-b border-slate-150 dark:border-slate-800 bg-gradient-to-r from-indigo-50/50 via-white to-purple-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-200 dark:shadow-indigo-950">
                <Sparkles size={20} className="text-amber-300" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                  <span>إعدادات الذكاء الاصطناعي الحي</span>
                  <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                    مجاني 100%
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  اربط محرك AI مباشر لمحادثات حقيقية تفهم كل كلمة تقولها بدقة
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 md:p-6 space-y-5">
            {/* Provider Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                اختر مزود الذكاء الاصطناعي:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setProvider('gemini')}
                  className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                    provider === 'gemini'
                      ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/50 text-indigo-950 dark:text-indigo-200 ring-2 ring-indigo-200 dark:ring-indigo-800'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-extrabold text-xs">Google Gemini</span>
                    <span className="text-[9px] bg-indigo-600 text-white font-black px-1.5 py-0.5 rounded-md">موصى به</span>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Gemini 3.1 Pro / Flash المجاني</span>
                </button>

                <button
                  type="button"
                  onClick={() => setProvider('groq')}
                  className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                    provider === 'groq'
                      ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/50 text-indigo-950 dark:text-indigo-200 ring-2 ring-indigo-200 dark:ring-indigo-800'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-extrabold text-xs">Groq Cloud</span>
                    <Zap size={13} className="text-amber-500" />
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Llama 3.3 الفائق السرعة</span>
                </button>

                <button
                  type="button"
                  onClick={() => setProvider('openai')}
                  className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                    provider === 'openai'
                      ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/50 text-indigo-950 dark:text-indigo-200 ring-2 ring-indigo-200 dark:ring-indigo-800'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-extrabold text-xs">OpenAI</span>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">GPT-4o-mini</span>
                </button>
              </div>
            </div>

            {/* Guide on Getting Free Key */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 text-xs">
              <div className="flex items-start gap-2.5">
                <ShieldCheck size={18} className="text-indigo-600 dark:text-indigo-400 flex-none mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-slate-800 dark:text-white">
                    {provider === 'gemini'
                      ? 'كيف تحصل على مفتاح Gemini مجاناً 100%؟'
                      : provider === 'groq'
                      ? 'كيف تحصل على مفتاح Groq مجاناً؟'
                      : 'مفتاح OpenAI الخاص بك'}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {provider === 'gemini' ? (
                      <>
                        مفتاح Gemini مجاني بالكامل بدون أي بطاقة بنكية (1,500 محادثة يومياً). انقر على الرابط التالي لتسجيل الدخول بحساب Google ونسخ المفتاح:
                      </>
                    ) : provider === 'groq' ? (
                      <>
                        توفر Groq سرعة استجابة مذهلة ومجانية بحساب مجاني (14,400 طلب يومياً). انسخ المفتاح من لوحة التحكم:
                      </>
                    ) : (
                      <>أدخل مفتاحك السري من لوحة تحكم OpenAI platform.openai.com</>
                    )}
                  </p>
                  <a
                    href={
                      provider === 'gemini'
                        ? 'https://aistudio.google.com/app/apikey'
                        : provider === 'groq'
                        ? 'https://console.groq.com/keys'
                        : 'https://platform.openai.com/api-keys'
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 hover:underline font-bold text-xs pt-1"
                  >
                    <span>
                      {provider === 'gemini'
                        ? 'احصل على مفتاحك الآن من Google AI Studio'
                        : provider === 'groq'
                        ? 'افتح لوحة مفاتيح Groq Console'
                        : 'افتح لوحة مفاتيح OpenAI'}
                    </span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            </div>

            {/* Input Form */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                الصق مفتاح الـ API هنا:
              </label>
              <div className="relative">
                <Key size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  type="password"
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  placeholder={
                    provider === 'gemini'
                      ? 'AIzaSy...'
                      : provider === 'groq'
                      ? 'gsk_...'
                      : 'sk-...'
                  }
                  className="w-full bg-slate-100/90 dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-2xl py-3 pr-10 pl-4 text-xs md:text-sm font-mono ltr focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* Test Result Message */}
            {testResult && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-2xl border text-xs font-bold flex items-start gap-2 ${
                  testResult.success
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
                    : 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800/60'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 flex-none mt-0.5" />
                ) : (
                  <AlertCircle size={16} className="text-rose-600 dark:text-rose-400 flex-none mt-0.5" />
                )}
                <span>{testResult.message}</span>
              </motion.div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleTestAndSave}
                disabled={!apiKey.trim() || isTesting}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 text-white font-extrabold py-3 px-4 rounded-2xl shadow-md shadow-indigo-200 dark:shadow-indigo-950 active:scale-95 transition-all text-xs md:text-sm flex items-center justify-center gap-2"
              >
                {isTesting ? (
                  <>
                    <RefreshCw size={15} className="animate-spin" />
                    <span>جارٍ اختبار المفتاح والربط...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} className="text-amber-300" />
                    <span>حفظ وتفعيل الذكاء الاصطناعي 🚀</span>
                  </>
                )}
              </button>

              {savedKey && (
                <button
                  type="button"
                  onClick={handleClearKey}
                  title="مسح المفتاح والعودة للمحرك المحلي"
                  className="p-3 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 rounded-2xl transition-all"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
