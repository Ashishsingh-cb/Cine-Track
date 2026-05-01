import React, { useState, useEffect, useCallback, useRef } from 'react'
import { searchMulti, getTrending, getGenres, discoverMovies } from '../utils/tmdb'
import { useDebounce } from '../hooks/useDebounce'
import MovieCard from '../components/MovieCard'
import styles from './Explore.module.css'

export default function Explore() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [genres, setGenres] = useState([])
  const [selectedGenre, setSelectedGenre] = useState('')
  const [sortBy, setSortBy] = useState('popularity.desc')
  const [minRating, setMinRating] = useState('')
  const loaderRef = useRef(null)

  const debouncedQuery = useDebounce(query, 500)

  // Load genres once
  useEffect(() => {
    getGenres().then(r => setGenres(r.data.genres)).catch(console.error)
  }, [])

  // Fetch on search/filter change
  useEffect(() => {
    setPage(1)
    setResults([])
    fetchMovies(1, true)
  }, [debouncedQuery, selectedGenre, sortBy, minRating])

  const fetchMovies = useCallback(async (pageNum = 1, reset = false) => {
    setLoading(true)
    try {
      let res
      if (debouncedQuery.trim()) {
        res = await searchMulti(debouncedQuery, pageNum)
      } else {
        const params = { page: pageNum, sort_by: sortBy }
        if (selectedGenre) params.with_genres = selectedGenre
        if (minRating) params['vote_average.gte'] = minRating
        res = await discoverMovies(params)
      }
      const data = res.data.results.filter(m => m.poster_path)
      setResults(prev => reset ? data : [...prev, ...data])
      setTotalPages(res.data.total_pages)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [debouncedQuery, selectedGenre, sortBy, minRating])

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !loading && page < totalPages) {
        const next = page + 1
        setPage(next)
        fetchMovies(next)
      }
    }, { threshold: 0.5 })
    if (loaderRef.current) observer.observe(loaderRef.current)
    return () => observer.disconnect()
  }, [loading, page, totalPages, fetchMovies])

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Explore</h1>

      <div className={styles.filters}>
        <input
          className={styles.searchInput}
          placeholder="🔍  Search movies, TV shows..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <select value={selectedGenre} onChange={e => setSelectedGenre(e.target.value)} className={styles.select}>
          <option value="">All Genres</option>
          {genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className={styles.select}>
          <option value="popularity.desc">Most Popular</option>
          <option value="vote_average.desc">Highest Rated</option>
          <option value="release_date.desc">Newest First</option>
          <option value="revenue.desc">Top Revenue</option>
        </select>
        <select value={minRating} onChange={e => setMinRating(e.target.value)} className={styles.select}>
          <option value="">Any Rating</option>
          <option value="9">9+ ⭐</option>
          <option value="8">8+ ⭐</option>
          <option value="7">7+ ⭐</option>
          <option value="6">6+ ⭐</option>
        </select>
      </div>

      {results.length === 0 && !loading && (
        <div className={styles.empty}>No results found. Try a different search!</div>
      )}

      <div className={styles.grid}>
        {results.map((m, i) => (
          <MovieCard key={`${m.id}-${i}`} movie={m} style={{ animationDelay: `${(i % 20) * 0.04}s` }} />
        ))}
      </div>

      <div ref={loaderRef} className={styles.loader}>
        {loading && (
          <div className={styles.spinner}>
            {[...Array(3)].map((_, i) => <span key={i} style={{ animationDelay: `${i * 0.15}s` }} />)}
          </div>
        )}
      </div>
    </div>
  )
}