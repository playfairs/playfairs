import { useState, useEffect } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";
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

  useEffect(() => {
    import("./socials.json")
      .then((data) => {
        const socialsData = data.default;
        
        setSocials(socialsData);
        
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
            }
          }
        });
      })
      .catch((error) => console.error("Error loading socials:", error));
  }, []);

  const togglePlatform = (platform: string) => {
    setExpandedPlatforms(prev => ({
      ...prev,
      [platform]: !prev[platform]
    }));
  };

  const toggleAll = () => {
    const allPlatforms = Object.keys(groupedSocials);
    const allExpanded = allPlatforms.every(platform => expandedPlatforms[platform]);
    
    if (allExpanded) {
      collapseAll();
    } else {
      expandAll();
    }
  };

  const collapseAll = () => {
    setExpandedPlatforms({});
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

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 bg-gray-900">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Socials</h1>
        <div className="flex space-x-2">
          <button
            onClick={toggleAll}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all duration-200 border border-gray-700"
          >
            <span className="text-sm font-medium">
              {allExpanded ? 'Collapse All' : 'Expand All'}
            </span>
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {Object.entries(sortedGroupedSocials).map(([platform, accounts]) => {
          const isExpanded = expandedPlatforms[platform] || false;
          const hasMultiple = accounts.length > 1;
          
          return (
            <div key={platform} className="border border-gray-700 bg-gray-800 rounded-lg overflow-hidden">
              <button
                onClick={() => togglePlatform(platform)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  {(() => {
                    const IconComponent = getPlatformIcon(platform);
                    return <IconComponent className="w-6 h-6 text-teal-400" />;
                  })()}
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-white">{getPlatformDisplayName(platform)}</h3>
                    <p className="text-sm text-gray-400">
                      {accounts.length} account{accounts.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                    <ChevronDown className="w-5 h-5" />
                  </span>
                </div>
              </button>
              
              <div 
                className="border-t border-gray-700 overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                  gridTemplateRows: isExpanded ? '1fr' : '0fr',
                  display: 'grid'
                }}
              >
                <div className="min-h-0">
                  {accounts.map((account, index) => (
                    <a
                      key={index}
                      href={account.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`block p-4 hover:bg-gray-700 transition-all duration-200 hover:border-l-0 border-b border-gray-700 last:border-b-0 ${account.platform === 'lastfm' ? 'p-6' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {userStats[`${account.platform}-${account.name}`]?.avatar ? (
                            <img
                              src={userStats[`${account.platform}-${account.name}`]!.avatar}
                              alt={`${account.platform} avatar`}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : account.platform === "github" ? (
                            <img
                              src={`https://avatars.githubusercontent.com/${account.name}`}
                              alt={`${account.platform} avatar`}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : account.platform === "gitlab" ? (
                            <img
                              src={`https://gitlab.com/uploads/-/system/user/avatar/${account.name}/avatar.png`}
                              alt={`${account.platform} avatar`}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : null}
                          <div>
                            <p className="text-white font-medium">@{account.name}</p>
                            {userStats[`${account.platform}-${account.name}`] && (
                              <div className={`${account.platform === 'lastfm' ? 'space-y-1' : 'flex space-x-4'} mt-1 cursor-pointer`}>
                                {account.platform === 'lastfm' ? (
                                  <>
                                    <div className="flex space-x-4 text-xs text-gray-400">
                                      <span>Scrobbles: <span className="text-gray-300 font-medium">{userStats[`${account.platform}-${account.name}`]!.scrobbles}</span></span>
                                      <span>Artists: <span className="text-gray-300 font-medium">{userStats[`${account.platform}-${account.name}`]!.artists}</span></span>
                                      <span>Tracks: <span className="text-gray-300 font-medium">{userStats[`${account.platform}-${account.name}`]!.tracks}</span></span>
                                    </div>
                                    <div className="flex space-x-4 text-xs text-gray-400">
                                      <span>Top Artist: <span className="text-gray-300 font-medium">{userStats[`${account.platform}-${account.name}`]!.topArtist}</span></span>
                                      <span>Plays: <span className="text-gray-300 font-medium">{userStats[`${account.platform}-${account.name}`]!.topArtistPlays}</span></span>
                                    </div>
                                  </>
                                ) : (
                                  Object.entries(userStats[`${account.platform}-${account.name}`]!).filter(([stat]) => stat !== 'avatar').map(([stat, value]) => (
                                    <span key={stat} className="text-xs text-gray-400">
                                      {stat}: <span className="text-gray-300 font-medium">{value}</span>
                                    </span>
                                  ))
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}