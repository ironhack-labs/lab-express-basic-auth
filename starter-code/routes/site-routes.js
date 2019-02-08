const express = require("express");
const User = require("../models/User.js");
const router = express.Router();

router.use((req, res, next) => {
  if (req.session.currentUser) {
    // <== if there's user in the session (user is logged in)
    next(); // ==> go to the next route ---
  } else {
    //    |
    res.redirect("/login"); //    |
  } //    |
}); // ------------------------------------
//     |
//     V

router.get("/main", (req, res, next) => {
  res.render("main.hbs");
});

router.get("/private", (req, res, next) => {
  res.render("private.hbs");
});

module.exports = router;
