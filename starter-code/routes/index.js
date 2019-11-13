const express = require("express");
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  const loggedIn = req.session.user;
  res.render("index", { user: loggedIn });
});

router.get("/main", (req, res) => {
  const loggedUser = req.session.user;
  res.render("content/main", { user: loggedUser });
});

const loginCheck = _ => {
  return (req, res, next) => (req.session.user ? next() : res.redirect("/"));
};

router.get("/private", loginCheck(), (req, res) => {
  const loggedUser = req.session.user;
  res.render("content/private", { user: loggedUser });
});

module.exports = router;
