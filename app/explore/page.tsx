'use client';

import { useState, useEffect, useRef } from 'react';

import Image from 'next/image';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faCodeBranch, faStar, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import * as solidIcons from "@fortawesome/free-solid-svg-icons";
import * as brandIcons from "@fortawesome/free-brands-svg-icons";
import { SiMatrix, SiCodeberg, SiRust, SiNixos, SiZig, SiC, SiCplusplus, SiPython, SiTypescript, SiReact, SiVim, SiGit, SiDocker, SiLinux, SiArchlinux, SiApple, SiUbuntu, SiAndroid, SiSpotify, SiFirefox, SiDiscord, SiGnubash } from "react-icons/si";
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
    case 'SiC++':
    case 'SiCplusplus': return SiCplusplus;
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
  const [indicatorPosition, setIndicatorPosition] = useState({ top: 0, height: 0 });
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!navRef.current) return;

    const activeButton = navRef.current.querySelector('[data-active="true"]') as HTMLButtonElement;
    if (activeButton) {
      setIndicatorPosition({
        top: activeButton.offsetTop,
        height: activeButton.offsetHeight,
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

        const [socialsData, projectsData, techstackData, reposData] = await Promise.all([
          socialsRes.json(),
          projectsRes.json(),
          techstackRes.json(),
          reposRes.json()
        ]);

        if (!Array.isArray(reposData)) {
          setSocialData(socialsData);
          setProjectData({
            repositories: [],
            projectLinks: projectsData.projectLinks,
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
                updatedAt: detailData.updated_at,
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
                updatedAt: repo.updated_at,
              };
            }
          })
        );

        setSocialData(socialsData);
        setProjectData({
          repositories: detailedRepos,
          projectLinks: projectsData.projectLinks,
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
        { id: 'development', label: 'Development' },
      ],
    },
    {
      id: 'projects',
      label: 'PROJECTS',
      subSections: [
        { id: 'repos', label: 'Repositories' },
        { id: 'links', label: 'Project Links' },
      ],
    },
    {
      id: 'techstack',
      label: 'TECH STACK',
      subSections: [
        { id: 'languages', label: 'Languages' },
        { id: 'software', label: 'Software' },
        { id: 'hardware', label: 'Hardware' },
      ],
    },
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
      'Unknown': '#6b7280',
    };
    return colors[language] || colors['Unknown'];
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  const handleTechItemClick = (item: TechItem) => {
    if (activeSubSection === 'languages') {
      const languageQuery = encodeURIComponent(item.name.toLowerCase());
      const url = `https://github.com/playfairs?tab=repositories&q=&type=&language=${languageQuery}&sort=`;
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }

    if (item.url) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(124,58,237,0.16),transparent_28%)]" />

      <Header />

      <main className="relative px-6 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="glass-panel p-6 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-cyan-300">digital archive</p>
                <h1 className="mt-3 text-3xl font-semibold tracking-[0.2em] text-white sm:text-4xl">
                  Explore the layers
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/65">
                  Same content, different atmosphere. Navigate the same data with a fresh visual rhythm.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-white/55">
                  social
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-white/55">
                  projects
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-white/55">
                  stack
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
            <aside className="glass-panel p-4 sm:p-5">
              <h2 className="text-[10px] font-semibold uppercase tracking-[0.35em] text-white/45">catalog</h2>
              <nav ref={navRef} className="relative mt-4 space-y-1">
                <div
                  className="absolute left-0 w-0.5 rounded-full bg-gradient-to-b from-cyan-400 to-violet-500 transition-all duration-300"
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
                      className={`w-full rounded-2xl px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.28em] transition ${
                        activeSection === section.id
                          ? 'bg-white/10 text-white'
                          : 'text-white/50 hover:bg-white/5 hover:text-white/80'
                      }`}
                    >
                      {section.label}
                    </button>
                    <div className="ml-4 mt-1 space-y-1">
                      {section.subSections.map((sub) => (
                        <button
                          key={sub.id}
                          data-active={activeSubSection === sub.id}
                          onClick={() => {
                            setActiveSection(section.id);
                            setActiveSubSection(sub.id);
                          }}
                          className={`w-full rounded-xl px-3 py-2 text-left text-[11px] uppercase tracking-[0.28em] transition ${
                            activeSubSection === sub.id
                              ? 'bg-cyan-400/10 text-cyan-200'
                              : 'text-white/45 hover:bg-white/5 hover:text-white/75'
                          }`}
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </nav>
            </aside>

            <section className="glass-panel p-6 sm:p-8">
              {loading ? (
                <div className="flex h-64 items-center justify-center text-sm uppercase tracking-[0.35em] text-white/60">
                  loading data…
                </div>
              ) : (
                <>
                  {activeSection === 'socials' && (
                    <div className="space-y-4">
                      <div className="mb-6 border-b border-white/10 pb-4">
                        <p className="text-[10px] uppercase tracking-[0.35em] text-white/45">socials</p>
                        <h2 className="mt-2 text-2xl font-semibold tracking-[0.18em] text-white">
                          platforms I use
                        </h2>
                      </div>
                      <div className="space-y-3">
                        {socialData && socialData[activeSubSection as keyof SocialData]?.map((link: SocialLink, index: number) => (
                          <a
                            key={index}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3 transition hover:border-cyan-400/30 hover:bg-cyan-400/10"
                          >
                            <div className="flex items-center gap-3">
                              {link.icon === 'SiMatrix' ? (
                                <SiMatrix className="h-5 w-5 text-white/70" />
                              ) : link.icon === 'siCodeberg' ? (
                                <SiCodeberg className="h-5 w-5 text-white/70" />
                              ) : (
                                <FontAwesomeIcon icon={getIcon(link.icon)} className="h-5 w-5 text-white/70" />
                              )}
                              <span className="text-sm font-semibold uppercase tracking-[0.28em] text-white/80">
                                {link.name}
                              </span>
                            </div>
                            <FontAwesomeIcon
                              icon={getIcon('faArrowRight')}
                              className="h-3.5 w-3.5 text-white/45 transition group-hover:translate-x-1 group-hover:text-white"
                            />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeSection === 'projects' && activeSubSection === 'repos' && (
                    <div className="space-y-4">
                      <div className="mb-6 border-b border-white/10 pb-4">
                        <p className="text-[10px] uppercase tracking-[0.35em] text-white/45">projects</p>
                        <h2 className="mt-2 text-2xl font-semibold tracking-[0.18em] text-white">
                          repositories
                        </h2>
                      </div>
                      <div className="space-y-3">
                        {projectData?.repositories?.map((repo: Repository, index: number) => (
                          <a
                            key={index}
                            href={repo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group block rounded-2xl border border-white/10 bg-black/20 px-5 py-4 transition hover:border-violet-400/30 hover:bg-violet-400/10"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex min-w-0 items-center gap-3">
                                <FontAwesomeIcon icon={faGithub} className="h-5 w-5 flex-shrink-0 text-white/70" />
                                <h3 className="truncate text-base font-semibold tracking-[0.16em] text-white">
                                  {repo.name}
                                </h3>
                              </div>
                              <FontAwesomeIcon
                                icon={faArrowRight}
                                className="h-3.5 w-3.5 flex-shrink-0 text-white/45 transition group-hover:translate-x-1 group-hover:text-white"
                              />
                            </div>
                            <p className="mt-3 text-sm leading-7 text-white/70">{repo.description}</p>
                            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[11px] uppercase tracking-[0.28em] text-white/55">
                              <div className="flex items-center gap-2">
                                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: getLanguageColor(repo.language) }} />
                                <span>{repo.language}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span>{repo.license}</span>
                                <span className="flex items-center gap-1">
                                  <FontAwesomeIcon icon={faStar} className="h-3.5 w-3.5" />
                                  {formatNumber(repo.stars)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <FontAwesomeIcon icon={faCodeBranch} className="h-3.5 w-3.5" />
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
                      <div className="mb-6 border-b border-white/10 pb-4">
                        <p className="text-[10px] uppercase tracking-[0.35em] text-white/45">projects</p>
                        <h2 className="mt-2 text-2xl font-semibold tracking-[0.18em] text-white">
                          project links
                        </h2>
                      </div>
                      <div className="space-y-3">
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
                              className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 transition hover:border-cyan-400/30 hover:bg-cyan-400/10"
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
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
                                  <div className="h-3 w-3 rounded-full bg-white/30" />
                                </div>
                              )}
                              <div className="min-w-0 flex-1">
                                <span className="block truncate text-sm font-semibold uppercase tracking-[0.28em] text-white/85">
                                  {link.name}
                                </span>
                                <span className="mt-1 block text-sm text-white/55">
                                  {link.description}
                                </span>
                              </div>
                              <FontAwesomeIcon
                                icon={faArrowRight}
                                className="h-3.5 w-3.5 flex-shrink-0 text-white/45 transition group-hover:translate-x-1 group-hover:text-white"
                              />
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {activeSection === 'techstack' && (
                    <div className="space-y-4">
                      <div className="mb-6 border-b border-white/10 pb-4">
                        <p className="text-[10px] uppercase tracking-[0.35em] text-white/45">tech stack</p>
                        <h2 className="mt-2 text-2xl font-semibold tracking-[0.18em] text-white">
                          tools and languages
                        </h2>
                      </div>
                      <div className="space-y-3">
                        {techData && techData[activeSubSection as keyof TechStackData]?.map((item: TechItem, index: number) => (
                          <div
                            key={index}
                            className={`group rounded-2xl border border-white/10 bg-black/20 px-5 py-4 transition hover:border-white/25 hover:bg-white/10 ${item.url || activeSubSection === 'languages' ? 'cursor-pointer' : ''}`}
                            onClick={() => handleTechItemClick(item)}
                          >
                            <div className="flex items-center gap-4">
                              <div
                                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 transition group-hover:scale-105"
                                style={{ backgroundColor: `${item.color}22`, borderColor: `${item.color}44` }}
                              >
                                {item.icon.startsWith('http') ? (
                                  <Image src={item.icon} alt={item.name} width={24} height={24} className="h-6 w-6" />
                                ) : (
                                  (() => {
                                    const IconComponent = getTechIcon(item.icon);
                                    return <IconComponent className="h-6 w-6" style={{ color: item.color }} />;
                                  })()
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="truncate text-base font-semibold tracking-[0.16em] text-white">
                                    {item.name}
                                  </h3>
                                  {activeSubSection === 'languages' && languageCounts[item.name] !== undefined && (
                                    <span className="text-[11px] uppercase tracking-[0.28em] text-white/45">
                                      ({languageCounts[item.name]} projects)
                                    </span>
                                  )}
                                </div>
                                <p className="mt-2 text-sm leading-7 text-white/65">{item.description}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </section>
          </div>
        </div>
      </main>

    </div>
  );
}
