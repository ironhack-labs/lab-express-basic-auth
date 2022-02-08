

const router = require("express").Router();
const bcryptjs = require('bcryptjs')
const User = require('./../models/User.model')
const saltRounds = 10

//sign-up form 
// render
router.get('/registro', (req, res, next) => res.render ('auth/signup-form')) 
//handle
router.post('/registro', (req, res, next) => {
const { username, password } = req.body

  bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
      console.log('la contraseña hasheada es', hashedPassword)
      return User.create({ username, passwordHash: hashedPassword })
    })
    .then(() => res.redirect('/'))
    .catch(error => next(error))

})

//log-in
//render
router.get('/inicio-sesion', (req, res, next) => res.render ('auth/login-form')) 
//handle
router.post('/inicio-sesion', (req, res, next) => {

  const { username, password } = req.body

  if (username.length === 0 || password.length === 0) {
    res.render('auth/login-form', { errorMessage: 'Please, fill in all the information' })
    return
  }

  User
    .findOne({username})
    .then(user => {
      if (!user) {
        res.render('auth/login-form', {errorMessage: 'the username does not exist' })
        return
      } else if (bcryptjs.compareSync(password, user.passwordHash) === false) {
        res.render('auth/login-form', { errorMessage: 'the password is incorrect' })
        return
      } else {
        req.session.currentUser = user
        //console.log('muestrame express session', req.session)
        res.redirect('/main')
      }
    })
    .catch(err => console.log(err))
})

//logout
//handle

router.post('/cerrar-sesion', (req, res) => {
  req.session.destroy(() => res.redirect('/inicio-sesion'))
})


 module.exports = router