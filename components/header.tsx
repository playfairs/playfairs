import { useState, useEffect } from 'react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          <a 
            href="https://github.com/playfairs" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-teal-400 transition-colors text-sm"
          >
            GitHub
          </a>
          <a 
            href="/socials" 
            className="text-gray-300 hover:text-teal-400 transition-colors text-sm"
          >
            Socials
          </a>
          <a 
            href="/git" 
            className="text-gray-300 hover:text-teal-400 transition-colors text-sm"
          >
            Git
          </a>
        </nav>
      </div>
    </header>
  )
}