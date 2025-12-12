import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { FiGithub, FiTwitter, FiLinkedin, FiMail, FiArrowRight, FiSun, FiMoon } from 'react-icons/fi';
import { motion, useScroll, useTransform } from 'framer-motion';
import ProfileCard from "../components/ProfileCard";
import NowPlaying from "../components/NowPlaying";
import Header from "../components/header";
import SocialsPage from "./pages/socials/page";
import GitPage from "./pages/git/page";
import LinksPage from "./pages/links/page";
import WorkspacePage from "./pages/workspace/page";
import InterestsPage from "./pages/interests/page";
import ThemesPage from "./pages/themes/page";
import { useTheme, ThemeProvider } from './contexts/ThemeContext';

const themeGradient = 'from-[var(--gradient-1)] via-[var(--gradient-2)] to-[var(--gradient-3)]';
import AeroHeader from '../components/AeroHeader';
import "./index.css";
import cursorImage from "./cursor.png";

const Section = ({ title, children, id }: { title: string; children: React.ReactNode; id?: string }) => {
  const { theme } = useTheme();
  
  return (
    <section id={id} className="py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-5xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
          <span style={{ color: 'var(--color-primary)' }}>{title}</span>
        </h2>
        <div className="space-y-6">
          {children}
        </div>
      </div>
    </section>
  );
};

const ProjectCard = ({ title, description, tags, href }: { title: string; description: string; tags: string[]; href: string }) => (
  <motion.div 
    whileHover={{ y: -5, scale: 1.02 }}
    className="glass-card p-6 transition-all duration-300 relative overflow-hidden group"
    style={{ 
      backdropFilter: 'blur(15px) saturate(180%)',
      WebkitBackdropFilter: 'blur(15px) saturate(180%)',
      border: '1px solid rgba(255, 255, 255, 0.5)',
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.6), 0 0 20px rgba(0, 153, 255, 0.1)'
    }}
  >
    <div className="relative z-10">
      <h3 className="text-xl font-semibold mb-2 text-[#003366] flex items-center">
        {title}
        <span className="ml-2 text-sm px-2 py-0.5 rounded-full bg-blue-100 text-blue-600">
          New
        </span>
      </h3>
      <p className="text-sm mb-4 text-[#4a6b8a]">{description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag) => (
          <span 
            key={tag} 
            className="text-xs px-3 py-1 rounded-full font-medium"
            style={{ 
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(230,240,255,0.9))',
              color: '#0066cc',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-white/20">
        <a 
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200"
          style={{
            background: 'linear-gradient(to bottom, #ffffff, #e6f2ff)',
            color: '#0066cc',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8)'
          }}
        >
          View Project <FiArrowRight className="ml-1.5 transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </div>
    <div className="absolute inset-0 bg-linear-to-br from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
  </motion.div>
);

const SocialLink = ({ 
  icon: Icon, 
  href, 
  label, 
  minimal = false 
}: { 
  icon: React.ElementType; 
  href: string; 
  label: string;
  minimal?: boolean;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const isFrutigerAero = typeof document !== 'undefined' && document.documentElement.classList.contains('theme-frutiger-aero');
  
  const baseStyles = {
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.2s ease-in-out',
    cursor: 'crosshair',
    ...(minimal ? {
      padding: '0.5rem',
      color: isHovered ? 'var(--color-primary)' : 'rgb(156, 163, 175)',
      ...(isFrutigerAero ? {
        width: '2.5rem',
        height: '2.5rem',
        borderRadius: '9999px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.3)' : 'transparent',
        transform: isHovered ? 'scale(1.1)' : 'scale(1)',
        boxShadow: isHovered ? '0 0 10px rgba(0, 0, 0, 0.2)' : 'none'
      } : {})
    } : {
      padding: '0.75rem',
      borderRadius: '0.5rem',
      backgroundColor: 'var(--color-card-bg)',
      color: 'var(--color-text)',
      '&:hover': {
        backgroundColor: 'var(--color-card-hover)'
      }
    })
  } as React.CSSProperties;
  
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      style={baseStyles}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Icon 
        size={20} 
        className={minimal ? (isFrutigerAero ? 'w-5 h-5' : '') : 'mr-3'}
        style={{ pointerEvents: 'none' }}
      />
      {!minimal && <span>{label}</span>}
    </a>
  );
};

