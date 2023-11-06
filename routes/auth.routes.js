const express = require('express')
const router = express.Router()

const User = require('../models/User.model')

const bcrypt = require('bcryptjs')
const saltRounds = 10



router.get('/registro',(req,res) => {
    res.render("auth/signup")
})


router.post('/registro', (req, res, next) => {
  //  console.log('----------------------------------------------------los datos son ', req.body)
    const {name, email, password} = req.body
  // console.log("-------------------------------------",req.body)

   bcrypt

   .genSalt(saltRounds)
   .then (salt => bcrypt.hash(password, salt))
   .then (hashedPassword =>  User.create({ name, email, password: hashedPassword }))
   .then(() => res.redirect('/inicio-sesion'))
   .catch(err => next(err))
})



router.get('/inicio-sesion', (req, res) =>{
    res.render('auth/login')
})

router.post('/inicio-sesion', (req, res, next) => {
    //res.send (req.body )
      const { email, password } = req.body
      if(email.length === 0 || password === 0) {
        res.render ('auth/login', { errorMessage: 'Rellena todo bby!'})
        return
      }

      User
      .findOne({email})
      .then(usuarito => {
        
        if(!usuarito) {
            res.render('auth/login', { errorMessage : 'Este email te lo has inventado' })
            return
        }
        if (bcrypt.compareSync(password, usuarito.password) === false) {
            res.render('auth/login', {errorMessage : 'MAAAAAL! :( contraseña incorrecta' })
            return
        }
         req.session.currentUser = usuarito
        console.log('sesion iniciada : ', req.session)
         res.redirect('/')
      })
      .catch(err => next(err))
})











module.exports = router