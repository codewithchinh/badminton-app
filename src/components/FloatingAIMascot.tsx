import React, { useState, useEffect } from 'react';
import { BadmintonMascotBot } from './BadmintonMascotBot';
import { X, Sparkles } from 'lucide-react';

interface FloatingAIMascotProps {
  onClick: () => void;
  showBackToTop?: boolean;
}

const CUTE_PROMPTS = [
  '🏸 Tìm kèo tối nay hông bạn ơi?',
  '📝 Quăng bài Zalo tui soạn cho nè!',
  '🎯 Test xem bạn trình độ gì nha?',
  '💰 Kèo sinh viên dưới 60k nè!',
];

export const FloatingAIMascot: React.FC<FloatingAIMascotProps> = ({ onClick, showBackToTop = false }) => {
  const [bubbleIndex, setBubbleIndex] = useState(0);
  const [isBubbleVisible, setIsBubbleVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Cycle cute prompts every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setBubbleIndex((prev) => (prev + 1) % CUTE_PROMPTS.length);
      setIsBubbleVisible(true);
    }, 6500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`fixed z-40 flex flex-col items-end transition-all duration-300 pointer-events-none select-none ${
        showBackToTop ? 'bottom-20 sm:bottom-6 right-3 sm:right-6' : 'bottom-20 sm:bottom-6 right-3 sm:right-6'
      }`}
    >
      {/* Cute Interactive Speech Bubble */}
      {isBubbleVisible && (
        <div
          onClick={onClick}
          className="pointer-events-auto mb-1.5 mr-1 group relative cursor-pointer animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          <div className="bg-white/95 hover:bg-white text-slate-800 text-xs font-bold px-3 py-2 rounded-2xl shadow-xl shadow-slate-900/10 border-2 border-emerald-400/80 flex items-center gap-1.5 backdrop-blur-md transition-all transform hover:scale-105 active:scale-95">
            <span className="flex-1 whitespace-nowrap text-[11px] sm:text-xs text-slate-800">
              {CUTE_PROMPTS[bubbleIndex]}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsBubbleVisible(false);
              }}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-100 transition-colors ml-0.5"
              title="Ẩn lời chào"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          {/* Speech Bubble Pointer / Arrow */}
          <div className="absolute right-7 -bottom-1.5 w-3 h-3 bg-white border-r-2 border-b-2 border-emerald-400/80 transform rotate-45" />
        </div>
      )}

      {/* Cute Mascot Avatar Trigger */}
      <button
        type="button"
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="pointer-events-auto relative group flex items-center justify-center p-1 rounded-full cursor-pointer transition-all duration-300 active:scale-90 focus:outline-none"
        title="Trò chuyện với Bé Cầu AI (Trợ lý Cầu Lông)"
      >
        {/* Soft Glowing Aura / Ripple */}
        <div className="absolute inset-0 rounded-full bg-emerald-400/30 blur-md group-hover:bg-emerald-400/50 group-hover:blur-lg transition-all animate-pulse" />
        
        {/* Subtle decorative background circle */}
        <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 opacity-90 shadow-lg shadow-emerald-700/30 group-hover:scale-105 transition-transform" />

        {/* Mascot Robot */}
        <div className="relative z-10 p-1 transform transition-transform group-hover:-translate-y-1">
          <BadmintonMascotBot
            size="lg"
            expression={isHovered ? 'wink' : 'happy'}
            isAnimated={true}
          />
        </div>

        {/* Cute Name Tag / Pill on Hover (Desktop) */}
        <div className="absolute -bottom-1 bg-slate-900/90 text-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-400/50 shadow-md whitespace-nowrap flex items-center gap-1 z-20 group-hover:scale-105 transition-transform">
          <Sparkles className="w-2.5 h-2.5 text-amber-300" />
          <span>Bé Cầu AI</span>
        </div>
      </button>
    </div>
  );
};
