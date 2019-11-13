const express = require("express");
const router = express.Router();
const loginCheck = require("../utils").loginCheck();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index.hbs", { loggedIn: req.session.user });
});

router.get("/profile", loginCheck, (req, res) => {
  res.render("profile.hbs");
});

module.exports = router;
