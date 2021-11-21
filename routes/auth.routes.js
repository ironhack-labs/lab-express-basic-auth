const router = require('express').Router();

// the setup code skipped
const bcryptjs = require('bcryptjs');
const saltRounds = 10;

// Require the Model to save the users in MongoDB
//The user model is the blueprint that will be used when new users are created
const User = require('../models/User.model');

// GET route ==> to display the signup form to users
router.get('/signup', async (req, res, next) => {
  try {
    res.render('auth/signup');
  } catch(error) {
      console.error(`Something wrong happened, please try again! ${error}`)
    next(error)
  }
});

// POST route ==> to process form data
router.post('/signup', async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    // console.log("The form data: ", req.body);
      
    const salt = await bcryptjs.genSalt(saltRounds);
    // hash the password received from the req.body
    const hashedPassword = await bcryptjs.hash(password, salt);
    const userFromDB = await User.create({
      username,
      email,
      // passwordHash => this is the key from the User model
      //     ^
      //     |            |--> this is placeholder (how we named returning value from the previous method (.hash()))
      passwordHash: hashedPassword
    });
    console.log('Newly created user is: ', userFromDB);
    res.redirect('/userProfile');
  } catch(error) {
    console.error(`Something wrong creating with the sign up! ${error}`)
    next(error)
  }
});



// router.post('/signup', (req, res, next) => {

//   const { username, email, password } = req.body;
   
//     bcryptjs
//       .genSalt(saltRounds)
//       .then(salt => bcryptjs.hash(password, salt))
//       .then(hashedPassword => {
//         return User.create({
//           // username: username
//           username,
//           email,
//           // passwordHash => this is the key from the User model
//           //     ^
//           //     |            |--> this is placeholder (how we named returning value from the previous method (.hash()))
//           passwordHash: hashedPassword
//         });
//       })
//       .then(userFromDB => {
//         console.log('Newly created user is: ', userFromDB);
//         res.redirect('/userProfile');
//       })
//       .catch(error => next(error));
//   });
  // GET route --> user profile, render user-profile.hbs
  router.get('/userProfile', (req, res) => res.render('users/user-profile'));


  module.exports = router;


