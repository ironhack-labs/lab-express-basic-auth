const express = require("express");
const router = express.Router();


const User           = require("../models/User");
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;



router.get("/signup", (req, res) => res.render("auth/signup"))


router.post("/signup", (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username.length === 0 || password.length === 0) {
        const data = {errorMsg: 'Please fill all the fields'}
        res.render('auth/signup', data)
        return
    }

    User.findOne({ "username": username })
        .then(user => {
            if (user !== null) {
                res.render("auth/signup", {
                    errorMsg: "The username already exists!"
                })
            return
        }

        const salt     = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(password, salt);

        User.create({username, password: hashPass})
            .then(()        => res.redirect("/"))
            .catch(error    => console.log(error))
    })
})





router.get("/login", (req, res, next) => res.render("auth/login"))

router.post("/login", (req, res, next) => {
    const theUsername = req.body.username;
    const thePassword = req.body.password;

    if (theUsername === "" || thePassword === "") {
        res.render("auth/login", {
            errorMsg: "Please enter both, username and password to sign up."
        });
        return;
    }
    
  
    User.findOne({ "username": theUsername })
    .then(user => {
        if (!user) {
          res.render("auth/login", {
            errorMsg: "The username doesn't exist."
          })
          return
        }
        if (bcrypt.compareSync(thePassword, user.password)) {
          req.session.currentUser = user;
          res.redirect("/main");
        } else {
          res.render("auth/login", {
            errorMsg: "Incorrect password"
          });
        }
    })
    .catch(error => next(error))
  });



  router.get("/logout", (req, res, next) => {
    req.session.destroy((err) => {
      res.redirect("/login");
    });
  });


module.exports = router;