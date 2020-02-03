const express = require("express");
const router = express.Router();

router.use((req, res, next) => {
  if (req.session.currentUser) next();
  else return res.redirect("/auth/login");
});

//private pages
router.get("/main", (req, res, next) => {
  return res.render("private/main", { user: req.session.currentUser });
});

router.get("/private", (req, res, next) => {
  return res.render("private/private");
});

module.exports = router;
