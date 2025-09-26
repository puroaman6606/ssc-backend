const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getNotifications,
  markAsRead,
} = require("../controllers/notificationController");

// @route GET /api/notifications
// @desc Get all notifications for the logged-in user
// @access Private
router.get("/", authMiddleware, getNotifications);

// @route PATCH /api/notifications/:id/read
// @desc Mark a notification as read
// @access Private
router.patch("/:id/read", authMiddleware, markAsRead);

module.exports = router;
