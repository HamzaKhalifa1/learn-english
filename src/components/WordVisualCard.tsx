'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCuratedWordVisual } from '@/lib/wordVisuals';
import { Eye, ImageOff, Sparkles } from 'lucide-react';

interface Props {
  word: string;
  category?: string;
  showWordOverlay?: boolean;
  className?: string;
}

export default function WordVisualCard({
  word,
  category,
  showWordOverlay = true,
  className = 'h-56'
}: Props) {
  const normalized = word.trim().toLowerCase();
  const curated = getCuratedWordVisual(normalized);

  const [imageUrl, setImageUrl] = useState<string | null>(curated?.imageUrl || null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [showOnlyImage, setShowOnlyImage] = useState(false);

  // If not in curated list, dynamically fetch smart contextual image from API
  useEffect(() => {
    setImageLoaded(false);
    setImageFailed(false);

    if (curated?.imageUrl) {
      setImageUrl(curated.imageUrl);
      return;
    }

    let isMounted = true;
    fetch(`/api/word-image?word=${encodeURIComponent(word)}`)
      .then(res => res.json())
      .then(data => {
        if (!isMounted) return;
        if (data.success && data.imageUrl) {
          setImageUrl(data.imageUrl);
        } else {
          setImageUrl(null);
        }
      })
      .catch(() => {
        if (isMounted) setImageUrl(null);
      });

    return () => {
      isMounted = false;
    };
  }, [word, curated]);

  const emoji = curated?.emoji || '✨';
  const gradient = curated?.gradient || 'from-indigo-600 via-purple-600 to-indigo-900';

  return (
    <div className={`relative w-full rounded-2xl mb-5 overflow-hidden shadow-lg select-none group border border-gray-100/50 ${className}`}>
      
      {/* Background Gradient & Fallback (Always rendered underneath) */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} flex flex-col items-center justify-center p-4`}>
        <div className="text-6xl drop-shadow-md animate-pulse mb-2">
          {emoji}
        </div>
        <div className="text-white/40 text-xs font-mono uppercase tracking-widest">
          {word}
        </div>
      </div>

      {/* Real Contextual Photography Layer */}
      {imageUrl && !imageFailed && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={imageUrl}
            src={imageUrl}
            alt={`صورة معبرة عن كلمة ${word}`}
            loading="eager"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageFailed(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-200 ${
              imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          />
        </>
      )}

      {/* Cinematic Gradient Vignette (Ensures text contrast and readability) */}
      {!showOnlyImage && imageLoaded && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10 transition-opacity" />
      )}

      {/* Toggle View Mode Button (Pure photo without overlay) */}
      {imageLoaded && showWordOverlay && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowOnlyImage(!showOnlyImage);
          }}
          title={showOnlyImage ? 'إظهار الكلمة' : 'معاينة الصورة كاملة'}
          className="absolute top-3 left-3 z-20 bg-black/40 hover:bg-black/60 text-white/90 p-2 rounded-xl backdrop-blur-md transition-all text-xs flex items-center gap-1 opacity-70 group-hover:opacity-100 shadow-sm"
        >
          <Eye size={14} />
        </button>
      )}

      {/* Semantic Badge (Top Right) */}
      <div className="absolute top-3 right-3 z-20 bg-black/45 backdrop-blur-md text-white px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm border border-white/10">
        <span>{emoji}</span>
        <span className="text-[11px] opacity-90">{category || 'كلمة'}</span>
      </div>

      {/* Word Text Overlay */}
      {showWordOverlay && !showOnlyImage && (
        <div className="absolute inset-x-0 bottom-4 z-10 text-center px-4">
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-white text-5xl font-black ltr tracking-tight drop-shadow-[0_4px_14px_rgba(0,0,0,0.85)]"
          >
            {word}
          </motion.div>
        </div>
      )}

      {/* Offline/Fall-back Notification */}
      {(!imageUrl || imageFailed) && (
        <div className="absolute bottom-2 left-2 z-10 text-white/70 text-[10px] flex items-center gap-1 bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-lg">
          <Sparkles size={11} />
          <span>المعنى الدلالي المعتمد</span>
        </div>
      )}
    </div>
  );
}
