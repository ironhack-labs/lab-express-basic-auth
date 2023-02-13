const router = require("express").Router();

const bcrypt = require('bcryptjs')

const User = require('../models/User.model')

const { isLoggedOut, isLoggedin } = require('../middlewares/route-guard')



const saltRounds = 5

require('../db/index')

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/auth/sign-up-form", isLoggedOut, (req, res) => {
  res.render('./auth/sign-up-form')
})

router.post("/auth/sign-up-form", (req, res) => {
  const { username, password } = req.body

  bcrypt
    .genSalt(saltRounds)
    .then(salt => bcrypt.hash(password, salt))
    .then(passwordHash => (User.create({ username, password: passwordHash })))
    .then(user => res.redirect('/'))
    .catch(error => console.log(error))

})

router.get("/auth/login-form", isLoggedOut, (req, res) =>
  res.render('./auth/login-form'))



router.post("/auth/login-form", (req, res) => {
  const { username, password } = req.body
  // res.send(req.body)

  if (!username.length || !password.length) {
    res.render('./auth/login-form', { errorMessage: 'Please fill all the fields' })
    return
  }

  User
    .findOne({ username })
    .then(user => {
      if (!user) {
        res.render('auth/login-form', { errorMessage: ' The users doesnt exists' })
      }
      else if (!bcrypt.compareSync(password, user.password)) {
        res.render('auth/login-form', { errorMessage: 'Password Incorrect' })
      }
      else {
        req.session.currentUser = user
        console.log('---------------------------------', req.session)
        res.redirect('/')
      }

    })

})

router.get('/logout', isLoggedin, (req, res) =>
  req.session.destroy(() => res.redirect('/')))


router.get('/private', isLoggedin, (req, res) => {
  res.render('private')
})

router.get('/main', isLoggedin, (req, res) => {
  res.render('main')
})

module.exports = router;
