const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getAchievements } = require("../controllers/achievementController");

// Get achievements (protected)
router.get("/", authMiddleware, getAchievements);

module.exports = router;
