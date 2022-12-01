const router = require("express").Router();
const User = require('../models/User.model');
const bcryptjs = require('bcryptjs');
const UserModel = require("../models/User.model");
const saltRounds = 10;
const isLoggedIn = require("../middleware/isLoggedIn")
// signup
router.get("/signup",(req,res,next)=>{
    res.render("auth/signup")
})

router.post("/signup", (req,res,next)=>{
    const {username,password} = req.body
    bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
      console.log(`Password hash: ${hashedPassword}`);
      User.create({username,password:hashedPassword})
      .then((user)=>{
        res.redirect("/auth/profile")
      })
    })
    .catch(error => next(error));
  })

  //profile
  router.get("/profile", isLoggedIn, (req,res, next)=>{
    const {user} = req.session

   res.render("auth/profile", {user})
  })

//login
  router.get("/login",(req,res,next)=>{
    res.render("auth/login")
})

router.post("/login", (req,res,next)=>{
  const {username, password} = req.body;
    User.findOne({username})
    .then((user)=>{
      if(!user){
        return res.render("auth/login", {
          errorMessage: "wrong credentials"
        })
      }
      bcryptjs.compare(password, user.password).then ((isMatched)=>{
        if(! isMatched){
          return res.render("auth/login", {
            errorMessage: "wrong credentials"
          })
        }
        req.session.user = user 
        res.redirect("/auth/profile")
    })

    })
    .catch()
    
  })

  module.exports = router;