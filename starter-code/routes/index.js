
var express = require('express');
var router = express.Router();
// const isLoggedIn = require('../middlewares/isLoggedIn');

router.get('/',(req,res) =>{
  res.render('index');
});

// router.get('/secret', isLoggedIn('/'), (req,res) => {
//     res.render('secret',{user:req.session.currentUser});
// });

module.exports = router;
