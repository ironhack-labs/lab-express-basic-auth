const User = require("../models/User.model");
const bcryptjs = require('bcrypt');
const saltRounds = 10;
const router = require("express").Router();
const { isLoggedIn, isLoggedOut } = require('../middlewares/route-guard.js');


/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});
/* GET signup page */
router.get("/signup", isLoggedOut, (req, res, next) => {
  console.log('req.session', req.session)
  res.render("auth/signup");
});

router.post('/signup', isLoggedOut, (req, res, next) => {
    // console.log("The form data: ", req.body);
  const { username, email, password } = req.body;
  
  bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
      return User.create({
        username: username, 
        email: email, 
        passwordHash: hashedPassword
      });
    })
    .then(userFromDB => {
      res.redirect('/usersProfile');
      console.log(userFromDB, `this is the new user`)
    })
    .catch(error => next(error));
});

router.get('/usersProfile', (req, res) => res.render('users/user-profile'));

router.get('/login', isLoggedOut, (req, res)=>{
  res.render('auth/login')
})

router.post('/login', isLoggedOut, (req, res)=>{
  const { email, password } = req.body;
 
  if (email === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Please enter both, email and password to login.'
    });
    return;
  }

  User.findOne({ email })
  .then(user => {
    console.log('user', user)
    if (!user) {
     
      console.log("Email not registered. ");
      res.render('auth/login', { errorMessage: 'User not found and/or incorrect password.' });
      return;
    } 
    else if (bcryptjs.compareSync(password, user.passwordHash)) {
      req.session.currentUser = user;
      res.render('users/user-profile', { user });
    }
    else {
      console.log("Incorrect password. ");
      res.render('auth/login', { errorMessage: 'User not found and/or incorrect password.' });
    }
  })
  .catch(error => next(error));
})

router.get('/main', isLoggedIn, (req, res) => {
  res.render('main', { user: req.session.currentUser });
});

router.get('/private', isLoggedIn, (req, res) => {
  res.render('private', { user: req.session.currentUser });
});

module.exports = router;
