const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middlewares/authMiddleware');
const { searchVideos } = require('../controllers/pexelsController.js');

router.get('/search', protect, isAdmin, searchVideos);
//router.get('/video/:id', protect, isAdmin, getVideoDetails);

module.exports = router;