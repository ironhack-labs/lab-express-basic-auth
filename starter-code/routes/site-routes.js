const express = require("express");
const router = express.Router();

const loginCheck = () => {
  return (req, res, next) => {
    if (req.session.currentUser) next();
    else res.redirect("login");
  };
};

router.get("/private", loginCheck(), (req, res, next) => {
  res.render("private");
});

router.get('/main', loginCheck(), (req, res) => {
  let user = req.session.currentUser;
  res.render('main', { user });
});

router.get("/", (req, res, next) => {
  res.render("index");
});

module.exports = router;