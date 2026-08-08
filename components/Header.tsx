"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  name: string;
  href: string;
  external?: boolean;
}

const Header = () => {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    { name: "HOME", href: "/" },
    { name: "EXPLORE", href: "/explore" },
    {
      name: "MUSIC TASTE",
      href: "https://playlists.playfairs.cc",
      external: true,
    },
  ];

  return (
    <header className="fixed inset-x-0 top-3 z-50 mx-auto w-[min(92vw,48rem)]">
      <nav className="glass-panel flex items-center justify-between px-4 py-2.5 sm:px-5">
        <Link href="/" className="text-[11px] font-semibold uppercase tracking-[0.35em] text-white/90">
          playfairs
        </Link>

        <div className="flex items-center gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const baseClass =
              "px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] transition";

            if (item.external) {
              return (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${baseClass} text-white/60 hover:text-white`}
                >
                  {item.name}
                </a>
              );
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${baseClass} ${
                  isActive ? "text-white" : "text-white/60 hover:text-white"
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
