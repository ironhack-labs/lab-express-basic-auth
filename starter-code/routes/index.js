const express = require('express');
const router  = express.Router();


/* GET home page */
router.get('/', (req, res, next) => {

  const currentUser = req.session.currentUser;
  res.render('index', {currentUser});
});

// CHECK if the user is logged in and send to secret
router.use((req,res,next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect('/login');
  }
})

// RENDER SECRET VIEW
router.get('/main', (req,res,next) => {
  res.render('main')
});

router.get('/private', (req,res,next) => {
  res.render('private')
});

module.exports = router;
