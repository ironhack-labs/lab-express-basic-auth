const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.render("home");
});

router.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/login");
  }
});
//protected routes

router.get("/main", (req, res, next) => {
  res.render("secret");
});

router.get("/private", (req, res, next) => {
  res.render("privado");
});

module.exports = router;