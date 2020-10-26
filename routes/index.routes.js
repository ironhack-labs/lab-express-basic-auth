const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', function (req, res, next) { 
  res.render('home');
});

router.use((req, res, next) => {
    // if hay un usuario en sesión (si está logged in)
    if (req.session.currentUser) {
      next();
    } else {
      res.redirect("/login");
    }
  });

router.get("/main", function (req, res, next) {
  // if hay un usuario en sesión (si está logged in)
  if (req.session.currentUser) {
    res.render("home");
  } else {
    res.redirect("/login");
  }
})

router.get("/private", function (req, res, next) {
  // if hay un usuario en sesión (si está logged in)
  console.log("I'm in private before if");
  if (req.session.currentUser) {
    console.log("I'm in private within if")
    res.render("private");
  } else {
    console.log("I'm in private within else")
    res.redirect("/login");
  }
});

module.exports = router;
