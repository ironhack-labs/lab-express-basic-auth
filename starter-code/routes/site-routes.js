const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.render("index");
});

function protectRoute(req, res, next) {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/auth/signin");
  }
};

router.get("/secret", protectRoute, (req, res, next) => {
  res.render("secret");
});

module.exports = router;
