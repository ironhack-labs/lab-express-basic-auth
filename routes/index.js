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
    .then((user) => 
    //console.log(X)
    res.redirect('/login'))
    .catch(err => console.log(err))
})

/* Route login page */
router.get('/login', (req, res)=>{
  res.render('login')
})



// Jans code //

// routes/index.js
//const router = require("express").Router();
​
// create a middleware to check if the user is logged in
const loginCheck = () => {
  return (req, res, next) => {
    // is there a logged in user
    if (req.session.user) {
      // proceed as intended
      next();
    } else {
      // there is no user logged in
      // we redirect to /login
      res.redirect('/login');
    }
  }
}
​
/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});
​
router.get('/profile', loginCheck(), (req, res, next) => {
  // this is how you access a cookie
  console.log('this is the cookie: ', req.cookies)
  // this is how you can set a cookie
  res.cookie('myCookie', 'hello world');
  // this is how you delete a cookie
  res.clearCookie('myCookie');
  const loggedInUser = req.session.user
  res.render('profile', { user: loggedInUser });
});
​
// Jans code //








/* Route profile */
router.get('/profile', (req, res)=>{
  res.render('profile')
})

module.exports = router;
