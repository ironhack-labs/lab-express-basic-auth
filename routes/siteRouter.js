const express = require('express');
const router  = express.Router();
const User = require("../models/User")

router.use((req, res, next) => {
    if (req.session.currentUser) {
      next();
    } else {
      res.redirect("/login");
    }
   });

router.get('/secret', (req, res, next) => {
    res.render('secret');
  });
  




module.exports = router;