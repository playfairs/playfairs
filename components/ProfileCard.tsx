"use client"

import { useState, useRef, useEffect } from 'react'

export default function ProfileCard() {
  const [transform, setTransform] = useState('')
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 })
  const cardRef = useRef<HTMLDivElement>(null)

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
    
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`)
    
    const glowX = ((e.clientX - rect.left) / rect.width) * 100
    const glowY = ((e.clientY - rect.top) / rect.height) * 100
    setGlowPosition({ x: glowX, y: glowY })
  }

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)')
    setGlowPosition({ x: 50, y: 50 })
  }

  return (
    <div 
      ref={cardRef}
      className="w-[576px] mx-auto bg-gray-800 rounded-xl shadow-[0_0_30px_rgba(20,184,166,0.4),0_0_60px_rgba(20,184,166,0.2)] hover:shadow-[0_0_40px_rgba(20,184,166,0.6),0_0_80px_rgba(20,184,166,0.3)] overflow-hidden transition-all duration-200 ease-out border border-teal-500/30 relative"
      style={{ 
        transform,
        background: `radial-gradient(circle at ${glowPosition.x}% ${glowPosition.y}%, rgba(20,184,166,${glowPosition.x === 50 && glowPosition.y === 50 ? '0.08' : '0.25'}) 0%, transparent 60%), radial-gradient(circle at 50% 25%, rgba(20,184,166,0.12) 0%, transparent 40%), rgb(31,41,55)`
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="p-8">
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 rounded-full mb-6 overflow-hidden">
            <img
              src="https://avatars.githubusercontent.com/playfairs"
              alt="playfairs avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <a 
            href="https://github.com/playfairs" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-2xl font-bold text-white mb-2 hover:text-teal-400 transition-colors"
          >
            playfairs.cc
          </a>
          <div className="w-34 h-px bg-gray-600 mb-5"></div>
          <p className="text-gray-300 text-center">
            hi, I'm still working on this, please be patient or something, idk
          </p>
        </div>
      </div>
    </div>
  )
}
