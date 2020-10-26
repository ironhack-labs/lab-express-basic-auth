var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("home");
});

router.use((req, res, next) => {
  // if hay un usuario en sesión (si está logged in)
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/login");
  }
});

router.get("/secret", function (req, res, next) {
  res.render("secret");
});

module.exports = router;