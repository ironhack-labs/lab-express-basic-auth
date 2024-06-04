const router = require("express").Router();
const User = require("../models/User.model");

const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/main", isLoggedIn, (req, res, next) => {
    res.render("../views/protected/main.hbs");
  });
  
  router.get("/private", isLoggedIn, (req, res, next) => {
    res.render('../views/protected/private.hbs');
  });
  
  
  module.exports = router;
  