const express = require("express");
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index", { loggedIn: req.session.user });
});

const loginCheck = () => {
  return (req, res, next) => {
    if (req.session.user) {
      next();
    } else {
      res.redirect("/");
    }
  };
};

router.get("/profile", loginCheck(), (req, res, next) => {
  res.render("profile", { user: req.session.user });
});

module.exports = router;
