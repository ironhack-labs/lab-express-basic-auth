const express = require('express');
const router = express.Router();
const path = require('path');
const debug = require('debug')(`m2-0118-basic-auth:${path.basename(__filename).split('.')[0]}`);
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const User = require('../models/User');

//signup
router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;
  // debug(req.body);
 
  

  if (username === "" || password === "") {
    res.render("auth/signup", {

      errorMessage: "Indicate a username and a password to sign up",
     
    },
  );
   
    return;
  }

  User.findOne({ "username": username }).exec()
    .then(user => {
      if (user) {
        res.render("auth/signup", {
          errorMessage: "The username already exists"
        });
      }
    })
    .then(() =>{
      // Hash the password
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass
      });

      newUser.save()
        .then(() => {
          console.log(errorMessage);
          debug(`Se ha creado el usuario ${username}`);
          res.redirect("/")
        })
        .catch(e => next(e))
    });
});
//login usuario
router.get('/login', (req, res, next) => {
  res.render('auth/login', { title: "Login" });
});

router.post("/login", (req, res, next) => {
  const {username,password} = req.body;

  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": username }, (err, user) => {
      if (err || !user) {
        res.render("auth/login", {
          errorMessage: "The username doesn't exist"
        });
        return;
      }
      
      if (bcrypt.compareSync(password, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        console.log(req);
        debug(`${user.username} is now logged in`);
        res.redirect("/");
      } else {
        res.render("auth/login", {
          errorMessage: "Incorrect password"
        });
      }
  });
});





module.exports = router;