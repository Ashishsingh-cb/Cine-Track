import React, { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ErrorBoundary from './components/ErrorBoundary'

// Lazy loaded pages
const Home = lazy(() => import('./pages/Home'))
const Explore = lazy(() => import('./pages/Explore'))
const Watchlist = lazy(() => import('./pages/Watchlist'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Detail = lazy(() => import('./pages/Detail'))

function PageLoader() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '8px' }}>
        {[0, 1, 2].map(i => (
          <span key={i} style={{
            width: 12, height: 12, borderRadius: '50%',
            background: 'var(--accent)',
            display: 'inline-block',
            animation: 'bounce 0.6s infinite alternate',
            animationDelay: `${i * 0.15}s`
          }} />
        ))}
      </div>
      <style>{`@keyframes bounce { from{transform:translateY(0);opacity:0.4} to{transform:translateY(-10px);opacity:1} }`}</style>
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <Navbar />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/movie/:id" element={<Detail />} />
          <Route path="/tv/:id" element={<Detail />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  )
}