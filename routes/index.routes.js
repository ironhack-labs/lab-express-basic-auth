const express = require('express');
const { isLoggedIn } = require('../middleware/route-guard');
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

// Profile page
router.get("/profile", isLoggedIn, (req, res, next) => {
  // When you want to use the user info in a view
  // Access logged in user
  const user = req.session.user
  res.render("profile", { user: user })

  // Bonus: How to handle cookies
  // Set a cookie in the browser
  // res.cookie("myCookie", "hello from theconst express = require('express');
const { isLoggedIn } = require('../middleware/route-guard');
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

// Profile page
router.get("/profile", isLoggedIn, (req, res, next) => {
  // When you want to use the user info in a view
  // Access logged in user
  const user = req.session.user
  res.render("profile", { user: user })

  // Bonus: How to handle cookies
  // Set a cookie in the browser
  // res.cookie("myCookie", "hello from the server")
    
  // Access a cookie from the browser
  // console.log(req.cookies)

  // Delete a cookie in the browser
  // res.clearCookie("myCookie")
})

module.exports = router;

    
  // Access a cookie from the browser
  // console.log(req.cookies)

  // Delete a cookie in the browser
  // res.clearCookie("myCookie")
})

module.exports = router;
