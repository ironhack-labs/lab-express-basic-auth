const express = require('express');
const router = express.Router();
const User = require('../models/user')

const bcrypt         = require("bcrypt");
const bcryptSalt     = 10

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});


//Sign Up

router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  // const {username, password } = req.body;
  // console.log(req.body)

  if (username === '' || password === '') {
    
    res.render('/signup', {
      errorMessage: 'Please provide a username and password to Sign Up'
    });
    return;

  }

  User.findOne({ username: username })
    .then((user) => {
      if (user !== null) {
        res.render('/signup', {
          errorMessage: "The username already exists!",
        });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      User.create({
        username,
        password: hashPass
      })
        .then(() => {
          console.log(`username: ${username}`)
          console.log(`password: ${password}`)
          console.log(`hash: ${hashPass}`)

          res.redirect("/");
        })
        .catch(error => {
          console.log(error);
        });
    })
    .catch(error => console.log(error));
});

// LOGIN
router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post("/login", (req, res, next) => {
  const theUsername = req.body.username;
  const thePassword = req.body.password;

  if (theUsername === "" || thePassword === "") {
    res.render("/login", {
      errorMessage: "Please enter both, username and password to sign up."
    });
    return;
  }

  User.findOne({ "username": theUsername })
  .then(user => {
      if (!user) {
        res.render("/login", {
          errorMessage: "The username doesn't exist."
        });
        return;
      }
      if (bcrypt.compareSync(thePassword, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        console.log('success')
        res.redirect("/private");
      } else {
        res.render("/login", {
          errorMessage: "Incorrect password"
        });
      }
  })
  .catch(error => {
    next(error);
  })
});

//PAGES ROUTES

router.use((req, res, next) => {
  if (req.session.currentUser) { // <== if there's user in the session (user is logged in)
    next(); // ==> go to the next route ---
  } else {                          //    |
    res.redirect("/login");         //    |
  }                                 //    |
});

router.get('/private', (req, res, next) => {
  const {username} =req.session.currentUser
  res.render('private', {username});
});

router.get('/main', (req, res, next) => {
  const {username} = req.session.currentUser
  res.render('main', {username});
});


//LOGOUT
router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    // cannot access session here
    res.redirect("/login");
  });
});

module.exports = router;
