const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));


router.use(["/main", "/private"], (req, res, next) => {
    // if hay un usuario en sesión (si está logged in)
    if (req.session.currentUser) {
      next();
    } else {
      res.redirect("/login");
    }
  });
  
  router.get("/main", (req, res, next) => {
    res.render("main");
  });

  router.get("/private", (req, res, next) => {
    res.render("private");
  });

module.exports = router;
