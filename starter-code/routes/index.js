const express = require("express");
const router = express.Router();
const { isLoggedIn, isLoggedOut } = require("../lib/itsLogged");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/main", isLoggedIn(), (req, res, next) => {
  return res.render("main");
});

router.get("/private", isLoggedIn(), (req, res, next) => {
  return res.render("private");
});

module.exports = router;
