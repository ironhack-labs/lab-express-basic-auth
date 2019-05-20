const express = require('express');
const router  = express.Router();
const User = require("../models/User")
const bcrypt = require("bcrypt")
const bcryptSalt = 10

/* SIGNUP */
router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.post('/signup', (req, res, next) => {
  const {username, password} = req.body
  if (!username || !password) {
    res.render("signup", {errMsg: "Faltan datos"})
    console.log("********************************************* Error faltan datos")
    return
  }
  console.log("******************************************* Funciona")
  User.findOne({username})
  .then(foundUser => {
    if(foundUser) {
      console.log("************************************ El usuario ya existe")
      res.render('signup', {errMsg: "El usuario ya existe"});
      return
    }
    console.log("************************************ El usuario no existe")
    const salt = bcrypt.genSaltSync(bcryptSalt)
    const hashPass = bcrypt.hashSync(password, salt)
    User.create({username, password: hashPass})
    .then(createdUser => {
      res.render("./", {createdUser})
      console.log(createdUser)
    })
    .catch(err => console.log("Algo no va", err))
  })
  .catch(err => console.log("Algo no va", err))
});

/* LOGIN */

router.get("/login", (req, res) => {
  console.log("**************************** ESTAMOS AQUI")
  res.render("index")
})

router.post('/login', (req, res, next) => {
  const {username, password} = req.body
  if (!username || !password) {
    res.redirect("/")
    console.log("********************************************* Error faltan campos")
    return
  }
  console.log("******************************************* Funciona")
  User.findOne({username})
  .then(foundUser => {
    if(!foundUser) {
      console.log("************************************ El usuario no está registrado")
      res.redirect("/");
      return
    }
    if(bcrypt.compareSync(password, foundUser.password)) {
      req.session.currentUser = foundUser 
      console.log("************************************ Nueva sesión")
      res.redirect("/")
    } else {
      res.render("index", {errMsg:"pass incorrect"})
    }
    })
   .catch(err => console.log("Algo no va", err))
});

router.get("user/logout", (req, res, next) => {
  console.log("loging out")
  req.session.destroy((err) => {
    if(err) {
        console.log(err)
    }
    res.redirect("/");
  });
});

router.use((req, res, next) => {
  if(req.session.currentUser){
      next();
      return;
  }
  res.redirect("/user/login")
  console.log("Entra")
})



module.exports = router;