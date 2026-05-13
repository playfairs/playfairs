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
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={Meow}
            className="px-4 py-2 text-sm font-light tracking-wider text-white/60 border border-white/10 hover:border-white/20 transition-all duration-300 rounded-lg"
          >
            Meow :3
          </button>
          <a
            href="https://www.google.com/search?q=inverted+aquarium"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-sm font-light tracking-wider text-white/60 border border-white/10 hover:border-white/20 transition-all duration-300 rounded-lg"
          >
            Inverted Aquarium
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
