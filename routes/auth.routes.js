const { Router } = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const router = Router();
const saltRounds = 10;
const User = require("../models/User.model");
const { Mongoose } = require("mongoose");
const mongoose = require("mongoose")

router.get("/signup", (req,res,next) => res.render("auth/signup"));

router.post("/signup", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password){
        if (password !== /^\S+@\S+\.\S+$/) {
            res.render("auth/signup", {
                validationError: "Please user a valid email adress.",
                errorMessage:
                "All fields are mandatory. Please provide your username, email and password.",
            });
        }
        return;
    }

    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
    res
      .status(500)
      .render('auth/signup',
        username,   
        { errorMessage: '⛔️ Password needs to have at least 6 characters and must contain at least one number, one lowercase and one uppercase letter. ⛔️' });
    return;
    }

    bcrypt
        .hash(password, saltRounds)
        .then((hashedPassword) => 
            User.create({ username, passwordHash: hashedPassword })
                .then((newUser) => {
                  req.session.user = newUser;
                  res.redirect("/user-profile");
                })
                .catch((error) => {
                    if (error instanceof mongoose.Error.ValidationError){
                        res
                            .status(500)
                            .render("auth/signup", { errorMessage: error.message })
                    }  else if (error.code === 11000) {
                        res
                            .status(500)
                            .render("auth/signup", { errorMessage: "Username needs to be unique. The username you entered has already been used"})
                    } else {
                        next(error);
                    }
                })
        )
        .catch((err) => next(err));
        
});

router.get('/user-profile', (req, res) => res.render('users/user-profile', {user: req.session.user}));

router.get("/login", (req, res) => res.render("auth/login"));

router.post('/login', (req, res, next) => {
    const { username, password } = req.body;
   
    if (username === '' || password === '') {
      res.render('auth/login', {
        errorMessage: 'Please enter both, username and password to login.'
      });
      return;
    }
   
    User.findOne({ username })
        .then((user) => {
          if (!user) {
            res.render('auth/login', { errorMessage: 'Username is not registered. Try with other email.' });
            return;
          } else if (bcrypt.compareSync(password, user.passwordHash)) {
            req.session.user = user;
            res.redirect('/user-profile', { user });
          } else {
            res.render('auth/login', { 
              username, 
              errorMessage: 'Incorrect password.' 
            });
          }
        })
        .catch(error => next(error));
  });

  router.get("/logout", (req, res) => {
    res.redirect("/");
  });

  router.post("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
  });

module.exports = router;
