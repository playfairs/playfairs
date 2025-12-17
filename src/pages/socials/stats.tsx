import { FaGithub, FaSteam, FaSpotify, FaTwitter, FaInstagram, FaYoutube, FaDiscord, FaTelegram } from "react-icons/fa";
import { SiTiktok, SiX, SiLastdotfm, SiGitlab } from "react-icons/si";

export interface PlatformStats {
  followers?: string;
  following?: string;
  repos?: string;
  likes?: string;
  playlists?: string;
  avatar?: string;
  posts?: string;
  videos?: string;
  subscribers?: string;
  scrobbles?: string;
  artists?: string;
  tracks?: string;
  topArtist?: string;
  topArtistPlays?: string;
  topTrack?: string;
  topAlbum?: string;
  status?: 'online' | 'idle' | 'dnd' | 'offline';
  username?: string;
  discriminator?: string;
  display_name?: string;
  [key: string]: string | undefined;
}

export interface PlatformConfig {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  fetchStats?: (username: string) => Promise<PlatformStats>;
  showStats: boolean;
}

export const platformIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  github: FaGithub,
  gitlab: SiGitlab,
  tiktok: SiTiktok,
  spotify: FaSpotify,
  twitter: SiX,
  x: SiX,
  instagram: FaInstagram,
  youtube: FaYoutube,
  lastfm: SiLastdotfm,
  steam: FaSteam,
  discord: FaDiscord,
  telegram: FaTelegram
};

export const platformNames: Record<string, string> = {
  github: 'GitHub',
  gitlab: 'GitLab',
  tiktok: 'TikTok',
  spotify: 'Spotify',
  twitter: 'Twitter',
  x: 'X',
  instagram: 'Instagram',
  youtube: 'YouTube',
  linkedin: 'LinkedIn',
  lastfm: 'LastFM',
  steam: 'Steam',
  discord: 'Discord',
  telegram: 'Telegram'
};

async function fetchGitLabStats(username: string): Promise<PlatformStats> {
  try {
    const endpoints = [
      `https://gitlab.com/api/v4/users?username=${username}`,
      `https://gitlab.com/api/v4/users/${username}`
    ];
    
    let data = null;
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint);
        if (response.ok) {
          const responseData = await response.json();
          
          if (Array.isArray(responseData) && responseData.length > 0) {
            data = responseData[0];
            break;
          } else if (responseData.id) {
            data = responseData;
            break;
          }
        }
      } catch (err) {
        continue;
      }
    }
    
    if (!data) {
      throw new Error('Could not fetch GitLab user data');
    }
    
    return {
      avatar: data.avatar_url || data.avatar
    };
  } catch (error) {
    console.error("Error fetching GitLab avatar:", error);
    return {
      avatar: undefined
    };
  }
}

async function fetchGitHubStats(username: string): Promise<PlatformStats> {
  try {
    const [userResponse, orgsResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`),
      fetch(`https://api.github.com/users/${username}/orgs`)
    ]);
    
    if (!userResponse.ok) {
      throw new Error('Failed to fetch GitHub user stats');
    }
    
    const userData = await userResponse.json();
    
    let orgs: string[] = [];
    let orgCount = 0;
    if (orgsResponse.ok) {
      const orgsData = await orgsResponse.json();
      orgCount = orgsData.length;
    }
    
    return {
      followers: userData.followers?.toLocaleString() || "0",
      following: userData.following?.toLocaleString() || "0",
      repos: userData.public_repos?.toLocaleString() || "0",
      avatar: userData.avatar_url,
      orgs: orgCount.toString()
    };
  } catch (error) {
    console.error("Error fetching GitHub stats:", error);
    return {
      followers: "N/A",
      following: "N/A",
      repos: "N/A"
    };
  }
}

async function fetchInstagramStats(username: string): Promise<PlatformStats> {
  try {
    const response = await fetch(`/api/instagram-stats?username=${username}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch Instagram stats');
    }
    
    const data = await response.json();
    
    return {
      followers: data.followers?.toLocaleString() || "N/A",
      following: data.following?.toLocaleString() || "N/A",
      posts: data.posts?.toLocaleString() || "N/A"
    };
  } catch (error) {
    console.error("Error fetching Instagram stats:", error);
    return {
      followers: "N/A",
      following: "N/A",
      posts: "N/A"
    };
  }
}

async function fetchTikTokStats(username: string): Promise<PlatformStats> {
  try {
    const response = await fetch(`/api/tiktok-stats?username=${username}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch TikTok stats');
    }
    
    const data = await response.json();
    
    return {
      followers: data.followers?.toLocaleString() || "N/A",
      following: data.following?.toLocaleString() || "N/A", 
      likes: data.likes?.toLocaleString() || "N/A",
      videos: data.videos?.toLocaleString() || "N/A"
    };
  } catch (error) {
    console.error("Error fetching TikTok stats:", error);
    return {
      followers: "N/A",
      following: "N/A", 
      likes: "N/A",
      videos: "N/A"
    };
  }
}

