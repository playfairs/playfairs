import { useState, useEffect } from "react";
import type { CSSProperties } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";

type StyleWithHover = {
  '--hover-bg'?: string;
  '--hover-border'?: string;
  '--hover-color'?: string;
  '--active-bg'?: string;
  '--active-border'?: string;
  '--active-color'?: string;
  [key: string]: string | number | undefined;
};
import type { PlatformStats } from "./stats";
import { 
  getPlatformIcon, 
  getPlatformDisplayName, 
  shouldFetchStats, 
  fetchPlatformStats 
} from "./stats";
import "../../index.css";

interface Social {
  name: string;
  url: string;
  platform: string;
  icon: string;
}

export default function SocialsPage() {
  const [socials, setSocials] = useState<Social[]>([]);
  const [userStats, setUserStats] = useState<Record<string, PlatformStats>>({});
  const [expandedPlatforms, setExpandedPlatforms] = useState<Record<string, boolean>>({});
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    import("./socials.json")
      .then((data) => {
        const socialsData = data.default;
        
        const grouped = socialsData.reduce((acc: Record<string, Social[]>, social: Social) => {
          if (!acc[social.platform]) {
            acc[social.platform] = [];
          }
          acc[social.platform]!.push(social);
          return acc;
        }, {});

        const initialExpandedState = Object.keys(grouped).reduce((acc, platform) => {
          acc[platform] = false;
          return acc;
        }, {} as Record<string, boolean>);
        
        setExpandedPlatforms(initialExpandedState);
        setSocials(socialsData);
        setIsLoading(false);
        
        socialsData.forEach(async (social: Social) => {
          if (shouldFetchStats(social.platform)) {
            try {
              const stats = await fetchPlatformStats(social.platform, social.name);
              const userKey = `${social.platform}-${social.name}`;
              setUserStats(prev => ({
                ...prev,
                [userKey]: stats
              }));
            } catch (error) {
              console.error(`Error fetching stats for ${social.platform}/${social.name}:`, error);
            }
          }
        });
      })
      .catch((error) => {
        console.error("Error loading socials:", error);
        setIsLoading(false);
      });
  }, []);

  const getPlatformDisplayName = (platform: string) => {
    switch (platform) {
      case 'twitter': return 'X (Twitter)';
      case 'github': return 'GitHub';
      case 'tiktok': return 'TikTok';
      case 'youtube': return 'YouTube';
      default: return platform.charAt(0).toUpperCase() + platform.slice(1);
    }
  };

  const getPlatformColor = (platform: string) => {
    const colors: Record<string, string> = {
      'x': '#000000',
      'github': '#000000',
      'tiktok': '#000000',
      'youtube': '#FF0000',
      'instagram': '#E1306C',
      'discord': '#7289DA',
      'twitch': '#9147FF',
      'reddit': '#FF5700',
      'linkedin': '#0A66C2',
      'spotify': '#1ED760',
      'steam': '#66C0F4',
      'gitlab': '#FCA326',
      'lastfm': '#D51007',
      'soundcloud': '#FF8800',
      'pinterest': '#E60023',
      'behance': '#0057FF',
      'dribbble': '#EA4C89',
      'medium': '#00AB6C',
      'telegram': '#2AABEE',
      'whatsapp': '#25D366',
      'slack': '#4A154B',
      'dropbox': '#0061FF',
      'figma': '#F24E1E',
      'notion': '#000000',
      'vimeo': '#1AB7EA',
      'tumblr': '#35465C',
      'snapchat': '#FFFC00',
    };
    return colors[platform.toLowerCase()] || 'var(--color-primary)';
  };

  const togglePlatform = (platform: string) => {
    setExpandedPlatforms(prev => ({
      ...prev,
      [platform]: !prev[platform]
    }));
  };

  const toggleAll = () => {
    const allPlatforms = Object.keys(groupedSocials);
    const allExpanded = allPlatforms.length > 0 && allPlatforms.every(platform => expandedPlatforms[platform]);
    
    if (allExpanded) {
      collapseAll();
    } else {
      expandAll();
    }
  };

  const collapseAll = () => {
    const allCollapsed = Object.keys(groupedSocials).reduce((acc, platform) => {
      acc[platform] = false;
      return acc;
    }, {} as Record<string, boolean>);
    setExpandedPlatforms(allCollapsed);
  };

  const expandAll = () => {
    const allExpanded = Object.keys(groupedSocials).reduce((acc, platform) => {
      acc[platform] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setExpandedPlatforms(allExpanded);
  };

  const groupedSocials = socials.reduce((acc: Record<string, Social[]>, social: Social) => {
    if (!acc[social.platform]) {
      acc[social.platform] = [];
    }
    acc[social.platform]!.push(social);
    return acc;
  }, {});

  const sortedGroupedSocials = Object.keys(groupedSocials)
    .sort()
    .reduce((acc: Record<string, Social[]>, platform) => {
      acc[platform] = groupedSocials[platform]!.sort((a, b) => a.name.localeCompare(b.name));
      return acc;
    }, {});

  const allPlatforms = Object.keys(sortedGroupedSocials);
  const allExpanded = allPlatforms.length > 0 && allPlatforms.every(platform => expandedPlatforms[platform]);

  if (isLoading) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-32" style={{ backgroundColor: 'var(--color-bg)' } as CSSProperties}>
          <div className="animate-pulse" style={{ color: 'var(--color-text-muted)' } as CSSProperties}>Loading socials...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 space-y-4 sm:space-y-0">
        <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text)' } as CSSProperties}>Socials</h1>
        <div className="relative flex items-center w-full sm:w-auto" style={{ height: '40px' }}>
          <button
            onClick={toggleAll}
            className="px-4 py-2 text-sm font-medium transition-colors border hover:bg-opacity-90 flex items-center justify-center"
            style={{
              backgroundColor: 'var(--color-secondary)',
              color: 'var(--color-text)',
              border: '1px solid var(--color-primary)',
              borderBottom: '1px solid transparent',
              borderRadius: '5px 5px 0 0',
              height: 'calc(100% + 1px)',
              minHeight: '40px',
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '-1px',
              padding: '0.5rem 1rem',
              transform: 'translateY(1px)'
            } as CSSProperties}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            <span className="mr-2">{allExpanded ? 'Collapse All' : 'Expand All'}</span>
            <svg
              className={`w-4 h-4 transition-transform ${allExpanded ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              style={{ color: 'var(--color-text-muted)' } as CSSProperties}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="space-y-2">
        {Object.entries(sortedGroupedSocials).map(([platform, platformSocials]) => {
          const isExpanded = expandedPlatforms[platform] !== false;
          const Icon = getPlatformIcon(platform);
          const displayName = getPlatformDisplayName(platform);
          
          return (
            <div key={platform} className="rounded-xl overflow-hidden">
              <button
                onClick={() => togglePlatform(platform)}
                className={`w-full px-6 py-4 transition-all duration-200 flex justify-between items-center rounded-xl`}
                style={{
                  backgroundColor: isExpanded ? 'var(--color-secondary)' : 'var(--color-bg-hover)',
                  border: `1px solid ${isExpanded ? 'var(--color-border)' : 'var(--color-border-muted)'}`,
                  '--platform-color': getPlatformColor(platform),
                  '--hover-bg': `${getPlatformColor(platform)}20`,
                  '--hover-border': `${getPlatformColor(platform)}40`
                } as CSSProperties}
                onMouseEnter={(e) => {
                  if (!isExpanded) {
                    e.currentTarget.style.setProperty('background-color', 'var(--hover-bg)');
                    e.currentTarget.style.setProperty('border-color', 'var(--hover-border)');
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isExpanded) {
                    e.currentTarget.style.setProperty('background-color', 'var(--color-bg-hover)');
                    e.currentTarget.style.setProperty('border-color', 'var(--color-border-muted)');
                  }
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="h-5 w-5" style={{ color: 'var(--color-text)' }}>
                    <Icon className="h-full w-full" />
                  </div>
                  <span className="font-medium" style={{ color: 'var(--color-text)' }}>{displayName}</span>
                  <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>({platformSocials.length})</span>
                </div>
                <div className={`h-5 w-5 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`} style={{ color: 'var(--color-text-muted)' }}>
                  <ChevronDown className="h-full w-full" />
                </div>
              </button>
              
              <div 
                className={`transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${isExpanded ? 'max-h-[5000px] opacity-100 mt-2 overflow-visible' : 'max-h-0 opacity-0 overflow-hidden'}`}
                style={{
                  transitionProperty: 'max-height, opacity, margin, transform',
                  transitionTimingFunction: 'cubic-bezier(0.25, 0.8, 0.25, 1)',
                  transitionDuration: '500ms',
                  transform: isExpanded ? 'translateY(0)' : 'translateY(-8px)'
                } as CSSProperties}
              >
                <div className="space-y-2 pr-1 py-1">
                  {platformSocials.map((social) => {
                    const userKey = `${social.platform}-${social.name}`;
                    const stats = userStats[userKey];
                    
                    return (
                      <a
                        key={social.url}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block group"
                      >
                        <div 
                          className="p-4 rounded-xl transition-all duration-300 backdrop-blur-sm group"
                          style={{
                            backgroundColor: 'var(--color-card-bg)',
                            border: '1px solid var(--color-border)',
                            '--hover-color': getPlatformColor(social.platform),
                            '--hover-bg': 'var(--color-card-hover)'
                          } as CSSProperties}
                          onMouseEnter={(e) => {
                            const hoverColor = getPlatformColor(social.platform);
                            e.currentTarget.style.setProperty('background-color', `${hoverColor}15`);
                            e.currentTarget.style.setProperty('border-color', `${hoverColor}40`);
                            e.currentTarget.style.setProperty('box-shadow', `0 4px 20px -5px ${hoverColor}40`);
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.setProperty('background-color', 'var(--color-card-bg)');
                            e.currentTarget.style.setProperty('border-color', 'var(--color-border)');
                            e.currentTarget.style.setProperty('box-shadow', 'none');
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {stats?.avatar ? (
                                <img
                                  src={stats.avatar}
                                  alt={`${social.name}'s avatar`}
                                  className="w-10 h-10 rounded-full border border-white/10"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-opacity-40 transition-colors duration-300"
                                  style={{
                                    '--hover-color': getPlatformColor(social.platform),
                                    borderColor: 'var(--hover-color, var(--color-border))',
                                    backgroundColor: 'rgba(var(--hover-color, var(--color-border-rgb)), 0.1)'
                                  } as unknown as CSSProperties}>
                                  <div className="h-5 w-5 transition-colors duration-300" 
                                    style={{
                                      color: 'var(--hover-color, var(--color-text-muted))'
                                    }}>
                                    <Icon className="h-full w-full" />
                                  </div>
                                </div>
                              )}
                              <div>
                                  <div className="font-medium transition-colors group-hover:text-primary"
                                    style={{ color: 'var(--color-text)' } as CSSProperties}>
                                  {social.name}
                                </div>
                                {stats && (
                                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                                    {Object.entries(stats)
                                      .filter(([key]) => key !== 'avatar')
                                      .map(([key, value]) => (
                                        <div key={key} className="flex items-center text-xs transition-colors hover:text-current">
                                          <span className="font-medium" style={{ color: 'var(--color-text)' } as CSSProperties}>{key}:</span>
                                          <span className="ml-1">{value}</span>
                                        </div>
                                      ))}
                                  </div>
                                )}
                              </div>
                            </div>
                            <ExternalLink className="h-4 w-4 transition-colors hover:text-primary"
                              style={{ color: 'var(--color-text-muted)' } as CSSProperties} />
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
