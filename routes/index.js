const router = require("express").Router();

//For password Decryption
const bcryptjs = require("bcrypt");
const saltRounds = 10;

//import user model
const User = require("../models/User.model");

//User Profile
router.get('/userProfile', (req, res) => {
  res.render('users/userProfile', { userInSession: req.session.currentUser });
});

// GET route ==> to display the signup form to users
router.get("/signup", (req, res) => res.render("auth/signup"));


// POST route ==> to process form data
router.post("/signup", (req, res, next) => {


  const { username, email, password } = req.body; //get data from form

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({
        // username: username
        username,
        email,
        password: hashedPassword
      });
    })
    .then((user) => {
      // console.log("Newly created user is: ", user);
      res.redirect('/signin');
    })
    .catch((error) => next(error));
});

// GET route ==> to display the login form to users
router.get('/signin', (req, res) => res.render('auth/signin'));

// POST login route ==> to process form data
router.post('/signin', (req, res, next) => {
  const { email, password } = req.body;
 
  if (email === '' || password === '') {
    res.render('auth/signin', {
      errorMessage: 'Please enter both, email and password to login.'
    });
    return;
  }
 
  User.findOne({ email })
    .then(user => {
      if (!user) {
        res.render('auth/signin', { errorMessage: 'Email is not registered. Try with other email.' });
        return;
      } else if (bcryptjs.compareSync(password, user.password)) {
      //SAVE THE USER IN THE SESSION 
        req.session.currentUser = user;
        res.redirect('/userProfile');
      } else {
        res.render('auth/signin', { errorMessage: 'Incorrect password.' });
      }
    })
    .catch(error => next(error));
});

//logout route
router.post('/logout', (req, res, next) => {
  req.session.destroy(err => {
    if (err) next(err);
    res.redirect('/');
  });
});



/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

module.exports = router;
