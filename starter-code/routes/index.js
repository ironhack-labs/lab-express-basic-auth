const express = require("express");
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index", { user: req.session.user });
});

router.get("/main", (req, res, next) => {
  res.render("main", { user: req.session.user });
});

router.get("/private", (req, res, next) => {
  if (!req.session.user) {
    res.redirect("/");
    return;
  }
  res.render("private", { user: req.session.user });
});

module.exports = router;
