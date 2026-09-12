import express from 'express';
import { discoverMovies, getMovieCacheStats, getMovieGenres, getTrendingMovies, searchMovies } from '../controllers/movieController.js';

const router = express.Router();

router.get('/trending', getTrendingMovies);
router.get('/discover', discoverMovies);
router.get('/genres', getMovieGenres);
router.get('/search', searchMovies);
router.get('/cache/stats', getMovieCacheStats);

export default router;
