const router = require("express").Router();
const bcrypt = require('bcrypt');
const User = require('./../models/User.model')
const app = require("../app")

/* Route home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

/* Route register page */
router.get('/register', (req, res)=>{
  res.render('register')
})

router.post('/register', (req, res)=>{
  const {username, password} = req.body
  const bcryptSalt = 10
  const salt = bcrypt.genSaltSync(bcryptSalt)
  const hashPass = bcrypt.hashSync(password, salt)

  User
    .create({username:username, password:hashPass})
    .then((user) => res.redirect('/login'))
    .catch(err => console.log(err))
})

/* Route login page */
router.get('/login', (req, res)=>{
  res.render('login')
})

router.post('/login', (req, res) => {

  const { username, password } = req.body

  User.findOne({ username })
    .then(user => {
      if (bcrypt.compareSync(password, user.password) === false) {
        res.render('auth/login-page', { errorMessage: 'Wrong password' })
        return
      } else {
        req.session.currentUser = user
        res.render('/profile')
      }
    })
})

/* Route profile */
router.get('/profile', (req, res)=>{
  res.render('profile')
})

module.exports = router;
