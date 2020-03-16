const express = require('express');
const router  = express.Router();

/* GET home page */ // and check if the user is 
router.get('/', (req, res, next) => {
  res.render('index',{user:req.session.currentUser});
});

router.get('/main',(req,res,next)=> {
  if(req.session.currentUser) {
    res.render('../views/auth/main.hbs');
  } else{
    res.redirect('/login');
  }
})

router.get('/private',(req,res,next)=> {
  if(req.session.currentUser) {
    res.render('../views/auth/private.hbs',{user:req.session.currentUser});
  } else{
    res.redirect('/login');
  }
})



module.exports = router;
