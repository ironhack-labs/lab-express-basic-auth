const router = require("express").Router();

// require custom middleware for protected routes
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');


/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

//Get main page (only accessible after login)
router.get("/main", isLoggedIn, (req, res, next) => {
  res.render("main");
})

//Get private page (only accessible after login)
router.get("/private", isLoggedIn, (req, res, next) => {
  res.render("private");
})

module.exports = router;
