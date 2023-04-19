const express = require("express")
const router = require("express").Router();
const { isLoggedIn, checkForRole } = require("../middleware/route-guard")

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/profile", isLoggedIn, (req, res, next) => {

  const user = req.session.user
  res.render("profile", {user: user})
})

router.get("/secret", checkForRole, (req, res, next) => {
})

router.get("/public", (req, res, next) => {
  res.render("public")
})

router.get("/private", (req, res, next) => {
  res.render("private")
})

module.exports = router;
