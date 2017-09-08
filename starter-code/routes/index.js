const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middlewares/isLoggedIn');

router.get('/',(req,res) =>{
  res.render('index');
});

router.get('/profile', isLoggedIn('/'), (req,res) => {
  res.render('user/profile',{
    title: 'User page',
    user:req.session.currentUser
  });
});

module.exports = router;