const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');

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
        .catch( err => next(err))

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