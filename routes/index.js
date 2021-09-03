const router = require("express").Router();
const bcrypt = require('bcrypt')
const User = require ('../models/User.model')

router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/registro', (req, res) =>{
  res.render('auth/signup-form')
});

router.post('/registro', (req, res) =>{

  const {username, userPwd} = req.body

  if(userPwd.length === 0) {
    res.render('auth/signup-form', {errorMsg : 'Tonto la contraseña es obligatoria'})
    return
  }

  User 
  .findOne({username})
  .then( user=>{

    if(user) {
      res.render('auth/signup-form', {errorMsg : 'Tonto ya estas registrado'})
      return 
    }

    const bcryptSalt = 10
    const salt = bcrypt.genSaltSync(bcryptSalt)
    const hashPass = bcrypt.hashSync(userPwd, salt)  

    User
      .create({username, password: hashPass }) 
      .then(() => res.redirect('/'))
      .catch(err => console.log(err))
    })
    .catch(err => console.log(err))

});

router.get('/iniciar-sesion', (req, res) => {
  res.render('auth/login-form')
});

router.post('/iniciar-sesion', (req, res) => {

  const {username, userPwd} = req.body

  if(userPwd.length === 0 || username.length ===0) {
    res.render('auth/login-form', {errorMsg: 'Rellena los campos TOLAI'})
    return
  }

  User
  .findOne({username})
  .then(user => {

    if(!user){
      res.render('auth/login-form', {errorMsg: 'No estas registrado ATONTADO'})
      return
    }

    if (bcrypt.compareSync(userPwd, user.password) === false) {
      res.render('auth/login-form', { errorMsg: 'Contraseña incorrecta' })
      return
    }

    req.session.currentUser = user
    res.redirect('/perfil')

  })

  .catch(err => console.log(err))
})

router.use((req, res, next) =>{
  req.session.currentUser ? next() : res.render('auth/login-form', {errorMsg: 'Ya no estas autorizado por BOBO'})
})

router.get('/perfil', (req, res) => {
  res.render('user/profile', {user: req.session.currentUser})
})

module.exports = router;
