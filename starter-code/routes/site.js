const express = require("express");
const router = express.Router();

// check if the user is logged in
router.use((req, res, next) => {
  if (req.session.currentUser) next();
  else return res.redirect("/login");
});

// private pages
router.get("/main", (req, res, next) => {
  return res.render("private/main");
});

router.get("/private", (req, res, next) => {
  return res.render("private/private");
});

module.exports = router;
