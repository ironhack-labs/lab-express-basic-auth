const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require('bcryptjs')


//const salt = await bcrypt.genSalt()
//const hash = await bcrypt.hash('ironhack', salt)
/* GET home page */
router.get("/", (req, res, next) => {
  console.log("req", req.session)
  res.render("index",{
    user: req.session.usuario,
    rol: req.session.rol
  })
});

//Route --> /user/register
router.get('/user/register', (req, res) => {
  res.render("registry")
})
//Route to get formularie data
router.post('/user/new', (req, res) => {
  console.log('The user is:', req.body.user)
  console.log('The password:', req.body.password)
  const { user, password} = req.body

//Security lock:
  if( user.length < 4 || password.length < 4) {
    console.log('Less than 4')
    res.render('registry', {dataError: true})
    //res.redirect('/user/register')
   return 
  }

  //Step to encrypt password:
  bcrypt.genSalt(10)
  .then(result => {
    console.log(result)
    bcrypt.hash('password', result)
    .then(hash => {
      console.log('HASH:', hash)
      //Create user in the database:
      User.create({user, password: hash})
      .then((newUser) => {
        console.log(newUser)
        res.send('<h2>User created...</h2>')
      }).catch(console.log)
    })
  }).catch(console.log)
})

//Route to show the login form:
router.get('/user/login', (req, res) => {
  res.render("login")
})

//Route to obtain form data
router.post('/user/login', (req, res) => {
  const {user, password} = req.body
  User.findOne({user})
  .then( result => {
    console.log('password form:', password)
    console.log('password db:', result.password)

    //compare passwords with bcrypt
    bcrypt.compare(password, result.password)
    .then(verification => {

      //Add data to the response:
      req.session.user = result.user
      req.session.something = true
      console.log(verification)
      res.redirect('/user/private')
    })
    .catch(console.log)

  })
  .catch(console.log)
})

function checkSession(req, res, next) {
  console.log("verifying session")
  console.log(req.session)
  if(req.session.user){
    next()
  } else {
    res.redirect("/user/login")
  }
}

router.get("/user/private", checkSession, (req, res) => {
  res.render("private", {
    user: req.session.user, 
    //rol: res.session.rol
  })
})

router.get("/user/sign-out", (req, res) => {
  req.session.destroy()
  res.redirect("/")
})

module.exports = router;
