var express = require('express');
var router = express.Router();

// USE (HORIZONTAL)
const isLoggedIn = (req, res, next) => {
  if (req.session.currentUser) {
    next();
  }
  else {
  	res.redirect("/login");
  }  
}


router.get("/main", isLoggedIn, (req, res, next) => {
  res.render("main");
});

router.get("/private", isLoggedIn, (req, res, next) => {
  res.render("private");
});


module.exports = router;