const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');


const saltRounds = 10

const {isLoggedIn, isLoggedOut} = require("../middleware/route-guard") 
const User = require("../models/User.model");
const { default: mongoose } = require('mongoose');
// first adjust the session before the middleware because the middleware uses the session in order to control the sec
router.get("/signup", isLoggedOut, (req, res) => {
    res.render("auth/signup")
  })

router.post('/signup', async (req, res) => {
    console.log(req.body)
    const {username, password} = req.body
  
    if ( !username || !password) {
      res.render("auth/signup", { error: "All fields must be fillled."})
      return
    }
  
    try {
      const salt = bcrypt.genSaltSync(saltRounds)
      const hash = bcrypt.hashSync(password, salt)
  
      const userDb = await User.create({
        username ,
        password: hash
      })
      req.session.currentUser = userDb
      res.redirect("/signup")
    }catch (err) {
      console.log(err)
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(500).render("auth/signup", { error: err.message })
      }
    }
  })

  router.get("/login", isLoggedOut, (req, res) => {  //why logged out??
    res.render("auth/login")
    console.log(req.session)
  })
  
  router.post("/login", async(req, res) => {
    console.log(req.session)
    const { username, password } = req.body   // explain
  
    if ( !username || !password) {
      res.render("auth/login", { errorMessage: "All the fields should be flled"})
      return
    }
  
    try {
      const userDb = await User.findOne({username})
      if (!userDb) {
        res.render("auth/login", { errorMessage: "This user name is not registered, Try again" })
      } else if (bcrypt.compareSync(password, userDb.password)){
        req.session.currentUser = userDb
        console.log(userDb)
        res.render("users/profile", userDb)
      } else {
        res.render("auth/login", { errorMessage: "Incorrect password, Try again" })
      }
    }catch (err) {
      console.log(err)
    }
  
  })

  router.get("/profile", isLoggedIn, (req, res) => {
    const user = req.session.currentUser    //accesing the user info
    res.render("users/profile", user)
  })

  router.get("/private", isLoggedIn, (req, res) => {    //accesing the user info
    res.render("users/private")
  })
  router.get("/main", (req, res) => {    //accesing the user info
    res.render("users/main")
  })


  
//   router.post("/logout", (req, res) => {
//     req.session.destroy(err => {
//       if (err) {
//         console.log(err)
//       } else {
//         res.redirect("/")
//       }
//     })
//   })
  
//   router.get("/profile", isLoggedIn , (req, res) => {
//     res.render("users/user-profile", req.session.currentUser)
//   })
  

module.exports = router;