const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const User = require("../models/user");

router.get('/', (req, res) => {
    res.render('index', {
        title: 'Express'
    });
});

router.get("/signup", (req, res) => {
    res.render("auth/signup");
});

router.post('/signup', (req, res) => {
            let username = req.body.username;
            let password = req.body.password;
            if (username === "" || password === "") {
                res.render('auth/signup', {
                    errorMessage: "Field can't be empty"
                })
                return;
    }
    User.findOne({
        username: username
    }, (error, user) => {
        if (error) {
            next(error);
        } else {
            if (!user) {
                var gen = bcrypt.genSaltSync(bcryptSalt);
                var hashPass = bcrypt.hashSync(password, gen);

                var newUser = User({
                    username,
                    password: hashPass
                });
                newUser.save((error) => {
                    if (error) {
                        next(error);
                    } else {
                        res.redirect("/");
                    }
                });
            } else {
                res.render("auth/signup", {
                    errorMessage: "username already taken"
                })
            };
        }
    });
});

router.get("/login", (req, res) => {
    res.render("auth/login");
});

router.post('/login', (req, res) => {
            let username = req.body.username;
            let password = req.body.password;

            if (username === "" || password === "") {
                res.render("auth/login", {
                    errorMessage: "Indicate a username and a password to sign up"
                });
                return;
            }
  User.findOne({username: username}, (err, user)=>{
      if(err){
        next(err);
      } else {
        if (!user){
          res.render("auth/login", {
            errorMessage: "Username doesn't exist sign up"
          });
        } else {
          if (bcrypt.compareSync(password, user.password)) {
            req.session.currentUser = user;
            res.redirect("/");
          } else {
            res.render("auth/login", {
              errorMessage: "Incorrect password"
            });
          }
          console.log('hello233');
          // res.render('hello');
        }
      }
    });

  });



module.exports = router;
