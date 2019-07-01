const express = require("express");
const router = express.Router();

function checkSession(req, res, next) {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/auth/login");
  }
}

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/private", checkSession, (req, res, next) => {
  res.render("private");
});

module.exports = router;
