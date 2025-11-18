const router = require("express").Router();

router.use("/auth", require("./authRoutes"));
router.use("/flights", require("./flightRoutes"));
router.use("/bookings", require("./bookingRoutes"));
router.use("/users", require("./userRoutes"));
router.use("/google", require("./googleAuthRoutes"));

module.exports = router;
