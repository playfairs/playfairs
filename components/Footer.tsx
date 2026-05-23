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
    <footer className="fixed bottom-6 left-0 right-0 z-50 mx-auto max-w-4xl rounded-xl bg-black/90 backdrop-blur-xl border border-white/10 shadow-2xl">
      <div className="px-6 py-4">
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={Meow}
            className="px-4 py-2 text-xs font-medium tracking-wide text-white/50 border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all duration-300 rounded-lg"
          >
            Meow :3
          </button>
          <a
            href="https://www.google.com/search?q=inverted+aquarium"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-xs font-medium tracking-wide text-white/50 border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all duration-300 rounded-lg"
          >
            Inverted Aquarium
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
