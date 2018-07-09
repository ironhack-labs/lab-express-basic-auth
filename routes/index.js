const express = require("express");
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/main", (req, res, next) => {
  if (req.session.currentUser) {
    res.render("main");
  } else {
    res.redirect("/");
  }
});

router.get("/private", (req, res, next) => {
  if (req.session.currentUser) {
    res.render("private");
  } else {
    res.redirect("/");
  }
});

module.exports = router;
