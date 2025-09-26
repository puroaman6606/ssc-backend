const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { updatePassword, updatePreferences, deleteAccount } = require("../controllers/settingsController");
const { getPreferences } = require("../controllers/settingsController");
// Update password
router.put("/password", authMiddleware, updatePassword);

// Update preferences
router.put("/preferences", authMiddleware, updatePreferences);


// GET user preferences
router.get("/preferences", authMiddleware, getPreferences);


// Delete account
router.delete("/delete", authMiddleware, deleteAccount);

module.exports = router;
