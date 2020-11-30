const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');
const mongoose  = require('mongoose');

const router = express.Router();
const saltRounds = 10;

//###############################################################

//                        SIGNUP

//##############################################################

router.get('/signup', (req, res) => {
    res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
    
    const {username, email, password} = req.body;

    // if (!username || !email || !password) {
    //     res.render("auth/signup", {errorMessage: "Username, Email and Password are mandatory. Please check all the fields"});
    //     return;
    // }

    let emailRegex = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
    if (!emailRegex.test(email)) {
        res.status(500).render("auth/signup", {errorMessage: "Please, enter a valid email"});
        return;
    }

    let passwordRegex = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/);
    if (!passwordRegex.test(password)) {
      res.status(500).render('auth/signup', {errorMessage: 'Password must have one lowercase, one uppercase, a number, a special character and must be at least 8 digits long'})
      return;
    }

    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(password, salt))
        .then(hashedPassword => {
            return User.create({
                username,
                email,
                password: hashedPassword
            })
        })
        .then(userFromDB => {
            console.log("new user: ", userFromDB);
            res.redirect("/userProfile")
        })
        .catch( err => {
            if (err instanceof mongoose.Error.ValidationError ) {
                res.status(500).render("auth/signup", { errorMessage: err.message });
            } else if (err.code === 11000) {
                res.status(500).render("auth/signup", {
                    errorMessage: "Username and email need to be unique. Please, check it again."
                });
            } else {
                next(err);
            }
        })

});

//###############################################################

//                        LOGIN

//##############################################################

router.get("/login", (req, res, next) => {
    res.render("auth/login");
});

router.post("/login", (req, res, next) => {
    console.log('session:', req.session);
    const {email, password} = req.body

    if (email === '' || password === '') {
        res.render('auth/login', 
        {
            errorMessage: 'Dude, you need to enter BOTH, email AND password'
        });
        return;
    }

    User.findOne({email})
    .then(
        userFromDB => {
            if(!userFromDB) {
                res.render('auth/login', {
                    errorMessage: "This email is not registered. Please double(triple) check =)"
                });
            } else if (bcrypt.compareSync(password, userFromDB.password)) {
                req.session.currentUser = userFromDB;
                res.redirect('/userProfile');
            } else {
                res.render("auth/login", {errorMessage: "Wrong password!"});
            }
        }
    )
    .catch(err => next(err));
});



//###############################################################

//                        LOGOUT

//##############################################################

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
  });

//###############################################################

//                        USER PROFILE

//##############################################################

router.get("/userProfile", (req,res,next) => {
    console.log(req.session.currentUser)
    res.render('users/user-profile', {userInSession: req.session.currentUser});
})

module.exports = router;