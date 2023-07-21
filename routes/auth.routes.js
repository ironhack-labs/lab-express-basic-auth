// routes/auth.js

const express = require('express');
const router = express.Router();
const user = require('../models/User.model');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

// Route for displaying the signup form
router.get('/signup', (req, res) => {
  res.render('signup'); 
});

// Route for handling user signup
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  bcryptjs
  .genSalt(saltRounds)
  .then(salt => bcryptjs.hash(password, salt))
  .then((hashedPassword) => {
    return User.create({
      // username: username
      username,
      password,
//   console.log(email, " ", password))
//   res.send({email,password})
})
  })
//   try {
//     // Check if the username already exists in the database
//     const existingUser = await User.findOne({ username });
//     if (existingUser) {
//       return res.render('signup', { error: 'Username already taken.' });
//     }

    //hash the password using bcrypt

//   .genSalt(saltRounds)
//         .then(salt => bcrypt.hash(password, salt))
//         .then(hashedPassword => {
    // Create a new user with the provided username and password
    // const newUser = new User({ username, password });
    // return newUser.save();}

    .then(() => {
        res.redirect('/login');
   // Redirect to the login page after successful signup
  }) 
  .catch ((error) => {
    console.log(error)

    res.render('signup', { error: 'An error occurred during signup. Please try again.' })
  
});
//   }}

//   router.get('/userProfile', (req,res) =>res.render('users/user-profile')))
//   .then(userFromDB => {
//     res.redirect('/userProfile');
})
module.exports = router;
