const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.render("home");
});

//get authentication for access to /secret page
//otherwise re-route to login page

router.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/auth/login");
  }
});

//if session is met, the GET for secret will be accessible
router.get("/secret", (req, res, next) => {
  res.render("secret");
});

router.get("/private", (req, res, next) => {
  res.render("private");
});

module.exports = router;
