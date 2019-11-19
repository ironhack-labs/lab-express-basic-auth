var express = require('express');
var router = express.Router();

router.use((req, res, next) => {
    if (req.session.currentUser) {
        next();
    }
    else {
        res.redirect('/login');
    }
});

router.get("/main", (req, res, next) => {
    res.render("auth-views/main");
  });


router.get("/private", (req, res, next) => {
    res.render("auth-views/private");
  });
  


module.exports = router;

