import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { removeFromWatchlist, toggleWatched } from '../store/WatchlistsSlice'
import { useNavigate } from 'react-router-dom'
import { IMG_BASE } from '../utils/tmdb'
import styles from './Watchlist.module.css'

export default function Watchlist() {
  const items = useSelector(s => s.watchlist.items)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [filter, setFilter] = useState('all')

  const filtered = items.filter(i => {
    if (filter === 'watched') return i.watched
    if (filter === 'unwatched') return !i.watched
    return true
  })

  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>🎬</div>
        <h2>Your watchlist is empty</h2>
        <p>Start exploring and add movies & shows you want to watch!</p>
        <button className={styles.exploreBtn} onClick={() => navigate('/explore')}>
          Explore Now
        </button>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Watchlist</h1>
        <div className={styles.stats}>
          <span>{items.length} total</span>
          <span className={styles.dot}>·</span>
          <span className={styles.watched}>{items.filter(i => i.watched).length} watched</span>
          <span className={styles.dot}>·</span>
          <span className={styles.pending}>{items.filter(i => !i.watched).length} pending</span>
        </div>
      </div>

      <div className={styles.filters}>
        {['all', 'unwatched', 'watched'].map(f => (
          <button
            key={f}
            className={`${styles.filterBtn} ${filter === f ? styles.active : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className={styles.list}>
        {filtered.map((item, i) => (
          <WatchlistItem
            key={item.id}
            item={item}
            style={{ animationDelay: `${i * 0.05}s` }}
            onView={() => navigate(`/${item.media_type || 'movie'}/${item.id}`)}
            onToggle={() => dispatch(toggleWatched(item.id))}
            onRemove={() => dispatch(removeFromWatchlist(item.id))}
          />
        ))}
      </div>
    </div>
  )
}

function WatchlistItem({ item, style, onView, onToggle, onRemove }) {
  const title = item.title || item.name
  const year = (item.release_date || item.first_air_date)?.slice(0, 4)
  const poster = item.poster_path ? `${IMG_BASE}${item.poster_path}` : null

  return (
    <div className={`${styles.item} ${item.watched ? styles.watchedItem : ''} fade-up`} style={style}>
      <div className={styles.poster} onClick={onView}>
        {poster ? <img src={poster} alt={title} loading="lazy" /> : <span>🎬</span>}
      </div>
      <div className={styles.info} onClick={onView}>
        <h3 className={styles.itemTitle}>{title}</h3>
        <p className={styles.itemMeta}>{year} · ⭐ {item.vote_average?.toFixed(1)}</p>
        <p className={styles.itemOverview}>{item.overview?.slice(0, 120)}...</p>
      </div>
      <div className={styles.actions}>
        <button
          className={`${styles.watchedBtn} ${item.watched ? styles.isWatched : ''}`}
          onClick={onToggle}
          title={item.watched ? 'Mark as unwatched' : 'Mark as watched'}
        >
          {item.watched ? '✓ Watched' : '○ Unwatched'}
        </button>
        <button className={styles.removeBtn} onClick={onRemove} title="Remove">✕</button>
      </div>
    </div>
  )
}