'use client';

import { useState, useEffect } from 'react';

const customStyles = `
  @keyframes tabPulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  @keyframes rotate-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @keyframes pulse-slow {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50% { opacity: 0.6; transform: scale(1.05); }
  }
  
  .animate-rotate-slow {
    animation: rotate-slow 8s linear infinite;
  }
  
  .animate-pulse-slow {
    animation: pulse-slow 3s ease-in-out infinite;
  }
`;
import Image from 'next/image';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faGithub
} from "@fortawesome/free-brands-svg-icons";
import { 
  faCodeBranch,
  faStar,
  faArrowRight
} from "@fortawesome/free-solid-svg-icons";
import Header from "@/components/Header";

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

export default function Projects() {
  const [activeTab, setActiveTab] = useState('repos');
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = customStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const tabs = [
    { id: 'repos', label: 'REPOSITORIES' },
    { id: 'links', label: 'PROJECT LINKS' }
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

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const reposResponse = await fetch('https://api.github.com/users/playfairs/repos?sort=pushed&direction=desc&per_page=6');
        const reposData = await reposResponse.json();
        
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
                license: detailData.license?.spdx_id || 'No license',
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

        const linksResponse = await fetch('/data/projects.json');
        const linksData = await linksResponse.json();

        setProjectData({
          repositories: detailedRepos,
          projectLinks: linksData.projectLinks
        });
      } catch (error) {
        console.error('Failed to load project data:', error);
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
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 via-transparent to-purple-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-all duration-1000" />
            
            <div className="relative bg-black/60 backdrop-blur-2xl rounded-3xl p-8 md:p-10 border border-white/10 shadow-2xl hover:shadow-blue-500/10 transition-all duration-500">
              <div className="flex items-center gap-6 mb-10">
                <div className="relative group/avatar">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/40 via-purple-400/40 to-pink-400/40 rounded-full blur-lg opacity-0 group-hover/avatar:opacity-100 transition-all duration-700 animate-pulse-slow" />
                  <div className="relative w-16 h-16 rounded-full border-2 border-white/20 group-hover/avatar:border-white/60 transition-all duration-500 group-hover/avatar:scale-110 group-hover/avatar:rotate-3 shadow-xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-full" />
                    <Image
                      src="https://avatars.githubusercontent.com/playfairs"
                      alt="playfairs"
                      width={64}
                      height={64}
                      className="w-full h-full object-cover group-hover/avatar:brightness-110 transition-all duration-500"
                    />
                  </div>
                  <div className="absolute -inset-0 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover/avatar:opacity-100 transition-all duration-500 animate-rotate-slow" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-3xl font-light text-white tracking-wider mb-1 animate-slide-in group-hover/header:text-blue-400 transition-all duration-500">Projects</h1>
                  <p className="text-white/60 text-sm font-light animate-slide-in-delayed group-hover/header:text-white/80 transition-all duration-500">Latest repositories and projects</p>
                </div>
              </div>

              <div className="flex gap-2 mb-8 bg-white/5 rounded-xl p-1.5 backdrop-blur-sm relative group/tab-container">
                <div 
                  className="absolute top-1.5 bottom-1.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg transition-all duration-500 ease-out shadow-lg"
                  style={{
                    left: `${(tabs.findIndex(tab => tab.id === activeTab) * 100) / tabs.length}%`,
                    width: `${100 / tabs.length}%`,
                    transform: 'translateX(0.5rem)'
                  }}
                />
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-3 px-6 rounded-lg text-sm font-medium tracking-wide transition-all duration-500 transform hover:scale-105 relative z-10 ${
                      activeTab === tab.id
                        ? 'text-white shadow-lg'
                        : 'text-white/50 hover:text-white/70'
                    }`}
                    style={{
                      animation: activeTab === tab.id ? 'tabPulse 0.5s ease-out' : 'none'
                    }}
                  >
                    <span className={`relative inline-block transition-all duration-300 ${
                      activeTab === tab.id ? 'scale-110' : 'hover:scale-105'
                    }`}>
                      {tab.label}
                    </span>
                    {activeTab === tab.id && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse" />
                    )}
                  </button>
                ))}
              </div>

              {activeTab === 'repos' && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {loading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="p-4 rounded-xl bg-white/5 animate-pulse">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-4 h-4 bg-white/10 rounded" />
                          <div className="h-4 bg-white/10 rounded w-32" />
                        </div>
                        <div className="h-3 bg-white/5 rounded w-full mb-2" />
                        <div className="flex items-center gap-3">
                          <div className="h-3 bg-white/10 rounded w-16" />
                          <div className="h-3 bg-white/10 rounded w-12" />
                          <div className="h-3 bg-white/10 rounded w-12" />
                        </div>
                      </div>
                    ))
                  ) : (
                    projectData?.repositories?.map((repo: Repository, index: number) => (
                      <a
                        key={index}
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/repo block p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 border border-transparent hover:border-white/10"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <FontAwesomeIcon icon={faGithub} className="w-4 h-4 text-white/60 flex-shrink-0" />
                            <h3 className="text-white font-medium tracking-wide truncate text-sm">{repo.name}</h3>
                          </div>
                          <FontAwesomeIcon 
                            icon={faArrowRight} 
                            className="w-4 h-4 text-white/40 group-hover/repo:text-white group-hover/repo:translate-x-1 transition-all duration-300 flex-shrink-0 ml-2" 
                          />
                        </div>
                        
                        <p className="text-white/70 text-xs mb-3 line-clamp-2 leading-relaxed">{repo.description}</p>
                        
                        <div className="flex items-center justify-between text-xs text-white/50 mb-2">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-2.5 h-2.5 rounded-full" 
                              style={{ backgroundColor: getLanguageColor(repo.language) }}
                            />
                            <span>{repo.language}</span>
                          </div>
                          <span className="text-white/40">{repo.license}</span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-white/50">
                          <span className="flex items-center gap-1">
                            <FontAwesomeIcon icon={faStar} className="w-3 h-3" />
                            {formatNumber(repo.stars)}
                          </span>
                          <span className="flex items-center gap-1">
                            <FontAwesomeIcon icon={faCodeBranch} className="w-3 h-3" />
                            {formatNumber(repo.forks)}
                          </span>
                        </div>
                      </a>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'links' && (
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
                        className="group/link flex items-center gap-3 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 border border-transparent hover:border-white/10"
                      >
                        {faviconUrl ? (
                          <Image
                            src={faviconUrl}
                            alt=""
                            width={20}
                            height={20}
                            className="rounded-sm flex-shrink-0"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-5 h-5 rounded-sm bg-white/10 flex items-center justify-center">
                            <div className="w-3 h-3 bg-white/30 rounded-sm" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <span className="text-white/90 group-hover/link:text-white transition-colors duration-300 font-medium tracking-wide block truncate">
                            {link.name}
                          </span>
                          <span className="text-white/50 text-sm font-light tracking-wide">
                            {link.description}
                          </span>
                        </div>
                        <FontAwesomeIcon 
                          icon={faArrowRight} 
                          className="w-4 h-4 text-white/40 group-hover/link:text-white group-hover/link:translate-x-1 transition-all duration-300 flex-shrink-0" 
                        />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
