const express = require("express");
const router = express.Router();
const { protect, isAdmin } = require("../middlewares/authMiddleware");
const { createSession, getSessionById, getMySessions, joinSession, leaveSession, endSession, joinSessionByCode } = require("../controllers/sessionController.js")

router.post("/", protect, createSession);
router.get("/:id", protect, getSessionById);
router.get("/", protect, getMySessions);
router.post("/:id/join", protect, joinSession);
router.post("/:id/leave", protect, leaveSession);
router.post("/:id/end", protect, endSession);

router.post("/join/:roomCode", protect, joinSessionByCode);

module.exports = router;