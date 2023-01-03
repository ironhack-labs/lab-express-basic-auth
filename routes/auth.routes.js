const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const saltRounds = 10;

const User = require('../models/User.model');

const { isLoggedIn, isLoggedOut} = require('../middleware/route-guard');


// GET SignUp
router.get("/signup", isLoggedOut, (req, res) => {
    res.render("auth/signup", { loggedIn: false });
  });

// POST SignUp
router.post("/signup", isLoggedOut, async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username and password.' });
        return;
    }

    const passwordHash = await bcrypt.hash(password, saltRounds);
  
    User.create({username, password: passwordHash})
        .then(newUser => res.redirect(`/auth/profile/${newUser.username}`))
        .catch(err => console.log(err))
})

// Profile route
router.get("/profile", isLoggedIn, (req, res) => {
    // console.log('currentUser:', req.session.currentUser);
    const { currentUser } = req.session;
    currentUser.loggedIn = true;
    res.render("auth/profile", currentUser)

})



// Get Login 
router.get("/login", isLoggedOut, (req, res) => {
    console.log('SESSION =====> ', req.session);
    res.render("auth/login", { loggedIn: false })
})

// Post Login
router.post("/login", isLoggedOut, (req, res) => {
    console.log('SESSION =====> ', req.session);
    const { username, password } = req.body;
 
//    Data validation check 
  if (username === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Please enter both, username and password to login.'
    });
    return;
  }


  User.findOne({ username })
    .then(user => { // --> { username: '', email: '', password: ''} || null
        console.log('user', user)
      if (!user) { // if user is not found in the DB
        res.render('auth/login', { errorMessage: 'Username is not registered. Try with other email.' });
        return;
      } else if (bcrypt.compareSync(password, user.password)) { // if password is correct
        // res.redirect(`/auth/profile/${user.username}`)
        // res.render('auth/profile', user);
        const { username } = user;
        req.session.currentUser = { username }; // creating the property currentUser 
        res.redirect('/auth/profile')
        
      } else { // if password is incorect
        res.render('auth/login', { errorMessage: 'Incorrect password.' });
      }
    })
    .catch(error => console.log(error));
})



// main route
router.get("/main", isLoggedIn, (req, res) => {
    console.log('currentUser:', req.session.currentUser);

const { currentUser } = req.session;
currentUser.loggedIn = true;
res.render("auth/main")
})

// private route
router.get("/private", isLoggedIn, (req, res) => {
console.log('currentUser:', req.session.currentUser);

const { currentUser } = req.session;
currentUser.loggedIn = true;
res.render("auth/private")
})


// LOGOUT route
router.post('/logout', isLoggedIn, (req, res) => {
    req.session.destroy(err => {
      if (err) console.log(err);
      res.redirect('/');
    });
  });


module.exports = router;