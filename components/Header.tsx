'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

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
  external?: boolean;
}

const Header = () => {
  const pathname = usePathname();

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
    { name: 'EXPLORE', href: '/explore' },
    { name: 'MUSIC TASTE', href: 'https://playlists.playfairs.cc', external: true },
  ];

  return (
    <header className="fixed top-6 left-0 right-0 z-50 transition-all duration-300 mx-auto max-w-4xl bg-black/90 backdrop-blur-xl border-white/10 shadow-2xl border">
      <nav className="px-6 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="group flex items-center gap-3"
          >
            <span className="font-bold text-lg tracking-wider text-white">
              playfairs
            </span>
          </Link>

          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              if (item.external) {
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-sm font-medium tracking-wide transition-colors duration-200 text-white/60 hover:text-white"
                  >
                    {item.name}
                  </a>
                );
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 text-sm font-medium tracking-wide transition-colors duration-200 ${
                    isActive
                      ? 'text-white'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {item.name}
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
