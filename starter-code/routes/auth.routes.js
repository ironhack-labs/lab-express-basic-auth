const express = require('express');
const router  = express.Router();

const User = require("../models/user.model")

const bcrypt = require("bcrypt")
const bcryptSalt = 10

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));

router.get('/signup',(req,res)=>res.render('auth/signup'))

router.post('/signup',(req,res)=>{

  const {username,password} = req.body

  if(username.length === 0 || password.length === 0){
    res.render("auth/signup", { errorMessage: "Rellena los datos"})
    return
  }

  User.findOne({username:username})
    .then(extUser => {
      if(!extUser){
         
        const salt = bcrypt.genSaltSync(bcryptSalt)
        const hashPass = bcrypt.hashSync(password,salt)

        User.create({username,password:hashPass})
          .then(x => res.redirect("/"))
          .catch(err => console.log(err))
      }else{
        res.render("auth/signup",{ errorMessage: "Username ya registrado"})
        return
      }
    })
    .catch(err => console.log(err))


  
})

router.get('/login',(req,res)=>res.render('auth/login'))
router.post('/login',(req,res)=>{

  const { username, password} = req.body

  if(username.length === 0 || password.length === 0){
    res.render("auth/signup", { errorMessage: "Rellena los datos"})
    return
  }

  User.findOne({username:username})
    .then(extUser => {
      if(!extUser){
         res.render('auth/login',{errorMessage: 'Username no registrado'})
         return
      }

      if(bcrypt.compareSync(password,extUser.password)){
        req.session.currentUser = extUser
        res.redirect("/private")
      } else {
        res.render('auth/login',{errorMessage: 'Contraseña incorrecta'})
      }

    })
    .catch(err => console.log(err))

})

module.exports = router;