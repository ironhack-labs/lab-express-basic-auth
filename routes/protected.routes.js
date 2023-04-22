const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn");

//main
router.get("/main", isLoggedIn, (req, res, next) => {
  res.render("main");
});

//private
router.get("/private", isLoggedIn, (req, res, next) => {
  res.render("private");
});

module.exports = router;
