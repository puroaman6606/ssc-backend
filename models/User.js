// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },

  // Reset password
  resetOtp: { type: String },
  resetOtpExpire: { type: Date },

  // User preferences / settings
  preferences: {
    notifications: { type: Boolean, default: true }, // enable/disable notifications
    theme: { type: String, enum: ["light", "dark"], default: "light" }, // UI theme
    fontSize: { type: String, enum: ["small", "medium", "large"], default: "medium" }, // text size
    isProfilePublic: { type: Boolean, default: true }, // privacy
  }
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model("User", userSchema);

