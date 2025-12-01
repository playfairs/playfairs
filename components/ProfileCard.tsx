"use client"

import { useState, useRef, useEffect } from 'react'

export default function ProfileCard() {
  const [transform, setTransform] = useState('')
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 })
  const [mousePosition, setMousePosition] = useState<{x: number, y: number} | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const avatarRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    if (avatarRef.current && cardRef.current) {
      const avatarRect = avatarRef.current.getBoundingClientRect()
      const cardRect = cardRef.current.getBoundingClientRect()
      setMousePosition({
        x: avatarRect.left + avatarRect.width / 2 - cardRect.left,
        y: avatarRect.top + avatarRect.height / 2 - cardRect.top
      })
    }
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    
    const card = cardRef.current
    const rect = card.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const mouseX = e.clientX - centerX
    const mouseY = e.clientY - centerY
    
    const rotateX = (mouseY / (rect.height / 2)) * -10
    const rotateY = (mouseX / (rect.width / 2)) * 10
    
    const distance = Math.min(1, Math.sqrt(mouseX * mouseX + mouseY * mouseY) / (rect.width / 2))
    
    const intensity = 0.7 + (distance * 0.5)
    
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`)
    
    const glowX = ((e.clientX - rect.left) / rect.width) * 100
    const glowY = ((e.clientY - rect.top) / rect.height) * 100
    
    card.style.setProperty('--glow-opacity', (0.1 + (distance * 0.15)).toString())
    card.style.setProperty('--glow-intensity', intensity.toString())
    card.style.setProperty('--glow-spread', `${8 + (distance * 20)}px`)
    card.style.setProperty('--glow-blur', `${20 + (distance * 40)}px`)
    
    setGlowPosition({ x: glowX, y: glowY })
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)')
    
    if (cardRef.current) {
      cardRef.current.style.setProperty('--glow-opacity', '0.1')
      cardRef.current.style.setProperty('--glow-intensity', '2.7')
      cardRef.current.style.setProperty('--glow-spread', '8px')
      cardRef.current.style.setProperty('--glow-blur', '20px')
    }
    
    if (avatarRef.current && cardRef.current) {
      const avatarRect = avatarRef.current.getBoundingClientRect()
      const cardRect = cardRef.current.getBoundingClientRect()
      setMousePosition({
        x: avatarRect.left + avatarRect.width / 2 - cardRect.left,
        y: avatarRect.top + avatarRect.height / 2 - cardRect.top
      })
    }
    setGlowPosition({ x: 50, y: 25 })
  }

  const orbPosition = mousePosition || { x: 0, y: 0 }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!cardRef.current || !e.touches || e.touches.length === 0) return;
    
    const touch = e.touches[0];
    if (!touch) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    if (
      touch.clientX < rect.left || 
      touch.clientX > rect.right || 
      touch.clientY < rect.top || 
      touch.clientY > rect.bottom
    ) {
      handleMouseLeave();
      return;
    }
    
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = touch.clientX - centerX;
    const mouseY = touch.clientY - centerY;
    
    const rotateX = (mouseY / (rect.height / 2)) * 5;
    const rotateY = (mouseX / (rect.width / 2)) * 5;
    
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`);
    
    const glowX = ((touch.clientX - rect.left) / rect.width) * 100;
    const glowY = ((touch.clientY - rect.top) / rect.height) * 100;
    
    setGlowPosition({ x: glowX, y: glowY });
    setMousePosition({ x: touch.clientX - rect.left, y: touch.clientY - rect.top });
  }

  return (
    <div 
      ref={cardRef}
      className="w-[90vw] sm:w-[80vw] md:w-[700px] lg:w-[576px] mx-auto rounded-xl overflow-hidden transition-all duration-200 ease-out relative group"
      style={{ 
        transform,
        backgroundColor: 'var(--color-card-bg)',
        border: '1px solid var(--color-border)',
        '--glow-opacity': glowPosition.x === 50 && glowPosition.y === 50 ? '0.1' : '0.2',
        '--glow-color': 'var(--color-iris, #c4a7e7)',
        '--glow-color-rgb': '196, 167, 231',
        '--glow-spread': '20px',
        '--glow-blur': '30px',
        '--glow-intensity': '2.7',
        boxShadow: `0 0 var(--glow-blur) calc(var(--glow-spread) / 2) rgba(var(--glow-color-rgb), calc(0.3 * var(--glow-intensity))),
                  0 0 calc(var(--glow-blur) * 1.5) var(--glow-spread) rgba(var(--glow-color-rgb), calc(0.2 * var(--glow-intensity))),
                  inset 0 0 15px rgba(var(--glow-color-rgb), 0.1)`,
        background: `radial-gradient(circle at ${glowPosition.x}% ${glowPosition.y}%, 
          rgba(var(--glow-color-rgb), calc(0.3 * var(--glow-opacity))) 0%, transparent 60%), 
          radial-gradient(circle at 50% 25%, rgba(var(--glow-color-rgb), 0.15) 0%, transparent 40%), 
          var(--color-card-bg)`,
        touchAction: 'pan-y'
      } as React.CSSProperties}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseLeave}
    >
      {isMounted && (
        <div 
          className="absolute pointer-events-none transition-all duration-300 ease-out"
          style={{
            left: `${orbPosition.x}px`,
            top: `${orbPosition.y}px`,
            transform: 'translate(-50%, -50%)',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(196, 167, 231, 0.4) 0%, rgba(196, 167, 231, 0) 70%)',
            borderRadius: '50%',
            filter: 'blur(20px)',
            zIndex: 0,
            opacity: mousePosition && (mousePosition.x !== 0 || mousePosition.y !== 0) ? 0.8 : 0.5,
            transition: 'opacity 0.3s ease-out, left 0.2s ease-out, top 0.2s ease-out',
            willChange: 'left, top, opacity'
          }}
        />
      )}

      <div className="p-4 sm:p-6 md:p-8 relative z-10">
        <div className="flex flex-col items-center">
          <div 
            ref={avatarRef}
            className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full mb-4 sm:mb-5 md:mb-6 overflow-hidden relative z-10"
          >
            <img
              src="https://avatars.githubusercontent.com/playfairs"
              alt="playfairs avatar"
              className="w-full h-full object-cover"
              width={128}
              height={128}
              loading="lazy"
            />
          </div>
          <a 
            href="https://github.com/playfairs" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xl sm:text-2xl font-serif mb-1 sm:mb-2 transition-colors text-center px-2 py-1 rounded-md hover:bg-opacity-10 active:bg-opacity-20"
            style={{ color: 'var(--color-text)' }}
            onTouchStart={(e) => {
              const target = e.currentTarget;
              target.style.color = 'var(--color-primary)';
              setTimeout(() => {
                target.style.color = 'var(--color-text)';
              }, 300);
            }}
            onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
            onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-text)'}
          >
            @playfairs
          </a>
          <div className="w-24 sm:w-32 h-px my-3 sm:my-4 md:my-5" style={{ backgroundColor: 'var(--color-border)' }}></div>
          <p className="text-sm sm:text-base text-center px-2 sm:px-0" style={{ color: 'var(--color-text-muted)' }}>
            hi, I'm still working on this, please be patient or something, idk
          </p>
        </div>
      </div>
    </div>
  )
}
