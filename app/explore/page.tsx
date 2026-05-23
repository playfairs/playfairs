'use client';

import { useState, useEffect, useRef } from 'react';

import Image from 'next/image';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faCodeBranch, faStar, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import * as solidIcons from "@fortawesome/free-solid-svg-icons";
import * as brandIcons from "@fortawesome/free-brands-svg-icons";
import { SiMatrix, SiCodeberg, SiRust, SiNixos, SiZig, SiC, SiPython, SiTypescript, SiReact, SiVim, SiGit, SiDocker, SiLinux, SiArchlinux, SiApple, SiUbuntu, SiAndroid, SiSpotify, SiFirefox, SiDiscord, SiGnubash } from "react-icons/si";
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
    'siTiktok': brandIcons.faTiktok,
    'faTelegram': brandIcons.faTelegram,
    'faEnvelope': solidIcons.faEnvelope,
    'faGlobe': solidIcons.faGlobe,
    'faPhone': solidIcons.faPhone,
    'faArrowRight': solidIcons.faArrowRight,
    'faGitlab': brandIcons.faGitlab,
  };
  return iconMap[iconName] || solidIcons.faArrowRight;
};

const getTechIcon = (iconName: string) => {
  switch (iconName) {
    case 'SiRust': return SiRust;
    case 'SiNixos': return SiNixos;
    case 'SiZig': return SiZig;
    case 'SiC': return SiC;
    case 'SiPython': return SiPython;
    case 'SiTypescript': return SiTypescript;
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

interface GitHubRepo {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
  updated_at: string;
  license: {
    spdx_id: string;
  } | null;
}

interface Repository {
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  license: string;
  url: string;
  updatedAt: string;
}

interface ProjectLink {
  name: string;
  description: string;
  url: string;
  type: string;
}

interface ProjectData {
  repositories: Repository[];
  projectLinks: ProjectLink[];
}

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

export default function Explore() {
  const [activeSection, setActiveSection] = useState('socials');
  const [activeSubSection, setActiveSubSection] = useState('socials');
  const [socialData, setSocialData] = useState<SocialData | null>(null);
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [techData, setTechData] = useState<TechStackData | null>(null);
  const [languageCounts, setLanguageCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [indicatorPosition, setIndicatorPosition] = useState({ top: 0, height: 0 });
  const gridRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (!navRef.current) return;

    const activeButton = navRef.current.querySelector('[data-active="true"]') as HTMLButtonElement;
    if (activeButton) {
      setIndicatorPosition({
        top: activeButton.offsetTop,
        height: activeButton.offsetHeight
      });
    }
  }, [activeSection, activeSubSection, loading]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [socialsRes, projectsRes, techstackRes, reposRes] = await Promise.all([
          fetch('/data/socials.json'),
          fetch('/data/projects.json'),
          fetch('/data/techstack.json'),
          fetch('https://api.github.com/users/playfairs/repos?sort=pushed&direction=desc&per_page=6')
        ]);

        console.log('Repos response status:', reposRes.status, reposRes.statusText);
        console.log('Repos response headers:', Object.fromEntries(reposRes.headers.entries()));

        const [socialsData, projectsData, techstackData, reposData] = await Promise.all([
          socialsRes.json(),
          projectsRes.json(),
          techstackRes.json(),
          reposRes.json()
        ]);

        console.log('Repos data:', reposData);
        console.log('Repos data type:', typeof reposData);
        console.log('Is array?', Array.isArray(reposData));

        if (!Array.isArray(reposData)) {
          console.error('reposData is not an array:', reposData);
          setSocialData(socialsData);
          setProjectData({
            repositories: [],
            projectLinks: projectsData.projectLinks
          });
          setTechData(techstackData);
          setLanguageCounts({});
          setLoading(false);
          return;
        }

        const detailedRepos = await Promise.all(
          reposData.map(async (repo: GitHubRepo) => {
            try {
              const detailResponse = await fetch(`https://api.github.com/repos/playfairs/${repo.name}`);
              const detailData = await detailResponse.json();

              return {
                name: detailData.name,
                description: detailData.description || 'No description available',
                language: detailData.language || 'Unknown',
                stars: detailData.stargazers_count,
                forks: detailData.forks_count,
                license: detailData.license?.spdx_id || 'Not Licensed',
                url: detailData.html_url,
                updatedAt: detailData.updated_at
              };
            } catch {
              return {
                name: repo.name,
                description: repo.description || 'No description available',
                language: repo.language || 'Unknown',
                stars: repo.stargazers_count,
                forks: repo.forks_count,
                license: 'Unknown',
                url: repo.html_url,
                updatedAt: repo.updated_at
              };
            }
          })
        );

        setSocialData(socialsData);
        setProjectData({
          repositories: detailedRepos,
          projectLinks: projectsData.projectLinks
        });
        setTechData(techstackData);

        const languages = techstackData.languages.map((item: TechItem) => item.name);
        const counts: Record<string, number> = {};
        
        await Promise.all(languages.map(async (language: string) => {
          try {
            const response = await fetch(`https://api.github.com/search/repositories?q=user:playfairs+language:${encodeURIComponent(language)}`);
            const data = await response.json();
            counts[language] = data.total_count || 0;
          } catch {
            counts[language] = 0;
          }
        }));

        setLanguageCounts(counts);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const sections = [
    {
      id: 'socials',
      label: 'SOCIALS',
      subSections: [
        { id: 'socials', label: 'Media' },
        { id: 'communication', label: 'Communication' },
        { id: 'development', label: 'Development' }
      ]
    },
    {
      id: 'projects',
      label: 'PROJECTS',
      subSections: [
        { id: 'repos', label: 'Repositories' },
        { id: 'links', label: 'Project Links' }
      ]
    },
    {
      id: 'techstack',
      label: 'TECH STACK',
      subSections: [
        { id: 'languages', label: 'Languages' },
        { id: 'software', label: 'Software' },
        { id: 'hardware', label: 'Hardware' }
      ]
    }
  ];

  const getLanguageColor = (language: string) => {
    const colors: { [key: string]: string } = {
      'TypeScript': '#3178c6',
      'JavaScript': '#f1e05a',
      'Python': '#3572A5',
      'Java': '#ed8c33',
      'C++': '#f34b7d',
      'C': '#555555',
      'Go': '#00ADD8',
      'Rust': '#dea584',
      'PHP': '#4F5D95',
      'Ruby': '#701516',
      'Swift': '#ffac45',
      'Kotlin': '#A97BFF',
      'Dart': '#00B4AB',
      'Nix': '#5277C3',
      'HTML': '#e34c26',
      'Unknown': '#6b7280'
    };
    return colors[language] || colors['Unknown'];
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

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

      <main className="relative min-h-screen p-6 pt-32 pb-24">
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="flex gap-8">
            <aside className="w-64 flex-shrink-0">
              <div className="relative border p-4 sticky top-32 bg-black border-white/30">
                <h2 className="text-xs font-bold tracking-widest mb-4 border-b pb-2 text-white border-white/20">EXPLORE</h2>
                <nav ref={navRef} className="space-y-0 relative">
                  <div
                    className="absolute left-0 w-0.5 bg-white transition-all duration-300 ease-out"
                    style={{
                      top: indicatorPosition.top,
                      height: indicatorPosition.height,
                    }}
                  />
                  {sections.map((section) => (
                    <div key={section.id}>
                      <button
                        data-active={activeSection === section.id}
                        onClick={() => {
                          setActiveSection(section.id);
                          setActiveSubSection(section.subSections[0].id);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs font-bold tracking-wider transition-all duration-300 ${
                          activeSection === section.id
                            ? 'text-white bg-white/5'
                            : 'text-white/40 hover:text-white/60 hover:bg-white/5'
                        }`}
                      >
                        {section.label}
                      </button>
                      <div className="ml-4 mt-0 space-y-0 relative">
                        {section.subSections.map((sub) => (
                          <div key={sub.id} className="relative">
                            <div
                              className={`absolute left-0 w-0.5 transition-all duration-300 ease-out ${
                                activeSubSection === sub.id ? 'opacity-100' : 'opacity-0'
                              }`}
                              style={{
                                top: 0,
                                height: '100%',
                                backgroundColor: '#333333',
                              }}
                            />
                            <button
                              data-sub-active={activeSubSection === sub.id}
                              onClick={() => {
                                setActiveSection(section.id);
                                setActiveSubSection(sub.id);
                              }}
                              className={`w-full text-left px-3 py-1.5 text-xs font-medium tracking-wide transition-all duration-300 ${
                                activeSubSection === sub.id
                                  ? 'text-white bg-white/5'
                                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                              }`}
                            >
                              {sub.label}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </nav>
              </div>
            </aside>

            <div className="flex-1 min-w-0">
              <div className="relative border p-6 bg-black border-white/30">
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-white/60">Loading...</div>
                  </div>
                ) : (
                  <>
                    {activeSection === 'socials' && (
                      <div className="space-y-4">
                        <div className="mb-6">
                          <div className="text-xs font-bold tracking-widest mb-2 border-b pb-2 text-white/50 border-white/20">SOCIALS</div>
                          <h1 className="text-2xl font-bold tracking-tight text-white">social platforms I use</h1>
                        </div>
                        <div className="space-y-2">
                          {socialData && socialData[activeSubSection as keyof SocialData]?.map((link: SocialLink, index: number) => (
                            <a
                              key={index}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group/link flex items-center justify-between px-4 py-3 transition-all duration-150 border-l-2 border-transparent bg-white/5 hover:bg-white/10 hover:border-white"
                            >
                              <div className="flex items-center gap-3">
                                {link.icon === 'SiMatrix' ? (
                                  <SiMatrix className="w-5 h-5 text-white/70" />
                                ) : link.icon === 'siCodeberg' ? (
                                  <SiCodeberg className="w-5 h-5 text-white/70" />
                                ) : (
                                  <FontAwesomeIcon icon={getIcon(link.icon)} className="w-5 h-5 text-white/70" />
                                )}
                                <span className="group-hover/link:text-white transition-colors duration-150 font-bold tracking-wide text-white/90">
                                  {link.name}
                                </span>
                              </div>
                              <FontAwesomeIcon
                                icon={getIcon('faArrowRight')}
                                className="w-4 h-4 group-hover/link:text-white group-hover/link:translate-x-1 transition-all duration-150 text-white/50"
                              />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeSection === 'projects' && activeSubSection === 'repos' && (
                      <div className="space-y-4">
                        <div className="mb-6">
                          <div className="text-xs font-bold tracking-widest mb-2 border-b pb-2 text-white/50 border-white/20">PROJECTS</div>
                          <h1 className="text-2xl font-bold tracking-tight text-white">Repositories</h1>
                        </div>
                        <div className="space-y-2">
                          {projectData?.repositories?.map((repo: Repository, index: number) => (
                            <a
                              key={index}
                              href={repo.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group/repo block px-5 py-4 transition-all duration-150 border-l-2 border-transparent bg-white/5 hover:bg-white/10 hover:border-white"
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                  <FontAwesomeIcon icon={faGithub} className="w-5 h-5 flex-shrink-0 text-white/70" />
                                  <h3 className="font-bold tracking-wide truncate text-base text-white">{repo.name}</h3>
                                </div>
                                <FontAwesomeIcon
                                  icon={faArrowRight}
                                  className="w-4 h-4 group-hover/repo:text-white group-hover/repo:translate-x-1 transition-all duration-150 flex-shrink-0 ml-2 text-white/50"
                                />
                              </div>
                              <p className="text-sm mb-4 line-clamp-2 leading-relaxed text-white/80">{repo.description}</p>
                              <div className="flex items-center justify-between text-xs text-white/60">
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: getLanguageColor(repo.language) }}
                                  />
                                  <span
                                    className="font-bold px-2 py-0.5 rounded"
                                    style={{ backgroundColor: getLanguageColor(repo.language) + '40' }}
                                  >
                                    {repo.language}
                                  </span>
                                </div>
                                <div className="flex items-center gap-4">
                                  <span className="font-bold">{repo.license}</span>
                                  <span className="flex items-center gap-2 font-bold">
                                    <FontAwesomeIcon icon={faStar} className="w-3.5 h-3.5" />
                                    {formatNumber(repo.stars)}
                                  </span>
                                  <span className="flex items-center gap-2 font-bold">
                                    <FontAwesomeIcon icon={faCodeBranch} className="w-3.5 h-3.5" />
                                    {formatNumber(repo.forks)}
                                  </span>
                                </div>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeSection === 'projects' && activeSubSection === 'links' && (
                      <div className="space-y-4">
                        <div className="mb-6">
                          <div className="text-xs font-bold tracking-widest mb-2 border-b pb-2 text-white/50 border-white/20">PROJECTS</div>
                          <h1 className="text-2xl font-bold tracking-tight text-white">Project Links</h1>
                        </div>
                        <div className="space-y-2">
                          {projectData?.projectLinks?.map((link: ProjectLink, index: number) => {
                            const getFaviconUrl = (url: string) => {
                              try {
                                const domain = new URL(url).hostname;
                                return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
                              } catch {
                                return null;
                              }
                            };

                            const faviconUrl = getFaviconUrl(link.url);

                            return (
                              <a
                                key={index}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group/link flex items-center gap-4 px-4 py-3 transition-all duration-150 border-l-2 border-transparent bg-white/5 hover:bg-white/10 hover:border-white"
                              >
                                {faviconUrl ? (
                                  <Image
                                    src={faviconUrl}
                                    alt=""
                                    width={24}
                                    height={24}
                                    className="flex-shrink-0"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                ) : (
                                  <div className="w-6 h-6 flex items-center justify-center bg-white/10">
                                    <div className="w-3 h-3 bg-white/30" />
                                  </div>
                                )}
                                <div className="min-w-0 flex-1">
                                  <span className="group-hover/link:text-white transition-colors duration-150 font-bold tracking-wide block truncate text-base text-white/90">
                                    {link.name}
                                  </span>
                                  <span className="text-sm font-normal tracking-wide text-white/50">
                                    {link.description}
                                  </span>
                                </div>
                                <FontAwesomeIcon
                                  icon={faArrowRight}
                                  className="w-4 h-4 group-hover/link:text-white group-hover/link:translate-x-1 transition-all duration-150 flex-shrink-0 text-white/50"
                                />
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {activeSection === 'techstack' && (
                      <div className="space-y-4">
                        <div className="mb-6">
                          <div className="text-xs font-bold tracking-widest mb-2 border-b pb-2 text-white/50 border-white/20">TECH STACK</div>
                          <h1 className="text-2xl font-bold tracking-tight text-white">Languages, software, and hardware I use</h1>
                        </div>
                        <div className="space-y-2">
                          {techData && techData[activeSubSection as keyof TechStackData]?.map((item: TechItem, index: number) => (
                            <div
                              key={index}
                              className={`group relative px-5 py-4 transition-all duration-150 border-l-2 border-transparent ${
                                item.url ? 'cursor-pointer' : ''
                              } bg-white/5 hover:bg-white/10 hover:border-white`}
                              onClick={() => {
                                if (item.url) {
                                  window.open(item.url, '_blank', 'noopener,noreferrer');
                                }
                              }}
                            >
                              <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-3">
                                  <div
                                    className="w-12 h-12 flex items-center justify-center transform transition-transform duration-150 group-hover:scale-105"
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
                                    <h3 className="font-bold tracking-wide truncate flex items-center gap-2 text-base text-white">
                                      {item.name}
                                      {activeSubSection === 'languages' && languageCounts[item.name] !== undefined && (
                                        <span className="text-xs font-normal text-white/50">
                                          ({languageCounts[item.name]} projects)
                                        </span>
                                      )}
                                      {item.url && (
                                        <FontAwesomeIcon
                                          icon={faArrowRight}
                                          className="w-4 h-4 group-hover:text-white group-hover:translate-x-1 transition-all duration-150 text-white/50"
                                        />
                                      )}
                                    </h3>
                                  </div>
                                </div>
                                <p className="text-sm leading-relaxed text-white/70">{item.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
