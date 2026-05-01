import { configureStore } from '@reduxjs/toolkit'
import watchlistReducer from './WatchlistsSlice'
import themeReducer from './themeSlice'

export const store = configureStore({
  reducer: {
    watchlist: watchlistReducer,
    theme: themeReducer,
  },
})