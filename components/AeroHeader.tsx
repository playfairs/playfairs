import { useTheme } from '../src/contexts/ThemeContext';
import { Link as LinkIcon, Users, BookOpen, Code2, GitBranch } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import startButtonImage from '../src/start.png';
import './AeroHeader.css';

export const AeroHeader = () => {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const wasAero = useRef(theme === 'frutiger-aero');
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const formatTime = useCallback((date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, []);

  useEffect(() => {
    if (theme === 'frutiger-aero') {
      wasAero.current = true;
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else if (wasAero.current) {
      setIsVisible(false);
    }
  }, [theme]);

  if (theme !== 'frutiger-aero' && !wasAero.current) {
    return null;
  }

  return (
    <AnimatePresence>
      {(theme === 'frutiger-aero' || !isVisible) && (
        <motion.div 
          className="aeroHeader"
          initial={{ y: 40, opacity: 0 }}
          animate={isVisible ? { 
            y: 0, 
            opacity: 1,
            transition: { 
              type: 'spring', 
              damping: 20, 
              stiffness: 300 
            } 
          } : { 
            y: 40, 
            opacity: 0,
            transition: { 
              type: 'spring', 
              damping: 30, 
              stiffness: 300 
            } 
          }}
          exit={{ y: 40, opacity: 0 }}
        >
          <Link 
            to="/" 
            className="aeroStartButton" 
            style={{
              background: 'transparent',
              border: 'none',
              padding: '0 8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              height: '100%',
              textDecoration: 'none'
            }}
          >
            <img 
              src={startButtonImage} 
              alt="Start" 
              style={{
                height: '40px',
                width: '40px',
                imageRendering: 'auto',
                filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.3))',
                objectFit: 'contain',
                objectPosition: 'center',
                maxWidth: '100%',
                maxHeight: '100%'
              }}
            />
          </Link>
          
          <div className="aeroToolbar">
            <Link to="/links" className="aeroToolbarItem">
              <LinkIcon size={16} />
              <span>Links</span>
            </Link>
            <Link to="/socials" className="aeroToolbarItem">
              <Users size={16} />
              <span>Socials</span>
            </Link>
            <Link to="/interests" className="aeroToolbarItem">
              <BookOpen size={16} />
              <span>Interests</span>
            </Link>
            <Link to="/workspace" className="aeroToolbarItem">
              <Code2 size={16} />
              <span>Workspace</span>
            </Link>
            <Link to="/git" className="aeroToolbarItem">
              <GitBranch size={16} />
              <span>Git</span>
            </Link>
          </div>

          <div className="aeroTray">
            <div className="aeroTime">
              {formatTime(currentTime)}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AeroHeader;
