const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.render("index");
});

router.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/login");
  }
});
router.get("/private", (req, res, next) => {
  res.render("private");
});
router.get("/main", (req, res, next) => {
  res.render("main");
});

module.exports = router;
