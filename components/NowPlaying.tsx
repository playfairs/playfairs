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
  const [loading, setLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    
    const card = containerRef.current
    const rect = card.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const mouseX = e.clientX - centerX
    const mouseY = e.clientY - centerY
    
    const distance = Math.min(1, Math.sqrt(mouseX * mouseX + mouseY * mouseY) / (rect.width / 2))
    
    const intensity = 0.7 + (distance * 0.5)
    
    const glowX = ((e.clientX - rect.left) / rect.width) * 100
    const glowY = ((e.clientY - rect.top) / rect.height) * 100
    
    card.style.setProperty('--glow-opacity', (0.1 + (distance * 0.15)).toString())
    card.style.setProperty('--glow-intensity', intensity.toString())
    card.style.setProperty('--glow-spread', `${8 + (distance * 20)}px`)
    card.style.setProperty('--glow-blur', `${20 + (distance * 40)}px`)
    
    setGlowPosition({ x: glowX, y: glowY })
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

    fetchNowPlaying()
    const interval = setInterval(fetchNowPlaying, 2000)

    return () => clearInterval(interval)
  }, [])

  const containerStyles = {
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
    transition: 'all 0.2s ease-out',
    background: 'var(--color-card-bg)'
  } as React.CSSProperties;

  if (loading) {
    return (
      <div 
        className="w-[576px] mx-auto mt-6 h-8 rounded-lg flex items-center justify-center transition-all duration-200 relative"
        style={containerStyles}
      >
        <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Loading...</div>
      </div>
    )
  }

  if (!nowPlaying || !nowPlaying.isPlaying) {
    return (
      <div 
        className="w-[576px] mx-auto mt-6 h-8 rounded-lg flex items-center justify-center transition-all duration-200 relative"
        style={containerStyles}
      >
        <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Not currently playing</div>
      </div>
    )
  }

  return (
    <div 
      ref={containerRef}
      className="w-[576px] mx-auto mt-6 rounded-lg flex items-center px-6 py-4 group transition-all duration-200 relative overflow-hidden"
      style={containerStyles}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-start w-full gap-4">
        <div className="flex-1 min-w-0 relative z-10">
          {nowPlaying.url ? (
            <a 
              href={nowPlaying.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-base font-semibold block transition-colors"
              style={{
                color: 'var(--color-text)',
                '--hover-color': 'var(--color-primary)',
              } as React.CSSProperties}
              onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
              onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-text)'}
            >
              {nowPlaying.track}
            </a>
          ) : (
            <div className="text-base font-semibold" style={{ color: 'var(--color-text)' }}>
              {nowPlaying.track}
            </div>
          )}
          <div 
            className={`text-sm ${nowPlaying.artist === '$uicideboy$' ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]' : ''}`}
            style={{ color: 'var(--color-text-muted)' }}
          >
            Artist: {nowPlaying.artist}
          </div>
          <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Album: {nowPlaying.album}
          </div>
          <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            {nowPlaying.trackPlays && `Track Plays: ${nowPlaying.trackPlays}`}
            {nowPlaying.trackPlays && nowPlaying.artistPlays && ' • '}
            {nowPlaying.artistPlays && `Artist Plays: ${nowPlaying.artistPlays}`}
          </div>
        </div>
        
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
                className="w-16 h-16 rounded object-cover shrink-0 border transition-transform group-hover:scale-105"
                style={{ borderColor: 'var(--color-border)' }}
              />
            </a>
          ) : nowPlaying.coverArt ? (
            <img 
              src={nowPlaying.coverArt} 
              alt={`${nowPlaying.track} cover art`}
              className="w-16 h-16 rounded object-cover shrink-0 border transition-transform group-hover:scale-105"
              style={{ borderColor: 'var(--color-border)' }}
            />
          ) : null}
        </div>
      </div>
    </div>
  )
}
