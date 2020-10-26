const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));


router.use((req, res, next) => {
  // if hay un usuario en sesion (si esta logged in)
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/login");
  }
});

router.get("/private", function (req, res, next) {
  res.render("auth/private");
});


module.exports = router;



