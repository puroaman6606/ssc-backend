import QuizHistory from "../models/QuizHistory.js";
import Notification from "../models/notification.js";
import Achievement from "../models/achievement.js"; // optional if you track achievements separately

/**
 * Save a quiz and trigger notifications
 */
export const saveQuiz = async (req, res) => {
  try {
    const userId = req.userId;
    const { examType, subject, topic, questions, score, total } = req.body;

    if (!examType || !subject || !topic || !Array.isArray(questions)) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Save quiz
    const quiz = await QuizHistory.create({
      user: userId,
      examType,
      subject,
      topic,
      questions,
      score: score || 0,
      total: total || questions.length,
    });

    // 🔔 Quiz completion notification
    await Notification.create({
      user: userId,
      type: "quiz",
      message: `You completed the quiz: ${subject} - ${topic} ✅`,
    });

    // 🔔 Check for new achievements after this quiz
    const quizzes = await QuizHistory.find({ user: userId });
    const totalQuizzes = quizzes.length;
    const totalScore = quizzes.reduce((acc, q) => acc + q.score, 0);
    const totalPossible = quizzes.reduce((acc, q) => acc + q.total, 0);
    const avgScore = totalPossible > 0 ? (totalScore / totalPossible) * 100 : 0;

    // Define achievement rules
    const achievementRules = [
      {
        title: "🎯 First Attempt",
        description: "Completed your first quiz",
        condition: totalQuizzes >= 1,
      },
      {
        title: "🔥 Quiz Enthusiast",
        description: "Completed 5 quizzes",
        condition: totalQuizzes >= 5,
      },
      {
        title: "🏆 High Scorer",
        description: `Average score of ${avgScore.toFixed(2)}%`,
        condition: avgScore >= 80,
      },
      {
        title: "💎 Century Club",
        description: `Total score of ${totalScore}`,
        condition: totalScore >= 100,
      },
    ];

    // Send notifications for newly unlocked achievements
    for (let ach of achievementRules) {
      // Check if user already has this notification
      const alreadyNotified = await Notification.findOne({
        user: userId,
        type: "achievement",
        message: { $regex: ach.title },
      });

      if (ach.condition && !alreadyNotified) {
        await Notification.create({
          user: userId,
          type: "achievement",
          message: `${ach.title} unlocked! 🏆 ${ach.description}`,
        });
      }
    }

    res.status(201).json({ success: true, quiz });
  } catch (err) {
    console.error("saveQuiz error:", err);
    res.status(500).json({ error: "Server error saving quiz" });
  }
};

/**
 * Get quiz history
 */
export const getHistory = async (req, res) => {
  try {
    const userId = req.userId;
    const history = await QuizHistory.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({ success: true, history });
  } catch (err) {
    console.error("getHistory error:", err);
    res.status(500).json({ error: "Server error fetching history" });
  }
};
