const express = require("express");
const router = express.Router();

const { protect, isAdmin } = require("../middlewares/authMiddleware");
const { addVideo, updateVideo, deleteVideo, getAllVideos, getVideoById } = require("../controllers/videoController");

//admin routes
router.post("/", protect, isAdmin, addVideo);
router.put("/:id", protect, isAdmin, updateVideo);
router.delete("/:id", protect, isAdmin, deleteVideo);

//user routes
router.get("/", protect, getAllVideos);
router.get("/:id", protect, getVideoById);

module.exports = router;