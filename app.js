require("dotenv").config();

console.log("🔍 Starting Flight Booking Backend Initialization...");

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

// Debug: Check if Supaba
console.log(" Loading database models...");
const { supabase } = require("./models");

// Debug: Check if Google OAuth config loads
console.log(" Loading Google OAuth config...");
const passport = require("./config/googleAuth");

// Debug: Check routes 
console.log(" Loading route index...");
const indexRoutes = require("./routes/index");

console.log(" Loading errorHandler...");
const errorHandler = require("./middleware/errorHandler");

// Debug: Check validator imports (
console.log(" Loading validators...");
require("./validators/auth");

console.log(" Loading services...");
require("./services/auth.service");
require("./services/otp.service");
require("./services/email.service");
require("./services/token.service");

console.log(" Loading controllers...");
require("./controllers/authController");

const app = express();


// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Rate Limiter
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300,
    message: "Too many requests, try again later.",
  })
);


// Routes

app.use("/api", indexRoutes);

app.get("/", (req, res) => {
  res.send("Flight Booking API (Supabase Connected)");
});


(async () => {
  try {
    console.log("Authenticating Supabase connection...");
    await supabase.authenticate();
    console.log("Supabase database connected successfully");

    console.log(" Syncing Sequelize models...");
    await supabase.sync({ alter: true });
    console.log(" All models synced with Supabase");

    const port = process.env.PORT || 5000;

    app.listen(port, () => {
      console.log(` Server running on http://localhost:${port}`);
      console.log(" All modules loaded successfully. System is ready.");
    });
  } catch (err) {
    console.error(" Failed to start server:", err.message);
  }
})();

// ----
app.use(errorHandler);

module.exports = app;
