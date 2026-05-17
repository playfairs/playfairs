"use client";

import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faGitlab, faTiktok } from "@fortawesome/free-brands-svg-icons";
import { faUsers, faCodeBranch, faCalendar, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState, useEffect, useMemo, useRef, type CSSProperties } from "react";
import { usePageCache } from "./contexts/PageCacheContext";

type DogMotion = {
  id: number;
  top: string;
  left: string;
  size: number;
  height: number;
  duration: string;
  xTravel: string;
  yTravel: string;
  xMid: string;
  yMid: string;
  xBack: string;
  yBack: string;
};

const getBrightRgb = () =>
  `rgb(${120 + Math.round(Math.random() * 135)}, ${120 + Math.round(Math.random() * 135)}, ${120 + Math.round(Math.random() * 135)})`;

const createDogMotion = (id: number): DogMotion => {
  const size = 150 + Math.round(Math.random() * 105);
  const height = Math.round(size * 0.62);
  const padding = 16;
  const maxX = Math.max(padding, window.innerWidth - size - padding);
  const maxY = Math.max(padding, window.innerHeight - height - padding);
  const randomX = () => padding + Math.random() * Math.max(0, maxX - padding);
  const randomY = () => padding + Math.random() * Math.max(0, maxY - padding);
  const startX = randomX();
  const startY = randomY();
  const pointA = { x: randomX(), y: randomY() };
  const pointB = { x: randomX(), y: randomY() };
  const pointC = { x: randomX(), y: randomY() };

  return {
    id,
    top: `${startY}px`,
    left: `${startX}px`,
    size,
    height,
    duration: `${3.2 + Math.random() * 6.8}s`,
    xTravel: `${pointA.x - startX}px`,
    yTravel: `${pointA.y - startY}px`,
    xMid: `${pointB.x - startX}px`,
    yMid: `${pointB.y - startY}px`,
    xBack: `${pointC.x - startX}px`,
    yBack: `${pointC.y - startY}px`
  };
};

