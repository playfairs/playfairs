"use client";

import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faGitlab, faTiktok } from "@fortawesome/free-brands-svg-icons";
import { faUsers, faCodeBranch, faCalendar, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Header from "@/components/Header";
import { useState, useEffect } from "react";
import { usePageCache } from "./contexts/PageCacheContext";

export default function Home() {
  const { homeMounted, setHomeMounted, githubData, setGithubData } = usePageCache();
  const [loading, setLoading] = useState(!homeMounted && !githubData);

  useEffect(() => {
    if (!homeMounted) {
      async function getGitHubData() {
        try {
          const res = await fetch('https://api.github.com/users/playfairs');
          if (!res.ok) {
            throw new Error('Failed to fetch GitHub data');
          }
          const data = await res.json();
          setGithubData(data);
        } catch (error) {
          console.error('Error fetching GitHub data:', error);
        } finally {
          setLoading(false);
          setHomeMounted(true);
        }
      }

      getGitHubData();
    }
  }, [homeMounted, setHomeMounted, setGithubData]);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
        <div className="text-white/60">Loading...</div>
      </div>
    );
  }

  if (!githubData) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
        <div className="text-white/60">Failed to load profile data</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:50px_50px] opacity-20" />
      
      <Header />

      <main className="relative min-h-screen flex items-center justify-center p-6 pt-24">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex gap-12 w-full max-w-6xl justify-center animate-fade-in">
          <div className="flex-1 max-w-lg">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 via-transparent to-purple-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-all duration-1000" />
              
              <div className="relative bg-black/60 backdrop-blur-2xl rounded-3xl p-10 border border-white/10 shadow-2xl hover:shadow-blue-500/10 transition-all duration-500">
                <div className="flex justify-center mb-8">
                  <div className="relative group/avatar">
                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full blur-lg opacity-0 group-hover/avatar:opacity-100 transition-all duration-700" />
                    <Image
                      src={githubData.avatar_url}
                      alt={githubData.login}
                      width={120}
                      height={120}
                      className="relative rounded-full border-2 border-white/20 group-hover/avatar:border-white/40 transition-all duration-500 group-hover/avatar:scale-105"
                    />
                  </div>
                </div>
                
                <div className="text-center space-y-6">
                  <div className="space-y-2">
                    <h1 className="text-3xl font-thin text-white tracking-widest animate-slide-in">{githubData.name || githubData.login}</h1>
                    <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent mx-auto animate-glow" />
                  </div>
                  
                  <div className="flex justify-center items-center gap-8 text-center">
                    <div className="text-center group">
                      <FontAwesomeIcon icon={faUsers} className="w-4 h-4 text-white/60 mx-auto mb-1 group-hover:text-blue-400 transition-colors duration-300" />
                      <p className="text-white/80 text-sm font-light group-hover:text-white transition-colors duration-300">{githubData.followers}</p>
                      <p className="text-white/40 text-xs">Followers</p>
                    </div>
                    <div className="text-center group">
                      <FontAwesomeIcon icon={faCodeBranch} className="w-4 h-4 text-white/60 mx-auto mb-1 group-hover:text-purple-400 transition-colors duration-300" />
                      <p className="text-white/80 text-sm font-light group-hover:text-white transition-colors duration-300">{githubData.public_repos}</p>
                      <p className="text-white/40 text-xs">Repositories</p>
                    </div>
                    <div className="text-center group">
                      <FontAwesomeIcon icon={faUsers} className="w-4 h-4 text-white/60 mx-auto mb-1 group-hover:text-green-400 transition-colors duration-300" />
                      <p className="text-white/80 text-sm font-light group-hover:text-white transition-colors duration-300">{githubData.following}</p>
                      <p className="text-white/40 text-xs">Following</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <div className="flex items-center justify-center gap-2 text-white/50 text-xs mb-2">
                      <FontAwesomeIcon icon={faCalendar} className="w-3 h-3" />
                      <span>Joined {formatDate(githubData.created_at)}</span>
                    </div>
                    {githubData.location && (
                      <p className="text-white/50 text-sm font-light text-center">{githubData.location}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 max-w-sm">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 via-transparent to-blue-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-all duration-1000" />
              
              <div className="relative bg-black/60 backdrop-blur-2xl rounded-3xl p-10 border border-white/10 shadow-2xl hover:shadow-purple-500/10 transition-all duration-500">
                <div className="space-y-8">
                  <div className="space-y-2">
                    <h2 className="text-xl font-thin text-white tracking-widest animate-slide-in">LINKS</h2>
                    <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-purple-400/50 to-transparent animate-glow" />
                  </div>
                  
                  <div className="space-y-6">
                    {[
                      { name: 'GITHUB', icon: faGithub, url: 'https://github.com/playfairs', color: 'hover:text-gray-400' },
                      { name: 'GITLAB', icon: faGitlab, url: 'https://gitlab.com/playfairs', color: 'hover:text-orange-400' },
                      { name: 'TIKTOK', icon: faTiktok, url: 'https://tiktok.com/@rosepinetheme', color: 'hover:text-pink-400' }
                    ].map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`group/link flex items-center justify-between text-white/50 ${link.color} transition-all duration-300 transform hover:scale-105`}
                      >
                        <div className="flex items-center gap-3">
                          <FontAwesomeIcon icon={link.icon} className="w-4 h-4 transition-transform duration-300 group-hover/link:scale-110" />
                          <span className="text-sm tracking-wider font-light">{link.name}</span>
                        </div>
                        <FontAwesomeIcon 
                          icon={faArrowRight} 
                          className="w-3 h-3 opacity-0 group-hover/link:opacity-100 group-hover/link:translate-x-1 transition-all duration-300" 
                        />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
