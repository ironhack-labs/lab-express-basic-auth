const express = require('express');
const router = express.Router();

const User = require('../models/User.model.js');

router.get("/signup", (req, res, next) => {
  res.render("auth/signup.hbs")
})

router.post("/signup", async (req, res, next) => {
  console.log(req.body)

  if (req.body.email === "" || req.body.password === "") {
    console.log("o el email o la contraseña no pueden estar vacios");
    res.render("auth/signup.hbs", {
      errorMessage: "* Los campos deben estar llenados"
    })
   
  }

  const regexPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/gm
  if (regexPattern.test(req.body.password) === false) {
    res.render("auth/signup.hbs", {
      errorMessage: "* La contraseña debe tener al menos 8 caracteres, una mayuscula, una minuscula y un caracter especial"
    })
    
    return;
  }

  try {

    const foundUser= await User.findOne({ $or: [{email: req.body.email}, {username: req.body.username}] })

    if(foundUser !== null) {
      res.render("auth/signup.hbs", {
        errorMessage: "* ya existe un usuario con ese correo o nombre"
      })
      
      return 
    }

    const response = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    })

  res.redirect("/auth/login")


  } catch(error) {
    next(error)
  }
  
})

router.get("/login", (req, res, next) => {
  res.render("auth/login.hbs")
})


router.post("/login", async (req, res, next) => {

  console.log(req.body);

 
  if(req.body.email === "" || req.body.password === "") {
    res.render("auth/login.hbs", {
      errorMessage: "* Los campos deben estar llenados"
      
    })

    return
  }

try {
  const foundUser = await User.findOne({ username: req.body.username })
  if(foundUser === null) {
    res.render("auth/login.hbs", {
      errorMessage: "* usuario no encontrado"
    })

    return; 
  }

console.log(foundUser.password);

console.log(req.body.password);
  if(req.body.password !== foundUser.password) {
    res.render("auth/login.hbs", {
      errorMessage: "* contraseña incorrecta"
    })

    return
  }

console.log(req.session);
  req.session.activeUser = foundUser;
  req.session.save(() => {
  res.redirect("/profile")

  })




 
} catch(error) {
  next(error)
}
 

})




module.exports = router;