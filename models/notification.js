const mongoose = require("mongoose");

/**
 * Notification Schema
 * Stores notifications for users.
 */
const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User
      required: true,
    },
    type: {
      type: String,
      enum: ["quiz", "achievement", "system"],
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    read: {
      type: Boolean,
      default: false, // Unread by default
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

module.exports = mongoose.model("Notification", notificationSchema);
