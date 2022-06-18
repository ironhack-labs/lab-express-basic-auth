const router = require("express").Router();
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/sign-up',(req,res,next)=>{
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
    console.log('info',userInfo)
    res.render('success',userInfo)
  })
  .catch(error=>{
    console.log('error',error);
    next()
  })
})

router.get('/log-in',(req,res,next)=>{
  res.render('logIn');
})

router.post('/log-in',(req,res,next)=>{
  const {username,password} = req.body;
  
  User.findOne({username})
  .then(user=>{
    if(!user) return res.send('Invalid Credentials')
    if( bcrypt.compareSync(password, user.password)) return res.render('welcome')
    else res.send('Invalid Credentials')
  })
  .catch(error=>{
    console.log('error',error)
    next()
  })
})

module.exports = router;
