const express = require("express");
const router = express.Router();

router.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/login");
  }
});



router.get("/", (req, res) => {
  if (req.session.currentUser) {
    res.render("private");
  } else {
    res.redirect("/");
  }
});
router.get("/main", (req, res) => {
  if (req.session.currentUser) {
    res.render("main");
  } else {
    res.redirect("/");
  }
});


module.exports = router