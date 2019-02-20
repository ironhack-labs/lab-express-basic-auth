const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.render("home");
});

router.get("/secret", isLoggedIn, (req, res, next) => {

  res.render("secret");
});

function isLoggedIn(req, res, next) {
  if (req.session.currentUser) { 
    return next(); 
  } else {                       
    res.redirect("/login");        
  }
}

module.exports = router;