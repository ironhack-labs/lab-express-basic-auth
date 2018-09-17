const express = require('express');
const router = express.Router();
const User = require('../models/user')

/*--------------------------------*/
const bcrypt = require("bcrypt");
const saltRounds = 10;

//const plainPassword1 = "HelloWorld";
//const plainPassword2 = "helloworld";
//
//const salt  = bcrypt.genSaltSync(saltRounds);
//const hash1 = bcrypt.hashSync(plainPassword1, salt);
//const hash2 = bcrypt.hashSync(plainPassword2, salt);
//
//console.log("Hash 1 -", hash1);
//console.log("Hash 2 -", hash2);
/*--------------------------------*/

router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/signup', (req, res, next) => {
  res.render('auth/signup')
})


router.post('/register', (req, res, next) => {
  const username = req.body.Username;
  const password = req.body.Password;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashPass = bcrypt.hashSync(password, salt);

  if (username === '' || password === '') {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ 'username': username })
    .then(user => {
      if (user !== null) {
        res.render("auth/signup", {
          errorMessage: "The username already exists"
        });
        return;
      }

      const newUser = new User({
        username: req.body.Username,
        password: hashPass
      });

      newUser.save()
        .then(() => {
          res.redirect('/login')
        })
    })
    .catch(err => next(err))
})


router.get('/login', (req, res, next) => {
  res.render('auth/login')
})

router.post('/login', (req, res, next) => {
  const username = req.body.Username;
  const password = req.body.Password;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashPass = bcrypt.hashSync(password, salt);

  if (username === '' || password === '') {
    res.render("auth/login", {
      errorMessage: "Indicate a username and a password to login"
    });
    return;
  }

  User.findOne({ 'username': username })
    .then(user => {
      if (!user) {
        res.render("auth/login", {
          errorMessage: "The username does not exists"
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect("/main");
      } else {
        res.render("auth/login", {
          errorMessage: "Incorrect password"
        })
      }
    })
    .catch(error => {
      next(error)
    })
});

router.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/login");
  }
});

router.get('/main', (req,res,next) => {
  res.render('private/main')
})

router.get('/userprivate', (req,res,next) => {
  res.render('private/userprivate')
})





module.exports = router;