import { useState, useEffect } from "react";
import "../../index.css";

interface Social {
  name: string;
  url: string;
  platform: string;
  icon: string;
}

interface PlatformStats {
  followers: string;
  following: string;
  repos?: string;
  likes?: string;
  playlists?: string;
  [key: string]: string | undefined;
}

async function fetchGitHubStats(username: string): Promise<PlatformStats> {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    const data = await response.json();
    
    return {
      followers: data.followers?.toLocaleString() || "0",
      following: data.following?.toLocaleString() || "0", 
      repos: data.public_repos?.toLocaleString() || "0"
    };
  } catch (error) {
    console.error("Error fetching GitHub stats:", error);
    return { followers: "Error", following: "Error", repos: "Error" };
  }
}

async function fetchSpotifyStats(username: string): Promise<PlatformStats> {
  try {
    const response = await fetch(`/api/spotify-scrape?username=${username}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch Spotify stats');
    }
    
    const data = await response.json();
    
    return {
      followers: data.followers || "N/A",
      following: data.following || "N/A",
      playlists: data.playlists || "N/A"
    };
  } catch (error) {
    console.error("Error fetching Spotify stats:", error);
    return {
      followers: "N/A",
      following: "N/A",
      playlists: "N/A"
    };
  }
}

async function fetchTikTokStats(username: string): Promise<PlatformStats> {
  return {
    followers: "N/A",
    following: "N/A", 
    likes: "N/A"
  };
}

function getAvatarUrl(platform: string, username: string): string {
  if (platform === "github") {
    return `https://avatars.githubusercontent.com/${username}`;
  } else if (platform === "tiktok") {
    return `https://ui-avatars.com/api/?name=???&background=000000&color=FFFFFF`;
  }
  return `https://ui-avatars.com/api/?name=???&background=000000&color=FFFFFF`;
}

export default function SocialsPage() {
  const [socials, setSocials] = useState<Social[]>([]);
  const [userStats, setUserStats] = useState<Record<string, PlatformStats>>({});

  useEffect(() => {
    import("./socials.json")
      .then((data) => {
        const socialsData = data.default;
        
        const sortedSocials = socialsData.sort((a: Social, b: Social) => {
          const platformCompare = a.platform.localeCompare(b.platform);
          if (platformCompare !== 0) return platformCompare;
          
          return a.name.localeCompare(b.name);
        });
        
        setSocials(sortedSocials);
        
        sortedSocials.forEach(async (social: Social) => {
          let stats: PlatformStats;
          
          if (social.platform === "github") {
            stats = await fetchGitHubStats(social.name);
          } else if (social.platform === "tiktok") {
            stats = await fetchTikTokStats(social.name);
          } else {
            stats = { followers: "N/A", following: "N/A" };
          }
          
          const userKey = `${social.platform}-${social.name}`;
          setUserStats(prev => ({
            ...prev,
            [userKey]: stats
          }));
        });
      })
      .catch((error) => console.error("Error loading socials:", error));
  }, []);

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Socials</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {socials.map((social, index) => (
          <a
            key={index}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 relative"
          >
            <div className="absolute top-2 right-2 w-12 h-12 rounded-lg overflow-hidden">
              <img
                src={getAvatarUrl(social.platform, social.name)}
                alt={`${social.platform} avatar`}
                className="w-full h-full object-cover"
              />
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 capitalize mb-1">
              {social.platform}
            </h3>
            
            <p className="text-sm text-gray-600 mb-3">
              @{social.name}
            </p>
            
            <div className="space-y-1">
              {userStats[`${social.platform}-${social.name}`] && 
                Object.entries(userStats[`${social.platform}-${social.name}`]!).map(([stat, value]) => (
                  <div key={stat} className="flex justify-between items-center">
                    <span className="text-xs text-gray-600 capitalize">
                      {stat}:
                    </span>
                    <span className="text-xs font-semibold text-gray-900">
                      {value}
                    </span>
                  </div>
                ))
              }
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}