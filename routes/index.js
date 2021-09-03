const router = require("express").Router();
const bcrypt = require("bcrypt")
const User = require("../models/User.model");


router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/register', (req, res) => {
  res.render('signup')
})

router.post('/register', (req, res) => {
  const { username, password } = req.body

  if(password.length === 0){
    res.render('signup', {errorMsg: 'Password is required Melón'})
    return
  }

  if (username.length === 0 ){
    res.render('signup', {errorMsg: 'USERNAME REQUIRED ALBONDIGUILLE'})
  }

  User
    .findOne({ username })
    .then(user =>{
      if (user){
        res.render('signup', { errorMsg: 'User already exists Watermelon'})
        return
      }

      const bcryptSalt = 10
      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hashPass = bcrypt.hashSync(password, salt)

      User
        .create({username, password: hashPass})
        .then(() => res.redirect('/'))
        .catch((err) => console.log(err))
    })
    .catch((err) => console.log(err))
})


router.get('/login', (req, res) => {
  res.render('login')
} )

router.post('/login', (req, res) => {
  const { username, password } = req.body
  console.log('username y password son '+ username + password)
  if(password.length === 0 || username.length === 0){
    res.render('login', {errorMsg: 'Complete all the fields Strawberry'})
    return
  }

  User
    .findOne({username})
    .then(user => {
      if (!user) {
        res.render('login', {errorMsg: 'Who are you pineapple?'})
        return
      }

      if (!bcrypt.compareSync(password, user.password)){
        res.render('login', {errorMsg: 'Invalid password potato'})
        return
      }
      console.log(req.session)
      req.session.currentUser = user
      res.redirect('/')               // CAMBIAR DESPUÉS
      
    })
    .catch((err) => console.log(err))


})

router.use((req, res, next) => {
  req.session.currentUser ? next() : res.render('login'), {errorMsg: 'Desauthorized Artishok'}
})

router.get('/main', (req, res) => {
  res.render('main', req.session)
})
router.get('/private', (req, res) => {
  res.render('private')
})






module.exports = router;
