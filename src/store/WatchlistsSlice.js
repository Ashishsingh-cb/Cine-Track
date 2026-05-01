import { createSlice } from '@reduxjs/toolkit'

const saved = JSON.parse(localStorage.getItem('cinetrack_watchlist') || '[]')

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState: { items: saved },
  reducers: {
    addToWatchlist(state, action) {
      const exists = state.items.find(i => i.id === action.payload.id)
      if (!exists) {
        state.items.push({ ...action.payload, watched: false, addedAt: Date.now() })
        localStorage.setItem('cinetrack_watchlist', JSON.stringify(state.items))
      }
    },
    removeFromWatchlist(state, action) {
      state.items = state.items.filter(i => i.id !== action.payload)
      localStorage.setItem('cinetrack_watchlist', JSON.stringify(state.items))
    },
    toggleWatched(state, action) {
      const item = state.items.find(i => i.id === action.payload)
      if (item) item.watched = !item.watched
      localStorage.setItem('cinetrack_watchlist', JSON.stringify(state.items))
    },
  },
})

export const { addToWatchlist, removeFromWatchlist, toggleWatched } = watchlistSlice.actions
export default watchlistSlice.reducer