// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // need this if you want full user object
// const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET not defined");

module.exports = async (req, res, next) => {
  let token;

  try {
    const header = req.headers.authorization || req.headers.Authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token, authorization denied" });
    }

    token = header.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach full user object to req.user
    req.user = await User.findById(decoded.id).select("-password");
     req.userId = decoded.id; // <-- add this line

// console.log("Decoded token:", decoded);

    if (!req.user) {
      return res.status(401).json({ error: "User not found, authorization denied" });
    }

    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(401).json({ error: "Token invalid or expired" });
    // console.log("Authorization header:", req.headers.authorization);
    // console.log("JWT_SECRET:", process.env.JWT_SECRET);


  }
};
