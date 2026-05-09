'use client';

import { useState, useEffect } from 'react';
import { usePageCache } from '../contexts/PageCacheContext';
import Image from 'next/image';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as solidIcons from "@fortawesome/free-solid-svg-icons";
import * as brandIcons from "@fortawesome/free-brands-svg-icons";
import { SiMatrix, SiCodeberg } from "react-icons/si";
import Header from "@/components/Header";

const getIcon = (iconName: string) => {
  const iconMap: { [key: string]: typeof solidIcons.faArrowRight } = {
    'faTwitter': brandIcons.faTwitter,
    'faInstagram': brandIcons.faInstagram,
    'faThreads': brandIcons.faThreads,
    'faBluesky': brandIcons.faBluesky,
    'faDiscord': brandIcons.faDiscord,
    'faGithub': brandIcons.faGithub,
    'faLinkedin': brandIcons.faLinkedin,
    'faCodepen': brandIcons.faCodepen,
    'faStackOverflow': brandIcons.faStackOverflow,
    'faDev': brandIcons.faDev,
    'faTiktok': brandIcons.faTiktok,
    'faTelegram': brandIcons.faTelegram,
    'siTiktok': brandIcons.faTiktok,
    'faEnvelope': solidIcons.faEnvelope,
    'faGlobe': solidIcons.faGlobe,
    'faPhone': solidIcons.faPhone,
    'faArrowRight': solidIcons.faArrowRight,
    'faGitlab': brandIcons.faGitlab,

  };
  return iconMap[iconName] || solidIcons.faArrowRight;
};

const getPlatformColor = (iconName: string) => {
  const colorMap: { [key: string]: string } = {
    'faDiscord': 'hover:text-[#5865F2]',
    'faInstagram': 'hover:text-[#E4405F]',
    'faTwitter': 'hover:text-[#1DA1F2]',
    'faThreads': 'hover:text-[#000000]',
    'faBluesky': 'hover:text-[#0085FF]',
    'faGithub': 'hover:text-[#181717]',
    'faLinkedin': 'hover:text-[#0077B5]',
    'faCodepen': 'hover:text-[#000000]',
    'faStackOverflow': 'hover:text-[#FE7A16]',
    'faDev': 'hover:text-[#000000]',
    'faTiktok': 'hover:text-[#000000]',
    'siTiktok': 'hover:text-[#000000]',
    'faTelegram': 'hover:text-[#2CA5E0]',
    'faEnvelope': 'hover:text-[#EA4335]',
    'faGlobe': 'hover:text-[#4285F4]',
    'faPhone': 'hover:text-[#10B981]',
    'faGitlab': 'hover:text-[#FC6D26]',
    'SiMatrix': 'hover:text-[#000000]',
    'siCodeberg': 'hover:text-[#2185D0]',
  };
  return colorMap[iconName] || 'hover:text-blue-400';
};

interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

interface SocialData {
  socials: SocialLink[];
  communication: SocialLink[];
  development: SocialLink[];
}

export default function Socials() {
  const { socialsMounted, setSocialsMounted, socialData, setSocialData } = usePageCache();
  const [activeTab, setActiveTab] = useState('socials');

  const tabs = [
    { id: 'socials', label: 'MEDIA' },
    { id: 'communication', label: 'COMMUNICATION' },
    { id: 'development', label: 'DEVELOPMENT' }
  ];

  useEffect(() => {
    if (!socialsMounted) {
      fetch('/data/socials.json')
        .then(res => res.json())
        .then(data => {
          setSocialData(data);
          setSocialsMounted(true);
        })
        .catch(err => {
          console.error('Failed to load socials data:', err);
          setSocialsMounted(true);
        });
    }
  }, [socialsMounted, setSocialsMounted, setSocialData]);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:50px_50px] opacity-20" />
      
      <Header />

      <main className="relative min-h-screen flex items-center justify-center p-6 pt-24">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        
        <div className="relative z-10 w-full max-w-2xl animate-fade-in">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 via-transparent to-purple-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-all duration-1000" />
            
            <div className="relative bg-black/60 backdrop-blur-2xl rounded-3xl p-10 border border-white/10 shadow-2xl hover:shadow-blue-500/10 transition-all duration-500">
              <div className="flex items-center gap-6 mb-8">
                <div className="relative group/avatar">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full blur-md opacity-0 group-hover/avatar:opacity-100 transition-all duration-500" />
                  <Image
                    src="https://avatars.githubusercontent.com/playfairs"
                    alt="playfairs"
                    width={60}
                    height={60}
                    className="relative rounded-full border-2 border-white/20 group-hover/avatar:border-white/40 transition-all duration-300 group-hover/avatar:scale-105"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-thin text-white tracking-widest animate-slide-in">playfairs</h1>
                  <p className="text-white/50 text-sm font-light">Connect with me</p>
                </div>
              </div>

              <div className="flex gap-1 mb-8 bg-white/5 rounded-lg p-1 backdrop-blur-sm relative">
                <div 
                  className="absolute top-1 bottom-1 bg-white/10 rounded-md transition-all duration-500 ease-out"
                  style={{
                    left: `${(tabs.findIndex(tab => tab.id === activeTab) / tabs.length) * 100}%`,
                    width: `${(1 / tabs.length) * 100}%`
                  }}
                />
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-light tracking-wide transition-all duration-300 ease-out relative z-10 ${
                      activeTab === tab.id
                        ? 'text-white'
                        : 'text-white/40 hover:text-white/60'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                {socialData && tabs.map((tab) => (
                  activeTab === tab.id && (
                    <div key={tab.id} className="space-y-3">
                      {socialData[tab.id as keyof SocialData]?.map((link: SocialLink, index: number) => (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/link flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/8 transition-all duration-200 ease-out"
                          style={{
                            transitionDelay: `${index * 50}ms`
                          }}
                        >
                          <div className="flex items-center gap-4">
                            {link.icon === 'SiMatrix' ? (
                              <SiMatrix className={`w-5 h-5 text-white/60 transition-colors duration-300 group-hover/link:${getPlatformColor(link.icon).replace('hover:', '')}`} />
                            ) : link.icon === 'siCodeberg' ? (
                              <SiCodeberg className={`w-5 h-5 text-white/60 transition-colors duration-300 group-hover/link:${getPlatformColor(link.icon).replace('hover:', '')}`} />
                            ) : (
                              <FontAwesomeIcon icon={getIcon(link.icon)} className={`w-5 h-5 text-white/60 transition-colors duration-300 group-hover/link:${getPlatformColor(link.icon).replace('hover:', '')}`} />
                            )}
                            <span className="text-white/80 group-hover/link:text-white transition-colors duration-300 font-light tracking-wide">
                              {link.name}
                            </span>
                          </div>
                          <FontAwesomeIcon 
                            icon={getIcon('faArrowRight')} 
                            className="w-4 h-4 text-white/40 group-hover/link:text-white group-hover/link:translate-x-1 transition-all duration-200 ease-out" 
                          />
                        </a>
                      ))}
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
