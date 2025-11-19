import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProfileCard from "../components/ProfileCard";
import Header from "../components/header";
import SocialsPage from "./pages/socials/page";
import "./index.css";

export function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Routes>
          <Route path="/" element={
            <main className="flex items-center justify-center p-4" style={{ minHeight: 'calc(100vh - 60px)' }}>
              <ProfileCard />
            </main>
          } />
          <Route path="/socials" element={<SocialsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
