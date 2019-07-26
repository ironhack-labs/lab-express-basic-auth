const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt')
const bcryptSalt = 10


// la variable User represanta el modelo que habiamos creado 
const User = require('../models/user.model')



/////////////////    SIGNUP

router.get('/signup', (req,  res, next) => res.render ('signup'))
router.post('/signup', (req, res, next) => {

  const {email, password} = req.body

  if (email === "" || password === "") {
    res.render("signup", { errorMessage: "Rellena todo" })
    return 

  }

  User.findOne({email})
    .then(elm => {
      if(elm){
        res.render('signup', { errorMessage: "El email ya existe"})
        return
      }
    })
    .catch(err => console.log('error:', err))

  const salt = bcrypt.genSaltSync(bcryptSalt)
  const hashPass = bcrypt.hashSync(password, salt)

  User.create({ email, password: hashPass })
    .then(() => res.redirect('/'))
    .catch(err => console.log('ERRORR:', err))

})

module.exports = router;