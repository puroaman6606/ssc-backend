// routes/quizRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { saveQuiz, getHistory } = require("../controllers/quizController");

// save quiz result (protected)
router.post("/save", authMiddleware, saveQuiz);

// get user's quiz history (protected)
router.get("/history", authMiddleware, getHistory);

module.exports = router;
