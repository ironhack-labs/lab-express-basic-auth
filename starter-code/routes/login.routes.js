const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt')
const bcryptSalt = 10


// la variable User represanta el modelo que habiamos creado 
const User = require('../models/user.model')







//////////////LOGIN   ////////////////////////////////////////////
router.get('/login', (req, res, next) => res.render('login'))
router.post('/login', (req, res, next)=>{

  const {email, password} = req.body

  if (email === "" || password === "") {
    res.render("login", { errorMessage: "Rellena todo" })
    return 
  }

  User.findOne({email})
    .then(user => {
      if (!user) {
        res.render("login", { errorMessage : 'El usuario no existe,'})
        return
      }

      if(bcrypt.compareSync(password, elm.password)){
        req.session.currentUser = user
        res.redirect('/private')
       }
       else{
         res.render('login',{ errorMessage : 'Contraseña incorrecta'})
       }
    })
    .catch(err => next (err))
})

module.exports = router;