const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  updateUserProfile,
  requestPasswordOtp,
  changePassword,
} = require("../controllers/userController");

const router = express.Router();

router.put("/update", protect, updateUserProfile);
router.post("/request-otp", requestPasswordOtp);
router.post("/change-password", changePassword);

module.exports = router;

