const router = require("express").Router();
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/sign-up',(req,res,next)=>{
  if (req.session.currentUser) res.redirect('profile')
  res.render('signUp');
})

router.post('/sign-up',(req,res,next)=>{
  const { username , password } = req.body;
  const saltRounds = 12;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);
  
  console.log('hash',hash,'password',hash);

  User.create({ username , password: hash })
  .then(userInfo => {
    /* console.log('info',userInfo)
    res.render('success',userInfo) */
    req.session.currentUser = userInfo;
    res.redirect(`profile`)
  })
  .catch(error=>{
    console.log('error',error);
    next()
  })
})

router.get('/log-in',(req,res,next)=>{
  console.log('Session',req.session)
  if (req.session.currentUser) res.redirect('profile')
  res.render('logIn');
})

router.post('/log-in',(req,res,next)=>{
  const {username,password} = req.body;
  
  User.findOne({username})
  .then(user=>{
    if(!user) return res.send('Invalid Credentials')
    if( !bcrypt.compareSync(password, user.password)) return res.send('Invalid Credentials')
    req.session.currentUser = user;
    res.redirect(`profile`)
  })
  .catch(error=>{
    console.log('error',error)
    next()
  })
})

router.get('/profile',(req,res,next)=>{
  /* const {id} = req.params;
  User.findById(id)
  .then(user=>{
    res.render('welcome',user);
  }) */
  if (!req.session.currentUser) res.redirect('log-in')
  res.render('welcome',req.session.currentUser);
})

router.get('/log-out',(req,res,next)=>{
  req.session.destroy((error)=>{
    if(error) next()
    res.redirect('log-in')
  })
})

module.exports = router;
