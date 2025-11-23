import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ProfileCard from "../components/ProfileCard";
import NowPlaying from "../components/NowPlaying";
import Header from "../components/header";
import SocialsPage from "./pages/socials/page";
import GitPage from "./pages/git/page";
import LinksPage from "./pages/links/page";
import { ThemeProvider } from './contexts/ThemeContext';
import "./index.css";
import cursorImage from "./cursor.png";

export function App() {
  const [showEntryButton, setShowEntryButton] = useState(() => {
    const navigationEntries = performance.getEntriesByType('navigation');
    const isReload = navigationEntries.length > 0 && 
                    (navigationEntries[0] as PerformanceNavigationTiming).type === 'reload';
    
    const hasEntered = sessionStorage.getItem('hasEntered');
    
    return isReload || !hasEntered;
  });

  const [showMainContent, setShowMainContent] = useState(!(() => {
    const navigationEntries = performance.getEntriesByType('navigation');
    const isReload = navigationEntries.length > 0 && 
                    (navigationEntries[0] as PerformanceNavigationTiming).type === 'reload';
    const hasEntered = sessionStorage.getItem('hasEntered');
    return isReload || !hasEntered;
  })());

  useEffect(() => {
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
      observer.disconnect();
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('mouseenter', handleFocus);
    };
  }, [cursorImage]);

  const handleEnterClick = () => {
    setShowEntryButton(false);
    setShowMainContent(true);
    sessionStorage.setItem('hasEntered', 'true');
  };

  if (showEntryButton) {
    return (
      <div className="min-h-screen bg-gray-900 relative">
        <div className="absolute inset-0 backdrop-blur-xl bg-black/40"></div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={handleEnterClick}
            className="px-6 py-2 bg-white/5 backdrop-blur-2xl border border-white/30 text-white font-medium text-sm rounded-xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:bg-white/10 hover:border-white/40 hover:shadow-white/10"
          >
            Click to enter...
          </button>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <div
        className="min-h-screen flex flex-col"
        style={{
          cursor: `url(${cursorImage}), auto`,
          background: 'var(--color-bg)',
          color: 'var(--color-text)',
        }}
      >
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute inset-0 opacity-0 transition-opacity duration-1000"
            style={{
              background: `radial-gradient(circle at center, var(--color-primary) 0%, transparent 70%)`,
              opacity: showEntryButton ? 0 : 0.2
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
                  <main className="flex-1 flex flex-col justify-start pt-20 bg-inherit">
                    <div className="container mx-auto px-4 py-6">
                      <div className="max-w-2xl mx-auto space-y-8">
                        <ProfileCard />
                        <NowPlaying />
                      </div>
                    </div>
                  </main>
                } />
                <Route path="/socials" element={
                  <main className="flex-1 pt-20 bg-inherit">
                    <SocialsPage />
                  </main>
                } />
                <Route path="/git" element={
                  <main className="flex-1 pt-20 bg-inherit">
                    <GitPage />
                  </main>
                } />
                <Route path="/links" element={
                  <main className="flex-1 pt-20 bg-inherit">
                    <LinksPage />
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
