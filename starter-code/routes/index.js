const express = require("express");
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  if (req.session.currentUser) {
    res.redirect("/private");
  } else {
    res.render("index");
  }
});

router.get("/main", (req, res, next) => {
  if (req.session.currentUser) {
    res.redirect("/private");
  } else {
    res.render("/main");
  }
});

router.get("/private", (req, res, next) => {
  if (req.session.currentUser) {
    res.render("private", { userinfos: req.session.currentUser });
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
