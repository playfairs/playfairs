'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const headerStyles = `
  @keyframes slideInFromTop {
    from { transform: translateY(-100%); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  .animate-slide-in {
    animation: slideInFromTop 0.5s ease-out;
  }
`;

interface NavItem {
  name: string;
  href: string;
}

const Header = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = headerStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const navItems: NavItem[] = [
    { name: 'HOME', href: '/' },
    { name: 'SOCIALS', href: '/socials' },
    { name: 'PROJECTS', href: '/projects' },
    { name: 'TECHSTACK', href: '/techstack' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-black/80 backdrop-blur-xl border-b border-white/10' 
        : 'bg-transparent'
    }`}>
      <nav className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <Link 
            href="/" 
            className="group flex items-center gap-4 relative px-4 py-2 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300"
          >
            <span className="relative text-white font-light text-2xl tracking-widest transition-all duration-300 group-hover:text-gray-300">
              playfairs
            </span>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 scale-0 group-hover:scale-100" />
          </Link>

          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-6 py-3 text-sm font-light tracking-wider transition-all duration-300 group ${
                    isActive
                      ? 'text-white bg-gray-800/50 border border-white/20'
                      : 'text-white/60 border border-transparent hover:border-white/10'
                  }`}
                >
                  <span className="relative inline-block transition-all duration-300">
                    {item.name}
                  </span>

                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
