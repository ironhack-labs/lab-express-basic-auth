const router = require("express").Router();
const mongoose = require("mongoose");

const bcrypt = require("bcrypt");

const User = require('./../models/User.model')




/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});


router.get("/sign-up", (req, res) => {
  //con render rederizamos paginas(dinamicas)
  res.render('auth/sign-up')
})





router.post("/sign-up", (req, res) => {
  const { username, pwd } = req.body
  // res.send( username + ' ' + unhashedPass)
  User
    .findOne({ username })
    .then(user => {
      if (user) {
        res.render('auth/sign-up', { errorMessage: 'Username already exists. Please choose a new username!' })
        return
      }
      if (!pwd) {
        res.render('auth/sign-up', { errorMessage: 'Dude! You need a password!' })
        return
      }


      // res.send(unhashedPass)

      const bcryptSalt = 10
      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hashPass = bcrypt.hashSync(pwd, salt)

      User
        .create({ username, password: hashPass })
        .then((user) => {
          // req.session.currentUser = user
          res.redirect('/')

        })
        .catch(err => console.log(err))


    })
    .catch(err => console.log(err))


})
// res.send(`locooo ${username}`)



router.get('/sign-in', (req, res) => {
  res.render('auth/sign-in')
  // res.send('ola')
})

router.post('/sign-in', (req, res) => {
  const { username, pwd } = req.body

  User
    .findOne({ username })
    .then(user => {
      if (!user) {
        res.render('auth/sign-in', { errorMessage: 'This username is not registered.' })
        return
      }

      if (bcrypt.compareSync(pwd, user.password) === false) {
        res.render('auth/sign-in', { errorMessage: 'Incorrect password.' })
        return
      }
      // res.send('funciona')
      req.session.currentUser = user
      res.redirect('/my-profile')
    })
    .catch(err => console.log(err))
})

router.use((req, res, next) => req.session.currentUser ? next() : res.render('auth/sign-in', { errorMessage: 'No authorized.' }))

// Protected routes
router.get('/my-profile', (req, res) => {
  // res.send('Dudeee!!!')
  const loggedInUser = req.session.currentUser
  res.render('user/my-profile', loggedInUser)
})

router.get('/main', (req, res) => {
  // res.send("cat")
  res.render('protected/main')
})

router.get('/private', (req, res) => {
  // res.send("cat")
  res.render('protected/private')
})






module.exports = router;



