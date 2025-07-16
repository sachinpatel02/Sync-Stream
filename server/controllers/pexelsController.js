const axios = require('axios');
const { sendSuccess, sendError } = require("../utils/sendResponse.js");

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const PEXELS_BASE_URL = 'https://api.pexels.com';

const searchVideos = async (req, res) => {
    try {
        const { query, per_page = 10, page = 1 } = req.query;

        if (!query) {
            return sendError(res, 400, 'Search query is required');
        }

        const response = await axios.get(`${PEXELS_BASE_URL}/videos/search`, {
            headers: {
                Authorization: PEXELS_API_KEY,
            },
            params: { query, per_page, page },
        });

        const videos = response.data;
        return sendSuccess(res, 200, 'Videos fetched successfully', videos);

    } catch (err) {
        console.log("Error at search video Pexels API:", err?.response?.data || err.message);
        return sendError(res, 500, "Failed to search video at Pexels");
    }
};

module.exports = { searchVideos };
