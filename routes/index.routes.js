const express = require('express');
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("home");
});

router.use(['/private', '/main'], (req, res, next) => {
  // if hay un usuario en sesión (si está logged in)
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/login");
  }
});

router.get("/private", function (req, res, next) {
  res.render("private");
});

router.get("/main", function (req, res, next) {
    res.render("main");
  });

module.exports = router;
