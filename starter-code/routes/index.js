const express = require("express");
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  const user = req.session.user;
  console.log("req.session.user: ", req.session.user);
  res.render("index", { user: user });
});

// create a middleware that checks if a user is logged in

const loginCheck = () => {
  return (req, res, next) => {
    if (req.session.user) {
      // if user is logged in, proceed to the next function
      next();
    } else {
      // else if user is not logged in, redirect to /login
      res.redirect("/login");
    }
  };
};

router.get("/private", loginCheck(), (req, res) => {
  res.render("private");
});

router.get("/main", loginCheck(), (req, res) => {
  res.render("main");
});

module.exports = router;