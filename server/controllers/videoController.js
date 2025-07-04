const Video = require("../models/Video");
const { sendSuccess, sendError } = require("../utils/sendResponse.js");

//adding new videos to the database
const addVideo = async (req, res) => {
    try {
        const { title, description, videoUrl, thumbnail, tags } = req.body;

        if (!title || !videoUrl) {
            return sendError(res, 400, 'Title and video url are required');
        }
        //creating new video object -- we can use Vidoe.create() as well. 
        const video = new Video({ title, description, videoUrl, thumbnail, tags, createdBy: req.user._id });
        const saveVideo = await video.save();
        return sendSuccess(res, 200, 'Video added successfully', saveVideo);
    } catch (err) {
        console.log(err);
        return sendError(res, 500, 'Failed to add video');
    }
};

//updating video with new details
const updateVideo = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, videoUrl, thumbnail, tags } = req.body;

        //finding video
        const video = await Video.findById(id);
        if (!video) {
            return sendError(res, 404, 'Video not found');
        }
        video.title = title || video.title;
        video.description = description || video.description;
        video.videoUrl = videoUrl || video.videoUrl;
        video.thumbnail = thumbnail || video.thumbnail;
        video.tags = tags || video.tags;

        const updatedVideo = await video.save();
        return sendSuccess(res, 200, 'Video updated successfully', updatedVideo);
    } catch (err) {
        console.log(err);
        return sendError(res, 500, 'Failed to update video');
    }
};

const deleteVideo = async (req, res) => {
    try {
        const { id } = req.params;
        //finding video
        const video = await Video.findByIdAndDelete(id);
        if (!video) {
            return sendError(res, 404, 'Video not found');
        }

        //await video.remove();
        return sendSuccess(res, 200, 'Video deleted successfully');

    } catch (err) {
        console.log(err);
        return sendError(res, 500, 'Failed to delete video');
    }
};

const getAllVideos = async (req, res) => {
    try {
        const videos = await Video.find();
        return sendSuccess(res, 200, 'Videos fetched successfully', videos);
    } catch (err) {
        console.log(err);
        return sendError(res, 500, 'Failed to get all videos');
    }
};

const getVideoById = async (req, res) => {
    try {
        const { id } = req.params;
        const video = await Video.findById(id);
        if (!video) {
            return sendError(res, 404, 'Video not found');
        }
        return sendSuccess(res, 200, 'Video fetched successfully', video);
    } catch (err) {
        console.log(err);
        return sendError(res, 500, 'Failed to get video');
    }
};

module.exports = { addVideo, updateVideo, deleteVideo, getAllVideos, getVideoById };