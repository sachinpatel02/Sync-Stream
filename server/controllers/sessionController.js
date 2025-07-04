const { response } = require('express');
const Session = require('../models/Session');
const Video = require('../models/Video');
const { sendSuccess, sendError } = require('../utils/sendResponse');

const generateRandomCode = () => {
    //creating a random string of 36 characters and getting 6 chars (substing) from it and converting to upper case
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

//session creation logic
const createSession = async (req, res) => {
    try {
        const { videoId, startTime } = req.body;

        if (!videoId) {
            return sendError(res, 400, 'Video ID is required');
        }
        const video = await Video.findById(videoId);
        if (!video) {
            return sendError(res, 404, 'Selected Video not found');
        }

        //generationg roomCode. until we get a unique roomcode
        let roomCode = generateRandomCode();
        let duplicate = await Session.findOne({ roomCode });
        while (duplicate) {
            roomCode = generateRandomCode();
            duplicate = await Session.findOne({ roomCode });
        }

        //creating session
        const session = new Session({
            video: videoId,
            host: req.user._id,
            participants: [req.user._id],
            roomCode,
            startTime,
            status: startTime ? 'upcoming' : 'live',
        });

        const savedSession = await session.save();
        return sendSuccess(res, 201, 'Session created successfully', savedSession.toObject());

    } catch (error) {
        console.log(error);
        return sendError(res, 500, 'Failed to create session');
    }
}

//get session by id
const getSessionById = async (req, res) => {
    try {
        const { id } = req.params;
        const session = await Session.findById(id).populate('host', 'name email').populate('participants', 'name email').populate('video', 'title thumbnail videoUrl description').lean();
        if (!session) {
            return sendError(res, 404, 'Session not found');
        }
        return sendSuccess(res, 200, 'Session fetched successfully', session);
    } catch (error) {
        console.log(error);
        return sendError(res, 500, 'Failed to get session');
    }
}

//get all session [live, upcoming, past]
const getMySessions = async (req, res) => {
    try {
        const userId = req.user._id;

        //find all the sessions where user was a host or a participant
        const sessions = await Session.find({ $or: [{ host: userId }, { participants: userId }] }).populate('video', 'title thumbnail').populate('host', 'name').lean();

        //group sessions 
        const upcoming = [];
        const live = [];
        const ended = [];

        for (let session of sessions) {
            if (session.status === 'upcoming') upcoming.push(session);
            else if (session.status === 'live') live.push(session);
            else if (session.status === 'ended') ended.push(session);
        }
        return sendSuccess(res, 200, 'Your sessions fetched successfully', {
            upcoming,
            live,
            past: ended
        });
    } catch (error) {
        console.log(error);
        return sendError(res, 500, 'Failed to get sessions');
    }
}

//join the session
const joinSession = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const session = await Session.findById(id);

        if (!session) {
            return sendError(res, 404, 'Session not found');
        }

        //check if already joined
        const isAlreadyJoined = session.participants.includes(userId.toString());
        if (!isAlreadyJoined) {
            session.participants.push(userId);
        }

        //marking upcoming to live
        if (session.status === 'upcoming') {
            session.status = 'live';
        }
        await session.save();

        return sendSuccess(res, 200, 'Joined session successfully');

    } catch (error) {
        console.error(err);
        return sendError(res, 500, 'Failed to join session');
    }
}

//leave session
const leaveSession = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id.toString();

        const session = await Session.findById(id);
        if (!session) {
            return sendError(res, 404, 'Session not found');
        }

        //Host cannot leave the session (they can end the session)
        if (session.host.toString() === userId) {
            return sendError(res, 403, 'Host cannot leave their own session');
        }

        //remove user - participant -- filter function will save all the other participants except who leaves the seasson
        session.participants = session.participants.filter(
            (participantId) => participantId.toString() !== userId
        );
        await session.save();

        return sendSuccess(res, 200, 'Left session successfully');
    } catch (error) {
        console.error(err);
        return sendError(res, 500, 'Failed to leave session');
    }
}

//end session
const endSession = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id.toString();

        const session = await Session.findById(id);

        if (!session) {
            return sendError(res, 404, 'Session not found');
        }

        // Only host can end the session
        if (session.host.toString() !== userId) {
            return sendError(res, 403, 'Only the host can end the session');
        }

        session.status = 'ended';
        session.isPlaying = false;
        session.endTime = new Date();

        await session.save();

        return sendSuccess(res, 200, 'Session ended successfully');

    } catch (error) {
        console.error(err);
        return sendError(res, 500, 'Failed to end session');
    }
}

//join session by roomId
const joinSessionByCode = async (req, res) => {
    try {
        const { roomCode } = req.params;
        if (!roomCode) {
            return sendError(res, 400, 'Room Code is required');
        }
        const session = await Session.findOne({ roomCode }).populate('video host participants', '-password');
        if (!session) {
            return sendError(res, 404, 'Session not found');
        }
        if (!session.participants.includes(req.user._id)) {
            session.participants.push(req.user._id);
            await session.save();
        }

        return sendSuccess(res, 200, 'Session joined successfully', session);

    } catch (error) {
        console.error(err);
        return sendError(res, 500, 'Failed to join session by room code');
    }
}
module.exports = { createSession, getSessionById, getMySessions, joinSession, leaveSession, endSession, joinSessionByCode };