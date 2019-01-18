const express = require("express");
const router = express.Router();
const zxcvbn = require("zxcvbn");
const User = require("../models/User");

const bcrypt = require("bcrypt");
const bcryptSalt = 10;


router.get('/signup',(req,res,next)=>{
  res.render("auth/signup");
})

router.post("/signup",(req,res,next)=>{
  const username=req.body.username;
  const password=req.body.password;
  const salt=bcrypt.genSaltSync(bcryptSalt);
  const hashPass= bcrypt.hashSync(password,salt);

  if(username === "" || password === ""){
    res.render("auth/signup",{
      errorMessage: "You have to enter a username and password"
    });
    return;
  }

  if(zxcvbn(password).score < 1){
    res.render("auth/signup",{
      errorMessage: "The level of complexity of your password is low, please enter numbers, letters and special characters"
    })
    return;
  }

  User.findOne({username: username})
  .then(user=>{
    if(user !== null){
    res.render("auth/signup",{
      errorMessage: "That user already exists, try another name"
    });
    return;
    }

    const newUser = User({
      username,
      password:hashPass
    })

    newUser.save()
    .then(user=>{
      res.redirect("/login")
    })
    .catch(err=>console.log(err));
  })
})

router.get("/login",(req,res,next)=>{
  res.render("auth/login")
})

router.post('/login', (req, res, next)=>{
 const username = req.body.username
 const password = req.body.password
 console.log(req.body.username)
 console.log(req.body.password)

 if(username === "" || password === ""){
   res.render('auth/login', {
     errorMessage: 'You have to enter a username and password'
   })
   return
 }

 User.findOne({"username": username})
 .then(user=>{
   if(!user){
     res.render('auth/login',{
       errorMessage: `The user ${username} does not exist!!!`
     })
     return
   }
   if(bcrypt.compareSync(password, user.password)){
     req.session.currentUser = user
     res.redirect('/')
   }else{
     res.render('auth/login',{
       errorMessage: "Password is incorrect"
     })
   }
 })
 .catch(err=>next(err))
})

router.get("/logout",(req,res,next)=>{
  req.session.destroy((err)=>{
    res.redirect("/login")
  })
})

module.exports = router;
