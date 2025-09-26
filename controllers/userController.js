// controllers/userController.js
import User from "../models/User.js";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";

// @desc Update user profile (name/email)
// @route PUT /api/user/update
// @access Private
export const updateUserProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name && !email) {
      return res.status(400).json({ error: "Please provide name or email" });
    }

    // Find user first
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update only provided fields
    if (name) user.name = name;
    if (email) user.email = email;

    await user.save(); // 🔑 ensures data is actually saved in DB

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

let otpStore = {}; // temporary in-memory store { email: otp }

// @desc Request OTP for password change
// @route POST /api/user/request-otp
// @access Public
export const requestPasswordOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = otp;

    // Send OTP via email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"SSC Quiz App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Change OTP",
      text: `Your OTP is ${otp}. It expires in 5 minutes.`,
    });

    // Expire OTP after 5 mins
    setTimeout(() => delete otpStore[email], 5 * 60 * 1000);

    res.json({ success: true, message: "OTP sent to email" });
  } catch (err) {
    console.error("OTP error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// @desc Confirm OTP and update password
// @route POST /api/user/change-password
// @access Public
export const changePassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    if (!otpStore[email] || otpStore[email] !== otp) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    // Clear OTP after success
    delete otpStore[email];

    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
