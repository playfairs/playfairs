"use client";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import ThemeSelector from "../src/components/ThemeSelector";

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const location = useLocation();
  const isActive = location.pathname === href || 
                  (href !== "/" && location.pathname.startsWith(href));

  return (
    <Link
      to={href}
      className="relative text-sm font-medium py-2 group transition-colors duration-200"
      style={{
        color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
        '--hover-color': 'var(--color-primary)',
      } as React.CSSProperties}
      onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
      onMouseOut={(e) => e.currentTarget.style.color = isActive ? 'var(--color-primary)' : 'var(--color-text-muted)'}
    >
      {children}
      <span
        className={`absolute bottom-0 left-0 right-0 h-0.5 transform origin-center transition-transform duration-300 ease-out ${
          isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-65"
        }`}
        style={{ backgroundColor: 'var(--color-primary)' }}
      />
    </Link>
  );
}

function MobileNavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const location = useLocation();
  const isActive = location.pathname === href || 
                  (href !== "/" && location.pathname.startsWith(href));

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick();
    }
    setTimeout(() => {
      const menuButton = document.querySelector('[aria-expanded="true"]') as HTMLButtonElement;
      if (menuButton) {
        menuButton.click();
      }
    }, 100);
  };

  return (
    <Link
      to={href}
      onClick={handleClick}
      className="px-3 py-2 rounded-md transition-colors duration-200 block w-full text-left"
      style={{
        backgroundColor: isActive ? 'var(--color-primary-faded)' : 'transparent',
        color: isActive ? 'var(--color-primary)' : 'var(--color-text)',
        '--hover-bg': 'var(--color-bg-hover)',
      } as React.CSSProperties}
      onMouseOver={(e) => {
        if (!isActive) e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)';
      }}
      onMouseOut={(e) => {
        if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      {children}
    </Link>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 left-0 right-0 z-50">
      <div style={{ height: isScrolled ? '4rem' : '5rem' }} />
      <div className="absolute top-0 left-0 right-0">
        <div 
          className={`w-full transition-all duration-300`}
          style={{
            backgroundColor: isScrolled ? 'rgba(var(--color-bg-rgb), 0.95)' : 'rgba(var(--color-bg-rgb), 0.8)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            position: 'relative',
          }}
        >
          <div 
            className="absolute bottom-0 left-0 right-0 h-px"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, var(--color-border) 15%, var(--color-border) 85%, transparent 100%)',
              opacity: 0.7,
            }}
          />
          <div className="relative z-10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16 w-full">
                <div className="flex items-center">
                  <Link 
                    to="/" 
                    className="shrink-0"
                    onClick={() => setOpen(false)}
                  >
                    <span className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>playfairs.cc</span>
                  </Link>
                </div>

                <div className="hidden lg:flex items-center ml-auto">
                  <div className="flex items-center space-x-6">
                    <NavLink href="/">Home</NavLink>
                    <NavLink href="/links">Links</NavLink>
                    <NavLink href="/socials">Socials</NavLink>
                    <NavLink href="/interests">Interests</NavLink>
                    <NavLink href="/workspace">Workspace</NavLink>
                    <NavLink href="/git">Git</NavLink>
                  </div>
                </div>
                
                <div className="lg:hidden flex items-center ml-auto">
                  <div className="flex-1 lg:hidden" />
                  <button
                    onClick={() => setOpen(!open)}
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none"
                    aria-expanded={open}
                    aria-label="Toggle navigation menu"
                  >
                    <span className="sr-only">menu</span>
                    <svg
                      className={`${open ? 'hidden' : 'block'} h-6 w-6`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <svg
                      className={`${open ? 'block' : 'hidden'} h-6 w-6`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div className="flex-1 lg:hidden" />
                </div>
              </div>

              <div className={`lg:hidden transition-all duration-300 ease-in-out ${open ? 'max-h-96' : 'max-h-0 overflow-hidden'}`}>
                <div className="flex flex-col space-y-1 py-2">
                  <MobileNavLink href="/" onClick={() => setOpen(false)}>Home</MobileNavLink>
                  <MobileNavLink href="/interests" onClick={() => setOpen(false)}>Interests</MobileNavLink>
                  <MobileNavLink href="/workspace" onClick={() => setOpen(false)}>Workspace</MobileNavLink>
                  <MobileNavLink href="/links" onClick={() => setOpen(false)}>Links</MobileNavLink>
                  <MobileNavLink href="/socials" onClick={() => setOpen(false)}>Socials</MobileNavLink>
                  <MobileNavLink href="/git" onClick={() => setOpen(false)}>Git</MobileNavLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}