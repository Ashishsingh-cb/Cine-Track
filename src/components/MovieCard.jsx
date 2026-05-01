import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addToWatchlist, removeFromWatchlist } from '../store/WatchlistsSlice'

const IMG_BASE = 'https://image.tmdb.org/t/p/w500'

export default function MovieCard({ movie, style }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const inWatchlist = useSelector(s => s.watchlist.items.some(i => i.id === movie.id))

  const title = movie.title || movie.name
  const date = movie.release_date || movie.first_air_date
  const type = movie.media_type || (movie.title ? 'movie' : 'tv')
  const poster = movie.poster_path ? `${IMG_BASE}${movie.poster_path}` : null

  const handleWatchlist = (e) => {
    e.stopPropagation()
    if (inWatchlist) {
      dispatch(removeFromWatchlist(movie.id))
    } else {
      dispatch(addToWatchlist({ ...movie, media_type: type }))
    }
  }

  return (
    <div
      className="fade-up"
      style={{ ...style, background: 'var(--card)', borderRadius: '10px', overflow: 'hidden', cursor: 'pointer', border: '1px solid var(--border)', transition: 'transform 0.2s' }}
      onClick={() => navigate(`/${type}/${movie.id}`)}
    >
      <div style={{ position: 'relative', aspectRatio: '2/3', overflow: 'hidden', background: 'var(--border)' }}>
        {poster
          ? <img src={poster} alt={title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>🎬</div>
        }
        <span style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(0,0,0,0.75)', color: '#f4a261', fontSize: '0.65rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px' }}>
          {type === 'tv' ? 'TV' : 'Movie'}
        </span>
        <button
          onClick={handleWatchlist}
          style={{ position: 'absolute', bottom: 8, right: 8, background: inWatchlist ? '#4caf7d' : '#e5383b', border: 'none', color: '#fff', width: 28, height: 28, borderRadius: '50%', fontSize: '1rem', cursor: 'pointer' }}
        >
          {inWatchlist ? '✓' : '+'}
        </button>
      </div>
      <div style={{ padding: '8px 10px 10px' }}>
        <p style={{ fontSize: '0.85rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 2 }}>{title}</p>
        <p style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{date?.slice(0, 4) || '—'} · ⭐ {movie.vote_average?.toFixed(1)}</p>
      </div>
    </div>
  )
}