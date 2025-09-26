// server.js

const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
// const achievementRoutes = require("./routes/achievementRoutes.js");


// load env
// dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// connect to MongoDB
connectDB();

// middlewares
app.use(express.json());
app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});


// CORS - allow your frontend origin or all in dev
const clientUrl = process.env.CLIENT_URL || "*";
app.use(cors({
  origin: clientUrl,
  credentials: true,
}));

// routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/quiz", require("./routes/quizRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/achievements", require("./routes/achievementRoutes.js"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/settings", require("./routes/settingsRoutes"));



// basic health route
app.get("/", (req, res) => res.send({ ok: true, msg: "Quiz backend running" }));

// global error handler (simple)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
