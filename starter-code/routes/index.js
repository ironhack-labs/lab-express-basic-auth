const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('home');
});

const isLogged = (req, res, next) => {
  const user = req.session.currentUser
  if(!user) return res.redirect('/auth/login')
  else next()
}

router.get('/profile', isLogged, (req, res, next) => {
  const user = req.session.currentUser
  res.render('profile', user);
});

router.get('/main', isLogged, (req, res, next)=>{
  res.render('main')
})

router.get('/private', isLogged, (req, res, next)=>{
  res.render('private')
})

router.get('/logout',(req, res, next)=>{
  req.session.destroy(err=>{
    if(err) res.send(err)
    else return res.redirect('/auth/login')
  })
})

module.exports = router;