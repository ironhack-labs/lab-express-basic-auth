const express = require(`express`);
const router = express.Router();

const mongoose = require(`mongoose`);

const bcryptjs = require(`bcryptjs`);

const User = require(`../models/User.model`);

const saltRounds = 10;

router.get(`/signup`, (req,res,next) => {
    res.render(`auth/sign-up`);
});


router.post(`/entered`, (req,res,next) => {
    const { username, userPassword } = req.body;

    bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(userPassword, salt))
    .then((hashedPassword) => {
        console.log(hashedPassword)
        return User.create({username, password: hashedPassword })
    })
    .then((usersDB) => {
        console.log(usersDB);
    })
    .catch(err => {
        console.log(`error due to ${err}`);
    });
});

router.get(`/login`, (req,res,next) => {
    res.render(`auth/login`);
});

router.post(`/login`, (req,res,next) => {
    const { username, password } = req.body;

    if (username === `` || password === ``) {
        res.render(`auth/login`, {
            errorMessage: `Please enter username and password to login.`
        });
        return;
    }

    User.findOne({ username })
    .then(foundUser => {
        if (!foundUser) {
            res.render(`auth/login`, { 
                errorMessage: `No user has been found. Try again`
            });
            return;
        } else if (bcryptjs.compareSync(password, foundUser.password)) {
            // res.render(`users/user-profile`, { foundUser });

            req.session.currentUser = foundUser;
            res.redirect(`/userProfile`);
        } else {
            res.render(`auth/login`, { errorMessage: `Password is incorrect!`});
        }
    })
    .catch(error => {
        console.log(`error logging in due to ${error}`);
    });
});


router.get(`/userProfile`, (req,res,next) => {
    res.render(`users/user-profile`, { userInSession: req.session.currentUser });
});




module.exports = router;



