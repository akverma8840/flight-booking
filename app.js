require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const { supabase } = require("./models");    // Supabase Sequelize instance
const passport = require("./config/googleAuth");
const indexRoutes = require("./routes/index");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    message: "Too many requests, try again later."
  })
);

// ---------- Routes ----------
app.use("/api", indexRoutes);

app.get("/", (req, res) => {
  res.send("Flight Booking API (Supabase Connected)");
});


(async () => {
  try {
    await supabase.authenticate();
    console.log("Supabase database connected successfully");

    await supabase.sync({ alter: true });
    console.log(" All models synced with Supabase");

    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(` Server running on port ${port}`));
  } catch (err) {
    console.error("Failed to start server:", err.message);
  }
})();


app.use(errorHandler);

module.exports = app;
