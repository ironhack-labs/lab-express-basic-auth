const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt');

const bcryptSalt=10;

const User=require('../models/user');

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

/* GET signup page */
router.get('/signup', (req, res, next) => {
  res.render('signup');
});

/* POST on signup page */

router.post('/signup', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  if (username === "" || password === "") {
    res.render("signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": username })
    .then(user => {
      if (user !== null) {
        res.render("signup", {
          errorMessage: "The username already exists!"
        });
        return;
      }

      const newUser = User({
        username,
        password: hashPass
      });

      newUser.save().then(() => {
        res.redirect("/");
      })

    })
  })

/* GET login page */
router.get('/login', (req, res, next) => {
  res.render('login');
});

/* POST on login page */
  
router.post("/login", (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username === "" || password === "") {
      res.render("login", {
        errorMessage: "Indicate a username and a password to sign up"
      });
      return;
    }
    //find the user from db
    User.findOne({ "username": username })
    .then(user => {
        if (/*err || */!user) {
          res.render("login", {
            errorMessage: "The username doesn't exist"
          });
          return;
        }
        if (bcrypt.compareSync(password, user.password)) {
          // Save the login in the session!
          req.session.currentUser = user;
          res.redirect("/");
        } else {
          res.render("login", {
            errorMessage: "Incorrect password"
          });
        }
    })
    .catch(error => {
      next(error)
    })
  });

  // redirect if not logged in
  router.use((req, res, next) => {
    if (req.session.currentUser) {
      next();
    } else {
      res.redirect("/login");
    }
  });

  // protected routes
  router.get('/main', (req,res) => {
    res.render('main')
  })

// protected routes
  router.get('/private', (req,res) => {
  res.render('private')
})



module.exports = router;
