const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: String,
        videoUrl: { type: String, required: true },
        thumbnail: {type: String},
        tags: [String],
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    },
    {
        timestamps: true
    }
);

const Video = new mongoose.model('Video', videoSchema);
module.exports = Video;