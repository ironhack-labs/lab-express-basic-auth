var express = require("express");
var router = express.Router();

// GET Index page
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

router.get("/private", (req, res) => {
  res.render("private");
});

router.get('/main', (req, res) => {
  res.render('main');
});

router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/login");
  });
});

module.exports = router;