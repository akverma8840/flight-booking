const express = require("express");
const passport = require("../config/googleAuth");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.get("/google",
    (req,res,next)=>{
        console.log("google hit");
        next();
    }


)

// Step 1 — redirect to Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
  
);


// Step 2 — Google redirects back to us
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    
    const token = jwt.sign(
      { id: req.user.id, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Google login successful",
      token,
      user: req.user,
    });
  }
);

module.exports = router;
