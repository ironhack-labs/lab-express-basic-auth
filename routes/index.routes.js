const express = require("express");
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => res.render("index"));

const loginCheck = () => {
  return (req, res, next) => {
    if (req.session.user) {
      next();
    } else {
      res.redirect("/login");
    }
  };
};

router.get("/private", loginCheck(), (req, res, next) => {
  res.render("private", { user: req.session.user });
});

router.get("/main", loginCheck(), (req, res, next) => {
  res.render("main", { user: req.session.user });
});

module.exports = router;
