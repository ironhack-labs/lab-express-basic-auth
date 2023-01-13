const router = require("express").Router()
const { genSalt } = require("bcrypt")
const bcrypt = require("bcryptjs")
const User = require("../models/User.model")
const saltRounds = 10

console.log("*** LOGIN.ROUTES STARTED ****")

router.get("/signup",(req,res)=>{
    res.render("login/signup")
})

router.get('/mainpage', (req, res, next) => {
  res.render('mainpage')
}) 
router.get('/private', (req, res, next) => {
  res.render('private')
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
    .then(hashedPassword=>{
      console.log (hashedPassword)
      return User.create({
        email:email,
        encryptedPassword:hashedPassword
      })
    })

    .then(newUser => {
      console.log(newUser)
      if (email && password) {
        console.log("move to main page)
        res.redirect("/mainpage")
      }
    })

    .catch((error)=>{
      console.log(error)
  })





})






module.exports = router