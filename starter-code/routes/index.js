const express = require('express');
const router  = express.Router();
const {getHome,getLogin,getSignup,getPrivate,getMain,postSignup,postLogin} = require('../controllers/user.controllers')

const isAuth = (req,res,next)=>{
  (req.session.currentUser) ?next() : res.redirect('/login')
}


router.get('/', getHome)
router.get('/main',isAuth,getMain)
router.get('/private',isAuth,getPrivate)

//signup
router.get('/signup', getSignup)
router.post('/auth/signup', postSignup)

//login 
router.get('/login', getLogin)
router.post('/auth/login', postLogin)
module.exports = router;


