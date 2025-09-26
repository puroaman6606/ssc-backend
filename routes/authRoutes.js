// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { signup, login, getMe, updateUserProfile } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// Signup
router.post("/signup", signup);

// Login
router.post("/login", login);

// Get logged-in user info
router.get("/me", authMiddleware, getMe);

// Update profile
router.put("/update", authMiddleware, updateUserProfile);

module.exports = router;
