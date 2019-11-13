const express = require('express');
const router  = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.post('/signup', (req, res, next) => {
  console.log("success1");
  const {username, password} = req.body;
  if (!username || !password) {
    res.render("signup.hbs", { message: "Username or pw can't be empty" });
    return;
  }
  User.findOne({username})
    .then(found => {
      if(found) {
        res.render('signup', {
          message: "username already taken"
        });
        return;
      }

      bcrypt
        .genSalt()
        .then(salt => {
          return bcrypt.hash(password, salt);
        })
        .then(hash => {
          return User.create({username, password: hash});
        })
        .then(newUser => {
          console.log("user singed up");
          //req.session.user = newUser;
          res.redirect("/");
        })
    })
    .catch(err => {
      next(err);
    });
})

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post('/login', (req, res, next) => {
  const {username, password} = req.body;
  //check if username & pw in db
  User.findOne({username})
    .then(found => {
      if(!found) {
        res.render("login.hbs", {
          message: "Invalid credentials"
        });
        return;
      }
      bcrypt
        .compare(password, found.password)
        .then(bool => {
          //login fails:
          if (bool === false) {
              res.render("login.hbs", {
                  message: "Invalid credentials"
              });
              return;
          }
          //login works:
          req.session.user = found; 
          res.redirect("/");
        });
    })
});

//middleware to check if user is logged in
const loginCheck = () => {
  return (req, res, next) => {
    if (req.session.user) {
      next();
    }
    else {
      res.redirect("/");
    }
  };
};

router.get('/main', loginCheck(), (req, res, next) => {
  res.render('main');
});

router.get('/private', loginCheck(), (req, res, next) => {
  res.render('private');
});

module.exports = router;
