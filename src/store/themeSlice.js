import { createSlice } from '@reduxjs/toolkit'

const themeSlice = createSlice({
  name: 'theme',
  initialState: { dark: true },
  reducers: {
    toggleTheme(state) {
      state.dark = !state.dark
      document.documentElement.setAttribute('data-theme', state.dark ? 'dark' : 'light')
    },
  },
})

export const { toggleTheme } = themeSlice.actions
export default themeSlice.reducer