const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const router = express.Router();

router.get("/signup", (req, res) => {
  res.render("signup.hbs");
});

// authenticate
router.get("/login", (req, res) => {
    res.render("login.hbs");
  });
   // Logging in: are username and pw correct?
router.post('/login', (req, res, next) => {
    const {username, password} = req.body;
    User.findOne({ username: username})
    .then(found => {
        if (!found) {
            res.render('login.hbs', {message: 'invalid creds'});
            return;
        }
        // compare input to salt
        return bcrypt.compare(password, found.password)
        .then(bool => {
            if (bool === false) {
                res.render('login.hbs', {
                    message: 'invalid creds'});
                    return;
            } // logs in when successful
            req.session.user = found;
            res.redirect('/');
        })
    }).catch(err => {
        next(err)
    })
})


// req.session.user = found;

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;

  if (!username) {
    res.render("signup.hbs", { message: "Username can't be empty" });
    return;
  }
  if (password.length < 8) {
    res.render("signup.hbs", {
      message: "Must include password of 8 or more characters"
    });
    return;
  }
  User.findOne({ username: username }).then(found => {
    if (
      found => {
        res.render("signup.hbs", { message: "This username is already taken" });
        return;
      }
    )
      return bcrypt
        .genSalt()
        .then(salt => {
          return bcrypt.hash(password, salt);
        })
        .then(hash => {
          return User.create({ username: username, password: hash });
        })
        .then(newUser => {
          req.session.user = newUser;
          res.redirect("/");
        });
  });
});


 

module.exports = router;
