const router = require("express").Router()
const bcryptjs = require('bcryptjs')

const User = require('./../models/User.model')
const saltRounds = 10

router.get('/registro', (req, res, next) => res.render("auth/signup-form"))

router.post('/registro', (req, res, next)=>{

    const {username, userPwd} = req.body

    if (username.length === 0 || userPwd === 0) {
        res.render('auth/signup-form', { errorMessage: 'Por favor, rellena todos los campos, no pueden estar vacíos' })
        return
    }

    User
        .findOne({ username })
        .then(user => {
            if (user) {
                res.render('auth/signup-form', { errorMessage: 'Username ya registrado en la Base de datos, por favor, elija otro username' })
                return
            } else {
                req.session.currentUser = user
                res.redirect('/inicio-sesion')
            }
        })

    bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(userPwd, salt))
    .then(hashedPassword =>{
        return User.create({username, password:hashedPassword})
    })
    .then(createdUser =>res.redirect('/'))
    .catch(error => next(error))
})


router.get('/inicio-sesion', (req, res, next) =>{
    res.render('auth/login-form')
})


router.post('/inicio-sesion', (req, res, next)=>{

    const {username, userPwd} = req.body

    if (username.length === 0 || userPwd === 0){
        res.render('auth/login-form', {errorMessage:'Por favor, rellena todos los campos'})
        return
    }

    User
    .findOne({username})
    .then(user =>{
      if(!user){
          res.render('auth/login-form', {errorMessage: 'Username no registrado en la Base de datos'})
          return
      }else{
          req.session.currentUser = user
          res.redirect('/perfil')
      }  
    })
})


router.post('/cerrar-sesion', (req, res) => {
    req.session.destroy(() => res.redirect('/inicio-sesion'))
})

module.exports = router