import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getMovieDetail, getTVDetail, IMG_ORIGINAL, IMG_BASE } from '../utils/tmdb'
import { addToWatchlist, removeFromWatchlist } from '../store/WatchlistsSlice'
import styles from './Detail.module.css'

export default function Detail() {
  const { type, id } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const inWatchlist = useSelector(s => s.watchlist.items.some(i => i.id === Number(id)))

  useEffect(() => {
    setLoading(true)
    const fn = type === 'tv' ? getTVDetail : getMovieDetail
    fn(id)
      .then(r => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [type, id])

  if (loading) return (
    <div className={styles.loading}>
      <div className={`skeleton ${styles.skeletonHero}`} />
    </div>
  )

  if (!data) return <div className={styles.error}>Content not found.</div>

  const title = data.title || data.name
  const year = (data.release_date || data.first_air_date)?.slice(0, 4)
  const trailer = data.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube')
  const cast = data.credits?.cast?.slice(0, 8) || []
  const genres = data.genres || []

  const handleWatchlist = () => {
    if (inWatchlist) {
      dispatch(removeFromWatchlist(data.id))
    } else {
      dispatch(addToWatchlist({ ...data, media_type: type }))
    }
  }

  return (
    <div className={styles.page}>
      {/* Backdrop */}
      {data.backdrop_path && (
        <div
          className={styles.backdrop}
          style={{ backgroundImage: `url(${IMG_ORIGINAL}${data.backdrop_path})` }}
        >
          <div className={styles.backdropOverlay} />
        </div>
      )}

      <div className={styles.content}>
        <button className={styles.back} onClick={() => navigate(-1)}>← Back</button>

        <div className={styles.main}>
          <div className={styles.poster}>
            {data.poster_path
              ? <img src={`${IMG_BASE}${data.poster_path}`} alt={title} />
              : <div className={styles.noPoster}>🎬</div>
            }
          </div>

          <div className={styles.info}>
            <div className={styles.genres}>
              {genres.map(g => <span key={g.id} className={styles.genre}>{g.name}</span>)}
            </div>
            <h1 className={styles.title}>{title}</h1>
            <div className={styles.meta}>
              <span>📅 {year}</span>
              <span>⭐ {data.vote_average?.toFixed(1)}</span>
              {data.runtime && <span>⏱ {data.runtime} min</span>}
              {data.number_of_seasons && <span>📺 {data.number_of_seasons} Seasons</span>}
            </div>
            <p className={styles.overview}>{data.overview}</p>

            <div className={styles.actions}>
              <button
                className={`${styles.wlBtn} ${inWatchlist ? styles.inList : ''}`}
                onClick={handleWatchlist}
              >
                {inWatchlist ? '✓ In Watchlist' : '+ Add to Watchlist'}
              </button>
              {trailer && (
                <a
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.trailerBtn}
                >
                  ▶ Watch Trailer
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Cast */}
        {cast.length > 0 && (
          <section className={styles.cast}>
            <h2 className={styles.castTitle}>Top Cast</h2>
            <div className={styles.castGrid}>
              {cast.map(person => (
                <div key={person.id} className={styles.castCard}>
                  {person.profile_path
                    ? <img src={`${IMG_BASE}${person.profile_path}`} alt={person.name} loading="lazy" />
                    : <div className={styles.noPhoto}>👤</div>
                  }
                  <p className={styles.castName}>{person.name}</p>
                  <p className={styles.castRole}>{person.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}