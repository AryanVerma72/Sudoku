import React, { useState } from 'react';
import { ExternalLink, X, Info } from 'lucide-react';

interface BottomAdBannerProps {
  onShowInfo?: () => void;
}

export const BottomAdBanner: React.FC<BottomAdBannerProps> = ({ onShowInfo }) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [adIndex, setAdIndex] = useState(0);

  // Rotating clean sample sponsor ads (typical for Play Store puzzle games)
  const ads = [
    {
      title: 'WordSearch Zen',
      tagline: 'Relax your mind with classic word searches.',
      action: 'Install Free',
      rating: '4.8★',
    },
    {
      title: 'Chess Master Tactics',
      tagline: 'Solve 10,000+ daily tactical chess puzzles.',
      action: 'Play Now',
      rating: '4.9★',
    },
    {
      title: 'Brain Logic Puzzles',
      tagline: 'Daily nonograms, kakuro & logic grids.',
      action: 'Get App',
      rating: '4.7★',
    },
  ];

  const currentAd = ads[adIndex];

  if (isDismissed) {
    return (
      <div className="w-full flex justify-center py-0.5">
        <button
          onClick={() => setIsDismissed(false)}
          className="text-[10px] text-[#8C92A4] dark:text-[#646A7E] hover:underline"
        >
          Show Ad Banner (Test Mode)
        </button>
      </div>
    );
  }

  return (
    <aside
      aria-label="Advertisement"
      className="w-full max-w-md mx-auto px-2 pb-1 select-none"
    >
      <div className="relative flex items-center justify-between h-[48px] px-2.5 rounded-lg bg-[#F0F1EE] dark:bg-[#1A1C22] border border-[#E0E2DC] dark:border-[#2B2D36] shadow-2xs overflow-hidden">
        {/* Left Side: Ad badge and Sponsor copy */}
        <div className="flex items-center gap-2 min-w-0 pr-1">
          <div className="flex flex-col items-center justify-center shrink-0">
            <span className="text-[8px] font-bold uppercase tracking-wider px-1 py-0.2 rounded bg-[#D4D6CE] dark:bg-[#2F323D] text-[#555864] dark:text-[#9DA1B0]">
              Ad
            </span>
          </div>

          <div className="min-w-0 flex flex-col justify-center leading-tight">
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-xs font-bold text-[#141517] dark:text-[#F1F2F6] truncate">
                {currentAd.title}
              </span>
              <span className="text-[10px] font-semibold text-[#D97706] shrink-0">
                {currentAd.rating}
              </span>
            </div>
            <p className="text-[10px] text-[#6B7280] dark:text-[#9CA3AF] truncate">
              {currentAd.tagline}
            </p>
          </div>
        </div>

        {/* Right Side: CTA Button and Dismiss */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setAdIndex((prev) => (prev + 1) % ads.length)}
            className="px-2.5 py-1 rounded-md bg-[#1E3A8A] dark:bg-[#2563EB] text-white text-[11px] font-semibold hover:opacity-90 active:scale-95 transition-all flex items-center gap-1 shrink-0"
            title="Next sample ad / Install"
          >
            <span>{currentAd.action}</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </button>

          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 rounded-md text-[#8C92A4] hover:text-[#141517] dark:hover:text-white"
            title="Dismiss ad preview"
            aria-label="Close Ad"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
