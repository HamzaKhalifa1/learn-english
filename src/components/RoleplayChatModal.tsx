'use client';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playTTS, stopTTS } from '@/lib/tts';
import {
  X,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Send,
  Sparkles,
  Award,
  CheckCircle2,
  Lightbulb,
  ArrowRight,
  MessageSquare,
  Languages,
} from 'lucide-react';
import type { RoleplayScenario, SuggestedReply, TargetWordDetail } from '@/data/roleplayScenarios';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  textAr?: string;
  showTranslation?: boolean;
  usedWords?: string[];
  tip?: string;
}

interface Props {
  scenario: RoleplayScenario;
  onClose: () => void;
  onFinish?: (xpEarned: number) => void;
}

export default function RoleplayChatModal({ scenario, onClose, onFinish }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial',
      sender: 'assistant',
      text: scenario.character.greeting,
      textAr: scenario.character.greetingAr,
      showTranslation: false,
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestedReply[]>(scenario.initialHints);
  const [allUsedTargetWords, setAllUsedTargetWords] = useState<string[]>([]);
  const [selectedWordDetail, setSelectedWordDetail] = useState<TargetWordDetail | null>(null);
  const [isGoalReached, setIsGoalReached] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Character Neural Voice based on persona / gender
  const characterVoice = useMemo(() => {
    const avatar = scenario.character.avatar || '';
    const name = scenario.character.name.toLowerCase();
    const isMale =
      avatar.includes('👨') ||
      avatar.includes('👦') ||
      avatar.includes('‍♂️') ||
      name.includes('adam') ||
      name.includes('tariq') ||
      name.includes('zaid') ||
      name.includes('marco') ||
      name.includes('leo');
    return isMale ? 'en-US-GuyNeural' : 'en-US-JennyNeural';
  }, [scenario]);

  // Voice output using Microsoft Edge Natural Neural TTS
  const speakText = useCallback((text: string) => {
    if (isMuted) return;
    playTTS(text, { voice: characterVoice });
  }, [isMuted, characterVoice]);

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      stopTTS();
    };
  }, []);

  // Auto-speak initial greeting
  useEffect(() => {
    const timer = setTimeout(() => {
      speakText(scenario.character.greeting);
    }, 400);
    return () => clearTimeout(timer);
  }, [scenario, speakText]);

  // Web Speech API Speech-to-Text Recognition setup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setInputText(prev => (prev ? `${prev} ${transcript}` : transcript));
          }
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('ميزة التحدث الصوتي غير مدعومة في متصفحك الحالي، يمكنك الكتابة في حقل النص.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  };

  // Send message
  const handleSendMessage = async (textToSend?: string) => {
    const content = (textToSend || inputText).trim();
    if (!content || isTyping) return;

    setInputText('');
    setSuggestions([]);

    const userMsgId = `user-${Date.now()}`;
    const newMsg: Message = {
      id: userMsgId,
      sender: 'user',
      text: content,
    };

    setMessages(prev => [...prev, newMsg]);
    setIsTyping(true);

    try {
      const chatHistory = messages.map(m => ({ sender: m.sender, text: m.text }));
      const res = await fetch('/api/roleplay/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioId: scenario.id,
          messages: chatHistory,
          userMessage: content,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        const reply = data.data;

        // Update target words used
        if (reply.allUsedTargetWords) {
          setAllUsedTargetWords(reply.allUsedTargetWords);
        }

        const assistantMsg: Message = {
          id: `assistant-${Date.now()}`,
          sender: 'assistant',
          text: reply.reply,
          textAr: reply.replyAr,
          showTranslation: false,
          tip: reply.tip,
        };

        setMessages(prev => [...prev, assistantMsg]);
        setSuggestions(reply.suggestions || []);
        speakText(reply.reply);

        if (reply.isGoalReached && !isGoalReached) {
          setIsGoalReached(true);
          // Auto complete and save session
          fetch('/api/roleplay/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              scenarioId: scenario.id,
              turnsCount: reply.userTurns,
              targetWordsUsed: (reply.allUsedTargetWords || []).length,
            }),
          })
            .then(r => r.json())
            .then(resData => {
              if (resData.success) {
                setXpEarned(resData.data.xpEarned || 30);
              }
            });
        }
      }
    } catch {
      // Fallback response if network error
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: 'That is wonderful! Let us keep practicing our English.',
          textAr: 'هذا رائع! دعنا نواصل التدريب على الإنجليزية معاً.',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFinishSession = () => {
    onFinish?.(xpEarned || 30);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-2 md:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col h-[92vh] max-h-[820px] overflow-hidden relative"
      >
        {/* ── Top Bar Header ─────────────────────────────────────────── */}
        <div className="p-4 border-b border-slate-100 bg-white/95 backdrop-blur-sm flex items-center justify-between flex-none z-10 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-100 to-purple-100 border border-indigo-200/60 flex items-center justify-center text-2xl shadow-inner flex-none">
              {scenario.character.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-slate-800 text-sm md:text-base">
                  {scenario.character.name}
                </h2>
                <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full border border-indigo-100">
                  {scenario.level}
                </span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  مباشر
                </span>
              </div>
              <div className="text-xs text-slate-400 font-semibold mt-0.5">
                {scenario.character.role} · {scenario.titleAr}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                setIsMuted(prev => {
                  if (!prev) stopTTS();
                  return !prev;
                });
              }}
              title={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <button
              onClick={() => {
                stopTTS();
                onClose();
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* ── Vocabulary Mission Progress Bar ────────────────────────── */}
        <div className="bg-slate-50/90 border-b border-slate-150 px-4 py-2.5 flex-none">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-extrabold text-slate-700 flex items-center gap-1.5">
              <span>🎯 مهام الكلمات المستهدفة:</span>
              <span className="text-indigo-600 font-black">
                {allUsedTargetWords.length} من {scenario.targetWords.length}
              </span>
              <span className="text-[10px] text-slate-400 font-normal hidden sm:inline">
                (انقر على أي كلمة لمعرفة معناها ونطقها 💡)
              </span>
            </span>
            <span className="text-[11px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
              +30 XP عند الإكمال
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
            {scenario.targetWords.map(word => {
              const isUsed = allUsedTargetWords.some(
                uw => uw.toLowerCase() === word.toLowerCase()
              );
              const isSelected = selectedWordDetail?.word.toLowerCase() === word.toLowerCase();

              return (
                <button
                  key={word}
                  type="button"
                  onClick={() => {
                    speakText(word);
                    if (selectedWordDetail?.word.toLowerCase() === word.toLowerCase()) {
                      setSelectedWordDetail(null);
                    } else {
                      const detail = scenario.targetWordDetails?.find(
                        d => d.word.toLowerCase() === word.toLowerCase()
                      ) || { word, meaningAr: '', phonetic: '', example: '' };
                      setSelectedWordDetail(detail);
                    }
                  }}
                  className={`flex-none text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 border active:scale-95 cursor-pointer ${
                    isUsed
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-2xs'
                      : isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs ring-2 ring-indigo-200'
                      : 'bg-white text-slate-600 hover:text-indigo-600 hover:border-indigo-200 border-slate-200 shadow-2xs'
                  }`}
                  title={`${word} - انقر للاستماع والمعنى`}
                >
                  {isUsed && (
                    <CheckCircle2
                      size={12}
                      className={isSelected ? 'text-white' : 'text-emerald-600'}
                    />
                  )}
                  <span>{word}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Word Detail Popover Bar ─────────────────────────────────── */}
        <AnimatePresence>
          {selectedWordDetail && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 border-b border-indigo-200/80 px-4 py-2.5 flex-none overflow-hidden shadow-2xs"
            >
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => speakText(selectedWordDetail.word)}
                    className="w-7 h-7 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center transition-colors shadow-2xs"
                    title="استمع لنطق الكلمة"
                  >
                    <Volume2 size={13} />
                  </button>
                  <span className="font-black text-slate-800 text-sm ltr">
                    {selectedWordDetail.word}
                  </span>
                  {selectedWordDetail.phonetic && (
                    <span className="text-xs text-indigo-700 font-mono ltr">
                      {selectedWordDetail.phonetic}
                    </span>
                  )}
                  {selectedWordDetail.meaningAr && (
                    <span className="text-xs bg-white text-indigo-900 font-bold px-2 py-0.5 rounded-md border border-indigo-200 shadow-2xs">
                      {selectedWordDetail.meaningAr}
                    </span>
                  )}
                  {allUsedTargetWords.some(
                    w => w.toLowerCase() === selectedWordDetail.word.toLowerCase()
                  ) ? (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 size={11} className="text-emerald-600" />
                      مستخدمة ✓
                    </span>
                  ) : (
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-black px-2 py-0.5 rounded-full">
                      غير مستخدمة بعد
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setInputText(prev =>
                        prev ? `${prev} ${selectedWordDetail.word}` : selectedWordDetail.word
                      );
                      setSelectedWordDetail(null);
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-xs transition-all active:scale-95"
                  >
                    + أضف للرسالة
                  </button>
                  <button
                    onClick={() => setSelectedWordDetail(null)}
                    className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>

              {selectedWordDetail.example && (
                <div className="text-xs text-slate-600 font-medium ltr mt-1.5 bg-white/80 px-2.5 py-1.5 rounded-xl border border-indigo-100/80 flex items-center justify-between gap-2">
                  <span>💡 &quot;{selectedWordDetail.example}&quot;</span>
                  <button
                    onClick={() => speakText(selectedWordDetail.example!)}
                    title="استمع للمثال"
                    className="text-slate-400 hover:text-indigo-600 flex-none"
                  >
                    <Volume2 size={12} />
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Chat Messages Stream ───────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4 bg-gradient-to-b from-white to-slate-50/50">
          {messages.map(msg => {
            const isUser = msg.sender === 'user';

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div className={`flex gap-2.5 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                  {!isUser && (
                    <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center text-lg flex-none mt-1 shadow-2xs">
                      {scenario.character.avatar}
                    </div>
                  )}

                  <div>
                    {/* Bubble */}
                    <div
                      className={`p-3.5 md:p-4 rounded-2xl shadow-2xs text-sm md:text-base leading-relaxed ${
                        isUser
                          ? 'bg-indigo-600 text-white rounded-br-xs font-medium ltr'
                          : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs font-medium ltr'
                      }`}
                    >
                      {msg.text}
                    </div>

                    {/* Assistant message audio & translation controls */}
                    {!isUser && (
                      <div className="flex items-center gap-2 mt-1.5 px-1">
                        <button
                          onClick={() => speakText(msg.text)}
                          title="استمع للنطق"
                          className="text-slate-400 hover:text-indigo-600 flex items-center gap-1 text-[11px] font-bold transition-colors"
                        >
                          <Volume2 size={13} />
                          <span>استمع</span>
                        </button>

                        {msg.textAr && (
                          <button
                            onClick={() => {
                              setMessages(prev =>
                                prev.map(m =>
                                  m.id === msg.id ? { ...m, showTranslation: !m.showTranslation } : m
                                )
                              );
                            }}
                            className="text-slate-400 hover:text-indigo-600 flex items-center gap-1 text-[11px] font-bold transition-colors"
                          >
                            <Languages size={13} />
                            <span>{msg.showTranslation ? 'إخفاء الترجمة' : 'ترجمة للعربية'}</span>
                          </button>
                        )}
                      </div>
                    )}

                    {/* Arabic translation reveal */}
                    {!isUser && msg.showTranslation && msg.textAr && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-1.5 p-2.5 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs text-indigo-900 font-semibold"
                      >
                        {msg.textAr}
                      </motion.div>
                    )}

                    {/* Grammar/phrasing tip card if present */}
                    {msg.tip && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 p-2.5 bg-amber-50 border border-amber-200/70 rounded-xl text-xs text-amber-900 font-bold flex items-start gap-1.5 shadow-2xs"
                      >
                        <Lightbulb size={15} className="text-amber-600 flex-none mt-0.5" />
                        <span>{msg.tip}</span>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-lg">
                {scenario.character.avatar}
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl px-3.5 py-2 flex items-center gap-1 shadow-2xs">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ── Goal Reached Banner ────────────────────────────────────── */}
        {isGoalReached && !showCelebration && (
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 flex items-center justify-between flex-none shadow-md">
            <div className="flex items-center gap-2 text-xs font-black">
              <Award size={16} />
              <span>أحسنت! حققت هدف المحادثة بنجاح وربحت +30 XP</span>
            </div>
            <button
              onClick={() => setShowCelebration(true)}
              className="bg-white text-emerald-800 text-xs font-black px-3 py-1 rounded-xl shadow-xs hover:bg-emerald-50 active:scale-95 transition-all"
            >
              عرض الإنجاز 🏆
            </button>
          </div>
        )}

        {/* ── Quick Reply Suggestions ─────────────────────────────────── */}
        {suggestions.length > 0 && !isTyping && (
          <div className="px-4 py-2 bg-slate-50/80 border-t border-slate-100 flex-none">
            <div className="text-[11px] font-bold text-slate-400 mb-1.5 flex items-center gap-1">
              <Sparkles size={12} className="text-amber-500" />
              <span>اقتراحات رد سريعة (انقر للإرسال):</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {suggestions.map((hint, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(hint.text)}
                  className="flex-none bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-700 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-2xs transition-all text-right group active:scale-95"
                >
                  <div className="font-bold text-slate-800 group-hover:text-indigo-700 ltr">
                    {hint.text}
                  </div>
                  <div className="text-[10px] text-slate-400 group-hover:text-indigo-500 mt-0.5">
                    {hint.translationAr}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Input Bar ──────────────────────────────────────────────── */}
        <div className="p-3 md:p-4 bg-white border-t border-slate-100 flex items-center gap-2 flex-none">
          {/* Voice Microphone Toggle */}
          <button
            onClick={toggleListening}
            title={isListening ? 'إيقاف التسجيل الصوتي' : 'تحدث بالصوت بالإنجليزية'}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-none transition-all ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse ring-4 ring-rose-200'
                : 'bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600'
            }`}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>

          {/* Text Input */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              placeholder={isListening ? 'جارٍ الاستماع إليك... تحدث الآن بالإنجليزية' : 'اكتب أو تحدث بالإنجليزية...'}
              className="w-full bg-slate-100/90 border border-slate-200/80 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-all ltr text-slate-800 font-medium"
            />
          </div>

          {/* Send Button */}
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isTyping}
            className="w-11 h-11 bg-gradient-to-tr from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-40 text-white rounded-2xl flex items-center justify-center flex-none shadow-md shadow-indigo-200 transition-all active:scale-95"
          >
            <Send size={18} className="transform rotate-180" />
          </button>
        </div>

        {/* ── Celebration Completion Modal ────────────────────────────── */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 text-center"
            >
              <motion.div
                initial={{ scale: 0.85, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl border border-slate-100"
              >
                <div className="w-20 h-20 bg-gradient-to-tr from-amber-400 to-orange-400 rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-xl shadow-amber-200/60 mb-4 animate-bounce">
                  🏆
                </div>

                <h3 className="text-xl font-black text-slate-800 mb-1">
                  محادثة ممتازة!
                </h3>
                <p className="text-xs text-slate-500 mb-5 font-semibold">
                  أتممت الحوار الموجه مع {scenario.character.name} بنجاح
                </p>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-6 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-bold">النقاط المكتسبة:</span>
                    <span className="font-black text-amber-600 text-sm">+{xpEarned || 30} XP</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-bold">الكلمات المستهدفة:</span>
                    <span className="font-black text-emerald-600">
                      {allUsedTargetWords.length} من {scenario.targetWords.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-bold">المستوى:</span>
                    <span className="font-bold text-indigo-600">{scenario.level}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={handleFinishSession}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold py-3.5 rounded-2xl shadow-lg shadow-indigo-200 active:scale-95 transition-all"
                  >
                    متابعة التعلم 🚀
                  </button>
                  <button
                    onClick={() => setShowCelebration(false)}
                    className="w-full text-slate-400 hover:text-slate-600 text-xs font-bold py-2"
                  >
                    متابعة المحادثة الحالية
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
