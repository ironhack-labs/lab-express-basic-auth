const router = require("express").Router();
const bcryptjs = require("bcryptjs");
const User = require("../models/User.model");
const saltRounds = 10;
const mongoose = require('mongoose')
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');

router.get('/signup',isLoggedOut, (req, res) => {
  console.log(req.session)
  data = {userInSession:req.session.currentUser}
  console.log(data)
  res.render('auth/signup',data)
})


router.post('/signup', (req, res, next) => {
  const { username, email, password } = req.body;

  
  
  if (!username || !email || !password) {
    res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username, email and password.' });
    return;
  }

  
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if(!regex.test(password)){
      res.render('auth/signup',{errorMessage: "Please input a password: at least 6 characters long, with a lowercase and uppercase letter"})
      return
  }
  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({
        username: username,
        email: email,
        passwordHash: hashedPassword
      });
    })
    .then((userFromDB) => {
      res.redirect("/private");
  
    })

    .catch(error => {
       
        if (error instanceof mongoose.Error.ValidationError) {
            res.status(500).render('auth/signup', { errorMessage: error.message });
        }
      
        else if(error.code === 11000){
            res.render('auth/signup',{errorMessage:"There is already an account associated with this email please sign in or sign up with new email"})
        }
         else {
            next(error);
        }
    }); 
}) 


router.get('/login',isLoggedOut,(req,res)=>{
console.log(req.session)
res.render('auth/login')
})

router.get('/private',isLoggedIn, (req, res) => {
res.render('users/private',{userInfo:req.session.currentUser})
})

router.post('/login',(req,res)=>{
console.log("SESSION =====>", req.session)
console.log(req.body)
const {email,password} = req.body


if(!email || !password){
    res.render('auth/login',{errorMessage:'please enter an email or password'})
return
}

User.findOne({email})
.then(user=>{
    console.log(user)
    if(!user){
        res.render('auth/login',{errorMessage:"User not found please sign up. No account associated with email"})
    }
   
    else if(bcryptjs.compareSync(password,user.passwordHash)){
        
        req.session.currentUser = user
        res.redirect('/private')
    }
    else{
        res.render('auth/login',{errorMessage:"Incorrect Password"})
    }

})
.catch(error=>{
    console.log(error)
})

})

router.get('/main',(req,res)=>{
res.render('users/main',{userInfo:req.session.currentUser})
})


router.post('/logout', (req, res, next) => {
req.session.destroy(err => {
  if (err) next(err);
  res.redirect('/login');
});
});

module.exports = router;
