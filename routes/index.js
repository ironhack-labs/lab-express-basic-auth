const router = require("express").Router();
const bcrypt = require('bcrypt')
const User = require('./../models/User.model')

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

// SIGNUP
router.get('/signup', (req, res) => res.render('auth/signup'))

router.post('/signup', (req, res) => {
  
  const {userName, pwd} = req.body

  User
    .findOne({ userName })
    .then( (user) => {

      if( userName.length * pwd.length === 0 ){
        res.render('auth/login',{errorMessage: `Fill in the empty fields.`})
        return
      }

      if( user ){
        res.render('auth/signup',{errorMessage: `The username ${userName} is not available.`})
        // console.log(`The username ${user[0].userName} is not available.`)
        return
      }

      const bcryptSalt = 10
      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hashedPassword = bcrypt.hashSync(pwd, salt)
    
      User
        .create({userName, password: hashedPassword})
        .then( () => res.redirect('/'))
        .catch( err => console.log(`OLD ERR: Creating new user returned an error: ${err}`))
    })
    .catch( err => console.log(`NEW ERR: Creating new user returned an error: ${err}`))

})
 
// LOGIN
router.get('/login', (req, res) => res.render('auth/login'))

router.post('/login', (req, res) => {
  
  const {userName, pwd} = req.body

  User
    .findOne({ userName })
    .then( (user) => {

      if( userName.length * pwd.length === 0 ){
        res.render('auth/login',{errorMessage: `Fill in the empty fields.`})
        return
      }

      if( !user ){
        res.render('auth/login',{errorMessage: `The username ${userName} is not available.`})
        return
      }

      if( bcrypt.compareSync(pwd, user.password) === false ){
        res.render('auth/login',{errorMessage: `The password is incorrect.`})
        return
      }

      req.session.currentUser = user
      // res.send(req.session)
      res.redirect('/my-profile')
    })
  })

// LOGOUT
router.get('/logout', (req, res) => {
  req.session.destroy( () => res.redirect('/'))
})

// Authorization middleware
router.use((req, res, next) => req.session.currentUser ? next() : res.render( 'auth/login', {errorMessage: 'You are not authorized to access My profile.'}))

// Protected routes
router.get('/main', (req, res) => {
  res.render('user/main')
})

router.get('/private', (req, res) => {
  res.render('user/private')
})

// MY PROFILE
router.get('/my-profile', (req, res) => {
  const loggedUser = req.session.currentUser
  res.render('user/user-profile', loggedUser)
})
 


  
module.exports = router;
