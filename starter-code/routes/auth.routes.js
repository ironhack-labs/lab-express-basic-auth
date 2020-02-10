const express = require('express');
const router  = express.Router();

const User = require("../models/user.model")

const bcrypt = require("bcrypt")
const bcryptSalt = 10



router.get("/signup", (req, res) => res.render("auth/signup"))

router.post("/signup", (req,res) => {

  const {firstName, lastName, email, password} = req.body

  // check if there is an input in the email and password. 
  if(email.length === 0 || password === 0){
    res.render("auth/signup", {errorMessage : "Please write an email and password"})
    return
  }

  
  //check if the email already exist in the database
  User.findOne({email})
  .then(emailCheck => {
    if(emailCheck){
      res.render("auth/signup", {errorMessage : "This email already exist in the database"})
      return
    }else{
      
      //setting up random password
      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hashPass = bcrypt.hashSync(password , salt)

      //create the new user with the hased password
      User.create({firstName, lastName, email, password: hashPass})
      .then(createdUser => console.log(createdUser))
      .catch(err => console.log("error al crear el usuario de tipo", err))
      .then(()=> res.redirect("/"))
      
    }
  })
})



// login

router.get("/login", (req, res) => res.render("auth/login"))

router.post("/login", (req, res) => {

  const {email, password} = req.body

  console.log(`this is the email ${email} and this is the body ${password}`)
  console.log(req.session)


  User.findOne({email})
  .then(checkedUser => {

    if(!checkedUser){
      res.render("auth/login", {errorMessage : "This email is not registered, try again"}) 
      return
    }

    if(bcrypt.compareSync(password, checkedUser.password)){
      
      console.log(`this is the se req session ${req.session}`)
      // COOKIE THAT GRANTS THE ACCESS TO THE CHECKED USER TO MOVIE FREELY
      req.session.currentUser = checkedUser


      //redirect to home 
      res.redirect("/")

    }else{
      //if password incomplete erro message. 
      res.render("auth/login", {errorMessage: "Incorrect password, please try again"})
    }

  })
  .catch(err => console.log("error al comporbar si el usurario introdujo bien datos en login de type ", err))

})


router.get("/logout", (req, res) => req.session.destroy(err => res.reditect("/")))



module.exports = router