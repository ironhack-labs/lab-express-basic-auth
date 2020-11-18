const express = require("express");
const hbs = require("hbs");
const router = express.Router();

// we are getting (get) the home page here
router.get("/", (req, res, next) => {
  // then we destruct to get the user from the req.session
  const { user } = req.session;
  console.log("user:", user); // the user will be undefined until they sign up or log in
  /* once we have a user though, they get to see a slightly different homepage, as you can see 
  from the render below, we give our users their very own home page*/
  res.render("index", { user });
});

module.exports = router;
