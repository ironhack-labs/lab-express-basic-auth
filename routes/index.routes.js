const express = require("express");
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => res.render("index"));

// Public main page
router.get("/cat", (req, res) => {
  res.render("cat-page");
});

// Custom middleware

router.use((req, res, next) => {
  console.log(req.session);
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/");
  }
});

router.get("/private-gif", (req, res) => res.render("main-page"));
module.exports = router;
