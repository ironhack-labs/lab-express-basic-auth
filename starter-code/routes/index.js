const express = require("express");
const router = express.Router();

const logCheck = () => {
  return (req, res, next) => {
    if (req.session.user) next();
    else res.redirect("/login");
  };
};

/* GET home page */
router.get("/", (req, res, next) => {
  const user = req.session.user;
  res.render("index", { user });
});

router.get("/main", logCheck(), (req, res, next) => {
  res.render("main", { layout: false });
});

router.get("/private", logCheck(), (req, res, next) => {
  res.render("private", { layout: false });
});

module.exports = router;
