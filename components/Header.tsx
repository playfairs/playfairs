'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  name: string;
  href: string;
  external?: boolean;
}

const Header = () => {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    { name: 'HOME', href: '/' },
    { name: 'EXPLORE', href: '/explore' },
    { name: 'MUSIC TASTE', href: 'https://playlists.playfairs.cc', external: true },
  ];

  return (
    <header className="fixed inset-x-0 top-4 z-50 mx-auto w-[min(92vw,56rem)]">
      <nav className="glass-panel flex items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center border border-white/15 bg-white/5 text-sm font-semibold text-white/80">
            P
          </span>
          <span className="text-sm font-semibold uppercase tracking-[0.35em] text-white/90">
            playfairs
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            if (item.external) {
              return (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/60 transition hover:bg-white/10 hover:text-white"
                >
                  {item.name}
                </a>
              );
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] transition ${
                  isActive
                    ? 'bg-white/12 text-white'
                    : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
};

export default Header;
