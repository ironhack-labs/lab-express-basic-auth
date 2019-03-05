const express = require('express')
const router = express.Router()
const User = require('../models/user')

const bcrypt = require('bcrypt')
const bcryptSalt = 10


router.get('/signup', (req, res, next)=>{
  res.render("auth/signup")
})

router.post('/signup', (req, res, next)=>{
  const username = req.body.username
  const password = req.body.password
  const salt = bcrypt.genSaltSync(bcryptSalt)
  const hashPass = bcrypt.hashSync(password, salt)



  if(username === "" || password === ""){
    res.render('auth/signup', {
      errorMessage: "Tienes que introducir un usuario y un password"
    });
    return
  }



  User.findOne({username: username})
  .then(user=>{
    if(user !== null){
      res.render('auth/signup', {
        errorMessage: "Ese usuario ya existe, sea creativo!"
      });
      return
    }

    const newUser = User({
      username,
      password: hashPass
    })

    newUser.save()
    .then(user=>{
      res.redirect('/')
    })
    .catch(err=>console.log(err))
  })
  .catch(err=>next(err))



})

router.get('/login', (req, res, next)=>{
  res.render('auth/login')
})

router.post('/login', (req, res, next)=>{
  const username = req.body.username
  const password = req.body.password

  if(username === "" || password === ""){
    res.render('auth/login', {
      errorMessage: 'Tienes que introducir un nombre de usuario y contraseña'
    })
    return
  }

  User.findOne({"username": username})
  .then(user=>{
    if(!user){
      res.render('auth/login',{
        errorMessage: `El usuario ${username} no existe!!!`
      })
      return
    }
    if(bcrypt.compareSync(password, user.password)){
      req.session.currentUser = user
      res.redirect('/main')
    }else{
      res.render('auth/login',{
        errorMessage: `La contraseña es mas que incorrecta`
      })
    }
  })
  .catch(err=>next(err))
})

router.get('/logout', (req,res,next)=>{
  req.session.destroy((err)=>{
    res.redirect('/login')
  })
})

module.exports = router;