"use client";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

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
      className="relative text-sm font-medium text-gray-300 hover:text-teal-400 transition-colors duration-200 py-2 group"
    >
      {children}
      <span
        className={`absolute bottom-0 left-0 right-0 h-0.5 bg-teal-400 transform origin-center transition-transform duration-300 ease-out ${
          isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-65"
        }`}
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
      className={`px-3 py-2 rounded-md transition-colors duration-200 ${
        isActive
          ? "bg-teal-400/10 text-teal-400 font-medium"
          : "hover:bg-gray-800/50"
      }`}
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
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className={isScrolled ? "h-16" : "h-20"} />
      <div className="fixed top-0 left-0 right-0 overflow-hidden">
        <div 
          className={`absolute inset-0 transition-all duration-300 ${
            isScrolled ? 'bg-gray-900/95' : 'bg-transparent'
          }`}
          style={{
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        />
        <div className="relative z-10 border-b border-gray-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-white">playfairs.cc</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              <NavLink href="/">Home</NavLink>
              <NavLink href="/links">Links</NavLink>
              <NavLink href="/socials">Socials</NavLink>
              <NavLink href="/git">Git</NavLink>
            </nav>

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
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <MobileNavLink href="/" onClick={() => setOpen(false)}>Home</MobileNavLink>
              <MobileNavLink href="/links" onClick={() => setOpen(false)}>Links</MobileNavLink>
              <MobileNavLink href="/socials" onClick={() => setOpen(false)}>Socials</MobileNavLink>
              <MobileNavLink href="/git" onClick={() => setOpen(false)}>Git</MobileNavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
  );
}