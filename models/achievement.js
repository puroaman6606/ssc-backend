// models/achievementModel.js

const mongoose = require("mongoose");

/**
 * Achievement Schema
 * Stores achievements unlocked by users.
 * Each achievement is linked to a specific user.
 */
const achievementSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    title: {
      type: String,
      required: [true, "Achievement must have a title"],
      trim: true,
      maxlength: [100, "Title can not exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Achievement must have a description"],
      trim: true,
      maxlength: [500, "Description can not exceed 500 characters"],
    },
    unlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt
  }
);

/**
 * Export the Achievement model
 */
module.exports = mongoose.model("Achievement", achievementSchema);
