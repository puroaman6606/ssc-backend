import QuizHistory from "../models/QuizHistory.js";

/**
 * @desc Get user achievements
 * @route GET /api/achievements
 * @access Private
 */
export const getAchievements = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch all quizzes attempted by the user
    const quizzes = await QuizHistory.find({ user: userId });

    if (!quizzes || quizzes.length === 0) {
      return res.json({
        success: true,
        achievements: [],
        message: "No achievements yet. Attempt some quizzes first!",
      });
    }

    // Calculate metrics
    const totalQuizzes = quizzes.length;
    const totalScore = quizzes.reduce((acc, q) => acc + q.score, 0);
    const totalPossible = quizzes.reduce((acc, q) => acc + q.total, 0);
    const avgScore = totalPossible > 0 ? (totalScore / totalPossible) * 100 : 0;

    // Build achievements array
    const achievementsArray = [];

    if (totalQuizzes >= 1) {
      achievementsArray.push({
        title: "🎯 First Attempt",
        description: "Completed your first quiz",
        unlocked: true,
      });
    }

    if (totalQuizzes >= 5) {
      achievementsArray.push({
        title: "🔥 Quiz Enthusiast",
        description: "Completed 5 quizzes",
        unlocked: totalQuizzes >= 5,
      });
    }

    if (avgScore >= 80) {
      achievementsArray.push({
        title: "🏆 High Scorer",
        description: `Average score of ${avgScore.toFixed(2)}%`,
        unlocked: avgScore >= 80,
      });
    }

    if (totalScore >= 100) {
      achievementsArray.push({
        title: "💎 Century Club",
        description: `Total score of ${totalScore}`,
        unlocked: totalScore >= 100,
      });
    }

    res.json({
      success: true,
      achievements: achievementsArray,
    });
  } catch (err) {
    console.error("Achievements error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
