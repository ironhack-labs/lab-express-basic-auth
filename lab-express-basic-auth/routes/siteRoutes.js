const express = require('express');
const router = express.Router();



router.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/signin");
  }
});

router.get("/private", (req, res, next) => {
  res.render("private");
});

router.get("/main", (req, res, next) => {
  res.render("main");
});

module.exports = router;