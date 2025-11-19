import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import ProfileCard from "../components/ProfileCard";
import NowPlaying from "../components/NowPlaying";
import Header from "../components/header";
import SocialsPage from "./pages/socials/page";
import GitPage from "./pages/git/page";
import LinksPage from "./pages/links/page";
import "./index.css";

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
    showMainContent && (
      <div className="min-h-screen bg-gray-900 transition-opacity duration-1000 ease-in-out opacity-0 animate-fade-in">
        <audio id="nova-audio" loop>
          <source src="https://media.playfairs.cc/badapple.mp3" type="audio/mpeg" />
        </audio>
        <Router>
          <div className="min-h-screen">
            <Header />
            <Routes>
              <Route path="/" element={
                <main className="flex flex-col items-center justify-center p-4 pt-20" style={{ minHeight: 'calc(100vh - 60px)' }}>
                  <ProfileCard />
                  <NowPlaying />
                </main>
              } />
              <Route path="/socials" element={<div className="pt-20"><SocialsPage /></div>} />
              <Route path="/git" element={<div className="pt-20"><GitPage /></div>} />
              <Route path="/links" element={<div className="pt-20"><LinksPage /></div>} />
            </Routes>
          </div>
        </Router>
      </div>
    )
  );
}

export default App;
