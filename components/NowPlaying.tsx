import { useState, useEffect } from 'react'

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

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const apiKey = import.meta.env.VITE_LASTFM_API_KEY
        const username = import.meta.env.VITE_LASTFM_USERNAME
        
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
        setNowPlaying(null)
      } finally {
        setLoading(false)
      }
    }

    fetchNowPlaying()
    const interval = setInterval(fetchNowPlaying, 2000)

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="w-[576px] mx-auto mt-6 h-8 bg-gray-800 rounded-lg shadow-[0_0_20px_rgba(20,184,166,0.3)] border border-teal-500/20 flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading &gt;_&lt;</div>
      </div>
    )
  }

  if (!nowPlaying || !nowPlaying.isPlaying) {
    return (
      <div className="w-[576px] mx-auto mt-6 h-8 bg-gray-800 rounded-lg shadow-[0_0_20px_rgba(20,184,166,0.3)] border border-teal-500/20 flex items-center justify-center">
        <div className="text-gray-400 text-sm">Not currently playing &gt;_&lt;</div>
      </div>
    )
  }

  return (
    <div className="w-[576px] mx-auto mt-6 bg-gray-800 rounded-lg shadow-[0_0_20px_rgba(20,184,166,0.3)] border border-teal-500/20 flex items-center px-6 py-4 group hover:shadow-[0_0_25px_rgba(20,184,166,0.4)] transition-all duration-200">
      <div className="flex items-start w-full gap-4">
        <div className="flex-1 min-w-0">
          {nowPlaying.url ? (
            <a 
              href={nowPlaying.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-300 text-base font-semibold hover:text-teal-400 transition-colors block"
            >
              {nowPlaying.track}
            </a>
          ) : (
            <div className="text-gray-300 text-base font-semibold">{nowPlaying.track}</div>
          )}
          <div className={`text-gray-500 text-sm ${nowPlaying.artist === '$uicideboy$' ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]' : ''}`}>Artist: {nowPlaying.artist}</div>
          <div className="text-gray-500 text-sm">Album: {nowPlaying.album}</div>
          <div className="text-gray-600 text-xs">
            {nowPlaying.trackPlays && `Track Plays: ${nowPlaying.trackPlays}`}
            {nowPlaying.trackPlays && nowPlaying.artistPlays && ' • '}
            {nowPlaying.artistPlays && `Artist Plays: ${nowPlaying.artistPlays}`}
          </div>
        </div>
        
        <div className="shrink-0">
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
                className="w-16 h-16 rounded object-cover shrink-0"
              />
            </a>
          ) : nowPlaying.coverArt ? (
            <img 
              src={nowPlaying.coverArt} 
              alt={`${nowPlaying.track} cover art`}
              className="w-16 h-16 rounded object-cover shrink-0"
            />
          ) : null}
        </div>
      </div>
    </div>
  )
}
