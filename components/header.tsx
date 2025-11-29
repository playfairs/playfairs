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

  return (
    <Link
      to={href}
      onClick={onClick}
      className="px-3 py-2 rounded-md transition-colors duration-200"
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
          className={`w-full transition-all duration-300 border-b`}
          style={{
            backgroundColor: isScrolled ? 'rgba(var(--color-bg-rgb), 0.95)' : 'rgba(var(--color-bg-rgb), 0.8)',
            borderColor: 'var(--color-border)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        >
          <div className="relative z-10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center h-16 w-full">
                <Link to="/" className="shrink-0">
                  <span className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>playfairs.cc</span>
                </Link>

                <div className="flex-1" />

                <div className="absolute left-1/2 transform -translate-x-1/2">
                  <ThemeSelector />
                </div>

                <div className="hidden md:flex items-center space-x-8">
                  <div className="h-6 w-px" style={{ backgroundColor: 'var(--color-border)' }} />
                  <div className="hidden md:flex items-center space-x-8 ml-8">
                    <NavLink href="/">Home</NavLink>
                    <NavLink href="/links">Links</NavLink>
                    <NavLink href="/socials">Socials</NavLink>
                    <NavLink href="/git">Git</NavLink>
                    <NavLink href="/workspace">Workspace</NavLink>
                  </div>
                </div>

                <div className="md:hidden">
                  <button
                    onClick={() => setOpen(!open)}
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none"
                    aria-expanded="false"
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
                </div>
              </div>

              <div className={`md:hidden transition-all duration-300 ease-in-out ${open ? 'max-h-96' : 'max-h-0 overflow-hidden'}`}>
                <div className="flex flex-col space-y-2 py-2">
                  <MobileNavLink href="/" onClick={() => setOpen(false)}>Home</MobileNavLink>
                  <MobileNavLink href="/socials" onClick={() => setOpen(false)}>Socials</MobileNavLink>
                  <MobileNavLink href="/git" onClick={() => setOpen(false)}>Git</MobileNavLink>
                  <MobileNavLink href="/links" onClick={() => setOpen(false)}>Links</MobileNavLink>
                  <MobileNavLink href="/workspace" onClick={() => setOpen(false)}>Workspace</MobileNavLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}