async function fetchTwitterStats(username: string): Promise<PlatformStats> {
  try {
    const response = await fetch(`/api/twitter-stats?username=${username}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch Twitter/X stats');
    }
    
    const data = await response.json();
    
    return {
      followers: data.followers?.toLocaleString() || "N/A",
      following: data.following?.toLocaleString() || "N/A",
      posts: data.posts?.toLocaleString() || "N/A"
    };
  } catch (error) {
    console.error("Error fetching Twitter/X stats:", error);
    return {
      followers: "N/A",
      following: "N/A",
      posts: "N/A"
    };
  }
}

async function fetchLastfmStats(username: string): Promise<PlatformStats> {
  try {
    const apiKey = 'baa82ae8105472406a1f05deee9ec88a'; // Production API key, I know it's not secure but this is the only thing using this key, and it's really not that big of a deal to me, since it's just LastFM :)
        
    const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${username}&api_key=${apiKey}&format=json`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Last.fm stats: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      console.error('Last.fm API error:', data);
      throw new Error(data.message || 'Last.fm API error');
    }
    
    const user = data.user;
    
    const avatar = user.image?.find((img: any) => img.size === 'medium')?.['#text'] || user.image?.[0]?.['#text'];
    
    const [topArtistsResponse, topTracksResponse] = await Promise.all([
      fetch(`https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${username}&api_key=${apiKey}&limit=1&format=json`),
      fetch(`https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${username}&api_key=${apiKey}&limit=1&format=json`)
    ]);
    
    const topArtistsData = topArtistsResponse.ok ? await topArtistsResponse.json() : null;
    const topTracksData = topTracksResponse.ok ? await topTracksResponse.json() : null;
    
    const topArtist = topArtistsData?.topartists?.artist?.[0];
    const topArtistName = topArtist?.name || "N/A";
    
    const scrobbles = user.playcount ? parseInt(user.playcount).toLocaleString() : "N/A";
    const artists = user.artist_count ? parseInt(user.artist_count).toLocaleString() : (topArtistsData?.topartists?.['@attr']?.total ? parseInt(topArtistsData.topartists['@attr'].total).toLocaleString() : "N/A");
    const tracks = user.track_count ? parseInt(user.track_count).toLocaleString() : (topTracksData?.toptracks?.['@attr']?.total ? parseInt(topTracksData.toptracks['@attr'].total).toLocaleString() : "N/A");
    const topArtistPlays = topArtist?.playcount ? parseInt(topArtist.playcount).toLocaleString() : "N/A";
    
    const stats = {
      scrobbles,
      artists,
      tracks,
      topArtist: topArtistName,
      topArtistPlays,
      avatar: avatar || undefined
    };
    
    return stats;
  } catch (error) {
    console.error("Error fetching Last.fm stats:", error);
    return {
      scrobbles: "N/A",
      artists: "N/A", 
      tracks: "N/A"
    };
  }
}

async function fetchSpotifyStats(username: string): Promise<PlatformStats> {
  try {
    const response = await fetch(`/api/spotify-stats?username=${username}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch Spotify stats');
    }
    
    const data = await response.json();
    
    return {
      followers: data.followers?.toLocaleString() || "N/A",
      following: data.following?.toLocaleString() || "N/A",
      playlists: data.playlists?.toLocaleString() || "N/A"
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

async function fetchDiscordStats(userId: string): Promise<PlatformStats> {
  try {
    const response = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
    const data = await response.json();
    
    if (data.success && data.data) {
      const { discord_user, discord_status, activities } = data.data;
      return {
        username: discord_user.username,
        discriminator: discord_user.discriminator,
        display_name: discord_user.display_name || discord_user.username,
        status: discord_status,
        avatar: `https://cdn.discordapp.com/avatars/${userId}/${discord_user.avatar}.png?size=256`,
        activity: activities.length > 0 ? activities[0].name : undefined
      };
    }
    return {};
  } catch (error) {
    console.error("Error fetching Discord data:", error);
    return {};
  }
}

export const platformConfigs: Record<string, PlatformConfig> = {
  github: {
    name: 'GitHub',
    icon: FaGithub,
    fetchStats: fetchGitHubStats,
    showStats: true
  },
  gitlab: {
    name: 'GitLab',
    icon: SiGitlab,
    fetchStats: fetchGitLabStats,
    showStats: true
  },
  instagram: {
    name: 'Instagram',
    icon: FaInstagram,
    fetchStats: fetchInstagramStats,
    showStats: false
  },
  tiktok: {
    name: 'TikTok',
    icon: SiTiktok,
    fetchStats: fetchTikTokStats,
    showStats: false
  },
  spotify: {
    name: 'Spotify',
    icon: FaSpotify,
    fetchStats: fetchSpotifyStats,
    showStats: false
  },
  steam: {
    name: 'Steam',
    icon: FaSteam,
    showStats: false
  },
  discord: {
    name: 'Discord',
    icon: FaDiscord,
    fetchStats: fetchDiscordStats,
    showStats: true
  },
  telegram: {
    name: 'Telegram',
    icon: FaTelegram,
    showStats: false
  },
  x: {
    name: 'X',
    icon: SiX,
    showStats: false
  },
  youtube: {
    name: 'YouTube',
    icon: FaYoutube,
    showStats: false
  },
  lastfm: {
    name: 'LastFM',
    icon: SiLastdotfm,
    fetchStats: fetchLastfmStats,
    showStats: true
  }
};

export function getPlatformIcon(platformName: string): React.ComponentType<{ className?: string }> {
  return platformIcons[platformName] || FaGithub;
}

export function getPlatformDisplayName(platformName: string): string {
  return platformNames[platformName] || platformName.charAt(0).toUpperCase() + platformName.slice(1);
}

export function shouldFetchStats(platformName: string): boolean {
  const config = platformConfigs[platformName];
  return config ? (config.showStats && !!config.fetchStats) : false;
}

export async function fetchPlatformStats(platformName: string, username: string): Promise<PlatformStats> {
  const config = platformConfigs[platformName];
  
  if (!config || !config.fetchStats) {
    return {
      followers: "N/A",
      following: "N/A"
    };
  }
  
  return await config.fetchStats(username);
}
