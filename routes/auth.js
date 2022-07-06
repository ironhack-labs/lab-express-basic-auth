const {Router} = require("express")
const router = new Router();

const bcryptjs = require('bcryptjs');
const UserModel = require('../models/User.model');
const User = require("../models/User.model");
const saltRounds = 10;

//get the user’s details
router.get('/userProfile', (req, res) =>{
  res.render('user/user-profile', {userInSession: req.session.currentUser})
});

/* GET home page */
router.get("/signup", (req, res) => res.render("auth/signup"));

//display the login form to users
router.get ('/login', (req, res) => res.render('auth/login'));

//POST route
router.post('/signup', (req, res, next) =>{
  const { username, password } = req.body;

  bcryptjs
  .genSalt(saltRounds)
  .then((salt) => bcryptjs.hash(password, salt))
  .then(hashedPassword => {
    console.log(`Password hash: ${hashedPassword}`);
    UserModel.create({
      username,
      password: hashedPassword
    });
  })
  .then((createdUser) =>{
    console.log('Newly created user:', createdUser)
    res.redirect('/')
  })
  .catch(error => next (error));
});



// POST route ==> to process form data
router.post('/login', (req, res, next) => {
  const { username, password } = req.body;
 
  if (username === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Please enter both, username and password to login.'
    });
    return;
  }
 
  User.findOne({ email }) // <== check if there's user with the provided email
    .then(user => {
      // <== "user" here is just a placeholder and represents the response from the DB
      if (!user) {
        res.render('auth/login', {
          errorMessage: 'Username is not registered. Try with other username.'
        });
        return;
      }
      else if (bcryptjs.compareSync(password, user.passwordHash)) {
        res.render('users/user-profile', { user });
      } else {
        res.render('auth/login', { errorMessage: 'Incorrect password.' });
      }
    })
    .catch(error => next(error));
});


  router.post('/login', (req, res, next) => {
    console.log('SESSION =====> ', req.session);
  });

router.get('userProfile', (req, res) => res.render('users/user-profile'));

module.exports = router;
