const express = require('express');
const router  = express.Router();

const User = require("../models/user");
const bcrypt = require('bcryptjs');
const bcryptSalt = 10;


router.get('/signup', (req, res, next) => {
    res.render('auth/signup');
  });
  
router.post('/signup',  (req, res, next) => {
    console.log("post: /signup");
    const username = req.body.username;
    const password = req.body.password;
    

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    User.findOne({"username": username})
    .then(user => {
        if(user) {
            res.render("auth/signup", {
                errorMessage: "The Username allready exists. Try another one!"
            });
            return;
        }

    User.create({
        username,
        password: hashPass
    })
    .then(() => {
        res.redirect("/");
    })
    .catch(error => {
        console.log(error);
    });
}) 
})


router.get('/login', (req, res, next) => {
    res.render('auth/login');
});

router.post('/login', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({"username": username})
    .then(user => {
        if(!user) {
            res.render("auth/login", {
                errorMessage: "The username doesn't exist. Please check spelling or sign up!"
            })
            return;
        }
        if (bcrypt.compareSync(password, user.password)){
            //save the login in the session
            req.session.currentUser = user;
            res.redirect("/");
        }else {
            res.render("auth/login", {
                errorMessage: "Incorrect Password"
            });
        };
    })
    .catch(error => {
        next(error);
    })
});

module.exports = router;
  