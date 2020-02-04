const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});


router.use((req, res, next) => {
  if (req.session.currentUser) { // if there's user in the session (user is logged in)
    next(); // go to the next route 
  } else {                          
    res.redirect("/login");        
  }                                 
});

router.get('/main', (req, res, next) => {
  res.render('main');
});

router.get('/private', (req, res, next) => {
  res.render('private');
});

module.exports = router;