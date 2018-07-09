const express = require('express')
const router  = express.Router()
const bcrypt = require('bcrypt');

const User = require('../models/User.js')

router.get('/', (req, res, next) => {
  res.render('login/login', {title: 'Login'})
})

router.post('/',(req,res,next)=> {
  const {username, password} = req.body

  let passCheck = new Promise ((resolve,reject) => {
    if(username ===''|| password ==='') {
      return reject(new Error ("Both, username and password must be filled"))
    }
    resolve()
  })
  .then (
    User.findOne({username})
    .then(user =>{
      if (!user ) throw new Error("User does't exist in the database")

      if (!bcrypt.compareSync (password,user.password)) throw new Error("Incorrect password")
      req.session.currentUser= user;
      res.redirect ('/')
    })
    .catch  (e =>{
      res.render ('login/login',{errorMessage: e.message})
    })
    .catch  (e =>{
      res.render ('login/login',{errorMessage: e.message})
    })
  )
})

module.exports = router