export default function Home() {
  const { homeMounted, setHomeMounted, githubData, setGithubData } = usePageCache();
  const [loading, setLoading] = useState(!homeMounted && !githubData);
  const [texasMode, setTexasMode] = useState(false);
  const [dogVideos, setDogVideos] = useState<DogMotion[]>([]);
  const [texasGradient, setTexasGradient] = useState(
    "linear-gradient(135deg, rgb(255, 180, 120), rgb(120, 220, 255), rgb(255, 140, 230))"
  );
  const dogVideoRef = useRef<HTMLVideoElement>(null);
  const confettiPieces = useMemo(
    () => Array.from({ length: 90 }, (_, index) => ({
      id: index,
      left: `${(index * 37) % 100}%`,
      delay: `${((index * 17) % 40) / 10}s`,
      duration: `${2.5 + ((index * 13) % 30) / 10}s`,
      color: ["#ef4444", "#f59e0b", "#22c55e", "#38bdf8", "#a78bfa", "#f472b6"][index % 6],
      size: `${6 + ((index * 11) % 8)}px`
    })),
    []
  );

  useEffect(() => {
    document.title = "dog";
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

  useEffect(() => {
    const dogVideo = dogVideoRef.current;
    if (loading || !githubData || !dogVideo) {
      return;
    }

    dogVideo.loop = true;
    dogVideo.preload = "auto";
    dogVideo.load();
  }, [loading, githubData]);

  useEffect(() => {
    if (!texasMode) {
      return;
    }

    document.querySelectorAll<HTMLVideoElement>("[data-dog-video='true']").forEach((dogVideo) => {
      dogVideo.loop = true;
      dogVideo.preload = "auto";
      void dogVideo.play().catch(() => {
        dogVideo.controls = true;
      });
    });
  }, [texasMode, dogVideos]);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const launchTexasMode = () => {
    setTexasGradient(`linear-gradient(${Math.round(Math.random() * 360)}deg, ${getBrightRgb()}, ${getBrightRgb()}, ${getBrightRgb()})`);
    setDogVideos([createDogMotion(Date.now())]);
    setTexasMode(true);

    const dogVideo = dogVideoRef.current;
    if (dogVideo) {
      dogVideo.loop = true;
      dogVideo.preload = "auto";
      dogVideo.currentTime = 0;
      void dogVideo.play().catch(() => {
        dogVideo.controls = true;
      });
    }
  };

  const addDogVideo = () => {
    setDogVideos((currentVideos) => {
      if (currentVideos.length >= 200) {
        return currentVideos;
      }

      return [...currentVideos, createDogMotion(Date.now() + currentVideos.length)];
    });
  };

  const keepDogVideoLooping = (dogVideo: HTMLVideoElement) => {
    if (dogVideo.duration > 0 && dogVideo.duration - dogVideo.currentTime < 0.12) {
      dogVideo.currentTime = 0;
      void dogVideo.play().catch(() => {
        dogVideo.controls = true;
      });
    }
  };

  const renderLocation = (location: string) => {
    const parts = location.split(/(TX)/g);

    return parts.map((part, index) => {
      if (part !== "TX") {
        return part;
      }

      return (
        <button
          key={`${part}-${index}`}
          type="button"
          onClick={launchTexasMode}
          className="text-sky-100/60 hover:text-sky-100/70 transition-colors duration-200"
        >
          {part}
        </button>
      );
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
      <video
        ref={dogVideoRef}
        src="/dog.mp4"
        preload="auto"
        loop
        playsInline
        className="fixed opacity-0 pointer-events-none"
      />
      {dogVideos.map((dogMotion) => (
        <video
          key={dogMotion.id}
          data-dog-video="true"
          src="/dog.mp4"
          preload="auto"
          autoPlay
          loop
          playsInline
          onTimeUpdate={(event) => keepDogVideoLooping(event.currentTarget)}
          onEnded={(event) => {
            event.currentTarget.currentTime = 0;
            void event.currentTarget.play().catch(() => {
              event.currentTarget.controls = true;
            });
          }}
          onCanPlay={(event) => {
            void event.currentTarget.play().catch(() => {
              event.currentTarget.controls = true;
            });
          }}
          className="texas-dog-video pointer-events-none fixed z-50 rounded-lg border border-white/30 bg-black object-cover opacity-100 shadow-2xl shadow-blue-500/20"
          style={{
            top: dogMotion.top,
            left: dogMotion.left,
            width: dogMotion.size,
            height: dogMotion.height,
            "--dog-duration": dogMotion.duration,
            "--dog-x": dogMotion.xTravel,
            "--dog-y": dogMotion.yTravel,
            "--dog-x-mid": dogMotion.xMid,
            "--dog-y-mid": dogMotion.yMid,
            "--dog-x-back": dogMotion.xBack,
            "--dog-y-back": dogMotion.yBack
          } as CSSProperties}
        />
      ))}
      <style>{`
        @keyframes texasConfettiFall {
          0% {
            opacity: 0;
            transform: translate3d(0, -12vh, 0) rotate(0deg);
          }
          10% {
            opacity: 1;
          }
          100% {
            opacity: 0.85;
            transform: translate3d(0, 115vh, 0) rotate(720deg);
          }
        }

        @keyframes texasDogFloat {
          0%, 100% {
            transform: translate3d(0, 0, 0) rotate(-2deg);
          }
          25% {
            transform: translate3d(var(--dog-x), var(--dog-y), 0) rotate(3deg);
          }
          50% {
            transform: translate3d(var(--dog-x-mid), var(--dog-y-mid), 0) rotate(-1deg);
          }
          75% {
            transform: translate3d(var(--dog-x-back), var(--dog-y-back), 0) rotate(2deg);
          }
        }

        @keyframes texasGradientSpin {
          from {
            filter: hue-rotate(0deg) saturate(1.15);
            transform: rotate(0deg) scale(1.25);
          }
          to {
            filter: hue-rotate(360deg) saturate(1.15);
            transform: rotate(360deg) scale(1.25);
          }
        }

        .texas-confetti {
          animation-name: texasConfettiFall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        .texas-dog-video {
          animation: texasDogFloat var(--dog-duration) ease-in-out infinite;
        }

        .texas-gradient-field {
          animation: texasGradientSpin 28s linear infinite;
        }
      `}</style>

      {texasMode ? (
        <main
          className="relative min-h-screen overflow-hidden flex items-center justify-center p-6 bg-white"
          onClick={addDogVideo}
        >
          <div
            className="texas-gradient-field absolute -inset-1/2"
            style={{ background: texasGradient }}
          />
          {confettiPieces.map((piece) => (
            <span
              key={piece.id}
              className="texas-confetti pointer-events-none absolute top-[-10vh]"
              style={{
                left: piece.left,
                width: piece.size,
                height: piece.size,
                backgroundColor: piece.color,
                animationDelay: piece.delay,
                animationDuration: piece.duration
              }}
            />
          ))}
          <h1 className="relative z-10 select-none text-center text-4xl sm:text-6xl font-thin tracking-widest text-white">
            Texas? More like Tex ASS!!!
          </h1>
        </main>
      ) : (
        <>
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
                      <p className="text-white/50 text-sm font-light text-center">{renderLocation(githubData.location)}</p>
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
      <Footer />
        </>
      )}
    </div>
  );
}
