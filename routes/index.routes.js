const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => res.render('home'));


router.use((req, res, next) => {
    // if hay un usuario en sesión (si está logged in)
    if (req.session.currentUser) {
      next();
    } else {
      res.redirect("/login");
    }
  });
  
  router.get("/main", function (req, res, next) {
    res.render("main");
  });

  router.use((req, res, next) => {
    // if hay un usuario en sesión (si está logged in)
    if (req.session.currentUser) {
      next();
    } else {
      res.redirect("/login");
    }
  });

  router.get("/private", function (req, res, next) {
    res.render("private");
  });

module.exports = router;
