const router = require("express").Router()
const { genSalt } = require("bcrypt")
const bcrypt = require("bcryptjs")
const User = require("../models/User.model")
const saltRounds = 10

console.log("*** LOGIN.ROUTES STARTED ****")

router.get("/signup",(req,res)=>{
    res.render("login/signup")
})

router.post("/signup",(req,res)=>{
    console.log(req.body)
    const {email, password} = req.body

    bcrypt
    .genSalt(saltRounds)
    .then((salt)=>{
        console.log(salt)
        return bcrypt.hash(password,salt)
    })
    .then((hashedPassword)=>{
      console.log (hashedPassword)
      User.create({
        email:email,
        encryptedPassword:hashedPassword
      })
      // res.redirect("/")
      console.log(email, password)
      if (email && password){
        router.get("/mainpage",(req,res)=>{
          res.render("login/main")
          res.redirect("/")
      })
      router.get("/private",(req,res)=>{
        res.render("login/private")
        res.redirect("/private")
    })
    }
    })
    .catch((error)=>{
      console.log(error)
  })





})






module.exports = router