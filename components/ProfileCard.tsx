"use client"

import { useState, useRef, useEffect } from 'react'

export default function ProfileCard() {
  const [transform, setTransform] = useState('')
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
  }

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)')
  }

  return (
    <div 
      ref={cardRef}
      className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-200 ease-out"
      style={{ transform }}
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
            className="text-2xl font-bold text-gray-900 mb-2 hover:text-teal-600 transition-colors"
          >
            playfairs.cc
          </a>
          <div className="w-34 h-px bg-gray-400 mb-5"></div>
          <p className="text-gray-600 text-center">
            Welcome to my personal portfolio
          </p>
        </div>
      </div>
    </div>
  )
}
