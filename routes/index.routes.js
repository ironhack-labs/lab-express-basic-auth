const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn");
const authRoutes = require("./auth.routes");
const protectedRoutes = require("./protected.routes");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.use("/auth", authRoutes);
router.use("/protected", isLoggedIn, protectedRoutes);

router.get("/messages", isLoggedIn, (req, res) => {
  res.send("Messages" + req.session.user.email);
});

router.get("/profile", isLoggedIn, (req, res) => {
  console.log(req.session);
  console.log(req.session.user);

  res.render("profile", { userEmail: req.session.user.email });
});
 
module.exports = router;
