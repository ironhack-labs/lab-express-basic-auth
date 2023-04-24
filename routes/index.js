const express = require("express");
const router = express.Router();
const { isLoggedIn, isLoggedOut } = require("../middlewares/route-guard");
const authRoutes = require("./auth.routes");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.use("/auth", authRoutes);

router.get("/profile", isLoggedIn, (req, res) => {
  console.log("test max");
  console.log("test to see session for profile", req.session.user.username);
  res.render("profile", { username: req.session.user.username });
});

module.exports = router;
