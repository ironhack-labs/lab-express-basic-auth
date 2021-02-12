const router = require("express").Router();
const User = require('../models/User.model');
const bcrypt = require('bcrypt');

// signup
router.get("/signup", (req, res, next) => {
  res.render("signup");
});

// login
router.get("/login", (req, res, next) => {
  res.render("login");
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  // check if we have a user with the entered username
  User.findOne({ username: username })
    .then(userFromDB => {
      if (userFromDB === null) {
        // if not we show login again
        res.render('login', { message: 'Invalid credentials' });
        return;
      }
      // if username is existing then we want to check the password
      if (bcrypt.compareSync(password, userFromDB.password)) {
        // password and hash match
        // now we want to log the user in
        req.session.user = userFromDB;
        res.redirect('/main');
      } else {
        res.render('login', { message: 'Invalid credentials' });
      }
    })

})
const loginCheck = () => {
  return (req, res, next) => {
    // if user is logged in proceed to the next step
    if (req.session.user) {
      next();
    } else {
      // otherwise redirect to /login
      const message = 'Please login to continue'
      res.redirect('/login', {message});
    }
  }
}

router.get('/main', loginCheck(), (req, res) => {
  res.render('main')
})

router.get('/private', loginCheck(), (req, res) => {
  res.render('private')
})

// the signup form posts to this route
router.post('/signup', (req, res) => {
  // get username and password
  const { username, password } = req.body;
  console.log(username, password);
  // is the password longer than 8 chars and the username not empty
  if (password.length < 8) {
    // if not show the signup again with a message
    return res.render('signup', { message: 'Your password has to be 8 chars min' });

  }
  if (username === '') {
    res.render('signup', { message: 'Your username cannot be empty' });
    return
  }
  // check if the username already exists
  User.findOne({ username: username })
    .then(userFromDB => {
      if (userFromDB !== null) {
        // if yes show the signup again with a message
        res.render('signup', { message: 'Username is already taken' });
      } else {
        // all validation passed - > we can create a new user in the database with a hashed password
        // create salt and hash
        const salt = bcrypt.genSaltSync();
        const hash = bcrypt.hashSync(password, salt)
        // create the user in the db
        User.create({ username: username, password: hash })
          .then(userFromDB => {
            console.log(userFromDB);
            // then redirect to login
            res.redirect('/');
          })
      }
    })
    .catch(err => {
      console.log(err);
    })
})

router.get('/logout', (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  })
})

module.exports = router;