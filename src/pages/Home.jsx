import React, { useEffect, useState, useCallback } from 'react'
import { getTrending, getNowPlaying, getPopularTV, IMG_ORIGINAL, IMG_BASE } from '../utils/tmdb'
import MovieCard from '../components/MovieCard'
import { useNavigate } from 'react-router-dom'
import styles from './Home.module.css'

function HeroSkeleton() {
  return <div className={`${styles.hero} skeleton`} style={{ height: '500px' }} />
}

export default function Home() {
  const [trending, setTrending] = useState([])
  const [nowPlaying, setNowPlaying] = useState([])
  const [popularTV, setPopularTV] = useState([])
  const [hero, setHero] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchAll() {
      try {
        const [t, n, tv] = await Promise.all([
          getTrending(), getNowPlaying(), getPopularTV()
        ])
        setTrending(t.data.results)
        setNowPlaying(n.data.results)
        setPopularTV(tv.data.results)
        const heroItem = t.data.results.find(m => m.backdrop_path)
        setHero(heroItem)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  if (loading) return <HeroSkeleton />

  return (
    <div className={styles.page}>
      {hero && (
        <div
          className={styles.hero}
          style={{ backgroundImage: `url(${IMG_ORIGINAL}${hero.backdrop_path})` }}
        >
          <div className={styles.heroOverlay}>
            <div className={styles.heroContent}>
              <span className={styles.heroBadge}>🔥 Trending Now</span>
              <h1 className={styles.heroTitle}>{hero.title || hero.name}</h1>
              <p className={styles.heroDesc}>{hero.overview?.slice(0, 160)}...</p>
              <div className={styles.heroActions}>
                <button className={styles.heroBtn} onClick={() => navigate(`/movie/${hero.id}`)}>
                  View Details
                </button>
                <span className={styles.heroRating}>⭐ {hero.vote_average?.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={styles.sections}>
        <Section title="🎬 Trending This Week" items={trending.slice(0, 8)} />
        <Section title="🎥 Now Playing" items={nowPlaying.slice(0, 8)} />
        <Section title="📺 Popular TV Shows" items={popularTV.slice(0, 8)} />
      </div>
    </div>
  )
}

function Section({ title, items }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.grid}>
        {items.map((m, i) => (
          <MovieCard key={m.id} movie={m} style={{ animationDelay: `${i * 0.05}s` }} />
        ))}
      </div>
    </section>
  )
}