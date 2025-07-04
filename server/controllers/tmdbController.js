const axios = require('axios');
const { sendSuccess, sendError } = require("../utils/sendResponse.js");
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const searchMovies = async (req, res) => {
    try {
        const query = req.query.query;
        if (!query) {
            return sendError(res, 400, 'Search query is required');
        }

        //calling TMDB api with search query and saving it in response object
        const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
            params: { api_key: TMDB_API_KEY, query }
        });
        return sendSuccess(res, 200, 'Movie Fetched Successfully', response.data);
    } catch (err) {
        console.log("error at search movie tmdb api", err);
        return sendError(res, 500, "Failed to search movie at tmdb");
    }
};

const getMovieDetails = async (req, res) => {
    try {
        const movieId = req.params.id;

        if (!movieId) {
            return sendError(res, 400, 'Movie ID is require');
        }

        //getting movie details using movie id
        const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
            params: { api_key: TMDB_API_KEY}
        });
        return sendSuccess(res, 200, 'Movie details fetched successfully', response.data);
    } catch (error) {
        console.log("error at get movie tmdb api", error);
        return sendError(res, 500, "Failed to get movie at tmdb");
    }
};
const getMovieTrailer = async (req, res) => {
    try {
        const movieId = req.params.id;

        if (!movieId) {
            return sendError(res, 400, 'Movie ID is require');
        }
        const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}/videos`, {
            params: { api_key: TMDB_API_KEY}
        });

        const trailers = response.data.results.filter(
            (v) => v.type === 'Trailer' && v.site === 'YouTube'
        );

        if (!trailers.length) {
            return sendError(res, 404, 'No YouTube trailer found for this movie');
        }

        return sendSuccess(res, 200, 'Trailer fetched successfully', {
            trailerUrl: `https://www.youtube.com/watch?v=${trailers[0].key}`,
            name: trailers[0].name
        });

    } catch (error) {
        console.log("error at get movie trailer tmdb api", error);
        return sendError(res, 500, "Failed to get movie trailer at tmdb");
    }
};

module.exports = { searchMovies, getMovieDetails, getMovieTrailer };