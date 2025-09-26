const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Update password
exports.updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const { oldPassword, newPassword } = req.body;

    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: "Old password is incorrect" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    console.error("updatePassword error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Update preferences (notifications, theme, fontSize, privacy)
exports.updatePreferences = async (req, res) => {
  try {
    const updates = req.body; // { notifications, theme, fontSize, isProfilePublic }
    const user = await User.findByIdAndUpdate(
      req.userId,
      { preferences: updates },
      { new: true }
    ).select("-password");

    res.json({ success: true, message: "Preferences updated", user });
  } catch (err) {
    console.error("updatePreferences error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
// Get user preferences
exports.getPreferences = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("preferences");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    console.error("getPreferences error:", err);
    res.status(500).json({ error: "Server error" });
  }
};


// Delete account
exports.deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.userId);
    res.json({ success: true, message: "Account deleted successfully" });
  } catch (err) {
    console.error("deleteAccount error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
