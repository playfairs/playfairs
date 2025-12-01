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
      <div 
        className="w-[90vw] sm:w-[80vw] md:w-[700px] lg:w-[576px] mx-auto rounded-xl overflow-hidden transition-all duration-200 ease-out relative group p-3 sm:p-4 md:p-6"
        style={{ 
          backgroundColor: 'var(--color-card-bg)',
          border: '1px solid var(--color-border)',
          '--glow-opacity': '0.1',
          '--glow-color': 'var(--color-iris, #c4a7e7)',
          '--glow-color-rgb': '196, 167, 231',
          '--glow-spread': '8px',
          '--glow-blur': '20px',
          '--glow-intensity': '1.7',
          boxShadow: `0 0 var(--glow-blur) calc(var(--glow-spread) / 2) rgba(var(--glow-color-rgb), calc(0.3 * var(--glow-intensity))),
                    0 0 calc(var(--glow-blur) * 1.5) var(--glow-spread) rgba(var(--glow-color-rgb), calc(0.2 * var(--glow-intensity))),
                    inset 0 0 15px rgba(var(--glow-color-rgb), 0.1)`,
          background: `radial-gradient(circle at 50% 50%, 
            rgba(var(--glow-color-rgb), calc(0.3 * var(--glow-opacity))) 0%, transparent 60%), 
            radial-gradient(circle at 50% 25%, rgba(var(--glow-color-rgb), 0.15) 0%, transparent 40%), 
            var(--color-card-bg)`
        } as React.CSSProperties}
      >
        <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Loading...</div>
      </div>
    )
  }

  if (!nowPlaying || !nowPlaying.isPlaying) {
    return (
      <div 
        className="w-[90vw] sm:w-[80vw] md:w-[700px] lg:w-[576px] mx-auto rounded-xl overflow-hidden transition-all duration-200 ease-out relative group p-3 sm:p-4 md:p-6"
        style={{ 
          backgroundColor: 'var(--color-card-bg)',
          border: '1px solid var(--color-border)',
          '--glow-opacity': '0.1',
          '--glow-color': 'var(--color-iris, #c4a7e7)',
          '--glow-color-rgb': '196, 167, 231',
          '--glow-spread': '8px',
          '--glow-blur': '20px',
          '--glow-intensity': '1.7',
          boxShadow: `0 0 var(--glow-blur) calc(var(--glow-spread) / 2) rgba(var(--glow-color-rgb), calc(0.3 * var(--glow-intensity))),
                    0 0 calc(var(--glow-blur) * 1.5) var(--glow-spread) rgba(var(--glow-color-rgb), calc(0.2 * var(--glow-intensity))),
                    inset 0 0 15px rgba(var(--glow-color-rgb), 0.1)`,
          background: `radial-gradient(circle at 50% 50%, 
            rgba(var(--glow-color-rgb), calc(0.3 * var(--glow-opacity))) 0%, transparent 60%), 
            radial-gradient(circle at 50% 25%, rgba(var(--glow-color-rgb), 0.15) 0%, transparent 40%), 
            var(--color-card-bg)`
        } as React.CSSProperties}
      >
        <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Not currently playing</div>
      </div>
    )
  }

  return (
    <div 
      ref={containerRef}
      className="w-[90vw] sm:w-[80vw] md:w-[700px] lg:w-[576px] mx-auto rounded-xl overflow-hidden transition-all duration-200 ease-out relative group p-3 sm:p-4 md:p-6"
      style={{ 
        backgroundColor: 'var(--color-card-bg)',
        border: '1px solid var(--color-border)',
        '--glow-opacity': '0.1',
        '--glow-color': 'var(--color-iris, #c4a7e7)',
        '--glow-color-rgb': '196, 167, 231',
        '--glow-spread': '8px',
        '--glow-blur': '20px',
        '--glow-intensity': '1.7',
        boxShadow: `0 0 var(--glow-blur) calc(var(--glow-spread) / 2) rgba(var(--glow-color-rgb), calc(0.3 * var(--glow-intensity))),
                  0 0 calc(var(--glow-blur) * 1.5) var(--glow-spread) rgba(var(--glow-color-rgb), calc(0.2 * var(--glow-intensity))),
                  inset 0 0 15px rgba(var(--glow-color-rgb), 0.1)`,
        background: `radial-gradient(circle at 50% 50%, 
          rgba(var(--glow-color-rgb), calc(0.3 * var(--glow-opacity))) 0%, transparent 60%), 
          radial-gradient(circle at 50% 25%, rgba(var(--glow-color-rgb), 0.15) 0%, transparent 40%), 
          var(--color-card-bg)`
      } as React.CSSProperties}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseLeave}
    >
      <div className="flex items-center space-x-3 sm:space-x-4">
        <div className="shrink-0 relative z-10">
          {nowPlaying.coverArt && nowPlaying.url ? (
            <a 
              href={nowPlaying.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block hover:opacity-80 transition-opacity"
            >
              <img 
                src={nowPlaying.coverArt} 
                alt={`${nowPlaying.track} cover art`}
                className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded object-cover border transition-transform group-hover:scale-105"
                style={{ borderColor: 'var(--color-border)' }}
                width={64}
                height={64}
                loading="lazy"
              />
            </a>
          ) : nowPlaying.coverArt ? (
            <img 
              src={nowPlaying.coverArt} 
              alt={`${nowPlaying.track} cover art`}
              className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded object-cover border transition-transform group-hover:scale-105"
              style={{ borderColor: 'var(--color-border)' }}
              width={64}
              height={64}
              loading="lazy"
            />
          ) : null}
        </div>

        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="flex items-center space-x-2 mb-1.5 sm:mb-2">
            <div className="text-xs font-medium px-1.5 py-0.5 rounded" style={{ 
              backgroundColor: 'var(--color-primary-faded)', 
              color: 'var(--color-primary)' 
            }}>
              {nowPlaying.isPlaying ? 'Now Playing' : 'Recent'}
            </div>
            
            {(nowPlaying.trackPlays || nowPlaying.artistPlays) && (
              <div className="immediateOverflow shrink-0 text-xs opacity-70 whitespace-nowrap overflow-hidden text-ellipsis" style={{ color: 'var(--color-text-muted)' }}>
                {nowPlaying.trackPlays && <span className="whitespace-nowrap"><span className="font-bold">Plays:</span> {nowPlaying.trackPlays}</span>}
                {nowPlaying.trackPlays && nowPlaying.artistPlays && <span className="mx-1">•</span>}
                {nowPlaying.artistPlays && <span className="whitespace-nowrap"><span className="font-bold">Artist:</span> {nowPlaying.artistPlays}</span>}
              </div>
            )}
          </div>
          
          {nowPlaying.url ? (
            <a 
              href={nowPlaying.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm sm:text-base font-semibold hover:text-primary transition-colors block truncate"
              style={{
                color: 'var(--color-text)',
                '--hover-color': 'var(--color-primary)'
              } as React.CSSProperties}
              onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
              onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-text)'}
            >
              {truncateText(nowPlaying.track, window.innerWidth < 640 ? 20 : 30)}
            </a>
          ) : (
            <div className="text-sm sm:text-base font-semibold truncate" style={{ color: 'var(--color-text)' }}>
              {truncateText(nowPlaying.track, window.innerWidth < 640 ? 20 : 30)}
            </div>
          )}
          
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
            <div 
              className={`text-xs sm:text-sm truncate ${
                nowPlaying.artist === topArtist 
                  ? 'text-yellow-400 drop-shadow-[0_0_4px_rgba(250,204,21,0.5)] font-medium' 
                  : ''
              }`}
              style={{ color: nowPlaying.artist === topArtist ? '' : 'var(--color-text-muted)' }}
              title={nowPlaying.artist}
            >
              {truncateText(nowPlaying.artist, window.innerWidth < 640 ? 15 : 25)}
            </div>
            
            {nowPlaying.album && (
              <>
                <span className="text-xs opacity-50 hidden sm:inline">•</span>
                <div 
                  className="text-xs sm:text-sm truncate hidden sm:block" 
                  style={{ color: 'var(--color-text-muted)', opacity: 0.8 }}
                  title={nowPlaying.album}
                >
                  {truncateText(nowPlaying.album, window.innerWidth < 768 ? 15 : 25)}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
