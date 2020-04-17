const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/profile', (req, res, next) => {
  if(req.session.currentUser){
    res.render('profile', req.session.currentUser)

  }else{
    res.redirect('/')
  }
})
module.exports = router;