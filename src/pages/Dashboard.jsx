import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts'
import { useNavigate } from 'react-router-dom'
import styles from './Dashboard.module.css'

const COLORS = ['#e5383b', '#f4a261', '#4a90d9', '#4caf7d', '#9b59b6', '#f39c12', '#1abc9c']

export default function Dashboard() {
  const items = useSelector(s => s.watchlist.items)
  const navigate = useNavigate()

  const stats = useMemo(() => {
    const total = items.length
    const watched = items.filter(i => i.watched).length
    const unwatched = total - watched
    const avgRating = total > 0
      ? (items.reduce((sum, i) => sum + (i.vote_average || 0), 0) / total).toFixed(1)
      : 0

    // Genre counts (approximate from genre_ids)
    const genreMap = {
      28: 'Action', 35: 'Comedy', 18: 'Drama', 27: 'Horror',
      10749: 'Romance', 878: 'Sci-Fi', 53: 'Thriller', 16: 'Animation',
      12: 'Adventure', 80: 'Crime'
    }
    const genreCounts = {}
    items.forEach(item => {
      (item.genre_ids || []).forEach(id => {
        const name = genreMap[id] || 'Other'
        genreCounts[name] = (genreCounts[name] || 0) + 1
      })
    })
    const genreData = Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, value]) => ({ name, value }))

    // Rating distribution
    const ratingBuckets = { '9-10': 0, '7-8': 0, '5-6': 0, '<5': 0 }
    items.forEach(i => {
      const r = i.vote_average || 0
      if (r >= 9) ratingBuckets['9-10']++
      else if (r >= 7) ratingBuckets['7-8']++
      else if (r >= 5) ratingBuckets['5-6']++
      else ratingBuckets['<5']++
    })
    const ratingData = Object.entries(ratingBuckets).map(([name, count]) => ({ name, count }))

    // Media type split
    const movies = items.filter(i => (i.media_type || 'movie') === 'movie').length
    const tvShows = items.filter(i => i.media_type === 'tv').length
    const typeData = [
      { name: 'Movies', value: movies },
      { name: 'TV Shows', value: tvShows },
    ].filter(d => d.value > 0)

    return { total, watched, unwatched, avgRating, genreData, ratingData, typeData }
  }, [items])

  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <div>📊</div>
        <h2>No data yet</h2>
        <p>Add movies and shows to your watchlist to see stats here.</p>
        <button onClick={() => navigate('/explore')} className={styles.btn}>Start Exploring</button>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Dashboard</h1>

      {/* Stat Cards */}
      <div className={styles.cards}>
        <StatCard label="Total Saved" value={stats.total} icon="🎬" color="var(--accent)" />
        <StatCard label="Watched" value={stats.watched} icon="✅" color="var(--green)" />
        <StatCard label="Pending" value={stats.unwatched} icon="⏳" color="var(--accent2)" />
        <StatCard label="Avg Rating" value={`⭐ ${stats.avgRating}`} icon="🏆" color="#4a90d9" />
      </div>

      <div className={styles.charts}>
        {/* Genre Breakdown */}
        {stats.genreData.length > 0 && (
          <div className={styles.chartBox}>
            <h3 className={styles.chartTitle}>Genre Breakdown</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={stats.genreData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {stats.genreData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Rating Distribution */}
        <div className={styles.chartBox}>
          <h3 className={styles.chartTitle}>Rating Distribution</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={stats.ratingData} margin={{ top: 10, right: 20, bottom: 0, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fill: 'var(--muted)', fontSize: 12 }} />
              <YAxis tick={{ fill: 'var(--muted)', fontSize: 12 }} allowDecimals={false} />
              <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px' }} />
              <Bar dataKey="count" fill="var(--accent)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Movie vs TV */}
        {stats.typeData.length > 0 && (
          <div className={styles.chartBox}>
            <h3 className={styles.chartTitle}>Movies vs TV Shows</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={stats.typeData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {stats.typeData.map((_, i) => <Cell key={i} fill={['var(--accent)', '#4a90d9'][i]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statIcon} style={{ color }}>{icon}</div>
      <div>
        <div className={styles.statValue}>{value}</div>
        <div className={styles.statLabel}>{label}</div>
      </div>
    </div>
  )
}