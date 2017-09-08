
const router = require('express').Router();
const User = require('../models/User')
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


router.get("/", (req,res,next) =>{
  res.render('index',{errorMessage: ""});
})

router.post("/signup", (req, res, next)=>{
  const myUserName = req.body.name
  const myUserPass = req.body.pass
  if(myUserPass === "" || myUserName === ""){
    res.render('index',{
      errorMessage : "Indicate a username and a password to sign up"
    })
    return
  }
  User.findOne({"name": myUserName},(err,user) =>{
    if(user !== null){
      res.render('index', {errorMessage : "User name already exists"})
      return
    }
    var salt = bcrypt.genSaltSync(bcryptSalt)
    var hashPass = bcrypt.hashSync(myUserPass, salt)

    var newUser = User({
      name: myUserName,
      password : hashPass
    });
    newUser.save((err)=>{
      if(err){
      res.render("index", {errorMessage: "Something went wrong"})
    }else {
      res.render("index", {errorMessage: "User created"})
    }

    })
  })


})

module.exports = router;
