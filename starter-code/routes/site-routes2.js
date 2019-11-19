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




router.get("/secret", isLoggedIn, (req, res, next) => {
  res.render("secret");
});


module.exports = router;