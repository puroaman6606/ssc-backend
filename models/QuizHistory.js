// models/QuizHistory.js
const mongoose = require("mongoose");

const questionRecordSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String }],
  correctIndex: { type: Number },
  userAnswerIndex: { type: Number },
  isCorrect: { type: Boolean, default: false },
  explanation: { type: String },
});

const quizHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  examType: { type: String, required: true },   // e.g., Prelims / Mains / M.Sc Chemistry
  subject: { type: String, required: true },
  topic: { type: String, required: true },
  questions: [questionRecordSchema],
  score: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("QuizHistory", quizHistorySchema);