export function App() {
  const { theme, setTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    
    const cursorStyle = `url('${cursorImage}'), auto`;
    
    const setCursorStyle = () => {
      document.documentElement.style.cursor = cursorStyle;
      document.body.style.cursor = cursorStyle;
    };

    setCursorStyle();

    const observer = new MutationObserver(() => {
      setCursorStyle();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style'],
      subtree: true,
    });

    const handleFocus = () => setCursorStyle();
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setCursorStyle();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('mouseenter', handleFocus);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('mouseenter', handleFocus);
    };
  }, [cursorImage]);

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark' : ''}`}>
      <div 
        className="fixed inset-0 z-0" 
        style={{
          background: 'radial-gradient(circle at center, var(--color-primary) 0%, transparent 70%)',
          opacity: 0.2
        }}
      />
      <audio id="background-music" loop>
        <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <div className="relative z-10 flex-1">
        <Router>
          <Header />
          <AeroHeader />
          <Routes>
            <Route path="/" element={
              <main className="flex-1 flex flex-col justify-start pt-1 md:pt-1 bg-inherit">
                <section className="relative py-12 md:py-16 overflow-hidden">
                  <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="relative group">
                          <div className="absolute inset-0 rounded-full bg-linear-to-br from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="relative p-0.5 rounded-full bg-linear-to-br from-(--gradient-1) via-(--gradient-2) to-(--gradient-3) animate-gradient-xy">
                            <div className="relative p-0.5 rounded-full bg-linear-to-br from-white/10 to-white/5 backdrop-blur-sm">
                              <img
                                src="https://avatars.githubusercontent.com/playfairs"
                                alt="playfairs avatar"
                                className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full object-cover border-2 border-white/10 shadow-lg group-hover:border-white/20 transition-all duration-300 group-hover:scale-105"
                                width={128}
                                height={128}
                                loading="lazy"
                              />
                            </div>
                            <div className="absolute inset-0 rounded-full bg-linear-to-br from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>
                        </div>
                      
                      <div className="space-y-4">
                            <h1 className="text-2xl sm:text-3xl font-bold">
                              <a 
                                href="https://github.com/playfairs" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center transition-colors"
                                style={{ 
                                  color: 'var(--color-text)', 
                                  textDecoration: 'none',
                                  '--tw-text-opacity': '1',
                                  '--tw-border-opacity': '1'
                                } as React.CSSProperties}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.color = 'var(--color-primary)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.color = 'var(--color-text)';
                                }}
                              >
                                @playfairs
                              </a>
                            </h1>
                            <p className="text-gray-400">
                              meow
                            </p>
                          </div>
                          
                          <div className="flex justify-center space-x-2">
                            <SocialLink 
                              icon={FiGithub} 
                              href="https://github.com/playfairs" 
                              label="GitHub" 
                              minimal 
                            />
                            <SocialLink 
                              icon={FiMail} 
                              href="mailto:root@playfairs.cc" 
                              label="Email" 
                              minimal 
                            />
                            <Link 
                              to="/themes"
                              className="flex items-center justify-center p-2 text-gray-400 transition-all duration-200"
                              style={{
                                width: '2.5rem',
                                height: '2.5rem',
                                borderRadius: '9999px',
                                color: 'rgb(156, 163, 175)',
                                cursor: 'crosshair',
                                transition: 'all 0.2s ease-in-out',
                                ...(document.documentElement.classList.contains('theme-frutiger-aero') ? {
                                  backgroundColor: 'transparent',
                                  '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                    transform: 'scale(1.1)',
                                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)'
                                  }
                                } : {})
                              } as React.CSSProperties}
                              onMouseOver={(e) => {
                                e.currentTarget.style.color = 'var(--color-primary)';
                                if (document.documentElement.classList.contains('theme-frutiger-aero')) {
                                  e.currentTarget.style.transform = 'scale(1.1)';
                                  e.currentTarget.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';
                                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                                }
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.color = 'rgb(156, 163, 175)';
                                if (document.documentElement.classList.contains('theme-frutiger-aero')) {
                                  e.currentTarget.style.transform = 'scale(1)';
                                  e.currentTarget.style.boxShadow = 'none';
                                  e.currentTarget.style.backgroundColor = 'transparent';
                                }
                              }}
                            >
                              <FiSun className="w-5 h-5" style={{ pointerEvents: 'none' }} />
                              <span className="sr-only">Themes</span>
                            </Link>
                          </div>
                          
                          <div className="w-full max-w-4xl mx-auto">
                            <div className="text-left pl-4 sm:pl-6">
                              <NowPlaying />
                            </div>
                          </div>
                      </div>
                    </div>
                  </div>
                </section>

                <Section title="README">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                      <p className="mb-4">
                        Hello! I'm <a 
                          href="https://github.com/playfairs" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="transition-colors hover:opacity-80 hover:text-(--color-primary)"
                          style={{ 
                            color: 'var(--color-primary)',
                            textDecoration: 'none' 
                          }}
                        >playfairs</a>, a pretty stupid developer who likes to start a project then forgets about it like a week later, you can probably tell 
                        that this website was made with absolutely no thought of people's CPU usage.
                      </p>
                      <p className="mb-6">
                        All I really ever do is code, so in the offchances that I'm not coding, you can find me conjuring new bullshit, single-handedly
                        contributing to the destruction of LastFM's API (wait was that supposed to go in there), or enjoying my other{' '}
                        <Link 
                          to="/interests" 
                          className="transition-colors hover:opacity-80 hover:text-(--color-primary)"
                          style={{ 
                            color: 'var(--color-primary)',
                            textDecoration: 'none',
                            '--tw-text-opacity': '1',
                            '--tw-border-opacity': '1',
                            cursor: 'pointer',
                            transition: 'color 0.2s ease-in-out'
                          } as React.CSSProperties}
                        >
                          interests
                        </Link>.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { 
                          name: 'TypeScript', 
                          url: 'https://www.typescriptlang.org/',
                          color: '#3178c6',
                          hoverGlow: '0 0 10px rgba(49, 120, 198, 0.7)'
                        },
                        { 
                          name: 'React', 
                          url: 'https://reactjs.org/',
                          color: '#61dafb',
                          hoverGlow: '0 0 10px rgba(97, 218, 251, 0.7)'
                        },
                        { 
                          name: 'Bun', 
                          url: 'https://bun.sh/',
                          color: '#f472b6',
                          hoverGlow: '0 0 10px rgba(244, 114, 182, 0.7)'
                        },
                        { 
                          name: 'Next.js', 
                          url: 'https://nextjs.org/',
                          color: '#000000',
                          hoverGlow: '0 0 10px rgba(0, 0, 0, 0.3)'
                        },
                        { 
                          name: 'Tailwind CSS', 
                          url: 'https://tailwindcss.com/',
                          color: '#38bdf8',
                          hoverGlow: '0 0 10px rgba(56, 189, 248, 0.7)'
                        },
                        { 
                          name: 'Python', 
                          url: 'https://www.python.org/',
                          color: '#3776ab',
                          hoverGlow: '0 0 10px rgba(55, 118, 171, 0.7)'
                        },
                        { 
                          name: 'Rust', 
                          url: 'https://www.rust-lang.org/',
                          color: '#ce412b',
                          hoverGlow: '0 0 10px rgba(206, 65, 43, 0.7)'
                        },
                        { 
                          name: 'Nix', 
                          url: 'https://www.nixos.org/',
                          color: '#7e7eff',
                          hoverGlow: '0 0 10px rgba(126, 126, 255, 0.7)'
                        }
                      ].map((skill) => (
                        <a
                          key={skill.name}
                          href={skill.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-4 rounded-lg text-center block transition-all duration-300 hover:scale-105"
                          style={{ 
                            backgroundColor: 'var(--color-card-bg)',
                            border: '1px solid var(--color-border)',
                            color: 'var(--color-text)',
                            boxShadow: 'none',
                            transition: 'all 0.3s ease, box-shadow 0.3s ease, color 0.3s ease',
                            fontWeight: 500
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.boxShadow = skill.hoverGlow;
                            e.currentTarget.style.borderColor = skill.color;
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.boxShadow = 'none';
                            e.currentTarget.style.borderColor = 'var(--color-border)';
                          }}
                        >
                          {skill.name}
                        </a>
                      ))}
                    </div>
                  </div>
                </Section>

                {/* Featured Projects, commented out bc honestly might keep this
                <Section title="Featured Projects">
                  <div className="grid md:grid-cols-2 gap-6">
                    <ProjectCard 
                      title="ByteLabs"
                      description="A Tauri + Rust DAW that allows people to create music from literal bytes."
                      tags={["Tauri", "Rust", "Tailwind CSS"]}
                      href="https://bytelabs.uk"
                    />
                    <ProjectCard 
                      title="Vortex"
                      description="Vortex, An all-in-one Discord bot designed to streamline, manage, and elevate your Discord server experience."
                      tags={["discord.py", "Python", "PostgreSQL"]}
                      href="https://vortex.playfairs.cc"
                    />
                  </div>
                  <div className="text-center mt-8">
                    <Link 
                      to="https://github.com/playfairs?tab=repositories" 
                      className="inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors hover:bg-opacity-90"
                      style={{ 
                        backgroundColor: 'var(--color-primary)', 
                        color: 'var(--color-text-inverse)' 
                      }}
                    >
                      View All Projects <FiArrowRight className="ml-2" />
                    </Link>
                  </div>
                </Section>
                */}
              </main>
            } />
            <Route path="/socials" element={
              <main className="flex-1 pt-4 md:pt-8 bg-inherit">
                <SocialsPage />
              </main>
            } />
            <Route path="/git" element={
              <main className="flex-1 pt-4 md:pt-8 bg-inherit">
                <GitPage />
              </main>
            } />
            <Route path="/links" element={
              <main className="flex-1 pt-4 md:pt-8 bg-inherit">
                <LinksPage />
              </main>
            } />
            <Route path="/workspace" element={
              <main className="flex-1 pt-4 md:pt-8 bg-inherit">
                <WorkspacePage />
              </main>
            } />
            <Route path="/interests" element={
              <main className="flex-1 pt-4 md:pt-8 bg-inherit">
                <InterestsPage />
              </main>
            } />
            <Route path="/themes" element={
              <main className="flex-1 flex flex-col justify-start pt-1 md:pt-1 bg-inherit">
                <ThemesPage />
              </main>
            } />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

const AppWithProviders = () => {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
};

export default AppWithProviders;
