const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index',{user: req.session.currentUser});  
});

router.get('/main', (req, res) => {
  if(req.session.currentUser){
    res.render('main',{user: req.session.currentUser});    
  } else{
    res.redirect('/');
  }
});

module.exports = router;
