"use client";

import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faGitlab, faTiktok } from "@fortawesome/free-brands-svg-icons";
import { faUsers, faCodeBranch, faCalendar, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Header from "@/components/Header";
import { useState, useEffect, useRef } from "react";
import { usePageCache } from "./contexts/PageCacheContext";

export default function Home() {
  const { homeMounted, setHomeMounted, githubData, setGithubData } = usePageCache();
  const [loading, setLoading] = useState(!homeMounted && !githubData);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    document.title = "playfairs.cc";
  }, []);

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
    <div className="min-h-screen relative overflow-hidden bg-black">
      <div
        ref={gridRef}
        className="absolute inset-0 bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:60px_60px] opacity-30"
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.08) 0%, transparent 40%)`,
        }}
      />

      <Header />

      <main className="relative min-h-screen flex items-center justify-center p-6 pt-32">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl bg-blue-500/10" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl bg-purple-500/10" />

        <div className="relative z-10 flex gap-8 w-full max-w-5xl justify-center">
          <div className="flex-1 max-w-md">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-500" />

              <div className="relative backdrop-blur-xl rounded-2xl p-8 border shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 bg-black/70 border-white/10">
                <div className="flex justify-center mb-6">
                  <div className="relative group/avatar">
                    <div className="absolute -inset-3 bg-gradient-to-r from-blue-400/40 to-purple-400/40 rounded-full blur-xl opacity-0 group-hover/avatar:opacity-100 transition-all duration-500" />
                    <Image
                      src={githubData.avatar_url}
                      alt={githubData.login}
                      width={100}
                      height={100}
                      className="relative rounded-full border-2 group-hover/avatar:border-white/50 transition-all duration-300 group-hover/avatar:scale-110 border-white/20"
                    />
                  </div>
                </div>

                <div className="text-center space-y-5">
                  <div className="space-y-1">
                    <h1 className="text-2xl font-light tracking-wider text-white">{githubData.name || githubData.login}</h1>
                    <div className="w-12 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent mx-auto" />
                  </div>

                  <div className="flex justify-center items-center gap-6 text-center">
                    <div className="text-center group">
                      <FontAwesomeIcon icon={faUsers} className="w-4 h-4 mx-auto mb-1 group-hover:text-blue-400 transition-colors duration-300 text-white/50" />
                      <p className="text-sm font-medium group-hover:text-white transition-colors duration-300 text-white/90">{githubData.followers}</p>
                      <p className="text-xs uppercase tracking-wider text-white/30">Followers</p>
                    </div>
                    <div className="text-center group">
                      <FontAwesomeIcon icon={faCodeBranch} className="w-4 h-4 mx-auto mb-1 group-hover:text-purple-400 transition-colors duration-300 text-white/50" />
                      <p className="text-sm font-medium group-hover:text-white transition-colors duration-300 text-white/90">{githubData.public_repos}</p>
                      <p className="text-xs uppercase tracking-wider text-white/30">Repos</p>
                    </div>
                    <div className="text-center group">
                      <FontAwesomeIcon icon={faUsers} className="w-4 h-4 mx-auto mb-1 group-hover:text-green-400 transition-colors duration-300 text-white/50" />
                      <p className="text-sm font-medium group-hover:text-white transition-colors duration-300 text-white/90">{githubData.following}</p>
                      <p className="text-xs uppercase tracking-wider text-white/30">Following</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t space-y-2 border-white/10">
                    <div className="flex items-center justify-center gap-2 text-xs text-white/40">
                      <FontAwesomeIcon icon={faCalendar} className="w-3 h-3" />
                      <span>Joined {formatDate(githubData.created_at)}</span>
                    </div>
                    {githubData.location && (
                      <p className="text-sm font-light text-center text-white/50">{githubData.location}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 max-w-sm">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-500" />

              <div className="relative backdrop-blur-xl rounded-2xl p-8 border shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 bg-black/70 border-white/10">
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h2 className="text-lg font-light tracking-wider text-white">LINKS</h2>
                    <div className="w-10 h-px bg-gradient-to-r from-transparent via-purple-400/60 to-transparent" />
                  </div>

                  <div className="space-y-4">
                    {[
                      { name: 'GITHUB', icon: faGithub, url: 'https://github.com/playfairs', color: 'hover:text-gray-300' },
                      { name: 'GITLAB', icon: faGitlab, url: 'https://gitlab.com/playfairs', color: 'hover:text-orange-300' },
                      { name: 'TIKTOK', icon: faTiktok, url: 'https://tiktok.com/@playfairs', color: 'hover:text-pink-300' }
                    ].map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/link flex items-center justify-between text-white/50 hover:bg-white/5 rounded-lg px-3 py-2 transition-all duration-300"
                      >
                        <div className="flex items-center gap-3">
                          <FontAwesomeIcon icon={link.icon} className="w-4 h-4 transition-transform duration-300 group-hover/link:scale-110 text-white/70" />
                          <span className="text-sm tracking-wide font-medium text-white/90">{link.name}</span>
                        </div>
                        <FontAwesomeIcon
                          icon={faArrowRight}
                          className="w-3 h-3 opacity-0 group-hover/link:opacity-100 group-hover/link:translate-x-1 transition-all duration-300 text-white/50"
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