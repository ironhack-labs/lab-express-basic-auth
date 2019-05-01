const express = require("express");
const router = express.Router();
const signupRoute = require("./auth/signup");
const loginRoute = require("./auth/login");
const logoutRoute = require("./auth/logout");

router.get("/", (req, res, next) => {
  let currentUser = req.session.currentUser;
  res.render("index", { currentUser });
});

router.use("/", signupRoute);
router.use("/", loginRoute);
router.use("/", logoutRoute);

router.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/login");
  }
});

router.get("/secret", (req, res, next) => {
  res.json({ status: "secret" });
});

module.exports = router;
