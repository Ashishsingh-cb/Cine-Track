import axios from 'axios'

// TMDB free API - students must get their own key from https://www.themoviedb.org/settings/api
const API_KEY = '309889479200c83ac36a125877f8593b'
const BASE_URL = 'https://api.themoviedb.org/3'
export const IMG_BASE = 'https://image.tmdb.org/t/p/w500'
export const IMG_ORIGINAL = 'https://image.tmdb.org/t/p/original'

const tmdb = axios.create({ baseURL: BASE_URL, params: { api_key: API_KEY } })

export const getTrending = (page = 1) =>
  tmdb.get('/trending/movie/week', { params: { page } })

export const getTopRated = (page = 1) =>
  tmdb.get('/movie/top_rated', { params: { page } })

export const getNowPlaying = (page = 1) =>
  tmdb.get('/movie/now_playing', { params: { page } })

export const getPopularTV = (page = 1) =>
  tmdb.get('/tv/popular', { params: { page } })

export const searchMulti = (query, page = 1) =>
  tmdb.get('/search/multi', { params: { query, page } })

export const getMovieDetail = (id) =>
  tmdb.get(`/movie/${id}`, { params: { append_to_response: 'videos,credits' } })

export const getTVDetail = (id) =>
  tmdb.get(`/tv/${id}`, { params: { append_to_response: 'videos,credits' } })

export const getGenres = () =>
  tmdb.get('/genre/movie/list')

export const discoverMovies = (params) =>
  tmdb.get('/discover/movie', { params })