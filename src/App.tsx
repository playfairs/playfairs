import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProfileCard from "../components/ProfileCard";
import NowPlaying from "../components/NowPlaying";
import Header from "../components/header";
import SocialsPage from "./pages/socials/page";
import GitPage from "./pages/git/page";
import "./index.css";

export function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900">
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
