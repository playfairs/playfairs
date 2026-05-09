'use client';

import { useState, useEffect } from 'react';

import Image from 'next/image';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faArrowRight,
  faArrowLeft
} from "@fortawesome/free-solid-svg-icons";
import { 
  SiRust, SiNixos, SiZig, SiC, SiPython, SiReact, SiVim, SiGit, 
  SiDocker, SiLinux, SiArchlinux, SiApple, SiUbuntu, SiAndroid, SiSpotify,
  SiFirefox, SiDiscord, SiGnubash
} from "react-icons/si";
import Header from "@/components/Header";

interface TechItem {
  name: string;
  icon: string;
  description: string;
  color: string;
  url?: string;
}

interface TechStackData {
  languages: TechItem[];
  software: TechItem[];
  hardware: TechItem[];
}

export default function TechStack() {
  const [activeTab, setActiveTab] = useState('languages');
  const [techData, setTechData] = useState<TechStackData | null>(null);
  const [loading, setLoading] = useState(true);

  
  const tabs = [
    { id: 'languages', label: 'LANGUAGES' },
    { id: 'software', label: 'SOFTWARE & UTILS' },
    { id: 'hardware', label: 'HARDWARE' }
  ];

  const getTechIcon = (iconName: string) => {
    switch (iconName) {
      case 'SiRust': return SiRust;
      case 'SiNixos': return SiNixos;
      case 'SiZig': return SiZig;
      case 'SiC': return SiC;
      case 'SiPython': return SiPython;
      case 'SiReact': return SiReact;
      case 'SiVim': return SiVim;
      case 'SiVisualstudio': return SiGit;
      case 'SiGit': return SiGit;
      case 'SiDocker': return SiDocker;
      case 'SiLinux': return SiLinux;
      case 'SiArchlinux': return SiArchlinux;
      case 'SiApple': return SiApple;
      case 'SiWindows': return SiApple;
      case 'SiUbuntu': return SiUbuntu;
      case 'SiAndroid': return SiAndroid;
      case 'SiSpotify': return SiSpotify;
      case 'SiFirefox': return SiFirefox;
      case 'SiDiscord': return SiDiscord;
      case 'SiGnubash': return SiGnubash;
      default: return SiRust;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const response = await fetch('/data/techstack.json');
        const data = await response.json();

        setTechData(data);
      } catch (error) {
        console.error('Failed to load tech stack data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:50px_50px] opacity-20" />
      
      <Header />

      <main className="relative min-h-screen flex items-center justify-center p-6 pt-24">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        
        <div className="relative z-10 w-full max-w-4xl animate-fade-in">
          <div className="relative group">
                        
            <div className="relative bg-black/60 backdrop-blur-2xl rounded-3xl p-8 md:p-10 border border-white/10 shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 ease-in-out">
              <div className="flex items-center gap-6 mb-10">
                <button
                  onClick={() => window.history.back()}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 group"
                >
                  <FontAwesomeIcon 
                    icon={faArrowLeft} 
                    className="w-4 h-4 text-white/60 group-hover:text-white/80 transition-colors duration-300" 
                  />
                </button>
                <div className="flex-1 min-w-0">
                  <h1 className="text-3xl font-light text-white tracking-wider mb-1 animate-slide-in group-hover/header:text-blue-400 transition-all duration-500">Tech Stack</h1>
                  <p className="text-white/60 text-sm font-light animate-slide-in-delayed group-hover/header:text-white/80 transition-all duration-500">Languages, software, and hardware I use</p>
                </div>
              </div>

              <div className="flex gap-2 mb-8 bg-white/5 rounded-xl p-1.5 backdrop-blur-sm">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-3 px-6 rounded-lg text-sm font-medium tracking-wide transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'text-white bg-white/10'
                        : 'text-white/50 hover:text-white/70 hover:bg-white/5'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {activeTab === 'languages' && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 transition-all duration-500 ease-in-out">
                  {loading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="p-6 rounded-xl bg-white/5">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-white/10 rounded-lg" />
                          <div className="h-4 bg-white/10 rounded w-24" />
                        </div>
                        <div className="h-3 bg-white/5 rounded w-full" />
                      </div>
                    ))
                  ) : (
                    techData?.languages?.map((item: TechItem, index: number) => (
                      <div
                        key={index}
                        className="group relative p-6 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 border border-transparent hover:border-white/10 transform hover:scale-105"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        <div className="relative z-10">
                          <div className="flex items-center gap-3 mb-4">
                            <div 
                              className="w-12 h-12 rounded-lg flex items-center justify-center shadow-lg transform transition-transform duration-300 group-hover:scale-110"
                              style={{ backgroundColor: item.color + '20', border: `2px solid ${item.color}40` }}
                            >
                              {(() => {
                                const IconComponent = getTechIcon(item.icon);
                                return <IconComponent 
                                  className="w-6 h-6"
                                  style={{ color: item.color }}
                                />;
                              })()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-white font-medium tracking-wide truncate">{item.name}</h3>
                            </div>
                          </div>
                          
                          <p className="text-white/70 text-sm leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'software' && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 transition-all duration-500 ease-in-out">
                  {loading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="p-6 rounded-xl bg-white/5">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-white/10 rounded-lg" />
                          <div className="h-4 bg-white/10 rounded w-24" />
                        </div>
                        <div className="h-3 bg-white/5 rounded w-full" />
                      </div>
                    ))
                  ) : (
                    techData?.software?.map((item: TechItem, index: number) => (
                      <div
                        key={index}
                        className={`group relative p-6 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 border border-transparent hover:border-white/10 transform hover:scale-105 ${
                          item.url ? 'cursor-pointer' : ''
                        }`}
                        onClick={() => {
                          if (item.url) {
                            window.open(item.url, '_blank', 'noopener,noreferrer');
                          }
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        <div className="relative z-10">
                          <div className="flex items-center gap-3 mb-4">
                            <div 
                              className="w-12 h-12 rounded-lg flex items-center justify-center shadow-lg transform transition-transform duration-300 group-hover:scale-110"
                              style={{ backgroundColor: item.color + '20', border: `2px solid ${item.color}40` }}
                            >
                              {(() => {
                                if (item.icon.startsWith('http')) {
                                  return (
                                    <Image 
                                      src={item.icon} 
                                      alt={item.name}
                                      width={24}
                                      height={24}
                                      className="w-6 h-6"
                                    />
                                  );
                                } else {
                                  const IconComponent = getTechIcon(item.icon);
                                  return <IconComponent 
                                    className="w-6 h-6"
                                    style={{ color: item.color }}
                                  />;
                                }
                              })()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-white font-medium tracking-wide truncate flex items-center gap-2">
                                {item.name}
                                {item.url && (
                                  <FontAwesomeIcon 
                                    icon={faArrowRight} 
                                    className="w-3 h-3 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" 
                                  />
                                )}
                              </h3>
                            </div>
                          </div>
                          
                          <p className="text-white/70 text-sm leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'hardware' && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 transition-all duration-500 ease-in-out">
                  {loading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="p-6 rounded-xl bg-white/5">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-white/10 rounded-lg" />
                          <div className="h-4 bg-white/10 rounded w-24" />
                        </div>
                        <div className="h-3 bg-white/5 rounded w-full" />
                      </div>
                    ))
                  ) : (
                    techData?.hardware?.map((item: TechItem, index: number) => (
                      <div
                        key={index}
                        className="group relative p-6 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 border border-transparent hover:border-white/10 transform hover:scale-105"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        <div className="relative z-10">
                          <div className="flex items-center gap-3 mb-4">
                            <div 
                              className="w-12 h-12 rounded-lg flex items-center justify-center shadow-lg transform transition-transform duration-300 group-hover:scale-110"
                              style={{ backgroundColor: item.color + '20', border: `2px solid ${item.color}40` }}
                            >
                              {(() => {
                                if (item.icon.startsWith('http')) {
                                  return (
                                    <Image 
                                      src={item.icon} 
                                      alt={item.name}
                                      width={24}
                                      height={24}
                                      className="w-6 h-6"
                                    />
                                  );
                                } else {
                                  const IconComponent = getTechIcon(item.icon);
                                  return <IconComponent 
                                    className="w-6 h-6"
                                    style={{ color: item.color }}
                                  />;
                                }
                              })()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-white font-medium tracking-wide truncate">{item.name}</h3>
                            </div>
                          </div>
                          
                          <p className="text-white/70 text-sm leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
