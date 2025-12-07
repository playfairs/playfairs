import { useState, useEffect, useRef } from 'react'

interface NowPlayingData {
  track: string
  artist: string
  album: string
  url: string
  isPlaying: boolean
  coverArt?: string
  trackPlays?: string
  artistPlays?: string
}

export default function NowPlaying() {
  const [nowPlaying, setNowPlaying] = useState<NowPlayingData | null>(null)
  const [topArtist, setTopArtist] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 })

  const updateGlowEffect = (clientX: number, clientY: number) => {
    if (!containerRef.current) return
    
    const card = containerRef.current
    const rect = card.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const mouseX = clientX - centerX
    const mouseY = clientY - centerY
    
    const distance = Math.min(1, Math.sqrt(mouseX * mouseX + mouseY * mouseY) / (rect.width / 2))
    const intensity = 0.7 + (distance * 0.5)
    const glowX = ((clientX - rect.left) / rect.width) * 100
    const glowY = ((clientY - rect.top) / rect.height) * 100
    
    card.style.setProperty('--glow-opacity', (0.1 + (distance * 0.15)).toString())
    card.style.setProperty('--glow-intensity', intensity.toString())
    card.style.setProperty('--glow-spread', `${8 + (distance * 20)}px`)
    card.style.setProperty('--glow-blur', `${20 + (distance * 40)}px`)
    
    setGlowPosition({ x: glowX, y: glowY })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    updateGlowEffect(e.clientX, e.clientY)
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches?.[0]
    if (touch) {
      updateGlowEffect(touch.clientX, touch.clientY)
    }
  }

  const handleMouseLeave = () => {
    if (containerRef.current) {
      containerRef.current.style.setProperty('--glow-opacity', '0.1')
      containerRef.current.style.setProperty('--glow-intensity', '1.7')
      containerRef.current.style.setProperty('--glow-spread', '8px')
      containerRef.current.style.setProperty('--glow-blur', '20px')
    }
    setGlowPosition({ x: 50, y: 50 })
  }

  const truncateText = (text: string, maxLength: number = 20): string => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
    }
    return text
  }

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const apiKey = 'baa82ae8105472406a1f05deee9ec88a'
        const username = 'pdwk'
        
        const [recentResponse, topTracksResponse, topArtistsResponse] = await Promise.all([
          fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json&limit=1`),
          fetch(`https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${username}&api_key=${apiKey}&limit=1&format=json`),
          fetch(`https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${username}&api_key=${apiKey}&limit=1&format=json`)
        ])
        
        if (!recentResponse.ok) {
          throw new Error('Failed to fetch now playing')
        }
        
        const recentData = await recentResponse.json()
        
        if (recentData.recenttracks && recentData.recenttracks.track && recentData.recenttracks.track.length > 0) {
          const track = recentData.recenttracks.track[0]
          
          let trackPlays = 'N/A'
          let artistPlays = 'N/A'
          
          try {
            const trackInfoResponse = await fetch(
              `https://ws.audioscrobbler.com/2.0/?method=track.getinfo&api_key=baa82ae8105472406a1f05deee9ec88a&artist=${encodeURIComponent(track.artist['#text'])}&track=${encodeURIComponent(track.name)}&username=pdwk&format=json`
            )
            if (trackInfoResponse.ok) {
              const trackInfoData = await trackInfoResponse.json()
              if (trackInfoData.track?.userplaycount) {
                trackPlays = parseInt(trackInfoData.track.userplaycount).toLocaleString()
              } else if (trackInfoData.track?.playcount) {
                trackPlays = parseInt(trackInfoData.track.playcount).toLocaleString()
              }
            }
          } catch (error) {
            console.error('Error fetching track play count:', error)
          }
          
          try {
            const artistInfoResponse = await fetch(
              `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&api_key=baa82ae8105472406a1f05deee9ec88a&artist=${encodeURIComponent(track.artist['#text'])}&username=pdwk&format=json`
            )
            if (artistInfoResponse.ok) {
              const artistInfoData = await artistInfoResponse.json()
              if (artistInfoData.artist?.stats?.userplaycount) {
                artistPlays = parseInt(artistInfoData.artist.stats.userplaycount).toLocaleString()
              } else if (artistInfoData.artist?.stats?.playcount) {
                artistPlays = parseInt(artistInfoData.artist.stats.playcount).toLocaleString()
              }
            }
          } catch (error) {
            console.error('Error fetching artist play count:', error)
          }
          
          setNowPlaying({
            track: track.name,
            artist: track.artist['#text'],
            album: track.album['#text'],
            url: track.url,
            isPlaying: track['@attr']?.nowplaying === 'true',
            coverArt: track.image?.find((img: any) => img.size === 'medium')?.['#text'] || track.image?.[0]?.['#text'],
            trackPlays,
            artistPlays
          })
        } else {
          setNowPlaying(null)
        }
      } catch (error) {
        console.error('Error fetching now playing:', error)
        if (error instanceof Error) {
          console.error('Error message:', error.message)
          console.error('Error stack:', error.stack)
        }
        setNowPlaying(null)
      } finally {
        setLoading(false)
      }
    }

    const fetchTopArtist = async () => {
      try {
        const response = await fetch(
          `https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=pdwk&api_key=baa82ae8105472406a1f05deee9ec88a&limit=1&format=json`
        );
        if (response.ok) {
          const data = await response.json();
          if (data.topartists?.artist?.[0]?.name) {
            setTopArtist(data.topartists.artist[0].name);
          }
        }
      } catch (error) {
        console.error('Error fetching top artist:', error);
      }
    };

    fetchNowPlaying();
    fetchTopArtist();
    
    const interval = setInterval(() => {
      fetchNowPlaying();
      if (Math.random() < 0.1) {
        fetchTopArtist();
      }
    }, 2000);

    const truncateText = (text: string, maxLength: number = 20): string => {
      if (typeof window !== 'undefined' && window.innerWidth < 640) {
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
      }
      return text
    };

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="relative group w-full max-w-2xl mx-auto">
        <div 
          className="absolute -inset-1 rounded-lg bg-linear-to-r from-purple-600 to-pink-600 opacity-75 group-hover:opacity-100 blur transition-all duration-200"
        />
        <div 
          className="relative w-full rounded-lg transition-all duration-200 ease-out p-4"
          style={{ 
            backgroundColor: 'var(--color-card-bg)',
            border: '1px solid var(--color-border)'
          }}
        >
          <div className="text-sm text-gray-400">Loading...</div>
        </div>
      </div>
    )
  }

  if (!nowPlaying || !nowPlaying.isPlaying) {
    return (
      <div className="relative group w-full max-w-2xl mx-auto">
        <div 
          className="absolute -inset-1 rounded-lg bg-linear-to-r from-purple-600 to-pink-600 opacity-75 group-hover:opacity-100 blur transition-all duration-200"
        />
        <div 
          className="relative w-full rounded-lg transition-all duration-200 ease-out p-4"
          style={{ 
            backgroundColor: 'var(--color-card-bg)',
            border: '1px solid var(--color-border)'
          }}
        >
          <div className="text-sm text-gray-400">Not currently playing</div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative group w-full max-w-2xl mx-auto">
      <div 
        className="absolute -inset-1 rounded-lg bg-linear-to-r from-purple-600 via-pink-500 to-purple-600 bg-size-[200%_200%] opacity-75 group-hover:opacity-100 blur transition-all duration-200 group-hover:animate-gradient-rotate"
        style={{
          backgroundPosition: '0% 50%',
          animation: 'gradient-rotate 6s linear infinite',
          animationPlayState: 'paused'
        }}
      />
      <div 
        ref={containerRef}
        className="relative w-full rounded-lg transition-all duration-200 ease-out p-4 text-left"
        style={{ 
          backgroundColor: 'var(--color-card-bg)',
          border: '1px solid var(--color-border)',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseLeave}
      >
        <div className="flex items-center space-x-4 w-full">
          <div className="shrink-0 relative z-10">
            {nowPlaying.coverArt ? (
              <a 
                href={nowPlaying.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block hover:opacity-90 transition-opacity"
              >
              <img 
                src={nowPlaying.coverArt} 
                alt={`${nowPlaying.track} cover art`}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-md object-cover border transition-transform group-hover:scale-102"
                style={{ borderColor: 'var(--color-border)' }}
                width={64}
                height={64}
                loading="lazy"
              />
            </a>
          ) : (
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-md border flex items-center justify-center" 
                 style={{ borderColor: 'var(--color-border)', backgroundColor: 'rgba(0,0,0,0.05)' }}>
              <span className="text-xs text-gray-400">No Art</span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="flex items-center flex-wrap gap-2 mb-1">
            <span className="text-xs font-medium px-2 py-0.5 rounded-full" 
                  style={{ 
                    backgroundColor: 'var(--color-primary-faded)', 
                    color: 'var(--color-primary)' 
                  }}>
              {nowPlaying.isPlaying ? 'Now Playing' : 'Recent'}
            </span>
            
            {(nowPlaying.trackPlays || nowPlaying.artistPlays) && (
              <div className="text-xs text-gray-400 flex items-center gap-1">
                {nowPlaying.trackPlays && (
                  <span className="whitespace-nowrap">
                    <span className="font-medium">{nowPlaying.trackPlays}</span> plays
                  </span>
                )}
                {nowPlaying.trackPlays && nowPlaying.artistPlays && (
                  <span className="opacity-50">•</span>
                )}
                {nowPlaying.artistPlays && (
                  <span className="whitespace-nowrap">
                    <span className="font-medium">{nowPlaying.artistPlays}</span> artist plays
                  </span>
                )}
              </div>
            )}
          </div>
          
          <h3 
            className="text-sm sm:text-base font-medium leading-tight truncate" 
            style={{ color: 'var(--color-text)' }}
            title={nowPlaying.track}
          >
            {nowPlaying.track}
          </h3>
          
          <div className="flex flex-wrap items-center gap-x-2 text-sm text-gray-400">
            <span 
              className={nowPlaying.artist === topArtist ? 'text-yellow-400 font-medium' : ''}
              title={nowPlaying.artist}
            >
              {nowPlaying.artist}
            </span>
            
              {nowPlaying.album && (
                <>
                  <span className="opacity-50 hidden sm:inline">•</span>
                  <span className="truncate hidden sm:inline" title={nowPlaying.album}>
                    {nowPlaying.album}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
