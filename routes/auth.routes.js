const User = require("../models/User.model");
const bcryptjs = require('bcryptjs')
const router = require("express").Router();
const saltRounds = 10
const { isLoggedIn, privateMustLogIn, isLoggedInTrue } = require('./../middleware/route-guard')

router.get("/register",isLoggedInTrue, (req, res, next) => {
  res.render("./auth/sign-up");
})

router.post("/register", (req, res, next) => {
  const { username, password } = req.body
  if (username.length === 0 || password.length === 0){
   res.render('./auth/sign-up', {message: 'Por favor rellena todos los campos'}) 
   return
 } if (username.length < 5){
   res.render('./auth/sign-up', {message: 'El nombre de usuario debe tener más de 5 caracteres'}) 
   return
 } if ( password.length < 8 ){
   res.render('./auth/sign-up', {message: 'La contraseña debe tener más de 8 caracteres'}) 
   return
 }
   bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPwd => 
      User.create({ username, password:hashedPwd }))
   .then(()=>res.render('./auth/successful-register'))
   .catch(err=>console.next(err))
})
   

  router.get("/login", isLoggedInTrue, (req, res, next) => {
    res.render('./auth/log-in')
    })

  router.post("/login", (req, res, next) => {
    const { username, password } = req.body
    if (username.length === 0 || password.length === 0){
      res.render('./auth/log-in', {message: 'Por favor rellena todos los campos'}) 
      return
    }
      User
      .findOne({username})
      .then(user=>{
       if (!user){
        res.render('./auth/log-in', {message: 'Usuario no registrado'}) 
       } else if (bcryptjs.compareSync(password,user.password) === false){
        res.render('./auth/log-in', {message: 'Contraseña incorrecta'}) 
        return
       } else {
         req.session.currentUser = user
         res.redirect('/perfil')
       }
      })
      .catch(err=>console.log(err))
    })

module.exports = router;
