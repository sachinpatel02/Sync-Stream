const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
    {
        //refer to the video from Video model
        video: { type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true, },

        //refer to the user who created session
        host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, },

        //refer to the list of users in session
        participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', }],

        //room code - unique
        roomCode: { type: String, unique: true, required: true, },

        roomName: String, 
        //status tracks live or past sessions
        status: { type: String, enum: ['upcoming', 'live', 'ended'], },

        //below will help in syncing
        isPlaying: { type: Boolean, default: false },


        currentTime: { type: Number, default: 0 },
        startTime: Date,
        endTime: Date,
    },
    {
        timestamps: true,
    }
);

const Session = mongoose.model('Session', sessionSchema);
module.exports = Session;