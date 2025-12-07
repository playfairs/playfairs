import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { FiGithub, FiTwitter, FiLinkedin, FiMail, FiArrowRight } from 'react-icons/fi';
import { motion, useScroll, useTransform } from 'framer-motion';
import ProfileCard from "../components/ProfileCard";
import NowPlaying from "../components/NowPlaying";
import Header from "../components/header";
import SocialsPage from "./pages/socials/page";
import GitPage from "./pages/git/page";
import LinksPage from "./pages/links/page";
import WorkspacePage from "./pages/workspace/page";
import InterestsPage from "./pages/interests/page";
import { ThemeProvider } from './contexts/ThemeContext';
import "./index.css";
import cursorImage from "./cursor.png";

const Section = ({ title, children, id }: { title: string; children: React.ReactNode; id?: string }) => (
  <section id={id} className="py-16 md:py-24">
    <div className="container mx-auto px-4 max-w-5xl">
      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center font-serif">
        {title}
      </h2>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  </section>
);

const ProjectCard = ({ title, description, tags, href }: { title: string; description: string; tags: string[]; href: string }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="rounded-xl p-6 transition-all duration-300"
    style={{ backgroundColor: 'var(--color-card-bg)', border: '1px solid var(--color-border)' }}
  >
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>{description}</p>
    <div className="flex flex-wrap gap-2 mb-4">
      {tags.map((tag) => (
        <span 
          key={tag} 
          className="text-xs px-2 py-1 rounded-full"
          style={{ backgroundColor: 'var(--color-primary-soft)', color: 'var(--color-primary)' }}
        >
          {tag}
        </span>
      ))}
    </div>
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="inline-flex items-center text-sm font-medium"
      style={{ color: 'var(--color-primary)' }}
    >
      View Project <FiArrowRight className="ml-1" />
    </a>
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
}) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer"
    className={`flex items-center transition-colors ${
      minimal 
        ? 'p-2 text-gray-400 hover:text-purple-500' 
        : 'p-3 rounded-lg hover:bg-opacity-10'
    }`}
    style={!minimal ? { backgroundColor: 'var(--color-card-bg)' } : {}}
  >
    <Icon className={minimal ? '' : 'mr-3'} size={20} />
    {!minimal && <span>{label}</span>}
  </a>
);

export function App() {
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
    <ThemeProvider>
      <div
        className={`min-h-screen flex flex-col transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{
          cursor: `url(${cursorImage}), auto`,
          background: 'var(--color-bg)',
          color: 'var(--color-text)',
        }}
      >
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute inset-0 transition-opacity duration-1000"
            style={{
              background: `radial-gradient(circle at center, var(--color-primary) 0%, transparent 70%)`,
              opacity: 0.2
            }}
          />
        </div>
        <div className="relative z-10 flex-1 flex flex-col bg-inherit">
          <audio id="background-music" loop>
            <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
          <Router>
            <Header />
              <Routes>
                <Route path="/" element={
                  <main className="flex-1 flex flex-col justify-start pt-1 md:pt-1 bg-inherit">
                    <section className="relative py-12 md:py-16 overflow-hidden">
                      <div className="container mx-auto px-4 relative z-10">
                        <div className="max-w-4xl mx-auto text-center space-y-8">
                          <div className="flex justify-center">
                            <div className="relative group">
                              <div className="absolute -inset-1 rounded-full bg-linear-to-r from-purple-600 to-pink-600 opacity-75 group-hover:opacity-100 blur transition duration-200"></div>
                              <div className="relative">
                                <img
                                  src="https://avatars.githubusercontent.com/playfairs"
                                  alt="playfairs avatar"
                                  className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full object-cover border-4"
                                  style={{ borderColor: 'var(--color-primary)' }}
                                  width={128}
                                  height={128}
                                  loading="lazy"
                                />
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <h1 className="text-2xl sm:text-3xl font-bold font-serif">
                              <a 
                                href="https://github.com/playfairs" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center hover:text-purple-500 transition-colors"
                              >
                                @playfairs
                              </a>
                            </h1>
                            <p className="text-gray-400">
                              Software + Web Developer & Distro Hopper (lol)
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
                          </div>
                          
                          <div className="w-full max-w-4xl mx-auto">
                            <div className="text-left pl-4 sm:pl-6">
                              <NowPlaying />
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
                              className="transition-colors hover:opacity-80"
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
                              className="transition-colors hover:opacity-80"
                              style={{ 
                                color: 'var(--color-primary)',
                                textDecoration: 'none' 
                              }}
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
                                color: '#ffffff',
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
                          className="inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors"
                          style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
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
              </Routes>
          </Router>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
