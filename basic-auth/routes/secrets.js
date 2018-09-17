const express = require('express');
const router  = express.Router();
const session= require('express-session')
router.use((req, res, next) => {
  console.log(req.session)
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("../auth/login");
  }
});

router.get('/main', (req, res, next) => {
  

  res.render('secrets/main');
});
router.get('/private', (req, res, next) => {
  

  res.render('secrets/private');
});

module.exports=router