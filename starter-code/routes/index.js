const express = require("express");
const router = express.Router();

const isLoggedIn = (req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/auth/login");
  }
};

/* GET home page */
router.get("/", isLoggedIn, (req, res, next) => {
  res.render("index");
});

router.get('/main', isLoggedIn, (req, res, next) => {
  res.render('main');
});

router.get('/private', isLoggedIn, (req, res, next) => {
  res.render('private')
});

module.exports = router;
