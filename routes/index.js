const express = require("express");
const router = require("express").Router();
const { private } = require("../middleware/private");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/profile", private, (req, res) => {
  const user = req.session.user;
  res.render("profile", { user: user });
});

router.get("/private", private, (req, res) => {
  const user = req.session.user;
  res.render("private", { user: user });
});

router.get("/main", (req, res) => {
  const user = req.session.user;
  res.render("main", { user: user });
});

module.exports = router;
