const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.render("index.hbs");
});

router.use((req, res, next) => {
  console.log(req.session.user);
  if (req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
});
router.get("/private", (req, res, next) => {
  res.render("private.hbs");
});

module.exports = router;
