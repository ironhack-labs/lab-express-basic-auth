const express = require("express");
const router = express.Router();

function auth(req, res, next) {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/login");
  }
}

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/private",auth, (req, res) => {
  res.render("private");
});


module.exports = router;
