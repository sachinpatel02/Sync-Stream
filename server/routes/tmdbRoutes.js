const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middlewares/authMiddleware');
const { searchMovies, getMovieDetails, getMovieTrailer } = require('../controllers/tmdbController.js');

router.get('/search', protect, isAdmin, searchMovies);
router.get('/movie/:id', protect, isAdmin, getMovieDetails);
router.get('/trailer/:id', protect, isAdmin, getMovieTrailer);

module.exports = router;