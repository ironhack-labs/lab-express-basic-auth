// IMPORTACIONES
const express       = require('express')
const router        = express.Router()
const bcrypt        = require('bcrypt')
const User          = require('../models/User.model.js')
const saltRounds    = 10

// GET Formulario Signup
router.get('/signup', (req, res) => res.render('auth/signup'));
// POST Formulario enviado al backend
router.post('/signup', (req,res,next) => {
  const { username, email, password } = req.body;
  // VALIDACIÓN DE QUE LOS INPUTS ESTÉN LLENOS Y NO VACÍOS
  if( !username || !email || !password) {
    res.render('auth/signup', {errorMessage: "Todos los campos son obligatorios"})
    return 
  }
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if(!regex.test(password)) {
    res.status(500).render('auth/signup', {errorMessage: 'El password debe de cumplir con más de 6 caracteres, contener al menos un número, una minúscula y una mayúscula.'})
  }
  // AUTENTICACIÓN
    bcrypt
    .genSalt(saltRounds)
    .then((salt) => {
        return bcrypt.hash(password, salt)
    })
    .then((hashedPassword) => {
      return User.create({
        username: username,
        email: email,
        passwordHash: hashedPassword
      })
    })
    .then((usuario) => {
      console.log(usuario)
      res.redirect('/userProfile')
    })
    .catch((error) => {
      // VALIDACIÓN DE CORREO ELECTRÓNICO
          if(error instanceof mongoose.Error.ValidationError) {
            res.status(500).render('auth/signup', {errorMessage: 'El correo electrónico no tiene el formato adecuado'})
          } else if (error.code === 11000) {
            // VALIDACIÓN DE UNICIDAD
            res.status(500).render('auth/signup', {
              errorMessage: 'El usuario y el correo deben ser únicos. Puede que el usuario o el correo que insertaste ya están siendo usados.'
            })
          } else { // ERROR DE CUALQUIER TIPO
            next(error) 
          }
    })
})
//  GET Formulario Login
router.get('/login', (req, res, next) => {
  res.render("auth/login")
})

router.post('/login', (req, res, next) => {
    const { email, password } = req.body;
    console.log('SESSION =====> ', req.session);
   
    if (email === '' || password === '') {
      res.render('auth/login', {
        errorMessage: 'Please enter both, email and password to login.'
      });
      return;
    }
   
    User.findOne({ email })
      .then(user => {
        if (!user) {
          res.render('auth/login', { errorMessage: 'Email is not registered. Try with other email.' });
          return;
        } else if (bcrypt.compareSync(password, user.passwordHash)) {
            req.session.currentUser = user; 
          res.render('users/user-profile', { user });
        } else {
          res.render('auth/login', { errorMessage: 'Incorrect password.' });
        }
      })
      .catch(error => next(error));
  });
   

// GET Perfil del usuario
router.get('/userProfile',(req,res)=>{
    res.render('users/user-profile', { userInSession: req.session.currentUser })
})

module.exports = router;