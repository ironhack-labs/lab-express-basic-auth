var express = require('express');
var router = express.Router();




// PRE ROUTE MIDDLEWARE - check if user has authenticated cookie

router.use((req, res, next) => {
  if (req.session.currentUser) { // <== if there's user in the session (user is logged in)
    next(); // ==> go to the next route ---
  } 																//		|
  else {                          	//    |
  	res.redirect("/login");       	//    |
  }                                 //    |
});																	//		|
// 		 ------------------------------------  
//     | 
//     V

router.get("/secret", (req, res, next) => {
  res.render("secret-one");
});

router.get("/home", (req, res, next) => {
  res.render("home");
});

router.get("/private", (req, res, next) => {
  res.render("private");
});



module.exports = router;