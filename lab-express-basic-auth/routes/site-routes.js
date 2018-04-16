const express = require('express');
const router  = express.Router();

router.get("/main", (req, res, next) => {
  if( req.session.currentUser ) {
    res.render("secret/main");
  } else {
    res.redirect("/");
  }
});

router.get("/private", (req, res, next) => {
  if( req.session.currentUser ) {
    res.render("secret/private");
  } else {
    res.redirect("/");
  }
});

module.exports = router;