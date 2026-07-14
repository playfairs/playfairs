'use client';

import { useRef } from 'react';

const Footer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const Meow = () => {
    if (!audioRef.current) {
      const audio = new Audio('/meow-1.mp3');
      audioRef.current = audio;
    }

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((error) => {
        if (error.name !== 'AbortError') {
          console.error(error);
        }
      });
    }
  };

  return (
    <footer className="fixed inset-x-0 bottom-4 z-50 mx-auto w-[min(92vw,40rem)]">
      <div className="glass-panel flex flex-wrap items-center justify-center gap-2 px-3 py-3 sm:gap-3 sm:px-4">
        <button
          onClick={Meow}
          className="border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/65 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
        >
          Meow :3
        </button>
        <a
          href="https://www.google.com/search?q=inverted+aquarium"
          target="_blank"
          rel="noopener noreferrer"
          className="border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/65 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
        >
          Inverted Aquarium
        </a>
      </div>
    </footer>
  );
};

export default Footer;
