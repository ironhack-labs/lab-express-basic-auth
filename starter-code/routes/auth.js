const router = require('express').Router()
const bcrypt = require('bcrypt')
const Usuario = require('../models/Usuario')

const saltRounds = 8

router.get('/crearCuenta', (req, res)=>{
res.render('auth/crearCuenta')
})

router.post('/crearCuenta', (req, res, next) => {
  const { username, password1, password2 } = req.body;
  if (username === '' || password1 === '' || password2 === '') {
    return res.render('auth/crearCuenta', {
      message: 'Llenar campos'
    })
  }  
 
    })



module.exports = router