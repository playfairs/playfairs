import { useState, useEffect } from 'react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleAudio = () => {
    if (isPlaying) {
      const audio = document.getElementById('nova-audio') as HTMLAudioElement;
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      setIsPlaying(false);
    } else {
      const audio = document.getElementById('nova-audio') as HTMLAudioElement;
      if (audio) {
        audio.play().catch(err => console.log('Audio play failed:', err));
        setIsPlaying(true);
      }
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
      isScrolled 
        ? 'py-2 px-6 bg-gray-900/95 backdrop-blur-sm shadow-lg shadow-black/20 border-b border-gray-700/50' 
        : 'py-3 px-6 bg-gray-900 border-b border-gray-700'
    }`}>
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <a href="/" className="text-lg font-semibold text-white hover:text-teal-400 transition-colors">
          playfairs.cc
        </a>
        <nav className="flex space-x-4">
          <button
            onClick={toggleAudio}
            className="text-gray-300 hover:text-teal-400 transition-colors text-sm relative group cursor-pointer"
          >
            {isPlaying ? 'Stop' : 'Bad Apple'}
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-teal-400 transition-all duration-300 group-hover:w-full"></span>
          </button>
          <a 
            href="/links" 
            className="text-gray-300 hover:text-teal-400 transition-colors text-sm relative group"
          >
            Links
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-teal-400 transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a 
            href="/socials" 
            className="text-gray-300 hover:text-teal-400 transition-colors text-sm relative group"
          >
            Socials
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-teal-400 transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a 
            href="/git" 
            className="text-gray-300 hover:text-teal-400 transition-colors text-sm relative group"
          >
            Git
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-teal-400 transition-all duration-300 group-hover:w-full"></span>
          </a>
        </nav>
      </div>
    </header>
  )
}