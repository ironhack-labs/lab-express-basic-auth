const express     = require("express");
const router      = express.Router();
const bcrypt      = require("bcrypt");
const User        = require("../models/user");

const bcryptSalt  = 10;

router.get('/', (req, res, next) => {
  res.render("index");
});

router.get('/signup', (req, res, next) => {
  res.render("auth/signup");
});

router.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if(username === '' || password === '') {
    res.render("auth/signup", {
      errorMessage: 'Indicate a username and a password to sign up.'
    });
    return;
  }

  User.findOne({ "username": username }, "username", (err, user) => {

    console.log(user);
    if(user !== null) {
      res.render("auth/signup", {
        errorMessage: 'The username already exists.'
      });
      return;
    }

    var salt = bcrypt.genSaltSync(bcryptSalt);
    var hashPass = bcrypt.hashSync(password, salt);

    var newUser = User({
      username: username,
      password: hashPass
    });

    newUser.save((err) => {
      res.redirect("/");
    });
  });
});

router.get('/login', (req, res, next) =>{
  res.render('auth/login');
})

router.post('/login', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username == '' || password == '') {
    return res.render('auth/login', {
      errorMessage: 'Indicate a username and a password to log in',
    })
  }

  User.findOne( { username: username }, (err, user ) => {
    if (err || !user) {
      res.render("auth/login", {
        errorMessage: "The username doesn't exist"
      });
      return;
    }

    if ( bcrypt.compareSync( password, user.password ) ) {
      req.session.currentUser = user;
      res.redirect('/');
    } else {
      res.render('auth/login', {
        errorMessage: 'Incorrect password',
      })
    }

  })
})

router.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/login");
  }
});

router.get('/secret', (req, res, next) =>{
  res.render('secret', {user: req.session.currentUser.username});
})

router.get('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect('/login');
  })
})

module.exports = router;
