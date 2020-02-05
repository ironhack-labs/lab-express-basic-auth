const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.render("index.hbs");
});

router.use((req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
});
router.get("/main", (req, res, next) => {
  res.render("main.hbs");
});

module.exports = router;
